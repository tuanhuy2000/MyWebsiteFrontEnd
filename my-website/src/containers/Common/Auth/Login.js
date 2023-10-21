import "./Login.scss";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLoginRedux } from "../../../redux/actions/userAction";
import { toast } from "react-toastify";
import { getCookie } from "../../../services/Common";

const Login = () => {
  const usernameRegex = /^[a-zA-z0-9_]+$/;
  const passRegex = /^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/;
  const history = useHistory();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const account = useSelector((state) => state.user.account);

  useEffect(() => {
    let token = getCookie("Token");
    if (token) {
      history.push(`/`);
    }
  }, [account]);

  const handleLoginButton = () => {
    if (usernameRegex.test(username) && passRegex.test(password)) {
      dispatch(handleLoginRedux(username, password));
    } else {
      toast.warning("Wrong format or Missing value");
    }
  };

  return (
    <div className="login-background">
      <div className="login-container col-10 col-sm-4">
        <div className="login-content row">
          <div className="col-12 text-login">Login</div>
          <div className="col-12 from-group login-input">
            <label>Username:</label>

            <input
              className="form-control"
              type="text"
              placeholder="Enter your user name"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="col-12 from-group login-input">
            <label>Password:</label>
            <div className="custom-input">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <span onClick={() => setShow(!show)}>
                <i className={show ? "far fa-eye-slash" : "far fa-eye"}></i>
              </span>
            </div>
          </div>
          <div className="col-12">
            <button
              type="button"
              className="btn-login"
              onClick={() => handleLoginButton()}
            >
              Log in
            </button>
          </div>
          <div className="col-12">
            <span className="forgot-password">Forgot your password?</span>
          </div>
          <div className="col-12 text-center mt-3">
            <span className="text-orther-login">Or login with: </span>
          </div>
          <div className="col-12 social-login">
            <i className="fab fa-google-plus-g google"></i>
            <i className="fab fa-facebook-f facebook"></i>
          </div>
          <div className="col-12 back">
            <button
              type="button"
              className="btn-back"
              onClick={() => history.push("/")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
