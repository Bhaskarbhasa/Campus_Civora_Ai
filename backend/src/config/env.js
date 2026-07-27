const dotenv = require("dotenv");

dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",

    mongoUri: process.env.MONGODB_URI,

    jwtSecret: process.env.JWT_SECRET,

    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,

    // Frontend URL
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

module.exports = config;