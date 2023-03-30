import { Col, notification, Row, Table } from "antd"
import { useMutation, useQuery } from "react-query";
import { userGetArchiveListInventory } from "../modules/service-archiveList-inventory";
import { userDeleteInventory } from "../modules/service-deleteInventory";

const ArchiveListInventory = () => {
    const {
        data,
        isLoading,

        isError,
      
      } = useQuery({
        queryKey: "user-archive",
        queryFn: userGetArchiveListInventory()
      });
      const {mutate } = useMutation(userDeleteInventory)
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
    const columns2 = [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Quantity",
          dataIndex: "quantity",
          key: "quantity",
        },
        {
          title: "Untaxed Price",
          dataIndex: "amount",
          key: "amount",
          render: (text) => {
            const amountWithoutTax = text / 1.12;
            return <span>₱{amountWithoutTax}</span>;
          },
        },
        {
          title: "Tax",
          dataIndex: "amount",
          key: "amount",
    
          render: () => "Output Tax (VAT 12%)",
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          render: (text) => {
            const wholeNumber = Math.trunc(text);
            return <span>₱{wholeNumber}</span>;
          },
        },
        {
            title: "Action",
            dataIndex: "amount",
            fixed:"right",
            key: "amount",
            render: (text , record) => {
        
              return(
                <button className="bg-green-500 p-1   text-white" onClick={() => handleRestore(record._id)}>
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
               columns={columns2}
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

export default  ArchiveListInventory