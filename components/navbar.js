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

    const goToSignIn = () => {
        router.push('/signin');
    }

    const goToSignOut = () => {
        router.push('/signup');
    }

    return (
    <nav style={{display:'flex',flex:1,alignItems:"flex-end",justifyContent:'space-between',padding:'48px 16px'}}>
        
        <Link href={'/'}> <div> <h1 style={{color:'white',fontSize:28,fontStyle:600}}>BlogTest</h1></div> </Link>
        
       {
         hasToken ? 
         <div>
             <Link href={`/user/${uid}`}><label style={{padding:16,marginInline:16}}> {uFirstName} </label></Link> 
             <button onClick={signOut} > Sign Out </button> 
         </div>
        
         :  <div> 
                <button onClick={goToSignIn} style={{marginInline:12}}>Sign In</button>
                <button onClick={goToSignOut} style={{marginInline:12}}>Sign Out</button>
            </div>
       }
        
    </nav>
    );

    }