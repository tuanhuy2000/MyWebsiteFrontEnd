import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./TableContent.scss";
import { useState } from "react";
import {
  ConvertDate,
  RenewToken,
  getCookie,
} from "../../../../services/Common";
import {
  CountAdminCoupon,
  GetAllTypeCoupon,
  SearchAdminCouponByDate,
  SearchAdminCouponByProductType,
  SearchAdminCouponByType,
  SearchCouponOfUserByDate,
  SearchCouponOfUserByProductType,
  SearchCouponOfUserByType,
  getPageAdminCoupon,
  getPageCouponByIdUser,
} from "../../../../services/CouponServices";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { handleLogoutRedux } from "../../../../redux/actions/userAction";
import { useEffect } from "react";
import ModalDelete from "../Modal/ModalDelete";
import ModalAddCoupon from "../Modal/ModalAdd/ModalAddCoupon";
import { GetAllTypeProduct } from "../../../../services/ProductServices";

const TableCoupon = (props) => {
  const [listCoupon, setListCoupon] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const [direction] = useState("asc");
  const [curentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(2);
  const account = useSelector((state) => state.user.account);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [isShowModalChange, setIsShowModalChange] = useState(false);
  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [dataModify, setDataModify] = useState({});
  const [type, setType] = useState("");
  const [typeProduct, setTypeProduct] = useState("");
  const [listType, setListType] = useState([]);
  const [listTypeProduct, setListTypeProduct] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [countCoupon, setCountCoupon] = useState(0);

  const GetAllType = async () => {
    let res = await GetAllTypeCoupon();
    setListType(res.data.data);
  };

  const getAllTypeProduct = async () => {
    let res = await GetAllTypeProduct();
    var list = res.data.data;
    list.push("All");
    setListTypeProduct(list);
  };

  const handleClose = () => {
    setIsShowModalDelete(false);
    setIsShowModalChange(false);
    setIsShowModalAdd(false);
  };

  const handleClickChangeBtn = (item) => {
    setDataModify(item);
    setIsShowModalChange(true);
  };

  const handleClickDeleteBtn = (item) => {
    setDataModify(item);
    setIsShowModalDelete(true);
  };

  const handlePageClick = (event) => {
    if (from && to) {
      if (props.admin) {
        handleClickAdminSearch(+event.selected + 1);
        setCurrentPage(event.selected + 1);
        return;
      }
      handleClickSearch(+event.selected + 1);
      setCurrentPage(event.selected + 1);
      return;
    }
    if (typeProduct) {
      if (props.admin) {
        handleChangeTypeProductAdmin(+event.selected + 1);
        setCurrentPage(event.selected + 1);
        return;
      }
      handleChangeTypeProduct(+event.selected + 1);
      setCurrentPage(event.selected + 1);
      return;
    }
    if (type) {
      if (props.admin) {
        handleChangeTypeAdmin(+event.selected + 1);
        setCurrentPage(event.selected + 1);
        return;
      }
      handleChangeType(+event.selected + 1);
      setCurrentPage(event.selected + 1);
      return;
    }
    if (props.admin) {
      GetPageAdminCoupon(+event.selected + 1, perPage, direction);
      setCurrentPage(event.selected + 1);
      return;
    }
    GetPageCoupon(+event.selected + 1, perPage, direction);
    setCurrentPage(event.selected + 1);
  };

  const GetPageAfterChange = () => {
    if (props.admin) {
      GetPageAdminCoupon(curentPage, perPage, direction);
      return;
    }
    GetPageCoupon(curentPage, perPage, direction);
    props.UpdateAfterDelete();
  };

  const GetPageCoupon = async (pageNum, perPage, direction) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await getPageCouponByIdUser(
      config,
      pageNum,
      perPage,
      direction,
      account.id
    );
    if (res.data && res.data.data.data.length > 0) {
      setTotalPages(res.data.data.totalPages);
      setListCoupon(res.data.data.data);
    } else {
      if (+res === 401) {
        RenewToken().then((token) => {
          if (token) {
            document.cookie = "Token=" + token + ";";
            const config2 = {
              headers: { Authorization: `Bearer ${token}` },
            };
            getPageCouponByIdUser(
              config2,
              pageNum,
              perPage,
              direction,
              account.id
            ).then((res) => {
              if (res.data && res.data.data.data.length > 0) {
                setTotalPages(res.data.data.totalPages);
                setListCoupon(res.data.data.data);
              }
            });
          } else {
            toast.error("PLease login to continue");
            dispatch(handleLogoutRedux());
            history.push(`/login`);
          }
        });
      }
    }
  };

  const GetPageAdminCoupon = async (pageNum, perPage, direction) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await getPageAdminCoupon(config, pageNum, perPage, direction);
    if (res.data && res.data.data.data.length > 0) {
      setTotalPages(res.data.data.totalPages);
      setListCoupon(res.data.data.data);
    } else {
      if (+res === 401) {
        RenewToken().then((token) => {
          if (token) {
            document.cookie = "Token=" + token + ";";
            const config2 = {
              headers: { Authorization: `Bearer ${token}` },
            };
            getPageAdminCoupon(config2, pageNum, perPage, direction).then(
              (res) => {
                if (res.data && res.data.data.data.length > 0) {
                  setTotalPages(res.data.data.totalPages);
                  setListCoupon(res.data.data.data);
                }
              }
            );
          } else {
            toast.error("PLease login to continue");
            dispatch(handleLogoutRedux());
            history.push(`/login`);
          }
        });
      }
    }
  };

  const handleChangeType = async (pageNum) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await SearchCouponOfUserByType(
      config,
      pageNum,
      perPage,
      direction,
      type,
      account.id
    );
    if (res.data) {
      if (res.data.success) {
        setTotalPages(res.data.data.totalPages);
        setListCoupon(res.data.data.data);
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
            SearchCouponOfUserByType(
              config2,
              pageNum,
              perPage,
              direction,
              type,
              account.id
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setTotalPages(res.data.data.totalPages);
                  setListCoupon(res.data.data.data);
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
      }
    }
  };

  const handleChangeTypeAdmin = async (pageNum) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await SearchAdminCouponByType(
      config,
      pageNum,
      perPage,
      direction,
      type
    );
    if (res.data) {
      if (res.data.success) {
        setTotalPages(res.data.data.totalPages);
        setListCoupon(res.data.data.data);
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
            SearchAdminCouponByType(
              config2,
              pageNum,
              perPage,
              direction,
              type
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setTotalPages(res.data.data.totalPages);
                  setListCoupon(res.data.data.data);
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
      }
    }
  };

  const handleChangeTypeProduct = async (pageNum) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await SearchCouponOfUserByProductType(
      config,
      pageNum,
      perPage,
      direction,
      typeProduct,
      account.id
    );
    if (res.data) {
      if (res.data.success) {
        setTotalPages(res.data.data.totalPages);
        setListCoupon(res.data.data.data);
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
            SearchCouponOfUserByProductType(
              config2,
              pageNum,
              perPage,
              direction,
              typeProduct,
              account.id
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setTotalPages(res.data.data.totalPages);
                  setListCoupon(res.data.data.data);
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
      }
    }
  };

  const handleChangeTypeProductAdmin = async (pageNum) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await SearchAdminCouponByProductType(
      config,
      pageNum,
      perPage,
      direction,
      typeProduct
    );
    if (res.data) {
      if (res.data.success) {
        setTotalPages(res.data.data.totalPages);
        setListCoupon(res.data.data.data);
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
            SearchAdminCouponByProductType(
              config2,
              pageNum,
              perPage,
              direction,
              typeProduct
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setTotalPages(res.data.data.totalPages);
                  setListCoupon(res.data.data.data);
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
      }
    }
  };

  const handleClickSearch = async (pageNum) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await SearchCouponOfUserByDate(
      config,
      pageNum,
      perPage,
      direction,
      from,
      to,
      account.id
    );
    if (res.data) {
      if (res.data.success) {
        setTotalPages(res.data.data.totalPages);
        setListCoupon(res.data.data.data);
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
            SearchCouponOfUserByDate(
              config2,
              pageNum,
              perPage,
              direction,
              from,
              to,
              account.id
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setTotalPages(res.data.data.totalPages);
                  setListCoupon(res.data.data.data);
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
      }
    }
  };

  const handleClickAdminSearch = async (pageNum) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await SearchAdminCouponByDate(
      config,
      pageNum,
      perPage,
      direction,
      from,
      to
    );
    if (res.data) {
      if (res.data.success) {
        setTotalPages(res.data.data.totalPages);
        setListCoupon(res.data.data.data);
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
            SearchAdminCouponByDate(
              config2,
              pageNum,
              perPage,
              direction,
              from,
              to
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setTotalPages(res.data.data.totalPages);
                  setListCoupon(res.data.data.data);
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
      }
    }
  };

  useEffect(() => {
    if (type) {
      if (props.admin) {
        handleChangeTypeAdmin(1);
        setTypeProduct("");
        setFrom("");
        setTo("");
        return;
      }
      handleChangeType(1);
      setTypeProduct("");
      setFrom("");
      setTo("");
      return;
    }
  }, [type]);

  useEffect(() => {
    if (typeProduct) {
      if (props.admin) {
        handleChangeTypeProductAdmin(1);
        setType("");
        setFrom("");
        setTo("");
        return;
      }
      handleChangeTypeProduct(1);
      setType("");
      setFrom("");
      setTo("");
      return;
    }
  }, [typeProduct]);

  useEffect(() => {
    if (props.admin) {
      GetPageAdminCoupon(curentPage, perPage, direction);
      return;
    }
    GetPageCoupon(curentPage, perPage, direction);
  }, [direction, props.update]);

  useEffect(() => {
    GetAllType();
    getAllTypeProduct();
  }, []);

  useEffect(() => {
    if (props.admin) {
      CountAdminCoupon().then((res) => {
        if (res.data) {
          if (res.data.success) {
            setCountCoupon(res.data.data);
          }
        } else {
          toast.error("Error");
        }
      });
    }
  }, [isShowModalAdd, isShowModalDelete]);

  return (
    <>
      <div className="list-content-container">
        <div className="title">
          List {props.admin ? countCoupon + " Admin" : ""} Coupon
        </div>
        <div className="list-content-content">
          <div className="mb-3 col-12 col-sm-4">
            <label className="form-label">Product type</label>
            <select
              className="form-select mb-3"
              aria-label=".form-select-sm example"
              onChange={(event) => setTypeProduct(event.target.value)}
            >
              {listTypeProduct.map((item, index) => {
                return <option key={`typeProduct-${index}`}>{item}</option>;
              })}
            </select>
          </div>
          <div className="mb-3 col-12 col-sm-4">
            <label className="form-label">Type</label>
            <select
              className="form-select mb-3"
              aria-label=".form-select-sm example"
              onChange={(event) => setType(event.target.value)}
            >
              {listType.map((item, index) => {
                return <option key={`type-${index}`}>{item}</option>;
              })}
            </select>
          </div>
          <div className="mb-3 col-12 col-sm-4">
            <label className="form-label">From</label>
            <input
              type="date"
              className="form-control"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </div>
          <div className="mb-3 col-12 col-sm-4">
            <label className="form-label">To</label>
            <input
              type="date"
              className="form-control"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
          <div>
            {props.admin && (
              <button
                className="btn btn-primary"
                onClick={() => setIsShowModalAdd(true)}
              >
                Add Coupon
              </button>
            )}

            <button
              className="btn btn-success mx-3"
              onClick={
                props.admin
                  ? () => handleClickAdminSearch(1)
                  : () => handleClickSearch(1)
              }
            >
              Search
            </button>
          </div>
          <div className="custom-table">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Code</th>
                  <th>Quantity</th>
                  <th>Worth</th>
                  <th>Minimum</th>
                  <th>Maximum</th>
                  <th>Describe</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Type</th>
                  <th>Product Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listCoupon &&
                  listCoupon.length > 0 &&
                  listCoupon.map((item, index) => {
                    return (
                      <tr key={`coupons-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.quantity}</td>
                        <td>{item.worth}</td>
                        <td>{item.minimum}</td>
                        <td>{item.maximum}</td>
                        <td>{item.describe}</td>
                        <td>{ConvertDate(item.from)}</td>
                        <td>{ConvertDate(item.to)}</td>
                        <td>{item.type}</td>
                        <td>{item.productType}</td>
                        <td>
                          <button
                            className="btn btn-warning mx-3"
                            onClick={() => handleClickChangeBtn(item)}
                          >
                            Change
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleClickDeleteBtn(item)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            pageCount={totalPages}
            previousLabel="<"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      </div>
      <ModalDelete
        isShowModal={isShowModalDelete}
        handleClose={handleClose}
        type={"coupon"}
        data={dataModify}
        GetPageAfterChange={GetPageAfterChange}
      />
      <ModalAddCoupon
        isShowModal={isShowModalChange}
        handleClose={handleClose}
        type={"change"}
        data={
          dataModify.code
            ? dataModify
            : {
                code: "",
                quantity: "",
                worth: "",
                minimum: "",
                maximum: "",
                describe: "",
                from: "",
                to: "",
                type: "",
                productType: "",
              }
        }
        GetPageAfterChange={GetPageAfterChange}
      />
      {props.admin && (
        <ModalAddCoupon
          isShowModal={isShowModalAdd}
          handleClose={handleClose}
          type={"create admin"}
          GetPageAfterChange={GetPageAfterChange}
        />
      )}
    </>
  );
};

export default TableCoupon;
