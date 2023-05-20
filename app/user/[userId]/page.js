'use client'

import Link from "next/link";
import styles from './style.module.css';

import { useEffect, useState } from "react";
import { useSearchParams,useRouter, redirect } from "next/navigation";
import { deleteBlog, getBlogUsingUserId } from "@services/blog_service";
import { checkCookies, deleteCookie, getCookie, hasCookie } from "cookies-next";
import { checkUser } from "@services/user_service";
import Navbar from "@components/navbar";
import BlogCard from "@components/blog-card";
import LoadingView from "@components/loading";
import MessageView from "@components/msg-view";


export default function UserPage({params}){

    const routerParams = useSearchParams();
    const router = useRouter();
    const [ data,setData] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [error,setError] = useState();

    useEffect(() => {

        setIsLoading(true);

        try {
            
        if(!hasCookie('access_token')) router.push('/signin');

        const fetchData = async () =>{
            
            // Check user
            await checkUser(getCookie('access_token'),()=>{
                router.push('/signin');
            });

            const res = await getBlogUsingUserId(params.userId);

            if(res){
                const response_data = await res.json();
                setData(response_data)
                setIsLoading(false);
            }else{
                setError("No data")
                setIsLoading(true);
            }
        
        };

        fetchData();
       
        } catch (error) {
            console.log(error);
            setError("Oops!, Something wen wrong");
            setIsLoading(false)
        }

        
        
    },[setData]);

    // delete Post
    const deletePost = async(id) => {
        try {
            const response =  await deleteBlog(id,getCookie('access_token'),(status)=>{
                setError({common:'Something went wrong'}); 
            });
            if(response){
                window.location.reload();
            }
        } catch (error) {
             setError({common:' Oops! , Something went wrong'});
        }
    };

   
    const gotoCreateNewBlog = () => {
        router.push(`/blog/new/${params.userId}`)
    };

    const listItems = data.map((blog,index) => {
           return( 
                    <div  key={`bd${index}` } className='user-blog-card'>

                        {/* <BlogCard href={`/blog/${blog._id}`} title={blog.title} content={blog.body} date={new Date(blog.createdAt).toLocaleDateString()} /> */}

                        <Link className="comp_one" href={`/blog/${blog._id}`}>
                                <div className="title"> <label> {blog.title}</label></div>
                                <div className="date-text"> <label> {new Date(blog.createdAt).toLocaleDateString()} </label></div>
                          
                        </Link>

                        <div className="option-btn"> 
                                <button onClick={()=> router.push(`blog/edit/${blog._id}`)} style={{margin:16,paddingInline:24}}> Edit </button>
                                <button style={{margin:16,paddingInline:24}} onClick={()=>deletePost(blog._id)} > Delete </button>
                         </div>
                    </div>);
                    
                
    });
    
    return(
        <section className="user-profile-page">
            
            <Navbar/>

            <div className="create-new-blog-button" >
                <button  onClick={gotoCreateNewBlog}> Create new Blog </button>
            </div>
            
            { isLoading ? <LoadingView/> : error ? <MessageView msg={error}/> : listItems }
        </section>
    );
}