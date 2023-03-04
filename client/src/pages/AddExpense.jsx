import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import img1 from "../pictures/jmi.jpg";

export const AddExpense = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState();
  const onChangeExpenses = ({ target }) => {
    const { name, value } = target;
    setExpenses(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitExpenses = async () => {
    try {
      const addExpenses = await fetch(`/api/expenses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenses)
      });
      if (addExpenses.ok) {
        const expensesJson = await addExpenses.json();
        alert(expensesJson.message)
        navigate('/expenseRecord')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <Helmet>
        <title>Add Expenses</title>
        <meta name="addexpense" content="This is the expense Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">Add Expenses</h1>
      </div>
      <div className=" bg-white rounded-md shadow-lg mt-8 p-5 ">
        <div className="flex gap-10 justify-between">
          <div className=" leading-8 ">
            <label
              htmlFor="deductionType"
              className="form-label inline-block my-2 text-gray-700 font-bold"
            >
              Deduction Type:
            </label>
            <select
              name='deductionType'
              className="input  border border-solid border-gray-300"
              onChange={onChangeExpenses}
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
              onChange={onChangeExpenses}
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
              onChange={onChangeExpenses}
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
              onChange={onChangeExpenses}
              required
              className="input  border border-solid border-gray-300 "
            />

            <button
              type="submit"
              className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
              onClick={onSubmitExpenses}
            >
              Add Expenses
            </button>

          </div>
          <div>
            <img src={img1} alt="" className="h-full w-96" />
          </div>
        </div>

      </div>
    </div>
  );
};
