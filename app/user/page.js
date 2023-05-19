'use client'

import Link from "next/link";
import styles from './style.module.css'

import { useEffect, useState } from "react";
import Navbar from "@components/navbar";

export default function UserPage({params}){

    const [ data,setData] = useState([]);
    // const router = useRouter();

    useEffect(() => {
        //
        const fetchData = async () =>{
        const res = await fetch("http://localhost:3000/api/blog/user/"+params.userId);
        const response_data = await res.json();
        setData(response_data);
        };

        fetchData();
        
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
