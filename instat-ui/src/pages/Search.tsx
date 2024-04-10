import Sidebar from "../components/Sidebar";
export default function Search() {
  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="col-10" style={{backgroundColor: "red"}}>
          <h1>Search</h1>
        </div>
      </div>
    </>
  );
}
