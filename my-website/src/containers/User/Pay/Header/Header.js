import { useHistory } from "react-router-dom";
import "./Header.scss";

const Header = (props) => {
  const history = useHistory();

  const Redirect = () => {
    if (props.data === "Add" || props.data === "Change") {
      history.push("/chooseAddress");
    } else if (props.data === "Pay") {
      history.push("/cart");
    } else {
      history.goBack();
    }
  };
  return (
    <div className="head">
      <i className="fas fa-arrow-left" onClick={() => Redirect()}></i>
      <p>{props.data}</p>
    </div>
  );
};
export default Header;
