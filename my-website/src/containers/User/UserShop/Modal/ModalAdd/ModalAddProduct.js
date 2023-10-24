import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  GetLocation,
  RenewToken,
  getCookie,
} from "../../../../../services/Common";
import {
  ChangeProduct,
  CreateProduct,
  GetAllTypeProduct,
} from "../../../../../services/ProductServices";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "./ModalAddProduct.scss";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../../../../../redux/actions/userAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const ModalAddProduct = (props) => {
  const nameRegex = /^[a-zA-z0-9 ]+$/;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [information, setInformation] = useState("");
  const [listCity, setListCity] = useState([]);
  const [listType, setListType] = useState([]);
  const [city, setCity] = useState("Thành phố Hà Nội");
  const [type, setType] = useState("Clothes");
  const [img1, setImg1] = useState();
  const [img2, setImg2] = useState();
  const [img3, setImg3] = useState();
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const history = useHistory();

  const GetCity = async () => {
    let res = await GetLocation();
    setListCity(res.data);
  };

  const GetAllType = async () => {
    let res = await GetAllTypeProduct();
    setListType(res.data.data);
  };

  const handleChooseImg = (index) => {
    let base64String = "";
    let file = document.querySelector(`input[id=test${+index}]`)["files"][0];
    if (file) {
      if (file.size / 1024 ** 2 >= 2) {
        toast.warning("Please choose a file smaller than 2 MB");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        switch (index) {
          case "1":
            setImg1(base64String);
            break;
          case "2":
            setImg2(base64String);
            break;
          case "3":
            setImg3(base64String);
            break;
          default:
            toast.error("Error");
            break;
        }
      };
    } else {
      switch (+index) {
        case 1:
          setImg1("");
          break;
        case 2:
          setImg2("");
          break;
        case 3:
          setImg3("");
          break;
        default:
          toast.error("Error");
          break;
      }
    }
  };

  const handleAddProduct = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    const { v4: uuidv4 } = require("uuid");
    const random_uuid = uuidv4();
    if (
      nameRegex.test(name) &&
      parseInt(price) < 1000000000 &&
      parseInt(quantity) < 1000000 &&
      city &&
      type
    ) {
      let img = [];
      if (img1 /*&& img1 !== ","*/) {
        img.push(img1);
      }
      if (img2 /*&& img1 !== ","*/) {
        img.push(img2);
      }
      if (img3 /*&& img1 !== ","*/) {
        img.push(img3);
      }
      let res = await CreateProduct(
        config,
        random_uuid,
        name,
        price,
        quantity,
        information,
        city,
        type,
        img,
        account.id
      );
      if (res.data) {
        if (res.data.success) {
          toast.success(res.data.message);
          props.UpdateAfterAdd("product");
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
              CreateProduct(
                config2,
                random_uuid,
                name,
                price,
                quantity,
                information,
                city,
                type,
                img,
                account.id
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    toast.success(res.data.message);
                    props.UpdateAfterAdd("product");
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

  const handleChangeProduct = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    if (
      nameRegex.test(name) &&
      parseInt(price) < 1000000000 &&
      parseInt(quantity) < 1000000 &&
      city &&
      type
    ) {
      let img = [];
      if (img1 /*&& img1 !== ","*/) {
        img.push(img1);
      }
      if (img2 /*&& img1 !== ","*/) {
        img.push(img2);
      }
      if (img3 /*&& img1 !== ","*/) {
        img.push(img3);
      }
      let res = await ChangeProduct(
        config,
        props.data.id,
        name,
        price,
        quantity,
        information,
        city,
        type,
        img
      );
      if (res.data) {
        if (res.data.success) {
          toast.success(res.data.message);
          props.GetPageAfterChange();
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
              ChangeProduct(
                config2,
                props.data.id,
                name,
                price,
                quantity,
                information,
                city,
                type,
                img
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    toast.success(res.data.message);
                    props.GetPageAfterChange();
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

  useEffect(() => {
    GetCity();
    GetAllType();
  }, []);

  useEffect(() => {
    if (props.type === "change") {
      setName(props.data.name);
      setPrice(props.data.price);
      setQuantity(props.data.quantity);
      setInformation(props.data.information);
      setCity(props.data.address);
      setType(props.data.type);
      setImg1(props.img1);
      setImg2(props.img2);
      setImg3(props.img3);
    } else {
      setName("");
      setPrice("");
      setQuantity("");
      setInformation("");
      setImg1("");
      setImg2("");
      setImg3("");
    }
  }, [props]);

  return (
    <div>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.type} product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
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
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Information</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={information}
                  onChange={(event) => setInformation(event.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">City</label>
                <select
                  className="form-select mb-3"
                  aria-label=".form-select-sm example"
                  onChange={(event) => setCity(event.target.value)}
                  value={city}
                >
                  {listCity.map((item) => {
                    return <option key={item.Id}>{item.Name}</option>;
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select mb-3"
                  aria-label=".form-select-sm example"
                  onChange={(event) => setType(event.target.value)}
                  value={type}
                >
                  {listType.map((item, index) => {
                    return <option key={`product-${index}`}>{item}</option>;
                  })}
                </select>
              </div>
              <div className="mb-3 group-img">
                <div className="content-img">
                  <label htmlFor="test1" className="btn btn-secondary">
                    Choose image 1
                  </label>
                  <input
                    type="file"
                    id="test1"
                    hidden
                    onChange={() => handleChooseImg("1")}
                    accept="image/*"
                  />
                  {img1 /*&& img1 !== ","*/ ? (
                    <img src={"data:image/*;base64," + img1} alt="img" />
                  ) : (
                    <img src="" alt="img" hidden />
                  )}
                </div>
                <div className="content-img">
                  <label htmlFor="test2" className="btn btn-secondary">
                    Choose image 2
                  </label>
                  <input
                    type="file"
                    id="test2"
                    hidden
                    onChange={() => handleChooseImg("2")}
                    accept="image/*"
                  />
                  {img2 /*&& img1 !== ","*/ ? (
                    <img src={"data:image/*;base64," + img2} alt="img" />
                  ) : (
                    <img src="" alt="img" hidden />
                  )}
                </div>
                <div className="content-img">
                  <label htmlFor="test3" className="btn btn-secondary">
                    Choose image 3
                  </label>
                  <input
                    type="file"
                    id="test3"
                    hidden
                    onChange={() => handleChooseImg("3")}
                    accept="image/*"
                  />
                  {img3 /*&& img1 !== ","*/ ? (
                    <img src={"data:image/*;base64," + img3} alt="img" />
                  ) : (
                    <img src="" alt="img" hidden />
                  )}
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={
              props.type === "create"
                ? () => handleAddProduct()
                : () => handleChangeProduct()
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalAddProduct;
