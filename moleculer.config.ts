import '@moleculer/lab';
import { BrokerOptions, Errors } from 'moleculer';

const enableApm = Number(process.env.MOLECULER_APM_ENABLE) === 1;

const Config: BrokerOptions = {
  // Number of milliseconds to wait before reject a request with a RequestTimeout error. Disabled: 0
  requestTimeout: 60 * 1000,

  metrics: {
    enabled: enableApm,
    reporter: 'Laboratory',
  },
  tracing: {
    enabled: enableApm || process.env.NODE_ENV !== 'production',
    exporter: enableApm ? 'Laboratory' : 'Console',
  },
  logger: enableApm ? [{ type: 'Console' }, { type: 'Laboratory' }] : true,

  // Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
  circuitBreaker: {
    // Enable feature
    enabled: false,
    // Threshold value. 0.5 means that 50% should be failed for tripping.
    threshold: 0.7,
    // Minimum request count. Below it, CB does not trip.
    minRequestCount: 20,
    // Number of seconds for time window.
    windowTime: 60,
    // Number of milliseconds to switch from open to half-open state
    halfOpenTime: 10 * 1000,
    // A function to check failed requests.
    check: (err: Errors.MoleculerRetryableError) => err && err.code >= 500,
  },
};

export default Config;
