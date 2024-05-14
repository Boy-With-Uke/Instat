import Sidebar from "../components/Sidebar";
import "../assets/main.css";
import { Bar, Doughnut, Line } from "react-chartjs-2";
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
  LineElement,
  PointElement,
} from "chart.js";
import { title } from "process";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

export default function Dashboard() {
  const [dataRight, setDataRight] = useState([]);
  const [dataLeft, setDataLeft] = useState([]);
  const [bigData, setBigData] = useState([]);
  const [dataExp, setDataExp] = useState([]);
  const [dataImp, setDataImp] = useState([]);
  const uniqueYears = Array.from(
    new Set(bigData.map((item: any) => item.annee)),
    (item) => Number(item)
  ).sort((a, b) => a - b);
  console.log(uniqueYears);

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

        setBigData(dataJson);
        const filteredDataAllyear = dataJson.filter(
          (flux: any) => flux.type === type
        );

        setDataLeft(filteredDataAllyear);

        const filteredFluxsThisyear = dataJson.filter(
          (flux: any) =>
            flux.annee === annee &&
            flux.type === type &&
            flux.trimestre === trimestre
        );
        setDataRight(filteredFluxsThisyear);

        const filteredtypeE = dataJson.filter((flux: any) => flux.type === "E");

        setDataExp(filteredtypeE);

        const filteredtypeI = dataJson.filter((flux: any) => flux.type === "I");

        setDataImp(filteredtypeI);
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
    if (!acc[item.sh8]) {
      acc[item.sh8] = 0;
    }
    acc[item.sh8] += item.valeur;
    return acc;
  }, {});

  const sortedTop5Product = Object.entries(top5AllYear)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);
  const LonglibellesLeft = sortedTop5Product.map(([libelle]) => libelle);
  const valeursLeft = sortedTop5Product.map(([_, valeur]) => valeur);

  const libellesLeft = LonglibellesLeft.map((libelle) => libelle.split(" "));

  //BOTTOM

  const dataE = dataExp.reduce((acc: any, item: any) => {
    if (!acc[item.annee]) {
      acc[item.annee] = 0;
    }
    acc[item.annee] += item.valeur;
    return acc;
  }, {});

  const dataI = dataImp.reduce((acc: any, item: any) => {
    if (!acc[item.annee]) {
      acc[item.annee] = 0;
    }
    acc[item.annee] += item.valeur;
    return acc;
  }, {});
  const sortedDataE = Object.entries(dataE).sort(
    (a: any, b: any) => b[1] - a[1]
  );

  const sortedDataI = Object.entries(dataI).sort(
    (a: any, b: any) => b[1] - a[1]
  );

  const valeurE = sortedDataE.map(([_, valeur]) => valeur);
  const valeurI = sortedDataI.map(([_, valeur]) => valeur);

  const data = {
    labels: uniqueYears,
    datasets: [
      {
        label: "Exportation",
        data: valeurE,
        borderColor: "#003529",
        backgroundColor: "#006f34",
      },
      {
        label: "Importations",
        data: valeurI,
        borderColor: "#006329",
        backgroundColor: "#00e169",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Graphique montrant le changements aux fils des ans",
      },
    },
  };

  const barDataTop5ProductAllYear = {
    labels: libellesLeft,
    datasets: [
      {
        data: valeursLeft,
        backgroundColor: [
          "#003529",
          "#004929",
          "#005c29",
          "#007f29",
          "#009d29",
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
            <div className="dash-section">
              <div className="row top">
                <div className="col-6 left">
                  <Bar data={barDataTop5ProductAllYear} options={barOptions1} />
                </div>
                <div className="col-6 right">
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
              <div className="row bottom">
                <Line options={options} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
