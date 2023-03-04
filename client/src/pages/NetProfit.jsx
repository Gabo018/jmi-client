import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

export const Profit = () => {
  const [totalProfit, setTotalProfit] = useState([]);

  useEffect(() => {
    getTotalProfit();
  }, []);

  const getTotalProfit = () => {
    axios
      .get(`/api/netProfit`)
      .then((res) => {
        setTotalProfit(res.data.data);
        console.log();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <Helmet>
        <title>Net Profit</title>
        <meta name="profit" content="This is the profit Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          Net Profit
        </h1>
      </div>

      <div className="bg-white p-8 mt-11 rounded-md shadow-xl text-center">
        <div className="font-bold text-xl text-green-600">
          <h1>
            Total Sale per year: Php {totalProfit.totalSales?.toLocaleString()}{" "}
            - Year {totalProfit.totalSalesYear}
          </h1>
        </div>
        <div className="font-bold text-xl text-red-600">
          <h1>
            Total Loss per year: Php {totalProfit.totalLoss?.toLocaleString()} -
            Year {totalProfit.totalExpenseYear}
          </h1>
        </div>
        <div className="font-bold text-xl text-blue-500">
          Total Profit - Php {totalProfit.netProfit?.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
