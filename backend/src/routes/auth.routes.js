const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const {
    registerValidation,
    loginValidation,
    verifyOtpValidation,
    resendOtpValidation,
    refreshTokenValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    validate,
} = require("../validations/auth.validation");

/**
 * Register
 */
router.post(
    "/register",
    registerValidation,
    validate,
    authController.register
);

/**
 * Login
 */
router.post(
    "/login",
    loginValidation,
    validate,
    authController.login
);

/**
 * Verify OTP
 */
router.post(
    "/verify-otp",
    verifyOtpValidation,
    validate,
    authController.verifyOtp
);

/**
 * Resend OTP
 */
router.post(
    "/resend-otp",
    resendOtpValidation,
    validate,
    authController.resendOtp
);

/**
 * Refresh Access Token
 */
router.post(
    "/refresh-token",
    refreshTokenValidation,
    validate,
    authController.refreshToken
);

/**
 * Logout
 */
router.post(
    "/logout",
    refreshTokenValidation,
    validate,
    authController.logout
);

/**
 * Forgot Password
 */
router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validate,
    authController.forgotPassword
);

/**
 * Reset Password
 */
router.post(
    "/reset-password",
    resetPasswordValidation,
    validate,
    authController.resetPassword
);

module.exports = router;