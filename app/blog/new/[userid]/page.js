'use client'

import { useEffect, useState } from "react";
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { useRouter } from "next/navigation";
import { createBlog } from "@services/blog_service";
import { checkUser } from "@services/user_service";
import Navbar from "@components/navbar";

export default function NewBlogPage ({params}){

    const [isLoading,setIsLoading] = useState(false);
    const route = useRouter();

    if(!hasCookie('access_token')) route.push('/signin');

    // Set form data
    const [formData,setFormData ] = useState({
        title:'',
        body:'',
    });

    const [error,setError] = useState({
        title:'',
        body:'',
    });

    useEffect(()=>{
        const checkU = async () =>{
            await checkUser(getCookie('access_token'),()=>{
                route.push('/signin');
            });
        }
        checkU();
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
        // title 
        if(!data.title) error.title = "Title is required";

        // Last Names
        if(!data.body) error.body = "Body is required";
        
        // Password
        return  error;
    };

    const handleSubmit = async(e) => {

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
                const response = await createBlog({
                        title:formData.title,
                        body:formData.body,
                        author_id:params.userid
                },getCookie('access_token'),(status) => {
                    setIsLoading(false);
                    setError({common:'Please check your entered details are correct or not'});
                });

                if(response){
                    const res = await response.json();
                    setIsLoading(false);
                    route.push(`/user/${params.userid}`);
                }
                
            } catch (error) {
                console.log(error.message);
                setIsLoading(false);
                setError({common:' Oops! , Something went wrong'});
            }
        }

        console.log(formData);
        console.log(params.userId);
        //

    }

    return(
        <div>
            <Navbar/>
            <form onSubmit={handleSubmit}>

                <div className="pad-16">
                    <label className="font-32" style={{fontWeight:800}}> Create new blog </label>
                </div>

                {/* Title */}
                <div className="pad-16">
                    <label className="input_label" htmlFor="firstName">Title</label>
                    <div>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
                    </div>
                    {error.firstName && <span> {error.firstName }</span>}
                </div>
                {/* Body */}
                <div  className="pad-16">
                    <label className="input_label" htmlFor="lastName">Content</label>
                    <div>
                        <textarea id="body" name="body" value={formData.body} cols={24} rows={12} onChange={handleChange}></textarea>
                    </div>
                    {error.lastName && <span> {error.lastName }</span>}
                </div>
            

                {/* Submit button */}
                <div  className="pad-16">
                { isLoading ? <label> Loading </label> : <button type="submit"> Publish </button>}
                </div>

                
            </form>
        </div>
    );

}