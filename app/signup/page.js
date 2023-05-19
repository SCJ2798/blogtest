'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import validator from "validator";
import { setCookie } from 'cookies-next';
import { signUpUser } from "@services/user_service";
import Navbar from "@components/navbar";

export default function SigupPage (){

    // const cookieStore = cookies();
    const route = useRouter();
    const [isLoading,setIsLoading] = useState(false);

    // Set form data
    const [formData,setFormData ] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:''
    });

    const [error,setError] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:''    
    });

    // 
    const handleChange = (e)=>{
    
        const {name,value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]:value,
        }));
    }

    const validateForm = (data) => {
        let error = {};
        // First Name
        if(!data.firstName) error.firstName = "First name is required";

        // Last Names
        if(!data.lastName) error.lastName = "Last name is required";
        
        // Email
        if(!data.email) {
            error.email = "Email is required";
        }else if(!validator.isEmail(data.email)){
            error.email = "Invalid email"

        }
        // Password
        if(!data.password) error.password = "Password is required";
        else if(data.password.lenght < 8) error.password = "Password must be at least 8 characters long";
        return  error;
    };

    const handleSubmit = async (e)=>{

        setIsLoading(true);

        e.preventDefault();
        const validatedError = validateForm(formData);
        ///
        if(!(Object.keys(validatedError).length === 0 )){
            setError(validatedError);
            setIsLoading(false);
            return;
        }else{
            try {    
                // api
                const response = await signUpUser({
                        first_name:formData.firstName,
                        last_name:formData.lastName,
                        email:formData.email,
                        psw:formData.password
                    },(status)=>{
                        setIsLoading(false);
                        console.log(status);
                        switch(status){
                            case 409:
                                setError({common:'User have already registered'});
                            break;
                            default:
                                setError({common:'Please check your entered details are correct or not'});
                        }
                       
                        
                    }
                );

                if(response){

                    const res = await response.json();

                    const accessToken = res.data.access_token
                    const uid =   res.data.user.id;

                    setCookie('access_token',accessToken,{maxAge:60*60});
                    setCookie('uFirstName',formData.firstName,{maxAge:60*60});
                    setCookie('uId',uid,{maxAge:60*60});

                    setIsLoading(false);
                    
                    // 
                    route.push(`/user/${uid}`);
                }
                
            } catch (error) {
                console.log(error.message);
                setIsLoading(false);
                setError({common:' Oops! , Something went wrong'});

            }
           
        }
        //

    }

    return(


        <div>

            <Navbar/>

            <form onSubmit={handleSubmit}>

            <div className="pad-16">
                <label className="font-32" style={{fontWeight:800}}> Welcome to BlogTest </label>
            </div>

            {/* First Name */}
            <div className="pad-16">
                <label className="input_label" htmlFor="firstName">First Name</label>
                <div>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>
                {error.firstName && <span> {error.firstName }</span>}
            </div>
            {/* Last Name */}
            <div  className="pad-16">
                <label className="input_label" htmlFor="lastName">Last Name</label>
                <div>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}/>
                </div>
                {error.lastName && <span> {error.lastName }</span>}
            </div>

            {/* Email */}
            <div  className="pad-16" >
                <label className="input_label" htmlFor="email">Email</label>
                <div>
                    <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                {error.email && <span> {error.email }</span>}
            </div>

            {/* Password */}
            <div  className="pad-16">
                <label className="input_label" htmlFor="password">Password</label>
                <div>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                {error.password && <span> {error.password }</span>}
            </div>

            {/* Submit button */}
            <div  className="pad-16">
            { isLoading ? <label> Loading </label> : <button type="submit"> Sign Up</button>}
            </div>

            <div>
                {error.common && <span> {error.common }</span>}
            </div>


            </form>

        </div>

        
    );

}