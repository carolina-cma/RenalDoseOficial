import React from "react";
import { Modal, Button } from "react-bootstrap";

interface RegisterSuccessModalProps {
  show: boolean;
  handleClose: () => void;
}

const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Registro Exitoso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Se ha sido registrada exitosamente.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterSuccessModal;
