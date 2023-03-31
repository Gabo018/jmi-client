import axios from "axios";

export const userGetBoughtProduct = (params) => async () => {
  const data = await axios.get(`/api/bill/bought-product/${params}`);
  return data;
};
