import axios from "axios";

export const userAddBoughtProduct = () => async () => {
  const data = await axios.post(`/api//bill/bought-product`);
  return data;
};
