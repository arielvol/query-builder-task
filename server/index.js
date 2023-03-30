const express = require("express");
const app = express();
const sequelize = require("./config/database");
const bodyParser = require("body-parser");
const { populateEmployeeTable } = require('./utilities');
const bcrypt = require('bcrypt')
const Employee = require('./models/Employee');

const cors = require("cors");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  // Hash and salt the user's password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // Insert the user's information into the users table
  await User.create({ username, password: hashedPassword })

  res.status(200).send('User created')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  // Retrieve the user's information from the users table
  const user = await User.findOne({ where: { username } })

  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).send('Invalid username or password')
  }

  // Hash and salt the provided password and compare it to the hash stored in the database
  const match = await bcrypt.compare(password, user.password)

  // If the passwords don't match, return an error
  if (!match) {
    return res.status(401).send('Invalid username or password')
  }

  // Generate a token to keep the user logged in
  const token = jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '1h' })

  res.status(200).json({ token })
})

const userRoutes = require('./routes/queryRoutes');
const tablesRoutes = require('./routes/tablesRoutes');

app.use('/api/queries', userRoutes);
app.use('/api/tables', tablesRoutes);

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

