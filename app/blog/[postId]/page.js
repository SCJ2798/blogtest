'use client'

import Navbar from '@components/navbar';
import { getAllBlogUsingId, getBlogUsingId } from '@services/blog_service';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './style.module.css';



export default function Page({params}){

    const [isLoading,setIsLoading] = useState(true);
    const [data,setData] = useState([]);
    const [author,setAuthor] = useState({
        first_name:'',
        last_name:''
    });

    useEffect(() => {
        try {
            const fetchData = async () =>{
                const res = await getBlogUsingId(params.postId,(status)=>{
                });
    
                if(res){
                    const response_data = await res.json();
                    setData(response_data[0]);
                    setAuthor(response_data[0].author);
                    setIsLoading(false);
                }
               
            }
    
            fetchData();
    
        } catch (error) {
            
        }
        
        // console.log(params.postId);
        // console.log(data);
        
    },[]);

    const authorLink = (author) =>{
        return (<Link href={{pathname: `/blog/user/${author._id}`, query:{
            name: author.first_name
        }}} >{`${author.first_name} ${author.last_name}`}</Link>);
    }

    const viewBlog = ( <div className={styles.blog} >
    <div className={styles.title}> {data.title} </div>
    <div className={styles.date}> {new Date(data.updatedAt).toLocaleDateString()} </div>
    <div className={styles.content} > <p> {data.body} </p> </div>
    <div className={styles.author_txt}> 
         <div className={styles.author_txt_h2}><label  >{ author.first_name && "Written by"}</label></div>
         <div className={styles.author_txt_h1} > <label>{ author.first_name && authorLink(author) }</label> </div>
        
    </div>
   
</div>);

  

    return ( <section className='blog-view-page'> 
                
            <Navbar/> 
            
            <div className={styles.blog_view}>
                {isLoading ? <div> Loading </div> : viewBlog} 
            </div>
        
        </section>); 
}