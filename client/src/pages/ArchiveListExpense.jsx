import { Col, notification, Row, Table } from "antd"
import { useMutation, useQuery } from "react-query";
import moment from 'moment';

import { userDeleteExpense } from "../modules/service-editArchiveExpense";
import { userGetListExpense } from "../modules/service-expenseList";

const ArchiveListExpense = () => {
    const {
        data,
        isLoading,

        isError,
      
      } = useQuery({
        queryKey: "user-archive",
        queryFn: userGetListExpense()
      });
      const {mutate } = useMutation(userDeleteExpense)
      const handleRestore = (id) => {
        mutate(id , {
          onSuccess:() => {
         
            notification.success({
              message: "Success",
              description: "Billing restore successfully",
            });
          },
          onError:() => {
            notification.error({
              message: "Failed",
              description: "Something went wrong",
            });
            
          }
        })
    
      }
      
      if(isLoading){
        return(
            <div className="pl-80 flex items-center justify-center">
                <h5>Loading...</h5>
            </div>
        )
      }

      if(isError){
        return(
            <div className="pl-80 flex items-center justify-center">
                <h5>Something went wrong</h5>
            </div>
        )
      }
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
            const currentDate =  moment();
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
              <span className={!text ? "text-green-500" : "text-red-600"}>{text  ? "Active" : "Archive"}</span>
            )
          },
        },
        {
            title: "Action",
            fixed:"right",
            dataIndex: "archive",
            key: "archive",
            render: (text , record) => {
              return (
               <button className="bg-green-500 p-1" onClick={() => handleRestore(record.id)}>
                Restore
               </button>
              )
            },
          },
      ];
    
      const archiveSource = data.data
      console.log(archiveSource)
    return(
        <div className="pl-80 bg-gray-200 h-screen ">
        <div className="flex items-center justify-center">
        <div className="pt-28 text-start">
        <h5 className="font-bold text-xl">Archive List Inventory</h5>
        </div>
        </div>
        <Row>
           <Col xl={23}>
             <Table
               style={{ zIndex: "10000" }}
               rowKey="id"
               // rowSelection={rowSelection}
               columns={columns1}
               dataSource={archiveSource}
               pagination={{
                 position: ["bottomCenter"],
               }}
               
  
                 
               scroll={{
                 x: 2000,
               }}
             />
           </Col>
         </Row>
        </div>
     )
}

export default  ArchiveListExpense