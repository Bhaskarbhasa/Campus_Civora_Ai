const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const userController = require("../controllers/user.controller");

const {
    updateProfileValidation,
    changePasswordValidation,
    validate,
} = require("../validations/user.validation");

/**
 * Get Logged-in User Profile
 */
router.get(
    "/profile",
    authenticate,
    userController.getProfile
);

/**
 * Update User Profile
 */
router.put(
    "/profile",
    authenticate,
    updateProfileValidation,
    validate,
    userController.updateProfile
);

/**
 * Change Password
 */
router.put(
    "/change-password",
    authenticate,
    changePasswordValidation,
    validate,
    userController.changePassword
);

module.exports = router;