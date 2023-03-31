import { useState, useEffect } from "react";
import { Button, DatePicker, Dropdown, Input, Menu, Select, Table } from "antd";
import { Link } from "react-router-dom";

const JournalEntries = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchJournalEntries = async () => {
    setLoading(true);
    const url = dateRange
      ? `/api/get-expense-billing?start=${dateRange[0].format(
          "YYYY-MM-DD"
        )}&end=${dateRange[1].format("YYYY-MM-DD")}`
      : "/api/get-expense-billing";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setDataSource(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalEntries();
  }, [dateRange]);
  

  const columns = [
  
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
      render:(text) => (
        <span>{text == undefined  ? "N/A" : text}</span>
      )
    },

    {
      title: "Journal",
      dataIndex: "type",
      key: "type",
      render: (text) => <span>{text} Invoice</span>,
    },
    {
      title: "Status",
      dataIndex: "archive",
      key: "status",
      render: (text) => (
        <span style={{ color: !text ? "red" : "green" }}>
          {!text ? "Archived" : "Active"}
        </span>
      ),
    },
  ];

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  

  const billingData =
    dataSource?.billing?.map((item) => ({
      ...item,
      type: "Billing",
    })) || [];
  const expenseData =
    dataSource?.expenses?.map((item) => ({
      ...item,
      type: "Expense",
    })) || [];

  const combinedData = [...billingData, ...expenseData];
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = combinedData.filter(
      (item) => item.type === value
    );
    setFilteredData(filtered);
  };
  
  const dataToDisplay = searchText ? filteredData : combinedData;

  console.log(combinedData)

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/addBill">Add Billing</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/addExpense">Add Expense</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="pl-80 bg-gray-200  pr-80">
      <div className="pt-10">
        <h5>Journal Entries</h5>
      </div>
      <div className="pt-4 space-y-3 flex justify-between items-center">
        <div className="flex justify-between ">
          <Input.Search
          allowClear
            placeholder="Search"
            onSearch={handleSearch}
            style={{ marginBottom: 16 }}
          />
          <Dropdown overlay={menu}>
            <Button>Add Entry</Button>
          </Dropdown>
        </div>
        {/* <div>
          <DatePicker.RangePicker onChange={handleDateRangeChange} />
        </div> */}
        <div></div>
      </div>

      <Table
        className="cursor-pointer"
        dataSource={dataToDisplay}
        columns={columns}
        loading={loading}
        scroll={{ x: 3000 }}
        onRow={(record, rowIndex) => ({
          onClick: () => {
            console.log(record);
            if (record.type === "Billing") {
              window.location.href = `/viewbill/${record._id}?index=${rowIndex}`;
            } else if (record.type === "Expense") {
              window.location.href = `/expenseRecord/${record._id}`;
            }
          },
        })}
      />
    </div>
  );
};

export default JournalEntries;
