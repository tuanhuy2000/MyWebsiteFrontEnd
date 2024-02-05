import "./UserPage.scss";
import { useState } from "react";
import ChangeInfor from "../ChangeInfor/ChangeInfor";
import ChangePass from "../ChangePass/ChangePass";
import UserShop from "../UserShop/UserShop";
import { useSelector } from "react-redux";
import AdminCoupon from "../../Admin/AdminCoupon/AdminCoupon";
import UserOrder from "../UserOrder/UserOrder";

const UserPage = () => {
  const [content, setContent] = useState();
  const account = useSelector((state) => state.user.account);

  const handleClickChangePage = (event, component) => {
    const boxes = Array.from(document.getElementsByClassName("active"));
    boxes.forEach((box) => {
      box.classList.remove("active");
    });
    var element = document.getElementById(event.target.id);
    element.classList.add("active");
    setContent(component);
  };

  return (
    <>
      <div className="container-user">
        <div className="right-nav">
          <ul>
            <li
              onClick={(event) => handleClickChangePage(event, <ChangeInfor />)}
              id="change-infor"
            >
              Change Infomation
            </li>
            <li
              onClick={(event) => handleClickChangePage(event, <ChangePass />)}
              id="change-pass"
            >
              Change Password
            </li>
            <li
              onClick={(event) => handleClickChangePage(event, <UserShop />)}
              id="user-shop"
            >
              {account.name}'s Shop
            </li>
            <li
              onClick={(event) => handleClickChangePage(event, <UserOrder />)}
              id="user-order"
            >
              Order
            </li>
            {account.role === "AdminRole" && (
              <li
                onClick={(event) =>
                  handleClickChangePage(event, <AdminCoupon />)
                }
                id="admin-coupon"
              >
                Admin Coupon
              </li>
            )}
          </ul>
        </div>
        <div className="content">{content}</div>
      </div>
    </>
  );
};

export default UserPage;
