'use client'

import { useEffect, useState } from "react";
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { redirect, useRouter } from "next/navigation";
import { getBlogUsingId, updateBlog } from "@services/blog_service";
import { checkUser } from "@services/user_service";
import Navbar from "@components/navbar";

export default function NewBlogPage ({params}){

    const route = useRouter();
    if(!hasCookie('access_token')) route.push('/signin');

    // Set form data
    const [formData,setFormData ] = useState({
        title:'',
        body:'',
        author_id:''
    });
    
    const [isLoading,setIsLoading] = useState(false);

    const [error,setError] = useState({
        title:'',
        body:'',
    });
    
  

    useEffect(() => {
        try{
            const fetchData = async () =>{
                // Check user
                await checkUser(getCookie('access_token'),()=>{
                    route.push('/signin');
                });
                //
                const res = await getBlogUsingId(params.postid,(status)=>{});
                //
                if(res){
                    const response_data = await res.json();
                    if(response_data.length == 0) return;
                    console.log(response_data);

                    setFormData({
                        title:response_data[0].title,
                        body:response_data[0].body,
                        author_id:response_data[0].author_id
                    });
                }
            };
            fetchData();
        } catch (error) {
            console.log(error);
        }    
    },[setFormData]);


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
                const response = await updateBlog(params.postid,{
                        title:formData.title,
                        body:formData.body,
                    },getCookie('access_token'),(status)=>{                        
                        
                        if(status == 403) route.push('/signin');
                        setIsLoading(false);
                        setError({common:'Please check your entered details are correct or not'});
                    });

                if(response){
                    route.push(`/user/${formData.author_id}`);
                    setIsLoading(false);
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

                <div className="pad-16" style={{display:'flex',justifyItems:'center'}}>
                    <label className="font-32" style={{fontWeight:800}}> Update </label>
                    {/* Delete */}
                    {/* <button style={{ marginInline:16}} onClick={ ()=> deleteBlog(params.postid) } > Delete </button> */}
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