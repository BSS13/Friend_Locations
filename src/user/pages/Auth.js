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
import {useHttpClient} from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Auth = ()=>{
  const auth = useContext(AuthContext);
  const [isLoginMode,setIsLoginMode] = useState(true);
  const {isLoading,error,sendRequest,clearError} = useHttpClient();

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
        name:undefined,
        image:undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid);
    }else{
      setFormData({
        ...formState.inputs,
        name:{
          value:'',
          isValid:false
        },
        image:{
          value:null,
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
          const responseData = await sendRequest('http://localhost:5000/api/users/login',
            'POST',
            JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            }),
            {
              'Content-Type' : 'application/json',
            }
          );
          auth.login(responseData.user.id);
        }catch(err){
          
        }

        //Logic for Sign Up Checking
    }else{
      try{
        
        const responseData = await sendRequest('http://localhost:5000/api/users/signup',
          'POST',
           JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type':'application/json'
          }
        );

        auth.login(responseData.user.id);
      }catch(err) {
      
      }
    }
  }

   return <React.Fragment>
     <ErrorModal error={error} onClear={clearError}/>
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

          {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please add an Image"/>}

        <Input id="email" element="input" type="email" label="E-Mail" placeholder="Email" validators={[VALIDATOR_EMAIL()]} onInput={inputHandler} errorText="Please Enter a Valid Email Address"/>
        <Input id="password" element="input" type="password" label="Password" placeholder="Password" validators={[VALIDATOR_MINLENGTH(6)]} onInput={inputHandler} errorText="Please Enter a Password that is atleast 6 characters long"/>
        <Button type="submit" disabled={!formState.isValid}> {isLoginMode? 'Login' : 'Signup'}</Button>
     </form>  

       <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode?'Signup':'Login'}</Button>
    </Card>
    </React.Fragment>
   ;
}

export default Auth;