import React, {useState, useEffect} from "react";

import Select from "react-select";
import {Collapse} from "react-collapse";

export default function PODListItem(props) {
	const [isApplyDD, setIsApplyDD] = useState(false);
	const [isDDCombined, setIsDDCombined] = useState(false);

	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		console.log("POD Item", props);
	}, [props]);

	return (
		<div className='card lvl2'>
			<div className='card-header'>
				<h3 className='card-title'>{props.item.label}-POD</h3>
				<div className='card-tools'>
					<button
						type='button'
						className='btn btn-tool'
						onClick={() => setIsOpen(!isOpen)}>
						<i className={`fas ${isOpen ? "fa-minus" : "fa-plus"}`}></i>
					</button>
				</div>
			</div>
			<Collapse isOpened={isOpen}>
				<div className='card-body'>
					<>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>POD Port Code</label>
									<Select options={[]} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Area</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Terminal Code</label>
									<Select options={[]} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Terminal Name</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Port Term</label>
									<Select options={[]} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Freight Term</label>
									<Select options={[]} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Terminal Handler ROC</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Terminal Handler Company</label>
									<Select options={[]} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>
										Terminal Handler Branch Code
									</label>
									<Select options={[]} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>
										Terminal Handler Branch Name
									</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Req ETA</label>
									<input className={"form-control"} readOnly={false} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Voyage Num</label>
									<Select options={[]} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Voyage Name</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Vessel Code</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Vessel Name</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>POL ETA</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>POL ETD</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>POL SCN Code</label>
									<input className={"form-control"} readOnly={false} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Closing Date Time</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>POD ETA</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>POD ETD</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>POD SCN Code</label>
									<input className={"form-control"} readOnly={false} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Ship Op ROC</label>
									<input className={"form-control"} readOnly={false} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Ship Op Company Name</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Ship Op Branch Code</label>
									<input className={"form-control"} readOnly={false} />
								</div>
							</div>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Ship Op Branch Name</label>
									<input className={"form-control"} readOnly={true} />
								</div>
							</div>
						</div>
						<div class='col-12'>
							<div class='form-group '>
								<input type='checkbox' class='mt-1 ' id='autobilling' />
								<label for='autobilling' class='mb-1 ml-1'>
									Auto Billing
								</label>
							</div>
						</div>
						<div class='col-12'>
							<div class='form-group '>
								<input type='checkbox' class='mt-1 ' id='insist-transhipment' />
								<label for='insist-transhipment' class='mb-1 ml-1'>
									Insist Transhipment
								</label>
							</div>
						</div>
						<div class='col-12'>
							<div class='form-group '>
								<input
									type='checkbox'
									class='mt-1 '
									id='apply-d-d'
									checked={isApplyDD}
									onChange={() => setIsApplyDD(!isApplyDD)}
								/>
								<label for='apply-d-d' class='mb-1 ml-1'>
									Apply D&D
								</label>
							</div>
						</div>
						{isApplyDD && (
							<>
								<div class='col-12'>
									<div class='form-group ml-5'>
										<input
											type='checkbox'
											class='mt-1 '
											id='d-d-combined'
											checked={isDDCombined}
											onChange={() => setIsDDCombined(!isDDCombined)}
										/>
										<label for='d-d-combined' class='mb-1 ml-1'>
											D&D Combined
										</label>
									</div>
								</div>
								{isDDCombined ? (
									<div class='col-6'>
										<div class='form-group ml-5'>
											<div class='form-group'>
												<label class='control-label'>D&D Combine Day</label>
												<input
													type='number'
													className={"form-control"}
													readOnly={false}
												/>
											</div>
										</div>
									</div>
								) : (
									<div class='col-12'>
										<div className='row ml-5'>
											<div class='col-6'>
												<div class='form-group '>
													<div class='form-group'>
														<label class='control-label'>Detention(days)</label>
														<input
															type='number'
															className={"form-control"}
															readOnly={false}
														/>
													</div>
												</div>
											</div>

											<div class='col-6'>
												<div class='form-group '>
													<div class='form-group'>
														<label class='control-label'>Demurrage(days)</label>
														<input
															type='number'
															className={"form-control"}
															readOnly={false}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</>
						)}
						<div className='row'>
							<div className='col-6'>
								<div class='form-group'>
									<label class='control-label'>Agency Company</label>
									<Select options={[]} />
								</div>
							</div>
						</div>
					</>
				</div>
			</Collapse>
		</div>
	);
}
