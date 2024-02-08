//Routeru express.js de insa etmek
// Urun andpoindi etmek


const express = require("express");
const router = express.Router();
const Product = require("../modal/Product.js");

//Yeni bir kategori olusturma (Create)
router.post('/', async (req, res) => {
    try {
        //istek attigim da verileri nasil yakalamanin yolu
        // const product = req.body; // daha qisa yolu asagida new Producta vermek olar
        const newProduct = new Product(req.body);
        await newProduct.save();
       
        res.status(201).json(newProduct);

    } catch (error) {
        console.log(error);
    }
})

//Tum Productları getirme (Read - All)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find() //Bu mongoosen ozelliyidir. Ne var Product de hamisin getirir

        res.status(200).json(products)// Bu ise gonderilen datanin duzgunluyunun statusudur (front terefe gonderilir)
    } catch (error) {
        res.status(500).json({ error: "Server error!" })
    }
});

//"Belirli bir Ürünü getirme  (Read- Single)"
//Meselen postmanda  {{url}}/categories/123456 yazaraq random bir id ni tuturuq yoxlamaq ucun.
//Daha sonra mongodan bize gelen datanin her hansisa bir id sini params olaraq urlye yaziriq
//Daha sonra get metodu ile send ettiyimiz de o idni biz tutmus oluruq
router.get("/:productId", async (req, res) => {
    try {
        // res.status(200).json(req.params.productId);
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        
        if (!product) {
          return res.status(404).json({ error: "Product not found" })
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Server error!" })
    }
})


//"Ürün guncelleme (Update)"
router.put("/:productId", async (req, res) => {
    try {
        const productId = req.params.productId;
        const updates = req.body;

        const existingProduct = await Product.findById(productId);
       
        //Burada bir xeta oldugun da fronta gondermek ucun yaziriq ki 
        // eger Product ni findById ile axtaris ederken tapmirsa 404 xetasi gonder
        if(!existingProduct) {
            return res.status(404).json({error: "Product not found"})
        }

        const updateProduct = await Product.findByIdAndUpdate(
            productId, 
            updates,
            {new: true} // Bura new: true yazsaq artiq guncellenmis deyeri gonderecek
        ); //findByIdAndUpdate mongosundur. Bir id ye gore bulup sonra degistiriyoruz

        res.status(200).json(updateProduct);

    } catch (error) {
        res.status(500).json({ error: "Server error!" })
    }
});


// Kategori silme (Delete - )
router.delete("/:productId", async(req, res) => {
    try {
       const productId = req.params.productId;
       const deletedProductId = await Product.findByIdAndDelete(productId);//Yeni mongoose guncellemesine gore findByIdAndRemove yox findByIdAndDelete yazacaqsan
   
       if(!deletedProductId){
           return res.status(404).json({error: "Product not found"})
       }
   
       res.status(200).json(deletedProductId);
    } catch (error) {
       res.status(500).json({ error: "Server error!" })
    }
   });

  //Ürünleri ada göre arama
 router.get("/search/:productName",async(req, res) => {
    try {
        const productName = req.params.productName;
        const products = await Product.find({
            name: {$regex: productName, $options: "i"} // Burada ki "i" yani deyirem ki boyuk kicik ferq olmadan axtarma ede bilsin
        });

        res.status(200).json(products); //tapdigimiz deyeride buradan gonderirik
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
 }) 
  

module.exports = router;

