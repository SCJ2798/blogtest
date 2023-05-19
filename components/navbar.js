'use client'

import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar(){

    const [hasToken,setHasToken] = useState(false);
    const [uFirstName,setUFirstName] = useState('');
    const [uid,setUid] = useState('');

    useEffect(()=>{
        setHasToken(hasCookie('access_token'));
        setUFirstName(getCookie('uFirstName'));
        setUid(getCookie('uid'));
    });

    const router = useRouter();

    const signOut = () => {
        if(hasCookie('access_token')) deleteCookie('access_token');
        router.push('/signin');
    }

    return (
    <nav style={{display:'flex',flex:1,alignItems:"flex-end",justifyContent:'space-between',padding:16}}>
        <div> <h1 style={{color:'yellow',fontSize:26,fontStyle:'normal'}}>BlogTest</h1></div>
        
       {
         hasToken ? 
         <div>
             <Link href={`/user/${uid}`}><label style={{padding:16}}> {uFirstName} </label></Link> 
             <button onClick={signOut} > Sign Out </button> 
         </div>
        
         : <div> 
                <Link href={`/signin`}><label style={{padding:16}}> Sign In</label></Link>
                <Link href={`/signup`} ><label style={{padding:16}}> Sign Up</label></Link>
            </div>
       }
        
    </nav>
    );

    }