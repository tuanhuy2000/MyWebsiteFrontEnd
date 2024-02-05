import { useEffect, useState } from "react";
import { GetProductInCart } from "../../../services/CartServices";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleLogoutRedux } from "../../../redux/actions/userAction";
import { RenewToken, getCookie } from "../../../services/Common";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import "./Cart.scss";
import ItemCart from "./ItemCart";
import { Alert } from "react-bootstrap";
import { CheckBeforeOrder } from "../../../services/OrderServices";

const Cart = () => {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [listBuy, setListBuy] = useState([]);
  const [total, setTotal] = useState(0);
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();

  const GetProduct = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await GetProductInCart(config, account.id);
    if (res.data) {
      if (res.data.success) {
        setList(res.data.data);
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
            GetProductInCart(config2, account.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setList(res.data.data);
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
  };

  const AddProduct = (item, event) => {
    if (event.target.checked) {
      let tmpList = listBuy;
      tmpList.push(item);
      setListBuy(tmpList);
      GetCost();
    } else {
      listBuy.map((i) => {
        if (i.id === item.id) {
          let tmpList = listBuy;
          const index = tmpList.indexOf(i);
          if (index > -1) {
            tmpList.splice(index, 1);
          }
          setListBuy(tmpList);
          GetCost();
          return;
        }
      });
    }
  };

  const GetCost = () => {
    let tmpTotal = 0;
    listBuy.map((item) => {
      tmpTotal += item.quantity * item.price;
    });
    setTotal(tmpTotal);
  };

  const ChangeQuantity = (item) => {
    listBuy.map((i) => {
      if (i.id === item.id) {
        let tmpList = listBuy;
        const index = tmpList.indexOf(i);
        if (index > -1) {
          tmpList.splice(index, 1);
        }
        tmpList.push(item);
        setListBuy(tmpList);
        GetCost();
        return;
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      list.map((item) => {
        listBuy.map((i) => {
          if (i.id === item.id) {
            let tmpList = listBuy;
            const index = tmpList.indexOf(i);
            if (index > -1) {
              tmpList.splice(index, 1);
            }
            setListBuy(tmpList);
            return;
          }
        });
        listBuy.push(item);
      });
      GetCost();
    } else {
      setListBuy([]);
      setTotal(0);
    }

    let checkboxes = document.getElementsByName("check");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = event.target.checked;
    }
  };

  const handleClickBuy = async () => {
    RenewToken().then(async (nToken) => {
      if (nToken) {
        document.cookie = "Token=" + nToken + ";";
        const config = {
          headers: { Authorization: `Bearer ${nToken}` },
        };
        let result = true;
        const asyncRes = await Promise.all(
          listBuy.map(async (item) => {
            let res = await CheckBeforeOrder(config, account.id, item.id);
            if (res.data) {
              if (res.data.success) {
              } else {
                result = false;
              }
            } else {
              toast.error("Error");
              result = false;
            }
          })
        );
        if (result) {
          history.push({
            pathname: `/pay`,
            state: { data: listBuy },
          });
        } else {
          toast.warning("Can't buy products from my own store");
        }
      } else {
        toast.error("PLease login to continue");
        dispatch(handleLogoutRedux());
        history.push(`/login`);
      }
    });
  };

  useEffect(() => {
    GetProduct();
  }, []);

  return (
    <>
      <div className="container-cart">
        <div className="item-cart col-12 col-sm-9">
          {list.length > 0 ? (
            list.map((item, index) => {
              return (
                <div key={`item-${index}`} className="item">
                  <div className="cb">
                    <input
                      type="checkbox"
                      onClick={(event) => AddProduct(item, event)}
                      name="check"
                    />
                  </div>
                  <ItemCart
                    data={item}
                    func={GetProduct}
                    change={ChangeQuantity}
                  />
                </div>
              );
            })
          ) : (
            <div className="container-user-shop-alert">
              <Alert variant="info" className="mt-3">
                <Alert.Heading>
                  Oh snap! You don't have products in your cart yet !
                </Alert.Heading>
                <br></br>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => history.push("/")}
                >
                  Shopping now
                </button>
              </Alert>
            </div>
          )}
        </div>
        <div className="buying">
          <div className="d-flex">
            <input
              type="checkbox"
              onClick={(event) => handleSelectAll(event)}
            />
            <p>Select all</p>
          </div>
          <p>
            Total payment ( {listBuy.length} product ):{" "}
            <b>{new Intl.NumberFormat("de-DE").format(total)}₫</b>
          </p>
          <button
            // onClick={() =>
            //   history.push({
            //     pathname: `/pay`,
            //     state: { data: listBuy },
            //   })
            // }
            onClick={() => handleClickBuy()}
            disabled={listBuy.length > 0 ? false : true}
            className={listBuy.length > 0 ? "btn-enable" : "btn-disable"}
          >
            Buy
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
