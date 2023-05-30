import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const RemoveModal = ({ open, setOpen, selectedValue, setSelectedValue }) => {
  const handleCloseModal = () => {
    setOpen(false);
  };

  let id = sessionStorage.getItem("id");

  const handleRemove = (id) => {
    // let removeItem = selectedValue.indexOf(id);
    // console.log("item", removeItem);
    // selectedValue.splice(removeItem, 1);
    // handleCloseModal();
    // sessionStorage.removeItem("id");
  };
  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <div className="p-5">
          <h3 className="text-md">Remove</h3>
          <p className="text-sm">Are you sure you to remove ?</p>

          <div className="btn-container d-flex align-items-center justify-content-end">
            <button
              className="remove-item-btn btn btn-success"
              onClick={handleRemove(id)}
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
