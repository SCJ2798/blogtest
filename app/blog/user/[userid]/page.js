'use client'

import Link from "next/link";
import styles from './style.module.css';

import { useEffect, useState } from "react";
import { useSearchParams , useRouter } from "next/navigation";
import { getBlogUsingUserId } from "@services/blog_service";
import { checkUser } from "@services/user_service";
import { deleteCookie, hasCookie } from "cookies-next";
import Navbar from "@components/navbar";
import BlogCard from "@components/blog-card";
import LoadingView from "@components/loading";
import MessageView from "@components/msg-view";


export default function UserPage({params}){

    const router = useSearchParams();
    const [ data,setData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, serError] = useState("");


    useEffect(() => {

        setIsLoading(true);

        try {
            const fetchData = async (id) =>{
                
                const res = await getBlogUsingUserId(id,(status)=>{
                });

                  if(res){
                    const response_data = await res.json();
                    setData(response_data);
                    setIsLoading(false);
                  }else{
                    setData([]);
                    setIsLoading(false);
                  }
             
                };
        
                fetchData(params.userid);

        } catch (error) {
            console.log(error);
            serError("Oops !, Something went wrong")
            setIsLoading(false);
        }
        
        
    },[]);

    


    const listItems = data.length > 0 ? data.map((blog,index) => {
        return <BlogCard 
                key={`bd${index}`} 
                href={`/blog/${blog._id}`} 
                title={blog.title} 
                content={blog.body}
                date={new Date(blog.createdAt).toLocaleDateString()}  />
        }) :  <div> No data</div>  ;
    
    
    return(
        <section className="author-page">
           <Navbar/>

            <div className="topic">
                <h1> { router.get('name') && ` Blogs  `}</h1>
                <h2> { router.get('name') && `By ${router.get('name')}`}</h2>
            </div>

            {/* Blog List */}
            <div className="blog-card-grid">{ isLoading  ? <LoadingView/> : error ? <MessageView msg={error}/> : listItems }</div> 

        </section>
    );
}