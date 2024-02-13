
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv")// server.js içerisinnen götürürük bunu
dotenv.config();


//env dosyasinnan stripe sifresini aliriq
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.post("/", async (req, res) => {
    const {products, user, cargoFee} = req.body;
 //Burada yeni bir array olusduracagiq. Her urunu gezerek mapla edirik
    //Burada  deyirik ki senin iki objectin olacaq.
    const lineItems = products.map((product) => {
        console.log("Product Name:", product.name);
        console.log("Product Price:", product.price);
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                },
                unit_amount: Math.round(product.price.current * 100),
            },
            quantity: product.quantity
        }
    });
    try {
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            payment_method_types:["card"],
            line_items: lineItems,
            mode:"payment",
            success_url: `${process.env.CLIENT_DOMAIN}/success`
        })
        
        res.status(200).json({id: session.id});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
});



module.exports = router;
