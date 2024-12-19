const db = require("../models");
const Permission = db.Permission;
const User = db.User;


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
  const { name } = req.body;
  try {
    const newPermission = await Permission.create({ name });
    res.status(201).json({ success: true, data: newPermission });
  } catch (error) {
    const status =
      error.name === "SequelizeUniqueConstraintError" ? 409 : 400;
    res.status(status).json({ message: "Error adding permission", error: error.message });
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
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    permission.name = name;
    await permission.save();
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
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

    // Update permissions
    const currentPermissions = Array.isArray(user.permissions) ? user.permissions : [];
    const newPermissions = [...new Set([...currentPermissions, ...validPermissionIds])]; // Ensure uniqueness
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
  const { id } = req.params; // User ID
  const { permissionIds } = req.body;

  try {
    // Validate permission IDs
    if (!Array.isArray(permissionIds) || !permissionIds.every((pid) => Number.isInteger(pid))) {
      return res.status(400).json({ message: "Permission IDs must be an array of integers" });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove permissions
    const currentPermissions = Array.isArray(user.permissions) ? user.permissions : [];
    const updatedPermissions = currentPermissions.filter((pid) => !permissionIds.includes(pid));
    user.permissions = updatedPermissions;
    await user.save();

    res.status(200).json({ message: "Permissions removed successfully", data: updatedPermissions });
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
