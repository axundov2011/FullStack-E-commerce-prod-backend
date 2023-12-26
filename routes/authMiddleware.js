// //Bu middleware, geçerli bir kullanıcının varlığını doğrular ve 
// //req.user üzerinden kullanıcı bilgilerini ekler. authMiddleware'yi aşağıdaki gibi oluşturabilirsiniz:
// const jwtToken = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {  
//     try {

//       // Kullanıcıyı req'e ekle
//       req.user = decoded;
  
//       // Eğer güncelleme işlemi kullanıcıya aitse devam et
//       if (req.params.userId === req.user._id) {
//         return next();
//       } else {
//         return res.status(403).json({ error: "Forbidden. You are not authorized to perform this action." });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(401).json({ error: "Token is not valid." });
//     }
//   };
  

// module.exports = authMiddleware;
