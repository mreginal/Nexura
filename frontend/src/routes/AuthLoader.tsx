import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading/Loading";

export default function AuthLoader(){
    const navigate = useNavigate()

    useEffect(()=>{
        const token = localStorage.getItem("token")

        setTimeout(() => {
           if(token){
            navigate("/feed")
           } else{
            navigate("/login")
           }
        }, 1500);
    },[])

    return <Loading/>
}