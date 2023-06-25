import React, { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Select from "react-select";

const ContainersModal = ({
	portTerm,
	port,
	openModal,
	setOpenModal,
	selectedValue,
	setSelectedValue,
	register,
}) => {
	const [defaultValue, setDefaultValue] = useState("");
	const [singleSelectValue, setSingleSelectValue] = useState("");

	const handleCloseModal = () => {
		setOpenModal(false);
		setSingleSelectValue("");
	};

	useEffect(() => {
		console.log("New values", selectedValue);
	}, [selectedValue]);

	const handleConfirmSelected = () => {
		if (singleSelectValue) {
			handleCloseModal();
			setSelectedValue([...selectedValue, singleSelectValue]);
		}
	};

	return (
		<>
			<Modal open={openModal} onClose={handleCloseModal} center>
				<div className='row flex-column'>
					<div className='row'>
						<div className='col-6'>
							<label className='control-label has-error-label'>
								POD Port Code
							</label>
							<Select
								{...register("DynamicModel[PODPortCode]", {
									required: "POD Port Code cannot be blank.",
								})}
								options={port}
								onChange={(singleData) => setSingleSelectValue(singleData)}
								defaultValue={defaultValue}
							/>
						</div>
						<div className='col-6'>
							<label className='control-label has-error-label'>
								POD Port Term
							</label>
							<Select
								{...register("DynamicModel[PODPortTerm]", {
									required: "POD Port Term cannot be blank.",
								})}
								options={port}
								onChange={(singleData) => setSingleSelectValue(singleData)}
								defaultValue={defaultValue}
							/>
						</div>
					</div>

					<div className='d-flex justify-content-end mt-3'>
						<button
							className='btn btn-success mr-2'
							onClick={handleConfirmSelected}>
							confirm
						</button>
						<button className='btn btn-danger' onClick={handleCloseModal}>
							cancel
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ContainersModal;
