const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema

// Sample code here 
//https://www.npmjs.com/package/passport-local-mongoose
const UserSchema = new Schema({
    email:{
        type:String,
        required : true,
        unique : true
    }
}) 
//this will add a username and passowrd
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)