import { Modal } from "react-bootstrap";
import "./ModalSelectShippingWay.scss";

const ModalSelectShippingWay = (props) => {
  return (
    <>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Shipping Way</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="ship-w d-flex"
            onClick={() => props.selectShipWay("Fast")}
          >
            <b>Fast</b>
            <p>{new Intl.NumberFormat("de-DE").format(25000)}₫</p>
          </div>
          <div
            className="ship-w d-flex"
            onClick={() => props.selectShipWay("Express")}
          >
            <b>Express</b>
            <p>{new Intl.NumberFormat("de-DE").format(50000)}₫</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalSelectShippingWay;
