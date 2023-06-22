import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, createCookie, UpdateData,sortArray, ToastNotify,toThreeDecimalPlaces,checkOnlyNumber, CheckVoyageEffectedDocument, ControlOverlay, getVesselById, GetAllDropDown, getCookie, getAreaById, getPortDetails, CheckVoyage, GetRoutePointByRouteId, getPortDetailsById, initHoverSelectDropownTitle } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $, { error } from "jquery";
import axios from "axios"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
    useParams,
    useNavigate
} from "react-router-dom";


function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [terminal, setTerminal] = useState([])
    const [port, setPort] = useState([])
    const [vessel, setVessel] = useState([])
    const [checkVoyageUsed, setCheckVoyageUsed] = useState(false)
    const [route, setRoute] = useState([])
    const [checkWestDisabled, setCheckWestDisabled] = useState(false)
    const [storeData, setStoreData] = useState("")
    const [cookies, setCookies] = useState([])
    const bargeUUID = "----07039c85-63e7-11ed-ad61-7446a0a8dedc";

    const [requiredStateTues, setRequiredStateTues] = useState({  });
    const [requiredStateWeight, setRequiredStateWeight] = useState({  });

    const [quickAddState, setQuickAddState] = useState(false);
      




    var VoyageScheduleColumn = [
        { columnName: "Port Code", inputType: "single-select", defaultChecked: true, name: "PortCode", fieldClass: "getPortCode", options: port, class: "", onChange: handleChangePortCode, requiredField: true },
        { columnName: "Area", inputType: "input", defaultChecked: false, name: "Area", class: "d-none", fieldClass: "area", readOnly: true },
        { columnName: "Terminal Code", inputType: "single-select", defaultChecked: true, name: "LocationCode", class: "", fieldClass: "getTerminalCode", options: terminal, onChange: handleChangeTerminalCode },
        { columnName: "Terminal Name", inputType: "input", defaultChecked: false, name: "TerminalName", class: "d-none", readOnly: true },
        { columnName: "Route Point Description", inputType: "input", defaultChecked: false, name: "RoutePointDescription", class: "d-none", fieldClass: "getRoutePointDescription" },
        { columnName: "SCN Code", inputType: "input", defaultChecked: true, name: "SCNCode", class: "", requiredField: true, fieldClass: "SCNCode" },
        { columnName: "Closing Date Time", inputType: "date-time", defaultChecked: true, name: "ClosingDateTime", fieldClass: "Closingdatetime", class: "", requiredField: true },
        { columnName: "ETA", inputType: "date-time", defaultChecked: true, name: "ETA", fieldClass: "Eta", class: "", requiredField: true },
        { columnName: "ATA", inputType: "date-time", defaultChecked: false, name: "ATA", class: "d-none" },
        { columnName: "Berthing Date", inputType: "date-time", defaultChecked: false, name: "BerthingDate", class: "d-none" },
        { columnName: "Discharge Date", inputType: "date-time", defaultChecked: false, name: "DischargeDate", class: "d-none" },
        { columnName: "Complete Discharge Date", inputType: "date-time", defaultChecked: false, name: "CompleteDischargeDate", class: "d-none" },
        { columnName: "Loading Date", inputType: "date-time", defaultChecked: false, name: "LoadingDate", class: "d-none" },
        { columnName: "Complete Loading Date", inputType: "date-time", defaultChecked: false, name: "CompleteLoadingDate", class: "d-none" },
        { columnName: "ETD", inputType: "date-time", defaultChecked: true, name: "ETD", class: "", fieldClass: "Etd", requiredField: true },
        { columnName: "ATD", inputType: "date-time", defaultChecked: false, name: "ATD", class: "d-none" },
        { columnName: "Tues", inputType: "input", defaultChecked: true, name: "Tues", class: "",fieldClass:"inputDecimalThreePlaces" },
        { columnName: "Weight(kg)", inputType: "input", defaultChecked: true, name: "Weight", class: "", fieldClass: "inputDecimalThreePlaces" },
        { columnName: "Description", inputType: "input", defaultChecked: false, name: "Description", class: "d-none" },

    ]

    if (getCookie('voyagecolumn')) {
        var getCookieArray = getCookie('voyagecolumn');
        var getCookieArray = JSON.parse(getCookieArray);

        $.each(VoyageScheduleColumn, function (key, value) {
            value.defaultChecked = false
            value.class = "d-none"
        })

        $.each(getCookieArray, function (key, value) {
            $.each(VoyageScheduleColumn, function (key2, value2) {

                if (value == key2) {
                    value2.defaultChecked = true
                    value2.class = ""
                }
            })
        })
    }

    const { register, handleSubmit, setValue, trigger, getValues, reset,unregister, control,clearErrors, watch,setError, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            VoyageSchedule: [{ "Name": 'VoyageSchedule', "PortCode": "", "Charges": VoyageScheduleColumn }]
        }

    });
    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        update,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "VoyageSchedule"
    });

    function handleClearTableData() {
        remove()
        $(".add-container").click()
    }

    
    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key === "ArrowDown") {
            if($(Closest).hasClass("Readonly")){
                event.preventDefault()
            }
        }
      
    }

    //onchange port code
    function handleChangePortCode(val, index) {
        if (val) {
            var DefaultValue;
            setQuickAddState(false)
            getAreaById(val.value, globalContext).then(res => {

              
                // setValue(`VoyageSchedule[${index}][Area]`, res.Area)
               if(res.Region=="West"){
                setError(`VoyageSchedule[${index}][Tues]`, {type:"required",message:"required"});
                setError(`VoyageSchedule[${index}][Weight]`,{type:"required",message:"required" });
 
                setRequiredStateTues({ ...requiredStateTues, [`VoyageSchedule[${index}][Tues]`]: true });
                setRequiredStateWeight({ ...requiredStateWeight, [`VoyageSchedule[${index}][Weight]`]: true });

               }else{
                clearErrors(`VoyageSchedule[${index}][Tues]`)
                clearErrors(`VoyageSchedule[${index}][Weight]`)
                setRequiredStateTues({ ...requiredStateTues, [`VoyageSchedule[${index}][Tues]`]: false });
                setRequiredStateWeight({ ...requiredStateWeight, [`VoyageSchedule[${index}][Weight]`]: false });

               }
                $(`input[name='VoyageSchedule[${index}][Area]']`).val(res.Area).trigger("change")
                // $(`input[name='VoyageSchedule[${index}][Area]']`).trigger('change')

            })

   
        }
        else {
            setValue(`VoyageSchedule[${index}][Area]`, "")
            setValue(`VoyageSchedule[${index}][LocationCode]`, "")
            setValue(`VoyageSchedule[${index}][TerminalName]`, "")

        }

    }
    
    useEffect(() => {
      return () => {
      
      }
    }, [quickAddState])
    
    
    useEffect(() => {
        trigger()
        toThreeDecimalPlaces()
        checkOnlyNumber()

        initHoverSelectDropownTitle()
        if(state){
            if (state.formType == "Update" || state.formType == "Clone") {
           

            } else {
    
                if (fields.length > 0) {
                    fields[0].Charges[0].options = port
                }
    
    
    
    
            }
        }
   

        return () => {

        }
    }, [fields])


    function handleChangeTerminalCode(val, index) {
        if (val) {
            getPortDetailsById(val.value, globalContext).then(res => {
                setValue(`VoyageSchedule[${index}][TerminalName]`, res.data.PortName)

            })
        }
        else {
            setValue(`VoyageSchedule[${index}][TerminalName]`, "")
        }


    }
    function handleChangeVessel(val) {
        if (val) {
            getVesselById(val.value, globalContext).then(res => {
                var Tues = res.data.CargoCapacity
                var Weight = res.data.LoadingWeight
                var storeDataString = 'Maximum Tues: ' + parseFloat(Tues).toFixed(2) + ' <br> Maximum Weight:' + parseFloat(Weight).toFixed(2) + '';
                setStoreData(storeDataString)
            })
        }
    }

    function handleChangeRoute(val) {
        if (val) {
            var arrayDynamic2 = []
            setQuickAddState(true)
            GetRoutePointByRouteId(val.value, globalContext).then(res => {

                if (res.data) {
                    $.each(res.data[0].routePoints, function (key, value) {
                        var newValue={...value}
                        var NewVoyageScheduleColumn=VoyageScheduleColumn.map(obj => ({ ...obj }));
                        var PortDetailsSelection=[]

                        if(value.portDetails.length>0){
                            $.each(value.portDetails, function (key2, value2) {
                                PortDetailsSelection.push({"value":value2.PortDetailsUUID,"label":value2.PortName})
                            })
                        }
                        newValue.Name = "VoyageSchedule";
                        NewVoyageScheduleColumn[0].options = port
                        NewVoyageScheduleColumn[2].options = sortArray(PortDetailsSelection)
                        newValue.Charges = NewVoyageScheduleColumn;
                        newValue.Area = newValue.portCode.Area
                        if(newValue.portCode.Region=="West"){
                            newValue.Charges[16].requiredField=true
                            newValue.Charges[17].requiredField=true
                            
                        }else{
                            newValue.Charges[16].requiredField=false
                            newValue.Charges[17].requiredField=false
                        }
                        if (newValue.locationCode) {
                            newValue.TerminalName = newValue.locationCode.PortName
                        }
                        arrayDynamic2.push(newValue);

                   


                    })
                    remove()
                    append(arrayDynamic2)
                    update(fields)
                    
                }
               
              
            })
        }
    }

    function handlingClosingDatetime(val, index) {

        const momentA = moment(val.input.value, "DD/MM/YYYY HH:mm");
        const momentB = moment($(`input[name='VoyageSchedule[${index}][ETA]']`).val(), "DD/MM/YYYY HH:mm");

        if (momentA.isAfter(momentB)) {
            return "after"
        }
        else if (momentA.isBefore(momentB)) {
            return "before"
        }
        else {
            return "no"
        }
    }

    function handlingEta(val, index) {
        if (index !== 0) {
            var momentPreviousB = moment($(`input[name='VoyageSchedule[${index - 1}][ETD]']`).val(), "DD/MM/YYYY HH:mm");
        }
        const momentA = moment(val.input.value, "DD/MM/YYYY HH:mm");
        const momentB = moment($(`input[name='VoyageSchedule[${index}][ETD]']`).val(), "DD/MM/YYYY HH:mm");
        const momentC = moment($(`input[name='VoyageSchedule[${index}][ClosingDateTime]']`).val(), "DD/MM/YYYY HH:mm");

        if (index !== 0) {
            if (momentA.isBefore(momentPreviousB)) {
                return "beforePreviousPort"
            }else{
                if (momentA.isAfter(momentB)) {
                    return "after"
                }
                else if (momentA.isBefore(momentB)) {
                    if (momentA.isBefore(momentC)) {
                        return "before"
                    } else {
                        return "no"
                    }
                }
                else {
                    return "no"
                }
            }

        }else{
            if (momentA.isAfter(momentB)) {
                return "after"
            }
            else if (momentA.isBefore(momentB)) {
                if (momentA.isBefore(momentC)) {
                    return "before"
                } else {
                    return "no"
                }
            }
            else {
                return "no"
            }
        }
        
    }

    function handlingEtd(val, index) {
        const momentA = moment(val.input.value, "DD/MM/YYYY HH:mm");
        const momentB = moment($(`input[name='VoyageSchedule[${index}][ETA]']`).val(), "DD/MM/YYYY HH:mm");

        if (momentA.isAfter(momentB)) {
            return "after"
        }
        else if (momentA.isBefore(momentB)) {
            return "before"
        }
        else {
            return "no"
        }
    }

    // add charges row when click add button
    function handleAddCharges(event) {

        var tempChargesColumn = VoyageScheduleColumn
        var arrayChecked = []

        if (event) {
            $(event.target).parent().find(".columnChooserColumn").each(function (key, value) {
                if ($(value).prop("checked")) {
                    arrayChecked.push(key)
                }

            })

        } else {
            $(".columnChooserColumn").each(function (key, value) {
                if ($(value).prop("checked")) {
                    arrayChecked.push(key)
                }

            })

        }

        $(VoyageScheduleColumn).each(function (key, value) {

            $(arrayChecked).each(function (key2, value2) {
                if (key == value2) {
                    value.class = ""
                }

            })

        })


        append({ Name: "VoyageSchedule", Charges: tempChargesColumn });


    }

    function handleConfirmVoyage() {

        var formData = new FormData($("form")[0]);

        $('.quotationuuid').each(function () {
            formData.append('QuotationUUIDs[]', $(this).val());
        });
        $('.bookingreservationuuid').each(function () {
            formData.append('BookingReservationUUIDs[]', $(this).val());
        });
        $('.crouuid').each(function () {
            formData.append('ContainerReleaseOrderUUIDs[]', $(this).val());

        });
        $('.bluuid').each(function () {
            formData.append('BillOfLadingUUIDs[]', $(this).val());
        });

        UpdateData(formState.id, globalContext, props.data.modelLink, formData).then(res => {
            if (res.data.data) {
                ToastNotify("success", "Voyage updated successfully.")
                navigate("/schedule/voyage/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

            }
            else {
                ToastNotify("error", "Error")
                ControlOverlay(false)
            }
        })

    }

    function VoyageSchedule() {
			return (
				<div className='card Ports lvl1 col-xs-12 col-md-12'>
					<div className='card-header'>
						<h3 className='card-title'>Voyage Schedule</h3>
					</div>
					<div className='card-body'>
						<div
							className='btn-group float-left mb-2 columnchooserdropdown'
							id='columnchooserdropdown'>
							<button
								type='button'
								className='btn btn-secondary btn-xs dropdown-toggle'
								data-toggle='dropdown'
								aria-haspopup='true'
								aria-expanded='true'>
								<i className='fa fa-th-list'></i>
							</button>
							<div
								className='dropdown-menu dropdown-menu-left  scrollable-columnchooser charges'
								id={`chargesColumChooser-${props.containerIndex}`}>
								{VoyageScheduleColumn.map((item, index) => {
									return (
										<label className='dropdown-item dropdown-item-marker'>
											{item.defaultChecked ? (
												<input
													type='checkbox'
													className='columnChooserColumn'
													defaultChecked
												/>
											) : (
												<input
													type='checkbox'
													className='columnChooserColumn'
												/>
											)}
											{item.columnName}
										</label>
									);
								})}
							</div>
						</div>

						<div>
							<button
								type='button'
								className='btn btn-success QuickAdd btn-xs mb-2 ml-2'
								data-toggle='modal'
								data-target='#addRouteModal'>
								Quick Add
							</button>

							<button
								type='button'
								className='btn btn-success btn-xs mb-2 ml-2'
								id='clearTableData'
								onClick={handleClearTableData}>
								Clear
							</button>
						</div>

						<div className='table_wrap'>
							<div className='table_wrap_inner'>
								<table
									className='table table-bordered commontable'
									style={{width: "100%"}}>
									<thead>
										<tr>
											{fields.length > 0
												? fields[0].Charges
													? fields[0].Charges.map((item, index) => {
															return (
																<th key={item.id} className={item.class}>
																	{item.columnName}
																</th>
															);
													  })
													: ""
												: VoyageScheduleColumn.map((item, index) => {
														return (
															<th key={item.id} className={item.class}>
																{item.columnName}
															</th>
														);
												  })}
										</tr>
									</thead>
									<tbody>
										{fields.map((item, index) => {
											return (
												<tr key={item.id}>
													{item.Charges.map((item2, index2) => {
														if (item2.inputType == "input") {
															if (!quickAddState) {
																if (
																	item2.name == "Tues" ||
																	item2.name == "Weight"
																) {
																	var tempName;
																	item2.name == "Tues"
																		? (tempName =
																				requiredStateTues[
																					`VoyageSchedule[${index}][Tues]`
																				])
																		: (tempName =
																				requiredStateWeight[
																					`VoyageSchedule[${index}][Weight]`
																				]);
																	if (tempName == true) {
																		return (
																			<td className={item2.class}>
																				<input
																					defaultValue=''
																					readOnly={
																						item2.readOnly
																							? item2.readOnly
																							: false
																					}
																					{...register(
																						"VoyageSchedule" +
																							"[" +
																							index +
																							"]" +
																							"[" +
																							item2.name +
																							"]",
																						{required: "required"}
																					)}
																					className={`form-control ${
																						item2.fieldClass
																							? item2.fieldClass
																							: ""
																					} ${
																						errors.VoyageSchedule
																							? errors.VoyageSchedule[
																									`${index}`
																							  ]
																								? errors.VoyageSchedule[
																										`${index}`
																								  ][`${item2.name}`]
																									? "has-error"
																									: ""
																								: ""
																							: ""
																					}`}
																				/>
																			</td>
																		);
																	} else {
																		return (
																			<td className={item2.class}>
																				<input
																					defaultValue=''
																					readOnly={
																						item2.readOnly
																							? item2.readOnly
																							: false
																					}
																					{...register(
																						"VoyageSchedule" +
																							"[" +
																							index +
																							"]" +
																							"[" +
																							item2.name +
																							"]"
																					)}
																					className={`form-control ${
																						item2.fieldClass
																							? item2.fieldClass
																							: ""
																					} ${
																						errors.VoyageSchedule
																							? errors.VoyageSchedule[
																									`${index}`
																							  ]
																								? errors.VoyageSchedule[
																										`${index}`
																								  ][`${item2.name}`]
																									? "has-error"
																									: ""
																								: ""
																							: ""
																					}`}
																				/>
																			</td>
																		);
																	}
																} else {
																	return (
																		<td className={item2.class}>
																			{item2.requiredField ? (
																				<input
																					defaultValue=''
																					readOnly={
																						item2.readOnly
																							? item2.readOnly
																							: false
																					}
																					{...register(
																						"VoyageSchedule" +
																							"[" +
																							index +
																							"]" +
																							"[" +
																							item2.name +
																							"]",
																						{required: "required"}
																					)}
																					className={`form-control ${
																						item2.fieldClass
																							? item2.fieldClass
																							: ""
																					} ${
																						errors.VoyageSchedule
																							? errors.VoyageSchedule[
																									`${index}`
																							  ]
																								? errors.VoyageSchedule[
																										`${index}`
																								  ][`${item2.name}`]
																									? "has-error"
																									: ""
																								: ""
																							: ""
																					}`}
																				/>
																			) : (
																				<input
																					defaultValue=''
																					readOnly={
																						item2.readOnly
																							? item2.readOnly
																							: false
																					}
																					{...register(
																						"VoyageSchedule" +
																							"[" +
																							index +
																							"]" +
																							"[" +
																							item2.name +
																							"]"
																					)}
																					className={`form-control ${
																						item2.fieldClass
																							? item2.fieldClass
																							: ""
																					}`}
																				/>
																			)}
																		</td>
																	);
																}
															} else {
																return (
																	<td className={item2.class}>
																		{item2.requiredField ? (
																			<input
																				defaultValue=''
																				readOnly={
																					item2.readOnly
																						? item2.readOnly
																						: false
																				}
																				{...register(
																					"VoyageSchedule" +
																						"[" +
																						index +
																						"]" +
																						"[" +
																						item2.name +
																						"]",
																					{required: "required"}
																				)}
																				className={`form-control ${
																					item2.fieldClass
																						? item2.fieldClass
																						: ""
																				} ${
																					errors.VoyageSchedule
																						? errors.VoyageSchedule[`${index}`]
																							? errors.VoyageSchedule[
																									`${index}`
																							  ][`${item2.name}`]
																								? "has-error"
																								: ""
																							: ""
																						: ""
																				}`}
																			/>
																		) : (
																			<input
																				defaultValue=''
																				readOnly={
																					item2.readOnly
																						? item2.readOnly
																						: false
																				}
																				{...register(
																					"VoyageSchedule" +
																						"[" +
																						index +
																						"]" +
																						"[" +
																						item2.name +
																						"]"
																				)}
																				className={`form-control ${
																					item2.fieldClass
																						? item2.fieldClass
																						: ""
																				}`}
																			/>
																		)}
																	</td>
																);
															}
														}

														if (item2.inputType == "single-select") {
															if (index2 == 0) {
																return (
																	<td className={item2.class}>
																		<div className='row'>
																			<div className='col-md-2'>
																				<div className='dropdownbar float-left ml-1'>
																					<button
																						style={{
																							position: "relative",
																							left: "0px",
																							top: "-5px",
																							padding: "0px 3px 0px 3px",
																						}}
																						className='btn btn-xs mt-2 btn-secondary dropdown-toggle float-right mr-1'
																						type='button'
																						data-toggle='dropdown'
																						aria-haspopup='true'
																						aria-expanded='false'>
																						<i className='fa fa-ellipsis-v'></i>
																					</button>
																					<div
																						className='dropdown-menu'
																						aria-labelledby='dropdownMenuButton'>
																						<button
																							className='dropdown-item remove-container'
																							type='button'
																							onClick={() => remove(index)}>
																							Remove
																						</button>
																					</div>
																				</div>
																			</div>
																			<input
																				defaultValue=''
																				{...register(
																					"VoyageSchedule" +
																						"[" +
																						index +
																						"]" +
																						"[VoyageScheduleUUID]"
																				)}
																				className={`form-control VoyageScheduleUUID d-none`}
																			/>
																			<div className='col-md-10'>
																				<Controller
																					name={
																						"VoyageSchedule" +
																						"[" +
																						index +
																						"]" +
																						"[" +
																						item2.name +
																						"]"
																					}
																					control={control}
																					render={({
																						field: {onChange, value},
																					}) => (
																						<Select
																							isClearable={true}
																							{...register(
																								"VoyageSchedule" +
																									"[" +
																									index +
																									"]" +
																									"[" +
																									item2.name +
																									"]",
																								{required: "P cannot be blank."}
																							)}
																							value={
																								value
																									? item2.options.find(
																											(c) => c.value === value
																									  )
																									: null
																							}
																							onChange={(val) => {
																								val == null
																									? onChange(null)
																									: onChange(val.value);
																								item2.onChange(val, index);
																							}}
																							options={item2.options}
																							isOptionDisabled={(
																								selectedValue
																							) =>
																								selectedValue.selected == true
																							}
																							menuPortalTarget={document.body}
																							className={`basic-single ${
																								item2.fieldClass
																									? item2.fieldClass
																									: ""
																							}  ${
																								errors.VoyageSchedule
																									? errors.VoyageSchedule[
																											`${index}`
																									  ]
																										? errors.VoyageSchedule[
																												`${index}`
																										  ][`${item2.name}`]
																											? "has-error-select"
																											: ""
																										: ""
																									: ""
																							}`}
																							onKeyDown={handleKeydown}
																							classNamePrefix='select'
																							styles={
																								globalContext.customStyles
																							}
																						/>
																					)}
																				/>
																			</div>
																		</div>
																	</td>
																);
															} else {
																return (
																	<td className={item2.class}>
																		<Controller
																			name={
																				"VoyageSchedule" +
																				"[" +
																				index +
																				"]" +
																				"[" +
																				item2.name +
																				"]"
																			}
																			control={control}
																			render={({field: {onChange, value}}) => (
																				<Select
																					isClearable={true}
																					{...register(
																						"VoyageSchedule" +
																							"[" +
																							index +
																							"]" +
																							"[" +
																							item2.name +
																							"]"
																					)}
																					value={
																						value
																							? item2.options.find(
																									(c) => c.value === value
																							  )
																							: null
																					}
																					onChange={(val) => {
																						val == null
																							? onChange(null)
																							: onChange(val.value);
																						item2.onChange(val, index);
																					}}
																					options={item2.options}
																					menuPortalTarget={document.body}
																					onKeyDown={handleKeydown}
																					isOptionDisabled={(selectedValue) =>
																						selectedValue.selected == true
																					}
																					className={`basic-single ${
																						item2.fieldClass
																							? item2.fieldClass
																							: ""
																					}`}
																					classNamePrefix='select'
																					styles={globalContext.customStyles}
																				/>
																			)}
																		/>
																		{item2.columnName == "UOM" ? (
																			<input
																				type='hidden'
																				className='ArrayUOM'></input>
																		) : (
																			""
																		)}
																	</td>
																);
															}
														}

														if (item2.inputType == "date-time") {
															return (
																<td className={item2.class}>
																	{item2.requiredField ? (
																		<Controller
																			control={control}
																			name={`VoyageSchedule[${index}][${item2.name}]`}
																			render={({field: {onChange, value}}) => (
																				<>
																					<Flatpickr
																						value={value ? value : ""}
																						{...register(
																							`VoyageSchedule[${index}][${item2.name}]`,
																							{required: "required333"}
																						)}
																						onChange={(val, event) => {
																							onChange(
																								moment(val[0]).format(
																									"DD/MM/YYYY H:mm"
																								)
																							);
																						}}
																						onClose={(_, __, fp) => {
																							setTimeout(() => {
																								if (
																									$(fp.element).hasClass("Eta")
																								) {
																									var checkEta = handlingEta(
																										fp,
																										index
																									);

																									if (checkEta == "after") {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETA cannot be late than ETD"
																										);
																									} else if (
																										checkEta == "before"
																									) {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETA cannot be ealier than Closing Date Time"
																										);
																									} else if (
																										checkEta ==
																										"beforePreviousPort"
																									) {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETA cannot be ealier than previous port ETD"
																										);
																									}
																								} else if (
																									$(fp.element).hasClass(
																										"Closingdatetime"
																									)
																								) {
																									var checkClosingDateTime =
																										handlingClosingDatetime(
																											fp,
																											index
																										);

																									if (
																										checkClosingDateTime ==
																										"after"
																									) {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"Closing Date Time cannot be late than ETA"
																										);
																									}
																								} else if (
																									$(fp.element).hasClass("Etd")
																								) {
																									var checkEtd = handlingEtd(
																										fp,
																										index
																									);

																									if (checkEtd == "before") {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETD cannot be ealier than ETA"
																										);
																									}
																								}
																							}, 300);
																						}}
																						className={`form-control dateformat flatpickr-input ${
																							item2.fieldClass
																								? item2.fieldClass
																								: ""
																						}  ${
																							errors.VoyageSchedule
																								? errors.VoyageSchedule[
																										`${index}`
																								  ]
																									? errors.VoyageSchedule[
																											`${index}`
																									  ][`${item2.name}`]
																										? "has-error"
																										: ""
																									: ""
																								: ""
																						}`}
																						options={{
																							enableTime: true,
																							time_24hr: true,
																							dateFormat: "d/m/Y H:i",
																							defaultHour: 12,
																						}}
																					/>
																				</>
																			)}
																		/>
																	) : (
																		<Controller
																			control={control}
																			name={`VoyageSchedule[${index}][${item2.name}]`}
																			render={({field: {onChange, value}}) => (
																				<>
																					<Flatpickr
																						value={value ? value : ""}
																						{...register(
																							`VoyageSchedule[${index}][${item2.name}]`
																						)}
																						onChange={(val) => {
																							onChange(
																								moment(val[0]).format(
																									"DD/MM/YYYY H:mm"
																								)
																							);
																						}}
																						onClose={(_, __, fp) => {
																							setTimeout(() => {
																								if (
																									$(fp.element).hasClass("Eta")
																								) {
																									var checkEta = handlingEta(
																										fp,
																										index
																									);

																									if (checkEta == "after") {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETA cannot be late than ETD"
																										);
																									} else if (
																										checkEta == "before"
																									) {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETA cannot be ealier than Closing Date Time"
																										);
																									} else if (
																										checkEta ==
																										"beforePreviousPort"
																									) {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETA cannot be ealier than previous port ETD"
																										);
																									}
																								} else if (
																									$(fp.element).hasClass(
																										"Closingdatetime"
																									)
																								) {
																									var checkClosingDateTime =
																										handlingClosingDatetime(
																											fp,
																											index
																										);

																									if (
																										checkClosingDateTime ==
																										"after"
																									) {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"Closing Date Time cannot be late than ETA"
																										);
																									}
																								} else if (
																									$(fp.element).hasClass("Etd")
																								) {
																									var checkEtd = handlingEtd(
																										fp,
																										index
																									);

																									if (checkEtd == "before") {
																										fp.clear();
																										onChange("");
																										fp.input.value = "";
																										alert(
																											"ETD cannot be ealier than ETA"
																										);
																									}
																								}
																							}, 300);
																						}}
																						className={`form-control dateformat flatpickr-input`}
																						options={{
																							enableTime: true,
																							time_24hr: true,
																							dateFormat: "d/m/Y H:i",
																							defaultHour: 12,
																						}}
																					/>
																				</>
																			)}
																		/>
																	)}
																</td>
															);
														}
													})}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>

						<button
							type='button'
							className='add-container btn btn-success btn-xs mb-2 mt-2'
							onClick={handleAddCharges}>
							<span className='fa fa-plus'></span>Add Route Point
						</button>
					</div>
				</div>
			);
		}

		const onSubmit = (data, event) => {
			event.preventDefault();

			var tempForm = $("form")[0];
			ControlOverlay(true);

			$(tempForm)
				.find(".inputDecimalThreePlaces")
				.each(function () {
					var value1 = $(this).val();
					if (value1 !== "") {
						$(this).val(parseFloat(value1).toFixed(4));
					}
				});

			const formdata = new FormData(tempForm);

			if (formState.formType == "New" || formState.formType == "Clone") {
				CreateData(globalContext, props.data.modelLink, formdata).then(
					(res) => {
						if (res.data) {
							if (
								res.data.message == "Voyage has already been taken." ||
								res.data.message == "Tues or Weight Exceeded."
							) {
								ToastNotify("error", res.data.message);
								ControlOverlay(false);
							} else {
								ToastNotify("success", "Voyage created successfully.");
								navigate("/schedule/voyage/update/id=" + res.data.data, {
									state: {formType: "Update", id: res.data.data},
								});
							}
						}
					}
				);
			} else {
				var VoyageSchedulesData = [];
				$(".VoyageScheduleUUID").each(function (key, value) {
					var listArray = {
						VoyageScheduleUUID: $(this).val(),
						SCNCode: getValues(`VoyageSchedule[${key}][SCNCode]`),
						ClosingDateTime: getValues(
							`VoyageSchedule[${key}][ClosingDateTime]`
						),
						ETA: getValues(`VoyageSchedule[${key}][ETA]`),
						ETD: getValues(`VoyageSchedule[${key}][ETD]`),
					};
					VoyageSchedulesData.push(listArray);
				});
				// VoyageSchedulesDataObj[]

				CheckVoyageEffectedDocument(
					globalContext,
					props.data.modelLink,
					formState.id,
					VoyageSchedulesData
				).then((res) => {
					if (
						res.BillOfLadings == "" &&
						res.BookingReservations == "" &&
						res.ContainerReleaseOrders == "" &&
						res.Quotations == ""
					) {
						handleConfirmVoyage();
					} else {
						ControlOverlay(false);
						window.$("#affectedDocument").modal("toggle");

						if (res.Quotations != null) {
							$.each(res.Quotations, function (key, value) {
								$(".Quotation").append(
									"<div className='row'>&ensp;<input type = 'hidden' className='quotationuuid' value = " +
										value.QuotationUUID +
										"><span style='font-size: 15px'>" +
										value.DocNum +
										"</span></div>"
								);
							});
						}

						if (res.BookingReservations != null) {
							$.each(res.BookingReservations, function (key, value) {
								$(".BookingReservation").append(
									"<div className='row'>&ensp;<input type = 'hidden' className='bookingreservationuuid' value = " +
										value.BookingReservationUUID +
										"><span style='font-size: 15px'>" +
										value.DocNum +
										"</span></div>"
								);
							});
						}

						if (res.ContainerReleaseOrders != null) {
							$.each(res.ContainerReleaseOrders, function (key, value) {
								$(".CRO").append(
									"<div className='row'>&ensp;<input type = 'hidden' className='crouuid' value = " +
										value.ContainerReleaseOrderUUID +
										"><span style='font-size: 15px'>" +
										value.DocNum +
										"</span></div>"
								);
							});
						}

						if (res.BillOfLadings != null) {
							$.each(res.BillOfLadings, function (key, value) {
								$(".BillOfLading").append(
									"<div className='row'>&ensp;<input type = 'hidden' className='bluuid' value = " +
										value.BillOfLadingUUID +
										"><span style='font-size: 15px'>" +
										value.DocNum +
										"</span></div>"
								);
							});
						}
					}
				});
				// UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
				//     if (res.data.data) {
				//         ToastNotify("success", "Voyage updated successfully.")
				//         navigate("/schedule/voyage/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

				//     }
				//     else {
				//         ToastNotify("error", "Error")
				//         ControlOverlay(false)
				//     }
				// })
			}
		};


    useEffect(() => {

        trigger();
        remove()
        handleAddCharges()
        setValue('Voyage[Vessel]', "")
        setValue("Voyage[VoyageNumber]","")
        setCheckVoyageUsed(false)
        $(".Vessel").removeClass("Readonly")
        $(".add-container").prop("disabled", false)
        $(".QuickAdd").prop("disabled", false)
        $(".remove-container").prop("disabled", false)
        $(".getPortCode").removeClass("Readonly")
        $(".getTerminalCode").removeClass("Readonly")
        $(".getRoutePointDescription").prop("readonly", false)
        $("#clearTableData").prop("disabled", false)

       
        toThreeDecimalPlaces();
        checkOnlyNumber()
        initHoverSelectDropownTitle();
        GetAllDropDown(['PortDetails', 'Area', 'Vessel', 'Route'], globalContext, false).then(res => {
            var ArrayPortCode = [];
            var ArrayTerminal = [];
            var ArrayVessel = [];
            var ArrayRoute = [];


            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode, region: value.Region })
            })

            $.each(res.PortDetails, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayTerminal.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                }

            })

            $.each(res.Vessel, function (key, value) {
                if (value.VesselType !== bargeUUID) {
                    ArrayVessel.push({ value: value.VesselUUID, label: value.VesselName })
                }

            })

            $.each(res.Route, function (key, value) {
                ArrayRoute.push({ value: value.RouteUUID, label: value.ServiceName })
            })

            setPort(sortArray(ArrayPortCode))
            setVessel(sortArray(ArrayVessel))
            setRoute(sortArray(ArrayRoute))


            fields[0].Charges[0].options = ArrayPortCode
            fields[0].Charges[2].options = ArrayTerminal
            var arrayDynamic = []
            var arrayDynamicPortDetailSelection = []
            if (state) {
                if (state.formType == "Update" || state.formType == "Clone") {
                    ControlOverlay(true)

                    GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                        $.each(res.data.data, function (key, value) {
                            setValue('Voyage[' + key + ']', value);
                        })

                        if(state.formType=="Clone"){
                            setValue("Voyage[VoyageNumber]","")
                        }

                        if (res.data.data.voyageSchedules) {

                            $.each(res.data.data.voyageSchedules, function (key, value) {

                               var newValue={...value}
                               var NewVoyageScheduleColumn=VoyageScheduleColumn.map(obj => ({ ...obj }));
                               var PortDetailsSelection=[]
                               if(value.PortDetails){
                                   $.each(value.PortDetails, function (key2, value2) {
                                       PortDetailsSelection.push({"value":value2.PortDetailsUUID,"label":value2.PortName})
                                   })
                               }
                                newValue.Name = "VoyageSchedule";
                              
                                NewVoyageScheduleColumn[0].options = ArrayPortCode
                                NewVoyageScheduleColumn[2].options = sortArray(PortDetailsSelection)
                                newValue.Charges = NewVoyageScheduleColumn;
                                newValue.Area = newValue.portCode.Area

                                if (newValue.locationCode) {
                                    newValue.TerminalName = newValue.locationCode.PortName
                                }

                                // arrayDynamicPortDetailSelection.push(PortDetailsSelection)
                                arrayDynamic.push(newValue);

                            })

                            remove()
                            append(arrayDynamic)

                        }

                        if (res.data.data.Valid == "1") {
                            $('.validCheckbox').prop("checked", true)
                        }
                        else {
                            $('.validCheckbox').prop("checked", false)

                        }

                        getVesselById(res.data.data.Vessel, globalContext).then(res => {
                            var Tues = res.data.CargoCapacity
                            var Weight = res.data.LoadingWeight
                            var storeDataString = 'Maximum Tues: ' + parseFloat(Tues).toFixed(2) + ' <br> Maximum Weight:' + parseFloat(Weight).toFixed(2) + '';
                            setStoreData(storeDataString)
                        })
                        
                        if (state.formType !== "Clone") {
                            CheckVoyage(state.id, globalContext).then(res => {
                                if (res == "YES") {
                                    setCheckVoyageUsed(true)
                                    $(".Vessel").addClass("readOnlySelect")
                                    $(".add-container").prop("disabled", true)
                                    $(".QuickAdd").prop("disabled", true)
                                    $(".remove-container").prop("disabled", true)
                                    $(".getPortCode").addClass("Readonly")
                                    $(".getTerminalCode").addClass("Readonly")
                                    $(".getRoutePointDescription").prop("readonly", true)
                                    $("#clearTableData").prop("disabled", true)


                                }
                            })
                        }


                        ControlOverlay(false)

                    })



                }
            } else {
                ControlOverlay(true)
                GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('Voyage[' + key + ']', value);
                    })

                    if (res.data.data.voyageSchedules) {

                        $.each(res.data.data.voyageSchedules, function (key, value) {

                           var newValue={...value}
                           var NewVoyageScheduleColumn=VoyageScheduleColumn.map(obj => ({ ...obj }));
                           var PortDetailsSelection=[]
                           if(value.PortDetails){
                               $.each(value.PortDetails, function (key2, value2) {
                                   PortDetailsSelection.push({"value":value2.PortDetailsUUID,"label":value2.PortName})
                               })
                           }
                            newValue.Name = "VoyageSchedule";
                          
                            NewVoyageScheduleColumn[0].options = ArrayPortCode
                            NewVoyageScheduleColumn[2].options = sortArray(PortDetailsSelection)
                            newValue.Charges = NewVoyageScheduleColumn;
                            newValue.Area = newValue.portCode.Area

                            if (newValue.locationCode) {
                                newValue.TerminalName = newValue.locationCode.PortName
                            }

                            // arrayDynamicPortDetailSelection.push(PortDetailsSelection)
                            arrayDynamic.push(newValue);

                        })

                        remove()
                        append(arrayDynamic)

                    }

                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }

                    getVesselById(res.data.data.Vessel, globalContext).then(res => {

                        var Tues = res.data.CargoCapacity
                        var Weight = res.data.LoadingWeight
                        var storeDataString = 'Maximum Tues: ' + parseFloat(Tues).toFixed(2) + ' <br> Maximum Weight:' + parseFloat(Weight).toFixed(2) + '';
                        setStoreData(storeDataString)
                    })
                   
                            CheckVoyage(params.id, globalContext).then(res => {
                                if (res == "YES") {
                                    setCheckVoyageUsed(true)
                                    $(".Vessel").addClass("readOnlySelect")
                                    $(".add-container").prop("disabled", true)
                                    $(".QuickAdd").prop("disabled", true)
                                    $(".remove-container").prop("disabled", true)
                                    $(".getPortCode").addClass("Readonly")
                                    $(".getTerminalCode").addClass("Readonly")
                                    $(".getRoutePointDescription").prop("readonly", true)
    
                                }
                            })
                    
                


                    ControlOverlay(false)

                })
            }

            return () => {

            }

        })
    }, [state])

    useEffect(() => {
        if (state == null) {
            trigger()
            setFormState({ formType: "Update", id: params.id })
        }
        else {
            trigger()
            setFormState(state)
        }
        return () => {

        }
    }, [state])



    // useEffect(() => {
    //     reset()


    //     return () => {

    //     }
    // }, [formState])

    $(document).unbind().on("change", ".area", function (e) {

        var index = $(this).closest("tr").index()

        var Array = []
        var DefaultValue;
        var DefaultValueName;
        getPortDetails(getValues(`VoyageSchedule[${index}][PortCode]`), globalContext).then(res => {
            if (res.length > 0) {
                $.each(res, function (key, value) {

                    if (value.VerificationStatus == "Approved") {
                        if (value.Default == 1) {
                            DefaultValue = value.PortDetailsUUID;
                            DefaultValueName = value.PortName
                        }

                        Array.push({ "value": value.PortDetailsUUID, "label": value.LocationCode })

                        // htmlTerminal += "<option value='" + value.PortDetailsUUID + "'>" + value.LocationCode + "</option>";
                    }
                })

            }

            if (fields.length > 0) {

                if (fields[0].Name == "VoyageSchedule") {

                    $.each(fields, function (key, value) {

                        if (key == index) {
                            value.Charges[2].options = sortArray(Array)

                        }
                    })

                }
            }

            //update(fields)

            setValue(`VoyageSchedule[${index}][LocationCode]`, DefaultValue)
            setValue(`VoyageSchedule[${index}][TerminalName]`, DefaultValueName)

        })
    })

    $(document).on("focusout", ".SCNCode", function () {
        var nowSCNLocation = $(this);
        var arraySCN = [];
        $.each($(".SCNCode"), function (key, value) {

            if (arraySCN == "") {
                var arraylist = {
                    SCNLocation: value,
                    value: $(value).val(),
                }
                arraySCN.push(arraylist)
            }
            else {
                $.each(arraySCN, function (key2, value2) {
                    if ($(value).val() != "") {
                        if ($(value).val() == value2.value) {
                            alert("Cannot fill in the same SCN Code");
                            $(nowSCNLocation).val("");
                            return false;
                        } else {
                            arraylist = {
                                SCNLocation: value,
                                value: $(value).val(),
                            }
                            arraySCN.push(arraylist)
                        }
                    }
                })
            }

        })
    });


    $(document).on("mouseover", ".AllocateVoyageButton", function () {
        var e = $(this);
        $(".AllocateVoyageButton").attr("data-content", storeData)
        window.$(e).popover({ html: true, content: storeData }).popover('show');

    });

    $(document).on("mouseleave", ".AllocateVoyageButton", function () {
        var e = $(".AllocateVoyageButton");
        window.$(e).popover("hide");
    });


    useEffect(() => {
      $(".AllocateVoyageButton").on("mouseover",function () {
        var e = $(this);
        $(".AllocateVoyageButton").attr("data-content", storeData)
        window.$(e).popover({ html: true, content: storeData }).popover('show');

    });

    $(".AllocateVoyageButton").on("mouseleave",function () {
        var e = $(".AllocateVoyageButton");
        window.$(e).popover("hide");
    });

    
      return () => {
        
      }
    }, [storeData])
    


    $(document).on("change", ".columnChooserColumn", function (event) {

        var index = ($(this).parent().parent().attr('id')).split("-")[1]

        var voyageCookies = []

        $(this).parent().parent().find(".columnChooserColumn:checked").each(function () {

            voyageCookies.push($(this).parent().index())

        });

        var json_str = JSON.stringify(voyageCookies);
        createCookie('voyagecolumn', json_str, 3650);


        if (fields.length > 0) {

            if (fields[0].Name == "VoyageSchedule") {

                $.each(fields, function (key, value) {
                    if ($(event.target).prop("checked")) {
                        value.Charges[$(event.target).parent().index()].class = ""
                    } else {
                        value.Charges[$(event.target).parent().index()].class = "d-none"
                    }

                })
                //setChargesColumnCookies(fields[0]["Charges"])

                update(fields)
            }

        }
      

    })

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("Voyage[Valid]", "1")
        } else {
            setValue("Voyage[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };
    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Voyage' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Voyage" model="voyage" selectedId="VoyageUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Voyage' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Voyage Form</div>
                    <div className="card-body">

                        <div className="row">


                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Voyage Number </label>

                                    <input defaultValue='' {...register("Voyage[VoyageNumber]")} className={`form-control`} readOnly={true} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">
                                        <div className="row">
                                            <div className={`control-label ml-2 ${errors.Voyage ? errors.Voyage.Vessel ? "has-error-label" : "" : ""}`}>Vessel</div>

                                            <div>
                                                <button type="button" className="btn btn-outline-secondary AllocateVoyageButton btn-sm ml-1" data-toggle="popover" data-content="" data-original-title="" title="">
                                                    <i className="self fa fa-info fa-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </label>

                                    <Controller
                                        name="Voyage[Vessel]"
                                        id="Vessel"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}

                                                {...register("Voyage[Vessel]", { required: "Vessel cannot be blank." })}
                                                value={value ? vessel.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeVessel(val) }}
                                                options={vessel}
                                                className={`form-control Vessel  ${checkVoyageUsed? "Readonly":""}   ${errors.Voyage ? errors.Voyage.Vessel ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                onKeyDown={handleKeydown}
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />

                                    <p>{errors.Voyage ? errors.Voyage.Vessel && <span style={{ color: "#A94442" }}>{errors.Voyage.Vessel.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea rows="2" defaultValue='' {...register("Voyage[Description]")} className={`form-control`} />
                                </div>
                            </div>




                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('Route[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>


                            {VoyageSchedule()}


                        </div>


                    </div>




                </div>




            </div>

            <div className="modal fade" id="addRouteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Route</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <Controller
                                    name="DynamicModelRoute"
                                    id="DynamicModelRoute"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            {...register("DynamicModelRoute")}
                                            value={value ? vessel.find(c => c.value === value) : null}
                                            onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeRoute(val) }}
                                            options={route}
                                            className="form-control DynamicModelRoute"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}

                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">

                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Affected Document Modal--> */}
            <div className="modal fade" id="affectedDocument" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Affected Document</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="card container-charges lvl1">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ "fontSize": "20px" }}><b>Quotation</b></p>
                                                            <div className="Quotation">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ "fontSize": "20px" }}><b>Booking Reservation</b></p>
                                                            <div className="BookingReservation">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ "fontSize": "20px" }}><b>Container Release Order</b></p>
                                                            <div className="CRO">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <p style={{ "fontSize": "20px" }}><b>Bill Of Lading</b></p>
                                                            <div className="BillOfLading">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="confirm" data-dismiss="modal" onClick={() => handleConfirmVoyage()}>Confirm</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Voyage' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Voyage" model="voyage" selectedId="VoyageUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Voyage' data={props} />}



        </form>



    )
}






export default Form