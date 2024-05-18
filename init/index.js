const mongoose = require("mongoose");
const initData= require("./data.js");

const mongoUrl="mongodb://127.0.0.1:27017/travelNest";

const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("Database is connected");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB = async()=> {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}
initDB();
