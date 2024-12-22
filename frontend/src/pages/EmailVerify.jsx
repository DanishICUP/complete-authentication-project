import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../contextApi/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ThreeDots } from 'react-loader-spinner'

const EmailVerify = () => {

  axios.defaults.withCredentials = true

  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext)

  const [loading, setloading] = useState(false)

  const navigate = useNavigate()

  const inputRefs = React.useRef([]);

  //auto move next box
  const inputHandler = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }
  //decrease box on backspace btn
  const handleKey = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }
  //when past otp auto past in all fields
  const handlepaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }
  //api call with enter otp
  const onSubmitHandler = async (e) => {
    setloading(true)
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');

      if (otpArray.includes('')) {
        toast.error("Please fill all OTP fields.");
        return;
      }

      const { data } = await axios.post(backendUrl + '/api/auth/verifyotp', { otp });
      console.log(data);

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/')

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setloading(false)
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData])

  return (


    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-pink-300 p-4'>
      <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer ' alt="" />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-2xl text-center text-white mb-3'>Email verify otp</h1>
        <p className='text-center mb-6 text-indigo-600'>Enter the 6-digit otp sent to Your Email id: </p>
        {
          loading ? (
            <div className='flex items-center justify-center w-full '>
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            </div>
          ) : (
            <div className='flex justify-between mb-8' onPaste={handlepaste}>
              {Array(6).fill(0).map((_, index) => (
                <input type='text' maxLength='1' key={index} required
                  className='w-12 h-12 bg-[#333A5C] rounded-md text-white text-lg text-center'
                  ref={e => inputRefs.current[index] = e}
                  onInput={(e) => inputHandler(e, index)}
                  onKeyDown={(e) => handleKey(e, index)}
                />
              ))}
            </div>
          )
        }
        <button className='w-full py-3 px-8 bg-gradient-to-r from-indigo-300 to-indigo-900 rounded-full text-white ' type="submit">Verify Email</button>
      </form >
    </div >
  )
}

export default EmailVerify