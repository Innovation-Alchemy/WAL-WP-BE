module.exports = (sequelize, Sequelize) => {
    const ProductPurchase = sequelize.define(
      "Product_Purchase",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        total_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("pending", "completed", "cancelled"),
          defaultValue: "pending",
        },
      },
      { timestamps: true }
    );
  
    return ProductPurchase;
  };
  