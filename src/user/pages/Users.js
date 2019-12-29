import React,{useEffect,useState} from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UserList from '../components/UserList';

const Users = props =>{
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState();
    const [loadedUsers,setLoadedUsers] = useState();

   useEffect(() => {
       const sendRequest = async () => {
           setIsLoading(true);
           try{
           const response = await fetch('http://localhost:5000/api/users');
           const responseData = await response.json();
           
           if(!response.ok){
               throw new Error(responseData.message)
           }
           setLoadedUsers(responseData.users);
        }catch(err){
            setError(err.message);
        }
        setIsLoading(false);
       };

       sendRequest();
   }, [] );

   const errorHandler = () => {
       setError(null);
   }

   //Here we send the USERS which compose the user list displayed, as items props which are then rendered accordingly
   return <React.Fragment>
       <ErrorModal error = {error} onClear = {errorHandler}/>
       {isLoading && (
           <div className="center">
               <LoadingSpinner/>
           </div>
       )}
       {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
       </React.Fragment>
};

export default Users;