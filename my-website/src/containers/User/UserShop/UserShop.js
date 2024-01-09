import { useSelector } from "react-redux";
import "./UserShop.scss";
import { Alert } from "react-bootstrap";
import { GetShopByUserId } from "../../../services/ShopServices";
import { toast } from "react-toastify";
import ModalAddShop from "./Modal/ModalAddShop";
import { useState } from "react";
import { useEffect } from "react";
import TableProduct from "./TableContent/TableProduct";
import TableCoupon from "./TableContent/TableCoupon";
import TableOrder from "./TableContent/TableOrder";
import ModalDelete from "./Modal/ModalDelete";
import ModalAddProduct from "./Modal/ModalAdd/ModalAddProduct";
import ModalAddCoupon from "./Modal/ModalAdd/ModalAddCoupon";
import { CountProductOfUser } from "../../../services/ProductServices";
import { CountCouponOfUser } from "../../../services/CouponServices";

const UserShop = () => {
  const account = useSelector((state) => state.user.account);
  const [isShow, setIsShow] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [isShowAddProduct, setIsShowAddProduct] = useState(false);
  const [isShowAddCoupon, setIsShowAddCoupon] = useState(false);
  const [dataDelete, setDataDelete] = useState({});
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [contentTable, SetContentTable] = useState();
  const [typeDelete, setTypeDelete] = useState("");
  const [update, setUpdate] = useState(false);
  const [countProduct, setCountProduct] = useState(0);
  const [countCoupon, setCountCoupon] = useState(0);

  const handleClose = () => {
    setIsShow(false);
    setIsShowDelete(false);
    setIsShowAddProduct(false);
    setIsShowAddCoupon(false);
  };

  const handleShowDeleteShop = () => {
    setTypeDelete("shop");
    setDataDelete({ name });
    setIsShowDelete(true);
  };

  const UpdateAfterAdd = (type) => {
    setUpdate(!update);
    switch (type) {
      case "product":
        SetContentTable(
          <TableProduct update={update} UpdateAfterDelete={UpdateAfterDelete} />
        );
        break;
      case "coupon":
        SetContentTable(
          <TableCoupon update={update} UpdateAfterDelete={UpdateAfterDelete} />
        );
        break;
      default:
        break;
    }
  };

  const UpdateAfterDelete = () => {
    CountProductOfUser(account.id).then((res) => {
      if (res.data) {
        if (res.data.success) {
          setCountProduct(res.data.data);
        }
      } else {
        toast.error("Error");
      }
    });
    CountCouponOfUser(account.id).then((res) => {
      if (res.data) {
        if (res.data.success) {
          setCountCoupon(res.data.data);
        }
      } else {
        toast.error("Error");
      }
    });
  };

  useEffect(() => {
    GetShopByUserId(account.id).then((res) => {
      if (res.data) {
        if (res.data.success) {
          setName(res.data.data.name);
          setAddress(res.data.data.address);
          setAvatar(res.data.data.avatar);
        } else {
          setName("");
          setAddress("");
          setAvatar("");
        }
      } else {
        toast.error("Error");
      }
    });
  }, [avatar, isShow, isShowDelete]);

  useEffect(() => {
    CountProductOfUser(account.id).then((res) => {
      if (res.data) {
        if (res.data.success) {
          setCountProduct(res.data.data);
        }
      } else {
        toast.error("Error");
      }
    });
  }, [isShowAddProduct]);

  useEffect(() => {
    CountCouponOfUser(account.id).then((res) => {
      if (res.data) {
        if (res.data.success) {
          setCountCoupon(res.data.data);
        }
      } else {
        toast.error("Error");
      }
    });
  }, [isShowAddCoupon]);

  if (name && avatar) {
    return (
      <>
        <div className="container-user-shop">
          <div className="header-shop-avt">
            <div className="col-3">
              <img src={"data:image/*;base64," + avatar} alt="img" />
              <label>{name}</label>
            </div>
            <button
              className="btn btn-outline-success  "
              onClick={() => setIsShowAddProduct(true)}
            >
              Add Product
            </button>
            <button
              className="btn btn-outline-success "
              onClick={() => setIsShowAddCoupon(true)}
            >
              Add Coupon
            </button>
            <button
              className="btn btn-outline-secondary "
              onClick={() => setIsShow(true)}
            >
              Change Info
            </button>
            <button
              className="btn btn-outline-danger "
              onClick={() => handleShowDeleteShop()}
            >
              Delete Shop
            </button>
          </div>
          <div className="header-shop my-3">
            <div
              className="col-4 total-count-product"
              onClick={() =>
                SetContentTable(
                  <TableProduct UpdateAfterDelete={UpdateAfterDelete} />
                )
              }
            >
              {countProduct} PRODUCT
            </div>
            <div
              className="col-4 total-count-coupon"
              onClick={() =>
                SetContentTable(
                  <TableCoupon UpdateAfterDelete={UpdateAfterDelete} />
                )
              }
            >
              {countCoupon} COUPON
            </div>
            <div
              className="col-4 total-count-order"
              onClick={() => SetContentTable(<TableOrder />)}
            >
              ORDER
            </div>
          </div>
          <div className="col-12">{contentTable}</div>
        </div>
        <ModalAddShop
          isShowModal={isShow}
          handleClose={handleClose}
          type={name && avatar ? "change" : "create"}
          name={name && avatar ? name : ""}
          address={name && avatar ? address : ""}
          avatar={name && avatar ? avatar : ""}
        />
        <ModalDelete
          isShowModal={isShowDelete}
          handleClose={handleClose}
          type={typeDelete}
          data={dataDelete}
        />
        <ModalAddProduct
          isShowModal={isShowAddProduct}
          handleClose={handleClose}
          type={"create"}
          UpdateAfterAdd={UpdateAfterAdd}
        />
        <ModalAddCoupon
          isShowModal={isShowAddCoupon}
          handleClose={handleClose}
          type={"create"}
          UpdateAfterAdd={UpdateAfterAdd}
        />
      </>
    );
  } else {
    return (
      <>
        <div className="container-user-shop-alert">
          <Alert variant="warning" className="mt-3">
            <Alert.Heading>Oh snap! You don't have Shop yet !</Alert.Heading>
            <p>Click the button below to create one.</p>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setIsShow(true)}
            >
              Create
            </button>
          </Alert>
        </div>
        <ModalAddShop
          isShowModal={isShow}
          handleClose={handleClose}
          type={name && avatar ? "change" : "create"}
          name={name && avatar ? name : ""}
          avatar={name && avatar ? avatar : ""}
        />
      </>
    );
  }
};

export default UserShop;
