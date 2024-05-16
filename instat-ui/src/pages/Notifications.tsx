import Sidebar from "../components/Sidebar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import '../assets/main.css'
export default function Notifications() {
  const userCoockies = Cookies.get("user");
  const navigate = useNavigate();
  useEffect(() => {
    if (!userCoockies) {
      navigate("/");
    }
  });

  return (
    <>
      <div className="container-fluid bg-dark bg-gradient" id="mainContainer" >
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div
            className="col-11 main"
            style={{
              margin: "0px;",
            }}
          >
            <div>
              <h1>Notification</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
