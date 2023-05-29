import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, GetUserDetails ,getAreaById,getPortDetails,getPortDetailsById,getVoyageByIdSpecial, sortArray} from '../../Components/Helper.js'
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
import Document from './Document';
import Attention from './Attention';
import More from './More';
import {AttentionModal, DNDModal, VoyageModal, ContainerModal, CurrencyModal} from '../../Components/ModelsHelper';
import Hauler from './Hauler';
import ShareInitialize from '../../Components/CommonElement/ShareInitialize';
import Inspect from './Inspect';
import Instruction from './Instruction';
import Transhipment from './Transhipment';


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
        name: "QuotationHasTranshipment"
    });
    //share for all
    const [defaultPortTerm, setDefaultPortTerm] = useState("----c1d43831-d709-11eb-91d3-b42e998d11ff")
    const [defaultCurrency, setDefaultCurrency] = useState("----942c4cf1-d709-11eb-91d3-b42e998d11ff")
    const [user, setUser] = useState("")
    const [creditTerm, setCreditTerm] = useState("")
    const [port, setPort] = useState("")
    const [portTerm, setPortTerm] = useState("")
    const [freightTerm, setFreightTerm] = useState("")
    const [taxCode, setTaxCode] = useState("")
    const [cargoType, setCargoType] = useState("")

    //document
    const [docDate, setDocDate] = useState("")
    const [lastValidDate, setLastValidDate] = useState("")
    const [advanceBookingStartDate, setAdvanceBookingStartDate] = useState("")
    const [advanceBookingLastValidDate, setAdvanceBookingLastValidDate] = useState("")
    const [salesPerson, setSalesPerson] = useState("")
    const [quotationType, setQuotationType] = useState("")
    const [currency, setCurrency] = useState("")

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
    const [checkChangeVoyage, setCheckChangeVoyage] = useState("")
    const [bargeCode, setBargeCode] = useState("")

    //container
    const [containerType, setContainerType] = useState([])   
    const [voyageDelay, setVoyageDelay] = useState(false)

    //getUpdateDataState
    const [documentData, setDocumentData] = useState([])   
    const [instructionData, setInstructionData] = useState([])   
    const [shippingInstructionQuickFormData, setShippingInstructionQuickFormData] = useState([])   
    const [containerQuickFormData, setContainerQuickFormData] = useState([])   
    const [containerInnerQuickFormData, setContainerInnerQuickFormData] = useState([])   
    const [haulerData, setHaulerData] = useState([])   
    const [moreData, setMoreData] = useState([])   
    const [middleCardQuickFormData, setMiddleCardQuickFormData] = useState([])   
    const [attentionData, setAttentionData] = useState([])   
    const [containerTypeAndChargesData, setContainerTypeAndChargesData] = useState([])
    const [transhipmentData, setTranshipmentData] = useState([])
    const [verificationStatus, setVerificationStatus] = useState("")
    const [resetStateValue, setResetStateValue] = useState([])
    const [checkErrorContainer, setCheckErrorContainer] = useState([])

    const onSubmit = (data, event) => {
        event.preventDefault();

        var tempForm=$("form")[0]
        $('form :input[disabled]').prop('disabled', false);

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
        if(!checkErrorContainer.QuotationHasContainerType){
            ControlOverlay(true)
            if (formState.formType == "New" || formState.formType == "Clone") {
    
                for (var [key, value] of Array.from(formdata.entries())) {
                    if (key !== "QuotationMore[Attachment][]") {
                        formdata.delete(key);
                    }
                }
                var obj = window.$($("form")[0]).serializeJSON();
                var jsonString = JSON.stringify(obj);
        
                formdata.append('data', jsonString);
    
                CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                    if (res.data) {
                        if (res.data.message == "Quotation has already been taken.") {
                            ToastNotify("error", res.data.message)
                            ControlOverlay(false)
                        }
                        else if(res.data=="Please check your Charges (Null)"){
                            ToastNotify("error", "Charges's vessel type is not same with vessel type")
                            ControlOverlay(false)
                        }
                        else {
                            if(props.data.modelLink=="quotation-barge"){
                                ToastNotify("success", "Quotation created successfully.")
                                navigate("/sales/standard/quotation-barge/update/id=" + res.data.data.QuotationUUID, { state: { formType: "Update", id: res.data.data.QuotationUUID } })
                            }else{
                                ToastNotify("success", "Quotation created successfully.")
                                navigate("/sales/container/quotation/update/id=" + res.data.data.QuotationUUID, { state: { formType: "Update", id: res.data.data.QuotationUUID } })
                            }
                           
                        }
                    }
                })
            }
            else {
                for (var [key, value] of Array.from(formdata.entries())) {
                    if (key !== "QuotationMore[Attachment][]") {
                        formdata.delete(key);
                    }
        
                }   
                var obj = window.$($("form")[0]).serializeJSON();     
                var jsonString = JSON.stringify(obj);
        
                formdata.append('data', jsonString);
                UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                    if (res.data.data) {
                        if(props.data.modelLink=="quotation-barge"){
                            ToastNotify("success", "Quotation updated successfully.")
                            navigate("/sales/standard/quotation-barge/update/id=" + res.data.data.QuotationUUID, { state: { formType: "Update", id: res.data.data.QuotationUUID } })
                        }else{
                            ToastNotify("success", "Quotation updated successfully.")
                            navigate("/sales/container/quotation/update/id=" + res.data.data.QuotationUUID, { state: { formType: "Update", id: res.data.data.QuotationUUID } })
                        }
                      
    
                    }
                    else if(res.data=="Please check your Charges (Null)"){
                        ToastNotify("error", "Charges's vessel type is not same with vessel type")
                        ControlOverlay(false)
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
        if(target === "checkChangeVoyage"){
            if(val){
                setCheckChangeVoyage(val.value)
            }   
          
        }
    } 

    function FieldArrayHandle(action,data){
        if(action == "remove"){
            remove(data)
            setTimeout(()=> {
                if($(".transhipment").length == 0){
                    $("#quotation-insisttranshipment").prop("checked",false)
                    setValue("Quotation[InsistTranshipment]",0)
                }
            },100)
        }
        if(action == "append"){
            if(data){
                data.QuickFormPOTPortTerm = defaultPortTerm;
                data.POTPortTerm = defaultPortTerm;
                append(data)
                const POTVoyage={value:data.FromVoyageNum,label:data.FromVoyageName}
                const PODVoyage={value:data.ToVoyageNum,label:data.ToVoyageName+"("+data.ToVesselCode+")"}
                setValue("QuotationHasTranshipment[0][QuickFormPOTVoyage]",data.FromVoyageNum)
                onChangePOTVoyageNum(POTVoyage,"",0)
                VoyageNumOnChangeHandle(PODVoyage)
            }else{
                append({
                    name: "QuotationHasTranshipment", 
                    POTPortTerm:defaultPortTerm,
                    QuickFormPOTPortTerm:defaultPortTerm,
                    optionTerminal:[],
                    optionAgentCompany:[],
                    optionAgentBranchCode:[],
                    optionFromVoyage:[],
                    optionToVoyage:[],
    
                })
            }
            if($(`input[name='Quotation[InsistTranshipment]']`).val() == 0){
                $("#quotation-insisttranshipment").prop("checked",true)
                setValue("Quotation[InsistTranshipment]",1)
            }
        }
    }

    function getUserDetailData(){
        GetUserDetails(globalContext).then(res => {
            if(res[0]["Company"]){
                setValue("QuotationAgent[ROC]",res[0]["Company"].CompanyUUID)
                $("#CompanyROC-Agent-DetailForm").val(res[0]["Company"].ROC)
                setValue("QuotationAgent[CompanyName]",res[0]["Company"].CompanyName)
                setValue("QuotationAgent[CreditTerm]",res[0]["Company"].CreditTerm)
                setValue("QuotationAgent[CreditLimit]",res[0]["Company"].CreditLimit)
            }
            if(res[0]["Branch"]){
                setValue("QuotationAgent[BranchCode]",res[0]["Branch"].CompanyBranchUUID)
                $("#BranchCode-Agent-DetailForm").val(res[0]["Branch"].BranchCode)
                setValue("QuotationAgent[BranchName]",res[0]["Branch"].BranchName)
                setValue("QuotationAgent[BranchTel]",res[0]["Branch"].Tel)
                setValue("QuotationAgent[BranchFax]",res[0]["Branch"].Fax)
                setValue("QuotationAgent[BranchEmail]",res[0]["Branch"].Email)
                setValue("QuotationAgent[BranchAddressLine1]",res[0]["Branch"].AddressLine1)
                setValue("QuotationAgent[BranchAddressLine2]",res[0]["Branch"].AddressLine2)
                setValue("QuotationAgent[BranchAddressLine3]",res[0]["Branch"].AddressLine3)
                setValue("QuotationAgent[BranchPostcode]",res[0]["Branch"].Postcode)
                setValue("QuotationAgent[BranchCity]",res[0]["Branch"].City)
                setValue("QuotationAgent[BranchCountry]",res[0]["Branch"].Country)
                setValue("QuotationAgent[BranchCoordinates]",res[0]["Branch"].Coordinates)
            }
            if(res[0]["companyContact"]){
                setValue("QuotationAgent[AttentionName]",res[0]["companyContact"].FirstName+" "+res[0]["companyContact"].LastName)
                setValue("QuotationAgent[AttentionTel]",res[0]["companyContact"].Tel)
                setValue("QuotationAgent[AttentionEmail]",res[0]["companyContact"].Email)
            }
            setSalesPerson(res[0]["id"])            
            setValue("DynamicModel[SalesPerson]",res[0]["id"])            
        })
    }

    function setDataWhenClickNewButton(){
        setQuotationType("Normal")
        setValue(`DynamicModel[ValidityDay]`,"7")
        setValue(`Quotation[ValidityDay]`,"7")
        getUserDetailData()
        setValue("DynamicModel[QuotationType]","Normal")            
        setValue("DynamicModel[POLPortTerm]",defaultPortTerm)            
        setValue("DynamicModel[PODPortTerm]",defaultPortTerm)            
    }

    //Advance Booking Start Date &  Advance Booking Last Valid Date show only if quotation type onchange = Advance booking
    function changeQuotationType(current) {
        if(current){
            var str = current.value;
            if (str == "Advance Booking") {
            
                $(".AdvanceBooking").removeClass('d-none');
                $(".NormalBooking").addClass('d-none');
                var docDateForAdvanceBooking = $("#quotation-docdate").val()
                $("#quotation-advancebookingstartdate-quickform").val(docDateForAdvanceBooking)
                $("#quotation-advancebookingstartdate").val(docDateForAdvanceBooking)
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
            var PotPortcode = getValues(`QuotationHasTranshipment[${index}][QuickFormPortCode]`)
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
                                setValue(`Quotation[POLETA]`,value.ETA)
                                setValue(`Quotation[POLETD]`,value.ETD)
                                setValue(`Quotation[POLSCNCode]`,value.SCNCode)
                                setValue(`Quotation[ClosingDateTime]`,value.ClosingDateTime)
                                $("#quotation-voyage-pol").val(value.VoyageScheduleUUID)
                                
                                if(!value.LocationCode){
                                    setValue(`Quotation[POLLocationCode]`,value.LocationCode)
                                    setValue(`Quotation[POLLocationName]`,"")
                                    setValue(`Quotation[POLAgentROC]`,"")
                                    setValue(`Quotation[POLAgentName]`,"")
                                    setValue(`Quotation[POLHandlingOfficeCode]`,"")
                                    setValue(`Quotation[POLHandlingOfficeName]`,"")
                                }else{
                                    setValue(`Quotation[POLLocationCode]`,value.LocationCode)
                                    $.each(value.terminalSelection, function (key1, value1) {
                                        
                                        if(value1.PortDetailsUUID == value.LocationCode){
                                            var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                            var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                            setStateHandle(sortArray(optionCompany),"OptionPOLAgentCompany")
                                            setStateHandle(sortArray(optionCompanyBranch),"OptionPOLAgentCompanyBranch")
                                            setValue(`Quotation[POLLocationName]`,value1.LocationCode)
                                            setValue(`Quotation[POLAgentROC]`,value1.handlingCompany.AgentCode)
                                            setValue(`Quotation[POLAgentName]`,value1.handlingCompany.CompanyUUID)
                                            setValue(`Quotation[POLHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                            setValue(`Quotation[POLHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                        }
                                    })
                                }
                            
                                foundPOL = true;
                            }

                        }

                        countPOT++;
                    }

                    if (value.PortCode == PotPortcode) {

                        setValue(`QuotationHasTranshipment[${index}][DischargingDate]`,value.ETA)
                        setValue(`QuotationHasTranshipment[${index}][FromVoyagePOT]`,value.VoyageScheduleUUID)
                    
                    }
                    if (value.PortCode == prevPortCode) {
                    //  var ETA = (value.ETA).split(" ");
                        setValue(`QuotationHasTranshipment[${startingIndex}][LoadingDate]`,value.ETA)
                        setValue(`QuotationHasTranshipment[${startingIndex}][ToVoyagePOT]`,value.VoyageScheduleUUID)
                    }

                    if (value.PortCode == PotPortcode && foundPOL && foundPOD == false) {
                        if (index == 0) {
                            setValue(`Quotation[PODETA]`,value.ETA)
                            setValue(`Quotation[PODETD]`,value.ETD)
                            setValue(`Quotation[PODSCNCode]`,value.SCNCode)
                            
                            foundPOD = true;
                        }
                    }

                });

                if (index == 0) {
                    var temArray = [currentSelector]
                    setStateHandle(temArray,"VoyageNum")
                    setValue(`Quotation[VoyageNum]`,VoyageNum)
                    $("#quotation-vesselcode").val(data[0]["vessel"]["VesselCode"])
                    $("#quotation-voyagename").val(StrvoyageNo)
                    $.each(data, function (key, value) {
                        $("#quotation-vesselname").val(value.vessel.VesselName)
                        setValue("QuotationHasTranshipment["+index+"][QuickFormPOTVesselCode]", value.vessel.VesselName)
                    })

                }

                if (foundPOL == false) {
                    if (index == 0) {
                        setValue(`Quotation[POLETA]`,"")
                        setValue(`Quotation[POLETD]`,"")
                        setValue(`Quotation[POLSCNCode]`,"")
                        setValue(`Quotation[ClosingDateTime]`,"")
                    }
                }

                if (foundPOD == false) {
                    if (index == 0) {
                        //alert("POD Port Code Not Available for Selected Voyage")
                        setValue(`Quotation[PODETA]`,"")
                        setValue(`Quotation[PODETD]`,"")
                        setValue(`Quotation[PODSCNCode]`,"")
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
            $("button[type='submit']").prop("disabled",true);
            
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
            $(".loadTariff").addClass("d-none")
            $("#transhipmentQuickForm").addClass("d-none")
            $(".add-transhipment").addClass("d-none")
    
            $("input[type='checkbox']:not(.keep-enabled)").prop("disabled", true);
        }, 50)
    }

    function RemoveAllReadOnlyFields () {
        setTimeout(() => {

            $("button[type='submit']").prop("disabled",false);
            
            $(".form-control").not(".OriReadOnlyClass").each(function () {
                $(this).removeClass("readOnlySelect")
                $(this).prop("disabled",false)
            });

            $(".basic-single").not(".OriReadOnlyClass").each(function () {
                $(this).removeClass("readOnlySelect")
            });

            $(".c-date-picker").not(".OriReadOnlyClass").each(function () {
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
                setValue(`Quotation[VoyageNum]`,data.value)
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
                setValue(`QuotationHasTranshipment[${index}][optionToVoyage]`,sortArray(VoyageArray))
                update(fields)
                setValue(`QuotationHasTranshipment[${index}][ToVoyageNum]`,data[0]["VoyageUUID"])
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

                            setValue(`QuotationHasTranshipment[${index}][LoadingDate]`,value.ETA)
                            setValue(`QuotationHasTranshipment[${index}][ToVoyagePOT]`,value.VoyageScheduleUUID)
                        }

                        countPOT++;

                    }

                    if (value.PortCode == PodPortcode && foundPOL && foundPOD == false) {
                            setValue(`Quotation[PODETA]`,value.ETA)
                            setValue(`Quotation[PODETD]`,value.ETD)
                            setValue(`Quotation[PODSCNCode]`,value.SCNCode)
                            $(`#quotation-voyage-pod`).val(value.VoyageScheduleUUID)

                            if(!value.LocationCode){
                                setValue(`Quotation[PODLocationCode]`,value.LocationCode)
                                setValue(`Quotation[PODLocationName]`,"")
                                setValue(`Quotation[PODAgentROC]`,"")
                                setValue(`Quotation[PODAgentName]`,"")
                                setValue(`Quotation[PODHandlingOfficeCode]`,"")
                                setValue(`Quotation[PODHandlingOfficeName]`,"")
                            }else{
                                setValue(`Quotation[PODLocationCode]`,value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {

                                    if(value1.PortDetailsUUID == value.LocationCode){
                                        var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                        var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                        setStateHandle(sortArray(optionCompany),"OptionPODAgentCompany")
                                        setStateHandle(sortArray(optionCompanyBranch),"OptionPODAgentCompanyBranch")
                                        setValue(`Quotation[PODLocationName]`,value1.LocationCode)
                                        setValue(`Quotation[PODAgentROC]`,value1.handlingCompany.AgentCode)
                                        setValue(`Quotation[PODAgentName]`,value1.handlingCompany.CompanyUUID)
                                        setValue(`Quotation[PODHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                        setValue(`Quotation[PODHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }

                        // }

                        foundPOD = true;
                        countPOD++;
                    }

                    if (value.PortCode == PodPortcode && index == 0) {
                            setValue(`Quotation[PODETA]`,value.ETA)
                            setValue(`Quotation[PODETD]`,value.ETD)
                            setValue(`Quotation[PODSCNCode]`,value.SCNCode)
                            $(`#quotation-voyage-pod`).val(value.VoyageScheduleUUID)

                            if(!value.LocationCode){
                                setValue(`Quotation[PODLocationCode]`,value.LocationCode)
                                setValue(`Quotation[PODLocationName]`,"")
                                setValue(`Quotation[PODAgentROC]`,"")
                                setValue(`Quotation[PODAgentName]`,"")
                                setValue(`Quotation[PODHandlingOfficeCode]`,"")
                                setValue(`Quotation[PODHandlingOfficeName]`,"")
                            }else{
                                setValue(`Quotation[PODLocationCode]`,value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {
                                    if(value1.PortDetailsUUID == value.LocationCode){
                                        var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                        var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                        setStateHandle(sortArray(optionCompany),"OptionPODAgentCompany")
                                        setStateHandle(sortArray(optionCompanyBranch),"OptionPODAgentCompanyBranch")
                                        setValue(`Quotation[PODLocationName]`,value1.LocationCode)
                                        setValue(`Quotation[PODAgentROC]`,value1.handlingCompany.AgentCode)
                                        setValue(`Quotation[PODAgentName]`,value1.handlingCompany.CompanyUUID)
                                        setValue(`Quotation[PODHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                        setValue(`Quotation[PODHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }
                            foundPOD = true;
                    }

                }); 

                if (ToVesselName == startingVesselName) {
                        setValue(`QuotationHasTranshipment[${index}][LoadingDate]`,"")
                        setValue(`QuotationHasTranshipment[${index}][DischargingDate]`,"")
                }

                })
            } else {
                setValue(`QuotationHasTranshipment[${index}][optionToVoyage]`,[])
                update(fields)
                setValue(`QuotationHasTranshipment[${index}][ToVoyageNum]`,"")
                $(`#quotationhastranshipment-` + index + "-tovoyagename").val("")
                $(`#quotationhastranshipment-` + index + "-tovesselcode").val("")
                $(`#quotationhastranshipment-` + index + "-tovesselname").val("")
                $("#dynamicmodel-vesselcode").val("")
                setValue(`QuotationHasTranshipment[${index}][LoadingDate]`,"")
                if (index == 0) {
                    setValue(`Quotation[PODETA]`,"")
                    setValue(`Quotation[PODETD]`,"")
                    setValue(`Quotation[PODSCNCode]`,"")
                }
            }
        }else{
            $(`#quotation-voyage-pod`).val("")
            setValue(`Quotation[VoyageNum]`,"")
            setValue(`QuotationHasTranshipment[${index}][ToVoyageNum]`,"")
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

            if(formState.formType == "Clone"){
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var nowDate = date + '/' + month + '/' + year;
                setDocDate(nowDate)

                res.data.data.Quotation.DocDate = nowDate
                res.data.data.Quotation.DocNum = ""

                $.each(res.data.data.QuotationHasContainerType, function (key,value){
                    res.data.data.QuotationHasContainerType[key]["QuotationHasContainer"] =[]
                })
            }
            
            if (res.data.data.Quotation) {
                setDocumentData(res.data.data.Quotation)
                setInstructionData(res.data.data.Quotation)
                setShippingInstructionQuickFormData(res.data.data.Quotation)

                if (res.data.data.Quotation.QuotationType == "One-Off") {
    
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

                if (res.data.data.Quotation.QuotationType == "Advance Booking") {
            
                    $(".AdvanceBooking").removeClass('d-none');
                    $(".NormalBooking").addClass('d-none');
                    // var docDateForAdvanceBooking = $("#quotation-docdate").val()
                    // $("#quotation-advancebookingstartdate-quickform").val(docDateForAdvanceBooking)
                    // $("#quotation-advancebookingstartdate").val(docDateForAdvanceBooking)
                }
                else {
                    $(".AdvanceBooking").addClass('d-none');
                    $(".NormalBooking").removeClass('d-none');
                }
                $.each(res.data.data.Quotation, function (key2, value2) {
                    setValue('Quotation[' + key2 + ']', value2);
                })
            }

            if(res.data.data.QuotationHasTranshipment){
                setTranshipmentData(res.data.data.QuotationHasTranshipment)
            }

            if (res.data.data.QuotationHasContainer) {
                setContainerQuickFormData(res.data.data.QuotationHasContainer)
                setContainerInnerQuickFormData(res.data.data.QuotationHasContainer)
            }

            if (res.data.data.QuotationHauler) {

                setHaulerData(res.data.data.QuotationHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.QuotationHauler
            }

            if (res.data.data.QuotationMore) {

                setMoreData(res.data.data.QuotationMore)
            }

            if (res.data.data.Quotation.ShipOperator) {
                ArrayAttention["QuotationShipOp"] = res.data.data.Quotation.shipOperator
            }

            if (res.data.data.QuotationAgent) {
                ArrayAttention["QuotationAgent"] = res.data.data.QuotationAgent
            }
            if (res.data.data.QuotationBillTo) {
                ArrayAttention["QuotationBillTo"] = res.data.data.QuotationBillTo
            }
            if (res.data.data.QuotationShipper) {
                ArrayAttention["QuotationShipper"] = res.data.data.QuotationShipper
            }

            if (res.data.data.QuotationConsignee) {
                ArrayAttention["QuotationConsignee"] = res.data.data.QuotationConsignee
            }

            if (res.data.data.QuotationPartyExt) {
                ArrayAttention["QuotationPartyExt"] = res.data.data.QuotationPartyExt
            }

            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)

            if(res.data.data.QuotationHasContainerType) {
                setContainerTypeAndChargesData(res.data.data.QuotationHasContainerType)
            }


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)
            }

            if (res.data.data.Quotation.VerificationStatus == "Pending"){
                $(".VerificationStatusField").text("Draft")
                $(".transferButton").prop("disabled",true)
                setVerificationStatus("Pending")
            }else if (res.data.data.Quotation.VerificationStatus == "Rejected"){
                $(".VerificationStatusField").text("Rejected")
                $(".VerificationStatusField").addClass("text-danger")
                $(".transferButton").prop("disabled",true)
                setVerificationStatus("Rejected")
            }else{
                if(formState.formType != "Clone"){
                    $(".transferButton").prop("disabled",false)
                    setVerificationStatus("Approved")
                }else{
                    setVerificationStatus("")
                    $(".transferButton").prop("disabled",false)
                    RemoveAllReadOnlyFields()
                }
            }
            $(".VerificationStatusField").last().addClass("d-none")

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
    
            $("#quotation-voyagenum").val("").trigger("change")
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
        
        getUserDetailData()
      }, []);

    useEffect(() => {
        reset()
        RemoveAllReadOnlyFields()

        $(".AdvanceBooking").addClass('d-none');
        $(".NormalBooking").removeClass('d-none');
        
        $(".Ports").addClass('d-none')
        GetAllDropDown(['CargoType','Vessel','CurrencyType', 'ChargesType', 'FreightTerm', 'ContainerType',`CreditTerm`,'PortTerm', 'TaxCode', 'Area', 'User'], globalContext).then(res => {
            
            var ArrayCargoType = [];
            var ArrayPortCode = [];
            var ArrayPortTerm = [];
            var ArrayFreightTerm = [];
            var ArrayContainerType = [];
            var ArrayCreditTerm = [];
            var ArrayCurrency = [];
            var ArrayUser = [];
            var ArrayTaxCode = [];
            var ArrayVessel=[];
            
            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })

            $.each(res.Vessel, function (key, value) {
                if(value.VerificationStatus=="Approved" && value.VesselType=="----07039c85-63e7-11ed-ad61-7446a0a8dedc"){
                    ArrayVessel.push({ value: value.VesselUUID, label: value.VesselCode })
                }          
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

            setPort(sortArray(ArrayPortCode))
            setPortTerm(sortArray(ArrayPortTerm))
            setFreightTerm(sortArray(ArrayFreightTerm))
            setCargoType(sortArray(ArrayCargoType))
            setContainerType(sortArray(ArrayContainerType))
            setCreditTerm(sortArray(ArrayCreditTerm))
            setCurrency(sortArray(ArrayCurrency))
            setUser(sortArray(ArrayUser))
            setTaxCode(sortArray(ArrayTaxCode))
            setBargeCode(sortArray(ArrayVessel))

           

            var arrayDynamic = []
            if (formState) {
                if (formState.formType == "Update" || formState.formType == "Clone") {
                    ControlOverlay(true)
                    GetUpdateCLoneData(formState.id)
                    setResetStateValue(formState.id)
                }else if(formState.formType=="VoyageDelay"){
                    setVoyageDelay(true)
                    ControlOverlay(true)
                    GetUpdateCLoneData(formState.id)
                }
                else{
                    var date = new Date().getDate();
                    var month = new Date().getMonth() + 1;
                    var year = new Date().getFullYear();            
                    var nowDate =   date + '/' + month + '/' + year;
                    setDocDate(nowDate)
                    remove()
                    setDataWhenClickNewButton()
                    $(".OneOff").addClass("d-none")
                    
                    
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
        if(transhipmentData.length >0){
            remove()
            $.each(transhipmentData, function (key, value) {
                var optionTerminal = []
                var optionAgentCompany = []
                var optionAgentBranchCode = []
                var optionFromVoyage = []
                var optionToVoyage = []
                $(".QuotationHasTranshipment["+key+"][QuotationHasTranshipmentUUID]").closest(".transhipment-item").find(".PortCode").val(value.Area)

                if(value.portDetails){
                    $.each(value.portDetails, function (key2, value2) {
                        optionTerminal.push({value:value2.PortDetailsUUID, label:value2.LocationCode})
                    })
                }
                if(value.POTHandlingOfficeCode){
                    optionAgentCompany.push({value:value.pOTHandlingOfficeCodeCompany.CompanyUUID, label:value.pOTHandlingOfficeCodeCompany.CompanyName})
                    optionAgentBranchCode.push({value:value.pOTHandlingOfficeCode.CompanyBranchUUID, label:value.pOTHandlingOfficeCode.BranchCode})
                    value["POTHandlingCompanyCode"]= value.pOTHandlingOfficeCodeCompany.CompanyUUID
                    value["POTHandlingCompanyROC"]= value.pOTHandlingOfficeCodeCompany.ROC
                }

                if(value.FromVoyageNum){
                    optionFromVoyage.push({value:value.fromVoyage.VoyageUUID, label:value.fromVoyage.VoyageNumber + "(" +value.FromVesselCode+ ")"})
                    value["QuickFormPOTVoyage"] = value.fromVoyage.VoyageUUID
                }

                if(value.ToVoyageNum){
                    optionToVoyage.push({value:value.toVoyage.VoyageUUID, label:value.toVoyage.VoyageNumber + "(" +value.ToVesselCode+ ")"})
                }

                value["name"] = "QuotationHasTranshipment"
                value["QuickFormPortCode"]= value.PortCode
                value["QuickFormPOTPortTerm"]= value.POTPortTerm
                value["QuickFormPOTVesselCode"]= value.FromVesselCode
                value["optionTerminal"] = sortArray(optionTerminal)
                value["optionAgentCompany"] = sortArray(optionAgentCompany)
                value["optionAgentBranchCode"] = sortArray(optionAgentBranchCode)
                value["optionFromVoyage"] = sortArray(optionFromVoyage)
                value["optionToVoyage"] = sortArray(optionToVoyage)

                append(value)

                setQuickFormVoyageNum(sortArray(optionToVoyage))
                if(value.ToVoyageNum){
                    setValue("DynamicModel[VoyageNum]",value.toVoyage.VoyageUUID)
                    setValue("DynamicModel[VesselCode]",value.ToVesselCode)
                    $("input[name='DynamicModel[VesselCode]']").val(value.ToVesselCode)
                }
                setTimeout(()=>{
                    $("input[name='QuotationHasTranshipment["+key+"][QuotationHasTranshipmentUUID]']").closest(".transhipment-item").find(".PortCode").text(value.Area)
                    $("#quotationhastranshipment-"+key+"-seqnum").val(value.SeqNum)
                },50)
            
            })
        }
    
      return () => {
      }
    }, [transhipmentData])

    useEffect(() => {
        if (state == null) {
            trigger()
            if(params.D){
                setFormState({ formType: "VoyageDelay",id:params.id, D: params.D })
            }
            else{
                if(params.id){
                    setFormState({ formType: "Update", id: params.id })
                }else{
                    setFormState({ formType: "New"})
                }
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
    <form  id="QuotationForm">
        {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='Quotation' data={props} barge={props.data.modelLink=="quotation-barge"?true:false} /> : <UpdateButton  handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="quotation-barge"?true:false} title="Quotation" model="quotation" selectedId="QuotationUUIDs" id={formState.id} data={props}  voyageDelay={voyageDelay} position="top"/> : <CreateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="quotation-barge"?true:false} title='Quotation' data={props} />}
        <div className="">
          <div className="box">
            <div className="left-form">
                <div className="flex-container">
                <FormContext.Provider value={{fields, update, FieldArrayHandle,docDate, salesPerson, formState, quotationType, lastValidDate, advanceBookingStartDate, advanceBookingLastValidDate, defaultPortTerm, defaultCurrency, setStateHandle, optionPOLTerminal, optionPODTerminal, optionPOLAgentCompany, optionPODAgentCompany, optionPOLAgentCompanyBranch, 
                optionPODAgentCompanyBranch,bargeCode, checkChangeVoyage,pOLReqETA, pODReqETA, portTerm, freightTerm, defaultFinalDestinationCompany, setDefaultFinalDestinationCompany, VoyageNum, quickFormVoyageNum, verificationStatus, ApprovedStatusReadOnlyForAllFields, RemoveAllReadOnlyFields, resetStateValue, setCheckErrorContainer, checkErrorContainer}}>

                    {/* start: quick form  */}
                    <div className="card card-primary flex-item-left mb-0">
                        <div className="card-header">
                            <h3 id="QuickForm" className="card-title">Quick Form</h3>
                        </div>
                        <div className="card-body cardMaxHeight">
                            <QuickForm bargeCode={bargeCode} barge={props.data.modelLink=="quotation-barge"?true:false} user={user} register={register} setValue={setValue} getValues={getValues} trigger={trigger} control={control} errors={errors} port={port} freightTerm={freightTerm} taxCode={taxCode} currency={currency} changeQuotationType={changeQuotationType} containerType={containerType} cargoType={cargoType} documentData={documentData} middleCardData={middleCardQuickFormData} shippingInstructionData={shippingInstructionQuickFormData} setContainerTypeAndChargesData={setContainerTypeAndChargesData} containerTypeAndChargesData={containerTypeAndChargesData}/>
                        </div>
                    </div>
                    {/* end: quick form  */}

                    {/* start: detail form  */}
                    <div id="toggleForm" className="card card-success flex-item-right mb-0 pr-0" style={{display:"none"}}>
                        <div className="card-header">
                            <h3 className="card-title"><a id="hideToggleForm"><i className="fa fa-arrow-right mr-2 fa-xs p-0 m-0" aria-hidden="true"></i></a><span className="icon-title"></span></h3>
                        </div>
                        <div className="card-body cardMaxHeight">
                            <Document user={user} currency={currency} port={port} register={register} setValue={setValue} control={control} errors={errors} changeQuotationType={changeQuotationType} getValues={getValues} documentData={documentData} setLastValidDate={setLastValidDate}/>
                            <Attention creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} attentionData={attentionData}/>
                            <Instruction  barge={props.data.modelLink=="quotation-barge"?true:false} register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port} instructionData={instructionData} bargeCode={bargeCode}/>
                            <Transhipment register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port}/>
                            <Hauler creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} haulerData={haulerData}/>
                            <More state={state} register={register} setValue={setValue} control={control} errors={errors} moreData={moreData}/>
                            <Inspect />
                        </div>
                    </div>
                    {/* end: detail form  */}
                    <ShareInitialize formName="Quotation" formNameLowerCase="quotation" remove={remove} setValue={setValue} getValues={getValues} trigger={trigger} globalContext={globalContext} />
                    <VoyageModal formName="Quotation" formNameLowerCase="quotation" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port}/>
                    <ContainerModal formName="Quotation" formNameLowerCase="quotation" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                    <CurrencyModal formName="Quotation" formNameLowerCase="quotation" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                </FormContext.Provider >
                </div>
            </div>
            <div className="shortcut-buttons sticky">
              <ul className="sticky nav nav-pills flex-column">
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon quickformicon text-primary" id="QuickForm" data-toggle="tooltip" data-placement="left" data-target="Quick Form" data-original-title="Quick Form"><i className="fa fa-star" /></button>
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Document" data-toggle="tooltip" data-placement="left" data-target="Document" data-original-title="Document"><i className="fa fa-file" /></button>
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Attention" data-toggle="tooltip" data-placement="left" data-target="Attention" data-original-title="Attention"><i className="fa fa-users" /></button>
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Instructions" data-toggle="tooltip" data-placement="left" data-target="Instructions" data-original-title="Instructions"><i className="fab fa-artstation" /></button> 
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Transhipment" data-toggle="tooltip" data-placement="left" data-target="Transhipment" data-original-title="Transhipment"><i className="fa fa-random" /></button> 
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Hauler" data-toggle="tooltip" data-placement="left" data-target="Hauler" data-original-title="Hauler"><i className="fa fa-truck" /></button> 
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="More" data-toggle="tooltip" data-placement="left" data-target="More" data-original-title="More"><i className="fa fa-ellipsis-h" /></button> 
                <button type="button" style={{border:0, backgroundColor:'white'}} className="navigate-icon icon text-secondary" id="Inspect" data-toggle="tooltip" data-placement="left" data-target="Inspect " data-original-title="Inspect"><i className="fa fa-sitemap" /></button>
              </ul>
            </div> 
          </div>
        </div>
        
        {/* Modal List */}
        <AttentionModal />
        <DNDModal title={"quotation"}/>
        {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="quotation-barge"?true:false} title='Quotation' data={props} /> : <UpdateButton  handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="quotation-barge"?true:false} title="Quotation" model="quotation" selectedId="QuotationUUIDs" id={formState.id} data={props} voyageDelay={voyageDelay} position="bottom"/> : <CreateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="quotation-barge"?true:false} title='Quotation' data={props} />}

    </form>
  )
}

export default Form