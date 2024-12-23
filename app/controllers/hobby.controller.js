const db = require("../models");
const Hobby = db.Hobby;
const User = db.User;
const {
  addHobbySchema,
  assignHobbySchema,
  removeHobbySchema,
} = require("../utils/validations");

exports.getAllHobbies = async (req, res) => {
  try {
    const hobbies = await db.Hobby.findAll({ attributes: ["id", "name"] });
    res.status(200).json({ success: true, data: hobbies });
  } catch (error) {
    console.error("Error retrieving hobbies:", error);
    res
      .status(500)
      .json({ message: "Error retrieving hobbies", error: error.message });
  }
};

exports.getHobbyById = async (req, res) => {
  const { id } = req.params; // Hobby ID

  try {
    // Find the hobby by ID
    const hobby = await db.Hobby.findByPk(id, { attributes: ["id", "name"] });

    if (!hobby) {
      return res.status(404).json({ message: "Hobby not found" });
    }

    res
      .status(200)
      .json({ message: "Hobby retrieved successfully", data: hobby });
  } catch (error) {
    console.error("Error retrieving hobby:", error);
    res
      .status(500)
      .json({ message: "Error retrieving hobby", error: error.message });
  }
};

exports.addHobby = async (req, res) => {
  const { error } = addHobbySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { name } = req.body;
    const newHobby = await Hobby.create({ name });
    res.status(201).json({ success: true, data: newHobby });
  } catch (error) {
    const status = error.name === "SequelizeUniqueConstraintError" ? 409 : 400;
    res
      .status(status)
      .json({ message: "Error adding hobby", error: error.message });
  }
};

// ** Assign Hobbies to User **
exports.assignHobbiesToUser = async (req, res) => {
  const { error } = assignHobbySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { id } = req.params; // User ID
  const { hobbyIds } = req.body; // Array of Hobby IDs to assign

  try {
    // Validate hobby IDs
    if (
      !Array.isArray(hobbyIds) ||
      !hobbyIds.every((hid) => Number.isInteger(hid))
    ) {
      return res
        .status(400)
        .json({ message: "Hobby IDs must be an array of integers" });
    }

    // Validate that hobbies exist in the database
    const existingHobbies = await Hobby.findAll({
      where: { id: hobbyIds },
      attributes: ["id"],
    });
    const validHobbyIds = existingHobbies.map((hobby) => hobby.id); // Valid hobby IDs
    const invalidIds = hobbyIds.filter((id) => !validHobbyIds.includes(id)); // Invalid IDs

    if (invalidIds.length > 0) {
      return res
        .status(400)
        .json({ message: "Some hobby IDs do not exist", invalidIds });
    }

    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse existing hobbies
    let currentHobbies = [];
    if (Array.isArray(user.hobbies)) {
      currentHobbies = user.hobbies;
    } else if (typeof user.hobbies === "string") {
      try {
        const parsed = JSON.parse(user.hobbies);
        if (Array.isArray(parsed)) {
          currentHobbies = parsed;
        }
      } catch (e) {
        currentHobbies = []; // Default to empty array if parsing fails
      }
    }

    // Combine existing and new hobbies, ensuring uniqueness
    const updatedHobbies = [...new Set([...currentHobbies, ...validHobbyIds])];

    // Save updated hobbies back to the database
    user.hobbies = updatedHobbies;
    await user.save();

    res
      .status(200)
      .json({ message: "Hobbies assigned successfully", data: updatedHobbies });
  } catch (error) {
    console.error("Error assigning hobbies:", error);
    res
      .status(500)
      .json({ message: "Error assigning hobbies", error: error.message });
  }
};

// ** Remove Hobbies from User **
exports.removeHobbiesFromUser = async (req, res) => {
  const { error } = removeHobbySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { id } = req.params; // User ID
  const { hobbyIds } = req.body; // Hobby IDs to remove

  try {
    // 1. Validate that `hobbyIds` is an array of integers
    if (
      !Array.isArray(hobbyIds) ||
      !hobbyIds.every((hid) => Number.isInteger(hid))
    ) {
      return res
        .status(400)
        .json({ message: "Hobby IDs must be an array of integers." });
    }

    // 2. Validate that all provided hobby IDs exist
    const existingHobbies = await Hobby.findAll({
      where: { id: hobbyIds },
      attributes: ["id"],
    });
    const validHobbyIds = existingHobbies.map((hobby) => hobby.id);
    const invalidHobbyIds = hobbyIds.filter(
      (id) => !validHobbyIds.includes(id)
    );

    if (invalidHobbyIds.length > 0) {
      return res.status(400).json({
        message: "Some hobby IDs to remove do not exist.",
        invalidHobbyIds,
      });
    }

    // 3. Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. Ensure `user.hobbies` is an array
    let currentHobbies = [];
    if (Array.isArray(user.hobbies)) {
      currentHobbies = user.hobbies;
    } else if (typeof user.hobbies === "string") {
      // Attempt to parse if it's stored as a stringified JSON
      try {
        const parsed = JSON.parse(user.hobbies);
        if (Array.isArray(parsed)) {
          currentHobbies = parsed;
        }
      } catch (e) {
        currentHobbies = []; // Default to empty array if parsing fails
      }
    }

    // 5. Determine which hobbies can be removed
    const hobbiesToRemove = hobbyIds.filter((hid) =>
      currentHobbies.includes(hid)
    );
    const notFoundHobbies = hobbyIds.filter(
      (hid) => !currentHobbies.includes(hid)
    );

    // 6. Remove the hobbies found in the user's current hobbies
    let updatedHobbies = currentHobbies;
    if (hobbiesToRemove.length > 0) {
      updatedHobbies = currentHobbies.filter(
        (hid) => !hobbiesToRemove.includes(hid)
      );
      user.hobbies = updatedHobbies;
      await user.save();
    }

    // 7. Construct a response message
    let message;
    if (hobbiesToRemove.length > 0 && notFoundHobbies.length > 0) {
      message = `${hobbiesToRemove.length} hobby/hobbies removed. ${notFoundHobbies.length} hobby/hobbies were not found on the user.`;
    } else if (hobbiesToRemove.length > 0) {
      message = `${hobbiesToRemove.length} hobby/hobbies removed.`;
    } else {
      message =
        "No hobbies were removed because none of the provided hobby IDs were assigned to the user.";
    }

    // 8. Send the response
    res.status(200).json({
      success: true,
      message,
      removed: hobbiesToRemove,
      notFound: notFoundHobbies,
      currentHobbies: updatedHobbies,
    });
  } catch (error) {
    console.error("Error removing hobbies:", error);
    res
      .status(500)
      .json({ message: "Error removing hobbies", error: error.message });
  }
};

exports.updateHobby = async (req, res) => {
  const { id } = req.params; // Hobby ID
  const { name } = req.body;

  try {
    // Find the hobby by ID
    const hobby = await db.Hobby.findByPk(id);
    if (!hobby) {
      return res.status(404).json({ message: "Hobby not found" });
    }

    // Update the hobby name
    hobby.name = name;
    await hobby.save();

    res
      .status(200)
      .json({ message: "Hobby updated successfully", data: hobby });
  } catch (error) {
    console.error("Error updating hobby:", error);
    res
      .status(500)
      .json({ message: "Error updating hobby", error: error.message });
  }
};

exports.deleteHobby = async (req, res) => {
  const { id } = req.params; // Hobby ID

  try {
    // Find the hobby by ID
    const hobby = await db.Hobby.findByPk(id);
    if (!hobby) {
      return res.status(404).json({ message: "Hobby not found" });
    }

    // Delete the hobby
    await hobby.destroy();

    res.status(200).json({ message: "Hobby deleted successfully" });
  } catch (error) {
    console.error("Error deleting hobby:", error);
    res
      .status(500)
      .json({ message: "Error deleting hobby", error: error.message });
  }
};
