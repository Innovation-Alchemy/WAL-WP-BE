const db = require("../models");
const Permission = db.Permission;

const checkPermission = (requiredPermissionName) => {
  return async (req, res, next) => {
    try {
      const user = req.user; // Assume user information is added to `req` by authentication middleware

      if (!user) {
        return res.status(403).json({ message: "User not authenticated" });
      }

      // Fetch all permissions of the user
      const userPermissions = user.permissions || [];

      // Fetch permission by name
      const permission = await Permission.findOne({ where: { name: requiredPermissionName } });

      if (!permission || !userPermissions.includes(permission.id)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Error checking permissions", error: error.message });
    }
  };
};

module.exports = checkPermission;
