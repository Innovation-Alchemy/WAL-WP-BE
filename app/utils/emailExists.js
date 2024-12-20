const db = require('../models');
const {User } = db;

/**
 * Checks if an email exists in any of the specified tables.
 * @param {string} email - The email to check for uniqueness.
 * @returns {Promise<boolean>} - Returns `true` if the email exists, otherwise `false`.
 */
const emailExists = async (email) => {
  const emailFound =(await User.findOne({ where: { email } }));

  return !!emailFound; // Return `true` if emailFound is not null
};

module.exports = emailExists;
