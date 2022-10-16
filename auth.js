//crud with api

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://0.0.0.0:27017/users")
  .then(console.log("Connected to database..."))
  .catch((err) => console.error("Failed to connect", err));

app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

const User = new mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true, min: 1, max: 50 },
    email: { type: String, required: true, unique: true, min: 5, max: 255 },
    password: { type: String, required: true, min: 6, max: 255 },
  })
);
function validateUser(req) {
  const schema = {
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  };
  return Joi.valid(req, schema);
}

app.post("/api/auth", async (req, res) => {
  validateUser(req.body);

  let checkUser = await User.findOne({ email: req.body.email });
  if (!checkUser) return res.status(400).send("Invalid email or password");
  let user = new User(_.pick(req.body, ["email", "password"]));
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  res.send(true);
});
//register new user
app.get("/api/register", async (req, res) => {
  const user = await User.find();
  res.send(user);
});
