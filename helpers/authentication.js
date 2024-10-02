module.exports = {
  isAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("errors", {
      msg: "Please, login first"
    });
    res.redirect("/login");
  }
}