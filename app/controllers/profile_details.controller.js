// Controller for the new User model
const db = require("../models");
const Profile = db.profile_Details;


exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.status(200).json({ message: "Profiles retrieved successfully", data: profiles });
  } catch (error) {
    console.error("Error retrieving profiles:", error);
    res.status(500).json({ message: "Error retrieving profiles", error: error.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ message: "Profile retrieved successfully", data: profile });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Error retrieving profile", error: error.message });
  }
};

exports.createProfile = async (req, res) => {
    try {
      const { name, user_id, description, website, facebook, instagram, twitter, linkedin, address, city } = req.body;
  
      // Check if the user already has a profile
      const existingProfile = await Profile.findOne({ where: { user_id } });
      if (existingProfile) {
        return res.status(400).json({ message: "User already has a profile" });
      }
  
      // Handle file uploads
      let profile_picture = null;
      let cover_photo = null;
  
      if (req.files) {
        if (req.files["profile_picture"]) {
          profile_picture =
            process.env.NODE_ENV === "production"
              ? `https://yourdomain.com/${req.files["profile_picture"][0].path.replace(/\\\\/g, "/")}`
              : `http://localhost:8080/${req.files["profile_picture"][0].path.replace(/\\\\/g, "/")}`;
        }
        if (req.files["cover_photo"]) {
          cover_photo =
            process.env.NODE_ENV === "production"
              ? `https://yourdomain.com/${req.files["cover_photo"][0].path.replace(/\\\\/g, "/")}`
              : `http://localhost:8080/${req.files["cover_photo"][0].path.replace(/\\\\/g, "/")}`;
        }
      }
  
      // Create the profile
      const newProfile = await Profile.create({
        name,
        user_id,
        description,
        website,
        facebook,
        instagram,
        twitter,
        linkedin,
        address,
        city,
        profile_picture,
        cover_photo,
      });
  
      res.status(201).json({ message: "Profile created successfully", data: newProfile });
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Error creating profile", error: error.message });
    }
  };
  

exports.updateProfile = async (req, res) => {
  try {
    const profileId = req.params.id;

    const profile = await Profile.findByPk(profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const { name, description, website, facebook, instagram, twitter, linkedin, address, city } = req.body;

    let profile_picture = profile.profile_picture;
    let cover_photo = profile.cover_photo;

    if (req.files) {
      if (req.files["profile_picture"]) {
        profile_picture =
          process.env.NODE_ENV === "production"
            ? `https://yourdomain.com/${req.files["profile_picture"][0].path.replace(/\\/g, "/")}`
            : `http://localhost:8080/${req.files["profile_picture"][0].path.replace(/\\/g, "/")}`;
      }
      if (req.files["cover_photo"]) {
        cover_photo =
          process.env.NODE_ENV === "production"
            ? `https://yourdomain.com/${req.files["cover_photo"][0].path.replace(/\\/g, "/")}`
            : `http://localhost:8080/${req.files["cover_photo"][0].path.replace(/\\/g, "/")}`;
      }
    }

    await profile.update({
      name,
      description,
      website,
      facebook,
      instagram,
      twitter,
      linkedin,
      address,
      city,
      profile_picture,
      cover_photo,
    });

    res.status(200).json({ message: "Profile updated successfully", data: profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.destroy();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};
