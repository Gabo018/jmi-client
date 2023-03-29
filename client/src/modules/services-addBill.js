import axios from "axios";

export const userAddBill = async (params) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = await axios.post("/api/addBill", params, axiosConfig);
  return data;
};
