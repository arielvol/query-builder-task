const express = require("express");
const router = express.Router();
const Query = require('../models/Query');
const sequelize = require("../config/database");
const { buildQuery } = require('../utilities');
const authMiddleware = require('../middleware/authMiddleware');
const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');


router.post("/run", [authMiddleware],  async (req, res) => {
  const { query } = req.body;

  try {
    const queryStr = buildQuery(query);

    // Run a manual SQL command using the query method
    const queryResult = await sequelize.query(queryStr);
    res.json(queryResult);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while running SELECT query" });
  }
});

// GET all queries
router.get("/:userId", [authMiddleware], async (req, res) => {
  try {
    const queries = await Query.findAll({ where: { userId: req.params.userId  } });
    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// POST a new query
router.post("/:userId", [authMiddleware], async (req, res) => {
  const { name, body} = req.body;
  try {
    const newQuery = await Query.create({ name, body, userId: req.params.userId });
    res.json(newQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT an existing query by ID
router.put("/:userId/:id", [authMiddleware], async (req, res) => {
  const { name, body } = req.body;
  try {
    const query = await Query.findOne({ where: { id: req.params.id, userId: req.params.userId } });
    if (query) {
      query.name = name;
      query.body = body;
      await query.save();
      res.json(query);
    } else {
      res.status(404).json({ message: "Query not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a query by ID
router.delete("/:userId/:id", [authMiddleware, sanitizeMiddleware], async (req, res) => {
  try {
    const query = await Query.findOne({ where: { id: req.params.id, userId: req.params.userId } });
    if (query) {
      await query.destroy();
      res.json({ message: "Query deleted successfully" });
    } else {
      res.status(404).json({ message: "Query not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
