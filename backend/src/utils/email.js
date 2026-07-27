const nodemailer = require("nodemailer");
const config = require("../config");

/**
 * Create Email Transporter
 */
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});

/**
 * Send OTP Email
 */
const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: "Campus CIVORA AI - Email Verification OTP",
        html: `
            <h2>Email Verification</h2>

            <p>Your OTP for verifying your account is:</p>

            <h1>${otp}</h1>

            <p>This OTP is valid for 5 minutes.</p>

            <p>If you did not request this OTP, please ignore this email.</p>
        `,
    };

    console.log("======================================");
    console.log("Sending OTP Email...");
    console.log("From:", config.emailUser);
    console.log("To:", email);

    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent Successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("======================================");
};

/**
 * Send Password Reset Email
 */
const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `${config.clientUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: "Campus CIVORA AI - Reset Your Password",
        html: `
            <h2>Password Reset Request</h2>

            <p>We received a request to reset your password.</p>

            <p>Click the button below to reset your password.</p>

            <a
                href="${resetLink}"
                style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:bold;
                "
            >
                Reset Password
            </a>

            <p>Or copy this link into your browser:</p>

            <p>${resetLink}</p>

            <p>This link is valid for 15 minutes.</p>

            <p>If you did not request this password reset, you can safely ignore this email.</p>
        `,
    };

    console.log("======================================");
    console.log("Sending Password Reset Email...");
    console.log("From:", config.emailUser);
    console.log("To:", email);

    const info = await transporter.sendMail(mailOptions);

    console.log("Password Reset Email Sent Successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("======================================");
};

module.exports = {
    sendOtpEmail,
    sendResetPasswordEmail,
};