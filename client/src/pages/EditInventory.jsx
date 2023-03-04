import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'


export const EditInventory = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [userData, setUserData] = useState({ code: '', description: '', amount: '', date: '' });
  const viewInventoryByID = async () => {
    try {
      const data = await fetch(`/api/inventory/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (data.ok) {
        const dataJson = await data.json()
        setUserData(dataJson)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onChangeData = ({ target }) => {
    const { name, value } = target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitData = async () => {
    console.log(userData)
    const submitData = await fetch(`/api/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    if (submitData.ok) {
      const submitJson = await submitData.json()
      if (submitJson.acknowledged) {
        alert('Inventory Edited Successfully.')
        navigate('/viewInventory');
      }
    }
  }

  useEffect(() => {
    viewInventoryByID();
  }, [])

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 pb-20 h-screen">
      <Helmet>
        <title>Edit Inventory</title>
        <meta name="edit inventory" content="This is the Edit Inventory Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Edit Inventory
        </h1>
      </div>
      <div className=" bg-white rounded-md shadow-lg mt-8 p-5 ">
        <div className="flex gap-10">
          <div className=" leading-8 ">
            <label
              htmlFor="code"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Product Code
            </label>
            <input
              name='code'
              type="text"
              id="code"
              placeholder="Product Code"
              onChange={onChangeData}
              value={userData?.code}

              required
              className="input border border-solid border-gray-300"
            />

            <label
              htmlFor="description"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Description:
            </label>
            <input
              name='description'
              type="text"
              id="description"
              placeholder="Description"
              value={userData?.description}
              onChange={onChangeData}
              required
              className="input border border-solid border-gray-300"
            />

            <label
              htmlFor="amount"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Amount:
            </label>
            <input
              name='amount'
              type="text"
              id="amount"
              placeholder="Product Amount"
              value={userData?.amount}
              onChange={onChangeData}
              required
              className="input border border-solid border-gray-300"
            />

            <label
              htmlFor="date"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Date:
            </label>
            <input
              name='date'
              type="date"
              id="date"
              value={moment(userData?.date).format('YYYY-MM-DD')}
              onChange={onChangeData}
              required
              className="input border border-solid border-gray-300"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
          onClick={onSubmitData}
        >
          Edit Inventory
        </button>
      </div>
    </div>
  )
}
