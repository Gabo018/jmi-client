const BalanceSheet = () => {
    return(
        <div className="mx-auto max-w-7xl py-10">
  <h1 className="text-3xl font-bold mb-5">Balance Sheet</h1>
  <table className="table-auto mx-auto">
    <thead>
      <tr>
        <th className="px-4 py-2"></th>
        <th className="px-4 py-2 text-center">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-4 py-2 font-bold">Current Assets</td>
        <td className="px-4 py-2"></td>
      </tr>
      <tr>
        <td className="px-4 py-2">Cash</td>
        <td className="px-4 py-2 text-center">
          <input type="number" className="w-full py-1 px-2 rounded border-gray-300" />
        </td>
      </tr>
      <tr>
        <td className="px-4 py-2">Bank</td>
        <td className="px-4 py-2 text-center">
          <input type="number" className="w-full py-1 px-2 rounded border-gray-300" />
        </td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-bold">Total Current Assets</td>
        <td className="px-4 py-2 text-center">[insert total current assets amount here]</td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-bold">Fixed Assets</td>
        <td className="px-4 py-2"></td>
      </tr>
      <tr>
        <td className="px-4 py-2">Property</td>
        <td className="px-4 py-2 text-center">
          <input type="number" className="w-full py-1 px-2 rounded border-gray-300" />
        </td>
      </tr>
      <tr>
        <td className="px-4 py-2">Equipment</td>
        <td className="px-4 py-2 text-center">
          <input type="number" className="w-full py-1 px-2 rounded border-gray-300" />
        </td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-bold">Total Fixed Assets</td>
        <td className="px-4 py-2 text-center">[insert total fixed assets amount here]</td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-bold">Total Assets</td>
        <td className="px-4 py-2 text-center">[insert total assets amount here]</td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-bold">Liabilities</td>
        <td className="px-4 py-2"></td>
      </tr>
      <tr>
        <td className="px-4 py-2 font-bold">Current Liabilities</td>
        <td className="px-4 py-2"></td>
      </tr>
      <tr>
        <td className="px-4 py-2">Payables</td>
        <td className="px-4 py-2 text-center">
          <input type="number" className="w-full py-1 px-2 rounded border-gray-300" />
        </td>
      </tr>
      </tbody>
      </table>
      </div>

    )
}
export default BalanceSheet