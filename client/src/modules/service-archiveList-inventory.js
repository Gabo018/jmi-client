import axios from "axios";

export const userGetArchiveListInventory = () => async () => {
  const data = await axios.get(`/api/inventory/archive-list`);
  return data;
};
