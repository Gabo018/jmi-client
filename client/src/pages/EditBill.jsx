import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Col, DatePicker, Row, Space, Table, Tag, Modal, Button } from "antd";

export const EditBill = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShowReceipt = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const modalContent = (
    <div className="bg-gray-100 border-2 border-black p-5">
    
      <div className="flex flex-col space-y-2 mt-5">
        <div className="flex justify-between">
          <span className="font-semibold">Untaxed Amount:</span>
          <span>1,000.00 PHP</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Output Tax(VAT 12%):</span>
          <span>1,000.00 PHP</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Total:</span>
          <span>1,000.00 PHP</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Date of Invoice:</span>
          <span>1,000.00 PHP</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Payment Due:</span>
          <span>1,000.00 PHP</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Amount Due:</span>
          <span>1,000.00 PHP</span>
        </div>
      </div>
    </div>
  );

  const columns1 = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Account",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Quantity",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Mode of Payment",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Untaxed Price",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Discount",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Output Tax%",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Subtotal",
      dataIndex: "address",
      key: "address",
    },
  ];
  const data1 = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];

  const navigate = useNavigate();
  let { id } = useParams();
  const [billing, setBilling] = useState({ name: "", contact: "", date: "" });
  const billingIdFetch = async () => {
    try {
      const billingResponse = await fetch(`/api/viewBill/${id}`);
      if (billingResponse.ok) {
        const billingJson = await billingResponse.json();
        setBilling(billingJson);
      }
    } catch (err) {
      console.log();
    }
  };
  const onChangeBilling = ({ target }) => {
    const { name, value } = target;
    setBilling((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onSubmitBilling = async () => {
    try {
      const updateBilling = await fetch(`/api/viewBill/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billing),
      });
      if (updateBilling.ok) {
        const updateJson = await updateBilling.json();
        // console.log(updateJson)
        alert("Updated Successfully");
        navigate("/viewBill");
      }
    } catch (err) {
      console.log(err);
    }
  };

  function contactLimit(event) {
    if (event.target.value.length >= 11) {
      event.target.removeAttribute("type");
    }
    // setValue(event.target.value);
    setBilling((prev) => ({
      ...prev,
      ["contact"]: event.target.value,
    }));
  }

  useEffect(() => {
    billingIdFetch();
  }, []);

  return (
    <div className="pl-80 pr-28 bg-gray-200 pb-20 h-screen">
      <div className="flex flex-col items- bg-gray-200 px-8 justify-start h- w-full">
        <div className="pt-10 pb-10 flex justify-between items-start w-full">
          <section className="lh-sm ">
            <span className="fw-bold text-2xl font-bold">BINV/00005/23</span>
            <br />
            <small
              className=" text-center mx-auto text-capitalize fw-semibold"
              style={{ color: "#000fff" }}
            >
              John Ruzell Rivera
            </small>
            <small
              className=" text-center mx-auto text-capitalize fw-semibold"
              style={{ color: "#000fff" }}
            >
              <br />
              <span className="text-gray-600">Processed By: Marc Jeibriel</span>
            </small>
          </section>
          <section className="px-8 py-4 ">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <small className="font-semibold w-1/3 whitespace-nowrap mx-2">
                  Invoice Date:
                </small>
                <div className="w-2/3">
                  <DatePicker className="w-full" placeholder="Select Date" />
                </div>
              </div>
              <div className="flex items-center">
                <small className="font-semibold w-1/3 whitespace-nowrap mx-2">
                  Payment Date:
                </small>
                <div className="w-2/3">
                  <DatePicker className="w-full" placeholder="Select Date" />
                </div>
              </div>
              <div className="flex items-center">
                <small className="font-semibold w-1/3 whitespace-nowrap mx-2">
                  Due Date:
                </small>
                <div className="w-2/3">
                  <DatePicker className="w-full" placeholder="Select Date" />
                </div>
              </div>
            </div>
          </section>
        </div>
        <Row>
          <Col xl={24} style={{ width: "80vw" }}>
            <Table
              style={{ zIndex: "10000" }}
              rowKey="id"
              // rowSelection={rowSelection}
              columns={columns1}
              dataSource={data1}
              pagination={{
                position: ["bottomCenter"],
              }}
              scroll={{
                x: 3000,
              }}
            />
          </Col>
        </Row>
        <div className="flex justify-between">
          <div>
            <button className="bg-red-500 hover:bg-red-700 p-2 text-white   px-4 rounded">
              Archive
            </button>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 p-2 text-white d  px-4 rounded"
            onClick={handleShowReceipt}
          >Receipt</button>
          <Modal
            title="Receipt"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <div className="flex justify-between items-start mx-2">
               <Button key="save" onClick={''} className="bg-green-500 text-white">
                Save
              </Button>,
              <Button key="primary" type="primary" onClick={''} className="bg-blue-500 text-white"> 
                Export
              </Button>
              </div>
            ]}
          >
            {modalContent}
          </Modal>
        </div>
      </div>

      {/* <div className=" bg-white rounded-md shadow-lg mt-8 p-5 ">
        <div className="flex gap-10">
          <div className=" leading-8 ">
            <div className='my-5'>
              <p><span className='font-bold'>Product Code:</span> {billing?.productCode}</p>
            </div>
            <label
              htmlFor="name"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Name:
            </label>
            <input
              name='name'
              type="text"
              id="name"
              placeholder="Name"
              value={billing?.name}
              onChange={onChangeBilling}
              required
              className="input border border-solid border-gray-300"
            />

            <label
              htmlFor="contact"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Contact No:
            </label>
            <input
              name='contact'
              type="number"
              id="contact"
              onInput={contactLimit}
              maxLength={11}
              placeholder="Contact No."
              value={billing?.contact}
              onChange={onChangeBilling}
              required
              className="input border border-solid border-gray-300"
            />

            <label
              htmlFor="date"
              className="form-label inline-block mb-2 text-gray-700 font-bold"
            >
              Date:
            </label>
            <input
              name='date'
              type="date"
              id="date"
              value={moment(billing?.date).format('YYYY-MM-DD')}
              onChange={onChangeBilling}
              required
              className="input border border-solid border-gray-300"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-violet-600 mt-4 rounded-md shadow-lg p-4 hover: text-white hover:bg-violet-700"
          onClick={onSubmitBilling}
        >
          Edit Billing
        </button>
      </div> */}
    </div>
  );
};
