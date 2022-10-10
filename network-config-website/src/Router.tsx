import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Page/Home";
import Config from "./Page/Config";

export default function PageRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/config/:id" element={<Config />}></Route>
          <Route path="/config" element= {<Navigate to = '/home'></Navigate>} />
        </Routes>
      </div>
    </Router>
  );
}
