import axios from "axios";

export const userGetArchiveList = () => async () => {
  const data = await axios.get(`/api/bill/archive-list`);
  return data;
};
