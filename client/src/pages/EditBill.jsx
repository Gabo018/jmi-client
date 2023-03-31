import React, { useState } from "react";

import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import {
  Col,
  DatePicker,
  Row,
  Table,
  Tag,
  Modal,
  Button,
  Form,
  notification,
  Input,
  InputNumber,
  Dropdown,
  Select,
} from "antd";
import { userGetData } from "../modules/service-getUserData";
import { useMutation, useQuery } from "react-query";
import { userDeleteBill } from "../modules/service-deleteBill";
import { userGetInventoryList } from "../modules/server-viewInventory";
import { userAddBoughtProduct } from "../modules/services-addBoughtProduct";
import { userGetBoughtProduct } from "../modules/service-getBoughtProduct";
import { userUpdateBill } from "../modules/service-editBillDetails";

export const EditBill = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productAmount, setProductAmount] = useState();
  const [productId, setProductId] = useState();
  const { data: dropdownData } = useQuery();

  let { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const index = searchParams.get("index");

  const currentYear = new Date().getFullYear() % 100;

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: "user-data",
    queryFn: userGetData(id),
  });
  const { data: listBoughtProduct } = useQuery({
    queryKey: "bought-product-list",
    queryFn: userGetBoughtProduct(id),
  });
  const { mutate } = useMutation(userDeleteBill);

  const { mutate: AddProductBought } = useMutation(userAddBoughtProduct);
  
  const {mutate:UpdateBillDetails} = useMutation(userUpdateBill)

  const {
    data: InventoryProductList,
    isLoading: inventoryList,
    isError: inventoryError,
  } = useQuery({
    queryKey: "inventory-list",
    queryFn: userGetInventoryList(),
  });

  if (isLoading || inventoryList) {
    return (
      <div className="pl-80 flex justify-center items-center">
        <h5>Loading...</h5>
      </div>
    );
  }
  if (isError || inventoryError) {
    return (
      <div className="pl-80 flex justify-center items-center">
        <h5>Something Went wrong</h5>
      </div>
    );
  }

  const userData = data.data.data;
  const inventoryData = InventoryProductList.data.data;
  const boughtProductList = listBoughtProduct.data.data;

  const onSubmitDataAddProductBought = (values) => {
    const params = {
      user_bought: id,
      product_name: values.product_name,
      quantity_items_bought: values.quantity_items_bought,
      mode_of_payment: values.mode_of_payment,
      product_id: productId,
      price_of_product: productAmount,
      account_type: values.account_type,
      discount: values.discount == null ? null : values.discount.toString(),
    };

    AddProductBought(params, {
      onSuccess: () => {
        form.setFieldsValue({
          product_name: null,
          mode_of_payment: null,
          price_of_product: null,
          quantity_items_bought: null,
          discount: null,
          account_type: null,
        });

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
  };

  const handleChangeAddProduct = (productDetails) => {
    setProductAmount(productDetails.amount);
    setProductId(productDetails._id);
    console.log("this is the product details", productDetails);
    form.setFieldsValue({
      price_of_product: productAmount,
    });
  };

  const onSubmitUpdateBillDetails = (values) => {
    const params = {
      id:id,
      name: values.name,
      due_date: values.due_date,
      payment_date: values.payment_date,
    };
    UpdateBillDetails(params , {
      onSuccess: () => {
        form.resetFields();
        notification.success({
          message: "Success",
          description: "Update details successfully",
        });
      },
      onError: () => {
        notification.error({
          message: "Failed",
          description: "Something went wrong",
        });
      },
    })
  };

  const handleShowReceipt = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    mutate(id, {
      onSuccess: () => {
        form.resetFields();
        notification.success({
          message: "Success",
          description: "Billing moved to archive list",
        });
      },
      onError: () => {
        notification.error({
          message: "Failed",
          description: "Something went wrong",
        });
      },
    });
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
      dataIndex: "product_name",
      key: "product_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Account",
      dataIndex: "account_type",
      key: "account_type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity_items_bought",
      key: "quantity_items_bought",
    },
    {
      title: "Mode of Payment",
      key: "mode_of_payment",
      dataIndex: "mode_of_payment",
    },
    {
      title: "Untaxed Price",
      dataIndex: "quantity_items_bought",
      key: "quantity_items_bought",
      render: (quantity, record) => {
        console.log(record);
        const unitPrice = Number(record.price_of_product);
        const discount = record.discount; // assuming the discount value is stored in a field named "discount"
        let untaxedPrice = 0;
        if (!isNaN(quantity) && !isNaN(unitPrice)) {
          const subtotal = unitPrice * Number(quantity);
          untaxedPrice = subtotal / 1.12; // dividing by 1.12 to remove the 12% tax
          if (discount != undefined && discount > 0) {
            // check if there is a discount
            const discountAmount = subtotal * (discount / 100);
            untaxedPrice = (subtotal - discountAmount) / 1.12; // calculate the discounted untaxed price
          }
        }
        return <span>{untaxedPrice.toFixed(2)}</span>; // rounding to 2 decimal places
      },
    },

    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text) => {
        return text != undefined ? text : "N/A";
      },
    },
    {
      title: "Output Tax%",
      dataIndex: "price_of_product",
      key: "price_of_product",
      render: () => "12%",
    },
    {
      title: "Subtotal",
      dataIndex: "price_of_product",
      key: "price_of_product",
      render: (price, record) => {
        const subTotal = price * parseInt(record.quantity_items_bought);

        return <span>{Math.trunc(subTotal)} PHP</span>;
      },
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

  const initialValues = {
    name: userData.name,
    invoice_date: userData.createdAt
      ? moment(userData?.createdAt, "YYYY/MM/DD")
      : null,
    due_date: userData.due_date
      ? moment(userData?.due_date, "YYYY/MM/DD")
      : null,
    payment_date: userData.payment_date
      ? moment(userData?.payment_date, "YYYY/MM/DD")
      : null,
  };

  return (
    <div className="pl-80 pr-28 bg-gray-200 pb-20 h-screen">
      <div className="flex flex-col items- bg-gray-200 px-8 justify-start h- w-full">
        <div className="pt-10 pb-10 flex justify-between items-start w-full">
          <section className="lh-sm ">
            <span className="fw-bold text-2xl font-bold">
              BINV/0000{index}/{currentYear}
            </span>
            <br />
            <Form
              form={form}
              initialValues={{
                ...initialValues,
              }}
            >
              <Form.Item name="name">
                <Input className="w-full" />
              </Form.Item>
            </Form>
            <small
              className=" text-center mx-auto text-capitalize fw-semibold"
              style={{ color: "#000fff" }}
            >
              <br />
              <span className="text-gray-600">Processed By: Marc Jeibriel</span>
              <br />
              <span className="text-gray-600">
                Status:{" "}
                {userData.archive ? (
                  <span className="text-green-500">Active </span>
                ) : (
                  <span className="text-red-700">Archive</span>
                )}
              </span>
            </small>
          </section>
          <section className="px-8 ">
            <Form
              form={form}
              onFinish={onSubmitUpdateBillDetails}
              initialValues={{
                ...initialValues,
              }}
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <small className="font-semibold w-1/3 whitespace-nowrap mx-2">
                    Invoice Date:
                  </small>
                  <div className="w-2/3">
                    <Form.Item name="invoice_date">
                      <DatePicker
                        className="w-full"
                        placeholder="Select Date"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-center">
                  <small className="font-semibold w-1/3 whitespace-nowrap mx-2">
                    Payment Date:
                  </small>
                  <div className="w-2/3">
                    <Form.Item name="payment_date">
                      <DatePicker
                        className="w-full"
                        placeholder="Select Date"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-center">
                  <small className="font-semibold w-1/3 whitespace-nowrap mx-2">
                    Due Date:
                  </small>
                  <div className="w-2/3">
                    <Form.Item name="due_date">
                      <DatePicker
                        className="w-full"
                        placeholder="Select Date"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Form>
          </section>
        </div>
        <Row>
          <Col xl={24} style={{ width: "80vw" }}>
            <button
              className="bg-green-500 mb-3 text-white p-2 rounded-md"
              onClick={() => setIsAddingProduct(true)}
            >
              Add Line
            </button>
            <Table
              style={{ zIndex: "10000" }}
              rowKey="id"
              // rowSelection={rowSelection}
              columns={columns1}
              dataSource={boughtProductList}
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
            <button
              onClick={() => handleDelete(userData._id)}
              className="bg-red-500 hover:bg-red-700 p-2 text-white   px-4 rounded"
            >
              Archive
            </button>
          </div>
          <div className="space-x-3">
            <button
              onClick={form.submit}
              className="bg-green-500 hover:bg-blue-700 p-2 text-white d  px-4 rounded"
            >
              Save User Details
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 p-2 text-white d  px-4 rounded"
              onClick={handleShowReceipt}
            >
              Receipt
            </button>
          </div>
          <Modal
            title="Receipt"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <div className="flex justify-end items-start mx-2">
                <Button
                  key="primary"
                  type="primary"
                  onClick={""}
                  className="bg-blue-500 text-white"
                >
                  Export
                </Button>
              </div>,
            ]}
          >
            {modalContent}
          </Modal>
        </div>
      </div>
      <Modal
        title="Edit Product"
        visible={isAddingProduct}
        footer={[
          <Button key="cancel" onClick={() => setIsAddingProduct(false)}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={form.submit}>
            OK
          </Button>,
        ]}
        onOk={() => setIsAddingProduct(true)}
        onCancel={() => setIsAddingProduct(false)}
      >
        <Form
          form={form}
          onFinish={onSubmitDataAddProductBought}
          initialValues={{
            price_of_product: productAmount,
          }}
        >
          <Form.Item name="account_type" label="Account Type">
            <Select>
              <Select.Option value="Sales/Revenue">Sales/Revenue</Select.Option>
              <Select.Option value="Accounts Receivable">
                Accounts Receivable
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="discount" label="discount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="product_name" label="Product Name">
            <Select
              onChange={(value) => {
                const selectedProduct = inventoryData.find(
                  (product) => product.name === value
                );
                handleChangeAddProduct(selectedProduct);
              }}
            >
              {inventoryData.map((item, index) => (
                <Select.Option
                  value={item.name}
                  key={item.name}
                  product={item}
                  disabled={item.quantity === "0"}
                  style={item.quantity === "0" ? { color: "grey" } : null}
                >
                  {item.quantity === "0" ? (
                    <span className="text-gray-500">
                      {item.name} - Out of Stock
                    </span>
                  ) : (
                    item.name
                  )}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="mode_of_payment" label="Mode of Payment">
            <Select>
              <Select.Option key="E-Payment" value="E-Payment">
                E-Payment
              </Select.Option>
              <Select.Option key="Cash" value="Cash">
                Cash
              </Select.Option>
              <Select.Option key="Bank" value="Bank">
                Bank
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="quantity_items_bought" label="Product Quantity">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="price_of_product" label="Price">
            {console.log("Product amount", productAmount)}
            <InputNumber
              value={productAmount}
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
