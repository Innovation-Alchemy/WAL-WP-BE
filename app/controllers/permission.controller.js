const db = require("../models");
const Permission = db.Permission;
const User = db.User;
const { addPermissionSchema, assignPermissionSchema, removePermissionSchema,} = require("../utils/validations");

// ** Get All Permissions **
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      attributes: ['id', 'name'],
    });
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    console.error("Error retrieving permissions:", error);
    res.status(500).json({ message: "Error retrieving permissions", error: error.message });
  }
};

// ** Add a New Permission **
exports.addPermission = async (req, res) => {
  const { error } = addPermissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { name } = req.body;
    const newPermission = await Permission.create({ name });
    res.status(201).json({ success: true, data: newPermission });
  } catch (error) {
    const status = error.name === 'SequelizeUniqueConstraintError' ? 409 : 400;
    res.status(status).json({ message: 'Error adding permission', error: error.message });
  }
};

// ** Get Permission by ID **
exports.getPermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByPk(id, {
      attributes: ['id', 'name'],
    });
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving permission", error: error.message });
  }
};

// ** Update Permission by ID **
exports.updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Check if the permission exists
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    // Update the name if provided
    if (name) {
      permission.name = name;
    }

    // Save the updated permission
    await permission.save();

    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Permission name must be unique",
        error: error.errors.map((e) => e.message),
      });
    }

    // Handle other errors
    console.error("Error updating permission:", error);
    res.status(500).json({ message: "Error updating permission", error: error.message });
  }
};


// ** Delete Permission by ID **
exports.deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    await permission.destroy();
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting permission", error: error.message });
  }
};

// ** Assign Permissions to User **
exports.assignPermissions = async (req, res) => {
  const { error } = assignPermissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { id } = req.params; // User ID
  const { permissionIds } = req.body;

  try {
    // Validate permission IDs
    if (!Array.isArray(permissionIds) || !permissionIds.every((pid) => Number.isInteger(pid))) {
      return res.status(400).json({ message: "Permission IDs must be an array of integers" });
    }

    // Validate that permissions exist
    const existingPermissions = await Permission.findAll({
      where: { id: permissionIds },
      attributes: ['id'],
    });
    const validPermissionIds = existingPermissions.map((perm) => perm.id);
    const invalidIds = permissionIds.filter((id) => !validPermissionIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "Some permission IDs do not exist", invalidIds });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse existing permissions
    let currentPermissions = [];
    if (Array.isArray(user.permissions)) {
      currentPermissions = user.permissions;
    } else if (typeof user.permissions === 'string') {
      try {
        const parsed = JSON.parse(user.permissions);
        if (Array.isArray(parsed)) {
          currentPermissions = parsed;
        }
      } catch (e) {
        // If not parseable, default to empty array
        currentPermissions = [];
      }
    }

    // Combine old and new permissions, ensuring uniqueness
    const newPermissions = [...new Set([...currentPermissions, ...validPermissionIds])];

    // Save updated permissions
    user.permissions = newPermissions;
    await user.save();

    res.status(200).json({ message: "Permissions assigned successfully", data: newPermissions });
  } catch (error) {
    console.error("Error assigning permissions:", error);
    res.status(500).json({ message: "Error assigning permissions", error: error.message });
  }
};

// ** Remove Permissions from User **
exports.removePermissions = async (req, res) => {
  const { error } = removePermissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { id } = req.params; // User ID
  const { permissionIds } = req.body;

  try {
    // 1. Validate that permissionIds is an array of integers
    if (!Array.isArray(permissionIds) || !permissionIds.every(pid => Number.isInteger(pid))) {
      return res.status(400).json({ message: "Permission IDs must be an array of integers." });
    }

    // 2. Validate that all provided permission IDs exist
    const existingPermissions = await Permission.findAll({
      where: { id: permissionIds },
      attributes: ['id']
    });
    const existingPermissionIds = existingPermissions.map(perm => perm.id);
    const invalidPermissionIds = permissionIds.filter(pid => !existingPermissionIds.includes(pid));

    if (invalidPermissionIds.length > 0) {
      return res.status(400).json({
        message: "Some permission IDs to remove do not exist.",
        invalidPermissionIds
      });
    }

    // 3. Find the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 4. Ensure user.permissions is an array
    let existingUserPermissions = [];
    if (Array.isArray(user.permissions)) {
      existingUserPermissions = user.permissions;
    } else if (typeof user.permissions === 'string') {
      // Attempt to parse if it's stored as a stringified JSON
      try {
        const parsed = JSON.parse(user.permissions);
        if (Array.isArray(parsed)) {
          existingUserPermissions = parsed;
        }
      } catch (e) {
        // If parsing fails or doesn't yield an array, fallback to empty
        existingUserPermissions = [];
      }
    } else if (!user.permissions) {
      // If null or undefined, use an empty array
      existingUserPermissions = [];
    }

    // 5. Determine which permissions are actually removable
    const permissionsToRemove = permissionIds.filter(pid => existingUserPermissions.includes(pid));
    const notFoundPermissions = permissionIds.filter(pid => !existingUserPermissions.includes(pid));

    // 6. Remove the permissions found in the user's current permissions
    let updatedPermissions = existingUserPermissions;
    if (permissionsToRemove.length > 0) {
      updatedPermissions = existingUserPermissions.filter(pid => !permissionsToRemove.includes(pid));
      user.permissions = updatedPermissions;
      await user.save();
    }

    // 7. Construct a response message
    let message;
    if (permissionsToRemove.length > 0 && notFoundPermissions.length > 0) {
      message = `${permissionsToRemove.length} permission(s) removed. ${notFoundPermissions.length} permission(s) were not found on the user.`;
    } else if (permissionsToRemove.length > 0) {
      message = `${permissionsToRemove.length} permission(s) removed.`;
    } else {
      message = "No permissions were removed because none of the provided permission IDs were assigned to the user.";
    }

    // 8. Send the response
    res.status(200).json({
      success: true,
      message,
      removed: permissionsToRemove,
      notFound: notFoundPermissions,
      currentPermissions: updatedPermissions
    });

  } catch (error) {
    console.error("Error removing permissions:", error);
    res.status(500).json({ message: "Error removing permissions", error: error.message });
  }
};

// ** Get Permissions for a User **
exports.getPermissions = async (req, res) => {
  const { id } = req.params; // User ID
  try {
    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve permissions
    const permissions = Array.isArray(user.permissions) ? user.permissions : [];
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    console.error("Error retrieving permissions:", error);
    res.status(500).json({ message: "Error retrieving permissions", error: error.message });
  }
};
