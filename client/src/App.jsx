import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddTrip from "./pages/AddTrip";
import EditTrip from "./pages/EditTrip";

function App() {
  return (
    <Routes>
      {/* Register page opens first */}
      <Route path="/" element={<Register />} />

      {/* Home */}
      <Route path="/home" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Trip Management */}
      <Route path="/add-trip" element={<AddTrip />} />
      <Route path="/edit-trip/:id" element={<EditTrip />} />
    </Routes>
  );
}

export default App;