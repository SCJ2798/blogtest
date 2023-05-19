import { BASE_URL } from "@config/httpConfig";
import { getCookie, hasCookie } from "cookies-next";

export async function getAllBlog(onError){

    const response = await fetch(BASE_URL+"/blog/");

    if(response.status == 200){
        return response;
    }else{
        onError(response.status);
    }
}

export async function getBlogUsingId(blogId,onError){

    const response = await fetch(BASE_URL+"blog/"+blogId);

    if(response.status == 200){
        return response;
    }else{
        onError(response.status);
    }
}

export async function getBlogUsingUserId(userId,onError){

    const response = await fetch(BASE_URL+"blog/user/"+userId);
    if(response.status == 200){
        return response;
    }else{
        onError(response.status);
    }
}



export async function createBlog({title,body,author_id},token,onError){

    const response = await fetch(BASE_URL+'/blog',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'authorization':'Bearer '+token
                    },
                    body:JSON.stringify({
                        title,
                        body,
                        author_id,
                    })
                });

    if(response.status == 201){
        return response;
    }else{
        onError(response.status);
    }
}

export async function updateBlog(blogId,{title,body},token,onError){

    const response = await fetch(BASE_URL+'/blog/'+blogId,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                        'authorization':'Bearer '+token
                    },
                    body:JSON.stringify({
                        title,
                        body  
                    })
                });

    if(response.ok){
        return response;
    }else{
        onError(response.status);
    }
}

export async function deleteBlog(blogId,token,onError){

    const response = await fetch(BASE_URL+'/blog/'+blogId,{
                    method:'DELETE',
                    headers:{
                        'Content-Type':'application/json',
                        'authorization':'Bearer '+token
                    }});

    if(response.ok){
        return response;
    }else{
        onError(response.status);
    }
}