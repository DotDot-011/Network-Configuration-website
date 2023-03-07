import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Page/Home";
import Topology from "./Page/Topology";
import Config from "./Page/Config";
import LoginPage from "./Page/Login";
import CreateRepository from "./Page/CreateRepo";
import ShowFile from "./Page/ShowFile";
import CompareCode from "./Page/CompareText";

export default function PageRouter() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to = '/login'></Navigate>} ></Route>
          <Route path="/login" element={<LoginPage />} ></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/createRepo" element={<CreateRepository />}></Route>
          <Route path="/config/:id" element={<Topology />}></Route>
          <Route path="/config" element= {<Navigate to = '/home'></Navigate>} />
          <Route path="/config/:id/host/:host/:device" element={<Config />}></Route>
          <Route path="/file/:fileId" element={<ShowFile />}></Route>
          <Route path="/Compare/:id/:fileid1/:fileid2" element={<CompareCode />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
