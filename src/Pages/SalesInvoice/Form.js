import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, GetUserDetails ,getAreaById,getPortDetails,getPortDetailsById,getVoyageByIdSpecial,FindRemainingBC,getINVTransferFromBooking, sortArray } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
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
import QuickForm from './QuickForm';
import FormContext from '../../Components/CommonElement/FormContext';   
import Attention from './Attention';
import Instruction from './Instruction';
import Document from './Document';
import More from './More';
import {AttentionModal, DNDModal, VoyageModal, ContainerModal, CurrencyModal} from '../../Components/ModelsHelper';
import ShareInitialize from '../../Components/CommonElement/ShareInitialize';


function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    const [valid, setValid] = useState(1)
    const { register, handleSubmit, getValues, setValue, trigger, reset, control, watch, formState: { errors } } = useForm({  mode: "onChange"});

    const {fields,append,prepend,remove,swap,move,insert,update,replace} = useFieldArray({
        control,
        name: "SalesInvoiceHasTranshipment"
    });
    //share for all
    const CustomerType = [{ "value": "Agent", "label": "Agent" }, { "value": "Bill To", "label": "Bill To" }, { "value": "Shipper", "label": "Shipper" }, { "value": "Consignee", "label": "Consignee" },{ "value": "Notify Party", "label": "Notify Party" },{ "value": "Attention Party", "label": "Consignee" },{ "value": "Others", "label": "Others" }]
    const [defaultPortTerm, setDefaultPortTerm] = useState("----c1d43831-d709-11eb-91d3-b42e998d11ff")
    const [defaultCurrency, setDefaultCurrency] = useState("----942c4cf1-d709-11eb-91d3-b42e998d11ff")
    const [user, setUser] = useState("")
    const [creditTerm, setCreditTerm] = useState("")
    const [port, setPort] = useState("")
    const [portTerm, setPortTerm] = useState("")
    const [freightTerm, setFreightTerm] = useState("")
    const [taxCode, setTaxCode] = useState("")
    const [cargoType, setCargoType] = useState("")
    const [bookingConfirmation, setBookingConfirmation] = useState("")
    const [quotationOptions, setQuotationOptions] = useState("")
    const [bookingConfirmationOptions, setBookingConfirmationOptions] = useState("")
    const [billOfLadingOptions, setBillOfLadingOptions] = useState("")
    const [customerType, setCustomerType] = useState("")
    const [checkErrorContainer, setCheckErrorContainer] = useState([])

    //document
    const [docDate, setDocDate] = useState("")
    const [lastValidDate, setLastValidDate] = useState("")
    const [advanceBookingStartDate, setAdvanceBookingStartDate] = useState("")
    const [advanceBookingLastValidDate, setAdvanceBookingLastValidDate] = useState("")
    const [salesPerson, setSalesPerson] = useState("")
    const [quotationType, setQuotationType] = useState("")
    const [currency, setCurrency] = useState("")
    const [bargeCode, setBargeCode] = useState("")

    //instruction
    const [pOLReqETA, setPOLReqETA] = useState("")
    const [pODReqETA, setPODReqETA] = useState("")
    const [optionPOLTerminal, setOptionPOLTerminal] = useState([])
    const [optionPODTerminal, setOptionPODTerminal] = useState([])
    const [optionPOLAgentCompany, setOptionPOLAgentCompany] = useState([])
    const [optionPODAgentCompany, setOptionPODAgentCompany] = useState([])
    const [optionPOLAgentCompanyBranch, setOptionPOLAgentCompanyBranch] = useState([])
    const [optionPODAgentCompanyBranch, setOptionPODAgentCompanyBranch] = useState([])
    const [defaultFinalDestinationCompany, setDefaultFinalDestinationCompany] = useState([])
    const [quickFormVoyageNum, setQuickFormVoyageNum] = useState([])
    const [VoyageNum, setVoyageNum] = useState([])

    //container
    const [containerType, setContainerType] = useState([])   

    //getUpdateDataState
    const [documentData, setDocumentData] = useState([])   
    const [instructionData, setInstructionData] = useState([])   
    const [moreData, setMoreData] = useState([])   
    const [shippingInstructionQuickFormData, setShippingInstructionQuickFormData] = useState([])   
    const [containerQuickFormData, setContainerQuickFormData] = useState([])   
    const [containerInnerQuickFormData, setContainerInnerQuickFormData] = useState([])    
    const [middleCardQuickFormData, setMiddleCardQuickFormData] = useState([])   
    const [attentionData, setAttentionData] = useState([])   
    const [containerTypeAndChargesData, setContainerTypeAndChargesData] = useState([])
    const [transhipmentData, setTranshipmentData] = useState([])
    const [verificationStatus, setVerificationStatus] = useState("")
    const [resetStateValue, setResetStateValue] = useState([])
    const [bookingConfirmationUUID, setBookingConfirmationUUID] = useState([])
    
    const onSubmit = (data, event) => {
        event.preventDefault();
        var tempForm=$("form")[0]


        $(tempForm).find(".PermitAttachmentCheckbox").each(function(){
            if($(this).prop("checked")){
                 $(this).next().val("1");
            }else{
                $(this).next().val("0");
            }
        })
        
        $(tempForm).find(".inputDecimalThreePlaces").each(function(){
            var value1 = $(this).val();
            if (value1 !== "") {
                $(this).val(parseFloat(value1).toFixed(4));

            }
        })
        $(tempForm).find(".inputDecimalTwoPlaces").each(function(){
            var value1 = $(this).val();
            if (value1 !== "") {
                $(this).val(parseFloat(value1).toFixed(4));

            }
        })
        $(tempForm).find(".inputDecimalFourPlaces").each(function(){
            var value1 = $(this).val();
            if (value1 !== "") {
                $(this).val(parseFloat(value1).toFixed(4));

            }
        })

        var formdata = new FormData($("form")[0]);
        if(!checkErrorContainer.SalesInvoiceHasContainerType){
            ControlOverlay(true)
            if (formState.formType == "New" || formState.formType == "Clone" || formState.formType == "TransferFromBooking") {

                CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                    if (res.data) {
                        if (res.data.message == "Sales Invoice has already been taken.") {
                            ToastNotify("error", res.data.message)
                            ControlOverlay(false)
                        }
                        else {
                            ToastNotify("success", "Sales Invoice created successfully.")
                            if(props.data.modelLink=="sales-invoice-barge"){
                                navigate("/sales/standard/sales-invoice-barge/update/id=" + res.data.data.SalesInvoiceUUID, { state: { formType: "Update", id: res.data.data.SalesInvoiceUUID } })
                            }else{
                                navigate("/sales/container/sales-invoice/update/id=" + res.data.data.SalesInvoiceUUID, { state: { formType: "Update", id: res.data.data.SalesInvoiceUUID } })
                            }
                           
                        }
                    }

                })
            }
            else {

                UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                    if (res.data.data) {
                        ToastNotify("success", "Sales Invoice updated successfully.")
                        if(props.data.modelLink=="sales-invoice-barge"){
                            navigate("/sales/standard/sales-invoice-barge/update/id=" + res.data.data.SalesInvoiceUUID, { state: { formType: "Update", id: res.data.data.SalesInvoiceUUID } })
                        }else{
                            navigate("/sales/container/sales-invoice/update/id=" + res.data.data.SalesInvoiceUUID, { state: { formType: "Update", id: res.data.data.SalesInvoiceUUID } })
                        }

                     

                    }
                    else {
                        ToastNotify("error", "Error")
                        ControlOverlay(false)
                    }
                })

            }
        }   
        else{
            alert("Please complete all required fields before submit.")
        }
    }

    function setStateHandle (val,target) {
        if(target === "DocDate" || target === "AdvanceBookingStartDate"){
            setDocDate(val)
        }
        if(target === "SalesPerson"){
            setSalesPerson(val)
        }
        if(target === "Currency"){
            setDefaultCurrency(val)
        }        
        if(target === "QuotationType"){
            setQuotationType(val)
        }
        if(target === "LastValidDate" || target === "AdvanceBookingLastValidDate"){
            setLastValidDate(val)
        }
        if(target === "AdvanceBookingStartDate"){
            setAdvanceBookingStartDate(val)
        }
        if(target === "AdvanceBookingLastValidDate"){
            setAdvanceBookingLastValidDate(val)
        }
        if(target === "OptionPOLTerminal"){
            setOptionPOLTerminal(val)
        }
        if(target === "OptionPODTerminal"){
            setOptionPODTerminal(val)
        }
        if(target === "OptionPOLAgentCompany"){
            setOptionPOLAgentCompany(val)
        }
        if(target === "OptionPODAgentCompany"){
            setOptionPODAgentCompany(val)
        }
        if(target === "OptionPOLAgentCompanyBranch"){
            setOptionPOLAgentCompanyBranch(val)
        }
        if(target === "OptionPODAgentCompanyBranch"){
            setOptionPODAgentCompanyBranch(val)
        }     
        if(target === "VoyageNum"){
            setVoyageNum(val)
        }   
        if(target === "QuickFormVoyageNum"){
            setQuickFormVoyageNum(val)
        }   
        if(target === "polreqeta"){
            setPOLReqETA(val)
        }
        if(target === "podreqeta"){
            setPODReqETA(val)
        }
        if(target === "CustomerType"){
            setCustomerType(val)
        }
    } 

    function FieldArrayHandle(action,data){
        if(action == "remove"){
            remove(data)
        }
        if(action == "append"){
            if(data){
                data.QuickFormPOTPortTerm = defaultPortTerm;
                data.POTPortTerm = defaultPortTerm;
                append(data)
                const POTVoyage={value:data.FromVoyageNum,label:data.FromVoyageName}
                const PODVoyage={value:data.ToVoyageNum,label:data.ToVoyageName+"("+data.ToVesselCode+")"}
                setValue("SalesInvoiceHasTranshipment[0][QuickFormPOTVoyage]",data.FromVoyageNum)
                onChangePOTVoyageNum(POTVoyage,"",0)
                VoyageNumOnChangeHandle(PODVoyage)
            }else{
                append({
                    name: "SalesInvoiceHasTranshipment", 
                    POTPortTerm:defaultPortTerm,
                    QuickFormPOTPortTerm:defaultPortTerm,
                    optionTerminal:[],
                    optionAgentCompany:[],
                    optionAgentBranchCode:[],
                    optionFromVoyage:[],
                    optionToVoyage:[],
    
                })
            }
        }
    }

    //Advance Booking Start Date &  Advance Booking Last Valid Date show only if sales-invoice type onchange = Advance booking
    function changeQuotationType(current) {
        if(current){
            var str = current.value;
            if (str == "Advance Booking") {
            
                $(".AdvanceBooking").removeClass('d-none');
                $(".NormalBooking").addClass('d-none');
                var docDateForAdvanceBooking = $("#sales-invoice-docdate").val()
                $("#sales-invoice-advancebookingstartdate-quickform").val(docDateForAdvanceBooking)
                $("#sales-invoice-advancebookingstartdate").val(docDateForAdvanceBooking)
            }
            else {
                $(".AdvanceBooking").addClass('d-none');
                $(".NormalBooking").removeClass('d-none');
            }
    
            if (str == "One-Off") {
    
                $(".OneOff").removeClass('d-none');
                $(".transhipmentVoyagedisplay").removeClass('d-none');
                $(".transhipmentVesseldisplay").removeClass('d-none');
                $("#dynamicmodel-voyagenum").attr("required", true);
            }
            else {
                $(".OneOff").addClass('d-none');
                $(".transhipmentVoyagedisplay").addClass('d-none');
                $(".transhipmentVesseldisplay").addClass('d-none');
                $("#dynamicmodel-voyagenum").attr("required", false);
            }
        }
    }

    function onChangePOTVoyageNum(currentSelector,id,index){
        setValue("DynamicModel[VoyageNum]","")
        setStateHandle([],"QuickFormVoyageNum")
        $("#dynamicmodel-vesselcode").val("")
        if(currentSelector){
            var regExp = /\(([^)]+)\)/;
            var ToVoyageNum = getValues(`DynamicModel[VoyageNum]`)
            var result;
            var startingIndex;
            var startingVesselName;
            var insideBracketVessel;
            var vesselCode;
            var VoyageNum = currentSelector.value;
            var index = index
            var closestVesselCode = $(`#quotationhastranshipment-${index}-quickformpotvoyage`).parent().parent().next().find(".QuickFormVesselCode");
            var filters = {
                "VoyageUUID": $(this).val(),
            };
    
            var text = currentSelector.label;
            var matches = regExp.exec(text);
    
            var PolPortcode = getValues("DynamicModel[POLPortCode]")
            var PodPortcode = getValues("DynamicModel[PODPortCode]")
            var PotPortcode = getValues(`SalesInvoiceHasTranshipment[${index}][QuickFormPortCode]`)
            var prevPortCode
            
            if (index > 0) {
                startingIndex = index - 1;
                startingVesselName = getValues("#quotationhastranshipment-" + startingIndex + "-fromvesselcode")
                prevPortCode = getValues("#quotationhastranshipment-" + startingIndex + "-portcode")
                setValue("#quotationhastranshipment-" + startingIndex + "-tovoyagenum", VoyageNum)
            }
    
            // $("#quotationhastranshipment-" + index + "-fromvoyagenum").val(VoyageNum).trigger('change.select2')
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

            getVoyageByIdSpecial(result,globalContext).then(data => {
                var voyageSchedulesLength = data[0]["voyageSchedules"].length;

                var countPOT = 0;
                var foundPOL = false;
                var foundPOD = false;
                $.each(data[0]["voyageSchedules"], function (key, value) {
                
                    if (value.PortCode == PolPortcode) {


                        if (countPOT == repeatedVoyage) {
                            if (index == 0) {
                                setValue(`SalesInvoice[POLETA]`,value.ETA)
                                setValue(`SalesInvoice[POLETD]`,value.ETD)
                                setValue(`SalesInvoice[POLSCNCode]`,value.SCNCode)
                                setValue(`SalesInvoice[ClosingDateTime]`,value.ClosingDateTime)
                                $("#sales-invoice-voyage-pol").val(value.VoyageScheduleUUID)
                                
                                if(!value.LocationCode){
                                    setValue(`SalesInvoice[POLLocationCode]`,value.LocationCode)
                                    setValue(`SalesInvoice[POLLocationName]`,"")
                                    setValue(`SalesInvoice[POLAgentROC]`,"")
                                    setValue(`SalesInvoice[POLAgentName]`,"")
                                    setValue(`SalesInvoice[POLHandlingOfficeCode]`,"")
                                    setValue(`SalesInvoice[POLHandlingOfficeName]`,"")
                                }else{
                                    setValue(`SalesInvoice[POLLocationCode]`,value.LocationCode)
                                    $.each(value.terminalSelection, function (key1, value1) {
                                        
                                        if(value1.PortDetailsUUID == value.LocationCode){
                                            var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                            var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                            setStateHandle(sortArray(optionCompany),"OptionPOLAgentCompany")
                                            setStateHandle(sortArray(optionCompanyBranch),"OptionPOLAgentCompanyBranch")
                                            setValue(`SalesInvoice[POLLocationName]`,value1.LocationCode)
                                            setValue(`SalesInvoice[POLAgentROC]`,value1.handlingCompany.AgentCode)
                                            setValue(`SalesInvoice[POLAgentName]`,value1.handlingCompany.CompanyUUID)
                                            setValue(`SalesInvoice[POLHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                            setValue(`SalesInvoice[POLHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                        }
                                    })
                                }
                                foundPOL = true;
                            }
                        }
                        countPOT++;
                    }

                    if (value.PortCode == PotPortcode) {

                        setValue(`SalesInvoiceHasTranshipment[${index}][DischargingDate]`,value.ETA)
                        setValue(`SalesInvoiceHasTranshipment[${index}][FromVoyagePOT]`,value.VoyageScheduleUUID)
                    
                    }
                    if (value.PortCode == prevPortCode) {
                    //  var ETA = (value.ETA).split(" ");
                        setValue(`SalesInvoiceHasTranshipment[${startingIndex}][LoadingDate]`,value.ETA)
                        setValue(`SalesInvoiceHasTranshipment[${startingIndex}][ToVoyagePOT]`,value.VoyageScheduleUUID)
                    }

                    if (value.PortCode == PotPortcode && foundPOL && foundPOD == false) {
                        if (index == 0) {
                            setValue(`SalesInvoice[PODETA]`,value.ETA)
                            setValue(`SalesInvoice[PODETD]`,value.ETD)
                            setValue(`SalesInvoice[PODSCNCode]`,value.SCNCode)
                            
                            foundPOD = true;
                        }
                    }

                });

                if (index == 0) {
                    var temArray = [currentSelector]
                    setStateHandle(temArray,"VoyageNum")
                    setValue(`SalesInvoice[VoyageNum]`,VoyageNum)
                    $("#sales-invoice-vesselcode").val(data[0]["vessel"]["VesselCode"])
                    $("#sales-invoice-voyagename").val(StrvoyageNo)
                    $.each(data, function (key, value) {
                        $("#sales-invoice-vesselname").val(value.vessel.VesselName)
                        setValue("SalesInvoiceHasTranshipment["+index+"][QuickFormPOTVesselCode]", value.vessel.VesselName)
                    })

                }

                if (foundPOL == false) {
                    if (index == 0) {
                        setValue(`SalesInvoice[POLETA]`,"")
                        setValue(`SalesInvoice[POLETD]`,"")
                        setValue(`SalesInvoice[POLSCNCode]`,"")
                        setValue(`SalesInvoice[ClosingDateTime]`,"")
                    }
                }

                if (foundPOD == false) {
                    if (index == 0) {
                        //alert("POD Port Code Not Available for Selected Voyage")
                        setValue(`SalesInvoice[PODETA]`,"")
                        setValue(`SalesInvoice[PODETD]`,"")
                        setValue(`SalesInvoice[PODSCNCode]`,"")
                    }
                }

                if (closestVesselCode.val() == startingVesselName) {
                    $("#quotationhastranshipment-" + startingIndex + "-dischargingdate").val("");
                    $("#quotationhastranshipment-" + startingIndex + "-loadingdate").val("");
                }
            })
        }
    }

    function ApprovedStatusReadOnlyForAllFields () {
        setTimeout(() => {
            $(".save").prop("disabled",true);
            
            $(".form-control").each(function () {
                $(this).addClass("readOnlySelect")
                $(this).prop("disabled",true)
            });

            $(".basic-single").each(function () {
                $(this).addClass("readOnlySelect")
            });

            $(".c-date-picker").each(function () {
                $(this).addClass("pointerEventsStyle")
                $(this).prop("disabled",true)
            });

            $("#ChooseContainer").prop("disabled",true)
            $(".getAttentionSelections").prop("disabled",true)
            $(".getVoyageSelections").prop("disabled",true)
            $("#mainLoadTariff").addClass("d-none")
            $("#clearTableData").addClass("d-none")
            $(".add-charges").addClass("d-none")
            $(".add-container").addClass("d-none")
            $(".add-chargesNestedfake").addClass("d-none")
            $(".RemoveContainer").addClass("d-none")
            $(".RemoveCharges").addClass("d-none")
            $(".RemoveNestedCharges").addClass("d-none")
            $("#transhipmentQuickForm").addClass("d-none")
            $(".add-transhipment").addClass("d-none")
            
            $("input[type='checkbox']:not(.keep-enabled)").prop("disabled", true);
        }, 50)
    }

    function RemoveAllReadOnlyFields () {
        setTimeout(() => {

            $(".save").prop("disabled",false);
            
            $(".form-control").not(".bargeRelatedField").not(".OriReadOnlyClass").each(function () {
                $(this).removeClass("readOnlySelect")
                $(this).prop("disabled",false)
            });

            $(".basic-single").not(".bargeRelatedField").not(".OriReadOnlyClass").each(function () {
                $(this).removeClass("readOnlySelect")
            });

            $(".c-date-picker").not(".bargeRelatedField").not(".OriReadOnlyClass").each(function () {
                $(this).removeClass("pointerEventsStyle")
                $(this).prop("disabled",false)
            });

            $("#ChooseContainer").prop("disabled",false)
            $(".getAttentionSelections").prop("disabled",false)
            $(".getVoyageSelections").prop("disabled",false)
            $("#mainLoadTariff").removeClass("d-none")
            $("#clearTableData").removeClass("d-none")
            $(".add-charges").removeClass("d-none")
            $(".add-container").removeClass("d-none")
            $(".add-chargesNestedfake").removeClass("d-none")
            $(".RemoveContainer").removeClass("d-none")
            $(".RemoveCharges").removeClass("d-none")
            $(".RemoveNestedCharges").removeClass("d-none")
            $(".loadTariff").removeClass("d-none")
            $("#transhipmentQuickForm").removeClass("d-none")
            $(".add-transhipment").removeClass("d-none")
    
            $("input[type='checkbox']").prop("disabled",false)
        }, 50)
    }

    function VoyageNumOnChangeHandle (data) {
        setStateHandle([data],"QuickFormVoyageNum")
        setValue("DynamicModel[VoyageNum]",data.value)
        var index = 0

        if(data) {
            if ($(".transhipment-item").length < 1) {
                setValue(`SalesInvoice[VoyageNum]`,data.value)
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
            $(`#quotationhastranshipment-` + index + "-tovoyagenum").val(value).trigger('change.select2')

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
                if (index == 0) {
                    starting = getValues("DynamicModel[POLPortCode]")
                    // startingIndex = index - 1
                    startingVesselName = $(`#quotationhastranshipment-0-fromvesselname`).val()
                } else {
                    starting = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val();
                    startingIndex = index - 1
                    startingVesselName = $(`#quotationhastranshipment-` + startingIndex + "-tovesselname").val()
                }

                var PodPortcode = getValues("DynamicModel[PODPortCode]")
                var PotPortcode = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val();
                // var ChooiceArray = [];

                getVoyageByIdSpecial(result,globalContext).then(data => {
                var VoyageArray = []
                try {
                    $.each(data, function (key, value) {
                        VoyageArray.push({value:value.VoyageUUID, label:value.VoyageNumber+"("+value.vessel.VesselCode+")"})
                    });
                }
                catch (err) {
                }
                setValue(`SalesInvoiceHasTranshipment[${index}][optionToVoyage]`,sortArray(VoyageArray))
                update(fields)
                setValue(`SalesInvoiceHasTranshipment[${index}][ToVoyageNum]`,data[0]["VoyageUUID"])
                $(`#quotationhastranshipment-` + index + "-tovoyagename").val(data[0]["VoyageNumber"])
                $(`#quotationhastranshipment-` + index + "-tovesselcode").val(data[0]["vessel"]["VesselCode"])
                $(`#quotationhastranshipment-` + index + "-tovesselname").val(data[0]["vessel"]["VesselName"])
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

                            setValue(`SalesInvoiceHasTranshipment[${index}][LoadingDate]`,value.ETA)
                            setValue(`SalesInvoiceHasTranshipment[${index}][ToVoyagePOT]`,value.VoyageScheduleUUID)
                        }

                        countPOT++;

                    }

                    if (value.PortCode == PodPortcode && foundPOL && foundPOD == false) {
                            setValue(`SalesInvoice[PODETA]`,value.ETA)
                            setValue(`SalesInvoice[PODETD]`,value.ETD)
                            setValue(`SalesInvoice[PODSCNCode]`,value.SCNCode)
                            $(`#sales-invoice-voyage-pod`).val(value.VoyageScheduleUUID)

                            if(!value.LocationCode){
                                setValue(`SalesInvoice[PODLocationCode]`,value.LocationCode)
                                setValue(`SalesInvoice[PODLocationName]`,"")
                                setValue(`SalesInvoice[PODAgentROC]`,"")
                                setValue(`SalesInvoice[PODAgentName]`,"")
                                setValue(`SalesInvoice[PODHandlingOfficeCode]`,"")
                                setValue(`SalesInvoice[PODHandlingOfficeName]`,"")
                            }else{
                                setValue(`SalesInvoice[PODLocationCode]`,value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {

                                    if(value1.PortDetailsUUID == value.LocationCode){
                                        var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                        var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                        setStateHandle(sortArray(optionCompany),"OptionPODAgentCompany")
                                        setStateHandle(sortArray(optionCompanyBranch),"OptionPODAgentCompanyBranch")
                                        setValue(`SalesInvoice[PODLocationName]`,value1.LocationCode)
                                        setValue(`SalesInvoice[PODAgentROC]`,value1.handlingCompany.AgentCode)
                                        setValue(`SalesInvoice[PODAgentName]`,value1.handlingCompany.CompanyUUID)
                                        setValue(`SalesInvoice[PODHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                        setValue(`SalesInvoice[PODHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }

                        // }

                        foundPOD = true;
                        countPOD++;
                    }

                    if (value.PortCode == PodPortcode && index == 0) {
                            setValue(`SalesInvoice[PODETA]`,value.ETA)
                            setValue(`SalesInvoice[PODETD]`,value.ETD)
                            setValue(`SalesInvoice[PODSCNCode]`,value.SCNCode)
                            $(`#sales-invoice-voyage-pod`).val(value.VoyageScheduleUUID)

                            if(!value.LocationCode){
                                setValue(`SalesInvoice[PODLocationCode]`,value.LocationCode)
                                setValue(`SalesInvoice[PODLocationName]`,"")
                                setValue(`SalesInvoice[PODAgentROC]`,"")
                                setValue(`SalesInvoice[PODAgentName]`,"")
                                setValue(`SalesInvoice[PODHandlingOfficeCode]`,"")
                                setValue(`SalesInvoice[PODHandlingOfficeName]`,"")
                            }else{
                                setValue(`SalesInvoice[PODLocationCode]`,value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {
                                    if(value1.PortDetailsUUID == value.LocationCode){
                                        var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                        var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                        setStateHandle(sortArray(optionCompany),"OptionPODAgentCompany")
                                        setStateHandle(sortArray(optionCompanyBranch),"OptionPODAgentCompanyBranch")
                                        setValue(`SalesInvoice[PODLocationName]`,value1.LocationCode)
                                        setValue(`SalesInvoice[PODAgentROC]`,value1.handlingCompany.AgentCode)
                                        setValue(`SalesInvoice[PODAgentName]`,value1.handlingCompany.CompanyUUID)
                                        setValue(`SalesInvoice[PODHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                        setValue(`SalesInvoice[PODHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }
                            foundPOD = true;
                    }

                }); 

                if (ToVesselName == startingVesselName) {
                        setValue(`SalesInvoiceHasTranshipment[${index}][LoadingDate]`,"")
                        setValue(`SalesInvoiceHasTranshipment[${index}][DischargingDate]`,"")
                }

                })
            } else {
                setValue(`SalesInvoiceHasTranshipment[${index}][optionToVoyage]`,[])
                update(fields)
                setValue(`SalesInvoiceHasTranshipment[${index}][ToVoyageNum]`,"")
                $(`#quotationhastranshipment-` + index + "-tovoyagename").val("")
                $(`#quotationhastranshipment-` + index + "-tovesselcode").val("")
                $(`#quotationhastranshipment-` + index + "-tovesselname").val("")
                $("#dynamicmodel-vesselcode").val("")
                setValue(`SalesInvoiceHasTranshipment[${index}][LoadingDate]`,"")
                if (index == 0) {
                    setValue(`SalesInvoice[PODETA]`,"")
                    setValue(`SalesInvoice[PODETD]`,"")
                    setValue(`SalesInvoice[PODSCNCode]`,"")
                }
            }
        }else{
            $(`#sales-invoice-voyage-pod`).val("")
            setValue(`SalesInvoice[VoyageNum]`,"")
            setValue(`SalesInvoiceHasTranshipment[${index}][ToVoyageNum]`,"")
            $(`#quotationhastranshipment-` + index + "-tovoyagename").val("")
            $(`#quotationhastranshipment-` + index + "-tovesselcode").val("")
            $(`#quotationhastranshipment-` + index + "-tovesselname").val("")
            $("#dynamicmodel-vesselcode").val("")
        }
    }

    function GetUpdateCLoneData(id) {
        GetUpdateData(id, globalContext, props.data.modelLink).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}
            
            if (formState.formType == "Clone") {
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var nowDate = date + '/' + month + '/' + year;
                setDocDate(nowDate)
                res.data.data.SalesInvoice.DocNum = ""

                $.each(res.data.data.SalesInvoiceHasContainerType, function (key,value){
                    res.data.data.SalesInvoiceHasContainerType[key]["SalesInvoiceHasContainer"] =[]
                })
            }

            if (res.data.data.SalesInvoice) {
               setDocumentData(res.data.data.SalesInvoice)
                if( props.data.modelLink=="sales-invoice-barge"){
                    setInstructionData(res.data.data.SalesInvoice)
                }

                $.each(res.data.data.SalesInvoice, function (key2, value2) {
                    if(key2=="CurrencyExchangeRate"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }else if(key2=="TotalTax"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }else if(key2=="TotalAmount"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }
                    if(formState.formType == "Clone"){
                        if(key2!="DocDate"){
                            setValue('SalesInvoice[' + key2 + ']', value2);
                            setValue('DynamicModel[' + key2 + ']', value2);
                        }

                    }else{
                        setValue('SalesInvoice[' + key2 + ']', value2);
                        setValue('DynamicModel[' + key2 + ']', value2);
                    }
                          //     // setValue('SalesInvoice[SalesPerson]', globalContext.authInfo.id);
               
                })
            }
            if (res.data.data.SalesInvoice) {
                ArrayAttention= res.data.data.SalesInvoice
            }
    
            setAttentionData(ArrayAttention)
            setMiddleCardQuickFormData(ArrayAttention)


            if(res.data.data.SalesInvoiceHasContainerType) {
                setContainerTypeAndChargesData(res.data.data.SalesInvoiceHasContainerType)
            }

            if (res.data.data.SalesInvoiceMore) {
                setMoreData(res.data.data.SalesInvoiceMore)
            }   


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)
            }

            if (res.data.data.SalesInvoice.VerificationStatus == "Pending"){
                $(".VerificationStatusField").text("Draft")
                setVerificationStatus("Pending")
            }else if (res.data.data.SalesInvoice.VerificationStatus == "Rejected"){
                $(".VerificationStatusField").text("Rejected")
                $(".VerificationStatusField").addClass("text-danger")
                setVerificationStatus("Rejected")
            }else{
                if(formState.formType != "Clone"){
                    setVerificationStatus("Approved")
                }else{
                    setVerificationStatus("")
                    RemoveAllReadOnlyFields()
                }
            }
            $(".VerificationStatusField").last().addClass("d-none")



            ControlOverlay(false)

        })
    }

    function TransferFromBooking(id) {
        var type;
        props.data.modelLink=="sales-invoice-barge"?type="barge":type="normal"
    
        getINVTransferFromBooking(id,formState.CustomerType,formState.BranchCode,formState.ChargesID, globalContext, props.data.modelLink,type).then(res => {

            var ArrayAttention = {}
            var ArrayMiddleCard = {}
            

            if (res.data.data.SalesInvoice) {
                if(formState.CustomerType){
                    res.data.data.SalesInvoice.CustomerType = formState.CustomerType
                }
                setDocumentData(res.data.data.SalesInvoice)
                if( props.data.modelLink=="sales-invoice-barge"){
                    setInstructionData(res.data.data.SalesInvoice)
                }
           
                

                $.each(res.data.data.SalesInvoice, function (key2, value2) {
                    if(key2=="CurrencyExchangeRate"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }else if(key2=="TotalTax"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }else if(key2=="TotalAmount"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }
                    
                    if(key2=="SalesPerson" || key2=="DocDate"){
                       
                    }else{
                        setValue('SalesInvoice[' + key2 + ']', value2);
                        setValue('DynamicModel[' + key2 + ']', value2);
                    }
                   
                })
            }
            if (res.data.data.SalesInvoice) {
                ArrayAttention= res.data.data.SalesInvoice
            }
    
            setAttentionData(ArrayAttention)
            setMiddleCardQuickFormData(ArrayAttention)


            if(res.data.data.SalesInvoiceHasContainerType) {
                setContainerTypeAndChargesData(res.data.data.SalesInvoiceHasContainerType)
            }
            if (res.data.data.SalesInvoiceMore) {
                setMoreData(res.data.data.SalesInvoiceMore)
            }


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)
            }

            if (res.data.data.SalesInvoice.VerificationStatus == "Pending"){
                $(".VerificationStatusField").text("Draft")
                setVerificationStatus("Pending")
            }else if (res.data.data.SalesInvoice.VerificationStatus == "Rejected"){
                $(".VerificationStatusField").text("Rejected")
                $(".VerificationStatusField").addClass("text-danger")
                setVerificationStatus("Rejected")
            }else{
                if(formState.formType != "Clone"){
                    setVerificationStatus("Approved")
                }else{
                    setVerificationStatus("")
                    RemoveAllReadOnlyFields()
                }
            }

            var date = new Date().getDate();
            var month = new Date().getMonth() + 1;
            var year = new Date().getFullYear();
            var nowDate = date + '/' + month + '/' + year;

            setDocDate(nowDate)

            ControlOverlay(false)
        })
    }

    useEffect(() => {
        if(docDate){
            var days = parseInt($(".validityDay").val()) - 1;
            var docdate = docDate
            var dateParts = docdate.split("/");
            var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            dateObject.setDate(dateObject.getDate() + days);
            var dd = dateObject.getDate();
    
            var mm = dateObject.getMonth() + 1;
            var yyyy = dateObject.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            dateObject = dd + '/' + mm + '/' + yyyy;
    
    
            setLastValidDate(dateObject)
    
            $("#sales-invoice-voyagenum").val("").trigger("change")
            $("#dynamicmodel-voyagenum").parent().find(".select2-container--default").addClass('InvalidField')
            $("#dynamicmodel-voyagenum").parent().parent().find('.help-block').text($("#dynamicmodel-voyagenum").parent().parent().find("label").text()+" cannot be blank")
        }
    
      return () => {
      }
    }, [docDate])


    useEffect(() => {
        // fill columns according to your data
        // start : navigation icon click function
        window.$(function () {
          window.$('[data-toggle="tooltip"]').tooltip({
            trigger: "hover",
          });
        });
    
        $("#toggleForm").find("." + $(".shortcut-buttons").find(".text-primary").attr('id')).removeClass('d-none')
        $(".icon").click(function () {
            if(this.id == "QuickForm"){
                $("#toggleForm").hide()
                $(".iconQuickForm").removeClass("text-primary").addClass(
                "text-secondary"
                ); // remove text primary text from icon quick form ** fa fa star **
                $(".icon").removeClass("text-primary").addClass(
                "text-secondary"
                ); // all icons removed text primary and given text secondary
                $(this).removeClass("text-secondary").addClass(
                "text-primary"
                )
            }
            else{
                if ($(this).hasClass("text-primary")) {
                    // if click navigation icon have primary text
                    $(this).removeClass("text-primary").addClass(
                    "text-secondary"); // remove the primary text and change to secondary
                    $(".iconQuickForm").removeClass("text-secondary").addClass(
                    "text-primary"); // add primary text to icon quick form ** fa fa star **
    
                    $("#toggleForm").hide()
            
            
                } else { // if click icon is not primary text
            
                    $(".DetailFormDetails").addClass("d-none"); // hide all form in the detail form
                    $("." + $(this).attr("id")).removeClass(
                    "d-none"); // show the correct detail form
                    $("#toggleForm").show(); // show the toggle form card
                    $(".icon-title").text($(this).attr(
                    "data-target")); // change the title to clicked icon attribute
                    $(".iconQuickForm").removeClass("text-primary").addClass(
                    "text-secondary"
                    ); // remove text primary text from icon quick form ** fa fa star **
                    $(".icon").removeClass("text-primary").addClass(
                    "text-secondary"
                    ); // all icons removed text primary and given text secondary
                    $(this).removeClass("text-secondary").addClass(
                    "text-primary"
                    ); // clicked icon remove text secondary and added text primary
            
                }
            }
          
        });
        // end : navigation icon click function

        $("#hideToggleForm").click(function () {
            $("#toggleForm").hide()
            $(".iconQuickForm").removeClass("text-primary").addClass(
            "text-secondary"
            ); // remove text primary text from icon quick form ** fa fa star **
            $(".icon").removeClass("text-primary").addClass(
            "text-secondary"
            ); // all icons removed text primary and given text secondary
            $(".quickformicon").removeClass("text-secondary").addClass(
            "text-primary"
            )
        })

        window.$("input[data-target='Detention']").on("change",function() {
            $("input[data-target='Detention']").val($(this).val())
        })
        window.$("input[data-target='Demurrage']").on("change",function() {
            $("input[data-target='Demurrage']").val($(this).val())
        })
        window.$("input[data-target='DNDCombinedDay']").on("change",function() {
            $("input[data-target='DNDCombinedDay']").val($(this).val())
        })

        $(".branchtelbillto").unbind().on('input', function (event) {
            var tempDataTarget=$(event.target).attr('data-target')
            $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
        });

       
        $(".branchemailbillto").unbind().on('input', function (event) {
            var tempDataTarget=$(event.target).attr('data-target')
            $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
        });

        $(".attentionnamebillto").unbind().on('input', function (event) {
            var tempDataTarget=$(event.target).attr('data-target')
            $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
        });


        $(".attentiontelbillto").unbind().on('input', function (event) {
            var tempDataTarget=$(event.target).attr('data-target')
            $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
        });


        $(".attentionemailbillto").unbind().on('input', function (event) {
            var tempDataTarget=$(event.target).attr('data-target')
            $(`input[data-target='${tempDataTarget}']`).val($(event.target).val());
        });
        
        GetUserDetails(globalContext).then(res => {
            if(res[0]["Company"]){
                setValue("SalesInvoice[ROC]",res[0]["Company"].CompanyUUID)
                $("#CompanyROC-Agent-DetailForm").val(res[0]["Company"].ROC)
                setValue("SalesInvoice[AgentCompanyName]",res[0]["Company"].CompanyName)
                setValue("SalesInvoice[CreditTerm]",res[0]["Company"].CreditTerm)
                setValue("SalesInvoice[CreditLimit]",res[0]["Company"].CreditLimit)
            }
            if(res[0]["Branch"]){
                setValue("SalesInvoice[BranchCode]",res[0]["Branch"].CompanyBranchUUID)
                $("#BranchCode-Agent-DetailForm").val(res[0]["Branch"].BranchCode)
                setValue("SalesInvoice[AgentBranchName]",res[0]["Branch"].BranchName)
                setValue("SalesInvoice[BranchTel]",res[0]["Branch"].Tel)
                setValue("SalesInvoice[BranchFax]",res[0]["Branch"].Fax)
                setValue("SalesInvoice[BranchEmail]",res[0]["Branch"].Email)
                setValue("SalesInvoice[BranchAddressLine1]",res[0]["Branch"].AddressLine1)
                setValue("SalesInvoice[BranchAddressLine2]",res[0]["Branch"].AddressLine2)
                setValue("SalesInvoice[BranchAddressLine3]",res[0]["Branch"].AddressLine3)
                setValue("SalesInvoice[BranchPostcode]",res[0]["Branch"].Postcode)
                setValue("SalesInvoice[BranchCity]",res[0]["Branch"].City)
                setValue("SalesInvoice[BranchCountry]",res[0]["Branch"].Country)
                setValue("SalesInvoice[BranchCoordinates]",res[0]["Branch"].Coordinates)
            }
            if(res[0]["companyContact"]){
                setValue("SalesInvoice[AttentionName]",res[0]["companyContact"].FirstName+" "+res[0]["companyContact"].LastName)
                setValue("SalesInvoice[AttentionTel]",res[0]["companyContact"].Tel)
                setValue("SalesInvoice[AttentionEmail]",res[0]["companyContact"].Email)
            }
            setSalesPerson(res[0]["id"])
        })

      }, []);

    useEffect(() => {
        reset()
        RemoveAllReadOnlyFields()
        var type;
        props.data.modelLink=="sales-invoice-barge"?type="barge":type="normal"
        FindRemainingBC(globalContext,type).then(res => {
            var ArrayBooking = [];
            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayBooking.push({ value: value.BookingConfirmationUUID, label: value.DocNum })
                }
            })
            setBookingConfirmation(ArrayBooking)
        })
        
        $(".Ports").addClass('d-none')
        GetAllDropDown(['CargoType','Vessel','CurrencyType', 'ChargesType', 'FreightTerm', 'ContainerType',`CreditTerm`,'PortTerm', 'TaxCode', 'Area', 'User','Quotation','BillOfLading','BookingConfirmation'], globalContext).then(res => {
            
            var ArrayCargoType = [];
            var ArrayPortCode = [];
            var ArrayPortTerm = [];
            var ArrayFreightTerm = [];
            var ArrayContainerType = [];
            var ArrayCreditTerm = [];
            var ArrayCurrency = [];
            var ArrayUser = [];
            var ArrayTaxCode = [];
            var ArrayQuotation = [];
            var ArrayBookingConfirm = [];
            var ArrayBillOfLading = [];
            var ArrayVessel = [];

            
            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })

            $.each(res.PortTerm, function (key, value) {
                ArrayPortTerm.push({ value: value.PortTermUUID, label: value.PortTerm })
            })

            $.each(res.FreightTerm, function (key, value) {
                ArrayFreightTerm.push({ value: value.FreightTermUUID, label: value.FreightTerm })
            })
            
            $.each(res.CargoType, function (key, value) {
                ArrayCargoType.push({ value: value.CargoTypeUUID, label: value.CargoType })
            })

            $.each(res.CreditTerm, function (key, value) {
                ArrayCreditTerm.push({ value: value.CreditTermUUID, label: value.CreditTerm })
            })

            $.each(res.Vessel, function (key, value) {
                if(value.VerificationStatus=="Approved" && value.VesselType=="----07039c85-63e7-11ed-ad61-7446a0a8dedc"){
                    ArrayVessel.push({ value: value.VesselUUID, label: value.VesselCode })
                }   
            })
            
            $.each(res.ContainerType, function (key, value) {
                ArrayContainerType.push({ value: value.ContainerTypeUUID, label: value.ContainerType })
            })

            $.each(res.CurrencyType, function (key, value) {
                ArrayCurrency.push({ value: value.CurrencyTypeUUID, label: value.CurrencyName })
            })
            
            $.each(res.TaxCode, function (key, value) {
                ArrayTaxCode.push({ value: value.TaxCodeUUID, label: value.TaxCode })
            })

            $.each(res.User, function (key, value) {
                ArrayUser.push({ value: value.id, label: value.username })
            })

            $.each(res.Quotation, function (key, value) {
                ArrayQuotation.push({ value: value.QuotationUUID, label: value.DocNum })
            })

            $.each(res.BookingConfirmation, function (key, value) {
                ArrayBookingConfirm.push({ value: value.BookingConfirmationUUID, label: value.DocNum })
            })

            $.each(res.BillOfLading, function (key, value) {
                ArrayBillOfLading.push({ value: value.BillOfLadingUUID, label: value.DocNum })
            })

            setPort(sortArray(ArrayPortCode))
            setPortTerm(sortArray(ArrayPortTerm))
            setFreightTerm(sortArray(ArrayFreightTerm))
            setCargoType(sortArray(ArrayCargoType))
            setContainerType(sortArray(ArrayContainerType))
            setCreditTerm(sortArray(ArrayCreditTerm))
            setCurrency(sortArray(ArrayCurrency))
            setUser(sortArray(ArrayUser))
            setTaxCode(sortArray(ArrayTaxCode))
            setQuotationOptions(sortArray(ArrayQuotation))
            setBookingConfirmationOptions(sortArray(ArrayBookingConfirm))
            setBillOfLadingOptions(sortArray(ArrayBillOfLading))
            setBargeCode(sortArray(ArrayVessel))

            var arrayDynamic = []
            if (formState) {
                if (formState.formType == "Update" || formState.formType == "Clone") {
                    ControlOverlay(true)
                    GetUpdateCLoneData(formState.id)
                    setResetStateValue(formState.id)
                }
                else if (formState.formType == "TransferFromBooking") {
                    ControlOverlay(true)
                    TransferFromBooking(formState.id)
                    setResetStateValue(formState.id)

                }else{
                    var date = new Date().getDate();
                    var month = new Date().getMonth() + 1;
                    var year = new Date().getFullYear();            
                    var nowDate =   date + '/' + month + '/' + year;
                    setDocDate(nowDate)
                    setQuotationType("Normal")
                    // $("input[data-target='ValidityDay']").val("7");
                    setValue(`DynamicModel[ValidityDay]`,"7")
                    setValue(`SalesInvoice[ValidityDay]`,"7")
                    RemoveAllReadOnlyFields()
                }
            } else {
                ControlOverlay(true)
                GetUpdateCLoneData(params.id)
                setResetStateValue(params.id)
                // GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                
                //     if (res.data.data.Valid == "1") {
                //         $('.validCheckbox').prop("checked", true)
                //     }
                //     else {
                //         $('.validCheckbox').prop("checked", false)

                //     }

                //     if(formState.formType == "Clone"){
                //         var date = new Date().getDate();
                //         var month = new Date().getMonth() + 1;
                //         var year = new Date().getFullYear();            
                //         var nowDate =   date + '/' + month + '/' + year;
                //         setDocDate(nowDate)
                //     }

                //     ControlOverlay(false)

                // })
            }

            return () => {

            }

        })
    }, [formState])

    useEffect(() => {
        if (state == null) {
            trigger()
            if(params.id){
                setFormState({ formType: "Update", id: params.id })
            }else{
                setFormState({ formType: "New"})
            }
        }
        else {
            trigger()
            setFormState(state)
        }
        return () => {
        }
    }, [state])

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };
    

  return (
    <form id="SalesInvoiceForm">
        {formState ? formState.formType == "TransferFromBooking" || formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="sales-invoice-barge"?true:false} title='SalesInvoice' data={props} RemaningBC={bookingConfirmation}/> : <UpdateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="sales-invoice-barge"?true:false} title="SalesInvoice" model="sales-invoice" selectedId="SalesInvoiceUUIDs" id={formState.id} data={props} position={'top'}/> : <CreateButton  handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="sales-invoice-barge"?true:false} title='Sales Invoice' data={props} RemaningBC={bookingConfirmation}/>}
        <div className="">
          <div className="box">
            <div className="left-form">
                <div className="flex-container">
                <FormContext.Provider value={{fields, update, FieldArrayHandle,docDate, salesPerson, formState, quotationType, lastValidDate, advanceBookingStartDate, advanceBookingLastValidDate, defaultPortTerm, defaultCurrency, setStateHandle, optionPOLTerminal, optionPODTerminal, optionPOLAgentCompany, optionPODAgentCompany, optionPOLAgentCompanyBranch, 
                optionPODAgentCompanyBranch, pOLReqETA,bargeCode, pODReqETA, portTerm, freightTerm, defaultFinalDestinationCompany, setDefaultFinalDestinationCompany, VoyageNum, quickFormVoyageNum, verificationStatus, ApprovedStatusReadOnlyForAllFields, RemoveAllReadOnlyFields, resetStateValue,quotationOptions, bookingConfirmationOptions, billOfLadingOptions, customerType, checkErrorContainer, setCheckErrorContainer}}>

                    {/* start: quick form  */}
                    <div className="card card-primary flex-item-left mb-0">
                        <div className="card-header">
                            <h3 id="QuickForm" className="card-title">Quick Form</h3>
                        </div>
                        <div className="card-body cardMaxHeight">
                            <QuickForm barge={props.data.modelLink=="sales-invoice-barge"?true:false}bargeCode={bargeCode} user={user} register={register} setValue={setValue} navigate={navigate} getValues={getValues} trigger={trigger} control={control} errors={errors} port={port} freightTerm={freightTerm} taxCode={taxCode} currency={currency} customerType={CustomerType} changeQuotationType={changeQuotationType} containerType={containerType} cargoType={cargoType} documentData={documentData} middleCardData={middleCardQuickFormData} shippingInstructionData={shippingInstructionQuickFormData} setContainerTypeAndChargesData={setContainerTypeAndChargesData} containerTypeAndChargesData={containerTypeAndChargesData} bookingConfirmation={bookingConfirmation} modelLink={props.data.modelLink}/>
                        </div>
                    </div>
                    {/* end: quick form  */}

                    {/* start: detail form  */}
                    <div id="toggleForm" className="card card-success flex-item-right mb-0 pr-0" style={{display:"none"}}>
                        <div className="card-header">
                            <h3 className="card-title"><a id="hideToggleForm"><i className="fa fa-arrow-right mr-2 fa-xs p-0 m-0" aria-hidden="true"></i></a><span className="icon-title"></span></h3>
                        </div>
                        <div className="card-body cardMaxHeight">
                            <Attention creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} attentionData={attentionData} customerType={CustomerType}/>
                            {props.data.modelLink=="sales-invoice-barge"?<Document formType={formState.formType} documentData={documentData} user={user} currency={currency} port={port} register={register} setValue={setValue} control={control} errors={errors} />:""}
                            {props.data.modelLink=="sales-invoice-barge"?<Instruction instructionData={instructionData} register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port}  bargeCode={bargeCode}/>:""}
                            <More state={state} register={register} setValue={setValue} control={control} errors={errors} moreData={moreData}/>
                            {/* <Inspect /> */}
                        </div>
                    </div>
                    {/* end: detail form  */}
                    <ShareInitialize formName="SalesInvoice" formNameLowerCase="salesinvoice" setValue={setValue} getValues={getValues} trigger={trigger} globalContext={globalContext} />
                    {/* <VoyageModal formName="SalesInvoice" formNameLowerCase="sales-invoice" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port}/> */}
                    <ContainerModal formName="SalesInvoice" formNameLowerCase="salesinvoice" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                    <CurrencyModal formName="SalesInvoice" formNameLowerCase="salesinvoice" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                </FormContext.Provider >
                </div>
            </div>
            <div className="shortcut-buttons sticky">
              <ul className="sticky nav nav-pills flex-column">
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon quickformicon text-primary" id="QuickForm" data-toggle="tooltip" data-placement="left" data-target="Quick Form" data-original-title="Quick Form"><i className="fa fa-star" /></button>
                {props.data.modelLink=="sales-invoice-barge"?<button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Document" data-toggle="tooltip" data-placement="left" data-target="Document" data-original-title="Document"><i className="fa fa-file" /></button>:""}
                {/* <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Document" data-toggle="tooltip" data-placement="left" data-target="Document" data-original-title="Document"><i className="fa fa-file" /></button> */}
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Attention" data-toggle="tooltip" data-placement="left" data-target="Attention" data-original-title="Attention"><i className="fa fa-users" /></button>
                {/* <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Instructions" data-toggle="tooltip" data-placement="left" data-target="Instructions" data-original-title="Instructions"><i className="fab fa-artstation" /></button>  */}
                {/* <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Transhipment" data-toggle="tooltip" data-placement="left" data-target="Transhipment" data-original-title="Transhipment"><i className="fa fa-random" /></button>  */}
                {/* <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Hauler" data-toggle="tooltip" data-placement="left" data-target="Hauler" data-original-title="Hauler"><i className="fa fa-truck" /></button>  */}
                {props.data.modelLink=="sales-invoice-barge"?<button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Instructions" data-toggle="tooltip" data-placement="left" data-target="Instructions" data-original-title="Instructions"><i className="fab fa-artstation" /></button>:""}
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="More" data-toggle="tooltip" data-placement="left" data-target="More" data-original-title="More"><i className="fa fa-ellipsis-h" /></button> 
                {/* <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Inspect" data-toggle="tooltip" data-placement="left" data-target="Inspect " data-original-title="Inspect"><i className="fa fa-sitemap" /></button> */}
              </ul>
            </div> 
          </div>
        </div>
        
        {/* Modal List */}
        <AttentionModal />
        {formState ? formState.formType == "TransferFromBooking" || formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="sales-invoice-barge"?true:false} title='SalesInvoice' data={props} RemaningBC={bookingConfirmation}/> : <UpdateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="sales-invoice-barge"?true:false} title="SalesInvoice" model="sales-invoice" selectedId="SalesInvoiceUUIDs" id={formState.id} data={props} position={'bottom'}/> : <CreateButton  handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="sales-invoice-barge"?true:false} title='Sales Invoice' data={props} RemaningBC={bookingConfirmation}/>}
    </form>
  )
}

export default Form