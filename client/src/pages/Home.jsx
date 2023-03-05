import React from 'react'
import HomeBannerImg from '../assets/home-jmi.png'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <div className='flex items-center h-screen justify-center flex-col'>
        <div className='bg-white p-5 rounded-md '>
          <img src={HomeBannerImg} />
        </div>

        <div className='home-button flex mt-10'>

          <button className='bg-white flex items-center py-3 px-6 rounded-full mx-5' onClick={() => navigate('/viewBill')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ msFilter: "" }}
              fill="rgb(124 58 237)"
            >
              <path d="M15.999 8.5h2c0-2.837-2.755-4.131-5-4.429V2h-2v2.071c-2.245.298-5 1.592-5 4.429 0 2.706 2.666 4.113 5 4.43v4.97c-1.448-.251-3-1.024-3-2.4h-2c0 2.589 2.425 4.119 5 4.436V22h2v-2.07c2.245-.298 5-1.593 5-4.43s-2.755-4.131-5-4.429V6.1c1.33.239 3 .941 3 2.4zm-8 0c0-1.459 1.67-2.161 3-2.4v4.799c-1.371-.253-3-1.002-3-2.399zm8 7c0 1.459-1.67 2.161-3 2.4v-4.8c1.33.239 3 .941 3 2.4z"></path>
            </svg>
            <p className='pl-2 text-violet-600 font-bold'>Billing</p>
          </button>

          <button className='bg-white flex items-center py-3 px-6 rounded-full mx-5' onClick={() => navigate('/expenseRecord')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ msFilter: "" }}
              fill="rgb(124 58 237)"
            >
              <path d="M20 2H10a2 2 0 00-2 2v2h8a2 2 0 012 2v8h2a2 2 0 002-2V4a2 2 0 00-2-2z"></path>
              <path d="M4 22h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2zm2-10h6v2H6v-2zm0 4h6v2H6v-2z"></path>
            </svg>
            <p className='pl-2 text-violet-600 font-bold'>Expenses</p>
          </button>

          <button className='bg-white flex items-center py-3 px-6 rounded-full mx-5' onClick={() => navigate('/viewInventory')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ msFilter: "" }}
              fill="rgb(124 58 237)"
            >
              <path d="M21 3h-7a2.98 2.98 0 00-2 .78A2.98 2.98 0 0010 3H3a1 1 0 00-1 1v15a1 1 0 001 1h5.758a2.01 2.01 0 011.414.586l1.121 1.121c.009.009.021.012.03.021.086.08.182.15.294.196h.002a.996.996 0 00.762 0h.002c.112-.046.208-.117.294-.196.009-.009.021-.012.03-.021l1.121-1.121A2.01 2.01 0 0115.242 20H21a1 1 0 001-1V4a1 1 0 00-1-1zm-1 15h-4.758a4.03 4.03 0 00-2.242.689V6c0-.551.448-1 1-1h6v13z"></path>
            </svg>
            <p className='pl-2 text-violet-600 font-bold'>Inventory</p>
          </button>
        </div>

      </div >
    </div >
  )
}
