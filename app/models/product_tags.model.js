module.exports = (sequelize, DataTypes) => {
    const ProductTags = sequelize.define("ProductTags", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
     
      },
    });
  
    return ProductTags;
  };
  