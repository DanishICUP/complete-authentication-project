import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../contextApi/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ThreeDots } from 'react-loader-spinner'

const ResetPassword = () => {

  const { backendUrl } = useContext(AppContext)

  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [newpassword, setnewpassword] = useState('')
  const [loading, setloading] = useState(false);
  const [isEmailSent, setisEmailSent] = useState('')
  const [otp, setotp] = useState(false)
  const [isotpSubmitted, setisotpSubmitted] = useState(0)


  const navigate = useNavigate();

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


  // on submitte 
  const onEmailSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      console.log(data);

      if (data.success) {
        setisEmailSent(true)
        toast.success(data.message);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      
      toast.error(error.message)
    }
    setloading(false)
  }

  //on otp submit
  const onOtpSubmit = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setotp(otpArray.join(''));
    setisotpSubmitted(true)
  }

  //reset password
  const OnResetPassword = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password',{email , otp , newpassword})
      if (data.success) {
        toast.success(data.message);
        navigate('/login')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      
      toast.error(error.message)
    }
  }



  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-pink-300 p-4'>
      <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer ' alt="" />

      {!isEmailSent &&

        <form onSubmit={onEmailSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-2xl text-center text-white mb-3'>Reset Password </h1>
          <p className='text-center mb-6 text-indigo-600'>Enter Your Email Id which You Register This Account  </p>

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
              <div className='mb-6 flex items-center gap-3 w-full px-5 py-2.5 bg-[#333A5C] rounded-full'>
                <img src={assets.mail_icon} alt="" className='w-3 h-3' />
                <input type="email" placeholder='Enter Your Email' className='w-full bg-transparent outline-none text-white' value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            )
          }

          <button className='w-full py-3 text-white bg-gradient-to-r from-purple-300 to-red-900 rounded-full ' type="submit" >Verify</button>
        </form>
      }




      {/* otp form */}
      {
        !isotpSubmitted && isEmailSent &&
        <form onSubmit={onOtpSubmit} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-2xl text-center text-white mb-3'>Reset Password otp</h1>
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
          <button className='w-full py-3 px-8 bg-gradient-to-r from-indigo-300 to-indigo-900 rounded-full text-white ' type="submit">Submit</button>
        </form >

      }




      {/* new password form */}


      {
        isotpSubmitted && isEmailSent &&


        <form onSubmit={OnResetPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-2xl text-center text-white mb-3'>New Password </h1>
          <p className='text-center mb-6 text-indigo-600'>Enter Your New Password </p>

          <div className='mb-6 flex items-center gap-3 w-full px-5 py-2.5 bg-[#333A5C] rounded-full'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='Enter New Password' className='w-full bg-transparent outline-none text-white' value={newpassword} onChange={e => setnewpassword(e.target.value)} required />
          </div>

          <button className='w-full py-3 text-white bg-gradient-to-r from-purple-300 to-red-900 rounded-full ' type="submit" >submit</button>
        </form>
      }

    </div >
  )
}

export default ResetPassword