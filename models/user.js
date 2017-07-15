var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    position    : String,
    firstname   : String,
    lastname    : String,
    email       : String,
    phonenumber : String,
    username    : String,
    password    : String
});

var DevelopSchema = new mongoose.Schema({
    position    : String,
    firstname   : String,
    lastname    : String,
    email       : String,
    phonenumber : String,
    username    : String,
    password    : String
});


UserSchema.plugin(passportLocalMongoose);
DevelopSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
module.exports = mongoose.model("Develop", DevelopSchema);