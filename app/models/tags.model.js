module.exports = (sequelize, Sequelize) => {
    const Tags = sequelize.define(
      "Tags",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true, // Tags names must be unique
        },
      },
      { timestamps: true }
    );
  
    return Tags;
  };
  