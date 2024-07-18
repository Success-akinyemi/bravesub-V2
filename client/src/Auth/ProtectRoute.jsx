import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {jwtDecode} from 'jwt-decode';
import { useEffect } from "react";

function AuthorizeUser() {
  const { currentUser } = useSelector((state) => state.braveSubUser);
  const user = currentUser?.data
    const token = localStorage.getItem('bravesubtoken');
    const tokenExist = !!token;
    const navigate = useNavigate()
  
    useEffect(() => {
      if (!tokenExist && !user) {
        console.log('NO USER');
        toast.error('PLEASE LOGIN');
      } else {
        const decodedToken = jwtDecode(token);
  
        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          toast.error('Session expiried, Please login');
          navigate('/login')
        }
      }
    }, [currentUser, tokenExist]); 
  
    return tokenExist && user ? <Outlet /> : <Navigate to={'/'} />;
  }

  function AuthorizeAdmin() {
    const { currentUser: adminCurrentUser } = useSelector((state) => state.goAdmin);
    const admin = adminCurrentUser?.data;

    const token = localStorage.getItem('bravesubAtoken');
    const tokenExist = !!token;
    const navigate = useNavigate()
    
    useEffect(() => {
      if (!tokenExist && !admin) {
        console.log('NO USER');
        toast.error('PLEASE LOGIN');
      } else {
        const decodedToken = jwtDecode(token);
        
        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          toast.error('Session expiried, Please login');
          navigate('/login')
        }
      }
    }, [adminCurrentUser, tokenExist]); 
  
    return tokenExist && admin ? <Outlet /> : <Navigate to={'/'} />;
  }


  export {AuthorizeUser, AuthorizeAdmin}