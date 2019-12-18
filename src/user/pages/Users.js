import React from 'react';
import UserList from '../components/UserList';

const Users = props =>{
     //This acts similar to a dummy state for the component
    const USERS=[
       {
           id:'u1',
           name:'James',
           image:'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
           places:6
       }
   ];

   //Here we send the USERS which compose the user list displayed, as items props which are then rendered accordingly
   return <UserList items={USERS}/>;
};

export default Users;