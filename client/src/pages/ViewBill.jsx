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
  const { data: dataBill, isLoading } = useQuery({
    queryKey: "home-buyer-list",
    queryFn: userGetBill,
  });
  console.log(dataBill);
  const columns1 = [
    {
      title: "Payment Reference",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Invoice Date",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Payment Date",
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
      title: "Discount",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tax Excluded",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Total Payment",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      dataIndex: "address",
      key: "address",
    },
    // {
    //   title: 'Action',
    //   fixed: "right",
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Invite {record.name}</a>
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
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

  return (
    <div
      className="pl-80 pr-28  bg-gray-200 pb-20"
      style={{
        minHeight: "100vh",
      }}
    >
     
        <div className="pt-28 pb-10">
          <Row gutter={24}> 
            <Col xs={24} lg={8}>
              Date Range
            </Col><Col xs={24} lg={8}>
              Total Amount
            </Col>
            <Col xs={24} lg={8}>
              Total Items
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
              onSearch={""}
            />
          </div>
          <div className="flex gap-3">
            <DatePicker.RangePicker />
          </div>
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
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    window.location.href = `/viewbill/${record.id}`;
                  },
                };
              }}
              scroll={{
                x: 3000,
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
