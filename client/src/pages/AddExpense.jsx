import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import img1 from "../pictures/jmi.jpg";
import { Button, DatePicker, Form , Input  , InputNumber, notification } from "antd";
import { userAddExpense } from "../modules/service-addExpense";
import { useMutation } from "react-query";

export const AddExpense = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [expenses, setExpenses] = useState();
  const onChangeExpenses = ({ target }) => {
    const { name, value } = target;
    setExpenses(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const {mutate} = useMutation(userAddExpense)
 
  const onSubmit = (values) => {
    const params = {
      name:values.name,
      due:values.due,
      amount:values.amount

    }
    console.log(params)
    
    mutate(params, {
      onSuccess: () => {
       
        notification.success({
          message: "Success",
          description: "Product Added Successfully",
        });
      },
      onError: () => {
        notification.error({
          message: "Error",
          description: "Something went wrong",
        });
      },
    });
  
  }

  return (
   
      <div className="flex flex-col justify-center items-center pl-80 pr-28 bg-gray-200 h-screen">
        <div className="py-5">
          <h5 className="font-bold text-2xl">Add Expense</h5>
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
          onFinish={onSubmit}
          autoComplete="off"
        >
            <Form.Item
            label="name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input valid email!",
              },
            ]}
          >
            <Input size="large" style={{width:"100%"}} />
          </Form.Item>
          <Form.Item
            label="amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input valid email!",
              },
            ]}
          >
            <InputNumber size="large" style={{width:"100%"}} />
          </Form.Item>
  
          <Form.Item
            label="Due Date"
            name="due"
            rules={[
              {
                required: true,
                message: "Please input your due_date!",
              },
            ]}
          >
            <DatePicker className="w-full" size="large" />
          </Form.Item>
        
       
  
          <Form.Item className="text-center bottom-0 ">
            {" "}
            <>
              <Button
                htmlType={"submit"}
                className="btn bg-blue-500 text-white btn-outline-light btn-lg w-75  rounded-lg "
              >
                Submit
              </Button>
            </>
          </Form.Item>
        </Form>
      </div>
    )
     
};
