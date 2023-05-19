'use client'

import Link from "next/link";
import styles from './style.module.css';

import { useEffect, useState } from "react";
import { useSearchParams,useRouter, redirect } from "next/navigation";
import { deleteBlog } from "@services/blog_service";
import { checkCookies, deleteCookie, getCookie, hasCookie } from "cookies-next";
import { checkUser } from "@services/user_service";
import Navbar from "@components/navbar";


export default function UserPage({params}){

    const routerParams = useSearchParams();
    const router = useRouter();
    const [ data,setData] = useState([]);

    const [error,setError] = useState({
        title:'',
        body:'',
    });

    useEffect(() => {

        if(!hasCookie('access_token')) router.push('/signin');

        const fetchData = async () =>{
            
            // Check user
            await checkUser(getCookie('access_token'),()=>{
                router.push('/signin');
            });

        const res = await fetch("http://localhost:3000/api/blog/user/"+params.userId);
        const response_data = await res.json();
        setData(response_data)
        };

        fetchData();
        console.log(params);
        
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

    // signOut
    const signOut = () => {
        if(hasCookie('access_token')) deleteCookie('access_token');
        router.push('/signin');
    };

    const gotoCreateNewBlog = () => {
        router.push(`/blog/new/${params.userId}`)
    };

    const listItems = data.map((blog,index) => {
           return( 
                    <div  key={`bd${index}`} style={{display:'flex',justifyItems:'flex-end',width:'80vw'} }>
                        <Link href={`/blog/${blog._id}`}>
                            <div className={styles.link} style={{flex:6}} >
                                <div> <label className={styles.title}> {blog.title}</label></div>
                                <div> <label className={styles.date}> {new Date(blog.createdAt).toLocaleDateString()} </label></div>
                            </div>
                        </Link>
                        <div style={{display:'flex',flex:1}}> 
                                <button onClick={()=> router.push(`blog/edit/${blog._id}`)} style={{margin:16,paddingInline:24}}> Edit </button>
                                <button style={{margin:16,paddingInline:24}} onClick={()=>deletePost(blog._id)} > Delete </button>
                         </div>
                    </div>);
                    
                
    });
    
    return(
        <div>
            <Navbar/>
            <div style={{textAlign:'center',fontSize:24}}>
            <button  onClick={gotoCreateNewBlog}> Create new Blog </button>
                <label> { routerParams.get('name') && `${routerParams.get('name')} Blog`}</label>
            </div>
            {listItems}
        </div>
    );
}