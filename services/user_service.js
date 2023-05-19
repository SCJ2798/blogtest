import { BASE_URL } from "@config/httpConfig";

export async function loginUser({email,psw},onError){

    const response = await fetch(BASE_URL+'user/login',{ method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({email,psw})
                });

    if(response.ok){
        return response;
    }else{
        onError(response.status);
    }
}

export async function signUpUser({first_name,last_name,email,psw},onError){

    const response = await fetch(BASE_URL+'/user/signup',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        first_name,
                        last_name,
                        email,
                        psw
                    })
                });


    if(response.status == 201){
        return response;
    }else{
        onError(response.status);
    }
}

export async function checkUser(token,onError){
  
    try {
         const response = await fetch(BASE_URL+'/user/checkToken',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'authorization':'Bearer '+token
            }
        });

        if(response.ok){
            return response;
        }else{
            onError();
        }
        
    } catch (error) {
        console.log(error);
        onError()
    }
   


   
}



