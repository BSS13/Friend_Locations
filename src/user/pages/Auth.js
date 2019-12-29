import React,{useState,useContext} from 'react';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import {AuthContext} from '../../shared/context/auth-context';
import './Auth.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Auth = ()=>{
  const auth = useContext(AuthContext);
  const [isLoginMode,setIsLoginMode] = useState(true);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState();

  const [formState,inputHandler,setFormData]= useForm({
       email:{
        value:'',
        isValid:false
       },
       password:{
         value:'',
         isValid:false
       }
  },false);

  const switchModeHandler = () => {
    if(!isLoginMode){
      setFormData({
        ...formState.inputs,
        name:undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid);
    }else{
      setFormData({
        ...formState.inputs,
        name:{
          value:'',
          isValid:false
        }
      },false);
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event =>{
    event.preventDefault();
    if(isLoginMode){
        try{
          const response = await fetch('http://localhost:5000/api/users/login',{
            method:'POST',
            headers:{
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            })
          });

          const responseData = await response.json();
          if(!response.ok){
            throw new Error (responseData.message);
          }

          setIsLoading(false);
          auth.login();
        }catch(err){
          setIsLoading(false);
          setError(err.message || 'Issue in execution');
        }

        //Logic for Sign Up Checking
    }else{
      try{
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/users/signup',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });

        const responseData = await response.json();
        if(!response.ok){
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        auth.login();
      }catch(err) {
        setIsLoading(false);
        setError(err.message);
      }
    }
  }

  const errorHandler = () =>{
    setError(null);
  }

   return <React.Fragment>
     <ErrorModal error={error} onClear={errorHandler}/>
     <Card className="authentication">
     {isLoading && <LoadingSpinner asOverlay />}
     <h2>{isLoginMode?'Login Required':'Signup Required'} </h2>
     <hr/>
     <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
           id="name"
           element="input" 
           type="text" 
           label="Your Name"
           placeholder="Your Name" 
           validators={[VALIDATOR_REQUIRE()]} 
           errorText="Please Enter a Name" 
           onInput={inputHandler}
           />
          )}

        <Input id="email" element="input" type="email" label="E-Mail" placeholder="Email" validators={[VALIDATOR_EMAIL()]} onInput={inputHandler} errorText="Please Enter a Valid Email Address"/>
        <Input id="password" element="input" type="password" label="Password" placeholder="Password" validators={[VALIDATOR_MINLENGTH(6)]} onInput={inputHandler} errorText="Please Enter a Password that is atleast 5 characters long"/>
        <Button type="submit" disabled={!formState.isValid}> {isLoginMode? 'Login' : 'Signup'}</Button>
     </form>  

       <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode?'Signup':'Login'}</Button>
    </Card>
    </React.Fragment>
   ;
}

export default Auth;