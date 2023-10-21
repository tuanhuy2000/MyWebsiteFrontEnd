import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useEffect } from "react";
import {
  ChangeCoupon,
  CreateAdminCoupon,
  CreateShopCoupon,
  GetAllTypeCoupon,
} from "../../../../../services/CouponServices";
import { GetAllTypeProduct } from "../../../../../services/ProductServices";
import {
  ConvertDateInput,
  RenewToken,
  getCookie,
} from "../../../../../services/Common";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleLogoutRedux } from "../../../../../redux/actions/userAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const ModalAddCoupon = (props) => {
  const codeRegex = /^[a-zA-z0-9]+$/;
  const worthRegex = /^[0-9%]+$/;
  const describeRegex = /^[a-zA-z0-9 ]+$/;
  const [code, setCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [worth, setWorth] = useState("");
  const [describe, setDescribe] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [listType, setListType] = useState([]);
  const [listTypeProduct, setListTypeProduct] = useState([]);
  const [type, setType] = useState("Discount");
  const [typeProduct, setTypeProduct] = useState("All");
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const history = useHistory();

  const GetAllType = async () => {
    let res = await GetAllTypeCoupon();
    setListType(res.data.data);
  };

  const getAllTypeProduct = async () => {
    let res = await GetAllTypeProduct();
    var list = res.data.data;
    list.push("All");
    setListTypeProduct(list);
  };

  const handleAddCoupon = async () => {
    const { v4: uuidv4 } = require("uuid");
    const random_uuid = uuidv4();
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    if (
      codeRegex.test(code) &&
      worthRegex.test(worth) &&
      describeRegex.test(describe) &&
      from &&
      to
    ) {
      let res = await CreateShopCoupon(
        config,
        random_uuid,
        code,
        quantity,
        worth,
        describe,
        from,
        to,
        type,
        typeProduct,
        account.id
      );
      if (res.data) {
        if (res.data.success) {
          toast.success(res.data.message);
          props.UpdateAfterAdd("coupon");
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
              CreateShopCoupon(
                config2,
                random_uuid,
                code,
                quantity,
                worth,
                describe,
                from,
                to,
                type,
                typeProduct,
                account.id
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    toast.success(res.data.message);
                    props.UpdateAfterAdd("coupon");
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

  const handleChangeCoupon = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    if (
      codeRegex.test(code) &&
      worthRegex.test(worth) &&
      describeRegex.test(describe) &&
      from &&
      to
    ) {
      let res = await ChangeCoupon(
        config,
        props.data.id,
        code,
        quantity,
        worth,
        describe,
        from,
        to,
        type,
        typeProduct
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
              ChangeCoupon(
                config2,
                props.data.id,
                code,
                quantity,
                worth,
                describe,
                from,
                to,
                type,
                typeProduct
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

  const handleAddAdminCoupon = async () => {
    const { v4: uuidv4 } = require("uuid");
    const random_uuid = uuidv4();
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    if (
      codeRegex.test(code) &&
      worthRegex.test(worth) &&
      describeRegex.test(describe) &&
      from &&
      to
    ) {
      let res = await CreateAdminCoupon(
        config,
        random_uuid,
        code,
        quantity,
        worth,
        describe,
        from,
        to,
        type,
        typeProduct
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
              CreateAdminCoupon(
                config2,
                random_uuid,
                code,
                quantity,
                worth,
                describe,
                from,
                to,
                type,
                typeProduct
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

  const handleAction = () => {
    switch (props.type) {
      case "create":
        handleAddCoupon();
        break;
      case "change":
        handleChangeCoupon();
        break;
      case "create admin":
        handleAddAdminCoupon();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    GetAllType();
    getAllTypeProduct();
  }, []);

  useEffect(() => {
    if (props.type === "change") {
      setCode(props.data.code);
      setQuantity(props.data.quantity);
      setWorth(props.data.worth);
      setDescribe(props.data.describe);
      setFrom(ConvertDateInput(props.data.from));
      setTo(ConvertDateInput(props.data.to));
      setType(props.data.type);
      setTypeProduct(props.data.productType);
    } else {
      setCode("");
      setQuantity("");
      setWorth("");
      setDescribe("");
      setFrom("");
      setTo("");
    }
  }, [props]);

  return (
    <div>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.type} coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <form>
              <div className="mb-3">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
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
                <label className="form-label">Worth</label>
                <input
                  type="text"
                  className="form-control"
                  value={worth}
                  onChange={(event) => setWorth(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Describe</label>
                <input
                  type="text"
                  className="form-control"
                  value={describe}
                  onChange={(event) => setDescribe(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">From</label>
                <input
                  type="date"
                  className="form-control"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">To</label>
                <input
                  type="date"
                  className="form-control"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                />
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
                    return <option key={`type-${index}`}>{item}</option>;
                  })}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Type Product</label>
                <select
                  className="form-select mb-3"
                  aria-label=".form-select-sm example"
                  onChange={(event) => setTypeProduct(event.target.value)}
                  value={typeProduct}
                >
                  {listTypeProduct.map((item, index) => {
                    return (
                      <option key={`type-product-${index}`}>{item}</option>
                    );
                  })}
                </select>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleAction()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalAddCoupon;
