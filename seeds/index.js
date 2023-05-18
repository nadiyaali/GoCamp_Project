const mongoose = require("mongoose")
const Campground = require("../models/campground.js")
const {places, descriptors} = require("./seedHelpers.js")
const cities= require("./cities.js")

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp3')
.then(()=>{
    console.log("yelp-camp3 Mongo Connection open!!")
})
.catch( err =>{
    console.log("Oh No Mongo ERROR !!!!")
    console.log(err)
})


const randItemArray = arr => arr[Math.floor(Math.random() * arr.length)]


const seedDB = async () => {
    await Campground.deleteMany({})
    // just for checking
    //const c = new Campground({title:"Purple Campground"})
    //await c.save()

    for(let i=0; i< 50; i++){
        const rand1000 = Math.floor(Math.random() * 1000)
        const prand = Math.floor(Math.random() * 20) +10
        const camp = new Campground({
            // id for username "nadia"
            author : "646178a3bb53aece73a59a94",
            title:  `${randItemArray(descriptors)} ${randItemArray(places)}`, 
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            image : "https://source.unsplash.com/collection/483251",
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit nobis porro fuga quo in, vero nemo labore quas similique. Voluptatum officiis ullam vel accusantium, maiores iste aliquid vitae ipsa.",
            price :prand
            //console.log(camp)
        })
        await camp.save()

    }
}

seedDB().then(()=>{
mongoose.connection.close()
})
