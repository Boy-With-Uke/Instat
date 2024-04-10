import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/sidebar.css";
import {
  faAdd,
  faArrowRightFromBracket,
  faChartColumn,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
  return (
    <div className="col-2 sidebar">
      <div className="topSection">
        <Link to={"/"}>
          <div className="circle">
            <FontAwesomeIcon className="icon" icon={faSearch} />
          </div>
        </Link>
        <Link to={"/add"}>
          <div className="circle">
            <FontAwesomeIcon className="icon" icon={faAdd} />
          </div>
        </Link>
        <Link to={"/dash"}>
          <div className="circle">
            <FontAwesomeIcon className="icon" icon={faChartColumn} />
          </div>
        </Link>
      </div>

      <div className="bottomSection">
        <Link to={"/logout"}>
          <div className="circle">
            <FontAwesomeIcon className="icon" icon={faArrowRightFromBracket} />
          </div>
        </Link>
      </div>
    </div>
  );
}
