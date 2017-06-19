# promking

Prometheus HTTP instrumentation for Express/Hapi. Attempts to mimic the official Prometheus Go client in terms of metrics.

## Installation

```
npm install --save promking
```

## Usage (express)

```js
const promking = require('promking')
const expressApp = require('./your-app')

// Note: This should be done BEFORE other routes
// Pass 'app' as middleware parameter to additionally expose Prometheus under 'app.locals'
expressApp.use(promking.express(app))

// Optional: Add custom Prometheus metrics
const counter = new app.locals.prometheus.Counter({ name: 'metric_name', help: 'metric_help' })
counter.inc()

// Set up a metrics summary delivering server on given port
const summaryServer = promking.summaryServer({port: 1234})
```

## Usage (hapi)

```js
const promking = require('promking')
const hapiApp = require('./your-hapi-app')

hapiApp.register(promking.hapi())

const counter = new hapiApp.prometheus.Counter({ name: 'metric_name', help: 'metric_help' })
counter.inc()

// Set up a metrics summary delivering server on given port
const summaryServer = promking.summaryServer({port: 1234})
```

## License

MIT-licensed. See LICENSE.
