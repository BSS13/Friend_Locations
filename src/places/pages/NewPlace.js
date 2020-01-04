import React,{useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import './PlaceForm.css';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {AuthContext} from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

//Functional Component Logic
const NewPlace = () =>{

    const auth = useContext(AuthContext);
    const {isLoading,error,sendRequest,clearError} = useHttpClient();

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
        },
        image:{
            value:null,
            isValid:false
        }
    }, true);


    const history = useHistory();

    const placeSubmitHandler = async (event) =>{
        event.preventDefault();
        try{
            const formData = new FormData();
            formData.append('title',formState.inputs.title.value);
            formData.append('description',formState.inputs.description.value);
            formData.append('address',formState.inputs.address.value);
            formData.append('image',formState.inputs.image.value);

            await sendRequest('http://localhost:5000/api/places','POST',
            formData,{
                Authorization: 'Bearer '+auth.token
            });
            history.push('/');
        }catch(err) {}
    }

    return(
        <React.Fragment>
            <ErrorModal error={error} onClear = {clearError}/>
        <form className="place-form" onSubmit={placeSubmitHandler}>
            {isLoading && <LoadingSpinner asOverlay/>}

          <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an Image"/>
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
        </React.Fragment>
    );
};

export default NewPlace;