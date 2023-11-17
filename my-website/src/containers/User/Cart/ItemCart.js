import { useDispatch, useSelector } from "react-redux";
import { RenewToken, getCookie } from "../../../services/Common";
import { GetProductById } from "../../../services/ProductServices";
import { toast } from "react-toastify";
import { handleLogoutRedux } from "../../../redux/actions/userAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useState } from "react";
import {
  ChangeQuantity,
  DeleteProductInCart,
} from "../../../services/CartServices";
import { useEffect } from "react";

const ItemCart = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const account = useSelector((state) => state.user.account);
  const [quantity, setQuantity] = useState(props.data.quantity);
  const [max, setMax] = useState();

  const GetMaxQuantity = async (id) => {
    let res = await GetProductById(id);
    if (res.data) {
      if (res.data.success) {
        setMax(res.data.data.quantity);
      } else {
        toast.warning(res.data.message);
      }
    } else {
      toast.error("Error");
    }
  };

  const handleChangeQuantity = async (event) => {
    setQuantity(event.target.value);
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await ChangeQuantity(
      config,
      account.id,
      props.data.id,
      event.target.value
    );
    if (res.data) {
      if (res.data.success) {
        props.func();
        props.data.quantity = event.target.value;
        props.change(props.data);
      } else {
        toast.warning(res.data.message);
      }
    } else {
      if (+res === 401) {
        setQuantity(event.target.value);
        RenewToken().then((token) => {
          if (token) {
            document.cookie = "Token=" + token + ";";
            const config2 = {
              headers: { Authorization: `Bearer ${token}` },
            };
            ChangeQuantity(
              config2,
              account.id,
              props.data.id,
              event.target.value
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  props.func();
                  props.data.quantity = event.target.value;
                  props.change(props.data);
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

  const handleDelete = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await DeleteProductInCart(config, account.id, props.data.id);
    if (res.data) {
      if (res.data.success) {
        props.func();
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
            DeleteProductInCart(config2, account.id, props.data.id).then(
              (res) => {
                if (res.data) {
                  if (res.data.success) {
                    props.func();
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
      } else {
        toast.error("Error");
      }
    }
  };

  useEffect(() => {
    GetMaxQuantity(props.data.id);
  }, []);

  return (
    <>
      <div className="product-content">
        <div
          className="prd-name col-6"
          onClick={() =>
            history.push({
              pathname: `/product`,
              state: { data: props.data },
            })
          }
        >
          <img src={"data:image/*;base64," + props.data.img[0]} alt="img" />
          <span>{props.data.name}</span>
        </div>
        <div className="col-2">
          <span>
            {new Intl.NumberFormat("de-DE").format(props.data.price)} ₫
          </span>
        </div>
        <div className="col-1">
          <input
            type="number"
            min="1"
            max={max}
            value={quantity}
            onChange={(event) => handleChangeQuantity(event)}
          />
        </div>
        <div className="col-2 total">
          <span>
            {new Intl.NumberFormat("de-DE").format(
              props.data.price * props.data.quantity
            )}{" "}
            ₫
          </span>
        </div>
        <div className="col-1">
          <span>
            <button onClick={() => handleDelete()}>
              <i className="fas fa-trash-alt"></i>
            </button>
          </span>
        </div>
      </div>
    </>
  );
};

export default ItemCart;
