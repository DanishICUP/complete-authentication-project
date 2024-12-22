import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../contextApi/AppContext'


const Header = () => {

    const {userData} = useContext(AppContext)

    return (
        <>
            <h2 className='text-4xl gap-3'>hy, <span className='text-red-900 '>{userData.name} !</span></h2>
            <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-700'>



                <img src={assets.header_img} className='w-36 h-36 rounded-full mb-6' alt="" />

                <h1 className='flex items-center gap-2 text-xl sm:text-2xl font-medium mb-2'>hy {userData ? userData.name : 'developers' }! 

                    <img src={assets.hand_wave} className='w-8 aspect-square' alt="" />

                </h1>

                <h2 className='font-semibold mb-4 text-3xl'>Welcome to Our App </h2>

                <p className='text-sm sm:text-lg'>let's start with a quick tour i am here to help you</p>

                <button
                    className='border border-gray-700 px-8 py-2 rounded-full bg-gray-200 text-black hover:bg-gray-500 transition-all mt-4'>Get Start</button>

            </div>
        </>
    )
}

export default Header