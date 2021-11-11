require('dotenv').config();
module.exports = {
    DEBUG: process.env.MODE == "development",
    SECRET_JWT_CODE: process.env.SECRET_JWT_CODE,
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || "4000",
    CORS_CLIENT_ORIGINE: process.env.CORS_CLIENT_ORIGINE || "http://localhost:8080"
}