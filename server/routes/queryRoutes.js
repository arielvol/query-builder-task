const express = require("express");
const router = express.Router();
const Query = require('../models/Query');
const sequelize = require("../config/database");
const { buildQuery } = require('../utilities');

router.post("/run", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const queries = await Query.findAll();
    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a single query by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = await Query.findByPk(id);
    if (query) {
      res.json(query);
    } else {
      res.status(404).json({ message: "Query not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new query
router.post("/", async (req, res) => {
  const { name, body, userId } = req.body;
  try {
    const newQuery = await Query.create({ name, body, userId });
    res.json(newQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT an existing query by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, body } = req.body;
  try {
    const query = await Query.findByPk(id);
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
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = await Query.findByPk(id);
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
