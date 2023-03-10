const express = require("express");
const cors = require("cors");


const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));


const stripe = require("stripe")("sk_test_51Mk5uWSJ0f40RIC0pNmbhbQTnQJ3KchbNW0UKMk476l44xk0EMNKi9ErOElE7gZJHvSmou8O3VyvUYJoQR5ksbUl005PtLoyvY");

app.post("/checkout", async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            shipping_address_collection: { allowed_countries: ['US', 'CA'] },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 0, currency: 'usd' },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 5 },
                            maximum: { unit: 'business_day', value: 7 },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 15, currency: 'usd' },
                        display_name: 'Next Day Air',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 1 },
                            maximum: { unit: 'business_day', value: 2 },
                        },
                    },
                },
            ],
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images:[item.product]
                    },
                    unit_amount: item.price * 100,
                    tax_behavior: 'exclusive',
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            'success_url': 'http://localhost:4242/success.html',
            'cancel_url': 'http://localhost:4242/cancel.html',
        })
        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
});

app.listen(4242, () => { 
    console.log(`app is running on 4242...`);
})