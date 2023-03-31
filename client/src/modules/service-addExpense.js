import axios from "axios";

export const userAddExpense = async (params) => {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const data = await axios.post("/api/expenses", params, axiosConfig);
  return data;
};
