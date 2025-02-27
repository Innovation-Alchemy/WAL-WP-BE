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
      color: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity_unit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pcs",
      },
      total_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "completed","canceled"),
        defaultValue: "pending",
      },
    },
    { timestamps: true }
  );

  return ProductPurchase;
};
