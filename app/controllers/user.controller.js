const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
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
  try {
   
    // 2) Destructure request body
    const { name, email, password, phone_number, birthdate, gender, role } = req.body;

    // 3) Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 4) Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5) Generate a verification token and its expiration
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    // 6) Handle profile picture (if provided)
    //    Make sure your route uses "upload.single('profile_picture')" and 
    //    your <form> or frontend code sends the file as "profile_picture".
    let profile_picture = null;
    if (req.file) {
      // Convert backslashes to forward slashes (on Windows, for example)
      const filePath = req.file.path.replace(/\\/g, "/");

      // Construct a URL to serve the uploaded file
      // (Adjust logic for your production vs. local environment)
      profile_picture =
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${filePath}`
          : `http://localhost:8080/${filePath}`;
    }

    // 7) Create the user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      birthdate,
      gender,
      role,
      profile_picture,
      token,
      TokenExpires: tokenExpiry,
      // Make sure your User model has these columns: 
      // "profile_picture", "token", "TokenExpires", and "isVerified" (default false or null)
    });

    // 8) Construct verification link
    //    Make sure BACKEND_URL is set in your .env (e.g., http://localhost:8080 or your prod URL)
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${token}`;

    // 9) Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // e.g., "youremail@gmail.com"
        pass: process.env.EMAIL_PASS, // e.g., "yourpassword"
      },
    });

    // 10) Compose the verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Account",
      html: `
        <h3>Welcome to We Are Lebanon App, ${name}</h3>
        <p>Please verify your email by clicking the button below:</p>
        <a 
          href="${verificationLink}?token=${token}" 
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

    // 11) Send the email and respond
    transporter.sendMail(mailOptions, async (err, info) => {
      if (err) {
        console.error("Error sending verification email:", err);

        // Optionally delete the user if email sending fails
        await newUser.destroy();

        return res
          .status(500)
          .json({ message: "Failed to send verification email", error: err.message });
      } else {
        console.log("Verification email sent:", info.response);
        return res.status(201).json({
          message: "User created successfully. Verification email sent.",
          data: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            profile_picture: newUser.profile_picture,
            isVerified: newUser.isVerified, // By default probably false or null
          },
        });
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
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
