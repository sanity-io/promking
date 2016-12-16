const metrics = require('./metrics')

const isMetricPath = /^\/metrics\/?$/

function middleware(req, res, next) {
  if (isMetricPath.test(req.url)) {
    res.header('content-type', 'text/plain')
    return res.send(metrics.summary())
  }

  const start = process.hrtime()
  res.on('finish', () => {
    metrics.observe(start, {
      route: req.route.path.replace(/\?/g, ''),
      code: res.statusCode,
      method: req.method.toLowerCase()
    })
  })

  return next()
}

module.exports = () => middleware
