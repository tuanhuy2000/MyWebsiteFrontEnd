import { useHistory } from "react-router-dom";
import Header from "../Header/Header";
import "./ChooseAddress.scss";
import { useEffect, useState } from "react";
import {
  DeleteAddress,
  getAllAddress,
} from "../../../../services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleLogoutRedux } from "../../../../redux/actions/userAction";
import { RenewToken, getCookie } from "../../../../services/Common";

const ChooseAddress = () => {
  const history = useHistory();
  const account = useSelector((state) => state.user.account);
  const [listAdd, setListAdd] = useState([]);
  const dispatch = useDispatch();

  const GetAllAddress = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await getAllAddress(config, account.id);
    if (res.data) {
      if (res.data.success) {
        setListAdd(res.data.data);
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
            getAllAddress(config2, account.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setListAdd(res.data.data);
                } else {
                  toast.warning(res.data.message);
                }
              }
            });
          } else {
            toast.error("PLease login to continue");
            dispatch(handleLogoutRedux());
            history.push(`/login`);
          }
        });
      }
    }
  };

  const AnalysisAddress = (add) => {
    let tmp = add.split(",", 3).join(",").length;
    let fsub = add.slice(tmp + 2, add.length);
    let lsub = add.slice(0, tmp);
    return fsub + "\n" + lsub;
  };

  const handleDeleteAddress = async (item) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await DeleteAddress(config, item.id);
    if (res.data) {
      if (res.data.success) {
        GetAllAddress();
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
            DeleteAddress(config2, item.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  GetAllAddress();
                } else {
                  toast.warning(res.data.message);
                }
              }
            });
          } else {
            toast.error("PLease login to continue");
            dispatch(handleLogoutRedux());
            history.push(`/login`);
          }
        });
      }
    }
  };

  useEffect(() => {
    GetAllAddress();
  }, []);

  return (
    <>
      <Header data={"Choose Address"} />
      <div className="container-choose">
        <div className="col-12 col-sm-6 title">Address</div>
        {listAdd &&
          listAdd.length > 0 &&
          listAdd.map((item, index) => {
            return (
              <div
                className="col-12 col-sm-6 item-address"
                key={`address-${index}`}
              >
                <div
                  onClick={() =>
                    history.push({
                      pathname: `/pay`,
                      state: {
                        address: item,
                        data: history.location.state.data,
                      },
                    })
                  }
                >
                  <b>{item.name}</b> | {item.phone} <br></br>
                  {AnalysisAddress(item.fullAddress)}
                </div>
                <div className="gr-btn">
                  <button
                    onClick={() =>
                      history.push({
                        pathname: `/addAddress`,
                        state: { title: "Change", data: item },
                      })
                    }
                  >
                    Change
                  </button>
                  <button onClick={() => handleDeleteAddress(item)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        <div
          className="col-12 col-sm-6 add-address"
          onClick={() =>
            history.push({
              pathname: `/addAddress`,
              state: { title: "Add" },
            })
          }
        >
          <i className="fas fa-plus-circle"></i>
          <p>Add New Address</p>
        </div>
      </div>
    </>
  );
};

export default ChooseAddress;
