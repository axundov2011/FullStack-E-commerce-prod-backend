const express = require("express");
const router = express.Router();
const Coupon = require("../modal/Coupon.js");

//Yeni bir Kupon olusturma (Create)
router.post("/", async (req, res) => {
    try {
        const { code } = req.body;

        const existingCoupon = await Coupon.findOne({ code });
        //Burada deyirem ki gir findOne ile Couponin icine eger eyni cuponu birden cox yaradirsa sert qoy ki 
        //- eger birden cox eyni nomrede kupon yaradirsa qarisini al ve 400 error qaytar
        if (existingCoupon) {
            return res.status(400).json({ error: "This coupon is alread exists." });
        }
        const newCoupon = new Coupon(req.body);
        await newCoupon.save();

        res.status(201).json(newCoupon);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error." });
    }
});




//Tum Kuponlari getirme (Read - All)
router.get("/", async (req, res) => {
    try {
        const coupons = await Coupon.find() //Bu mongoosen ozelliyidir. Ne var category de hamisin getirir

        res.status(200).json(coupons)// Bu ise gonderilen datanin duzgunluyunun statusudur (front terefe gonderilir)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
});


//"Belirli bir kategoriyi getirme  (Read- Single by coupon ID)"
//Meselen postmanda  {{url}}/categories/123456 yazaraq random bir id ni tuturuq yoxlamaq ucun.
//Daha sonra mongodan bize gelen datanin her hansisa bir id sini params olaraq urlye yaziriq
//Daha sonra get metodu ile send ettiyimiz de o idni biz tutmus oluruq
router.get("/:couponId", async (req, res) => {
    try {
        // console.log(req.params.categoryId);
        // res.status(200).json(req.params.categoryId);
        const couponId = req.params.couponId;
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        res.status(200).json(coupon);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    };
});

//"Belirli bir kategoriyi getirme  (Read- Single by coupon Code)"
router.get("/code/:couponCode", async (req, res) => {
    try {
        // console.log(req.params.categoryId);
        // res.status(200).json(req.params.categoryId);
        const couponCode = req.params.couponCode;
        const coupon = await Coupon.findOne({ code: couponCode }); // ID ye gore yox basqa bir ozelliyine gore axtarma
        if (!coupon) {
            return res.status(404).json({ error: "Coupon not found" })
        }

        const { discountPercent } = coupon;
        res.status(200).json({ discountPercent }); // indirim deyeri
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    };
});


//"Kupon guncelleme (Update)"
router.put("/:couponId", async (req, res) => {
    try {
        const couponId = req.params.couponId;
        const updates = req.body;

        const existingCoupon = await Coupon.findById(couponId);

        //Burada bir xeta oldugun da fronta gondermek ucun yaziriq ki 
        // eger Category ni findById ile axtaris ederken tapmirsa 404 xetasi gonder
        if (!existingCoupon) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updates, { 
            new: true } // Bura new: true yazsaq artiq guncellenmis deyeri gonderecek
        ); //findByIdAndUpdate mongosundur. Bir id ye gore bulup sonra degistiriyoruz

        res.status(200).json(updatedCoupon);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
});


// Kupon silme (Delete)
router.delete("/:couponId", async(req, res) => {
    try {
       const couponId = req.params.couponId;
       const deletedCouponId = await Coupon.findByIdAndDelete(couponId);//Yeni mongoose guncellemesine gore findByIdAndRemove yox findByIdAndDelete yazacaqsan
   
       if(!deletedCouponId){
           return res.status(404).json({error: "Category not found"})
       }
   
       res.status(200).json(deletedCouponId);
    } catch (error) {
       console.log(error);
       res.status(500).json({ error: "Server error!" })
    }
   });



module.exports = router;