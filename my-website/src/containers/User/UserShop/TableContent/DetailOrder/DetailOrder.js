import { useLocation, useHistory } from "react-router-dom";
import Header from "../../../Pay/Header/Header";
import "./DetailOrder.scss";
import { toast } from "react-toastify";
import {
  AnalysisAddress,
  ConvertDate,
  RenewToken,
  getCookie,
} from "../../../../../services/Common";
import { useDispatch } from "react-redux";
import { handleLogoutRedux } from "../../../../../redux/actions/userAction";
import {
  AddTransportToOrder,
  CreateTransport,
  DeleteOrderById,
  FinishOrder,
  GetAddressOfOrder,
  GetProductOfOrder,
  GetShopOfOrder,
  GetTransportOfOrder,
} from "../../../../../services/OrderServices";
import { useEffect, useState } from "react";

const DetailOrder = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state.data;
  const role = location.state.role;
  const [address, setAddress] = useState();
  const [transport, setTransport] = useState();
  const [product, setProduct] = useState();
  const [shop, setShop] = useState();

  const MakeTransportCode = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const AddTransport = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    const { v4: uuidv4 } = require("uuid");
    const id = uuidv4();
    const transport_code = "TP" + MakeTransportCode(5);
    let res = await CreateTransport(
      config,
      id,
      transport_code,
      data.shippingWay === "Fast" ? "J&TExpress" : "Grab",
      data.shippingWay
    );
    if (res.data) {
      if (res.data.success) {
        TransportToOrder(id);
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
              data.shippingWay === "Fast" ? "J&TExpress" : "Grab",
              data.shippingWay
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  TransportToOrder(id);
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
  };

  const TransportToOrder = async (tId) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await AddTransportToOrder(config, tId, data.id);
    if (res.data) {
      if (res.data.success) {
        toast.success(res.data.message);
        history.goBack();
      } else {
        toast.warning(res.data.message);
      }
    } else {
      toast.error("Unknow Error");
    }
  };

  const HandleCancelOrder = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await DeleteOrderById(config, data.id);
    if (res.data) {
      if (res.data.success) {
        toast.success(res.data.message);
        history.goBack();
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
            DeleteOrderById(config2, data.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  toast.success(res.data.message);
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
        toast.error("Unknow Error");
      }
    }
  };

  const HandleFinishOrder = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await FinishOrder(config, data.id);
    if (res.data) {
      if (res.data.success) {
        toast.success(res.data.message);
        history.goBack();
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
            FinishOrder(config2, data.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  toast.success(res.data.message);
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
        toast.error("Unknow Error");
      }
    }
  };

  useEffect(() => {
    const fetchDataAddress = async () => {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await GetAddressOfOrder(config, data.id);
      if (res.data) {
        if (res.data.success) {
          setAddress(res.data.data);
        } else {
          toast.warning(res.data.message);
        }
      } else {
        toast.error("Error");
      }
    };
    const fetchDataTransport = async () => {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await GetTransportOfOrder(config, data.id);
      if (res.data) {
        if (res.data.success) {
          setTransport(res.data.data);
        } else {
          toast.warning(res.data.message);
        }
      } else {
        toast.error("Error");
      }
    };
    const fetchDataProduct = async () => {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await GetProductOfOrder(config, data.id);
      if (res.data) {
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          toast.warning(res.data.message);
        }
      } else {
        toast.error("Error");
      }
    };
    const fetchDataShop = async () => {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await GetShopOfOrder(config, data.id);
      if (res.data) {
        if (res.data.success) {
          setShop(res.data.data);
        } else {
          toast.warning(res.data.message);
        }
      } else {
        toast.error("Error");
      }
    };
    RenewToken().then((nToken) => {
      if (nToken) {
        document.cookie = "Token=" + nToken + ";";
        fetchDataAddress();
        fetchDataTransport();
        fetchDataProduct();
        fetchDataShop();
      } else {
        toast.error("PLease login to continue");
        dispatch(handleLogoutRedux());
        history.push(`/login`);
      }
    });
  }, []);

  return (
    <>
      <Header data={"Detail Order"} />
      <div className="container-detail-order d-flex">
        <div className="col-8 col-sm-6">
          <div className="is-complete">
            The order has {data.completionDate < data.orderDate ? "not" : ""}{" "}
            been completed
          </div>
          {transport ? (
            <div className="transport-container d-flex">
              <div>
                <i className="fas fa-shipping-fast"></i>
              </div>
              <div>
                <p>Shipping information</p>
                <div className="detail-transport">
                  <p>{transport.shippingWay}</p>
                  <p>
                    {transport.shippingUnit} - {transport.shippingCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="noti-transport">Order has not been confirmed</div>
          )}
          {address && (
            <div className="transport-container d-flex">
              <div>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <p>Delivery address</p>
                <div className="detail-transport">
                  <p>{address.name}</p>
                  <p>{address.phone}</p>
                  <p>{AnalysisAddress(address.fullAddress)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="container-product col-8 col-sm-6">
          {shop && (
            <div>
              <div className="shop-name d-flex">
                <p>{shop.name}</p>
                <div
                  className="btn-view"
                  onClick={() =>
                    history.push({
                      pathname: `/shop`,
                      state: { data: shop },
                    })
                  }
                >
                  View Shop <i className="fas fa-chevron-right"></i>
                </div>
              </div>
              {product &&
                product.map((item, index) => {
                  return (
                    <div key={`product-${index}`} className="item-p d-flex">
                      <img
                        src={"data:image/*;base64," + item.img[0]}
                        alt="img"
                      />
                      <div className="product-t d-flex">
                        <p className="product-n">{item.name}</p>
                        <p>x{item.quantity}</p>
                        <p>
                          {new Intl.NumberFormat("de-DE").format(item.price)} ₫
                        </p>
                      </div>
                    </div>
                  );
                })}
              <div className="total d-flex">
                <b>Total cost</b>
                <b>{new Intl.NumberFormat("de-DE").format(data.totalCost)} ₫</b>
              </div>
            </div>
          )}
        </div>
        <div className="payment-container col-8 col-sm-6 d-flex">
          <div>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div>
            Payment type
            <p>Payment by {data.paymentType}</p>
          </div>
        </div>
        <div className="detail-order-container col-8 col-sm-6 d-flex">
          <div>
            <b>Code order</b>
            <p>Time order</p>
            <p>Time completion</p>
          </div>
          <div className="right-content">
            <b>{data.id}</b>
            <p>{ConvertDate(data.orderDate)}</p>
            <p>
              {data.completionDate > data.orderDate
                ? ConvertDate(data.completionDate)
                : "Unfinished"}
            </p>
          </div>
        </div>
        <div className="container-confirm col-8 col-sm-6 d-flex">
          <button
            className="btn btn-confirm col-8 col-sm-6"
            hidden={role !== "shop" || data.status !== "Confirming"}
            onClick={() => AddTransport()}
          >
            Confirm order
          </button>
          <button
            className="btn btn-secondary col-8 col-sm-6"
            hidden={!(role === "shop" || data.status === "Confirming")}
            onClick={() => HandleCancelOrder()}
          >
            Cancel order
          </button>
          <button
            className="btn btn-confirm col-8 col-sm-6"
            hidden={!(role === "customer" && data.status === "Shipping")}
            onClick={() => HandleFinishOrder()}
          >
            Products received
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailOrder;
