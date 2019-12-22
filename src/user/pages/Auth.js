import React,{useState} from 'react';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import {useForm} from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import './Auth.css';

const Auth = ()=>{

  const [isLoginMode,setIsLoginMode] = useState(true);
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

  const authSubmitHandler = event =>{
    event.preventDefault();
    console.log(formState.inputs);
  }

   return <Card className="authentication">
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
   ;
}

export default Auth;