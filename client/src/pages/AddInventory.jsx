import { Button, DatePicker, Form, Input, InputNumber, notification } from 'antd';
import moment from 'moment';
import React, { useState } from 'react'
import { Helmet } from "react-helmet";
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { userAddProduct } from '../modules/components/service-addProduct';
import img1 from "../pictures/jmi.jpg";

export const AddInventory = () => {
  const [form] = Form.useForm();
  const {mutate} = useMutation(userAddProduct)

  const onSubmit = (values) => {
    const params = {
      date:moment(),
      name:values.name,
      amount:parseInt(values.price),
      quantity:values.quantity
      
    }
    console.log(values)
    mutate(params , {
      onSuccess:() => {
        form.resetFields()
        notification.success({
          message:"Success",
          description:"Product added successfully"
        })
      },
      onError:() => {
        notification.error({
          message:"Error",
          description:"Something went wrong"
        })
      }
    })
  }


 

  return (
    <div className="flex flex-col justify-center items-center pl-80 pr-28 bg-gray-200 h-screen">
    <div className="py-5">
      <h5 className="font-bold text-2xl">Add Product</h5>
    </div>
    <Form
      className="position-relative overflow-y-auto bg-gray-200 max-h-[600px] p-4"
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
        label="Name of product"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input valid Name!",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[
          {
            required: true,
            message: "Please input your quantity!",
          },
        ]}
      >
      <InputNumber size='large' style={{ width: '100%' }} />
      </Form.Item>

     

      <Form.Item
        label="Price"
        name="price"
        rules={[
          {
            required: true,
            message: "Please input your price!",
          },
        ]}
      >
           <InputNumber size='large' style={{ width: '100%' }} />
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
