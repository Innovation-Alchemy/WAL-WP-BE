const crypto = require("crypto");
const { User, PasswordResetToken } = require("../models");
const transporter = require("../config/email.config");
const bcrypt = require("bcryptjs");
const { forgetPasswordSchema, resetPasswordSchema } = require("../utils/validations");
const { Op } = require("sequelize");

exports.forgetPassword = async (req, res) => {
  // Validate input
  const { error } = forgetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1-hour validity

    // Store the token in PasswordResetToken model
    await PasswordResetToken.create({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email with reset link
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="background-color: #150D0D; font-family: Arial, sans-serif; color: #FFFFFF; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://wearelebanon.guide/WALLogo.png" alt="We Are Lebanon Logo" width="363" height="184" style="max-width: 100%; height: auto;" />
          </div>
          <div style="background: radial-gradient(circle, #926060 0%, #843434 100%); border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto; text-align: center;">
            <h2 style="margin-bottom: 20px;">Password Reset Request</h2>
            <p style="margin-bottom: 20px;">Click the button below to reset your password:</p>
            <a href="${resetLink}" 
              style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #F9A8AE;
                color: #7B2128;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 20px;">
              Reset Password
            </a>
            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p style="word-wrap: break-word; color: #ffffff;">
              <a href="${resetLink}" style="color: #F9A8AE; text-decoration: underline;">${resetLink}</a>
            </p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Error sending password reset email", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  // Validate input
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { token, password } = req.body;

  try {
    const passwordResetToken = await PasswordResetToken.findOne({
      where: { token, expires_at: { [Op.gt]: new Date() } },
    });

    if (!passwordResetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(passwordResetToken.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });

    // Remove the token after successful password reset
    await passwordResetToken.destroy();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};
