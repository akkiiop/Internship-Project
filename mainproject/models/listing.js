
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: new Schema({
      filename: String,
      url: String,
    }),
    default: {
      filename: "default-image",
      url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
  },
  price: Number,
  location: String,
  country: String,


  // every post has reviews so we add review model with listing model 
  // in mysql we use foregign key and here we use this format by passing objectid and reference of that objectid (means refrenced model name)

  reviews: [
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    }
],


//we are adding authorization so we use this and in init folder at index.js we are pushing owner for all records in db.

owner: 
        {
        type: Schema.Types.ObjectId,
        ref: "user",
        },
});


//to handle one to many relation of mongodb . 
//means when listing deleted then all the reviews of that listing also deleted 
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

