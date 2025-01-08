module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define(
      "Report",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
           type: Sequelize.STRING,
           allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,    
        },
        report_type: {
            type: Sequelize.ENUM(
              "false-information",
              "racism",
              "hate-speech",
            ),
            allowNull: true,
          },
      },
      { timestamps: true }
    );
  
    return Report;
  };
  