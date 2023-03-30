const { Sequelize } = require('sequelize');
const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname = 'public'
    `;
    const result = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const tableNames = result.map((row) => row.tablename);
    res.send(tableNames);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/columns", async (req, res) => {
  const { tableName } = req.body;

  if (!tableName) {
    res.status(400).json({ error: "Table name is required" });
    return;
  }

  try {
    const tableColumns = await sequelize.query(
      `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    res.json(tableColumns);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the column names" });
  }
});

router.post("/columns/data", async (req, res) => {
  const { tableName, columnName } = req.body;

  if (!tableName || !columnName) {
    res
      .status(400)
      .json({ error: "Table name and Column name are both required" });
    return;
  }

  try {
    const modelClass = sequelize.models[tableName];
    const columns = Object.keys(modelClass.rawAttributes);

    if (!columns.includes(columnName)) {
      res.status(400).json({ error: `Invalid column name: ${columnName}` });
      return;
    }

    const rows = await modelClass.findAll({
      attributes: [columnName],
    });

    const columnData = [...new Set(rows.map((row) => row[columnName]))];

    res.json(columnData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving column data" });
  }
});

module.exports = router;
