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
  const [data, setData] = useState([]);
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
        const filteredFluxsThisyear = dataJson.filter(
          (flux: any) =>
            flux.annee === annee
        );
        setData(filteredFluxs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFlux();
  }, [annee, trimestre, type]);

  const topThreeLocations = data.reduce((acc: any, item: any) => {
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

  const barOptions = {
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
    },
  };

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
            <div className="dash-section" style={{ backgroundColor: "red" }}>
              <div className="row top">
                <div
                  className="col-6 left"
                  style={{ backgroundColor: "green" }}
                >
                  <Bar
                    data={barDataTop3ProductinTheactualYear}
                    options={barOptions}
                  />
                </div>
                <div
                  className="col-6 right"
                  style={{ backgroundColor: "blue" }}
                >
                  <Doughnut
                    data={barDataTop3ProductinTheactualYear}
                    options={barOptions}
                  />
                </div>
              </div>

              <div
                className="row midle
              "
              >
                <div className="col-6 left"> </div>
                <div className="col-6 right">
                  <div
                    className="radio-inputs"
                    style={{ marginBottom: "20px" }}
                  >
                    <label className="radio">
                      <input defaultChecked type="radio" name="radio" />
                      <span className="name">Flux</span>
                    </label>

                    <label className="radio">
                      <input type="radio" name="radio" />
                      <span className="name">Produits</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row bottom" style={{ backgroundColor: "yellow" }}>
                bottom
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
