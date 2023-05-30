import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Select from "react-select";

const ContainersModal = ({
  port,
  openModal,
  setOpenModal,
  selectedValue,
  setSelectedValue,
}) => {
  const [defaultValue, setDefaultValue] = useState("");
  const [singleSelectValue, setSingleSelectValue] = useState("");

  const handleCloseModal = () => {
    setOpenModal(false);
    setSingleSelectValue("");
  };

  const handleConfirmSelected = () => {
    if (singleSelectValue) {
      setSelectedValue([...selectedValue, singleSelectValue]);
    }
    handleCloseModal();
  };

  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal} center>
        <div className="row flex-column">
          <Select
            options={port}
            onChange={(singleData) => setSingleSelectValue(singleData)}
            defaultValue={defaultValue}
          />
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-success mr-2"
              onClick={handleConfirmSelected}
            >
              confirm
            </button>
            <button className="btn btn-danger" onClick={handleCloseModal}>
              cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ContainersModal;
