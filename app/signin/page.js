'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import validator from "validator";
import { setCookie } from 'cookies-next';
import { loginUser } from "@services/user_service";
import Navbar from "@components/navbar";

export default function SigupPage (){

    const route = useRouter();
    
    const [isLoading,setIsLoading] = useState(false);
   
    // Set form data
    const [formData,setFormData ] = useState({
        email:'',
        password:''
    });

    // set errors
    const [error,setError] = useState({
        email:'',
        password:'',
        common:''  
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

    // handleSubmit
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
                const response =  await loginUser({email:formData.email,psw:formData.password},(status) => {
                    setIsLoading(false);
                    switch(status){
                        case 401:
                            setError({common:'Something went wrong , Please check your entered email and password'});
                            break;
                        default:
                            setError({common:'Something went wrong , Please check your entered email and password'});
                            break;

                    }
                });
                
                // if response is ok
                if(response) {
                    const res = await response.json();

                    const accessToken = res.data.access_token
                    const uid = res.data.user.id;
                    const uFirstName = res.data.user.first_name;

                    setCookie('access_token',accessToken,{maxAge:60*60});
                    setCookie('uFirstName',uFirstName,{maxAge:60*60});
                    setCookie('uid',uid,{maxAge:60*60});
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

        console.log(formData);
        //

    }

    return(
        <div>

            <Navbar/>

            <form onSubmit={handleSubmit}>

                <div className="pad-16">
                    <label className="font-32" style={{fontWeight:800}}> Welcome back to  BlogTest </label>
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
                <div> <button type="submit"> Sign In</button> </div>  
                {error.common && <span> {error.common }</span>}
                </div>

            </form>

        </div>
     
    );

}