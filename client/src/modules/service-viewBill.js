import axios from "axios";

export const userGetBill = async (params) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = await axios.get("/api/bill", params, axiosConfig);
  return data;
};
