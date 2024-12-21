module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
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
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    birthdate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role: {
      type: Sequelize.ENUM("Admin", "Organizer", "Operator","User"),
      defaultValue: "User",
    },
    hobbies: {
      type: Sequelize.JSON, // Use JSON to store multiple values
      allowNull: true,
      defaultValue: [],     // Default to an empty array
    },
    
    gender: {
      type: Sequelize.ENUM("Male", "Female"),
      defaultValue: "Male",
    },
    profile_picture: {
      type: Sequelize.STRING,
      allowNull: true,
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
  });

  return User;
};
