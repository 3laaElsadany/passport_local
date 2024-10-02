const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  check,
  validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs")
const passport = require("passport");


router.get("/login",(req,res,next)=>{
  if(req.user){
    res.redirect("/auth");
  }
  next()
})

router.get("/register",(req,res,next)=>{
  if(req.user){
    res.redirect("/auth");
  }
  next()
})


router.get("/", (req, res, next) => {
  res.render("home", {
    title: "Home page"
  })
})

router.get("/login", (req, res, next) => {
  let success = req.flash("success")
  let errors = req.flash("errors");
  if (!success) {
    success = []
  }
  res.render("login", {
    title: "Login page",
    success: success,
    errors
  })
})

router.get("/register", (req, res, next) => {
  res.render("register", {
    title: "Register page",
    errors: []
  })
})

router.post("/register", [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Email not valid"),
  check("password").notEmpty().withMessage("Password is required").isLength({
    min: 5
  }).withMessage("Password must be greater than 5 char."),
  check('rePassword', 'Passwords do not match').custom((value, {
    req
  }) => value === req.body.password)
], async (req, res) => {
  const {
    username,
    email,
    password
  } = req.body;
  const existingUser = await User.findOne({
    email
  });
  const errors = validationResult(req);
  if (existingUser) {
    errors.errors.push({
      msg: "This user already exist"
    });
  }
  if (!errors.isEmpty()) {
    req.flash("error", errors.errors);
    res.render("register", {
      title: "Register Page",
      errors: errors.errors
    })
  } else {
    const hash = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hash
    })
    newUser.save()
    req.flash("success", "user saved successfully")
    res.redirect("/login")
  }
})

router.post('/login', passport.authenticate('local', {
  successRedirect: 'auth',
  failureRedirect: 'login',
  failureFlash: true
}))



module.exports = router