/*const cron = require("node-cron");
const db = require("./app/models");
const TicketsSold = db.TicketsSold;

// Method to cancel expired reservations
const cancelExpiredReservations = async () => {
  try {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours

    console.log(`Checking for reservations older than: ${cutoffTime.toISOString()}`);

    const expiredReservations = await TicketsSold.findAll({
      where: {
        status: "reserved",
        reserved_at: {
          [db.Sequelize.Op.lt]: cutoffTime, // Compare with cutoff time
        },
      },
    });

    console.log(`Found ${expiredReservations.length} expired reservations.`);

    if (expiredReservations.length === 0) {
      return;
    }

    for (const reservation of expiredReservations) {
      console.log(`Canceling reservation ID: ${reservation.id}`);
      await reservation.update({ status: "canceled" });
    }
  } catch (err) {
    console.error("Error canceling expired reservations:", err);
  }
};

// Method to delete canceled reservations older than 24 hours
const deleteOldCanceledReservations = async () => {
  try {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours

    console.log(`Checking for canceled reservations older than: ${cutoffTime.toISOString()}`);

    const oldCanceledReservations = await TicketsSold.findAll({
      where: {
        status: "canceled",
        updatedAt: {
          [db.Sequelize.Op.lt]: cutoffTime, // Compare with cutoff time
        },
      },
    });

    console.log(`Found ${oldCanceledReservations.length} canceled reservations to delete.`);

    if (oldCanceledReservations.length === 0) {
      return;
    }

    for (const reservation of oldCanceledReservations) {
      console.log(`Deleting canceled reservation ID: ${reservation.id}`);
      await reservation.destroy();
    }
  } catch (err) {
    console.error("Error deleting old canceled reservations:", err);
  }
};

// Schedule the cron job
cron.schedule("* * * * *", async () => {
  console.log("Running cron job to handle reservations...");
  await cancelExpiredReservations();
  await deleteOldCanceledReservations();
});
*/