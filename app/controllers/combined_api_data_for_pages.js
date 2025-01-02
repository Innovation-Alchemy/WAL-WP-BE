const db = require("../models");
const { Op } = require("sequelize");
const Event = db.Event;
const Tickets = db.Ticket;
const TicketsSold = db.TicketsSold;
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
    const merchRevenue = await ProductPurchase.sum("total_price") || 0; // Revenue from completed purchases
    const merchSold = await ProductPurchase.sum("quantity") || 0; // Total quantity sold
    const top10SoldProducts = await Products.findAll({
      order: [["quantity_in_stock", "ASC"]],
      limit: 10,
    });

    // NOTIFICATIONS SECTION
    const totalNotifications = await Notification.count();
    const totalAlerts = await Notification.count({ where: { alerts: { [Op.ne]: null } } });
    const notificationViews = {
      organizerApproval: await Notification.count({ where: { notification_type: "organizer-approval" } }),
      eventApproval: await Notification.count({ where: { notification_type: "event-approval" } }),
      blogApproval: await Notification.count({ where: { notification_type: "blog-approval" } }),
    };
    const alertsCounts = {
      lowStock: await Notification.count({ where: { alerts: "low-stock" } }),
      lowTickets: await Notification.count({ where: { alerts: "low-tickets" } }),
      reportEvent: await Notification.count({ where: { alerts: "report-event" } }),
      reportProduct: await Notification.count({ where: { alerts: "report-product" } }),
      reportBlog: await Notification.count({ where: { alerts: "report-blog" } }),
    };

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
    });

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
        top10SoldProducts: top10SoldProducts.map((product) => ({
          id: product.id,
          name: product.name,
          quantity_in_stock: product.quantity_in_stock,
          price: product.price,
        })),
      },
      notifications: {
        totalNotifications,
        totalAlerts,
        notificationViews,
        alertsCounts,
      },
      blogs: {
        totalBlogs,
        totalViews,
        totalInteractions,
        last10ApprovedBlogs: last10ApprovedBlogs.map((blog) => ({
          id: blog.id,
          title: blog.title,
          content: blog.content,
          description: blog.description,
          tags: blog.tags,
          files: blog.files,
        })),
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
