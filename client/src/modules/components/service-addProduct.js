import axios from "axios";

export const userAddProduct = async (params) => {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const data = await axios.post("/api/inventory", params, axiosConfig);
  return data;
};
