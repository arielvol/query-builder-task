const express = require("express");
const router = express.Router();
const Queries = require('../models/Queries');
const sequelize = require("../config/database");
const { buildQuery } = require('../utils/utils');
const authMiddleware = require('../middleware/authMiddleware');
const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');
const User = require("../models/Users");

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

router.get("/:userId", [authMiddleware], async (req, res) => {
  try {
    const queries = await Queries.findAll({ where: { userId: req.params.userId  } });
    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId", [authMiddleware], async (req, res) => {
  const { name, body} = req.body;
  try {
    const newQuery = await Queries.create({ name, body, userId: req.params.userId });
    res.json(newQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:userId/:id", [authMiddleware], async (req, res) => {
  const { name, body } = req.body;
  try {
    const query = await Queries.findOne({ where: { id: req.params.id, userId: req.params.userId } });
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

router.delete("/:userId/:id", [authMiddleware, sanitizeMiddleware], async (req, res) => {
  try {
    const query = await Queries.findOne({ where: { id: req.params.id, userId: req.params.userId } });
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


router.get('/export/:id', authMiddleware, async (req, res) => {
  try {
    const queryId = req.params.id;
    const response = await Queries.findOne({ where: { id: queryId } });
    const {id, userId, ...query} = response.dataValues;
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/import/:userId', authMiddleware, async (req, res) => {
  try {
    const { name, body } = req.body;
    const userId = req.params.userId
    if (!name || !body || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newQuery = await Queries.create({ name, body, userId });

    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
