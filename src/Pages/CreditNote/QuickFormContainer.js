import React, { useState, useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { CheckBoxHandle, GetUpdateData, CreateData, createCookie, GetChargesById, getCookie, GetTaxCodeById, GetBCChargesDescrption, GetBookingReservationContainerQty, ImportContainerCRO, GetCompaniesData, getCompanyDataByID, GetBranchData, getUNNumberByID, getHSCodeByID, getContainers, getChargesByContainerTypeAndPortCode, getContainerTypeById } from '../../Components/Helper.js'
import FormContext from '../../Components/CommonElement/FormContext';
import GlobalContext from "../../Components/GlobalContext"
import QuickFormInnerContainer from "./QuickFormInnerContainer"
import $ from "jquery";
import axios from "axios"
import { ShareContainerModel } from "../../Components/BootstrapTableModal&Dropdown/ShareContainerModel";
import QuickFormTotalCard from '../../Components/CommonElement/QuickFormTotalCard.js';
// import NestedTableCharges from './NestedTableCharges.js';

function QuickFormContainer(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    var formName = props.ContainerItem.formName
    var formNameLowerCase = props.ContainerItem.formName.toLowerCase()
    const [calculateIndex, setCalculateIndex] = useState("")
    const [totalTax, setTotalTax] = useState("")
    const [totalAmount, setTotalAmount] = useState("")
    const [removeState, setRemoveState] = useState(false)




    const OwnershipType = [
        {
            value: 'COC',
            label: 'COC',
        },
        {
            value: 'SOC',
            label: 'SOC',
        }
    ]

    const UOMOptions = [
        {
            "value": "UNIT",
            "label": "UNIT"
        },
        {
            "value": "M3",
            "label": "M3"
        },
        {
            "value": "KG",
            "label": "KG"
        },
        {
            "value": "MT",
            "label": "MT"
        },
        {
            "value": "TRIP",
            "label": "TRIP"
        },
        {
            "value": "SET",
            "label": "SET"
        },
        {
            "value": "PAGE",
            "label": "PAGE"
        },
        {
            "value": "SHIPMENT",
            "label": "SHIPMENT"
        },

    ]

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }
    function handleChangeChargesCode(val, index) {

        if (val) {
            GetChargesById(val.value, globalContext).then(res => {
                var arrayUOM = res.data.UOM.split(",");
                var newArray = arrayUOM.map(function (value) {
                    return { label: value, value: value };
                });
                setValue(`SalesCreditNoteHasItem[${index}][UOM]`, arrayUOM[0])
                setValue(`SalesCreditNoteHasItem[${index}][ChargesName]`, res.data.ChargesName)
                setValue(`SalesCreditNoteHasItem[${index}][UnitPrice]`, res.data.ReferencePrice)

                $(`.ArrayUOM-${index}`).val(res.data.UOM)
                handleCalculate(index)
                update(fields)
                //fields[index]["ContainerItem"][11]["options"]=UOMArray

            })
        }

    }

    //hide the options that are already selected
    function handleOpenMenu(name, options, index) {

        if (name == "UOM") {
            var newArray = []
            //disabled option that already selected
            $.each(options, function (key, value) {
                value.selected = true
            })
            var ArrayUOM = $(`.ArrayUOM-${index}`).val()
            $(ArrayUOM.split(",")).each(function (key, value) {
                newArray.push(value)
            })

            $.each(options, function (key, value) {
                $.each(newArray, function (key2, value2) {
                    if (value2 == value.label) {
                        value.selected = false
                    }

                })
            })
        }



    }

    function handleChangeTaxCode(val, index) {

        if (val) {
            GetTaxCodeById(val.value, globalContext).then(res => {

                // var arrayUOM = res.data.UOM.split(",");


                setValue(`SalesCreditNoteHasItem[${index}][TaxRate]`, res.data.TaxRate ? parseFloat(res.data.TaxRate).toFixed(2) : "")
                //     setValue(`SalesCreditNoteHasItem[${index}][ChargesName]`, res.data.ChargesName)
                //     setValue(`SalesCreditNoteHasItem[${index}][UnitPrice]`, res.data.ReferencePrice)
                handleCalculate(index)
                //fields[index]["ContainerItem"][11]["options"]=UOMArray

            })
        }

    }

    function handleCalChargesGetIndexAndSetState(val, index) {
        setCalculateIndex(index)
    }


    function handleCalculate(index) {
        var qty = getValues(`SalesCreditNoteHasItem[${index}][Qty]`)
        var unitPrice = getValues(`SalesCreditNoteHasItem[${index}][UnitPrice]`)
        var currency = getValues(`SalesCreditNoteHasItem[${index}][Currency]`)
        var currencyRate = getValues(`SalesCreditNoteHasItem[${index}][CurrencyExchangeRate]`)

        if (qty == "") {
            qty = 0
        }
        if (unitPrice == "") {
            unitPrice = 0.00
        }
        var TotalAmount = (parseFloat(qty) * parseFloat(unitPrice)).toFixed(2)
        setValue(`SalesCreditNoteHasItem[${index}][TotalAmount]`, TotalAmount)
        setValue(`SalesCreditNoteHasItem[${index}][Amount]`, TotalAmount)


        var TotalTax
        var SubTotalLocal
        var SubTotal

        var taxRate = getValues(`SalesCreditNoteHasItem[${index}][TaxRate]`)
        if (taxRate) {
            if (taxRate.includes("%")) {
                var Tax = taxRate.replace("%", "")
                Tax = (parseFloat(Tax) / 100).toFixed(2)
                taxRate = parseFloat(Tax)
            } else {


                taxRate = parseFloat(taxRate)
            }
            TotalTax = (TotalAmount * parseFloat(taxRate)).toFixed(2)
            SubTotalLocal = (parseFloat(TotalAmount) + parseFloat(TotalTax)).toFixed(2)
            SubTotal = (parseFloat(TotalAmount) + parseFloat(TotalTax)).toFixed(2)
            setValue(`SalesCreditNoteHasItem[${index}][TaxAmount]`, TotalTax)
            // setTotalDiscount(unitTotalDiscount)
        }
        else {
            SubTotalLocal = (parseFloat(TotalAmount)).toFixed(2)
            SubTotal = (parseFloat(TotalAmount)).toFixed(2)
            setValue(`SalesCreditNoteHasItem[${index}][TaxAmount]`, "0.00")
        }

        // if (currencyRate) {
        //     SubTotal = (parseFloat(SubTotalLocal) * parseFloat(currencyRate)).toFixed(2)
        // } else {
        //     SubTotal = (parseFloat(SubTotalLocal)).toFixed(2)
        // }

        if (currency !== $("input[name='SalesCreditNote[Currency]']").val()) {
            if (currencyRate !== "") {
                var foreigncurrency = 1;
                var subtotallocalexchange = (parseFloat(SubTotalLocal) * parseFloat(currencyRate)).toFixed(2);

                setValue(`SalesCreditNoteHasItem[${index}][SubTotalLocal]`, subtotallocalexchange)
            }
        }
        else {
            setValue(`SalesCreditNoteHasItem[${index}][SubTotalLocal]`, SubTotalLocal)

        }
        setValue(`SalesCreditNoteHasItem[${index}][TotalTax]`, TotalTax)
        setValue(`SalesCreditNoteHasItem[${index}][SubTotal]`, SubTotal)



        //Calculate Total Tax
        var FinalTotalTax = 0
        $.each($(".ParentTaxAmount"), function (key, value) {
            var tempTotalTax = getValues(`SalesCreditNoteHasItem[${key}][TaxAmount]`)
            var tempCurrency = getValues(`SalesCreditNoteHasItem[${key}][Currency]`)
            var tempCurrencyRate = getValues(`SalesCreditNoteHasItem[${index}][CurrencyExchangeRate]`)


            if (tempCurrency !== $("input[name='SalesCreditNote[Currency]']").val()) {
                if (tempTotalTax) {
                    FinalTotalTax += parseFloat(tempTotalTax) * tempCurrencyRate
                }
            } else {
                if (tempTotalTax) {
                    FinalTotalTax += parseFloat(tempTotalTax)
                }
            }

        })

        //    //Calculate Sub Total
        var FinalSubTotal = 0
        $.each($(".ParentSubTotalLocal"), function (key, value) {
            var tempSubTotal = getValues(`SalesCreditNoteHasItem[${key}][SubTotalLocal]`)
            if (tempSubTotal) {
                FinalSubTotal += parseFloat(tempSubTotal)
            }
        })


        const TotalTaxTwoDecimal = FinalTotalTax.toFixed(2)
        const TotalAmountTwoDecimal = FinalSubTotal.toFixed(2)



        setTotalTax({ TotalTaxTwoDecimal, index })
        setTotalAmount({ TotalAmountTwoDecimal, index })
    }

    if(props.ContainerItem.type=="Container"){
        var ContainerColumn = [

            { columnName: "Seq", inputType: "input", defaultChecked: true, name: "SeqNum", fieldClass: "SeqNum", class: "", onChange: "", readOnly: true },
            { columnName: "Charges Code", inputType: "single-select", defaultChecked: true, name: "ChargesCode", fieldClass: "ChargesCode", options: props.chargesCode, class: "", onChange: handleChangeChargesCode },
            { columnName: "Charges Name", inputType: "input", defaultChecked: true, name: "ChargesName", fieldClass: "ChargesName", class: "", onChange: "" },
            { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType", options: props.containerType, class: "", onChange: "" },
            { columnName: "Container Code", inputType: "single-select", defaultChecked: true, name: "ContainerCode", fieldClass: "ContainerCode", options: [], class: "", onChange: "" },
            { columnName: "Account Code", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "Qty", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", fieldClass: "UnitPrice inputDecimalTwoPlaces ", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Freight Term", inputType: "single-select", defaultChecked: true, name: "FreightTerm", fieldClass: "FreightTerm", options: props.freightTerm, class: "", onChange: "" },
            { columnName: "Cargo Type", inputType: "single-select", defaultChecked: true, name: "CargoType", fieldClass: "CargoType readOnlySelect OriReadOnlyClass", options: props.cargoType, class: "", onChange: "" },
            { columnName: "Cargo Rate", inputType: "input", defaultChecked: true, name: "CargoRate", fieldClass: "CargoRate inputDecimalTwoPlaces ", class: "", onChange: "" },
            { columnName: "UOM", inputType: "single-select", defaultChecked: true, name: "UOM", fieldClass: "UOM", options: UOMOptions, class: "", onChange: "" },
            { columnName: "Vessel", inputType: "input", defaultChecked: true, name: "DynamicVessel", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Voyage", inputType: "input", defaultChecked: true, name: "DynamicVoyage", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Shipper", inputType: "input", defaultChecked: true, name: "DynamicShipper", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Consignee", inputType: "input", defaultChecked: true, name: "DynamicConsignee", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Charges Description", inputType: "input-Modal", defaultChecked: false, name: "ChargesDescription", fieldClass: "ChargesDescriptionReadonly", class: "d-none", modelClass: "TextMarks", textValue: "" },
            { columnName: "Currency", inputType: "single-select", defaultChecked: true, name: "Currency", fieldClass: "Currency readOnlySelect OriReadOnlyClass", defaultValue: formContext.defaultCurrency, options: props.currency, class: "", onChange: "" },
            { columnName: "ROE", inputType: "input", defaultChecked: true, name: "CurrencyExchangeRate", fieldClass: "CurrencyExchangeRate", class: "", onChange: "", defaultValue: "1.00", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Tax Code", inputType: "single-select", defaultChecked: true, name: "TaxCode", fieldClass: "TaxCode", options: props.taxCode, class: "", onChange: handleChangeTaxCode },
            { columnName: "Tax Rate", inputType: "input", defaultChecked: true, name: "TaxRate", fieldClass: "TaxRate inputDecimalTwoPlaces ", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Tax Amount", inputType: "input", defaultChecked: true, name: "TaxAmount", fieldClass: "ParentTaxAmount inputDecimalTwoPlaces ", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Local Amount", inputType: "input", defaultChecked: true, name: "Amount", fieldClass: "Amount inputDecimalTwoPlaces ", class: "", onChange: "" },
            { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", fieldClass: "SubTotal inputDecimalTwoPlaces ", class: "", onChange: "" },
            { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: true, name: "SubTotalLocal", fieldClass: "ParentSubTotalLocal inputDecimalTwoPlaces", class: "", onChange: "" },
    
        ]
    }else{
        var ContainerColumn = [

            { columnName: "Seq", inputType: "input", defaultChecked: true, name: "SeqNum", fieldClass: "SeqNum", class: "", onChange: "", readOnly: true },
            { columnName: "Charges Code", inputType: "single-select", defaultChecked: true, name: "ChargesCode", fieldClass: "ChargesCode", options: props.chargesCode, class: "", onChange: handleChangeChargesCode },
            { columnName: "Charges Name", inputType: "input", defaultChecked: true, name: "ChargesName", fieldClass: "ChargesName", class: "", onChange: "" },
            { columnName: "Account Code", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "Qty", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", fieldClass: "UnitPrice inputDecimalTwoPlaces ", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Freight Term", inputType: "single-select", defaultChecked: true, name: "FreightTerm", fieldClass: "FreightTerm", options: props.freightTerm, class: "", onChange: "" },
            { columnName: "Cargo Type", inputType: "single-select", defaultChecked: true, name: "CargoType", fieldClass: "CargoType readOnlySelect OriReadOnlyClass", options: props.cargoType, class: "", onChange: "" },
            { columnName: "Cargo Rate", inputType: "input", defaultChecked: true, name: "CargoRate", fieldClass: "CargoRate inputDecimalTwoPlaces ", class: "", onChange: "" },
            { columnName: "UOM", inputType: "single-select", defaultChecked: true, name: "UOM", fieldClass: "UOM", options: UOMOptions, class: "", onChange: "" },
            { columnName: "Vessel", inputType: "input", defaultChecked: true, name: "DynamicVessel", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Voyage", inputType: "input", defaultChecked: true, name: "DynamicVoyage", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Shipper", inputType: "input", defaultChecked: true, name: "DynamicShipper", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Consignee", inputType: "input", defaultChecked: true, name: "DynamicConsignee", fieldClass: "AccountCode", class: "", onChange: "" },
            { columnName: "Charges Description", inputType: "input-Modal", defaultChecked: false, name: "ChargesDescription", fieldClass: "ChargesDescriptionReadonly", class: "d-none", modelClass: "TextMarks", textValue: "" },
            { columnName: "Currency", inputType: "single-select", defaultChecked: true, name: "Currency", fieldClass: "Currency readOnlySelect OriReadOnlyClass", defaultValue: formContext.defaultCurrency, options: props.currency, class: "", onChange: "" },
            { columnName: "ROE", inputType: "input", defaultChecked: true, name: "CurrencyExchangeRate", fieldClass: "CurrencyExchangeRate", class: "", onChange: "", defaultValue: "1.00", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Tax Code", inputType: "single-select", defaultChecked: true, name: "TaxCode", fieldClass: "TaxCode", options: props.taxCode, class: "", onChange: handleChangeTaxCode },
            { columnName: "Tax Rate", inputType: "input", defaultChecked: true, name: "TaxRate", fieldClass: "TaxRate inputDecimalTwoPlaces ", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Tax Amount", inputType: "input", defaultChecked: true, name: "TaxAmount", fieldClass: "ParentTaxAmount inputDecimalTwoPlaces ", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
            { columnName: "Local Amount", inputType: "input", defaultChecked: true, name: "Amount", fieldClass: "Amount inputDecimalTwoPlaces ", class: "", onChange: "" },
            { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", fieldClass: "SubTotal inputDecimalTwoPlaces ", class: "", onChange: "" },
            { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: true, name: "SubTotalLocal", fieldClass: "ParentSubTotalLocal inputDecimalTwoPlaces", class: "", onChange: "" },
    
        ]
    }
    

    


    if (getCookie('salescreditnotecolumn')) {
        var getCookieArray = getCookie('salescreditnotecolumn');
        var getCookieArray = JSON.parse(getCookieArray);

        $.each(ContainerColumn, function (key, value) {
            value.defaultChecked = false
            value.class = "d-none"
        })

        $.each(getCookieArray, function (key, value) {
            $.each(ContainerColumn, function (key2, value2) {

                if (value == key2) {
                    value2.defaultChecked = true
                    value2.class = ""
                }
            })
        })
    }


    function GetChargesDescription(AllChargesArray) {
        if (AllChargesArray.length > 0) {
            GetBCChargesDescrption(AllChargesArray, globalContext).then(res => {

                $(".container-items").each(function (key, value) {
                    var chargesdiscription = res.data[key].BookingConfirmationHasCharges? res.data[key].BookingConfirmationHasCharges.ChargesDescription:""
                    setValue(`SalesCreditNoteHasItem[${key}][ChargesDescription]`, chargesdiscription)
                    $(this).find(".ChargesDescriptionReadonly").val(chargesdiscription)

                    //$(value).find(".ChargesDescription").val(chargesdiscription).trigger("change")

                });
            })
        }
    }

    useEffect(() => {
        if (calculateIndex !== "") {
            handleCalculate(calculateIndex)
            setCalculateIndex("")
        }
    }, [calculateIndex])

    useEffect(() => {

        if(formContext.formState.formNewClicked){
            remove()
            appendContainerHandle2()
        }  

        if(formContext.formState.formResetClicked){
            remove()
            appendContainerHandle2()
        } 

        return () => {

        }
    // appendContainerHandle() 

    }, [formContext.formState])


    useEffect(() => {

        if (props.containerData) {
            var arrayDynamic = []
            remove()
            var newContainerData = props.containerData
            var AllChargesArray = [];
            $.each(newContainerData, function (key, value) {

                var arrayDynamic = []

                value.Name = `${formName}HasItem`;
                value.ContainerItem = ContainerColumn
                value.ContainerTypeOptions = props.containerType
                if (value.ContainerCode) {
                    value.ContainerItem[4].options = [{ value: value.ContainerCode, label: value.containerCode.ContainerCode }]
                }

                if (value["booking_Confirmation"] != null) {
                    value.BookingConfirmation = value.booking_Confirmation.BookingConfirmationUUID

                    value.DynamicVoyage = value["booking_Confirmation"]['VoyageName']
                    value.DynamicVessel = value["booking_Confirmation"]['VesselCode']
                    value.DynamicShipper = value["bookingConfirmationShipper"]['CompanyName']
                    value.DynamicConsignee = value["bookingConfirmationConsignee"]['CompanyName']

                }
              

                var chargesObject = {
                    ChargesCode: value.ChargesCode,
                    ChargesName: value.ChargesName,
                    ContainerType: value.ContainerType,
                    BookingConfirmation: value.booking_Confirmation != null ? value.booking_Confirmation.BookingConfirmationUUID : "",
                }

               

                value.TaxRate = value.TaxRate ? parseFloat(value.TaxRate).toFixed(2) : ""
                value.TaxAmount = value.TaxRate ? parseFloat(value.TaxAmount).toFixed(2) : ""
                value.Amount = value.TaxRate ? parseFloat(value.Amount).toFixed(2) : ""
                value.SubTotal = value.SubTotal ? parseFloat(value.SubTotal).toFixed(2) : ""
                value.SubTotalLocal = value.SubTotalLocal ? parseFloat(value.SubTotalLocal).toFixed(2) : ""
                value.CurrencyExchangeRate = value.CurrencyExchangeRate ? parseFloat(value.CurrencyExchangeRate).toFixed(2) : ""

                value.CargoRate = value.CargoRate ? parseFloat(value.CargoRate).toFixed(2) : ""
                value.UnitPrice = value.UnitPrice ? parseFloat(value.UnitPrice).toFixed(2) : ""
                value.SeqNum=key+1
                value.ContainerItem[1].fieldClass="ChargesCode readOnlySelect"
                value.ContainerItem[2].readOnly=true
                value.ContainerItem[3].fieldClass="ContainerType readOnlySelect"
                value.ContainerItem[4].fieldClass="ContainerCode readOnlySelect"

                AllChargesArray.push(chargesObject)
                arrayDynamic.push(value);
                append(arrayDynamic)

                setTimeout(()=>{
                    handleCalculate(key)
                },100)
            })
            GetChargesDescription(AllChargesArray)
        }
        return () => {
        }
    }, [props.containerData])


    useEffect(() => {

        if (props.transferPartialData) {
            var arrayDynamic = []
            remove()
            var newContainerData = props.transferPartialData.SalesCreditNoteHasItem
            var AllChargesArray = [];
            if(props.barge){

                $.each(props.transferPartialData.SalesCreditNote, function (key2, value2) {
                  if(key2!=="DocDate" && key2!=="SalesPerson"){
                    props.setValue('SalesCreditNote[' + key2 + ']', value2);
                    props.setValue('DynamicModel[' + key2 + ']', value2);
                  }
                   
                })

                formContext.setStateHandle([{ label: props.transferPartialData.SalesCreditNote.VoyageName + "(" + props.transferPartialData.SalesCreditNote.VesselCode + ")", value: props.transferPartialData.SalesCreditNote.VoyageNum }], "VoyageNum")
                formContext.setStateHandle([{ label: props.transferPartialData.SalesCreditNote.VoyageName + "(" + props.transferPartialData.SalesCreditNote.VesselCode + ")", value: props.transferPartialData.SalesCreditNote.VoyageNum }], "QuickFormVoyageNum")
                

                if (props.transferPartialData.SalesCreditNote.POLLocationCode) {
                    formContext.setStateHandle([{ value: props.transferPartialData.SalesCreditNote.POLLocationCode, label: props.transferPartialData.SalesCreditNote.pOLLocationCode.PortName }], "OptionPOLTerminal")
                }
                if (props.transferPartialData.SalesCreditNote.PODLocationCode) {
                    formContext.setStateHandle([{ value: props.transferPartialData.SalesCreditNote.PODLocationCode, label: props.transferPartialData.SalesCreditNote.pODLocationCode.PortName }], "OptionPODTerminal")
                }
    
                if (props.transferPartialData.SalesCreditNote.ShipOperator) {
                    $("#CompanyROC-Voyage-DetailForm").val(props.transferPartialData.SalesCreditNote.shipOperator.ROC)
                    $("#BranchCode-Voyage-DetailForm").val(props.transferPartialData.SalesCreditNote.shipOperatorBranchCode.BranchCode)
                
                
                }
    
                if (props.transferPartialData.SalesCreditNote.POLHandlingOfficeCode) {
                 
                    formContext.setStateHandle([{ value: props.transferPartialData.SalesCreditNote.pOLHandlingOfficeCode.company.CompanyUUID, label: props.transferPartialData.SalesCreditNote.pOLHandlingOfficeCode.company.CompanyName }], "OptionPOLAgentCompany")
                    props.setValue("SalesCreditNote[POLAgentName]", props.transferPartialData.SalesCreditNote.pOLHandlingOfficeCode.company.CompanyUUID)
                    props.setValue("SalesCreditNote[POLAgentROC]", props.transferPartialData.SalesCreditNote.pOLHandlingOfficeCode.company.ROC)
                    formContext.setStateHandle([{ value: props.transferPartialData.SalesCreditNote.POLHandlingOfficeCode, label: props.transferPartialData.SalesCreditNote.pOLHandlingOfficeCode.BranchCode }], "OptionPOLAgentCompanyBranch")
                }
    
                if (props.transferPartialData.SalesCreditNote.PODHandlingOfficeCode) {
                    formContext.setStateHandle([{ value: props.transferPartialData.SalesCreditNote.pODHandlingOfficeCode.company.CompanyUUID, label: props.transferPartialData.SalesCreditNote.pODHandlingOfficeCode.company.CompanyName }], "OptionPODAgentCompany")
                    props.setValue("SalesCreditNote[PODAgentName]", props.transferPartialData.SalesCreditNote.pODHandlingOfficeCode.company.CompanyUUID)
                    props.setValue("SalesCreditNote[PODAgentROC]", props.transferPartialData.SalesCreditNote.pODHandlingOfficeCode.company.ROC)
                    formContext.setStateHandle([{ value: props.transferPartialData.SalesCreditNote.PODHandlingOfficeCode, label: props.transferPartialData.SalesCreditNote.pODHandlingOfficeCode.BranchCode }], "OptionPODAgentCompanyBranch")
                }

                if (props.transferPartialData.SalesCreditNote.FinalDestinationHandler) {
                    props.setValue("SalesCreditNote[FinalDestinationHandler]", { CompanyUUID: props.transferPartialData.SalesCreditNote.finalDestinationHandler.CompanyUUID, CompanyName: props.transferPartialData.SalesCreditNote.finalDestinationHandler.CompanyName })
                }

            }
            $.each(newContainerData, function (key, value) {

                var arrayDynamic = []

                value.Name = `${formName}HasItem`;
                value.ContainerItem = ContainerColumn
                value.ContainerTypeOptions = props.containerType
                if (value.ContainerCode) {
                    value.ContainerItem[4].options = [{ value: value.ContainerCode, label: value.containerCode.ContainerCode }]
                }

                if (value["bookingConfirmation"] != null) {
                    value.BookingConfirmation = value.bookingConfirmation.BookingConfirmationUUID

                    value.DynamicVoyage = value["bookingConfirmation"]['VoyageName']
                    value.DynamicVessel = value["bookingConfirmation"]['VesselCode']
                    value.DynamicShipper = value["bookingConfirmationShipper"]['CompanyName']
                    value.DynamicConsignee = value["bookingConfirmationConsignee"]['CompanyName']

                }
                value.ContainerItem[1].fieldClass="ChargesCode readOnlySelect"
                value.ContainerItem[2].readOnly=true
                value.ContainerItem[3].fieldClass="ContainerType readOnlySelect"
                value.ContainerItem[4].fieldClass="ContainerCode readOnlySelect"

                var chargesObject = {
                    ChargesCode: value.ChargesCode,
                    ChargesName: value.ChargesName,
                    ContainerType: value.ContainerType,
                    BookingConfirmation: value.bookingConfirmation != null ? value.bookingConfirmation.BookingConfirmationUUID : "",
                }
                
                value.SeqNum=key+1
                value.TaxRate = value.TaxRate ? parseFloat(value.TaxRate).toFixed(2) : ""
                value.TaxAmount = value.TaxRate ? parseFloat(value.TaxAmount).toFixed(2) : ""
                value.Amount = value.TaxRate ? parseFloat(value.Amount).toFixed(2) : ""
                value.SubTotal = value.SubTotal ? parseFloat(value.SubTotal).toFixed(2) : ""
                value.SubTotalLocal = value.SubTotalLocal ? parseFloat(value.SubTotalLocal).toFixed(2) : ""
                value.CurrencyExchangeRate = value.CurrencyExchangeRate ? parseFloat(value.CurrencyExchangeRate).toFixed(2) : ""

                value.CargoRate = value.CargoRate ? parseFloat(value.CargoRate).toFixed(2) : ""
                value.UnitPrice = value.UnitPrice ? parseFloat(value.UnitPrice).toFixed(2) : ""

                AllChargesArray.push(chargesObject)
                arrayDynamic.push(value);

                append(arrayDynamic)
                
                setTimeout(()=>{
                    handleCalculate(key)
                },100)
            })
            GetChargesDescription(AllChargesArray)

        }
        return () => {

        }
    }, [props.transferPartialData])




    if (getCookie(`${formNameLowerCase}containercolumn`)) {
        var getCookieArray = getCookie(`${formNameLowerCase}containercolumn`);
        var getCookieArray = JSON.parse(getCookieArray);

        $.each(ContainerColumn, function (key, value) {
            value.defaultChecked = false
            value.class = "d-none"
        })

        $.each(getCookieArray, function (key, value) {
            $.each(ContainerColumn, function (key2, value2) {

                if (value == key2) {
                    value2.defaultChecked = true
                    value2.class = ""
                }
            })
        })
    }

    const { register, handleSubmit, setValue, trigger, getValues, reset, control, watch, formState: { errors } } = useForm({
        mode: "onChange",
        defaultValues: {
            SalesCreditNoteHasItem: [{ "Name": `${formName}HasItem`, "Qty": 1,"SeqNum":$(".container-items").length+1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType }]
        }
    });
    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        update,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: `${formName}HasItem`
    });







    //set Default for First Came in
    useEffect(() => {
        setValue(`${formName}HasItem[0]["ContainerTypeOptions"]`, props.containerType)
        update(fields)
    }, [props])

    function appendContainerHandle() {
        append({ "Name": `${formName}HasItem`, "Qty": 1,"SeqNum":$(".container-items").length+1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType })
    }

    function appendContainerHandle2() {
    
        append({ "Name": `${formName}HasItem`, "Qty": 1,"SeqNum":1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType })
    }

    function removeContainerHandle(index) {
        remove(index)
        update(fields)
        setRemoveState(true)
    }
    $(document).unbind().on("change", ".columnChooserColumn", function (event) {

        // var index = ($(this).parent().parent().attr('id')).split("-")[1]

        var Cookies = []

        $(this).parent().parent().find(".columnChooserColumn:checked").each(function () {

            Cookies.push($(this).parent().index())

        });

        var json_str = JSON.stringify(Cookies);
        createCookie(`${formNameLowerCase}column`, json_str, 3650);


        if (fields.length > 0) {

            if (fields[0].Name == `${formName}HasItem`) {

                $.each(fields, function (key, value) {
                    if ($(event.target).prop("checked")) {
                        value.ContainerItem[$(event.target).parent().index()].class = ""
                    } else {
                        value.ContainerItem[$(event.target).parent().index()].class = "d-none"
                    }

                })
                update(fields)
            }

        }

    })

    function openTextAreaModal(event) {
        window.$(event.target).next().modal("toggle");
    }


    useEffect(() => {
        trigger()
        return () => {
        }
    }, [fields])

    useEffect(() => {
        if (removeState) {
            handleCalculate(0)
            $.each(fields, function (key, value) {
                setValue(`SalesCreditNoteHasItem[${key}][SeqNum]`, key)
            })
            update(fields)
        }


        return () => {
            setRemoveState(false)
        }
    }, [removeState])





    return (
        <>
            <div className={`${props.ContainerItem.cardLength}`}>
                <div className="card charges ContainerCharges lvl1">
                    <div className="card-header">
                        <h3 className="card-title">{props.ContainerItem.cardTitle}</h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="card">
                            <div className='card-body'>
                                <button className="btn add-container btn-success btn-xs" type="button" onClick={appendContainerHandle}><i className="fa fa-plus"></i></button>


                                <div className="btn-group float-right mb-2" id="columnchooserdropdown">
                                    <button type="button" className="btn btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-th-list" data-toggle="tooltip" title="Column Chooser" data-placement="top"></i>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-left  scrollable-columnchooser">
                                        {ContainerColumn.map((item, index) => {
                                            return (
                                                <label key={index} className="dropdown-item dropdown-item-marker">
                                                    {item.defaultChecked ? <input type="checkbox" className="columnChooserColumn" defaultChecked /> : <input type="checkbox" className="columnChooserColumn" />}
                                                    {item.columnName}
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="table_wrap">
                                    <div className="table_wrap_inner">

                                        <table className="table table-bordered commontable" style={{ width: "100%" }}>
                                            <thead>
                                                <tr>


                                                    {fields.length > 0 ?
                                                        fields[0].ContainerItem ?
                                                            fields[0].ContainerItem.map((item, index) => {
                                                                return (
                                                                    <th key={item.id} className={item.class}>{item.columnName}</th>
                                                                )
                                                            })
                                                            : ContainerColumn.map((item, index) => {
                                                                return (
                                                                    <th key={item.id} className={item.class}>{item.columnName}</th>
                                                                )
                                                            })
                                                        : ContainerColumn.map((item, index) => {
                                                            return (
                                                                <th key={item.id} className={item.class}>{item.columnName}</th>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className="ContainerType container-item">
                                          
                                                {fields.map((item, index) => {
                                                    return (
                                                        <>
                                                            <tr key={item.id} className="container-items">

                                                                {
                                                                    item.ContainerItem ?
                                                                        item.ContainerItem.map((item2, index2) => {
                                                                            if (item2.inputType == "input") {

                                                                                if (index2 == 0) {
                                                                                    return (


                                                                                        <td className={item2.class}>
                                                                                            <input defaultValue='' {...register(`${formName}HasItem` + '[' + index + ']' + '[SalesCreditNoteHasItemUUID]')} className={`form-control d-none`} />
                                                                                            <input defaultValue='' {...register(`${formName}HasItem` + '[' + index + ']' + '[SalesCreditNoteHasContainerType]')} className={`form-control d-none`} />
                                                                                            <input defaultValue='' {...register(`${formName}HasItem` + '[' + index + ']' + '[BookingConfirmation]')} className={`form-control d-none`} />
                                                                                            <div className="row">
                                                                                                <div className="col-md-9">

                                                                                                    {item2.requiredField ?
                                                                                                        <input defaultValue={index} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasItem`] ? errors[`${formName}HasItem`][`${index}`] ? errors[`${formName}HasItem`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                                        :
                                                                                                        <input defaultValue={index} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                                                    }

                                                                                                </div>

                                                                                                <div className="col-md-3">
                                                                                                    <div className="row">

                                                                                                        <div>
                                                                                                            <div className="dropdownbar  float-right mr-1">
                                                                                                                <button className="btn btn-xs btn-secondary dropdown-toggle float-right mr-1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                                    <i className="fa fa-ellipsis-v"></i></button>
                                                                                                                <div className="dropdown-menu float-right" aria-labelledby="dropdownMenuButton">
                                                                                                                    <button className="dropdown-item d-none" type="button">Duplicate</button>
                                                                                                                    <button className="dropdown-item remove-container" onClick={() => removeContainerHandle(index)} type="button">Remove</button>

                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                </div>

                                                                                            </div>


                                                                                        </td>

                                                                                    )

                                                                                } else {
                                                                                    return (
                                                                                        <td className={item2.class}>
                                                                                       
                                                                                            {item2.requiredField ?
                                                                                                <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })}
                                                                                                    className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasItem`] ? errors[`${formName}HasItem`][`${index}`] ? errors[`${formName}HasItem`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} onBlur={  item2.onBlur? (val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index) }:null} />
                                                                                                :
                                                                                                <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} onBlur={  item2.onBlur? (val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index)}:null} />
                                                                                            }

                                                                                        </td>

                                                                                    )
                                                                                }

                                                                            }

                                                                            if (item2.inputType == "number") {
                                                                                return (
                                                                                    <td className={item2.class}>
                                                                                        {item2.requiredField ?
                                                                                            <input type="number" defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasItem`] ? errors[`${formName}HasItem`][`${index}`] ? errors[`${formName}HasItem`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                            :
                                                                                            <input type="number" defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                                        }

                                                                                    </td>

                                                                                )
                                                                            }
                                                                            if (item2.inputType == "number-withModal") {
                                                                                return (
                                                                                    <td className={item2.class}>
                                                                                        <div className="input-group">
                                                                                            {item2.requiredField ?
                                                                                                <input type="number" defaultValue={item2.defaultValue} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasItem`] ? errors[`${formName}HasItem`][`${index}`] ? errors[`${formName}HasItem`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                                :
                                                                                                <input type="number" defaultValue={item2.defaultValue} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                                            }
                                                                                            <div className="input-group-append" style={{ cursor: "pointer" }} onClick={() => ShareContainerModel({ formName, index, fields, getValues, setValue, update, globalContext })}>
                                                                                                <span className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* <div className="SelectContainerCodeField d-none">
                                                                                <Controller
                                                                                    name={(`${formName}HasItem` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                    control={control}
                                                                                    render={({ field: { onChange, value } }) => (
                                                                                        <Select
                                                                                            isClearable={true}
                                                                                            isMulti
                                                                                            {...register(`${formName}HasItem` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                            value={value
                                                                                                ? Array.isArray(value)
                                                                                                    ? value.map((c) =>
                                                                                                        item.ContainerOptions ? item.ContainerOptions.find((z) => z.value === c) : ""

                                                                                                    )
                                                                                                    : item.ContainerOptions.find(
                                                                                                        (c) => c.value === value
                                                                                                    )
                                                                                                : null
                                                                                            }
                                                                                            onChange={(val) =>
                                                                                                val == null
                                                                                                    ? onChange(null)
                                                                                                    : onChange(val.map((c) => c.value))
                                                                                            }
                                                                                            options={item.ContainerOptions}
                                                                                            menuPortalTarget={document.body}
                                                                                            className={`basic-multiple-select`}
                                                                                            classNamePrefix="select"
                                                                                            styles={globalContext.customStyles}

                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </div> */}
                                                                                    </td>

                                                                                )
                                                                            }

                                                                            if (item2.inputType == "checkbox") {
                                                                                return (
                                                                                    <td className={item2.class} style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                                                        <input type={"checkbox"} disabled={item2.disabled ? item2.disabled : false} checked={item2.check} defaultValue='0' className={`mt-2 ${item2.fieldClass ? item2.fieldClass : ""}`} onChange={CheckBoxHandle}></input>
                                                                                        <input type={"input"} defaultValue='0' className="d-none" {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')} />
                                                                                    </td>
                                                                                )
                                                                            }

                                                                            if (item2.inputType == "single-select") {

                                                                                return (
                                                                                    <td className={item2.class}>


                                                                                        <Controller
                                                                                            name={(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')}

                                                                                            control={control}
                                                                                            defaultValue={item2.defaultValue ? item2.defaultValue : ""}
                                                                                            render={({ field: { onChange, value } }) => (
                                                                                                <Select
                                                                                                    isClearable={true}
                                                                                                    onKeyDown={handleKeydown}
                                                                                                    {...register(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')}
                                                                                                    value={value ? item2.options ? item2.options.find(c => c.value === value) : null : ""}
                                                                                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange(val, index) }}
                                                                                                    options={item2.options}
                                                                                                    onMenuOpen={() => { handleOpenMenu(item2.name, item2.options, index) }}
                                                                                                    menuPortalTarget={document.body}
                                                                                                    isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                                                    className={`basic-single ${item2.fieldClass ? item2.fieldClass : ""}`}
                                                                                                    classNamePrefix="select"
                                                                                                    styles={globalContext.customStyles}
                                                                                                />
                                                                                            )}
                                                                                        />

                                                                                        {item2.columnName == "UOM" ? <input type="hidden" className={`ArrayUOM-${index}`}></input> : ""}
                                                                                    </td>
                                                                                )

                                                                            }

                                                                            if (item2.inputType == "multiple-select") {

                                                                                return (
                                                                                    <td className={item2.class}>

                                                                                        <Controller
                                                                                            name={(`${formName}HasItem` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                            control={control}
                                                                                            render={({ field: { onChange, value } }) => (
                                                                                                <Select
                                                                                                    isClearable={true}
                                                                                                    isMulti
                                                                                                    {...register(`${formName}HasItem` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                                    value={value
                                                                                                        ? Array.isArray(value)
                                                                                                            ? value.map((c) =>
                                                                                                                item2.options ? item2.options.find((z) => z.value === c.value) : ""

                                                                                                            )
                                                                                                            : item2.options.find(
                                                                                                                (c) => c.value === value
                                                                                                            )
                                                                                                        : null
                                                                                                    }
                                                                                                    onChange={(val) =>
                                                                                                        val == null
                                                                                                            ? onChange(null)
                                                                                                            : onChange(val.map((c) => c.value))
                                                                                                    }
                                                                                                    onKeyDown={handleKeydown}
                                                                                                    options={item2.options}
                                                                                                    menuPortalTarget={document.body}
                                                                                                    className={`basic-multiple-select ${item2.fieldClass ? item2.fieldClass : ""}`}
                                                                                                    classNamePrefix="select"
                                                                                                    styles={globalContext.customStyles}

                                                                                                />
                                                                                            )}
                                                                                        />
                                                                                    </td>
                                                                                )

                                                                            }

                                                                            if (item2.inputType == "single-asyncSelect") {
                                                                                return (
                                                                                    <td className={item2.class}>
                                                                                        <Controller
                                                                                            name={(`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']')}
                                                                                            control={control}
                                                                                            render={({ field: { onChange, value } }) => (
                                                                                                <AsyncSelect
                                                                                                    isClearable={true}
                                                                                                    {...register((`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']'))}
                                                                                                    value={item2.optionColumn ? item2.optionColumn : (value)}
                                                                                                    placeholder={globalContext.asyncSelectPlaceHolder}
                                                                                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange && item2.onChange(val, index) }}
                                                                                                    getOptionLabel={val => val[`${item2.optionLabel}`]}
                                                                                                    getOptionValue={val => val[`${item2.optionValue}`]}
                                                                                                    loadOptions={item2.loadOption}
                                                                                                    menuPortalTarget={document.body}
                                                                                                    className={`basic-single ${item2.fieldClass ? item2.fieldClass : ""}`}
                                                                                                    classNamePrefix="select"
                                                                                                    styles={globalContext.customStyles}
                                                                                                />
                                                                                            )}
                                                                                        />
                                                                                    </td>
                                                                                )
                                                                            }

                                                                            if (item2.inputType == "input-Modal") {
                                                                                return (
                                                                                    <td className={item2.class}>
                                                                                        <input type="text" className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} defaultValue={item2.textValue} onClick={openTextAreaModal} style={{ cursor: "pointer" }} readOnly={item2.readOnly ? item2.readOnly : false} />
                                                                                        <div className="modal fade">
                                                                                            <div className="modal-dialog">
                                                                                                <div className="modal-content">

                                                                                                    <div className="modal-header">
                                                                                                        <h4 className="modal-title">{item2.columnName}</h4>
                                                                                                        <button type="button" className="close" data-dismiss="modal">×</button>
                                                                                                    </div>

                                                                                                    <div className="modal-body">
                                                                                                        <div className="form-group">

                                                                                                            <textarea id="" className={`form-control ${item2.modelClass}`}  {...register((`${formName}HasItem` + '[' + index + ']' + '[' + item2.name + ']'))} rows="5" placeholder={`Enter ${item2.columnName}`}></textarea>


                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div className="modal-footer">
                                                                                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                                                                    </div>

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                )
                                                                            }
                                                                        })
                                                                        : ""

                                                                }
                                                            </tr>


                                                        </>
                                                    )
                                                })}

                                            </tbody>

                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <QuickFormTotalCard props={props} totalTax={totalTax} totalAmount={totalAmount} />
        </>
    )
}

export default QuickFormContainer