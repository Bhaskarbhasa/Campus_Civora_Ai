const PasswordReset = require("../models/passwordReset.model");

const createResetToken = async (data) => {
    return await PasswordReset.create(data);
};

const findResetToken = async (token) => {
    return await PasswordReset.findOne({ token });
};

const findResetTokenByEmail = async (email) => {
    return await PasswordReset.findOne({ email });
};

const deleteResetToken = async (token) => {
    return await PasswordReset.deleteOne({ token });
};

const deleteResetTokenByEmail = async (email) => {
    return await PasswordReset.deleteOne({ email });
};

module.exports = {
    createResetToken,
    findResetToken,
    findResetTokenByEmail,
    deleteResetToken,
    deleteResetTokenByEmail,
};