import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AuthLoader from "./AuthLoader";
import ForgotPassword from "../pages/ResetPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Profile from "../pages/Profile/Profile";
import Feed from "../pages/Feed/Feed";
import PostCommentsPage from "../pages/Post/PostComments";

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthLoader/>}/>
                <Route path="/login" element = {<Login/>} />
                <Route path="/register" element = {<Register/>} />
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/feed" element={<Feed/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/posts/:postId/comments" element={<PostCommentsPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}
