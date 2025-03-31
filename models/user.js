const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "Listing" // Reference the Listing model
    }],
    profileImage: { 
        type: String, // Field to store the profile image URL
        required: false // No default value
    }
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
