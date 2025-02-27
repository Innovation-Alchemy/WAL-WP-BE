const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { generateToken } = require("../utils/generateToken");
const User = db.User;
const transporter = require("../config/email.config");
const { AuthVAlSchema, LoginVAlSchema,setPasswordSchema } = require("../utils/validations");
const {assignDefaultPermissions}= require ("../utils/assigning_permissions_by_default");
const accountModels = { User: db.User,};
require("dotenv").config();


// ** Register User **
exports.register = async (req, res) => {
  const { name, email, password, phone_number, birthdate, gender, role } =
    req.body;

  // Validate input using Joi schema
  const { error } = AuthVAlSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      birthdate,
      gender,
      role,
    });

   // Assign default permissions based on role
   await assignDefaultPermissions(newUser.id, role);

    // Generate a verification token
    const { token, TokenExpires } = generateToken(newUser);
    newUser.token = token;
    newUser.TokenExpires = TokenExpires;
    await newUser.save();
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - We Are Lebanon",
      html: `
        <div style="background-color: #150D0D; font-family: Arial, sans-serif; color: #FFFFFF; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://wearelebanon.guide/WALLogo.png" alt="We Are Lebanon Logo" width="363" height="184" style="max-width: 100%; height: auto;" />
          </div>
          <div style="background: radial-gradient(circle, #926060 0%, #843434 100%); border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto; text-align: center;">
            <h2 style="margin-bottom: 20px;">Welcome to We Are Lebanon, ${name}!</h2>
            <p style="margin-bottom: 20px;">Please verify your email to get started with our platform.</p>
            <a href="${verificationLink}?token=${token}" 
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
              Verify Email
            </a>
            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p style="word-wrap: break-word; color: #ffffff;">
              <a href="${verificationLink}?token=${token}" style="color: #F9A8AE; text-decoration: underline;">Click Here to Verify Your Email</a>
            </p>
          </div>
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #AAAAAA;">
            <p>We Are Lebanon, All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({
        message: "An error occurred during registration",
        error: error.message,
      });
  }
};

// ** Login User **
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input using Joi schema
  const { error } = LoginVAlSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the account is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account is not verified. Please verify your email.",
      });
    }

    // Check if the account is approved (only for Admin and Organizer roles)
    if (
      (user.role === "Admin" || user.role === "Organizer") &&
      !user.isApproved
    ) {
      return res.status(403).json({
        message: "Account is not approved. Please contact the administrator.",
      });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a token if it doesn't exist or has expired
    if (!user.token || new Date(user.TokenExpires) < Date.now()) {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d", // Token lasts for 7 days
        }
      );

      // Save token and expiration in the database
      const tokenExpires = new Date();
      tokenExpires.setDate(tokenExpires.getDate() + 7); // Set expiration to 7 days from now
      user.token = token;
      user.TokenExpires = tokenExpires;
      await user.save();
    }

    // Parse hobbies from string to JSON if necessary
    let hobbies = user.hobbies;
    if (typeof hobbies === "string") {
      hobbies = JSON.parse(hobbies);
    }

    // Set hobbies to null if it's an empty array
    hobbies = Array.isArray(hobbies) && hobbies.length === 0 ? null : hobbies;

    res.status(200).json({
      message: "Login successful",
      id: user.id,
      token: user.token,
      data: {
        hobbies, 
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
};


// ** Logout User **
exports.logout = async (req, res) => {
  const { token } = req.body; // Assuming the token is sent in the request body or headers

  try {
    // Find the user by the token
    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or already logged out" });
    }

    // Clear the token and its expiration
    user.token = null;
    user.TokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res
      .status(500)
      .json({
        message: "An error occurred during logout",
        error: error.message,
      });
  }
};

// ** Verify Email (GET version) **
exports.verifyEmail = async (req, res) => {
  // For a GET request, token might come from req.query
  const { token } = req.query;

  try {
    // Find the user by token and check expiration
    const user = await User.findOne({
      where: { token, TokenExpires: { [Op.gt]: new Date() } },
    });

    if (!user) {
      return res.status(400).send(`
        <html>
          <body>
            <h3>Invalid or Expired Token</h3>
            <p>The verification link is invalid or has expired. Please request a new one.</p>
          </body>
        </html>
      `);
    }

    // Mark user as verified
    user.isVerified = true;
    user.token = null;
    user.TokenExpires = null;
    await user.save();

    res.status(200).send(`
      <html>
        <body>
          <h3>Email Verified Successfully</h3>
          <p>Your account has been verified. You can now log in.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send(`
      <html>
        <body>
          <h3>Error Verifying Email</h3>
          <p>An error occurred while verifying your account. Please try again later.</p>
        </body>
      </html>
    `);
  }
};

// ** Approve User **
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the `isApproved` field to `true`
    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "User approved successfully", data: user });
  } catch (error) {
    console.error("Error approving user:", error);
    res
      .status(500)
      .json({ message: "Error approving user", error: error.message });
  }
};

// Verify email and set password
exports.verifyEmailAndSetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  const { error } = setPasswordSchema.validate({ token, password, confirmPassword });
  if (error) {
    return res.status(400).json({ message: "Invalid input", details: error.details });
  }

  try {
    let account = null;
    for (const modelName in accountModels) {
      account = await accountModels[modelName].findOne({
        where: { token, TokenExpires: { [Op.gt]: Date.now() } },
      });
      if (account) break;
    }

    if (!account) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    account.password = hashedPassword;
    account.isVerified = true;
    account.token = null; // Clear token after successful verification
    account.TokenExpires = null;
    await account.save();

    res.status(200).json({ message: "Account verified and password set successfully" });
  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(500).json({ message: "Error verifying account", error: err.message });
  }
};

exports.renderVerificationForm = async (req, res) => {
  const { token } = req.params;

  try {
    let account = null;

    // Iterate through all account models to find the account with the given token
    for (const modelName in accountModels) {
      account = await accountModels[modelName].findOne({
        where: { token, TokenExpires: { [Op.gt]: new Date() } },
      });
      if (account) break;
    }

    if (!account) {
      return res.status(400).send(`
        <html>
          <body style="background: linear-gradient(135deg, #ff0000, #000000); color: white; text-align: center; padding: 50px;">
            <h3>Invalid or Expired Token</h3>
            <p>The verification link is invalid or has expired. Please request a new one.</p>
          </body>
        </html>
      `);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Set Your Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background: linear-gradient(135deg, #150D0D, #7B2128);
                  color: #FFFFFF;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
              .container {
                  background: radial-gradient(circle, #926060 0%, #843434 100%);
                  border-radius: 10px;
                  padding: 30px;
                  max-width: 400px;
                  width: 100%;
                  text-align: center;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
              }
              .logo {
                  margin-bottom: 20px;
              }
              .logo img {
                  width: 200px;
              }
              .container h1 {
                  font-size: 24px;
                  margin-bottom: 20px;
              }
              .container p {
                  font-size: 16px;
                  margin-bottom: 20px;
              }
              .container input {
                  width: calc(100% - 20px);
                  padding: 10px;
                  margin: 10px auto;
                  border: 1px solid #FFFFFF;
                  border-radius: 5px;
                  background-color: #333333;
                  color: #FFFFFF;
                  font-size: 14px;
              }
              .container button {
                  background-color: #F9A8AE;
                  color: #7B2128;
                  border: none;
                  padding: 10px 20px;
                  font-size: 16px;
                  border-radius: 5px;
                  cursor: pointer;
              }
              .container button:hover {
                  background-color: #E5878F;
              }
              .message {
                  display: none;
                  padding: 10px;
                  margin-top: 20px;
                  border-radius: 5px;
                  text-align: center;
              }
              .success {
                  background-color: #28a745;
                  color: #ffffff;
              }
              .error {
                  background-color: #dc3545;
                  color: #ffffff;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="logo">
                  <img src="https://wearelebanon.guide/WALLogo.png" alt="We Are Lebanon Logo">
              </div>
              <h1>Set Your Password</h1>
              <p>Please enter your new password and confirm it below.</p>
              <form id="passwordForm">
                  <input type="hidden" id="token" name="token" value="${token}">
                  <input type="password" id="password" name="password" placeholder="New Password" required>
                  <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>
                  <button type="submit">Set Password</button>
              </form>
              <div id="message" class="message"></div>
          </div>

          <script>
              const form = document.getElementById('passwordForm');
              const password = document.getElementById('password');
              const confirmPassword = document.getElementById('confirmPassword');
              const messageDiv = document.getElementById('message');

              form.addEventListener('submit', async (event) => {
                  event.preventDefault();
                  const token = document.getElementById('token').value;

                  if (password.value !== confirmPassword.value) {
                      messageDiv.className = 'message error';
                      messageDiv.textContent = 'Passwords do not match.';
                      messageDiv.style.display = 'block';
                      return;
                  }

                  try {
                      const response = await fetch('/api/auth/verify-email/set-password', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                              token,
                              password: password.value,
                              confirmPassword: confirmPassword.value,
                          }),
                      });

                      const result = await response.json();
                      if (response.ok) {
                          messageDiv.className = 'message success';
                          messageDiv.textContent = result.message || 'Password set successfully!';
                      } else {
                          messageDiv.className = 'message error';
                          messageDiv.textContent = result.message || 'An error occurred. Please try again.';
                      }
                  } catch (error) {
                      messageDiv.className = 'message error';
                      messageDiv.textContent = 'A network error occurred. Please try again later.';
                  }

                  messageDiv.style.display = 'block';
              });
          </script>
      </body>
      </html>
    `;

    res.send(htmlContent);
  } catch (error) {
    console.error('Error rendering verification form:', error);
    res.status(500).send('<h3>Something went wrong</h3>');
  }
};


exports.requestOrganizerRole = async (req, res) => {
  try {
    const { user_id, message } = req.body;

    // Find the user making the request
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get admin email (assuming you have an admin user or a default admin email in the .env)
    const adminEmail = process.env.EMAIL_USER || "admin@example.com";

    // Prepare the email content
    const mailOptions = {
      from: user.email,
      to: adminEmail,
      subject: "Organizer Role Request",
      html: `
        <h3>Organizer Role Request</h3>
        <p><strong>User Name:</strong> ${user.name}</p>
        <p><strong>User Email:</strong> ${user.email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Please review the request and take the necessary action in the admin panel.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Add notification for admin
    const adminUsers = await User.findAll({ where: { role: "Admin" } }); // Fetch all admins

    if (adminUsers.length > 0) {
      const notifications = adminUsers.map((admin) => ({
        user_id: admin.id,
        notification_type: "organizer-approval",
        message: `${user.name} has requested to become an organizer. Message: ${message}`,
        is_read: false,
      }));

      // Bulk create notifications for all admins
      await db.notification.bulkCreate(notifications);
    }

    res.status(200).json({
      message: "Request to become an organizer has been sent to the admin, and a notification has been created.",
    });
  } catch (error) {
    console.error("Error sending organizer request email:", error);
    res.status(500).json({
      message: "An error occurred while sending the organizer request email.",
      error: error.message,
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { user_id, oldPassword, newPassword } = req.body;

  if (!user_id || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if the new password meets the minimum length requirement
  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "New password must be at least 8 characters long.",
    });
  }

  try {
    // Find the user by ID
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      message: "An error occurred while changing the password.",
      error: error.message,
    });
  }
};