import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { BiRightArrowAlt } from "react-icons/bi";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, DatePicker, Form, Input, notification } from "antd";
import { useMutation } from "react-query";
import { userAddBill } from "../modules/services-addBill";

export const AddBill = () => {
  const { mutate} =
    useMutation(userAddBill);
  const onSubmit = (values) => {
    mutate(values , {
      onSuccess:() => {
        form.resetFields();
        notification.success({
          message: "Success",
          description: "Billing Added",
        });
      },
      onError:() => {
        notification.error({
          message: "Failed",
          description: "Something went wrong",
        });
        
      }
    })
  };

 

 
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
        onFinish={onSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input valid email!",
            },
          ]}
        >
          <Input size="large" />
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
          <DatePicker className="w-full" size="large" />
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
          <Input className="w-full" size="large" />
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
        }