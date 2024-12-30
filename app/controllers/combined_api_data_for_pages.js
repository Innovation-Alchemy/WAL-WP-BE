const db = require("../models");
const Event = db.Event;
const { Op } = require("sequelize"); 

// Get all data for the homepage
exports.getHomePageData = async (req, res) => {
  try {
    // Fetch all static pages where key contains 'home'
    const staticPages = await StaticPage.findAll({
      where: {
        key: {
          [Op.like]: '%home%', // Fetch any key that contains 'home'
        },
      },
    });

    // Fetch 3 active team members
    const teamMembers = await TeamMember.findAll({
      where: { is_active: true },
      limit: 3,
    });

    // Fetch 3 trending articles (category = 'article')
    const trendingArticles = await DiscoverHerContent.findAll({
      where: { category: 'article', is_active: true },
      limit: 3,
    });

    // Fetch 3 upcoming events
    const upcomingEvents = await Event.findAll({
      where: { status: 'upcoming' },
      limit: 3,
    });

    // Combine the data into one response
    const responseData = {
      staticPages: staticPages.map(page => ({
        key:page.key,
        title:page.title,
        image: page.image,
        description: page.description,
        button_link: page.button_link,
        button_text: page.button_text,
      })),
      teamMembers: teamMembers.map(member => ({
        title: member.title,
        position: member.position,
        image: member.image,
      })),
      trendingArticles: trendingArticles.map(article => ({
        category: article.category,
        title: article.title,
        description: article.description,
        date: article.date,
        header_file: article.header_file,
      })),
      upcomingEvents: upcomingEvents.map(event => ({
        date: event.date,
        image:event.image,
        status: event.status,
        title: event.title,
        start_time: event.start_time,
        end_time: event.end_time,
        description: event.description,
      })),
    };

    // Send the response data
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving homepage data",
      error: error.message,
    });
  }
};
