import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const EditExpense = () => {
  const [deduction, setDeduction] = useState("");
  const [amount, setAmount] = useState(0);
  const [process, setProcess] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const id = params.id.toString();

  useEffect(() => {
    getExpense();
  }, []);

  // /////  get expense by id/////////
  const getExpense = async () => {
    const res = await axios.get(`http://localhost:5000/readExpense/${id}`);
    setDeduction(res.data.data.deductionType);
    setAmount(res.data.data.amount);
    setProcess(res.data.data.processBy);
  };

  /////edit expense/////
  const submmitEditExpense = () => {
    axios
      .put(`http://localhost:5000/editExpense/${id}`, {
        deduction: deduction,
        amount: amount,
        process: process,
      })
      .then(() => {
        alert("Expense Updated Successfully");
        navigate("/expenseRecord");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="px-80 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <div className="text-center border-b-2 pb-3">
        <h1 className="font-extrabold text-3xl text-white">Add Expense</h1>
      </div>
      <div className=" bg-white rounded-md shadow-lg mt-8 p-5 ">
        <div className="flex gap-10">
          <div className=" leading-8 ">
            <label
              for="name"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Deduction Type:
            </label>
            <input
              type="text"
              id="deduction"
              placeholder="Deduction Type"
              required
              className="input  border border-solid border-gray-300"
              value={deduction}
              onChange={(e) => {
                setDeduction(e.target.value);
              }}
            />

            <label
              for="amount"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Amount"
              required
              className=" input  border border-solid border-gray-300"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />

            <label
              for="process"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Process by:
            </label>
            <input
              type="text"
              id="process"
              placeholder="Process by"
              required
              className="input  border border-solid border-gray-300"
              value={process}
              onChange={(e) => {
                setProcess(e.target.value);
              }}
            />
          </div>
          {/* <div>
            <img src={img1} alt="" className="h-48 w-48" />
          </div> */}
        </div>
        <button
          type="submit"
          className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
          onClick={submmitEditExpense}
        >
          Edit Expense
        </button>
      </div>
    </div>
  );
};
