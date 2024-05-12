const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {

    try{
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password,salt);

        // create new user
        const newuser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedpassword
    })
    // Save user and respond
        const user = await newuser.save();
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
});

// LOGIN
router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email });
        !user && res.status(404).json("No user found");
        
        const validpassword = await bcrypt.compare(req.body.password, user.password)
        !validpassword && res.status(400).json("Wromg password");

        res.status(200).json(user); 
        
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
