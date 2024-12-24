const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const transporter = require("../config/email.config");
const { Op } = require("sequelize");
const {CreateUserValidationSchema} = require("../utils/validations");
require("dotenv").config();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "Users retrieved successfully", data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User retrieved successfully", data: user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  // Validate the input using Joi schema
  const { error } = CreateUserValidationSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Invalid input", details: error.details });
  }

  try {
    // Destructure request body
    const { name, email, phone_number, birthdate, gender, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists in the system. Please use a different email.",
      });
    }

    // Generate a secure token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    // Create the user in the database
    const newUser = await User.create({
      name,
      email,
      phone_number,
      birthdate,
      gender,
      role,
      isVerified: false, // Default to not verified
      token, // Save the token
      TokenExpires: tokenExpiry, // Save the expiry
    });

    // Construct the verification link for the set password page
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/render-verfication/${token}`;

    // Compose the verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>Hello ${newUser.name || "User"},</p>
          <p>Please click the button below to set your password and complete your registration:</p>
          <a href="${verificationLink}" 
            style="display: inline-block; margin: 20px 0; padding: 12px 20px; font-size: 16px; font-weight: bold; color: white; background-color: #007BFF; text-decoration: none; border-radius: 4px;">
            Verify Account
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.error("Error sending verification email:", err);

        // Optionally delete the user if email sending fails
        await newUser.destroy();

        return res.status(500).json({
          message: "Failed to send verification email",
          error: err.message,
        });
      } else {
        console.log("Verification email sent:", info.response);
        res.status(201).json({
          message: "User created successfully. Verification email sent.",
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            isVerified: newUser.isVerified, // Default is false
          },
        });
      }
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, phone_number, name, password, birthdate, gender, role, hobbies } = req.body;

    // If updating email or phone_number, ensure uniqueness
    if (email || phone_number) {
      const whereConditions = [];
      if (email) whereConditions.push({ email });
      if (phone_number) whereConditions.push({ phone_number });

      const existingUser = await User.findOne({
        where: {
          [Op.or]: whereConditions,
          id: { [Op.ne]: user.id }, // Exclude the current user
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email or phone number already in use by another user.",
        });
      }
    }

    // Handle profile picture update
    let profile_picture = user.profilePicture;
    if (req.file) {
      profile_picture =
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${req.file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${req.file.path.replace(/\\/g, "/")}`;
    }

    // Update individual fields
    await user.update({
      name: name !== undefined ? name : user.name,
      email: email !== undefined ? email : user.email,
      phone_number: phone_number !== undefined ? phone_number : user.phone_number,
      birthdate: birthdate !== undefined ? birthdate : user.birthdate,
      gender: gender !== undefined ? gender : user.gender,
      role: role !== undefined ? role : user.role,
      hobbies: hobbies !== undefined ? hobbies : user.hobbies,
      profile_picture: profile_picture !== undefined ? profile_picture : user.profile_picture,
      password: password ? await bcrypt.hash(password, 10) : user.password, // Hash password if provided
    });

    res.status(200).json({
      message: "User updated successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        birthdate: user.birthdate,
        gender: user.gender,
        role: user.role,
        hobbies: user.hobbies,
        profile_picture: user.profile_picture,
        isVerified: user.isVerified,
        isApproved: user.isApproved,
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
