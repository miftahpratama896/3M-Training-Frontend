import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import DashboardCenter from "./Components/Dashboard/DashboardCenter";
import TrainingInput from "./Components/TrainingInput/TrainingInput";
import ValidationInput from "./Components/ValidationInput/ValidationInput";
import Visualization from "./Components/Visualization/Visualization";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={
          <>
            <Dashboard />
            <DashboardCenter />
          </>} />
        <Route path="/TrainingInput" element={
          <>
            <Dashboard />
            <TrainingInput />
          </>} />
        <Route path="/ValidationInput" element={<><Dashboard /><ValidationInput /></>} />
        <Route path="/Visualization" element={
          <>
            <Dashboard />
            <Visualization />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
