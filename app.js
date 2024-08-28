const express = require("express");
const app = express();
const ejs_mate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const list = require("./models/listing");
const data = require("./init/data.js");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.engine("ejs", ejs_mate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

main()
  .then(() => {
    console.log("Your DB is successfully Conected!");
  })
  .catch((err) => {
    console.log("Your DB is not Conected!" + err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/airbnb");
}

//index
app.get("/listings", async (req, res) => {
  let listings = await list.find({});
  res.render("listings/index", { listings });
});

//plan
app.get("/listings/trip", (req, res) => {
  res.render("listings/trip");
});

app.get("/listings/plan", async (req, res) => {
  let keywords = req.query.search.split(",").map((keyword) => keyword.trim());
  console.log(keywords);
  let searched = await list.find({
    country: { $in: keywords },
  });
  // res.send(a);
  res.render("listings/plan", { searched });
});

//create new
app.get("/listings/create", (req, res) => {
  res.render("listings/create");
});

//edit
app.get("/listings/edit/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await list.findOne({ _id: id });
  res.render("listings/edit", { listing });
});

app.patch("/listings/:id", async (req, res) => {
  let { title, description, image, price, location, country } = req.body;
  let { id } = req.params;
  let update = {
    title: title,
    description: description,
    image: {
      url: image,
    },
    price: price,
    location: location,
    country: country,
  };
  await list.findOneAndUpdate({ _id: id }, update);
  res.redirect("/listings");
});

//delete
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await list.findOneAndDelete({ _id: id });
  res.redirect("/listings");
});

app.post("/listings", (req, res) => {
  let { title, description, image, price, location, country } = req.body;
  let newList = new list({
    title: title,
    description: description,
    image: {
      url: image,
    },
    price: price,
    location: location,
    country: country,
  });
  newList.save();
  res.redirect("/listings");
});

//show
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await list.findOne({ _id: id });
  res.render("listings/show", { listing });
});

app.get("*", (req, res) => {
  res.redirect("/listings");
});

app.listen(3000, () => {
  console.log("server is running!");
});
