const HttpError= require('../models/http-error');
const {validationResult} = require('express-validator');
const User = require('../models/user');

//Route to fetch all the Users
const getUsers = async (req,res,next)=>{
    let users;
    try{
        users = await User.find({}, "-password");
    }catch(err){
        const error = new HttpError('Fetching Users Failed, Please Try Again Later',500);
        return next(error);
    }

    res.json({users: users.map(user=> user.toObject({getters: true}))});
}

//Route to complete the Signup
const signup = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next (new HttpError('Invalid Inputs passed, please check the data passed in ',422));
    }
    
    const {name,email,password} = req.body;

    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        const error = new HttpError('Email Search Operation Failed',500);
        return next(error);
    }

    if(existingUser){
        const error= new HttpError('Email is Already Registered, Try Again with some other Email',422);
        return next(error);
    }

    
    const createdUser = new User({
        name,
        email,
        password,
        image:'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        places:[]
    });

    try{
        await createdUser.save();
    }catch(err){
        const error = new HttpError('Error in completing the Signup Operation!! Please Try Again',500);
        return next(error);
    }
    res.status(201).json({user:createdUser.toObject({getters:true})});
}

//Route to complete the Login
const login = async(req,res,next) =>{
    const {email,password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    }catch(err){
        const error= new HttpError('Operation to search User Failed, Please Try Again Later',500);
        return next(error);
    }

    if(!existingUser || existingUser.password !== password ){
        const error = new HttpError('Invalid Credentials, Please Try Again',401);
        return next(error);
    }

    res.json({msg:'Logged In'});
}

exports.getUsers=getUsers;
exports.signup=signup;
exports.login=login;