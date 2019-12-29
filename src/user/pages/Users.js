import React,{useEffect,useState} from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UserList from '../components/UserList';
import {useHttpClient} from '../../shared/hooks/http-hook';

const Users = props =>{
    const [loadedUsers,setLoadedUsers] = useState(false);
    const {isLoading,error,sendRequest,clearError} = useHttpClient();

   useEffect(() => {
       const fetchUsers = async () => {
           try{
           const responseData = await sendRequest('http://localhost:5000/api/users');
           setLoadedUsers(responseData.users);
        }catch(err){
        }
       };

       fetchUsers();
   }, [sendRequest] );


   //Here we send the USERS which compose the user list displayed, as items props which are then rendered accordingly
   return <React.Fragment>
       <ErrorModal error = {error} onClear = {clearError}/>
       {isLoading && (
           <div className="center">
               <LoadingSpinner/>
           </div>
       )}
       {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
       </React.Fragment>
};

export default Users;