const bcrypt = require("bcryptjs");
const User = require("../models/user");
const cloudinary = require('cloudinary').v2;  // Cloudinary SDK
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads (storing files in memory)
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage }).single('profilePicture'); // Allow single file upload with the name 'profilePicture'

// Configure Cloudinary with credentials (from your Cloudinary account)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  // Use environment variables for credentials
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Render Sign Up Form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Sign Up New User
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
};

// Render Login Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Log In Existing User
module.exports.login = async (req, res) => {
  try {
    req.flash("success", "Welcome back to ExploreLust");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Redirect to the last page the user tried to access
    res.redirect(redirectUrl); // Redirect after login
  } catch (error) {
    req.flash("error", "Login failed, please try again.");
    res.redirect("/login"); // Redirect to login if an error occurs
  }
};

// Log Out User
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out!");
    res.redirect("/listings");
  });
};

// Render Profile Page
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

// Render Settings Page
module.exports.renderSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.redirect("/login");
    res.render("users/settings", { user });
  } catch (error) {
    next(error); // Pass the error to Express error handler
  }
};

// Update User Settings (Profile & Password)
module.exports.updateSettings = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect("/settings");
    }

    // Update the username and email
    user.username = username;
    user.email = email;

    // If a new password is provided, use passport-local-mongoose to update the password
    if (password) {
      // Update password using passport-local-mongoose's built-in method
      await user.setPassword(password); // This method hashes the password for you
    }

    // Handle profile image upload if provided
    if (req.file) {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image' }, // Upload image to Cloudinary
        (error, result) => {
          if (error) {
            req.flash("error", "Failed to upload image to Cloudinary");
            return res.redirect("/settings");
          }
          
          // Save the image URL in the user's profile
          user.profileImage = result.secure_url; // Cloudinary URL
    
          // Save the user with the new image URL
          user.save()
            .then(() => {
              req.flash("success", "Settings updated successfully!");
              res.redirect("/settings");
            })
            .catch(err => {
              req.flash("error", "Something went wrong, please try again.");
              res.redirect("/settings");
            });
        }
      ).end(req.file.buffer); // End the stream with the file buffer
    } else {
      // If no image was uploaded, just save the other updates
      await user.save();
      req.flash("success", "Settings updated successfully!");
      res.redirect("/settings");
    }

  } catch (e) {
    console.error(e);
    req.flash("error", "Something went wrong, please try again.");
    res.redirect("/settings");
  }
};
