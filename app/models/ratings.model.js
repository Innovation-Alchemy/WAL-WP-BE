module.exports = (sequelize, Sequelize) => {
    const Rating = sequelize.define(
      "Rating",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        rating: {
          type: Sequelize.FLOAT,
          allowNull: false,
          validate: {
            min: 1,
            max: 5,
          },
        },
        comment: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      { timestamps: true }
    );
  
    return Rating;
  };
  