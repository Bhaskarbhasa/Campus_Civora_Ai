const userService = require("../services/user.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Get Logged-in User Profile
 */
const getProfile = asyncHandler(async (req, res) => {

    const user = await userService.getProfile(
        req.user.id
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Profile retrieved successfully.",

            user

        )

    );

});

/**
 * Update User Profile
 */
const updateProfile = asyncHandler(async (req, res) => {

    const updatedUser = await userService.updateProfile(
        req.user.id,
        req.body
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Profile updated successfully.",

            updatedUser

        )

    );

});

/**
 * Change Password
 */
const changePassword = asyncHandler(async (req, res) => {

    const { currentPassword, newPassword } = req.body;

    const result = await userService.changePassword(
        req.user.id,
        currentPassword,
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

    getProfile,

    updateProfile,

    changePassword,

};