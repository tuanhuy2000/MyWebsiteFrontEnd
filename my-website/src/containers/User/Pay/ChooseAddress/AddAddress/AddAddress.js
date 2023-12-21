import { useLocation, useHistory } from "react-router-dom";
import Header from "../../Header/Header";
import "./AddAddress.scss";
import { useEffect, useState } from "react";
import {
  GetLocation,
  RenewToken,
  getCookie,
} from "../../../../../services/Common";
import {
  ChangeAddress,
  addAddress,
} from "../../../../../services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleLogoutRedux } from "../../../../../redux/actions/userAction";

const AddAddress = () => {
  const account = useSelector((state) => state.user.account);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const title = location.state.title;
  const data = location.state.data;
  const [listCity, setListCity] = useState([]);
  const [city, setCity] = useState("");
  const [listDistrict, setListDistrict] = useState([]);
  const [district, setDistrict] = useState("");
  const [listWard, setListWard] = useState([]);
  const [ward, setWard] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [addressType, setAddressType] = useState("");
  const nameRegex = /^[a-zA-z]+$/;
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})+$/;

  const HandleChangeCity = (val) => {
    setCity(val);
    setListDistrict(GetDistricts(val));
    setDistrict("");
    setListWard([]);
    setWard("");
  };

  const HandleChangeDistrict = (val) => {
    setDistrict(val);
    setListWard(GetWards(val));
    setWard("");
  };

  const GetDistricts = (city) => {
    let index = -1;
    listCity.map((item) => {
      if (item.Name === city) {
        index = listCity.indexOf(item);
      }
    });
    return listCity[index].Districts;
  };

  const GetWards = (district) => {
    let index = -1;
    listDistrict.map((item) => {
      if (item.Name === district) {
        index = listDistrict.indexOf(item);
      }
    });
    return listDistrict[index].Wards;
  };

  const handleAddAddress = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    const { v4: uuidv4 } = require("uuid");
    const random_uuid = uuidv4();
    if (
      nameRegex.test(name) &&
      phoneRegex.test(phoneNumber) &&
      city &&
      district &&
      ward &&
      detailedAddress &&
      addressType
    ) {
      let fullAddress =
        city + ", " + district + ", " + ward + ", " + detailedAddress;
      let res = await addAddress(
        config,
        account.id,
        random_uuid,
        name,
        phoneNumber,
        fullAddress,
        addressType
      );
      if (res.data) {
        if (res.data.success) {
          history.goBack();
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
              addAddress(
                config2,
                account.id,
                random_uuid,
                name,
                phoneNumber,
                fullAddress,
                addressType
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    history.goBack();
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
        } else {
          toast.error("Error");
        }
      }
    } else {
      toast.warning("Missing value or wrong format");
    }
  };

  const handleChangeAddress = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    if (
      nameRegex.test(name) &&
      phoneRegex.test(phoneNumber) &&
      city &&
      district &&
      ward &&
      detailedAddress &&
      addressType
    ) {
      let fullAddress =
        city + ", " + district + ", " + ward + ", " + detailedAddress;
      let res = await ChangeAddress(
        config,
        data.id,
        name,
        phoneNumber,
        fullAddress,
        addressType
      );
      if (res.data) {
        if (res.data.success) {
          history.goBack();
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
              addAddress(
                config2,
                data.id,
                name,
                phoneNumber,
                fullAddress,
                addressType
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    history.goBack();
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
        } else {
          toast.error("Error");
        }
      }
    } else {
      toast.warning("Missing value or wrong format");
    }
  };

  useEffect(() => {
    let isMounted = true;
    GetLocation().then((res) => {
      if (isMounted) {
        res.data.map((item) => {
          item.Districts.map((item) => {
            item.Wards.push({ Name: "" });
          });
          item.Districts.push({ Name: "" });
        });
        res.data.push({ Name: "" });
        setListCity(res.data);
        if (data) {
          setName(data.name);
          setPhoneNumber(data.phone);
          let tmp = data.fullAddress.split(",", 1).join(",").length;
          setCity(data.fullAddress.slice(0, tmp));
          let index = -1;
          res.data.map((item) => {
            if (item.Name === data.fullAddress.slice(0, tmp)) {
              index = res.data.indexOf(item);
            }
          });
          setListDistrict(res.data[index].Districts);
          let tmp1 = data.fullAddress.split(",", 2).join(",").length;
          setDistrict(data.fullAddress.slice(tmp + 2, tmp1));
          let index2 = -1;
          res.data[index].Districts.map((item) => {
            if (item.Name === data.fullAddress.slice(tmp + 2, tmp1)) {
              index2 = res.data[index].Districts.indexOf(item);
            }
          });
          setListWard(res.data[index].Districts[index2].Wards);
          tmp = data.fullAddress.split(",", 3).join(",").length;
          setWard(data.fullAddress.slice(tmp1 + 2, tmp));
          setDetailedAddress(
            data.fullAddress.slice(tmp + 2, data.fullAddress.length)
          );
          setAddressType(data.type);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Header data={`${title} Address`} />
      <div className="add-container">
        <div className="col-12 col-sm-6 mb-3">
          <p className="mb-1">Contact</p>
          <input
            type="text"
            className="form-control mb-1"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </div>
        <div className="col-12 col-sm-6 mb-3">
          <p className="mb-1">City</p>
          <select
            className="form-select mb-1"
            onChange={(event) => HandleChangeCity(event.target.value)}
            value={city}
          >
            {listCity.map((item, index) => {
              return <option key={`city-${index}`}>{item.Name}</option>;
            })}
          </select>

          {city && (
            <>
              <p className="mb-1">District</p>
              <select
                className="form-select mb-1"
                onChange={(event) => HandleChangeDistrict(event.target.value)}
                value={district}
              >
                {listDistrict.map((item, index) => {
                  return <option key={`district-${index}`}>{item.Name}</option>;
                })}
              </select>
            </>
          )}
          {district && (
            <>
              <p className="mb-1">Ward</p>
              <select
                className="form-select mb-3"
                onChange={(event) => setWard(event.target.value)}
                value={ward}
              >
                {listWard.map((item, index) => {
                  return <option key={`ward-${index}`}>{item.Name}</option>;
                })}
              </select>
            </>
          )}
          {ward && (
            <input
              type="text"
              className="form-control"
              placeholder="Street name, building, house number"
              value={detailedAddress}
              onChange={(event) => setDetailedAddress(event.target.value)}
            />
          )}
        </div>
        <div className="col-12 col-sm-6 mb-5">
          <p className="mb-1">Setting</p>
          <div className="d-flex form-control select">
            <p>Address type: </p>
            <div>
              <input
                type="radio"
                value="Office"
                onChange={(event) =>
                  event.target.checked
                    ? setAddressType(event.target.value)
                    : setAddressType("")
                }
                name="check"
                checked={addressType === "Office" ? true : false}
              />
              <label>Office</label>
            </div>
            <div>
              <input
                type="radio"
                value="Home"
                onChange={(event) =>
                  event.target.checked
                    ? setAddressType(event.target.value)
                    : setAddressType("")
                }
                name="check"
                checked={addressType === "Home" ? true : false}
              />
              <label>Home</label>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <button
            className={
              name &&
              phoneNumber &&
              city &&
              district &&
              ward &&
              detailedAddress &&
              addressType
                ? "enable"
                : "disable"
            }
            disabled={
              name &&
              phoneNumber &&
              city &&
              district &&
              ward &&
              detailedAddress &&
              addressType
                ? false
                : true
            }
            onClick={
              data ? () => handleChangeAddress() : () => handleAddAddress()
            }
          >
            FINISH
          </button>
        </div>
      </div>
    </>
  );
};

export default AddAddress;
