import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
//   apiVersion: '2024-06-07',
  appInfo: {
    name: 'WebSaas App',
    version: '0.1.0',
  },
})