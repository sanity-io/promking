const pkg = require('../package.json')
const metrics = require('./metrics')

const plugin = {
  register(server, options, next) {
    server.route({
      method: 'GET',
      path: options.url || '/metrics',
      handler: (req, reply) => {
        reply(metrics.summary()).type('text/plain')
      }
    })

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

    return next()
  }
}

plugin.register.attributes = {
  name: pkg.name,
  version: pkg.version
}

module.exports = () => plugin
