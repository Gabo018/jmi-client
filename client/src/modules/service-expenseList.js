import axios from "axios";

export const userGetListExpense = () => async () => {
  const data = await axios.get(`/api/expense/archive-list`);
  return data;
};
