import "./Signin.scss";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { toast } from "react-toastify";
import { getOTP, signin } from "../../../services/UserServices";
import OtpInput from "react-otp-input";

const Signin = () => {
  const usernameRegex = /^[a-zA-z0-9_]+$/;
  const passRegex = /^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/;
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  //const nameRegex = /^[a-zA-z]+$/;
  const nameRegex = /^[aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]+$/;
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})+$/;
  const history = useHistory();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState();
  const [count, setCount] = useState({ s: 120 });
  const [showOtp, setShowOtp] = useState(false);

  const HandleChangeName = (event) => {
    setName(event.target.value)
    if (nameRegex.test(event.target.value)) {
      var element = document.getElementById(event.target.id);
      element.classList.remove("wrong-format");
    } else {
      var element = document.getElementById(event.target.id);
      element.classList.add("wrong-format");
    }
  }

  const HandleChangePhone = (event) => {
    setPhone(event.target.value)
    if (phoneRegex.test(event.target.value)) {
      var element = document.getElementById(event.target.id);
      element.classList.remove("wrong-format");
    } else {
      var element = document.getElementById(event.target.id);
      element.classList.add("wrong-format");
    }
  }

  const HandleChangeEmail = (event) => {
    setEmail(event.target.value)
    if (emailRegex.test(event.target.value)) {
      var element = document.getElementById(event.target.id);
      element.classList.remove("wrong-format");
    } else {
      var element = document.getElementById(event.target.id);
      element.classList.add("wrong-format");
    }
  }

  const HandleChangeUserName = (event) => {
    setUsername(event.target.value)
    if (usernameRegex.test(event.target.value)) {
      var element = document.getElementById(event.target.id);
      element.classList.remove("wrong-format");
    } else {
      var element = document.getElementById(event.target.id);
      element.classList.add("wrong-format");
    }
  }

  const HandleChangePassWord = (event) => {
    setPassword(event.target.value)
    if (passRegex.test(event.target.value)) {
      var element = document.getElementById(event.target.id);
      element.classList.remove("wrong-format");
    } else {
      var element = document.getElementById(event.target.id);
      element.classList.add("wrong-format");
    }
  }

  const HandleChangeConfirmPassWord = (event) => {
    setConfirmPassword(event.target.value)
    if (passRegex.test(event.target.value)) {
      var element = document.getElementById(event.target.id);
      element.classList.remove("wrong-format");
    } else {
      var element = document.getElementById(event.target.id);
      element.classList.add("wrong-format");
    }
  }

  const Signin = async (id, name, phoneNumber, email, userName, password) => {
    let res = await signin(
      id,
      name,
      phoneNumber,
      email,
      userName,
      password,
      otp
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
  };

  const getOtp = async (email) => {
    let res = await getOTP(email);
    if (res.data) {
      if (res.data.success) {
      } else {
        toast.warning(res.data.message);
      }
    } else {
      toast.error("Error");
    }
  };

  const handleSigninButton = () => {
    if (
      nameRegex.test(name) &&
      phoneRegex.test(phone) &&
      emailRegex.test(email) &&
      usernameRegex.test(username) &&
      passRegex.test(password) &&
      passRegex.test(confirmPassword)
    ) {
      if (password === confirmPassword) {
        if (showOtp) {
          const { v4: uuidv4 } = require("uuid");
          const random_uuid = uuidv4();
          Signin(random_uuid, name, phone, email, username, password);
        } else {
          setShowOtp(!showOtp);
          getOtp(email);
        }
      } else {
        toast.warning("Confirm password wrong !!!");
      }
    } else {
      toast.warning("Missing value or wrong format !!!");
    }
  };

  const startTimer = () => {
    let myInterval = setInterval(() => {
      setCount((count) => {
        const updatedTime = { ...count };
        if (count.s > 0) {
          updatedTime.s--;
        }
        if (count.s === 0) {
          clearInterval(myInterval);
          setShowOtp(false);
          setCount({ s: 120 });
        }
        return updatedTime;
      });
    }, 1000);
  };

  useEffect(() => {
    if (showOtp) {
      startTimer();
    }
  }, [showOtp]);

  return (
    <div className="signin-background">
      <div className="signin-container col-10 col-sm-4">
        <div className="signin-content row">
          <div className="col-12 text-signin">Signin</div>
          <div className="col-12 from-group signin-input">
            <label>Name <b>*</b></label>
            <input
              id="name-input"
              className="form-control"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => HandleChangeName(event)}
            />
          </div>
          <div className="col-12 from-group signin-input">
            <label>Phone number <b>*</b></label>
            <input
              id="phone-input"
              className="form-control"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(event) => HandleChangePhone(event)}
            />
          </div>
          <div className="col-12 from-group signin-input">
            <label>Email <b>*</b></label>
            <input
              id="email-input"
              className="form-control"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => HandleChangeEmail(event)}
            />
          </div>
          <div className="col-12 from-group signin-input">
            <label>Username <b>*</b></label>
            <input
              id="username-input"
              className="form-control"
              type="text"
              placeholder="Enter your user name"
              value={username}
              onChange={(event) => HandleChangeUserName(event)}
            />
          </div>
          <div className="col-12 from-group signin-input">
            <label>Password <b>*</b></label>
            <div className="custom-input">
              <input
                id="pass-input"
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => HandleChangePassWord(event)}
              />
              <span onClick={() => setShow(!show)}>
                <i className={show ? "far fa-eye-slash" : "far fa-eye"}></i>
              </span>
            </div>
          </div>
          <div className="col-12 from-group signin-input">
            <label>Confirm Password <b>*</b></label>
            <div className="custom-input">
              <input
                id="confirm-pass-input"
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Enter your confirm password"
                value={confirmPassword}
                onChange={(event) => HandleChangeConfirmPassWord(event)}
              />
              <span onClick={() => setShow(!show)}>
                <i className={show ? "far fa-eye-slash" : "far fa-eye"}></i>
              </span>
            </div>
          </div>
          <label className="note">(<b>*</b>) Information is required to be entered</label>
          {showOtp ? (
            <div>
              <label>OTP:</label>
              <div className="otp-input d-flex">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  separator={<span>-</span>}
                  inputStyle={"input-custom"}
                />
              </div>
              <div>Your otp will expire after {count.s} seconds</div>
            </div>
          ) : (
            ""
          )}
          <div className="col-12">
            <button
              type="button"
              className="btn-signin"
              onClick={() => handleSigninButton()}
            >
              {showOtp ? "Sign in" : "Get OTP"}
            </button>
          </div>
          {/* <div className="col-12 text-center mt-3">
            <span className="text-orther-signin">Or signin with: </span>
          </div>
          <div className="col-12 social-signin">
            <i className="fab fa-google-plus-g google"></i>
            <i className="fab fa-facebook-f facebook"></i>
          </div> */}
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
