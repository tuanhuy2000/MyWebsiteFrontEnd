import { useDispatch, useSelector } from "react-redux";
import "./ChangeInfor.scss";
import { useState } from "react";
import { toast } from "react-toastify";
import { handleChangeInforRedux } from "../../../redux/actions/userAction";

const ChangeInfor = () => {
  const account = useSelector((state) => state.user.account);
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  const nameRegex = /^[a-zA-z]+$/;
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})+$/;
  const [name, setName] = useState(account.name);
  const [phoneNumber, setPhoneNumber] = useState(account.phoneNumber);
  const [email, setEmail] = useState(account.email);
  const dispatch = useDispatch();

  const handleChangeInfor = (name, phoneNumber, email) => {
    if (
      nameRegex.test(name) &&
      phoneRegex.test(phoneNumber) &&
      emailRegex.test(email)
    ) {
      dispatch(handleChangeInforRedux(account.id, name, phoneNumber, email));
    } else {
      toast.warning("Missing value or wrong format !!!");
    }
  };

  return (
    <>
      <div className="container-change-infor">
        <form>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleChangeInfor(name, phoneNumber, email)}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangeInfor;
