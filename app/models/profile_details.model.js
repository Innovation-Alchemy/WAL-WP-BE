module.exports = (sequelize, Sequelize) => {
    const ProfileDetails = sequelize.define("profile_details", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
     
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      facebook: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instagram: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twitter: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linkedin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cover_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
   
    },{ timestamps: true });
  
    return ProfileDetails;
  };
  