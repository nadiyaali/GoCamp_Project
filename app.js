const express= require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const port = 3000
const Campground = require("./models/campground.js")
const Review = require("./models/review.js")
//npm install method-override
const methodOverride = require('method-override')
// npm install ejs-mate
const ejsMate = require("ejs-mate")
// require error class
const catchAsync = require("./utils/catchAsync.js")
const ExpressError = require("./utils/ExpressError.js")
// For schema valication, use joi 
// npm install joi
const Joi = require("joi")
// for session
const session = require("express-session")
//for Flash
const flash = require("connect-flash")
//for passport
//npm install passport passport-local passport-local-mongoose
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const campgroundsRoutes = require("./routes/campgroundroutes.js")
const reviewsRoutes = require("./routes/reviewroutes.js")
const userRoutes = require("./routes/userroutes.js")

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp3')
.then(()=>{
    console.log("yelp-camp3 Mongo Connection open!!")
})
.catch( err =>{
    console.log("Oh No Mongo ERROR !!!!")
    console.log(err)
})


app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})



app.set("views", path.join(__dirname,"views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
// for serving static  files, use a public directory
app.use(express.static(path.join(__dirname, "public")))
//for session
const sessionConfig = {
    secret :"thisshouldbeabettersecret",
    resave : false,
    saveUninitialized : true,
    cookie:{
        //for a week
        expires: Date.now() +1000*60*60*24*7,
        maxAge : 1000*60*60*24*7, 
        //for security
        httpOnly:true,

    }
    //store:
}
app.use(session(sessionConfig))
app.use(flash())

// For authentication
app.use(passport.initialize())
//passport session should be after session
app.use(passport.session())
// Authentication strategy comes from User model
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Flash middleware, do it before route handlers
app.use((req,res,next)=>{
    //for authentication, save req.user
    //res.locals is available in al the ejs pages
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

// To use the campground routes
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)
app.use("/",userRoutes)


// app.get("/makecampgrounds", async (req,res) => {
//     const camp = new Campground({title: "My Backyard", description:"very near to my home"})
//     await camp.save()
//     res.send(camp)
// })

//Justv for checking that passport is working by making a new user
// app.get("/fakeuser",async(req,res)=>{
//     const user = new User({email:"baddddd@gmail.com", username:"baddddd"})
//     const newUser = await User.register(user,"chicken")
//     res.send(newUser)
// })



app.get("/", (req,res) =>{
    //res.send("Hello from yelp camp")
    res.render("home.ejs")
})







// to get all routes
// 1. Either use app.get("/", ()=>{}) OR
// 2. use app.all("*", (req, res, next)=>{})
// Should be after all route call

app.all("*", (req,res,next)=>{
    //res.send("FROM ALL ROUTE HANDLER : Something in wrong here!")
    
    //Create your own error and pass ot to the error handling middleware
    next(new ExpressError("Page not found", 404))
})




/////////////////////////////////////////////////////////////
//SIMPLE ERROR HANDLING
// Add middleware for error handling
// This should always be last
// Steps for error handling
//1. Add app.use with 4 parameters right at the end of your code
//2. for async function, add next to parameters and add try catch
// EXAMPLE
//app.post("/campgrounds", async(req,res,next)=>{
//    try{
//    }
//    catch(e){
//        console.log("%%%%%%%%%%%%%%%%%% CAUGHT ERROR %%%%%%%%%%%%%%%%%%")
//        next(e)
//    }
//})


app.use((err,req,res,next) =>{
    //res.send("OOPS! GOT AN ERROR")
    //// if no value of message and statusCode is there, use the default value
    //const {message ="Something went wrong!", statusCode = 500 } = err
    //res.status(statusCode).send(message)
    if(!err.message){
        err.message = "Something went wrong!"
    }
    if(!err.statusCode){
        err.statusCode = 500
    }
    res.render("campgrounds/error.ejs", {err})
    //res.status(500).send('Something broke!')
})

//ADVANCED ERROR HANDLING
//Steps
//0. Make two files with js extension
//1. Make your own error class
//2. Make a async wrapper function
//3. Require tge two files
//3. Call that async wrapper function in all route using async await,
//add next parameter too




