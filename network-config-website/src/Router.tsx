import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Page/Home";
import Topology from "./Page/Topology";
import Config from "./Page/Config";
import LoginPage from "./Page/Login";
import CreateRepository from "./Page/CreateRepo";
import ShowFile from "./Page/ShowFile";

export default function PageRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage />} ></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/createRepo" element={<CreateRepository />}></Route>
          <Route path="/config/:id" element={<Topology />}></Route>
          <Route path="/config" element= {<Navigate to = '/home'></Navigate>} />
          <Route path="/config/:id/host/:host/:device" element={<Config />}></Route>
          <Route path="/file/:fileId" element={<ShowFile />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
