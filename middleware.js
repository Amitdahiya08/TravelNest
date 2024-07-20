module.exports.isLoggedIn = (req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be login first !");
        return res.redirect("/login");
    }
    next();
}