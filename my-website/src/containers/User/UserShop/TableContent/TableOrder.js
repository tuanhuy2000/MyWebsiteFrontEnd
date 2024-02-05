import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./TableContent.scss";
import { useState, useEffect } from "react";
import {
  GetOrderByShopOrUser,
  SearchOrderOfShopOrUser,
  SearchOrderOfShopOrUserByStatus,
} from "../../../../services/OrderServices";
import {
  ConvertDate,
  RenewToken,
  getCookie,
} from "../../../../services/Common";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../../../../redux/actions/userAction";

const TableOrder = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.user.account);
  const [listOrder, setListOrder] = useState([]);
  const [direction, setDirection] = useState("asc");
  const [totalPages, setTotalPages] = useState(0);
  const [curentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const GetPageOrder = async (pageNum) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await GetOrderByShopOrUser(
      config,
      pageNum,
      perPage,
      direction,
      props.idShop ? props.idShop : account.id,
      props.idShop ? "IdShop" : "Orderer"
    );
    if (res.data) {
      if (res.data.success && res.data.data.data.length > 0) {
        setTotalPages(res.data.data.totalPages);
        setListOrder(res.data.data.data);
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
            GetOrderByShopOrUser(
              config2,
              pageNum,
              perPage,
              direction,
              props.idShop ? props.idShop : account.id,
              props.idShop ? "IdShop" : "Orderer"
            ).then((res) => {
              if (res.data) {
                if (res.data.success && res.data.data.data.length > 0) {
                  setTotalPages(res.data.data.totalPages);
                  setListOrder(res.data.data.data);
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

  const handlePageClick = (event) => {
    if (keyword) {
      handleSearch(+event.selected + 1);
      setCurrentPage(event.selected + 1);
      return;
    }
    if (status) {
      handleSearchByStatus(+event.selected + 1, status);
      setCurrentPage(event.selected + 1);
    }
    GetPageOrder(+event.selected + 1);
    setCurrentPage(event.selected + 1);
  };

  const handleDirection = (tmp) => {
    setDirection(tmp);
    setKeyword("");
    setStatus("");
    var elements = document.getElementsByName("group-radio");
    elements.forEach((element) => {
      element.checked = false;
    });
  };

  const handleSearch = async (pageNum) => {
    setStatus("");
    var elements = document.getElementsByName("group-radio");
    elements.forEach((element) => {
      element.checked = false;
    });
    if (keyword) {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await SearchOrderOfShopOrUser(
        config,
        pageNum,
        perPage,
        direction,
        keyword,
        props.idShop ? props.idShop : account.id,
        props.idShop ? "IdShop" : "Orderer"
      );
      if (res.data) {
        if (res.data.success) {
          setTotalPages(res.data.data.totalPages);
          setListOrder(res.data.data.data);
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
              SearchOrderOfShopOrUser(
                config2,
                pageNum,
                perPage,
                direction,
                keyword,
                props.idShop ? props.idShop : account.id,
                props.idShop ? "IdShop" : "Orderer"
              ).then((res) => {
                if (res.data) {
                  if (res.data.success) {
                    setTotalPages(res.data.data.totalPages);
                    setListOrder(res.data.data.data);
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
      GetPageOrder(pageNum);
    }
  };

  const handleSearchByStatus = async (pageNum, sta) => {
    setKeyword("");
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await SearchOrderOfShopOrUserByStatus(
      config,
      pageNum,
      perPage,
      direction,
      sta,
      props.idShop ? props.idShop : account.id,
      props.idShop ? "IdShop" : "Orderer"
    );
    if (res.data) {
      if (res.data.success) {
        setTotalPages(res.data.data.totalPages);
        setListOrder(res.data.data.data);
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
            SearchOrderOfShopOrUserByStatus(
              config2,
              pageNum,
              perPage,
              direction,
              sta,
              props.idShop ? props.idShop : account.id,
              props.idShop ? "IdShop" : "Orderer"
            ).then((res) => {
              if (res.data) {
                if (res.data.success) {
                  setTotalPages(res.data.data.totalPages);
                  setListOrder(res.data.data.data);
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

  const handleClickDetailBtn = (item) => {
    history.push({
      pathname: `/detailOrder`,
      state: { data: item, role: props.idShop ? "shop" : "customer" },
    });
  };

  const handleClickRadio = (event) => {
    if (event.target.checked) {
      setStatus(event.target.id);
      handleSearchByStatus(curentPage, event.target.id);
    }
  };

  useEffect(() => {
    GetPageOrder(curentPage);
  }, [
    direction,
    //, props.update
  ]);

  return (
    <>
      <div className="list-content-container">
        <div className="title">List {props.idShop ? "" : "Your"} Order</div>
        <div className="list-content-content">
          <div className="col-12 col-sm-4 input-search">
            <input
              className="form-control"
              placeholder="Search order here"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <span onClick={() => handleSearch(1)}>
              <i className="fas fa-search"></i>
            </span>
          </div>
          <div className="group-radio d-flex">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="group-radio"
                id="Confirming"
                onChange={(event) => handleClickRadio(event)}
              ></input>
              <label className="form-check-label" htmlFor="Confirming">
                Confirming
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="group-radio"
                id="Shipping"
                onChange={(event) => handleClickRadio(event)}
              ></input>
              <label className="form-check-label" htmlFor="Shipping">
                Shipping
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="group-radio"
                id="Completed"
                onChange={(event) => handleClickRadio(event)}
              ></input>
              <label className="form-check-label" htmlFor="Completed">
                Completed
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="group-radio"
                id="Cancelled"
                onChange={(event) => handleClickRadio(event)}
              ></input>
              <label className="form-check-label" htmlFor="Cancelled">
                Cancelled
              </label>
            </div>
          </div>
          <div className="custom-table">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Payment Type</th>
                  <th>Total Cost</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Shipping Way</th>
                  <th>
                    <div className="sort-header">
                      <span>Order Date</span>
                      <span>
                        <i
                          className="fa-solid fa-arrow-down-long"
                          onClick={() => handleDirection("desc")}
                        ></i>
                        <i
                          className="fa-solid fa-arrow-up-long"
                          onClick={() => handleDirection("asc")}
                        ></i>
                      </span>
                    </div>
                  </th>
                  <th>Completion Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listOrder &&
                  listOrder.length > 0 &&
                  listOrder.map((item, index) => {
                    return (
                      <tr key={`contents-${index}`}>
                        <td>{item.id}</td>
                        <td>{item.paymentType}</td>
                        <td>{item.totalCost}</td>
                        <td>{item.discount}</td>
                        <td>{item.status}</td>
                        <td>{item.shippingWay}</td>
                        <td>{ConvertDate(item.orderDate)}</td>
                        <td>
                          {item.orderDate < item.completionDate
                            ? ConvertDate(item.completionDate)
                            : "Unfinished"}
                        </td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleClickDetailBtn(item)}
                          >
                            Detail
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
    </>
  );
};

export default TableOrder;
