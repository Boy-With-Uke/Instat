import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/sidebar.css";
import {
  faAdd,
  faArrowRightFromBracket,
  faBell,
  faChartColumn,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  return (
    <div className="col-2 sidebar">
      <div className="topSection">
        <Link to={"/main"}>
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
        <Link to={"/notifications"}>
          <div className="circle">
            <FontAwesomeIcon className="icon" icon={faBell} />
          </div>
        </Link>
        <div className="circle">
          <FontAwesomeIcon
            className="icon"
            icon={faArrowRightFromBracket}
            onClick={() => {
              Cookies.remove("user");
              navigate("/");
            }}
          />
        </div>
      </div>
    </div>
  );
}
