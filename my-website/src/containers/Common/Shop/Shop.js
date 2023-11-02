import { useState } from "react";
import HomeContent from "../HomeContent/HomeContent";
import { useLocation, useHistory } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "./Shop.scss";
import { CountProductOfShop } from "../../../services/ProductServices";

const Shop = () => {
  const location = useLocation();
  const history = useHistory();
  const data = location.state.data;
  const [productShop, setProductShop] = useState(0);

  useEffect(() => {
    CountProductOfShop(data.id).then((res) => {
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
  }, []);

  return (
    <>
      <div className="shop-infor">
        <div className="avt col-1">
          <img src={"data:image/*;base64," + data.avatar} alt="img" />
        </div>
        <div className="shop-name">
          <label>{data.name}</label>
        </div>
        <div className="prd">Product</div>
        <div className="num-prd">{productShop}</div>
      </div>
      <HomeContent shop={data.id} />
    </>
  );
};
export default Shop;
