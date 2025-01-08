module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      permissions: {
        type: Sequelize.JSON, // Store as JSON
        allowNull: true,
        defaultValue: [], // Default to an empty array
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure a single unique constraint for email
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true, // Ensure a single unique constraint for phone_number
      },
      birthdate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM("Admin", "Organizer", "Operator", "User"),
        defaultValue: "User",
      },
      hobbies: {
        type: Sequelize.JSON, // Use JSON to store multiple values
        allowNull: true,
        defaultValue: [], // Default to an empty array
      },
      gender: {
        type: Sequelize.ENUM("Male", "Female"),
        defaultValue: "Male",
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      TokenExpires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true, // Automatically handle createdAt and updatedAt
    }
  );

  return User;
};
