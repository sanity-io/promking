const metrics = require('./metrics')

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

module.exports = () => middleware
