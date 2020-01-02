const HttpError= require('../models/http-error');
const {validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password,12);
    }catch(err){
        const error = new HttpError('Could not create User Successfully',500);
        return next(error);
    }

    
    const createdUser = new User({
        name,
        email,
        password:hashedPassword,
        image:req.file.path,
        places:[]
    });

    try{
        await createdUser.save();
    }catch(err){
        const error = new HttpError('Error in completing the Signup Operation!! Please Try Again',500);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign({userId:createdUser.id,email:createdUser.email}, 'supersecret_not_to_be_shared',{expiresIn:'1h'});
    }catch(err){
        const error = new HttpError('Signup Failed',500);
        return next(error);
    }
    res.status(201).json({userId:createdUser.id,email:createdUser.email,token:token});
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

    if(!existingUser){
        const error = new HttpError('Invalid Credentials, Please Try Again',401);
        return next(error);
    }

    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }catch(err){
        const error = new HttpError('Could not Successfully Login',500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError('Invalid Credentials',401);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign({userId:existingUser.id,email:existingUser.email},'supersecret_not_to_be_shared', {expiresIn:'1h'});
    }catch(err){
        const error = new HttpError('Login operation not Successfull',500);
        return next(error);
    }

    res.json({userId:existingUser.id,email:existingUser.email,token:token});
}

exports.getUsers=getUsers;
exports.signup=signup;
exports.login=login;