const jwt = require("jsonwebtoken");

const config = require("../config");

const userRepository = require("../repositories/user.repository");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Authenticate User using JWT Access Token
 */
const authenticate = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(
            401,
            "Access token is required."
        );
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {

        decoded = jwt.verify(
            token,
            config.jwtSecret
        );

    } catch (error) {

        throw new ApiError(
            401,
            "Invalid or expired access token."
        );

    }

    const user = await userRepository.findUserById(
        decoded.id
    );

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
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
            "Please verify your email."
        );
    }

    req.user = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    };

    next();

});

module.exports = authenticate;