
const Campground = require("../models/campground.js")


module.exports.getIndex = async(req,res,next) =>{
    const campgrounds = await Campground.find({})
    //console.log(campgrounds)
    res.render("campgrounds/index.ejs", {campgrounds}) 
}