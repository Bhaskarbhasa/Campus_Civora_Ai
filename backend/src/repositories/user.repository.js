const User = require("../models/user.model");

/**
 * Create a New User
 */
const createUser = async (userData, session = null) => {

    const user = new User(userData);

    if (session) {
        await user.save({ session });
    } else {
        await user.save();
    }

    return user;
};

/**
 * Find User by Email
 * (Password NOT Included)
 */
const findUserByEmail = async (email) => {

    return await User.findOne({
        email,
    });

};

/**
 * Find User by Email
 * (Password Included)
 */
const findUserByEmailWithPassword = async (email) => {

    return await User.findOne({
        email,
    }).select("+password");

};

/**
 * Find User by ID
 */
const findUserById = async (userId) => {

    return await User.findById(userId);

};

/**
 * Verify User
 */
const verifyUser = async (email, session = null) => {

    return await User.findOneAndUpdate(
        {
            email,
        },
        {
            isVerified: true,
        },
        {
            new: true,
            session,
        }
    );

};

/**
 * Update Last Login
 */
const updateLastLogin = async (userId) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            lastLogin: new Date(),
        },
        {
            new: true,
        }
    );

};

/**
 * Update Password
 */
const updatePassword = async (
    userId,
    hashedPassword
) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            password: hashedPassword,
        },
        {
            new: true,
        }
    );

};

/**
 * Update User Profile
 */
const updateProfile = async (
    userId,
    updateData
) => {

    return await User.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

};

/**
 * Deactivate User
 */
const deactivateUser = async (userId) => {

    return await User.findByIdAndUpdate(
        userId,
        {
            isActive: false,
        },
        {
            new: true,
        }
    );

};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByEmailWithPassword,
    findUserById,
    verifyUser,
    updateLastLogin,
    updatePassword,
    updateProfile,
    deactivateUser,
};