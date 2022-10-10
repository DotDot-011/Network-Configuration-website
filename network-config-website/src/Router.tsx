import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Page/Home";

export default function PageRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
