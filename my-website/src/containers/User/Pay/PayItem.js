import { useEffect, useState } from "react";
import ModalSelectVoucher from "./Modal/ModalSelectVoucher";
import ModalSelectShippingWay from "./Modal/ModalSelectShippingWay";
import {
  AddCouponToOrder,
  AddProductToOrder,
  CreateOrder,
  CreateTransport,
} from "../../../services/OrderServices";
import { RenewToken, getCookie } from "../../../services/Common";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { handleLogoutRedux } from "../../../redux/actions/userAction";

const PayItem = (props) => {
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isShow, setIsShow] = useState(false);
  const [isShowShip, setIsShowShip] = useState(false);
  const [shopVoucher, setShopVoucher] = useState();
  const [saleOff, setSaleOff] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipCost, setShipCost] = useState(25000);
  const [shipOff, setShipOff] = useState(0);
  const [shipWay, setShipWay] = useState("Fast");

  const handleClose = () => {
    setShopVoucher();
    setIsShow(false);
  };

  const handleCloseShip = () => {
    setIsShowShip(false);
  };

  const handleSelectShipWay = (shipWay) => {
    setShipWay(shipWay);
    setIsShowShip(false);
  };

  useEffect(() => {
    if (shopVoucher) {
      if (
        shopVoucher.worth.includes("%") &&
        shopVoucher.productType === "All"
      ) {
        let dis = shopVoucher.worth.slice(0, shopVoucher.worth.length - 1);
        let off = (props.item.cost * dis) / 100;
        off > shopVoucher.maximum
          ? props.changeDiscount(saleOff, +shopVoucher.maximum)
          : props.changeDiscount(saleOff, off);
        off > shopVoucher.maximum
          ? setSaleOff(shopVoucher.maximum)
          : setSaleOff(off);
        off > shopVoucher.maximum
          ? setTotal(props.item.cost - shopVoucher.maximum)
          : setTotal(props.item.cost - off);
      } else if (
        shopVoucher.worth.includes("%") &&
        shopVoucher.productType !== "All"
      ) {
        let dis = shopVoucher.worth.slice(0, shopVoucher.worth.length - 1);
        let tmp = props.item.product.find(
          (products) => products.type === shopVoucher.productType
        );
        let off = (tmp.cost * dis) / 100;
        off > shopVoucher.maximum
          ? props.changeDiscount(saleOff, +shopVoucher.maximum)
          : props.changeDiscount(saleOff, off);
        off > shopVoucher.maximum
          ? setSaleOff(shopVoucher.maximum)
          : setSaleOff(off);
        off > shopVoucher.maximum
          ? setTotal(props.item.cost - shopVoucher.maximum)
          : setTotal(props.item.cost - off);
      } else {
        props.changeDiscount(saleOff, +shopVoucher.worth);
        setSaleOff(shopVoucher.worth);
        setTotal(props.item.cost - shopVoucher.worth);
      }
    } else {
      props.changeDiscount(saleOff, 0);
      setSaleOff(0);
      setTotal(props.item.cost);
    }
  }, [shopVoucher]);

  useEffect(() => {
    if (props.shipVoucher) {
      if (
        props.shipVoucher.worth.includes("%") &&
        props.shipVoucher.productType === "All"
      ) {
        let dis = props.shipVoucher.worth.slice(
          0,
          props.shipVoucher.worth.length - 1
        );
        let off = (shipCost * dis) / 100;
        off > props.shipVoucher.maximum
          ? props.changeShipOff(shipOff, +props.shipVoucher.maximum)
          : props.changeShipOff(shipOff, off);
        off > props.shipVoucher.maximum
          ? setShipOff(props.shipVoucher.maximum)
          : setShipOff(off);
      } else if (
        props.shipVoucher.worth.includes("%") &&
        props.shipVoucher.productType !== "All"
      ) {
        let dis = props.shipVoucher.worth.slice(
          0,
          props.shipVoucher.worth.length - 1
        );
        let tmp = props.item.product.findIndex(
          (products) => products.type === props.shipVoucher.productType
        );
        if (tmp > 0) {
          let off = (shipCost * dis) / 100;
          off > props.shipVoucher.maximum
            ? props.changeShipOff(shipOff, +props.shipVoucher.maximum)
            : props.changeShipOff(shipOff, off);
          off > props.shipVoucher.maximum
            ? setShipOff(props.shipVoucher.maximum)
            : setShipOff(off);
        }
      } else {
        props.changeShipOff(shipOff, +props.shipVoucher.worth);
        setShipOff(props.shipVoucher.worth);
      }
    } else {
      props.changeShipOff(shipOff, 0);
      setShipOff(0);
    }
  }, [props.shipVoucher, shipCost]);

  const AddTransport = async (id) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    const { v4: uuidv4 } = require("uuid");
    const transport_code = uuidv4();
    let res = await CreateTransport(
      config,
      id,
      transport_code,
      shipWay === "Fast" ? "J&TExpress" : "Grab",
      shipWay
    );
    if (res.data) {
      if (res.data.success) {
        return true;
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
            CreateTransport(
              config2,
              id,
              transport_code,
              shipWay === "Fast" ? "J&TExpress" : "Grab",
              shipWay
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  return true;
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
        toast.error("Unknow Error");
      }
    }
    return false;
  };

  const AddOrder = async (oId, tId) => {
    if (props.address) {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await CreateOrder(
        config,
        oId,
        props.paymentType,
        total,
        (total * props.saleOff) / props.total,
        account.id,
        tId,
        props.address.id
      );
      if (res.data) {
        if (res.data.success) {
          return true;
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
              CreateOrder(
                config2,
                oId,
                props.paymentType,
                total,
                (total * props.saleOff) / props.total,
                account.id,
                tId,
                props.address.id
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    return true;
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
          toast.error("Unknow Error");
        }
      }
      return false;
    } else {
      toast.error("Unknow Address");
      return false;
    }
  };

  const AddSingleOrderCoupon = async (oId, cId) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await AddCouponToOrder(config, oId, cId);
    if (res.data) {
      if (res.data.success) {
        return true;
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
            AddCouponToOrder(config2, oId, cId).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  return true;
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
        toast.error("Unknow Error");
      }
    }
    return false;
  };

  const AddOrderProduct = (oId) => {
    props.item.product.map((item) => {
      item.data.map(async (item2) => {
        const config = {
          headers: { Authorization: `Bearer ${getCookie("Token")}` },
        };
        let res = await AddProductToOrder(
          config,
          oId,
          item2.id,
          item2.quantity
        );
        if (res.data) {
          if (res.data.success) {
          } else {
            toast.warning(res.data.message);
            return false;
          }
        } else {
          if (+res === 401) {
            RenewToken().then((nToken) => {
              if (nToken) {
                document.cookie = "Token=" + nToken + ";";
                const config2 = {
                  headers: { Authorization: `Bearer ${nToken}` },
                };
                AddProductToOrder(config2, oId, item2.id, item2.quantity).then(
                  (res) => {
                    if (res.data) {
                      if (res.data.success) {
                      } else {
                        toast.warning(res.data.message);
                        return false;
                      }
                    }
                  }
                );
              } else {
                toast.error("PLease login to continue");
                dispatch(handleLogoutRedux());
                history.push(`/login`);
                return false;
              }
            });
          } else {
            toast.error("Unknow Error");
            return false;
          }
        }
      });
    });
    return true;
  };

  const HandleOrder = async () => {
    const { v4: uuidv4 } = require("uuid");
    const transport_uuid = uuidv4();
    const order_uuid = uuidv4();
    const response1 = await AddTransport(transport_uuid);
    if (response1) {
      const response2 = await AddOrder(order_uuid, transport_uuid);
      if (response2) {
        const response3 = await props.AddOrderCoupon(order_uuid);
        let response4 = true;
        if (shopVoucher) {
          response4 = await AddSingleOrderCoupon(order_uuid, shopVoucher.id);
        }
        const response5 = await AddOrderProduct(order_uuid);
        return response3 && response4 && response5 ? true : false;
      } else {
        return false;
      }
    } else {
      return false;
    }
    //props.setSVDown(false);
  };

  useEffect(() => {
    if (props.sVDown) {
      async function fetchData() {
        const response = await HandleOrder();
        if (response) {
          history.push(`/notiOrderSuccess`);
        } else {
          toast.error("Order fail");
        }
      }
      fetchData();
    }
  }, [props.sVDown]);

  useEffect(() => {
    switch (shipWay) {
      case "Fast":
        props.changeTotalShip(shipCost, 25000);
        setShipCost(25000);
        break;
      case "Express":
        props.changeTotalShip(shipCost, 50000);
        setShipCost(50000);
        break;
    }
  }, [shipWay]);

  useEffect(() => {
    props.changeTotalShip(0, shipCost);
  }, []);

  return (
    <div key={`shop-${props.index}`}>
      <p className="shop-n">{props.item.name}</p>
      {props.item.product.map((item2, index2) => {
        return (
          <div key={`container-${props.index}-${index2}`}>
            {item2.data.map((item3, index3) => {
              return (
                <div
                  key={`product-${props.index}-${index3}`}
                  className="item-p d-flex"
                >
                  <img src={"data:image/*;base64," + item3.img[0]} alt="img" />
                  <div className="product-t d-flex">
                    <p className="product-n">{item3.name}</p>
                    <p className="product-p">
                      {new Intl.NumberFormat("de-DE").format(item3.price)} ₫
                    </p>
                    <p className="product-q">x{item3.quantity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="shop-v d-flex" onClick={() => setIsShow(true)}>
        <div>
          {shopVoucher ? <i className="fas fa-check-circle"></i> : ""}Voucher of
          Shop
        </div>
        {saleOff ? (
          <div className="selected-vc">
            - {new Intl.NumberFormat("de-DE").format(saleOff)}đ
          </div>
        ) : (
          <div className="select-vc">Select Voucher</div>
        )}
      </div>
      <div className="ship-c d-flex" onClick={() => setIsShowShip(true)}>
        <div className="ship-t">
          <p>Shipping way ( Click to choose )</p>
        </div>
        <div className="d-flex ship-cost">
          <div>{shipWay}</div>
          <div>
            <div className={props.shipVoucher ? "dis" : ""}>
              {new Intl.NumberFormat("de-DE").format(shipCost)}₫
            </div>
            {props.shipVoucher && (
              <div>
                {new Intl.NumberFormat("de-DE").format(shipCost - shipOff)}₫
              </div>
            )}
          </div>
        </div>
        {props.shipVoucher && (
          <div className="d-flex ship-s">
            <i className="fas fa-check-circle"></i>
            <p>Free shipping voucher applied</p>
          </div>
        )}
      </div>
      <div className="cost-t d-flex">
        <p>Total payment :</p>
        <b>{new Intl.NumberFormat("de-DE").format(total)}₫</b>
      </div>
      <ModalSelectVoucher
        isShowModal={isShow}
        handleClose={handleClose}
        selectVoucher={setShopVoucher}
        data={props.item}
      />
      <ModalSelectShippingWay
        isShowModal={isShowShip}
        handleClose={handleCloseShip}
        selectShipWay={handleSelectShipWay}
      />
    </div>
  );
};

export default PayItem;
