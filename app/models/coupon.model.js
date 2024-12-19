module.exports = (sequelize, Sequelize) => {
    const Coupon = sequelize.define("Coupon", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      discountPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      maxUses: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      currentUses: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      validFrom: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      validTo: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  
    return Coupon;
  };
  