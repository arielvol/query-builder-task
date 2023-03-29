const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const { buildQuery, populateEmployeeTable} = require('./utilities');


// Create a new Sequelize instance with your PostgreSQL connection details
// Docker Mode
// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   username: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

//Local mode
const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  database: "postgres",
  username: "postgres",
  password: "admin",
  port: 5432,
});

// Define the Employee model
const Employee = sequelize.define("Employees", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cell_phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  home_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Query = sequelize.define('query', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

// Configure the body-parser middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/tables", async (req, res) => {
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

app.post("/api/tables/columns", async (req, res) => {
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

app.post("/api/tables/columns/data", async (req, res) => {
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

app.post("/api/queries/run", async (req, res) => {
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
app.get("/api/queries", async (req, res) => {
  try {
    const queries = await Query.findAll();
    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a single query by ID
app.get("/api/queries/:id", async (req, res) => {
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
app.post("/api/queries", async (req, res) => {
  const { name, body } = req.body;
  try {
    const newQuery = await Query.create({ name, body });
    res.json(newQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT an existing query by ID
app.put("/api/queries/:id", async (req, res) => {
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
app.delete("/api/queries/:id", async (req, res) => {
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


// Start the server
const port = process.env.PORT || 5001;
sequelize.sync().then( async () => {
  const count = await Employee.count()
  if (count === 0) {
    populateEmployeeTable(1000, Employee)
    .then(() => {
      console.log("Employee table populated successfully.");
    })
    .catch((error) => {
      console.error(error);
    });
  }
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});

//sequelize.close() TODO: Use this !!
