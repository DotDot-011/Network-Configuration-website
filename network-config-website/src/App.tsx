import React from 'react';
import './App.css';
import PageRouter from './Router';
import "bootstrap/dist/css/bootstrap.min.css";
import 'reactflow/dist/style.css';
import '../node_modules/highlight.js/styles/magula.css'
import '@fortawesome/fontawesome-free/css/all.min.css';  
import 'mdbreact/dist/css/mdb.css';

function App() {
  return (
    <PageRouter></PageRouter>
  );
}

export default App;
