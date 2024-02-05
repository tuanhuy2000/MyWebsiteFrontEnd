import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "./Pay.scss";
import Header from "./Header/Header";
import { useEffect, useState } from "react";
import { GetShopByProductId } from "../../../services/ShopServices";
import PayItem from "./PayItem";
import ModalSelectVoucher from "./Modal/ModalSelectVoucher";
import ModalSelectPaymentType from "./Modal/ModalSelectPaymentType";
import { AddCouponToOrder } from "../../../services/OrderServices";
import {
  AnalysisAddress,
  RenewToken,
  getCookie,
} from "../../../services/Common";
import { useDispatch } from "react-redux";
import { handleLogoutRedux } from "../../../redux/actions/userAction";

const Pay = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const data = history.location.state.data;
  const address = history.location.state.address;
  const [listShop, setListShop] = useState([]);
  const [listType, setListType] = useState();
  const [total, setTotal] = useState();
  const [discountVoucher, setDiscountVoucher] = useState();
  const [saleOff, setSaleOff] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [isShowDiscount, setIsShowDiscount] = useState(false);
  const [totalShip, setTotalShip] = useState(0);
  const [shipOff, setShipOff] = useState(0);
  const [shippingVoucher, setShippingVoucher] = useState();
  const [isShowShip, setIsShowShip] = useState(false);
  const [sVDown, setSVDown] = useState(false);
  const [paymentType, setPaymentType] = useState("Cash");
  const [isShowPaymentType, setIsShowPaymentType] = useState(false);

  const handleCloseDiscount = () => {
    setDiscountVoucher();
    setIsShowDiscount(false);
  };

  const handleCloseShip = () => {
    setShippingVoucher();
    setIsShowShip(false);
  };

  const handleClosePaymentType = () => {
    setIsShowPaymentType(false);
  };

  const handleSelectPaymentType = (type) => {
    setPaymentType(type);
    setIsShowPaymentType(false);
  };

  const ChangeTotalDisCount = (sub, add) => {
    setTotalDiscount(totalDiscount - sub + add);
  };

  const ChangeTotalShip = (sub, add) => {
    setTotalShip((totalShip) => totalShip - sub + add);
  };

  const ChangeTotalShipOff = (sub, add) => {
    setShipOff((shipOff) => shipOff - sub + add);
  };

  const GetListShop = async () => {
    let stmp = [];
    const asyncRes = await Promise.all(
      data.map(async (item) => {
        let res = await GetShopByProductId(item.id);
        if (res.data) {
          if (res.data.success) {
            let tmp = false;
            stmp.map((item2) => {
              if (item2.id === res.data.data.id) {
                tmp = true;
                let tmp1 = false;
                for (let i = 0; i < item2.product.length; i++) {
                  if (item2.product[i].type === item.type) {
                    tmp1 = true;
                    item2.product[i].data.push(item);
                    item2.product[i].cost += item.price * item.quantity;
                    item2.cost += item.price * item.quantity;
                  }
                }
                if (!tmp1) {
                  item2.product.push({
                    type: item.type,
                    data: [item],
                    cost: item.price * item.quantity,
                  });
                  item2.cost += item.price * item.quantity;
                }
              }
            });
            if (!tmp) {
              let shop = {
                id: res.data.data.id,
                name: res.data.data.name,
                avatar: res.data.data.avatar,
                product: [
                  {
                    type: item.type,
                    data: [item],
                    cost: item.price * item.quantity,
                  },
                ],
                cost: item.price * item.quantity,
              };
              stmp.push(shop);
            }
          } else {
            toast.error(res.data.message);
          }
        } else {
          toast.error("Error");
        }
        return stmp;
      })
    );
    setListShop(asyncRes[0]);
    let tmpTotal = 0;
    const asyncRes2 = await Promise.all(
      asyncRes[0].map((item) => {
        tmpTotal += item.cost;
        return tmpTotal;
      })
    );
    setTotal(asyncRes2[asyncRes2.length - 1]);
  };

  const GetListType = async () => {
    let stmp = [];
    let sum = 0;
    const asyncRes = await Promise.all(
      data.map(async (item) => {
        sum += item.price * item.quantity;
        let tmp = stmp.find((item2) => item2.type === item.type);
        if (!tmp) {
          stmp.push({ type: item.type, total: item.price * item.quantity });
        } else {
          tmp.total += item.price * item.quantity;
        }
        return stmp;
      })
    );
    setTotal(sum);
    setListType(asyncRes[0]);
  };

  const handleClickOrder = () => {
    if (address) {
      setSVDown(true);
    } else {
      toast.warning("Please select address");
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

  const AddOrderCoupon = async (oId) => {
    if (shippingVoucher) {
      const response1 = await AddSingleOrderCoupon(oId, shippingVoucher.id);
      if (!response1) {
        return false;
      }
    }
    if (discountVoucher) {
      const response2 = await AddSingleOrderCoupon(oId, discountVoucher.id);
      if (!response2) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (discountVoucher) {
      if (
        discountVoucher.worth.includes("%") &&
        discountVoucher.productType === "All"
      ) {
        let dis = discountVoucher.worth.slice(
          0,
          discountVoucher.worth.length - 1
        );
        let off = (total * dis) / 100;
        off > discountVoucher.maximum
          ? ChangeTotalDisCount(saleOff, +discountVoucher.maximum)
          : ChangeTotalDisCount(saleOff, off);
        off > discountVoucher.maximum
          ? setSaleOff(discountVoucher.maximum)
          : setSaleOff(off);
      } else if (
        discountVoucher.worth.includes("%") &&
        discountVoucher.productType !== "All"
      ) {
        let dis = discountVoucher.worth.slice(
          0,
          discountVoucher.worth.length - 1
        );
        let tmp = listType.find((type) => type === discountVoucher.productType);
        let off = (tmp.total * dis) / 100;
        off > discountVoucher.maximum
          ? ChangeTotalDisCount(saleOff, +discountVoucher.maximum)
          : ChangeTotalDisCount(saleOff, off);
        off > discountVoucher.maximum
          ? setSaleOff(discountVoucher.maximum)
          : setSaleOff(off);
      } else {
        ChangeTotalDisCount(saleOff, +discountVoucher.worth);
        setSaleOff(discountVoucher.worth);
      }
    } else {
      ChangeTotalDisCount(saleOff, 0);
      setSaleOff(0);
    }
  }, [discountVoucher]);

  useEffect(() => {
    GetListShop();
    GetListType();
  }, []);

  return (
    <>
      <Header data={"Pay"} />
      <div className="container-p d-flex">
        <div className="c-address col-12 col-sm-6">
          <div>
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <div>
            <div>
              <p>Delivery address</p>
            </div>
            {address && (
              <div>
                <b>{address.name}</b> | {address.phone} <br></br>
                {AnalysisAddress(address.fullAddress)}
              </div>
            )}
            <div
              className="link-c"
              onClick={() =>
                history.push({
                  pathname: `/chooseAddress`,
                  state: { data: data },
                })
              }
            >
              Choose Address
            </div>
          </div>
        </div>
        {listShop &&
          listShop.map((item, index) => {
            return (
              <div key={`payitem-${index}`} className="item-s col-12 col-sm-6">
                <PayItem
                  item={item}
                  index={index}
                  shipVoucher={shippingVoucher}
                  changeDiscount={ChangeTotalDisCount}
                  changeTotalShip={ChangeTotalShip}
                  changeShipOff={ChangeTotalShipOff}
                  //
                  address={address}
                  paymentType={paymentType}
                  total={total}
                  saleOff={saleOff}
                  AddOrderCoupon={AddOrderCoupon}
                  //
                  sVDown={sVDown}
                  setSVDown={setSVDown}
                />
              </div>
            );
          })}
        <div className="c-voucher col-12 col-sm-6">
          <div
            className="shop-v d-flex v-ship"
            onClick={() => setIsShowShip(true)}
          >
            <div>
              {shippingVoucher ? <i className="fas fa-check-circle"></i> : ""}
              Shipping Voucher
            </div>
            {shippingVoucher ? (
              <div className="selected-vc">FreeShipping</div>
            ) : (
              <div className="select-vc">Select Voucher</div>
            )}
          </div>
          <div
            className="shop-v d-flex v-dis"
            onClick={() => setIsShowDiscount(true)}
          >
            <div>
              {discountVoucher ? <i className="fas fa-check-circle"></i> : ""}
              Discount Voucher
            </div>
            {saleOff ? (
              <div className="selected-vc">
                - {new Intl.NumberFormat("de-DE").format(saleOff)}đ
              </div>
            ) : (
              <div className="select-vc">Select Voucher</div>
            )}
          </div>
        </div>
        <div
          className="c-p-type d-flex col-12 col-sm-6"
          onClick={() => setIsShowPaymentType(true)}
        >
          <div>
            <i className="fas fa-dollar-sign"></i>
            Payment type
          </div>
          {paymentType ? <p>{paymentType}</p> : <p>Select Payment Type</p>}
        </div>
        <div className="t-container col-12 col-sm-6">
          <div className="t-title">
            <i className="fas fa-receipt"></i>
            Payment details
          </div>
          <div className="t-detail">
            <p>Total goods cost</p>
            <p>{new Intl.NumberFormat("de-DE").format(total)}đ</p>
          </div>
          <div className="t-detail">
            <p>Total shipping cost</p>
            <p>{new Intl.NumberFormat("de-DE").format(totalShip)}đ</p>
          </div>
          <div className="t-detail">
            <p>Shipping cost discount</p>
            <p>-{new Intl.NumberFormat("de-DE").format(shipOff)}đ</p>
          </div>
          <div className="t-detail">
            <p>Goods cost discount</p>
            <p>-{new Intl.NumberFormat("de-DE").format(totalDiscount)}đ</p>
          </div>
          <div className="t-detail t-total">
            <p>Total cost</p>
            <p className="t-price">
              {new Intl.NumberFormat("de-DE").format(
                total + totalShip - totalDiscount - shipOff
              )}
              đ
            </p>
          </div>
        </div>
        <ModalSelectPaymentType
          isShowModal={isShowPaymentType}
          handleClose={handleClosePaymentType}
          selectPaymentType={handleSelectPaymentType}
        />
        {listType && total && (
          <>
            <ModalSelectVoucher
              isShowModal={isShowDiscount}
              handleClose={handleCloseDiscount}
              type="Discount"
              listType={listType}
              cost={total}
              selectVoucher={setDiscountVoucher}
            />
            <ModalSelectVoucher
              isShowModal={isShowShip}
              handleClose={handleCloseShip}
              type="FreeShipping"
              listType={listType}
              cost={total}
              selectVoucher={setShippingVoucher}
            />
          </>
        )}
      </div>
      <div className="d-flex col-12 c-order">
        <p>
          Total payment: <br></br>
          <b>
            {new Intl.NumberFormat("de-DE").format(
              total + totalShip - totalDiscount - shipOff
            )}
            đ
          </b>
        </p>
        <button
          //disabled={sVDown ? true : false}
          className="btn-order col-4 col-sm-3"
          onClick={() => handleClickOrder()}
        >
          ORDER
        </button>
      </div>
    </>
  );
};

export default Pay;
