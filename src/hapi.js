const pkg = require('../package.json')
const metrics = require('./metrics')
const client = require('prom-client')

const plugin = {
  register(server, options, next) {
    server.ext('onRequest', (request, reply) => {
      request.promking = {start: process.hrtime()}
      return reply.continue()
    })

    server.on('response', req => {
      metrics.observe(req.promking.start, {
        route: req.route.path.replace(/\?/g, ''),
        code: req.response ? req.response.statusCode : 0,
        method: req.method.toLowerCase()
      })
    })


    // Expose prometheus interface as hapi server method
    server.decorate('server', 'prometheus', client)

    return next()
  }
}

plugin.register.attributes = {
  name: pkg.name,
  version: pkg.version
}

module.exports = () => plugin
