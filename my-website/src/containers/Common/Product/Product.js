import { useLocation } from "react-router-dom";
import NotFound from "../../../routes/NotFound";
import "./Product.scss";
import { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useEffect } from "react";
import { GetShopByProductId } from "../../../services/ShopServices";
import { toast } from "react-toastify";
import { CountProductOfShop } from "../../../services/ProductServices";
import { useHistory } from "react-router-dom";
import { AddToCart } from "../../../services/CartServices";
import { useDispatch, useSelector } from "react-redux";
import { RenewToken, getCookie } from "../../../services/Common";
import { handleLogoutRedux } from "../../../redux/actions/userAction";

const Product = () => {
  const history = useHistory();
  const location = useLocation();
  const data = location.state.data;
  const [currentUpImg, setCurrentUpImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shop, setShop] = useState({});
  const [productShop, setProductShop] = useState(0);

  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();

  const handleQuantityChange = (event) => {
    if (event.target.value < 1) {
      setQuantity(1);
      return;
    }
    if (event.target.value > data.quantity) {
      setQuantity(data.quantity);
      return;
    }
    setQuantity(event.target.value);
  };

  const handleChangeImg = (img) => {
    setCurrentUpImg(img);
    let index = data.img.findIndex((item) => item === img);
    setPhotoIndex(index);
  };

  const handleAdd = async () => {
    if (account) {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await AddToCart(config, account.id, data.id, quantity);
      if (res.data) {
        if (res.data.success) {
          toast.success(res.data.message);
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
              AddToCart(config2, account.id, data.id, quantity).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    toast.success(res.data.message);
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
      history.push(`/login`);
    }
  };

  useEffect(() => {
    if (data) {
      if (data.img) {
        setCurrentUpImg(data.img[0]);
      }
      GetShopByProductId(data.id).then((res) => {
        if (res.data) {
          if (res.data.success) {
            let shop = {
              id: res.data.data.id,
              name: res.data.data.name,
              address: res.data.data.address,
              avatar: res.data.data.avatar,
            };
            setShop(shop);
            CountProductOfShop(res.data.data.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setProductShop(res.data.data);
                } else {
                  toast.error("Error");
                }
              } else {
                toast.error("Error");
              }
            });
          } else {
            toast.error("Error");
          }
        } else {
          toast.error("Error");
        }
      });
    }
  }, []);

  const handleClickBuyNow = () => {
    data.quantity = quantity;
    history.push({
      pathname: `/pay`,
      state: { data: [data] },
    });
  };

  if (data) {
    return (
      <>
        <div className="product-container">
          <div className="product-infor col-9">
            <div className="content-left col-5">
              <div className="img-up col-12">
                <img
                  src={"data:image/*;base64," + currentUpImg}
                  alt="img"
                  onClick={() => setIsOpen(true)}
                />
              </div>
              <div className="img-down col-12">
                {data.img &&
                  data.img.map((item, index) => {
                    return (
                      <div className="img-small col-3" key={`img-${index}`}>
                        <img
                          src={item && "data:image/*;base64," + item}
                          alt="img"
                          onClick={() => handleChangeImg(item)}
                          className={currentUpImg === item ? "active" : ""}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="content-right col-7">
              <div className="title">{data.name}</div>
              <div className="price">
                {new Intl.NumberFormat("de-DE").format(data.price)} ₫
              </div>
              <div className="address">
                <i className="fas fa-map-marker-alt"></i>
                {shop.address}
              </div>
              <div className="quantity">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={data.quantity}
                  value={quantity}
                  onChange={(event) => handleQuantityChange(event)}
                />
                <span>{data.quantity} products available</span>
              </div>
              <div className="group-button">
                <button className="add" onClick={() => handleAdd()}>
                  <i className="fas fa-cart-plus"></i>
                  Add to cart
                </button>
                <button className="buy" onClick={() => handleClickBuyNow()}>
                  Buy now
                </button>
              </div>
            </div>
          </div>
          {shop.avatar && (
            <div className="shop-infor col-9">
              <div className="avt col-1">
                <img src={"data:image/*;base64," + shop.avatar} alt="img" />
              </div>
              <div className="shop-name">
                <label>{shop.name}</label>
                <button
                  className="btn-view"
                  onClick={() =>
                    history.push({
                      pathname: `/shop`,
                      state: { data: shop },
                    })
                  }
                >
                  <i className="fas fa-store"></i>View Shop
                </button>
              </div>
              <div className="prd">Product</div>
              <div className="num-prd">{productShop}</div>
            </div>
          )}
          <div className="descri-prd col-9">
            <div className="title">PRODUCT DESCRIPTION</div>
            <div className="describe">{data.information}</div>
          </div>
        </div>
        {isOpen && data.img && (
          <Lightbox
            mainSrc={"data:image/*;base64," + data.img[photoIndex]}
            nextSrc={
              "data:image/*;base64," +
              data.img[(photoIndex + 1) % data.img.length]
            }
            prevSrc={
              "data:image/*;base64," +
              data.img[(photoIndex + data.img.length - 1) % data.img.length]
            }
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + data.img.length - 1) % data.img.length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % data.img.length)
            }
          />
        )}
      </>
    );
  } else {
    return <NotFound />;
  }
};

export default Product;
