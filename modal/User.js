const mongoose = require("mongoose");

//Mongo uzerinden Schema ozelligini aldik
// Dedik ki benim kategorimin bir type name ve img var,
//
//Men eger bunlari girersem veri tabanim da kategorysine girdim eger img girmezsem bana hata firlatmasi lazim
const UserSchema = mongoose.Schema(
    {
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    //istifadecinin rollari
    //default: user - yani ilk olusduruldugu anda her istifadeci user durumunda olacaq
    role: {type: String, default: "user", enum: ["user", "admin",]},
    avatar: {type:String},
},
 {timestamps: true}// sececeyimiz urunun tarihini yazdiriyoruz

);

const User = mongoose.model("User", UserSchema);

module.exports = User;