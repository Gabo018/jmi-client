import React from 'react'
import HomeBannerImg from '../assets/home-jmi.png'

export const Home = () => {
  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <div className='flex items-center h-screen justify-center'>
        <div className='bg-white p-5 rounded-md'>
          <img src={HomeBannerImg} />
        </div>
      </div>
    </div>
  )
}
