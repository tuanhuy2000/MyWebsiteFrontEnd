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

const Product = () => {
  const location = useLocation();
  const [currentUpImg, setCurrentUpImg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shop, setShop] = useState({});
  const [productShop, setProductShop] = useState(0);
  const data = location.state.data;

  const handleChangeImg = (img) => {
    setCurrentUpImg(img);
    let index = data.img.findIndex((item) => item === img);
    setPhotoIndex(index);
  };

  useEffect(() => {
    if (data) {
      setCurrentUpImg(data.img[0]);
      GetShopByProductId(data.id).then((res) => {
        if (res.data) {
          if (res.data.success) {
            let shop = {
              id: res.data.data.id,
              name: res.data.data.name,
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
                {data.img.map((item, index) => {
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
                {data.address}
              </div>
              <div className="quantity">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={data.quantity}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
                <span>{data.quantity} products available</span>
              </div>
              <div className="group-button">
                <button className="add">
                  <i className="fas fa-cart-plus"></i>
                  Add to cart
                </button>
                <button className="buy">Buy now</button>
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
                <button className="btn-view">
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
        {isOpen && (
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
