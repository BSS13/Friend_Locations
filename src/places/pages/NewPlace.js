import React from 'react';
import Input from '../../shared/components/FormElements/Input';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import './PlaceForm.css';
import {useForm} from '../../shared/hooks/form-hook';


//Functional Component Logic
const NewPlace = () =>{

    const [formState,inputHandler]= useForm({
        title:{
            value:'',
            isValid:false
        },
        description:{
            value:'',
            isValid:false
        },
        address:{
            value:'',
            isValid:false
        }
    }, true);


    const placeSubmitHandler = event =>{
        event.preventDefault();
        console.log(formState.inputs);
    }

    return(
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input 
            id="title"
            element="input"
            type="text" 
            label="Title" 
            errorText="Please Enter a Valid Title" 
            validators={[VALIDATOR_REQUIRE()]} 
            onInput={inputHandler}
          />

          <Input 
             id="description"
             element="textarea"
             label="Description"
             validators={[VALIDATOR_MINLENGTH(5)]}
             errorText="Please Enter at least 5 Characters"
             onInput={inputHandler}
          />

          <Input 
             id="address"
             element="input"
             label="Address"
             validators={[VALIDATOR_REQUIRE()]}
             errorText="Please Enter a Valid Address"
             onInput={inputHandler}
           />

         <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
        </form>
    );
};

export default NewPlace;