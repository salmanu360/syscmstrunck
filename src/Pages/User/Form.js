import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import AccessControl from "./AccessControl"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown,GetRuleSetRule, GetCompaniesData, getUserRules, sortArray } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $ from "jquery";
import AsyncSelect from 'react-select/async';
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


function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();


    const [company, setCompany] = useState([])
    const [companyBranch, setCompanyBranch] = useState([])

    const [userGroup, setUserGroup] = useState([])
    const [ruleSet, setRuleSet] = useState([])

    const [portAcessControl, setPortAcessControl] = useState([])
    const [defaultCompany, setDefaultCompany] = useState(null)

    const [accessControldata, setAccessControldata] = useState([])

    const titleOption = [
        {
            "value": "Mdm",
            "label": "Mdm"
        },
        {
            "value": "Mr.",
            "label": "Mr."
        },
        {
            "value": "Ms.",
            "label": "Ms."
        },
    ]

    const genderOption = [
        {
            "value": "Female",
            "label": "Female"
        },
        {
            "value": "Male",
            "label": "Male"
        },
        {
            "value": "Others",
            "label": "Others"
        },
    ]

    const loadOptionsCompany = (inputValue) => {
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response



    }

    const { register, handleSubmit, setValue, getValues, reset, trigger, control, watch, formState: { errors } } = useForm({ mode: "onChange" });

    function handleChangeRuleSet(){
        window.$("#ChangeRuleSetModal").modal("toggle");
    }

    function handleConfirmRuleSet(){
        $("#AccessControlTable").find("[type='checkbox']").prop("checked",false)
        GetRuleSetRule(getValues("User[RuleSet]"), "rule-set", globalContext).then(res=>{
            setAccessControldata({ scope: res.data.Scope, port: res.data.Port, freightTerm: res.data.FreightTerm })

            $.each(res.data.Rules, function (key, value) {
                $("#AccessControlTable").find("[type='checkbox']").each(function () {

                    if ($(this).attr("name").includes("AccessControl") == true) {
                        if ($(this).attr("name") == "AccessControl[" + value + "]") {
                            $(this).prop("checked", true);
                        }
                    }
                    else {
                        if ($(this).attr("name") == value) {
                            $(this).prop("checked", true);
                        }
                    }

                });

            })
        })
    }

    function handleChange(data) {
        if (data) {
            GetCompaniesData(data.CompanyUUID, globalContext).then(res => {
                if (res.data) {
                    var arrayCompanyBranch = []
                    $.each(res.data[0].companyBranches, function (key, value) {
                        arrayCompanyBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.BranchCode + ")" })
                    })

                    setCompanyBranch(arrayCompanyBranch)
                    if(data.Branch){
                        setValue("CompanyContact[Branch]", data.Branch)
                    }else{
                        setValue("CompanyContact[Branch]", res.data[0].companyBranches[0].CompanyBranchUUID)
                    }       
                   
                    trigger()


                }

            })
        }

    }
    function getFiles(id) {
			if (id) {
				$.ajax({
					url:
						globalContext.globalHost +
						globalContext.globalPathLink +
						"user/load-files?id=" +
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
							data.data[0].file = data.data[0].file + "?t=" + Math.random();
							fileData = data.data;
						}
						if (globalContext.profileImage !== data.data[0].file) {
							globalContext.profileImage =
								data.data[0].file + "?t=" + Math.random();
						}
						window.$("#ProfilePicture").filer({
							limit: 1,
							extensions: ["jpg", "png", "jpeg"],
							showThumbs: true,
							theme: "default",
							templates: {
								itemAppendToEnd: true,
								box: '<ul className="jFiler-items-list jFiler-items-grid"></ul>',
								item: '<li className="jFiler-item">\
                                <div className="jFiler-item-container">\
                                  <div className="jFiler-item-inner">\
                                    <div className="jFiler-item-thumb">\
                                      <div className="jFiler-item-status"></div>\
                                      <div className="jFiler-item-thumb-overlay">\
                                        <div className="jFiler-item-info">\
                                          <div style="display:table-cell;vertical-align: middle;">\
                                            <span className="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                            <span className="jFiler-item-others">{{fi-size2}}</span>\
                                          </div>\
                                        </div>\
                                      </div>\
                                      {{fi-image}}\
                                    </div>\
                                    <div className="jFiler-item-assets jFiler-row">\
                                      <ul className="list-inline pull-left">\
                                        <li>{{fi-progressBar}}</li>\
                                      </ul>\
                                      <ul className="list-inline pull-right">\
                                        <li><a className="jFiler-item-trash-action"><i className="fa fa-trash"></i></a></li>\
                                      </ul>\
                                    </div>\
                                    <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                                  </div>\
                                </div>\
                              </li>',
								itemAppend:
									'<li className="jFiler-item">\
                                  <div className="jFiler-item-container">\
                                    <div className="jFiler-item-inner">\
                                      <div className="jFiler-item-thumb">\
                                        <div className="jFiler-item-status"></div>\
                                        <div className="jFiler-item-thumb-overlay">\
                                          <div className="jFiler-item-info">\
                                            <div style="display:table-cell;vertical-align: middle;">\
                                              <span className="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                              <span className="jFiler-item-others">{{fi-size2}}</span>\
                                            </div>\
                                          </div>\
                                        </div>\
                                        {{fi-image}}\
                                      </div>\
                                      <div className="jFiler-item-assets jFiler-row">\
                                        <ul className="list-inline pull-left">\
                                          <li><span className="jFiler-item-others">{{fi-icon}}</span></li>\
                                        </ul>\
                                        <ul className="list-inline pull-right">\
                                          <li><a href="{{fi-url}}" className="text-secondary" target="_blank"><i className="fa fa-search-plus"></i></a></li>\
                                          <li><a href="{{fi-url}}" className="text-secondary" download><i className="fa fa-download"></i></a></li>\
                                          <li><a className="jFiler-item-trash-action"><i className="fa fa-trash"></i></a></li>\
                                        </ul>\
                                      </div>\
                                      <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                                    </div>\
                                  </div>\
                                </li>',
							},
							files: fileData,
						});
					},
				});
			} else {
				$.ajax({
					url:
						globalContext.globalHost +
						globalContext.globalPathLink +
						"user/load-files?id=" +
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
						window.$("#ProfilePicture").filer({
							limit: 1,
							extensions: ["jpg", "png", "jpeg"],
							showThumbs: true,
							theme: "default",
							templates: {
								itemAppendToEnd: true,
								box: '<ul className="jFiler-items-list jFiler-items-grid"></ul>',
								item: '<li className="jFiler-item">\
                                <div className="jFiler-item-container">\
                                  <div className="jFiler-item-inner">\
                                    <div className="jFiler-item-thumb">\
                                      <div className="jFiler-item-status"></div>\
                                      <div className="jFiler-item-thumb-overlay">\
                                        <div className="jFiler-item-info">\
                                          <div style="display:table-cell;vertical-align: middle;">\
                                            <span className="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                            <span className="jFiler-item-others">{{fi-size2}}</span>\
                                          </div>\
                                        </div>\
                                      </div>\
                                      {{fi-image}}\
                                    </div>\
                                    <div className="jFiler-item-assets jFiler-row">\
                                      <ul className="list-inline pull-left">\
                                        <li>{{fi-progressBar}}</li>\
                                      </ul>\
                                      <ul className="list-inline pull-right">\
                                        <li><a className="jFiler-item-trash-action"><i className="fa fa-trash"></i></a></li>\
                                      </ul>\
                                    </div>\
                                    <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                                  </div>\
                                </div>\
                              </li>',
								itemAppend:
									'<li className="jFiler-item">\
                                  <div className="jFiler-item-container">\
                                    <div className="jFiler-item-inner">\
                                      <div className="jFiler-item-thumb">\
                                        <div className="jFiler-item-status"></div>\
                                        <div className="jFiler-item-thumb-overlay">\
                                          <div className="jFiler-item-info">\
                                            <div style="display:table-cell;vertical-align: middle;">\
                                              <span className="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                              <span className="jFiler-item-others">{{fi-size2}}</span>\
                                            </div>\
                                          </div>\
                                        </div>\
                                        {{fi-image}}\
                                      </div>\
                                      <div className="jFiler-item-assets jFiler-row">\
                                        <ul className="list-inline pull-left">\
                                          <li><span className="jFiler-item-others">{{fi-icon}}</span></li>\
                                        </ul>\
                                        <ul className="list-inline pull-right">\
                                          <li><a href="{{fi-url}}" className="text-secondary" target="_blank"><i className="fa fa-search-plus"></i></a></li>\
                                          <li><a href="{{fi-url}}" className="text-secondary" download><i className="fa fa-download"></i></a></li>\
                                          <li><a className="jFiler-item-trash-action"><i className="fa fa-trash"></i></a></li>\
                                        </ul>\
                                      </div>\
                                      <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                                    </div>\
                                  </div>\
                                </li>',
							},
							files: [],
						});
					},
				});
			}
		}

		const onSubmit = (data, event) => {
			event.preventDefault();

			$("#AccessControlTable")
				.find("[type='checkbox']:checked")
				.each(function () {
					var name = $(this).attr("name");
					if (name.includes("AccessControl") == false) {
						$(this).attr("name", "AccessControl[" + name + "]");
					}
				});

			const formdata = new FormData($("form")[0]);

			for (var [key, value] of Array.from(formdata.entries())) {
				if (key !== "User[image]") {
					formdata.delete(key);
				}
			}

			var DataString = window.$($("form")[0]).serializeJSON();
			formdata.append("data", JSON.stringify(DataString));

			ControlOverlay(true);

			if (formState.formType == "New" || formState.formType == "Clone") {
				CreateData(globalContext, props.data.modelLink, formdata).then(
					(res) => {
						if (res.data) {
							if (res.data.message == "Duplicate Username!") {
								ToastNotify("error", res.data.message);
								ControlOverlay(false);
							} else {
								ToastNotify("success", "User created successfully.");
								navigate(
									"/setting/user-settings/user/update/id=" + res.data.data,
									{state: {formType: "Update", id: res.data.data}}
								);
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
						ToastNotify("success", "User updated successfully.");
						navigate("/setting/user-settings/user/update/id=" + res.data.data, {
							state: {formType: "Update", id: res.data.data},
						});
					} else {
						ToastNotify("error", "Error");
						ControlOverlay(false);
					}
				});
			}
		};

		useEffect(() => {
			if (state == null) {
				if (props.data.profile) {
					trigger();
					setFormState({formType: "Update", id: params.id, profile: true});
				} else {
					trigger();
					setFormState({formType: "Update", id: params.id});
				}
			} else {
				trigger();
				setFormState(state);
			}
			return () => {};
		}, [state]);

		useEffect(() => {
			$("#ProfilePicture").change(function () {
				var reader = new FileReader();
				reader.onload = function (e) {
					$("#img").attr("src", e.target.result);
				};
			});

			$("#ProfilePicture").click(function () {
				//reset jqeury filer container
				if ($(".jFiler-theme-default").length > 1) {
					$(".jFiler-theme-default").last().unwrap();
				}
			});
			$("#Grant").on("click", function () {
				$("#AccessControlTable")
					.find("input[type='checkbox']")
					.prop("checked", true);
			});

			$("#Revoke").on("click", function () {
				$("#AccessControlTable")
					.find("input[type='checkbox']")
					.prop("checked", false);
			});

			function readURL(input) {
				var ext = input.files[0]["name"]
					.substring(input.files[0]["name"].lastIndexOf(".") + 1)
					.toLowerCase();
				if (
					input.files &&
					input.files[0] &&
					(ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")
				) {
					var reader = new FileReader();
					reader.onload = function (e) {
						$("#img").attr("src", e.target.result);
					};

					reader.readAsDataURL(input.files[0]);
				} else {
					$("#img").attr("src", "/assets/no_preview.png");
				}
			}

			return () => {};
		}, []);

		useEffect(() => {
			setValue("User[username]", "");
			trigger();
			reset();

			if ($(".jFiler-input").length > 0) {
				$("#ProfilePicture").prop("jFiler").reset();
				$(".jFiler-item").not(":first").remove();
				$(".jFiler-items").remove();
				var length = $(".jFiler-theme-default").length;
				if (length > 1) {
					$(".jFiler-theme-default").last().unwrap();
				}
			} else {
				getFiles();
			}

			GetAllDropDown(
				["UserGroup", "RuleSet", "Company", "Area"],
				globalContext
			).then((res) => {
				var ArrayUserGroup = [];
				var ArrayRuleSet = [];
				var ArrayCompany = [];
				var ArrayBranch = [];
				var ArrayPort = [];

				$.each(res.UserGroup, function (key, value) {
					ArrayUserGroup.push({
						value: value.UserGroupUUID,
						label: value.UserGroup,
					});
				});

				$.each(res.RuleSet, function (key, value) {
					ArrayRuleSet.push({value: value.RuleSetUUID, label: value.RuleSet});
				});
				$.each(res.Company, function (key, value) {
					ArrayCompany.push({
						value: value.CompanyUUID,
						label: value.CompanyName,
					});
				});

				$.each(res.Area, function (key, value) {
					ArrayPort.push({value: value.AreaUUID, label: value.PortCode});
				});

				setPortAcessControl(sortArray(ArrayPort));
				setUserGroup(sortArray(ArrayUserGroup));
				setRuleSet(sortArray(ArrayRuleSet));
				setCompany(sortArray(ArrayCompany));
				// setCompanyBranch(sortArray(ArrayBranch))
			});

			if (state) {
				if (state.formType == "Update" || state.formType == "Clone") {
					ControlOverlay(true);
					GetUpdateData(state.id, globalContext, props.data.modelLink).then(
						(res) => {
							if (state.formType == "Clone" && state.type == "Company") {
								setValue(
									"CompanyContact[Branch]",
									res.data.data.companyContact.Branch
								);
							} else {
								$.each(res.data.data, function (key, value) {
									setValue("User[" + key + "]", value);
								});

								$.each(res.data.data.companyContact, function (key, value) {
									setValue("CompanyContact[" + key + "]", value);
								});

								if (res.data.data.userGroup) {
									setValue(
										"User[UserGroup]",
										res.data.data.userGroup.UserGroupUUID
									);
								}
								handleChange({
									CompanyUUID: res.data.data.company.CompanyUUID,
									Branch: res.data.data.companyContact.Branch,
								});
							}

							if (res.data.data.Valid == "1") {
								$(".validCheckbox").prop("checked", true);
							} else {
								$(".validCheckbox").prop("checked", false);
							}

							setDefaultCompany({
								CompanyName: res.data.data.company.CompanyName,
								CompanyUUID: res.data.data.company.CompanyUUID,
							});

							if (state.formType !== "Clone") {
								$(".jFiler-input").remove();
								getFiles(state.id);
							}
							ControlOverlay(false);
							trigger();
						}
					);

					getUserRules(state.id, globalContext, props.data.modelLink).then(
						(res) => {
							if (res.data.Scope == "BRANCH") {
								$(".Port").parent().removeClass("d-none");
							}

							setAccessControldata({
								scope: res.data.Scope,
								port: res.data.Port,
								freightTerm: res.data.FreightTerm,
							});

							$.each(res.data.Rules, function (key, value) {
								$("#AccessControlTable")
									.find("[type='checkbox']")
									.each(function () {
										if (
											$(this).attr("name").includes("AccessControl") == true
										) {
											if (
												$(this).attr("name") ==
												"AccessControl[" + value + "]"
											) {
												$(this).prop("checked", true);
											}
										} else {
											if ($(this).attr("name") == value) {
												$(this).prop("checked", true);
											}
										}
									});
							});
						}
					);
				}
			} else {
				ControlOverlay(true);

				GetUpdateData(params.id, globalContext, props.data.modelLink).then(
					(res) => {
						$.each(res.data.data, function (key, value) {
							setValue("User[" + key + "]", value);
						});

						$.each(res.data.data.companyContact, function (key, value) {
							setValue("CompanyContact[" + key + "]", value);
						});

						if (res.data.data.userGroup) {
							setValue(
								"User[UserGroup]",
								res.data.data.userGroup.UserGroupUUID
							);
						}

						handleChange({
							CompanyUUID: res.data.data.company.CompanyUUID,
							Branch: res.data.data.companyContact.Branch,
						});

						if (res.data.data.Valid == "1") {
							$(".validCheckbox").prop("checked", true);
						} else {
							$(".validCheckbox").prop("checked", false);
						}
						setDefaultCompany({
							CompanyName: res.data.data.company.CompanyName,
							CompanyUUID: res.data.data.company.CompanyUUID,
						});
						$(".jFiler-input").remove();
						getFiles(params.id);
						ControlOverlay(false);
						trigger();

						getUserRules(params.id, globalContext, props.data.modelLink).then(
							(res) => {
								if (res.data.Scope == "BRANCH") {
									$("#Port").parent().removeClass("d-none");
								}

								setAccessControldata({
									scope: res.data.Scope,
									port: res.data.Port,
									freightTerm: res.data.FreightTerm,
								});

								$.each(res.data.Rules, function (key, value) {
									$("#AccessControlTable")
										.find("[type='checkbox']")
										.each(function () {
											if (
												$(this).attr("name").includes("AccessControl") == true
											) {
												if (
													$(this).attr("name") ==
													"AccessControl[" + value + "]"
												) {
													$(this).prop("checked", true);
												}
											} else {
												if ($(this).attr("name") == value) {
													$(this).prop("checked", true);
												}
											}
										});
								});
							}
						);
					}
				);
			}

			return () => {};
		}, [state]);

		$(".validCheckbox")
			.unbind("change")
			.bind("change", function () {
				if ($(this).prop("checked")) {
					setValue("User[Valid]", "1");
				} else {
					setValue("User[Valid]", "0");
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
							title='User'
							data={props}
						/>
					) : formState.profile ? (
						<UpdateButton
							handleSubmitData={handleSubmitForm}
							title='User'
							model='user'
							selectedId='UserUUIDs'
							id={formState.id}
							profile={true}
							data={props}
						/>
					) : (
						<UpdateButton
							handleSubmitData={handleSubmitForm}
							title='User'
							model='user'
							selectedId='UserUUIDs'
							id={formState.id}
							data={props}
						/>
					)
				) : (
					<CreateButton
						handleSubmitData={handleSubmitForm}
						title='User'
						data={props}
					/>
				)}

				<div className='col-md-12'>
					<div className='card card-primary'>
						<div className='card-header'>User Form</div>
						<div className='card-body'>
							<div className='card user lvl1'>
								<div className='card-body'>
									<div className='card-header'>
										<h3 className='card-title'>User Details</h3>
									</div>

									<div className='row'>
										<div className='col-xs-12 col-md-4'>
											<div className='form-group'>
												<label
													className={`control-label ${
														errors.User
															? errors.User.username
																? "has-error-label"
																: ""
															: ""
													}`}>
													Username
												</label>

												{state ? (
													state.formType == "Update" ? (
														<input
															defaultValue=''
															{...register("User[username]", {
																required: "Username cannot be blank.",
															})}
															className={`form-control ${
																errors.User
																	? errors.User.username
																		? "has-error"
																		: ""
																	: ""
															}`}
															readOnly
														/>
													) : (
														<input
															defaultValue=''
															{...register("User[username]", {
																required: "Username cannot be blank.",
															})}
															className={`form-control ${
																errors.User
																	? errors.User.username
																		? "has-error"
																		: ""
																	: ""
															}`}
														/>
													)
												) : (
													<input
														defaultValue=''
														{...register("User[username]", {
															required: "Username cannot be blank.",
														})}
														className={`form-control ${
															errors.User
																? errors.User.username
																	? "has-error"
																	: ""
																: ""
														}`}
														readOnly
													/>
												)}

												<p>
													{errors.User
														? errors.User.username && (
																<span style={{color: "#A94442"}}>
																	{errors.User.username.message}
																</span>
														  )
														: ""}
												</p>
											</div>
										</div>

										<div className='col-xs-12 col-md-2'>
											<div className='form-group'>
												<label
													className={`control-label ${
														errors.User
															? errors.User.email
																? "has-error-label"
																: ""
															: ""
													}`}>
													Email
												</label>
												{state ? (
													state.formType == "Update" ? (
														<input
															defaultValue=''
															{...register("User[email]", {
																required: "Email cannot be blank.",
															})}
															className={`form-control ${
																errors.User
																	? errors.User.email
																		? "has-error"
																		: ""
																	: ""
															}`}
															readOnly
														/>
													) : (
														<input
															defaultValue=''
															{...register("User[email]", {
																required: "Email cannot be blank.",
															})}
															className={`form-control ${
																errors.User
																	? errors.User.email
																		? "has-error"
																		: ""
																	: ""
															}`}
														/>
													)
												) : (
													<input
														defaultValue=''
														{...register("User[email]", {
															required: "Email cannot be blank.",
														})}
														className={`form-control ${
															errors.User
																? errors.User.email
																	? "has-error"
																	: ""
																: ""
														}`}
														readOnly
													/>
												)}
												<p>
													{errors.User
														? errors.User.email && (
																<span style={{color: "#A94442"}}>
																	{errors.User.email.message}
																</span>
														  )
														: ""}
												</p>
											</div>
										</div>

										<div className='col-xs-12 col-md-2'>
											<div className='form-group'>
												<label className='control-label'>NRIC</label>

												<input
													defaultValue=''
													{...register("User[NRIC]")}
													className={`form-control`}
												/>
											</div>
										</div>

										<div className='col-xs-12 col-md-2'>
											<div className='form-group'>
												<label className='control-label'>User Group</label>
												<Controller
													name='User[UserGroup]'
													id='UserGroup'
													control={control}
													render={({field: {onChange, value}}) => (
														<Select
															name='User[UserGroup]'
															value={
																value
																	? userGroup.find((c) => c.value === value)
																	: null
															}
															onChange={(val) =>
																val == null
																	? onChange(null)
																	: onChange(val.value)
															}
															isClearable={true}
															options={userGroup}
															className='basic-single'
															classNamePrefix='select'
															styles={globalContext.customStyles}
														/>
													)}
												/>
											</div>
										</div>

										<div className='col-xs-12 col-md-2'>
											<div className='form-group'>
												<label className='control-label'>Rule Set</label>
												<Controller
													name='User[RuleSet]'
													id='RuleSet'
													control={control}
													render={({field: {onChange, value}}) => (
														<Select
															name='User[RuleSet]'
															value={
																value
																	? ruleSet.find((c) => c.value === value)
																	: null
															}
															onChange={(val) => {
																val == null
																	? onChange(null)
																	: onChange(val.value);
																handleChangeRuleSet();
															}}
															isClearable={true}
															options={ruleSet}
															className='basic-single'
															classNamePrefix='select'
															styles={globalContext.customStyles}
														/>
													)}
												/>
											</div>
										</div>

										<div className='col-xs-12 col-md-3'>
											<div className='form-group'>
												<label className='control-label'>Company</label>

												<Controller
													name='User[CompanyContact]'
													id='CompanyName'
													control={control}
													render={({field: {onChange, value}}) => (
														<AsyncSelect
															isClearable={true}
															value={defaultCompany}
															{...register("User[CompanyContact]")}
															cacheOptions
															placeholder={globalContext.asyncSelectPlaceHolder}
															onChange={(e) => {
																e == null ? onChange(null) : onChange(e.id);
																setDefaultCompany(e);
																handleChange(e);
															}}
															getOptionLabel={(e) => e.CompanyName}
															getOptionValue={(e) => e.CompanyUUID}
															loadOptions={loadOptionsCompany}
															menuPortalTarget={document.body}
															className='basic-single CompanyName'
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
														errors.CompanyContact
															? errors.CompanyContact.Branch
																? "has-error-label"
																: ""
															: ""
													}`}>
													Branch
												</label>
												<Controller
													name='CompanyContact[Branch]'
													id='Branch'
													control={control}
													render={({field: {onChange, value}}) => (
														<Select
															{...register("CompanyContact[Branch]", {
																required: "Branch cannot be blank.",
															})}
															value={
																value
																	? companyBranch.find((c) => c.value === value)
																	: null
															}
															onChange={(val) =>
																val == null
																	? onChange(null)
																	: onChange(val.value)
															}
															isClearable={true}
															options={companyBranch}
															className={`basic-single ${
																errors.CompanyContact
																	? errors.CompanyContact.Branch
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
													{errors.CompanyContact
														? errors.CompanyContact.Branch && (
																<span style={{color: "#A94442"}}>
																	{errors.CompanyContact.Branch.message}
																</span>
														  )
														: ""}
												</p>
											</div>
										</div>

										<div className='col-xs-12 col-md-3'>
											<div className='form-group'>
												<label className='control-label'>Department</label>

												<input
													defaultValue=''
													{...register("CompanyContact[Department]")}
													className={`form-control`}
												/>
											</div>
										</div>

										<div className='col-xs-12 col-md-3'>
											<div className='form-group'>
												<label className='control-label'>Position</label>

												<input
													defaultValue=''
													{...register("CompanyContact[Position]")}
													className={`form-control`}
												/>
											</div>
										</div>

										<div className='row'>
											<div className='col-xs-12 col-md-6'>
												<div className='form-group'>
													<label className='control-label'>Image</label>
													<input
														type='file'
														id='ProfilePicture'
														{...register("User[image]")}
														className={`ProfilePicture`}
													/>
												</div>
											</div>
											{props.data.profile ? (
												""
											) : (
												<div className='col-xs-12 col-md-6'>
													<button
														type='button'
														id='AccessControl'
														className='btn btn-success float-right mt-4'
														title='Access Control'
														data-toggle='modal'
														data-target='#AccessControlModal'>
														Access Control
													</button>
												</div>
											)}
										</div>
									</div>

									<div className='card user lvl1'>
										<div className='card-header'>
											<h3 className='card-title'>Contact Details</h3>
										</div>
										<div className='card-body'>
											<div className='row'>
												<div className='col-xs-12 col-md-1'>
													<div className='form-group'>
														<label className='control-label'>Title</label>
														<Controller
															name='CompanyContact[Title]'
															id='Title'
															control={control}
															render={({field: {onChange, value}}) => (
																<Select
																	name='CompanyContact[Title]'
																	value={
																		value
																			? titleOption.find(
																					(c) => c.value === value
																			  )
																			: null
																	}
																	onChange={(val) =>
																		val == null
																			? onChange(null)
																			: onChange(val.value)
																	}
																	isClearable={true}
																	options={titleOption}
																	className='basic-single'
																	classNamePrefix='select'
																	styles={globalContext.customStyles}
																/>
															)}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>First Name</label>

														<input
															defaultValue=''
															{...register("CompanyContact[FirstName]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>Last Name</label>

														<input
															defaultValue=''
															{...register("CompanyContact[LastName]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-2'>
													<div className='form-group'>
														<label className='control-label'>Gender</label>
														<Controller
															name='CompanyContact[Gender]'
															id='Gender'
															control={control}
															render={({field: {onChange, value}}) => (
																<Select
																	name='CompanyContact[Gender]'
																	value={
																		value
																			? genderOption.find(
																					(c) => c.value === value
																			  )
																			: null
																	}
																	onChange={(val) =>
																		val == null
																			? onChange(null)
																			: onChange(val.value)
																	}
																	isClearable={true}
																	options={genderOption}
																	className='basic-single'
																	classNamePrefix='select'
																	styles={globalContext.customStyles}
																/>
															)}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>
															Date Of Birth
														</label>
														<Controller
															name='CompanyContact[DOB]'
															control={control}
															render={({field: {onChange, value}}) => (
																<>
																	<Flatpickr
																		value={value}
																		{...register("CompanyContact[DOB]")}
																		onChange={(val) => {
																			onChange(
																				moment(val[0]).format("DD/MM/YYYY")
																			);
																		}}
																		className='form-control DOB'
																		options={{
																			dateFormat: "d/m/Y",
																		}}
																	/>
																</>
															)}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-4'>
													<div className='form-group'>
														<label className='control-label'>Tel</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Tel]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-1'>
													<div className='form-group'>
														<label className='control-label'>Ext</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Ext]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>Fax</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Fax]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-4'>
													<div className='form-group'>
														<label className='control-label'>
															Contact Email
														</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Email]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-12'>
													<div className='form-group'>
														<label className='control-label'>
															Address Line 1
														</label>

														<input
															defaultValue=''
															{...register("CompanyContact[AddressLine1]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-12'>
													<div className='form-group'>
														<label className='control-label'>
															Address Line 2
														</label>

														<input
															defaultValue=''
															{...register("CompanyContact[AddressLine2]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-12'>
													<div className='form-group'>
														<label className='control-label'>
															Address Line 3
														</label>

														<input
															defaultValue=''
															{...register("CompanyContact[AddressLine3]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>Postcode</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Postcode]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>City</label>

														<input
															defaultValue=''
															{...register("CompanyContact[City]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>Country</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Country]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-3'>
													<div className='form-group'>
														<label className='control-label'>Coordinates</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Coordinates]")}
															className={`form-control`}
														/>
													</div>
												</div>

												<div className='col-xs-12 col-md-12'>
													<div className='form-group'>
														<label className='control-label'>Remark</label>

														<input
															defaultValue=''
															{...register("CompanyContact[Remark]")}
															className={`form-control`}
														/>
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

				{/* Access Control modal */}
				<div
					className='modal fade'
					id='AccessControlModal'
					tabIndex='-1'
					role='dialog'
					aria-hidden='true'>
					<div className='modal-dialog modal-xl' role='document'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title'>Access Control Right</h5>
								<button
									type='button'
									className='close'
									data-dismiss='modal'
									aria-label='Close'>
									<span aria-hidden='true'>&times;</span>
								</button>
							</div>
							<div className='modal-body'>
								<AccessControl
									portOption={portAcessControl}
									data={accessControldata}
								/>

								<button
									type='button'
									className='btn btn-success mr-1'
									id='Grant'>
									Grant
								</button>
								<button type='button' className='btn btn-danger' id='Revoke'>
									Revoke
								</button>
							</div>
							<div className='modal-footer d-none'>
								<button
									type='button'
									className='btn btn-primary mt-2'
									id='SaveAccessControl'
									data-dismiss='modal'>
									Save
								</button>
								<button
									type='button'
									className='add btn btn-secondary'
									data-dismiss='modal'>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* <!-- Modal: User Group Change  --> */}
				<div
					className='modal fade'
					id='ChangeRuleSetModal'
					tabindex='-1'
					role='dialog'
					aria-hidden='true'>
					<div className='modal-dialog' role='document'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title'>Change Rule Set</h5>
								<button
									type='button'
									className='close'
									data-dismiss='modal'
									aria-label='Close'>
									<span aria-hidden='true'>&times;</span>
								</button>
							</div>
							<div className='modal-body'>
								<h4>
									Do you want to replace the same User Rules as this Rule Set?
								</h4>
							</div>
							<div className='modal-footer'>
								<button
									type='button'
									className='btn btn-primary mt-2'
									id='ChangeRuleSet'
									onClick={handleConfirmRuleSet}
									data-dismiss='modal'>
									Yes
								</button>
								<button
									type='button'
									className='add btn btn-secondary'
									id='KeepRuleSet'
									data-dismiss='modal'>
									No
								</button>
							</div>
						</div>
					</div>
				</div>
				{formState ? (
					formState.formType == "Clone" || formState.formType == "New" ? (
						<CreateButton
							handleSubmitData={handleSubmitForm}
							title='User'
							data={props}
						/>
					) : formState.profile ? (
						<UpdateButton
							handleSubmitData={handleSubmitForm}
							title='User'
							model='user'
							selectedId='UserUUIDs'
							id={formState.id}
							profile={true}
							data={props}
						/>
					) : (
						<UpdateButton
							handleSubmitData={handleSubmitForm}
							title='User'
							model='user'
							selectedId='UserUUIDs'
							id={formState.id}
							data={props}
						/>
					)
				) : (
					<CreateButton
						handleSubmitData={handleSubmitForm}
						title='User'
						data={props}
					/>
				)}
			</form>
		);
}






export default Form