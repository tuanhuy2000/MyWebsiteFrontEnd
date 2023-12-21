import { Modal } from "react-bootstrap";
import "./ModalSelectPaymentType.scss";

const ModalSelectPaymentType = (props) => {
  return (
    <>
      <Modal show={props.isShowModal} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Payment Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="p-type d-flex"
            onClick={() => props.selectPaymentType("Cash")}
          >
            <i className="fas fa-coins"></i>
            <p>Cash</p>
          </div>
          <div
            className="p-type d-flex"
            onClick={() => props.selectPaymentType("Credit Card")}
          >
            <i className="far fa-credit-card"></i>
            <p>Credit Card</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalSelectPaymentType;
