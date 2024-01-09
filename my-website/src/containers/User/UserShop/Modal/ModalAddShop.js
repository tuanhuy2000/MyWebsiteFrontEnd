import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import default_avatar from "../../../../assets/images/default-avatar.jpg";
import { toast } from "react-toastify";
import "./ModalAddShop.scss";
import {
  GetLocation,
  RenewToken,
  getCookie,
} from "../../../../services/Common";
import { ChangeShop, CreateShop } from "../../../../services/ShopServices";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../../../../redux/actions/userAction";
import { useEffect } from "react";

const ModalAddShop = (props) => {
  const account = useSelector((state) => state.user.account);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("Thành phố Hà Nội");
  const [img, setImg] = useState();
  const history = useHistory();
  const nameRegex = /^[a-zA-z0-9 ]+$/;
  const dispatch = useDispatch();
  const [listCity, setListCity] = useState([]);

  const ConvertAvatarDefault = () => {
    var canvas = document.createElement("canvas");
    var img1 = document.createElement("img");
    img1.setAttribute("src", default_avatar);
    canvas.width = img1.width;
    canvas.height = img1.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img1, 0, 0);
    var dataURL = canvas.toDataURL("image/*");
    return dataURL.replace("data:", "").replace(/^.+,/, "");
  };

  const handleChooseImg = () => {
    let base64String = "";
    let file = document.querySelector("input[type=file]")["files"][0];
    if (file) {
      if (file.size / 1024 ** 2 >= 2) {
        toast.warning("Please choose a file smaller than 2 MB");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        setImg(base64String);
      };
    } else {
      setImg(ConvertAvatarDefault());
    }
  };

  const handleAddShop = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    const { v4: uuidv4 } = require("uuid");
    const random_uuid = uuidv4();
    let avatar;
    if (img === ",") {
      avatar = ConvertAvatarDefault();
    } else {
      avatar = img;
    }
    if (nameRegex.test(name)) {
      let res = await CreateShop(
        config,
        random_uuid,
        name,
        address,
        avatar,
        account.id
      );
      if (res.data) {
        if (res.data.success) {
          toast.success(res.data.message);
          props.handleClose();
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
              CreateShop(
                config2,
                random_uuid,
                name,
                address,
                avatar,
                account.id
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    toast.success(res.data.message);
                    props.handleClose();
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

  const handleChangeShop = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    if (nameRegex.test(name)) {
      let res = await ChangeShop(config, name, address, img, account.id);
      if (res.data) {
        if (res.data.success) {
          toast.success(res.data.message);
          props.handleClose();
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
              ChangeShop(config2, name, address, img, account.id).then(
                (res) => {
                  if (res.data) {
                    if (res.data.success) {
                      toast.success(res.data.message);
                      props.handleClose();
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
      toast.warning("Missing value or wrong format");
    }
  };

  useEffect(() => {
    if (props.type === "change" && props.name && props.avatar) {
      setImg(props.avatar);
      setName(props.name);
      setAddress(props.address);
    } else {
      setName("");
      setImg(ConvertAvatarDefault());
    }
  }, [props]);

  useEffect(() => {
    let isMounted = true;
    GetLocation().then((res) => {
      if (isMounted) setListCity(res.data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.type} a shop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-container">
            <div className="avt-container">
              {img !== "," ? (
                <img src={"data:image/*;base64," + img} alt="img" />
              ) : (
                <img src={default_avatar} alt="img" />
              )}

              <label htmlFor="test" className="btn btn-secondary">
                Choose image
              </label>
              <input
                type="file"
                id="test"
                hidden
                onChange={() => handleChooseImg()}
                accept="image/*"
              />
            </div>
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
            </form>
            <div className="mb-3">
              <label className="form-label">City</label>
              <select
                className="form-select mb-3"
                aria-label=".form-select-sm example"
                onChange={(event) => setAddress(event.target.value)}
                value={address}
              >
                {listCity.map((item) => {
                  return <option key={item.Id}>{item.Name}</option>;
                })}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={
              props.type === "create"
                ? () => handleAddShop()
                : () => handleChangeShop()
            }
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAddShop;
