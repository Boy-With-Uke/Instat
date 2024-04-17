import Sidebar from "../components/Sidebar";
export default function Search() {
  return (
    <>
      <div className="container-fluid">
        <div style={{ display: "flex" }}>
          <Sidebar />
          <div
            className="col-11 main"
            style={{
              margin: "0px;",
            }}
          >
            <div>
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
