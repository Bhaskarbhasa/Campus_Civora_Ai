const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const config = require("../config");

const refreshTokenRepository = require("../repositories/refreshToken.repository");
const userRepository = require("../repositories/user.repository");

const ApiError = require("../utils/ApiError");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Generate Random Refresh Token
 */
const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

/**
 * Generate JWT Access Token
 */
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        config.jwtSecret,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    );
};

/**
 * Save Refresh Token in Database
 */
const createRefreshToken = async (user) => {

    // Remove previous refresh tokens
    await refreshTokenRepository.deleteUserRefreshTokens(user._id);

    const refreshToken = generateRefreshToken();

    const expiresAt = new Date(
        Date.now() +
        REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    await refreshTokenRepository.createRefreshToken({
        user: user._id,
        token: refreshToken,
        expiresAt,
    });

    return refreshToken;
};

/**
 * Generate Access Token + Refresh Token
 */
const generateTokens = async (user) => {

    const accessToken = generateAccessToken(user);

    const refreshToken = await createRefreshToken(user);

    return {
        accessToken,
        refreshToken,
    };
};

/**
 * Generate New Access Token using Refresh Token
 */
const refreshAccessToken = async (refreshToken) => {

    const storedToken =
        await refreshTokenRepository.findRefreshToken(refreshToken);

    if (!storedToken) {
        throw new ApiError(
            401,
            "Invalid Refresh Token"
        );
    }

    if (storedToken.expiresAt < new Date()) {

        await refreshTokenRepository.deleteRefreshToken(
            refreshToken
        );

        throw new ApiError(
            401,
            "Refresh Token Expired"
        );
    }

    const user =
        await userRepository.findUserById(storedToken.user);

    if (!user) {
        throw new ApiError(
            404,
            "User Not Found"
        );
    }

    const accessToken = generateAccessToken(user);

    return {
        accessToken,
    };
};

/**
 * Logout User
 */
const logout = async (refreshToken) => {

    const token =
        await refreshTokenRepository.findRefreshToken(refreshToken);

    if (!token) {
        throw new ApiError(
            404,
            "Refresh Token Not Found"
        );
    }

    await refreshTokenRepository.deleteRefreshToken(
        refreshToken
    );

    return {
        message: "Logged out successfully",
    };
};

module.exports = {
    createRefreshToken,
    generateTokens,
    refreshAccessToken,
    logout,
};