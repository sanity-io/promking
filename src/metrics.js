const client = require('prom-client')

const metrics = {
  duration: new client.Summary({
    name: 'http_request_duration_microseconds',
    help: 'The HTTP request latencies in microseconds.',
    labelNames: ['route'],
    percentiles: [0.5, 0.9, 0.99]
  }),
  total: new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests made.',
    labelNames: ['code', 'method', 'route']
  })
}

function us(start) {
  const diff = process.hrtime(start)
  return Math.round(((diff[0] * 1e9) + diff[1]) / 1000)
}

function observe(start, options) {
  const duration = us(start)
  metrics.duration.observe({route: options.route}, duration)
  metrics.total.inc(options, 1)
}

const summary = () => client.register.metrics()

module.exports = {observe, summary}
