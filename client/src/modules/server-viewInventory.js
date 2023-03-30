import axios from "axios";

export const userGetInventoryList = () => async () => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const data = await axios.get(`/api/inventory`, axiosConfig);
  return data;
};
