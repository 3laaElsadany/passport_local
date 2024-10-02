const express = require("express");
const app = express();
const {
  port,
  url,
  secret
} = require("./config/config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const defaultRouter = require("./routes/defaultRoute");
const flash = require("connect-flash");
const passport = require("passport");
const dashboardRouter = require("./routes/authRouter")


mongoose.connect(url)
  .then(() => console.log("Connected to DB"))
  .catch(err => {
    console.log(err);
  })

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());


app.use("/", defaultRouter);
app.use("/auth", dashboardRouter)

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next()
})

app.use((req, res) => {
  res.status(404).send("Page Not Found");
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
})