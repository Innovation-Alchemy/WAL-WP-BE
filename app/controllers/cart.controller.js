const db = require("../models");
const Cart = db.Cart;
const Stock = db.Stock;
const Product = db.Product;
const ProductPurchase = db.ProductPurchase;
const User = db.User;
const Notification = db.notification;

/**
 * 1) Add product to cart
 * - If user’s pending cart doesn’t exist, create a new cart
 *   but *immediately* populate it with the item.
 * - If user does have a pending cart, parse its `products` and add or update the item.
 */
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity, color, size } = req.body;

    if (!user_id || !product_id || !quantity || !color || !size) {
      return res.status(400).json({
        message: "User ID, product ID, quantity, color, and size are required."
      });
    }

    // Validate stock
    const stock = await Stock.findOne({ where: { product_id, color, size } });
    if (!stock) {
      return res.status(404).json({ message: "Product not available in stock." });
    }
    if (stock.quantity_in_stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock available." });
    }

    // Validate product
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // 1) Attempt to find a pending cart for this user
    let cart = await Cart.findOne({ where: { user_id, status: "pending" } });

    if (!cart) {
      // 2) If no cart, let's *immediately* build the new cart with the item included
      const newItem = {
        product_id,
        color,
        size,
        quantity,
        price: product.price
      };

      // Single-item array
      const newProductsArray = [ newItem ];
      const total_price = product.price * quantity;

      // Directly create a new cart with the item in it
      cart = await Cart.create({
        user_id,
        products: newProductsArray,  // set as a JavaScript array
        total_price
      });

      // Return
      return res.status(200).json({
        message: "Product added to a brand-new cart successfully.",
        data: cart
      });
    }

    // If we found an existing cart, parse the `products` field if needed
    let productsArray = cart.products;
    if (!Array.isArray(productsArray)) {
      try {
        productsArray = JSON.parse(productsArray);
      } catch (err) {
        console.error("Error parsing existing cart products:", err);
        // If parse fails, assume empty array (or you can throw an error)
        productsArray = [];
      }
    }

    // 3) Check if the product variant exists in that array
    const existingIndex = productsArray.findIndex(
      (p) =>
        p.product_id === product_id &&
        p.color === color &&
        p.size === size
    );

    if (existingIndex > -1) {
      // Increase quantity
      productsArray[existingIndex].quantity += quantity;
    } else {
      // Add new item
      productsArray.push({
        product_id,
        color,
        size,
        quantity,
        price: product.price
      });
    }

    // 4) Recalc total
    const newTotal = productsArray.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // 5) Update existing cart
    await cart.update({
      products: productsArray,
      total_price: newTotal
    });

    // Return updated cart
    const updatedCart = await Cart.findByPk(cart.id);
    return res.status(200).json({
      message: "Product added to cart successfully.",
      data: updatedCart
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Error adding to cart.", error: error.message });
  }
};

// 2. Get cart by ID (no user check here; we fetch directly by cart_id)
exports.getCartById = async (req, res) => {
  try {
    const { cart_id } = req.params;

    const cart = await Cart.findByPk(cart_id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    let products = cart.products;
    if (!Array.isArray(products)) {
      try {
        products = JSON.parse(products);
      } catch (err) {
        console.error("Error parsing cart products:", err);
        return res.status(400).json({
          message: "Cart products data is invalid, cannot parse.",
        });
      }
    }

    res.status(200).json({
      message: "Cart retrieved successfully.",
      data: {
        ...cart.toJSON(),
        products,
      },
    });
  } catch (error) {
    console.error("Error retrieving cart by ID:", error);
    res.status(500).json({ message: "Error retrieving cart.", error: error.message });
  }
};

/**3.
 * Update the quantity of an item in the cart
 * - Now checks if cart.status is 'checked_out'
 * - If newQuantity <= 0, remove the item
 * - If newQuantity > stock, throw an error
 */
exports.updateCartQuantity = async (req, res) => {
  try {
    const { cart_id, product_id, color, size, newQuantity } = req.body;

    if (!cart_id || !product_id || !color || !size || newQuantity === undefined) {
      return res.status(400).json({
        message:
          "cart_id, product_id, color, size, and newQuantity are required to update cart quantity.",
      });
    }

    // 1. Find the cart by ID; must still be pending
    const cart = await Cart.findOne({ where: { id: cart_id } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found with that cart_id." });
    }

    // 2. Check if cart is already checked out
    if (cart.status === "checked_out") {
      return res
        .status(400)
        .json({ message: "Cannot update items in a cart that is already checked out." });
    }

    // 3. Parse cart products if needed
    let products = cart.products;
    if (!Array.isArray(products)) {
      try {
        products = JSON.parse(products);
      } catch (err) {
        console.error("Error parsing cart products:", err);
        return res.status(400).json({
          message: "Cart products data is invalid; cannot update quantity.",
        });
      }
    }

    // 4. Find the item
    const itemIndex = products.findIndex(
      (p) => p.product_id === product_id && p.color === color && p.size === size
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        message: `Item not found in cart: product_id=${product_id}, color=${color}, size=${size}.`,
      });
    }

    // 5. If newQuantity <= 0 => remove item
    if (newQuantity <= 0) {
      products.splice(itemIndex, 1);
    } else {
      // Check if the new quantity is available in stock
      const stock = await Stock.findOne({ where: { product_id, color, size } });
      if (!stock) {
        return res.status(404).json({
          message: `Stock not found for product_id=${product_id}, color=${color}, size=${size}.`,
        });
      }
      if (stock.quantity_in_stock < newQuantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock available for new quantity ${newQuantity}.` });
      }

      // Update the item quantity
      products[itemIndex].quantity = newQuantity;
    }

    // 6. Recalculate total price
    const total_price = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // 7. Update cart
    await cart.update({ products, total_price });

    res.status(200).json({
      message: "Cart item quantity updated successfully.",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ message: "Error updating cart item.", error: error.message });
  }
};

/**4.
 * Remove product from cart
 * - Checks if cart is pending
 * - Removes the product from cart if found
 */
exports.removeProductFromCart = async (req, res) => {
  try {
    const { cart_id, product_id, color, size } = req.body;

    if (!cart_id || !product_id || !color || !size) {
      return res.status(400).json({
        message: "cart_id, product_id, color, and size are required to remove a product from the cart.",
      });
    }

    // 1. Find the cart by ID
    const cart = await Cart.findOne({ where: { id: cart_id } });
    if (!cart) {
      return res.status(404).json({ message: "No cart found with that cart_id." });
    }

    // 2. Check if cart is already checked out
    if (cart.status === "checked_out") {
      return res
        .status(400)
        .json({ message: "Cannot remove items from a cart that is already checked out." });
    }

    // 3. Parse cart products if needed
    let products = cart.products;
    if (!Array.isArray(products)) {
      try {
        products = JSON.parse(products);
      } catch (parseErr) {
        console.error("Error parsing cart products:", parseErr);
        return res.status(400).json({
          message: "Cart products data is invalid, cannot parse to remove item.",
        });
      }
    }

    // 4. Find the product
    const index = products.findIndex(
      (p) => p.product_id === product_id && p.color === color && p.size === size
    );

    if (index === -1) {
      return res.status(404).json({
        message: `Product not found in cart: product_id=${product_id}, color=${color}, size=${size}.`,
      });
    }

    // 5. Remove
    const removedProduct = products.splice(index, 1);

    // 6. Recalc total
    const total_price = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    await cart.update({ products, total_price });

    res.status(200).json({
      message: "Product removed from cart successfully.",
      data: { cart, removedProduct },
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Error removing product from cart.", error: error.message });
  }
};


// 5. Checkout cart
exports.checkoutCart = async (req, res) => {
  try {
    // We can still pass user_id or cart_id; let's do user_id for convenience
    const { user_id } = req.body;

    const cart = await Cart.findOne({ where: { user_id, status: "pending" } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Parse
    let products = cart.products;
    if (!Array.isArray(products)) {
      try {
        products = JSON.parse(products);
      } catch (err) {
        console.error("Error parsing cart:", err);
        return res
          .status(400)
          .json({ message: "Cart products invalid, cannot parse." });
      }
    }

    if (products.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    for (const { product_id, color, size, quantity, price } of products) {
      const stock = await Stock.findOne({ where: { product_id, color, size } });
      if (!stock) {
        return res.status(404).json({
          message: `No stock for product_id=${product_id}, color=${color}, size=${size}.`,
        });
      }
      if (stock.quantity_in_stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product_id=${product_id}, color=${color}, size=${size}.`,
        });
      }

      // Deduct
      await stock.update({ quantity_in_stock: stock.quantity_in_stock - quantity });

      // Low stock?
      if (stock.quantity_in_stock <= stock.stock_alert) {
        console.warn(`Low stock for product_id=${product_id}, color=${color}, size=${size}.`);
        const admins = await User.findAll({ where: { role: "Admin" } });
        if (admins.length > 0) {
          const notifications = admins.map((admin) => ({
            user_id: admin.id,
            product_id,
            alerts: "low-stock",
            message: `Stock is low for product_id=${product_id}, color=${color}, size=${size}. Remaining: ${stock.quantity_in_stock}`,
            is_read: false,
          }));
          await Notification.bulkCreate(notifications);
        }
      }

      // Add purchase record
      await ProductPurchase.create({
        product_id,
        user_id,
        color,
        size,
        price,
        quantity,
        quantity_unit: stock.quantity_unit,
        total_price: price * quantity,
        status: "completed",
      });
    }

    // Mark the cart as "checked_out"
    await cart.update({ status: "checked_out" });

    res.status(200).json({
      message: "Cart checked out successfully and purchase records created.",
      data: cart,
    });
  } catch (error) {
    console.error("Error checking out cart:", error);
    res.status(500).json({
      message: "Error checking out cart.",
      error: error.message,
    });
  }
};

