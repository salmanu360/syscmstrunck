
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import AccessControl from "../../Pages/User/AccessControl"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, GetRuleSetRule, GetUserRuleByRuleSet, GetRuleSetUers, UpdateUserRuleByRuleSet, UpdateRuleSetUers } from '../../Components/Helper.js'
import GlobalContext from "../../Components/GlobalContext"
import Select from 'react-select'
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


function UserGroupRuleSetForm(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    const [portData, setPortData] = useState([])
    const [ruleSetControlData, setRuleSetControldata] = useState([])

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == `Duplicate ${props.data.Title}.`) {
                        ToastNotify("error", `Duplicate ${props.data.Title}.`)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", props.data.Title + " created successfully.")
                        navigate(props.data.groupLink + props.data.modelLink + "/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {

            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", props.data.Title + " updated successfully.")
                    navigate(props.data.groupLink + props.data.modelLink + "/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


    }
    useEffect(() => {
        if (state == null) {
            reset()
            if (params.id) {
                setFormState({ formType: "Update", id: params.id })
            } else {
                setFormState({ formType: "New" })
            }

        }
        else {
            reset()
            setFormState(state)
        }
        return () => {

        }
    }, [state])

    useEffect(() => {
        trigger();


        GetAllDropDown(["Area"], globalContext).then(res => {
            var ArrayPort = []
            $.each(res.Area, function (key, value) {
                ArrayPort.push({ value: value.AreaUUID, label: value.PortCode })
            })


            setPortData(ArrayPort)

        })

        if (formState) {
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)
                // if(formState.formType == "Clone"){
                //     $(".ruleRow").addClass("d-none")
                // }else{
                //     $(".ruleRow").removeClass("d-none")
                // }
                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        if (key == props.data.model) {
                            $.each(value, function (key2, value2) {
                                setValue(props.data.model + '[' + key2 + ']', value2);

                            })

                            if (value.Valid == "1") {
                                $('.validCheckbox').prop("checked", true)
                            }
                            else {
                                $('.validCheckbox').prop("checked", false)

                            }
                        }

                    })


                    ControlOverlay(false)
                    trigger()


                })
            }
        }
        else {
            ControlOverlay(true)
            // $(".ruleRow").removeClass("d-none")
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                $.each(res.data.data, function (key, value) {
                    setValue(props.data.model + '[' + key + ']', value);
                })

                if (res.data.data.Valid == "1") {
                    $('.validCheckbox').prop("checked", true)
                }
                else {
                    $('.validCheckbox').prop("checked", false)

                }
                ControlOverlay(false)
                trigger()


            })
        }

        return () => {

        }
    }, [formState])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {

            setValue(props.data.model + "[Valid]", "1")
        } else {
            setValue(props.data.model + "[Valid]", "0")
        }


    });

    window
			.$("#RuleSetUsersModal")
			.off("show.bs.modal")
			.on("show.bs.modal", function () {
				$("#RuleSetUsersModal")
					.find('input[type="checkbox"]')
					.prop("checked", false);

				GetRuleSetUers(params.id, props.data.modelLink, globalContext).then(
					(res) => {
						$(".ruleSetUsersTbody").empty();

						$.each(res.data, function (key, value) {
							$(".ruleSetUsersTbody").append(
								'<tr class ="RuleSetTR"><td style="width:232px; text-align:center;vertical-align: middle;">' +
									value.username +
									'</td><td style="width:232px; text-align:center;vertical-align: middle;"><input type="checkbox" className="checkboxUser" value = ' +
									value.id +
									"></td></tr>"
							);
							if (value.RuleSet == null) {
								$(".RuleSetTR")
									.eq(key)
									.find(".checkboxUser")
									.prop("checked", false);
							} else if (value.RuleSet != null && value.RuleSet == params.id) {
								$(".RuleSetTR")
									.eq(key)
									.find(".checkboxUser")
									.prop("checked", true);
							} else {
								$(".RuleSetTR")
									.eq(key)
									.find(".checkboxUser")
									.prop("checked", false);
							}
						});
					}
				);
			});

		window
			.$("#RuleSetRuleModal")
			.off("show.bs.modal")
			.on("show.bs.modal", function () {
				$("#RuleSetRuleModal")
					.find('input[type="checkbox"]')
					.prop("checked", false);

				GetRuleSetRule(params.id, props.data.modelLink, globalContext).then(
					(res) => {
						if (res.data.Scope == "BRANCH") {
							$("#Port").parent().removeClass("d-none");
						}

						setRuleSetControldata({
							scope: res.data.Scope,
							port: res.data.Port,
							freightTerm: res.data.FreightTerm,
						});
						$.each(res.data.Rules, function (key, value) {
							$("#AccessControlTable")
								.find("[type='checkbox']")
								.each(function () {
									if ($(this).attr("name").includes("AccessControl") == true) {
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
			});

		function handleUpdateRuleSetUserRule() {
			// if(getRuleSetUpdatePermission == true){
			var data = [];
			$("#RuleSetUsersTable")
				.find("[type='checkbox']:checked")
				.each(function () {
					var value = $(this).val();
					data.push(value);
				});

			UpdateRuleSetUers(
				params.id,
				props.data.modelLink,
				globalContext,
				data
			).then((res) => {
				if (res.message == "Success") {
					ToastNotify("success", "Rule Set User updated successfully.");
					window.$("#RuleSetUsersModal").modal("toggle");
				}
			});
		}

		function handleUpdateRuleSetUserRule2() {
			// if(getRuleSetUpdatePermission == true){
			var data = [];
			$("#RuleSetEffectedUsersTable")
				.find("[type='checkbox']:checked")
				.each(function () {
					var value = $(this).val();
					data.push(value);
				});

			UpdateRuleSetUers(
				params.id,
				props.data.modelLink,
				globalContext,
				data
			).then((res) => {
				if (res.message == "Success") {
					ToastNotify("success", "Rule Set Rule updated successfully.");
					window.$("#RuleSetEffectedUsersModal").modal("toggle");
				}
			});
		}

		function handleClearRule() {
			$("#RuleSetUsersTable")
				.find("input[type='checkbox']")
				.prop("checked", false);
		}
		function handleClearRule2() {
			$("#RuleSetEffectedUsersTable")
				.find("input[type='checkbox']")
				.prop("checked", false);
		}

		function handleGrandAllRuleSet() {
			$("#RuleSetRuleModal")
				.find("input[type='checkbox']")
				.prop("checked", true);
		}

		function handleRevokeAllRuleSet() {
			$("#RuleSetRuleModal")
				.find("input[type='checkbox']")
				.prop("checked", false);
		}

		function handleSaveRuleAcess() {
			// if(getRuleSetUpdatePermission == true){
			var tempArray = [];
			var data = [];
			var objAccessControl = {};
			$("input[name='AccessControl[Port][]']").each(function (key, value) {
				$(value).val() !== "" && tempArray.push($(value).val());
			});
			$("#RuleSetRuleModal")
				.find("[type='checkbox']:checked")
				.each(function () {
					var value = $(this).attr("name");
					data.push(value);
					objAccessControl[value] = true;
				});

			if (tempArray.length > 0) {
				var ob = {
					Scope: $("input[name='AccessControl[Scope]']").val(),
					Port: tempArray,
					FreightTerm: $("input[name='AccessControl[FreightTerm]']").val(),
					rules: objAccessControl,
				};

				GetUserRuleByRuleSet(
					params.id,
					props.data.modelLink,
					globalContext,
					ob
				).then((res) => {
					if (res.data && res.data.length > 0) {
						window.$("#RuleSetEffectedUsersModal").modal("toggle");
						window.$(".ruleSetEffectedUsersTbody").empty();

						window.$.each(res.data, function (key, value) {
							window
								.$(".ruleSetEffectedUsersTbody")
								.append(
									'<tr class ="RuleSetTR"><td style="width:232px; text-align:center;vertical-align: middle;">' +
										value.username +
										'</td><td style="width:232px; text-align:center;vertical-align: middle;"><input type="checkbox" className="checkboxUser" value = ' +
										value.id +
										"></td></tr>"
								);
							if (value.similar == true) {
								window
									.$(".RuleSetTR")
									.eq(key)
									.find(".checkboxUser")
									.prop("checked", true);
							} else {
								window
									.$(".RuleSetTR")
									.eq(key)
									.find(".checkboxUser")
									.prop("checked", false);
							}
						});
					} else {
						UpdateUserRuleByRuleSet(
							params.id,
							props.data.modelLink,
							globalContext,
							ob
						).then((res) => {
							if (res.message == "Success") {
								ToastNotify("success", "Rule Set Rule updated successfully.");
							}
						});
					}
				});
			} else {
				alert("Please Choose at least 1 Port for your Access Control.");
			}
			// }
		}

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };



    const { register, handleSubmit, setValue, getValues, trigger, reset, control, watch, formState: { errors } } = useForm({ mode: "onChange" });
    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm}title={props.data.Title} model={props.data.modelLink} selectedId={props.data.model + "UUIDs"} id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">{props.data.Title} Form</div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className={`control-label ${errors[`${props.data.model}`] ? errors[`${props.data.model}`][`${props.data.model}`] ? "has-error-label" : "" : ""}`}>{props.data.Title}</label>
                                    <input defaultValue='' {...register(`${props.data.model}[${props.data.model}]`, { required: `${props.data.Title} cannot be blank.` })} className={`form-control ${errors[`${props.data.model}`] ? errors[`${props.data.model}`][`${props.data.model}`] ? "has-error" : "" : ""}`} />
                                    <p>{errors[`${props.data.model}`] ? errors[`${props.data.model}`][`${props.data.model}`] && <span style={{ color: "#A94442" }}>{errors[`${props.data.model}`][`${props.data.model}`]["message"]}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <input defaultValue='' {...register(`${props.data.model}[Description]`)} className={`form-control`} />
                                </div>
                            </div>
                            {props.data.model == "RuleSet" && formState.formType == "Update" ?
                                <div className="col-xs-12 col-md-12 ruleRow">
                                    <button type="button" id="RuleSetRuleControl" className="btn btn-success mb-1" title="Access Control" data-toggle="modal" data-target="#RuleSetRuleModal">Rule Set Rule</button>
                                    <a>&nbsp;</a><a>
                                        <button type="button" id="RuleSetUsersControl" className="btn btn-success mb-1" title="Access Control" data-toggle="modal" data-target="#RuleSetUsersModal">Rule Set Users</button>
                                    </a>
                                </div>
                                : ""}




                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" id="validCheckbox" className='validCheckbox' defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register(`${props.data.model}[Valid]`)} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            <div className="modal fade" id="RuleSetRuleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Rule Set Rule</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <AccessControl portOption={portData} data={ruleSetControlData} />

                            <button type="button" className="btn btn-success mr-1" id="Grant" onClick={handleGrandAllRuleSet}>Grant</button>
                            <button type="button" className="btn btn-danger" id="Revoke" onClick={handleRevokeAllRuleSet}>Revoke</button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary mt-2" id="SaveAccessControl" data-dismiss="modal" onClick={handleSaveRuleAcess}>Save</button>
                            <button type="button" className="add btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="RuleSetUsersModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Rule Set Users</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="RuleSetID"></input>
                            <table style={{ "width": "100%" }} className="table table-bordered table-responsive" id="RuleSetUsersTable">
                                <thead>
                                    <tr>
                                        <th width="300px" style={{ "text-align": "center", "vertical-align": "middle" }}>User</th>
                                        <th width="300px" style={{ "text-align": "center", "vertical-align": "middle" }}>Check Box</th>
                                    </tr>
                                </thead>
                                <tbody className="ruleSetUsersTbody">
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success mt-2" onClick={handleUpdateRuleSetUserRule}>Save</button>
                            <button type="button" className="btn btn-primary mb1 black bg-aqua" onClick={handleClearRule}>Clear</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="RuleSetEffectedUsersModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Effected User Group Users</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table style={{ "width": "100%" }} className="table table-bordered table-responsive" id="RuleSetEffectedUsersTable">
                                <thead>
                                    <tr>
                                        <th width="300px" style={{ "text-align": "center", "vertical-align": "middle" }}>User</th>
                                        <th width="300px" style={{ "text-align": "center", "vertical-align": "middle" }}>Check Box</th>
                                    </tr>
                                </thead>
                                <tbody className="ruleSetEffectedUsersTbody">
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success mt-2" onClick={handleUpdateRuleSetUserRule2}>Save</button>
                            <button type="button" className="btn btn-primary mb1 black bg-aqua" onClick={handleClearRule2}>Clear</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>






            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm}title={props.data.Title} model={props.data.modelLink} selectedId={props.data.model + "UUIDs"} id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} />}
        </form>





    )
}






export default UserGroupRuleSetForm