const express = require("express");
const router = express.Router();
const Category = require("../modal/Category.js")

//Yeni bir kategori olusturma (Create)
router.post('/', async (req, res) => {
    try {
        //istek attigim da verileri nasil yakalamanin yolu
        const { name, img } = req.body
        const newCategory = new Category({ name, img });
        await newCategory.save();

        res.status(201).json(newCategory);
        console.log(name);
        console.log(img);
    } catch (error) {
        console.log(error);
    }
})
//Tum kategorileri getirme (Read - All)
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find() //Bu mongoosen ozelliyidir. Ne var category de hamisin getirir

        res.status(200).json(categories)// Bu ise gonderilen datanin duzgunluyunun statusudur (front terefe gonderilir)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
});


//"Belirli bir kategoriyi getirme  (Read- Single)"
//Meselen postmanda  {{url}}/categories/123456 yazaraq random bir id ni tuturuq yoxlamaq ucun.
//Daha sonra mongodan bize gelen datanin her hansisa bir id sini params olaraq urlye yaziriq
//Daha sonra get metodu ile send ettiyimiz de o idni biz tutmus oluruq
router.get("/:categoryId", async (req, res) => {
    try {
        // console.log(req.params.categoryId);
        // res.status(200).json(req.params.categoryId);
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" })
        }
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
})


//"Kategori guncelleme (Update)"
router.put("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const updates = req.body;

        const existingCategory = await Category.findById(categoryId);
       
        //Burada bir xeta oldugun da fronta gondermek ucun yaziriq ki 
        // eger Category ni findById ile axtaris ederken tapmirsa 404 xetasi gonder
        if(!existingCategory) {
            return res.status(404).json({error: "Category not found"})
        }

        const updateCategory = await Category.findByIdAndUpdate(
            categoryId, 
            updates,
            {new: true} // Bura new: true yazsaq artiq guncellenmis deyeri gonderecek
        ); //findByIdAndUpdate mongosundur. Bir id ye gore bulup sonra degistiriyoruz

        res.status(200).json(updateCategory);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error!" })
    }
});

// Kategori silme (Delete - )
router.delete("/:categoryId", async(req, res) => {
 try {
    const categoryId = req.params.categoryId;
    const deletedCategoryId = await Category.findByIdAndDelete(categoryId);//Yeni mongoose guncellemesine gore findByIdAndRemove yox findByIdAndDelete yazacaqsan

    if(!deletedCategoryId){
        return res.status(404).json({error: "Category not found"})
    }

    res.status(200).json(deletedCategoryId);
 } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error!" })
 }
});
module.exports = router;