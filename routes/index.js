const express = require("express");
const router = express.Router();
const cors = require('cors')
//Diger rota dosyalarini ice aktariyoruz
const categoryRoute = require('./categories.js');
const authRoute = require('./auth.js')
const productRoute = require('./products.js');
const couponRoute = require('./coupons.js');
const userRoute = require('./users.js');
const paymentRoute = require('./payment.js');

router.use(cors());

//Her rotayi yol altinda kullaniyoruz
router.use("/categories", categoryRoute);
router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/coupons", couponRoute);
router.use("/users", userRoute);
router.use("/payment", paymentRoute);

module.exports = router;
