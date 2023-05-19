'use client'

import Link from "next/link";
import styles from './style.module.css';

import { useEffect, useState } from "react";
import { useSearchParams , useRouter } from "next/navigation";
import { getBlogUsingUserId } from "@services/blog_service";
import { checkUser } from "@services/user_service";
import { deleteCookie, hasCookie } from "cookies-next";
import Navbar from "@components/navbar";


export default function UserPage({params}){

    const router = useSearchParams();
    const [ data,setData] = useState([]);


    useEffect(() => {
        try {
            
            const fetchData = async () =>{
                
                const res = await getBlogUsingUserId(params.userid,(status)=>{
                });

                    if(res){
                        const response_data = await res.json();
                        setData(response_data)
                    }
             
                };
        
                fetchData();
        } catch (error) {
            console.log(error);
        }
        
        
    },[setData]);

    


    const listItems = data.map((blog,index) => {
           return <Link key={`bd${index}`} href={`/blog/${blog._id}`}>
                    <div  className={styles.link} >
                        <div> <label className={styles.title}> {blog.title}</label></div>
                        <div> <label className={styles.date}> {new Date(blog.createdAt).toLocaleDateString()} </label></div>
                    </div>
                </Link>;
    });
    
    
    return(
        <div>
           <Navbar/>
            <div style={{textAlign:'center',fontSize:24}}>
                <label> { router.get('name') && `${router.get('name')} Blog`}</label>
            </div>
            {listItems}
        </div>
    );
}