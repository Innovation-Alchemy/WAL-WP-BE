const db = require("../models");
const Coupon = db.Coupon;
const User = db.User;
const {
  createCouponSchema,
  applyCouponSchema,
} = require("../utils/validations");

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();

    const enrichedCoupons = await Promise.all(
      coupons.map(async (coupon) => {
        // Parse `used_by_users` as an array
        let usedByUsers = [];
        if (coupon.used_by_users) {
          try {
            usedByUsers = Array.isArray(coupon.used_by_users)
              ? coupon.used_by_users
              : JSON.parse(coupon.used_by_users);
          } catch (parseError) {
            console.error("Error parsing used_by_users for coupon:", coupon.id, parseError);
          }
        }

        // Count the occurrences of each user ID
        const userUsageCounts = usedByUsers.reduce((acc, userId) => {
          acc[userId] = (acc[userId] || 0) + 1;
          return acc;
        }, {});

        // Fetch details of the user who created the coupon
        const createdBy = await User.findOne({
          where: { id: coupon.user_id },
          attributes: ["id", "name", "email"],
        });

        // Fetch user details for all unique IDs in `used_by_users`
        const uniqueUserIds = Object.keys(userUsageCounts).map(Number);
        const allUsers = await User.findAll({
          where: { id: uniqueUserIds },
          attributes: ["id", "name", "email"],
        });

        // Map users to include the usage count
        const usedBy = uniqueUserIds.map((userId) => {
          const user = allUsers.find((u) => u.id === userId);
          return {
            id: user?.id || userId,
            name: user?.name || "Unknown User",
            email: user?.email || "Unknown Email",
            usage_count: userUsageCounts[userId],
          };
        });

        return {
          coupon,
          created_by: createdBy ? [createdBy] : [], // Wrap in an array
          used_by: usedBy,
        };
      })
    );

    res
      .status(200)
      .json({ message: "Coupons retrieved successfully", data: enrichedCoupons });
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    res
      .status(500)
      .json({ message: "Error retrieving coupons", error: error.message });
  }
};


exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Parse `used_by_users` as an array
    let usedByUsers = [];
    if (coupon.used_by_users) {
      try {
        usedByUsers = Array.isArray(coupon.used_by_users)
          ? coupon.used_by_users
          : JSON.parse(coupon.used_by_users);
      } catch (parseError) {
        console.error("Error parsing used_by_users:", parseError);
        return res
          .status(500)
          .json({ message: "Error processing coupon usage data" });
      }
    }

    // Count the occurrences of each user ID
    const userUsageCounts = usedByUsers.reduce((acc, userId) => {
      acc[userId] = (acc[userId] || 0) + 1;
      return acc;
    }, {});

    // Fetch details of the user who created the coupon
    const createdBy = await User.findOne({
      where: { id: coupon.user_id },
      attributes: ["id", "name", "email"],
    });

    // Fetch user details for all unique IDs in `used_by_users`
    const uniqueUserIds = Object.keys(userUsageCounts).map(Number);
    const allUsers = await User.findAll({
      where: { id: uniqueUserIds },
      attributes: ["id", "name", "email"],
    });

    // Map users to include the usage count
    const usedBy = uniqueUserIds.map((userId) => {
      const user = allUsers.find((u) => u.id === userId);
      return {
        id: user?.id || userId,
        name: user?.name || "Unknown User",
        email: user?.email || "Unknown Email",
        usage_count: userUsageCounts[userId],
      };
    });

    // Format the response
    res.status(200).json({
      message: "Coupon retrieved successfully",
      data: {
        coupon,
        created_by: createdBy ? [createdBy] : [], // Wrap in an array
        used_by: usedBy,
      },
    });
  } catch (error) {
    console.error("Error retrieving coupon:", error);
    res
      .status(500)
      .json({ message: "Error retrieving coupon", error: error.message });
  }
};


exports.createCoupon = async (req, res) => {
  const { error } = createCouponSchema.validate(req.body);

  // Return validation error if any
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const {
      user_id,
      coupon_key,
      discount_percentage,
      discount_in_dollar,
      max_uses,
      allowed_uses_per_user,
      valid_from,
      valid_to,
      min_price,
    } = req.body;

    // Check if the `coupon_key` already exists
    const existingCoupon = await Coupon.findOne({ where: { coupon_key } });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon key already exists" });
    }

    // Create the coupon
    const newCoupon = await Coupon.create({
      user_id,
      coupon_key,
      discount_percentage,
      discount_in_dollar,
      max_uses,
      allowed_uses_per_user,
      valid_from,
      valid_to,
      min_price,
    });

    res
      .status(201)
      .json({ message: "Coupon created successfully", data: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res
      .status(500)
      .json({ message: "Error creating coupon", error: error.message });
  }
};

exports.applyCoupon = async (req, res) => {
  const { error } = applyCouponSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { coupon_key, total_price, user_id } = req.body;

  try {
    // Check if the user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the coupon by key
    const coupon = await Coupon.findOne({ where: { coupon_key } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Check if the coupon is valid based on the date range
    const now = new Date();
    if (now < new Date(coupon.valid_from) || now > new Date(coupon.valid_to)) {
      return res.status(400).json({ message: "Coupon is not valid at this time" });
    }

    // Check if the coupon has remaining uses
    if (coupon.current_uses >= coupon.max_uses) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    // Parse `used_by_users` into an array
    let usedByUsers;
    try {
      usedByUsers = Array.isArray(coupon.used_by_users)
        ? coupon.used_by_users
        : JSON.parse(coupon.used_by_users || "[]");
    } catch (parseError) {
      console.error("Error parsing used_by_users:", parseError);
      return res.status(500).json({ message: "Error processing coupon usage data" });
    }

    // Check how many times the user has used this coupon
    const userUses = usedByUsers.filter((id) => id === user_id).length;

    if (userUses >= coupon.allowed_uses_per_user) {
      return res.status(400).json({ message: "User has reached the maximum allowed uses for this coupon" });
    }

    // Apply the discount if total_price >= min_price
    let discount = 0;

    if (total_price >= coupon.min_price) {
      if (coupon.discount_percentage) {
        // Apply percentage discount
        discount = (total_price * coupon.discount_percentage) / 100;
      } else if (coupon.discount_in_dollar) {
        // Apply fixed dollar discount
        discount = coupon.discount_in_dollar;
      } else {
        return res.status(400).json({ message: "No discount available on this coupon" });
      }
    } else {
      return res.status(400).json({ message: "Total price does not meet the minimum price requirement for the coupon" });
    }

    // Ensure the discount does not exceed the total price
    const final_price = Math.max(total_price - discount, 0);

    // Update the coupon's usage
    coupon.current_uses += 1;

    // Track the user's usage
    usedByUsers.push(user_id);
    coupon.used_by_users = usedByUsers; // Store as an array

    await coupon.save();

    res.status(200).json({
      message: "Coupon applied successfully",
      discount,
      final_price,
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(500).json({ message: "Error applying coupon", error: error.message });
  }
};


exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    await coupon.update(req.body);
    res
      .status(200)
      .json({ message: "Coupon updated successfully", data: coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res
      .status(500)
      .json({ message: "Error updating coupon", error: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    await coupon.destroy();
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res
      .status(500)
      .json({ message: "Error deleting coupon", error: error.message });
  }
};
