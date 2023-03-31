const express = require("express");
const app = express();
const sequelize = require("./config/database");
const bodyParser = require("body-parser");
const { populateEmployeeTable } = require('./utils/utils');
const Employee = require('./models/Employee');
const cors = require("cors");

//TODO: In production mode the server URL should be in an environment variable.
app.use(cors({ credentials: true, origin: 'http://localhost:9000' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const userRoutes = require('./routes/queryRoutes');
const tablesRoutes = require('./routes/tablesRoutes');
const loginRoutes = require('./routes/loginRoutes');

app.use('/api/queries', userRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api', loginRoutes);

const port = process.env.PORT || 5005;
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


