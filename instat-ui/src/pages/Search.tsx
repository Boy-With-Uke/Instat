import Sidebar from "../components/Sidebar";
import "../assets/main.css";
import "../assets/radio.css";
import "../assets/searchBar.css";
import SearchFlux from "../components/SearchFlux";
import SearchProduct from "../components/SearchProduct";
import { useState } from "react";

export default function Search() {
  const [isFlux, setIsFlux] = useState(true);
  function handleToogleFlux() {
    setIsFlux(true);
    console.log(isFlux);
  }
  function handleToogleProduct() {
    setIsFlux(false);
    console.log(isFlux);
  }
  return (
    <>
      <div className="container-fluid bg-dark bg-gradient" id="mainContainer">
        <div style={{ display: "flex"}}>
          <Sidebar />
          <div
            className="col-11 main"
            style={{
              margin: "0px",
            }}
            
          >
            <div className="radio-inputs" style={{marginBottom: "20px", marginTop: '-20px'}}>
              <label className="radio">
                <input
                  type="radio"
                  name="radio"
                  defaultChecked
                  onClick={handleToogleFlux}
                />
                <span className="name">Flux</span>
              </label>

              <label className="radio">
                <input type="radio" name="radio"onClick={handleToogleProduct}/>
                <span className="name">Produits</span>
              </label>
            </div>
            {isFlux ? <SearchFlux /> : <SearchProduct />}
          </div>
        </div>
      </div>
    </>
  );
}
