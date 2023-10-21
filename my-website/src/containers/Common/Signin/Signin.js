import "./Signin.scss";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";
import { signin } from "../../../services/UserServices";

const Signin = () => {
  const usernameRegex = /^[a-zA-z0-9_]+$/;
  const passRegex = /^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/;
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  const nameRegex = /^[a-zA-z]+$/;
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})+$/;
  const history = useHistory();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);

  const Signin = async (id, name, phoneNumber, email, userName, password) => {
    if (
      nameRegex.test(name) &&
      phoneRegex.test(phone) &&
      emailRegex.test(email) &&
      usernameRegex.test(username) &&
      passRegex.test(password) &&
      passRegex.test(confirmPassword)
    ) {
      if (password === confirmPassword) {
        let res = await signin(
          id,
          name,
          phoneNumber,
          email,
          userName,
          password
        );
        if (res.data) {
          if (res.data.success) {
            history.push(`/`);
          } else {
            toast.warning(res.data.message);
          }
        } else {
          toast.error("Error");
        }
      } else {
        toast.warning("Confirm password wrong !!!");
      }
    } else {
      toast.warning("Missing value or wrong format !!!");
    }
  };

  const handleSigninButton = () => {
    const { v4: uuidv4 } = require("uuid");
    const random_uuid = uuidv4();
    Signin(random_uuid, name, phone, email, username, password);
  };

  return (
    <div className="signin-background">
      <div className="signin-container col-10 col-sm-4">
        <div className="signin-content row">
          <div className="col-12 text-signin">Signin</div>
          <div className="col-12 from-group signin-input">
            <label>Name:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="col-12 from-group signin-input">
            <label>Phone number:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div className="col-12 from-group signin-input">
            <label>Email:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="col-12 from-group signin-input">
            <label>Username:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter your user name"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="col-12 from-group signin-input">
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
          <div className="col-12 from-group signin-input">
            <label>Confirm Password:</label>
            <div className="custom-input">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Enter your confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <span onClick={() => setShow(!show)}>
                <i className={show ? "far fa-eye-slash" : "far fa-eye"}></i>
              </span>
            </div>
          </div>
          <div className="col-12">
            <button
              type="button"
              className="btn-signin"
              onClick={() => handleSigninButton()}
            >
              Sign in
            </button>
          </div>
          <div className="col-12 text-center mt-3">
            <span className="text-orther-signin">Or signin with: </span>
          </div>
          <div className="col-12 social-signin">
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

export default Signin;
