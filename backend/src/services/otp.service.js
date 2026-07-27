const otpRepository = require("../repositories/otp.repository");
const userRepository = require("../repositories/user.repository");

const { sendOtpEmail } = require("../utils/email");

const ApiError = require("../utils/ApiError");

/**
 * Generate 6-digit OTP
 */
const generateOtp = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

/**
 * Create OTP
 */
const createOtp = async (email, session = null) => {

    // Delete previous OTPs
    await otpRepository.deleteOtpByEmail(
        email,
        session
    );

    // Generate OTP
    const otp = generateOtp();

    // OTP expires in 5 minutes
    const expiresAt = new Date(
        Date.now() + 5 * 60 * 1000
    );

    // Save OTP
    await otpRepository.createOtp(
        {
            email,
            otp,
            expiresAt,
        },
        session
    );

    return otp;
};

/**
 * Verify OTP
 */
const verifyOtp = async (email, enteredOtp) => {

    // Find latest OTP
    const otpRecord =
        await otpRepository.findOtpByEmail(email);

    if (!otpRecord) {
        throw new ApiError(
            404,
            "OTP not found. Please request a new OTP."
        );
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {

        await otpRepository.deleteOtpByEmail(email);

        throw new ApiError(
            400,
            "OTP has expired."
        );
    }

    // Compare OTP
    if (otpRecord.otp !== enteredOtp) {
        throw new ApiError(
            400,
            "Invalid OTP."
        );
    }

    // Verify user
    await userRepository.verifyUser(email);

    // Delete OTP
    await otpRepository.deleteOtpByEmail(email);

    return {
        message: "Email verified successfully.",
    };
};

/**
 * Resend OTP
 */
const resendOtp = async (email) => {

    const user =
        await userRepository.findUserByEmail(email);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    if (user.isVerified) {
        throw new ApiError(
            400,
            "Email is already verified."
        );
    }

    const otp = await createOtp(email);

    await sendOtpEmail(
        email,
        otp
    );

    return {
        message: "OTP has been sent successfully.",
    };
};

module.exports = {
    createOtp,
    verifyOtp,
    resendOtp,
};