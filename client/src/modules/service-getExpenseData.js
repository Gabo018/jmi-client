import axios from "axios";

export const userGetExpenseData = (params) => async () => {
    const axiosConfig = {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    };
    const data = await axios.get(`/api/expenses/${params || ""}`, axiosConfig);
    return data;
};
