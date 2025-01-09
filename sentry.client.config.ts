import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  beforeSend(event) {
    // Add contract address to all events if available
    if (process.env.NEXT_PUBLIC_WRAPPER_ADDRESS) {
      event.tags = {
        ...event.tags,
        contract_address: process.env.NEXT_PUBLIC_WRAPPER_ADDRESS,
      }
    }
    return event
  },
}) 