const mongoose = require("mongoose");



//Mongo uzerinden Schema ozelligini aldik
// Dedik ki benim kategorimin bir type name ve img var,
//
//Men eger bunlari girersem veri tabanim da kategorysine girdim eger img girmezsem bana hata firlatmasi lazim
const CouponSchema = mongoose.Schema(
    {
    code: {type: String, required: true}, //Burada cupon kodu yaziriq.
    discountPercent: {type: Number, required: true}, // Burada  Cuponun kodunun endirim yuzdesini yazacagiq(Indirim orani)
   },
 {timestamps: true}// sececeyimiz urunun tarihini yazdiriyoruz

);

const Coupon = mongoose.model("Coupon", CouponSchema);

module.exports = Coupon;