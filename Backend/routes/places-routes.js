const express=require('express');
const router=express.Router();

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

    res.json({place});
});

router.get("/user/:uid",(req,res,next)=>{
    const userId=req.params.uid;

    const places=DUMMY_PLACES.find(p=>{
        return p.creator === userId;
    });

    res.json({places});
});

module.exports=router;