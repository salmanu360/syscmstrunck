import React, { useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $ from "jquery";
import { getAreaById, getPortDetails,getVesselById, FindVoyagesWithPolPod, getVoyageByIdSpecial, FindAllocation, getPortDetailsById } from "../Helper";

function QuickFormShippingInstruction(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)

    var formName = props.ShippingInstructionItem.formName
    var formNameLowerCase = formName.toLowerCase()

    var defaultHideVoyage = "Quotation"
    var defaultHideModalVoyage = "ContainerReleaseOrder"
    var defaultReadOnlyVoyage = "ContainerReleaseOrder"

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }


    function potVoyageAllocation(e) {
        var current = e.target
        var regExp = /\(([^)]+)\)/;
        var result;
        var vesselCode;
        var allocatePortCode;
        var allocateVoyage;
        var insideBracketVessel;
        var voyageScheduleUUID;
        var portCodeLocation;
        var text;

        $.each($('.AllocateVoyageButton1'), function (key, value) {
            if (current == value || $(current).parent()[0] == value) {
                portCodeLocation = $('.AllocatePortCode')[key]
                allocatePortCode = $($('.AllocatePortCode')[key]).parent().find("input:hidden").val()
                allocateVoyage = $($('.AllocateVoyage')[key]).parent().find("input:hidden").val()
                text = $($('.AllocateVoyage')[key]).find(".select__single-value").text()
            }
        })

        if (portCodeLocation) {
            if ($(portCodeLocation).hasClass("pol_portcode")) {
                voyageScheduleUUID = $(`#${formNameLowerCase}-voyage-pol`).val();
            } else {
                var checkIndex = $(portCodeLocation.closest(".transhipment")).index()
                voyageScheduleUUID = $(`input[name='${formName}HasTranshipment[${checkIndex}][FromVoyagePOT]']`).val()
            }
        }


        var matches = regExp.exec(text);

        $.each(matches, function (key, value) {
            if (key == 0) {
                insideBracketVessel = value;
            } else if (key == 1) {
                vesselCode = value;
            }
        })

        if (allocateVoyage) {
            if (allocateVoyage.includes("@", 1)) {
                result = allocateVoyage.slice(0, -2);
            } else {
                result = allocateVoyage
            }
            var voyageNo = text.replace(insideBracketVessel, '');
            var StrvoyageNo = voyageNo.replace(/\s/g, '');

            if (allocateVoyage == "") {
                alert("Please select voyage num");
            }
            else {
                var e = $(current);
                var filter = {
                    allocateVoyage: allocateVoyage,
                    allocatePortCode: allocatePortCode,
                    StrvoyageNo: StrvoyageNo,
                    voyageScheduleUUID: voyageScheduleUUID,
                }
                FindAllocation(filter, globalContext).then(data => {
                    var usedtues = data.data["UsedTues"] ? data.data["UsedTues"] : 0;
                    var tues = data.data["Tues"];
                    var usedweight = data.data["UsedWeight"] ? data.data["UsedWeight"] : 0;
                    var weight = data.data["Weight"];


                    var remainingTues = tues - usedtues;
                    var remainingWeight = weight - usedweight;

                    var content = 'Tues: ' + parseFloat(remainingTues).toFixed(2) + ' / ' + parseFloat(tues).toFixed(2) + ' <br> Weight:' + parseFloat(remainingWeight).toFixed(2) + ' / ' + parseFloat(weight).toFixed(2) + '';
                    window.$(e).popover({ html: true, content: content }).popover('show');
                })
            }
        }
    }

    function handleQuickFormBarge(val){
        if(val){
            getVesselById(val.value,globalContext).then(res=>{
                if(res.data){
                    props.setValue("DynamicModel[BargeName]", res.data.VesselName)
                    props.setValue(`${formName}[BargeName]`,res.data.VesselName)
                    props.setValue(`${formName}[BargeCode]`,val.value)
                }
            })
        }else{
            props.setValue("DynamicModel[BargeName]","")
            props.setValue(`${formName}[BargeName]`,"")
            props.setValue(`${formName}[BargeCode]`,"")
        }
    }

    function FindVoyageFromTranshipmentDetails(currentSelector, id, index) {
        if (currentSelector) {
            props.setValue(`${formName}HasTranshipment[${index}][FromVoyageNum]`, currentSelector.value)
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

    function VoyageNumOnChangeHandle(data) {
       
        formContext.setStateHandle(data, "checkChangeVoyage")
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

                    if (formName == "BookingReservation") {
                        var stateValue = formContext.voyageandTranshipmentState
                        stateValue["Voyage"] = data
                        formContext.setVoyageandTranshipmentState(stateValue)
                    }

                    var VoyageArray = []
                    try {
                        $.each(data, function (key, value) {
                            VoyageArray.push({ value: value.VoyageUUID, label: value.VoyageNumber + "(" + value.vessel.VesselCode + ")" })
                        });
                    }
                    catch (err) {
                    }
                    formContext.update(formContext.fields)
                    props.setValue(`${formName}HasTranshipment[${index}][optionToVoyage]`, VoyageArray)
                    props.setValue(`${formName}HasTranshipment[${index}][ToVoyageNum]`, data[0]["VoyageUUID"])
                    if ($(".transhipment-item").length < 1) {
                        props.setValue(`${formName}[VoyageName]`, data[0]["VoyageNumber"])
                    }
                    $(`#${formNameLowerCase}hastranshipment-` + index + "-tovoyagename").val(data[0]["VoyageNumber"])
                    $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselcode").val(data[0]["vessel"]["VesselCode"])
                    $(`#${formNameLowerCase}hastranshipment-` + index + "-tovesselname").val(data[0]["vessel"]["VesselName"])

                    $("#dynamicmodel-vesselcode").val(data[0]["vessel"]["VesselCode"])
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

            if (!getPolPortcode) {
                getPolPortcode = $(`input[name='DynamicModel[POLPortCode]']`).val()
            }
            if (!getPodPortcode) {
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
                                        props.setValue(`${formName}[ClosingDateTime]`, value2.ClosingDateTime)
                                        props.setValue(`${formName}[POLSCNCode]`, value2.SCNCode)
                                        props.setValue(`${formName}[POLETA]`, value2.ETA)
                                        props.setValue(`${formName}[POLETD]`, value2.ETD)
                                        props.setValue(`${formName}[POLLocationCode]`, value2.LocationCode)
                                        props.setValue(`${formName}[VoyagePOL]`, value2.VoyageScheduleUUID)
                                        onChangeTerminalCode({ value: value2.LocationCode }, `${formNameLowerCase}-pollocationcode`)

                                        // $("input[data-target=\'closingDateTime\']").val(value2.ClosingDateTime)
                                        // $("input[data-target=\'POLSCNCode-Voyage\']").val(value2.SCNCode);
                                        // $("input[data-target=\'poleta\']").val(value2.ETA);
                                        // $("input[data-target=\'poletd\']").val(value2.ETD);
                                        // $(`#${formNameLowerCase}-voyage-pol`).val(value2.VoyageScheduleUUID)
                                        foundPOL = true;
                                    }
                                    countPOL++;

                                }

                                if (getPodPortcode == value2.PortCode && foundPOL && foundPOD == false) {
                                    props.setValue(`${formName}[PODSCNCode]`, value2.SCNCode)
                                    props.setValue(`${formName}[PODETA]`, value2.ETA)
                                    props.setValue(`${formName}[PODETD]`, value2.ETD)
                                    props.setValue(`${formName}[VoyagePOD]`, value2.VoyageScheduleUUID)

                                    onChangeTerminalCode({ value: value2.LocationCode }, `${formNameLowerCase}-podlocationcode`)

                                    // $("input[data-target=\'PODSCNCode-Voyage\']").val(value2.SCNCode);
                                    // $("input[data-target=\'podeta\']").val(value2.ETA);
                                    // $("input[data-target=\'podetd\']").val(value2.ETD);
                                    // $(`#${formNameLowerCase}-podlocationcode`).val(value2.LocationCode).trigger("change")
                                    // $(`#${formNameLowerCase}-voyage-pod`).val(value2.VoyageScheduleUUID)

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

    function ChangeReflectField(value, target) {
        if (target.includes("POLPortCode")) {
            if (value) {
                props.setValue(`DynamicVoyageModel[POLPortCode]`, value.value)
                props.setValue(`${formName}[POLPortCode]`, value.value)
                onChangePortCode(value, formNameLowerCase + "-polportcode")
            } else {
                props.setValue(`DynamicVoyageModel[PODPortCode]`, "")
                props.setValue(`${formName}[POLPortCode]`, "")
                onChangePortCode(value, formNameLowerCase + "-polportcode")
            }
        }
        if (target.includes("PODPortCode")) {
            if (value) {
                props.setValue(`DynamicVoyageModel[PODPortCode]`, value.value)
                props.setValue(`${formName}[PODPortCode]`, value.value)
                onChangePortCode(value, formNameLowerCase + "-podportcode")
            } else {
                props.setValue(`DynamicVoyageModel[PODPortCode]`, "")
                props.setValue(`${formName}[PODPortCode]`, "")
                onChangePortCode(value, formNameLowerCase + "-podportcode")
            }
        }
        if (target.includes("POLPortTerm")) {
            if (value) {
                props.setValue(`${formName}[POLPortTerm]`, value.value)
            } else {
                props.setValue(`${formName}[POLPortTerm]`, "")
            }
        }
        if (target.includes("PODPortTerm")) {
            if (value) {
                props.setValue(`${formName}[PODPortTerm]`, value.value)
            } else {
                props.setValue(`${formName}[PODPortTerm]`, "")
            }
        }
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
                    props.setValue(`${formName}[POLLocationCode]`, DefaultValue)
                    props.setValue(`${formName}[POLLocationName]`, DefaultPortName)
                    props.setValue(`${formName}[POLAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${formName}[POLAgentName]`, DefaultAgentCompany)
                    props.setValue(`${formName}[POLHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${formName}[POLHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                } else {
                    formContext.setStateHandle(tempOptions, "OptionPODTerminal")
                    formContext.setStateHandle(tempOptionsCompany, "OptionPODAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch, "OptionPODAgentCompanyBranch")
                    props.setValue(`${formName}[PODLocationCode]`, DefaultValue)
                    props.setValue(`${formName}[PODLocationName]`, DefaultPortName)
                    props.setValue(`${formName}[PODAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${formName}[PODAgentName]`, DefaultAgentCompany)
                    props.setValue(`${formName}[PODHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${formName}[PODHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                }
            });


        } else {
            if (positionId.includes("pol")) {
                $(closestArea).val("");
                formContext.setStateHandle([], "OptionPOLTerminal")
                formContext.setStateHandle([], "OptionPOLAgentCompany")
                formContext.setStateHandle([], "OptionPOLAgentCompanyBranch")
                props.setValue(`${formName}[POLLocationCode]`, "")
                props.setValue(`${formName}[POLLocationName]`, "")
                props.setValue(`${formName}[POLAgentROC]`, "")
                props.setValue(`${formName}[POLAgentName]`, "")
                props.setValue(`${formName}[POLHandlingOfficeCode]`, "")
                props.setValue(`${formName}[POLHandlingOfficeName]`, "")
            } else {
                $(closestArea).val("");
                formContext.setStateHandle([], "OptionPODTerminal")
                formContext.setStateHandle([], "OptionPODAgentCompany")
                formContext.setStateHandle([], "OptionPODAgentCompanyBranch")
                props.setValue(`${formName}[PODLocationCode]`, "")
                props.setValue(`${formName}[PODLocationName]`, "")
                props.setValue(`${formName}[PODAgentROC]`, "")
                props.setValue(`${formName}[PODAgentName]`, "")
                props.setValue(`${formName}[PODHandlingOfficeCode]`, "")
                props.setValue(`${formName}[PODHandlingOfficeName]`, "")
            }
        }
    }

    function FindVoyage() {
        var POTPortCode = [];
        if ($(".transhipment").length > 0) {
            var POL = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val()
            var POD = $(`[name='${formName}[PODPortCode]']`).val();
        }
        else {
            var POL = $(`[name='${formName}[POLPortCode]']`).val();
            var POD = $(`[name='${formName}[PODPortCode]']`).val();
        }

        if ($(".QuickFormVoyageNum").length > 0) {
            $(".QuickFormVoyageNum").each(function () {
                if ($(this).children().last().val() != "") {
                    POTPortCode.push($(this).children().last().val())
                }
            })
        }

        if (POL != "" && POD != "") {

            var filter = {
                POL: POL,
                POD: POD,
                DocDate: $(".docDate").val(),
                LastValidDate: $(".lastValidDate").val(),
                POTVoyageUUIDs: POTPortCode,
                PrevVoyage: props.getValues("DynamicModel[VoyageNum]"),
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
                formContext.setStateHandle(VoyageArray, "QuickFormVoyageNum")
                if ($(".transhipment").length < 1) {
                    formContext.setStateHandle(VoyageArray, "VoyageNum")
                }

                if (data == null) {
                    alert("Please add transshipment")
                }
            })
        }
        else {
            formContext.setStateHandle([], "QuickFormVoyageNum")
            if ($(".transhipment").length < 1) {
                formContext.setStateHandle([], "VoyageNum")
            }
        }
    }

    function FindPOTVoyage(index) {
        var POTPortCode = [];
        if (index > 0) {
            var POL = props.getValues(`${formName}HasTranshipment[${index - 1}][QuickFormPortCode]`)
            var POD = props.getValues(`${formName}HasTranshipment[${index}][QuickFormPortCode]`);
        } else {
            var POL = $(`[name='${formName}[POLPortCode]']`).val();
            var POD = props.getValues(`${formName}HasTranshipment[${index}][QuickFormPortCode]`);
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
                    alert("Please add transshipment")
                }
            })
        }
        else {
            props.setValue(`${formName}HasTranshipment[${index}][optionFromVoyage]`, [])
            formContext.update(formContext.fields)
        }
    }

    function onChangePOTPortCode(value, positionId, index) {

        var closestArea = $("#" + positionId).closest(".row").find(".AreaName")

        if (value) {
            props.setValue(`${formName}HasTranshipment[${index}][PortCode]`, value.value)

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
                props.setValue(`${formName}HasTranshipment[${index}][optionTerminal]`, tempOptions)
                props.setValue(`${formName}HasTranshipment[${index}][optionAgentCompany]`, tempOptionsCompany)
                props.setValue(`${formName}HasTranshipment[${index}][optionAgentBranchCode]`, tempOptionsCompanyBranch)
                formContext.update(formContext.fields)
                props.setValue(`${formName}HasTranshipment[${index}][LocationCode]`, DefaultValue)
                props.setValue(`${formName}HasTranshipment[${index}][LocationName]`, DefaultPortName)
                props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyROC]`, DefaultAgentCompanyROC)
                props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyCode]`, DefaultAgentCompany)
                props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeName]`, DefaultAgentCompanyBranchName)
            });
        } else {
            props.setValue(`${formName}HasTranshipment[${index}][PortCode]`, "")
            $(closestArea).val("");
            props.setValue(`${formName}HasTranshipment[${index}][optionTerminal]`, [])
            props.setValue(`${formName}HasTranshipment[${index}][optionAgentCompany]`, [])
            props.setValue(`${formName}HasTranshipment[${index}][optionAgentBranchCode]`, [])
            formContext.update(formContext.fields)
            props.setValue(`${formName}HasTranshipment[${index}][LocationCode]`, "")
            props.setValue(`${formName}HasTranshipment[${index}][LocationName]`, "")
            props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyROC]`, "")
            props.setValue(`${formName}HasTranshipment[${index}][POTHandlingCompanyCode]`, "")
            props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeCode]`, "")
            props.setValue(`${formName}HasTranshipment[${index}][POTHandlingOfficeName]`, "")

        }
    }

    function onChangeTerminalCode(value, positionId) {
        var DefaultValue;
        var DefaultPortName;
        var DefaultAgentCompanyROC;
        var DefaultAgentCompany;
        var DefaultAgentCompanyBranch;
        var DefaultAgentCompanyBranchName;

        if (value) {
            getPortDetailsById(value.value, globalContext).then(data => {
                var tempOptionsCompany = []
                var tempOptionsCompanyBranch = []
                var temarray = []

                if (data.data != null) {
                    temarray.push(data.data)
                    $.each(temarray, function (key, value1) {
                        if (value1.VerificationStatus == "Approved") {
                            DefaultValue = value1.PortDetailsUUID;
                            DefaultPortName = value1.PortName;
                            DefaultAgentCompanyROC = value1.handlingCompany.ROC
                            DefaultAgentCompany = value1.HandlingCompany
                            DefaultAgentCompanyBranch = value1.HandlingCompanyBranch
                            DefaultAgentCompanyBranchName = value1.handlingCompanyBranch.BranchName
                            tempOptionsCompany.push({ value: value1.handlingCompany.CompanyUUID, label: value1.handlingCompany.CompanyName })
                            tempOptionsCompanyBranch.push({ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode })
                        }
                    })

                }


                // set Option Terminal
                if (positionId.includes("pol")) {
                    formContext.setStateHandle(tempOptionsCompany, "OptionPOLAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch, "OptionPOLAgentCompanyBranch")
                    props.setValue(`${formName}[POLLocationName]`, DefaultPortName)
                    props.setValue(`${formName}[POLAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${formName}[POLAgentName]`, DefaultAgentCompany)
                    props.setValue(`${formName}[POLHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${formName}[POLHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                } else {
                    formContext.setStateHandle(tempOptionsCompany, "OptionPODAgentCompany")
                    formContext.setStateHandle(tempOptionsCompanyBranch, "OptionPODAgentCompanyBranch")
                    props.setValue(`${formName}[PODLocationName]`, DefaultPortName)
                    props.setValue(`${formName}[PODAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${formName}[PODAgentName]`, DefaultAgentCompany)
                    props.setValue(`${formName}[PODHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${formName}[PODHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                }

            })
        } else {
            if (positionId.includes("pol")) {
                formContext.setStateHandle([], "OptionPOLAgentCompany")
                formContext.setStateHandle([], "OptionPOLAgentCompanyBranch")
                props.setValue(`${formName}[POLLocationCode]`, "")
                props.setValue(`${formName}[POLLocationName]`, "")
                props.setValue(`${formName}[POLAgentROC]`, "")
                props.setValue(`${formName}[POLAgentName]`, "")
                props.setValue(`${formName}[POLHandlingOfficeCode]`, "")
                props.setValue(`${formName}[POLHandlingOfficeName]`, "")
            } else {
                formContext.setStateHandle([], "OptionPODAgentCompany")
                formContext.setStateHandle([], "OptionPODAgentCompanyBranch")
                props.setValue(`${formName}[PODLocationCode]`, "")
                props.setValue(`${formName}[PODLocationName]`, "")
                props.setValue(`${formName}[PODAgentROC]`, "")
                props.setValue(`${formName}[PODAgentName]`, "")
                props.setValue(`${formName}[PODHandlingOfficeCode]`, "")
                props.setValue(`${formName}[PODHandlingOfficeName]`, "")
            }
        }
    }

    function onChangePOTVoyageNum(currentSelector, id, index, checkingStatus) {
        props.setValue("DynamicModel[VoyageNum]", "")
        if (!checkingStatus) {
            formContext.setStateHandle([], "QuickFormVoyageNum")
        }
        $("#dynamicmodel-vesselcode").val("")
        if (currentSelector) {
            var regExp = /\(([^)]+)\)/;
            var ToVoyageNum = props.getValues(`DynamicModel[VoyageNum]`)
            var result;
            var startingIndex;
            var startingVesselName;
            var insideBracketVessel;
            var vesselCode;
            var VoyageNum = currentSelector.value;
            var index = index
            var closestVesselCode = $(`#${formNameLowerCase}hastranshipment-${index}-quickformpotvoyage`).parent().parent().next().find(".QuickFormVesselCode");
            var filters = {
                "VoyageUUID": $(this).val(),
            };

            var text = currentSelector.label;
            var matches = regExp.exec(text);

            var PolPortcode = props.getValues("DynamicModel[POLPortCode]")
            var PodPortcode = props.getValues("DynamicModel[PODPortCode]")
            var PotPortcode = props.getValues(`${formName}HasTranshipment[${index}][QuickFormPortCode]`)
            var prevPortCode

            if (index > 0) {
                startingIndex = index - 1;
                startingVesselName = props.getValues("#" + formNameLowerCase + "hastranshipment-" + startingIndex + "-fromvesselcode")
                prevPortCode = props.getValues("#" + formNameLowerCase + "hastranshipment-" + startingIndex + "-portcode")
                props.setValue("#" + formNameLowerCase + "hastranshipment-" + startingIndex + "-tovoyagenum", VoyageNum)
            }

            // $("#"+formNameLowerCase+"hastranshipment-" + index + "-fromvoyagenum").val(VoyageNum).trigger('change.select2')

            if (VoyageNum.includes("@", 1)) {
                result = VoyageNum.slice(0, -2);
            } else {
                result = VoyageNum
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
            var lastCharVoyageNo = VoyageNum.substr(VoyageNum.length - 1); // get voyage no last character eg. A, B or W
            var repeatedVoyage = 0;

            if (lastCharVoyageNo == "A") {
                repeatedVoyage = 1
            } else if (lastCharVoyageNo == "B") {
                repeatedVoyage = 2
            } else if (lastCharVoyageNo == "W") {
                repeatedVoyage = 1
            }

            getVoyageByIdSpecial(result, globalContext).then(data => {

                if (formName == "BookingReservation") {
                    var stateValue = formContext.voyageandTranshipmentState
                    if (index <= 0) {
                        stateValue["Transhipment"] = data
                    } else {
                        stateValue["Transhipment"].push(data)
                    }
                    formContext.setVoyageandTranshipmentState(stateValue)
                }


                var voyageSchedulesLength = data[0]["voyageSchedules"].length;

                var countPOT = 0;
                var foundPOL = false;
                var foundPOD = false;
                $.each(data[0]["voyageSchedules"], function (key, value) {
                    if (value.PortCode == PolPortcode) {


                        if (countPOT == repeatedVoyage) {

                            if (index == 0) {
                                props.setValue(`${formName}[POLETA]`, value.ETA)
                                props.setValue(`${formName}[POLETD]`, value.ETD)
                                props.setValue(`${formName}[POLSCNCode]`, value.SCNCode)
                                props.setValue(`${formName}[ClosingDateTime]`, value.ClosingDateTime)
                                $("#" + formNameLowerCase + "-voyage-pol").val(value.VoyageScheduleUUID)

                                if (!value.LocationCode) {
                                    props.setValue(`${formName}[POLLocationCode]`, value.LocationCode)
                                    props.setValue(`${formName}[POLLocationName]`, "")
                                    props.setValue(`${formName}[POLAgentROC]`, "")
                                    props.setValue(`${formName}[POLAgentName]`, "")
                                    props.setValue(`${formName}[POLHandlingOfficeCode]`, "")
                                    props.setValue(`${formName}[POLHandlingOfficeName]`, "")
                                } else {
                                    props.setValue(`${formName}[POLLocationCode]`, value.LocationCode)
                                    $.each(value.terminalSelection, function (key1, value1) {

                                        if (value1.PortDetailsUUID == value.LocationCode) {
                                            var optionCompany = [{ value: value1.handlingCompany.CompanyUUID, label: value1.handlingCompany.CompanyName }]
                                            var optionCompanyBranch = [{ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode }]
                                            formContext.setStateHandle(optionCompany, "OptionPOLAgentCompany")
                                            formContext.setStateHandle(optionCompanyBranch, "OptionPOLAgentCompanyBranch")
                                            props.setValue(`${formName}[POLLocationName]`, value1.LocationCode)
                                            props.setValue(`${formName}[POLAgentROC]`, value1.handlingCompany.AgentCode)
                                            props.setValue(`${formName}[POLAgentName]`, value1.handlingCompany.CompanyUUID)
                                            props.setValue(`${formName}[POLHandlingOfficeCode]`, value1.handlingCompanyBranch.CompanyBranchUUID)
                                            props.setValue(`${formName}[POLHandlingOfficeName]`, value1.handlingCompanyBranch.BranchName)
                                        }
                                    })
                                }

                                foundPOL = true;
                            }

                        }

                        countPOT++;
                    }

                    if (value.PortCode == PotPortcode) {

                        props.setValue(`${formName}HasTranshipment[${index}][DischargingDate]`, value.ETA)
                        props.setValue(`${formName}HasTranshipment[${index}][FromVoyagePOT]`, value.VoyageScheduleUUID)

                    }
                    if (value.PortCode == prevPortCode) {
                        //  var ETA = (value.ETA).split(" ");
                        props.setValue(`${formName}HasTranshipment[${startingIndex}][LoadingDate]`, value.ETA)
                        props.setValue(`${formName}HasTranshipment[${startingIndex}][ToVoyagePOT]`, value.VoyageScheduleUUID)
                    }

                    if (value.PortCode == PotPortcode && foundPOL && foundPOD == false) {
                        if (index == 0) {
                            props.setValue(`${formName}[PODETA]`, value.ETA)
                            props.setValue(`${formName}[PODETD]`, value.ETD)
                            props.setValue(`${formName}[PODSCNCode]`, value.SCNCode)

                            foundPOD = true;
                        }
                    }

                });

                if (index == 0) {
                    var temArray = [currentSelector]
                    formContext.setStateHandle(temArray, "VoyageNum")
                    props.setValue(`${formName}[VoyageNum]`, VoyageNum)
                    $("#" + formNameLowerCase + "-vesselcode").val(data[0]["vessel"]["VesselCode"])
                    $("#" + formNameLowerCase + "-voyagename").val(StrvoyageNo)
                    $.each(data, function (key, value) {
                        $("#" + formNameLowerCase + "-vesselname").val(value.vessel.VesselName)
                    })
                }

                if (foundPOL == false) {
                    if (index == 0) {
                        props.setValue(`${formName}[POLETA]`, "")
                        props.setValue(`${formName}[POLETD]`, "")
                        props.setValue(`${formName}[POLSCNCode]`, "")
                        props.setValue(`${formName}[ClosingDateTime]`, "")
                    }
                }

                if (foundPOD == false) {
                    if (index == 0) {
                        //alert("POD Port Code Not Available for Selected Voyage")
                        props.setValue(`${formName}[PODETA]`, "")
                        props.setValue(`${formName}[PODETD]`, "")
                        props.setValue(`${formName}[PODSCNCode]`, "")
                    }
                }

                if (closestVesselCode.val() == startingVesselName) {
                    $("#" + formNameLowerCase + "hastranshipment-" + startingIndex + "-dischargingdate").val("");
                    $("#" + formNameLowerCase + "hastranshipment-" + startingIndex + "-loadingdate").val("");
                }
            })
        }
    }

    useEffect(() => {
        if (formContext.voyageForTransfer) {
            if (formContext.voyageForTransfer.length > 0) {
                var data = formContext.voyageForTransfer[0]
                setTimeout(() => {
                    VoyageNumOnChangeHandle(data)
                    FindVoyageNumberDetail(data)
                    var VoyageName = (data.label).split('(')[0]
                    props.setValue(`DynamicModel[VoyageNum]`, data.value)
                    props.setValue(`${formName}[VoyageNum]`, data.value)
                    props.setValue(`${formName}[VoyageName]`, VoyageName)

                    formContext.clearErrors(`DynamicModel[VoyageNum]`)
                }, 120)
            }
        }
    }, [formContext.voyageForTransfer])

    useEffect(() => {
        if (formContext.transhipmentForTransfer) {
            if (formContext.transhipmentForTransfer.length > 0) {
                setTimeout(() => {
                    $.each(formContext.transhipmentForTransfer, function (key, value) {
                        FindVoyageFromTranshipmentDetails(value, `${formNameLowerCase}hastranshipment-${key}-fromvoyagenum`, key);
                        onChangePOTVoyageNum(value, `${formNameLowerCase}hastranshipment-${key}-fromvoyagenum`, key, "transfer")
                        props.setValue(`${formName}HasTranshipment[${key}][optionFromVoyage]`, [value])
                        formContext.update(formContext.fields)
                        props.setValue(`${formName}HasTranshipment[${key}][QuickFormPOTVoyage]`, value.value)
                    })
                }, 100)
            }
        }
    }, [formContext.transhipmentForTransfer])

    useEffect(() => {
        setTimeout(() => {
            props.setValue(`DynamicModel[POLPortTerm]`, formContext.defaultPortTerm)
            props.setValue(`DynamicModel[PODPortTerm]`, formContext.defaultPortTerm)
            props.trigger()
        }, 500);
    }, [])

    return (
        <>
            <div className={`${props.ShippingInstructionItem.cardLength}`}>
                <div className="card document lvl1">
                    <div className="card-header">
                        <input type="hidden" id="UserUUID" />
                        <h3 className="card-title">Shipping Instructions
                            <input type="hidden" id="UserPortCode" />
                        </h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group field-dynamicmodel-polportcode">
                                    <label className={`control-label ${props.errors.DynamicModel ? props.errors.DynamicModel.POLPortCode ? "has-error-label" : "" : ""}`} htmlFor="dynamicmodel-polportcode">POL Port Code</label>
                                    <Controller
                                        name={"DynamicModel[POLPortCode]"}
                                        id={"dynamicmodel-polportcode"}
                                        control={props.control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.register("DynamicModel[POLPortCode]", { required: "POL Port Code cannot be blank." })}
                                                isClearable={true}
                                                data-target={"POLPortCode-ShippingInstructions"}
                                                id={"dynamicmodel-polportcode"}
                                                value={
                                                    value
                                                        ? props.port.find((c) => c.value === value)
                                                        : null
                                                }
                                                onChange={(val) => {
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    ChangeReflectField(val, "POLPortCode");
                                                    formName == "BookingReservation" ? formContext.QuotationRequiredFields() : val == null ? onChange(null) : onChange(val.value);

                                                }}
                                                onKeyDown={handleKeydown}
                                                options={props.port}
                                                className={`form-control AllocatePortCode pol_portcode getTerminalPortCode quotationRequired liveData Live_Area ${props.ShippingInstructionItem.formName == defaultReadOnlyVoyage ? "readOnlySelect" : ""} ${props.errors[`DynamicModel`] ? props.errors[`DynamicModel`][`POLPortCode`] ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                            />
                                        )}
                                    />
                                    <p>{props.errors.DynamicModel ? props.errors.DynamicModel.POLPortCode && <span style={{ color: "#A94442" }}>{props.errors.DynamicModel.POLPortCode.message}</span> : ""}</p>

                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group field-POLPortTerm">
                                    <label className="control-label" htmlFor="POLPortTerm">POL Port Term</label>
                                    <Controller
                                        name={"DynamicModel[POLPortTerm]"}
                                        id={"dynamicmodel-polportterm"}
                                        control={props.control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.register("DynamicModel[POLPortTerm]")}
                                                isClearable={true}
                                                data-target={"POLPortTerm-ShippingInstructions"}
                                                id={"dynamicmodel-polportterm"}
                                                value={
                                                    value
                                                        ? formContext.portTerm ? formContext.portTerm.find((c) => c.value === value)
                                                            : null
                                                        : null
                                                }
                                                onKeyDown={handleKeydown}
                                                onChange={(val) => {
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    ChangeReflectField(val, "POLPortTerm")
                                                }}
                                                options={formContext.portTerm}
                                                className={`form-control pol_portterm liveData Live_PortTerm`}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            {props.barge ?
                                <>
                                    <div className="col-md-3">
                                        <div className="form-group field-BargeCode">
                                            <label className="control-label" htmlFor="BargeCode">Barge Code</label>
                                            <Controller
                                                name={"DynamicModel[BargeCode]"}
                                                id={"dynamicmodel-bargecode"}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        {...props.register("DynamicModel[BargeCode]")}
                                                        isClearable={true}
                                                        data-target={"BargeCode-ShippingInstructions"}
                                                        id={"dynamicmodel-bargecode"}
                                                        value={
                                                            value
                                                                ? formContext.bargeCode ? formContext.bargeCode.find((c) => c.value === value)
                                                                    : null
                                                                : null
                                                        }
                                                        onKeyDown={handleKeydown}
                                                        onChange={(val) => {
                                                            val == null ? onChange(null) : onChange(val.value);
                                                            ChangeReflectField(val, "BargeCode")
                                                            handleQuickFormBarge(val)
                                                        }}
                                                        options={formContext.bargeCode}
                                                        className={`form-control`}
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div class='form-group col-md-3'>
                                        <label className="control-label">Barge Name</label>
                                        <input class='form-control' {...props.register(`DynamicModel[BargeName]`)} readOnly></input>
                                    </div>
                                </>
                                : ""

                            }


                        </div>
                        <div className="row">

                            {/* <div className="col-md-12 transhipmentQuickForm"></div> */}
                            {formContext.fields.map((item, index) => {
                                var checkQuotationType = props.getValues(`${formName}[QuotationType]`) === "One-Off" ? true : false

                                return formName == "ContainerReleaseOrder" ? (<></>) : (

                                    <div key={item.id} className="col-md-12 transhipmentQuickForm">
                                        <div className='col-12 transhipment'>
                                            <div className='row'>
                                                <div className='align-self-center'>
                                                    <button type='button' className='remove-quickformtranshipment btn btn-danger btn-xs' onClick={() => formContext.FieldArrayHandle("remove", index)}><span className='fa fa-times'></span></button>
                                                </div>
                                                <div className='col-md-2'>
                                                    <label style={{ fontSize: "12px" }}>POT Port Code</label>
                                                    <div className='form-group input-group mb-3'>
                                                        <Controller
                                                            name={`${formName}HasTranshipment[${index}][QuickFormPortCode]`}
                                                            id={`${formNameLowerCase}hastranshipment-${index}-quickformportcode`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}HasTranshipment[${index}][QuickFormPortCode]`)}
                                                                    isClearable={true}
                                                                    data-target={"PODPortCode-ShippingInstructions"}
                                                                    id={`${formNameLowerCase}hastranshipment-${index}-quickformportcode`}
                                                                    value={
                                                                        value
                                                                            ? props.port.find((c) => c.value === value)
                                                                            : null
                                                                    }
                                                                    onKeyDown={handleKeydown}
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                        onChangePOTPortCode(val, `${formNameLowerCase}hastranshipment-${index}-portcode`, index)
                                                                    }}
                                                                    options={props.port}
                                                                    className={`transhipmentQuickform QuickFormPortCode form-control AllocatePortCode liveData Live_Area`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div class='col-md-3'>
                                                    <label style={{ fontSize: "12px" }}>POT Port Term</label>
                                                    <div class='form-group input-group mb-3'>
                                                        <Controller
                                                            name={`${formName}HasTranshipment[${index}][QuickFormPOTPortTerm]`}
                                                            id={`${formNameLowerCase}hastranshipment-${index}-quickformpotportterm`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}HasTranshipment[${index}][QuickFormPOTPortTerm]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}hastranshipment-${index}-quickformpotportterm`}
                                                                    value={
                                                                        value
                                                                            ? formContext.portTerm ? formContext.portTerm.find((c) => c.value === value)
                                                                                : null
                                                                            : null
                                                                    }
                                                                    onKeyDown={handleKeydown}
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                    }}
                                                                    options={formContext.portTerm ? formContext.portTerm : ""}
                                                                    className={`transhipmentQuickform QuickFormPortTerm form-control liveData Live_PortTerm`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <div class={`col-md-3 mr-4 transhipmentVoyagedisplay ${formName == "Quotation" && (checkQuotationType === true ? "" : "d-none")}`}>
                                                    <label style={{ fontSize: "12px" }}>Voyage Num</label>
                                                    <div class='form-group input-group mb-3'>
                                                        <Controller
                                                            name={`${formName}HasTranshipment[${index}][QuickFormPOTVoyage]`}
                                                            id={`${formNameLowerCase}hastranshipment-${index}-quickformpotvoyage`}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <Select
                                                                    {...props.register(`${formName}HasTranshipment[${index}][QuickFormPOTVoyage]`)}
                                                                    isClearable={true}
                                                                    id={`${formNameLowerCase}hastranshipment-${index}-quickformpotvoyage`}
                                                                    value={
                                                                        value
                                                                            ? item.optionFromVoyage ? item.optionFromVoyage.find((c) => c.value === value)
                                                                                : null
                                                                            : null
                                                                    }
                                                                    onKeyDown={handleKeydown}
                                                                    onChange={(val) => {
                                                                        val == null ? onChange(null) : onChange(val.value);
                                                                        FindVoyageFromTranshipmentDetails(val, `${formNameLowerCase}hastranshipment-${index}-fromvoyagenum`, index);
                                                                        onChangePOTVoyageNum(val, `${formNameLowerCase}hastranshipment-${index}-fromvoyagenum`, index)
                                                                    }}
                                                                    options={item.optionFromVoyage}
                                                                    className={`transhipmentQuickform QuickFormVoyageNum AllocateVoyage form-control`}
                                                                    classNamePrefix="select"
                                                                    menuPortalTarget={document.body}
                                                                    onMenuOpen={() => { FindPOTVoyage(index) }}
                                                                    styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                />
                                                            )}
                                                        />

                                                        <div class='input-group-btn' style={{ height: "31px" }}>
                                                            <button class='btn btn-outline-secondary AllocateVoyageButton1' type='button' style={{ height: "31px" }} data-toggle='popover' onClick={val => potVoyageAllocation(val)}><i class='fa fa-info'></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class={`col-md-3 transhipmentVesseldisplay ${formName == "Quotation" && (checkQuotationType === true ? "" : "d-none")}`}>
                                                    <label style={{ fontSize: "12px" }}>Vessel Code</label>
                                                    <div class='form-group input-group mb-3'>
                                                        <input class='transhipmentQuickform QuickFormVesselCode form-control' {...props.register(`${formName}HasTranshipment[${index}][QuickFormPOTVesselCode]`)}></input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className="col-md-3">
                                <div className="form-group field-dynamicmodel-podportcode">
                                    <label className={`control-label ${props.errors.DynamicModel ? props.errors.DynamicModel.PODPortCode ? "has-error-label" : "" : ""}`} htmlFor="dynamicmodel-podportcode">POD Port Code</label>
                                    <Controller
                                        name={"DynamicModel[PODPortCode]"}
                                        id={"dynamicmodel-podportcode"}
                                        control={props.control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.register("DynamicModel[PODPortCode]", { required: "POD Port Code cannot be blank." })}
                                                isClearable={true}
                                                data-target={"PODPortCode-ShippingInstructions"}
                                                id={"dynamicmodel-podportcode"}
                                                value={
                                                    value
                                                        ? props.port.find((c) => c.value === value)
                                                        : null
                                                }
                                                onKeyDown={handleKeydown}
                                                onChange={(val) => {
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    ChangeReflectField(val, "PODPortCode")
                                                    formName == "BookingReservation" ? formContext.QuotationRequiredFields() : val == null ? onChange(null) : onChange(val.value);

                                                }}
                                                options={props.port}
                                                className={`form-control pod_portcode getTerminalPortCode quotationRequired liveData Live_Area ${props.ShippingInstructionItem.formName == defaultReadOnlyVoyage ? "readOnlySelect" : ""} ${props.errors[`DynamicModel`] ? props.errors[`DynamicModel`][`PODPortCode`] ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                            />
                                        )}
                                    />
                                    <p>{props.errors.DynamicModel ? props.errors.DynamicModel.PODPortCode && <span style={{ color: "#A94442" }}>{props.errors.DynamicModel.PODPortCode.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="form-group field-PODPortTerm">
                                    <label className="control-label" htmlFor="PODPortTerm">POD Port
                                        Term</label>
                                    <Controller
                                        name={"DynamicModel[PODPortTerm]"}
                                        id={"dynamicmodel-podportterm"}
                                        control={props.control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.register("DynamicModel[PODPortTerm]")}
                                                isClearable={true}
                                                data-target={"PODPortTerm-ShippingInstructions"}
                                                id={"dynamicmodel-podportterm"}
                                                value={
                                                    value
                                                        ? formContext.portTerm ? formContext.portTerm.find((c) => c.value === value)
                                                            : null
                                                        : null
                                                }
                                                onKeyDown={handleKeydown}
                                                onChange={(val) => {
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    ChangeReflectField(val, "PODPortTerm")
                                                }}
                                                options={formContext.portTerm}
                                                className={`form-control pod_portterm liveData Live_PortTerm`}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                            />
                                        )}
                                    />
                                </div>
                            </div>


                            <div className={`col-md-3 OneOff ${props.ShippingInstructionItem.formName != defaultHideVoyage ? "" : "d-none"}`}>
                                <div className="form-group field-dynamicmodel-voyagenum">
                                    <label className="control-label" htmlFor="dynamicmodel-voyagenum">Voyage Num</label>
                                    <div className="input-group">
                                        {/* <select className='select2js form-control AllocateVoyage AllScheduleVoyage' id="dynamicmodel-voyagenum" data-target="VoyageNum-ShippingInstructions" >
                                            <option value="">Select...</option>
                                        </select> */}
                                        {props.ShippingInstructionItem.formName == "BookingReservation" ?
                                            <Controller
                                                name={"DynamicModel[VoyageNum]"}
                                                id={"dynamicmodel-voyagenum"}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        {...props.register("DynamicModel[VoyageNum]", { required: `Voyage Num cannot be blank.` })}
                                                        isClearable={true}
                                                        data-target={"VoyageNum-ShippingInstructions"}
                                                        id={"dynamicmodel-voyagenum"}
                                                        value={
                                                            value
                                                                ? formContext.quickFormVoyageNum.find((c) => c.value === value)
                                                                : null
                                                        }
                                                        onKeyDown={handleKeydown}
                                                        onChange={(val) => {
                                                            val == null ? onChange(null) : onChange(val.value);
                                                            VoyageNumOnChangeHandle(val);
                                                            FindVoyageNumberDetail(val)
                                                        }}
                                                        options={formContext.quickFormVoyageNum}
                                                        className={`form-control AllocateVoyage AllScheduleVoyage ${props.ShippingInstructionItem.formName == defaultReadOnlyVoyage ? "readOnlySelect" : ""} ${props.errors[`DynamicModel`] ? props.errors[`DynamicModel`][`VoyageNum`] ? "has-error-select" : "" : ""}`}
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        onMenuOpen={val => FindVoyage(val)}
                                                        styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                    />
                                                )}
                                            />
                                            :
                                            <Controller
                                                name={"DynamicModel[VoyageNum]"}
                                                id={"dynamicmodel-voyagenum"}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        {...props.register("DynamicModel[VoyageNum]")}
                                                        isClearable={true}
                                                        data-target={"VoyageNum-ShippingInstructions"}
                                                        id={"dynamicmodel-voyagenum"}
                                                        value={
                                                            value
                                                                ? formContext.quickFormVoyageNum.find((c) => c.value === value)
                                                                : null
                                                        }
                                                        onChange={(val) => {
                                                            val == null ? onChange(null) : onChange(val.value);
                                                            VoyageNumOnChangeHandle(val);
                                                            FindVoyageNumberDetail(val)
                                                        }}
                                                        onKeyDown={handleKeydown}
                                                        options={formContext.quickFormVoyageNum}
                                                        className={`form-control AllocateVoyage AllScheduleVoyage ${props.ShippingInstructionItem.formName == defaultReadOnlyVoyage ? "readOnlySelect" : ""}`}
                                                        classNamePrefix="select"
                                                        menuPortalTarget={document.body}
                                                        onMenuOpen={val => FindVoyage(val)}
                                                        styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                    />
                                                )}
                                            />
                                        }
                                        <div className={`input-group-append ${props.ShippingInstructionItem.formName == defaultHideModalVoyage ? "d-none" : ""}`} style={{ cursor: "pointer" }}><button type="button" className="btn btn-outline-secondary openModalVoyage"><i className="fa fa-search"></i></button><button type="button" className="btn btn-outline-secondary AllocateVoyageButton1" data-toggle="popover" onClick={val => potVoyageAllocation(val)} data-placement="bottom"><i className="fa fa-info"></i></button></div>
                                    </div>
                                    <p>{props.errors.DynamicModel ? props.errors.DynamicModel[`VoyageNum`] && <span style={{ color: "#A94442" }}>{props.errors.DynamicModel[`VoyageNum`].message}</span> : ""}</p>
                                </div>
                            </div>
                            <div className={`col-md-3 OneOff ${props.ShippingInstructionItem.formName != defaultHideVoyage ? "" : "d-none"}`}>
                                <div className="form-group field-dynamicmodel-vesselcode">
                                    <label className="control-label" htmlFor="dynamicmodel-vesselcode">Vessel Code</label>
                                    <input type="text" id="dynamicmodel-vesselcode" className="form-control" name="DynamicModel[VesselCode]" data-target="VesselCode-Voyage" />

                                    <div className="help-block"></div>
                                </div>
                            </div>
                        </div>
                        {props.ShippingInstructionItem.formName == defaultHideModalVoyage ? "" :
                            <button type="button" className="btn btn-link btn-xs mb-2" id="transhipmentQuickForm" onClick={() => formContext.FieldArrayHandle("append")}><span className="fa fa-plus"></span> Add
                                Transhipment</button>
                        }

                    </div>
                </div>
            </div>
        </>
    )

}

export default QuickFormShippingInstruction