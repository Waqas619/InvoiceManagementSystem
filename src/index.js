import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Invoices from "./pages/Invoices";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import InvoiceDetails from "./pages/InvoiceDetails";
import "sweetalert2/src/sweetalert2.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
document
  .getElementById("root")
  .setAttribute("style", "width:100%; height:100%; min-height:100vh");

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/Invoices" element={<Invoices />}></Route>
      <Route path="/Teams" element={<Teams />}></Route>
      <Route path="/TeamDetails" element={<TeamDetails />}></Route>
      {/* Invoices Routes */}
      <Route path="/Invoices" element={<Invoices />}></Route>
      <Route path="/InvoiceDetails" element={<InvoiceDetails />}></Route>
      <Route path="/AddInvoice" element={<InvoiceDetails />}></Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
