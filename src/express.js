const metrics = require('./metrics')
const client = require('prom-client')

function middleware(req, res, next) {
  const start = process.hrtime()
  res.on('finish', () => {
    metrics.observe(start, {
      route: (req.route ? req.route.path : req.path).replace(/\?/g, ''),
      code: res.statusCode,
      method: req.method.toLowerCase()
    })
  })

  return next()
}

module.exports = app => {
  // Expose prometheus interface as Express app.locals method
  if (app) {
    app.locals.prometheus = client
  }

  return middleware
}
