import {useState,useEffect,useCallback} from 'react';

let logoutTimer;

export const useAuth = () =>{

    const [token,setToken]= useState(false);
    const [userId,setUserId] = useState(false);
    const [tokenExpirationDate,setTokenExpirationDate] = useState();
  
    const login = useCallback((uid,token,expirationDate) =>{
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime()+ 1000*60*60);
      localStorage.setItem('userData',JSON.stringify({userId:uid, token:token, expiration: tokenExpirationDate.toISOString()}));
      setTokenExpirationDate(tokenExpirationDate);
    },[]);
  
    const logout = useCallback(() =>{
      setToken(null);
      setUserId(null);
      localStorage.removeItem('userData');
      setTokenExpirationDate(null);
    },[]);
  
    useEffect(()=>{
      const storedData = JSON.parse(localStorage.getItem('userData'));
  
      if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
        login(storedData.userId,storedData.token);
      }
    },[login]);
  
    useEffect(()=>{
      if(token && token.expirationDate){
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout,remainingTime);
      }else{
        clearTimeout(logoutTimer);
      }
    })
  

    return {token, login, logout,userId};
}