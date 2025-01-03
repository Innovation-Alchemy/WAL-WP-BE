module.exports = (sequelize, Sequelize) => {
    const PasswordResetToken = sequelize.define("password_reset_token", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, { timestamps: true });
  
    return PasswordResetToken;
  };
  