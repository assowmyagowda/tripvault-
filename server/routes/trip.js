const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// CREATE A TRIP
// POST /api/trips
// ========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    if (!title || !destination || !startDate || !endDate) {
      return res.status(400).json({
        message:
          "Title, destination, start date and end date are required",
      });
    }

    const trip = await Trip.create({
      user: req.user.userId,
      title,
      destination,
      startDate,
      endDate,
      description: description || "",
      rating,
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    console.error("Create trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// GET MY TRIPS
// GET /api/trips
// ========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user.userId,
    }).sort({ startDate: 1 });

    res.status(200).json({
      trips,
    });
  } catch (error) {
    console.error("Get trips error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// GET SINGLE TRIP
// GET /api/trips/:id
// ========================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      trip,
    });
  } catch (error) {
    console.error("Get single trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// UPDATE A TRIP
// PUT /api/trips/:id
// ========================================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (title !== undefined) {
      trip.title = title;
    }

    if (destination !== undefined) {
      trip.destination = destination;
    }

    if (startDate !== undefined) {
      trip.startDate = startDate;
    }

    if (endDate !== undefined) {
      trip.endDate = endDate;
    }

    if (description !== undefined) {
      trip.description = description;
    }

    if (rating !== undefined) {
      trip.rating = rating;
    }

    await trip.save();

    res.status(200).json({
      message: "Trip updated successfully",
      trip,
    });
  } catch (error) {
    console.error("Update trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ========================================
// DELETE A TRIP
// DELETE /api/trips/:id
// ========================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;