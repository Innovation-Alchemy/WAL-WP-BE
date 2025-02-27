const db = require("../models");
const Rating = db.Rating;

// Create and Save a new Rating
exports.create = (req, res) => {
    // Validate request
    if (!req.body.user_id || !req.body.product_id || !req.body.rating) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Rating
    const rating = {
        user_id: req.body.user_id,
        product_id: req.body.product_id,
        rating: req.body.rating,
        comment: req.body.comment
    };

    // Save Rating in the database
    Rating.create(rating)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Rating."
            });
        });
};

// Retrieve all Ratings from the database.
exports.findAll = (req, res) => {
    Rating.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving ratings."
            });
        });
};

// Find a single Rating with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Rating.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Rating with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Rating with id=" + id
            });
        });
};

// Update a Rating by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Rating.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Rating was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Rating with id=${id}. Maybe Rating was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Rating with id=" + id
            });
        });
};

// Delete a Rating with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Rating.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Rating was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Rating with id=${id}. Maybe Rating was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Rating with id=" + id
            });
        });
};

