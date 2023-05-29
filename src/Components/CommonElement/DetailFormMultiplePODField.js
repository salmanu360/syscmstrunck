import React, { useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext";
import { CheckBoxHandle, getAreaById, getPortDetails, getPortDetailsById, getVoyageByIdSpecial, FindVoyagesWithPolPod } from "../Helper";
import $ from "jquery";
import axios from "axios"

function DetailFormMultiplePODField(props) {


    const globalContext = useContext(GlobalContext)
    const formContext = useContext(FormContext)
    var formName = props.formName
    var formNameLowerCase = formName.toLowerCase()
 
    useEffect(() => {
      console.log(formContext.PODFields)
    
      return () => {
        
      }
    }, [formContext.PODFields])
    


    function loadCompanyOptions(inputValue){
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {
        auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
        },
        }).then(res => res.data.data)
    
        return response
    }

    function onChangeMultipleFinalDestinationPort(value, positionId, index){
        var closestArea = $("#" + positionId).closest(".row").find(".FinalDestinationAreaName")

        console.log(closestArea)
        if(value){
            getAreaById(value.value, globalContext).then(data => {
             
                $(closestArea).val(data["Area"]);
            });
        }else{
           $(closestArea).val("");
        }

    }

    function onChangeMultiplePODPortCode(value, positionId, index) {
        console.log('here')
        console.log('ppp')
        var closestArea = $("#" + positionId).closest(".row").find(".AreaName")
        $($(".multiplepod-item")[index]).find(".podCard").text(`POD-${value.label}`)
 
        if (value) {
            props.setValue(`${formName}HasTranshipment[${index}][QuickFormPortCode]`, value.value)
            props.setValue(`MultiplePOD[${index}][PortCode]`, value.value)
            $(`#PODtab-${index}`).find(".tabName").text(value.label)

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
                props.setValue(`${formName}POD[${index}][optionTerminal]`, tempOptions)
                props.setValue(`${formName}POD[${index}][optionAgentCompany]`, tempOptionsCompany)
                props.setValue(`${formName}POD[${index}][optionAgentBranchCode]`, tempOptionsCompanyBranch)

                formContext.updatePODFields(formContext.PODFields)
                props.setValue(`${formName}POD[${index}][PODLocationCode]`, DefaultValue)
                props.setValue(`${formName}POD[${index}][PODLocationName]`, DefaultPortName)
                props.setValue(`${formName}POD[${index}][PODHandlingCompanyROC]`, DefaultAgentCompanyROC)
                props.setValue(`${formName}POD[${index}][PODHandlingCompanyCode]`, DefaultAgentCompany)
                props.setValue(`${formName}POD[${index}][PODHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                props.setValue(`${formName}POD[${index}][PODHandlingOfficeName]`, DefaultAgentCompanyBranchName)
            });
        } else {
            props.setValue(`${formName}POD[${index}][PortCode]`, "")
            $(closestArea).val("");
            props.setValue(`${formName}POD[${index}][optionTerminal]`, [])
            props.setValue(`${formName}POD[${index}][optionAgentCompany]`, [])
            props.setValue(`${formName}POD[${index}][optionAgentBranchCode]`, [])
            formContext.update(formContext.fields)
            props.setValue(`${formName}POD[${index}][PODLocationCode]`, "")
            props.setValue(`${formName}POD[${index}][PODLocationName]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingCompanyROC]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingCompanyCode]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingOfficeCode]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingOfficeName]`, "")

        }
    }

    function FindPOTVoyage(index) {
    
        var POTPortCode = [];

        if (index > 0) {
            var POL = props.getValues(`QuotationHasTranshipment[${index - 1}][QuickFormPortCode]`)
            var POD = props.getValues(`QuotationHasTranshipment[${index}][QuickFormPortCode]`);
        } else {
            var POL = $(`[name='${formName}[POLPortCode]']`).val();
            var POD = props.getValues(`QuotationHasTranshipment[${index}][QuickFormPortCode]`);
        }

        if ($(".QuickFormVoyageNum").length > 0) {
            $(".QuickFormVoyageNum").each(function () {
                if ($(this).val() != "") {
                    POTPortCode.push($(this).val())
                }
            })
        }

        var startdate, enddate;
        if (props.getValues(`${formName}[QuotationType]`) == "Advance Booking") {
            startdate = $(`input[name='${formName}[AdvanceBookingStartDate]']`).val();
            enddate = $(`input[name='${formName}[AdvanceBookingLastValidDate]']`).val();
        } else {
            startdate = $(`input[name='${formName}[DocDate]']`).val();
            enddate = $(`input[name='${formName}[LastValidDate]']`).val();
        }

        if (POL != "" && POD != "") {
            var filter = {
                POL: POL,
                POD: POD,
                DocDate: $(".docDate").val(),
                LastValidDate: $(".lastValidDate").val(),
                POTVoyageUUIDs: POTPortCode,
                PrevVoyage: props.getValues(`${formName}HasTranshipment[${index}][QuickFormPOTVoyage]`),
            }

            FindVoyagesWithPolPod(filter, globalContext).then(data => {
                var VoyageArray = []
                try {
                    $.each(data, function (key, value) {
                        VoyageArray.push({ value: value.VoyageUUID, label: value.VoyageFullName })
                    });
                }
                catch (err) {

                }

                props.setValue(`${formName}HasTranshipment[${index}][optionFromVoyage]`, VoyageArray)
                formContext.update(formContext.fields)

                if (data == null) {
                    if (formName !== "ContainerReleaseOrder") {
                        alert("Please add transshipment")
                    }
                }
            })
        }
        else {
            props.setValue(`${formName}HasTranshipment[${index}][optionFromVoyage]`, [])
            formContext.update(formContext.fields)
        }
    }

    function FindVoyageFromTranshipmentDetails(currentSelector, id, index) {
        if (currentSelector) {
            props.setValue(`${formName}HasTranshipment[${index}][QuickFormPOTVoyage]`, currentSelector.value)
            var value = currentSelector ? currentSelector.value : ""
            var regExp = /\(([^)]+)\)/;
            var str = id
            var res = str.split("-");
            var common = res[0] + "-" + res[1];
            var text = currentSelector ? currentSelector.label : ""
            var matches = regExp.exec(text);
            var result;
            var insideBracketVessel;
            var vesselCode;

            if (value.includes("@", 1)) {
                result = value.slice(0, -2);
            } else {
                result = value
            }

            $.each(matches, function (key, value) {
                if (key == 0) {
                    insideBracketVessel = value;
                } else if (key == 1) {
                    vesselCode = value;
                }
            })

            var voyageNo = text.replace(insideBracketVessel, '');
            var StrvoyageNo = voyageNo.replace(/\s/g, '');
            var lastCharVoyageNo = StrvoyageNo.substr(StrvoyageNo.length - 1); // get voyage no last character eg. A, B or W
    
            if (result != "") {
                getVoyageByIdSpecial(result, globalContext).then(data => {
                    $("#" + common + "-fromvesselname").val(data[0].vessel.VesselName);
                })
            }

            $("#" + common + "-fromvesselcode").val(vesselCode);
            $("#" + common + "-fromvoyagename").val(StrvoyageNo);
            props.setValue(`${formName}HasTranshipment[${index}][QuickFormPOTVesselCode]`, vesselCode)
        }
        else {
            $("#" + common + "-fromvesselcode").val("");
            $("#" + common + "-fromvoyagename").val("");
            props.setValue(`${formName}HasTranshipment[${index}][QuickFormPOTVesselCode]`, "")
        }
    }

    return (
        <>
            {formContext.PODFields.map((item, index) => {
                return (
                    <div key={item.id} className="MultiplePODCard">
                        <div className="MultiplePODCardRow">
                            <div className="multiplepod-items ui-sortable">
                                <div className="multiplepod-item">
                                    <div className="card lvl3">
                                        <div className="card-header">
                                            <h3 className="card-title podCard">
                                                POD-{index}<span className="PortCode"></span></h3>
                                            <div className="card-tools">
                                                <button type="button" className="btn btn-danger btn-xs" onClick={() => formContext.FieldArrayHandleMultiplePOD("removePODFields", index)}><span className="fa fa-times"></span></button>
                                                <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body multiplepod-body">
                                            {/* <input type="hidden" id="" {...props.register(`${formName}HasTranshipment[${index}][${formName}HasTranshipmentUUID]`)} className={`${formName}HasTranshipmentUUID`} />
                                            <input type="hidden" className={`${formNameLowerCase}fromvoyagepot"`} id={`${formNameLowerCase}-transhipment-fromvoyagepot`} {...props.register(`${formName}HasTranshipment[${index}][FromVoyagePOT]`)} />
                                            <input type="hidden" className={`${formNameLowerCase}tovoyagepot"`} id={`${formNameLowerCase}-transhipment-tovoyagepot`} {...props.register(`${formName}HasTranshipment[${index}][ToVoyagePOT]`)} /> */}
                                            <div className="row">

                                                <div className={"col-md-6"}>
                                                    <div className="form-group">
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-portcode`}>Port Code</label>
                                                        <Controller
                                                            name={`${formName}POD[${index}][PODPortCode]`}
                                                            id={`${formNameLowerCase}pod-${index}-portcode`}
                                                            control={props.control}
                                                            defaultValue={item.portCode}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}POD[${index}][PODPortCode]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}pod-${index}-portcode`}
                                                                    value={
                                                                        value
                                                                            ? props.port.find((c) => c.value === value)
                                                                            : null
                                                                    }
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                        onChangeMultiplePODPortCode(val, `${formNameLowerCase}pod-${index}-portcode`, index)
                                                                    }}
                                                                    options={props.port ? props.port : ""}
                                                                    className={`form-control  liveData Live_Area`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-area`}>Area</label>
                                                        <input type="text" id={`${formNameLowerCase}pod-${index}-area`} className="form-control  AreaName" {...props.register(`${formName}POD[${index}][PODAreaName]`)} readOnly={true} maxLength="255" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}pod-${index}-locationcode`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-locationcode`}>Terminal Code</label>
                                                        {console.log(item)}
                                                        <Controller
                                                            name={`${formName}POD[${index}][PODLocationCode]`}
                                                            id={`${formNameLowerCase}pod-${index}-locationcode`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}POD[${index}][PODLocationCode]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}pod-${index}-locationcode`}
                                                                    value={
                                                                        value
                                                                            ? item.optionTerminal ? item.optionTerminal.find((c) => c.value === value)
                                                                                : null
                                                                            : null
                                                                    }
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                    }}
                                                                    options={item.optionTerminal}
                                                                    className={`form-control POTLocationCode liveData Live_Terminal`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}pod-${index}-locationname`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-locationname`}>Terminal Name</label>
                                                        <input type="text" id={`${formNameLowerCase}pod-${index}-locationname`} className="form-control PODLocationName" {...props.register(`${formName}POD[${index}][PODLocationName]`)} readOnly={true} maxLength="255" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}pod-${index}-podportterm`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-podportterm`}>Port Term</label>
                                                        <Controller
                                                            defaultValue={formContext.defaultPortTerm}
                                                            name={`${formName}POD[${index}][PODPortTerm]`}
                                                            id={`${formNameLowerCase}pod-${index}-podportterm`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}POD[${index}][PODPortTerm]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}pod-${index}-podportterm`}
                                                                    value={
                                                                        value
                                                                            ? formContext.portTerm.find((c) => c.value === value)
                                                                            : null
                                                                    }
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                    }}
                                                                    options={formContext.portTerm ? formContext.portTerm : ""}
                                                                    className={`form-control PODPortTermDetailForm liveData Live_PortTerm`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-podfreightterm`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-podfreightterm`}>Freight Term</label>
                                                        <Controller
                                                            name={`${formName}POD[${index}][PODFreightTerm]`}
                                                            id={`${formNameLowerCase}hastranshipment-${index}-podfreightterm`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}POD[${index}][PODFreightTerm]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}hastranshipment-${index}-podfreightterm`}
                                                                    value={
                                                                        value
                                                                            ? formContext.freightTerm.find((c) => c.value === value)
                                                                            : null
                                                                    }
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                    }}
                                                                    options={formContext.freightTerm ? formContext.freightTerm : ""}
                                                                    className={`form-control PODFreightTermDetailForm liveData Live_PortTerm`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}pod-${index}-podhandlingcompanyroc`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-podhandlingcompanyroc`}>Terminal Handler ROC</label>
                                                        <input type="text" id={`${formNameLowerCase}pod-${index}-podhandlingcompanyroc`} className="form-control PODHandlingCompanyROC" {...props.register(`${formName}POD[${index}][PODHandlingCompanyROC]`)} readOnly={true} maxLength="255" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}pod-${index}-podhandlingcompanycode`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-podhandlingcompanycode`}>Terminal Handler Company</label>
                                                        <Controller
                                                            name={`${formName}POD[${index}][PODHandlingCompanyCode]`}
                                                            id={`${formNameLowerCase}pod-${index}-podhandlingcompanycode`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}POD[${index}][PODHandlingCompanyCode]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}pod-${index}-podhandlingcompanycode`}
                                                                    value={
                                                                        value
                                                                            ? item.optionAgentCompany ? item.optionAgentCompany.find((c) => c.value === value)
                                                                                : null
                                                                            : null
                                                                    }
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                    }}
                                                                    options={item.optionAgentCompany}
                                                                    className={`form-control PODHandlingCompanyCode`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}pod-${index}-podhandlingofficecode`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-podhandlingofficecode`}>Terminal Handler Branch Code</label>
                                                        <Controller
                                                            name={`${formName}POD[${index}][PODHandlingOfficeCode]`}
                                                            id={`${formNameLowerCase}pod-${index}-podhandlingofficecode`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}POD[${index}][PODHandlingOfficeCode]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}pod-${index}-podhandlingofficecode`}
                                                                    value={
                                                                        value
                                                                            ? item.optionAgentBranchCode ? item.optionAgentBranchCode.find((c) => c.value === value)
                                                                                : null
                                                                            : null
                                                                    }
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                    }}
                                                                    options={item.optionAgentBranchCode}
                                                                    className={`form-control PODHandlingOfficeCode`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />

                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className={`form-group field-${formNameLowerCase}pod-${index}-podhandlingofficename`}>
                                                        <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-podhandlingofficename`}>Terminal Handler Branch Name</label>
                                                        <input type="text" id="" className="form-control PODHandlingOfficeName" {...props.register(`${formName}POD[${index}][PODHandlingOfficeName]`)} readOnly={true} maxLength="255" />
                                                    </div>
                                                </div>


                                                <div key={index} className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label">Req ETA</label>
                                                        <Controller
                                                            name={`${formName}POD[${index}][PODReqETA]`}
                                                            id={`${formNameLowerCase}pod-${index}-podreqeta`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <>
                                                                    <Flatpickr
                                                                        {...props.register(`${formName}POD[${index}][PODReqETA]`)}
                                                                        style={{ backgroundColor: "white" }}
                                                                        value={""}
                                                                        id={`${formNameLowerCase}pod-${index}-podreqeta`}
                                                                        data-target={"polreqeta"}
                                                                        onChange={val => {
                                                                            val == null ? onChange(null) : onChange(moment(val[0]).format("DD/MM/YYYY"), "podreqeta");
                                                                            val == null ? formContext.setStateHandle(null, "podreqeta") : formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY"), "podreqeta")
                                                                        }}
                                                                        className={`form-control c-date-picker reflect-field flatpickr-input-time flatpickr-input OriReadOnlyClass`}
                                                                        options={{
                                                                            dateFormat: "d/m/Y"
                                                                        }}

                                                                    />
                                                                </>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <div className={"col-md-6"}>
                                                        <div className="form-group">
                                                            <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-finaldestinationportcode`}>Final Destination Port Code</label>
                                                            <Controller
                                                                name={`${formName}POD[${index}][FinalDestinationPortCode]`}
                                                                id={`${formNameLowerCase}pod-${index}-finaldestinationportcode`}
                                                                control={props.control}
                                                                defaultValue={item.portCode}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <Select
                                                                        {...props.register(`${formName}POD[${index}][FinalDestinationPortCode]`)}
                                                                        isClearable={true}
                                                                        id={`${formNameLowerCase}pod-${index}-finaldestinationportcode`}
                                                                        value={
                                                                            value
                                                                                ? props.port.find((c) => c.value === value)
                                                                                : null
                                                                        }
                                                                        onChange={(val) => {
                                                                            val == null ? onChange(null) : onChange(val.value);
                                                                            onChangeMultipleFinalDestinationPort(val, `${formNameLowerCase}pod-${index}-finaldestinationportcode`, index)
                                                                        }}
                                                                        options={props.port ? props.port : ""}
                                                                        className={`form-control PortCodeDetailForm TranshipmentPortCode getPODTerminalPortCode liveData Live_Area`}
                                                                        classNamePrefix="select"
                                                                        menuPortalTarget={document.body}
                                                                        styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-finaldestinationarea`}>Final Destination Area</label>
                                                            <input type="text" id={`${formNameLowerCase}pod-${index}-finaldestinationarea`} className="form-control  FinalDestinationAreaName" {...props.register(`${formName}POD[${index}][FinalDestinationArea]`)} readOnly={true} maxLength="255" />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className={`form-group field-${formNameLowerCase}pod-${index}-finaldestinationpotportterm`}>
                                                            <label className="control-label" htmlFor={`${formNameLowerCase}pod-${index}-finaldestinationpotportterm`}>Final Destination Port Term</label>
                                                            <Controller
                                                                defaultValue={formContext.defaultPortTerm}
                                                                name={`${formName}POD[${index}][FinalDestinationPortTerm]`}
                                                                id={`${formNameLowerCase}pod-${index}-finaldestinationpotportterm`}
                                                                control={props.control}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <Select
                                                                        {...props.register(`${formName}POD[${index}][FinalDestinationPortTerm]`)}
                                                                        isClearable={true}
                                                                        id={`${formNameLowerCase}pod-${index}-finaldestinationpotportterm`}
                                                                        value={
                                                                            value
                                                                                ? formContext.portTerm.find((c) => c.value === value)
                                                                                : null
                                                                        }
                                                                        onChange={(val) => {
                                                                            val == null ? onChange(null) : onChange(val.value);
                                                                        }}
                                                                        options={formContext.portTerm ? formContext.portTerm : ""}
                                                                        className={`form-control POTPortTermDetailForm liveData Live_PortTerm`}
                                                                        classNamePrefix="select"
                                                                        menuPortalTarget={document.body}
                                                                        styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                    />
                                                                )}
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

                )
            })}
            <button type="button" className="add-transhipment btn btn-success btn-xs mb-2" onClick={() => formContext.FieldArrayHandleMultiplePOD("appendPODFields")}><span className="fa fa-plus"></span> Add POD</button>
        </>
    )
}

export default DetailFormMultiplePODField