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

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h3>Welcome to We Are Lebanon App, ${name}</h3>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
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

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the account is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Account is not verified. Please verify your email." });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login", error: error.message });
  }
};

// ** Logout User **
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "An error occurred during logout", error: error.message });
  }
};

// ** Verify Email **
exports.verifyEmail = async (req, res) => {
    const { token } = req.params;
  
    try {
      // Find user by token and expiration
      const user = await User.findOne({
        where: { token, TokenExpires: { [Op.gt]: new Date() } },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
  
      // Update user to mark as verified
      user.isVerified = true;
      user.token = null; // Clear the token
      user.TokenExpires = null;
      await user.save();
  
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Email Verified</title>
        </head>
        <body>
          <h2>Email Verified Successfully</h2>
          <p>Your account has been verified. You can now log in to your account.</p>
        </body>
        </html>
      `);
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ message: "Error verifying account", error: error.message });
    }
  };
  