module.exports = (sequelize, Sequelize) => {
    const BlogReports = sequelize.define("BlogReports", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      blog_id: {
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
  
    return BlogReports;
  };
  