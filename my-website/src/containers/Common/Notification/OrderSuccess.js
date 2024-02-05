import { useHistory } from "react-router-dom";
import "./OrderSuccess.scss";

const OrderSuccess = () => {
  const history = useHistory();
  return (
    <>
      <div className="container-noti">
        <div className="title">Order Success</div>
        <div onClick={() => history.push(`/`)} className="btn">
          Go to home page
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
