import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { userDeleteExpense } from '../modules/service-editArchiveExpense'
import { useMutation } from 'react-query'
import { notification } from 'antd'

export const EditExpenses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editExpenses, setEditExpenses] = useState({ deductionType: '', description: '', amount: '', date: '' });
  const onChangeEditExpenses = ({ target }) => {
    const { name, value } = target;
    setEditExpenses(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitExpenses = async () => {
    try {
      console.log(editExpenses)
      const updateData = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editExpenses)
      })
      if (updateData.ok) {
        const updateJson = await updateData.json();
        alert(updateJson.message)
        navigate('/expenseRecord')
      }
    } catch (err) {
      console.log(err)
    }
  }
  const {mutate} = useMutation(userDeleteExpense)
  const handleDelete = (id) => {
    mutate(id, {
      onSuccess: () => {
      
        notification.success({
          message: "Success",
          description: "Billing moved to archive list",
        });
      },
      onError: () => {
        notification.error({
          message: "Failed",
          description: "Something went wrong",
        });
      },
    });
  };

  const retrieveData = async () => {
    try {
      const data = await fetch(`/api/expenses/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.ok) {
        const dataJson = await data.json();
        setEditExpenses(dataJson)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    retrieveData()
  }, [])


  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 pb-20 h-screen">
      <Helmet>
        <title>Edit Expenses</title>
        <meta name="edit expenses" content="This is the Edit Expenses Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Edit Expenses
        </h1>
      </div>
      <div className="flex bg-white rounded-md shadow-lg mt-8 p-5 ">
        <div className="gap-10">
          <div className="leading-8">
            <div className='my-5'>
            </div>
            <label
              htmlFor="deductionType"
              className="form-label inline-block my-2 text-gray-700 font-bold"
            >
              Deduction Type:
            </label>
            <select
              name='deductionType'
              className="input  border border-solid border-gray-300"
              onChange={onChangeEditExpenses}
              value={editExpenses?.deductionType}
            >
              <option>-select deduction type-</option>
              <option value='equipment/material'>Equipment / Material</option>
              <option value='utilities'>Utilities</option>
              <option value='bills'>Bills</option>
              <option value='transportation'>Transportation</option>
              <option value='mortage/tent'>Mortage / Tent</option>
              <option value='carwash supplies'>Carwash Supplies</option>
              <option value='cleaning supplies'>Cleaning Supplies</option>
              <option value='males'>Meals</option>
              <option value='gas and oil'>Gas and Oil</option>
              <option value='repairs'>Repairs</option>
              <option value='other'>Others</option>
            </select>

            <label
              htmlFor="description"
              className="form-label inline-block my-2 text-gray-700 font-bold"
            >
              Description:
            </label>
            <textarea
              name='description'
              type="text"
              id="description"
              placeholder="description"
              onChange={onChangeEditExpenses}
              value={editExpenses?.description}
              required
              className=" input  border border-solid border-gray-300"
            />

            <label
              htmlFor="amount"
              className="form-label inline-block my-2 text-gray-700 font-bold"
            >
              Amount:
            </label>
            <input
              name='amount'
              type="number"
              id="amount"
              onChange={onChangeEditExpenses}
              value={editExpenses?.amount}
              required
              className="input  border border-solid border-gray-300 "
            />

            <label
              htmlFor="date"
              className="form-label inline-block my-2 text-gray-700 font-bold"
            >
              Date:
            </label>
            <input
              name='date'
              type="date"
              id="date"
              onChange={onChangeEditExpenses}
              value={moment(editExpenses?.date).format('YYYY-MM-DD')}
              required
              className="input  border border-solid border-gray-300 "
            />

            <button
              type="submit"
              className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
              onClick={onSubmitExpenses}
            >
              Edit Expenses
            </button>
            <button
              type="submit"
              className="bg-red-600 mx-2 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
              onClick={() => handleDelete(id)}
            >
           Archive
            </button>
           
          </div>
        </div>
      </div>
    </div >
  )
}
