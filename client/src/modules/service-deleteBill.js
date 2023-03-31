import axios from "axios";

export const userDeleteBill = async (params) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = await axios.patch(`/api/bill-archive/${params}`);
  return data;
};
