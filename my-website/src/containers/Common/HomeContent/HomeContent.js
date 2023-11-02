import { useState } from "react";
import { toast } from "react-toastify";
import "./HomeContent.scss";
import {
  GetAllTypeProduct,
  GetPageProduct,
  GetPageProductOfShop,
  SearchProduct,
  SearchProductOfShop,
} from "../../../services/ProductServices";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { GetLocation } from "../../../services/Common";
import { useHistory } from "react-router-dom";

const HomeContent = (props) => {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [curentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(1);
  const [listCity, setListCity] = useState([]);
  const [listType, setListType] = useState([]);
  const [keyWord, setKeyWord] = useState("");
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");
  const [direction, setDirection] = useState("asc");
  const [check, setCheck] = useState(false);

  const getPageProduct = async (pageNum, perPage) => {
    let res = await GetPageProduct(pageNum, perPage);
    if (res.data) {
      if (res.data.success) {
        setList(res.data.data.data);
        setTotalPages(res.data.data.totalPages);
      } else {
        toast.warning("Cann't get product");
      }
    }
  };

  const getPageProductOfShop = async (pageNum, perPage, idShop) => {
    let res = await GetPageProductOfShop(pageNum, perPage, idShop);
    if (res.data) {
      if (res.data.success) {
        setList(res.data.data.data);
        setTotalPages(res.data.data.totalPages);
      } else {
        toast.warning("Cann't get product");
      }
    }
  };

  const GetCity = async () => {
    let res = await GetLocation();

    var list = [];
    res.data.map((item) => {
      list.push(item.Name);
    });
    list.unshift("All");
    setListCity(list);
  };

  const GetAllType = async () => {
    let res = await GetAllTypeProduct();
    var list = res.data.data;
    list.unshift("All");
    setListType(list);
  };

  const handlePageClick = (event) => {
    if (keyWord) {
      handleSearch(+event.selected + 1);
      setCurrentPage(event.selected + 1);
    } else {
      if (props.shop) {
        getPageProductOfShop(+event.selected + 1, perPage, props.shop);
        setCurrentPage(event.selected + 1);
        return;
      }
      getPageProduct(+event.selected + 1, perPage);
      setCurrentPage(event.selected + 1);
    }
  };

  const handleSearch = async (pageNum) => {
    if (keyWord) {
      let ci;
      let ty;
      city === "All" ? (ci = "") : (ci = city);
      type === "All" ? (ty = "") : (ty = type);
      let res;
      if (props.shop) {
        res = await SearchProductOfShop(
          pageNum,
          perPage,
          keyWord,
          ci,
          ty,
          direction,
          props.shop
        );
      } else {
        res = await SearchProduct(pageNum, perPage, keyWord, ci, ty, direction);
      }
      if (res.data) {
        if (res.data.success) {
          setTotalPages(res.data.data.totalPages);
          setList(res.data.data.data);
          setCheck(true);
        } else {
          toast.warning(res.data.message);
        }
      } else {
        toast.error("Error");
      }
    } else {
      setCity("");
      setType("");
      setCheck(false);
      getPageProduct(curentPage, perPage);
    }
  };

  useEffect(() => {
    GetCity();
    GetAllType();
    if (props.shop) {
      getPageProductOfShop(curentPage, perPage, props.shop);
      return;
    }
    getPageProduct(curentPage, perPage);
  }, []);

  useEffect(() => {
    if (keyWord) {
      handleSearch(curentPage);
    }
  }, [city, type, direction]);

  return (
    <>
      <div className="filter">
        <div className="search col-4">
          <input
            type="text"
            className="form-control"
            value={keyWord}
            onChange={(event) => setKeyWord(event.target.value)}
          />
          <i className="fas fa-search" onClick={() => handleSearch(1)}></i>
        </div>
        {check && (
          <>
            <div className="col-3">
              <select
                className="form-select"
                aria-label=".form-select-sm example"
                onChange={(event) => setCity(event.target.value)}
              >
                {listCity.map((item) => {
                  return <option key={`city-${item}`}>{item}</option>;
                })}
              </select>
            </div>
            <div className="col-3">
              <select
                className="form-select"
                onChange={(event) => setType(event.target.value)}
              >
                {listType.map((item, index) => {
                  return <option key={`product-${index}`}>{item}</option>;
                })}
              </select>
            </div>
            <div className="col-1">
              <i
                className="fa-solid fa-arrow-down-long mx-1"
                onClick={() => setDirection("desc")}
              ></i>
              <i
                className="fa-solid fa-arrow-up-long"
                onClick={() => setDirection("asc")}
              ></i>
            </div>
          </>
        )}
      </div>

      <div className="home-container">
        {list &&
          list.map((item, index) => {
            return (
              <div
                className="single-product"
                key={`prd-${index}`}
                onClick={() =>
                  history.push({
                    pathname: `/product`,
                    state: { data: item },
                  })
                }
              >
                <div>
                  <img
                    src={item.img && "data:image/*;base64," + item.img[0]}
                  ></img>
                </div>
                <div className="content">
                  <div className="title">
                    <span>{item.name}</span>
                  </div>
                  <div className="price my-1">
                    <i className="fas fa-dollar-sign"></i>
                    {new Intl.NumberFormat("de-DE").format(item.price)}
                  </div>
                  <div className="address">
                    <i className="fas fa-map-marker-alt"></i>
                    {item.address}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
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
    </>
  );
};

export default HomeContent;
