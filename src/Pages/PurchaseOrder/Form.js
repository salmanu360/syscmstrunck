import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify,createCookie, GetRemainingInvoice,getCROTransferFromBooking,GetCNDNTransferFromSalesInvoice, ControlOverlay, GetBookingReservationContainerQty, initHoverSelectDropownTitle, GetAllDropDown, GetUserDetails, getAreaById, getPortDetails, getPortDetailsById, getVoyageByIdSpecial, sortArray } from '../../Components/Helper.js'
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
import { AttentionModal, DNDModal, VoyageModal, ContainerModal, CurrencyModal, TransferFromBRModal } from '../../Components/ModelsHelper';
import ShareInitialize from '../../Components/CommonElement/ShareInitialize';
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
    const [defaultPortTerm, setDefaultPortTerm] = useState("----c1d43831-d709-11eb-91d3-b42e998d11ff")
    const [defaultCurrency, setDefaultCurrency] = useState("----942c4cf1-d709-11eb-91d3-b42e998d11ff")
    const [user, setUser] = useState("")
    const [creditTerm, setCreditTerm] = useState("")
    const [port, setPort] = useState("")
    const [portTerm, setPortTerm] = useState("")
    const [freightTerm, setFreightTerm] = useState("")
    const [taxCode, setTaxCode] = useState("")
    const [cargoType, setCargoType] = useState([])
    const CustomerType = [{ "value": "Agent", "label": "Agent" }, { "value": "Bill To", "label": "Bill To" }, { "value": "Shipper", "label": "Shipper" }, { "value": "Consignee", "label": "Consignee" },{ "value": "Notify Party", "label": "Notify Party" },{ "value": "Attention Party", "label": "Consignee" },{ "value": "Others", "label": "Others" }]
    const TransferDocType = [{ "value": "INV", "label": "INV" }]
    const [loadAllOption, setLoadAllOption] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState("")

    //document
    const [docDate, setDocDate] = useState("")
    const [lastValidDate, setLastValidDate] = useState("")
    const [advanceBookingStartDate, setAdvanceBookingStartDate] = useState("")
    const [advanceBookingLastValidDate, setAdvanceBookingLastValidDate] = useState("")
    const [salesPerson, setSalesPerson] = useState("")
    const [quotationType, setQuotationType] = useState("")
    const [currency, setCurrency] = useState("")
    const [customerType, setCustomerType] = useState("")
    const [QTOption, setQTOption] = useState("")
    const [BCOption, setBCOption] = useState("")
    const [INVOption, setINVOption] = useState("")
    const [BLOption, setBLOption] = useState("")
    const [OROption, setOROption] = useState("")


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

    //charges
    const [charges, setCharges] = useState([])

    //data pass when update
    const [documentData, setDocumentData] = useState()
    const [attentionData, setAttentionData] = useState()

    const [shippingInstructionQuickFormData, setShippingInstructionQuickFormData] = useState()
    const [middleCardQuickFormData, setMiddleCardQuickFormData] = useState()
    const [containerQuickFormData, setContainerQuickFormData] = useState()
    const [containerInnerQuickFormData, setContainerInnerQuickFormData] = useState()

    const [oriData, setOridata] = useState()
    const [voyageDelay, setVoyageDelay] = useState(false)

    const onSubmit = (data, event) => {

        event.preventDefault();

        var tempForm =$("form")[0]

        // $.each($(".inputDecimalFourPlaces"), function () {
        //     var value1 = $(this).val();
        //     if (value1 !== "") {
        //         $(this).val(parseFloat(value1).toFixed(4));

        //     }
        // });
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

        
        // $(".multipleContainerCode").find(":hidden").each(function () {
        //     if (formdata.get($(this).attr("name")) == "") {
        //         formdata.set($(this).attr("name"), [])
        //     }
        // })

        // $(".ContainerCodeInner").find("input:hidden").each(function () {

        //     var tempNameValue = formdata.get($(this).attr("name"))

        //     if ($(this).attr("name")) {
        //         var splitName = $(this).attr("name").split('[')
        //         formdata.delete($(this).attr("name"));
        //         formdata.set(`${splitName[0]}[${splitName[1].replace(']', "")}][${splitName[2].replace(']', "")}][${splitName[3].replace(']', "")}][ContainerCode]`, tempNameValue)

        //     }



        //     // if (formdata.get($(this).attr("name")) == "") {
        //     //     formdata.set($(this).attr("name"),[])
        //     // }
        // })

        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone" ) {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Purchase Order has already been taken.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Purchase Order created successfully.")
                        navigate("/purchase/purchase-order/update/id=" + res.data.data.PurchaseOrderUUID, { state: { formType: "Update", id: res.data.data.PurchaseOrderUUID } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Purchase Order updated successfully.")
                    navigate("/purchase/purchase-order/update/id=" + res.data.data.PurchaseOrderUUID, { state: { formType: "Update", id: res.data.data.PurchaseOrderUUID } })

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
        if (target === "CustomerType") {
            setCustomerType(val)
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

        

        $("#purchaseorderbillto-branchcode").off("change").on("change", function () {
         
            GetRemainingInvoice(globalContext, props.data.modelLink,$(this).val()).then(res=>{
                var arrayInovice=[]
                   $.each(res.data,function(key,value){
                     if(value.VerificationStatus=="Approved"){
                        arrayInovice.push({label:value.DocNum,value:value.SalesInvoiceUUID})
                     }
                   })
            })
        });

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

    
        $(document).on("change", ".columnChooserColumn", function (event) {
            var purchaseorderCookies = []
            $(this).parent().parent().find(".columnChooserColumn:checked").each(function () {
    
                purchaseorderCookies.push($(this).parent().index())
    
            });
            var json_str = JSON.stringify(purchaseorderCookies);
            createCookie('purchaseordercolumn', json_str, 3650);
            if (fields.length > 0) {
                if (fields[0].Name == "PurchaseOrderHasCharges") {
                    $.each(fields, function (key, value) {
                        if ($(event.target).prop("checked")) {
                            value.Charges[$(event.target).parent().index()].class = ""
                        } else {
                            value.Charges[$(event.target).parent().index()].class = "d-none"
                        }
    
                    })
                    update(fields)
                }  
            }
        })

   
   

    }, []);

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
            $(".remove-container").addClass("d-none")
            $(".RemoveCharges").addClass("d-none")
            $(".RemoveNestedCharges").addClass("d-none")
            $(".loadTariff").addClass("d-none")
            $("#transhipmentQuickForm").addClass("d-none")
            $(".add-transhipment").addClass("d-none")
    
            $("input[type='checkbox']").prop("disabled",true)
        }, 50)
    }

    function RemoveAllReadOnlyFields () {
        setTimeout(() => {
            $("button[type='submit']").prop("disabled",false);
            
            $(".form-control").each(function () {
                $(this).removeClass("readOnlySelect")
                $(this).prop("disabled",false)
            });

            $(".basic-single").each(function () {
                
                if($(this).hasClass("OriReadOnlyClass")){
                }else{
                    $(this).removeClass("readOnlySelect")
                }      
            });

            $(".c-date-picker").each(function () {
                $(this).removeClass("pointerEventsStyle")
                $(this).prop("disabled",false)
            });

            $(".add-container").removeClass("d-none")
            $(".remove-container").removeClass("d-none")
           
    
            $("input[type='checkbox']").prop("disabled",false)
        }, 50)
    }

    function GetUpdateCLoneData(id) {
        GetUpdateData(id, globalContext, props.data.modelLink).then(res => {

            var ArrayAttention = []
            var ArrayMiddleCard = {}

            if (res.data.data.PurchaseOrder) {
                setDocumentData(res.data.data.PurchaseOrder)

                $.each(res.data.data.PurchaseOrder, function (key2, value2) {
                    if(key2=="CurrencyExchangeRate"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }else if(key2=="TotalTax"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }else if(key2=="TotalAmount"){
                        value2=value2?parseFloat(value2).toFixed(2):""
                    }
                    setValue('PurchaseOrder[' + key2 + ']', value2);
                })
            }

            if (res.data.data.PurchaseOrderHasCharges) {
                setContainerQuickFormData(res.data.data.PurchaseOrderHasCharges)
            }

            if (res.data.data.PurchaseOrder) {
                ArrayAttention= res.data.data.PurchaseOrder
            }
    

            if (res.data.data.PurchaseOrder.VerificationStatus == "Pending") {
                $(".VerificationStatusField").text("Draft")
                $(".VerificationStatusField").removeClass("text-danger")
                setVerificationStatus("Pending")
            } else if (res.data.data.PurchaseOrder.VerificationStatus == "Rejected") {
                $(".VerificationStatusField").text("Rejected")
                $(".VerificationStatusField").addClass("text-danger")
                setVerificationStatus("Rejected")
            }
            else{
                if(formState.formType != "Clone"){
                    setVerificationStatus("Approved")
                }else{
                    setVerificationStatus("")
                    RemoveAllReadOnlyFields()
                }
            }
            $(".VerificationStatusField").last().addClass("d-none")

           
            setMiddleCardQuickFormData(ArrayAttention)
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

           
            trigger();
   
        
            ControlOverlay(false)

        })
    }


   
    
    useEffect(() => {
        trigger()
        reset()
        RemoveAllReadOnlyFields()
        // setCheckLoadAll(false)
        initHoverSelectDropownTitle()
        setLoadAllOption(false)
        remove()
        setSalesPerson("")    
       
        GetUserDetails(globalContext).then(res => {
            
            setValue("PurchaseOrder[Agent]", res[0]["Company"]["CompanyUUID"])
            setValue("PurchaseOrder[AgentBranch]", res[0]["Branch"]["CompanyBranchUUID"])
            setValue("PurchaseOrder[AgentCompanyName]", res[0]["Company"]["CompanyName"])
            setValue("PurchaseOrder[AgentBranchName]", res[0]["Branch"]["BranchName"])
            $("#CompanyROC-Agent-DetailForm").val(res[0]["Company"]["ROC"])
            $("#BranchCode-Agent-DetailForm").val(res[0]["Branch"]["BranchCode"])

            setSalesPerson(res[0]["id"])
        }) 

        async function fetchData() {
            await GetAllDropDown(['CargoType', 'CurrencyType','Charges','ChargesType', 'FreightTerm', 'ContainerType', `CreditTerm`, 'PortTerm', 'TaxCode', 'Area', 'User', 'Quotation', "BookingConfirmation", 'SalesInvoice', 'BillOfLading', 'CustomerPayment'], globalContext).then(res => {

                var ArrayCargoType = [];
                var ArrayPortCode = [];
                var ArrayPortTerm = [];
                var ArrayFreightTerm = [];
                var ArrayContainerType = [];
                var ArrayCreditTerm = [];
                var ArrayCurrency = [];
                var ArrayUser = [];
                var ArrayTaxCode = [];
                var ArrayCharges = [];
                var ArrayQT = [];
                var ArrayBC = [];
                var ArrayINV = [];
                var ArrayBL = [];
                var ArrayOR = [];

                $.each(res.Area, function (key, value) {
                    ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
                })

                $.each(res.Charges, function (key, value) {    
                    var PortCode = "";
                    if(value.VerificationStatus=="Approved"){
                        if (value.portCode != null) {
                            PortCode = "(" + value["portCode"]["PortCode"] + ")";
                        }
                        ArrayCharges.push({ value: value.ChargesUUID, label: value.ChargesCode + PortCode })
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
                $.each(res.Quotation, function (key, value) {
                    ArrayQT.push({ value: value.QuotationUUID, label: value.DocNum })
                })
                $.each(res.BookingConfirmation, function (key, value) {
                    ArrayBC.push({ value: value.BookingConfirmationUUID, label: value.DocNum })
                })
                $.each(res.SalesInvoice, function (key, value) {
                    ArrayINV.push({ value: value.SalesInvoiceUUID, label: value.DocNum })
                })
                $.each(res.BillOfLading, function (key, value) {
                    ArrayBL.push({ value: value.BillOfLadingUUID, label: value.DocNum })
                })
                $.each(res.CustomerPayment, function (key, value) {
                    ArrayOR.push({ value: value.CustomerPaymentUUID, label: value.DocNum })
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
                setCharges(sortArray(ArrayCharges))
                setQTOption(sortArray(ArrayQT))
                setBCOption(sortArray(ArrayBC))
                setINVOption(sortArray(ArrayINV))
                setBLOption(sortArray(ArrayBL))
                setOROption(sortArray(ArrayOR))

                if (formState) {

                    if (formState.formType == "Update" || formState.formType == "Clone") {
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

    }, [formState])

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
           {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='PurchaseOrder' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="PurchaseOrder" model="purchase-order" selectedId="PurchaseOrderUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='PurchaseOrder' data={props} />}
            <div className="">
                <div className="box">
                    <div className="left-form">
                        <div className="flex-container">
                            <FormContext.Provider value={{
                                fields, update, FieldArrayHandle, formState,docDate, salesPerson, customerType,quotationType, lastValidDate, advanceBookingStartDate,verificationStatus, advanceBookingLastValidDate, defaultPortTerm, defaultCurrency, setStateHandle, optionPOLTerminal, optionPODTerminal, optionPOLAgentCompany, optionPODAgentCompany, optionPOLAgentCompanyBranch,
                                optionPODAgentCompanyBranch, pOLReqETA, pODReqETA, portTerm, freightTerm, defaultFinalDestinationCompany, setDefaultFinalDestinationCompany, ApprovedStatusReadOnlyForAllFields,RemoveAllReadOnlyFields,VoyageNum, quickFormVoyageNum
                            }}>

                                {/* start: quick form  */}
                                <div className="card card-primary flex-item-left mb-0">
                                    <div className="card-header">
                                        <h3 id="QuickForm" className="card-title">Quick Form</h3>
                                    </div>
                                    <div className="card-body cardMaxHeight">
                                        <QuickForm modelLink={props.data.modelLink} loadAllOption={loadAllOption}  transferDocType={TransferDocType} customerType={CustomerType} trigger={trigger} formType={formState.formType} containerInnerData={containerInnerQuickFormData} containerData={containerQuickFormData} middleCardData={middleCardQuickFormData} shippingInstructionData={shippingInstructionQuickFormData} user={user} register={register} setValue={setValue} getValues={getValues} control={control} errors={errors} port={port} freightTerm={freightTerm} taxCode={taxCode} currency={currency} containerType={containerType} cargoType={cargoType} chargesCode={charges} QTOption={QTOption} BCOption={BCOption} INVOption={INVOption} BLOption={BLOption} OROption={OROption}/>
                                    </div>
                                </div>
                                {/* end: quick form  */}

                                {/* start: detail form  */}
                                <div id="toggleForm" className="card card-success flex-item-right mb-0 pr-0" style={{ display: "none" }}>
                                    <div className="card-header">
                                        <h3 className="card-title"><a id="hideToggleForm"><i className="fa fa-arrow-right mr-2 fa-xs p-0 m-0" aria-hidden="true"></i></a><span className="icon-title"></span></h3>
                                    </div>
                                    <div className="card-body cardMaxHeight">
                                       
                                        <Attention attentionData={attentionData} creditTerm={creditTerm} customerType={CustomerType} register={register} setValue={setValue} control={control} errors={errors} />
                                       
                                    
                                        {/* <More moreData={moreData} state={state} register={register} setValue={setValue} control={control} errors={errors} /> */}
                                      
                                    </div>
                                </div>
                                {/* end: detail form  */}
                                <ShareInitialize formName="PurchaseOrder" formNameLowerCase="purchaseorder" setValue={setValue} trigger={trigger} getValues={getValues} globalContext={globalContext} />
                             
                                {/* <ContainerModal formName="PurchaseOrder" formNameLowerCase="containerreleaseorder" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} /> */}
                                {/* <CurrencyModal formName="PurchaseOrder" formNameLowerCase="containerreleaseorder" register={register} setValue={setValue} control={control} getValues={getValues} errors={errors} /> */}
                            </FormContext.Provider >
                        </div>
                    </div>
                    <div className="shortcut-buttons sticky">
                        <ul className="sticky nav nav-pills flex-column">
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon quickformicon text-primary" id="QuickForm" data-toggle="tooltip" data-placement="left" data-target="Quick Form" data-original-title="Quick Form"><i className="fa fa-star" /></button>
                          
                            <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="Attention" data-toggle="tooltip" data-placement="left" data-target="Attention" data-original-title="Attention"><i className="fa fa-users" /></button>
                           
                            {/* <button type="button" style={{ border: 0, backgroundColor: 'white' }} className="navigate-icon icon text-secondary" id="More" data-toggle="tooltip" data-placement="left" data-target="More" data-original-title="More"><i className="fa fa-ellipsis-h" /></button> */}
                           
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modal List */}
            <AttentionModal />

            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='PurchaseOrder' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="PurchaseOrder" model="purchase-order" selectedId="PurchaseOrderUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='PurchaseOrder' data={props} />}
        </form>
    )
}

export default Form