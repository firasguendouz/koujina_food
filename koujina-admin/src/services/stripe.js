// src/config/stripe.js

import { loadStripe } from '@stripe/stripe-js';

// Replace 'your-publishable-key-here' with your actual Stripe publishable key
const stripePromise = loadStripe('pk_live_51QErKNHB1dhRPHvL2hFlCxkaJIq5lNozxIRVcAbXxCwYjoa7hpqUBK6EgFuA9s0AWzuHKoS7XjERkA7DHkowdNOv00ejsJPDB8');

export default stripePromise;
