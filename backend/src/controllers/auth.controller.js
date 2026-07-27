const authService = require("../services/auth.service");
const otpService = require("../services/otp.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Register User
 */
const register = asyncHandler(async (req, res) => {

    const result = await authService.registerUser(
        req.body
    );

    return res.status(201).json(

        new ApiResponse(

            201,

            "Registration successful. Please verify your email using the OTP sent to your inbox.",

            result

        )

    );

});

/**
 * Login User
 */
const login = asyncHandler(async (req, res) => {

    const result = await authService.loginUser(
        req.body
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Login Successful",

            result

        )

    );

});

/**
 * Verify OTP
 */
const verifyOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    const result = await otpService.verifyOtp(
        email,
        otp
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            result.message,

            null

        )

    );

});

/**
 * Resend OTP
 */
const resendOtp = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const result = await authService.resendOtp(
        email
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            result.message,

            null

        )

    );

});

/**
 * Refresh Access Token
 */
const refreshToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(
        refreshToken
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Access token generated successfully.",

            result

        )

    );

});

/**
 * Logout User
 */
const logout = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    const result = await authService.logoutUser(
        refreshToken
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            result.message,

            null

        )

    );

});

/**
 * Forgot Password
 */
const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const result = await authService.forgotPassword(
        email
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            result.message,

            null

        )

    );

});

/**
 * Reset Password
 */
const resetPassword = asyncHandler(async (req, res) => {

    const { token, newPassword } = req.body;

    const result = await authService.resetPassword(
        token,
        newPassword
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            result.message,

            null

        )

    );

});

module.exports = {

    register,

    login,

    verifyOtp,

    resendOtp,

    refreshToken,

    logout,

    forgotPassword,

    resetPassword,

};