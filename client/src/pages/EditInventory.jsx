import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Table } from 'antd'
import imagePlaceholder from '../pictures/image-blank.jpg';
import { useMutation } from 'react-query'
import { userEditInventory } from '../modules/service-editInventory'

export const EditInventory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  let { id } = useParams();
  const {mutate} = useMutation(userEditInventory)

  const [visible, setVisible] = useState(false);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };
  
  const [userData, setUserData] = useState({ code: '', description: '', amount: '', date: '' });
  const viewInventoryByID = async () => {
    try {
      const data = await fetch(`/api/inventory/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (data.ok) {
        const dataJson = await data.json()
        setUserData(dataJson)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const totalUntaxed = Math.trunc(userData.amount * userData.quantity);
  const totalWithTax = Math.trunc(totalUntaxed * 1.12);

  console.log("This is the data " ,userData)

  const onSubmitData = async (values) => {
    const params = {
      id,
      name:values.name,
      amount:values.amount,
      quantity:values.quantity
    }
   mutate(params)
  }

  useEffect(() => {
    viewInventoryByID();
  }, [])
  const columns1 = [
    {
      title: "Untaxed Price per Item",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Taxes",
      dataIndex: "amount",
      key: "amount",
      render:() => (
        "12% Tax"
      )
    },
    {
      title: "Total Price",
      dataIndex: "amount",
      key: "amount",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "Mode of Payment",
    //   key: "tags",
    //   dataIndex: "tags",
    //   render: (_, { tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? "geekblue" : "green";
    //         if (tag === "loser") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Total Price with Tax:",
      dataIndex: "amount",
      key: "amount",
    },
  
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render:() => (
        <button className='bg-green-500'>Edit</button>
      )
    },
  ];
  return (
   
 
    <div className="pl-80 pr-28 bg-gray-200 pb-20 h-screen">
      <div className="flex flex-col items- bg-gray-200 px-8 justify-start h- w-full">
        <div className="pt-10 pb-10 flex justify-between items-start w-full">
          <section className="lh-sm ">
            <span className="fw-bold text-2xl font-bold">{userData.name}</span>
       
            
            <small
              className=" text-center mx-auto text-capitalize fw-semibold"
              style={{ color: "#000fff" }}
            >
              <br />
              <span className="text-gray-600">Processed By: Marc Jeibriel</span>
              <br />
              {/* <span className="text-gray-600">Status: {userData.archive  ? <span className="text-green-500">Active </span>: <span className="text-red-700">Archive</span>}</span> */}
            </small>
          </section>
          <section className="px-8 ">
           <Form form={form} 
          //  onFinish={onSubmit}
          //  initialValues={
          //   {
          //    ...initialValues
          //    }
          //  }
           >
           <div className="flex flex-col">
         
              <img src={imagePlaceholder} className="object-contain h-[100px] rounded-md" alt="" />
            </div>
           </Form>
          </section>
        </div>
        <Row>
          <Col xl={24} style={{ width: "80vw" }}>
            <div className='bg-white flex items-center justify-between overflow-x-auto px-4'>
            <div className='p-4'>
                <h5>Untaxed Price per Item</h5>
                ₱  {userData.amount}
              </div>
              <div className='p-4'>
                <h5>Product Name</h5>
                {userData.name}
              </div>
              <div>
              <h5>Product Name</h5>
                VAT 12%
              </div>
              <div>
              <h5>Quantity</h5>
               {userData.quantity}
              </div>
              <div>
              <h5>Total Price Untaxed</h5>
              ₱ {totalUntaxed} 
              </div>

              <div>
              <h5>Total Price with tax</h5>
              ₱ {totalWithTax} 
              </div>
             </div>
           
            
            
            
            {/* <Table
              style={{ zIndex: "10000" }}
              rowKey="id"
              columns={columns1}
              // rowSelection={rowSelection}
              // columns={columns1}
              // dataSource={userData}
              pagination={{
                position: ["bottomCenter"],
              }}
              scroll={{
                x: 3000,
              }}
            /> */}
          </Col>
        </Row>
        <div className="flex justify-between pt-4">
          <div className='space-x-4'>
          <button onClick={handleOpenModal} className="bg-gray-400 hover:bg-gray-700 p-2 text-white   px-4 rounded">
              Edit
            </button>
            <button className="bg-red-500 hover:bg-red-700 p-2 text-white   px-4 rounded">
              Archive
            </button>
          </div>
         <div className="space-x-3">
         <button

        //  onClick={form.submit}
            className="bg-green-500 hover:bg-blue-700 p-2 text-white d  px-4 rounded"
     
          >Save</button>
          {/* <button
            className="bg-blue-500 hover:bg-blue-700 p-2 text-white d  px-4 rounded"
            onClick={handleShowReceipt}
          >Receipt</button> */}
         </div>
          {/* <Modal
            title="Receipt"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <div className="flex justify-end items-start mx-2">
              
              <Button key="primary" type="primary" onClick={''} className="bg-blue-500 text-white"> 
                Export
              </Button>
              </div>
            ]}
          >
            {modalContent}
          </Modal> */}
        </div>
      </div>
      <Modal
        title="Basic Modal"
        visible={visible}
        footer={[
          <Button  key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={form.submit}>
            OK
          </Button>,
        ]}

        onOk={handleOpenModal}
        onCancel={handleCloseModal}
      >
       <Form
       form={form}
       onFinish={onSubmitData}
       >

        <Form.Item
        name='name'
        label="Product Name"
        >
          <Input className='w-full' />
        </Form.Item>
        <Form.Item
        name='quantity'
        label="Product Quantity"
        >
          <InputNumber style={{width:"100%"}} />
        </Form.Item>
        <Form.Item
        name='price'
        label="Price"
        >
          <InputNumber style={{width:"100%"}} />
        </Form.Item>

       </Form>
      </Modal>
    </div>
  )
}
