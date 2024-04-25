import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import "../assets/select.css";

import Checkbox from "@mui/material/Checkbox";
import { ChangeEvent } from "react";

export default function SearchProduct() {
  type Product = {
    id_product: number;
    sh8_product: string;
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
  const trimestreBase = [
    { value: "all", label: "Trimestre" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  const [trimestreOptions, setTrimestreOptions] = useState("all");

  const [yearOptions, setYearOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [querry, setQuerry] = useState("");

  const [without, setWithout] = useState(false);

  const [annneeOption, setAnneeOption] = useState("all");
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      width: 170,
      marginRight: 10,
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
      width: 170,
    }),
  };


  function handleCheck(event: ChangeEvent<HTMLInputElement>) {
    setWithout(event.target.checked);
  }
  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instat/product/"
        );
        const products: Product[] = await response.json();

        const years = Array.from(
          new Set(products.map((product) => product.AnneeApparition))
        );
        const yearOptions = years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }));
        const defaultAnnee = [{ value: "all", label: "Annee" }, ...yearOptions];
        setProducts(products);

        setYearOptions(defaultAnnee);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlux();
  }, []);






  useEffect(() => {
    if (without) {
      console.log(without);
      const fetchFlux = async () => {
        try {
          const reponse = await fetch(
            `http://localhost:3000/api/instat/product/findMany/${annneeOption}/${trimestreOptions}`
          );
          const products: Product[] = await reponse.json();
          setProducts(products);
        } catch (e) {
          console.log(e);
        }
      };
      fetchFlux();
    }
  }, [without, annneeOption, trimestreOptions]);




  const handleYearChange = (selectedOption: any) => {
    setAnneeOption(selectedOption.value);
  };

  const searching = async (
    event: React.MouseEvent,
    searchQuerry: string,
    yearQuery: string,
    trimestreQuerry: string
  ) => {
    event.stopPropagation();
    try {
      alert(`${searchQuerry} ${yearQuery} ${trimestreQuerry} `);
      const response = await fetch(
        `http://localhost:3000/api/instat/product/findOne/byLibelle/${searchQuerry}/${yearQuery}/${trimestreQuerry}`
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
  const handleTrimestreChange = (selectedOption: any) => {
    setTrimestreOptions(selectedOption.value);
  };

  return (
    <div className="product-page">
      <div
        className="row searchContainer"
        style={{
          marginBottom: "20px",
        }}
      >
        <div className="col-6 filter">
          <Select
            className=".custom-select"
            defaultValue={{ value: "All", label: "Annee" }}
            options={yearOptions}
            value={yearOptions.find((option) => option.value === annneeOption)}
            onChange={handleYearChange}
            isSearchable={false}
            styles={customStyles}
          />{" "}
          <Select
            className=".custom-select"
            defaultValue={{ value: "all", label: "Trimestre" }}
            options={trimestreBase}
            value={trimestreBase.find(
              (option) => option.value === trimestreOptions
            )}
            onChange={handleTrimestreChange}
            isSearchable={false}
            styles={customStyles}
          />{" "}
          <Checkbox
            id="w/search"
            sx={{
              color: "#003529",
              "&.Mui-checked": {
                color: "#003529",
              },
            }}onChange={handleCheck}
          />
          <label className="labeling" htmlFor="w/search">
            Filtrage sans recherche
          </label>
        </div>
        <div className="col-6 searchBox">
          <input
            className="searchInput"
            type="text"
            name=""
            placeholder="Search something"
            value={querry}
            onChange={(event) => setQuerry(event.target.value)}
            disabled={without}
          />
          <button
            className="searchButton"
            onClick={(event) =>
              searching(event, querry, annneeOption, trimestreOptions)
            }
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
            <tr key={product.id_product}>
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
