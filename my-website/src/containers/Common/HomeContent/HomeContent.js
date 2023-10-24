import { useState } from "react";
import "./HomeContent.scss";

const HomeContent = () => {
  const [data, setData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  return (
    <>
      <div className="blogs-container">
        {data.map((item, index) => {
          return (
            <div className="single-blog" key={`prd-${index}`}>
              <div className="title">
                <span>Title</span>
              </div>
              <div className="content">dasdsadsadasdasdasdasd</div>
              <div className="btn-detail">
                {/* <Link to={`blog/${item.id}`}>
                  <button type="button">Detail</button>
                </Link> */}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HomeContent;
