import React, {useContext, useEffect} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext";
import {CheckBoxHandle,getAreaById,getVesselById,getPortDetails,getPortDetailsById, getVoyageByIdSpecial} from "../Helper";
import $ from "jquery";
import axios from "axios"

function DetailFormInstruction(props) {
    
    const globalContext = useContext(GlobalContext)
    const formContext = useContext(FormContext)
    var formName = props.InstructionItem.formName
    var formNameLowerCase = formName.toLowerCase()

    function FindBargeNameDetail(val){
        if(val){
            getVesselById(val.value,globalContext).then(res=>{
                if(res.data){
                    props.setValue(`${props.InstructionItem.formName}[BargeName]`,res.data.VesselName)
                    props.setValue(`DynamicModel[BargeName]`,res.data.VesselName)
                    props.setValue(`DynamicModel[BargeCode]`,val.value)
                }
            })
        }else{
            props.setValue(`${props.InstructionItem.formName}[BargeName]`,"")
            props.setValue(`DynamicModel[BargeName]`,"")
            props.setValue(`DynamicModel[BargeCode]`,"")
        }
    }



    function onChangePortCode (value,positionId){
        var closestArea = $("#"+positionId).closest(".row").find(".AreaName")

        if(value){
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
                if(positionId.includes("pol")){
                    props.setValue(`DynamicModel[POLPortCode]`,value.value)
                    props.setValue(`DynamicVoyageModel[POLPortCode]`,value.value)
                    formContext.setStateHandle(tempOptions,"OptionPOLTerminal")
                    formContext.setStateHandle(tempOptionsCompany,"OptionPOLAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch,"OptionPOLAgentCompanyBranch")
                    props.setValue(`${props.InstructionItem.formName}[POLLocationCode]`,DefaultValue)
                    props.setValue(`${props.InstructionItem.formName}[POLLocationName]`,DefaultPortName)
                    props.setValue(`${props.InstructionItem.formName}[POLAgentROC]`,DefaultAgentCompanyROC)
                    props.setValue(`${props.InstructionItem.formName}[POLAgentName]`,DefaultAgentCompany)
                    props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeCode]`,DefaultAgentCompanyBranch)
                    props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeName]`,DefaultAgentCompanyBranchName)
                }else{
                    props.setValue(`DynamicModel[PODPortCode]`,value.value)
                    props.setValue(`DynamicVoyageModel[PODPortCode]`,value.value)
                    formContext.setStateHandle(tempOptions,"OptionPODTerminal")
                    formContext.setStateHandle(tempOptionsCompany,"OptionPODAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch,"OptionPODAgentCompanyBranch")
                    props.setValue(`${props.InstructionItem.formName}[PODLocationCode]`,DefaultValue)
                    props.setValue(`${props.InstructionItem.formName}[PODLocationName]`,DefaultPortName)
                    props.setValue(`${props.InstructionItem.formName}[PODAgentROC]`,DefaultAgentCompanyROC)
                    props.setValue(`${props.InstructionItem.formName}[PODAgentName]`,DefaultAgentCompany)
                    props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeCode]`,DefaultAgentCompanyBranch)
                    props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeName]`,DefaultAgentCompanyBranchName)
                }
            });
    
            
        }else{
            if(positionId.includes("pol")){
                $(closestArea).val("");
                props.setValue(`DynamicModel[POLPortCode]`,"")
                props.setValue(`DynamicVoyageModel[POLPortCode]`,"")
                formContext.setStateHandle([],"OptionPOLTerminal")
                formContext.setStateHandle([],"OptionPOLAgentCompany")
                formContext.setStateHandle([],"OptionPOLAgentCompanyBranch")
                props.setValue(`${props.InstructionItem.formName}[POLLocationCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLLocationName]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLAgentROC]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLAgentName]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeName]`,"")
            }else{
                $(closestArea).val("");
                props.setValue(`DynamicModel[PODPortCode]`,"")
                props.setValue(`DynamicVoyageModel[PODPortCode]`,"")
                formContext.setStateHandle([],"OptionPODTerminal")
                formContext.setStateHandle([],"OptionPODAgentCompany")
                formContext.setStateHandle([],"OptionPODAgentCompanyBranch")
                props.setValue(`${props.InstructionItem.formName}[PODLocationCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODLocationName]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODAgentROC]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODAgentName]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeName]`,"")
            }
        }
    }

    function FindVoyageNumberDetail(currentSelector) {
        var regExp = /\(([^)]+)\)/;

        if ($(".transhipment-item").length < 1) {
            var value = currentSelector ? currentSelector.value : ""
            var result;
            var insideBracketVessel;
            var vesselCode;
            var text = currentSelector ? currentSelector.label : ""
            var matches = regExp.exec(text);

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
            var lastCharVoyageNo = value.substr(value.length - 1); // get voyage no last character eg. A, B or W
            var getPolPortcode = props.getValues(`${formName}[POLPortCode]`)
            var getPodPortcode = props.getValues(`${formName}[PODPortCode]`)

            if(!getPolPortcode){
                getPolPortcode = $(`input[name='DynamicModel[POLPortCode]']`).val()
            }
            if(!getPodPortcode){
                getPodPortcode = $(`input[name='DynamicModel[PODPortCode]']`).val()
            }

            var repeatedVoyage = 0;

            if (lastCharVoyageNo == "A") {
                repeatedVoyage = 1
            } else if (lastCharVoyageNo == "B") {
                repeatedVoyage = 2
            } else if (lastCharVoyageNo == "W") {
                repeatedVoyage = 1
            }
            // $("input[data-target=\'VoyageName-Voyage\']").val(StrvoyageNo);

            getVoyageByIdSpecial(result, globalContext).then(data => {
                var foundPOL = false;
                var foundPOD = false;

                if (value !== "") {
                    $.each(data, function (key, value) {
                        if (value.VoyageNumber == StrvoyageNo) {
                            var countPOL = 0;
                            var countPOD = 0;
                            var countLocation = 0;
                            $.each(value.voyageSchedules, function (key2, value2) {
                                if (getPolPortcode == value2.PortCode) {
                                    if (countPOL == repeatedVoyage) {
                                        props.setValue(`${formName}[ClosingDateTime]`,value2.ClosingDateTime)
                                        props.setValue(`${formName}[POLSCNCode]`,value2.SCNCode)
                                        props.setValue(`${formName}[POLETA]`,value2.ETA)
                                        props.setValue(`${formName}[POLETD]`,value2.ETD)
                                        props.setValue(`${formName}[POLLocationCode]`,value2.LocationCode)
                                        props.setValue(`${formName}[VoyagePOL]`,value2.VoyageScheduleUUID)
                                        onChangeTerminalCode({value:value2.LocationCode},`${formNameLowerCase}-pollocationcode`)
                                        foundPOL = true;
                                    }
                                    countPOL++;

                                }

                                if (getPodPortcode == value2.PortCode && foundPOL && foundPOD == false) {
                                        props.setValue(`${formName}[PODSCNCode]`,value2.SCNCode)
                                        props.setValue(`${formName}[PODETA]`,value2.ETA)
                                        props.setValue(`${formName}[PODETD]`,value2.ETD)
                                        props.setValue(`${formName}[VoyagePOD]`,value2.VoyageScheduleUUID)

                                        onChangeTerminalCode({value:value2.LocationCode},`${formNameLowerCase}-podlocationcode`)

                                    countPOD++;
                                    foundPOD = true;
                                }

                                countLocation++;
                            })
                            $("input[data-target=\'VesselName-Voyage\']").val(value.vessel.VesselName);
                            $("input[data-target=\'VesselCode-Voyage\']").val(value.vessel.VesselCode);
                        }
                    })
                } else {
                    $("input[data-target=\'VesselCode-Voyage\']").val("");
                    $("input[data-target=\'VesselName-Voyage\']").val("");
                    $("input[data-target=\'VoyageName-Voyage\']").val("");
                    $("input[data-target=\'POLSCNCode-Voyage\']").val("");
                    $("input[data-target=\'PODSCNCode-Voyage\']").val("");
                    $("input[data-target=\'poleta\']").val("");
                    $("input[data-target=\'poletd\']").val("");
                    $("input[data-target=\'podeta\']").val("");
                    $("input[data-target=\'podetd\']").val("");
                    $("input[data-target=\'closingDateTime\']").val("");
                }


                if (foundPOL == false) {
                    $("input[data-target=\'POLSCNCode-Voyage\']").val("");
                    $("input[data-target=\'poleta\']").val("");
                    $("input[data-target=\'poletd\']").val("");
                    $("input[data-target=\'closingDateTime\']").val("");
                }
                if (foundPOD == false) {

                    // alert("POD Port Code Not Available for Selected Voyage")
                    $("input[data-target=\'PODSCNCode-Voyage\']").val("");
                    $("input[data-target=\'podeta\']").val("");
                    $("input[data-target=\'podetd\']").val("");
                }

                if ($("#dynamicmodel-voyagenum").val() != "") {
                    $("#dynamicmodel-voyagenum").parent().find(".select2-container--default").removeClass('InvalidField')
                    $("#dynamicmodel-voyagenum").parent().parent().find('.help-block').text("")
                }

            })

        }
    }

    function onChangeTerminalCode (value, positionId){
        var DefaultValue;
        var DefaultPortName;
        var DefaultAgentCompanyROC;
        var DefaultAgentCompany;
        var DefaultAgentCompanyBranch;
        var DefaultAgentCompanyBranchName;
        
        if (value) {
            getPortDetailsById(value.value,globalContext).then(data => {
                var tempOptionsCompany = []
                var tempOptionsCompanyBranch = []
                var temarray=[]
                temarray.push(data.data)
                $.each(temarray, function (key, value1) {

                    if(value1.VerificationStatus=="Approved"){
                        DefaultValue = value1.PortDetailsUUID;
                        DefaultPortName = value1.PortName;
                        DefaultAgentCompanyROC = value1.handlingCompany.ROC
                        DefaultAgentCompany = value1.HandlingCompany
                        DefaultAgentCompanyBranch = value1.HandlingCompanyBranch
                        DefaultAgentCompanyBranchName = value1.handlingCompanyBranch.BranchName
                        tempOptionsCompany.push({ value: value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName })
                        tempOptionsCompanyBranch.push({ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode})
                    
                    } 
                })
                

                // set Option Terminal
                if(positionId.includes("pol")){
                    formContext.setStateHandle(tempOptionsCompany,"OptionPOLAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch,"OptionPOLAgentCompanyBranch")
                    props.setValue(`${props.InstructionItem.formName}[POLLocationName]`,DefaultPortName)
                    props.setValue(`${props.InstructionItem.formName}[POLAgentROC]`,DefaultAgentCompanyROC)
                    props.setValue(`${props.InstructionItem.formName}[POLAgentName]`,DefaultAgentCompany)
                    props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeCode]`,DefaultAgentCompanyBranch)
                    props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeName]`,DefaultAgentCompanyBranchName)
                }else{
                    formContext.setStateHandle(tempOptionsCompany,"OptionPODAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch,"OptionPODAgentCompanyBranch")
                    props.setValue(`${props.InstructionItem.formName}[PODLocationName]`,DefaultPortName)
                    props.setValue(`${props.InstructionItem.formName}[PODAgentROC]`,DefaultAgentCompanyROC)
                    props.setValue(`${props.InstructionItem.formName}[PODAgentName]`,DefaultAgentCompany)
                    props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeCode]`,DefaultAgentCompanyBranch)
                    props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeName]`,DefaultAgentCompanyBranchName)
                }
            
            })
        } else {
            if(positionId.includes("pol")){
                formContext.setStateHandle([],"OptionPOLAgentCompany")
                formContext.setStateHandle([],"OptionPOLAgentCompanyBranch")
                props.setValue(`${props.InstructionItem.formName}[POLLocationCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLLocationName]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLAgentROC]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLAgentName]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[POLHandlingOfficeName]`,"")
            }else{
                formContext.setStateHandle([],"OptionPODAgentCompany")
                formContext.setStateHandle([],"OptionPODAgentCompanyBranch")
                props.setValue(`${props.InstructionItem.formName}[PODLocationCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODLocationName]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODAgentROC]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODAgentName]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeCode]`,"")
                props.setValue(`${props.InstructionItem.formName}[PODHandlingOfficeName]`,"")
            }
        }
    }

    function onChangeFinalDestinationPortCode(value,positionId){
        var closestArea = $("#"+positionId).closest(".row").find(".AreaName")
        if(value){
            var id = value.value
            
            getAreaById(id,globalContext).then(data => {
                $(closestArea).val(data["Area"]);
            });
        }
    }

    function VoyageNumOnChangeHandle(data) {
        var index = $("#dynamicmodel-voyagenum").parent().parent().parent().parent().find(".transhipmentQuickForm").children().last().index();
        if (data) {
            if ($(".transhipment-item").length < 1) {
                props.setValue(`${formName}[VoyageNum]`, data.value)
            }

            var regExp = /\(([^)]+)\)/;
            var value = data.value
            var result;
            var vesselCode;
            var ToVesselName;
            var insideBracketVessel;
            if (value.includes("@", 1)) {
                result = value.slice(0, -2);
            } else {
                result = value
            }

            // var ToVoyageNum = $("#dynamicmodel-voyagenum").val();
            $(`#${formNameLowerCase}hastranshipment-` + index + "-tovoyagenum").val(value).trigger('change.select2')

            var text = data.label
            var matches = regExp.exec(text);

            if (value != "") {

                // var getStartingvesselName;
                $.each(matches, function (key, value) {
                    if (key == 0) {
                        insideBracketVessel = value;
                    } else if (key == 1) {
                        vesselCode = value;
                    }
                })

                var voyageNo = text.replace(insideBracketVessel, '');
                var StrvoyageNo = voyageNo.replace(/\s/g, '');
                var lastCharVoyageNo = value.substr(value.length - 1); // get voyage no last character eg. A, B or W
                var repeatedVoyage = 0;

                if (lastCharVoyageNo == "A") {
                    repeatedVoyage = 1
                } else if (lastCharVoyageNo == "B") {
                    repeatedVoyage = 2
                } else if (lastCharVoyageNo == "W") {
                    repeatedVoyage = 1
                }

                var starting;
                var startingIndex;
                var startingVesselName;
                if (index <= 0) {
                    starting = props.getValues("DynamicModel[POLPortCode]")
                    // startingIndex = index - 1
                    startingVesselName = $(`#${formNameLowerCase}hastranshipment-0-fromvesselname`).val()
                } else {
                    starting = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val();
                    startingIndex = index - 1
                    startingVesselName = $(`#${formNameLowerCase}hastranshipment-` + startingIndex + "-tovesselname").val()
                }
                var PodPortcode = props.getValues("DynamicModel[PODPortCode]")
                var PotPortcode = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val();
                // var ChooiceArray = [];

                getVoyageByIdSpecial(result, globalContext).then(data => {
                    var VoyageArray = []
                    try {
                        $.each(data, function (key, value) {
                            VoyageArray.push({ value: value.VoyageUUID, label: value.VoyageNumber + "(" + value.vessel.VesselCode + ")" })
                        });
                    }
                    catch (err) {
                    }
                    props.setValue(`${formName}HasTranshipment[${index}][optionToVoyage]`, VoyageArray)
                    formContext.update(formContext.fields)
                    props.setValue(`${formName}HasTranshipment[${index}][ToVoyageNum]`, data[0]["VoyageUUID"])
                    $(`#${formNameLowerCase}hastranshipment-` + index + "-tovoyagename").val(data[0]["VoyageNumber"])
                    $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselcode").val(data[0]["vessel"]["VesselCode"])
                    $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselname").val(data[0]["vessel"]["VesselName"])
                    if ($(".transhipment-item").length < 1) {
                        props.setValue(`${formName}[VoyageName]`, data[0]["VoyageNumber"])
                        $("#dynamicmodel-vesselcode").val(data[0]["vessel"]["VesselCode"])
                    }
                    ToVesselName = data[0]["vessel"]["VesselName"];
                    var countPOL = 0;
                    var countPOD = 0;
                    var countPOT = 0;
                    var foundPOL = false;
                    var foundPOD = false;
                    $.each(data[0]["voyageSchedules"], function (key, value) {
                        if (starting == value.PortCode) {

                            if (countPOL == repeatedVoyage) {
                                foundPOL = true;

                            }
                            countPOL++;

                        }

                        if (value.PortCode == PotPortcode) {

                            if (countPOT == repeatedVoyage) {
                                //var ETA = (value.ETA).split(" ");
                                props.setValue(`${formName}HasTranshipment[${index}][LoadingDate]`, value.ETA)
                                //   $(`#${formNameLowerCase}hastranshipment-` + index + "-loadingdate").val(value.ETA).trigger('change.select2')
                                props.setValue(`${formName}HasTranshipment[${index}][ToVoyagePOT]`, value.VoyageScheduleUUID)
                                //   $(`#${formNameLowerCase}hastranshipment-` + index + "-tovoyagepot").val(value.VoyageScheduleUUID);
                            }

                            countPOT++;

                        }

                        if (value.PortCode == PodPortcode && foundPOL && foundPOD == false) {
                            props.setValue(`${formName}[PODETA]`, value.ETA)
                            props.setValue(`${formName}[PODETD]`, value.ETD)
                            props.setValue(`${formName}[PODSCNCode]`, value.SCNCode)
                            $(`#${formNameLowerCase}-voyage-pod`).val(value.VoyageScheduleUUID)

                            if (!value.LocationCode) {
                                props.setValue(`${formName}[PODLocationCode]`, value.LocationCode)
                                props.setValue(`${formName}[PODLocationName]`, "")
                                props.setValue(`${formName}[PODAgentROC]`, "")
                                props.setValue(`${formName}[PODAgentName]`, "")
                                props.setValue(`${formName}[PODHandlingOfficeCode]`, "")
                                props.setValue(`${formName}[PODHandlingOfficeName]`, "")
                            } else {
                                props.setValue(`${formName}[PODLocationCode]`, value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {

                                    if (value1.PortDetailsUUID == value.LocationCode) {
                                        var optionCompany = [{ value: value1.handlingCompany.CompanyUUID, label: value1.handlingCompany.CompanyName }]
                                        var optionCompanyBranch = [{ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode }]
                                        formContext.setStateHandle(optionCompany, "OptionPODAgentCompany")
                                        formContext.setStateHandle(optionCompanyBranch, "OptionPODAgentCompanyBranch")
                                        props.setValue(`${formName}[PODLocationName]`, value1.LocationCode)
                                        props.setValue(`${formName}[PODAgentROC]`, value1.handlingCompany.AgentCode)
                                        props.setValue(`${formName}[PODAgentName]`, value1.handlingCompany.CompanyUUID)
                                        props.setValue(`${formName}[PODHandlingOfficeCode]`, value1.handlingCompanyBranch.CompanyBranchUUID)
                                        props.setValue(`${formName}[PODHandlingOfficeName]`, value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }

                            // }

                            foundPOD = true;
                            countPOD++;
                        }

                        if (value.PortCode == PodPortcode && index == 0) {
                            props.setValue(`${formName}[PODETA]`, value.ETA)
                            props.setValue(`${formName}[PODETD]`, value.ETD)
                            props.setValue(`${formName}[PODSCNCode]`, value.SCNCode)
                            $(`#${formNameLowerCase}-voyage-pod`).val(value.VoyageScheduleUUID)

                            if (!value.LocationCode) {
                                props.setValue(`${formName}[PODLocationCode]`, value.LocationCode)
                                props.setValue(`${formName}[PODLocationName]`, "")
                                props.setValue(`${formName}[PODAgentROC]`, "")
                                props.setValue(`${formName}[PODAgentName]`, "")
                                props.setValue(`${formName}[PODHandlingOfficeCode]`, "")
                                props.setValue(`${formName}[PODHandlingOfficeName]`, "")
                            } else {
                                props.setValue(`${formName}[PODLocationCode]`, value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {

                                    if (value1.PortDetailsUUID == value.LocationCode) {
                                        var optionCompany = [{ value: value1.handlingCompany.CompanyUUID, label: value1.handlingCompany.CompanyName }]
                                        var optionCompanyBranch = [{ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode }]
                                        formContext.setStateHandle(optionCompany, "OptionPODAgentCompany")
                                        formContext.setStateHandle(optionCompanyBranch, "OptionPODAgentCompanyBranch")
                                        props.setValue(`${formName}[PODLocationName]`, value1.LocationCode)
                                        props.setValue(`${formName}[PODAgentROC]`, value1.handlingCompany.AgentCode)
                                        props.setValue(`${formName}[PODAgentName]`, value1.handlingCompany.CompanyUUID)
                                        props.setValue(`${formName}[PODHandlingOfficeCode]`, value1.handlingCompanyBranch.CompanyBranchUUID)
                                        props.setValue(`${formName}[PODHandlingOfficeName]`, value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }
                            foundPOD = true;
                        }

                    });

                    if (ToVesselName == startingVesselName) {
                        props.setValue(`${formName}HasTranshipment[${index}][LoadingDate]`, "")
                        props.setValue(`${formName}HasTranshipment[${index}][DischargingDate]`, "")
                    }

                })
                
            } else {
                props.setValue(`${formName}HasTranshipment[${index}][optionToVoyage]`, [])
                formContext.update(formContext.fields)
                props.setValue(`${formName}HasTranshipment[${index}][ToVoyageNum]`, "")
                $(`#${formNameLowerCase}hastranshipment-` + index + "-tovoyagename").val("")
                $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselcode").val("")
                $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselname").val("")
                $("#dynamicmodel-vesselcode").val("")
                props.setValue(`${formName}HasTranshipment[${index}][LoadingDate]`, "")
                if (index == 0) {
                    props.setValue(`${formName}[PODETA]`, "")
                    props.setValue(`${formName}[PODETD]`, "")
                    props.setValue(`${formName}[PODSCNCode]`, "")
                }
            }
        } else {
            $(`#${formNameLowerCase}-voyage-pod`).val("")
            props.setValue(`${formName}[VoyageNum]`, "")
            props.setValue(`${formName}HasTranshipment[${index}][ToVoyageNum]`, "")
            $(`#${formNameLowerCase}hastranshipment-` + index + "-tovoyagename").val("")
            $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselcode").val("")
            $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselname").val("")
            $("#dynamicmodel-vesselcode").val("")
        }
    }

    useEffect(() => {
        setTimeout(() => {
            props.setValue(`${props.InstructionItem.formName}[POLPortTerm]`,formContext.defaultPortTerm)
            props.setValue(`${props.InstructionItem.formName}[PODPortTerm]`,formContext.defaultPortTerm)
            props.setValue(`${props.InstructionItem.formName}[FinalDestinationPortTerm]`,formContext.defaultPortTerm)
        }, 500);
    }, [formContext.portTerm])

    useEffect(()=> {
        if(props.instructionData){
            if(props.instructionData.VoyageNum) {
                // VoyageNumOnChangeHandle({value:props.instructionData.VoyageNum,label:props.instructionData.VoyageName})
                // FindVoyageNumberDetail({value:props.instructionData.VoyageNum,label:props.instructionData.VoyageName})
            }
        }
    },[props.instructionData])
    
  return (
    <>
        {props.InstructionItem.instructionList.map((res, index) => {
                const formName = props.InstructionItem.formName;
                const instructionType = res;
                const lowercaseFormName = props.InstructionItem.formName.toLowerCase();
                const lowercaseInstructionType = res.toLowerCase();
                const SpaceFormName = res.replace(/([A-Z])/g, ' $1').trim();
                var POLElement=[
                    {type:"hidden", id:`${lowercaseFormName}-voyage-pol`, name:`${formName}[VoyagePOL]`},
                    {title:"Port Code", id:`${lowercaseFormName}-${lowercaseInstructionType}portcode`, className:`reflect-field getTerminalPortCode`, name:`${formName}[${instructionType}PortCode]`, dataTarget:`${instructionType}PortCode-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.port, onChange:onChangePortCode, specialFeature:[]},
                    {title:"Area", id:`${lowercaseFormName}-${lowercaseInstructionType}areaname`, className:`reflect-field AreaName OriReadOnlyClass`, name:`${formName}[${instructionType}AreaName]`, dataTarget:`${instructionType}AreaName-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Terminal Code", id:`${lowercaseFormName}-${lowercaseInstructionType}locationcode`, className:`reflect-field`, name:`${formName}[${instructionType}LocationCode]`, dataTarget:`${instructionType}LocationCode-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.optionPOLTerminal, onChange:onChangeTerminalCode, specialFeature:[]},
                    {title:"Terminal Name", id:`${lowercaseFormName}-${lowercaseInstructionType}locationname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[${instructionType}LocationName]`, dataTarget:`${instructionType}LocationName-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Port Term", id:`${lowercaseFormName}-${lowercaseInstructionType}portterm`, className:`reflect-field`, name:`${formName}[${instructionType}PortTerm]`, dataTarget:`${instructionType}PortTerm-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.portTerm, defaultValue:formContext.defaultPortTerm, onChange:"", specialFeature:[]},
                    {title:"Freight Term", id:`${lowercaseFormName}-${lowercaseInstructionType}freightterm`, className:`reflect-field`, name:`${formName}[${instructionType}FreightTerm]`, dataTarget:`${instructionType}FreightTerm-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.freightTerm, onChange:"", specialFeature:[]},
                    {title:"Terminal Handler ROC", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingroc`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[${instructionType}AgentROC]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Terminal Handler Company", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingcompany`, className:`reflect-field`, name:`${formName}[${instructionType}AgentName]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.optionPOLAgentCompany, onChange:`onChange${instructionType}HandlingCompany`, specialFeature:[]},
                    {title:"Terminal Handler Branch Code", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingofficecode`, className:`reflect-field`, name:`${formName}[${instructionType}HandlingOfficeCode]`, dataTarget:`${instructionType}HandlingOffice-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.optionPOLAgentCompanyBranch, maxlength:"255", onChange:`onChange${instructionType}HandlingOfficeCode`, specialFeature:[]},
                    {title:"Terminal Handler Branch Name", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingofficename`, className:`reflect-field`, name:`${formName}[${instructionType}HandlingOfficeName]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Req ETA", id:`${lowercaseFormName}-${lowercaseInstructionType}reqeta`, className:`reflect-field flatpickr-input-time flatpickr-input OriReadOnlyClass ${props.InstructionItem.formName=="BillOfLading" || props.InstructionItem.formName=="BillOfLadingBarge"?"pointerEventsStyle":""}`, name:`${formName}[${instructionType}ReqETA]`, dataTarget:`${lowercaseInstructionType}reqeta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", maxlength:"255", value:formContext.pOLReqETA, onChange:"", specialFeature:["readOnly"]},
                ];
                var PODElement=[
                    {type:"hidden", id:`${lowercaseFormName}-voyage-pod`, name:`${formName}[VoyagePOD]`},
                    {title:"Port Code", id:`${lowercaseFormName}-${lowercaseInstructionType}portcode`, className:`reflect-field getTerminalPortCode`, name:`${formName}[${instructionType}PortCode]`, dataTarget:`${instructionType}PortCode-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.port, onChange:onChangePortCode, specialFeature:[]},
                    {title:"Area", id:`${lowercaseFormName}-${lowercaseInstructionType}areaname`, className:`reflect-field AreaName OriReadOnlyClass`, name:`${formName}[${instructionType}AreaName]`, dataTarget:`${instructionType}AreaName-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Terminal Code", id:`${lowercaseFormName}-${lowercaseInstructionType}locationcode`, className:`reflect-field`, name:`${formName}[${instructionType}LocationCode]`, dataTarget:`${instructionType}LocationCode-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown",option:formContext.optionPODTerminal, onChange:onChangeTerminalCode, specialFeature:[]},
                    {title:"Terminal Name", id:`${lowercaseFormName}-${lowercaseInstructionType}locationname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[${instructionType}LocationName]`, dataTarget:`${instructionType}LocationName-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Port Term", id:`${lowercaseFormName}-${lowercaseInstructionType}portterm`, className:`reflect-field`, name:`${formName}[${instructionType}PortTerm]`, dataTarget:`${instructionType}PortTerm-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.portTerm, defaultValue:formContext.defaultPortTerm, onChange:"", specialFeature:[]},
                    {title:"Freight Term", id:`${lowercaseFormName}-${lowercaseInstructionType}freightterm`, className:`reflect-field`, name:`${formName}[${instructionType}FreightTerm]`, dataTarget:`${instructionType}FreightTerm-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.freightTerm, onChange:"", specialFeature:[]},
                    {title:"Terminal Handler ROC", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingroc`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[${instructionType}AgentROC]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Terminal Handler Company", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingcompany`, className:`reflect-field`, name:`${formName}[${instructionType}AgentName]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.optionPODAgentCompany, onChange:`onChange${instructionType}HandlingCompany`, specialFeature:[]},
                    {title:"Terminal Handler Branch Code", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingofficecode`, className:`reflect-field`, name:`${formName}[${instructionType}HandlingOfficeCode]`, dataTarget:`${instructionType}HandlingOffice-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.optionPODAgentCompanyBranch, maxlength:"255", onChange:`onChange${instructionType}HandlingOfficeCode`, specialFeature:[]},
                    {title:"Terminal Handler Branch Name", id:`${lowercaseFormName}-${lowercaseInstructionType}handlingofficename`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[${instructionType}HandlingOfficeName]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Req ETA", id:`${lowercaseFormName}-${lowercaseInstructionType}reqeta`, className:`reflect-field flatpickr-input-time flatpickr-input OriReadOnlyClass ${props.InstructionItem.formName=="BillOfLading" || props.InstructionItem.formName=="BillOfLadingBarge"?"pointerEventsStyle":""}`, name:`${formName}[${instructionType}ReqETA]`, dataTarget:`${lowercaseInstructionType}reqeta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", maxlength:"255", value:formContext.pODReqETA, onChange:"", specialFeature:["readOnly"]},
                ];
                var FinalDestinationElement=[
                    {title:"Port Code", id:`${lowercaseFormName}-${lowercaseInstructionType}`, className:`reflect-field getTerminalPortCode`, name:`${formName}[${instructionType}]`, dataTarget:`${instructionType}-ShippingInstructions`, gridSize:"col-xs-12 col-md-12", type:"dropdown", option:props.port, onChange:onChangeFinalDestinationPortCode, specialFeature:[]},
                    {title:"Area", id:`${lowercaseFormName}-${lowercaseInstructionType}areaname`, className:`reflect-field AreaName`, name:`${formName}[${instructionType}Area]`, dataTarget:`${instructionType}Area-ShippingInstruction`, gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Port Term", id:`${lowercaseFormName}-${lowercaseInstructionType}portterm`, className:`reflect-field`, name:`${formName}[${instructionType}PortTerm]`, dataTarget:`FDPortTerm-ShippingInstructions`, gridSize:"col-xs-12 col-md-12", type:"dropdown", option:formContext.portTerm, onChange:"", specialFeature:[]},
                    {title:"Agent Company", id:`${lowercaseFormName}-${lowercaseInstructionType}handler`, className:`reflect-field`, name:`${formName}[${instructionType}Handler]`, dataTarget:`${instructionType}Handler-ShippingInstructions`, gridSize:"col-xs-12 col-md-12", type:"dropdown-asyncSelect", value:formContext.defaultFinalDestinationCompany, onChange:formContext.setDefaultFinalDestinationCompany, specialFeature:[]},
                ];
                var VoyageElement=[
                    {title:"Voyage Num", id:`${lowercaseFormName}-voyagenum`, className:`reflect-field AllScheduleVoyage`, name:`${formName}[VoyageNum]`, dataTarget:`VoyageNum-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.VoyageNum, onChange:FindVoyageNumberDetail, specialFeature:["VoyageTools"]},
                    {title:"Voyage Name", id:`${lowercaseFormName}-voyagename`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[VoyageName]`, dataTarget:`VoyageName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Code", id:`${lowercaseFormName}-vesselcode`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[VesselCode]`, dataTarget:`VesselCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Name", id:`${lowercaseFormName}-vesselname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[VesselName]`, dataTarget:`VesselName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"POL ETA", id:`${lowercaseFormName}-poleta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[POLETA]`, dataTarget:`poleta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL ETD", id:`${lowercaseFormName}-poletd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[POLETD]`, dataTarget:`poletd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL SCN Code", id:`${lowercaseFormName}-polscncode`, className:`reflect-field`, name:`${formName}[POLSCNCode]`, dataTarget:`POLSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:[]},
                    {title:"Closing Date Time", id:`${lowercaseFormName}-closingdatetime`, className:`reflect-field closingDateTime flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[ClosingDateTime]`, dataTarget:`closingDateTime`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETA", id:`${lowercaseFormName}-podeta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[PODETA]`, dataTarget:`podeta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETD", id:`${lowercaseFormName}-podetd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[PODETD]`, dataTarget:`podetd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD SCN Code", id:`${lowercaseFormName}-podscncode`, className:`reflect-field`, name:`${formName}[PODSCNCode]`, dataTarget:`PODSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:[]},
                    {title:"Ship Op ROC", id:`CompanyROC-${instructionType}-DetailForm`, className:`dropdownInputCompany reflect-field ShipOpROC`, name:`${formName}[ShipOperator]`, dataTarget:`CompanyROC-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                    {title:"Ship Op Company Name", id:`${lowercaseFormName}-shipoperatorcompany`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[ShipOperatorCompany]`, dataTarget:`CompanyName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Branch Code ", id:`BranchCode-${instructionType}-DetailForm`, className:`dropdownInputBranch reflect-field ShipOpBranchCode`, name:`${formName}[ShipOperatorBranchCode]`, dataTarget:`BranchCode-${instructionType}`, dataRefer:`${lowercaseFormName}-shipoperator`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[]},
                    {title:"Ship Op Branch Name", id:`${lowercaseFormName}-shipoperatorbranchname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[ShipOperatorBranchName]`, dataTarget:`BranchName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:`Auto Billing`, id:`${lowercaseFormName}-autobilling`, className:`mb-1 ml-1`, name:`${formName}[AutoBilling]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]},
                    {title:`Insist Transhipment`, id:`${lowercaseFormName}-insisttranshipment`, className:`mb-1 ml-1`, name:`${formName}[InsistTranshipment]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]},
                    {title:`Apply D&D`, id:`${lowercaseFormName}-applydnd`, className:`mb-1 ml-1`, name:`${formName}[ApplyDND]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", checkBoxClass:"DND", onChange:"", specialFeature:["defaultCheck"]},
                    {title:`D&D Combined`, id:`${lowercaseFormName}-dndcombined`, className:`mb-1 ml-1`, name:`${formName}[DNDCombined]`, dataTarget:``, gridSize:"col-xs-12 col-md-12 ml-5 DNDCombined", type:"checkbox", checkBoxClass:"DND", onChange:"", specialFeature:["defaultCheck"]},
                    {type:"DND"},
                ];

                var VoyageElementNoDND=[
                    {title:"Voyage Num", id:`${lowercaseFormName}-voyagenum`, className:`reflect-field AllScheduleVoyage`, name:`${formName}[VoyageNum]`, dataTarget:`VoyageNum-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.VoyageNum, onChange:FindVoyageNumberDetail, specialFeature:["VoyageTools"]},
                    {title:"Voyage Name", id:`${lowercaseFormName}-voyagename`, className:`reflect-field`, name:`${formName}[VoyageName]`, dataTarget:`VoyageName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Code", id:`${lowercaseFormName}-vesselcode`, className:`reflect-field`, name:`${formName}[VesselCode]`, dataTarget:`VesselCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Name", id:`${lowercaseFormName}-vesselname`, className:`reflect-field`, name:`${formName}[VesselName]`, dataTarget:`VesselName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"POL ETA", id:`${lowercaseFormName}-poleta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle`, name:`${formName}[POLETA]`, dataTarget:`poleta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL ETD", id:`${lowercaseFormName}-poletd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle`, name:`${formName}[POLETD]`, dataTarget:`poletd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL SCN Code", id:`${lowercaseFormName}-polscncode`, className:`reflect-field`, name:`${formName}[POLSCNCode]`, dataTarget:`POLSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:[]},
                    {title:"Closing Date Time", id:`${lowercaseFormName}-closingdatetime`, className:`reflect-field closingDateTime flatpickr-input-time flatpickr-input pointerEventsStyle`, name:`${formName}[ClosingDateTime]`, dataTarget:`closingDateTime`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETA", id:`${lowercaseFormName}-podeta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle`, name:`${formName}[PODETA]`, dataTarget:`podeta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETD", id:`${lowercaseFormName}-podetd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle`, name:`${formName}[PODETD]`, dataTarget:`podetd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD SCN Code", id:`${lowercaseFormName}-podscncode`, className:`reflect-field`, name:`${formName}[PODSCNCode]`, dataTarget:`PODSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:[]},
                    {title:"Ship Op ROC", id:`CompanyROC-${instructionType}-DetailForm`, className:`dropdownInputCompany reflect-field ShipOpROC`, name:`${formName}[ShipOperator]`, dataTarget:`CompanyROC-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                    {title:"Ship Op Company Name", id:`${lowercaseFormName}-shipoperatorcompany`, className:`reflect-field`, name:`${formName}[ShipOperatorCompany]`, dataTarget:`CompanyName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Branch Code ", id:`BranchCode-${instructionType}-DetailForm`, className:`dropdownInputBranch reflect-field ShipOpBranchCode`, name:`${formName}[ShipOperatorBranchCode]`, dataTarget:`BranchCode-${instructionType}`, dataRefer:`${lowercaseFormName}-shipoperator`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[]},
                    {title:"Ship Op Branch Name", id:`${lowercaseFormName}-shipoperatorbranchname`, className:`reflect-field`, name:`${formName}[ShipOperatorBranchName]`, dataTarget:`BranchName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:`Auto Billing`, id:`${lowercaseFormName}-autobilling`, className:`mb-1 ml-1`, name:`${formName}[AutoBilling]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]},
                    {title:`Insist Transhipment`, id:`${lowercaseFormName}-insisttranshipment`, className:`mb-1 ml-1`, name:`${formName}[InsistTranshipment]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]}
               
                ];

                var VoyageElementBarge=[
                    {title:"Voyage Num", id:`${lowercaseFormName}-voyagenum`, className:`reflect-field readOnlySelect AllScheduleVoyage bargeRelatedField`, name:`${formName}[VoyageNum]`, dataTarget:`VoyageNum-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.VoyageNum, onChange:FindVoyageNumberDetail, specialFeature:["VoyageTools"]},
                    {title:"Voyage Name", id:`${lowercaseFormName}-voyagename`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[VoyageName]`, dataTarget:`VoyageName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Code", id:`${lowercaseFormName}-vesselcode`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[VesselCode]`, dataTarget:`VesselCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Name", id:`${lowercaseFormName}-vesselname`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[VesselName]`, dataTarget:`VesselName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Barge Code", id:`${lowercaseFormName}-bargecode`, className:`reflect-field readOnlySelect bargeRelatedField`, name:`${formName}[BargeCode]`, dataTarget:`BargeCode-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.bargeCode, onChange:"", specialFeature:["readOnly"]},
                    {title:"Barge Name", id:`${lowercaseFormName}-bargename`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[BargeName]`, dataTarget:`BargeName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},     
                    {title:"POL ETA", id:`${lowercaseFormName}-poleta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[POLETA]`, dataTarget:`poleta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL ETD", id:`${lowercaseFormName}-poletd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[POLETD]`, dataTarget:`poletd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL SCN Code", id:`${lowercaseFormName}-polscncode`, className:`reflect-field bargeRelatedField`, name:`${formName}[POLSCNCode]`, dataTarget:`POLSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Closing Date Time", id:`${lowercaseFormName}-closingdatetime`, className:`reflect-field closingDateTime flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[ClosingDateTime]`, dataTarget:`closingDateTime`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETA", id:`${lowercaseFormName}-podeta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[PODETA]`, dataTarget:`podeta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETD", id:`${lowercaseFormName}-podetd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[PODETD]`, dataTarget:`podetd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD SCN Code", id:`${lowercaseFormName}-podscncode`, className:`reflect-field bargeRelatedField`, name:`${formName}[PODSCNCode]`, dataTarget:`PODSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op ROC", id:`CompanyROC-${instructionType}-DetailForm`, className:`dropdownInputCompany reflect-field ShipOpROC bargeRelatedField`, name:`${formName}[ShipOperator]`, dataTarget:`CompanyROC-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Company Name", id:`${lowercaseFormName}-shipoperatorcompany`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[ShipOperatorCompany]`, dataTarget:`CompanyName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Branch Code ", id:`BranchCode-${instructionType}-DetailForm`, className:`dropdownInputBranch reflect-field ShipOpBranchCode bargeRelatedField`, name:`${formName}[ShipOperatorBranchCode]`, dataTarget:`BranchCode-${instructionType}`, dataRefer:`${lowercaseFormName}-shipoperator`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Branch Name", id:`${lowercaseFormName}-shipoperatorbranchname`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[ShipOperatorBranchName]`, dataTarget:`BranchName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
          
                ];

                var VoyageElementBargeDO=[
                    {title:"Voyage Num", id:`${lowercaseFormName}-voyagenum`, className:`reflect-field readOnlySelect AllScheduleVoyage bargeRelatedField`, name:`${formName}[VoyageNum]`, dataTarget:`VoyageNum-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.VoyageNum, onChange:FindVoyageNumberDetail, specialFeature:["VoyageTools"]},
                    {title:"Voyage Name", id:`${lowercaseFormName}-voyagename`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[VoyageName]`, dataTarget:`VoyageName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Code", id:`${lowercaseFormName}-vesselcode`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[VesselCode]`, dataTarget:`VesselCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Name", id:`${lowercaseFormName}-vesselname`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[VesselName]`, dataTarget:`VesselName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Barge Code", id:`${lowercaseFormName}-bargecode`, className:`reflect-field readOnlySelect bargeRelatedField`, name:`${formName}[BargeCode]`, dataTarget:`BargeCode-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.bargeCode, onChange:"", specialFeature:["readOnly"]},
                    {title:"Barge Name", id:`${lowercaseFormName}-bargename`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[BargeName]`, dataTarget:`BargeName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},     
                    {title:"POL ETA", id:`${lowercaseFormName}-poleta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[POLETA]`, dataTarget:`poleta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL ETD", id:`${lowercaseFormName}-poletd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[POLETD]`, dataTarget:`poletd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL SCN Code", id:`${lowercaseFormName}-polscncode`, className:`reflect-field bargeRelatedField`, name:`${formName}[POLSCNCode]`, dataTarget:`POLSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Closing Date Time", id:`${lowercaseFormName}-closingdatetime`, className:`reflect-field closingDateTime flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[ClosingDateTime]`, dataTarget:`closingDateTime`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETA", id:`${lowercaseFormName}-podeta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[PODETA]`, dataTarget:`podeta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETD", id:`${lowercaseFormName}-podetd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass bargeRelatedField`, name:`${formName}[PODETD]`, dataTarget:`podetd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD SCN Code", id:`${lowercaseFormName}-podscncode`, className:`reflect-field bargeRelatedField`, name:`${formName}[PODSCNCode]`, dataTarget:`PODSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op ROC", id:`CompanyROC-${instructionType}-DetailForm`, className:`dropdownInputCompany reflect-field ShipOpROC bargeRelatedField`, name:`${formName}[ShipOperator]`, dataTarget:`CompanyROC-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Company Name", id:`${lowercaseFormName}-shipoperatorcompany`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[ShipOperatorCompany]`, dataTarget:`CompanyName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Branch Code ", id:`BranchCode-${instructionType}-DetailForm`, className:`dropdownInputBranch reflect-field ShipOpBranchCode bargeRelatedField`, name:`${formName}[ShipOperatorBranchCode]`, dataTarget:`BranchCode-${instructionType}`, dataRefer:`${lowercaseFormName}-shipoperator`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Branch Name", id:`${lowercaseFormName}-shipoperatorbranchname`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[ShipOperatorBranchName]`, dataTarget:`BranchName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:`Auto Billing`, id:`${lowercaseFormName}-autobilling`, className:`mb-1 ml-1`, name:`${formName}[AutoBilling]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]},
                    {title:`Insist Transhipment`, id:`${lowercaseFormName}-insisttranshipment`, className:`mb-1 ml-1`, name:`${formName}[InsistTranshipment]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]},
                    {title:`Apply D&D`, id:`${lowercaseFormName}-applydnd`, className:`mb-1 ml-1`, name:`${formName}[ApplyDND]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", checkBoxClass:"DND", onChange:"", specialFeature:["defaultCheck"]},
                    {title:`D&D Combined`, id:`${lowercaseFormName}-dndcombined`, className:`mb-1 ml-1 bargeRelatedField`, name:`${formName}[DNDCombined]`, dataTarget:``, gridSize:"col-xs-12 col-md-12 ml-5 DNDCombined", type:"checkbox", checkBoxClass:"DND", onChange:"", specialFeature:["defaultCheck"]},
                    {type:"DND"},
                ];

                
                var VoyageElementBargeBL=[
                    {title:"Voyage Num", id:`${lowercaseFormName}-voyagenum`, className:`reflect-field AllScheduleVoyage`, name:`${formName}[VoyageNum]`, dataTarget:`VoyageNum-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.VoyageNum, onChange:FindVoyageNumberDetail, specialFeature:["VoyageTools"]},
                    {title:"Voyage Name", id:`${lowercaseFormName}-voyagename`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[VoyageName]`, dataTarget:`VoyageName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Code", id:`${lowercaseFormName}-vesselcode`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[VesselCode]`, dataTarget:`VesselCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},
                    {title:"Vessel Name", id:`${lowercaseFormName}-vesselname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[VesselName]`, dataTarget:`VesselName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:["readOnly"]},
                    {title:"Barge Code", id:`${lowercaseFormName}-bargecode`, className:`reflect-field readOnlySelect bargeRelatedField`, name:`${formName}[BargeCode]`, dataTarget:`BargeCode-ShippingInstructions`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.bargeCode, onChange:FindBargeNameDetail, specialFeature:["readOnly"]},
                    {title:"Barge Name", id:`${lowercaseFormName}-bargename`, className:`reflect-field OriReadOnlyClass bargeRelatedField`, name:`${formName}[BargeName]`, dataTarget:`BargeName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"45", onChange:"", specialFeature:["readOnly"]},     
                    {title:"POL ETA", id:`${lowercaseFormName}-poleta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[POLETA]`, dataTarget:`poleta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL ETD", id:`${lowercaseFormName}-poletd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[POLETD]`, dataTarget:`poletd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POL SCN Code", id:`${lowercaseFormName}-polscncode`, className:`reflect-field`, name:`${formName}[POLSCNCode]`, dataTarget:`POLSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:[]},
                    {title:"Closing Date Time", id:`${lowercaseFormName}-closingdatetime`, className:`reflect-field closingDateTime flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[ClosingDateTime]`, dataTarget:`closingDateTime`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETA", id:`${lowercaseFormName}-podeta`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[PODETA]`, dataTarget:`podeta`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD ETD", id:`${lowercaseFormName}-podetd`, className:`reflect-field flatpickr-input-time flatpickr-input pointerEventsStyle OriReadOnlyClass`, name:`${formName}[PODETD]`, dataTarget:`podetd`, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input-time", onChange:"", specialFeature:["readOnly","disabled"]},
                    {title:"POD SCN Code", id:`${lowercaseFormName}-podscncode`, className:`reflect-field`, name:`${formName}[PODSCNCode]`, dataTarget:`PODSCNCode-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", maxlength:"255", onChange:"", specialFeature:[]},
                    {title:"Ship Op ROC", id:`CompanyROC-${instructionType}-DetailForm`, className:`dropdownInputCompany reflect-field ShipOpROC`, name:`${formName}[ShipOperator]`, dataTarget:`CompanyROC-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                    {title:"Ship Op Company Name", id:`${lowercaseFormName}-shipoperatorcompany`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[ShipOperatorCompany]`, dataTarget:`CompanyName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:"Ship Op Branch Code ", id:`BranchCode-${instructionType}-DetailForm`, className:`dropdownInputBranch reflect-field ShipOpBranchCode`, name:`${formName}[ShipOperatorBranchCode]`, dataTarget:`BranchCode-${instructionType}`, dataRefer:`${lowercaseFormName}-shipoperator`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[]},
                    {title:"Ship Op Branch Name", id:`${lowercaseFormName}-shipoperatorbranchname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}[ShipOperatorBranchName]`, dataTarget:`BranchName-${instructionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:`Auto Billing`, id:`${lowercaseFormName}-autobilling`, className:`mb-1 ml-1`, name:`${formName}[AutoBilling]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]},
                    {title:`Insist Transhipment`, id:`${lowercaseFormName}-insisttranshipment`, className:`mb-1 ml-1`, name:`${formName}[InsistTranshipment]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[""]},
                    {title:`Apply D&D`, id:`${lowercaseFormName}-applydnd`, className:`mb-1 ml-1`, name:`${formName}[ApplyDND]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", checkBoxClass:"DND", onChange:"", specialFeature:["defaultCheck"]},
                    {title:`D&D Combined`, id:`${lowercaseFormName}-dndcombined`, className:`mb-1 ml-1`, name:`${formName}[DNDCombined]`, dataTarget:``, gridSize:"col-xs-12 col-md-12 ml-5 DNDCombined", type:"checkbox", checkBoxClass:"DND", onChange:"", specialFeature:["defaultCheck"]},
                    {type:"DND"},
                ];


                
                return(
                    <div key={index} className={`${lowercaseFormName}-${lowercaseInstructionType}-form`}>
                        <div className="card lvl2">
                            <div className="card-header">
                                <h3 className="card-title">{res==="FinalDestination"?SpaceFormName:res} </h3>
                                <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <BuildUIForInstruction props={props} element={instructionType=="POL"? POLElement : instructionType=="POD"? PODElement:instructionType=="FinalDestination"?FinalDestinationElement:props.InstructionItem.formName=="ContainerReleaseOrder"?VoyageElementNoDND:(props.InstructionItem.formNameBarge=="SalesCreditNoteBarge" || props.InstructionItem.formNameBarge=="SalesDebitNoteBarge" || props.InstructionItem.formNameBarge=="SalesInvoiceBarge")?VoyageElementBarge:(props.InstructionItem.formNameBarge=="DeliveryOrderBarge")?VoyageElementBargeDO:(props.InstructionItem.formNameBarge=="BillOfLadingBarge" || props.InstructionItem.formNameBarge=="QuotationBarge" || props.InstructionItem.formNameBarge=="BookingReservationBarge")?VoyageElementBargeBL:VoyageElement} cardIndex={index}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        })}
    </>
  )
}

export default DetailFormInstruction

function BuildUIForInstruction(props){

    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)

    const formName = props.props.InstructionItem.formName
    const lowercaseFormName = props.props.InstructionItem.formName.toLowerCase()
    const instructionType = props.props.InstructionItem.instructionList
    const dropdownInputStyle = {
        maxHeight: "800px",
        overflowY: "auto",
        maxWidth: "1500px"
      };

      function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }

    function loadCompanyOptions(inputValue){
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {
        auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
        },
        }).then(res => res.data.data)
    
        return response
    }
    
    return(
        <>
            {props.element.map((res, index) => {
                    var name = res.name
                    return (res.type === "input-text")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                    <input {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                    :
                                    <input {...props.props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                }
                            </div>
                        </div>
                    ):
                    (res.type === "input-number")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                <input type={"number"} {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                    :   
                                <input type={"number"} {...props.props.register(name)} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                }
                             
                            </div>
                        </div>
                    ):
                    (res.type === "flatpickr-input")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <Controller 
                                    name={name}
                                    id={res.id}
                                    control={props.props.control}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Flatpickr
                                                {...props.props.register(name)}
                                                style={{ backgroundColor: "white" }}
                                                value={""}
                                                id={res.id}
                                                data-target={res.dataTarget}
                                                onChange={val => {
                                                    val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),res.dataTarget);
                                                    val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY"),res.dataTarget)
                                                }}
                                                className={`form-control c-date-picker ${res.className}`}
                                                options={{
                                                    dateFormat: "d/m/Y"
                                                }}
        
                                            />
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    ):
                    (res.type === "flatpickr-input-time")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <Controller 
                                    name={name}
                                    id={res.id}
                                    control={props.props.control}
                                    render={({ field: { onChange, value } }) => (
                                        <> 
                                            <Flatpickr
                                                {...props.props.register(name)}
                                                style={{backgroundColor: "white"}}
                                                value={value?value:""}
                                                id={res.id}
                                                data-target={res.dataTarget}
                                                onChange={val => {
                                                    val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),res.dataTarget);
                                                    val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY HH:mm"),res.dataTarget)
                                                }}
                                                className={`form-control c-date-picker ${res.className}`}
                                                options={{
                                                    dateFormat: "d/m/Y H:i",
                                                    time_24hr: true,
                                                    enableTime: true,
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    ):
                    (res.type === "dropdown")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <div className="input-group">
                                    <Controller
                                        name={name}
                                        id={res.id}
                                        control={props.props.control}
                                        data-target={res.dataTarget}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.props.register(name)}
                                                isClearable={true}
                                                data-target={res.dataTarget}
                                                id={res.id}
                                                defaultValue={res.defaultValue?res.defaultValue:""}
                                                value={
                                                    value
                                                    ? res.option?res.option.find((c) => c.value === value)
                                                    : null
                                                    : null
                                                }
                                                onChange={(val) =>{
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    res.onChange && res.onChange(val,res.id)
                                                }}
                                                options={res.option?res.option:""}
                                                className={`form-control ${res.className}`}
                                                classNamePrefix="select"
                                                onKeyDown={handleKeydown}
                                                menuPortalTarget={document.body}
                                                styles={props.props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                            />
                                        )}
                                    />     
                                    {res.specialFeature.includes("VoyageTools")?<div class="input-group-append" style={{cursor: "pointer"}}>
                                        <button type="button" class="btn btn-outline-secondary openModalVoyage"><i class="fa fa-search"></i></button>
                                        <button type="button" class="btn btn-outline-secondary" data-toggle="popover" data-placement="bottom"><i class="fa fa-info"></i></button>
                                    </div>:""}
                                </div>
                            </div>    
                        </div>
                    ):
                    (res.type === "dropdown-asyncSelect")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <Controller
                                    name={name}
                                    id={res.id}
                                    control={props.props.control}
                                    data-target={res.dataTarget}
                                    render={({ field: { onChange, value } }) => (
                                        <AsyncSelect
                                            isClearable={true}
                                            {...props.props.register(name)}
                                            value={value}
                                            placeholder={globalContext.asyncSelectPlaceHolder}
                                            onChange={e => { e == null ? onChange(null) : onChange(e.id); res.onChange && res.onChange(e)}}
                                            getOptionLabel={e => e.CompanyName}
                                            getOptionValue={e => e.CompanyUUID}
                                            loadOptions={loadCompanyOptions}
                                            menuPortalTarget={document.body}
                                            className={`form-control ${res.className}`}
                                            classNamePrefix="select"
                                            styles={props.props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                        />
                                    )}
                                />               
                            </div>    
                        </div>
                    ):
                    (res.type === "input-textarea")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                <textarea {...props.props.register(name,{required: `${res.title} cannot be blank.`})} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                    :   
                                <textarea {...props.props.register(name)} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                }
                            </div>
                        </div>
                    ):
                    (res.type === "input-dropdownInputCompany")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <input type="hidden" id={`${lowercaseFormName}-shipoperator`} className={`form-control`} {...props.props.register(name)} readOnly="readOnly" data-target={`CompanyID-${instructionType[props.cardIndex]}`} />
                                <input defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}${instructionType[props.cardIndex].toLowerCase()}-dropdown d-none`}>    
                                    <table id={`CompanyROC-${instructionType[props.cardIndex]}Hauler-DetailForm-Table`}></table>
                                </div>
                            </div>
                        </div>
                    ):
                    (res.type === "input-dropdownInputBranch")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <input type="hidden" id={`${lowercaseFormName}-shipoperatorbranchcode`} className={`form-control`}  {...props.props.register(name)} readOnly="readOnly" data-target={`BranchID-${instructionType[props.cardIndex]}`} />
                                <input defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} data-refer={res.dataRefer} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}${instructionType[props.cardIndex].toLowerCase()}-dropdown d-none`}>    
                                    <table id={`BranchCode-${instructionType[props.cardIndex]}Hauler-DetailForm-Table`}></table>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (res.type === "input-text-withModal")?
                    (
                        <div key={index} className={res.gridSize}>
                        <div className="form-group">
                            <label className="control-label">{res.title}</label>
                            <div className="input-group">
                                {res.specialFeature.includes("required") ? 
                                    <input {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                    :
                                    <input {...props.props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                }
                                <div className="input-group-append openAttentionModal" data-refer={`${lowercaseFormName}${instructionType[props.cardIndex].toLowerCase()}-branchcode`}><span className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></span></div>
                            </div>
                        </div>
                    </div>
                    )
                    :
                    (res.type === "checkbox")?
                    
                    (
                        <div key={index} className={res.gridSize}>
                            <div className={`form-group field-${lowercaseFormName}-${(res.title).toLowerCase().replace(" ",'')}`}>
                                <input type={"checkbox"} className={`mt-1 ${res.checkBoxClass?res.checkBoxClass:""}`} id={res.id} onChange={CheckBoxHandle} defaultChecked={res.specialFeature.includes("defaultCheck")? true:false}></input>
                                <input type={"text"} className="d-none" {...props.props.register(name)} defaultValue={res.specialFeature.includes("defaultCheck")? 1:0}/>
                                <label htmlFor={res.id} className={res.className}>{res.title}</label>
                            </div>
                        </div>
                    )
                    :(res.type === "DND")?
                    (
                        <div key={index}>
                            <div className="col-md-12 ml-5">
                                <div className="col-md-8 DNDCombineDay ml-2">
                                    <label>D&amp;D Combine Day</label>
                                    <input type="checkbox" className="CombineDayCheckBox ml-2 checkbox-inline mb-1 d-none"/>
                                    <div className={`form-group field-${lowercaseFormName}-dndcombinedday`}>
                                        <input type="number" id={`${lowercaseFormName}-dndcombinedday`} className="form-control reflect-field" {...props.props.register(`${formName}[DNDCombinedDay]`)} defaultValue="10" data-target="DNDCombinedDay" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 ml-5">
                                <div className ="row">
                                    <div className="col-md-5 Detention ml-2 d-none">
                                        <label>Detention(days)</label>
                                        <input type="checkbox" className="DetentionCheckBox  ml-2 checkbox-inline mb-1 d-none"/>
                                        <div className={`form-group field-${lowercaseFormName}-detention`}>
                                            <input type="number" id="quotation-detention" className="form-control reflect-field" {...props.props.register(`${formName}[Detention]`)} defaultValue="5" data-target="Detention" />
                                        </div>
                                    </div>

                                    <div className="col-md-5 Demurrage ml-2 d-none">
                                        <label>Demurrage(days)</label>
                                        <input type="checkbox" className="DemurrageCheckBox ml-2 checkbox-inline mb-1 d-none"/>
                                        <div className={`form-group field-${lowercaseFormName}-demurrage`}>
                                            <input type="number" id="quotation-demurrage" className="form-control reflect-field" {...props.props.register(`${formName}[Demurrage]`)} defaultValue="5" data-target="Demurrage" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ):
                    (res.type === "hidden")?
                    (
                        <input key={res.id} type={"hidden"} id={res.id} className={res.className} {...props.props.register(name)}/>      
                    ):
                    (
                        <>
                        </>
                    )
                }) 
            }
        </>
    )
}