import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, FindRemainingBR,sortArray, getCROTransferFromBooking, ControlOverlay, GetBookingReservationContainerQty, initHoverSelectDropownTitle, GetAllDropDown, GetUserDetails, getAreaById, getPortDetails, getPortDetailsById, getVoyageByIdSpecial } from '../../Components/Helper.js'
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
    const { register, trigger, handleSubmit, getValues, setValue, reset, control, watch, formState: { errors } } = useForm({ mode: "onChange" });

    const { fields, append, prepend, remove, swap, move, insert, update, replace } = useFieldArray({
        control,
        name: "ContainerReleaseOrderHasTranshipment"
    });
    //share for all
    var defaultTC="Remarks : - It is the responsibility of Shipper's transporter to check and ensure the above container's is/are in good condition without damage/cut/hole/oil stain/DG sticker attached/pungent smell (ie: Fertilizer/Chemical & ETC) prior to receipt. The carrier is not liable for any additional haulage/removal of DG sticker charges and/or lolo charges incurred after the container(s) is/towed out from the depot or port."
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
    const [transhipmentData, setTranshipmentData] = useState()

    const [shippingInstructionQuickFormData, setShippingInstructionQuickFormData] = useState()
    const [middleCardQuickFormData, setMiddleCardQuickFormData] = useState()
    const [containerQuickFormData, setContainerQuickFormData] = useState()
    const [containerInnerQuickFormData, setContainerInnerQuickFormData] = useState()

    const [oriData, setOridata] = useState()
    const [voyageDelay, setVoyageDelay] = useState(false)

    const [bookingReservationDoc, setBookingReservationDoc] = useState()


    const onSubmit = (data, event) => {

        event.preventDefault();

        var tempForm =$("form")[0]

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


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Invalid Depot") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Container Release Order created successfully.")
                        navigate("/operation/container/container-release-order/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Container Release Order updated successfully.")
                    navigate("/operation/container/container-release-order/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

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
    }


    function FieldArrayHandle(action, data) {
        if (action == "remove") {
            remove(data)
        }
        if (action == "append") {
            if (data) {
                data.QuickFormPOTPortTerm = defaultPortTerm;
                data.POTPortTerm = defaultPortTerm;
                append(data)
                const POTVoyage = { value: data.FromVoyageNum, label: data.FromVoyageName }
                const PODVoyage = { value: data.ToVoyageNum, label: data.ToVoyageName + "(" + data.ToVesselCode + ")" }
                setValue("ContainerReleaseOrderHasTranshipment[0][QuickFormPOTVoyage]", data.FromVoyageNum)
                // onChangePOTVoyageNum(POTVoyage,"",0)
                // VoyageNumOnChangeHandle(PODVoyage)
            } else {
                append({
                    name: "ContainerReleaseOrderHasTranshipment",
                    POTPortTerm: defaultPortTerm,
                    QuickFormPOTPortTerm: defaultPortTerm,
                    optionTerminal: [],
                    optionAgentCompany: [],
                    optionAgentBranchCode: [],
                    optionFromVoyage: [],
                    optionToVoyage: [],

                })
            }
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

            $("#containerreleaseorder-voyagenum").val("").trigger("change")
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
            setValue("ContainerReleaseOrderAgent[ROC]", res[0]["Company"].ROC)
            setSalesPerson(res[0]["id"])
        })

    }, []);


    function GetUpdateCLoneData(id) {
        GetUpdateData(id, globalContext, props.data.modelLink).then(res => {

            var ArrayAttention = {}
            var ArrayMiddleCard = {}

            if (res.data.data.ContainerReleaseOrder) {
                setDocumentData(res.data.data.ContainerReleaseOrder)
                setInstructionData(res.data.data.ContainerReleaseOrder)
                setShippingInstructionQuickFormData(res.data.data.ContainerReleaseOrder)
                $.each(res.data.data.ContainerReleaseOrder, function (key2, value2) {
                    setValue('ContainerReleaseOrder[' + key2 + ']', value2);
                })
            }

            if (res.data.data.ContainerReleaseOrderHasTranshipment) {
                setTranshipmentData(res.data.data.ContainerReleaseOrderHasTranshipment)
            }

            if (res.data.data.ContainerReleaseOrderHasContainer) {
                setContainerQuickFormData(res.data.data.ContainerReleaseOrderHasContainer)
                setContainerInnerQuickFormData(res.data.data.ContainerReleaseOrderHasContainer)
            }

            if (res.data.data.ContainerReleaseOrderHauler) {

                setHaulerData(res.data.data.ContainerReleaseOrderHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.ContainerReleaseOrderHauler
            }

            if (res.data.data.ContainerReleaseOrderMore) {

                setMoreData(res.data.data.ContainerReleaseOrderMore)
            }

            if (res.data.data.ContainerReleaseOrderAgent) {
                ArrayAttention["ContainerReleaseOrderAgent"] = res.data.data.ContainerReleaseOrderAgent
            }
            if (res.data.data.ContainerReleaseOrderBillTo) {
                ArrayAttention["ContainerReleaseOrderBillTo"] = res.data.data.ContainerReleaseOrderBillTo
            }
            if (res.data.data.ContainerReleaseOrderShipper) {
                ArrayAttention["ContainerReleaseOrderShipper"] = res.data.data.ContainerReleaseOrderShipper
            }

            if (res.data.data.ContainerReleaseOrderConsignee) {
                ArrayAttention["ContainerReleaseOrderConsignee"] = res.data.data.ContainerReleaseOrderConsignee
            }

            if (res.data.data.ContainerReleaseOrderPartyExt) {
                ArrayAttention["ContainerReleaseOrderPartyExt"] = res.data.data.ContainerReleaseOrderPartyExt
            }
            if (res.data.data.ContainerReleaseOrder.Depot) {

                ArrayAttention["ContainerReleaseOrderDepot"] = { Depot: res.data.data.ContainerReleaseOrder.depot, DepotBranch: res.data.data.ContainerReleaseOrder.depotBranch }
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

            if (formState.formType == "Clone") {
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var nowDate = date + '/' + month + '/' + year;
                setDocDate(nowDate)
            }

            setBookingReservationDoc(res.data.data.ContainerReleaseOrder.BookingReservation)
            trigger();
            ControlOverlay(false)

        })
    }

    function TransferFromBooking(id) {
        getCROTransferFromBooking(id, globalContext, props.data.modelLink).then(res => {
            var ArrayAttention = {}
            var ArrayMiddleCard = {}

            if (res.data.data.ContainerReleaseOrder) {
                setDocumentData(res.data.data.ContainerReleaseOrder)
                setInstructionData(res.data.data.ContainerReleaseOrder)
                setShippingInstructionQuickFormData(res.data.data.ContainerReleaseOrder)
                $.each(res.data.data.ContainerReleaseOrder, function (key2, value2) {

                    setValue('ContainerReleaseOrder[' + key2 + ']', value2);


                })
            }

            if (res.data.data.ContainerReleaseOrderHasContainer) {
                setContainerQuickFormData(res.data.data.ContainerReleaseOrderHasContainer)
                setContainerInnerQuickFormData(res.data.data.ContainerReleaseOrderHasContainer)
            }

            if (res.data.data.ContainerReleaseOrderHasTranshipment) {
                setTranshipmentData(res.data.data.ContainerReleaseOrderHasTranshipment)
            }

            if (res.data.data.ContainerReleaseOrderHauler) {

                setHaulerData(res.data.data.ContainerReleaseOrderHauler)
                ArrayMiddleCard["Hauler"] = res.data.data.ContainerReleaseOrderHauler
            }

            if (res.data.data.ContainerReleaseOrderMore) {
                res.data.data.ContainerReleaseOrderMore.TNC = defaultTC
                setMoreData(res.data.data.ContainerReleaseOrderMore)
            }

            if (res.data.data.ContainerReleaseOrderAgent) {
                ArrayAttention["ContainerReleaseOrderAgent"] = res.data.data.ContainerReleaseOrderAgent
            }
            if (res.data.data.ContainerReleaseOrderBillTo) {
                ArrayAttention["ContainerReleaseOrderBillTo"] = res.data.data.ContainerReleaseOrderBillTo
            }
            if (res.data.data.ContainerReleaseOrderShipper) {
                ArrayAttention["ContainerReleaseOrderShipper"] = res.data.data.ContainerReleaseOrderShipper
            }

            if (res.data.data.ContainerReleaseOrderConsignee) {
                ArrayAttention["ContainerReleaseOrderConsignee"] = res.data.data.ContainerReleaseOrderConsignee
            }

            if (res.data.data.ContainerReleaseOrderPartyExt) {
                ArrayAttention["ContainerReleaseOrderPartyExt"] = res.data.data.ContainerReleaseOrderPartyExt
            }
            if (res.data.data.ContainerReleaseOrder.Depot) {

                ArrayAttention["ContainerReleaseOrderDepot"] = { Depot: res.data.data.ContainerReleaseOrder.depot, DepotBranch: res.data.data.ContainerReleaseOrder.depotBranch }
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

            setBookingReservationDoc(res.data.data.ContainerReleaseOrder.BookingReservation)
            trigger();

            ControlOverlay(false)
        })
    }

    function CheckBeservationContainerQty(id) {
        GetBookingReservationContainerQty(id, globalContext).then(res => {

            $.each($(".BQty"), function (key, value) {

                var BoxOperator = $(`input[name='ContainerReleaseOrderHasContainer[${key}][BoxOperator]'`).val()
                var BoxOperatorBranch = $(`input[name='ContainerReleaseOrderHasContainer[${key}][BoxOperatorBranch]'`).val()
                var BoxOwnership = $(`input[name='ContainerReleaseOrderHasContainer[${key}][BoxOwnership]'`).val()
                var ContainerType = $(`input[name='ContainerReleaseOrderHasContainer[${key}][ContainerType]'`).val()
                var DGClass = $(`input[name='ContainerReleaseOrderHasContainer[${key}][DGClass]'`).val()
                var Empty = $(`input[name='ContainerReleaseOrderHasContainer[${key}][Empty]'`).val()
                var GoodsDescription = $(`textarea[name='ContainerReleaseOrderHasContainer[${key}][GoodsDescription]'`).val()
                var GoodsDescription = JSON.stringify(GoodsDescription).replace(/(\r\n|\n|\\r|\r\r|\\n)/gm, "");
                var GoodsDescription = GoodsDescription.replace(/"/g, "");
                var GrossWeight = $(`input[name='ContainerReleaseOrderHasContainer[${key}][GrossWeight]'`).val()
                var M3 = $(`input[name='ContainerReleaseOrderHasContainer[${key}][M3]'`).val()
                var NKG = $(`input[name='ContainerReleaseOrderHasContainer[${key}][NetWeight]'`).val()

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
                var BoxOperator = $(`input[name='ContainerReleaseOrderHasContainer[${key}][BoxOperator]'`).val()
                var BoxOperatorBranch = $(`input[name='ContainerReleaseOrderHasContainer[${key}][BoxOperatorBranch]'`).val()
                var BoxOwnership = $(`input[name='ContainerReleaseOrderHasContainer[${key}][BoxOwnership]'`).val()
                var ContainerType = $(`input[name='ContainerReleaseOrderHasContainer[${key}][ContainerType]'`).val()
                var DGClass = $(`input[name='ContainerReleaseOrderHasContainer[${key}][DGClass]'`).val()
                var Empty = $(`input[name='ContainerReleaseOrderHasContainer[${key}][Empty]'`).val()
                var GoodsDescription = $(`textarea[name='ContainerReleaseOrderHasContainer[${key}][GoodsDescription]'`).val()
                var GoodsDescription = JSON.stringify(GoodsDescription).replace(/(\r\n|\n|\\r|\r\r|\\n)/gm, "");
                var GoodsDescription = GoodsDescription.replace(/"/g, "");
                var GrossWeight = $(`input[name='ContainerReleaseOrderHasContainer[${key}][GrossWeight]'`).val()
                var M3 = $(`input[name='ContainerReleaseOrderHasContainer[${key}][M3]'`).val()
                var NKG = $(`input[name='ContainerReleaseOrderHasContainer[${key}][NetWeight]'`).val()

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

            if ($(".ContainerCodeInner").length > 0) {
                if ($(".ContainerCodeInner").length == 1) {
                    $("#TotalContainer").text("Total : " + $(".ContainerCodeInner").length + "unit")
                } else {
                    $("#TotalContainer").text("Total : " + $(".ContainerCodeInner").length + "units")
                }
            } else {
                $("#TotalContainer").text("Total : " + $(".ContainerCodeInner").length + "units")
            }


        })
    }

    useEffect(() => {
        trigger()
        reset()
        // setCheckLoadAll(false)
        initHoverSelectDropownTitle()
        remove()
        FindRemainingBR(globalContext).then(res => {
            var ArrayBooking = [];
            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayBooking.push({ value: value.BookingReservationUUID, label: value.DocNum })
                }
            })

            setBookingReservation(sortArray(ArrayBooking))

        })

        async function fetchData() {
            await GetAllDropDown(['CargoType', 'CurrencyType', 'ChargesType', 'FreightTerm', 'ContainerType', `CreditTerm`, 'PortTerm', 'TaxCode', 'Area', 'User', 'BookingReservation'], globalContext).then(res => {

                var ArrayCargoType = [];
                var ArrayPortCode = [];
                var ArrayPortTerm = [];
                var ArrayFreightTerm = [];
                var ArrayContainerType = [];
                var ArrayCreditTerm = [];
                var ArrayCurrency = [];
                var ArrayUser = [];
                var ArrayTaxCode = [];

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

                if (formState) {

                    if (formState.formType == "Update" || formState.formType == "Clone") {
                        ControlOverlay(true)
                        GetUpdateCLoneData(formState.id)
                    } else if (formState.formType == "TransferFromBooking") {

                        TransferFromBooking(formState.id)

                    }else if(formState.formType=="VoyageDelay"){
                        setVoyageDelay(true)
                        ControlOverlay(true)
                        GetUpdateCLoneData(formState.id)
                        
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

        //CheckBeservationContainerQty($("input[name='ContainerReleaseOrder[BookingReservation]']").val())

        $(".BookingLink").off("click").on('click', function () {
            var id = getValues("DynamicModel[BookingReservation]")
            window.open('../../../../sales/container/booking-reservation/update/id=' + id, '_blank')
            //navigate("/operation/container/container-release-order/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
        });


        $(".QuotationLink").off("click").on('click', function () {
            var id = getValues("DynamicModel[Quotation]")
            window.open('../../../../sales/container/quotation/update/id=' + id, '_blank')

        });

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
            trigger()
            if(params.D){
                setFormState({ formType: "VoyageDelay",id:params.id, D: params.D })
            }
            else{
                setFormState({ formType: "Update", id: params.id })
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
        <form >
            {formState ? formState.formType == "Clone" || formState.formType == "New" || formState.formType == "TransferFromBooking" ? <CreateButton handleSubmitData={handleSubmitForm} title='ContainerReleaseOrder' data={props} RemaningBR={bookingReservation} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="ContainerReleaseOrder" model="container-release-order" selectedId="ContainerReleaseOrderUUIDs" id={formState.id} data={props} voyageDelay={voyageDelay}  position="top"/> : <CreateButton handleSubmitData={handleSubmitForm} title='ContainerReleaseOrder' data={props} RemaningBR={bookingReservation} />}
            <div className="">
                <div className="box">
                    <div className="left-form">
                        <div className="flex-container">
                            <FormContext.Provider value={{
                                fields, update, FieldArrayHandle, docDate, salesPerson, quotationType, lastValidDate, advanceBookingStartDate, advanceBookingLastValidDate, defaultPortTerm, defaultCurrency, setStateHandle, optionPOLTerminal, optionPODTerminal, optionPOLAgentCompany, optionPODAgentCompany, optionPOLAgentCompanyBranch,
                                optionPODAgentCompanyBranch, pOLReqETA, pODReqETA, portTerm, freightTerm, defaultFinalDestinationCompany, setDefaultFinalDestinationCompany, VoyageNum, quickFormVoyageNum
                            }}>

                                {/* start: quick form  */}
                                <div className="card card-primary flex-item-left mb-0">
                                    <div className="card-header">
                                        <h3 id="QuickForm" className="card-title">Quick Form</h3>
                                    </div>
                                    <div className="card-body cardMaxHeight">
                                        <QuickForm trigger={trigger} formType={formState.formType} transhipmentData={transhipmentData} containerInnerData={containerInnerQuickFormData} containerData={containerQuickFormData} middleCardData={middleCardQuickFormData} shippingInstructionData={shippingInstructionQuickFormData} user={user} register={register} setValue={setValue} getValues={getValues} control={control} errors={errors} port={port} freightTerm={freightTerm} taxCode={taxCode} currency={currency} containerType={containerType} cargoType={cargoType} />
                                    </div>
                                </div>
                                {/* end: quick form  */}

                                {/* start: detail form  */}
                                <div id="toggleForm" className="card card-success flex-item-right mb-0 pr-0" style={{ display: "none" }}>
                                    <div className="card-header">
                                        <h3 className="card-title"><a id="hideToggleForm"><i className="fa fa-arrow-right mr-2 fa-xs p-0 m-0" aria-hidden="true"></i></a><span className="icon-title"></span></h3>
                                    </div>
                                    <div className="card-body cardMaxHeight">
                                        <Document formType={formState.formType} documentData={documentData} user={user} currency={currency} port={port} register={register} setValue={setValue} control={control} errors={errors} />
                                        <Attention attentionData={attentionData} creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} />
                                        <Instruction instructionData={instructionData} register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port} />
                                        <Transhipment append={append} transhipmentData={transhipmentData} register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port} />
                                        <Hauler haulerData={haulerData} creditTerm={creditTerm} register={register} setValue={setValue} control={control} errors={errors} />
                                        <More moreData={moreData} state={state} register={register} setValue={setValue} control={control} errors={errors} />
                                        <Inspect />
                                    </div>
                                </div>
                                {/* end: detail form  */}
                                <ShareInitialize formName="ContainerReleaseOrder" formNameLowerCase="containerreleaseorder" setValue={setValue} trigger={trigger} getValues={getValues} globalContext={globalContext} />
                                <VoyageModal formName="ContainerReleaseOrder" formNameLowerCase="containerreleaseorder" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} port={port} />
                                <ContainerModal formName="ContainerReleaseOrder" formNameLowerCase="containerreleaseorder" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                                <CurrencyModal formName="ContainerReleaseOrder" formNameLowerCase="containerreleaseorder" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} />
                            </FormContext.Provider >
                        </div>
                    </div>
                    <div className="shortcut-buttons sticky">
                        <ul className="sticky nav nav-pills flex-column">
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon quickformicon text-primary" id="QuickForm" data-toggle="tooltip" data-placement="left" data-target="Quick Form" data-original-title="Quick Form"><i className="fa fa-star" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Document" data-toggle="tooltip" data-placement="left" data-target="Document" data-original-title="Document"><i className="fa fa-file" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Attention" data-toggle="tooltip" data-placement="left" data-target="Attention" data-original-title="Attention"><i className="fa fa-users" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Instructions" data-toggle="tooltip" data-placement="left" data-target="Instructions" data-original-title="Instructions"><i className="fab fa-artstation" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Transhipment" data-toggle="tooltip" data-placement="left" data-target="Transhipment" data-original-title="Transhipment"><i className="fa fa-random" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Hauler" data-toggle="tooltip" data-placement="left" data-target="Hauler" data-original-title="Hauler"><i className="fa fa-truck" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="More" data-toggle="tooltip" data-placement="left" data-target="More" data-original-title="More"><i className="fa fa-ellipsis-h" /></button>
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Inspect" data-toggle="tooltip" data-placement="left" data-target="Inspect " data-original-title="Inspect"><i className="fa fa-sitemap" /></button>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modal List */}
            <AttentionModal />
            <TransferFromBRModal register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} BR={bookingReservation} globalContext={globalContext} />


            {formState ? formState.formType == "Clone" || formState.formType == "New" || formState.formType == "TransferFromBooking" ? <CreateButton handleSubmitData={handleSubmitForm} title='ContainerReleaseOrder' data={props} RemaningBR={bookingReservation} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="ContainerReleaseOrder" model="container-release-order" selectedId="ContainerReleaseOrderUUIDs" id={formState.id} data={props} voyageDelay={voyageDelay}  position="bottom"/> : <CreateButton handleSubmitData={handleSubmitForm} title='ContainerReleaseOrder' data={props} RemaningBR={bookingReservation} />}

        </form>
    )
}

export default Form