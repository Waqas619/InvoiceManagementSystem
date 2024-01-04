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

const root = ReactDOM.createRoot(document.getElementById("root"));
document
  .getElementById("root")
  .setAttribute("style", "width:100%; height:100%");

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      {/* Teams Routes */}
      <Route path="/Teams" element={<Teams />}></Route>
      <Route path="/AddTeam" element={<TeamDetails />}></Route>
      <Route path="/TeamDetails" element={<TeamDetails />}></Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
