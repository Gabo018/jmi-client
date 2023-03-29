import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { BiRightArrowAlt } from "react-icons/bi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, DatePicker, Form, Input } from "antd";

export const AddBill = () => {
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState();
  const [billData, setBillData] = useState();
  const onChangeBill = ({ target }) => {
    const { name, value } = target;
    setBillData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onSubmitBill = async (e) => {
    try {
      e.preventDefault();
      const addBill = await fetch(`/api/addBill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });
      const billJson = await addBill.json();
      if (billJson?.status === 500) {
        alert(billJson?.message);
      } else {
        alert("Billing Added Successfully.");
        navigate("/viewBill");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onCheckCode = async () => {
    try {
      const checkCode = await fetch(`/api/bill/${billData?.productCode}`);
      const checkJson = await checkCode.json();
      setProductInfo(checkJson);
    } catch (err) {
      console.log(err);
    }
  };

  function contactLimit(event) {
    if (event.target.value.length >= 11) {
      event.target.removeAttribute("type");
    }
    // setValue(event.target.value);
    setProductInfo((prev) => ({
      ...prev,
      ["contact"]: event.target.value,
    }));
  }

  const [form] = Form.useForm();

  return (
    <div className="flex flex-col justify-center items-center pl-80 pr-28 bg-gray-200 h-screen">
      <div className="py-5">
        <h5 className="font-bold text-2xl">Add Bill</h5>
      </div>
      <Form
        className="position-relative overflow-y-scroll bg-gray-200 max-h-[550px] p-4"
        name="login"
        initialValues={{
          remember: true,
        }}
        labelCol={{
          span: 24,
        }}
        form={form}
        onFinish={onSubmitBill}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input valid email!",
            },
          ]}
        >
          <Input
            size="large"
          
          />
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="due_date"
          rules={[
            {
              required: true,
              message: "Please input your due_date!",
            },
          ]}
        >
         <DatePicker className="w-full" size="large"/>
        </Form.Item>
       
        <Form.Item
          label="Total Payment"
          name="total_payment"
          rules={[
            {
              required: true,
              message: "Please input your Total Payment!",
            },
          ]}
        >
         <Input className="w-full" size="large"/>
        </Form.Item>
       
        
        <Form.Item
          label="Payment Date"
          name="payment_date"
          rules={[
            {
              required: true,
              message: "Please input your  Payment Date!",
            },
          ]}
        >
        <DatePicker className="w-full" size="large"/>
        </Form.Item>
       


        

        <Form.Item className="text-center bottom-0 ">
          {" "}
          <>
            <Button
             
              htmlType={"submit"}
              className="btn bg-blue-500 text-white btn-outline-light btn-lg w-75  rounded-lg "
            >
              Login
            </Button>
          </>
        </Form.Item>
      </Form>
    </div>
    // <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 h-screen">
    //   <Helmet>
    //     <title>Add Billing</title>
    //     <meta name="addbilling" content="This is the Billing Section" />
    //   </Helmet>
    //   <div className="text-center border-b-2 pb-3">
    //     <h1 className="text-center text-white text-5xl font-bold">Add Billing</h1>
    //   </div>
    //   <div className=" bg-white rounded-md shadow-lg mt-8 p-5">
    //     <div className="flex gap-10">
    //       <div className=" leading-8 ">
    //         <label
    //           htmlFor="name"
    //           className="form-label inline-block mb-2 text-gray-700 font-bold"
    //         >
    //           Name:
    //         </label>
    //         <input
    //           name='name'
    //           type="text"
    //           id="name"
    //           placeholder="Name"
    //           onChange={onChangeBill}
    //           required
    //           className="input  border border-solid border-gray-300"
    //         />

    //         <label
    //           htmlFor="contact"
    //           className="form-label inline-block mb-2 text-gray-700 font-bold"
    //         >
    //           Contact:
    //         </label>
    //         <input
    //           name='contact'
    //           type="number"
    //           onInput={contactLimit}
    //           id="contact"
    //           placeholder="Contact"
    //           maxLength={11}
    //           onChange={onChangeBill}
    //           required

    //           className=" input  border border-solid border-gray-300"
    //         />

    //         <label
    //           htmlFor="date"
    //           className="form-label inline-block mb-2 text-gray-700 font-bold"
    //         >
    //           Date:
    //         </label>
    //         <input
    //           name='date'
    //           type="date"
    //           id="date"
    //           onChange={onChangeBill}
    //           required
    //           className="input  border border-solid border-gray-300 "
    //         />

    //         <label
    //           htmlFor="productCode"
    //           className="form-label inline-block mb-2 text-gray-700 font-bold"
    //         >
    //           Product Code:
    //         </label>
    //         <div className='billing-input-cont'>
    //           <input
    //             name='productCode'
    //             type="text"
    //             id="productCode"
    //             placeholder="Product Code"
    //             onChange={onChangeBill}
    //             maxLength={12}
    //             required
    //             className="input  border border-solid border-gray-300"
    //           />
    //           <button type='button' onClick={onCheckCode}>
    //             <BiRightArrowAlt className="billing-button-icon" />
    //           </button>

    //         </div>

    //       </div>
    //       <div>
    //         {
    //           productInfo && productInfo.code === 200
    //             ? <>
    //               <p><span className="font-bold">Description:</span> {productInfo.data[0].description}</p>
    //               <p><span className="font-bold">Code:</span> {productInfo.data[0].code}</p>
    //               <p><span className="font-bold">Amount:</span> {productInfo.data[0].amount}</p>
    //               <p><span className="font-bold">Date:</span>: {moment(productInfo.data[0].date).format('MMMM DD, YYYY')}</p>
    //             </> : productInfo?.code === 404 ? 'Product Code not found.' : null
    //         }
    //       </div>
    //     </div>
    //     <button
    //       type="submit"
    //       className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
    //       onClick={onSubmitBill}
    //     >
    //       Add Billing
    //     </button>
    //   </div>
    // </div>
  );
};
