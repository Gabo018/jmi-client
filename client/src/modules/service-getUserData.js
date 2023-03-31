import axios from "axios";

export const userGetData = (params) => async () => {
  const data = await axios.get(`/api/bill/${params || ""}`);
  return data;
};
