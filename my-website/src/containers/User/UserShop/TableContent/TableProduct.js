import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./TableContent.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetLocation } from "../../../../services/Common";
import {
  GetAllTypeProduct,
  GetImgByIdProduct,
  SearchProductOfUserByAddress,
  SearchProductOfUserByName,
  SearchProductOfUserByType,
  getPageProductByIdUser,
} from "../../../../services/ProductServices";
import ModalDelete from "../Modal/ModalDelete";
import ModalAddProduct from "../Modal/ModalAdd/ModalAddProduct";

const TableProduct = (props) => {
  const [listProduct, setListProduct] = useState([]);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [isShowModalChange, setIsShowModalChange] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [direction, setDirection] = useState("asc");
  const [keyword, setKeyword] = useState("");
  const [curentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  const account = useSelector((state) => state.user.account);
  const [dataModify, setDataModify] = useState({});
  const [img1, setImg1] = useState();
  const [img2, setImg2] = useState();
  const [img3, setImg3] = useState();
  const [col, setCol] = useState("Name");
  const [listCity, setListCity] = useState([]);
  const [listType, setListType] = useState([]);
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const GetCity = async () => {
    let res = await GetLocation();
    setListCity(res.data);
  };

  const GetAllType = async () => {
    let res = await GetAllTypeProduct();
    setListType(res.data.data);
  };

  const handleClose = () => {
    setIsShowModalDelete(false);
    setIsShowModalChange(false);
  };

  const GetPageProduct = async (col, pageNum, perPage, direction) => {
    let res = await getPageProductByIdUser(
      col,
      pageNum,
      perPage,
      direction,
      account.id
    );
    if (res.data && res.data.data.data.length > 0) {
      setTotalPages(res.data.data.totalPages);
      setListProduct(res.data.data.data);
    }
  };

  const handleClickDeleteBtn = (item) => {
    setDataModify(item);
    setIsShowModalDelete(true);
  };

  const handleClickChangeBtn = (item) => {
    setDataModify(item);
    GetImg(item.id);
    setIsShowModalChange(true);
  };

  const handlePageClick = (event) => {
    if (keyword) {
      handleSearch(+event.selected + 1);
      setCurrentPage(event.selected + 1);
      return;
    }
    if (city) {
      handleChangeCity(+event.selected + 1);
      setCurrentPage(event.selected + 1);
      return;
    }
    if (type) {
      handleChangeType(+event.selected + 1);
      setCurrentPage(event.selected + 1);
      return;
    }
    GetPageProduct(col, +event.selected + 1, perPage, direction);
    setCurrentPage(event.selected + 1);
  };

  const handleSearch = async (pageNum) => {
    if (keyword) {
      let res = await SearchProductOfUserByName(
        pageNum,
        perPage,
        direction,
        keyword,
        account.id
      );
      if (res.data && res.data.data.data.length > 0) {
        setTotalPages(res.data.data.totalPages);
        setListProduct(res.data.data.data);
      }
    } else {
      GetPageProduct(col, pageNum, perPage, direction);
    }
  };

  const handleDirection = (tmp, col) => {
    setDirection(tmp);
    setCol(col);
    setKeyword("");
    setCity("");
    setType("");
  };

  const GetImg = async (id) => {
    let res = await GetImgByIdProduct(id);
    var count = 1;
    setImg1("");
    setImg2("");
    setImg3("");
    if (res.data.success) {
      res.data.data.map((item) => {
        switch (count) {
          case 1:
            setImg1(item);
            count++;
            break;
          case 2:
            setImg2(item);
            count++;
            break;
          case 3:
            setImg3(item);
            count++;
            break;
          default:
            break;
        }
      });
    }
  };

  const GetPageAfterChange = () => {
    GetPageProduct(col, curentPage, perPage, direction);
    props.UpdateAfterDelete();
  };

  const handleChangeCity = async (pageNum) => {
    let res = await SearchProductOfUserByAddress(
      pageNum,
      perPage,
      direction,
      city,
      account.id
    );
    if (res.data) {
      setTotalPages(res.data.data.totalPages);
      setListProduct(res.data.data.data);
    }
  };

  const handleChangeType = async (pageNum) => {
    let res = await SearchProductOfUserByType(
      pageNum,
      perPage,
      direction,
      type,
      account.id
    );
    if (res.data) {
      setTotalPages(res.data.data.totalPages);
      setListProduct(res.data.data.data);
    }
  };

  useEffect(() => {
    if (city) {
      handleChangeCity(1);
      setType("");
      setKeyword("");
    }
    if (type) {
      handleChangeType(1);
      setCity("");
      setKeyword("");
    }
  }, [city, type]);

  useEffect(() => {
    GetPageProduct(col, curentPage, perPage, direction);
  }, [direction, props.update]);

  useEffect(() => {
    GetCity();
    GetAllType();
  }, []);

  return (
    <>
      <div className="list-content-container">
        <div className="title">List Product</div>
        <div className="list-content-content">
          <div className="col-12 col-sm-4 input-search">
            <input
              className="form-control"
              placeholder="Search product here"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <span onClick={() => handleSearch(1)}>
              <i className="fas fa-search"></i>
            </span>
          </div>
          <div className="mb-3 col-12 col-sm-4">
            <label className="form-label">City</label>
            <select
              className="form-select mb-3"
              aria-label=".form-select-sm example"
              onChange={(event) => setCity(event.target.value)}
            >
              {listCity.map((item) => {
                return <option key={item.Id}>{item.Name}</option>;
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
                return <option key={`product-${index}`}>{item}</option>;
              })}
            </select>
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
                  <th>
                    <div className="sort-header">
                      <span>Name</span>
                      <span>
                        <i
                          className="fa-solid fa-arrow-down-long"
                          onClick={() => handleDirection("desc", "Name")}
                        ></i>
                        <i
                          className="fa-solid fa-arrow-up-long"
                          onClick={() => handleDirection("asc", "Name")}
                        ></i>
                      </span>
                    </div>
                  </th>
                  <th>
                    <div className="sort-header">
                      <span>Price</span>
                      <span>
                        <i
                          className="fa-solid fa-arrow-down-long"
                          onClick={() => handleDirection("desc", "Price")}
                        ></i>
                        <i
                          className="fa-solid fa-arrow-up-long"
                          onClick={() => handleDirection("asc", "Price")}
                        ></i>
                      </span>
                    </div>
                  </th>
                  <th>Quantity</th>
                  <th>Information</th>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listProduct &&
                  listProduct.length > 0 &&
                  listProduct.map((item, index) => {
                    return (
                      <tr key={`contents-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.information}</td>
                        <td>{item.address}</td>
                        <td>{item.type}</td>
                        <td>
                          <button
                            className="btn btn-warning"
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
            nextLabel="next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            previousLabel="previous"
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
        type={"product"}
        data={dataModify}
        GetPageAfterChange={GetPageAfterChange}
      />
      <ModalAddProduct
        isShowModal={isShowModalChange}
        handleClose={handleClose}
        type={"change"}
        data={
          dataModify.name ? dataModify : { name: "", price: "", quantity: "" }
        }
        img1={img1}
        img2={img2}
        img3={img3}
        GetPageAfterChange={GetPageAfterChange}
      />
    </>
  );
};

export default TableProduct;
