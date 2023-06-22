import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, sortArray,toThreeDecimalPlaces,ControlOverlay, GetAllDropDown, GetCompaniesData, GetBranchData, GetCompanyByShipOrBox, getCompanyBranches, getContainerType } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import AsyncSelect from 'react-select/async';
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $ from "jquery";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
    useParams,
    useNavigate
} from "react-router-dom";


const gradeOption = [{ "value": "AA", "label": "AA" }, { "value": "A", "label": "A" }, { "value": "B", "label": "B" }, { "value": "C", "label": "C" }, { "value": "D", "label": "D" }]
const statusOption = [{ "value": "Available", "label": "Available" }, { "value": "Damage", "label": "Damage" }, { "value": "For Sale", "label": "For Sale" }, { "value": "Sold", "label": "Sold" }, { "value": "Washing", "label": "Washing" }, { "value": "Reserved", "label": "Reserved" }, { "value": "Released", "label": "Released" }, { "value": "VGM", "label": "VGM" }, { "value": "Gate In", "label": "Gate In" }, { "value": "Loaded", "label": "Loaded" }, { "value": "Discharged", "label": "Discharged" }, { "value": "Gate Out", "label": "Gate Out" }, { "value": "Empty Return", "label": "Empty Return" }]
const ownerTypeOption = [{ "value": "COC", "label": "COC" }, { "value": "SOC", "label": "SOC" }]
const COCTypeOption = [{ "value": "Hired", "label": "Hired" }, { "value": "Own", "label": "Own" }]
const SOCTypeOption = [{ "value": "Free-Use", "label": "Free-Use" }, { "value": "Joint-Service", "label": "Joint-Service" }, { "value": "MLO", "label": "MLO" }, { "value": "One-Off", "label": "One-Off" }]

const COCHiredContractOption = []
const SOCcFreeUseDetailOption = []

function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();


    const [company, setCompany] = useState([])
    const [companyBranch, setCompanyBranch] = useState([])
    const [containerType, setContainerType] = useState([])
    const [boxOperator, setBoxOperator] = useState([])
    const [boxOperatorBranch, setBoxOperatorBranch] = useState([])
    const [ownerCompany, setOwnerCompany] = useState([])
    const [depotCompany, setDepotCompany] = useState([])
    const [depotBranch, setDepotBranch] = useState([])
    const [checkLoadState, setCheckLoadState] = useState(false)

    const [movementStat, setMovementStat] = useState(false)

    const MovementStatus = ["Reserved", "Released", "Gate In", "Loaded", "Discharged", "Gate Out", 'Empty Return']

    const { register, handleSubmit, setValue, getValues, reset, trigger, control, watch, formState: { errors } } = useForm({ mode: "onChange" });

    var ArrayCompany = [];
    var ArrayOwnerCompany = [];
    var ArrayCompanyBranch = [];
    var ArrayContainerType = [];
    var ArrayDepotCompany = []
    var ArrayDepotCompanyVerified = []
    var arrayBoxOperator = []
    
    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }



    const loadOptionsDepot = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Depot&q=" + inputValue, {
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)
        return response
    }

    const loadOptionsBoxOp = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)
        return response
    }

    const loadOptionsOwner = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)
        return response
    }

    function getFiles(id) {
			$.ajax({
				url:
					globalContext.globalHost +
					globalContext.globalPathLink +
					"container/load-files?id=" +
					id,
				type: "POST",
				dataType: "json",
				headers: {
					Authorization:
						"Basic " +
						btoa(
							globalContext.authInfo.username +
								":" +
								globalContext.authInfo.access_token
						),
				},
				success: function (data) {
					var fileData;
					if (id == undefined) {
						fileData = [];
					} else {
						fileData = data.data;
					}
					window.$("#ContainerAttachments").filer({
						showThumbs: true,
						addMore: true,
						allowDuplicates: false,
						theme: "default",
						templates: {
							itemAppendToEnd: true,
							box: '<ul className="jFiler-items-list jFiler-items-default"></ul>',
							item: '<li className="jFiler-item">\
                      <div className="jFiler-item-container">\
                        <div className="jFiler-item-inner">\
                          <div className="jFiler-item-icon pull-left"></div>\
                            <div className="jFiler-item-info pull-left">\
                              <span className="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>\
                              <span className="jFiler-item-others">\
                                <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span className="jFiler-item-status">{{fi-progressBar}}</span>\
                              </span>\
                              <div className="jFiler-item-assets">\
                                <ul className="list-inline">\
                                  <li><a className="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                              </ul>\
                            </div>\
                            <div><input type="hidden" name="name[]" value="{{fi-name}}"></div>\
                            <div><input name="caption[]"></div>\
                          </div>\
                        </div>\
                      </div>\
                    </li>',
							itemAppend:
								'<li className="jFiler-item">\
              <div className="jFiler-item-container">\
                <div className="jFiler-item-inner">\
                  <div className="jFiler-item-icon pull-left"></div>\
                    <div className="jFiler-item-info pull-left">\
                      <span className="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>\
                      <span className="jFiler-item-others">\
                        <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span className="jFiler-item-status">{{fi-progressBar}}</span>\
                      </span>\
                      <div className="jFiler-item-assets">\
                        <ul className="list-inline">\
                          <li><a href="{{fi-url}}" className="text-secondary" target="_blank"><i className="fa fa-search-plus"></i></a></li>\
                          <li><a href="{{fi-url}}" className="text-secondary" download><i className="fa fa-download"></i></a></li>\
                          <li><a className="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                      </ul>\
                    </div>\
                    <div><input type="hidden" name="name[]" value="{{fi-name}}"></div>\
                    <div><input className="caption" name="caption[]"></div>\
                  </div>\
                </div>\
              </div>\
            </li>',
						},
						files: fileData,
						afterRender: function () {
							$.each(data.data, function (key, value) {
								var caption = $(".jFiler-item").find("input.caption")[key];
								$(caption).val(value.caption);
							});
						},
					});
				},
			});
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
							if (res.data.message == "Duplicate Container Code") {
								ToastNotify("error", res.data.message);
								ControlOverlay(false);
							} else {
								ToastNotify("success", "Container created successfully.");
								navigate("/asset/container/update/id=" + res.data.data, {
									state: {formType: "Update", id: res.data.data},
								});
							}
						}
					}
				);
			} else {
				UpdateData(
					formState.id,
					globalContext,
					props.data.modelLink,
					formdata
				).then((res) => {
					if (res.data.data) {
						ToastNotify("success", "Container updated successfully.");
						navigate("/asset/container/update/id=" + res.data.data, {
							state: {formType: "Update", id: res.data.data},
						});
					} else {
						ToastNotify("error", "Error");
						ControlOverlay(false);
					}
				});
			}
		};

		function handleChangeContainerType(val) {
			if (val) {
				getContainerType(val.value, globalContext).then((res) => {
					setValue("Container[Length]", res[0].Length);
					setValue("Container[Width]", res[0].Width);
					setValue("Container[Height]", res[0].Height);
					setValue("Container[NetWeight]", res[0].NetWeight);
					setValue("Container[Tues]", res[0].Tues);
				});
			} else {
				setValue("Container[Length]", "");
				setValue("Container[Width]", "");
				setValue("Container[Height]", "");
				setValue("Container[NetWeight]", "");
				setValue("Container[Tues]", "");
			}
		}

		function handleChangeBoxOpBranch(val) {
			if (val) {
				GetBranchData(val.value, globalContext).then((res) => {
					setValue("DynamicModel[BoxOpBranch]", res.data.BranchCode);
				});
			} else {
				setValue("DynamicModel[BoxOpBranch]", "");
			}
		}

		function handleChangeDepotBranch(val) {
			if (val) {
				GetBranchData(val.value, globalContext).then((res) => {
					setValue("DynamicModel[BranchROC]", res.data.BranchCode);
				});
			} else {
				setValue("DynamicModel[BranchROC]", "");
			}
		}

		function handleChangeBoxOperator(val) {
			if (val) {
				getCompanyBranches(val.CompanyUUID, globalContext).then((res) => {
					var arrayBoxOperatorBranch = [];

					$.each(res, function (key, value) {
						$.each(value.companyBranchHasCompanyTypes, function (key, value2) {
							if (value2.CompanyType == "----boxoperator") {
								arrayBoxOperatorBranch.push({
									value: value.CompanyBranchUUID,
									label: value.BranchName + "(" + value.portCode.PortCode + ")",
								});
							}
						});
					});

					setBoxOperatorBranch(sortArray(arrayBoxOperatorBranch));
					setValue("DynamicModel[BoxOpROC]", res[0].company.ROC);
					setValue("Container[BoxOperator]", arrayBoxOperatorBranch[0].value);
					setValue("DynamicModel[BoxOpBranch]", res[0].BranchCode);
				});
			} else {
				setBoxOperatorBranch([]);
				setValue("DynamicModel[BoxOpROC]", "");
				setValue("Container[BoxOperator]", "");
				setValue("DynamicModel[BoxOpBranch]", "");
			}
		}

		function handleChangeCompany(val) {
			if (val) {
				GetCompaniesData(val, globalContext).then((res) => {
					setValue("DynamicModel[OwnerROC]", res.data[0].ROC);
				});
			} else {
				setValue("DynamicModel[OwnerROC]", "");
			}
		}

		function handleOpenMenu(data) {
			if (state) {
				if (state.formType !== "New" && state.formType !== "Clone") {
					$.each(data, function (key, value) {
						$.each(MovementStatus, function (key2, value2) {
							if (value2 == value.label) {
								value.selected = true;
							}
						});
					});
				}
			} else {
				if (params) {
					$.each(data, function (key, value) {
						$.each(MovementStatus, function (key2, value2) {
							if (value2 == value.label) {
								value.selected = true;
							}
						});
					});
				}
			}
		}

		function handleChangeDepotCompany(val) {
			if (val) {
				getCompanyBranches(val.CompanyUUID, globalContext).then((res) => {
					var arrayDepotBranch = [];

					$.each(res, function (key, value) {
						$.each(value.companyBranchHasCompanyTypes, function (key, value2) {
							if (value2.CompanyType == "----depot") {
								arrayDepotBranch.push({
									value: value.CompanyBranchUUID,
									label: value.BranchName + "(" + value.portCode.PortCode + ")",
								});
							}
						});
					});
					setValue("DynamicModel[BranchROC]", "");

					setDepotBranch(sortArray(arrayDepotBranch));
					setValue("DynamicModel[DepotROC]", res[0].company.ROC);
					setValue("Container[Depot]", arrayDepotBranch[0].value);
					setValue("DynamicModel[BranchROC]", res[0].BranchCode);

					trigger();
				});
			} else {
				setValue("DynamicModel[BranchROC]", "");

				setDepotBranch([]);
				setValue("DynamicModel[DepotROC]", "");
				setValue("Container[Depot]", "");
				setValue("DynamicModel[BranchROC]", "");

				trigger();
			}
		}

		function handleCOCType(val) {
			if (val) {
				if (val.value == "Own") {
					$(".cOCHiredContractRow").addClass("d-none");
				} else {
					$(".cOCHiredContractRow").removeClass("d-none");
				}
			}
		}

		function handleChangeOwner(val) {
			if (val) {
				if (val.value == "COC") {
					$(".CocCard").removeClass("d-none");
					$(".SocCard").addClass("d-none");
					GetCompanyByShipOrBox("----boxoperator", globalContext).then(
						(res) => {
							if (res.data.length > 0) {
								$.each(res.data, function (key, value) {
									if (value.CompanyName == "SHIN YANG SHIPPING SDN BHD") {
										setValue("DynamicModel[boxopname]", {
											CompanyUUID: value.CompanyUUID,
											CompanyName: value.CompanyName,
										});
										handleChangeBoxOperator({
											CompanyName: value.CompanyName,
											CompanyUUID: value.CompanyUUID,
										});
									}
								});
							}
						}
					);
				}
				if (val.value == "SOC") {
					$(".CocCard").addClass("d-none");
					$(".SocCard").removeClass("d-none");
				}
			}
		}

		useEffect(() => {
			if (state == null) {
				trigger();

				if (Object.keys(params).length === 0) {
					setFormState({formType: "New"});
				} else {
					setFormState({formType: "Update", id: params.id});
				}
			} else {
				trigger();
				setFormState(state);
			}
			return () => {};
		}, [state]);

		useEffect(() => {
			setMovementStat(false);
			setValue("Container[ContainerCode]", "");
			setValue("Container[ContainerType]", "");
			setValue("Container[OwnershipType]", "");
			setValue("Container[DepotCompany]", "");
			setValue("Container[Depot]", "");
			trigger();
			reset();

			toThreeDecimalPlaces();
			//trigger();

			var test = $(".jFiler-input").length;
			$(".jFiler-items").remove();
			$(".jFiler-input").remove();
			if (test == 1) {
				getFiles();
			}
			if (state) {
				if (state.formType == "New") {
					if (test == 0) {
						getFiles();
					}
				}
			} else {
				if (test == 0) {
					getFiles();
				}
			}

			$("#ContainerAttachments").click(function () {
				//reset jqeury filer container
				if ($(".jFiler-theme-default").length > 1) {
					$(".jFiler-theme-default").last().unwrap();
				}
			});

			GetAllDropDown(
				["Company", "CompanyBranch", "ContainerType"],
				globalContext
			).then((res) => {
				$.each(res.ContainerType, function (key, value) {
					ArrayContainerType.push({
						value: value.ContainerTypeUUID,
						label: value.ContainerType,
					});
				});

				setContainerType(sortArray(ArrayContainerType));
				trigger("Container[Status]");
			});

			GetCompanyByShipOrBox("----boxoperator", globalContext).then((res) => {
				//get all approved status
				$.each(res.data, function (key, value) {
					if (value.VerificationStatus == "Approved" && value.Valid == 1) {
						arrayBoxOperator.push({
							value: value.CompanyUUID,
							label: value.CompanyName,
						});
					}
				});

				setBoxOperator(sortArray(arrayBoxOperator));
			});

			if (state) {
				if (state.formType == "Update" || state.formType == "Clone") {
					ControlOverlay(true);

					GetUpdateData(state.id, globalContext, props.data.modelLink).then(
						(res) => {
							$.each(res.data.data, function (key, value) {
								setValue("Container[" + key + "]", value);
							});
							if (res.data.data.VerificationStatus == "Pending") {
								$(".VerificationStatusField").text("Draft");
								$(".VerificationStatusField").removeClass("text-danger");
							} else if (res.data.data.VerificationStatus == "Rejected") {
								$(".VerificationStatusField").text("Rejected");
								$(".VerificationStatusField").addClass("text-danger");
							}
							$(".VerificationStatusField").last().addClass("d-none");
							if (res.data.data.Valid == "1") {
								$(".validCheckbox").prop("checked", true);
							} else {
								$(".validCheckbox").prop("checked", false);
							}

							GetBranchData(res.data.data.BoxOperator, globalContext).then(
								(res) => {
									setValue("DynamicModel[boxopname]", {
										CompanyUUID: res.data.Company,
										CompanyName: res.data.company.CompanyName,
									});
									handleChangeBoxOperator({
										CompanyUUID: res.data.Company,
										CompanyName: res.data.company.CompanyName,
									});
								}
							);
							GetBranchData(res.data.data.Depot, globalContext).then((res) => {
								setValue("Container[DepotCompany]", {
									CompanyUUID: res.data.Company,
									CompanyName: res.data.company.CompanyName,
								});
								handleChangeDepotCompany({
									CompanyUUID: res.data.Company,
									CompanyName: res.data.company.CompanyName,
								});
							});
							if (res.data.data.Owner) {
								setValue("Container[Owner]", {
									CompanyUUID: res.data.data.Owner,
									CompanyName: res.data.data.owner.CompanyName,
								});
								handleChangeCompany({
									CompanyUUID: res.data.data.Owner,
									CompanyName: res.data.data.owner.CompanyName,
								});
							}
							if ($.inArray(res.data.data.Status, MovementStatus) >= 0) {
								setMovementStat(true);
								// $(".Status").addClass("readOnlySelect")
							}

							if (state.formType == "Clone") {
								setMovementStat(false);
								setValue("Container[Status]", "Available");
							}

							$(".jFiler-input").remove();
							getFiles(res.data.data.ContainerUUID);
							ControlOverlay(false);
							trigger();
							setCheckLoadState(true);
						}
					);
				}
			} else {
				if (Object.keys(params).length !== 0) {
					ControlOverlay(true);
					GetUpdateData(params.id, globalContext, props.data.modelLink).then(
						(res) => {
							$.each(res.data.data, function (key, value) {
								setValue("Container[" + key + "]", value);
							});
							if (res.data.data.VerificationStatus == "Pending") {
								$(".VerificationStatusField").text("Draft");
								$(".VerificationStatusField").removeClass("text-danger");
							} else if (res.data.data.VerificationStatus == "Rejected") {
								$(".VerificationStatusField").text("Rejected");
								$(".VerificationStatusField").addClass("text-danger");
							}
							$(".VerificationStatusField").last().addClass("d-none");
							if (res.data.data.Valid == "1") {
								$(".validCheckbox").prop("checked", true);
							} else {
								$(".validCheckbox").prop("checked", false);
							}

							GetBranchData(res.data.data.BoxOperator, globalContext).then(
								(res) => {
									setValue("DynamicModel[boxopname]", {
										CompanyUUID: res.data.Company,
										CompanyName: res.data.company.CompanyName,
									});
									handleChangeBoxOperator({
										CompanyUUID: res.data.Company,
										CompanyName: res.data.company.CompanyName,
									});
								}
							);
							GetBranchData(res.data.data.Depot, globalContext).then((res) => {
								setValue("Container[DepotCompany]", {
									CompanyUUID: res.data.Company,
									CompanyName: res.data.company.CompanyName,
								});
								handleChangeDepotCompany({
									CompanyUUID: res.data.Company,
									CompanyName: res.data.company.CompanyName,
								});
							});
							if (res.data.data.Owner) {
								setValue("Container[Owner]", {
									CompanyUUID: res.data.data.Owner,
									CompanyName: res.data.data.owner.CompanyName,
								});
								handleChangeCompany({
									CompanyUUID: res.data.data.Owner,
									CompanyName: res.data.data.owner.CompanyName,
								});
							}
							if ($.inArray(res.data.data.Status, MovementStatus) >= 0) {
								setMovementStat(true);
								//  $(".Status").addClass("readOnlySelect")
							}

							$(".jFiler-input").remove();
							getFiles(res.data.data.ContainerUUID);
							ControlOverlay(false);
							trigger();
							setCheckLoadState(true);
						}
					);
				}
			}

			return () => {};
		}, [state]);

		useEffect(() => {
			if (checkLoadState) {
				$(".inputDecimalThreePlaces").each(function (key, value) {
					if ($(value).val() !== "") {
						$(value).val(parseFloat($(value).val()).toFixed(3));
					}
				});
			}

			return () => {
				setCheckLoadState(false);
			};
		}, [checkLoadState]);

		$(".validCheckbox")
			.unbind("change")
			.bind("change", function () {
				if ($(this).prop("checked")) {
					setValue("Container[Valid]", "1");
				} else {
					setValue("Container[Valid]", "0");
				}
			});

		const handleSubmitForm = (e) => {
			handleSubmit(onSubmit)(e);
		};

		return (
			<form encType='multipart/form-data'>
				{formState ? (
					formState.formType == "Clone" || formState.formType == "New" ? (
						<CreateButton
							handleSubmitData={handleSubmitForm}
							title='Container'
							data={props}
						/>
					) : (
						<UpdateButton
							handleSubmitData={handleSubmitForm}
							title='Container'
							model='container'
							selectedId='ContainerUUIDs'
							id={formState.id}
							data={props}
						/>
					)
				) : (
					<CreateButton
						handleSubmitData={handleSubmitForm}
						title='Container'
						data={props}
					/>
				)}
				<div className='col-md-12'>
					<div className='card card-primary'>
						<div className='card-header'>Container Form</div>
						<div className='card-body'>
							<div className='row'>
								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.Container
													? errors.Container.ContainerCode
														? "has-error-label"
														: ""
													: ""
											}`}>
											Container Code
										</label>

										<input
											defaultValue=''
											{...register("Container[ContainerCode]", {
												required: "Container Code cannot be blank.",
											})}
											className={`form-control ${
												errors.Container
													? errors.Container.ContainerCode
														? "has-error"
														: ""
													: ""
											}`}
										/>
										<p>
											{errors.Container
												? errors.Container.ContainerCode && (
														<span style={{color: "#A94442"}}>
															{errors.Container.ContainerCode.message}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.Container
													? errors.Container.ContainerType
														? "has-error-label"
														: ""
													: ""
											}`}>
											Container Type
										</label>
										<Controller
											name='Container[ContainerType]'
											id='ContainerType'
											control={control}
											render={({field: {onChange, value}}) => (
												<Select
													isClearable={true}
													{...register("Container[ContainerType]", {
														required: "Container Type cannot be blank.",
													})}
													value={
														value
															? containerType.find((c) => c.value === value)
															: null
													}
													onChange={(val) => {
														val == null ? onChange(null) : onChange(val.value);
														handleChangeContainerType(val);
													}}
													options={containerType}
													className={`form-control ContainerType ${
														errors.Container
															? errors.Container.ContainerType
																? "has-error-select"
																: ""
															: ""
													}`}
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
										<p>
											{errors.Container
												? errors.Container.ContainerType && (
														<span style={{color: "#A94442"}}>
															{errors.Container.ContainerType.message}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Length(m)</label>

										<input
											defaultValue=''
											{...register("Container[Length]")}
											className={`form-control inputDecimalThreePlaces`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Width(M)</label>

										<input
											defaultValue=''
											{...register("Container[Width]")}
											className={`form-control inputDecimalThreePlaces`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Height(M)</label>

										<input
											defaultValue=''
											{...register("Container[Height]")}
											className={`form-control inputDecimalThreePlaces`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>M3(M)</label>

										<input
											defaultValue=''
											{...register("Container[M3]")}
											className={`form-control inputDecimalThreePlaces`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Net Weight(kg)</label>

										<input
											defaultValue=''
											{...register("Container[NetWeight]")}
											className={`form-control inputDecimalThreePlaces`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Gross Weight(kg)</label>

										<input
											defaultValue=''
											{...register("Container[GrossWeight]")}
											className={`form-control inputDecimalThreePlaces`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>
											Container Weight(kg)
										</label>

										<input
											defaultValue=''
											{...register("Container[ContainerWeight]")}
											className={`form-control inputDecimalThreePlaces`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Tues</label>

										<input
											type='number'
											defaultValue=''
											{...register("Container[Tues]")}
											className={`form-control`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Year Build</label>

										<input
											type='number'
											defaultValue=''
											{...register("Container[YearBuild]")}
											className={`form-control`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Grade</label>
										<Controller
											name='Container[Grade]'
											id='Grade'
											control={control}
											render={({field: {onChange, value}}) => (
												<Select
													isClearable={true}
													{...register("Container[Grade]")}
													value={
														value
															? gradeOption.find((c) => c.value === value)
															: null
													}
													onChange={(val) => {
														val == null ? onChange(null) : onChange(val.value);
													}}
													options={gradeOption}
													className='form-control Grade'
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.Container
													? errors.Container.Status
														? "has-error-label"
														: ""
													: ""
											}`}>
											Status
										</label>
										<Controller
											name='Container[Status]'
											id='Status'
											control={control}
											defaultValue={"Available"}
											render={({field: {onChange, value}}) => (
												<Select
													isClearable={true}
													{...register("Container[Status]", {
														required: "Status cannot be blank.",
													})}
													onMenuOpen={() => {
														handleOpenMenu(statusOption);
													}}
													isOptionDisabled={(selectedValue) =>
														selectedValue.selected == true
													}
													value={
														value
															? statusOption.find((c) => c.value === value)
															: null
													}
													onChange={(val) => {
														val == null ? onChange(null) : onChange(val.value);
													}}
													options={statusOption}
													className={`form-control Status ${
														movementStat ? "readOnlySelect" : ""
													} ${
														errors.Container
															? errors.Container.Status
																? "has-error-select"
																: ""
															: ""
													}`}
													classNamePrefix='select'
													styles={globalContext.customStyles}
													onKeyDown={handleKeydown}
												/>
											)}
										/>
										<p>
											{errors.Container
												? errors.Container.Status && (
														<span style={{color: "#A94442"}}>
															{errors.Container.Status.message}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-12'>
									<div className='form-group'>
										<label className='control-label'>Description</label>

										<textarea
											defaultValue=''
											{...register("Container[Description]")}
											className={`form-control`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-2'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.Container
													? errors.Container.OwnershipType
														? "has-error-label"
														: ""
													: ""
											}`}>
											Ownership Type
										</label>
										<Controller
											name='Container[OwnershipType]'
											id='OwnershipType'
											control={control}
											render={({field: {onChange, value}}) => (
												<Select
													isClearable={true}
													{...register("Container[OwnershipType]", {
														required: "Container Type cannot be blank.",
													})}
													value={
														value
															? ownerTypeOption.find((c) => c.value === value)
															: null
													}
													onChange={(val) => {
														val == null ? onChange(null) : onChange(val.value);
														handleChangeOwner(val);
													}}
													options={ownerTypeOption}
													className={`form-control OwnershipType ${
														errors.Container
															? errors.Container.OwnershipType
																? "has-error-select"
																: ""
															: ""
													}`}
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
										<p>
											{errors.Container
												? errors.Container.OwnershipType && (
														<span style={{color: "#A94442"}}>
															{errors.Container.OwnershipType.message}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Box Op Name</label>
										<Controller
											name='DynamicModel[boxopname]'
											id='boxopname'
											control={control}
											render={({field: {onChange, value}}) => (
												<AsyncSelect
													isClearable={true}
													value={value}
													{...register("DynamicModel[boxopname]")}
													cacheOptions
													placeholder={globalContext.asyncSelectPlaceHolder}
													onChange={(e) => {
														e == null
															? onChange(null)
															: onChange({
																	CompanyUUID: e.CompanyUUID,
																	CompanyName: e.CompanyName,
															  });
														handleChangeBoxOperator(e);
													}}
													getOptionLabel={(e) => e.CompanyName}
													getOptionValue={(e) => e.CompanyUUID}
													loadOptions={loadOptionsBoxOp}
													menuPortalTarget={document.body}
													className='form-control'
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-2'>
									<div className='form-group'>
										<label className='control-label'>Box Op ROC</label>

										<input
											defaultValue=''
											{...register("DynamicModel[BoxOpROC]")}
											className={`form-control`}
											readOnly
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Box Op Branch Name</label>
										<Controller
											name='Container[BoxOperator]'
											id='BoxOperator'
											control={control}
											render={({field: {onChange, value}}) => (
												<Select
													isClearable={true}
													{...register("Container[BoxOperator]")}
													value={
														value
															? boxOperatorBranch.find((c) => c.value === value)
															: null
													}
													onChange={(val) => {
														val == null ? onChange(null) : onChange(val.value);
														handleChangeBoxOpBranch(val);
													}}
													options={boxOperatorBranch}
													className='form-control BoxOperator'
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-2'>
									<div className='form-group'>
										<label className='control-label'>Box Op Branch</label>

										<input
											defaultValue=''
											{...register("DynamicModel[BoxOpBranch]")}
											className={`form-control`}
											readOnly
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label className='control-label'>Owner Company</label>
										<Controller
											name='Container[Owner]'
											id='Owner'
											control={control}
											render={({field: {onChange, value}}) => (
												<AsyncSelect
													isClearable={true}
													value={value}
													{...register("Container[Owner]")}
													cacheOptions
													placeholder={globalContext.asyncSelectPlaceHolder}
													onChange={(e) => {
														e == null
															? onChange(null)
															: onChange({
																	CompanyUUID: e.CompanyUUID,
																	CompanyName: e.CompanyName,
															  });
														handleChangeCompany(e);
													}}
													getOptionLabel={(e) => e.CompanyName}
													getOptionValue={(e) => e.CompanyUUID}
													loadOptions={loadOptionsOwner}
													menuPortalTarget={document.body}
													className='form-control Owner'
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-1'>
									<div className='form-group'>
										<label className='control-label'>Owner ROC</label>

										<input
											defaultValue=''
											{...register("DynamicModel[OwnerROC]")}
											className={`form-control`}
											readOnly
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.Container
													? errors.Container.DepotCompany
														? "has-error-label"
														: ""
													: ""
											}`}>
											Depot Company
										</label>
										<Controller
											name='Container[DepotCompany]'
											id='DepotCompany'
											control={control}
											render={({field: {onChange, value}}) => (
												<AsyncSelect
													isClearable={true}
													value={value}
													{...register("Container[DepotCompany]", {
														required: "Depot Company cannot be blank.",
													})}
													cacheOptions
													placeholder={globalContext.asyncSelectPlaceHolder}
													onChange={(e) => {
														e == null
															? onChange(null)
															: onChange({
																	CompanyUUID: e.CompanyUUID,
																	CompanyName: e.CompanyName,
															  });
														handleChangeDepotCompany(e);
													}}
													getOptionLabel={(e) => e.CompanyName}
													getOptionValue={(e) => e.CompanyUUID}
													loadOptions={loadOptionsDepot}
													menuPortalTarget={document.body}
													className={`form-control DepotCompany ${
														errors.Container
															? errors.Container.DepotCompany
																? "has-error-select"
																: ""
															: ""
													}`}
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
										<p>
											{errors.Container
												? errors.Container.DepotCompany && (
														<span style={{color: "#A94442"}}>
															{errors.Container.DepotCompany.message}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-1'>
									<div className='form-group'>
										<label className='control-label'>Depot ROC</label>

										<input
											defaultValue=''
											{...register("DynamicModel[DepotROC]")}
											className={`form-control`}
											readOnly
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3'>
									<div className='form-group'>
										<label
											className={`control-label ${
												errors.Container
													? errors.Container.Depot
														? "has-error-label"
														: ""
													: ""
											}`}>
											Depot Branch
										</label>
										<Controller
											name='Container[Depot]'
											id='Depot'
											control={control}
											render={({field: {onChange, value}}) => (
												<Select
													isClearable={true}
													{...register("Container[Depot]", {
														required: "Depot Branch cannot be blank.",
													})}
													value={
														value
															? depotBranch.find((c) => c.value === value)
															: null
													}
													onChange={(val) => {
														val == null ? onChange(null) : onChange(val.value);
														handleChangeDepotBranch(val);
													}}
													options={depotBranch}
													className={`form-control Depot ${
														errors.Container
															? errors.Container.Depot
																? "has-error-select"
																: ""
															: ""
													}`}
													classNamePrefix='select'
													styles={globalContext.customStyles}
												/>
											)}
										/>
										<p>
											{errors.Container
												? errors.Container.Depot && (
														<span style={{color: "#A94442"}}>
															{errors.Container.Depot.message}
														</span>
												  )
												: ""}
										</p>
									</div>
								</div>

								<div className='col-xs-12 col-md-1'>
									<div className='form-group'>
										<label className='control-label'>Depot Branch ROC</label>

										<input
											defaultValue=''
											{...register("DynamicModel[BranchROC]")}
											className={`form-control`}
											readOnly
										/>
									</div>
								</div>

								<div className='card lvl1 col-md-12'>
									<div className='card-body CocCard d-none'>
										<div className='row'>
											<div className='col-xs-12 col-md-2'>
												<div className='form-group'>
													<label className='control-label'>COC Type</label>
													<Controller
														name='Container[COCType]'
														id='COCType'
														control={control}
														render={({field: {onChange, value}}) => (
															<Select
																isClearable={true}
																{...register("Container[COCType]")}
																value={
																	value
																		? COCTypeOption.find(
																				(c) => c.value === value
																		  )
																		: null
																}
																onChange={(val) => {
																	val == null
																		? onChange(null)
																		: onChange(val.value);
																	handleCOCType(val);
																}}
																options={COCTypeOption}
																menuPortalTarget={document.body}
																className='form-control COCType'
																classNamePrefix='select'
																styles={globalContext.customStyles}
															/>
														)}
													/>
												</div>
											</div>

											<div className='col-xs-12 col-md-2 cOCHiredContractRow'>
												<div className='form-group'>
													<label className='control-label'>
														COC Hired Contract
													</label>
													<Controller
														name='Container[CocHiredContract]'
														id='CocHiredContract'
														control={control}
														render={({field: {onChange, value}}) => (
															<Select
																isClearable={true}
																{...register("Container[CocHiredContract]")}
																value={
																	value
																		? COCHiredContractOption.find(
																				(c) => c.value === value
																		  )
																		: null
																}
																onChange={(val) => {
																	val == null
																		? onChange(null)
																		: onChange(val.value);
																}}
																options={COCHiredContractOption}
																menuPortalTarget={document.body}
																className='form-control CocHiredContract'
																classNamePrefix='select'
																styles={globalContext.customStyles}
															/>
														)}
													/>
												</div>
											</div>
										</div>
									</div>

									<div className='card-body SocCard d-none'>
										<div className='row'>
											<div className='col-xs-12 col-md-2'>
												<div className='form-group'>
													<label className='control-label'>SOC Type</label>
													<Controller
														name='Container[SOCType]'
														id='SOCType'
														control={control}
														render={({field: {onChange, value}}) => (
															<Select
																isClearable={true}
																{...register("Container[SOCType]")}
																value={
																	value
																		? SOCTypeOption.find(
																				(c) => c.value === value
																		  )
																		: null
																}
																onChange={(val) => {
																	val == null
																		? onChange(null)
																		: onChange(val.value);
																}}
																options={SOCTypeOption}
																menuPortalTarget={document.body}
																className='form-control SOCType'
																classNamePrefix='select'
																styles={globalContext.customStyles}
															/>
														)}
													/>
												</div>
											</div>
											<div className='col-xs-12 col-md-2'>
												<div className='form-group'>
													<label className='control-label'>
														SOC Free Use Detail
													</label>
													<Controller
														name='Container[SocFreeUseDetail]'
														id='SocFreeUseDetail'
														control={control}
														render={({field: {onChange, value}}) => (
															<Select
																isClearable={true}
																{...register("Container[SocFreeUseDetail]")}
																value={
																	value
																		? SOCcFreeUseDetailOption.find(
																				(c) => c.value === value
																		  )
																		: null
																}
																onChange={(val) => {
																	val == null
																		? onChange(null)
																		: onChange(val.value);
																}}
																options={SOCcFreeUseDetailOption}
																menuPortalTarget={document.body}
																className='form-control SocFreeUseDetail'
																classNamePrefix='select'
																styles={globalContext.customStyles}
															/>
														)}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className='col-xs-12 col-md-12'>
									<div className='form-group'>
										<label className='control-label'>Attachment</label>
										<input
											type='file'
											id='ContainerAttachments'
											multiple
											{...register("Container[Attachment][]")}
											className={`Attachments`}
										/>
									</div>
								</div>

								<div className='col-xs-12 col-md-3 mt-2'>
									<div className='form-group mt-4 mb-1'>
										<input
											type='checkbox'
											className='validCheckbox'
											id='validCheckbox'
											defaultChecked
										/>
										<input
											type='text'
											className='form-control d-none'
											defaultValue='1'
											{...register("Container[Valid]")}
										/>
										<label
											className='control-label ml-2'
											htmlFor='validCheckbox'>
											Valid
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{formState ? (
					formState.formType == "Clone" || formState.formType == "New" ? (
						<CreateButton
							handleSubmitData={handleSubmitForm}
							title='Container'
							data={props}
						/>
					) : (
						<UpdateButton
							handleSubmitData={handleSubmitForm}
							title='Container'
							model='container'
							selectedId='ContainerUUIDs'
							id={formState.id}
							data={props}
						/>
					)
				) : (
					<CreateButton
						handleSubmitData={handleSubmitForm}
						title='Container'
						data={props}
					/>
				)}
			</form>
		);
}






export default Form