import React, { useState, useEffect } from 'react'
import HomeBannerImg from '../assets/home-jmi.png'
import { useNavigate, Link } from 'react-router-dom'



function HomeCard({ color, title, link, total }) {
  return (
    <div className='home-card' style={{ backgroundColor: color }}>
      <div className='card-name-value'>
        <div className='card-value'>
          {total}
        </div>
        <div className='card-name'>
          Total {title}
        </div>
      </div>
      <div className='more-info'>
        <Link to={link}>
          More Info
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: `rgba(255, 255, 255, 1)` }}><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 15v-4H7v-2h5V7l5 5-5 5z"></path></svg>
        </Link>
      </div>
    </div>
  );
}


export const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();

  useEffect(() => {
    async function homeData() {
      const data = await fetch(`/api/homeData`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const dataJson = await data.json()
      setData(dataJson)
    }

    homeData();
  }, [])

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <div className='flex items-start h-screen justify-center flex-row gap-10 pt-20'>

        <HomeCard
          color={'red'}
          title='Item Inventory'
          link='/viewInventory'
          total={data?.inventoryTotalItem || 0}
        />

        <HomeCard
          color={'green'}
          title='Sales'
          link='/sales'
          total={data?.totalSales || 0}
        />

        <HomeCard
          color={'orange'}
          title='Expenses'
          link='/loss'
          total={data?.totalExpenses || 0}
        />


      </div >
    </div >
  )
}


