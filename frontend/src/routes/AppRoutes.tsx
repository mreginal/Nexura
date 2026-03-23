import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Home from "../pages/Feed";
import Register from "../pages/Register/Register";
import AuthLoader from "./AuthLoader";
import ForgotPassword from "../pages/ResetPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Profile from "../pages/Profile/Profile";

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLoader/>}/>
                <Route path="/login" element = {<Login/>} />
                <Route path="/register" element = {<Register/>} />
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/feed" element={<Home/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
        </BrowserRouter>
    )
}
