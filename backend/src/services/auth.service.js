const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userRepository = require("../repositories/user.repository");
const otpService = require("./otp.service");
const refreshTokenService = require("./refreshToken.service");
const passwordResetService = require("./passwordReset.service");

const { sendOtpEmail } = require("../utils/email");
const ApiError = require("../utils/ApiError");

/**
 * Register User
 */
const registerUser = async (userData) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const existingUser = await userRepository.findUserByEmail(
            userData.email
        );

        if (existingUser) {
            throw new ApiError(
                409,
                "Email already exists"
            );
        }

        const hashedPassword = await bcrypt.hash(
            userData.password,
            10
        );

        userData.password = hashedPassword;

        const user = await userRepository.createUser(
            userData,
            session
        );

        const otp = await otpService.createOtp(
            user.email,
            session
        );

        await session.commitTransaction();
        session.endSession();

        await sendOtpEmail(
            user.email,
            otp
        );

        return {
            email: user.email,
        };

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        throw error;
    }
};

/**
 * Login User
 */
const loginUser = async (loginData) => {

    const user = await userRepository.findUserByEmailWithPassword(
        loginData.email
    );

    if (!user) {
        throw new ApiError(
            401,
            "Invalid Email or Password"
        );
    }

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Your account has been deactivated."
        );
    }

    if (!user.isVerified) {
        throw new ApiError(
            403,
            "Please verify your email before logging in."
        );
    }

    const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid Email or Password"
        );
    }

    await userRepository.updateLastLogin(
        user._id
    );

    const tokens =
        await refreshTokenService.generateTokens(user);

    return {

        accessToken: tokens.accessToken,

        refreshToken: tokens.refreshToken,

        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
    };
};

/**
 * Logout User
 */
const logoutUser = async (refreshToken) => {

    return await refreshTokenService.logout(
        refreshToken
    );
};

/**
 * Refresh Access Token
 */
const refreshAccessToken = async (refreshToken) => {

    return await refreshTokenService.refreshAccessToken(
        refreshToken
    );
};

/**
 * Resend OTP
 */
const resendOtp = async (email) => {

    return await otpService.resendOtp(
        email
    );
};

/**
 * Forgot Password
 */
const forgotPassword = async (email) => {

    return await passwordResetService.forgotPassword(
        email
    );
};

/**
 * Reset Password
 */
const resetPassword = async (
    token,
    newPassword
) => {

    return await passwordResetService.resetPassword(
        token,
        newPassword
    );
};

module.exports = {

    registerUser,

    loginUser,

    logoutUser,

    refreshAccessToken,

    resendOtp,

    forgotPassword,

    resetPassword,

};