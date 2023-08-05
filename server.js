const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/urlShortener?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.3",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB!");
    // Your code that interacts with the database can go here
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  // Get all urls from the database
  const shortUrls = await ShortUrl.find();
  res.render("index",{ shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullURL });
  res.redirect("/");
});

app.get('/:shortUrl', async (req,res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

  // if there is no shorturl exist
  if(shortUrl==null)return res.sendStatus(404);

  // Exist then increase the number of clicks on that link
  shortUrl.clicks += 1;
  shortUrl.save();

  res.redirect(shortUrl.full);
})

app.listen(process.env.PORT || 5000);
