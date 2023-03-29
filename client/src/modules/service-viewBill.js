import axios from "axios";

export const userGetBill = (params) => async () => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = await axios.get("/api/bill", {
    params,
  });
  return data;
};
