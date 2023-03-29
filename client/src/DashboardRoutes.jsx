import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AddBill } from "./pages/AddBill";
import { BillRecord } from "./pages/BillRecord";
import { VieBill } from './pages/ViewBill';
import { AddExpense } from "./pages/AddExpense";
import { ViewExpenses } from './pages/ViewExpenses';
import { EditExpenses } from './pages/EditExpenses';
import { Sales } from "./pages/Sales";
import { EditExpense } from "./EditingData/EditExpense";
import { Loss } from "./pages/Loss";
import { Profit } from "./pages/NetProfit";
import { AddInventory } from './pages/AddInventory';
import { ViewInventory } from './pages/ViewInventory';
import { EditInventory } from './pages/EditInventory';
import { EditBill } from './pages/EditBill';
import ArchiveList from './pages/ArchiveList';

export const DashboardRoutes = () => {
  return (
    <>
      <Routes>
        <Route path='/index' element={<Home />} />
        <Route path="/addBill" element={<AddBill />} />
        <Route path='/viewBill' element={<VieBill />} />
        <Route path='/viewBill/:id' element={<EditBill />} />
        <Route path="/addExpense" element={<AddExpense />} />
        <Route path="/expenseRecord" element={<ViewExpenses />} />
        <Route path="/expenseRecord/:id" element={<EditExpenses />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/editExpense/:id" element={<EditExpense />} />
        <Route path="/loss" element={<Loss />} />
        <Route path="/profit" element={<Profit />} />
        <Route path="/addInventory" element={<AddInventory />} />
        <Route path="/viewInventory" element={<ViewInventory />} />
        <Route path='/viewInventory/:id' element={<EditInventory />} />
        <Route path='/archive-list' element={<ArchiveList />} />
      </Routes>
    </>
  )
}
