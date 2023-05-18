const express = require("express")
const router = express.Router()
const Campground = require("../models/campground.js")
const catchAsync = require("../utils/catchAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {campController} = require("../controllers/campgroundController.js")

// NOT WORKING
// for authentication middleware
//const {isLoggedIn} = require("../middle.js")
const { storeReturnTo, isLoggedIn2, isAuthor,validateCampground } = require("../authenticateMiddleware.js");

/////////////////////////////////////////////////////////////////////
//Controller
//this should all be in the file controllers/campgroundController.js
// but not working currently

const getIndex = async(req,res,next) =>{
    const campgrounds = await Campground.find({})
    //console.log(campgrounds)
    res.render("campgrounds/index.ejs", {campgrounds}) 
}

const renderNewForm = (req, res) =>{
   
    res.render("campgrounds/new.ejs")
}

const createCampground = async (req,res,next) =>{
    const id = req.params.id
    const campground = await Campground.findById(id)
    console.log("EDITING")
    if(!campground){
        req.flash("error", "Cannot find that campground")
        return res.redirect("/campgrounds")
    }
    console.log(campground)
    res.render("campgrounds/edit.ejs", {campground})   
}

const showCampground = async(req,res,next) =>{
    const id  = req.params.id
    //console.log(id)
    //Populate review too
    //populate authors too, both for campground only
    //const campground = await Campground.findById(id).populate("reviews").populate("author")
    // now populate author field for rreviews too
    const campground = await Campground.findById(id).populate({
        path : "reviews",
        populate:{
            path:"author"
        }
    }).populate("author")
   
    //Check if campground exists
    if(!campground){
        req.flash("error", "Cannot find that campground")
        return res.redirect("/campgrounds")
    }
    console.log(campground)
    res.render("campgrounds/details.ejs", {campground}) 
}

const renderEditForm = async(req,res,next)=>{
    //res.send("Hello Post")
    //res.send(req.body)
    
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    console.log("ADDING NEW CAMPGROUND")
    console.log(campground)
    //foe flash message
    req.flash("success", "Successfully made a new campground")
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)

}

const updateCampground = async(req,res,next) => {
   
    const id = req.params.id
    console.log("UPDATING")
    
    const c = await Campground.findByIdAndUpdate(id, {...req.body.campground},{new:true})
    req.flash("success" , "Successfully updated campground")
    res.redirect(`/campgrounds/${c._id}`)
}

const deleteCampground = async(req,res) =>{
    const id = req.params.id
    console.log("DELETING")
    await Campground.findByIdAndDelete(id)
    //res.redirect("/campgrounds")
    req.flash("success" , "Successfully deleted campground")
    res.redirect("/campgrounds")

}
/////////////////////////////////////////////////////////////////////

// new way to route
router.route("/")
.get(catchAsync(getIndex))
.post(isLoggedIn2, validateCampground, catchAsync(renderEditForm))

// This needs to be before /:id path, otherwise new is considered an ID
router.get("/new", isLoggedIn2, renderNewForm)

router.route("/:id")
.get(catchAsync(showCampground))
.put(isLoggedIn2, isAuthor ,catchAsync(updateCampground))
.delete(isLoggedIn2, catchAsync(deleteCampground))

router.get("/:id/edit", isLoggedIn2, isAuthor, catchAsync(createCampground))


//router.get("/", catchAsync(getIndex))
//router.post("/", isLoggedIn2, validateCampground, catchAsync(renderEditForm))

//router.get("/:id", catchAsync(showCampground))
//router.put("/:id", isLoggedIn2, isAuthor ,catchAsync(updateCampground))
//router.delete("/:id",  isLoggedIn2, catchAsync(deleteCampground))


module.exports = router

