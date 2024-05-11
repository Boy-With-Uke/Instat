import Search from "./pages/Search";
import Add from "./pages/Add";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExcelToJsonConverter from "./pages/essaieToJson";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/add" element={<Add />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/essaie" element={<ExcelToJsonConverter />} />
      </Routes>
    </Router>
  );
}

export default App;
