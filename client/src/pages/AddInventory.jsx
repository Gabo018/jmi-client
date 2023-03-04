import React, { useState } from 'react'
import { Helmet } from "react-helmet";
import { useNavigate } from 'react-router-dom';
import img1 from "../pictures/jmi.jpg";

export const AddInventory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ date: new Date() });
  const onChangeData = ({ target }) => {
    const { name, value } = target;
    setData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onClickButton = async () => {
    const inventoryAPI = await fetch(`/api/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    const inventoryJson = await inventoryAPI.json()
    if (inventoryJson.status === 200) {
      alert(inventoryJson.message)
      navigate('/viewInventory');
    }
  }

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <Helmet>
        <title>Add Inventory</title>
        <meta name="addInventory" content="This is the Inventory Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Add Inventory
        </h1>
      </div>
      <div className=" bg-white rounded-md shadow-lg mt-8 p-5">
        <div className="flex justify-between gap-10">
          <div className=" leading-8 ">
            <label
              htmlFor="code"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Code:
            </label>
            <input
              name='code'
              type="text"
              id="code"
              placeholder="Code"
              required
              className="input  border border-solid border-gray-300"
              onChange={onChangeData}
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
              required
              className=" input  border border-solid border-gray-300"
              onChange={onChangeData}
            />

            <label
              htmlFor="amount"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Amount:
            </label>
            <input
              name='amount'
              type="number"
              id="amount"
              placeholder="Amount"
              required
              className="input  border border-solid border-gray-300 "
              onChange={onChangeData}
            />
            <button
              type="submit"
              className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
              onClick={onClickButton}
            >
              Add Inventory
            </button>
          </div>
          <div>
            <img src={img1} className="h-full w-96" />
          </div>
        </div>

      </div>
    </div>
  )
}
