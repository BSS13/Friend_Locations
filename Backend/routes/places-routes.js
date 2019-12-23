const express=require('express');
const router=express.Router();

const HttpError = require('../models/http-error');

const DUMMY_PLACES=[
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

router.get("/:pid",(req,res,next)=>{
    const placeId=req.params.pid;

    const place=DUMMY_PLACES.find(p=>{
        return p.id === placeId;
    })

    if(!place){
        return next(
            new HttpError('Could not find a place with given Place Id',404)
        );
    }

    res.json({place});
});

router.get("/user/:uid",(req,res,next)=>{
    const userId=req.params.uid;

    const places=DUMMY_PLACES.find(p=>{
        return p.creator === userId;
    });

    if(!places){
        return next(
            new HttpError('Could not find any place for the user with the specified user ID',404)
        );
    }

    res.json({places});
});

module.exports=router;