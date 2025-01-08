module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define(
    "Cart",
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
      products: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },      
      status: {
        type: Sequelize.ENUM("pending", "checked_out"),
        defaultValue: "pending",
      },
      total_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0, // Sum of all products in the cart
      },
    },
    { timestamps: true }
  );

  return Cart;
};
