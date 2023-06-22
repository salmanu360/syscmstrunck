import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData,sortArray, ToastNotify, ControlOverlay,getAreaById, GetAllDropDown,initHoverSelectDropownTitle,getPortDetailsById,getPortDetails } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $ from "jquery";
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



    const { register, handleSubmit, setValue, getValues,trigger, reset, control, watch, formState: { errors } } = useForm({ mode: "onChange",


    });
    

    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "RoutePoint"
    });

    // var RouteColumn = [
    //     { columnName: "Port Code", inputType: "single-select",name: "PortCode", fieldClass: "", options: port, class: "", onChange: handleChangePortCode, requiredField: true },
    //     { columnName: "Area", inputType: "input",name: "Area", fieldClass: "", class: "",readOnly: true },
    //     { columnName: "Terminal Code", inputType: "single-select",name: "LocationCode",class: "", fieldClass: "", options: terminal, onChange: handleChangeTerminalCode },
    //     { columnName: "Terminal Name", inputType: "input", defaultChecked: false, name: "TerminalName", class: "", readOnly: true },
    //     { columnName: "Description", inputType: "input", defaultChecked: false, name: "Description", class: "" },

    // ]

    function handleChangePortCode(val,index){
        if(val){
            getAreaById(val.value, globalContext).then(res => {      
                $(`input[name='RoutePoint[${index}][Area]']`).val(res.Area).trigger("change");
                
            })
            
        }
        else{
            $(`input[name='RoutePoint[${index}][Area]']`).val("");
        }
    }

    function handleChangeTerminalCode(val, index) {
        if (val) {
            getPortDetailsById(val.value, globalContext).then(res => {
                setValue(`RoutePoint[${index}][TerminalName]`, res.data.PortName)
            })
        }
        else {
            setValue(`RoutePoint[${index}][TerminalName]`, "")
        }
    }

    function RoutePoint() {
        return (
					<div className='card Ports lvl1 col-xs-12 col-md-12'>
						<div className='card-header'>
							<h3 className='card-title'>Route</h3>
						</div>
						<div className='card-body'>
							<div className='table_wrap'>
								<div className='table_wrap_inner'>
									<table
										className='table table-bordered commontable'
										style={{width: "100%"}}>
										<thead>
											<tr>
												<th>Port Code</th>
												<th>Area</th>
												<th>Terminal Code</th>
												<th>Terminal Name</th>
												<th>Description</th>
											</tr>
										</thead>
										<tbody>
											{fields.map((item, index) => (
												<tr key={item.id}>
													<td>
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
															<div className='col-md-10'>
																<Controller
																	name={
																		"RoutePoint" +
																		"[" +
																		index +
																		"]" +
																		"[PortCode]"
																	}
																	control={control}
																	render={({field: {onChange, value}}) => (
																		<Select
																			isClearable={true}
																			{...register(
																				"RoutePoint" +
																					"[" +
																					index +
																					"]" +
																					"[PortCode]"
																			)}
																			value={
																				value
																					? port.find((c) => c.value === value)
																					: null
																			}
																			onChange={(val) => {
																				val == null
																					? onChange(null)
																					: onChange(val.value);
																				handleChangePortCode(val, index);
																			}}
																			options={port}
																			menuPortalTarget={document.body}
																			className='basic-single'
																			classNamePrefix='select'
																			styles={globalContext.customStyles}
																		/>
																	)}
																/>
															</div>
														</div>
													</td>
													<td>
														<input
															{...register(
																"RoutePoint" + "[" + index + "]" + "[Area]"
															)}
															className={`form-control area`}
															readOnly
														/>
													</td>
													<td>
														<Controller
															name={
																"RoutePoint" +
																"[" +
																index +
																"]" +
																"[LocationCode]"
															}
															control={control}
															render={({field: {onChange, value}}) => (
																<Select
																	isClearable={true}
																	{...register(
																		"RoutePoint" +
																			"[" +
																			index +
																			"]" +
																			"[LocationCode]"
																	)}
																	value={
																		value
																			? item.terminalOptions.find(
																					(c) => c.value === value
																			  )
																			: null
																	}
																	onChange={(val) => {
																		val == null
																			? onChange(null)
																			: onChange(val.value);
																		handleChangeTerminalCode(val, index);
																	}}
																	options={item.terminalOptions}
																	menuPortalTarget={document.body}
																	className='basic-single'
																	classNamePrefix='select'
																	styles={globalContext.customStyles}
																/>
															)}
														/>
													</td>
													<td>
														<input
															{...register(
																"RoutePoint" +
																	"[" +
																	index +
																	"]" +
																	"[TerminalName]"
															)}
															className={`form-control`}
															readOnly
														/>
													</td>
													<td>
														<input
															{...register(
																"RoutePoint" +
																	"[" +
																	index +
																	"]" +
																	"[Description]"
															)}
															className={`form-control`}
														/>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							<button
								type='button'
								className='add-container btn btn-success btn-xs mb-2 mt-2'
								onClick={() => {
									append({Name: "RoutePoint", terminalOptions: terminal});
								}}>
								<span className='fa fa-plus'></span>Add Route Point
							</button>
						</div>
					</div>
				);


    }

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)

        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Service Name.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Route created successfully.")
                        navigate("/schedule/route/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Route updated successfully.")
                    navigate("/schedule/route/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                    
                }
            })

        }


    }

    useEffect(() => {
        $('.area').off("change").on("change", function (e) {

            var index = $(this).closest("tr").index()
    
            var Array = []
            var DefaultValue;
            var DefaultValueName;
            getPortDetails(getValues(`RoutePoint[${index}][PortCode]`), globalContext).then(res => {
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
                    if (fields[0].Name == "RoutePoint") {
                        $.each(fields, function (key, value) {
                            if (key == index) {
                                value.terminalOptions = Array
                                setValue(`RoutePoint[${index}][LocationCode]`, "")
                             
    
                            }
                        })
    
                    }
                }
    
                //update(fields)
                if(DefaultValue){
                    setValue(`RoutePoint[${index}][LocationCode]`, DefaultValue)
                    setValue(`RoutePoint[${index}][TerminalName]`, DefaultValueName)
                }
    
               
    
            })
        })
    
      return () => {
        
      }
    }, [fields])
    

    useEffect(() => {
        setValue("Route[ServiceName]","")
        trigger()
        reset()
        remove()
        initHoverSelectDropownTitle();
         

        GetAllDropDown(['PortDetails', 'Area'], globalContext).then(res => {
            var ArrayPortCode = [];
            var ArrayTerminal = [];


            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })

            $.each(res.PortDetails, function (key, value) {
                if(value.VerificationStatus=="Approved"){
                    ArrayTerminal.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                }
               
            })

            setPort(sortArray(ArrayPortCode))
            var arrayDynamic = []
            if (state) {
                if (state.formType == "Update" || state.formType == "Clone") {
                    ControlOverlay(true)

                    GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                        $.each(res.data.data, function (key, value) {
                            setValue('Route[' + key + ']', value);
                        })

                        if (res.data.data.routePoints) {

                            $.each(res.data.data.routePoints, function (key, value) {
                                value.Area=value.portCode.Area
                                value.Name="RoutePoint"
                                 if(value.LocationCode){
                                    var array = []
                                    $.each(value.terminalSelection, function (key2, value2) {
                                        if (value2.VerificationStatus == "Approved") {
                                            array.push({ value: value2.PortDetailsUUID, label: value2.PortName })
                                        }
    
                                    })

                                    var result = array.filter(function (oneArray) {
                                        return oneArray.value == value.LocationCode;
                                    });

                                    if (result.length < 1) {   
                                        array.push({ value: value.locationCode.PortDetailsUUID, label: value.locationCode.PortName })
                                    }
                                    value.terminalOptions=array
                                 }
                              
                                if(value.LocationCode){ 
                                    value.TerminalName=value.locationCode.PortName
                                }
                                arrayDynamic.push(value);
                                remove()
                                append(arrayDynamic)
                            })
                        }

                        if (res.data.data.Valid == "1") {
                            $('.validCheckbox').prop("checked", true)
                        }
                        else {
                            $('.validCheckbox').prop("checked", false)

                        }
                        ControlOverlay(false)
                        trigger();
                    })


                }
            } else {
                ControlOverlay(true)
                GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('Route[' + key + ']', value);
                    })

                    if (res.data.data.routePoints) {
                        $.each(res.data.data.routePoints, function (key, value) {
                     
                            value.Area=value.portCode.Area
                            value.terminalOptions=[{value:'fdfdfdf',label:"dfdfdfdf"}]
                            if(value.LocationCode){ 
                                value.TerminalName=value.locationCode.PortName
                            }
                            arrayDynamic.push(value);
                            remove()
                            append(arrayDynamic)
                        })
                    }

                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }



                    ControlOverlay(false)
                    trigger();

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



    

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("Route[Valid]", "1")
        } else {
            setValue("Route[Valid]", "0")
        }


    });

      const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };
    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Route' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Route" model="route" selectedId="RouteUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Route' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Route Form</div>
                    <div className="card-body">

                        <div className="row">


                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                <label className={`control-label ${errors.Route ? errors.Route.ServiceName? "has-error-label" : "" :""}`}>Service Name</label>
                                  
                                    <input defaultValue='' {...register("Route[ServiceName]",{ required: "Service Name cannot be blank." })} className={`form-control ${errors.Route ? errors.Route.ServiceName? "has-error" : "" :""}`} />
                                    <p>{errors.Route ? errors.Route.ServiceName && <span style={{ color:"#A94442" }}>{errors.Route.ServiceName.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea rows="6" defaultValue='' {...register("Route[Description]")} className={`form-control`} />
                                </div>
                            </div>




                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('Route[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>


                            {RoutePoint()}


                        </div>


                    </div>




                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Route' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Route" model="route" selectedId="RouteUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Route' data={props} />}


        </form>



    )
}






export default Form