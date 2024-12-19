
module.exports = (sequelize, Sequelize) => {
  const Permission = sequelize.define(
    "Permission",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
      },
    },
    { timestamps: true }
  );

  return Permission;
};
