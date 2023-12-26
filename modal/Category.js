const mongoose = require("mongoose");


const ReviewSchema = mongoose.Schema({
    text:{type: String, required: true},
    rating: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} //Object tabanli iliskili veri tabanidir bu. Yani useri iliskilendirdik. Kullanici useri bele iliskilendirecek
})
//Mongo uzerinden Schema ozelligini aldik
// Dedik ki benim kategorimin bir type name ve img var,
//
//Men eger bunlari girersem veri tabanim da kategorysine girdim eger img girmezsem bana hata firlatmasi lazim
const ProductSchema = mongoose.Schema({
    name: {type: String, required: true},
    img: [{type: String, required: true}], // Burada array icerisine almagima sebeb, tipi "string" olan array gele biler
    reviews: [ReviewSchema],
    description: {type: String, required: true},
    colors: [{type: String, required: true}], // Yani rengi girmek zorunlu olacaq
    size: [{type: String, required: true}], // Buda zorunlu olacaq
    price: {
        current: {type:Number, required: true},
        discount: {type: Number},
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
},
 {timestamps: true}// sececeyimiz urunun tarihini yazdiriyoruz

);

const Category = mongoose.model("category", ProductSchema);

module.exports = Category;