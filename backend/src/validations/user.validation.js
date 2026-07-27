const { body, validationResult } = require("express-validator");

/**
 * ==========================
 * Update Profile Validation
 * ==========================
 */
const updateProfileValidation = [

    body("fullName")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage(
            "Full Name must be between 3 and 100 characters"
        ),

];

/**
 * ==========================
 * Change Password Validation
 * ==========================
 */
const changePasswordValidation = [

    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

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

/**
 * ==========================
 * Validation Middleware
 * ==========================
 */
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

    updateProfileValidation,

    changePasswordValidation,

    validate,

};