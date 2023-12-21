import { useEffect, useState } from "react";
import ModalSelectVoucher from "./Modal/ModalSelectVoucher";
import ModalSelectShippingWay from "./Modal/ModalSelectShippingWay";

const PayItem = (props) => {
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

  useEffect(() => {
    if (props.sVDown) {
      if (shopVoucher) {
        console.log("hihi");
        props.setSVDown(false);
      }
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
