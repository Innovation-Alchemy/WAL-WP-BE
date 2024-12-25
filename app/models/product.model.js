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
        type: Sequelize.STRING,
        allowNull: true,
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
