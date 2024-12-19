module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define("Category", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        trim: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        trim: true,
      },
      type: {
        type: Sequelize.ENUM("product", "event", "blog"),
        allowNull: false,
        trim: true,
      },
    });
  
    return Category;
  };
  