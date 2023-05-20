'use client'

import Link from "next/link";
import styles from './style.module.css'

import { useEffect, useState } from "react";
import Navbar from "@components/navbar";
import { getBlogUsingUserId } from "@services/blog_service";

export default function UserPage({params}){

    const [ data,setData] = useState([]);
    // const router = useRouter();

    useEffect(() => {
        try {
            ///
            const fetchData = async () =>{
                const res = await getBlogUsingUserId(params.userId,(status) => {});
                if(res){
                    const response_data = await res.json();
                    setData(response_data);
                }
           
            };
    
            fetchData();
            
        } catch (error) {
            console.log(error)
        }
       
    },[setData]);

    const listItems = data.map((blog,index) => {
           return <Link key={`bd${index}`} href={`/blog/${blog._id}`}>
                    <div  className={styles.link} >
                        <div> <label className={styles.link_title}> {blog.title}</label></div>
                        <div> <label className={styles.link_sub_title} > By {blog.author.first_name}</label></div>
                    </div>
                </Link>;
    });
    
    
    return(
        <div>
            <Navbar/>
            <label> Blogs </label>
            {listItems}
        </div>
    );
}
