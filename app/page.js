'use client'

import BlogCard from "@components/blog-card";
import LoadingView from "@components/loading";
import MessageView from "@components/msg-view";
import Navbar from "@components/navbar";
import { getAllBlog } from "@services/blog_service";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [error, serError] = useState("");

  const [ data,setData] = useState([]);
  const [ filterData,setFilterData] = useState([]);

  useEffect(() => {
      const fetchData = async () =>{
        try {
          const res = await getAllBlog((status)=>{
          });
          
          if(res){
            const response_data = await res.json();
            setData(response_data);
            setFilterData(response_data);
            setIsLoading(false);
          }else{
            setData([]);
            setFilterData([])
            setIsLoading(false);
          }

        } catch (error) {
            console.log(error);
            serError("Oops !, Something went wrong")
            setIsLoading(false);
          
        }
      
      };

      fetchData();
      
    
      
  },[setFilterData]);

  const handleChange = (e)=>{
    
    const {name,value} = e.target;

    console.log(value);
    
    if(data.length > 0){
      const fdatas = data.filter((element)=>element.title.toLowerCase().includes(value.toLowerCase()))
      setFilterData(fdatas);
    }else{
      setFilterData([]);
    }

  }

    const listItems = filterData.length > 0 ? filterData.map((blog,index) => {
      return <BlogCard key={`bd${index}`} 
      href={`/blog/${blog._id}`} 
      title={blog.title} 
      author={blog.author.first_name} 
      content={blog.body} 
      date={new Date(blog.createdAt).toLocaleDateString()} />
      }) :  <div> No data</div>  ;


  
  return (
    <section className="home-page">

      <Navbar/>
      
      <div className="search-area"> 
        <input style={{}} type='text'  onChange={handleChange} placeholder="Search Blog" />
      </div>

      <div className="blog-card-grid">{ isLoading  ? <LoadingView/> : error ? <MessageView msg={error}/> : listItems }</div> 

      
       
           
    </section>
  )
}
