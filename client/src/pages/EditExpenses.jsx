import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import { userDeleteExpense } from '../modules/service-editArchiveExpense'
import { useMutation, useQuery } from 'react-query'
import { Col,
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
  Select } from 'antd'
import { useForm } from 'rc-field-form'
import { userGetExpenseData } from '../modules/service-getExpenseData'
import { userGetInventoryList } from '../modules/server-viewInventory'
import { userUpdateExpense } from '../modules/service-updateExpense'
import { userGetBoughtProduct } from '../modules/service-getBoughtProduct'
import { userAddBoughtProduct } from '../modules/services-addBoughtProduct'


export const EditExpenses = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productId, setProductId] = useState();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productAmount, setProductAmount] = useState();

  const [form] = Form.useForm();
  const { id } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const index = searchParams.get("index");

  const { data:getExpenseData, isLoading, isSuccess, isError } = useQuery({
    queryKey: "expense-data",
    queryFn: userGetExpenseData(id),
  });

  const {
    data: InventoryProductList,
    isLoading: inventoryList,
    isError: inventoryError,
  } = useQuery({
    queryKey: "inventory-list",
    queryFn: userGetInventoryList(),
  });

  const { data: listBoughtProduct , isLoading:boughtProductLoading , isError:boughtProductError } = useQuery({
    queryKey: "bought-product-list",
    queryFn: userGetBoughtProduct(id),
  });


  const {mutate} = useMutation(userDeleteExpense)
  const {mutate:UpdateExpenseDetails} = useMutation(userUpdateExpense);
  const { mutate: AddProductBought } = useMutation(userAddBoughtProduct);

  const handleDelete = (id) => {
    mutate(id, {
      onSuccess: () => {
      
        notification.success({
          message: "Success",
          description: "Expense moved to archive list",
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

  const handleShowReceipt = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleChangeAddProduct = (productDetails) => {
    setProductAmount(productDetails.amount);
    setProductId(productDetails._id);
    console.log("this is the product details", productDetails);
    form.setFieldsValue({
      price_of_product: productAmount,
    });
  };

  const onSubmitEditExpense = (values) => {
    const params = {
      id:id,
      name: values.name,
      due_date: values.due_date,
      payment_date: values.payment_date,
    };
    UpdateExpenseDetails(params , {
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

  if(isLoading || inventoryList || boughtProductLoading){
    return(
      <div className='flex h-screen bg-white items-center justify-center'>
        <h5>Loading...</h5>
      </div>
    )
  }
  if(isError || inventoryError || boughtProductError){
    return(
      <div className='flex h-screen bg-white items-center justify-center'>
        <h5>Something went wrong</h5>
      </div>
    )
  }
  console.log(listBoughtProduct)
  // const initialValues = {
  //   name: expenseData.name,
  //   invoice_date: expenseData.createdAt
  //     ? moment(expenseData?.createdAt, "YYYY/MM/DD")
  //     : null,
  //   due_date: expenseData.due_date
  //     ? moment(expenseData?.due_date, "YYYY/MM/DD")
  //     : null,
  //   payment_date: expenseData.payment_date
  //     ? moment(expenseData?.payment_date, "YYYY/MM/DD")
  //     : null,
  // };
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

const expenseData = getExpenseData.data
const inventoryData = InventoryProductList.data.data;
const boughtProductList = listBoughtProduct.data.data;


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


  const initialValues = {
    name: expenseData.name,
    invoice_date: expenseData.createdAt
      ? moment(expenseData?.createdAt, "YYYY/MM/DD")
      : null,
    due_date: expenseData.due_date
      ? moment(expenseData?.due_date, "YYYY/MM/DD")
      : null,
    payment_date: expenseData.payment_date
      ? moment(expenseData?.payment_date, "YYYY/MM/DD")
      : null,
  };

  
  const currentYear = new Date().getFullYear() % 100;
  return (
  
    <div className="pl-80 pr-28 bg-gray-200 pb-20 h-screen">
      <div className="flex flex-col items- bg-gray-200 px-8 justify-start h- w-full">
        <div className="pt-10 pb-10 flex justify-between items-start w-full">
          <section className="lh-sm ">
            <span className="fw-bold text-2xl font-bold">
            EINV/0000{index}/{currentYear}
            </span>
            <br />
            <Form
              form={form}
              onFinish={onSubmitEditExpense}
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
                {expenseData.archive ? (
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
              onFinish={onSubmitEditExpense}
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
          {expenseData.archive ? (
                <button
                onClick={() => handleDelete(expenseData._id)}
                className="bg-red-500 hover:bg-red-700 p-2 text-white   px-4 rounded"
              >
                Archive
              </button>
                ) : (
                  <button
                  onClick={() => handleDelete(expenseData._id)}
                  className="bg-green-500 hover:bg-red-700 p-2 text-white   px-4 rounded"
                >
                 Restore
                </button>
                )}
           
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
  )
}
