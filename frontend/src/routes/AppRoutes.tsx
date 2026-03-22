import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Home from "../pages/Feed";
import Register from "../pages/Register/Register";
import AuthLoader from "./AuthLoader";

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLoader/>}/>
                <Route path="/login" element = {<Login/>} />
                <Route path="/register" element = {<Register/>} />
                <Route path="/feed" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}
