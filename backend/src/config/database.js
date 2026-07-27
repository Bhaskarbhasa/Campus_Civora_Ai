const mongoose = require("mongoose");
const config = require("./env");

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.mongoUri);

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ Database Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;