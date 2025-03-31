const User = require("../models/user")
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to the site!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to ExploreLust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }


  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Logged out!");
      res.redirect("/listings");
    });
  }


  module.exports.renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.redirect("/login");
        res.render("users/profile", { user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};



module.exports.renderSettings = async (req, res, next) => {
  try {
    res.render("users/settings");
  } catch (error) {
    next(error); // Pass the error to Express error handler
  }
};



