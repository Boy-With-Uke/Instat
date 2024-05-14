import Search from "./pages/Search";
import Add from "./pages/Add";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Essaie from "./components/essaie";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/add" element={<Add />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/essaie" element={<Essaie />} />
      </Routes>
    </Router>
  );
}

export default App;
