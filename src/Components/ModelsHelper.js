import React, { useState,useEffect,useContext } from 'react'
import { useForm,Controller, useFieldArray } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Select from 'react-select'
import FormContext from "./CommonElement/FormContext";
import GlobalContext from "./GlobalContext";
import $ from "jquery";
import moment from "moment";
import {ToastNotify,ControlOverlay, getAreaById, getPortDetails, FindRemainingBC,GetAllDropDown,LoadPartialBCById, CheckingMergeBookingReservation, TransferToCreditNote, TransferToDebitNote, GetSuitableVoyageForMyVoyage, SaveManifestImportVoyageNo, sendEmailManifest,setAutoHeigthTextArea } from "./Helper";
import { InitVoyageModalTable } from "./BootstrapTableModal&Dropdown/InitVoyageModalTable";
import QuickFormContainer from "./CommonElement/QuickFormContainer";
import {useNavigate } from "react-router-dom";

export function AttentionModal(props) {
    return (
        <>
            <div className="modal fade" id="modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ zIndex: "5000" }}>
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attention</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table id="Attention-Table"></table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="add btn btn-primary getAttentionSelections">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export function AttentionModal2(props) {
    return (
        <>
            <div className="modal fade" id="modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ zIndex: "5000" }}>
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attention</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table id="Attention-Table"></table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="add btn btn-primary getAttentionSelections">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function DNDModal(props) {
    return (
        <>
            <div className="modal fade" id="DNDModal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">D&D</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id={`${props.title}uuid`} name={`${props.title}id`} />
                            <input type="hidden" id="currentDndCombinedCheck" />
                            <div className="col-md-12">
                                <input type="checkbox" className="DNDQuickForm DNDApplyCheckBox" id={`${props.title}-quickform-applydnd`} name="applydnd" defaultChecked={true} />
                                <label htmlFor={`${props.title}-quickform-applydnd`}>Apply D&D</label>
                            </div>
                            <div className='DNDApplyClass'>
                                <div className="col-md-12 DNDCombined">
                                    <input type="checkbox" className="DNDQuickForm DNDConbindorNot ml-5" id={`${props.title}-quickform-dndcombined`} name="dndcombined" defaultChecked={true} />
                                    <label htmlFor={`${props.title}-quickform-dndcombined`}>D&D Combined</label>

                                </div>
                                <div className="col-md-12 ml-5">
                                    <div className="col-md-5 DNDCombineDay ml-2">
                                        <label>D&D Combine Day</label>
                                        <input type="checkbox" className="CombineDayCheckBox ml-2 checkbox-inline mb-1 d-none" name="dndcombinedday" defaultChecked={true} />
                                        <input type="number" id={`${props.title}-quickform-dndcombinedday`} className="form-control" defaultValue="10" data-target="DNDCombinedDay" />

                                    </div>
                                </div>
                                <div className="col-md-12 ml-5">
                                    <div className='row'>
                                        <div className="col-md-5 Detention d-none ml-2">
                                            <label>Detention(days)</label>
                                            <input type="checkbox" className="DetentionCheckBox  ml-2 checkbox-inline mb-1 d-none" name="detention" defaultChecked={true} />
                                            <input type="number" id={`${props.title}-quickform-detention`} className="form-control" defaultValue="5" data-target="Detention" />

                                        </div>

                                        <div className="col-md-5 Demurrage d-none ml-2">
                                            <label>Demurrage(days)</label>
                                            <input type="checkbox" className="DemurrageCheckBox ml-2 checkbox-inline mb-1 d-none" name="demurrage" defaultChecked={true} />
                                            <input type="number" id={`${props.title}-quickform-demurrage`} className="form-control" defaultValue='5' data-target="Demurrage" />

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary SubmitDND mt-2" data-dismiss="modal">Confirm</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function VoyageModal(props) {
    const globalContext = useContext(GlobalContext)
    const formContext = useContext(FormContext)
    const customStyles = {
        control: base => ({
            ...base,
            minHeight: 30,
        }),
        dropdownIndicator: base => ({
            ...base,
            padding: 4
        }),
        clearIndicator: base => ({
            ...base,
            padding: 4
        }),

        valueContainer: base => ({
            ...base,
            padding: '0px 6px'
        }),
        input: base => ({
            ...base,
            margin: 0,
            padding: 0
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999
        })
    };

    window.$('#VoyageModal').on('show.bs.modal', function () {
 
        if($("input[name='DynamicModel[POLPortCode]").val()!==""){
            props.setValue("DynamicVoyageModel[POLPortCode]",props.getValues("DynamicModel[POLPortCode]"))
        }else{
            props.setValue("DynamicVoyageModel[POLPortCode]","")
        }

        if($("input[name='DynamicModel[PODPortCode]").val()!==""){
            props.setValue("DynamicVoyageModel[PODPortCode]",props.getValues("DynamicModel[PODPortCode]"))
        }else{
            props.setValue("DynamicVoyageModel[POLPortCode]","")
        }
    
    })

    
   
    function ChangeReflectField(value, target) {
        if (target.includes("POLPortCode")) {
            if (value) {
                props.setValue(`DynamicModel[POLPortCode]`, value.value)
                props.setValue(`${props.formName}[POLPortCode]`, value.value)
                onChangePortCode(value, props.formNameLowerCase + "-polportcode")
                FindVoyageAfterOnChangePortCode()
            } else {
                props.setValue(`DynamicModel[POLPortCode]`, "")
                props.setValue(`${props.formName}[POLPortCode]`, "")
                onChangePortCode(value, props.formNameLowerCase + "-polportcode")
                FindVoyageAfterOnChangePortCode()
            }
        }
        if (target.includes("PODPortCode")) {
            if (value) {
                props.setValue(`DynamicModel[PODPortCode]`, value.value)
                props.setValue(`${props.formName}[PODPortCode]`, value.value)
                onChangePortCode(value, props.formNameLowerCase + "-podportcode")
                FindVoyageAfterOnChangePortCode()
            } else {
                props.setValue(`DynamicModel[PODPortCode]`, "")
                props.setValue(`${props.formName}[PODPortCode]`, "")
                onChangePortCode(value, props.formNameLowerCase + "-podportcode")
                FindVoyageAfterOnChangePortCode()
            }
        }
    }

    function FindVoyageAfterOnChangePortCode() {
        var filters = {
            "POL": props.getValues(`${props.formName}[POLPortCode]`),
            "POD": props.getValues(`${props.formName}[PODPortCode]`),
            "POLReqETA": $(`input[name='DynamicVoyageModel[POLReqETA]']`).val(),
            "PODReqETA": $(`input[name='DynamicVoyageModel[PODReqETA]']`).val(),
            "DocDate": props.getValues(`${props.formName}[DocDate]`),
            "LastValidDate": $(`input[name='${props.formName}[LastValidDate]']`).val(),
        }
        InitVoyageModalTable({
            tableSelector: "#voyage-table",
            url: "../voyage/find-voyages",
            filter: filters,
            globalContext: globalContext,
            columns: [
                { field: 'VoyageUUIDString', title: 'Voyage UUID' },
                { field: 'VoyageNumbers', title: 'Voyage Num' },
                { field: 'VesselCode', title: 'Vessel Code' },
                { field: 'POLScnCode', title: 'POL SCN Code' },
                { field: 'VesselName', title: 'Vessel' },
                { field: 'POLet', title: 'POL ETA<br>POL ETD' },
                { field: 'PODet', title: 'POD ETA<br>POD ETD' },
                { field: 'POTc', title: 'POT' },
                { field: 'POTPortCode', title: 'POT Port Code' },
                { field: 'POTVessel', title: 'POT Vessel' },
                { field: 'POTet', title: 'POT ETA<br>POT ETD' },
            ],
        })
    }

    function onChangePortCode(value, positionId) {
        var closestArea = $("#" + positionId).closest(".row").find(".AreaName")

        if (value) {
            var id = value.value
            var portCode = value.label
            var DefaultValue;
            var DefaultPortName;
            var DefaultAgentCompanyROC;
            var DefaultAgentCompany;
            var DefaultAgentCompanyBranch;
            var DefaultAgentCompanyBranchName;

            //get area
            getAreaById(id, globalContext).then(data => {
                $(closestArea).val(data["Area"]);
            });

            //get terminal options
            getPortDetails(id, globalContext).then(data => {
                var tempOptions = []
                var tempOptionsCompany = []
                var tempOptionsCompanyBranch = []
                if (data.length > 0) {
                    $.each(data, function (key, value1) {
                        if (value1.VerificationStatus == "Approved") {
                            if (value1.Default == 1) {
                                DefaultValue = value1.PortDetailsUUID;
                                DefaultPortName = value1.PortName;
                                DefaultAgentCompanyROC = value1.handlingCompany.ROC
                                DefaultAgentCompany = value1.HandlingCompany
                                DefaultAgentCompanyBranch = value1.HandlingCompanyBranch
                                DefaultAgentCompanyBranchName = value1.handlingCompanyBranch.BranchName
                                tempOptionsCompany.push({ value: value1.handlingCompany.CompanyUUID, label: value1.handlingCompany.CompanyName })
                                tempOptionsCompanyBranch.push({ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode })
                            }

                            tempOptions.push({ value: value1.PortDetailsUUID, label: value1.LocationCode })
                        }
                    })
                }

                // set Option Terminal
                if (positionId.includes("pol")) {
                    formContext.setStateHandle(tempOptions, "OptionPOLTerminal")
                    formContext.setStateHandle(tempOptionsCompany, "OptionPOLAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch, "OptionPOLAgentCompanyBranch")
                    props.setValue(`${props.formName}[POLLocationCode]`, DefaultValue)
                    props.setValue(`${props.formName}[POLLocationName]`, DefaultPortName)
                    props.setValue(`${props.formName}[POLAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${props.formName}[POLAgentName]`, DefaultAgentCompany)
                    props.setValue(`${props.formName}[POLHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${props.formName}[POLHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                } else {
                    formContext.setStateHandle(tempOptions, "OptionPODTerminal")
                    formContext.setStateHandle(tempOptionsCompany, "OptionPODAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch, "OptionPODAgentCompanyBranch")
                    props.setValue(`${props.formName}[PODLocationCode]`, DefaultValue)
                    props.setValue(`${props.formName}[PODLocationName]`, DefaultPortName)
                    props.setValue(`${props.formName}[PODAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${props.formName}[PODAgentName]`, DefaultAgentCompany)
                    props.setValue(`${props.formName}[PODHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${props.formName}[PODHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                }
            });


        } else {
            if (positionId.includes("pol")) {
                $(closestArea).val("");
                formContext.setStateHandle([], "OptionPOLTerminal")
                formContext.setStateHandle([], "OptionPOLAgentCompany")
                formContext.setStateHandle([], "OptionPOLAgentCompanyBranch")
                props.setValue(`${props.formName}[POLLocationCode]`, "")
                props.setValue(`${props.formName}[POLLocationName]`, "")
                props.setValue(`${props.formName}[POLAgentROC]`, "")
                props.setValue(`${props.formName}[POLAgentName]`, "")
                props.setValue(`${props.formName}[POLHandlingOfficeCode]`, "")
                props.setValue(`${props.formName}[POLHandlingOfficeName]`, "")
            } else {
                $(closestArea).val("");
                formContext.setStateHandle([], "OptionPODTerminal")
                formContext.setStateHandle([], "OptionPODAgentCompany")
                formContext.setStateHandle([], "OptionPODAgentCompanyBranch")
                props.setValue(`${props.formName}[PODLocationCode]`, "")
                props.setValue(`${props.formName}[PODLocationName]`, "")
                props.setValue(`${props.formName}[PODAgentROC]`, "")
                props.setValue(`${props.formName}[PODAgentName]`, "")
                props.setValue(`${props.formName}[PODHandlingOfficeCode]`, "")
                props.setValue(`${props.formName}[PODHandlingOfficeName]`, "")
            }
        }
    }
    return (
        <>
            <div className="modal fade" id="VoyageModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Voyage</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="pol" className="col-sm-2 col-form-label">POL</label>
                                    <div className="col-sm-10">
                                        <div className="form-group field-dynamicmodel-voyagemodal-polportcode">
                                            <Controller
                                                name={"DynamicVoyageModel[POLPortCode]"}
                                                id={"dynamicmodel-voyagemodal-polportcode"}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        {...props.register("DynamicVoyageModel[POLPortCode]")}
                                                        isClearable={true}
                                                        data-target={"POLPortCode-ShippingInstructions"}
                                                        id={"dynamicmodel-voyagemodal-polportcode"}
                                                        value={
                                                            value
                                                                ? props.port.find((c) => c.value === value)
                                                                : null
                                                        }
                                                        onChange={(val) => {
                                                            val == null ? onChange(null) : onChange(val.value);
                                                            ChangeReflectField(val, "POLPortCode")
                                                        }}
                                                        options={props.port}

                                                        className={`form-control voyagemodalfield getTerminalPortCode`}
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        styles={customStyles}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="pol" className="col-sm-2 col-form-label">POD</label>
                                    <div className="col-sm-10">
                                        <div className="form-group field-dynamicmodel-voyagemodal-podportcode">
                                            <Controller
                                                name={"DynamicVoyageModel[PODPortCode]"}
                                                id={"dynamicmodel-voyagemodal-podportcode"}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        {...props.register("DynamicVoyageModel[PODPortCode]")}
                                                        isClearable={true}
                                                        data-target={"PODPortCode-ShippingInstructions"}
                                                        id={"dynamicmodel-voyagemodal-podportcode"}
                                                        value={
                                                            value
                                                                ? props.port.find((c) => c.value === value)
                                                                : null
                                                        }
                                                        onChange={(val) => {
                                                            val == null ? onChange(null) : onChange(val.value);
                                                            ChangeReflectField(val, "PODPortCode")
                                                        }}
                                                        options={props.port}

                                                        className={`form-control voyagemodalfield getTerminalPortCode`}
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        styles={customStyles}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <label htmlFor="pol" className="col-sm-5 col-form-label">POL
                                        Req
                                        ETA</label>
                                    <div className="col-sm-7">
                                        <div className="form-group field-dynamicmodel-polreqeta">
                                            {/* <input type="text" id="dynamicmodel-polreqeta" className="form-control voyagemodalfield flatpickr-input-time" name="DynamicModel[POLReqETA]" autoComplete="off" data-target="polreqeta" data-input="" readOnly="readOnly" /> */}
                                            <Controller
                                                name={"DynamicVoyageModel[POLReqETA]"}
                                                id={"dynamicmodel-polreqeta"}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <>
                                                        <Flatpickr
                                                            {...props.register("DynamicVoyageModel[POLReqETA]")}
                                                            style={{ backgroundColor: "white" }}
                                                            value={formContext.pOLReqETA ? formContext.pOLReqETA : ""}
                                                            data-target={"polreqeta"}
                                                            onChange={val => {
                                                                val == null ? onChange(null) : onChange(moment(val[0]).format("DD/MM/YYYY"), "polreqeta");
                                                                val == null ? formContext.setStateHandle(null, "") : formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY H:mm"), "polreqeta")
                                                            }}
                                                            className={`form-control c-date-picker voyagemodalfield flatpickr-input-time flatpickr-input`}
                                                            options={{
                                                                dateFormat: "d/m/Y H:i",
                                                                enableTime: true,
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="pol" className="col-sm-5 col-form-label">POD
                                        Req
                                        ETA</label>
                                    <div className="col-sm-7">
                                        <div className="form-group field-dynamicmodel-podreqeta">

                                            {/* <input type="text" id="dynamicmodel-podreqeta" className="form-control voyagemodalfield flatpickr-input-time" name="DynamicModel[PODReqETA]" autoComplete="off" data-target="podreqeta" data-input="" readOnly="readOnly" /> */}
                                            <Controller
                                                name={"DynamicVoyageModel[PODReqETA]"}
                                                id={"dynamicmodel-podreqeta"}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <>
                                                        <Flatpickr
                                                            {...props.register("DynamicVoyageModel[PODReqETA]")}
                                                            style={{ backgroundColor: "white" }}
                                                            value={formContext.pODReqETA ? formContext.pODReqETA : ""}
                                                            data-target={"podreqeta"}
                                                            onChange={val => {
                                                                val == null ? onChange(null) : onChange(moment(val[0]).format("DD/MM/YYYY"), "podreqeta");
                                                                val == null ? formContext.setStateHandle(null, "podreqeta") : formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY"), "podreqeta")
                                                            }}
                                                            className={`form-control c-date-picker voyagemodalfield flatpickr-input-time flatpickr-input`}
                                                            options={{
                                                                dateFormat: "d/m/Y H:i",
                                                                enableTime: true,
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            />

                                            <div className="help-block"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <table id="voyage-table">
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary getVoyageSelections mt-2">Confirm</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function ContainerModal(props) {
    return (
        <>
            <div className="modal fade" id="ContainerModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ zIndex: "5000" }}>
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <button style={{ width: "100px" }} id="AllToggle" type="button" className="btn btn-primary ContainerFilterButtons">All</button>
                            <table id="ContainerCode-Table">
                                <thead>
                                    <tr>
                                        <th data-field="id">ID</th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button id="ChooseContainer" type="button" className="btn btn-primary">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function CurrencyModal(props) {
    return (
        <>
            <div className="modal fade" id="CurrencyRateModal">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Currency Rate</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="card-body">
                                <table className="currency-rate-table table table-bordered">
                                    <thead>
                                        <tr style={{ textAlign: "center", verticalAlign: "middle" }}>
                                            <th width="5%"></th>
                                            <th width="15%">From Currency</th>
                                            <th width="20%">To Currency</th>
                                            <th width="20%">Rate</th>
                                            <th width="20%">Start Date</th>
                                            <th width="20%">End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="currency-rate-item">
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary confirmCurrencyRate">Confirm</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}


{/* <!-- Modal: Transfer From-- > */}
export function TransferFromBRModal(props) {
   
    return (
        <>
            <div className="modal fade" id="TransferFromModal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Transfer From</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Booking Reservation</label>
                                <Controller
                                    name="br"
                                    id="transferFromBR"
                                    control={props.control}

                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            id="transferFromBR"
                                            {...props.register("br")}
                                            value={value ? props.BR.find(c => c.value === value) : null}
                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                            options={props.BR}
                                            title={value}
                                            className={`single-select transferBR`}
                                            classNamePrefix="select"
                                            styles={props.globalContext.customStyles}

                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary mb-1" id="TransferFrom">Transfer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function QuotationFilterModal(props) {
    return (
        <>
            <div className="modal fade" id="BR-QuotationModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{zIndex: 5000}}>
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Quotation</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table id="quotation-table">
                                <thead>
                                    <tr>
                                        {/* count the data filter control yourself and add in according to your need */}
                                        <th></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                        <th data-filter-control="input"></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="add btn btn-primary transferBR" id="transfer">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


{/* <!-- Modal: Transfer From-- > */}
export function TransferFromBC(props) {
    

    const { register, control,setValue, formState: { errors } } = useForm({ mode: "onChange" });
    const { fields, append, prepend, remove, swap, move, insert, update, replace } = useFieldArray({
        control,
        name: "TransferFromBC"
    });
    const navigate = useNavigate();

    const globalContext = useContext(GlobalContext)
    const [BCOptions, setBCOptions] = useState([])

    if (globalContext.userRule !== "") {
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes("sales-invoice");
        });
      }

   
    useEffect(() => {
       var type;
       props.barge?type="barge":type="normal"
       setValue("BC","")
        FindRemainingBC(globalContext,type).then(res => {
            var ArrayBooking = [];
            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayBooking.push({ value: value.BookingConfirmationUUID, label: value.DocNum })
                }
            })
            setBCOptions(ArrayBooking)
        })
        return () => {
        }
    }, [props.barge])

    return (
        
        <>
            <div className="modal fade" id="TransferFromBCModal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Transfer From</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Booking Confirmation</label>
                                <Controller
                                    name="BC"
                                    id="transferFromBC"
                                    control={control}

                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            id="transferFromBC"
                                            {...register("BC")}
                                            value={value ? BCOptions.find(c => c.value === value) : null}
                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                            options={BCOptions}
                                            title={value}
                                            className={`single-select transferBC`}
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary mb-1" id="TransferAllFromBC">Transfer All</button>
                            <button type="button" className="btn btn-primary mb-1" id="TransferPartialFromBC">Transfer Partial</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function TransferPartialBCModal(props) {
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		trigger,
		reset,
		control,
		watch,
		clearErrors,
		formState: {errors},
	} = useForm({mode: "onChange"});
	const {fields, append, prepend, remove, swap, move, insert, update, replace} =
		useFieldArray({
			control,
			name: "BookingReservationHasTranshipment",
		});
	const [formState, setFormState] = useState({formType: "New"});
	const globalContext = useContext(GlobalContext);
	const navigate = useNavigate();

	const [defaultPortTerm, setDefaultPortTerm] = useState(
		"----c1d43831-d709-11eb-91d3-b42e998d11ff"
	);
	const [defaultCurrency, setDefaultCurrency] = useState(
		"----942c4cf1-d709-11eb-91d3-b42e998d11ff"
	);
	const [user, setUser] = useState("");
	const [creditTerm, setCreditTerm] = useState("");
	const [port, setPort] = useState("");
	const [portTerm, setPortTerm] = useState("");
	const [freightTerm, setFreightTerm] = useState("");
	const [taxCode, setTaxCode] = useState("");
	const [cargoType, setCargoType] = useState("");
	const [
		containerTypeAndChargesDataPartial,
		setContainerTypeAndChargesDataPartial,
	] = useState("");

	//document
	const [docDate, setDocDate] = useState("");
	const [lastValidDate, setLastValidDate] = useState("");
	const [advanceBookingStartDate, setAdvanceBookingStartDate] = useState("");
	const [advanceBookingLastValidDate, setAdvanceBookingLastValidDate] =
		useState("");
	const [salesPerson, setSalesPerson] = useState("");
	const [quotationType, setQuotationType] = useState("");
	const [currency, setCurrency] = useState("");
	const [QTOption, setQTOption] = useState([]);

	//instruction
	const [pOLReqETA, setPOLReqETA] = useState("");
	const [pODReqETA, setPODReqETA] = useState("");
	const [optionPOLTerminal, setOptionPOLTerminal] = useState([]);
	const [optionPODTerminal, setOptionPODTerminal] = useState([]);
	const [optionPOLAgentCompany, setOptionPOLAgentCompany] = useState([]);
	const [optionPODAgentCompany, setOptionPODAgentCompany] = useState([]);
	const [optionPOLAgentCompanyBranch, setOptionPOLAgentCompanyBranch] =
		useState([]);
	const [optionPODAgentCompanyBranch, setOptionPODAgentCompanyBranch] =
		useState([]);
	const [defaultFinalDestinationCompany, setDefaultFinalDestinationCompany] =
		useState([]);
	const [quickFormVoyageNum, setQuickFormVoyageNum] = useState([]);
	const [VoyageNum, setVoyageNum] = useState([]);
	const [transferVoyageVoyageNum, setTransferVoyageVoyageNum] = useState([]);

	//container
	const [containerType, setContainerType] = useState([]);

	//getUpdateDataState
	const [documentData, setDocumentData] = useState([]);
	const [instructionData, setInstructionData] = useState([]);
	const [
		shippingInstructionQuickFormData,
		setShippingInstructionQuickFormData,
	] = useState([]);
	const [transferVoyageUsingData, setTransferVoyageUsingData] = useState([]);
	const [updateDataForTransfer, setUpdateDataForTransfer] = useState([]);
	const [containerQuickFormData, setContainerQuickFormData] = useState([]);
	const [containerInnerQuickFormData, setContainerInnerQuickFormData] =
		useState([]);
	const [haulerData, setHaulerData] = useState([]);
	const [moreData, setMoreData] = useState([]);
	const [middleCardQuickFormData, setMiddleCardQuickFormData] = useState([]);
	const [attentionData, setAttentionData] = useState([]);
	const [containerTypeAndChargesData, setContainerTypeAndChargesData] =
		useState([]);
	const [transhipmentData, setTranshipmentData] = useState([]);
	const [verificationStatus, setVerificationStatus] = useState("");
	const [resetStateValue, setResetStateValue] = useState("");
	const [voyageandTranshipmentState, setVoyageandTranshipmentState] = useState({
		Voyage: [],
		Transhipment: [],
	});
	const [voyageForTransfer, setVoyageForTransfer] = useState([]);
	const [transhipmentForTransfer, setTranshipmentForTransfer] = useState([]);
	const [bookingComfirmationData, setBookingComfirmationData] = useState([]);
	const [controlButtonState, setControlButtonState] = useState([]);
	const [BRHasContainerUUIDsForSplit, setBRHasContainerUUIDsForSplit] =
		useState([]);

	function setStateHandle(val, target) {
		if (target === "DocDate" || target === "AdvanceBookingStartDate") {
			setDocDate(val);
		}
		if (target === "SalesPerson") {
			setSalesPerson(val);
		}
		if (target === "QuotationType") {
			setQuotationType(val);
		}
		if (
			target === "LastValidDate" ||
			target === "AdvanceBookingLastValidDate"
		) {
			setLastValidDate(val);
		}
		if (target === "AdvanceBookingStartDate") {
			setAdvanceBookingStartDate(val);
		}
		if (target === "AdvanceBookingLastValidDate") {
			setAdvanceBookingLastValidDate(val);
		}
		if (target === "OptionPOLTerminal") {
			setOptionPOLTerminal(val);
		}
		if (target === "OptionPODTerminal") {
			setOptionPODTerminal(val);
		}
		if (target === "OptionPOLAgentCompany") {
			setOptionPOLAgentCompany(val);
		}
		if (target === "OptionPODAgentCompany") {
			setOptionPODAgentCompany(val);
		}
		if (target === "OptionPOLAgentCompanyBranch") {
			setOptionPOLAgentCompanyBranch(val);
		}
		if (target === "OptionPODAgentCompanyBranch") {
			setOptionPODAgentCompanyBranch(val);
		}
		if (target === "VoyageNum") {
			setVoyageNum(val);
		}
		if (target === "QuickFormVoyageNum") {
			setQuickFormVoyageNum(val);
		}
		if (target === "TransferVoyageVoyageNum") {
			setTransferVoyageVoyageNum(val);
		}
		if (target === "polreqeta") {
			setPOLReqETA(val);
		}
		if (target === "podreqeta") {
			setPODReqETA(val);
		}
		if (target === "QTOption") {
			setQTOption(val);
		}
	}

	function ApprovedStatusReadOnlyForAllFields() {
		setTimeout(() => {
			$("button[type='submit']").prop("disabled", true);

			$(".form-control").each(function () {
				$(this).addClass("readOnlySelect");
				$(this).prop("disabled", true);
			});

			$(".basic-single").each(function () {
				$(this).addClass("readOnlySelect");
			});

			$(".c-date-picker").each(function () {
				$(this).addClass("pointerEventsStyle");
				$(this).prop("disabled", true);
			});

			$("#ChooseContainer").prop("disabled", true);
			$(".getAttentionSelections").prop("disabled", true);
			$(".getVoyageSelections").prop("disabled", true);
			$("#mainLoadTariff").addClass("d-none");
			$("#clearTableData").addClass("d-none");
			$(".add-charges").addClass("d-none");
			$(".add-container").addClass("d-none");
			$(".add-chargesNestedfake").addClass("d-none");
			$(".RemoveContainer").addClass("d-none");
			$(".RemoveCharges").addClass("d-none");
			$(".RemoveNestedCharges").addClass("d-none");
			$(".loadTariff").addClass("d-none");
			$("#transhipmentQuickForm").addClass("d-none");
			$(".add-transhipment").addClass("d-none");

			$("input[type='checkbox']").prop("disabled", true);
		}, 50);
	}

	function RemoveAllReadOnlyFields() {
		setTimeout(() => {
			$("button[type='submit']").prop("disabled", false);

			$(".form-control")
				.not(".OriReadOnlyClass")
				.each(function () {
					$(this).removeClass("readOnlySelect");
					$(this).prop("disabled", false);
				});

			$(".basic-single")
				.not(".OriReadOnlyClass")
				.each(function () {
					$(this).removeClass("readOnlySelect");
				});

			$(".c-date-picker")
				.not(".OriReadOnlyClass")
				.each(function () {
					$(this).removeClass("pointerEventsStyle");
					$(this).prop("disabled", false);
				});

			$("#ChooseContainer").prop("disabled", false);
			$(".getAttentionSelections").prop("disabled", false);
			$(".getVoyageSelections").prop("disabled", false);
			$("#mainLoadTariff").removeClass("d-none");
			$("#clearTableData").removeClass("d-none");
			$(".add-charges").removeClass("d-none");
			$(".add-container").removeClass("d-none");
			$(".add-chargesNestedfake").removeClass("d-none");
			$(".RemoveContainer").removeClass("d-none");
			$(".RemoveCharges").removeClass("d-none");
			$(".RemoveNestedCharges").removeClass("d-none");
			$(".loadTariff").removeClass("d-none");
			$("#transhipmentQuickForm").removeClass("d-none");
			$(".add-transhipment").removeClass("d-none");

			$("input[type='checkbox']").prop("disabled", false);
		}, 50);
	}

	useEffect(() => {
		GetAllDropDown(
			[
				"CargoType",
				"CurrencyType",
				"ChargesType",
				"FreightTerm",
				"ContainerType",
				"TaxCode",
			],
			globalContext
		).then((res) => {
			var ArrayCargoType = [];
			var ArrayPortCode = [];
			var ArrayFreightTerm = [];
			var ArrayContainerType = [];
			var ArrayCurrency = [];
			var ArrayTaxCode = [];

			$.each(res.Area, function (key, value) {
				ArrayPortCode.push({value: value.AreaUUID, label: value.PortCode});
			});

			$.each(res.FreightTerm, function (key, value) {
				ArrayFreightTerm.push({
					value: value.FreightTermUUID,
					label: value.FreightTerm,
				});
			});

			$.each(res.CargoType, function (key, value) {
				ArrayCargoType.push({
					value: value.CargoTypeUUID,
					label: value.CargoType,
				});
			});

			$.each(res.ContainerType, function (key, value) {
				ArrayContainerType.push({
					value: value.ContainerTypeUUID,
					label: value.ContainerType,
				});
			});

			$.each(res.CurrencyType, function (key, value) {
				ArrayCurrency.push({
					value: value.CurrencyTypeUUID,
					label: value.CurrencyName,
				});
			});

			$.each(res.TaxCode, function (key, value) {
				ArrayTaxCode.push({value: value.TaxCodeUUID, label: value.TaxCode});
			});

			setPort(ArrayPortCode);
			setFreightTerm(ArrayFreightTerm);
			setCargoType(ArrayCargoType);
			setContainerType(ArrayContainerType);
			setCurrency(ArrayCurrency);
			setTaxCode(ArrayTaxCode);
		});

		return () => {};
	}, []);

	function confirmTransferTo(type) {
		var array = [];
		var arrayCheckingBillTo = [];
		$(".checkboxCharges:checked").each(function () {
			if (props.barge) {
				var chargesIndex = $(this).parent().parent().parent().index();
			} else {
				var chargesIndex = $(this).parent().parent().parent().parent().index();
			}
			var ContainerIndex = $(this)
				.parent()
				.parent()
				.parent()
				.parent()
				.closest(".ChargesTable")
				.prev()
				.index();

			chargesIndex = chargesIndex == 0 ? chargesIndex : chargesIndex / 2;
			ContainerIndex =
				ContainerIndex == 0 ? ContainerIndex : ContainerIndex / 2;

			var closestContainerArrayList = $(this)
				.parent()
				.parent()
				.parent()
				.parent()
				.closest(".ChargesTable")
				.prev()
				.find(".containerArrayList")
				.val();

			if (closestContainerArrayList !== "") {
				$.each(closestContainerArrayList.split(","), function (key, value) {
					var ChargesCode = $(
						`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][BookingConfirmationChargesUUID]']`
					).val();
					var Charges = {
						CustomerType: $(
							`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][CustomerType]']`
						).val(),
						BillTo: $(
							`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][BillTo]']`
						).val(),
					};
					array.push(ChargesCode);
					arrayCheckingBillTo.push(Charges);
				});
			}
		});

		var uniqueArray = arrayCheckingBillTo.filter((obj, index, self) => {
			return (
				index ===
				self.findIndex(
					(t) => t.CustomerType === obj.CustomerType && t.BillTo === obj.BillTo
				)
			);
		});

		if (uniqueArray.length > 1) {
			alert(
				"Selected Charges must correspond with All the Bill To Type and the Branch of the Bill To Company"
			);
		} else {
			if (type == "BookingConfirmation") {
				var BC = window
					.$("input[name='BookingConfirmationUUIDForPartial'")
					.val();
				window.$("#TransferToCROINVModal").modal("hide");
				window.$("#TransferFromBCModal").modal("hide");
				window.$("#TransferToSalesInvoiceModal").modal("toggle");
				if (props.barge) {
					navigate(
						"/sales/standard/sales-invoice-barge/transfer-from-booking-reservation-data/id=" +
							BC,
						{
							state: {
								formType: "TransferFromBooking",
								transferFromModel: "booking-reservation",
								id: BC,
								CustomerType: uniqueArray[0]["CustomerType"],
								BranchCode: uniqueArray[0]["BillTo"],
								ChargesID: array,
							},
						}
					);
				} else {
					navigate(
						"/sales/container/sales-invoice/transfer-from-booking-reservation-data/id=" +
							BC,
						{
							state: {
								formType: "TransferFromBooking",
								transferFromModel: "booking-reservation",
								id: BC,
								CustomerType: uniqueArray[0]["CustomerType"],
								BranchCode: uniqueArray[0]["BillTo"],
								ChargesID: array,
							},
						}
					);
				}
			}
		}
	}

	var ContainerItemTransferPartial = {
		formName: "BookingConfirmation",
		cardLength: "col-md-12",
		cardTitle: "Containers & Charges",
		ContainerColumn: [],
	};

	const OwnershipType = [
		{
			value: "COC",
			label: "COC",
		},
		{
			value: "SOC",
			label: "SOC",
		},
	];

	window
		.$("#TransferToSalesInvoiceModal")
		.off("show.bs.modal")
		.on("show.bs.modal", function () {
			var type;
			var BC = window
				.$("input[name='BookingConfirmationUUIDForPartial']")
				.val();
			props.barge ? (type = "barge") : (type = "normal");
			LoadPartialBCById(BC, globalContext, type).then((res) => {
				var tempData = res.data.BookingConfirmationHasContainerType;
				$.each(tempData, function (key, value) {
					var ArrayContainer = [];
					var ArrayContainer2 = [];
					if (value.bookingConfirmationContainer.length > 0) {
						$.each(value.bookingConfirmationContainer, function (key2, value2) {
							ArrayContainer.push({
								ContainerUUID: value2.containerCode.ContainerUUID,
								ContainerCode: value2.containerCode.ContainerCode,
								SealNum: "",
							});
							ArrayContainer2.push(value2.containerCode.ContainerUUID);
						});
					}
					value.ContainerCode = ArrayContainer;
					value.ContainerArray = ArrayContainer2.join(",");
				});

				setContainerTypeAndChargesDataPartial(tempData);
			});
		});

	return (
		<>
			{/* modalTransferPartial */}
			<div
				className='modal fade'
				id='TransferToSalesInvoiceModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog modal-xl' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Transfer To Sales Invoice
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<input type='hidden' name='BookingConfirmationUUIDForPartial' />
							<FormContext.Provider
								value={{
									fields,
									update,
									getValues,
									docDate,
									salesPerson,
									formState,
									quotationType,
									lastValidDate,
									advanceBookingStartDate,
									advanceBookingLastValidDate,
									defaultPortTerm,
									defaultCurrency,
									setStateHandle,
									optionPOLTerminal,
									optionPODTerminal,
									optionPOLAgentCompany,
									optionPODAgentCompany,
									optionPOLAgentCompanyBranch,
									optionPODAgentCompanyBranch,
									pOLReqETA,
									pODReqETA,
									portTerm,
									freightTerm,
									defaultFinalDestinationCompany,
									setDefaultFinalDestinationCompany,
									VoyageNum,
									quickFormVoyageNum,
									transferVoyageVoyageNum,
									verificationStatus,
									ApprovedStatusReadOnlyForAllFields,
									RemoveAllReadOnlyFields,
									resetStateValue,
									QTOption,
									voyageandTranshipmentState,
									setVoyageandTranshipmentState,
									voyageForTransfer,
									clearErrors,
									updateDataForTransfer,
									transhipmentForTransfer,
								}}>
								<QuickFormContainer
									barge={props.barge}
									transferPartial={"BookingConfirmation"}
									register={register}
									control={control}
									errors={errors}
									setValue={setValue}
									getValues={getValues}
									ContainerItem={ContainerItemTransferPartial}
									ownershipType={OwnershipType}
									containerType={containerType}
									port={port}
									freightTerm={freightTerm}
									taxCode={taxCode}
									currency={currency}
									cargoType={cargoType}
									containerTypeAndChargesData={
										containerTypeAndChargesDataPartial
									}
									documentData={documentData}
								/>
							</FormContext.Provider>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-primary mb-1'
								id='comfirmTransferTO'
								onClick={() => confirmTransferTo("BookingConfirmation")}>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export function TransferPartialCNDNModal(props) {
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		trigger,
		reset,
		control,
		watch,
		clearErrors,
		formState: {errors},
	} = useForm({mode: "onChange"});
	const {fields, append, prepend, remove, swap, move, insert, update, replace} =
		useFieldArray({
			control,
			name: "SalesInvoiceHasTranshipment",
		});
	const [formState, setFormState] = useState({formType: "New"});
	const globalContext = useContext(GlobalContext);
	const navigate = useNavigate();

	const [defaultPortTerm, setDefaultPortTerm] = useState(
		"----c1d43831-d709-11eb-91d3-b42e998d11ff"
	);
	const [defaultCurrency, setDefaultCurrency] = useState(
		"----942c4cf1-d709-11eb-91d3-b42e998d11ff"
	);
	const [port, setPort] = useState("");
	const [portTerm, setPortTerm] = useState("");
	const [freightTerm, setFreightTerm] = useState("");
	const [taxCode, setTaxCode] = useState("");
	const [cargoType, setCargoType] = useState("");
	const [
		containerTypeAndChargesDataPartial,
		setContainerTypeAndChargesDataPartial,
	] = useState("");

	//document
	const [docDate, setDocDate] = useState("");
	const [lastValidDate, setLastValidDate] = useState("");
	const [advanceBookingStartDate, setAdvanceBookingStartDate] = useState("");
	const [advanceBookingLastValidDate, setAdvanceBookingLastValidDate] =
		useState("");
	const [salesPerson, setSalesPerson] = useState("");
	const [quotationType, setQuotationType] = useState("");
	const [currency, setCurrency] = useState("");
	const [QTOption, setQTOption] = useState([]);

	//instruction
	const [pOLReqETA, setPOLReqETA] = useState("");
	const [pODReqETA, setPODReqETA] = useState("");
	const [optionPOLTerminal, setOptionPOLTerminal] = useState([]);
	const [optionPODTerminal, setOptionPODTerminal] = useState([]);
	const [optionPOLAgentCompany, setOptionPOLAgentCompany] = useState([]);
	const [optionPODAgentCompany, setOptionPODAgentCompany] = useState([]);
	const [optionPOLAgentCompanyBranch, setOptionPOLAgentCompanyBranch] =
		useState([]);
	const [optionPODAgentCompanyBranch, setOptionPODAgentCompanyBranch] =
		useState([]);
	const [defaultFinalDestinationCompany, setDefaultFinalDestinationCompany] =
		useState([]);
	const [quickFormVoyageNum, setQuickFormVoyageNum] = useState([]);
	const [VoyageNum, setVoyageNum] = useState([]);
	const [transferVoyageVoyageNum, setTransferVoyageVoyageNum] = useState([]);

	//container
	const [containerType, setContainerType] = useState([]);

	//getUpdateDataState
	const [documentData, setDocumentData] = useState([]);
	const [updateDataForTransfer, setUpdateDataForTransfer] = useState([]);
	const [verificationStatus, setVerificationStatus] = useState("");
	const [resetStateValue, setResetStateValue] = useState("");
	const [voyageandTranshipmentState, setVoyageandTranshipmentState] = useState({
		Voyage: [],
		Transhipment: [],
	});
	const [voyageForTransfer, setVoyageForTransfer] = useState([]);
	const [transhipmentForTransfer, setTranshipmentForTransfer] = useState([]);

	function setStateHandle(val, target) {
		if (target === "DocDate" || target === "AdvanceBookingStartDate") {
			setDocDate(val);
		}
		if (target === "SalesPerson") {
			setSalesPerson(val);
		}
		if (target === "QuotationType") {
			setQuotationType(val);
		}
		if (
			target === "LastValidDate" ||
			target === "AdvanceBookingLastValidDate"
		) {
			setLastValidDate(val);
		}
		if (target === "AdvanceBookingStartDate") {
			setAdvanceBookingStartDate(val);
		}
		if (target === "AdvanceBookingLastValidDate") {
			setAdvanceBookingLastValidDate(val);
		}
		if (target === "OptionPOLTerminal") {
			setOptionPOLTerminal(val);
		}
		if (target === "OptionPODTerminal") {
			setOptionPODTerminal(val);
		}
		if (target === "OptionPOLAgentCompany") {
			setOptionPOLAgentCompany(val);
		}
		if (target === "OptionPODAgentCompany") {
			setOptionPODAgentCompany(val);
		}
		if (target === "OptionPOLAgentCompanyBranch") {
			setOptionPOLAgentCompanyBranch(val);
		}
		if (target === "OptionPODAgentCompanyBranch") {
			setOptionPODAgentCompanyBranch(val);
		}
		if (target === "VoyageNum") {
			setVoyageNum(val);
		}
		if (target === "QuickFormVoyageNum") {
			setQuickFormVoyageNum(val);
		}
		if (target === "TransferVoyageVoyageNum") {
			setTransferVoyageVoyageNum(val);
		}
		if (target === "polreqeta") {
			setPOLReqETA(val);
		}
		if (target === "podreqeta") {
			setPODReqETA(val);
		}
		if (target === "QTOption") {
			setQTOption(val);
		}
	}

	function ApprovedStatusReadOnlyForAllFields() {
		setTimeout(() => {
			$("button[type='submit']").prop("disabled", true);

			$(".form-control").each(function () {
				$(this).addClass("readOnlySelect");
				$(this).prop("disabled", true);
			});

			$(".basic-single").each(function () {
				$(this).addClass("readOnlySelect");
			});

			$(".c-date-picker").each(function () {
				$(this).addClass("pointerEventsStyle");
				$(this).prop("disabled", true);
			});

			$("#ChooseContainer").prop("disabled", true);
			$(".getAttentionSelections").prop("disabled", true);
			$(".getVoyageSelections").prop("disabled", true);
			$("#mainLoadTariff").addClass("d-none");
			$("#clearTableData").addClass("d-none");
			$(".add-charges").addClass("d-none");
			$(".add-container").addClass("d-none");
			$(".add-chargesNestedfake").addClass("d-none");
			$(".RemoveContainer").addClass("d-none");
			$(".RemoveCharges").addClass("d-none");
			$(".RemoveNestedCharges").addClass("d-none");
			$(".loadTariff").addClass("d-none");
			$("#transhipmentQuickForm").addClass("d-none");
			$(".add-transhipment").addClass("d-none");

			$("input[type='checkbox']").prop("disabled", true);
		}, 50);
	}

	function RemoveAllReadOnlyFields() {
		setTimeout(() => {
			$("button[type='submit']").prop("disabled", false);

			$(".form-control")
				.not(".OriReadOnlyClass")
				.each(function () {
					$(this).removeClass("readOnlySelect");
					$(this).prop("disabled", false);
				});

			$(".basic-single")
				.not(".OriReadOnlyClass")
				.each(function () {
					$(this).removeClass("readOnlySelect");
				});

			$(".c-date-picker")
				.not(".OriReadOnlyClass")
				.each(function () {
					$(this).removeClass("pointerEventsStyle");
					$(this).prop("disabled", false);
				});

			$("#ChooseContainer").prop("disabled", false);
			$(".getAttentionSelections").prop("disabled", false);
			$(".getVoyageSelections").prop("disabled", false);
			$("#mainLoadTariff").removeClass("d-none");
			$("#clearTableData").removeClass("d-none");
			$(".add-charges").removeClass("d-none");
			$(".add-container").removeClass("d-none");
			$(".add-chargesNestedfake").removeClass("d-none");
			$(".RemoveContainer").removeClass("d-none");
			$(".RemoveCharges").removeClass("d-none");
			$(".RemoveNestedCharges").removeClass("d-none");
			$(".loadTariff").removeClass("d-none");
			$("#transhipmentQuickForm").removeClass("d-none");
			$(".add-transhipment").removeClass("d-none");

			$("input[type='checkbox']").prop("disabled", false);
		}, 50);
	}

	useEffect(() => {
		GetAllDropDown(
			[
				"CargoType",
				"CurrencyType",
				"ChargesType",
				"FreightTerm",
				"ContainerType",
				"TaxCode",
			],
			globalContext
		).then((res) => {
			var ArrayCargoType = [];
			var ArrayPortCode = [];
			var ArrayFreightTerm = [];
			var ArrayContainerType = [];
			var ArrayCurrency = [];
			var ArrayTaxCode = [];

			$.each(res.Area, function (key, value) {
				ArrayPortCode.push({value: value.AreaUUID, label: value.PortCode});
			});

			$.each(res.FreightTerm, function (key, value) {
				ArrayFreightTerm.push({
					value: value.FreightTermUUID,
					label: value.FreightTerm,
				});
			});

			$.each(res.CargoType, function (key, value) {
				ArrayCargoType.push({
					value: value.CargoTypeUUID,
					label: value.CargoType,
				});
			});

			$.each(res.ContainerType, function (key, value) {
				ArrayContainerType.push({
					value: value.ContainerTypeUUID,
					label: value.ContainerType,
				});
			});

			$.each(res.CurrencyType, function (key, value) {
				ArrayCurrency.push({
					value: value.CurrencyTypeUUID,
					label: value.CurrencyName,
				});
			});

			$.each(res.TaxCode, function (key, value) {
				ArrayTaxCode.push({value: value.TaxCodeUUID, label: value.TaxCode});
			});

			setPort(ArrayPortCode);
			setFreightTerm(ArrayFreightTerm);
			setCargoType(ArrayCargoType);
			setContainerType(ArrayContainerType);
			setCurrency(ArrayCurrency);
			setTaxCode(ArrayTaxCode);
		});

		return () => {};
	}, []);

	function confirmTransferTo(type) {
		var array = [];
		var catchContainerEmpty = false;
		$(".checkboxCharges:checked").each(function () {
			if (props.barge) {
				var chargesIndex = $(this).parent().parent().parent().index();
			} else {
				var chargesIndex = $(this).parent().parent().parent().parent().index();
			}
			var ContainerIndex = $(this)
				.parent()
				.parent()
				.parent()
				.parent()
				.closest(".ChargesTable")
				.prev()
				.index();

			chargesIndex = chargesIndex == 0 ? chargesIndex : chargesIndex / 2;
			ContainerIndex =
				ContainerIndex == 0 ? ContainerIndex : ContainerIndex / 2;

			var closestContainerArrayList = $(this)
				.parent()
				.parent()
				.parent()
				.parent()
				.closest(".ChargesTable")
				.prev()
				.find(".containerArrayList")
				.val();

			if (props.barge) {
				var ArrayInside = {
					ContainerType: "",
					ContainerCode: "",
					ChargesCode: $(
						`input[name='SalesInvoiceHasContainerType[${ContainerIndex}][SalesInvoiceHasCharges][${chargesIndex}][ChargesCode]']`
					).val(),
				};
				array.push(ArrayInside);
			} else {
				if (closestContainerArrayList !== "") {
					$.each(closestContainerArrayList.split(","), function (key, value) {
						var ArrayInside = {
							ContainerType: $(
								`input[name='SalesInvoiceHasContainerType[${ContainerIndex}][ContainerType]']`
							).val(),
							ContainerCode: value,
							ChargesCode: $(
								`input[name='SalesInvoiceHasContainerType[${ContainerIndex}][SalesInvoiceHasCharges][${chargesIndex}][ChargesCode]']`
							).val(),
						};
						array.push(ArrayInside);
					});
				}
			}
		});
		var InvUUID = window.$("#SalesInvoiceUUIDForPartial").val();
		if (type == "CreditNote") {
			window.$("#TransferPartialToCNDNModal").modal("toggle");
			if (props.barge) {
				navigate(
					"/sales/standard/credit-note-barge/transfer-from-sales-invoice/id=" +
						InvUUID,
					{
						state: {
							formType: "TransferFromINV",
							id: InvUUID,
							tempArray: array,
							transferFromModel: "sales-invoice",
						},
					}
				);
			} else {
				navigate(
					"/sales/container/credit-note/transfer-from-sales-invoice/id=" +
						InvUUID,
					{
						state: {
							formType: "TransferFromINV",
							id: InvUUID,
							tempArray: array,
							transferFromModel: "sales-invoice",
						},
					}
				);
			}
		} else {
			window.$("#TransferPartialToCNDNModal").modal("toggle");
			if (props.barge) {
				navigate(
					"/sales/standard/debit-note-barge/transfer-from-sales-invoice/id=" +
						InvUUID,
					{
						state: {
							formType: "TransferFromINV",
							id: InvUUID,
							tempArray: array,
							transferFromModel: "sales-invoice",
						},
					}
				);
			} else {
				navigate(
					"/sales/container/debit-note/transfer-from-sales-invoice/id=" +
						InvUUID,
					{
						state: {
							formType: "TransferFromINV",
							id: InvUUID,
							tempArray: array,
							transferFromModel: "sales-invoice",
						},
					}
				);
			}
		}
	}

	var ContainerItemTransferPartial = {
		formName: "SalesInvoice",
		cardLength: "col-md-12",
		cardTitle: "Containers & Charges",
		ContainerColumn: [],
	};

	const OwnershipType = [
		{
			value: "COC",
			label: "COC",
		},
		{
			value: "SOC",
			label: "SOC",
		},
	];

	window
		.$("#TransferPartialToCNDNModal")
		.off("show.bs.modal")
		.on("show.bs.modal", function () {
			var InvUUID = window.$("input[name='SalesInvoiceUUIDForPartial']").val();
			if (window.$(".CheckingTransferToCNOrDN").val() == "CN") {
				TransferToCreditNote(InvUUID, globalContext).then((res) => {
					var tempData = res.data.SalesInvoiceHasContainerType;
					$.each(tempData, function (key, value) {
						var ArrayContainer = [];
						var ArrayContainer2 = [];
						if (value.SalesInvoiceHasContainer.length > 0) {
							$.each(value.SalesInvoiceHasContainer, function (key2, value2) {
								if (value2.ContainerCode) {
									ArrayContainer.push({
										ContainerUUID: value2.containerCode.ContainerUUID,
										ContainerCode: value2.containerCode.ContainerCode,
										SealNum: "",
									});
									ArrayContainer2.push(value2.containerCode.ContainerUUID);
								}
							});
						}
						value.ContainerCode = ArrayContainer;
						value.ContainerArray = ArrayContainer2.join(",");
					});
					setContainerTypeAndChargesDataPartial(tempData);
				});
			} else {
				TransferToDebitNote(InvUUID, globalContext).then((res) => {
					var tempData = res.data.SalesInvoiceHasContainerType;
					$.each(tempData, function (key, value) {
						var ArrayContainer = [];
						var ArrayContainer2 = [];
						if (value.SalesInvoiceHasContainer.length > 0) {
							$.each(value.SalesInvoiceHasContainer, function (key2, value2) {
								if (value2.ContainerCode) {
									ArrayContainer.push({
										ContainerUUID: value2.containerCode.ContainerUUID,
										ContainerCode: value2.containerCode.ContainerCode,
										SealNum: "",
									});
									ArrayContainer2.push(value2.containerCode.ContainerUUID);
								}
							});
						}
						value.ContainerCode = ArrayContainer;
						value.ContainerArray = ArrayContainer2.join(",");
					});
					setContainerTypeAndChargesDataPartial(tempData);
				});
			}
		});

	return (
		<>
			{/* modalTransferPartial */}
			<div
				className='modal fade'
				id='TransferPartialToCNDNModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog modal-xl' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Transfer To{" "}
								{window.$(".CheckingTransferToCNOrDN").val() == "CN"
									? "Credit Note"
									: "Debit Note"}
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<input type='hidden' className='CheckingTransferToCNOrDN' />
							<input
								type='hidden'
								name='SalesInvoiceUUIDForPartial'
								id='SalesInvoiceUUIDForPartial'
							/>
							<FormContext.Provider
								value={{
									fields,
									update,
									getValues,
									docDate,
									salesPerson,
									formState,
									quotationType,
									lastValidDate,
									advanceBookingStartDate,
									advanceBookingLastValidDate,
									defaultPortTerm,
									defaultCurrency,
									setStateHandle,
									optionPOLTerminal,
									optionPODTerminal,
									optionPOLAgentCompany,
									optionPODAgentCompany,
									optionPOLAgentCompanyBranch,
									optionPODAgentCompanyBranch,
									pOLReqETA,
									pODReqETA,
									portTerm,
									freightTerm,
									defaultFinalDestinationCompany,
									setDefaultFinalDestinationCompany,
									VoyageNum,
									quickFormVoyageNum,
									transferVoyageVoyageNum,
									verificationStatus,
									ApprovedStatusReadOnlyForAllFields,
									RemoveAllReadOnlyFields,
									resetStateValue,
									QTOption,
									voyageandTranshipmentState,
									setVoyageandTranshipmentState,
									voyageForTransfer,
									clearErrors,
									updateDataForTransfer,
									transhipmentForTransfer,
								}}>
								<QuickFormContainer
									barge={props.barge}
									transferPartial={"SalesInvoice"}
									register={register}
									control={control}
									errors={errors}
									setValue={setValue}
									getValues={getValues}
									ContainerItem={ContainerItemTransferPartial}
									ownershipType={OwnershipType}
									containerType={containerType}
									port={port}
									freightTerm={freightTerm}
									taxCode={taxCode}
									currency={currency}
									cargoType={cargoType}
									containerTypeAndChargesData={
										containerTypeAndChargesDataPartial
									}
									documentData={documentData}
								/>
							</FormContext.Provider>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-primary mb-1'
								id='comfirmTransferTO'
								onClick={() =>
									confirmTransferTo(
										window.$(".CheckingTransferToCNOrDN").val() == "CN"
											? "CreditNote"
											: "DebitNote"
									)
								}>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export function MyVoyageModal(props) {
	const globalContext = useContext(GlobalContext);
	const [myVoyageList, setMyVoyageList] = useState([]);
	const customStyles = {
		control: (base) => ({
			...base,
			minHeight: 30,
		}),
		dropdownIndicator: (base) => ({
			...base,
			padding: 4,
		}),
		clearIndicator: (base) => ({
			...base,
			padding: 4,
		}),

		valueContainer: (base) => ({
			...base,
			padding: "0px 6px",
		}),
		input: (base) => ({
			...base,
			margin: 0,
			padding: 0,
		}),
		menuPortal: (base) => ({
			...base,
			zIndex: 9999,
		}),
	};

	function SaveManifestImportVoyage() {
		var BLUUIDs = $("#selectedBLUUIDs").val().split(",");
		var selectedVoyage = $("input[name='MyVoyage']").val();
		SaveManifestImportVoyageNo(globalContext, BLUUIDs, selectedVoyage).then(
			(res) => {
				if (res.message) {
					ToastNotify("success", res.message);
				}
				window.$("#MyVoyageModal").modal("toggle");
			}
		);
	}

	useEffect(() => {
		window
			.$("#MyVoyageModal")
			.off(".show.bs.modal")
			.on("show.bs.modal", function (e) {
				var previousVoyage = $(
					"input[name='DynamicModel[VoyageNumber]']"
				).val();

				GetSuitableVoyageForMyVoyage(globalContext, previousVoyage).then(
					(res) => {
						const ListOfMyVoyage = [];
						$.each(res.data, function (key, value) {
							ListOfMyVoyage.push({
								value: value.VoyageUUID,
								label: value.VoyageNumber + "(" + value.vessel.VesselCode + ")",
							});
						});
						setMyVoyageList(ListOfMyVoyage);
					}
				);
			});

		return () => {};
	}, []);

	return (
		<div
			className='modal fade'
			id='MyVoyageModal'
			tabIndex='-1'
			role='dialog'
			aria-labelledby='exampleModalLabel'
			aria-hidden='true'>
			<div className='modal-dialog' role='document'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='exampleModalLabel'>
							My Voyage
						</h5>
						<button
							type='button'
							className='close'
							data-dismiss='modal'
							aria-label='Close'>
							<span aria-hidden='true'>&times;</span>
						</button>
						<input type='hidden' id='selectedBLUUIDs' />
					</div>
					<div className='modal-body'>
						<div className='row'>
							<div className='col-md-5'>
								<div className='form-group'>
									<label htmlFor='previousVoyage' className='col-form-label'>
										Previous Voyage Select:
									</label>
									<Controller
										name='PreviousVoyage'
										id='previousVoyage'
										control={props.control}
										render={({field: {onChange, value}}) => (
											<Select
												{...props.register("PreviousVoyage")}
												id='previousVoyage'
												value={
													value
														? props.voyage.find((c) => c.value === value)
														: null
												}
												onChange={(val) => {
													val == null ? onChange(null) : onChange(val.value);
												}}
												options={props.voyage}
												className='form-control readOnlySelect'
												classNamePrefix='select'
												menuPortalTarget={document.body}
												styles={customStyles}
											/>
										)}
									/>
								</div>
							</div>
							<div className='col-md-2'>
								<div className='form-group'>
									<label className='col-form-label text-center mt-4 ml-3'>
										--To--
									</label>
								</div>
							</div>
							<div className='col-md-5'>
								<div className='form-group'>
									<label htmlFor='myVoyage' className='col-form-label'>
										My Voyage Select:
									</label>
									<Controller
										name='MyVoyage'
										id='myVoyage'
										control={props.control}
										render={({field: {onChange, value}}) => (
											<Select
												{...props.register("MyVoyage")}
												id='myVoyage'
												value={
													value
														? myVoyageList.find((c) => c.value === value)
														: null
												}
												onChange={(val) => {
													val == null ? onChange(null) : onChange(val.value);
												}}
												options={myVoyageList}
												className='form-control'
												classNamePrefix='select'
												menuPortalTarget={document.body}
												styles={customStyles}
											/>
										)}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							className='btn btn-primary mr-2'
							onClick={SaveManifestImportVoyage}>
							Save
						</button>
						<button
							type='button'
							className='btn btn-secondary'
							data-dismiss='modal'>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ManifestEmailModal(props) {
	const globalContext = useContext(GlobalContext);
	const formContext = useContext(FormContext);

	useEffect(() => {
		window
			.$("#ManifestEmailModal")
			.off(".show.bs.modal")
			.on("show.bs.modal", function (e) {
				ResetHandle();
				const voyageUUID = $(".voyageUUIDs").val();
				props.setValue("Subject", `Custom Declaration for ${voyageUUID}`);
			});

		setAutoHeigthTextArea("email-description"); //set autoheight for textarea

		return () => {};
	}, []);

	useEffect(() => {
		$(".Attachments").click(function () {
			if ($("#ManifestEmailModal").find(".jFiler-theme-default").length > 1) {
				$("#ManifestEmailModal").find(".jFiler-theme-default").last().unwrap();
			}
		});
	}, []);

	function ResetHandle() {
		props.reset();
		$("#ManifestEmailModal").find(".jFiler-input").remove();
		$("#ManifestEmailModal").find(".jFiler-items").empty();
		var zipFilePath = [];
		zipFilePath = JSON.parse($(".zipFilePath").val());
		getFiles(zipFilePath);
	}

	function getFiles(filedata) {
		if (filedata) {
			$.each(filedata.files, function (key, value) {
				var link = value.file;
				let newLink = link.replace(/^(\.\.\/)+/, "");
				value.file = globalContext.globalHost + "/syscms/" + newLink;
			});
			window.$("#company-zip").val(filedata["files"][0]["file"]);
			InitAttachment(filedata.files, "email-attachment");
		} else {
			var data = [];
			InitAttachment(data, "email-attachment");
		}
	}

	function InitAttachment(data, id) {
		window.$("#" + id).filer({
			showThumbs: true,
			addMore: true,
			allowDuplicates: false,
			theme: "default",
			templates: {
				itemAppendToEnd: true,
				box: '<ul className="jFiler-items-list jFiler-items-default"></ul>',
				item: `<li className="jFiler-item">
                            <div className="jFiler-item-container">
                                <div className="jFiler-item-inner">
                                    <div className="jFiler-item-icon pull-left"></div>
                                    <div className="jFiler-item-info pull-left">
                                        <span className="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>
                                        <span className="jFiler-item-others">
                                        <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span className="jFiler-item-status">{{fi-progressBar}}</span>
                                        </span>
                                        <div className="jFiler-item-assets">
                                            <ul className="list-inline">
                                                <li><a className="icon-jfi-trash jFiler-item-trash-action"></a></li>
                                            </ul>
                                        </div>
                                        <div><input type="hidden" name="name[]" value="{{fi-name}}"></div>
                                    </div>
                                </div>
                            </div>
                        </li>`,
				itemAppend: `
                    <li className="jFiler-item">
                        <div className="jFiler-item-container">
                            <div className="jFiler-item-inner">
                                <div className="jFiler-item-icon pull-left"></div>
                                    <div className="jFiler-item-info pull-left">
                                        <span className="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>
                                        <span className="jFiler-item-others">
                                            <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span className="jFiler-item-status">{{fi-progressBar}}</span>
                                        </span>
                                        <div className="jFiler-item-assets">
                                            <ul className="list-inline">
                                            <li><a href="{{fi-url}}" className="text-secondary" download><i className="fa fa-download"></i></a></li>
                                            <li><a className="icon-jfi-trash jFiler-item-trash-action"></a></li>
                                        </ul>
                                    </div>
                                    <div><input type="hidden" name="name[]" value="{{fi-name}}"></div>
                                </div>
                            </div>
                        </div>
                    </li>`,
			},
			files: data,
			afterRender: function () {
				// $.each(data, function (key, value) {
				//     var caption = $(".jFiler-item").find("input[name='caption[]']")[key];
				//     var PermitAttachment = $(".jFiler-item").find("input[name='PermitAttachment[]']")[key];
				//     var PermitAttachmentCheckBox = $(".jFiler-item").find(".PermitAttachmentCheckbox")[key];
				//     $(caption).val(value.caption)
				//     if (value.permitAttachment) {
				//         $(PermitAttachment).val(value.permitAttachment)
				//         if (value.permitAttachment == "1") {
				//         $(PermitAttachmentCheckBox).prop("checked", true)
				//         } else {
				//         $(PermitAttachmentCheckBox).prop("checked", false)
				//         }
				//     }
				// })
			},
			// afterShow: function(item){
			//     console.log($(".jFiler-row"))
			//     if ($(".jFiler-row").length >= 2) {
			//         $(".jFiler-row:gt(0)").remove(); // Remove all elements except the first one
			//     }
			// },
		});
		ControlOverlay(false);
	}

	function SendEmail() {
		var EmailData = props.getValues("Email");
		var formdata = new FormData($("form")[0]);

		// Using FormData.forEach() method
		var ValidEmail = true;
		var ToValue;
		formdata.forEach(function (value, key) {
			if (key == "To" || key == "Cc" || key == "Bcc") {
				if (key == "To") {
					ToValue = value;
				}
				if (value !== "") {
					var formattedValue = value.split(",").map(function (email) {
						return email.trim();
					});
					formdata.set(key, formattedValue);
					var isValidEmail = areEmailsValid(value);
					if (!isValidEmail) {
						ValidEmail = isValidEmail;
						return false;
					} else {
						// Additional logic if needed
					}
				}
			}
		});

		if (!ToValue) {
			alert("Please provide a valid email address.");
		} else if (!ValidEmail) {
			alert("Please checking your email format.");
		} else {
			ControlOverlay(true);
			sendEmailManifest(globalContext, formdata).then((res) => {
				console.log(res);
				if (res.message) {
					alert("The email has been sent successfully.");
					ControlOverlay(false);
					window.$("#ManifestEmailModal").modal("toggle");
				}
			});
		}
	}

	function areEmailsValid(value) {
		// Split the value by commas to get individual email addresses
		var emails = value.split(",");

		// Regular expression for email validation
		var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		// Iterate over each email address and check if it matches the email format
		for (var i = 0; i < emails.length; i++) {
			var email = emails[i].trim(); // Remove any leading/trailing whitespace
			if (!emailPattern.test(email)) {
				return false; // Return false if any email address is invalid
			}
		}

		return true; // Return true if all email addresses are valid
	}

	return (
		<>
			<div
				className='modal fade'
				id='ManifestEmailModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog modal-xl' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Email
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
							<input type='hidden' className='manifestType' />
							<input type='hidden' className='voyageUUIDs' />
							<input type='hidden' className='selectedBLUUIDs' />
							<input type='hidden' className='zipFilePath' />
						</div>
						<div className='modal-body'>
							<form>
								<input
									type='hidden'
									id='company-zip'
									{...props.register("Zip")}
								/>
								<table style={{width: "100%"}}>
									<tbody>
										<tr>
											<td>
												<label className='control-label'>To :</label>
											</td>
											<td>
												<input
													type='email'
													name='email'
													multiple
													pattern='[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
													{...props.register("To")}
													id={"email-to"}
													className={`form-control`}
												/>
											</td>
										</tr>
										<tr>
											<td>
												<label className='control-label'>Cc :</label>
											</td>
											<td>
												<input
													{...props.register("Cc")}
													id={"email-cc"}
													className={`form-control`}
												/>
											</td>
										</tr>
										<tr>
											<td>
												<label className='control-label'>Bcc :</label>
											</td>
											<td>
												<input
													{...props.register("Bcc")}
													id={"email-bcc"}
													className={`form-control`}
												/>
											</td>
										</tr>
										<tr>
											<td>
												<label className='control-label'>Subject :</label>
											</td>
											<td>
												<input
													{...props.register("Subject")}
													id={"email-subject"}
													className={`form-control`}
												/>
											</td>
										</tr>
										<tr>
											<td>
												<label className='control-label'>Description :</label>
											</td>
											<td>
												<textarea
													rows='5'
													{...props.register("Description")}
													id={"email-description"}
													className={`form-control`}></textarea>
											</td>
										</tr>
									</tbody>
								</table>
								<div className=''>
									<div className='form-group attachmentGroup'>
										<label className='control-label'>Attachment</label>
										<input
											type='file'
											id={"email-attachment"}
											multiple
											{...props.register("Attachment")}
											className={``}
										/>
									</div>
								</div>
							</form>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-primary mr-2'
								onClick={SendEmail}>
								Send Email
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}




