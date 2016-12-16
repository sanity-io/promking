const client = require('prom-client')

const metrics = {
  duration: new client.Summary(
    'http_request_duration_microseconds',
    'The HTTP request latencies in microseconds.',
    ['route'],
    {percentiles: [0.5, 0.9, 0.99]}
  ),
  total: new client.Counter(
    'http_requests_total',
    'Total number of HTTP requests made.',
    ['code', 'method', 'route']
  )
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

const summary = client.register.metrics

module.exports = {observe, summary}
