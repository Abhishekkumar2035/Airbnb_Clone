const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL =
  "mongodb+srv://Abhishek:Patel%40123@cluster0.0brh7w1.mongodb.net/?appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68fc5fe4f437bbc5231797c9",
  }));
  await Listing.insertMany(initData.data);
  //console.log(initData.data);
};

initDB();
