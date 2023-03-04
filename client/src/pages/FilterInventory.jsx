import React from 'react'
import { Helmet } from 'react-helmet';

export const FilterInventory = () => {
  return (
    <div className='pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen'>
      <Helmet>
        <title>Filter Inventory</title>
        <meta name="filter inventory" content="This is the Filter Inventory Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Filter Inventory
        </h1>
      </div>
    </div>
  )
}
