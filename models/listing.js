const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listeningSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    filename: String,
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: String,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listeningSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listeningSchema);
module.exports = Listing;
