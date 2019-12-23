const HttpError= require('../models/http-error');
const uuid= require('uuid/v4');

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

const getPlaceById = (req,res,next)=>{
    const placeId=req.params.pid;

    const place=DUMMY_PLACES.find(p=>{
        return p.id === placeId;
    });

    if(!place){
        return next(
            new HttpError('Could not find a place with given Place Id',404)
        );
    }

    res.json({place});
};


//Route 2
const getPlacesByUserId = (req,res,next)=>{
    const userId=req.params.uid;

    const places=DUMMY_PLACES.filter(p=>{
        return p.creator === userId;
    });

    if(!places || places.length===0){
        return next(
            new HttpError('Could not find any place for the user with the specified user ID',404)
        );
    }

    res.json({places});
};

//Route 3
const createPlace = (req,res,next) =>{
   const {title,description,coordinates,address,creator} = req.body;

   const createdPlace = {
       id:uuid(),
       title,
       description,
       location:coordinates,
       address,
       creator
   };

   DUMMY_PLACES.push(createdPlace);

   res.status(201).json({place:createdPlace});
};

//Route 4 to Update
const updatePlace = (req,res,next) =>{
  const {title,description} = req.body;
  const placeId=req.params.pid;

  const updatedPlace = {...DUMMY_PLACES.find(p=>p.id === placeId)};
  const placeIndex=DUMMY_PLACES.findIndex(p=>p.id===placeId);
  updatedPlace.title=title;
  updatedPlace.description=description;

  DUMMY_PLACES[placeIndex]=updatedPlace;

  res.status(200).json({place:updatedPlace});

}

//Route 5 to Delete
const deletePlace = (req,res,next) => {
   const placeId=req.params.pid;
   DUMMY_PLACES=DUMMY_PLACES.filter(p=>p.id===placeId);

   res.status(200).json({message:'Deleted Place'});
};

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.updatePlace=updatePlace;
exports.deletePlace=deletePlace;