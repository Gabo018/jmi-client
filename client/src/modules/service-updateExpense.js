import axios from "axios";

export const userUpdateExpense = async (params) => {
    const axiosConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    };

    const data = await axios.patch(
        `/api/expenses/${params.id}`,
        params,
        axiosConfig
    );
    return data;
};
