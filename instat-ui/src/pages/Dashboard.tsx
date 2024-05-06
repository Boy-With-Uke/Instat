import Sidebar from "../components/Sidebar";
import "../assets/main.css";
import { Bar, Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { title } from "process";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [dataRight, setDataRight] = useState([]);
  const [dataLeft, setDataLeft] = useState([]);

  const [trimestre, setTrimestre] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [type, setType] = useState("I");

  useEffect(() => {
    const fetchFlux = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/instat/flux/");

        const dataJson = await response.json();
        const filteredDataAllyear = dataJson.filter(
          (flux: any) => flux.type === type
        );

        setDataLeft(filteredDataAllyear);
        //console.log(filteredDataAllyear);

        const filteredFluxsThisyear = dataJson.filter(
          (flux: any) =>
            flux.annee === annee &&
            flux.type === type &&
            flux.trimestre === trimestre
        );
        setDataRight(filteredFluxsThisyear);
        console.log(filteredFluxsThisyear);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFlux();
  }, [annee, trimestre, type]);

  // --------------------------RIGHT--------------------------
  const topThreeLocations = dataRight.reduce((acc: any, item: any) => {
    if (!acc[item.libelle]) {
      acc[item.libelle] = 0;
    }
    acc[item.libelle] += item.valeur;
    return acc;
  }, {});

  const sortedTopThreeLocations = Object.entries(topThreeLocations)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 3);

  const Longlibelles = sortedTopThreeLocations.map(([libelle]) => libelle);

  const valeurs = sortedTopThreeLocations.map(([_, valeur]) => valeur);
  const libelles = Longlibelles.map((libelle) => libelle.split(" "));

  const barDataTop3ProductinTheactualYear = {
    labels: libelles,
    datasets: [
      {
        data: valeurs,
        backgroundColor: ["#003529", "#006329", "#008329"],
      },
    ],
  };

  // --------------------------LEFT--------------------------

  const top5AllYear = dataLeft.reduce((acc: any, item: any) => {
    if (!acc[item.libelle]) {
      acc[item.libelle] = 0;
    }
    acc[item.libelle] += item.valeur;
    return acc;
  }, {});

  const sortedTop5Product = Object.entries(top5AllYear)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);
  const LonglibellesLeft = sortedTop5Product.map(([libelle]) => libelle);
  const valeursLeft = sortedTop5Product.map(([_, valeur]) => valeur);

  const libellesLeft = LonglibellesLeft.map((libelle) => libelle.split(" "));

  const barDataTop5ProductAllYear = {
    labels: libellesLeft,
    datasets: [
      {
        data: valeursLeft,
        backgroundColor: [
          "#003529",
          "#006329",
          "#008329",
          "#003529",
          "#006329",
        ],
      },
    ],
  };

  const barOptions1 = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      animateRotate: true, // Active l'animation de rotation
      animateScale: true, // Active l'animation de mise à l'échelle
      duration: 1000, // Définit la durée de l'animation en millisecondes (par exemple, 1000 pour une seconde)
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Top 5 des produits les plus ${
          type === "E" ? "exporter" : "importer"
        } annees confondues`,
        fontSize: 24,
        fontColor: "white",
      },
    },
  };

  const barOptions2 = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      animateRotate: true, // Active l'animation de rotation
      animateScale: true, // Active l'animation de mise à l'échelle
      duration: 1000, // Définit la durée de l'animation en millisecondes (par exemple, 1000 pour une seconde)
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Top 3 des produits les plus ${
          type === "E" ? "exporter" : "importer"
        } ce trimestre, annee : ${annee}`,
        fontSize: 24,
        fontColor: "white",
      },
    },
  };

  function handleExp() {
    setType("E");
  }
  function handleImp() {
    setType("I");
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
            <div className="dash-section" >
              <div className="row top">
                <div
                  className="col-6 left"
                >
                  <Bar data={barDataTop5ProductAllYear} options={barOptions1} />
                </div>
                <div
                  className="col-6 right"
                >
                  <Doughnut
                    data={barDataTop3ProductinTheactualYear}
                    options={barOptions2}
                  />
                </div>
              </div>

              <div
                className="row midle
              "
              >
                <div className="radio-inputs">
                  <label className="radio">
                    <input
                      defaultChecked
                      type="radio"
                      name="radio"
                      onClick={handleImp}
                    />
                    <span className="name">Importations</span>
                  </label>

                  <label className="radio">
                    <input type="radio" name="radio" onClick={handleExp} />

                    <span className="name">Exportation</span>
                  </label>
                </div>
              </div>
              <div className="row bottom">bottom</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
