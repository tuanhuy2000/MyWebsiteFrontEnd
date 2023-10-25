import { useDispatch, useSelector } from "react-redux";
import "./Home.scss";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { handleLogoutRedux } from "../../../redux/actions/userAction";

const Home = () => {
  const history = useHistory();
  const account = useSelector((state) => state.user.account);
  const [role, setRole] = useState("");
  const dispatch = useDispatch();

  const handleLogoutButtonRedux = () => {
    dispatch(handleLogoutRedux());
    setRole("");
    history.push("/");
  };

  const handleUserInfor = () => {
    if (account) {
      history.push(`/user`);
    }
  };

  useEffect(() => {
    if (account) {
      setRole(account.role);
    }
  }, [account]);

  return (
    <>
      <div className="App-header">
        <div className="Home-logo">
          <span onClick={() => history.push("/")}>
            <i className="fa-solid fa-bag-shopping"></i>
            <span>Shopee</span>
          </span>
        </div>
        <div>
          <div className="group-icon">
            <span onClick={() => history.push(`/cart`)}>
              <i
                className={account ? "fa-solid fa-cart-shopping" : "d-none"}
              ></i>
            </span>
            <span onClick={() => history.push(`/users`)}>
              <i
                className={role === "AdminRole" ? "fas fa-users" : "d-none"}
              ></i>
            </span>
            <span onClick={() => handleUserInfor()}>
              <i className={account ? "fa-solid fa-user" : "d-none"}></i>
            </span>
          </div>

          {account ? (
            <button
              type="button"
              onClick={() => handleLogoutButtonRedux()}
              className="btn btn-warning"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => history.push("/login")}
              className="btn btn-warning"
            >
              Login
            </button>
          )}

          <button
            type="button"
            onClick={() => history.push("/signin")}
            className="btn btn-warning"
          >
            Signin
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
