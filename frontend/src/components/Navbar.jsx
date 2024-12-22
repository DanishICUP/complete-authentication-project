import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contextApi/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';


const Navbar = ({setLoading}) => {


  const { userData, setIsLoggedIn, setUserData, backendUrl } = useContext(AppContext);
 

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      console.log(data);

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        toast.success(data.message || "Logged out successfully");
        navigate('/')
      } else {
        toast.error("something went wrong")
      }


    } catch (error) {
      console.log(error.message);
      toast.error(error.message)

    }
  }

  const sendVerifyOtp = async () => {
    setLoading(true)
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/otp');
      console.log(data);
      if (data.success) {
        navigate('/verifyEmail');
        toast.success(data.message);
      } else {
        toast.error(data.message || 'something went wrong')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const navigate = useNavigate()

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

      <img src={assets.logo} className='w-28 sm:w-32' alt="" />

        {userData ?

          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black cursor-pointer text-white group relative'>
            {userData.name[0].toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>

              <ul className='list-none m-0 p-2 bg-gray-200 text-sm'>
                {!userData.isAccountVerified && <li onClick={sendVerifyOtp} className='py-1 px-2 hover:bg-gray-300 text-black cursor-pointer'>Verify Email</li>
                }

                <li onClick={logout} className='py-1 px-2 hover:bg-gray-300 text-black cursor-pointer pr-10'>Logout</li>
              </ul>

            </div>
          </div>
          : <button onClick={() => navigate('/login')}
            className='flex items-center px-6 py-2 gap-3 border text-gray-800 border-gray-500 rounded-full hover:bg-gray-100 '>Login <img src={assets.arrow_icon} alt="" /></button>
      }


    </div>
  )
}

export default Navbar