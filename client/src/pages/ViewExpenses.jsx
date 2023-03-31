import React, { useState, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet";
import { useTable, useGlobalFilter } from 'react-table';
import { addDays } from 'date-fns';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { DateRangePicker } from 'react-date-range'
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Table, notification } from "antd";
import { userDeleteExpense } from "../modules/service-editArchiveExpense";
import { useMutation } from "react-query";



export const ViewExpenses = () => {

  // Start React Table
  const [tableData, setTableData] = useState({ statistics: {}, data: [] });
  const data = useMemo(() => tableData.data, [tableData]
  )


  const columns1 = [
    {
      title: "Payment Reference",
      dataIndex: "name",
      key: "name",
      render: (params, record, index) => {
        return `EINV/0000${index + 1}/23`;
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
        const currentDate = moment();
        const isPast = date.isBefore(currentDate, "day");
        return (
          <span className={isPast ? "text-red-500" : "text-black"}>
            {text == undefined ? "N/A " : moment(text).format("LL")}
          </span>
        );
      },
    },
  
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text) => <>{text == undefined ? "N/A" : text}</>,
    },
  

  
    {
      title: "Status",
      dataIndex: "isArchive",
      key: "isArchive",
      render: (text) => {
        return (
          <span className={text ? "text-green-500" : "text-red-600"}>{text  ? "Active" : "Archive"}</span>
        )
      },
    },
   
  ];

  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => moment(value).format('MMMM DD, YYYY')
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Deduction Type',
        accessor: 'deductionType',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => `₱ ${value.toFixed(2)}`
      },
      {
        Header: 'Process By',
        accessor: 'processBy'
      }
    ], []
  )

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: 'Edit',
        Header: 'ACTIONS',
        Cell: ({ row }) => {
          return (
            <>
              <button
                className="text-red-700 hover:text-red-900 hover:shadow-lg"
                onClick={() => onSubmitDelete(row.original._id, row.original.description)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
              <button className="text-green-800">
                <Link to={row.original._id}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </Link>
              </button>
            </>
          );
        }
      }
    ])
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state
  } = useTable({ columns, data }, tableHooks, useGlobalFilter)
  const { globalFilter } = state;
  // End React Table

  // Start Date Range Picker
  const [showPicker, setShowPicker] = useState(false);
  const ref = useRef(null);
  const [rangeDate, setRangeDate] = useState([
    {
      startDate: new Date('01/01/1900'),
      endDate: new Date('01/01/3000'),
      key: "selection",
    },
  ]);
  const onSubmitDate = () => {
    dataFetching();
  }
  // End Date Range Picker

  // Start FetchingAPI
  const dataFetching = async () => {
    try {
      const dataResponse = await fetch(`/api/expenses?dTo=${'' || moment(rangeDate[0].endDate).format('MM/DD/YYYY')}&dFrom=${'' || moment(rangeDate[0].startDate).format('MM/DD/YYYY')}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const dataJson = await dataResponse.json()
      setTableData(dataJson)
    } catch (err) {
      console.log(err)
    }
  }
  // End FetchingAPI

  // Start Delete Product
  const [deleteState, setDeleteState] = useState();
  const onSubmitDelete = async (id, description) => {
    try {
      alert(`Description: ${description}`)
      if (window.confirm('Are your sure you want to delete this Expenses?')) {
        const deleteData = await fetch(`/api/expenses/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (deleteData.ok) {
          const deleteJson = await deleteData.json();
          setDeleteState(deleteJson)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  // End Delete Product
  useEffect(() => {
    dataFetching();
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setShowPicker, rangeDate, deleteState]);

  return (
    <div className="pl-80 pr-28 bg-gradient-to-r from-indigo-900 via-violet-500 to-indigo-400 pb-20"
      style={{
        minHeight: '100vh'
      }}
    >
      <Helmet>
        <title>View Expenses</title>
        <meta name="view expenses" content="This is the View Expenses Section" />
      </Helmet>
      <div className="border-b-2 pb-4">
        <h1 className="text-center text-white text-5xl font-bold">
          View Expenses
        </h1>
      </div>
      <div className='mt-6'>
        <div className='flex justify-between'>
          <div className='bg-gray-50 inventory-statistics'>
            <p className='statistics-value'>{tableData && tableData.statistics.rangeDate?.from} - {tableData && tableData.statistics.rangeDate?.to}</p>
            <p className='statistics-name'>Date</p>
          </div>
          <div className='bg-gray-50 inventory-statistics'>
            <p className='statistics-value'>₱ {tableData && tableData.statistics.amount?.toFixed(2)}</p>
            <p className='statistics-name'>Amount</p>
          </div>
          <div className='bg-gray-50 inventory-statistics'>
            <p className='statistics-value'>{tableData && tableData.statistics?.total}</p>
            <p className='statistics-name'>Total Items</p>
          </div>
        </div>
        <div className='flex justify-between'>
          <input
            type='text'
            name='search'
            placeholder='Search data'
            className='input'
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded'
            onClick={() => setShowPicker(true)}
          >
            Filter Date
          </button>

          {showPicker && (
            <div
              style={{
                position: "absolute",
                right: "10%",
                border: "1px solid black",
                zIndex: 1,
                visibility: showPicker ? "visible" : "hidden",
                backgroundColor: "white",
                boxShadow: "5px 10px #888888",
              }}
              ref={ref}
            >
              <DateRangePicker
                onChange={(item) => setRangeDate([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={rangeDate}
                direction="vertical"
              />
            </div>
          )}

        </div>
       



        <div className="mt-4">
          <Link to='/addExpense'>
          <button className="bg-green-500 p-2 mt-5 mb-3 text-white">
            Add Expense
          </button>
          </Link>
        <Table
            className="cursor-pointer "
              style={{ zIndex: "10000" }}
              rowKey="id"
              // rowSelection={rowSelection}
              columns={columns1}
              dataSource={data}
           
              pagination={{
                position: ["bottomCenter"],
              }}
              onRow={(record, rowIndex) => {
 
                return {
                  onClick: () => {
                    window.location.href = `/expenseRecord/${record._id}?index=${rowIndex + 1  }`;
                  },
                };
              }}
              scroll={{
                x: 2000,
              }}
            />
        </div>
      </div>
    </div>
  );
};
