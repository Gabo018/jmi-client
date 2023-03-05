
import React from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { PrivateRoutes } from "./PrivateRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { Login } from "./pages/Authentication/Login";
import { Register } from "./pages/Authentication/Register";
import { ForgotPass } from "./pages/Authentication/ForgotPass";
import { NewPassword } from "./pages/Authentication/NewPassword";


function App() {
  console.log(import.meta.env)
  return (
    <div>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/*" element={
            <>
              <NavBar />
              <DashboardRoutes />
            </>
          } />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/forgot' element={<ForgotPass />} />
        <Route path='/new-password' element={<NewPassword />} />
      </Routes>
    </div>
  );
}

export default App;
