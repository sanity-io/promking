# promking

Prometheus HTTP instrumentation for Express/Hapi. Attempts to mimic the official Prometheus Go client in terms of metrics.

## Installation

```
npm install promking
```

## Usage (express)

```js
const promking = require('promking')
const expressApp = require('./your-app')

// Note: This should be done BEFORE other routes
expressApp.use(promking.express())
```

## Usage (hapi)

```js
const promking = require('promking')
const hapiApp = require('./your-hapi-app')

hapiApp.register(promking.hapi())
```

## License

MIT-licensed. See LICENSE.
