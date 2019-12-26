const HttpError= require('../models/http-error');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES=[
    {
        id:'p1',
        title:'Emp Building',
        description:'One of the most Famous Building',
        location:{
            lat:40.70,
            lng:-73.98
        },
        address:'20 W 30 Street, NY, USA',
        creator:'u1'
    }
];

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

   try{
       await createdPlace.save();
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
        place = await Place.findById(placeId);
   }catch(err){
       const error = new HttpError('Could Not Find a Place with the specified ID',500);
       return next(error);
   }

   try{
       await place.remove();
   }catch(err){
       const error = new HttpError('Could Not complete the Delete Operation Successfully !!');
       return next(error);
   }

   
   DUMMY_PLACES=DUMMY_PLACES.filter(p=>p.id===placeId);

   res.status(200).json({message:'Deleted Place'});
};

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.updatePlace=updatePlace;
exports.deletePlace=deletePlace;