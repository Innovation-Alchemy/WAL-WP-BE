module.exports = (sequelize, Sequelize) => {
  const Stock = sequelize.define(
    "Stock",
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
      color: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity_unit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pcs",
      },
      quantity_in_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10      
      },
      stock_alert: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10  
      },
    },
    { timestamps: true }
  );

  return Stock;
};
