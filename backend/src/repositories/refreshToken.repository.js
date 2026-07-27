const RefreshToken = require("../models/refreshToken.model");

const createRefreshToken = async (tokenData) => {
    return await RefreshToken.create(tokenData);
};

const findRefreshToken = async (token) => {
    return await RefreshToken.findOne({ token });
};

const deleteRefreshToken = async (token) => {
    return await RefreshToken.deleteOne({ token });
};

const deleteUserRefreshTokens = async (userId) => {
    return await RefreshToken.deleteMany({
        user: userId,
    });
};

module.exports = {
    createRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    deleteUserRefreshTokens,
};