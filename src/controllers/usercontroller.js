const asyncHandler = require('express-async-handler')
const User = require('../modles/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//@desc register a user
//@route post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error('All fields are mandatory')
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400);
        throw new Error('User already registered!')
    }

    //hash pswd
    const hashPswd = await bcrypt.hash(password, 10)
    console.log('hashed password: ',hashPswd)
    const user = await User.create({
        username,
        email,
        password: hashPswd
    })
    console.log(user)
    if(user){
        res.status(201).json({_id: user.id, email:user.email})
    }
    else{
        res.status(400)
        throw new Error('user data is not valid')
    }
    res.json({message: 'register user'})
});

//@desc login a user
//@route post /api/users/login
//@access public
const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body
    if( !email || !password){
        res.status(400);
        throw new Error('All fields are mandatory')
    }
    const user = await User.findOne({email})
    //compare pswds
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                 id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
        res.status(200).json({accessToken})
    }
    else{
        res.status(401)
        throw new Error('email or password not valid')

    }
});
//@desc current user info
//@route get /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res)=>{
    res.json(req.user)
});
module.exports = {
    registerUser,
    loginUser,
    currentUser,
}