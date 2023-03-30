import axios from "axios";

export const userDeleteInventory = async (params) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const data = await axios.patch(`/api/inventory/${params}`, axiosConfig);
  return data;
};
