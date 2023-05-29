import React, { useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from '../../Components/CommonElement/FormContext';   
import GlobalContext from "../../Components/GlobalContext"
import $ from "jquery";
import { getAreaById, getPortDetails, FindVoyagesWithPolPod, getVoyageByIdSpecial, FindAllocation, getPortDetailsById,FilterQuotations, sortArray } from '../../Components/Helper.js';

function TransferVoyageModal(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    
    var formName = props.ShippingInstructionItem.formName
    var formNameLowerCase = formName.toLowerCase()

    function FindQuotation(val) {
        var quotationType = props.getValues(`${props.ShippingInstructionItem.formName}[QuotationType]`)
        var DocDate = props.getValues(`${props.ShippingInstructionItem.formName}[DocDate]`)
        var LastValidDate = $(`input[name='${props.ShippingInstructionItem.formName}[LastValidDate]']`).val()
        var filters = []
        var filter
        var QuotationHasContainerType = [];

        
        $('.container-itemTR').each(function (key, value) {
            if ($(this).find(".ContainerType").val() != null) {
                var arrayList = {
                    "ContainerType": $(this).find(".ContainerType").children().last().val(),
                    "BoxOwnership": $(this).find(".BoxOwnership").children().last().val(),
                    "Temperature": $(this).find(".ReadTemperature").val(),
                    "DGClass": $(this).find(".DGClass").val(),
                }
                QuotationHasContainerType.push(arrayList)
            }
        });
        
        var filtersTranshipment =[]
        if(quotationType == "One-Off"){
            filter = {
                POLPortCode:props.getValues(`${props.ShippingInstructionItem.formName}[POLPortCode]`),
                PODPortCode:props.getValues(`${props.ShippingInstructionItem.formName}[PODPortCode]`),
                VoyageNum:$("#dynamicmodel-voyagenum").children().last().val(),
                QuotationBillTo:$("#bookingreservationbillto-roc").val(),
                QuotationType:quotationType,
            }

            $(".PortCodeDetailForm").each(function () {
                var arrayList = {
                    POTPortCode: $(this).children().last().val(),
                    POTVoyageNum: $(this).closest(".transhipment-body").find(".FromVoyageNumDetailForm").children().last().val(),
                }
                filtersTranshipment.push(arrayList)
            });
           

        }else{
            filter = {
                POLPortCode:props.getValues(`${props.ShippingInstructionItem.formName}[POLPortCode]`),
                PODPortCode:props.getValues(`${props.ShippingInstructionItem.formName}[PODPortCode]`),
                QuotationBillTo:$("#bookingreservationbillto-roc").val(),
                QuotationType:quotationType,
                
            }
            $(".PortCodeDetailForm").each(function () {
                var arrayList = {
                    POTPortCode: $(this).children().last().val(),
                }
                filtersTranshipment.push(arrayList)
            });
        }
        
        var filtersAgent = {
            "ROC": $("#bookingreservationagent-roc").val()
        };

        var filtersShipper = {
            "ROC": $("#bookingreservationshipper-roc").val()
        };

        var filtersConsignee = {
            "ROC": $("#bookingreservationconsignee-roc").val()
        };  

        filters = {QuotationHasContainerType,filter,filtersAgent,filtersTranshipment,filtersShipper,filtersConsignee,DocDate,LastValidDate}
        FilterQuotations(filters,globalContext).then(data => {
            var QuotationArray = []
            try {
                $.each(data.data, function (key, value) {
                    QuotationArray.push({ value: value.QuotationUUID, label: value.DocNum })
                });
            }
            catch (err) {
            }
            formContext.setStateHandle(sortArray(QuotationArray), "QTOption")
            
            // if (data.data == null) {
            //     console.log("3213")
            // }
        })

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


    function VoyageNumOnChangeHandle(data) {
        var index = $("#dynamicmodel-voyagenum").parent().parent().parent().parent().find(".transhipmentQuickForm").last().index();
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
                var PotPortcode
                
                if (index < 0) {
                    starting = props.getValues("TransferVoyage[POLPortCode]")
                    // startingIndex = index - 1
                    startingVesselName = props.getValues("TransferVoyageTranshipment[0][TransferVoyagePOTVesselCode]")
                } else {
                    starting = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val();
                    startingIndex = index
                    startingVesselName =props.getValues(`TransferVoyageTranshipment[${startingIndex}][TransferVoyagePOTVesselCode]`)
                    PotPortcode = props.getValues(`TransferVoyageTranshipment[${startingIndex}][TransferVoyagePortCode`)
                }
                var PodPortcode = props.getValues("TransferVoyage[PODPortCode]")

                getVoyageByIdSpecial(result, globalContext).then(data => {
                  
                    props.setValue(`TransferVoyage[VesselCode]`,data[0]["vessel"]["VesselName"])
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
                                props.setValue(`TransferVoyageTranshipment[${index}][LoadingDate]`, value.ETA)
                            }
                            countPOT++;
                        }
                        
                        if (value.PortCode == PodPortcode && foundPOL && foundPOD == false) {
                            props.setValue(`TransferVoyage[TransferPODeta]`, value.ETA)
                            props.setValue(`TransferVoyage[TransferPODetd]`, value.ETD)
                            props.setValue(`TransferVoyage[TransferPODScnCode]`, value.SCNCode)
                            // $(`#${formNameLowerCase}-voyage-pod`).val(value.VoyageScheduleUUID)

                            foundPOD = true;
                            countPOD++;
                        }

                        if (value.PortCode == PodPortcode && index == 0) {
                            props.setValue(`TransferVoyage[TransferPODeta]`, value.ETA)
                            props.setValue(`TransferVoyage[TransferPODetd]`, value.ETD)
                            props.setValue(`TransferVoyage[TransferPODScnCode]`, value.SCNCode)
                            // $(`#${formNameLowerCase}-voyage-pod`).val(value.VoyageScheduleUUID)

                            foundPOD = true;
                        }
                    });

                    if (ToVesselName == startingVesselName) {
                        props.setValue(`TransferVoyageTranshipment[${index}][LoadingDate]`, "")
                        props.setValue(`TransferVoyageTranshipment[${index}][DischargingDate]`, "")
                    }

                })
                
            } else {
                props.setValue(`TransferVoyageTranshipment[${index}][LoadingDate]`, "")
                if (index == 0) {
                    props.setValue(`TransferVoyage[TransferPODeta]`, "")
                    props.setValue(`TransferVoyage[TransferPODetd]`, "")
                    props.setValue(`TransferVoyage[TransferPODScnCode]`, "")
                }
            }
        } else {
            props.setValue(`TransferVoyageTranshipment[${index}][LoadingDate]`, "")
            props.setValue(`TransferVoyage[TransferPODeta]`, "")
            props.setValue(`TransferVoyage[TransferPODetd]`, "")
            props.setValue(`TransferVoyage[TransferPODScnCode]`, "")
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
                getPolPortcode = $(`input[name='TransferVoyage[POLPortCode]']`).val()
            }
            if(!getPodPortcode){
                getPodPortcode = $(`input[name='TransferVoyage[PODPortCode]']`).val()
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
                                        console.log("31231")
                                        props.setValue(`${formName}[ClosingDateTime]`,value2.ClosingDateTime)
                                        props.setValue(`${formName}[POLSCNCode]`,value2.SCNCode)
                                        props.setValue(`${formName}[POLETA]`,value2.ETA)
                                        props.setValue(`${formName}[POLETD]`,value2.ETD)
                                        props.setValue(`${formName}[POLLocationCode]`,value2.LocationCode)
                                        props.setValue(`${formName}[VoyagePOL]`,value2.VoyageScheduleUUID)
                                        onChangeTerminalCode({value:value2.LocationCode},`${formNameLowerCase}-pollocationcode`)

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
                                        props.setValue(`${formName}[PODSCNCode]`,value2.SCNCode)
                                        props.setValue(`${formName}[PODETA]`,value2.ETA)
                                        props.setValue(`${formName}[PODETD]`,value2.ETD)
                                        props.setValue(`${formName}[VoyagePOD]`,value2.VoyageScheduleUUID)

                                        onChangeTerminalCode({value:value2.LocationCode},`${formNameLowerCase}-podlocationcode`)

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
                            // $("input[data-target=\'VesselName-Voyage\']").val(value.vessel.VesselName);
                            // $("input[data-target=\'VesselCode-Voyage\']").val(value.vessel.VesselCode);
                        }
                    })
                } else {
                    // $("input[data-target=\'VesselCode-Voyage\']").val("");
                    // $("input[data-target=\'VesselName-Voyage\']").val("");
                    // $("input[data-target=\'VoyageName-Voyage\']").val("");
                    // $("input[data-target=\'POLSCNCode-Voyage\']").val("");
                    // $("input[data-target=\'PODSCNCode-Voyage\']").val("");
                    // $("input[data-target=\'poleta\']").val("");
                    // $("input[data-target=\'poletd\']").val("");
                    // $("input[data-target=\'podeta\']").val("");
                    // $("input[data-target=\'podetd\']").val("");
                    // $("input[data-target=\'closingDateTime\']").val("");
                }


                if (foundPOL == false) {
                    $("input[data-target=\'POLSCNCode-Voyage\']").val("");
                    $("input[data-target=\'poleta\']").val("");
                    $("input[data-target=\'poletd\']").val("");
                    // $("input[data-target=\'closingDateTime\']").val("");
                }
                if (foundPOD == false) {

                    // alert("POD Port Code Not Available for Selected Voyage")
                    $("input[data-target=\'PODSCNCode-Voyage\']").val("");
                    $("input[data-target=\'podeta\']").val("");
                    $("input[data-target=\'podetd\']").val("");
                }

                if ($("#dynamicmodel-voyagenum").val() != "") {
                    // $("#dynamicmodel-voyagenum").parent().find(".select2-container--default").removeClass('InvalidField')
                    // $("#dynamicmodel-voyagenum").parent().parent().find('.help-block').text("")
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
                    formContext.setStateHandle(sortArray(tempOptions), "OptionPOLTerminal")
                    formContext.setStateHandle(sortArray(tempOptionsCompany), "OptionPOLAgentCompany")
                    formContext.setStateHandle(sortArray(tempOptionsCompanyBranch), "OptionPOLAgentCompanyBranch")
                    props.setValue(`${formName}[POLLocationCode]`, DefaultValue)
                    props.setValue(`${formName}[POLLocationName]`, DefaultPortName)
                    props.setValue(`${formName}[POLAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${formName}[POLAgentName]`, DefaultAgentCompany)
                    props.setValue(`${formName}[POLHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${formName}[POLHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                } else {
                    formContext.setStateHandle(sortArray(tempOptions), "OptionPODTerminal")
                    formContext.setStateHandle(sortArray(tempOptionsCompany), "OptionPODAgentCompany")
                    formContext.setStateHandle(sortArray(tempOptionsCompanyBranch), "OptionPODAgentCompanyBranch")
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
        if ($(".transhipmentTransferVoyage").length > 0) {
            var POL = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val()
            var POD = $(`[name='TransferVoyage[PODPortCode]']`).val();
        }
        else {
            var POL = $(`[name='TransferVoyage[POLPortCode]']`).val();
            var POD = $(`[name='TransferVoyage[PODPortCode]']`).val();
        }

        if ($(".TransferVoyageVoyageNum").length > 0) {
            $(".TransferVoyageVoyageNum").each(function () {
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
                PrevVoyage: props.getValues("TransferVoyage[VoyageNum]"),
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
                formContext.setStateHandle(sortArray(VoyageArray), "TransferVoyageVoyageNum")
                // if ($(".transhipment").length < 1) {
                //     formContext.setStateHandle(VoyageArray, "TransferVoyageVoyageNum")
                // }

                if (data == null) {
                    alert("Please add transshipment")
                }
            })
        }
        else {
            formContext.setStateHandle([], "TransferVoyageVoyageNum")
            // if ($(".transhipment").length < 1) {
            //     formContext.setStateHandle([], "VoyageNum")
            // }
        }
    }

    function FindPOTVoyage(index) {
        var POTPortCode = [];
        if (index > 0) {
            var POL = props.getValues(`TransferVoyageTranshipment[${index - 1}][TransferVoyagePortCode]`)
            var POD = props.getValues(`TransferVoyageTranshipment[${index}][TransferVoyagePortCode]`);
        } else {
            var POL = $(`[name='TransferVoyage[POLPortCode]']`).val();
            var POD = props.getValues(`TransferVoyageTranshipment[${index}][TransferVoyagePortCode]`);
        }

        if ($(".TransferVoyageVoyageNum").length > 0) {
            $(".TransferVoyageVoyageNum").each(function () {
                if ($(this).children().last().val() != "") {
                    POTPortCode.push($(this).children().last().val())
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
                PrevVoyage: props.getValues(`TransferVoyageTranshipment[${index}][PreviousVoyageUUID]`),
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
                props.setValue(`${formName}HasTranshipment[${index}][optionFromVoyage]`, sortArray(VoyageArray))
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
                props.setValue(`${formName}HasTranshipment[${index}][optionTerminal]`, sortArray(tempOptions))
                props.setValue(`${formName}HasTranshipment[${index}][optionAgentCompany]`, sortArray(tempOptionsCompany))
                props.setValue(`${formName}HasTranshipment[${index}][optionAgentBranchCode]`, sortArray(tempOptionsCompanyBranch))
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

                if(data.data != null) {
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
                    formContext.setStateHandle(sortArray(tempOptionsCompany), "OptionPOLAgentCompany")
                    formContext.setStateHandle(sortArray(tempOptionsCompanyBranch), "OptionPOLAgentCompanyBranch")
                    props.setValue(`${formName}[POLLocationName]`, DefaultPortName)
                    props.setValue(`${formName}[POLAgentROC]`, DefaultAgentCompanyROC)
                    props.setValue(`${formName}[POLAgentName]`, DefaultAgentCompany)
                    props.setValue(`${formName}[POLHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                    props.setValue(`${formName}[POLHandlingOfficeName]`, DefaultAgentCompanyBranchName)
                } else {
                    formContext.setStateHandle(sortArray(tempOptionsCompany), "OptionPODAgentCompany")
                    formContext.setStateHandle(sortArray(tempOptionsCompanyBranch), "OptionPODAgentCompanyBranch")
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
   
        $("#dynamicmodel-vesselcode").val("")
        if (currentSelector) {
            var regExp = /\(([^)]+)\)/;
            var ToVoyageNum = props.getValues(`TransferVoyage[VoyageNum]`)
            var result;
            var startingIndex;
            var startingVesselName;
            var insideBracketVessel;
            var vesselCode;
            var VoyageNum = currentSelector.value;
            var index = index
            var closestVesselCode = props.getValues(`TransferVoyageTranshipment[${index}][TransferVoyagePOTVesselCode`)
            var filters = {
                "VoyageUUID": $(this).val(),
            };

            var text = currentSelector.label;
            var matches = regExp.exec(text);
            var PolPortcode = props.getValues("TransferVoyage[POLPortCode]")
            var PodPortcode = props.getValues("TransferVoyage[PODPortCode]")
            var PotPortcode = props.getValues(`TransferVoyageTranshipment[${index}][TransferVoyagePortCode]`)
            var prevPortCode

            if (index > 0) {
                startingIndex = index - 1;
                prevPortCode = props.getValues(`TransferVoyageTranshipment[${startingIndex}][TransferVoyagePortCode]`)
            }

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

                var stateValue = formContext.voyageandTranshipmentState
                if(index <= 0){
                    stateValue["Transhipment"] = data
                }else{
                    stateValue["Transhipment"].push(data)
                }
                formContext.setVoyageandTranshipmentState(stateValue)

                var voyageSchedulesLength = data[0]["voyageSchedules"].length;

                var countPOT = 0;
                var foundPOL = false;
                var foundPOD = false;

                $.each(data[0]["voyageSchedules"], function (key, value) {
                    if (value.PortCode == PolPortcode) {
                        if (countPOT == repeatedVoyage) {
                            if (index == 0) {
                                if (!value.LocationCode) {
                                } else {
                                }
                                foundPOL = true;
                            }
                        }
                        countPOT++;
                    }

                    if (value.PortCode == PotPortcode) {
                        props.setValue(`TransferVoyageTranshipment[${index}][DischargingDate]`, value.ETA)
                    }

                    if (value.PortCode == prevPortCode && foundPOL == false) {
                        props.setValue(`TransferVoyageTranshipment[${startingIndex}][LoadingDate]`, value.ETA)
                        foundPOL = true
                    }

                    if (value.PortCode == PotPortcode && foundPOL && foundPOD == false) {
                        if (index == 0) {
                        }
                        foundPOD = true;
                    }

                });

                if (closestVesselCode == startingVesselName) {
                    props.setValue(`TransferVoyageTranshipment[${startingIndex}][DischargingDate]`, "")
                    props.setValue(`TransferVoyageTranshipment[${startingIndex}][LoadingDate]`, "")
                }
            })
        }
    }

    function FindVoyageFromTranshipmentDetails(currentSelector, id, index) {
        if (currentSelector) {
            props.setValue(`TransferVoyageTranshipment[${index}][TransferVoyagePOTVoyage]`, currentSelector.value)
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
                    props.setValue(`TransferVoyageTranshipment[${index}][TransferVoyagePOTVesselCode]`, data[0].vessel.VesselName)
                })
            }
        }
        else {
            props.setValue(`TransferVoyageTranshipment[${index}][TransferVoyagePOTVesselCode]`, "")
        }
    }

    useEffect(() => {
        if(formContext.voyageForTransfer){  
            if(formContext.voyageForTransfer.length > 0){
                var data = formContext.voyageForTransfer[0]
                setTimeout(()=>{
                    VoyageNumOnChangeHandle(data)
                    FindVoyageNumberDetail(data)
                    var VoyageName = (data.label).split('(')[0]
                    props.setValue(`TransferVoyage[VoyageNum]`, data.value)
                    props.setValue(`${formName}[VoyageNum]`, data.value)
                    props.setValue(`${formName}[VoyageName]`, VoyageName)

                    formContext.clearErrors(`TransferVoyage[VoyageNum]`)
                },120)
            }
        }
    }, [formContext.voyageForTransfer])

    useEffect(()=> {
        if(props.transferVoyageUsingData){
            var lengthTranshipment = 0
            if(props.transferVoyageUsingData.BookingReservationHasTranshipment){
                lengthTranshipment = props.transferVoyageUsingData.BookingReservationHasTranshipment.length
            }

            $.each(props.transferVoyageUsingData.BookingReservation, function (key, value) {
                if(key == "POLPortCode"){
                    props.setValue(`TransferVoyage[POLPortCode]`, value)
                }
                if(key == "PODPortCode"){
                    props.setValue(`TransferVoyage[PODPortCode]`, value)
                }
                if(key == "Quotation"){
                    props.setValue(`TransferVoyage[Quotation]`, value)
                }
                
                
            })
            if(props.transferVoyageUsingData.BookingReservation){
                if(lengthTranshipment <=0){
                    props.setValue(`TransferVoyage[PODPreviousVoyageNum]`, props.transferVoyageUsingData.BookingReservation.VoyageName +"("+props.transferVoyageUsingData.BookingReservation.VesselName+")")
                    props.setValue(`TransferVoyage[PODPreviousVoyageNum]`, props.transferVoyageUsingData.BookingReservation.VoyageName +"("+props.transferVoyageUsingData.BookingReservation.VesselName+")")
                    props.setValue(`TransferVoyage[PODPreviousVoyageNumUUID]`, props.transferVoyageUsingData.BookingReservation.VoyageNum)
                }
            }

            $.each(props.transferVoyageUsingData.BookingReservationHasTranshipment, function (key, value) {
                props.setValue(`TransferVoyageTranshipment[${key}][TransferVoyagePortCode]`, value.PortCode)
                if(value.fromVoyage){
                    props.setValue(`TransferVoyageTranshipment[${key}][PreviousVoyage]`, value.fromVoyage.VoyageNumber+"("+value.FromVesselName+")")
                    props.setValue(`TransferVoyageTranshipment[${key}][PreviousVoyageUUID]`, value.FromVoyageNum)
                }

                if(lengthTranshipment  == key+1){
                    if(value.toVoyage){
                        props.setValue(`TransferVoyage[PODPreviousVoyageNum]`, value.toVoyage.VoyageNumber+"("+value.ToVesselName+")")
                        props.setValue(`TransferVoyage[PODPreviousVoyageNumUUID]`, value.ToVoyageNum)
                    }
                }

            })
        }

    },[props.transferVoyageUsingData])

    return (
        <>
            <div className="row">
                <div className="col-md-2">
                    <div className="form-group field-transfervoyage-polportcode">
                        <label className={`control-label`} htmlFor="transfervoyage-polportcode">POL Port Code</label>
                        <Controller
                            name={"TransferVoyage[POLPortCode]"}
                            id={"transfervoyage-polportcode"}
                            control={props.control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    {...props.register("TransferVoyage[POLPortCode]")}
                                    isClearable={true}
                                    data-target={"POLPortCode-ShippingInstructions"}
                                    id={"transfervoyage-polportcode"}
                                    value={
                                        value
                                            ? props.port.find((c) => c.value === value)
                                            : null
                                    }
                                    onChange={(val) => {
                                        val == null ? onChange(null) : onChange(val.value);
                                        ChangeReflectField(val, "POLPortCode");
                                    }}
                                    options={props.port}
                                    className={`form-control AllocatePortCode pol_portcode getTerminalPortCode liveData Live_Area readOnlySelect`}
                                    classNamePrefix="select"
                                    // menuPortalTarget={document.body}
                                    styles={{
                                        ...globalContext.customStyles,
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                {formContext.fields.map((item, index) => {
                    return (
                        <div key={item.id} className="col-md-12 transhipmentTransferVoyage">
                            <div className='col-12 transhipment'>
                                <div className='row'>
                                    {/* <div className='align-self-center'>
                                        <button type='button' className='remove-quickformtranshipment btn btn-danger btn-xs' onClick={() => formContext.FieldArrayHandle("remove", index)}><span className='fa fa-times'></span></button>
                                    </div> */}
                                    <div className='col-md-2'>
                                        <label style={{ fontSize: "12px" }}>POT Port Code</label>
                                        <div className='form-group input-group mb-3'>
                                            <Controller
                                                name={`TransferVoyageTranshipment[${index}][TransferVoyagePortCode]`}
                                                id={`${formNameLowerCase}hastranshipment-${index}-transfervoyageportcode`}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        {...props.register(`TransferVoyageTranshipment[${index}][TransferVoyagePortCode]`)}
                                                        isClearable={true}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-transfervoyageportcode`}
                                                        value={
                                                            value
                                                                ? props.port.find((c) => c.value === value)
                                                                : null
                                                        }
                                                        onChange={(val) => {
                                                            val == null ? onChange(null) : onChange(val.value);
                                                            onChangePOTPortCode(val, `${formNameLowerCase}hastranshipment-${index}-portcode`, index)
                                                        }}
                                                        options={props.port}
                                                        className={`transhipmentQuickform QuickFormPortCode form-control AllocatePortCode liveData Live_Area`}
                                                        classNamePrefix="select"
                                                        styles={{
                                                            ...globalContext.customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                        }}                                                />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-2'>
                                        <div className="form-group">
                                            <label className="control-label">Previous Voyage Num</label>
                                            <input className="form-control previousVoyageNumPOT" {...props.register(`TransferVoyageTranshipment[${index}][PreviousVoyage]`)} readOnly/>
                                            <input type="hidden" className='form-control oripotvoyage' {...props.register(`TransferVoyageTranshipment[${index}][PreviousVoyageUUID]`)}/>
                                        </div>
                                    </div>

                                    <div className={`col-md-3 mr-4 transhipmentVoyagedisplay`}>
                                        <label style={{ fontSize: "12px" }}>Voyage Num</label>
                                        <div className='form-group input-group mb-3'>
                                            <Controller
                                                name={`TransferVoyageTranshipment[${index}][TransferVoyagePOTVoyage]`}
                                                id={`${formNameLowerCase}hastranshipment-${index}-transfervoyagepotvoyage`}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        {...props.register(`TransferVoyageTranshipment[${index}][TransferVoyagePOTVoyage]`)}
                                                        isClearable={true}
                                                        id={`${formNameLowerCase}hastranshipment-${index}-transfervoyagepotvoyage`}
                                                        value={
                                                            value
                                                                ? item.optionFromVoyage?item.optionFromVoyage.find((c) => c.value === value)
                                                                : null
                                                                : null
                                                        }
                                                        onChange={(val) => {
                                                            val == null ? onChange(null) : onChange(val.value);
                                                            FindVoyageFromTranshipmentDetails(val, `${formNameLowerCase}hastranshipment-${index}-transfervoyagepotvoyage`, index);
                                                            onChangePOTVoyageNum(val, `${formNameLowerCase}hastranshipment-${index}-transfervoyagepotvoyage`, index)
                                                        }}
                                                        options={item.optionFromVoyage}
                                                        className={`transhipmentQuickform TransferVoyageVoyageNum AllocateVoyage form-control`}
                                                        classNamePrefix="select"
                                                        onMenuOpen={() => { FindPOTVoyage(index) }}
                                                        styles={{
                                                            ...globalContext.customStyles,
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                                        }}                                                
                                                    />
                                                )}
                                            />

                                            <div className='input-group-btn' style={{ height: "31px" }}>
                                                <button className='btn btn-outline-secondary AllocateVoyageButton1' type='button' style={{ height: "31px" }} data-toggle='popover' onClick={val => potVoyageAllocation(val)}><i className='fa fa-info'></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class={`col-md-3 transhipmentVesseldisplay d-none`}>
                                        <label style={{ fontSize: "12px" }}>Vessel Code</label>
                                        <div class='form-group input-group mb-3'>
                                            <input class='transhipmentQuickform QuickFormVesselCode form-control' {...props.register(`TransferVoyageTranshipment[${index}][TransferVoyagePOTVesselCode]`)}></input>
                                        </div>
                                    </div>
                                    <div className={`col-md-2`}>
                                        <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-dischargingdate`}>
                                            <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-dischargingdate`}>Discharging Date</label>
                                            <Controller 
                                                name={`TransferVoyageTranshipment[${index}][DischargingDate]`}
                                                id={`${formNameLowerCase}hastranshipment-${index}-loadingdate`}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <>  
                                                        <Flatpickr
                                                            {...props.register(`TransferVoyageTranshipment[${index}][DischargingDate]`)}
                                                            style={{backgroundColor: "white"}}
                                                            value={(value)}
                                                            onChange={val => {
                                                                val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),"dischargingDate");
                                                                // val == null ? formContext.setStateHandle(null,"dischargingDate"): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY H:mm"),"dischargingDate")
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
                                    <div className="col-md-2">
                                        <div className={`form-group field-${formNameLowerCase}hastranshipment-${index}-loadingdate`}>
                                            <label className="control-label" htmlFor={`${formNameLowerCase}hastranshipment-${index}-loadingdate`}>Loading
                                                Date</label>
                                            <Controller 
                                                name={`TransferVoyageTranshipment[${index}][LoadingDate]`}
                                                id={`${formNameLowerCase}hastranshipment-${index}-loadingdate`}
                                                control={props.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <>  
                                                        <Flatpickr
                                                            {...props.register(`TransferVoyageTranshipment[${index}][LoadingDate]`)}
                                                            style={{backgroundColor: "white"}}
                                                            value={(value)}
                                                            onChange={val => {
                                                                val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),"loadingDate");
                                                                // val == null ? formContext.setStateHandle(null,"loadingDate"): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY H:mm"),"loadingDate")
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
                                </div>
                            </div>
                        </div>
                    )
                })}

                <div className="col-md-2">
                    <div className="form-group field-transfervoyage-podportcode">
                        <label className={`control-label`} htmlFor="transfervoyage-podportcode">POD Port Code</label>
                        <Controller
                            name={"TransferVoyage[PODPortCode]"}
                            id={"transfervoyage-podportcode"}
                            control={props.control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    {...props.register("TransferVoyage[PODPortCode]")}
                                    isClearable={true}
                                    data-target={"PODPortCode-ShippingInstructions"}
                                    id={"transfervoyage-podportcode"}
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
                                    className={`form-control pod_portcode getTerminalPortCode liveData Live_Area readOnlySelect`}
                                    classNamePrefix="select"
                                    styles={{
                                        ...globalContext.customStyles,
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                    }}                                
                                />
                            )}
                        />
                    </div>
                </div>


                <div className="col-md-2">
                    <div className="form-group">
                        <label className="control-label">Previous Voyage Num</label>
                        <input className="form-control previousVoyageNum" {...props.register("TransferVoyage[PODPreviousVoyageNum]")} readOnly/>
                        <input type="hidden" className='form-control oripodvoyage' {...props.register("TransferVoyage[PODPreviousVoyageNumUUID]")}/>
                    </div>
                </div>

                
                <div className={`col-md-3 OneOff`}>
                    <div className="form-group field-transfervoyage-voyagenum">
                        <label className="control-label" htmlFor="transfervoyage-voyagenum">Voyage Num</label>
                        <div className="input-group">
                            <Controller
                                name={"TransferVoyage[VoyageNum]"}
                                id={"transfervoyage-voyagenum"}
                                control={props.control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        {...props.register("TransferVoyage[VoyageNum]")}
                                        isClearable={true}
                                        data-target={"VoyageNum-ShippingInstructions"}
                                        id={"transfervoyage-voyagenum"}
                                        value={
                                            value
                                                ? formContext.transferVoyageVoyageNum.find((c) => c.value === value)
                                                : null
                                        }
                                        onChange={(val) => {
                                            val == null ? onChange(null) : onChange(val.value);
                                            VoyageNumOnChangeHandle(val);
                                            FindVoyageNumberDetail(val)
                                        }}
                                        options={formContext.transferVoyageVoyageNum}
                                        className={`form-control AllocateVoyage AllScheduleVoyage`}
                                        classNamePrefix="select"
                                        onMenuOpen={val => FindVoyage(val)}
                                        styles={{
                                            ...globalContext.customStyles,
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                        }}                                    
                                    />
                                )}
                            />
                            <div className={`input-group-append`} style={{ cursor: "pointer" }}><button type="button" className="btn btn-outline-secondary AllocateVoyageButton1" data-toggle="popover" onClick={val => potVoyageAllocation(val)} data-placement="bottom"><i className="fa fa-info"></i></button></div>
                        </div>
                    </div>
                </div>
                <div className={`col-md-3 d-none`}>
                    <div className="form-group field-transfervoyage-vesselcode">
                        <label className="control-label" htmlFor="transfervoyage-vesselcode">Vessel Code</label>
                        <input type="text" id="transfervoyage-vesselcode" className="form-control" {...props.register("TransferVoyage[VesselCode]")} />
                    </div>
                </div>

                <div className={`col-md-3 OneOff`}>
                    <div className="form-group">
                        <label className="control-label">QT No.</label>
                        <Controller
                           name={"TransferVoyage[Quotation]"}
                           control={props.control}
                           render={({ field: { onChange, value } }) => (
                               <Select
                                   {...props.register("TransferVoyage[Quotation]")}
                                   isClearable={true}
                                   value={
                                       value
                                       ? formContext.QTOption?formContext.QTOption.find((c) => c.value === value)
                                       : null
                                       : null
                                   }
                                   onChange={(val) =>{
                                       val == null ? onChange(null) : onChange(val.value);
                                    //    val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(val.value,res.dataTarget);
                                    //    res.onChange && res.onChange(val);
                                   }}
                                   options={formContext.QTOption?formContext.QTOption:""}
                                   className={`form-control`}
                                   classNamePrefix="select"
                                   menuPortalTarget={document.body}
                                   onMenuOpen={val => FindQuotation(val)}
                                   styles={{
                                    ...globalContext.customStyles,
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}                               />
                           )}
                        />
                    </div>    
                </div>

                <input type ="hidden" id = "TransferPODeta" {...props.register("TransferVoyage[TransferPODeta]")}/>
                <input type ="hidden" id = "TransferPODetd" {...props.register("TransferVoyage[TransferPODetd]")}/>
                <input type ="hidden" id = "TransferPODScnCode" {...props.register("TransferVoyage[TransferPODScnCode]")}/>
            </div>
        </>
    )

}

export default TransferVoyageModal