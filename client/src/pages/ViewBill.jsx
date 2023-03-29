import React, { useMemo, useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTable, useGlobalFilter } from "react-table";
import { addDays } from "date-fns";
import { Link } from "react-router-dom";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useQuery } from "react-query";
import { Button, Space, Table, Tag, Input, Col, Row, DatePicker } from "antd";
import { userGetBill } from "../modules/service-viewBill";

export const VieBill = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState();

  const firstDateRange = dateRange && dateRange.length === 2 && moment(dateRange[0], "YYYY-MM-DD").isValid() ? Object.values(dateRange)[0] : null;
  const secondDateRange = dateRange && dateRange.length === 2 && moment(dateRange[1], "YYYY-MM-DD").isValid() ? Object.values(dateRange)[1] : moment();
  
  const params = {
    dFrom: firstDateRange ? moment(firstDateRange).format("YYYY-MM-DD") : null,
    dTo: secondDateRange ? moment(secondDateRange).format("YYYY-MM-DD") : null,
  };
  
  const {
    data: dataBill,
    isLoading,
    
    isError,
  
  } = useQuery({
    queryKey: ["home-buyer-list", params],
    queryFn: userGetBill(params),
  });

  console.log(dataBill)

  const currentYear = new Date().getFullYear() % 100;
  const currentDate = moment();


  const columns1 = [
    {
      title: "Payment Reference",
      dataIndex: "name",
      key: "name",
      render: (params, record, index) => {
        return `BINV/0000${index + 1}/${currentYear}`;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Invoice Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        return <>{text == undefined ? "N/A" : moment(text).format("LL")}</>;
      },
    },
    {
      title: "due_date",
      dataIndex: "due_date",
      key: "due_date",
      render: (text) => {
        const date = moment(text);
        const isPast = date.isBefore(currentDate, "day");
        return (
          <span className={isPast ? "text-red-500" : "text-black"}>
            {text == undefined ? "N/A " : moment(text).format("LL")}
          </span>
        );
      },
    },
    // {
    //   title: "Payment Date",
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
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text) => <>{text == undefined ? "N/A" : text}</>,
    },
    {
      title: "Tax Excluded",
      dataIndex: "total_payment",
      key: "address",
      render: (totalPayment) => {
        const taxRate = 0.12; // 12% tax rate
        const taxExcludedAmount = Math.round(totalPayment / (1 + taxRate));
        const formattedAmount = taxExcludedAmount.toLocaleString();
        return <span>₱{formattedAmount}</span>;
      },
    },

    {
      title: "Total Payment",
      dataIndex: "total_payment",
      key: "total_payment",
      render: (text) => <>{text == undefined ? "N/A" : `₱${text}`}</>,
    },
    {
      title: "Status",
      dataIndex: "archive",
      key: "archive",
      render: (text) => {
        return (
          <span className={text ? "text-green-500" : "text-red-600"}>{text  ? "Active" : "Archive"}</span>
        )
      },
    },
  ];

  if (isLoading) {
    return <h5>Loading....</h5>;
  }
  if (isError) {
    alert("Something went wrong");
    return;
  }
  const data1 = dataBill.data.data;

  const total = dataBill.data.statistics.total;

  const totalAmount = data1.reduce((acc, curr) => {
    const payment = parseFloat(curr.total_payment);
    if (!isNaN(payment)) {
      return acc + payment;
    } else {
      return acc;
    }
  }, 0);

  const sortedDataSource = data1.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const filteredData = sortedDataSource.filter((record) => record.name === searchTerm);

  

  console.log("this is the filtered data", filteredData);

  return (
    <div
      className="pl-80 pr-28  bg-gray-200 pb-20"
      style={{
        minHeight: "100vh",
      }}
    >
   
      <div className="pt-28 pb-10">
        <Row gutter={24}>
          <Col xs={24} lg={8} className="bg-white ">
            <span className="font-bold text-lg">
              Date Range:
            {  firstDateRange || secondDateRange ? "N/A" : `${moment(firstDateRange).format("LL")} - ${moment(secondDateRange).format("LL")} `}
             
            </span>
          </Col>
          <Col xs={24} lg={8} className="bg-white ">
            <span className="font-bold text-lg">
              Total Amount: <span className="text-red-500">₱{totalAmount}</span>{" "}
            </span>
          </Col>
          <Col xs={24} lg={8} className="bg-white">
            <span className="font-bold text-lg">
              Total Items: <span className="text-red-500">{total}</span>
            </span>
          </Col>
        </Row>
      </div>
      <div className="pt-4 space-y-3">
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-3">
            <Link to="/addBill">
              <Button className="bg-blue-800 text-white border-0">
                New Invoice
              </Button>
            </Link>
            <Input.Search
              defaultValue={""}
              allowClear
              placeholder="Search for name, contact, email and developer"
              onSearch={(e) => setSearchTerm(e)}
            />
          </div>
          <div className="flex gap-3">
       <Link to='/archive-list'>
       <button className="bg-red-600 text-white p-2 rounded-md">
          Archive List
         </button>
       </Link>
            <DatePicker.RangePicker
              onChange={(e) => setDateRange(e)}
              value={dateRange}
            />
          </div>
        </div>
        <Row>
          <Col xl={24}>
            <Table
            className="cursor-pointer "
              style={{ zIndex: "10000" }}
              rowKey="id"
              // rowSelection={rowSelection}
              columns={columns1}
              dataSource={searchTerm ? filteredData : sortedDataSource}
              pagination={{
                position: ["bottomCenter"],
              }}
              onRow={(record, rowIndex) => {
 
                return {
                  onClick: () => {
                    window.location.href = `/viewbill/${record._id}?index=${rowIndex + 1  }`;
                  },
                };
              }}
              scroll={{
                x: 2000,
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
