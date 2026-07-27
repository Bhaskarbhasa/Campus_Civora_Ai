const { body, validationResult } = require("express-validator");

// ==========================
// Register Validation
// ==========================
const registerValidation = [

    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full Name is required")
        .isLength({ min: 3 })
        .withMessage("Full Name must be at least 3 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .matches(/^[a-zA-Z0-9._%+-]+@ch\.students\.amrita\.edu$/)
        .withMessage(
            "Only Amrita Chennai student email (ch.students.amrita.edu) is allowed"
        ),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        ),

];

// ==========================
// Login Validation
// ==========================
const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

];

// ==========================
// Verify OTP Validation
// ==========================
const verifyOtpValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be exactly 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),

];

// ==========================
// Resend OTP Validation
// ==========================
const resendOtpValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),

];

// ==========================
// Refresh Token Validation
// ==========================
const refreshTokenValidation = [

    body("refreshToken")
        .trim()
        .notEmpty()
        .withMessage("Refresh Token is required"),

];

// ==========================
// Forgot Password Validation
// ==========================
const forgotPasswordValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address"),

];

// ==========================
// Reset Password Validation
// ==========================
const resetPasswordValidation = [

    body("token")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        ),

];

// ==========================
// Validation Middleware
// ==========================
const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({

            success: false,

            errors: errors.array(),

        });

    }

    next();

};

module.exports = {

    registerValidation,

    loginValidation,

    verifyOtpValidation,

    resendOtpValidation,

    refreshTokenValidation,

    forgotPasswordValidation,

    resetPasswordValidation,

    validate,

};