const express = require("express")
//otherwise the id param will not be passed through
const router = express.Router({mergeParams : true})
const catchAsync = require("../utils/catchAsync.js")
const Campground = require("../models/campground.js")
const Review = require("../models/review.js")
const { validateReview, isLoggedIn2, isReviewAuthor} = require("../authenticateMiddleware.js");

///////////////////////////////////////////////////////////////////
// Controller
// Should be in the controllers/reviewController.js file
const createReview = async(req,res,next)=>{
    //res.send("Posting a review")
    
    const id  = req.params.id
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    console.log("The new review")
    console.log(review)
    console.log("Adding new review")
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    console.log(review)
    console.log(campground)
    req.flash("success","Created new review")
    res.redirect(`/campgrounds/${campground._id}`)

}

const deleteReview = async(req,res) => {
    //res.send("Deleting a Review")
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Successfully deleted review")
    res.redirect(`/campgrounds/${id}`)
}


///////////////////////////////////////////////////////////////////





//for posting reviews
///campgrounds/:id/reviews  - old route
//check if user is logged in before posting review
router.post("/",isLoggedIn2, validateReview, catchAsync(createReview))

//for deleting reviews
// campground/:id/reviews/:reviewId
router.delete("/:reviewId", isLoggedIn2, isReviewAuthor, catchAsync(deleteReview))


module.exports = router