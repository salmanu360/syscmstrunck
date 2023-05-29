import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify,sortArray, SplitShareContainer,FindBLRemainingBR,MergeBillOfLading, GetSplitBL,GetMergeBL, getBLTransferFromBooking, ControlOverlay, GetBookingReservationContainerQty, initHoverSelectDropownTitle, GetAllDropDown, GetUserDetails, getAreaById, getPortDetails, getPortDetailsById, getVoyageByIdSpecial, GetCompanyByShipOrBox } from '../../Components/Helper.js'
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
import { AttentionModal, DNDModal, VoyageModal, ContainerModal, CurrencyModal, TransferFromBRModal } from '../../Components/ModelsHelper';
import Hauler from './Hauler';
import ShareInitialize from '../../Components/CommonElement/ShareInitialize';
import Inspect from './Inspect';
import Instruction from './Instruction';
import Transhipment from './Transhipment';
import { getValue } from '@testing-library/user-event/dist/utils';


function Form(props) {

    const { state } = useLocation();
    const formContext = useContext(FormContext)
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    const [valid, setValid] = useState(1)
    const { register, handleSubmit, getValues, setValue, reset, control, watch, formState: { errors } } = useForm({});

    const { fields, append, prepend, remove, swap, move, insert, update, replace } = useFieldArray({
        control,
        name: "BillOfLadingHasTranshipment"
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
    const [bargeCode, setBargeCode] = useState("")
    const [bookingSelection, setBookingSelection] = useState([])


    //check finish load
    const [checkLoadAll, setCheckLoadAll] = useState(false)

    //container
    const [containerType, setContainerType] = useState([])

    //Booking Reservation
    const [bookingReservation, setBookingReservation] = useState([])

    //data pass when update
    const [documentData, setDocumentData] = useState()
    const [attentionData, setAttentionData] = useState()
    const [instructionData, setInstructionData] = useState()
    const [haulerData, setHaulerData] = useState()
    const [moreData, setMoreData] = useState()

    const [shippingInstructionQuickFormData, setShippingInstructionQuickFormData] = useState()
    const [middleCardQuickFormData, setMiddleCardQuickFormData] = useState()
    const [containerQuickFormData, setContainerQuickFormData] = useState()
    const [containerInnerQuickFormData, setContainerInnerQuickFormData] = useState()
    const [freightChargesQuickFormData, setFreightChargesQuickFormData] = useState()

    const [oriData, setOridata] = useState()
    const [voyageDelay, setVoyageDelay] = useState(false)

    const [bookingReservationDoc, setBookingReservationDoc] = useState()


    const onSubmit = (data, event) => {
        event.preventDefault();
        // if(errors)

        var tempForm = $("form")[0]

        // $.each($(".inputDecimalFourPlaces"), function () {
        //     var value1 = $(this).val();
        //     if (value1 !== "") {
        //         $(this).val(parseFloat(value1).toFixed(4));

        //     }
        // });
        
        $(tempForm).find(".PermitAttachmentCheckbox").each(function(){
            if($(this).prop("checked")){
                 $(this).next().val("1");
            }else{
                $(this).next().val("0");
            }
        })
        
        $(tempForm).find(".inputDecimalThreePlaces").each(function () {
            var value1 = $(this).val();
            if (value1 !== "") {
                $(this).val(parseFloat(value1).toFixed(4));

            }
        })

        $(tempForm).find(".inputDecimalTwoPlaces").each(function () {
            var value1 = $(this).val();
            if (value1 !== "") {
                $(this).val(parseFloat(value1).toFixed(4));

            }
        })

        const formdata = new FormData(tempForm);
        const bargeFormData = new FormData();

        if(props.data.modelLink=="bill-of-lading-barge"){
            formdata.forEach((value, key) => {
                const newKey = key.replace('BillOfLadingHasContainer', 'BillOfLadingCharges');
                bargeFormData.append(newKey,value)        
            });
        }

        $(".multipleContainerCode").find(":hidden").each(function () {
            if (formdata.get($(this).attr("name")) == "") {
                formdata.set($(this).attr("name"), [])
            }
        })

        $(".ContainerCodeInner").find("input:hidden").each(function () {

            var tempNameValue = formdata.get($(this).attr("name"))

            if ($(this).attr("name")) {
                var splitName = $(this).attr("name").split('[')
                formdata.delete($(this).attr("name"));
                formdata.set(`${splitName[0]}[${splitName[1].replace(']', "")}][${splitName[2].replace(']', "")}][${splitName[3].replace(']', "")}][ContainerCode]`, tempNameValue)

            }



            // if (formdata.get($(this).attr("name")) == "") {
            //     formdata.set($(this).attr("name"),[])
            // }
        })




        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone" || formState.formType == "TransferFromBooking") {


            CreateData(globalContext, props.data.modelLink, props.data.modelLink=="bill-of-lading-barge"?bargeFormData:formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Bill Of Lading has already been taken.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        if(props.data.modelLink=="bill-of-lading-barge"){
                            ToastNotify("success", "Bill Of Lading created successfully.")
                            navigate("/operation/standard/bill-of-lading-barge/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                        }else{
                            ToastNotify("success", "Bill Of Lading created successfully.")
                            navigate("/operation/container/bill-of-lading/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                        }
                      
                    }
                }

            })
        } else if (formState.formType == "SplitBL") {
   
            SplitShareContainer(globalContext,formdata,formState.bLId,formState.splitID,formState.shareID).then(res => {
                if (res.data) {
                    if (res.data.message == "Bill Of Lading has already been taken.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Bill Of Lading created successfully.")
                        navigate("/operation/container/bill-of-lading/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else if (formState.formType == "MergeBL") {
            MergeBillOfLading(globalContext,formdata,formState.bLId,formState.mergeIDs).then(res => {
                if (res.data) {
                    if (res.data.message == "Bill Of Lading has already been taken.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Bill Of Lading created successfully.")
                        navigate("/operation/container/bill-of-lading/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, props.data.modelLink=="bill-of-lading-barge"?bargeFormData:formdata).then(res => {
                if (res.data.data) {
                    if(props.data.modelLink=="bill-of-lading-barge"){
                        ToastNotify("success", "Bill Of Lading updated successfully.")
                        navigate("/operation/standard/bill-of-lading-barge/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }else{
                        ToastNotify("success", "Bill Of Lading updated successfully.")
                        navigate("/operation/container/bill-of-lading/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                   

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }
    }

    function setStateHandle(val, target) {

        if (target === "DocDate" || target === "AdvanceBookingStartDate") {
            setDocDate(val)
        }
        if (target === "SalesPerson") {
            setSalesPerson(val)
        }
        if (target === "QuotationType") {
            setQuotationType(val)
        }
        if (target === "LastValidDate" || target === "AdvanceBookingLastValidDate") {
            setLastValidDate(val)
        }
        if (target === "AdvanceBookingStartDate") {
            setAdvanceBookingStartDate(val)
        }
        if (target === "AdvanceBookingLastValidDate") {
            setAdvanceBookingLastValidDate(val)
        }
        if (target === "OptionPOLTerminal") {
            setOptionPOLTerminal(val)
        }
        if (target === "OptionPODTerminal") {
            setOptionPODTerminal(val)
        }
        if (target === "OptionPOLAgentCompany") {
            setOptionPOLAgentCompany(val)
        }
        if (target === "OptionPODAgentCompany") {
            setOptionPODAgentCompany(val)
        }
        if (target === "OptionPOLAgentCompanyBranch") {
            setOptionPOLAgentCompanyBranch(val)
        }
        if (target === "OptionPODAgentCompanyBranch") {
            setOptionPODAgentCompanyBranch(val)
        }
        if (target === "VoyageNum") {
            setVoyageNum(val)
        }
        if (target === "QuickFormVoyageNum") {
            setQuickFormVoyageNum(val)
        }
        if (target === "polreqeta") {
            setPOLReqETA(val)
        }
        if (target === "podreqeta") {
            setPODReqETA(val)
        }
        if (target === "bookingSelection") {
            setBookingSelection(val)
        }
    }



    useEffect(() => {
        if (docDate) {
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

            $("#billoflading-voyagenum").val("").trigger("change")
            $("#dynamicmodel-voyagenum").parent().find(".select2-container--default").addClass('InvalidField')
            $("#dynamicmodel-voyagenum").parent().parent().find('.help-block').text($("#dynamicmodel-voyagenum").parent().parent().find("label").text() + " cannot be blank")
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
            if (this.id == "QuickForm") {
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
            else {
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

        GetUserDetails(globalContext).then(res => {
            setValue("BillOfLadingAgent[ROC]", res[0]["Company"].ROC)
            setSalesPerson(res[0]["id"])
        })

    }, []);


    function GetUpdateCLoneData(id) {
      
   
        GetUpdateData(id, globalContext, props.data.modelLink).then(res => {

            var ArrayAttention = {}
            var ArrayMiddleCard = {}

            if (res.data.data.BillOfLading) {
                setDocumentData(res.data.data.BillOfLading)
                setInstructionData(res.data.data.BillOfLading)
                setShippingInstructionQuickFormData(res.data.data.BillOfLading)
                $.each(res.data.data.BillOfLading, function (key2, value2) {

                    setValue('BillOfLading[' + key2 + ']', value2);


                })
                if(res.data.data.BillOfLading.SplitParent==null){
                    $(".revertSplitButton").addClass("d-none")
                }else{
                    $(".revertSplitButton").removeClass("d-none")
                }
            }
            
            if (res.data.data.BillOfLading.VerificationStatus == "Pending") {
                $(".VerificationStatusField").text("Draft")
                $(".VerificationStatusField").removeClass("text-danger")
            } else if (res.data.data.BillOfLading.VerificationStatus == "Rejected") {
                $(".VerificationStatusField").text("Rejected")
                $(".VerificationStatusField").addClass("text-danger")
            }
            $(".VerificationStatusField").last().addClass("d-none")

            if (res.data.data.BillOfLadingHasContainer) {

                if(props.data.modelLink=="bill-of-lading-barge"){
                    setContainerQuickFormData(res.data.data.BillOfLadingCharges)
                }else{
                    setContainerQuickFormData(res.data.data.BillOfLadingHasContainer)
                    setContainerInnerQuickFormData(res.data.data.BillOfLadingHasContainer)
                }

            }

            if (res.data.data.BillOfLadingHauler) {

                setHaulerData(res.data.data.BillOfLadingHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BillOfLadingHauler
            }

            if (res.data.data.BillOfLadingMore) {

                setMoreData(res.data.data.BillOfLadingMore)
            }

            if (res.data.data.BillOfLadingAgent) {
                ArrayAttention["BillOfLadingAgent"] = res.data.data.BillOfLadingAgent
            }
            if (res.data.data.BillOfLadingBillTo) {
                ArrayAttention["BillOfLadingBillTo"] = res.data.data.BillOfLadingBillTo
            }
            if (res.data.data.BillOfLadingShipper) {
                ArrayAttention["BillOfLadingShipper"] = res.data.data.BillOfLadingShipper
            }

            if (res.data.data.BillOfLadingConsignee) {
                ArrayAttention["BillOfLadingConsignee"] = res.data.data.BillOfLadingConsignee
            }

            if (res.data.data.BillOfLadingPartyExt) {
                ArrayAttention["BillOfLadingPartyExt"] = res.data.data.BillOfLadingPartyExt
            }
            
            if (res.data.data.BillOfLadingFreightParty) {
                ArrayAttention["BillOfLadingFreightParty"] = res.data.data.BillOfLadingFreightParty
            }



            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)
            setFreightChargesQuickFormData(ArrayAttention["BillOfLadingFreightParty"])


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)

            }

            if (formState.formType == "Clone") {
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var nowDate = date + '/' + month + '/' + year;
                setDocDate(nowDate)
            }

            setBookingReservationDoc(res.data.data.BillOfLading.BookingReservation)

            ControlOverlay(false)

        })
    }

    function TransferFromBooking(id) {
        var type;
        props.data.modelLink=="bill-of-lading-barge"?type="barge":type="normal"
        getBLTransferFromBooking(id, globalContext, props.data.modelLink,type).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}

            if (res.data.data.BillOfLading) {
                setDocumentData(res.data.data.BillOfLading)
                setInstructionData(res.data.data.BillOfLading)
                setShippingInstructionQuickFormData(res.data.data.BillOfLading)
                $.each(res.data.data.BillOfLading, function (key2, value2) {

                    setValue('BillOfLading[' + key2 + ']', value2);


                })
                if(res.data.data.BillOfLading.SplitParent==null){
                    $(".revertSplitButton").addClass("d-none")
                }else{
                    $(".revertSplitButton").removeClass("d-none")
                }
            }

            
            if (res.data.data.BillOfLadingHasContainer) {
                if(props.data.modelLink=="bill-of-lading-barge"){
                    setContainerQuickFormData(res.data.data.BillOfLadingCharges)
                }else{
                    setContainerQuickFormData(res.data.data.BillOfLadingHasContainer)
                    setContainerInnerQuickFormData(res.data.data.BillOfLadingHasContainer)
                }

           
            }

            if (res.data.data.BillOfLadingHauler) {

                setHaulerData(res.data.data.BillOfLadingHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BillOfLadingHauler
            }

            if (res.data.data.BillOfLadingMore) {

                setMoreData(res.data.data.BillOfLadingMore)
            }

            if (res.data.data.BillOfLadingAgent) {
                ArrayAttention["BillOfLadingAgent"] = res.data.data.BillOfLadingAgent
                ArrayAttention["BillOfLadingFreightParty"] = res.data.data.BillOfLadingAgent
            }
            if (res.data.data.BillOfLadingBillTo) {
                ArrayAttention["BillOfLadingBillTo"] = res.data.data.BillOfLadingBillTo
            }
            if (res.data.data.BillOfLadingShipper) {
                ArrayAttention["BillOfLadingShipper"] = res.data.data.BillOfLadingShipper
            }

            if (res.data.data.BillOfLadingConsignee) {
                ArrayAttention["BillOfLadingConsignee"] = res.data.data.BillOfLadingConsignee
            }

            if (res.data.data.BillOfLadingPartyExt) {
                ArrayAttention["BillOfLadingPartyExt"] = res.data.data.BillOfLadingPartyExt
            }
            


            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)
            setFreightChargesQuickFormData(ArrayAttention["BillOfLadingFreightParty"])



            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)

            }

            setBookingReservationDoc(res.data.data.BillOfLading.BookingReservation)


            ControlOverlay(false)
        })
    }

    function GetSplitBLs(id, shareID, splitID) {

        GetSplitBL(id, globalContext, shareID, splitID).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}

            if (res.data.data.BillOfLading) {
                setDocumentData(res.data.data.BillOfLading)
                setInstructionData(res.data.data.BillOfLading)
                setShippingInstructionQuickFormData(res.data.data.BillOfLading)
                $.each(res.data.data.BillOfLading, function (key2, value2) {

                    setValue('BillOfLading[' + key2 + ']', value2);


                })
                if(res.data.data.BillOfLading.SplitParent==null){
                    $(".revertSplitButton").addClass("d-none")
                }else{
                    $(".revertSplitButton").removeClass("d-none")
                }
            }


            if (res.data.data.BillOfLadingHasContainer) {
                setContainerQuickFormData(res.data.data.BillOfLadingHasContainer)
                setContainerInnerQuickFormData(res.data.data.BillOfLadingHasContainer)
            }

            if (res.data.data.BillOfLadingHauler) {

                setHaulerData(res.data.data.BillOfLadingHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BillOfLadingHauler
            }

            if (res.data.data.BillOfLadingMore) {

                setMoreData(res.data.data.BillOfLadingMore)
            }

            if (res.data.data.BillOfLadingAgent) {
                ArrayAttention["BillOfLadingAgent"] = res.data.data.BillOfLadingAgent
            }
            if (res.data.data.BillOfLadingBillTo) {
                ArrayAttention["BillOfLadingBillTo"] = res.data.data.BillOfLadingBillTo
            }
            if (res.data.data.BillOfLadingShipper) {
                ArrayAttention["BillOfLadingShipper"] = res.data.data.BillOfLadingShipper
            }

            if (res.data.data.BillOfLadingConsignee) {
                ArrayAttention["BillOfLadingConsignee"] = res.data.data.BillOfLadingConsignee
            }

            if (res.data.data.BillOfLadingPartyExt) {
                ArrayAttention["BillOfLadingPartyExt"] = res.data.data.BillOfLadingPartyExt
            }


            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)


            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)

            }

            setBookingReservationDoc(res.data.data.BillOfLading.BookingReservation)


            ControlOverlay(false)
        })
    }

    function GetMergeBLs(id,mergeIDs) {

        GetMergeBL(id, globalContext,mergeIDs).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}

            if (res.data.data.BillOfLading) {
                setDocumentData(res.data.data.BillOfLading)
                setInstructionData(res.data.data.BillOfLading)
                setShippingInstructionQuickFormData(res.data.data.BillOfLading)
                $.each(res.data.data.BillOfLading, function (key2, value2) {

                    setValue('BillOfLading[' + key2 + ']', value2);


                })
                if(res.data.data.BillOfLading.SplitParent==null){
                    $(".revertSplitButton").addClass("d-none")
                }else{
                    $(".revertSplitButton").removeClass("d-none")
                }
            }


            if (res.data.data.BillOfLadingHasContainer) {
                setContainerQuickFormData(res.data.data.BillOfLadingHasContainer)
                setContainerInnerQuickFormData(res.data.data.BillOfLadingHasContainer)
            }

            if (res.data.data.BillOfLadingHauler) {

                setHaulerData(res.data.data.BillOfLadingHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.BillOfLadingHauler
            }

            if (res.data.data.BillOfLadingMore) {

                setMoreData(res.data.data.BillOfLadingMore)
            }

            if (res.data.data.BillOfLadingAgent) {
                ArrayAttention["BillOfLadingAgent"] = res.data.data.BillOfLadingAgent
            }
            if (res.data.data.BillOfLadingBillTo) {
                ArrayAttention["BillOfLadingBillTo"] = res.data.data.BillOfLadingBillTo
            }
            if (res.data.data.BillOfLadingShipper) {
                ArrayAttention["BillOfLadingShipper"] = res.data.data.BillOfLadingShipper
            }

            if (res.data.data.BillOfLadingConsignee) {
                ArrayAttention["BillOfLadingConsignee"] = res.data.data.BillOfLadingConsignee
            }

            if (res.data.data.BillOfLadingPartyExt) {
                ArrayAttention["BillOfLadingPartyExt"] = res.data.data.BillOfLadingPartyExt
            }


            ArrayMiddleCard["Attention"] = ArrayAttention
            setMiddleCardQuickFormData(ArrayMiddleCard)
            setAttentionData(ArrayAttention)
            

            if (res.data.data.Valid == "1") {
                $('.validCheckbox').prop("checked", true)
            }
            else {
                $('.validCheckbox').prop("checked", false)

            }

            setBookingReservationDoc(res.data.data.BillOfLading.BookingReservation)


            ControlOverlay(false)
        })
    }

    function CheckBeservationContainerQty(id) {
        GetBookingReservationContainerQty(id, globalContext).then(res => {

            $.each($(".BQty"), function (key, value) {

                var BoxOperator = $(`input[name='BillOfLadingHasContainer[${key}][BoxOperator]'`).val()
                var BoxOperatorBranch = $(`input[name='BillOfLadingHasContainer[${key}][BoxOperatorBranch]'`).val()
                var BoxOwnership = $(`input[name='BillOfLadingHasContainer[${key}][BoxOwnership]'`).val()
                var ContainerType = $(`input[name='BillOfLadingHasContainer[${key}][ContainerType]'`).val()
                var DGClass = $(`input[name='BillOfLadingHasContainer[${key}][DGClass]'`).val()
                var Empty = $(`input[name='BillOfLadingHasContainer[${key}][Empty]'`).val()
                var GoodsDescription = $(`textarea[name='BillOfLadingHasContainer[${key}][GoodsDescription]'`).val()
                var GoodsDescription = JSON.stringify(GoodsDescription).replace(/(\r\n|\n|\\r|\r\r|\\n)/gm, "");
                var GoodsDescription = GoodsDescription.replace(/"/g, "");
                var GrossWeight = $(`input[name='BillOfLadingHasContainer[${key}][GrossWeight]'`).val()
                var M3 = $(`input[name='BillOfLadingHasContainer[${key}][M3]'`).val()
                var NKG = $(`input[name='BillOfLadingHasContainer[${key}][NetWeight]'`).val()

                $.each(res.data, function (key1, value1) {

                    function replaceNull(someObj, replaceValue = "***") {
                        const replacer = (key, value) =>
                            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
                        return JSON.parse(JSON.stringify(someObj, replacer));
                    }
                    var replacedNull = replaceNull(this, "");
                    var boxownership = replacedNull.BoxOwnership;
                    var boxop = replacedNull.BoxOperator;
                    var boxopbranch = BoxOperatorBranch;
                    var containertype = replacedNull.ContainerType;
                    var goodsdesc = replacedNull.GoodsDescription;
                    var goodsdesc = JSON.stringify(goodsdesc).replace(/(\r\n|\n|\\r|\r\r|\\n)/gm, "");
                    var goodsdesc = goodsdesc.replace(/"/g, "");
                    var dgclass = replacedNull.DGClass;
                    var grossweight = parseFloat(replacedNull.GrossWeight).toFixed(3);
                    var m3 = parseFloat(replacedNull.M3).toFixed(3);
                    var nkg = parseFloat(replacedNull.NetWeight).toFixed(3);

                    if (boxopbranch == BoxOperatorBranch && boxownership == BoxOwnership && ContainerType == containertype && DGClass == dgclass && GoodsDescription == goodsdesc) {

                        $(value).val(value1.Qty)
                        return;
                    }
                })


            })

            $.each($(".AQty"), function (key, value) {
                var BoxOperator = $(`input[name='BillOfLadingHasContainer[${key}][BoxOperator]'`).val()
                var BoxOperatorBranch = $(`input[name='BillOfLadingHasContainer[${key}][BoxOperatorBranch]'`).val()
                var BoxOwnership = $(`input[name='BillOfLadingHasContainer[${key}][BoxOwnership]'`).val()
                var ContainerType = $(`input[name='BillOfLadingHasContainer[${key}][ContainerType]'`).val()
                var DGClass = $(`input[name='BillOfLadingHasContainer[${key}][DGClass]'`).val()
                var Empty = $(`input[name='BillOfLadingHasContainer[${key}][Empty]'`).val()
                var GoodsDescription = $(`textarea[name='BillOfLadingHasContainer[${key}][GoodsDescription]'`).val()
                var GoodsDescription = JSON.stringify(GoodsDescription).replace(/(\r\n|\n|\\r|\r\r|\\n)/gm, "");
                var GoodsDescription = GoodsDescription.replace(/"/g, "");
                var GrossWeight = $(`input[name='BillOfLadingHasContainer[${key}][GrossWeight]'`).val()
                var M3 = $(`input[name='BillOfLadingHasContainer[${key}][M3]'`).val()
                var NKG = $(`input[name='BillOfLadingHasContainer[${key}][NetWeight]'`).val()

                $.each(res.data, function (key1, value1) {
                    function replaceNull(someObj, replaceValue = "***") {
                        const replacer = (key, value) =>
                            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
                        return JSON.parse(JSON.stringify(someObj, replacer));
                    }
                    var replacedNull = replaceNull(this, "");
                    var boxownership = replacedNull.BoxOwnership;
                    var boxop = replacedNull.BoxOperator;
                    var boxopbranch = BoxOperatorBranch;
                    var containertype = replacedNull.ContainerType;
                    var goodsdesc = replacedNull.GoodsDescription;
                    var goodsdesc = JSON.stringify(goodsdesc).replace(/(\r\n|\n|\\r|\r\r|\\n)/gm, "");
                    var goodsdesc = goodsdesc.replace(/"/g, "");
                    var dgclass = replacedNull.DGClass;
                    var grossweight = parseFloat(replacedNull.GrossWeight).toFixed(3);
                    var m3 = parseFloat(replacedNull.M3).toFixed(3);
                    var nkg = parseFloat(replacedNull.NetWeight).toFixed(3);

                    if (boxopbranch == BoxOperatorBranch && boxownership == BoxOwnership && ContainerType == containertype && DGClass == dgclass && GoodsDescription == goodsdesc) {

                        $(value).val(value1.QtyRemaining)
                        return;
                    }
                })


            })

            // if ($(".ContainerCodeInner").length > 0) {
            //     if ($(".ContainerCodeInner").length == 1) {
            //         $("#TotalContainer").text("Total : " + $(".ContainerCodeInner").length + "unit")
            //     } else {
            //         $("#TotalContainer").text("Total : " + $(".ContainerCodeInner").length + "units")
            //     }
            // } else {
            //     $("#TotalContainer").text("Total : " + $(".ContainerCodeInner").length + "units")
            // }


        })
    }

    useEffect(() => {
        var type;
        props.data.modelLink=="bill-of-lading-barge"?type="barge":type="normal"
        reset()
        // setCheckLoadAll(false)
        initHoverSelectDropownTitle()
        remove()
        FindBLRemainingBR(globalContext,type).then(res => {
            var ArrayBooking = [];
            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayBooking.push({ value: value.BookingReservationUUID, label: value.DocNum })
                }
            })

            setBookingReservation(sortArray(ArrayBooking))

        })

        async function fetchData() {
            await GetAllDropDown(['CargoType','Vessel', 'CurrencyType', 'ChargesType', 'FreightTerm', 'ContainerType', `CreditTerm`, 'PortTerm', 'TaxCode', 'Area', 'User', 'BookingReservation'], globalContext).then(res => {

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
                if (formState) {
                    if (formState.formType == "Update" || formState.formType == "Clone") {
                        ControlOverlay(true)
                        GetUpdateCLoneData(formState.id)
                    } else if (formState.formType == "TransferFromBooking") {
                        ControlOverlay(true)
                        TransferFromBooking(formState.id)

                    } else if (formState.formType == "SplitBL") {
                        ControlOverlay(true)
                        GetSplitBLs(formState.bLId, formState.shareID, formState.splitID)
                    }
                    else if(formState.formType=="VoyageDelay"){
                        setVoyageDelay(true)
                        ControlOverlay(true)
                        GetUpdateCLoneData(formState.id)
                        
                    }
                    else if (formState.formType == "MergeBL") {
                        ControlOverlay(true)
                        GetMergeBLs(formState.bLId, formState.mergeIDs)
                    }
                    else {
                        var date = new Date().getDate();
                        var month = new Date().getMonth() + 1;
                        var year = new Date().getFullYear();
                        var nowDate = date + '/' + month + '/' + year;
                        setDocDate(nowDate)
                        setQuotationType("Normal")
                        $("input[data-target='ValidityDay']").val("7");
                    }
                } else {
                    ControlOverlay(true)
                    GetUpdateCLoneData(params.id)
                    if (formState.formType == "Clone") {
                        var date = new Date().getDate();
                        var month = new Date().getMonth() + 1;
                        var year = new Date().getFullYear();
                        var nowDate = date + '/' + month + '/' + year;
                        setDocDate(nowDate)
                    }

                }

                return () => {

                }

            })


        }
        fetchData();
        //setCheckLoadAll(true)

        //CheckBeservationContainerQty($("input[name='BillOfLading[BookingReservation]']").val())

    }, [formState])

    useEffect(() => {
        if (bookingReservationDoc) {

            CheckBeservationContainerQty(bookingReservationDoc)
        }
        return () => {
        }
    }, [bookingReservationDoc])

    useEffect(() => {
        if (state == null) {
            if(params.mergeid){
                setFormState({ formType: "MergeBL", bLId: params.id,mergeIDs:params.mergeid })
            }else if(params.splitid){
                setFormState({ formType: "SplitBL", bLId: params.id,shareID:params.sharid,splitID:params.splitid })
            }else if(params.D){
                setFormState({ formType: "VoyageDelay",id:params.id, D: params.D })
            }
            else{
                setFormState({ formType: "Update", id: params.id })
            }
           
            
        }
        else {

            setFormState(state)
        }
        return () => {
        }
    }, [state])

    const handleSubmitForm = (e) => {
        setTimeout(()=>{
            if(errors && errors.BillOfLading && errors.BillOfLading.BookingReservation){
                if(!$('#Document').hasClass("text-primary")){
                    $('#Document').trigger('click'); // remove the display property
                }  
            }
        },100)
        handleSubmit(onSubmit)(e);
      };

    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" || formState.formType == "TransferFromBooking" || formState.formType == "SplitBL"   ? <CreateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="bill-of-lading-barge"?true:false}  title='BillOfLading' data={props} RemaningBR={bookingReservation} formType={formState.formType} /> : <UpdateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="bill-of-lading-barge"?true:false} title="BillOfLading" model="bill-of-lading" selectedId="BillOfLadingUUIDs" id={formState.id} data={props}  voyageDelay={voyageDelay}  position="top"/> : <CreateButton handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="bill-of-lading-barge"?true:false}  title='BillOfLading' data={props} RemaningBR={bookingReservation} formType={formState.formType} />}
            <div className="">
                <div className="box">
                    <div className="left-form">
                        <div className="flex-container">
                            <FormContext.Provider value={{
                                fields, update, docDate, salesPerson, quotationType, lastValidDate, advanceBookingStartDate, advanceBookingLastValidDate, defaultPortTerm, defaultCurrency, setStateHandle, optionPOLTerminal, optionPODTerminal, optionPOLAgentCompany, optionPODAgentCompany, optionPOLAgentCompanyBranch,
                                optionPODAgentCompanyBranch,bargeCode, pOLReqETA, pODReqETA, portTerm, freightTerm, defaultFinalDestinationCompany, setDefaultFinalDestinationCompany, VoyageNum, quickFormVoyageNum, bookingSelection,
                            }}>

                                {/* start: quick form  */}
                                <div className="card card-primary flex-item-left mb-0">
                                    <div className="card-header">
                                        <h3 id="QuickForm" className="card-title">Quick Form</h3>
                                    </div>
                                    <div className="card-body cardMaxHeight">
                                        <QuickForm barge={props.data.modelLink=="bill-of-lading-barge"?true:false} containerInnerData={containerInnerQuickFormData} containerData={containerQuickFormData} freightChargesData={freightChargesQuickFormData} middleCardData={middleCardQuickFormData} shippingInstructionData={shippingInstructionQuickFormData} user={user} register={register} setValue={setValue} getValues={getValues} control={control} errors={errors} port={port} freightTerm={freightTerm} taxCode={taxCode} currency={currency} containerType={containerType} cargoType={cargoType} />
                                    </div>
                                </div>
                                {/* end: quick form  */}

                                {/* start: detail form  */}
                                <div id="toggleForm" className="card card-success flex-item-right mb-0 pr-0" style={{ display: "none" }}>
                                    <div className="card-header">
                                        <h3 className="card-title"><a id="hideToggleForm"><i className="fa fa-arrow-right mr-2 fa-xs p-0 m-0" aria-hidden="true"></i></a><span className="icon-title"></span></h3>
                                    </div>
                                    <div className="card-body cardMaxHeight">
                                        <Document formType={formState.formType} documentData={documentData} user={user} currency={currency} port={port} register={register} setValue={setValue} getValues={getValues} control={control} errors={errors} />
                                        <Attention attentionData={attentionData} creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} />
                                        <Instruction barge={props.data.modelLink=="bill-of-lading-barge"?true:false} instructionData={instructionData} register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port}  bargeCode={bargeCode}/>

                                        <Hauler haulerData={haulerData} creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} />
                                        <More moreData={moreData} state={state} register={register} setValue={setValue} control={control} errors={errors} />
                                        <Inspect />
                                    </div>
                                </div>
                                {/* end: detail form  */}
                                <ShareInitialize formName="BillOfLading" formNameLowerCase="billoflading" setValue={setValue} getValues={getValues} globalContext={globalContext} />
                                <VoyageModal formName="BillOfLading" formNameLowerCase="billoflading" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port} />
                                <ContainerModal formName="BillOfLading" formNameLowerCase="billoflading" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                                <CurrencyModal formName="BillOfLading" formNameLowerCase="billoflading" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                            </FormContext.Provider >
                        </div>
                    </div>
                    <div className="shortcut-buttons sticky">
                        <ul className="sticky nav nav-pills flex-column">
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon quickformicon text-primary" id="QuickForm" data-toggle="tooltip" data-placement="left" data-target="Quick Form" data-original-title="Quick Form"><i className="fa fa-star" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Document" data-toggle="tooltip" data-placement="left" data-target="Document" data-original-title="Document"><i className="fa fa-file" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Attention" data-toggle="tooltip" data-placement="left" data-target="Attention" data-original-title="Attention"><i className="fa fa-users" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Instructions" data-toggle="tooltip" data-placement="left" data-target="Instructions" data-original-title="Instructions"><i className="fab fa-artstation" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Hauler" data-toggle="tooltip" data-placement="left" data-target="Hauler" data-original-title="Hauler"><i className="fa fa-truck" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="More" data-toggle="tooltip" data-placement="left" data-target="More" data-original-title="More"><i className="fa fa-ellipsis-h" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Inspect" data-toggle="tooltip" data-placement="left" data-target="Inspect " data-original-title="Inspect"><i className="fa fa-sitemap" /></button>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modal List */}
            <AttentionModal />
            {/* <TransferFromBRModal register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} BR={bookingReservation} globalContext={globalContext} /> */}


            {formState ? formState.formType == "Clone" || formState.formType == "New" || formState.formType == "TransferFromBooking" || formState.formType == "SplitBL"   ? <CreateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="bill-of-lading-barge"?true:false}  title='BillOfLading' data={props} RemaningBR={bookingReservation} formType={formState.formType} /> : <UpdateButton handleSubmitData={handleSubmitForm} barge={props.data.modelLink=="bill-of-lading-barge"?true:false} title="BillOfLading" model="bill-of-lading" selectedId="BillOfLadingUUIDs" id={formState.id} data={props}  voyageDelay={voyageDelay}  position="bottom"/> : <CreateButton handleSubmitData={handleSubmitForm}  barge={props.data.modelLink=="bill-of-lading-barge"?true:false}  title='BillOfLading' data={props} RemaningBR={bookingReservation} formType={formState.formType} />}

        </form>
    )
}

export default Form