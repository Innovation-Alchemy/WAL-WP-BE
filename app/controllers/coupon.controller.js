const db = require("../models");
const Coupon = db.Coupon;

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.status(200).json({ message: "Coupons retrieved successfully", data: coupons });
  } catch (error) {
    console.error("Error retrieving coupons:", error);
    res.status(500).json({ message: "Error retrieving coupons", error: error.message });
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json({ message: "Coupon retrieved successfully", data: coupon });
  } catch (error) {
    console.error("Error retrieving coupon:", error);
    res.status(500).json({ message: "Error retrieving coupon", error: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const {
      user_id,
      coupon_key,
      discount_percentage,
      discount_in_dollar,
      max_uses,
      valid_from,
      valid_to,
      min_price,
    } = req.body;

    // Check if the `coupon_key` already exists
    const existingCoupon = await Coupon.findOne({ where: { coupon_key } });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon key already exists" });
    }

    // Ensure `valid_from` is before `valid_to`
    if (new Date(valid_from) >= new Date(valid_to)) {
      return res.status(400).json({ message: "`valid_from` must be before `valid_to`" });
    }

    // Create the coupon
    const newCoupon = await Coupon.create({
      user_id,
      coupon_key,
      discount_percentage,
      discount_in_dollar,
      max_uses,
      valid_from,
      valid_to,
      min_price,
    });

    res.status(201).json({ message: "Coupon created successfully", data: newCoupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Error creating coupon", error: error.message });
  }
};


exports.applyCoupon = async (req, res) => {
  const { coupon_key, total_price, user_id } = req.body;

  try {
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

    // Apply discount based on `min_price`
    let discount = 0;
    if (total_price >= coupon.min_price) {
      // Apply percentage discount if `total_price` meets or exceeds `min_price`
      discount = (total_price * coupon.discount_percentage) / 100;
    } else {
      // Apply fixed dollar discount if `total_price` is below `min_price`
      discount = coupon.discount_in_dollar;
    }

    // Ensure discount does not exceed the total price
    const final_price = Math.max(total_price - discount, 0);

    // Update the coupon's current uses
    coupon.current_uses += 1;
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
    res.status(200).json({ message: "Coupon updated successfully", data: coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({ message: "Error updating coupon", error: error.message });
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
    res.status(500).json({ message: "Error deleting coupon", error: error.message });
  }
};
