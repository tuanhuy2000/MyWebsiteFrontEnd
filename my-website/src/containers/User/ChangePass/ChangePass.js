import { useState } from "react";
import "./ChangePass.scss";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { ChangePassword } from "../../../services/UserServices";
import { RenewToken, getCookie } from "../../../services/Common";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { handleLogoutRedux } from "../../../redux/actions/userAction";

const ChangePass = () => {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const passRegex = /^(?=.{6,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/;
  const account = useSelector((state) => state.user.account);
  const history = useHistory();
  const dispatch = useDispatch();
  const ChangePassWord = async (pass, newPass, confirmNewPass) => {
    if (
      passRegex.test(pass) &&
      passRegex.test(confirmNewPass) &&
      passRegex.test(newPass)
    ) {
      if (newPass === confirmNewPass) {
        if (account) {
          const config = {
            headers: { Authorization: `Bearer ${getCookie("Token")}` },
          };
          let res = await ChangePassword(config, account.id, pass, newPass);
          if (res.data) {
            if (res.data.success) {
              toast.success(res.data.message);
              setPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
            } else {
              toast.warning(res.data.message);
            }
          } else {
            if (+res === 401) {
              RenewToken().then((token) => {
                if (token) {
                  document.cookie = "Token=" + token + ";";
                  const config2 = {
                    headers: { Authorization: `Bearer ${token}` },
                  };
                  ChangePassword(config2, account.id, pass, newPass).then(
                    (res) => {
                      if (res.data) {
                        if (res.data.success) {
                          toast.success(res.data.message);
                          setPassword("");
                          setNewPassword("");
                          setConfirmNewPassword("");
                        } else {
                          toast.warning(res.data.message);
                        }
                      }
                    }
                  );
                } else {
                  toast.error("PLease login to continue");
                  dispatch(handleLogoutRedux());
                  history.push(`/login`);
                }
              });
            } else {
              toast.error("Error");
            }
          }
        } else {
          toast.error("Error");
        }
      } else {
        toast.warning("Confirm new password wrong !!!");
      }
    } else {
      toast.warning("Missing value or wrong format !!!");
    }
  };

  return (
    <>
      <div className="container-change-pass">
        <form>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="custom-input">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <span onClick={() => setShow(!show)}>
                <i className={show ? "far fa-eye-slash" : "far fa-eye"}></i>
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <div className="custom-input">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <span onClick={() => setShow(!show)}>
                <i className={show ? "far fa-eye-slash" : "far fa-eye"}></i>
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <div className="custom-input">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
              />
              <span onClick={() => setShow(!show)}>
                <i className={show ? "far fa-eye-slash" : "far fa-eye"}></i>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              ChangePassWord(password, newPassword, confirmNewPassword)
            }
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePass;
