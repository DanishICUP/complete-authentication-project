import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { RotatingLines } from 'react-loader-spinner'


const Home = () => {
  const [loading, setLoading] = React.useState(false)
  return (
    
    loading ? (
      <div className="flex items-center justify-center min-h-screen">
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
      </div>
    ) : (
      <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
        <Navbar loading={loading} setLoading={setLoading} />
        <Header loading={loading} setLoading={setLoading} />
      </div>
    )
  )
}

export default Home