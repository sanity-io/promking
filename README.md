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
expressApp.use(promking.express())

// Set up a metrics summary delivering server on given port
const summaryServer = promking.summaryServer({port: 1234})
```

## Usage (hapi)

```js
const promking = require('promking')
const hapiApp = require('./your-hapi-app')

hapiApp.register(promking.hapi())

// Set up a metrics summary delivering server on given port
const summaryServer = promking.summaryServer({port: 1234})
```

## License

MIT-licensed. See LICENSE.
