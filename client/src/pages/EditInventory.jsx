import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Col, Form, Row, Table } from 'antd'
import imagePlaceholder from '../pictures/image-blank.jpg';

export const EditInventory = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  let { id } = useParams();
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

  const onChangeData = ({ target }) => {
    const { name, value } = target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const onSubmitData = async () => {
    console.log(userData)
    const submitData = await fetch(`/api/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    if (submitData.ok) {
      const submitJson = await submitData.json()
      if (submitJson.acknowledged) {
        alert('Inventory Edited Successfully.')
        navigate('/viewInventory');
      }
    }
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
    // <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 pb-20 h-screen">
    //   <Helmet>
    //     <title>Edit Inventory</title>
    //     <meta name="edit inventory" content="This is the Edit Inventory Section" />
    //   </Helmet>
    //   <div className="border-b-2 pb-4">
    //     <h1 className="text-center text-white text-5xl font-bold">
    //       Edit Inventory
    //     </h1>
    //   </div>
    //   <div className=" bg-white rounded-md shadow-lg mt-8 p-5 ">
    //     <div className="flex gap-10">
    //       <div className=" leading-8 ">
    //         <label
    //           htmlFor="code"
    //           className="form-label inline-block mb-2 text-gray-700 font-bold"
    //         >
    //           Product Code
    //         </label>
    //         <input
    //           name='code'
    //           type="text"
    //           id="code"
    //           placeholder="Product Code"
    //           onChange={onChangeData}
    //           value={userData?.code}

    //           required
    //           className="input border border-solid border-gray-300"
    //         />

    //         <label
    //           htmlFor="description"
    //           className="form-label inline-block mb-2 text-gray-700 font-bold"
    //         >
    //           Description:
    //         </label>
    //         <input
    //           name='description'
    //           type="text"
    //           id="description"
    //           placeholder="Description"
    //           value={userData?.description}
    //           onChange={onChangeData}
    //           required
    //           className="input border border-solid border-gray-300"
    //         />

    //         <label
    //           htmlFor="amount"
    //           className="form-label inline-block mb-2 text-gray-700 font-bold"
    //         >
    //           Amount:
    //         </label>
    //         <input
    //           name='amount'
    //           type="text"
    //           id="amount"
    //           placeholder="Product Amount"
    //           value={userData?.amount}
    //           onChange={onChangeData}
    //           required
    //           className="input border border-solid border-gray-300"
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
    //           value={moment(userData?.date).format('YYYY-MM-DD')}
    //           onChange={onChangeData}
    //           required
    //           className="input border border-solid border-gray-300"
    //         />
    //       </div>
    //     </div>
    //     <button
    //       type="submit"
    //       className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
    //       onClick={onSubmitData}
    //     >
    //       Edit Inventory
    //     </button>
    //   </div>
    // </div>
    <div className="pl-80 pr-28 bg-gray-200 pb-20 h-screen">
      <div className="flex flex-col items- bg-gray-200 px-8 justify-start h- w-full">
        <div className="pt-10 pb-10 flex justify-between items-start w-full">
          <section className="lh-sm ">
            <span className="fw-bold text-2xl font-bold">Product Name</span>
       
            
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
            <Table
              style={{ zIndex: "10000" }}
              rowKey="id"
              columns={columns1}
              // rowSelection={rowSelection}
              // columns={columns1}
              // dataSource={data1}
              pagination={{
                position: ["bottomCenter"],
              }}
              scroll={{
                x: 3000,
              }}
            />
          </Col>
        </Row>
        <div className="flex justify-between pt-4">
          <div>
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

    </div>
  )
}
