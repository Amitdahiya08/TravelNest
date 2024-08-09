const mongoose = require("mongoose");
const initData= require("./data.js");

const mongoUrl="mongodb+srv://dahiyaamit444:Amit7404@cluster0.8bp4a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    initData.data = initData.data.map((obj)=> ({...obj, owner:"66b6733d54fad392082075fc"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");
}
initDB();
