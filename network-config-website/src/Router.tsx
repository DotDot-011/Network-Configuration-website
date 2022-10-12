import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Page/Home";
import Topology from "./Page/Topology";
import Config from "./Page/Config";

export default function PageRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/config/:id" element={<Topology />}></Route>
          <Route path="/config" element= {<Navigate to = '/home'></Navigate>} />
          <Route path="/config/:id/host/:host/:device" element={<Config />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
