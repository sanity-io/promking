/* eslint-disable id-length, max-nested-callbacks */
const {describe, it} = require('mocha')
const assert = require('assert')
const Hapi = require('hapi')
const express = require('express')
const request = require('supertest')
const promking = require('../src')

const hasIndexHit = lines => {
  return lines.split('\n').indexOf('http_requests_total{route="/",code="200",method="get"} 1') !== -1
}

describe('promking', () => {
  it('should be able to mount express middleware', done => {
    const app = express()
    app.get('/', (req, res) => res.send('Hello world'))
    app.use(promking.express())
    request(app).get('/').expect('Hello world', () => {
      request(app).get('/metrics').end((err, res) => {
        hasIndexHit(res.text || '')
        done(err)
      })
    })
  })

  it('should be able to load hapi plugin', done => {
    const server = new Hapi.Server()
    server.connection({port: 34876})
    server.register(promking.hapi())
    server.route({method: 'GET', path: '/', handler: (req, reply) => reply('Hello world')})

    server.inject('/')
      .then(res => assert.equal(res.result, 'Hello world'))
      .then(() => server.inject('/metrics'))
      .then(res => assert(hasIndexHit(res.result), 'should have hit on /'))
      .then(done)
      .catch(done)
  })
})
