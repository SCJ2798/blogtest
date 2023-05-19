'use client'

import Navbar from "@components/navbar";
import { getAllBlog } from "@services/blog_service";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const [ data,setData] = useState([]);
  const [ filterData,setFilterData] = useState([]);

  useEffect(() => {
      const fetchData = async () =>{
        try {
          const res = await getAllBlog((status)=>{

          });
          const response_data = await res.json();
          setData(response_data);
          setFilterData(response_data);

        } catch (error) {
            console.log(error);
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
      return <Link  key={`bd${index}`} href={`/blog/${blog._id}`}>
           <div style={{textAlign:'start',padding:12}} >
               <div> <label > {blog.title}</label></div>
               <div> <label> By {blog.author.first_name}</label></div>
           </div>
           </Link> 
      }) :  <div> No data</div>  ;
  
  return (
    <main>
      <Navbar/>
      <div>
        <input type='text'  onChange={handleChange} />
      </div>
       <label> Blogs </label>
            {listItems}
    </main>
  )
}
