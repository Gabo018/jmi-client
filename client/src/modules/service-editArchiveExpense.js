import axios from "axios";

export const userDeleteExpense = async (params) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = await axios.patch(`/api/expense/${params}`);
  return data;
};
