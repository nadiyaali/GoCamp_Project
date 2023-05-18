const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review.js")


const CampgroundSchema = new Schema({
    title:{
        type:String
    },
    image:{
        type:String
    },
    price:{
        type:Number
    },
    description: {
        type:String
    },
    location: {
        type:String
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"   
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

//NOT WORKING
//mongoose middleware for deleting associated reviews when a campground is deleted
// CampgroundSchema.post("findOneAndDelete", async function(doc){
//     console.log("DELETING THROUGH MONGOOSE MIDDLEWARE")
//     if(doc){
//         await Review.remove({
//             _id:{
//                 $in:doc.reviews
//             }
//         })
//     }
// })


module.exports = mongoose.model("Campground",CampgroundSchema)