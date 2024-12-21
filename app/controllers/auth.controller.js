const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { generateToken } = require("../utils/generateToken");
const User = db.User;
const nodemailer = require("nodemailer");
require("dotenv").config();

// ** Register User **
exports.register = async (req, res) => {
  const { name, email, password, phone_number, birthdate, gender, role } = req.body;

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
      role
    });

    // Generate a verification token
    const { token, TokenExpires } = generateToken(newUser);
    newUser.token = token;
    newUser.TokenExpires = TokenExpires;
    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h3>Welcome to We Are Lebanon App, ${name}</h3>
        <p>Please verify your email by clicking the button below:</p>
       <a href="${verificationLink}?token=${token}" 
   style="
     padding: 10px 20px;
     background-color: #007bff;
     color: #ffffff;
     text-decoration: none;
     border-radius: 5px;
     font-size: 16px;
   "
>
  Verify Email
</a>

        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p>${verificationLink}?token=${token}</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "An error occurred during registration", error: error.message });
  }
};


// ** Login User **
exports.login = async (req, res) => {
  const { email, password } = req.body;

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
      return res
        .status(403)
        .json({ message: "Account is not verified. Please verify your email." });
    }

    // Check if the account is approved
    if (!user.isApproved) {
      return res
        .status(403)
        .json({ message: "Account is not approved. Please contact the administrator." });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a token if it doesn't exist or has expired
    if (!user.token || new Date(user.TokenExpires) < Date.now()) {
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token lasts for 7 days
      });

      // Save token and expiration in the database
      const tokenExpires = new Date();
      tokenExpires.setDate(tokenExpires.getDate() + 7); // Set expiration to 7 days from now
      user.token = token;
      user.TokenExpires = tokenExpires;
      await user.save();
    }

    res.status(200).json({ message: "Login successful", token: user.token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login", error: error.message });
  }
};


// ** Logout User **
exports.logout = async (req, res) => {
  const { token } = req.body; // Assuming the token is sent in the request body or headers

  try {
    // Find the user by the token
    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(404).json({ message: "User not found or already logged out" });
    }

    // Clear the token and its expiration
    user.token = null;
    user.TokenExpires = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "An error occurred during logout", error: error.message });
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
    res.status(500).json({ message: "Error approving user", error: error.message });
  }
};
