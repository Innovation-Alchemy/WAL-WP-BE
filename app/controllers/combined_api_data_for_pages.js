const db = require("../models");
const { Op } = require("sequelize");
const Event = db.Event;
const Tickets = db.Ticket;
const Stock = db.Stock;
const Notification = db.notification;
const Products = db.Product;
const ProductPurchase = db.ProductPurchase;
const Blog = db.Blog;

exports.getAdminPanelData = async (req, res) => {
  try {
    // COUNTS SECTION
    const totalEvents = await Event.count();
    const totalApprovedEvents = await Event.count({ where: { is_approved: true } });
    const eventsRevenue = await Event.sum("total_revenue") || 0;
    const ticketsSold = await Tickets.sum("tickets_sold_count") || 0;
    const last10ApprovedEvents = await Event.findAll({
      where: { is_approved: true },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    // STORE SECTION
    const totalMerch = await Products.count();
    const merchRevenue = (await ProductPurchase.sum("total_price")) || 0; // Revenue from completed purchases
    const merchSold = (await ProductPurchase.sum("quantity")) || 0; // Total quantity sold
    const top10SoldProducts = await ProductPurchase.findAll({
      attributes: [
        "product_id",
        [db.sequelize.fn("SUM", db.sequelize.col("quantity")), "totalSold"],
      ],
      group: ["product_id"],
      order: [[db.sequelize.literal("totalSold"), "DESC"]],
      limit: 10,
      include: [
        {
          model: Products,
          attributes: ["id", "name", "price", "image"],
        },
      ],
    });

    const top10SoldProductsMapped = top10SoldProducts.map((product) => ({
      id: product.Product.id,
      name: product.Product.name,
      price: product.Product.price,
      image: product.Product.image,
      totalSold: product.dataValues.totalSold,
    }));

  // NOTIFICATIONS SECTION
  const totalNotifications = await Notification.count();
  const totalAlerts = await Notification.count({ where: { alerts: { [Op.ne]: null } } });

  const notificationsWithDetails = await Notification.findAll({
    include: [
      {
        model: Blog,
        attributes: ["id", "title"], // Fetch Blog details
      },
      {
        model: Event,
        attributes: ["id", "title"], // Fetch Event details
      },
    ],
    attributes: ["id", "notification_type", "alerts", "message", "is_read"],
  });

  const notificationsMapped = notificationsWithDetails.map((notification) => {
    let relatedEntityType = null;
    let relatedEntity = null;

    if (notification.Blog) {
      relatedEntityType = "Blog";
      relatedEntity = {
        id: notification.Blog.id,
        title: notification.Blog.title,
      };
    } else if (notification.Event) {
      relatedEntityType = "Event";
      relatedEntity = {
        id: notification.Event.id,
        title: notification.Event.title,
      };
    }

    return {
      id: notification.id,
      notification_type: notification.notification_type,
      alerts: notification.alerts,
      message: notification.message,
      is_read: notification.is_read,
      relatedEntityType, // Blog or Event
      relatedEntity, // Entity details
    };
  });
   // BLOGS SECTION
   const totalBlogs = await Blog.count({ where: { is_approved: true } });
   const totalViews = await db.views.count(); // Total blog views
   const totalLikes = await db.likes.count(); // Total blog likes
   const totalComments = await db.comments.count(); // Total blog comments
   const totalInteractions = totalLikes + totalComments;

   const last10ApprovedBlogs = await Blog.findAll({
     where: { is_approved: true },
     order: [["createdAt", "DESC"]],
     limit: 10,
     include: [
       {
         model: db.views,
         attributes: ["id"], // Fetch only necessary attributes
       },
       {
         model: db.likes,
         attributes: ["id"], // Fetch only necessary attributes
       },
       {
         model: db.comments,
         attributes: ["id"], // Fetch only necessary attributes
       },
     ],
   });

   const last10ApprovedBlogsMapped = last10ApprovedBlogs.map((blog) => ({
     id: blog.id,
     title: blog.title,
     content: blog.content,
     description: blog.description,
     tags: blog.tags,
     files: blog.files,
     views: blog.views ? blog.views.length : 0, // Null-safe check
     likes: blog.likes ? blog.likes.length : 0, // Null-safe check
     comments: blog.comments ? blog.comments.length : 0, // Null-safe check
   }));
    // Combine all data
    const adminPanelData = {
      counts: {
        totalEvents,
        totalApprovedEvents,
        eventsRevenue,
        ticketsSold,
        last10ApprovedEvents: last10ApprovedEvents.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date_time: event.date_time,
          location: event.location,
          total_revenue: event.total_revenue,
        })),
      },
      store: {
        totalMerch,
        merchRevenue,
        merchSold,
        top10SoldProducts: top10SoldProductsMapped,
      },
      notifications: {
        totalNotifications,
        totalAlerts,
        notifications: notificationsMapped,
      },
      blogs: {
        totalBlogs,
        totalViews,
        totalInteractions,
        last10ApprovedBlogs: last10ApprovedBlogsMapped,
      },
    };

    res.status(200).json(adminPanelData);
  } catch (error) {
    console.error("Error retrieving admin panel data:", error);
    res.status(500).json({
      message: "Error retrieving admin panel data",
      error: error.message,
    });
  }
};

