const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Update user
router.put("/:id", async (req, res) => {
    try {
        // Check if the user is updating their own account or is an admin
        if (req.body.userId === req.params.id || req.body.isAdmin) {
            // Check if a new password is being provided
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }

            // Use `findByIdAndUpdate` to update the user document
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });

            // Check if the user document was found and updated
            if (!user) {
                return res.status(404).json("User not found");
            }

            res.status(200).json("Account has been updated!");
        } else {
            return res.status(403).json("You can only update your account or are an admin.");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json("Internal Server Error");
    }
});

//delete user
router.delete("/:id", async (req, res) => {
    try {
        // Check if the user is updating their own account or is an admin
        if (req.body.userId === req.params.id || req.body.isAdmin) {

            // Use `findByIdAndDelete` to delete the user document
            const user = await User.findByIdAndDelete(req.params.id,);
            res.status(200).json("Account has been deleted!");

        } else {
             return res.status(403).json("You can only delete your account.");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json("Internal Server Error");
    }
});
//get a user
router.get("/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const{password,updatedAt, ...other} = user._doc;
        res.status(200).json(other );
    }
    catch(err){
        res.status(500).json(err);
    }
})

//follow a user
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("User has been followed!");
            }else{
                res.status(403).json("You already follow this user!")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("You cannot follow yourself!");
    }
    
})
//unfollow a user
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id) {
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("User has been Unfollowed!");
            }else{
                res.status(403).json("You are already not following this user!")
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("You cannot unfollow yourself!");
    }
    
})

module.exports = router;
