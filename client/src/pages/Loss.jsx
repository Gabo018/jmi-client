import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

export const Loss = () => {
  const [loss, setLoss] = useState([]);

  useEffect(() => {
    getLoss();
  }, []);

  const getLoss = () => {
    axios
      .get(`/api/loss`)
      .then((res) => {
        setLoss(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <Helmet>
        <title>Loss Record</title>
        <meta name="lossrecord" content="This is the Loss Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Loss Record
        </h1>
      </div>
      <div className="flex justify-center">
        <table className="border-collapse border-b border-x-transparent border-slate-400  bg-white mt-8 w-3/5 ">
          <thead>
            <tr className="text-violet-600">
              <th className="border-b border-slate-300 p-2 w-1/2">Month</th>
              <th className="border-b border-slate-300 w-1/6 p-2">Sales</th>
              <th className="border-b border-slate-300  w-1/2 p-2">Year</th>
            </tr>
          </thead>
          <tbody>
            {loss &&
              loss.map((expense, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b border-slate-300 odd:bg-zinc-300 "
                  >
                    <td className="p-1 text-center font-medium text-lg">
                      {expense.Month}
                    </td>
                    <td className="p-1 text-center font-medium text-lg">
                      {expense.Loss.toLocaleString()}
                    </td>

                    <td className="p-1 text-center font-medium text-lg">
                      {expense._id.Year}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
