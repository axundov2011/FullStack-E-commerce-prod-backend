const express = require("express");
const router = express.Router();
const User = require("../modal/User.js");
const bcrypt = require("bcrypt"); // Sifreni sifelemek
const jwtToken = require("jsonwebtoken");
// const authMiddleware = require("./authMiddleware.js")
// Bir degiskenin bir kere burda olustugu anda  asagida her zaman ("avatar:defaultAvatar") ayni sayiyi bize vere bilir
// Bizim amacimiz her istekde random  bir gorsel, sayi olusturmasi gerekiyor. 
const generateRandomAvatar = () => {
    const randomAvatar = Math.floor(Math.random() * 71);
    return `https://i.pravatar.cc/300?img-${randomAvatar}`;
};

// istifadeci olusturma (Create - Register)
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const defaultAvatar = generateRandomAvatar();

        // Bu funksiyada biz eyni istifadecini birden cox yaratmagin qarsisini aliriq
        // Deyirik ki get yarattigim existingUserin icerisini findOne() metodu ile Userin icerisinde emaili axtar
        // Eger email varsa yani register olunubsa mene 400 status ile xeta qaytar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email addres is already register" })
        }
        //Bu funksiya bizim registerde yarattigimiz kullanicinin sifresini sifrelemesidir
        //Bunu ona gore edirik ki sifre gozle oxuna bilmesin
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await new User({
            username,
            email,
            password: hashedPassword, // Sifreye hemin "hashedPassword" funksiyani gonderirik 
            avatar: defaultAvatar,
        });

        await newUser.save(); //Bunu yadda saxlamasaq dataBazaya register oldugumuzda melumatimiz dusmeyecek

        /* 
              -  Bir registr etdikden sonra eger hec bir error yoxdursa, biz hash la parolumuzu sifreleye bildik,
              -  Documenti yaratdiq,
              -  Ve dakument yaranandan sonra onu baza dataya otururuk,
              -  Oturdukden sonra jwt tokenle biz butun umumi melumatlarimizi sifreleyeceyik
               */

        const token = jwtToken.sign(
            // Biz  istifadəçi məlumatlarını qaytarmalıyıq bu usulla
            //User melumatlarini jwt vasitesi ile sifreleyirik
            //tokeni sifreleyirik
            {
                _id: newUser._id,
            },
            "secret123", {
            //Burada ise menim tokenimin muddetin yaziriq. Nece muddete qorunacaq misal(srok)
            expiresIn: "30d",
        }
        );
        // passwordHash gorunmesin deye yigisdirma metodu
        const { passwords, ...userData } = newUser._doc


        res.status(201).json({
            ...userData,
            token
        });
        // res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
})



// Kullanici girisi (Login)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // İstifadecini tapmaq lazimdir, daha sonra 
        // mene tap baza data'dan request body emaili
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email" })
        }

        // Eger bizim istifadecilerin melumatlari cagirdigimiz requestle ust uste dusdu ve dogrulandisa
        // O zaman  'bcrypt' muqayise et ki 'compare() ' gonderdiyim iki parametr ki var req.body.password ve user._doc.passwordHash
        // Bu iki parametrli muqayise etdikden sonra eger bir birine beraberdirlerse islesin 
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Eğer birbirine beraber deyillərsə
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" })
        };

        // Token oluştururken newUser yerine user kullanmalısınız.
        const token = jwtToken.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        // passwordHash gorunmesin deye yigisdirma metodu
        const { passwords, ...userData } = user._doc;

        // Token'i ve kullanıcı bilgilerini gönder
        res.status(200).json({
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar: user.avatar,
            token,
            ...userData
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
})

//Update password
router.put("/:userId",  async (req, res) => {
   try {
    const userId  = req.params.userId;
    const updates = req.body;

    const userPassword = await User.findById(userId);
    
    if(!userPassword){
        return res.status(404).json({error: "userId not found"})
    }

    const updateUserPassword = await User.findByIdAndUpdate(
        userId,
        updates,
        {new: true},
    );
    res.status(200).json(updateUserPassword);

   } catch (error) {
    res.status(500).json({ error: "Server error!" })
   }
});

module.exports = router;