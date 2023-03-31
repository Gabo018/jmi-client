import { Table } from "antd";

const ChartAccounts = () => {
    const dataSource = [
        {
          key: '1',
          account_name: 'Cash',
          account_type:"Bank and Cash",
          report_type: "Balance Sheet",
          debit: 'Debit/Credit',
        },
        {
            key: '2',
            account_name: 'Bank',
            account_type:"Bank and Cash",
            report_type: "Balance Sheet",
            debit: 'Debit',
        },
          {
            key: '3',
            account_name: 'Liquidity Transfer',
            account_type:"Current Assets",
            report_type: "Balance Sheet",
            debit: 'Debit',
          },
          {
            key: '4',
            account_name: 'Outstanding Billing Invoice',
            account_type:"Current Assets",
            report_type: "Balance Sheet",
            debit: 'Debit',
          },
          {
            key: '5',
            account_name: 'Inventory',
            account_type:"Current Assets",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '6',
            account_name: 'Purchases',
            account_type:"Current Assets",
            report_type: "Balance Sheet",
            debit: 'Debit',
          },
          {
            key: '7',
            account_name: 'Prepayment',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '8',
            account_name: 'Input Tax (VAT 12%',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '9',
            account_name: 'Other Current Asset',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '10',
            account_name: 'Other Non current Asset',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '11',
            account_name: 'Output Tax (VAT 12%',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '12',
            account_name: 'Accounts Payable',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '12',
            account_name: 'Other Non current Liability',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
          {
            key: '13',
            account_name: 'Sales/Revenue',
            account_type:"test",
            report_type: "Balance Sheet",
            debit: '10 Downing Street',
          },
      ];
      
      const columns = [
        {
          title: 'Account Name',
          dataIndex: 'account_name',
          key: 'account_name',
        },
        {
            title: 'Account Type',
            dataIndex: 'account_type',
            key: 'account_type',
          },
          {
            title: 'Report Type ',
            dataIndex: 'report_type',
            key: 'report_type',
          },
          {
            title: 'Debit/Credit',
            dataIndex: 'debit',
            key: 'debit',
          },
      ];
      
      return(
    <div className="pl-80 bg-gray-200 flex items-center flex-col pr-80">
   
      <h5>Chart of Accounts</h5>
            <Table dataSource={dataSource} columns={columns} scroll={{
                x:3000
            }}/>
     
    </div>
      )
}

export default ChartAccounts