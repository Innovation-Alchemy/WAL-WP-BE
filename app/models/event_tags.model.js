module.exports = (sequelize, DataTypes) => {
    const EventTags = sequelize.define("EventTags", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
       
      },
    });
  
    return EventTags;
  };
  