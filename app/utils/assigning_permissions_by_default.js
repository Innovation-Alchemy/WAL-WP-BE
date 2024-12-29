const db = require("../models");
const Permission = db.Permission;
const User = db.User;

// Function to assign default permissions based on role
const assignDefaultPermissions = async (userId, role) => {
  try {
    // Fetch all permissions from the database
    const allPermissions = await Permission.findAll();

    // Define role-based permissions
    const rolePermissionsMap = {
      Admin: allPermissions.map((perm) => perm.id), // Assign all permissions
      Organizer: allPermissions
        .filter((perm) =>
          ["create-event", "update-event", "delete-event",
           "create-ticket", "update-ticket", "delete-ticket",
           "create-blogs","update-blogs","delete-blogs",
           "create-coupon","update-coupon","delete-coupon",
           "create-product","update-product","delete-product",
           "create-operataor",
           "read-product-purchase","create-product-purchase","update-product-purchase","delete-product-purchase",
           "create-profile", "update-profile",  "read-permission"
          ].includes(perm.name)
        )
        .map((perm) => perm.id),
      Operator: allPermissions
        .filter((perm) =>
          ["create-profile", "update-profile", "read-permission",
          "read-product-purchase","create-product-purchase","update-product-purchase","delete-product-purchase"].includes(perm.name)
        )
        .map((perm) => perm.id),
      User: allPermissions
        .filter((perm) =>
          ["create-profile", "update-profile", "read-permission",
          "read-product-purchase","create-product-purchase","update-product-purchase","delete-product-purchase"].includes(perm.name)
        )
        .map((perm) => perm.id),
    };

    // Get permissions for the specified role
    const rolePermissions = rolePermissionsMap[role] || [];

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Assign permissions to the user
    user.permissions = rolePermissions;
    await user.save();

    return { success: true, message: "Permissions assigned successfully", data: rolePermissions };
  } catch (error) {
    console.error("Error assigning permissions:", error);
    throw new Error(error.message);
  }
};

module.exports = {assignDefaultPermissions}