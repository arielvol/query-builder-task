const express = require("express");
const app = express();
const sequelize = require("./config/database");
const bodyParser = require("body-parser");
const { populateEmployeeTable } = require('./utils/utils');
const Employees = require('./models/Employees');
const cors = require("cors");

app.use(cors({ credentials: true, origin: process.env.CLIENT_HOST_URL }));

//TODO: In production mode the server URL should be in an environment variable.
//app.use(cors({ credentials: true, origin: 'http://localhost:9000' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const userRoutes = require('./routes/queryRoutes');
const tablesRoutes = require('./routes/tablesRoutes');
const loginRoutes = require('./routes/loginRoutes');

app.use('/queries', userRoutes);
app.use('/tables', tablesRoutes);
app.use('', loginRoutes);

const port = process.env.PORT || 5005;
sequelize.sync().then( async () => {
  const count = await Employees.count()
  if (count === 0) {
    populateEmployeeTable(1000, Employees)
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


