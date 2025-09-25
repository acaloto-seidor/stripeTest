const stripe = require('stripe')('sk_test_51QQ5xkHVwyufjuifu2AT7r8W89X6N07QvhnEcD9ZWZMb0ye9xhoDwMrsxsL4RIS2TTrNka74fHu5H3d9hubP5xuX00H1BTOHGd'); 
async function createPayWhatYouWantPrice() {
  const price = await stripe.prices.create({
    currency: 'usd',
    custom_unit_amount: {
      enabled: true,
      minimum: 500, // Min 5 USD
      maximum: 20000, // Max 200 USD
    },
    product_data: {
      name: 'Donation or Tip',
    },
  });
  console.log('Price ID:', price.id);
  return price.id;
}

async function createCheckoutSession(priceId) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
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
}

(async () => {
  const priceId = await createPayWhatYouWantPrice();
  await createCheckoutSession(priceId);
})();
