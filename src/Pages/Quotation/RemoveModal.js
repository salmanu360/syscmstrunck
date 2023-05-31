import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const RemoveModal = ({ open, setOpen, selectedValue, setSelectedValue }) => {
  const [state, setState] = useState("");

  const handleCloseModal = () => {
    setOpen({
      ...open,
      isShow: false,
    });
  };

  const handleRemove = () => {
    setState("remove");
  };

  useEffect(() => {
    if (state === "remove") {
      let valuesArray = [...selectedValue];
      let deleteObj = valuesArray.splice(open.isRemove, 1);
      setSelectedValue(valuesArray);
      handleCloseModal();
      setState("");
    }
  }, [state]);

  return (
    <>
      <Modal open={open.isShow} onClose={handleCloseModal}>
        <div className="p-5">
          <h3 className="text-md">Remove</h3>
          <p className="text-sm">Are you sure you to remove ?</p>

          <div className="btn-container d-flex align-items-center justify-content-end">
            <button
              className="remove-item-btn btn btn-success"
              onClick={handleRemove}
            >
              Confirm
            </button>
            <button
              className="remove-item-btn btn btn-danger"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RemoveModal;
