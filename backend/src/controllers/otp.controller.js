const otpService = require("../services/otp.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Verify OTP
 */
const verifyOtp = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    const result = await otpService.verifyOtp(
        email,
        otp
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
    verifyOtp,
};