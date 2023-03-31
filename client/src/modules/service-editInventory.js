import axios from "axios";

export const userEditInventory = async (params) => {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const data = await axios.patch(
    `/api/inventory/${params.id}`,
    params,
    axiosConfig
  );
  return data;
};
