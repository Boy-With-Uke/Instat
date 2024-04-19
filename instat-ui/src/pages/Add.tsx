import Sidebar from "../components/Sidebar";
import "../assets/main.css";

export default function Search() {
  return (
    <>
      <div className="container-fluid bg-dark bg-gradient" id="mainContainer">
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div
            className="col-11 main"
            style={{
              margin: "0px;",
            }}
          >
            <div>
              <h1>Add</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
