const http = require('http')
const metrics = require('./metrics')

module.exports = (options, cb) => {
  const port = options.port || 7788
  const host = options.hostname || '0.0.0.0'

  return http.createServer((req, res) => {
    res.writeHead(200, 'OK', {'content-type': 'text/plain'})
    res.end(metrics.summary())
  }).listen(port, host, cb)
}
