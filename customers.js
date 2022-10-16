//crud with api

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");

mongoose
  .connect("mongodb://0.0.0.0:27017/customers")
  .then(console.log("Connected to database..."))
  .catch((err) => console.error("Failed to connect", err));

app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

//mongoose Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 5, max: 50 },
  phone: { type: String, required: true, min: 5, max: 50 },
  isGold: { type: Boolean, required: true },
});

//joi schema
function validateCustomers(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  };
  return Joi.valid(customer, schema);
}

const Customer = new mongoose.model("Customer", customerSchema);

//get request
app.get("/customers", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

app.get("/customers/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

//post request
app.post("/customers", async (req, res) => {
  validateCustomers(req.body);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customer = await customer.save();
  res.send(customer);
});

//update request
app.put("/customers/:id", async (req, res) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

//delete request
app.delete("/customers/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

//////////////////////////////////////////////////////////////////////////////////////////////

// Authentication starts //

//Register user

//schema by mongoose

const User = new mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true, min: 1, max: 50 },
    email: { type: String, required: true, unique: true, min: 5, max: 255 },
    password: { type: String, required: true, min: 6, max: 255 },
  })
);
//validation by joi
function validateRegisterUser(user) {
  const schema = {
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(1).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  };
  return Joi.valid(user, schema);
}

app.post("/api/register", async (req, res) => {
  validateRegisterUser(req.body);

  let checkUser = await User.findOne({ email: req.body.email });
  if (checkUser) return res.status(400).send("User already registered");
  else {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    user = await user.save();
    res.send(user);
  }
});
//register new user
app.get("/api/register", async (req, res) => {
  const user = await User.find().sort("name");
  res.send(user);
});
