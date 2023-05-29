import React, {useContext, useEffect} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext";
import {CheckBoxHandle,getAreaById,getPortDetails,getPortDetailsById, getVoyageByIdSpecial,FindVoyagesWithPolPod} from "../Helper";
import $ from "jquery";
import axios from "axios"

function DetailFormTranshipment(props) {
    const globalContext = useContext(GlobalContext)
    const formContext = useContext(FormContext)
    var formName = props.TranshipmentItem.formName
    var formNameLowerCase = formName.toLowerCase()

    function onChangePOTPortCode (value,positionId,index){
        console.log(positionId)
        var closestArea = $("#"+positionId).closest(".row").find(".AreaName")
  
        if(value){    
              props.setValue(`${formName}HasTranshipment[${index}][QuickFormPortCode]`, value.value)
              
              var id = value.value
              var portCode = value.label
              var DefaultValue;
              var DefaultPortName;
              var DefaultAgentCompanyROC;
              var DefaultAgentCompany;
              var DefaultAgentCompanyBranch;
              var DefaultAgentCompanyBranchName;
              
              //get area
              getAreaById(id,globalContext).then(data => {
                console.log(closestArea)
                  $(closestArea).val(data["Area"]);
              });
  
              //get terminal options
              getPortDetails(id,globalContext).then(data => {
                  var tempOptions = []
                  var tempOptionsCompany = []
                  var tempOptionsCompanyBranch = []
                  if (data.length > 0) {
                      $.each(data, function (key, value1) {
                          if(value1.VerificationStatus=="Approved"){
                          if (value1.Default == 1) {
                              DefaultValue = value1.PortDetailsUUID;
                              DefaultPortName = value1.PortName;
                              DefaultAgentCompanyROC = value1.handlingCompany.ROC
                              DefaultAgentCompany = value1.HandlingCompany
                              DefaultAgentCompanyBranch = value1.HandlingCompanyBranch
                              DefaultAgentCompanyBranchName = value1.handlingCompanyBranch.BranchName
                              tempOptionsCompany.push({ value: value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName })
                              tempOptionsCompanyBranch.push({ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode})
                          }
                          
                          tempOptions.push({ value: value1.PortDetailsUUID, label: value1.LocationCode })
                          } 
                      })
                  }
  
                  // set Option Terminal
                  props.setValue(`${formName}HasTranshipment[${index}][optionTerminal]`,tempOptions)
                  props.setValue(`${formName}HasTranshipment[${index}][optionAgentCompany]`,tempOptionsCompany)
                  props.setValue(`${formName}HasTranshipment[${index}][optionAgentBranchCode]`,tempOptionsCompanyBranch)
                  formContext.update(formContext.fields)
                  props.setValue(`${formName}HasTranshipment[${index}][LocationCode]`,DefaultValue)
                  props.setValue(`${formName}HasTranshipment[${index}][LocationName]`,DefaultPortName)
                  props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyROC]`,DefaultAgentCompanyROC)
                  props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyCode]`,DefaultAgentCompany)
                  props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeCode]`,DefaultAgentCompanyBranch)
                  props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeName]`,DefaultAgentCompanyBranchName)
              });
        }else{
          props.setValue(`${formName}HasTranshipment[${index}][QuickFormPortCode]`, "")
          $(closestArea).val("");
          props.setValue(`${formName}HasTranshipment[${index}][optionTerminal]`,[])
          props.setValue(`${formName}HasTranshipment[${index}][optionAgentCompany]`,[])
          props.setValue(`${formName}HasTranshipment[${index}][optionAgentBranchCode]`,[])
          formContext.update(formContext.fields)
          props.setValue(`${formName}HasTranshipment[${index}][LocationCode]`,"")
          props.setValue(`${formName}HasTranshipment[${index}][LocationName]`,"")
          props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyROC]`,"")
          props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyCode]`,"")
          props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeCode]`,"")
          props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeName]`,"")
           
        }
    }

    function FindPOTVoyage(index){
        console.log("here")
        var POTPortCode = [];

        if (index > 0) {
            var POL = props.getValues(`QuotationHasTranshipment[${index - 1}][QuickFormPortCode]`)
            var POD = props.getValues(`QuotationHasTranshipment[${index}][QuickFormPortCode]`);
        }else {
            var POL = $(`[name='${formName}[POLPortCode]']`).val();
            var POD = props.getValues(`QuotationHasTranshipment[${index}][QuickFormPortCode]`);
        }

        if($(".QuickFormVoyageNum").length >0){
            $(".QuickFormVoyageNum").each(function(){
                if($(this).val() != ""){
                    POTPortCode.push($(this).val())
                }
            })
        }

        var startdate, enddate;
        if(props.getValues(`${formName}[QuotationType]`) == "Advance Booking"){
            startdate= $(`input[name='${formName}[AdvanceBookingStartDate]']`).val();
            enddate= $(`input[name='${formName}[AdvanceBookingLastValidDate]']`).val();
        }else{
            startdate=$(`input[name='${formName}[DocDate]']`).val();
            enddate=$(`input[name='${formName}[LastValidDate]']`).val();
        }

        if (POL != "" && POD != ""){
            var filter= {
                POL: POL,
                POD: POD,
                DocDate: $(".docDate").val(),
                LastValidDate: $(".lastValidDate").val(),
                POTVoyageUUIDs: POTPortCode,
                PrevVoyage: props.getValues(`${formName}HasTranshipment[${index}][QuickFormPOTVoyage]`),
            }

            FindVoyagesWithPolPod(filter,globalContext).then(data => {
                var VoyageArray = []
                try {
                        $.each(data, function (key, value) {
                        VoyageArray.push({value:value.VoyageUUID, label:value.VoyageFullName})
                        });
                }
                catch (err) {
        
                }

                props.setValue(`${formName}HasTranshipment[${index}][optionFromVoyage]`,VoyageArray)
                formContext.update(formContext.fields)
        
                if(data == null){
                    if(formName!=="ContainerReleaseOrder"){
                        alert("Please add transshipment")
                    }
                }
            })
        }
        else{
            props.setValue(`${formName}HasTranshipment[${index}][optionFromVoyage]`,[])
            formContext.update(formContext.fields)
        }
    }
    
    function FindVoyageFromTranshipmentDetails(currentSelector,id,index) {
        if(currentSelector){
            props.setValue(`${formName}HasTranshipment[${index}][QuickFormPOTVoyage]`,currentSelector.value)
            var value = currentSelector?currentSelector.value:""
            var regExp = /\(([^)]+)\)/;
            var str = id
            var res = str.split("-");
            var common = res[0] + "-" + res[1];
            var text = currentSelector?currentSelector.label:""
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
            console.log(result)
            if (result != "") {
                getVoyageByIdSpecial(result,globalContext).then(data => {
                    $("#" + common + "-fromvesselname").val(data[0].vessel.VesselName);
                })
            }

            $("#" + common + "-fromvesselcode").val(vesselCode);
            $("#" + common + "-fromvoyagename").val(StrvoyageNo);
            props.setValue(`${formName}HasTranshipment[${index}][QuickFormPOTVesselCode]`,vesselCode)
        }
        else{
            $("#" + common + "-fromvesselcode").val("");
            $("#" + common + "-fromvoyagename").val("");
            props.setValue(`${formName}HasTranshipment[${index}][QuickFormPOTVesselCode]`,"")
        }
    }

  return (
    <>
        {formContext.fields.map((item, index) => {
            return(
                <div key={item.id} className="TranshipmentCard">
                    <div className="TranshipmentCardRow">
                        <div className="transhipment-items ui-sortable">
                            <div className="transhipment-item">
                                <div className="card lvl2">
                                    <div className="card-header">
                                        <h3 className="card-title">Transhipment
                                            - <span className="PortCode"></span></h3>
                                        <div className="card-tools">
                                            <button type="button" className="remove-transhipment btn btn-danger btn-xs" onClick={()=> formContext.FieldArrayHandle("remove",index)}><span className="fa fa-times"></span></button>
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body transhipment-body">
                                        <input type="hidden" id="" {...props.register(`${formName}HasTranshipment[${index}][${formName}HasTranshipmentUUID]`)} className={`${formName}HasTranshipmentUUID`} />
                                        <input type ="hidden" className ={`${formNameLowerCase}fromvoyagepot"`} id={`${formNameLowerCase}-transhipment-fromvoyagepot`} {...props.register(`${formName}HasTranshipment[${index}][FromVoyagePOT]`)} />
                                        <input type ="hidden" className ={`${formNameLowerCase}tovoyagepot"`} id={`${formNameLowerCase}-transhipment-tovoyagepot`} {...props.register(`${formName}HasTranshipment[${index}][ToVoyagePOT]`)} />
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-seqnum`}>Sequence No.</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-seqnum`} className="form-control POTSeqNum" name="SeqNum" readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className={"col-md-6"}>
                                                <div className="form-group">
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-portcode`}>Port Code</label>
                                                    <Controller
                                                        name={`${formName}HasTranshipment[${index}][PortCode]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-portcode`}
                                                        control={props.control}
                                                        defaultValue={item.portCode}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                {...props.register(`${formName}HasTranshipment[${index}][PortCode]`)}
                                                                isClearable={true}
                                                                id={`${formNameLowerCase}hastranshipment-${index}-portcode`}
                                                                value={
                                                                    value
                                                                    ? props.port.find((c) => c.value === value)
                                                                    : null
                                                                }
                                                                onChange={(val) =>{
                                                                    val == null ? onChange(null) : onChange(val.value);
                                                                    onChangePOTPortCode(val,`${formNameLowerCase}hastranshipment-${index}-portcode`,index)
                                                                }}
                                                                options={props.port?props.port:""}
                                                                className={`form-control PortCodeDetailForm TranshipmentPortCode getPOTTerminalPortCode liveData Live_Area`}
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
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-area`}>Area</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-area`} className="form-control TranshipmentArea AreaName" {...props.register(`${formName}HasTranshipment[${index}][Area]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-potportterm`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-potportterm`}>Port Term</label>
                                                    <Controller
                                                        name={`${formName}HasTranshipment[${index}][POTPortTerm]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-potportterm`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                {...props.register(`${formName}HasTranshipment[${index}][POTPortTerm]`)}
                                                                isClearable={true}
                                                                id={`${formNameLowerCase}hastranshipment-${index}-potportterm`}
                                                                value={
                                                                    value
                                                                    ? formContext.portTerm.find((c) => c.value === value)
                                                                    : null
                                                                }
                                                                onChange={(val) =>{
                                                                    val == null ? onChange(null) : onChange(val.value);
                                                                }}
                                                                options={formContext.portTerm?formContext.portTerm:""}
                                                                className={`form-control POTPortTermDetailForm liveData Live_PortTerm`}
                                                                classNamePrefix="select"
                                                                menuPortalTarget={document.body}
                                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-locationcode`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-locationcode`}>Terminal Code</label>
                                                    <Controller
                                                        name={`${formName}HasTranshipment[${index}][LocationCode]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-locationcode`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                {...props.register(`${formName}HasTranshipment[${index}][LocationCode]`)}
                                                                isClearable={true}
                                                                id={`${formNameLowerCase}hastranshipment-${index}-locationcode`}
                                                                value={
                                                                    value
                                                                    ? item.optionTerminal?item.optionTerminal.find((c) => c.value === value)
                                                                    : null
                                                                    : null
                                                                }
                                                                onChange={(val) =>{
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
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-locationname`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-locationname`}>Terminal Name</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-locationname`} className="form-control POTLocationName" {...props.register(`${formName}HasTranshipment[${index}][LocationName]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-pothandlingcompanyroc`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-pothandlingcompanyroc`}>POT Agent ROC </label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-pothandlingcompanyroc`} className="form-control POTHandlingCompanyROC" {...props.register(`${formName}HasTranshipment[${index}][POTHandlingCompanyROC]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-pothandlingcompanycode`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-pothandlingcompanycode`}>POT Agent Company </label>
                                                    <Controller
                                                        name={`${formName}HasTranshipment[${index}][POTHandlingCompanyCode]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-pothandlingcompanycode`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                {...props.register(`${formName}HasTranshipment[${index}][POTHandlingCompanyCode]`)}
                                                                isClearable={true}
                                                                id={`${formNameLowerCase}hastranshipment-${index}-pothandlingcompanycode`}
                                                                value={
                                                                    value
                                                                    ? item.optionAgentCompany?item.optionAgentCompany.find((c) => c.value === value)
                                                                    : null
                                                                    : null
                                                                }
                                                                onChange={(val) =>{
                                                                    val == null ? onChange(null) : onChange(val.value);
                                                                }}
                                                                options={item.optionAgentCompany}
                                                                className={`form-control POTHandlingCompanyCode`}
                                                                classNamePrefix="select"
                                                                menuPortalTarget={document.body}
                                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-pothandlingofficecode`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-pothandlingofficecode`}>POT Agent Branch Code</label>
                                                    <Controller
                                                        name={`${formName}HasTranshipment[${index}][POTHandlingOfficeCode]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-pothandlingofficecode`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                {...props.register(`${formName}HasTranshipment[${index}][POTHandlingOfficeCode]`)}
                                                                isClearable={true}
                                                                id={`${formNameLowerCase}hastranshipment-${index}-pothandlingofficecode`}
                                                                value={
                                                                    value
                                                                    ? item.optionAgentBranchCode?item.optionAgentBranchCode.find((c) => c.value === value)
                                                                    : null
                                                                    : null
                                                                }
                                                                onChange={(val) =>{
                                                                    val == null ? onChange(null) : onChange(val.value);
                                                                }}
                                                                options={item.optionAgentBranchCode}
                                                                className={`form-control POTHandlingOfficeCode`}
                                                                classNamePrefix="select"
                                                                menuPortalTarget={document.body}
                                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                            />
                                                        )}
                                                    />

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-pothandlingofficename`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-pothandlingofficename`}>POT Agent Branch Name</label>
                                                    <input type="text" id="" className="form-control POTHandlingOfficeName" {...props.register(`${formName}HasTranshipment[${index}][POTHandlingOfficeName]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-dischargingdate`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-dischargingdate`}>Discharging Date</label>
                                                    <Controller 
                                                        name={`${formName}HasTranshipment[${index}][DischargingDate]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-loadingdate`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <>  
                                                                <Flatpickr
                                                                    {...props.register(`${formName}HasTranshipment[${index}][DischargingDate]`)}
                                                                    style={{backgroundColor: "white"}}
                                                                    value={(value)}
                                                                    onChange={val => {
                                                                        val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),"dischargingDate");
                                                                        val == null ? formContext.setStateHandle(null,"dischargingDate"): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY H:mm"),"dischargingDate")
                                                                    }}
                                                                    className={`form-control flatDateTimePicker flatpickr-input-time POTDischargingDate pointerEventsStyle`}
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
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-fromvoyagenum`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-fromvoyagenum`}>From Voyage No.</label>
                                                    <Controller
                                                        name={`${formName}HasTranshipment[${index}][FromVoyageNum]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-fromvoyagenum`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                {...props.register(`${formName}HasTranshipment[${index}][FromVoyageNum]`)}
                                                                isClearable={true}
                                                                id={`${formNameLowerCase}hastranshipment-${index}-fromvoyagenum`}
                                                                value={
                                                                    value
                                                                    ? item.optionFromVoyage?item.optionFromVoyage.find((c) => c.value === value)
                                                                    : null
                                                                    : null
                                                                }
                                                                onChange={(val) =>{
                                                                    val == null ? onChange(null) : onChange(val.value);
                                                                    FindVoyageFromTranshipmentDetails(val,`${formNameLowerCase}hastranshipment-${index}-fromvoyagenum`,index)
                                                                }}
                                                                options={item.optionFromVoyage}
                                                                className={`form-control FromVoyageNumDetailForm FromVoyageSchedule`}
                                                                classNamePrefix="select"
                                                                menuPortalTarget={document.body}
                                                                onMenuOpen={() => { FindPOTVoyage(index) }}
                                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-fromvesselcode`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-fromvesselcode`}>From Vessel Code</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-fromvesselcode`} className="form-control FromVesselCode" {...props.register(`${formName}HasTranshipment[${index}][FromVesselCode]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-fromvoyagename`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-fromvoyagename`}>From Voyage Name</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-fromvoyagename`} className="form-control fromVoyageNameSchedule" {...props.register(`${formName}HasTranshipment[${index}][FromVoyageName]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-fromvesselname`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-fromvesselname`}>From Vessel Name</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-fromvesselname`} className="form-control fromVesselNameSchedule" {...props.register(`${formName}HasTranshipment[${index}][FromVesselName]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-loadingdate`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-loadingdate`}>Loading
                                                        Date</label>
                                                    <Controller 
                                                        name={`${formName}HasTranshipment[${index}][LoadingDate]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-loadingdate`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <>  
                                                                <Flatpickr
                                                                    {...props.register(`${formName}HasTranshipment[${index}][LoadingDate]`)}
                                                                    style={{backgroundColor: "white"}}
                                                                    value={(value)}
                                                                    onChange={val => {
                                                                        val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),"loadingDate");
                                                                        val == null ? formContext.setStateHandle(null,"loadingDate"): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY H:mm"),"loadingDate")
                                                                    }}
                                                                    className={`form-control flatDateTimePicker flatpickr-input-time POTLoadingDate pointerEventsStyle`}
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
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-tovoyagenum`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-tovoyagenum`}>To Voyage No.</label>
                                                    <Controller
                                                        name={`${formName}HasTranshipment[${index}][ToVoyageNum]`}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-tovoyagenum`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                {...props.register(`${formName}HasTranshipment[${index}][ToVoyageNum]`)}
                                                                isClearable={true}
                                                                id={`${formNameLowerCase}hastranshipment-${index}-tovoyagenum`}
                                                                value={
                                                                    value
                                                                    ? item.optionToVoyage?item.optionToVoyage.find((c) => c.value === value)
                                                                    : null
                                                                    : null
                                                                }
                                                                onChange={(val) =>{
                                                                    val == null ? onChange(null) : onChange(val.value);
                                                                }}
                                                                options={item.optionToVoyage}
                                                                className={`form-control toVoyageNumber ToVoyageSchedule`}
                                                                classNamePrefix="select"
                                                                menuPortalTarget={document.body}
                                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-tovesselcode`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-tovesselcode`}>To Vessel Code</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-tovesselcode`} className="form-control toVesselCode" {...props.register(`${formName}HasTranshipment[${index}][ToVesselCode]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-tovoyagename`}>
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-tovoyagename`}>To Voyage Name</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-tovoyagename`} className="form-control toVoyageNameSchedule" {...props.register(`${formName}HasTranshipment[${index}][ToVoyageName]`)} readOnly={true} maxLength="255" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-tovesselname`}>To Vessel Name</label>
                                                    <input type="text" id={`${formNameLowerCase}hastranshipment-${index}-tovesselname`} className="form-control toVesselNameSchedule" {...props.register(`${formName}HasTranshipment[${index}][ToVesselName]`)} readOnly={true} maxLength="255" />
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
        <button type="button" className="add-transhipment btn btn-success btn-xs mb-2" onClick={() => formContext.FieldArrayHandle("append")}><span className="fa fa-plus"></span> Add Transhipment</button>
    </>
  )
}

export default DetailFormTranshipment