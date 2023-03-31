import axios from "axios";

export const userUpdateBill = async (params) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = await axios.patch(
    `/api/bill-edit/${params.id}`,
    params,
    axiosConfig
  );
  return data;
};
