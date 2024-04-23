import { useEffect, useState } from "react";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import Checkbox from "@mui/material/Checkbox";

export default function SearchFlux() {
  type Flux = {
    id_flux: number;
    product_id: number;
    sh8: number;
    sh2: number;
    type: string;
    annee: number;
    trimestre: number;
    libelle: string;
    valeur: number;
    poids_net: number;
    quantite: number;
    prix_unitaire: number;
    prix_unitaire_moyenne_annuelle: number;
  };
  const fluxBase = [
    { value: "All", label: "Type" },
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

  const [fluxs, setFluxs] = useState<Flux[]>([]);

  const [yearOptions, setYearOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [trimestreOptions, setTrimestreOptions] = useState("all");

  const [querry, setQuerry] = useState("");
  const [fluxOPtion, setfluxOPtion] = useState("all");
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
  const [annneeOption, setAnneeOption] = useState("all");
  const handleFluxChange = (selectedOption: any) => {
    setfluxOPtion(selectedOption.value);
  };
  const handleYearChange = (selectedOption: any) => {
    setAnneeOption(selectedOption.value);
  };
  const handleTrimestreChange = (selectedOption: any) => {
    setTrimestreOptions(selectedOption.value);
  };

  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const reponse = await fetch("http://localhost:3000/api/instat/flux/");

        const fluxs: Flux[] = await reponse.json();
        const years = Array.from(new Set(fluxs.map((flux) => flux.annee)));

        // Utiliser les années uniques

        const yearOptions = years.map((year) => ({
          value: year.toString(),
          label: year.toString(),
        }));
        const defaultAnnee = [{ value: "all", label: "Annee" }, ...yearOptions];
        setFluxs(fluxs);
        setYearOptions(defaultAnnee);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFlux();
  }, []);

  const searching = async (
    event: React.MouseEvent,
    searchQuerry: string,
    fluxQuerry: string,
    yearQuery: string,
    trimestreQuerry: string
  ) => {
    event.stopPropagation();
    try {
      const response = await fetch(
        `http://localhost:3000/api/instat/flux/findOne/byLibelle/${searchQuerry}/${fluxQuerry}/${yearQuery}/${trimestreQuerry}`
      );
      const fluxs: Flux[] = await response.json();
      setFluxs(fluxs);
    } catch (error) {
      alert(`Error finding the product: ${error}`);
    }
  };

  const handleDelete = async (event: React.MouseEvent, fluxId: number) => {
    event.stopPropagation();

    try {
      await fetch(`http://localhost:3000/api/instat/flux/delete/${fluxId}`, {
        method: "DELETE",
      });

      const updatedFlux = fluxs.filter((flux) => flux.id_flux !== fluxId);
      setFluxs(updatedFlux);
    } catch (e) {
      console.log(e);
    }
  };

  function handleEdit() {
    alert("edit");
  }

  return (
    <div>
      <div
        className="row searchContainer"
        style={{
          marginBottom: "20px",
        }}
      >
        <div className="col-6 filter">
          <Select
            className=".custom-select"
            defaultValue={{ value: "All", label: "Type" }}
            options={fluxBase}
            value={fluxBase.find((option) => option.value === fluxOPtion)}
            onChange={handleFluxChange}
            isSearchable={false}
            styles={customStyles}
          />{" "}
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
            }}
          />
          <label className="labeling" htmlFor="w/search">Filtrage sans recherche</label>
        </div>
        <div className="col-6 searchBox">
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
            onClick={(event) =>
              searching(
                event,
                querry,
                fluxOPtion,
                annneeOption,
                trimestreOptions
              )
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
              Flux
            </th>
            <th scope="col">Annee</th>
            <th scope="col">Timestre</th>
            <th scope="col">SH8</th>
            <th scope="col">Libelle</th>
            <th scope="col">Valeur</th>
            <th scope="col">Poids net</th>
            <th scope="col">Quantité</th>
            <th scope="col">Prix unitaire</th>
            <th scope="col">Prix unitaire annuel moyen</th>
            <th scope="col" className="bordering-right">
              SH2
            </th>
          </tr>
        </thead>
        <br />
        <tbody className="flux-table">
          {fluxs.map((flux) => (
            <>
              <tr>
                <td>{flux.type}</td>
                <td>{flux.annee}</td>
                <td>{flux.trimestre}</td>
                <td>{flux.sh8}</td>
                <td>{flux.libelle}</td>
                <td>{flux.valeur}</td>
                <td>{flux.poids_net}</td>
                <td>{flux.quantite}</td>
                <td>{flux.prix_unitaire}</td>
                <td>{flux.prix_unitaire_moyenne_annuelle}</td>
                <td>
                  {flux.sh2}
                  <FontAwesomeIcon
                    className="iconz-left"
                    icon={faEdit}
                    onClick={handleEdit}
                  />{" "}
                  <FontAwesomeIcon
                    className="iconz-right"
                    icon={faTrash}
                    onClick={(event) => handleDelete(event, flux.id_flux)}
                  />
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
