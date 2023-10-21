import { Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import "./TableContent.scss";
import { useState } from "react";

const TableOrder = (props) => {
  const [listOrder, setListOrder] = useState([]);
  return (
    <>
      <div className="list-content-container">
        <div className="title">List Order</div>
        <div className="list-content-content">
          <div className="col-12 col-sm-4 input-search">
            <input
              className="form-control"
              placeholder="Search order here"
              //value={keyword}
              //onChange={(event) => setKeyword(event.target.value)}
            />
            <span
            //onClick={() => handleSearch(1)}
            >
              <i className="fas fa-search"></i>
            </span>
          </div>
          <div className="custom-table">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>
                    <div className="sort-header">
                      <span>ID</span>
                    </div>
                  </th>
                  <th>Email</th>
                  <th>
                    <div className="sort-header">
                      <span>Name</span>
                      <span>
                        <i
                          className="fa-solid fa-arrow-down-long"
                          //onClick={() => handleDirection("desc")}
                        ></i>
                        <i
                          className="fa-solid fa-arrow-up-long"
                          //onClick={() => handleDirection("asc")}
                        ></i>
                      </span>
                    </div>
                  </th>
                  <th>Phone Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listOrder &&
                  listOrder.length > 0 &&
                  listOrder.map((item, index) => {
                    return (
                      <tr key={`contents-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.email}</td>
                        <td>{item.name}</td>
                        <td>{item.phoneNumber}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            //onClick={() => handleClickDeleteBtn(item)}
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
            //onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            //pageCount={totalPages}
            pageCount={1}
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
    </>
  );
};

export default TableOrder;
