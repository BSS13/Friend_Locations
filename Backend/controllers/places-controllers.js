const HttpError= require('../models/http-error');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

const getPlaceById = async (req,res,next)=>{
    const placeId=req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId);
    }catch(err){
        const error = new HttpError('Could Not find a place with the given Id',500);
        return next(error);
    }

    if(!place){
        return next(
            new HttpError('Could not find a place with given Place Id',404)
        );
    }

    res.json({place:place.toObject({getters: true})});
};


//Route 2
const getPlacesByUserId = async (req,res,next)=>{
    const userId=req.params.uid;

    let places;
    try{
        places = await Place.find({creator:userId})
    }catch(err){
        const error = new HttpError('Could Not Fetch a Place by specified User Id',500);
        return next(error);
    }

    if(!places || places.length===0){
        return next(
            new HttpError('Could not find any place for the user with the specified user ID',404)
        );
    }

    res.json({places:places.map(place => place.toObject({getters:true}))});
};

//Route 3
const createPlace = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      return next(new HttpError('Invalid inputs passed, Please Check Your Data', 422));
    }

   const {title,description,address,creator} = req.body;

   let coordinates = getCoordsForAddress(address);

   const createdPlace = new Place({
       title,
       description,
       location:coordinates,
       image:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
       address,
       creator
   });

   let user;
   try{
       user = await User.findById(creator);
   }catch(err){
       const error = new HttpError('Finding User Operation Not Successfull!!',500);
       return next(error);
   }

   if(!user){
       const error = new HttpError('Could not Find a User with the specified ID',404);
       return next(error);
   }

   try{
       const sess = await mongoose.startSession();
       sess.startTransaction();
       await createdPlace.save({session:sess});
       user.places.push(createdPlace);

       await user.save({session:sess});
       await sess.commitTransaction();
   }catch(err){
       const error = new HttpError('Creating Place Operation Failed',500);
       return next(error);
   }

   res.status(201).json({place:createdPlace});
};

//Route 4 to Update
const updatePlace = async (req,res,next) =>{
  const errors= validationResult(req);

  if(!errors.isEmpty())
  {
      return next (new HttpError('Invalid inputs passed, Please check the Data Passed',422));
  }

  const {title,description} = req.body;
  const placeId=req.params.pid;

  let place;
  try{
      place = await Place.findById(placeId);
  }catch(err){
      const error = new HttpError('Could not find a place with the specified Id',500);
      return next(error);
  }

  place.title=title;
  place.description=description;

 try{
     await place.save();
 }catch(err){
     const error = new HttpError('Something Went Wrong! Operation of Updation Failed',500);
     return next(error);
 }

  res.status(200).json({place:place.toObject({getters:true})});

}

//Route 5 to Delete
const deletePlace = async (req,res,next) => {
   const placeId=req.params.pid;

   let place;
   try{
        place = await Place.findById(placeId).populate('creator');
   }catch(err){
       const error = new HttpError('Could Not Find a Place with the specified ID',500);
       return next(error);
   }

   if(!place){
       const error = new HttpError('Could not find place for the given id',404);
       return next(error);
   }

   try{
       const sess = await mongoose.startSession();
       sess.startTransaction();
       await place.remove({session:sess});
       await place.creator.places.pull(place);
       await place.creator.save({session:sess});
       await sess.commitTransaction();
   }catch(err){
       const error = new HttpError('Could Not complete the Delete Operation Successfully !!');
       return next(error);
   }

   res.status(200).json({message:'Deleted Place'});
};

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.updatePlace=updatePlace;
exports.deletePlace=deletePlace;