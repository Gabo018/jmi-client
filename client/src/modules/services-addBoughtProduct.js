import axios from "axios";

export const userAddBoughtProduct = async (params) => {
  const data = await axios.post(`/api/bill/bought-product`, params);
  return data;
};
