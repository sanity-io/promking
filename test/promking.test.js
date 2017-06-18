/* eslint-disable id-length, max-nested-callbacks */
const {describe, it, beforeEach, afterEach} = require('mocha')
const assert = require('assert')
const got = require('got')
const Hapi = require('hapi')
const express = require('express')
const request = require('supertest')
const promking = require('../src')

const hasIndexHit = req => {
  const lines = req.body || ''
  return lines.split('\n').some(line =>
    line.indexOf('http_requests_total{route="/",code="200",method="get"} ') !== -1
  )
}

describe('promking', () => {
  const metricsUrl = 'http://localhost:39144/metrics'
  let metricServer

  beforeEach(done => {
    metricServer = promking.summaryServer({port: 39144}, done)
  })

  afterEach(done => metricServer.close(done))

  it('should be able to mount express middleware', done => {
    const app = express()
    app.use(promking.express(app))

    assert(app.locals.prometheus, 'server should expose prometheus client')

    app.get('/', (req, res) => res.send('Hello world'))

    request(app).get('/').expect('Hello world', () => {
      got(metricsUrl).then(res => {
        hasIndexHit(res)
        done()
      }, done)
    })
  })

  it('should be able to load hapi plugin', done => {
    const server = new Hapi.Server()
    server.connection({port: 34876})
    server.register(promking.hapi())

    assert(server.prometheus, 'server should expose prometheus client')

    server.route({method: 'GET', path: '/', handler: (req, reply) => reply('Hello world')})

    server.inject('/')
      .then(res => assert.equal(res.result, 'Hello world'))
      .then(() => got(metricsUrl))
      .then(res => assert(hasIndexHit(res), 'should have hit on /'))
      .then(done)
      .catch(done)
  })
})
