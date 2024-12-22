import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

    axios.defaults.withCredentials = true

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin , setIsLoggedIn] = useState(false);
    const [userData , setUserData] = useState(false)


    const getAuthStatus = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/auth-user');
            console.log(data);
            if (data.success) {
                setIsLoggedIn(true);
                getUserData()
            }
            
        } catch (error) {
            toast.error(error.error)
        }
    }

    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/get-user-data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
            console.log(data);
            
        } catch (error) {
            toast.error(error.error)
        }
    }

    useEffect(()=>{
        getAuthStatus()
    },[])

    const value = {
        backendUrl,
        isLoggedin , setIsLoggedIn,
        userData , setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}