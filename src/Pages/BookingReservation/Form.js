import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, GetUserDetails ,getAreaById,getPortDetails,getPortDetailsById,getVoyageByIdSpecial, getTransferFromQuotationData, getSplitDataBR,SplitContainerBR,GetMergeBR, MergeBookingReservation, getTransferVoyageEffectedDocument, TransferVoyageBR, sortArray} from '../../Components/Helper.js'
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
import TransferVoyageModal from './TransferVoyageModal';
import {AttentionModal, DNDModal, VoyageModal, ContainerModal, CurrencyModal, QuotationFilterModal} from '../../Components/ModelsHelper';
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
    const { register, handleSubmit, getValues, setValue, trigger, reset, control, watch, clearErrors , formState: { errors } } = useForm({  mode: "onChange"});
    


    const {fields,append,prepend,remove,swap,move,insert,update,replace} = useFieldArray({
        control,
        name: "BookingReservationHasTranshipment"
    });

   
    //share for all
    var defaultTNC = "Please take note our GROSS WEIGHT PER CONTAINER ALLOWED FOR 20'-20 MT & 40'-27 MT\n\REMARK : Shipping Note/K3 for preparing B/L Manifest to be summited to us within 12 hours after closing time and before vessel's departure in order for our POD agent to summit cargo manifest to custom, Any penalty charges due to late submission is to be borne by shipper or their appointed agent.\n"
    const [defaultPortTerm, setDefaultPortTerm] = useState("----c1d43831-d709-11eb-91d3-b42e998d11ff")
    const [defaultCurrency, setDefaultCurrency] = useState("----942c4cf1-d709-11eb-91d3-b42e998d11ff")
    const [user, setUser] = useState("")
    const [creditTerm, setCreditTerm] = useState("")
    const [port, setPort] = useState("")
    const [portTerm, setPortTerm] = useState("")
    const [freightTerm, setFreightTerm] = useState("")
    const [taxCode, setTaxCode] = useState("")
    const [cargoType, setCargoType] = useState("")
    const [bookingQTNoReadonly, setBookingQTNoReadonly] = useState(true)
    const [checkErrorContainer, setCheckErrorContainer] = useState([])

    //document
    const [docDate, setDocDate] = useState("")
    const [lastValidDate, setLastValidDate] = useState("")
    const [advanceBookingStartDate, setAdvanceBookingStartDate] = useState("")
    const [advanceBookingLastValidDate, setAdvanceBookingLastValidDate] = useState("")
    const [salesPerson, setSalesPerson] = useState("")
    const [quotationType, setQuotationType] = useState("")
    const [currency, setCurrency] = useState("")
    const [QTOption, setQTOption] = useState([])

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
    const [transferVoyageVoyageNum, setTransferVoyageVoyageNum] = useState([])
    const [checkChangeVoyage, setCheckChangeVoyage] = useState("")
    const [bargeCode, setBargeCode] = useState("")

    //container
    const [containerType, setContainerType] = useState([])   
    const [voyageDelay, setVoyageDelay] = useState(false)
    

    //getUpdateDataState
    const [documentData, setDocumentData] = useState([])   
    const [instructionData, setInstructionData] = useState([])
    const [shippingInstructionQuickFormData, setShippingInstructionQuickFormData] = useState([])   
    const [transferVoyageUsingData, setTransferVoyageUsingData] = useState([])   
    const [updateDataForTransfer, setUpdateDataForTransfer] = useState([])   
    const [containerQuickFormData, setContainerQuickFormData] = useState([])   
    const [containerInnerQuickFormData, setContainerInnerQuickFormData] = useState([])   
    const [haulerData, setHaulerData] = useState([])   
    const [moreData, setMoreData] = useState([])   
    const [middleCardQuickFormData, setMiddleCardQuickFormData] = useState([])   
    const [attentionData, setAttentionData] = useState([])   
    const [containerTypeAndChargesData, setContainerTypeAndChargesData] = useState([])
    const [transhipmentData, setTranshipmentData] = useState([])
    const [verificationStatus, setVerificationStatus] = useState("")
    const [resetStateValue, setResetStateValue] = useState("")
    const [voyageandTranshipmentState, setVoyageandTranshipmentState] = useState({Voyage:[],Transhipment:[]})
    const [voyageForTransfer, setVoyageForTransfer] = useState([])
    const [transhipmentForTransfer, setTranshipmentForTransfer] = useState([])
    const [bookingComfirmationData, setBookingComfirmationData] = useState([])   
    const [controlButtonState, setControlButtonState] = useState([])   
    const [BRHasContainerUUIDsForSplit, setBRHasContainerUUIDsForSplit] = useState([])   

    const [userRule, setUserRule] = useState([])   


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

        if(!checkErrorContainer.BookingReservationHasContainerType){
            ControlOverlay(true)
            if (formState.formType == "New" || formState.formType == "Clone") {

                for (var [key, value] of Array.from(formdata.entries())) {
                    if (key !== "BookingReservationMore[Attachment][]") {
                        formdata.delete(key);
                    }
        
                }
                var obj = window.$($("form")[0]).serializeJSON();
                var jsonString = JSON.stringify(obj);
        
                formdata.append('data', jsonString);

                CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                    if (res.data) {
                        if (res.data.message=="Booking Reservation created successfully.") {
                            if(props.data.modelLink=="booking-reservation-barge"){
                                ToastNotify("success", "Booking Reservation created successfully.")
                                navigate("/sales/standard/booking-reservation-barge/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                            }else{
                                ToastNotify("success", "Booking Reservation created successfully.")
                                navigate("/sales/container/booking-reservation/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                            }
                          
                        }else {
                            ToastNotify("error", res.data.message)
                            ControlOverlay(false)
                        }
                    }

                })
            }
            else if (formState.formType == "SplitBR") {
                for (var [key, value] of Array.from(formdata.entries())) {
                    if (key !== "BookingReservationMore[Attachment][]") {
                        formdata.delete(key);
                    }
        
                }
                var obj = window.$($("form")[0]).serializeJSON();
                var jsonString = JSON.stringify(obj);
        
                formdata.append('data', jsonString);

                SplitContainerBR(globalContext,formdata, formState.id,BRHasContainerUUIDsForSplit ).then(res => {
                    if (res.data) {
                        if (res.data.message == "Booking Reservation has already been taken.") {
                            ToastNotify("error", res.data.message)
                            ControlOverlay(false)
                        }
                        else {
                            ToastNotify("success", "Booking Reservation created successfully.")
                            navigate("/sales/container/booking-reservation/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                        }
                    }
                })
            }
            else if (formState.formType == "MergeBR") {
                for (var [key, value] of Array.from(formdata.entries())) {
                    if (key !== "BookingReservationMore[Attachment][]") {
                        formdata.delete(key);
                    }
        
                }
                var obj = window.$($("form")[0]).serializeJSON();
                var jsonString = JSON.stringify(obj);
        
                formdata.append('data', jsonString);

                MergeBookingReservation(globalContext,formdata, formState.id,formState.mergeIDs ).then(res => {
                    if (res.data) {
                        if (res.data.message == "Booking Reservation don't have Container Release Order yet.") {
                            ToastNotify("error", res.data.message)
                            ControlOverlay(false)
                        }else if("Please check your Charges (Null)"){

                        }
                        else {
                            ToastNotify("success", "Booking Reservations Merge successfully.")
                            navigate("/sales/container/booking-reservation/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                        }
                    }
                })
            }
            else if (formState.formType == "Transfer") {

                for (var [key, value] of Array.from(formdata.entries())) {  
                    if (key !== "BookingReservationMore[Attachment][]") {
                        formdata.delete(key);
                    }
        
                }
                var obj = window.$($("form")[0]).serializeJSON();
                var jsonString = JSON.stringify(obj);
        
                formdata.append('data', jsonString);

                CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                    if (res.data) {
                        if (res.data.message == "Booking Reservation has already been taken.") {
                            ToastNotify("error", res.data.message)
                            ControlOverlay(false)
                        }
                        else if (res.data.message == "Voyage Number cannot be used, Please check your Doc Date and Last Valid Date.") {
                            ToastNotify("error", res.data.message,5000)
                            ControlOverlay(false)
                        }
                        else if (res.data == "Please check your Charges (Null)") {
                            ToastNotify("error", "Charges's vessel type is not same with vessel type",5000)
                            ControlOverlay(false)
                        }
                        else {
                            if(props.data.modelLink=="booking-reservation-barge"){
                                ToastNotify("success", "Booking Reservation created successfully.")
                                navigate("/sales/standard/booking-reservation-barge/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                            }else{
                                ToastNotify("success", "Booking Reservation created successfully.")
                                navigate("/sales/container/booking-reservation/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                            }

                           
                        }
                    }

                })
            }
            else {
                for (var [key, value] of Array.from(formdata.entries())) {
                    if (key !== "BookingReservationMore[Attachment][]") {
                        formdata.delete(key);
                    }
        
                }
                var obj = window.$($("form")[0]).serializeJSON();
                var jsonString = JSON.stringify(obj);
        
                formdata.append('data', jsonString);
                UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                    if (res.data.data) {
                        if(props.data.modelLink=="booking-reservation-barge"){
                            ToastNotify("success", "Booking Reservation updated successfully.")
                            navigate("/sales/standard/booking-reservation-barge/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                        }else{
                            ToastNotify("success", "Booking Reservation updated successfully.")
                            navigate("/sales/container/booking-reservation/update/id=" + res.data.data.BookingReservationUUID, { state: { formType: "Update", id: res.data.data.BookingReservationUUID } })
                        }

                       
                    }
                    else {
                        if(res.data.message){
                            ToastNotify("error", res.data.message)
                        }else{
                            ToastNotify("error", "Error")
                        }
                      
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
        if(target === "TransferVoyageVoyageNum"){
            setTransferVoyageVoyageNum(val)
        }   
        if(target === "polreqeta"){
            setPOLReqETA(val)
        }
        if(target === "podreqeta"){
            setPODReqETA(val)
        }
        if(target === "QTOption"){
            setQTOption(val)
        }
        if(target === "checkChangeVoyage"){
            setCheckChangeVoyage(val.value)
        }
    } 

    function QuotationRequiredFields(){
        setTimeout(()=>{
            var polPortCode = $("input[name='DynamicModel[POLPortCode]']").val()
            var podPortCode = $("input[name='DynamicModel[PODPortCode]']").val()
            var billToCompany = $("input[name='DynamicModel[BillToCompany]']").val()
            var containertypeNotEmpty = true
            $(".container-itemTRForQT").each(function (key, value) {
                if($(`input[name='BookingReservationHasContainerType[${key}][ContainerType]']`).val() == ""){
                    containertypeNotEmpty = false
                }
                if($(`input[name='BookingReservationHasContainerType[${key}][BoxOwnership]']`).val() == ""){
                    containertypeNotEmpty = false
                }
            })

            if(props.data.modelLink=="booking-reservation-barge"){
                if(!polPortCode || !podPortCode || !billToCompany){
                    $(".getTransferFromQT").addClass("readOnlySelect")
                }else{
                    $(".getTransferFromQT").removeClass("readOnlySelect")
                }

            }else{
                if(!polPortCode || !podPortCode || !billToCompany || !containertypeNotEmpty){
                    $(".getTransferFromQT").addClass("readOnlySelect")
                }else{
                    $(".getTransferFromQT").removeClass("readOnlySelect")
                }
            }
                
          
        },100)
    }

    function FieldArrayHandle(action,data){
        if(action == "remove"){
            remove(data)
            setTimeout(()=> {
                if($(".transhipment").length == 0){
                    $("#bookingreservation-insisttranshipment").prop("checked",false)
                    setValue("BookingReservation[InsistTranshipment]",0)
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
                setValue("BookingReservationHasTranshipment[0][QuickFormPOTVoyage]",data.FromVoyageNum)
                onChangePOTVoyageNum(POTVoyage,"",0)
                VoyageNumOnChangeHandle(PODVoyage)
            }else{
                append({
                    name: "BookingReservationHasTranshipment", 
                    POTPortTerm:defaultPortTerm,
                    QuickFormPOTPortTerm:defaultPortTerm,
                    optionTerminal:[],
                    optionAgentCompany:[],
                    optionAgentBranchCode:[],
                    optionFromVoyage:[],
                    optionToVoyage:[],
    
                })
            }
            if($(`input[name='BookingReservation[InsistTranshipment]']`).val() == 0){
                $("#bookingreservation-insisttranshipment").prop("checked",true)
                setValue("BookingReservation[InsistTranshipment]",1)
            }
        }
    }

    function getUserDetails() {
        GetUserDetails(globalContext).then(res => {
            if(res[0]["Company"]){
                setValue("BookingReservationAgent[ROC]",res[0]["Company"].CompanyUUID)
                $("#CompanyROC-Agent-DetailForm").val(res[0]["Company"].ROC)
                setValue("BookingReservationAgent[CompanyName]",res[0]["Company"].CompanyName)
                setValue("BookingReservationAgent[CreditTerm]",res[0]["Company"].CreditTerm)
                setValue("BookingReservationAgent[CreditLimit]",res[0]["Company"].CreditLimit)
            }
            if(res[0]["Branch"]){
                setValue("BookingReservationAgent[BranchCode]",res[0]["Branch"].CompanyBranchUUID)
                $("#BranchCode-Agent-DetailForm").val(res[0]["Branch"].BranchCode)
                setValue("BookingReservationAgent[BranchName]",res[0]["Branch"].BranchName)
                setValue("BookingReservationAgent[BranchTel]",res[0]["Branch"].Tel)
                setValue("BookingReservationAgent[BranchFax]",res[0]["Branch"].Fax)
                setValue("BookingReservationAgent[BranchEmail]",res[0]["Branch"].Email)
                setValue("BookingReservationAgent[BranchAddressLine1]",res[0]["Branch"].AddressLine1)
                setValue("BookingReservationAgent[BranchAddressLine2]",res[0]["Branch"].AddressLine2)
                setValue("BookingReservationAgent[BranchAddressLine3]",res[0]["Branch"].AddressLine3)
                setValue("BookingReservationAgent[BranchPostcode]",res[0]["Branch"].Postcode)
                setValue("BookingReservationAgent[BranchCity]",res[0]["Branch"].City)
                setValue("BookingReservationAgent[BranchCountry]",res[0]["Branch"].Country)
                setValue("BookingReservationAgent[BranchCoordinates]",res[0]["Branch"].Coordinates)
            }
            if(res[0]["companyContact"]){
                setValue("BookingReservationAgent[AttentionName]",res[0]["companyContact"].FirstName+" "+res[0]["companyContact"].LastName)
                setValue("BookingReservationAgent[AttentionTel]",res[0]["companyContact"].Tel)
                setValue("BookingReservationAgent[AttentionEmail]",res[0]["companyContact"].Email)
            }
            setSalesPerson(res[0]["id"])
        })
    }

    //Advance Booking Start Date &  Advance Booking Last Valid Date show only if quotation type onchange = Advance booking
    function changeQuotationType(current) {
        if(current){
            var str = current.value;
            if (str == "Advance Booking") {
            
                $(".AdvanceBooking").removeClass('d-none');
                $(".NormalBooking").addClass('d-none');
                var docDateForAdvanceBooking = $("#booking-reservation-docdate").val()
                $("#booking-reservation-advancebookingstartdate-quickform").val(docDateForAdvanceBooking)
                $("#booking-reservation-advancebookingstartdate").val(docDateForAdvanceBooking)
            }
            else {
                $(".AdvanceBooking").addClass('d-none');
                $(".NormalBooking").removeClass('d-none');
            }
    
            // if (str == "One-Off") {
    
            //     $(".OneOff").removeClass('d-none');
            //     $(".transhipmentVoyagedisplay").removeClass('d-none');
            //     $(".transhipmentVesseldisplay").removeClass('d-none');
            //     $("#dynamicmodel-voyagenum").attr("required", true);
            // }
            // else {
            //     $(".OneOff").addClass('d-none');
            //     $(".transhipmentVoyagedisplay").addClass('d-none');
            //     $(".transhipmentVesseldisplay").addClass('d-none');
            //     $("#dynamicmodel-voyagenum").attr("required", false);
            // }
        }
    }

    function RemoveHighLightField() {
        $(".HighLight").each(function(){
         $(this).removeClass('HighLight');
        })
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
            var closestVesselCode = $(`#booking-reservationhastranshipment-${index}-quickformpotvoyage`).parent().parent().next().find(".QuickFormVesselCode");
            var filters = {
                "VoyageUUID": $(this).val(),
            };
    
            var text = currentSelector.label;
            var matches = regExp.exec(text);
    
            var PolPortcode = getValues("DynamicModel[POLPortCode]")
            var PodPortcode = getValues("DynamicModel[PODPortCode]")
            var PotPortcode = getValues(`BookingReservationHasTranshipment[${index}][QuickFormPortCode]`)
            var prevPortCode
            
            if (index > 0) {
                startingIndex = index - 1;
                startingVesselName = getValues("#booking-reservationhastranshipment-" + startingIndex + "-fromvesselcode")
                prevPortCode = getValues("#booking-reservationhastranshipment-" + startingIndex + "-portcode")
                setValue("#booking-reservationhastranshipment-" + startingIndex + "-tovoyagenum", VoyageNum)
            }
    
            // $("#booking-reservationhastranshipment-" + index + "-fromvoyagenum").val(VoyageNum).trigger('change.select2')
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
                                setValue(`BookingReservation[POLETA]`,value.ETA)
                                setValue(`BookingReservation[POLETD]`,value.ETD)
                                setValue(`BookingReservation[POLSCNCode]`,value.SCNCode)
                                setValue(`BookingReservation[ClosingDateTime]`,value.ClosingDateTime)
                                $("#booking-reservation-voyage-pol").val(value.VoyageScheduleUUID)
                                
                                if(!value.LocationCode){
                                    setValue(`BookingReservation[POLLocationCode]`,value.LocationCode)
                                    setValue(`BookingReservation[POLLocationName]`,"")
                                    setValue(`BookingReservation[POLAgentROC]`,"")
                                    setValue(`BookingReservation[POLAgentName]`,"")
                                    setValue(`BookingReservation[POLHandlingOfficeCode]`,"")
                                    setValue(`BookingReservation[POLHandlingOfficeName]`,"")
                                }else{
                                    setValue(`BookingReservation[POLLocationCode]`,value.LocationCode)
                                    $.each(value.terminalSelection, function (key1, value1) {
                                        
                                        if(value1.PortDetailsUUID == value.LocationCode){
                                            var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                            var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                            setStateHandle(sortArray(optionCompany),"OptionPOLAgentCompany")
                                            setStateHandle(sortArray(optionCompanyBranch),"OptionPOLAgentCompanyBranch")
                                            setValue(`BookingReservation[POLLocationName]`,value1.LocationCode)
                                            setValue(`BookingReservation[POLAgentROC]`,value1.handlingCompany.AgentCode)
                                            setValue(`BookingReservation[POLAgentName]`,value1.handlingCompany.CompanyUUID)
                                            setValue(`BookingReservation[POLHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                            setValue(`BookingReservation[POLHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                        }
                                    })
                                }
                            
                                foundPOL = true;
                            }

                        }

                        countPOT++;
                    }

                    if (value.PortCode == PotPortcode) {

                        setValue(`BookingReservationHasTranshipment[${index}][DischargingDate]`,value.ETA)
                        setValue(`BookingReservationHasTranshipment[${index}][FromVoyagePOT]`,value.VoyageScheduleUUID)
                    
                    }
                    if (value.PortCode == prevPortCode) {
                    //  var ETA = (value.ETA).split(" ");
                        setValue(`BookingReservationHasTranshipment[${startingIndex}][LoadingDate]`,value.ETA)
                        setValue(`BookingReservationHasTranshipment[${startingIndex}][ToVoyagePOT]`,value.VoyageScheduleUUID)
                    }

                    if (value.PortCode == PotPortcode && foundPOL && foundPOD == false) {
                        if (index == 0) {
                            setValue(`BookingReservation[PODETA]`,value.ETA)
                            setValue(`BookingReservation[PODETD]`,value.ETD)
                            setValue(`BookingReservation[PODSCNCode]`,value.SCNCode)
                            
                            foundPOD = true;
                        }
                    }

                });

                if (index == 0) {
                    var temArray = [currentSelector]
                    setStateHandle(temArray,"VoyageNum")
                    setValue(`BookingReservation[VoyageNum]`,VoyageNum)
                    $("#bookingreservation-vesselcode").val(data[0]["vessel"]["VesselCode"])
                    $("#bookingreservation-voyagename").val(StrvoyageNo)
                    $.each(data, function (key, value) {
                        $("#bookingreservation-vesselname").val(value.vessel.VesselName)
                        setValue("BookingReservationHasTranshipment["+index+"][QuickFormPOTVesselCode]", value.vessel.VesselName)
                    })

                }

                if (foundPOL == false) {
                    if (index == 0) {
                        setValue(`BookingReservation[POLETA]`,"")
                        setValue(`BookingReservation[POLETD]`,"")
                        setValue(`BookingReservation[POLSCNCode]`,"")
                        setValue(`BookingReservation[ClosingDateTime]`,"")
                    }
                }

                if (foundPOD == false) {
                    if (index == 0) {
                        //alert("POD Port Code Not Available for Selected Voyage")
                        setValue(`BookingReservation[PODETA]`,"")
                        setValue(`BookingReservation[PODETD]`,"")
                        setValue(`BookingReservation[PODSCNCode]`,"")
                    }
                }

                if (closestVesselCode.val() == startingVesselName) {
                    $("#booking-reservationhastranshipment-" + startingIndex + "-dischargingdate").val("");
                    $("#booking-reservationhastranshipment-" + startingIndex + "-loadingdate").val("");
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

    function setDataWhenClickNewButton(){
        setQuotationType("Normal")
        getUserDetails()
        setValue("DynamicModel[POLPortTerm]",defaultPortTerm)            
        setValue("DynamicModel[PODPortTerm]",defaultPortTerm)            
        setValue("DynamicModel[BKDocDate]","")       
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
        trigger()
        var index = 0

        if(data) {
            if ($(".transhipment-item").length < 1) {
                setValue(`BookingReservation[VoyageNum]`,data.value)
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
            $(`#booking-reservationhastranshipment-` + index + "-tovoyagenum").val(value).trigger('change.select2')

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
                    startingVesselName = $(`#booking-reservationhastranshipment-0-fromvesselname`).val()
                } else {
                    starting = $(".transhipmentQuickForm").last().find(".QuickFormPortCode").find("input:hidden").val();
                    startingIndex = index - 1
                    startingVesselName = $(`#booking-reservationhastranshipment-` + startingIndex + "-tovesselname").val()
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
                setValue(`BookingReservationHasTranshipment[${index}][optionToVoyage]`,sortArray(VoyageArray))
                update(fields)
                setValue(`BookingReservationHasTranshipment[${index}][ToVoyageNum]`,data[0]["VoyageUUID"])
                $(`#booking-reservationhastranshipment-` + index + "-tovoyagename").val(data[0]["VoyageNumber"])
                $(`#booking-reservationhastranshipment-` + index + "-tovesselcode").val(data[0]["vessel"]["VesselCode"])
                $(`#booking-reservationhastranshipment-` + index + "-tovesselname").val(data[0]["vessel"]["VesselName"])
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

                            setValue(`BookingReservationHasTranshipment[${index}][LoadingDate]`,value.ETA)
                            setValue(`BookingReservationHasTranshipment[${index}][ToVoyagePOT]`,value.VoyageScheduleUUID)
                        }

                        countPOT++;

                    }

                    if (value.PortCode == PodPortcode && foundPOL && foundPOD == false) {
                            setValue(`BookingReservation[PODETA]`,value.ETA)
                            setValue(`BookingReservation[PODETD]`,value.ETD)
                            setValue(`BookingReservation[PODSCNCode]`,value.SCNCode)
                            $(`#booking-reservation-voyage-pod`).val(value.VoyageScheduleUUID)

                            if(!value.LocationCode){
                                setValue(`BookingReservation[PODLocationCode]`,value.LocationCode)
                                setValue(`BookingReservation[PODLocationName]`,"")
                                setValue(`BookingReservation[PODAgentROC]`,"")
                                setValue(`BookingReservation[PODAgentName]`,"")
                                setValue(`BookingReservation[PODHandlingOfficeCode]`,"")
                                setValue(`BookingReservation[PODHandlingOfficeName]`,"")
                            }else{
                                setValue(`BookingReservation[PODLocationCode]`,value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {

                                    if(value1.PortDetailsUUID == value.LocationCode){
                                        var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                        var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                        setStateHandle(sortArray(optionCompany),"OptionPODAgentCompany")
                                        setStateHandle(sortArray(optionCompanyBranch),"OptionPODAgentCompanyBranch")
                                        setValue(`BookingReservation[PODLocationName]`,value1.LocationCode)
                                        setValue(`BookingReservation[PODAgentROC]`,value1.handlingCompany.AgentCode)
                                        setValue(`BookingReservation[PODAgentName]`,value1.handlingCompany.CompanyUUID)
                                        setValue(`BookingReservation[PODHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                        setValue(`BookingReservation[PODHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }

                        // }

                        foundPOD = true;
                        countPOD++;
                    }

                    if (value.PortCode == PodPortcode && index == 0) {
                            setValue(`BookingReservation[PODETA]`,value.ETA)
                            setValue(`BookingReservation[PODETD]`,value.ETD)
                            setValue(`BookingReservation[PODSCNCode]`,value.SCNCode)
                            $(`#booking-reservation-voyage-pod`).val(value.VoyageScheduleUUID)

                            if(!value.LocationCode){
                                setValue(`BookingReservation[PODLocationCode]`,value.LocationCode)
                                setValue(`BookingReservation[PODLocationName]`,"")
                                setValue(`BookingReservation[PODAgentROC]`,"")
                                setValue(`BookingReservation[PODAgentName]`,"")
                                setValue(`BookingReservation[PODHandlingOfficeCode]`,"")
                                setValue(`BookingReservation[PODHandlingOfficeName]`,"")
                            }else{
                                setValue(`BookingReservation[PODLocationCode]`,value.LocationCode)
                                $.each(value.terminalSelection, function (key1, value1) {
                                    if(value1.PortDetailsUUID == value.LocationCode){
                                        var optionCompany = [{value:value1.handlingCompany.CompanyUUID, label:value1.handlingCompany.CompanyName}]
                                        var optionCompanyBranch = [{value:value1.handlingCompanyBranch.CompanyBranchUUID, label:value1.handlingCompanyBranch.BranchCode}]
                                        setStateHandle(sortArray(optionCompany),"OptionPODAgentCompany")
                                        setStateHandle(sortArray(optionCompanyBranch),"OptionPODAgentCompanyBranch")
                                        setValue(`BookingReservation[PODLocationName]`,value1.LocationCode)
                                        setValue(`BookingReservation[PODAgentROC]`,value1.handlingCompany.AgentCode)
                                        setValue(`BookingReservation[PODAgentName]`,value1.handlingCompany.CompanyUUID)
                                        setValue(`BookingReservation[PODHandlingOfficeCode]`,value1.handlingCompanyBranch.CompanyBranchUUID)
                                        setValue(`BookingReservation[PODHandlingOfficeName]`,value1.handlingCompanyBranch.BranchName)
                                    }
                                })
                            }
                            foundPOD = true;
                    }

                }); 

                if (ToVesselName == startingVesselName) {
                        setValue(`BookingReservationHasTranshipment[${index}][LoadingDate]`,"")
                        setValue(`BookingReservationHasTranshipment[${index}][DischargingDate]`,"")
                }

                })
            } else {
                setValue(`BookingReservationHasTranshipment[${index}][optionToVoyage]`,[])
                update(fields)
                setValue(`BookingReservationHasTranshipment[${index}][ToVoyageNum]`,"")
                $(`#booking-reservationhastranshipment-` + index + "-tovoyagename").val("")
                $(`#booking-reservationhastranshipment-` + index + "-tovesselcode").val("")
                $(`#booking-reservationhastranshipment-` + index + "-tovesselname").val("")
                $("#dynamicmodel-vesselcode").val("")
                setValue(`BookingReservationHasTranshipment[${index}][LoadingDate]`,"")
                if (index == 0) {
                    setValue(`BookingReservation[PODETA]`,"")
                    setValue(`BookingReservation[PODETD]`,"")
                    setValue(`BookingReservation[PODSCNCode]`,"")
                }
            }
        }else{
            $(`#booking-reservation-voyage-pod`).val("")
            setValue(`BookingReservation[VoyageNum]`,"")
            setValue(`BookingReservationHasTranshipment[${index}][ToVoyageNum]`,"")
            $(`#booking-reservationhastranshipment-` + index + "-tovoyagename").val("")
            $(`#booking-reservationhastranshipment-` + index + "-tovesselcode").val("")
            $(`#booking-reservationhastranshipment-` + index + "-tovesselname").val("")
            $("#dynamicmodel-vesselcode").val("")
        }
    }

    function GetUpdateCLoneData(id) {
        GetUpdateData(id, globalContext, props.data.modelLink).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}
            var arrayVoyage  = {}
            var controlButtons = {}
            setUpdateDataForTransfer(res.data.data)
            setTransferVoyageUsingData(res.data.data)
            // setControlButtonState()

            if(formState.formType == "Clone"){
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var nowDate = date + '/' + month + '/' + year;
                setDocDate(nowDate)

                res.data.data.BookingReservation.DocDate = nowDate
                res.data.data.BookingReservation.DocNum = ""

                $.each(res.data.data.BookingReservationHasContainerType, function (key,value){
                    res.data.data.BookingReservationHasContainerType[key]["BookingReservationHasContainer"] =[]
                })
            }
            
            if (res.data.data.BookingReservation) {
                setDocumentData(res.data.data.BookingReservation)
                setInstructionData(res.data.data.BookingReservation)
                setShippingInstructionQuickFormData(res.data.data.BookingReservation)
                $.each(res.data.data.BookingReservation, function (key2, value2) {
                    setValue('BookingReservation[' + key2 + ']', value2);
                })
                arrayVoyage["Voyage"] = res.data.data.BookingReservation

                if(res.data.data.BookingConfirmation){
                    controlButtons = {BookingConfirmation:res.data.data.BookingConfirmation.BookingConfirmationUUID,VerificationStatus:res.data.data.BookingReservation.VerificationStatus,Quotation:res.data.data.BookingReservation.Quotation}
                }else{
                    controlButtons = {VerificationStatus:res.data.data.BookingReservation.VerificationStatus,Quotation:res.data.data.BookingReservation.Quotation}
                }

                setControlButtonState(controlButtons)

            }

            if(formState.formType != "Clone"){
                if (res.data.data.BookingConfirmation) {
                    setBookingComfirmationData(res.data.data.BookingConfirmation)
                }
            }

            if(res.data.data.BookingReservationHasTranshipment){
                setTranshipmentData(res.data.data.BookingReservationHasTranshipment)
                arrayVoyage["Transhipment"] = res.data.data.BookingReservationHasTranshipment
            }

            if (res.data.data.BookingReservationHasContainer) {
                setContainerQuickFormData(res.data.data.BookingReservationHasContainer)
                setContainerInnerQuickFormData(res.data.data.BookingReservationHasContainer)
            }

            if (res.data.data.BookingReservationHauler) {

                setHaulerData(res.data.data.BookingReservationHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BookingReservationHauler
            }

            if (res.data.data.BookingReservationMore) {
                setMoreData(res.data.data.BookingReservationMore)
            }

            if (res.data.data.BookingReservation.ShipOperator) {
                ArrayAttention["BookingReservationShipOp"] = res.data.data.BookingReservation.shipOperator
            }

            if (res.data.data.BookingReservationAgent) {
                ArrayAttention["BookingReservationAgent"] = res.data.data.BookingReservationAgent
            }
            if (res.data.data.BookingReservationBillTo) {
                ArrayAttention["BookingReservationBillTo"] = res.data.data.BookingReservationBillTo
            }
            if (res.data.data.BookingReservationShipper) {
                ArrayAttention["BookingReservationShipper"] = res.data.data.BookingReservationShipper
            }

            if (res.data.data.BookingReservationConsignee) {
                ArrayAttention["BookingReservationConsignee"] = res.data.data.BookingReservationConsignee
            }

            if (res.data.data.BookingReservationPartyExt) {
                ArrayAttention["BookingReservationPartyExt"] = res.data.data.BookingReservationPartyExt
            }

            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)
            setVoyageandTranshipmentState(arrayVoyage)

            if(res.data.data.BookingReservationHasContainerType) {
                setContainerTypeAndChargesData(res.data.data.BookingReservationHasContainerType)
            }


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)
            }

            if (res.data.data.BookingReservation.VerificationStatus == "Pending"){
                $(".VerificationStatusField").text("Draft")
                setVerificationStatus("Pending")
            }else if (res.data.data.BookingReservation.VerificationStatus == "Rejected"){
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


    function GetSplitData(id) {
        
        getSplitDataBR(formState, globalContext).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}
            var arrayVoyage  = {}
            var controlButtons = {}

            if (res.data.data.BookingReservation) {
                setDocumentData(res.data.data.BookingReservation)
                setInstructionData(res.data.data.BookingReservation)
                setShippingInstructionQuickFormData(res.data.data.BookingReservation)
                $.each(res.data.data.BookingReservation, function (key2, value2) {
                    setValue('BookingReservation[' + key2 + ']', value2);
                })
                arrayVoyage["Voyage"] = res.data.data.BookingReservation

                if(res.data.data.BookingConfirmation){
                    controlButtons = {BookingConfirmation:res.data.data.BookingConfirmation.BookingConfirmationUUID,VerificationStatus:res.data.data.BookingReservation.VerificationStatus,Quotation:res.data.data.BookingReservation.Quotation}
                }else{
                    controlButtons = {VerificationStatus:res.data.data.BookingReservation.VerificationStatus,Quotation:res.data.data.BookingReservation.Quotation}
                }

                setControlButtonState(controlButtons)

            }

            if (res.data.data.BookingConfirmation) {
                setBookingComfirmationData(res.data.data.BookingConfirmation)
            }

            if(res.data.data.BookingReservationHasTranshipment){
                setTranshipmentData(res.data.data.BookingReservationHasTranshipment)
                arrayVoyage["Transhipment"] = res.data.data.BookingReservationHasTranshipment
            }

            if (res.data.data.BookingReservationHasContainer) {
                setContainerQuickFormData(res.data.data.BookingReservationHasContainer)
                setContainerInnerQuickFormData(res.data.data.BookingReservationHasContainer)
            }

            if (res.data.data.BookingReservationHauler) {

                setHaulerData(res.data.data.BookingReservationHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BookingReservationHauler
            }

            if (res.data.data.BookingReservationMore) {
                setMoreData(res.data.data.BookingReservationMore)
            }

            if (res.data.data.BookingReservation.ShipOperator) {
                ArrayAttention["BookingReservationShipOp"] = res.data.data.BookingReservation.shipOperator
            }

            if (res.data.data.BookingReservationAgent) {
                ArrayAttention["BookingReservationAgent"] = res.data.data.BookingReservationAgent
            }
            if (res.data.data.BookingReservationBillTo) {
                ArrayAttention["BookingReservationBillTo"] = res.data.data.BookingReservationBillTo
            }
            if (res.data.data.BookingReservationShipper) {
                ArrayAttention["BookingReservationShipper"] = res.data.data.BookingReservationShipper
            }

            if (res.data.data.BookingReservationConsignee) {
                ArrayAttention["BookingReservationConsignee"] = res.data.data.BookingReservationConsignee
            }

            if (res.data.data.BookingReservationPartyExt) {
                ArrayAttention["BookingReservationPartyExt"] = res.data.data.BookingReservationPartyExt
            }

            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)
            setVoyageandTranshipmentState(arrayVoyage)

            if(res.data.data.BookingReservationHasContainerType) {
                setContainerTypeAndChargesData(res.data.data.BookingReservationHasContainerType)
                
                // for Split Submit
                var arrayBRHasContainer = []
                $.each(res.data.data.BookingReservationHasContainerType, function (key, value) {
                    $.each(value.BookingReservationHasContainer, function (key2, value2) {
                        arrayBRHasContainer.push(value2.BookingReservationHasContainerUUID)
                    })
                })
                // stringBRHasContainer = arrayBRHasContainer.join()
                setBRHasContainerUUIDsForSplit(arrayBRHasContainer)
            }


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)
            }

            if (res.data.data.BookingReservation.VerificationStatus == "Pending"){
                $(".VerificationStatusField").text("Draft")
                setVerificationStatus("Pending")
            }else if (res.data.data.BookingReservation.VerificationStatus == "Rejected"){
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

    function GetMergeData(id) {
        
        GetMergeBR(formState.id, globalContext,formState.mergeIDs).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}
            var arrayVoyage  = {}
            var controlButtons = {}

            
            
            if (res.data.data.BookingReservation) {
                setDocumentData(res.data.data.BookingReservation)
                setInstructionData(res.data.data.BookingReservation)
                setShippingInstructionQuickFormData(res.data.data.BookingReservation)
                $.each(res.data.data.BookingReservation, function (key2, value2) {
                    setValue('BookingReservation[' + key2 + ']', value2);
                })
                arrayVoyage["Voyage"] = res.data.data.BookingReservation

                if(res.data.data.BookingConfirmation){
                    controlButtons = {BookingConfirmation:res.data.data.BookingConfirmation.BookingConfirmationUUID,VerificationStatus:res.data.data.BookingReservation.VerificationStatus,Quotation:res.data.data.BookingReservation.Quotation}
                }else{
                    controlButtons = {VerificationStatus:res.data.data.BookingReservation.VerificationStatus,Quotation:res.data.data.BookingReservation.Quotation}
                }

                setControlButtonState(controlButtons)

            }

            if (res.data.data.BookingConfirmation) {
                setBookingComfirmationData(res.data.data.BookingConfirmation)
            }

            if(res.data.data.BookingReservationHasTranshipment){
                setTranshipmentData(res.data.data.BookingReservationHasTranshipment)
                arrayVoyage["Transhipment"] = res.data.data.BookingReservationHasTranshipment
            }

            if (res.data.data.BookingReservationHasContainer) {
                setContainerQuickFormData(res.data.data.BookingReservationHasContainer)
                setContainerInnerQuickFormData(res.data.data.BookingReservationHasContainer)
            }

            if (res.data.data.BookingReservationHauler) {

                setHaulerData(res.data.data.BookingReservationHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BookingReservationHauler
            }

            if (res.data.data.BookingReservationMore) {
                setMoreData(res.data.data.BookingReservationMore)
            }

            if (res.data.data.BookingReservation.ShipOperator) {
                ArrayAttention["BookingReservationShipOp"] = res.data.data.BookingReservation.shipOperator
            }

            if (res.data.data.BookingReservationAgent) {
                ArrayAttention["BookingReservationAgent"] = res.data.data.BookingReservationAgent
            }
            if (res.data.data.BookingReservationBillTo) {
                ArrayAttention["BookingReservationBillTo"] = res.data.data.BookingReservationBillTo
            }
            if (res.data.data.BookingReservationShipper) {
                ArrayAttention["BookingReservationShipper"] = res.data.data.BookingReservationShipper
            }

            if (res.data.data.BookingReservationConsignee) {
                ArrayAttention["BookingReservationConsignee"] = res.data.data.BookingReservationConsignee
            }

            if (res.data.data.BookingReservationPartyExt) {
                ArrayAttention["BookingReservationPartyExt"] = res.data.data.BookingReservationPartyExt
            }

            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)
            setVoyageandTranshipmentState(arrayVoyage)

            if(res.data.data.BookingReservationHasContainerType) {
                setContainerTypeAndChargesData(res.data.data.BookingReservationHasContainerType)
            }


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)
            }

            if (res.data.data.BookingReservation.VerificationStatus == "Pending"){
                $(".VerificationStatusField").text("Draft")
                setVerificationStatus("Pending")
            }else if (res.data.data.BookingReservation.VerificationStatus == "Rejected"){
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

            if (formState.formType == "Clone") {
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var nowDate = date + '/' + month + '/' + year;
                setDocDate(nowDate)
            }


            ControlOverlay(false)

        })
    }

    function getTransferFormQTData(id,updateData,docNum){

        var type;
        props.data.modelLink=="booking-reservation-barge"?type="barge":type="normal"
        getTransferFromQuotationData(id,globalContext,type).then(res => {
            if(res.data.message=="Quotation already expired"){
                ControlOverlay(false)
                return false;
               
            }
            
            if(formState.formType=="Update"){
                if(updateData){
                    if(updateData.BookingReservation){
                        res.data.data.BookingReservation.VesselCode = updateData.BookingReservation.VesselCode
                        res.data.data.BookingReservation.VesselName = updateData.BookingReservation.VesselName
                        res.data.data.BookingReservation.VoyageName = updateData.BookingReservation.VoyageName
                        res.data.data.BookingReservation.VoyageNum = updateData.BookingReservation.VoyageNum
                        res.data.data.BookingReservation.VoyagePOD = updateData.BookingReservation.VoyagePOD
                        res.data.data.BookingReservation.VoyagePOL = updateData.BookingReservation.VoyagePOL
                        res.data.data.BookingReservation.POLETA = updateData.BookingReservation.POLETA
                        res.data.data.BookingReservation.POLETD = updateData.BookingReservation.POLETD
                        res.data.data.BookingReservation.PODETA = updateData.BookingReservation.PODETA
                        res.data.data.BookingReservation.PODETD = updateData.BookingReservation.PODETD
                        res.data.data.BookingReservation.ClosingDateTime = updateData.BookingReservation.ClosingDateTime
                        res.data.data.BookingReservation.POLSCNCode = updateData.BookingReservation.POLSCNCode
                        res.data.data.BookingReservation.PODSCNCode = updateData.BookingReservation.PODSCNCode
                        res.data.data.BookingReservation.BookingReservationUUID = updateData.BookingReservation.BookingReservationUUID
                        res.data.data.BookingReservation.DocNum = updateData.BookingReservation.DocNum
                        res.data.data.BookingReservation.DocDate = updateData.BookingReservation.DocDate
                        res.data.data.BookingReservation.LastValidDate = updateData.BookingReservation.LastValidDate
                        res.data.data.BookingReservation.Quotation = id

                        setResetStateValue(updateData.BookingReservation.BookingReservationUUID)
                    }
                    if(updateData.BookingReservationAgent){
                        res.data.data.BookingReservationAgent = updateData.BookingReservationAgent
                    }
                    if(updateData.BookingReservationHasTranshipment){
                        res.data.data.BookingReservationHasTranshipment = updateData.BookingReservationHasTranshipment
                    }
                }
            }
            
            var ArrayAttention = {}
            var ArrayMiddleCard = {}
            if (res.data.data.BookingReservation) {
                res.data.data.BookingReservation.ValidityDay = "7"
                setDocumentData(res.data.data.BookingReservation)
                setInstructionData(res.data.data.BookingReservation)
                setShippingInstructionQuickFormData(res.data.data.BookingReservation)
                $.each(res.data.data.BookingReservation, function (key2, value2) {
                    if(key2 != "DocDate"){
                        setValue('BookingReservation[' + key2 + ']', value2);
                    }
                })
            }

            if(res.data.data.BookingReservationHasTranshipment){
                setTranshipmentData(res.data.data.BookingReservationHasTranshipment)
            }

            if (res.data.data.BookingReservationHasContainer) {
                setContainerQuickFormData(res.data.data.BookingReservationHasContainer)
                setContainerInnerQuickFormData(res.data.data.BookingReservationHasContainer)
            }

            if (res.data.data.BookingReservationHauler) {

                setHaulerData(res.data.data.BookingReservationHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BookingReservationHauler
            }

            if (res.data.data.BookingReservationMore) {
                res.data.data.BookingReservationMore.TNC= defaultTNC
                setMoreData(res.data.data.BookingReservationMore)
            }

            if (res.data.data.BookingReservation.ShipOperator) {
                ArrayAttention["BookingReservationShipOp"] = res.data.data.BookingReservation.shipOperator
            }

            if (res.data.data.BookingReservationAgent) {
                ArrayAttention["BookingReservationAgent"] = res.data.data.BookingReservationAgent
            }
            if (res.data.data.BookingReservationBillTo) {
                ArrayAttention["BookingReservationBillTo"] = res.data.data.BookingReservationBillTo
            }
            if (res.data.data.BookingReservationShipper) {
                ArrayAttention["BookingReservationShipper"] = res.data.data.BookingReservationShipper
            }

            if (res.data.data.BookingReservationConsignee) {
                ArrayAttention["BookingReservationConsignee"] = res.data.data.BookingReservationConsignee
            }

            if (res.data.data.BookingReservationPartyExt) {
                ArrayAttention["BookingReservationPartyExt"] = res.data.data.BookingReservationPartyExt
            }

            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)

            if(res.data.data.BookingReservationHasContainerType) {
                setContainerTypeAndChargesData(res.data.data.BookingReservationHasContainerType)
            }


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)
            }

            if(formState.formType == "Transfer"){ 
                if(formState["voyageTranshipment"]){
                    if(formState["voyageTranshipment"]["Voyage"].length > 0){
                        setQuickFormVoyageNum([{value:formState["voyageTranshipment"]["Voyage"][0]["VoyageUUID"],label:formState["voyageTranshipment"]["Voyage"][0]["VoyageNumber"]+"("+formState["voyageTranshipment"]["Voyage"][0]["vessel"]["VesselCode"]+")"}])
                        setVoyageNum([{value:formState["voyageTranshipment"]["Voyage"][0]["VoyageUUID"],label:formState["voyageTranshipment"]["Voyage"][0]["VoyageNumber"]+"("+formState["voyageTranshipment"]["Voyage"][0]["vessel"]["VesselCode"]+")"}])
                        setVoyageForTransfer([{value:formState["voyageTranshipment"]["Voyage"][0]["VoyageUUID"],label:formState["voyageTranshipment"]["Voyage"][0]["VoyageNumber"]+"("+formState["voyageTranshipment"]["Voyage"][0]["vessel"]["VesselCode"]+")"}])
                    }
                    
                    var tempArrayForTranshipment = []
                    $.each(formState["voyageTranshipment"]["Transhipment"], function (key, value) {
                        tempArrayForTranshipment.push({value:value.VoyageUUID,label:value.VoyageNumber+"("+value.vessel.VesselCode+")"})
                    })
    
                    setTranshipmentForTransfer(tempArrayForTranshipment)
                }
                setSalesPerson(res.data.data.BookingReservation.SalesPerson)
                setQuotationType(res.data.data.BookingReservation.QuotationType)
                getUserDetails()
            }
            ControlOverlay(false)
        })
    }

    function transferFromQT(val){
        if(val){
            if(props.data.modelLink=="booking-reservation"){   
               
                if( userRule.includes(`transferfrom-${props.data.modelLink}`) && userRule.includes(`create-${props.data.modelLink}`)){
                         if(formState.formType == "Update"){
                            ControlOverlay(true)
                            getTransferFormQTData(val.value,updateDataForTransfer,val.label)

                        }else{
                            ControlOverlay(true)
                            var brdocdate = getValues(`BookingReservation[DocDate]`)
                            navigate("/sales/container/booking-reservation/transfer-from-quotation/id=" + val.value, { state: { formType: "Transfer", id: val.value, docNum:val.label, date:brdocdate, voyageTranshipment:voyageandTranshipmentState} })
                        }
            
                }else{
                    alert("You are not allowed to Transfer from Quotation, Please check your Permission.")
                }

            }
            // if(formState.formType == "Update"){
            //     ControlOverlay(true)
            //     getTransferFormQTData(val.value,updateDataForTransfer,val.label)

            // }else{
            //     ControlOverlay(true)
            //     var brdocdate = getValues(`BookingReservation[DocDate]`)
            //     navigate("/sales/container/booking-reservation/transfer-from-quotation/id=" + val.value, { state: { formType: "Transfer", id: val.value, docNum:val.label, date:brdocdate, voyageTranshipment:voyageandTranshipmentState} })
            // }
            
        }
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
    
            $("#booking-reservation-voyagenum").val("").trigger("change")
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
        
        getUserDetails()

      }, []);


    useEffect(() => {
        reset()
        $(".Ports").addClass('d-none')

        const objRule = JSON.parse(globalContext.userRule);
        var tempModel="booking-reservation"
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(tempModel)
        });

        setUserRule(filteredAp)
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
            var ArrayVessel = [];
            
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
                    setBookingQTNoReadonly(false)
                    RemoveAllReadOnlyFields()
                }
                else if(formState.formType=="VoyageDelay"){
                    setVoyageDelay(true)
                    ControlOverlay(true)
                    GetUpdateCLoneData(formState.id)
                    setBookingQTNoReadonly(false)
                    RemoveAllReadOnlyFields()
                }
                else if (formState.formType == "Transfer"){
                    ControlOverlay(true)
                    setBookingQTNoReadonly(false)
                    RemoveAllReadOnlyFields()
                    RemoveHighLightField()
                    if(formState.date){
                        setDocDate(formState.date)
                        setQTOption([{value:formState.id,label:formState.docNum}])
                        setValue("DynamicModel[Quotation]",formState.id)
                        setValue("BookingReservation[Quotation]",formState.id)
                    }else{
                        var date = new Date().getDate();
                        var month = new Date().getMonth() + 1;
                        var year = new Date().getFullYear();            
                        var nowDate =   date + '/' + month + '/' + year;
                        setDocDate(nowDate)
                    }
                    setValue(`DynamicModel[ValidityDay]`,"7")
                    setValue(`BookingReservation[ValidityDay]`,"7")
                    setResetStateValue(formState.id)
                    getTransferFormQTData(formState.id)
                }
                else if (formState.formType == "SplitBR"){
                    ControlOverlay(true)
                    GetSplitData(formState.id)
                    setResetStateValue(formState.id)
                    setBookingQTNoReadonly(false)
                    RemoveAllReadOnlyFields()
                }
                else if (formState.formType == "MergeBR"){
                    ControlOverlay(true)
                    GetMergeData(formState.id)
                    setResetStateValue(formState.id)
                    setBookingQTNoReadonly(false)
                    RemoveAllReadOnlyFields()
                }
                else{
                    var date = new Date().getDate();
                    var month = new Date().getMonth() + 1;
                    var year = new Date().getFullYear();            
                    var nowDate =   date + '/' + month + '/' + year;
                    setDocDate(nowDate)
                    setQuotationType("Normal")
                    setValue(`DynamicModel[ValidityDay]`,"7")
                    setValue(`BookingReservation[ValidityDay]`,"7")
                    if(formState.formNewClicked){
                        RemoveAllReadOnlyFields()
                    }
                    setDataWhenClickNewButton()
                }
            } else {
                ControlOverlay(true)
                GetUpdateCLoneData(params.id)
                setResetStateValue(params.id)
                setBookingQTNoReadonly(false)
                RemoveAllReadOnlyFields()
            }
            

            
            $(".BookingLink").off("click").on('click', function () {
                var id = formState.id
                if(id){
                    if(props.data.modelLink=="booking-reservation-barge"){
                        window.open('../../../../sales/standard/booking-reservation-barge/update/id=' + id, '_blank')
                    }else{
                        window.open('../../../../sales/container/booking-reservation/update/id=' + id, '_blank')
                    }
              
                }
            });
            $(".QuotationLink").off("click").on('click', function () {
                var id = getValues("DynamicModel[Quotation]")
                if(id){
                    if(props.data.modelLink=="booking-reservation-barge"){
                        window.open('../../../../sales/standard/quotation-barge/update/id=' + id, '_blank')
                    }else{
                        window.open('../../../../sales/container/quotation/update/id=' + id, '_blank')
                    }
                    
                }
            });
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
                $(".BookingReservationHasTranshipment["+key+"][BookingReservationHasTranshipmentUUID]").closest(".transhipment-item").find(".PortCode").val(value.Area)

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
                    if(value.fromVoyage){
                        optionFromVoyage.push({value:value.fromVoyage.VoyageUUID, label:value.fromVoyage.VoyageNumber + "(" +value.FromVesselCode+ ")"})
                        value["QuickFormPOTVoyage"] = value.fromVoyage.VoyageUUID
                    }
                }

                if(value.ToVoyageNum){
                    if(value.toVoyage){
                        optionToVoyage.push({value:value.toVoyage.VoyageUUID, label:value.toVoyage.VoyageNumber + "(" +value.ToVesselCode+ ")"})
                    }
                }

                value["name"] = "BookingReservationHasTranshipment"
                value["QuickFormPortCode"]= value.PortCode
                value["QuickFormPOTPortTerm"]= value.POTPortTerm
                value["QuickFormPOTVesselCode"]= value.FromVesselCode
                value["optionTerminal"] = sortArray(optionTerminal)
                value["optionAgentCompany"] = sortArray(optionAgentCompany)
                value["optionAgentBranchCode"] = sortArray(optionAgentBranchCode)
                value["optionFromVoyage"] = sortArray(optionFromVoyage)
                value["optionToVoyage"] = sortArray(optionToVoyage)

                append(value)
                // if (formState.formType!="Transfer"){
                    setQuickFormVoyageNum(optionToVoyage)
                // }
                
                if(value.ToVoyageNum){
                    if(value.toVoyage){
                        setValue("DynamicModel[VoyageNum]",value.toVoyage.VoyageUUID)
                    }
                    setValue("DynamicModel[VesselCode]",value.ToVesselCode)
                    $("input[name='DynamicModel[VesselCode]']").val(value.ToVesselCode)
                }
                setTimeout(()=>{
                    $("input[name='BookingReservationHasTranshipment["+key+"][BookingReservationHasTranshipmentUUID]']").closest(".transhipment-item").find(".PortCode").text(value.Area)
                    $("#booking-reservationhastranshipment-"+key+"-seqnum").val(value.SeqNum)
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
    <form id="BookingReservationForm">
        {formState ? formState.formType == "Clone" || formState.formType == "New" || formState.formType == "Transfer"? <CreateButton handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="booking-reservation-barge"?true:false} title='BookingReservation' data={props}/> : <UpdateButton  handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="booking-reservation-barge"?true:false} title="BookingReservation" model="booking-reservation" selectedId="BookingReservationUUIDs" id={formState.id} data={props} controlButtonState={controlButtonState} voyageDelay={voyageDelay} position="top"/> : <CreateButton handleSubmitData={handleSubmitForm}   barge={props.data.modelLink=="booking-reservation-barge"?true:false} title='BookingReservation' data={props} />}
        <div className="">
          <div className="box"> 
            <div className="left-form">
                <div className="flex-container">
                <FormContext.Provider value={{fields, update, FieldArrayHandle, getValues, docDate, salesPerson, formState, quotationType, lastValidDate, advanceBookingStartDate, advanceBookingLastValidDate, defaultPortTerm, defaultCurrency, setStateHandle, optionPOLTerminal, optionPODTerminal, optionPOLAgentCompany, optionPODAgentCompany, optionPOLAgentCompanyBranch, 
                optionPODAgentCompanyBranch,bargeCode, pOLReqETA, pODReqETA, portTerm, freightTerm, defaultFinalDestinationCompany, setDefaultFinalDestinationCompany, VoyageNum, quickFormVoyageNum, transferVoyageVoyageNum, verificationStatus, ApprovedStatusReadOnlyForAllFields, RemoveAllReadOnlyFields, resetStateValue, QTOption , voyageandTranshipmentState, setVoyageandTranshipmentState , voyageForTransfer, 
                clearErrors, getTransferFormQTData, updateDataForTransfer, transhipmentForTransfer, bookingQTNoReadonly, QuotationRequiredFields, setCheckErrorContainer, checkErrorContainer, checkChangeVoyage}} >

                    {/* start: quick form  */}
                    <div className="card card-primary flex-item-left mb-0">
                        <div className="card-header">
                            <h3 id="QuickForm" className="card-title">Quick Form</h3>
                        </div>
                        <div className="card-body cardMaxHeight">
                            <QuickForm userRule={userRule} bargeCode={bargeCode} barge={props.data.modelLink=="booking-reservation-barge"?true:false} user={user} register={register} setValue={setValue} getValues={getValues} trigger={trigger} control={control} errors={errors} port={port} freightTerm={freightTerm} taxCode={taxCode} currency={currency} changeQuotationType={changeQuotationType} containerType={containerType} cargoType={cargoType} documentData={documentData} middleCardData={middleCardQuickFormData} shippingInstructionData={shippingInstructionQuickFormData} setContainerTypeAndChargesData={setContainerTypeAndChargesData} containerTypeAndChargesData={containerTypeAndChargesData} QTOption={QTOption} transferFromQT={transferFromQT} bookingComfirmationData={bookingComfirmationData} navigate={navigate}/>
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
                            <Instruction bargeCode={bargeCode} barge={props.data.modelLink=="booking-reservation-barge"?true:false} register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port} instructionData={instructionData}/>
                            <Transhipment register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port}/>
                            <Hauler creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} haulerData={haulerData}/>
                            <More state={state} register={register} setValue={setValue} control={control} errors={errors} moreData={moreData}/>
                            <Inspect />
                        </div>
                    </div>
                    {/* end: detail form  */}
                    <ShareInitialize formName="BookingReservation" formNameLowerCase="bookingreservation" remove={remove} setValue={setValue} getValues={getValues} trigger={trigger} globalContext={globalContext} />
                    <VoyageModal formName="BookingReservation" formNameLowerCase="bookingreservation" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port}/>
                    <ContainerModal formName="BookingReservation" formNameLowerCase="bookingreservation" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                    <CurrencyModal formName="BookingReservation" formNameLowerCase="bookingreservation" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                    {formState.formType == "Update"?<TransferVoyage barge={props.data.modelLink=="booking-reservation-barge"?true:false} formState={formState} register={register} control={control} errors={errors} setValue={setValue} getValues={getValues} port={port} trigger={trigger} transferVoyageUsingData={transferVoyageUsingData}/>:""}
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
        <DNDModal title={"bookingreservation"}/>
        <QuotationFilterModal title={"bookingreservation"}/>
        {formState ? formState.formType == "Clone" || formState.formType == "New" || formState.formType == "Transfer"? <CreateButton handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="booking-reservation-barge"?true:false} title='BookingReservation' data={props}/> : <UpdateButton  handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="booking-reservation-barge"?true:false} title="BookingReservation" model="booking-reservation" selectedId="BookingReservationUUIDs" id={formState.id} data={props} controlButtonState={controlButtonState} voyageDelay={voyageDelay} position="bottom"/> : <CreateButton handleSubmitData={handleSubmitForm}   barge={props.data.modelLink=="booking-reservation-barge"?true:false} title='BookingReservation' data={props} />}
    </form>
  )
}

export default Form


function TransferVoyage(props) {
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();

    var ShippingInstructionItem ={
        formName:"BookingReservation",
        cardLength:"col-md-8",
    }
    function nextModalForTransferVoyage(){
        var newVoyageTranshipment = [];
        if ($(`input[name="TransferVoyage[Quotation]"]`).val() == null || $(`input[name="TransferVoyage[Quotation]"]`).val() == ""){
            $(`input[name="TransferVoyage[Quotation]"]`).parent().find(".select__control").addClass("select-with-red-border")
        }else{

            $(".TransferVoyageVoyageNum").each(function () {
                newVoyageTranshipment.push($(this).find('.select__control').find(".select__single-value").text())
            })

            var newVoyage = $('#transfervoyage-voyagenum').find('.select__control').find(".select__single-value").text();

            newVoyageTranshipment.push(newVoyage)

            var id = props.formState.id
            $("#voyageConfirmRequest").empty()

            getTransferVoyageEffectedDocument(id,globalContext).then(data => {
                if (data.data.Container != null) {
                    var stringcontainer;
                    var array = [];
                    $.each(data.data.Container, function (key, value) {
                        array.push(value.ContainerCode)
                    });
                    if (array != null) {
                        stringcontainer = array.join(",")
                    }
                    alert('Container "' + stringcontainer + '" already loaded, Transfer Voyage is not available.')
                }
                else if (data.data.DeliveryOrder != null) {
                    alert('Delivery Order "' + data.data["DeliveryOrder"]["DocNum"] + '" already created, Transfer Voyage is not available.')
                }
                else {
                    var containerReleaseOrderDocNum = [];
                    var salesInvoiceDocNum = [];

                    window.$('#TransferVoyageModal').modal('toggle');
                    var TransferFromVoyage = $("#transferFromVoyageSelect").val()
                    var TransferToVoyage = $("#transferToVoyageSelect").val()

                    window.$("#AlteredDocumentsBody").empty();

                    window.$('#TransferVoyageModalNext').modal('toggle');
                    var FromVoyageArray = []
                    if ($(".previousVoyageNumPOT").length >0) {
                        $.each($(".previousVoyageNumPOT"), function (key4, value4) {
                            FromVoyageArray.push($(value4).val())
                        })
                        FromVoyageArray.push($(".previousVoyageNum").val());
                    } else {
                        FromVoyageArray.push($(".previousVoyageNum").val());
                    }

                    var arr = [];
                    var arrVoy = [];

                    $.each(FromVoyageArray, function (key, value) {

                        $.each(newVoyageTranshipment, function (key2, value2) {

                            if (key == key2) {
                                var temp = " " + value + "->" + value2 + "<br>";

                                arr.push(temp)

                                if (value.replace(/ /g, "") != value2.replace(/ /g, "")) {

                                    var tempVoy = " " + value + " change to " + value2 + "<br>";
                                    arrVoy.push(tempVoy)
                                }

                            }

                        })

                    })

                    var Voyage = arr.join(" ");

                    var VoyageConfirm = arrVoy.join(" ")

                    if (VoyageConfirm == "") {
                        $("#voyageConfirmRequest").append("<h5>No changes has been made.</h5>")
                        $(".ConfirmRequestTransferVoyage").addClass('d-none')
                    } else {
                        $("#voyageConfirmRequest").append("<h5>The selected documents voyage change as below<br><br>" + VoyageConfirm + "<br>Are you sure you want to continue ?</h5>")
                        $(".ConfirmRequestTransferVoyage").removeClass('d-none')
                    }


                    $.each(data.data, function (key2, value2) {
                        var key2 = key2.replace(/([A-Z])/g, ' $1').trim()
                        var found = false;
                        if (key2 == "Container Release Order") {
                            found = true;
                            if (value2.length != 0) {
                                $.each(value2, function (key2, value2) {
                                    containerReleaseOrderDocNum.push(value2.DocNum)
                                })
                                var DocNum = containerReleaseOrderDocNum.join();
                                $("#AlteredDocumentsBody").append("<tr><td>" + key2 + "</td><td>" + DocNum + "</td><td>" + Voyage + "</td></tr>");
                            }

                        }
                        if (key2 == "Sales Invoice") {
                            found = true;
                            $.each(value2, function (key2, value2) {
                                salesInvoiceDocNum.push(value2.DocNum)
                            })
                            var DocNum = salesInvoiceDocNum.join();
                            if (DocNum != "") {
                                $("#AlteredDocumentsBody").append("<tr><td>" + key2 + "</td><td>" + DocNum + "</td><td>" + Voyage + "</td></tr>");
                            }

                        }
                        if (found !== true) {
                            if (value2 != null) {
                                $("#AlteredDocumentsBody").append("<tr><td>" + key2 + "</td><td>" + value2.DocNum + "</td><td>" + Voyage + "</td></tr>");
                            }

                        }


                    })
                }

            })
        }
    }

    function ConfirmTransferVoyage(filteredAp){
        var type;
        props.barge?type="barge":type="normal"
        const objRule = JSON.parse(globalContext.userRule);
        var tempModel="booking-reservation"
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(tempModel)
        });
    
        // $('#TransferVoyageModalNext').modal('toggle');
        var FromVoyageTranshipment = []
        var BookingReservationUUID = props.formState.id

        FromVoyageTranshipment.push({
            PortCode: props.getValues(`TransferVoyage[POLPortCode]`),
            VoyageNum: "",
            DischargingDate: "",
            LoadingDate: ""
        });

        $(".transhipmentTransferVoyage").each(function (key,value) {
            FromVoyageTranshipment.push({
                PortCode:  props.getValues(`TransferVoyageTranshipment[${key}][TransferVoyagePortCode]`),
                VoyageNum: props.getValues(`TransferVoyageTranshipment[${key}][TransferVoyagePOTVoyage]`),
                DischargingDate: props.getValues(`TransferVoyageTranshipment[${key}][DischargingDate]`),
                LoadingDate: props.getValues(`TransferVoyageTranshipment[${key}][LoadingDate]`),
            })
        })
        FromVoyageTranshipment.push({
            PortCode: props.getValues(`TransferVoyage[POLPortCode]`),
            VoyageNum: props.getValues(`TransferVoyage[VoyageNum]`),
            DischargingDate: props.getValues(`TransferVoyage[TransferPODeta]`),
            LoadingDate: props.getValues(`TransferVoyage[TransferPODetd]`),
            PODSCNCode: props.getValues(`TransferVoyage[TransferPODScnCode]`),
        });

        var qtNo = props.getValues(`TransferVoyage[Quotation]`)

        window.$("#TransferVoyageModalConfirmRequest").modal("toggle")
        // $("#ConfirmRequestTransferVoyage").click()
        window.$("#ConfirmRequestTransferVoyage").unbind()
        window.$("#ConfirmRequestTransferVoyage").click(function () {
            
                if(filteredAp.includes(`transfer-voyage-booking-reservation`)){
                    TransferVoyageBR(BookingReservationUUID,FromVoyageTranshipment,qtNo,globalContext,type).then(data => {
                        if (data == "Expired") {
                            alert("Quotation already Expired. Please check your Quotation Last Valid Date.")
                        } 
                        else if(data == "Please check your Charges (Null)"){
                            alert("Charges's vessel type is not same with vessel type")
                        }
                        else {
                            window.$("#TransferVoyageModalConfirmRequest").modal("toggle")
                            window.$("#TransferVoyageModalNext").modal("toggle")
                            if(props.barge){
                                navigate("/sales/standard/booking-reservation-barge/index")
                            }else{
                                navigate("/sales/container/booking-reservation/index")
                            }
                            
                        }
                    })
                }else{
                     alert("You are not allowed to perform Transfer Voyage function. Please Check Your User Permission.")
                }
               

                   
    
        });
    }

    return(
        <>
            <div className="modal fade" id="TransferVoyageModal" tabIndex="-1" role="dialog" style={{paddingRight: "17px"}} aria-labelledby="exampleModalLabel" aria-modal="true">
                <div className="modal-dialog modal-xl" role = "document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Transfer Voyage</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="FromVoyageTranshipmentDetails" value="" />  
                            <input type="hidden" id="FromVoyageDetails" />
                            <TransferVoyageModal  register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ShippingInstructionItem={ShippingInstructionItem} port={props.port} trigger={props.trigger} transferVoyageUsingData={props.transferVoyageUsingData}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary NextTransferVoyage" id="NextTransferVoyage" onClick={nextModalForTransferVoyage}>Next</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* < Modal: Transfer Voyage Form  */}
            <div className="modal fade" id="TransferVoyageModalNext" tabIndex="-1" role="dialog" style={{paddingRight: "17px"}} aria-labelledby="exampleModalLabel" aria-modal="true">
                <div className="modal-dialog modal-xl" role = "document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Transfer Voyage From</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="model-body">
                            <h1 style={{paddingLeft: "17px"}}>Affected Documents</h1>
                            <table id="AlteredDocumentsTable" style={{width:"97%"}} className="table table-bordered commontable container-items ui-sortable ml-3">
                                <thead>
                                <tr id="head">
                                    <th width="20%">Module</th>
                                    <th width="30%">Doc No.</th>
                                    <th width="50%">Voyage</th>
                                </tr>
                                </thead>
                                <tbody id="AlteredDocumentsBody">

                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-primary ConfirmTransferVoyage" style={{position:"relative",top:"3px" }} id="ConfirmTransferVoyage" onClick={ConfirmTransferVoyage}>Confirm</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>       
            </div>

             {/* Modal: Transfer Voyage */}
            <div className="modal fade" id="TransferVoyageModalConfirmRequest" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Transfer Voyage From</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {/* <h1>Selected Documents voyage will be change. Are you sure to continue?</h1> */}
                        <div className="voyageConfirmRequest" id="voyageConfirmRequest">

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary ConfirmRequestTransferVoyage" style={{position:"relative", top:"3px"}} id="ConfirmRequestTransferVoyage">Confirm</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}
