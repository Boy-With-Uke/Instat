import Sidebar from "../components/Sidebar";
import "../assets/main.css";
import { useState, useEffect } from "react";
import AddFlux from "../components/AddFlux";
import AddProduct from "../components/AddProduct";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [isFlux, setIsFlux] = useState(true);
  const userCoockies = Cookies.get("user");
  const navigate = useNavigate();
  useEffect(() => {
    if (!userCoockies) {
      navigate("/");
    }
  });
  function handleToogleFlux() {
    setIsFlux(true);
  }
  function handleToogleProduct() {
    setIsFlux(false);
  }
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
            <div className="add-section">
              <div className="radio-inputs" style={{ marginBottom: "20px" }}>
                <label className="radio">
                  <input
                    defaultChecked
                    type="radio"
                    name="radio"
                    onClick={handleToogleFlux}
                  />
                  <span className="name">Flux</span>
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="radio"
                    onClick={handleToogleProduct}
                  />
                  <span className="name">Produits</span>
                </label>
              </div>
              {isFlux ? <AddFlux /> : <AddProduct />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
