import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SearchProduct() {
  type Product = {
    id_product: number;
    sh8_product: number;
    sh2_product: number;
    libelle_product: number;
    AnneeApparition: string;
    TrimestreApparition: number;
  };

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const reponse = await fetch(
          "http://localhost:3000/api/instat/product/"
        );

        const products: Product[] = await reponse.json();
        setProducts(products);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFlux();
  });

  const handleDelete = async (event: React.MouseEvent, productId: number) => {
    event.stopPropagation();

    try {
      await fetch(
        `http://localhost:3000/api/instat/product/delete/${productId}`,
        {
          method: "DELETE"
        }
      );

      const updatedProduct = products.filter((product) => product.id_product !== productId);
      setProducts(updatedProduct);
    } catch (e) {
      console.log(e);
    }
  };
  function handleEdit() {
    alert("edit")
  }

  return (
    <div>
      <div className="filter"></div>
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
          />
          <button className="searchButton">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
            >
              <g clip-path="url(#clip0_2_17)">
                <g filter="url(#filter0_d_2_17)">
                  <path
                    d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z"
                    stroke="white"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    shape-rendering="crispEdges"
                  ></path>
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_d_2_17"
                  x="-0.418549"
                  y="3.70435"
                  width="29.7139"
                  height="29.7139"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  ></feColorMatrix>
                  <feOffset dy="4"></feOffset>
                  <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="out"></feComposite>
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  ></feColorMatrix>
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2_17"
                  ></feBlend>
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2_17"
                    result="shape"
                  ></feBlend>
                </filter>
                <clipPath id="clip0_2_17">
                  <rect
                    width="28.0702"
                    height="28.0702"
                    fill="white"
                    transform="translate(0.403503 0.526367)"
                  ></rect>
                </clipPath>
              </defs>
            </svg>
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
            <>
              <tr>
                <td>{product.sh8_product}</td>
                <td>{product.sh2_product}</td>
                <td>{product.libelle_product}</td>
                <td>{product.AnneeApparition}</td>
                <td>{product.TrimestreApparition} <FontAwesomeIcon className="iconz-left" icon={faEdit} onClick={handleEdit}/> <FontAwesomeIcon className="iconz-right" icon={faTrash} onClick={(event) => handleDelete(event, product.id_product)}/> </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
