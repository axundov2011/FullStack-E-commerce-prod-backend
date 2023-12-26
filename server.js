const express = require("express");
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express();
const cors = require("cors")
const logger = require("morgan");
const mainRoute = require("./routes/index.js");
const authMiddleware = require("./routes/authMiddleware.js")
const port = 5000;

dotenv.config();

//Mongo db ye qosulma
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error;
    }
}

//CORS Konfigürasyonu:
//cors modülünü kullanırken, CORS politikalarını daha esnek bir şekilde ayarlamak için aşağıdaki gibi bir konfigürasyon yapabilirsiniz:
// const corsOptions = {
//     origin: "http://localhost:5173",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
//     allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
//     preflightContinue: false,
//     maxAge: 3600,
//   };
//middlewares
//middlewares metodu ile json formatinda gelen datani js gore bilsin deye
//express.json() usulu ile "parse"edirik. 
//Misal logum hansidir, hansi statusduru gosterir
app.use(logger("dev"));
app.use(express.json());
app.use("/api", mainRoute);
app.use(cors()); // Bunu paketi ona gore use edirik ki front terefde secruty cors problemi yaranmasin

//

app.listen(port, () => {
    connect();
    console.log(`Sunucu ${port} Portunda calisiyor`);
});

