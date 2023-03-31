const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');
const registerSanitizeMiddleware = require('../middleware/registerSanitizeMiddleware');

router.post("/register", registerSanitizeMiddleware, async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await User.create({ username, password: hashedPassword });

  res.status(200).send("User created");
});

router.post("/login", sanitizeMiddleware, async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send("Invalid username or password");
  }

   // TODO: This needs be saved in some sort of an environment variable in Production
  const secretKey = 'ariel_query_builder_secret';
  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

  res.status(200).json({ token });
});

module.exports = router;