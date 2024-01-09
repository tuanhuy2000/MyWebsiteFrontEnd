import "./ListUser.scss";
import { useEffect, useState } from "react";
import {
  SearchUser,
  deleteUserById,
  getPageUser,
} from "../../../services/UserServices";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Button, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { RenewToken, getCookie } from "../../../services/Common";
import ReactPaginate from "react-paginate";
import { useDispatch } from "react-redux";
import { handleLogoutRedux } from "../../../redux/actions/userAction";

const ListUser = () => {
  const history = useHistory();
  const [listUser, setListUser] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [userDetele, setUserDelete] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [direction, setDirection] = useState("asc");
  const [keyword, setKeyword] = useState("");
  const [curentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(1);
  const dispatch = useDispatch();

  const GetPageUser = async (pageNum, perPage, direction) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await getPageUser(config, pageNum, perPage, direction);
    if (res.data && res.data.data.data.length > 0) {
      setTotalPages(res.data.data.totalPages);
      setListUser(res.data.data.data);
    } else {
      if (+res === 401) {
        RenewToken().then((token) => {
          if (token) {
            document.cookie = "Token=" + token + ";";
            const config2 = {
              headers: { Authorization: `Bearer ${token}` },
            };
            getPageUser(config2, pageNum, perPage, direction).then((res) => {
              if (res.data && res.data.data.data.length > 0) {
                setTotalPages(res.data.data.totalPages);
                setListUser(res.data.data.data);
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

  const handleDeleteUser = async (id) => {
    const config = {
      headers: { Authorization: `Bearer ${getCookie("Token")}` },
    };
    let res = await deleteUserById(config, id);
    if (res.data) {
      if (res.data.success) {
        toast.success(res.data.message);
        setIsShowModal(false);
        GetPageUser(curentPage, perPage, direction);
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
            deleteUserById(config2, id).then((res) => {
              if (res.data) {
                setIsShowModal(false);
                GetPageUser(curentPage, perPage, direction);
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

  const handleClose = () => {
    setIsShowModal(false);
  };

  const handleClickDeleteBtn = (item) => {
    setIsShowModal(true);
    setUserDelete(item);
  };

  const handlePageClick = (event) => {
    if (keyword) {
      handleSearch(+event.selected + 1);
      setCurrentPage(event.selected + 1);
    } else {
      GetPageUser(+event.selected + 1, perPage, direction);
      setCurrentPage(event.selected + 1);
    }
  };

  const handleSearch = async (pageNum) => {
    if (keyword) {
      const config = {
        headers: { Authorization: `Bearer ${getCookie("Token")}` },
      };
      let res = await SearchUser(config, pageNum, perPage, direction, keyword);
      if (res.data && res.data.data.data.length > 0) {
        setTotalPages(res.data.data.totalPages);
        setListUser(res.data.data.data);
      } else {
        if (+res === 401) {
          RenewToken().then((token) => {
            if (token) {
              document.cookie = "Token=" + token + ";";
              const config2 = {
                headers: { Authorization: `Bearer ${token}` },
              };
              SearchUser(config2, pageNum, perPage, direction, keyword).then(
                (res) => {
                  if (res.data && res.data.data.data.length > 0) {
                    setTotalPages(res.data.data.totalPages);
                    setListUser(res.data.data.data);
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
    } else {
      GetPageUser(pageNum, perPage, direction);
    }
  };

  const handleDirection = (tmp) => {
    setDirection(tmp);
    setKeyword("");
  };

  useEffect(() => {
    GetPageUser(curentPage, perPage, direction);
  }, [direction]);

  return (
    <>
      <div className="list-user-container">
        <div className="title">List User</div>
        <div className="list-user-content">
          <div className="col-12 col-sm-4 my-3 input-search">
            <input
              className="form-control"
              placeholder="Search user here"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <span onClick={() => handleSearch(1)}>
              <i className="fas fa-search"></i>
            </span>
          </div>
          <div className="custom-table">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>
                    <div className="sort-header">
                      <span>STT</span>
                    </div>
                  </th>
                  <th>Email</th>
                  <th>
                    <div className="sort-header">
                      <span>Name</span>
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
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listUser &&
                  listUser.length > 0 &&
                  listUser.map((item, index) => {
                    return (
                      <tr key={`users-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.email}</td>
                        <td>{item.name}</td>
                        <td>{item.phoneNumber}</td>
                        <td>
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
            marginPagesDisplayed={1}
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
      <Modal show={isShowModal} onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Delete user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            You want to delete user <b>{userDetele.name}</b> ???
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteUser(userDetele.id)}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ListUser;
