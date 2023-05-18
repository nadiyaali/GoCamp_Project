const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const catchAsync = require("../utils/catchAsync.js")
const passport = require("passport")
const { storeReturnTo } = require("../authenticateMiddleware.js");


///////////////////////////////////////////////////////////////////
// Controller
// Should be in the controllers/userController.js file
const renderForm = (req,res)=>{
    res.render("users/register.ejs")
}

const registerUser = async (req,res,next) =>{
    try{
     const {email,username,password} = req.body.user
     const user = new User({email, username})
     const newUser = await User.register(user,password)
     console.log(newUser)
     //When user is registered, u need to log in them
     req.login(newUser, err=>{
         if(err){
             return next(err)
         }
         req.flash("success","Welcome to Yelp Camp")
         res.redirect("/campgrounds")
     })
    }
    catch(e){
         req.flash("error",e.message)
         res.redirect("/register")
     }
     
 }

const renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

const loginUser = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
} 

const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}
////////////////////////////////////////////////////////////////////
// new way to route
router.route("/register")
.get(renderForm)
.post(catchAsync(registerUser))

router.route("/login")
.get(renderLoginForm)
.post( 
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    loginUser)

// for logout
router.get('/logout', logoutUser ); 


//// http://localhost:3000/register
//router.get("/register", renderForm)

//router.post("/register",catchAsync(registerUser))

// router.get("/login", renderLoginForm)

// router.post('/login', 
//     // use the storeReturnTo middleware to save the returnTo value from session to res.locals
//     storeReturnTo,
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
//     // Now we can use res.locals.returnTo to redirect the user after login
//     loginUser);




module.exports = router