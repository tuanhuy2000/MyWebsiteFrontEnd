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

const Cart = () => {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [listBuy, setListBuy] = useState([]);
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
    } else {
      let tmpList = listBuy;
      const index = tmpList.indexOf(item);
      if (index > -1) {
        tmpList.splice(index, 1);
      }
      setListBuy(tmpList);
    }
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
                    />
                  </div>
                  <ItemCart data={item} func={GetProduct} />
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
      </div>
    </>
  );
};

export default Cart;
