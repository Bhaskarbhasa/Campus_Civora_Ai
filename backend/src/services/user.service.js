const bcrypt = require("bcrypt");

const userRepository = require("../repositories/user.repository");

const ApiError = require("../utils/ApiError");

/**
 * Get Logged-in User Profile
 */
const getProfile = async (userId) => {

    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

};

/**
 * Update User Profile
 */
const updateProfile = async (
    userId,
    updateData
) => {

    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    // Users cannot update these fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;
    delete updateData.isVerified;
    delete updateData.isActive;
    delete updateData.lastLogin;

    const updatedUser = await userRepository.updateProfile(
        userId,
        updateData
    );

    return {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        isActive: updatedUser.isActive,
        lastLogin: updatedUser.lastLogin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    };

};

/**
 * Change Password
 */
const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await userRepository.findUserByEmailWithPassword(
        (
            await userRepository.findUserById(userId)
        ).email
    );

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(
            400,
            "Current password is incorrect."
        );
    }

    const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
    );

    if (isSamePassword) {
        throw new ApiError(
            400,
            "New password cannot be the same as the current password."
        );
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    await userRepository.updatePassword(
        userId,
        hashedPassword
    );

    return {
        message: "Password changed successfully.",
    };

};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
};