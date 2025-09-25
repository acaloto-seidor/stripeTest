const stripe = require('stripe')('');

// Global variables
let priceId = ''; // Normal one-time payment price
let recurringPriceId = ''; // Recurring subscription price
let customerId = ''; // Replace with the actual Customer ID
// Helper function to log information
function logMessage(message) {
  console.log('==========================');
  console.log(message);
  console.log('==========================');
}

// 1. Create a Price object
async function createPrice() {
  try {
    const price = await stripe.prices.create({
      unit_amount: 1500, // Amount in cents
      currency: 'usd',
      product_data: {
        name: 'Sample Product',
      },
    });
    priceId = price.id; // Store the Price ID globally
    logMessage(`Price ID: ${price.id}`);
    console.log(
      'Request ID can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating price:', error);
  }
}

// 2. Create a Checkout Session with an existing Price ID
async function createCheckoutSessionWithPrice() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Checkout Session ID: ${session.id}`);
    console.log(
      'Request ID can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating Checkout Session:', error);
  }
}

// 3. Create a Checkout Session for "Pay What You Want"
async function createPayWhatYouWantPrice() {
  try {
    const price = await stripe.prices.create({
      currency: 'usd',
      custom_unit_amount: {
        enabled: true,
        minimum: 100, // Minimum amount in cents
      },
      product_data: {
        name: 'Donation',
      },
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Pay What You Want - Price ID: ${price.id}`);
    logMessage(`Pay What You Want - Checkout Session ID: ${session.id}`);
    console.log(
      'Request IDs can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating Pay What You Want session:', error);
  }
}

// 4. Create a Subscription Checkout Session
async function createSubscriptionSession() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: recurringPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Subscription Checkout Session ID: ${session.id}`);
    console.log(
      'Request ID for this Checkout Session can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating Subscription Checkout Session:', error);
  }
}

// 5. Create a Free Trial Subscription
async function createFreeTrialSession() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: recurringPriceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Free Trial Subscription Checkout Session ID: ${session.id}`);
    console.log(
      'Request ID for this Free Trial can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating Free Trial Subscription:', error);
  }
}

// 6. Create a Setup Intent for future payments
async function createSetupIntentSession() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      setup_intent_data: {
        metadata: {
          user_id: '12345',
        },
      },
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Setup Intent Checkout Session ID: ${session.id}`);
    console.log(
      'Request ID for this Setup Intent can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating Setup Intent Session:', error);
  }
}

// 7. Redirect to Checkout (Server-side)
async function redirectToCheckoutServer() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Server-Side Redirect Session ID: ${session.id}`);
    console.log(
      'Request ID for this Checkout Session can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating Server-Side Redirect Session:', error);
  }
}
async function createSubscriptionWithMetadata() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: recurringPriceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          customer_id: '12345', // Example custom metadata
          order_id: '67890',
        },
      },
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Subscription with Metadata Session ID: ${session.id}`);
    console.log(
      'Request ID for this session can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating subscription with metadata:', error);
  }
}

async function redirectToCheckoutClientSide() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    console.log('Client-Side Redirect URL:', session.url);
    console.log(
      'Request ID for this Checkout Session can be found in Stripe Dashboard → Developers → Logs.'
    );

    // Client-side redirection would involve using this URL in frontend code.
    // window.location.href = session.url; (frontend implementation)
  } catch (error) {
    console.error('Error creating Client-Side Redirect Session:', error);
  }
}

async function useCheckoutSessionId() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });

    logMessage(`Checkout Session ID: ${session.id}`);
    console.log(
      'Request ID for this session can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error creating Checkout Session with {CHECKOUT_SESSION_ID}:', error);
  }
}
async function createSessionWithExistingCustomer() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId, // Use the existing Customer ID
      line_items: [
        { price: priceId, quantity: 1 }, // Use your one-time price ID
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    console.log('Checkout Session ID:', session.id);

    // Check if last_response exists and log the requestId
    if (session.last_response && session.last_response.requestId) {
      console.log('Request ID:', session.last_response.requestId);
    } else {
      console.log(
        'Request ID not available in response. Check the Stripe Dashboard → Developers → Logs.'
      );
    }
  } catch (error) {
    console.error('Error creating session with existing customer:', error);
  }
}

async function listPaymentMethods() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['eps', 'card'], // Add other methods as needed
      line_items: [
        {
          price_data: {
            currency: 'eur', // Correct currency for EPS
            product_data: { name: 'Test Product' },
            unit_amount: 1500,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    console.log('Checkout Session ID:', session.id);
    console.log(
      'Request ID can be found in Stripe Dashboard → Developers → Logs.'
    );
  } catch (error) {
    console.error('Error listing payment methods:', error);
  }
}

async function createCheckoutWithCustomPaymentMethods() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'], // Specify payment methods
      line_items: [
        {
          price_data: {
            currency: 'eur', // Currency compatible with ideal
            product_data: { name: 'Test Product' },
            unit_amount: 2000, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    console.log('Checkout Session ID:', session.id);

    // Check if last_response exists and log Request ID or manual message
    if (session.last_response && session.last_response.requestId) {
      console.log('Request ID:', session.last_response.requestId);
    } else {
      console.log(
        'Request ID not available in response. Please check the Stripe Dashboard → Developers → Logs.'
      );
    }
  } catch (error) {
    console.error('Error creating session with custom payment methods:', error);
  }
}

async function setupLinkPayment() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['link', 'card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    console.log('Checkout Session ID:', session.id);
    console.log('Request ID can be found in Stripe Dashboard → Developers → Logs.');
  } catch (error) {
    console.error('Error setting up Link:', error);
  }
}


async function createAndExpireSession() {
  try {
    // Step 1: Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Test Product',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    console.log('Checkout Session Created:');
    console.log('Session ID:', session.id);

    // Step 2: Expire the Checkout Session
    const expiredSession = await stripe.checkout.sessions.expire(session.id);
    console.log('Expired Checkout Session ID:', expiredSession.id);

    // Log the Request ID or provide a fallback
    if (expiredSession.last_response && expiredSession.last_response.requestId) {
      console.log('Request ID:', expiredSession.last_response.requestId);
    } else {
      console.log(
        'Request ID not available. Check Stripe Dashboard → Developers → Logs for details.'
      );
    }
  } catch (error) {
    console.error('Error creating or expiring session:', error);
  }
}


async function createSessionWithCustomExpiration() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Expiration Product',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Set expiration time to 1 hour from now
    });

    console.log('Checkout Session Created:');
    console.log('Session ID:', session.id);

    // Log the Request ID or provide a manual fallback
    if (session.last_response && session.last_response.requestId) {
      console.log('Request ID:', session.last_response.requestId);
    } else {
      console.log(
        'Request ID not available. Check Stripe Dashboard → Developers → Logs for details.'
      );
    }
  } catch (error) {
    console.error('Error creating session with custom expiration:', error);
  }
}

// Customize Checkout with locale settings
async function createCheckoutWithLocale() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      locale: 'es', // Spanish locale
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Checkout Session ID with Locale: ${session.id}`);
    console.log('Request ID can be found in Stripe Dashboard → Developers → Logs.');
  } catch (error) {
    console.error('Error creating Checkout Session with locale:', error);
  }
}

// Customize Submit Button using submit_type parameter
async function createCheckoutWithSubmitButton() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      submit_type: 'donate', // Customize the button to say 'Donate'
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    logMessage(`Checkout Session ID with Submit Button: ${session.id}`);
    console.log('Request ID can be found in Stripe Dashboard → Developers → Logs.');
  } catch (error) {
    console.error('Error creating Checkout Session with Submit Button:', error);
  }
}

// Function to create a Checkout Session with a custom domain
async function createCheckoutSessionWithCustomDomain() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      // Use your custom domain for Checkout
      domain: 'https://b8e6-188-171-14-209.ngrok-free.app',
    });

    console.log('Checkout Session ID:', session.id);
    console.log('Request ID for this Checkout Session can be found in Stripe Dashboard → Developers → Logs.');
  } catch (error) {
    console.error('Error creating Checkout Session with custom domain:', error);
  }
}


// Call the function to create the checkout session
createCheckoutSessionWithCustomDomain();




// Uncomment the function you want to test
(async () => {
  // await createPrice();
  // await createCheckoutSessionWithPrice();
  // await createPayWhatYouWantPrice();
  // await createSubscriptionSession();
  // await createFreeTrialSession();
  //await createSetupIntentSession();
//   await redirectToCheckoutServer();
  // await redirectToCheckoutClientSide();
  //await createSubscriptionWithMetadata();
//await listPaymentMethods();
//await createCheckoutWithCustomPaymentMethods();
//await setupLinkPayment();
//await createAndExpireSession();
//await createSessionWithCustomExpiration();
//await createSessionWithExistingCustomer();
//await useCheckoutSessionId();
//await createCheckoutWithLocale();
//await createCheckoutWithSubmitButton();
await createCheckoutSessionWithCustomDomain();
})();
