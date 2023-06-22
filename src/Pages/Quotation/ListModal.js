import React, {useEffect, useState} from "react";
import "react-responsive-modal/styles.css";
import {Modal} from "react-responsive-modal";

const ListModal = ({
	isListModal,
	setIsListModal,
	selectedValue,
	setSelectedValue,
}) => {
	const [selectId, setSelectId] = useState([]);
	const [selectAll, setSelectAll] = useState(true);

	const handleCloseModal = () => {
		setIsListModal(false);
	};

	const handleRadioChange = (id) => {
		if (selectId.includes(id)) {
			setSelectId(selectId.filter((selectedId) => selectedId !== id));
		} else {
			setSelectId([...selectId, id]);
		}
	};

	// console.log("selectId", selectId);

	const handleDelete = () => {
		if (selectAll) {
			setSelectedValue([]);
		} else {
			const updatedData = selectedValue.filter(
				(item) => !selectId.includes(item.value)
			);
			// console.log("updateDate", updatedData);
			setSelectedValue(updatedData);
			setSelectId([]);
		}
		handleCloseModal();
	};

	return (
		<>
			{selectedValue.length > 0 ? (
				<Modal open={isListModal} onClose={handleCloseModal} center>
					<div className='d-flex flex-column'>
						<div className='check-list'>
							<label className='d-flex items-center'>
								<input
									type='checkbox'
									checked={selectAll ? true : false}
									onChange={() => setSelectAll(!selectAll)}
								/>
								select all
							</label>
							{selectedValue
								? selectedValue?.map((item, index) => {
										return (
											<label className='d-flex items-center' key={index}>
												<input
													type='checkbox'
													checked={
														selectAll ? true : selectId.includes(item.value)
													}
													onChange={() => handleRadioChange(item.value)}
												/>
												{item.label}
											</label>
										);
								  })
								: null}
						</div>
						<div className='btn-container d-flex align-items-center justify-content-end'>
							<button
								className='remove-item-btn btn btn-success mr-2'
								onClick={handleDelete}>
								Confirm
							</button>
							<button
								className='remove-item-btn btn btn-danger'
								onClick={handleCloseModal}>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
			) : (
				<Modal open={isListModal} onClose={handleCloseModal} center>
					<div className='d-flex flex-column align-items-end'>
						<h2 className='text-lg text-danger'>
							please select tag then continoue
						</h2>
						<button
							className='remove-item-btn btn btn-danger mt-2'
							onClick={handleCloseModal}>
							Cancel
						</button>
					</div>
				</Modal>
			)}
		</>
	);
};

export default ListModal;
