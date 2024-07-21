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
    initData.data = initData.data.map((obj)=> ({...obj, owner:"669c1c3afeefce9f22b9a881"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}
initDB();
