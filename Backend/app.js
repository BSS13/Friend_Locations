const express=require('express');
const bodyParser=require('body-parser');
const placesRoutes=require('./routes/places-routes');
const usersRoutes=require('./routes/users-routes');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');

const app=express();

//Middleware to parse the incoming Request Body
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');

    next();
})

//Middleware to connect the Specific routes to associated things
app.use("/api/places",placesRoutes);
app.use("/api/users",usersRoutes);

//Middleware that handles any unspecified Route that is associated
app.use((req,res,next)=>{
    const error = new HttpError('Could Not Find This Route',404);
    throw error;
})

//Middleware to handle and work upon error 
app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message:error.message || 'An Unknown Error Occured!!!!!!'});
});

mongoose.connect('mongodb+srv://bssa:Praisethelord13@locationuploader-quvn2.mongodb.net/mern?retryWrites=true&w=majority')
.then(() => {app.listen(5000); console.log("Server Started");})
.catch(err => console.log(err));
