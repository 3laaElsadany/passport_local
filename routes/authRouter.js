const express=require("express");
const router = express.Router();
const {isAuth}=require("../helpers/authentication")

router.get("/",isAuth,(req,res,next)=>{
  res.render("dashboard",{title:"Dashboard page"})
})

module.exports = router;