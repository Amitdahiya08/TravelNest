if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
// const mongoUrl = "mongodb://127.0.0.1:27017/travelNest";
const dbUrl = process.env.ATLASDB_URL;


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

main()
    .then(() => {
        console.log("Database is connected");
    })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"alfkdlagllafdll",
    },
    touchAfter: 24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR in mongo session store ",err);
});

const sessionOptions = {
    store,
    secret: "alfkdlagllafdll", // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3, // Cookie expiration time in milliseconds (3 day)
        httpOnly: true
    }
};
// app.get("/", (req, res) => {
//     res.send("Server is working ");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use (new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// we need middleware to flash msg before out routes 
app.use((req,res,next)=>{
    res.locals.success  = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "abcd"
//     });
//     let registerUser = await User.register(fakeUser,"helloworld");
//     res.send(registerUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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