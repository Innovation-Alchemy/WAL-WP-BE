module.exports = (sequelize, Sequelize) => {
    const EventReports = sequelize.define("EventReports", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
       
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,    
      },
    });
  
    return EventReports;
  };
  