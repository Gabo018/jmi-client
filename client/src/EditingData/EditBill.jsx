import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditBill = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState(0);
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const params = useParams();
  const id = params.id.toString();

  useEffect(() => {
    getBilling();
  }, []);

  ///////Geting bill by id/////////
  const getBilling = async () => {
    const res = await axios.get(`http://localhost:5000/readBills/${id}`);
    setName(res.data.data.name);
    setContact(res.data.data.contact);
    setDescription(res.data.data.description);
    setTotal(res.data.data.total);
  };

  ////////Edit bill by id///////
  const submitEditBill = () => {
    axios
      .put(`http://localhost:5000/editBill/${id}`, {
        name: name,
        contact: contact,
        description: description,
        total: total,
      })
      .then(() => {
        alert("Bill Updated Successfully");
        navigate("/billRecord");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="px-80 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
      <div className="text-center border-b-2 pb-3">
        <h1 className="font-extrabold text-3xl text-white">Add Billing</h1>
      </div>
      <div className=" bg-white rounded-md shadow-lg mt-8 p-5">
        <div className="flex gap-10">
          <div className=" leading-8 ">
            <label
              htmlfor="name"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              required
              className="input  border border-solid border-gray-300"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />

            <label
              htmlfor="contact"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Contact:
            </label>
            <input
              type="number"
              id="contact"
              placeholder="Contact"
              required
              className=" input  border border-solid border-gray-300"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
              }}
            />

            <label
              htmlfor="description"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Description:
            </label>
            <input
              type="text"
              id="description"
              placeholder="Description"
              required
              className="input  border border-solid border-gray-300 "
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />

            <label
              htmlfor="total"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Total:
            </label>
            <input
              type="number"
              id="total"
              placeholder="Total"
              required
              className="input  border border-solid border-gray-300 "
              value={total}
              onChange={(e) => {
                setTotal(e.target.value);
              }}
            />
          </div>
          {/* <div>
            <img src={img1} alt="" className="h-48 w-48" />
          </div> */}
        </div>
        <button
          type="submit"
          onClick={submitEditBill}
          className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
        >
          Edit Bill
        </button>
      </div>
    </div>
  );
};
