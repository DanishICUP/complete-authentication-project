import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../contextApi/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RotatingLines } from 'react-loader-spinner'


const Login = () => {

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setpassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });

        console.log(data);
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          setState('Login');
          toast.success(data.message);
        } else {
          console.error('Registration failed:', data.message);
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });

        console.log(data);
        if (data.success) {
          setIsLoggedIn(true);
          navigate('/');
          getUserData();
          toast.success(data.message);
        } else {
          toast.error('incorrect Email and password');
        }

      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    console.log('State has changed to:', state);
  }, [state]);



  return (


    <div className='flex items-center justify-center px-6 sm:px-0 min-h-screen bg-gradient-to-br from-blue-200 to-pink-300'>
      <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer ' alt="" />

      {loading ? (
        <p className='text-center text-3xl '>
          <RotatingLines
            visible={true}
            height="96"
            width="96"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />


        </p>
      ) : (


        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-200 text-sm'>

          <h1 className='text-3xl font-semibold mb-3 text-center'>
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </h1>

          <p className='text-sm mb-6 font-sans text-center'>
            {state === 'Sign Up' ? 'Create an Account' : 'Login to Your Account'}
          </p>

          <form onSubmit={onSubmitHandler}>
            {state === 'Sign Up' && (<div className='flex gap-3 mb-4 items-center w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} className='' alt="" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none' type="text" placeholder='Enter FullName...' required />
            </div>)}


            <div className='flex gap-3 mb-4 items-center w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.mail_icon} className='' alt="" />
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                className='bg-transparent outline-none' type="email" placeholder='Enter Email address...' required />
            </div>

            <div className='flex gap-3 mb-4 items-center w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.lock_icon} className='' alt="" />
              <input
                onChange={e => setpassword(e.target.value)}
                value={password}
                className='bg-transparent outline-none' type="password" placeholder='Enter password...' required />
            </div>

            <p onClick={() => navigate('/resetpassword')} className='mb-3 text-indigo-400 cursor-pointer'>Forgot Password?</p>

            <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-300 to-indigo-950 text-white font-medium' type="submit">{state}</button>

          </form>


          {state === 'Sign Up' ? (<p className='flex text-gray-400 mt-4 text-xs font-medium text-center gap-3'>Already have an account ?
            <span onClick={() => setState('Login')} className='text-indigo-600 underline cursor-pointer'>Login here</span>
          </p>) : (<p className='flex text-gray-400 mt-4 text-xs font-medium text-center gap-3'>Don't have an account ?
            <span onClick={() => setState('Sign Up')} className='text-indigo-600 underline cursor-pointer'>SignUp here</span>
          </p>
          )}

        </div>
      )}
    </div>
  )
}


export default Login