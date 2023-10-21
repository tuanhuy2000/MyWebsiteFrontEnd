import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { RenewToken, getCookie } from "../../../../services/Common";
import { DeleteShopByIdUser } from "../../../../services/ShopServices";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../../../../redux/actions/userAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { DeleteProductById } from "../../../../services/ProductServices";
import { DeleteCouponById } from "../../../../services/CouponServices";

const ModalDelete = (props) => {
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const history = useHistory();

  const DeleteShop = async () => {
    if (account) {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await DeleteShopByIdUser(config, account.id);
      if (res.data) {
        if (res.data.success) {
          toast.success(res.data.message);
          props.handleClose();
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
              DeleteShopByIdUser(config2, account.id).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    toast.success(res.data.message);
                    props.handleClose();
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
      toast.error("Error");
    }
  };

  const DeleteProduct = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await DeleteProductById(config, props.data.id);
    if (res.data) {
      if (res.data.success) {
        toast.success(res.data.message);
        props.GetPageAfterChange();
        props.handleClose();
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
            DeleteProductById(config2, props.data.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  toast.success(res.data.message);
                  props.GetPageAfterChange();
                  props.handleClose();
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

  const DeleteCoupon = async () => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await DeleteCouponById(config, props.data.id);
    if (res.data) {
      if (res.data.success) {
        toast.success(res.data.message);
        props.GetPageAfterChange();
        props.handleClose();
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
            DeleteCouponById(config2, props.data.id).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  toast.success(res.data.message);
                  props.GetPageAfterChange();
                  props.handleClose();
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

  const handleDelete = (type) => {
    switch (type) {
      case "shop":
        DeleteShop();
        break;
      case "product":
        DeleteProduct();
        break;
      case "coupon":
        DeleteCoupon();
        break;
      default:
        toast.error("Error");
        break;
    }
  };
  return (
    <>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {props.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            You want to delete {props.type}{" "}
            <b>{props.type === "coupon" ? props.data.code : props.data.name}</b>
            ???
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            No
          </Button>
          <Button variant="danger" onClick={() => handleDelete(props.type)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDelete;
