//  formu yaradarken errorun cixib cixmadigini yoxlayir
const validationResult = require('express-validator');

export default (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    };

        //Eger xeta yoxdursa diger qarsidaki funksiyani islet
    next();
}