const express = require("express");
const router = express.Router();
const Category = require("../modal/User");
const User = require("../modal/User");

//Tum kategorileri getirme (Read - All)
router.get("/", async (req, res) => {
    try {
        const users = await User.find() //Bu mongoosen ozelliyidir. Ne var category de hamisin getirir

        res.status(200).json(users)// Bu ise gonderilen datanin duzgunluyunun statusudur (front terefe gonderilir)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
});


// Kategori silme (Delete - )
router.delete("/:email", async(req, res) => {
    try {
       const email = req.params.email;
       const deletedUser = await User.findOneAndDelete(email);//Yeni mongoose guncellemesine gore findByIdAndRemove yox findByIdAndDelete yazacaqsan
   
       if(!deletedUser){
           return res.status(404).json({error: "User not found"})
       }
   
       res.status(200).json(deletedUser);
    } catch (error) {
       console.log(error);
       res.status(500).json({ error: "Server error!" })
    }
   });
  module.exports = router;