module.exports = (sequelize, Sequelize) => {
    const Hobby = sequelize.define(
      "Hobby",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true, // Hobby names must be unique
        },
      },
      { timestamps: true }
    );
  
    return Hobby;
  };
  