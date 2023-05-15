//In Express.js, res.locals is an object that provides a way to 
//pass data through the application during the request-response cycle.
// It allows you to store variables that can be accessed by your 
//templates and other middleware functions.
const Campground = require("./models/campground.js")
const Joi = require("joi")
const ExpressError = require("./utils/ExpressError.js")
const Review = require("./models/review.js")


module.exports.storeReturnTo = (req, res, next) => {
    //req.session will be cleared on login, so save returnTo info in res.locals
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn2 = (req,res,next)=>{
    //contains deserialized info from the session
    console.log("REQ.USER : ", req.user)    
    // Example
    // REQ.USER :  {
    //     _id: new ObjectId("64545e22c696862f74eaa912"),
    //     email: 'a@a',
    //     username: 'a',
    //     __v: 0
    //   }
      
    // comes from passport : req.isAuthenticated, req.User
    if(!req.isAuthenticated()){
        // req.path and req.orifinalUrl are both there req object
        // path: /new and originalUrl : /campgrounds/new
        req.session.returnTo = req.originalUrl; // add this line
        req.flash("error","You must be signed in first")
        return res.redirect("/login")
    }
    next()    
}


//used on edit route and update route
module.exports.isAuthor = async (req,res,next)=>{
    const {id} = req.params
    //first find campground, then check if its author id matches current user id
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


//Implementing Server side schema validation
module.exports.validateCampground = (req,res,next)=>{
    const campgroundSchemaJoi = Joi.object({
        //the body should contain campground
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image : Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
        }).required()
    })

    const {error} = campgroundSchemaJoi.validate(req.body)
    console.log(error)
     
    if(error){
        // get the error message, works for more than one
        const msg = error.details.map(el => el.message).join(",") 
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}

//Implementing Server side schema validation
module.exports.validateReview = (req,res,next)=>{
    const reviewSchemaJoi = Joi.object({
        //the body should contain campground
        review: Joi.object({
            body: Joi.string().required(),
            rating: Joi.number().required().min(1),
            
        }).required()
    })

    const {error} = reviewSchemaJoi.validate(req.body)
    console.log(error)
     
    if(error){
        // get the error message, works for more than one
        const msg = error.details.map(el => el.message).join(",") 
        throw new ExpressError(msg,400)
    }
    else{
        next()
    }
}


//used on review route, to check if author is the same as user
module.exports.isReviewAuthor = async (req,res,next)=>{
    //get the reviewID and campgroundid
    const {id, reviewId} = req.params
    //first find campground, then check if its author id matches current user id
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

