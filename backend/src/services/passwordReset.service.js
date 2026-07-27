const crypto = require("crypto");
const bcrypt = require("bcrypt");

const passwordResetRepository = require("../repositories/passwordReset.repository");
const userRepository = require("../repositories/user.repository");

const ApiError = require("../utils/ApiError");

const { sendResetPasswordEmail } = require("../utils/email");

const forgotPassword = async (email) => {

    const user =
        await userRepository.findUserByEmail(email);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    await passwordResetRepository.deleteResetTokenByEmail(email);

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await passwordResetRepository.createResetToken({
        email,
        token,
        expiresAt,
    });

    await sendResetPasswordEmail(
        email,
        token
    );

    return {
        message:
            "Password reset link has been sent."
    };
};

const resetPassword = async (
    token,
    password
) => {

    const resetToken =
        await passwordResetRepository.findResetToken(token);

    if (!resetToken) {
        throw new ApiError(
            400,
            "Invalid Reset Token"
        );
    }

    if (resetToken.expiresAt < new Date()) {
        throw new ApiError(
            400,
            "Reset Token Expired"
        );
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const user =
        await userRepository.findUserByEmail(
            resetToken.email
        );

    user.password = hashedPassword;

    await user.save();

    await passwordResetRepository.deleteResetToken(
        token
    );

    return {
        message:
            "Password Reset Successfully"
    };
};

module.exports = {
    forgotPassword,
    resetPassword,
};