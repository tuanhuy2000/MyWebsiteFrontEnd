import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  GetCouponByProductType,
  GetShopCouponByProductType,
} from "../../../../services/CouponServices";
import { RenewToken, getCookie } from "../../../../services/Common";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { handleLogoutRedux } from "../../../../redux/actions/userAction";
import avt_shipping from "../../../../assets/images/freeship.png";
import avt_discount from "../../../../assets/images/discount.png";
import "./ModalSelectVoucher.scss";

const ModalSelectShopVoucher = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [listVoucher, setListVoucher] = useState([]);

  const GetListVouchers = async () => {
    let arr = props.data.product;
    let tmp = [];
    const asyncRes = await Promise.all(
      arr.map(async (item) => {
        const config = {
          headers: { Authorization: `Bearer ${getCookie("Token")}` },
        };
        let res = await GetShopCouponByProductType(
          config,
          props.data.id,
          item.type,
          item.cost
        );
        if (res.data) {
          if (res.data.success) {
            tmp = tmp.concat(res.data.data);
          } else {
            toast.warning(res.data.message);
          }
        } else {
          if (+res === 401) {
            RenewToken().then((nToken) => {
              if (nToken) {
                document.cookie = "Token=" + nToken + ";";
                const config2 = {
                  headers: { Authorization: `Bearer ${nToken}` },
                };
                GetShopCouponByProductType(
                  config2,
                  props.data.id,
                  item.type,
                  item.cost
                ).then((res) => {
                  if (res.data) {
                    if (res.data.success) {
                      tmp = tmp.concat(res.data.data);
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
        return tmp;
      })
    );
    tmp = asyncRes[asyncRes.length - 1];
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await GetShopCouponByProductType(
      config,
      props.data.id,
      "All",
      props.data.cost
    );
    if (res.data) {
      if (res.data.success) {
        tmp = tmp.concat(res.data.data);
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
            GetShopCouponByProductType(
              config2,
              props.data.id,
              "All",
              props.data.cost
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  tmp = tmp.concat(res.data.data);
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
    setListVoucher(tmp);
  };

  const GetListAdminVouchers = async (cType) => {
    let arr = props.listType;
    let tmp = [];
    const asyncRes = await Promise.all(
      arr.map(async (item) => {
        const config = {
          headers: { Authorization: `Bearer ${getCookie("Token")}` },
        };
        let res = await GetCouponByProductType(
          config,
          item.type,
          cType,
          item.total
        );
        if (res.data) {
          if (res.data.success) {
            tmp = tmp.concat(res.data.data);
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
                GetCouponByProductType(
                  config2,
                  item.type,
                  cType,
                  item.total
                ).then((res) => {
                  if (res.data) {
                    if (res.data.success) {
                      tmp = tmp.concat(res.data.data);
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
        return tmp;
      })
    );
    tmp = asyncRes[asyncRes.length - 1];
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await GetCouponByProductType(config, "All", cType, props.cost);
    if (res.data) {
      if (res.data.success) {
        tmp = tmp.concat(res.data.data);
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
            GetCouponByProductType(config2, "All", cType, props.cost).then(
              (res) => {
                if (res.data) {
                  if (res.data.success) {
                    tmp = tmp.concat(res.data.data);
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
      }
    }
    setListVoucher(tmp);
  };

  const handleSelectVoucher = (item) => {
    props.handleClose();
    props.selectVoucher(item);
  };

  useEffect(() => {
    RenewToken().then((nToken) => {
      if (nToken) {
        document.cookie = "Token=" + nToken + ";";
        if (props.data) {
          GetListVouchers();
        } else if (props.type === "Discount") {
          GetListAdminVouchers("Discount");
        } else if (props.type === "FreeShipping") {
          GetListAdminVouchers("FreeShipping");
        }
      } else {
        toast.error("PLease login to continue");
        dispatch(handleLogoutRedux());
        history.push(`/login`);
      }
    });
  }, []);

  return (
    <>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.data ? props.data.name : props.type} Voucher
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {listVoucher &&
              listVoucher.map((item, index) => {
                return (
                  <div
                    key={`voucher-${index}`}
                    className="col-12 d-flex vc-container"
                    onClick={() => handleSelectVoucher(item)}
                  >
                    <div className="img-container d-flex">
                      <img
                        src={
                          props.data
                            ? "data:image/*;base64," + props.data.avatar
                            : props.type === "FreeShipping"
                            ? avt_shipping
                            : avt_discount
                        }
                        alt="img"
                      />
                    </div>
                    <div className="infor-container d-flex">
                      <p className="worth">
                        {item.worth.includes("%")
                          ? item.worth + " off"
                          : new Intl.NumberFormat("de-DE").format(item.worth) +
                            "đ off"}
                      </p>
                      <p className="minimum">
                        Minimum order{" "}
                        {new Intl.NumberFormat("de-DE").format(item.minimum)}đ
                      </p>
                      <p className="minimum">
                        Maximum{" "}
                        {new Intl.NumberFormat("de-DE").format(item.maximum)}đ
                      </p>
                      <p className="type">For {item.productType} product</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalSelectShopVoucher;
