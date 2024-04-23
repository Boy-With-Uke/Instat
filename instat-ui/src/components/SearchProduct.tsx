import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import "../assets/select.css";

export default function SearchProduct() {
  type Product = {
    id_product: number;
    sh8_product: number;
    sh2_product: number;
    libelle_product: string;
    AnneeApparition: string;
    TrimestreApparition: number;
  };
  const flux = [
    { value: "All", label: "All" },
    { value: "E", label: "Exportation" },
    { value: "I", label: "Importation" },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [querry, setQuerry] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: 200,
      border: "none",
      outline: "none",
      backgroundColor: "#003529",
      color: "white",
      "&:hover": {
        border: "none",
        outline: "none",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#003529" : "#fff",
      color: state.isSelected ? "#fff" : "#003529",
      "&:hover": {
        backgroundColor: "#003529",
        color: "#fff",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      width: 200,
    }),
  };
  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption.value);
  };

  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instat/product/"
        );
        const products: Product[] = await response.json();
        setProducts(products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlux();
  }, []);

  const searching = async (
    event: React.MouseEvent,
    searchQuerry: string
  ) => {
    event.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:3000/api/instat/product/findOne/byLibelle/${searchQuerry}`
      );
      const products: Product[] = await response.json();
      setProducts(products);
    } catch (error) {
      alert(`Error finding the product: ${error}`);
    }
  };

  const handleDelete = async (event: React.MouseEvent, productId: number) => {
    event.stopPropagation();

    try {
      await fetch(
        `http://localhost:3000/api/instat/product/delete/${productId}`,
        {
          method: "DELETE",
        }
      );

      const updatedProduct = products.filter(
        (product) => product.id_product !== productId
      );
      setProducts(updatedProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    alert("edit");
  };

  return (
    <div>
      <div className="filter">
        <Select
          defaultValue={{ value: "All", label: "All" }}
          options={flux}
          value={flux.find((option) => option.value === selectedOption)}
          onChange={handleChange}
          isSearchable={false}
          styles={customStyles}
        />{" "}
      </div>
      <div
        id="searchContainer"
        className="row"
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="searchBox">
          <input
            className="searchInput"
            type="text"
            name=""
            placeholder="Search something"
            value={querry}
            onChange={(event) => setQuerry(event.target.value)}
          />
          <button
            className="searchButton"
            onClick={(event) => searching(event, querry)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      <table className="table">
        <thead className="table-dark">
          <tr>
            <th scope="col" className="bordering-left">
              SH8
            </th>
            <th scope="col">SH2</th>
            <th scope="col">Libelle</th>
            <th scope="col">Anne d'apparition</th>
            <th scope="col" className="bordering-right">
              Trimestre d'apparition
            </th>
          </tr>
        </thead>
        <br />
        <tbody className="product-table">
          {products.map((product) => (
            <tr>
              <td>{product.sh8_product}</td>
              <td>{product.sh2_product}</td>
              <td>{product.libelle_product}</td>
              <td>{product.AnneeApparition}</td>
              <td>
                {product.TrimestreApparition}{" "}
                <FontAwesomeIcon
                  className="iconz-left"
                  icon={faEdit}
                  onClick={handleEdit}
                />{" "}
                <FontAwesomeIcon
                  className="iconz-right"
                  icon={faTrash}
                  onClick={(event) => handleDelete(event, product.id_product)}
                />{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
