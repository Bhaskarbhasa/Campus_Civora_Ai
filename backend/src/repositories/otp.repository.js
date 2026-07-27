const OtpVerification = require("../models/otp.model");

/**
 * Save OTP
 */
const createOtp = async (otpData, session = null) => {

    const otp = new OtpVerification(otpData);

    if (session) {
        await otp.save({ session });
    } else {
        await otp.save();
    }

    return otp;
};

/**
 * Find Latest OTP by Email
 */
const findOtpByEmail = async (email) => {
    return await OtpVerification
        .findOne({ email })
        .sort({ createdAt: -1 });
};

/**
 * Delete All OTPs for an Email
 */
const deleteOtpByEmail = async (email, session = null) => {

    return await OtpVerification.deleteMany(
        { email },
        { session }
    );
};

module.exports = {
    createOtp,
    findOtpByEmail,
    deleteOtpByEmail,
};