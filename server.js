const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51QQ5xkHVwyufjuifu2AT7r8W89X6N07QvhnEcD9ZWZMb0ye9xhoDwMrsxsL4RIS2TTrNka74fHu5H3d9hubP5xuX00H1BTOHGd'); // Replace with your secret key

const app = express();
const endpointSecret = 'whsec_XXXXXXXX';  // Replace with the secret from Stripe CLI

// This is the raw body parser needed to correctly verify the webhook signature
app.use(bodyParser.raw({ type: 'application/json' }));

// Webhook endpoint to listen for events
app.post('/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Checkout Session completed:', session);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        // Acknowledge receipt of the event
        res.status(200).send('Event received');
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// Start your server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
