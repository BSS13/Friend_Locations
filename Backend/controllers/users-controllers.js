const HttpError= require('../models/http-error');
const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');

const DUMMY_USERS = [
    {
        id:'u1',
        name:'Balpreet',
        email:'b@b.com',
        password:'testers'
    }
];

//Route to fetch all the Users
const getUsers = (req,res,next)=>{
    res.json({users:DUMMY_USERS});
}

//Route to complete the Signup
const signup = (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new HttpError('Invalid Inputs passed, please check the data passed in ',422);
    }
    
    const {name,email,password} = req.body;

    if(DUMMY_USERS.find(u=> u.email === email)){
        throw new HttpError('Could not create a User, email is already taken',422);
    };

    const createdUser = {
        id:uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user:createdUser});
}

//Route to complete the Login
const login = (req,res,next) =>{
    const {email,password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);

    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError("Invalid Credentials, Could not Identify the User",401)
    };

    res.json({msg:'Logged In'});
}

exports.getUsers=getUsers;
exports.signup=signup;
exports.login=login;