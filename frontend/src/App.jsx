import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./Components/Home";
import Login from "./pages/Login";
import AddEmployee from "./pages/admin/AddEmployee";
import "./assets/styles/custom.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/add-employee" element={<AddEmployee />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
