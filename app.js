const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const mongoUrl = "mongodb://127.0.0.1:27017/travelNest";

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

const session = require("express-session");
const flash = require("connect-flash");

main()
    .then(() => {
        console.log("Database is connected");
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

const sessionOptions = {
    secret: "mySuperSecretCode", // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3, // Cookie expiration time in milliseconds (1 day)
        httpOnly: true
    }
};
app.get("/", (req, res) => {
    res.send("Server is working ");
});
 
app.use(session(sessionOptions));
app.use(flash());
// we need middleware to flash msg before out routes 
app.use((req,res,next)=>{
    res.locals.success  = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

// custom Error Handler
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message}); 
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
});