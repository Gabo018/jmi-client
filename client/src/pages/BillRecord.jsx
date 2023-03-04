import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Helmet } from "react-helmet";

export const BillRecord = () => {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getBillingData();
  }, []);

  //////Geting bill data
  const getBillingData = () => {
    axios
      .get(`/api/readBill`)
      .then((res) => {
        setBills(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // /////Delete bIll
  const deleteBill = async (id) => {
    if (window.confirm("Are you sure you want to delete the Bill")) {
      const res = await axios
        .delete(`/api/deleteBill/${id}`)
        .then(() => {
          setBills(
            bills.filter((val) => {
              return val._id !== id;
            })
          );
        });

      if (!res.status) {
        setBills(res.data);
      }
    }
  };

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 bg-cover min-h-screen">
      <Helmet>
        <title>Billing Record</title>
        <meta name="billingrecord" content="This is the Billing Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Billing Record
        </h1>
      </div>
      <div className="mt-6">
        <input
          className="input"
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <table className="border-collapse border-b border-x-transparent border-slate-400  bg-white mt-8 ">
        <thead>
          <tr className="text-violet-600">
            <th className="border-b border-slate-300  p-2">No.</th>
            <th className="border-b border-slate-300 p-2 w-1/4">Name</th>
            <th className="border-b border-slate-300 w-1/4 p-2">Contact</th>
            <th className="border-b border-slate-300  ">Date</th>
            <th className="border-b border-slate-300  w-1/3">Description</th>
            <th className="border-b border-slate-300  p-2">Total</th>
            <th className="border-b border-slate-300 w-1/4 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bills
            .filter((bill) => {
              if (search === "") {
                return bill;
              } else if (
                bill.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return bill;
              }
              return false;
            })
            .map((bill, index) => {
              return (
                <tr
                  className="border-b border-slate-300 odd:bg-zinc-300 "
                  key={index}
                >
                  <th scope="arrow">{index + 1}</th>
                  <td className="p-1 text-center font-medium text-sm">
                    {bill.name}
                  </td>
                  <td className="text-center text-sm">{bill.contact}</td>
                  <td className="p-2 text-xs ">
                    <DatePicker
                      selected={new Date(bill.date)}
                      locale="en-GB"
                      dateFormat="MM-d-yyyy h:mm aa"
                      placeholderText="Weeks start on Monday"
                      disabled
                      className="text-center"
                    />
                  </td>
                  <td className=" text-center">{bill.description}</td>
                  <td className=" text-center">
                    {bill.total.toLocaleString()}
                  </td>
                  <td className="flex gap-4 justify-center mt-3">
                    <button
                      className="text-red-800 "
                      onClick={() => deleteBill(bill._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>

                    <button className="text-green-800">
                      <Link to={`/editBill/${bill._id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </Link>
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
