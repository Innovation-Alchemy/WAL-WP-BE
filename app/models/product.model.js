module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "Product",
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.JSON, 
        allowNull: true,
      },
      price:  {
        type: Sequelize.JSON, 
        allowNull: false,
      },
      size: {
        type: Sequelize.JSON, 
        allowNull: false,
      },
      color: {
        type: Sequelize.JSON, 
        allowNull: false,
      },
      commission: {
        type: Sequelize.DECIMAL(5, 2), // Percentage as a decimal value
        allowNull: false,
        defaultValue: 100.0, // Default commission is 100%
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default is not approved
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

  // Add a hook to trim whitespace before saving
  Product.addHook("beforeSave", (product) => {
    if (product.name) {
      product.name = product.name.trim();
    }
    if (product.description) {
      product.description = product.description.trim();
    }
  });

  return Product;
};
