const app = require("./app");
const config = require("./config");
const connectDatabase = require("./config/database");

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(config.port, () => {
            console.log(
                `🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`
            );
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();