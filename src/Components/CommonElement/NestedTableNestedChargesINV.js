import React, {useContext, useEffect, useState} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { CheckBoxHandle, ControlOverlay, GetUpdateData, CreateData, createCookie, getCookie, getAreaById,getPortDetails,GetCompaniesData,getCompanyDataByID,GetBranchData, getUNNumberByID, getHSCodeByID, getContainers, GetChargesById, getCurrencyRate,GetCompanyBranches, sortArray} from '../../Components/Helper.js'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $ from "jquery";
import axios from "axios"

function NestedTableNestedChargesINV(props) {
    
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    const formNameLowerCase = props.formName.toLowerCase()
    const [indexBeforeAppend, setIndexBeforeAppend] = useState("")
    const [calculateIndex, setCalculateIndex] = useState("")
    const [count, setCount] = useState(0)
    const [updateNestedChargesFillData, setUpdateNestedChargesFillData] = useState([])
    const [FilledUpdateData, setFilledUpdateData] = useState(false)

    var countForBlock = 0
    const { register, handleSubmit, setValue, trigger, getValues, reset, control, watch, formState: { errors } } = useForm({
        mode: "onChange",
        NestedCharges: [],
    });
    const {
        fields,
        append,
        update,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`
    });

    var OptionBIlltoType = [
        {value:"Bill To",label:"Bill To"},
        {value:"Agent",label:"Agent"},
        {value:"Shipper",label:"Shipper"},
        {value:"Notify Party",label:"Notify Party"},
        {value:"Attention Party",label:"Attention Party"},
        {value:"Others",label:"Others"},
    ]

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }
    
    function handleOpenMenu(name, options, containerIndex, chargesIndex, index) {

        if (name == "ChargesCode") {
            var newArray = []
            var previosOption = []
            var ChoosenArray=[]
            // var selectedIdA = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesCode]`)
            var selectedIdA = getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${index}][ChargesCode]`)
            //disabled option that already selected
            $.each(options, function (key, value) {
                value.selected = false
            })

            $(".ChargesTable").eq(containerIndex).find(".NestedChargesTR").eq(chargesIndex).find(".ChargesCode").find(".select__single-value").each(function (key, value) {
               
                if ($(value).text() !== "") {
                    if(getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${key}][ParentCharges]`)!==null){
                        newArray.push($(value).text())
                    }
                }
                    ChoosenArray.push({label:$(value).text(),value:getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${key}][ChargesCode]`)})
            })

            $.each(options, function (key, value) {
                $.each(ChoosenArray, function (key2, value2) {
                    if (value2.label == value.label) {
                        value.selected = true
                    }
                })
            })
              $.each(options, function (key, value) {
                if(value.label==$(".chargesTable").eq(containerIndex).find(".NestedChargesTR").eq(chargesIndex).find(".ChargesCode").find(".select__single-value").text()){
                    if(selectedIdA!==value.value){
                        value.selected=true
                    }
                }

                if (previosOption.includes(value.label)) {
                    if (selectedIdA !== value.value) {
                        value.selected = true
                    }
                } else {
                    previosOption.push(value.label)
                }
            })
        }
        //decide to show charges according to child charges choosen
        if (name == "ParentCharges") {
            var newArray = []
            var parentArray = []
            $.each(options, function (key, value) {
                value.selected = true
            })

            $(".chargesTable").eq(containerIndex).find(".NestedChargesTR").eq(chargesIndex).find(".ChargesCode").find(":hidden").each(function (key, value) {

                if ($(value).val() !== "") {
                    newArray.push($(value).val())
                }
            })

            $(".chargesTable").eq(containerIndex).find(".NestedChargesTR").eq(chargesIndex).find(".ChargesCode").each(function (key, value) {
                if ($(value).find(".select__single-value").hasClass("ml-4")) {
                    newArray = newArray.filter(function (oneArray) {
                        return oneArray !== $(value).find(":hidden").val()
                    });
                } else {
                    parentArray.push($(value).find(":hidden").val())
                }
            })
            $.each(options, function (key, value) {
                $.each(newArray, function (key2, value2) {
                    if (value2 == value.value) {
                        value.selected = false
                    }

                })
            })
        }
    }

    function handleChangeChargesCode(val,index){
        $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][ChargesCode]`).parent().trigger("change")
    }

    function handleCalChargesGetIndexAndSetState(val,index){
        setCalculateIndex(index)
    }

    function handleRemoveNestedCharges(index){
        remove(index)
        var NestedChargesFirstData = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][${props.formName}ChargesUUID]`).closest(".insidecharges-item").next().find(".nestedCharges-item")
        if(NestedChargesFirstData.children().length <= 1) {
            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][UnitPrice]']`).prop("readonly",false)
            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][Discount]']`).prop("readonly",false)
        }
    }

    function handleCalculate (index){
        if(!props.transferPartial){
            var containerIndex = props.containerIndex
            var chargesIndex = props.chargesIndex
            var nestedChargesIndex = index
            var qty = getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][Qty]`)
            var unitPrice = getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][UnitPrice]`)
    
            if(qty == ""){
                qty = 0
            }
            if(unitPrice == ""){
                unitPrice = 0.00
            }
    
            var unitDiscount = getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][Discount]`)
            var TotalAmount = (parseFloat(qty) * parseFloat(unitPrice)).toFixed(2)
    
            if(unitDiscount){
                if (unitDiscount.includes("%")){
                    var Discount = unitDiscount.replace("%", "");
                    Discount = parseFloat(Discount) / 100;
                    unitDiscount = parseFloat(Discount)
                    
                    var unitTotalDiscount = (unitPrice * unitDiscount).toFixed(2)
                    setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][Discount]`,parseFloat(unitTotalDiscount).toFixed(2))
                    
                    if(unitTotalDiscount){
                        TotalAmount = (parseFloat(qty) * (parseFloat(unitPrice) - parseFloat(unitTotalDiscount))).toFixed(2)
                        
                    }
                }else{
                    setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][Discount]`,parseFloat(unitDiscount).toFixed(2))
                    TotalAmount = (parseFloat(qty) * (parseFloat(unitPrice) - parseFloat(unitDiscount))).toFixed(2)
                }
            }
            setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][Amount]`,TotalAmount)
    
            var TotalTax
            var SubTotal
            var SubTotalLocal
    
            var taxRate = getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][TaxRate]`)
            if(taxRate){
                if(taxRate.includes("%")){
                    var Tax = taxRate.replace("%", "")
                    Tax = (parseFloat(Tax) / 100).toFixed(2)
                    taxRate = parseFloat(Tax)
                }
                TotalTax = (TotalAmount * parseFloat(taxRate)).toFixed(2)
                SubTotal = (parseFloat(TotalAmount) + parseFloat(TotalTax)).toFixed(2)
            }
            else{
                SubTotal = (parseFloat(TotalAmount)).toFixed(2)
            }
            
            var currencyRate = $(`input[name='${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][CurrencyExchangeRate]']`).val()
    
            if(currencyRate){
                SubTotalLocal = (parseFloat(SubTotal) * parseFloat(currencyRate)).toFixed(2)
            }else{
                SubTotalLocal = (parseFloat(SubTotal)).toFixed(2)
            }
    
            setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][TaxAmount]`,TotalTax)
            setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][SubTotal]`,SubTotal)
            setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][NestedCharges][${nestedChargesIndex}][SubTotalLocal]`,SubTotalLocal)
            
            var nestedChargesLength = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][${props.formName}ChargesUUID]`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
    
            var TotalUnitPrice = 0
            var TotalNestedChargesDisc = 0.00
    
            for (var index = 0; index < nestedChargesLength; index++) {
                var discount = $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][Discount]`).val()
                if(discount == ""){
                    discount = 0.00
                }
                TotalNestedChargesDisc =  (parseFloat(TotalNestedChargesDisc) + parseFloat(discount)).toFixed(2)
    
                var unitPrice =  $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][UnitPrice]`).val()
                TotalUnitPrice =  (parseFloat(TotalUnitPrice) + parseFloat(unitPrice)).toFixed(2)
    
            }
            props.setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][Discount]`,TotalNestedChargesDisc)
            props.setValue(`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][UnitPrice]`,TotalUnitPrice)
        }

    }

    if(props.transferPartial) {
        var nestedChargesColumn = [
            { columnName: "Charges Code", inputType: "single-select", defaultChecked: true, name: "ChargesCode", class: "", fieldClass:"ChildCharges ChargesCode Charges_Code", options: [], onChange: handleChangeChargesCode },
            { columnName: "Charges Name", inputType: "input", defaultChecked: false, name: "ChargesName", class: "d-none",  },
            { columnName: "BL No.", inputType: "single-select", defaultChecked: false, name: "BillOfLading", class: "", fieldClass:"BL ChildBL FieldCantChangeDisabled readOnlySelect", options: formContext.billOfLadingOptions, onChange:"" },
            { columnName: "BC No.", inputType: "single-select", defaultChecked: false, name: "BookingConfirmation", class: "", fieldClass:"FieldCantChangeDisabled ChildBC readOnlySelect", options: formContext.bookingConfirmationOptions, onChange:"" },
            { columnName: "QT No.", inputType: "single-select", defaultChecked: false, name: "Quotation", class: "", fieldClass:"FieldCantChangeDisabled ChildQT readOnlySelect", options: formContext.quotationOptions, onChange:"" },
            { columnName: "Port Code", inputType: "single-select", defaultChecked: false, name: "PortCode", class: "d-none", fieldClass: "Port_Code OriReadOnlyClass", options:props.port, onChange:"onChangeChargesPortCode", readOnly: true },
            { columnName: "Area", inputType: "input", defaultChecked: false, name: "Area", class: "d-none", fieldClass: "ChargesAreaName OriReadOnlyClass", readOnly: true},
            { columnName: "GL Code", inputType: "input", defaultChecked: false, name: "AccountCode", class: "d-none", fieldClass: "ChildAccountCode"},
            { columnName: "Currency", inputType: "single-select", defaultChecked: false, name: "Currency", class: "d-none",options:props.currency, fieldClass:"currency calCharges ChildCurrency OriReadOnlyClass", onChange:"handleChangeCurrency", readOnly: true },
            { columnName: "Rate Of Exchange", inputType: "input", defaultChecked: false, name: "CurrencyExchangeRate", class: "d-none",fieldClass:"calCharges exchangerate inputDecimalFourPlaces ChildExchangeRate OriReadOnlyClass", readOnly: true, onBlur:handleCalChargesGetIndexAndSetState},
            { columnName: "Cargo Type", inputType: "single-select", defaultChecked: false, name: "CargoType", class: "d-none",fieldClass:"CargoType ChildCargoType",options:props.cargoType, onChange: ""},
            { columnName: "Cargo Rate", inputType: "input", defaultChecked: false, name: "CargoRate", class: "d-none", fieldClass: "CargoRate ChildCargoRate inputDecimalFourPlaces" },
            { columnName: "UOM", inputType: "single-select", defaultChecked: false, name: "UOM", class: "d-none", fieldClass: "ChildUOM", options:[] },
            { columnName: "Vessel", inputType: "input", defaultChecked: false, name: "Vessel", class: "d-none", fieldClass: "ChildVessel", readOnly: true},
            { columnName: "Voyage", inputType: "input", defaultChecked: false, name: "Voyage", class: "d-none", fieldClass: "ChildVoyage", readOnly: true},
            { columnName: "Shipper", inputType: "input", defaultChecked: false, name: "Shipper", class: "d-none", fieldClass: "ChildShipper", readOnly: true},
            { columnName: "Consignee", inputType: "input", defaultChecked: false, name: "Consignee", class: "d-none", fieldClass: "ChildConsignee", readOnly: true},
            { columnName: "Charges Description", inputType: "input-Modal", defaultChecked: false, name: "ChargesDescription", fieldClass:"ChildChargesDescriptionReadonly OriReadOnlyClass",modelClass:"ChildChargesText", class: "d-none", readOnly: true },
            { columnName: "Unit Disc", inputType: "input", defaultChecked: false, name: "Discount", class: "d-none", fieldClass:"inputDecimalTwoPlaces calCharges ContainerDiscount Discount ChildDiscount", onBlur:handleCalChargesGetIndexAndSetState },
            { columnName: "Qty", inputType: "number", defaultChecked: true, name: "Qty", class: "", fieldClass:"Quantity calCharges", onChange: "" , onBlur:handleCalChargesGetIndexAndSetState},
            { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", class: "", fieldClass: "calCharges UnitPrice inputDecimalTwoPlaces ChildUnitPrice", onChange: "", onBlur:handleCalChargesGetIndexAndSetState },
            { columnName: "Freight Term", inputType: "single-select", defaultChecked: true, name: "FreightTerm", class: "", fieldClass: "FreightTerm ChildFreightTerm OriReadOnlyClass", options:props.freightTerm, onChange: "handleChangeFreightTerm", readOnly: true },
            { columnName: "Local Amount", inputType: "input", defaultChecked: false, name: "Amount", class: "d-none", fieldClass: "calCharges inputDecimalTwoPlaces Amount OriReadOnlyClass",readOnly: true },
            { columnName: "Tax Code", inputType: "single-select", defaultChecked: false, name: "TaxCode", class: "d-none", fieldClass: "TaxCode Tax_Code ChildTaxCode OriReadOnlyClass", options:props.taxCode, onChange:"onChangeTaxCode", readOnly: true },
            { columnName: "Tax Rate", inputType: "input", defaultChecked: false, name: "TaxRate", class: "d-none", fieldClass: "inputDecimalTwoPlaces calCharges TaxRate ChildTaxRate OriReadOnlyClass",readOnly: true, onBlur:handleCalChargesGetIndexAndSetState },
            { columnName: "Tax Amount", inputType: "input", defaultChecked: false, name: "TaxAmount", class: "d-none", fieldClass: "inputDecimalTwoPlaces calCharges TaxAmount ContainerTaxAmount OriReadOnlyClass",readOnly: true },
            { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", class: "", fieldClass: "inputDecimalTwoPlaces calCharges SubTotal ContainerSubTotal OriReadOnlyClass",readOnly: true },
            { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: true, name: "SubTotalLocal", class: "", fieldClass: "calCharges subtotallocal inputDecimalTwoPlaces ContainerSubTotalLocal OriReadOnlyClass",readOnly: true },
        ]

    }
    else{
        var nestedChargesColumn = [
            { columnName: "Charges Code", inputType: "single-select", defaultChecked: true, name: "ChargesCode", class: "", fieldClass:"ChildCharges ChargesCode Charges_Code", options: [], onChange: handleChangeChargesCode },
            { columnName: "Charges Name", inputType: "input", defaultChecked: false, name: "ChargesName", class: "d-none",  },
            { columnName: "BL No.", inputType: "single-select", defaultChecked: true, name: "BillOfLading", class: "", fieldClass:"BL ChildBL FieldCantChangeDisabled readOnlySelect", options: formContext.billOfLadingOptions, onChange:"" },
            { columnName: "BC No.", inputType: "single-select", defaultChecked: true, name: "BookingConfirmation", class: "", fieldClass:"FieldCantChangeDisabled ChildBC readOnlySelect", options: formContext.bookingConfirmationOptions, onChange:"" },
            { columnName: "QT No.", inputType: "single-select", defaultChecked: true, name: "Quotation", class: "", fieldClass:"FieldCantChangeDisabled ChildQT readOnlySelect", options: formContext.quotationOptions, onChange:"" },
            { columnName: "Port Code", inputType: "single-select", defaultChecked: false, name: "PortCode", class: "d-none", fieldClass: "Port_Code OriReadOnlyClass", options:props.port, onChange:"onChangeChargesPortCode", readOnly: true },
            { columnName: "Area", inputType: "input", defaultChecked: false, name: "Area", class: "d-none", fieldClass: "ChargesAreaName OriReadOnlyClass", readOnly: true},
            { columnName: "GL Code", inputType: "input", defaultChecked: false, name: "AccountCode", class: "d-none", fieldClass: "ChildAccountCode"},
            { columnName: "Currency", inputType: "single-select", defaultChecked: false, name: "Currency", class: "d-none",options:props.currency, fieldClass:"currency calCharges ChildCurrency OriReadOnlyClass", onChange:"handleChangeCurrency", readOnly: true },
            { columnName: "Rate Of Exchange", inputType: "input", defaultChecked: false, name: "CurrencyExchangeRate", class: "d-none",fieldClass:"calCharges exchangerate inputDecimalFourPlaces ChildExchangeRate OriReadOnlyClass", readOnly: true, onBlur:handleCalChargesGetIndexAndSetState},
            { columnName: "Cargo Type", inputType: "single-select", defaultChecked: false, name: "CargoType", class: "d-none",fieldClass:"CargoType ChildCargoType",options:props.cargoType, onChange: ""},
            { columnName: "Cargo Rate", inputType: "input", defaultChecked: false, name: "CargoRate", class: "d-none", fieldClass: "CargoRate ChildCargoRate inputDecimalFourPlaces" },
            { columnName: "UOM", inputType: "single-select", defaultChecked: false, name: "UOM", class: "d-none", fieldClass: "ChildUOM", options:[] },
            { columnName: "Vessel", inputType: "input", defaultChecked: false, name: "Vessel", class: "d-none", fieldClass: "ChildVessel", readOnly: true},
            { columnName: "Voyage", inputType: "input", defaultChecked: false, name: "Voyage", class: "d-none", fieldClass: "ChildVoyage", readOnly: true},
            { columnName: "Shipper", inputType: "input", defaultChecked: false, name: "Shipper", class: "d-none", fieldClass: "ChildShipper", readOnly: true},
            { columnName: "Consignee", inputType: "input", defaultChecked: false, name: "Consignee", class: "d-none", fieldClass: "ChildConsignee", readOnly: true},
            { columnName: "Charges Description", inputType: "input-Modal", defaultChecked: false, name: "ChargesDescription", fieldClass:"ChildChargesDescriptionReadonly OriReadOnlyClass",modelClass:"ChildChargesText", class: "d-none", readOnly: true },
            { columnName: "Unit Disc", inputType: "input", defaultChecked: false, name: "Discount", class: "d-none", fieldClass:"inputDecimalTwoPlaces calCharges ContainerDiscount Discount ChildDiscount", onBlur:handleCalChargesGetIndexAndSetState },
            { columnName: "Qty", inputType: "number", defaultChecked: true, name: "Qty", class: "", fieldClass:"Quantity calCharges", onChange: "" , onBlur:handleCalChargesGetIndexAndSetState},
            { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", class: "", fieldClass: "calCharges UnitPrice inputDecimalTwoPlaces ChildUnitPrice", onChange: "", onBlur:handleCalChargesGetIndexAndSetState },
            { columnName: "Freight Term", inputType: "single-select", defaultChecked: true, name: "FreightTerm", class: "", fieldClass: "FreightTerm ChildFreightTerm OriReadOnlyClass", options:props.freightTerm, onChange: "handleChangeFreightTerm", readOnly: true },
            { columnName: "Local Amount", inputType: "input", defaultChecked: false, name: "Amount", class: "d-none", fieldClass: "calCharges inputDecimalTwoPlaces Amount OriReadOnlyClass",readOnly: true },
            { columnName: "Tax Code", inputType: "single-select", defaultChecked: false, name: "TaxCode", class: "d-none", fieldClass: "TaxCode Tax_Code ChildTaxCode OriReadOnlyClass", options:props.taxCode, onChange:"onChangeTaxCode", readOnly: true },
            { columnName: "Tax Rate", inputType: "input", defaultChecked: false, name: "TaxRate", class: "d-none", fieldClass: "inputDecimalTwoPlaces calCharges TaxRate ChildTaxRate OriReadOnlyClass",readOnly: true, onBlur:handleCalChargesGetIndexAndSetState },
            { columnName: "Tax Amount", inputType: "input", defaultChecked: false, name: "TaxAmount", class: "d-none", fieldClass: "inputDecimalTwoPlaces calCharges TaxAmount ContainerTaxAmount OriReadOnlyClass",readOnly: true },
            { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", class: "", fieldClass: "inputDecimalTwoPlaces calCharges SubTotal ContainerSubTotal OriReadOnlyClass",readOnly: true },
            { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: true, name: "SubTotalLocal", class: "", fieldClass: "calCharges subtotallocal inputDecimalTwoPlaces ContainerSubTotalLocal OriReadOnlyClass",readOnly: true },
        ]
    }

    
    var NestedChargesCookies=""
    if(props.transferPartial){
        NestedChargesCookies=`${formNameLowerCase}transferpartialnestedchargescolumn`
    }else{
        NestedChargesCookies=`${formNameLowerCase}nestedchargescolumn`
    }
    if (getCookie(NestedChargesCookies)) {
        var getCookieArray = getCookie(NestedChargesCookies);
        var getCookieArray = JSON.parse(getCookieArray);

        $.each(nestedChargesColumn, function (key, value) {
            value.defaultChecked = false
            value.class = "d-none"
        })

        $.each(getCookieArray, function (key, value) {
            $.each(nestedChargesColumn, function (key2, value2) {

                if (value == key2) {
                    value2.defaultChecked = true
                    value2.class = ""
                }
            })
        })
    }

    //Append Nested Charges Use Effect
    useEffect(() => {
        if(props.appendNestedCharges.append == true && props.appendNestedCharges.containerIndex == props.containerIndex && props.appendNestedCharges.chargesIndex == props.chargesIndex){
            setIndexBeforeAppend(($(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][${props.formName}ChargesUUID]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length))
            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][UnitPrice]']`).prop("readonly",true)
            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][Discount]']`).prop("readonly",true)
            var tempCharges = nestedChargesColumn
            $.each(tempCharges, function (key3, value3) {
                if(value3.columnName == "Charges Code"){
                    tempCharges[key3]["options"] = props.combinedChargesOptions[props.containerIndex]
                }
                if(value3.columnName == "Qty"){
                    tempCharges[key3]["defaultValue"] = $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][Qty]']`).val()
                }
                if(value3.columnName == "Bill To"){
                    tempCharges[key3]["options"] = props.onChangeBillToType && props.onChangeBillToType.arrayCompanyBranch
                }
            })
            append({ "Name": `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`, "NestedChargesItem": tempCharges})
            props.setAppendNestedCharges({append:false,index:0})

        }
        return () => {
        }
      }, [props.appendNestedCharges])

      //Change charges Option when container Changed 
      useEffect(() => {
        if(props.onChangeContainerTypeCharges){
            if (fields.length > 0) {
                if (fields[0].Name == `${props.formName}HasContainerType[${props.containerChangeIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`) {      
                    $.each(fields, function (key, value) {    
                        value.NestedChargesItem[0].options = props.onChangeContainerTypeCharges
                        value.NestedChargesItem[1]["defaultValue"] = $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][Qty]']`).val()
                        setValue(`${props.formName}HasContainerType[${props.containerChangeIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][Qty]`,"1")
                        update(fields)
                    })
                }
            }
        }
        
        var newArray = props.combinedChargesOptions
        if(props.combinedChargesOptions.length >= props.containerChangeIndex){
            newArray[props.containerChangeIndex] = props.onChangeContainerTypeCharges
            props.setCombinedChargesOptions(newArray)
        }
        else{
            props.setCombinedChargesOptions((e)=>[...e,props.onChangeContainerTypeCharges])
        }
        return () => {
        }
    }, [props.onChangeContainerTypeCharges])

    useEffect(() => {
        if(FilledUpdateData != false){
            if(props.onChangeContainerTypeChargesVoyage.length >0){

                $.each(props.onChangeContainerTypeChargesVoyage, function(index, item){
                    if(index == props.containerIndex){
                        if (fields.length > 0) { 
                            $.each(fields, function (key, value) {    
                                value.NestedChargesItem[0].options = item["ChargesData"]
                            })
                            
                        }
                    }
                })
            }

        }
        return () => {
        }
    }, [props.onChangeContainerTypeChargesVoyage])
    

    useEffect(() => {
        countForBlock++

        var index = fields.length -1 
        //Avoid Remove fields to run this
        if(index >indexBeforeAppend-1){//when append
            if((formContext.formState.formType!="Update" && formContext.formState.formType!="Transfer" && formContext.formState.formType!="TransferFromBooking") || FilledUpdateData != false){ // Avoid run when fillin data update page or transfer page
                var Description = $(`textarea[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][ChargesDescription]']`).val()
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][CustomerType]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][CustomerType]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][FreightTerm]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][FreightTerm]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][ChargesDescription]`,Description)
                $(`textarea[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][ChargesDescription]']`).closest(".modal").prev().val(Description)
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][Currency]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Currency]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][CurrencyExchangeRate]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][CurrencyExchangeRate]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][BillTo]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][BillTo]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][TaxCode]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][TaxCode]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][TaxRate]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][TaxRate]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][PortCode]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][PortCode]`).val())
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][Area]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]`).val())
                setTimeout(() => {
                    $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][CustomerType]`).parent().trigger("change")
                }, 500);
            }
        }else if( index == indexBeforeAppend-1){//onchange field

        }
        else{ //remove
            if(fields.length == 0){ //remove readonly when remove all nested charges
                $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][UnitPrice]']`).prop("readonly",false)
            }
        }

        $(".columnchooserdropdownnestedcharges").on("change", function (event) {
            if(countForBlock == 1){
                // var index = ($(this).parent().parent().attr('id')).split("-")[1]
        
                var Cookies = []
        
                $(this).parent().parent().find(".columnchooserdropdownnestedcharges:checked").each(function () {
        
                    Cookies.push($(this).parent().index())
        
                });
        
                var json_str = JSON.stringify(Cookies);
                if(props.transferPartial){
                    createCookie(`${formNameLowerCase}transferpartialnestedchargescolumn`, json_str, 3650);
                }else{
                    createCookie(`${formNameLowerCase}nestedchargescolumn`, json_str, 3650);
                }
        
        
                if (fields.length > 0) {
                    if (fields[0].Name == `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`) {
        
                        $.each(fields, function (key, value) {
                            if ($(event.target).prop("checked")) {
                                value.NestedChargesItem[$(event.target).parent().index()].class = ""
                            } else {
                                value.NestedChargesItem[$(event.target).parent().index()].class = "d-none"
                            }
        
                        })
                        update(fields)
                    }
        
                }
            }
    
        })
        $('.columnchooserdropdown .dropdown-menu').click(function (event) {
            event.stopPropagation();
        });

        $(".ChildCharges").on("change", function (e) {
            if(countForBlock == 1){
                var thisContainerIndex = $(this).closest(".ChargesTable").prev().index() /2
                var thisChargesIndex = $(this).closest(".NestedCharges-repeater").closest("tr").prev().index() /2
                if(thisContainerIndex == props.containerIndex && thisChargesIndex == props.chargesIndex){
                    setTimeout(() => {
                        var index = $(this).closest("tr").index()
                        var value = $(this).find("input:hidden").val()
                        var label = $(this).find(".select__single-value").text()
            
                        GetChargesById(value,globalContext).then(data => {
                            var uomValue = data.data.UOM;
                            
                            var optionUOM = []
                            var defaultUOM
                           
                            if(uomValue){
                                const arrayUOM = uomValue.split(",");
                                try {
                                    $.each(arrayUOM, function (key, value) {
                                        if(key==0){
                                            defaultUOM = value
                                        }
                                        optionUOM.push({value:value,label:value})
                                    });
                                }
                                catch (err) {
                
                                }
                            }

                            if(fields.length >0){
                                $.each(fields[0]["NestedChargesItem"], function (key2,value2) {
                                    if(value2.name =="UOM"){
                                        setValue(`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][NestedChargesItem][${key2}][options]`,sortArray(optionUOM))
                                        update(fields)
                                    }
                                })
                            }
                            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][ChargesName]`,data.data.ChargesName)
                            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][UOM]`,defaultUOM)
                            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][ChargesDescription]`,data.data.Description)
                            $(`textarea[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][ChargesDescription]']`).closest(".modal").prev().val(data.data.Description)
                            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][Currency]`,data.data.CurrencyType)
                            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][UnitPrice]`,(parseInt(data.data.ReferencePrice)).toFixed(2))
                            
                            //get Currency Rate
                            var filters = {
                                "FromCurrency": data.data.CurrencyType,
                                "CurrencyRate.Valid": 1
                            };
                            var newData=[]
                            getCurrencyRate(filters,globalContext).then(data2 => {   
                                $.each(data2.data, function (key2, value2) {
                                    if (value2.EndDate == "" || value2.EndDate == null) {
                                        newData.push(value2)
                                    }
                                    else {
                                        var endDate = moment(moment.unix(value2.EndDate).toDate()).format("DD-MM-YYYY");
                                        var TodayDate = moment().format("DD-MM-YYYY");
                
                                        var start = moment(endDate, "DD-MM-YYYY");
                                        var end = moment(TodayDate, "DD-MM-YYYY");
                
                                        var Days = moment.duration(start.diff(end)).asDays();
                                        if (Days >= 0) {
                                            newData.push(value2)
                                        }
                                    }
                
                                });
            
                                if (newData.length == 1) {
                                    if($(`input[name='${props.formName}[Currency]']`).val()==data.data.CurrencyType){
                                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][CurrencyExchangeRate]`,parseFloat("1").toFixed(4))
                                    }
                                    else{
                                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][CurrencyExchangeRate]`,parseFloat(newData[0]["Rate"]).toFixed(4))
                                    }
                
                                    
                
                                }
                                else{
                                    if($(`input[name='${props.formName}[Currency]']`).val()==data.data.CurrencyType){
                                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][CurrencyExchangeRate]`,parseFloat("1").toFixed(4))
            
                                    }
                                    else{
                                        var resultCurrency = (newData).filter(function (oneArray) {
                                            
                                            return oneArray.toCurrency.CurrencyTypeUUID==$(`input[name='${props.formName}[Currency]']`).val()
                                        });
                
                                        if(resultCurrency.length!=0){
                                                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][${props.chargesIndex}][NestedCharges][CurrencyExchangeRate]`,parseFloat(resultCurrency[0]["Rate"]).toFixed(4))
                                        }
                                        else{
                                            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][${props.chargesIndex}][NestedCharges][CurrencyExchangeRate]`,"")
                
                                        }
                                    }
                                }
                            })
                            handleCalculate(index)
                        })
                        
                    }, 100);
                }
            }
        })

        $(".ParentExchangeRate").on("change", function (e) {
            if(countForBlock == 1){ 
                var childLenght = $(this).closest(".insidecharges-item").next().find(".ChildExchangeRate").length
                for (var i = 0; i < childLenght; i++) {
                    handleCalculate(i)
                }

            }
        })
        
        return () => {
            countForBlock = 0
        }
      }, [fields])

      useEffect(()=> { // onChange Child PortCode
         var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
        setTimeout(() => {
            if(childLenght > 0){
                if(props.onChangePortCode.containerIndex == props.containerIndex && props.onChangePortCode.chargesIndex == props.chargesIndex){ 
                    for (var i = 0; i < childLenght; i++) {
                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][PortCode]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][PortCode]']`).val())
                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][Area]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).val())
                    }
                }
            }
        }, 500);

        return () => {
        }
      },[props.onChangePortCode])

      useEffect(()=> { // onChange Child Freight Term
         var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
         if(childLenght > 0){
            if(props.onChangeFreightTerm.containerIndex == props.containerIndex && props.onChangeFreightTerm.chargesIndex == props.chargesIndex){ 
                for (var i = 0; i < childLenght; i++) {
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][FreightTerm]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][FreightTerm]']`).val())
                }
            }
        }

        return () => {
        }
      },[props.onChangeFreightTerm])
      
      useEffect(()=> { // onChange Child Charges Description
         var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
         if(childLenght > 0){
            if(props.onChangeChargesDescription.containerIndex == props.containerIndex && props.onChangeChargesDescription.chargesIndex == props.chargesIndex){ 
                for (var i = 0; i < childLenght; i++) {
                    var parentDescription = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).parent().parent().find(".ParentChargesDescriptionReadonly").val()
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][ChargesDescription]`,parentDescription)
                    $(`textarea[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][ChargesDescription]']`).closest(".modal").prev().val(parentDescription)
                }
            }
        }
        return () => {
        }
      },[props.onChangeChargesDescription])

      useEffect(()=> { // onChange Child Tax Code
         var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
         if(childLenght > 0){
            if(props.onChangeTaxCode.containerIndex == props.containerIndex && props.onChangeTaxCode.chargesIndex == props.chargesIndex){ 
                for (var i = 0; i < childLenght; i++) {
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][TaxCode]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][TaxCode]']`).val())
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][TaxRate]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][TaxRate]']`).val())
                }
            }
        }

        return () => {
        }
      },[props.onChangeTaxCode])

      useEffect(()=> { // onChange Child Currency
         var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
        setTimeout(() => {
            if(childLenght > 0){
                if(props.onChangeCurrency.containerIndex == props.containerIndex && props.onChangeCurrency.chargesIndex == props.chargesIndex){ 
                    for (var i = 0; i < childLenght; i++) {
                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][Currency]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Currency]']`).val())
                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${i}][CurrencyExchangeRate]`,$(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][CurrencyExchangeRate]']`).val())
                    }
                }
            }
        }, 500);

        return () => {
        }
      },[props.onChangeCurrency])

      useEffect(()=> { // onChange Child Bill To Type
         var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
        if(childLenght > 0){

            if(props.onChangeBillToType.containerIndex == props.containerIndex && props.onChangeBillToType.chargesIndex == props.chargesIndex){ 
                fields[0]["NestedChargesItem"][22]["options"] = props.onChangeBillToType.arrayCompanyBranch                
                for (var index = 0; index < childLenght; index++) {
                    var billtotype = $(props.onChangeBillToType.e.target).find("input:hidden").val()
                    var billto = $(props.onChangeBillToType.e.target).parent().next().find("input:hidden").val()
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][CustomerType]`, billtotype)
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][BillTo]`, billto)
                }
            }
        }

        return () => {
        }
      },[props.onChangeBillToType])

      useEffect(()=> { // onChange Child Bill To
         var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
        if(childLenght > 0){
            if(props.onChangeBillTo.containerIndex == props.containerIndex && props.onChangeBillTo.chargesIndex == props.chargesIndex){ 
                for (var index = 0; index < childLenght; index++) {
                    var billto = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][BillTo]']`).val()
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][BillTo]`, billto)
                }
            }
        }

        return () => {
        }
      },[props.onChangeBillTo])

      useEffect(() => {// onChange Container Quantity
        var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
        if(childLenght > 0){    
            if(props.quantity.index == props.containerIndex){ 
                for (var index = 0; index < childLenght; index++) {
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][Qty]`, $(props.quantity.val.target).val())
                }
            }
        }
        return () => {
        }
      }, [props.quantity])

      useEffect(() => {// onChange Charges Quantity
        var childLenght = $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][Area]']`).closest(".insidecharges-item").next().find(".nestedCharges-item").children().length
        if(childLenght > 0){    
            if(props.chargesQuantityOnChange.containerIndex == props.containerIndex && props.chargesQuantityOnChange.chargesIndex == props.chargesIndex){ 
                for (var index = 0; index < childLenght; index++) {
                    setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][Qty]`, $(props.chargesQuantityOnChange.val.target).val())
                }
            }
        }
        return () => {
        }
      }, [props.chargesQuantityOnChange])

      useEffect(() => {
        $.each(props.loadTariffState, function (key, value) {
            if(key == props.containerIndex){
                $.each(value.tariffHasContainerTypeCharges, function (key2, value2) {
                    if(key2 == props.chargesIndex){
                        remove()

                        var tempCharges = nestedChargesColumn
                        $.each(tempCharges, function (key3, value3) {
                            if(value3.columnName == "Charges Code"){
                                tempCharges[key3]["options"] = sortArray(props.combinedChargesOptions[key])
                            }
                            if(value3.columnName == "Qty"){
                                tempCharges[key3]["defaultValue"] = $(`input[name='${props.formName}HasContainerType[${key}][${props.formName}HasCharges][${key2}][Qty]']`).val()
                            }
                        })

                        $.each(value2.tariffHasContainerTypeCharges, function (key3, value3) {

                            var listUOM = [];
                            var ArrayUOM =[];
        
                            var stringuom = value3.chargesCode.UOM;
                            
                            if (stringuom != null) {
                                listUOM = stringuom.split(",");
        
                                try {
                                    $.each(listUOM, function (key4, value4) {
                                        ArrayUOM.push({value:value4,label:value4})
                                    });
                                }
                                catch (err) {
        
                                }
                            }
        
                            $.each(tempCharges, function (key5, value5) {
                                if(value5.columnName == "UOM"){
                                    tempCharges[key5]["options"] = sortArray(ArrayUOM)
                                }
                            })

                            setIndexBeforeAppend(key3)
                            value3["Name"] = `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`;
                            value3["Qty"] = $(`input[name='${props.formName}HasContainerType[${key}][Qty]']`).val();
                            value3["NestedChargesItem"] = tempCharges
                            value3["UnitPrice"] = value3.ReferencePrice
                            value3["Currency"] = value3.CurrencyType
                            append(value3)
                            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][UnitPrice]']`).prop("readonly",true)
                            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][Discount]']`).prop("readonly",true)
                            setTimeout(() =>{
                                ControlOverlay(false)
                                handleCalculate(key3)
                            },100)

                        })
                    }
                })
            }
        })
        return () => {
        }
      }, [props.loadTariffState])  

      useEffect(() => {
        if(props.containerTypeAndChargesData.length > 0){
            setUpdateNestedChargesFillData(props.containerTypeAndChargesData)
        }
        return () => {
        }
      }, [props.containerTypeAndChargesData])    


      useEffect(() => {
        if(props.removeState.length <=0){
   
            $.each(updateNestedChargesFillData, function (key, value) {
                if(key == props.containerIndex){
                    $.each(value[`${props.formName}HasCharges`], function (key2, value2) {
                        if(key2 == props.chargesIndex){
                            remove()
                            var tempCharges = nestedChargesColumn
                            var ChargesOptions = []

                            $.each(value2.SelectNestedCharges, function (key2, value2) {
                                if(value2.portCode){
                                    ChargesOptions.push({value:value2.ChargesUUID,label:value2.ChargesCode +"("+value2.portCode.PortCode+")"})
                                }else{
                                    ChargesOptions.push({value:value2.ChargesUUID,label:value2.ChargesCode})
                                }
                            })
                            $.each(tempCharges, function (key3, value3) {
                                if(value3.columnName == "Charges Code"){
                                    tempCharges[key3]["options"] = sortArray(ChargesOptions)
                                }
                            })

                         
                            $.each(value2.NestedCharges, function (key3, value3) {
                                setIndexBeforeAppend(key3)

                                var stringuom;
                                var listUOM = [];
                                var ArrayUOM =[];
                                var childuom;
                                $.each(value2.SelectNestedCharges, function (key8, value8) {
                                    if (value3.ChargesCode == value8.ChargesUUID) {
                                        stringuom = value8.UOM;
                                    }
                                });

                                if (stringuom != null) {
                                    listUOM = stringuom.split(",");

                                    try {
                                        $.each(listUOM, function (key4, value4) {
                                            if (key4 == 0){
                                                childuom = value
                                            }
                                            ArrayUOM.push({value:value4,label:value4})
                                        });
                                    }
                                    catch (err) {

                                    }
                                }

                                $.each(tempCharges, function (key4, value4) {
                                    if(value4.columnName == "UOM"){
                                        tempCharges[key4]["options"] = sortArray(ArrayUOM)
                                    }
                                    if(value4.columnName == "Charges Code Break Down"){
                                        if(value3.ChargesCodeBreakDown == 1){
                                            tempCharges[key4]["defaultValue"] = 1
                                        }else{
                                            tempCharges[key4]["defaultValue"] = 0
                                        }
                                    }
                                    if(value4.columnName == "Pricing Break Down"){
                                        if(value3.PricingBreakDown == 1){
                                            tempCharges[key4]["defaultValue"] = 1
                                        }else{
                                            tempCharges[key4]["defaultValue"] = 0
                                        }
                                    }
                                })

                                if(value3.billOfLading) {
                                    value3["Vessel"] = value3.billOfLading.VesselCode
                                    value3["Voyage"] = value3.billOfLading.VoyageName
                                    value3["Shipper"] = value3.billOfLadingShipper.CompanyName
                                    value3["Consignee"] = value3.billOfLadingConsignee.CompanyName
                                }
                                else if(value3.bookingConfirmation){
                                    value3["Vessel"] = value3.bookingConfirmation.VesselCode
                                    value3["Voyage"] = value3.bookingConfirmation.VoyageName
                                    value3["Shipper"] = value3.bookingConfirmationShipper.CompanyName
                                    value3["Consignee"] = value3.bookingConfirmationConsignee.CompanyName
                                }


                                value3["Name"] = `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`;
                                value3["NestedChargesItem"] = tempCharges
                           
                                append(value3)
                                
                                setTimeout(() =>{
                                    handleCalculate(key3)
                                    $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][${props.formName}ChargesUUID]']`).closest("tr").find(".ChildChargesDescriptionReadonly").val(value2.ChargesDescription)
                                    if(value3.ChargesCodeBreakDown == 1){
                                        $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][ChargesCodeBreakDown]']`).prev().prop("checked",true)
                                    }
                                    if(value3.PricingBreakDown == 1){
                                        $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][PricingBreakDown]']`).prev().prop("checked",true)
                                    }
                                    setFilledUpdateData(true)
                                    ControlOverlay(false)
                                },100)
                                if(props.formName == "SalesInvoice"){
                                    if(formContext.formState.formType =="Update"){
                                        if(formContext.verificationStatus == "Approved"){
                                            formContext.ApprovedStatusReadOnlyForAllFields()
                                        }else{
                                            formContext.RemoveAllReadOnlyFields()
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
        return () => {
        }
      }, [updateNestedChargesFillData])    

      useEffect(() => {
        if(props.removeState.length <=0){
            if(props.removeStateRerender){
                $.each(props.removeStateRerender, function (key, value) {
                    if(key == props.containerIndex){
                        $.each(value[`${props.formName}HasCharges`], function (key2, value2) {
                            if(key2 == props.chargesIndex){
                                remove()
                                setUpdateNestedChargesFillData([])
                                if($(`input[name='${props.formName}HasContainerType[${key}][Qty]']`).closest("tr").find(".ChargesDisplay").children().hasClass("fa-plus")){
                                    if(!props.barge){
                                        $(`input[name='${props.formName}HasContainerType[${key}][Qty]']`).closest("tr").find(".ChargesDisplay").click()
                                    }
                                }
                                var tempCharges = nestedChargesColumn
                                var ChargesOptions = []
                                $.each(props.combinedChargesOptions[key], function (key2, value2) {
                                    ChargesOptions.push({value:value2.value,label:value2.label})
                                })
                                $.each(tempCharges, function (key3, value3) {
                                    if(value3.columnName == "Charges Code"){
                                        tempCharges[key3]["options"] = sortArray(ChargesOptions)
                                    }
                                })
                                $.each(value2.NestedCharges, function (key3, value3) {
                                    setIndexBeforeAppend(key3)

                                    $.each(tempCharges, function (key4, value4) {
                                        if(value4.columnName == "UOM"){
                                            tempCharges[key4]["options"] = sortArray(value3.uOM)
                                        }
                                        if(value4.columnName == "Charges Code Break Down"){
                                            if(value3.ChargesCodeBreakDown == 1){
                                                tempCharges[key4]["defaultValue"] = 1
                                            }else{
                                                tempCharges[key4]["defaultValue"] = 0
                                            }
                                        }
                                        if(value4.columnName == "Pricing Break Down"){
                                            if(value3.PricingBreakDown == 1){
                                                tempCharges[key4]["defaultValue"] = 1
                                            }else{
                                                tempCharges[key4]["defaultValue"] = 0
                                            }
                                        }
                                        if(value4.columnName == "Bill To Type"){
                                            if(value3.CustomerType){
                                                tempCharges[key4]["defaultValue"] = value3.CustomerType
                                            }
                                        }
                                        if(value4.columnName == "Bill To"){
                                            tempCharges[key4]["options"] = value3.billTo
                                        }
                                    })

                                    value3["Name"] = `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`;
                                    value3["NestedChargesItem"] = tempCharges

                                    append(value3)
                                    
                                    setTimeout(() =>{
                                        handleCalculate(key3)
                                        $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][${props.formName}HasChargesUUID]']`).closest("tr").find(".ChildChargesDescriptionReadonly").val(value2.ChargesDescription)
                                        if(value3.ChargesCodeBreakDown == 1){
                                            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][ChargesCodeBreakDown]']`).prev().prop("checked",true)
                                        }
                                        if(value3.PricingBreakDown == 1){
                                            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][PricingBreakDown]']`).prev().prop("checked",true)
                                        }
                                        setFilledUpdateData(true)
                                        ControlOverlay(false)
                                    },100)
                                    if (props.formName == "BookingReservation"){
                                        if (formContext.formState.formType == "SplitBR"|| formContext.formState.formType == "MergeBR"){
                                            setTimeout(()=>{ // after append
                                                $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][Qty]']`).val(value.Qty)
                                                setValue(`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][Qty]']`,value.Qty)
                                            },500)
                    
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
        return () => {
        }
      }, [props.removeStateRerender])
      
      useEffect(() => {
        var key = props.singleloadTariffState.indexContainer
        if(props.containerIndex == key){
            remove()
            $.each(props.singleloadTariffState.tariffHasContainerTypeCharges, function (key2, value2) {
                if(key2 == props.chargesIndex){
                    remove()

                    var tempCharges = nestedChargesColumn
                    $.each(tempCharges, function (key3, value3) {
                        if(value3.columnName == "Charges Code"){
                            tempCharges[key3]["options"] = sortArray(props.combinedChargesOptions[key])
                        }
                        if(value3.columnName == "Qty"){
                            tempCharges[key3]["defaultValue"] = $(`input[name='${props.formName}HasContainerType[${key}][${props.formName}HasCharges][${key2}][Qty]']`).val()
                        }
                    })
                 
                    $.each(value2.tariffHasContainerTypeCharges, function (key3, value3) {
                        setIndexBeforeAppend(key3)
                        value3["Name"] = `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][NestedCharges]`;
                        value3["Qty"] = $(`input[name='${props.formName}HasContainerType[${key}][Qty]']`).val();
                        value3["NestedChargesItem"] = tempCharges
                        value3["UnitPrice"] = value3.ReferencePrice
                        value3["Currency"] = value3.CurrencyType
                        append(value3)
                        $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][UnitPrice]']`).prop("readonly",true)
                        $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${props.chargesIndex}][Discount]']`).prop("readonly",true)
                        setTimeout(() =>{
                            ControlOverlay(false)
                            handleCalculate(key3)
                        },100)

                    })
                }
            })
        }

        // append({ "Name": `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges]`,"Qty":1, "CustomerType":"Bill To", ChargesOption:props.combinedChargesOptions[key], "ChargesItem": tempCharges})

    }, [props.singleloadTariffState])

    
    useEffect(() => {
        if(props.chargesDiscriptions){
            $.each(props.chargesDiscriptions.data, function (key, value) {
                if(props.containerIndex == key){
                    $.each(value.BookingConfirmationCharges, function (key2, value2) {
                        if(props.chargesIndex == key2){
                            if(value2){
                                if(value2.BookingConfirmationNestedCharges){
                                    $.each(value2.BookingConfirmationNestedCharges, function (key3, value3) {
                                        setTimeout(()=>{
                                            $(`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][${props.formName}ChargesUUID]']`).closest("tr").find(".ChildChargesDescriptionReadonly").val(value3.ChargesDescription)
                                            setValue(`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][NestedCharges][${key3}][ChargesDescription]']`,value3.ChargesDescription)
                                        },50)
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }
    }, [props.chargesDiscriptions])

    useEffect(() => {
        if(formContext.formState.formType == "New" &&  formContext.formState.formNewClicked == true){
            // remove()
            if(!props.transferPartial){
                setUpdateNestedChargesFillData([])
            }       
        }
    }, [formContext.formState])


    useEffect(() => {
        if(calculateIndex!==""){
            handleCalculate(calculateIndex)
            setCalculateIndex("")
        }
    }, [calculateIndex])
      
  return (
    <>
        <td colSpan="28">
            <div className=" p-3">
                <div className="NestedCharges-repeater ml-2">
                    <div className="btn-group float-left mb-2 columnchooserdropdown columnchooserdropdownnestedcharges">
                        <button type="button" className="btn btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-th-list" data-toggle="tooltip" data-placement="top" title="Column Chooser"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-left scrollable-columnchooser dragtablecolumnchoosercharges">
                            {nestedChargesColumn.map((item, index) => {
                                return (                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                    <label key={index} className="dropdown-item dropdown-item-marker">
                                        {item.defaultChecked ? <input type="checkbox" className="columnchooserdropdownnestedcharges keep-enabled" defaultChecked /> : <input type="checkbox" className="columnchooserdropdownnestedcharges keep-enabled" />}
                                        {item.columnName}
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                    <div className="table_wrap">
                        <div className="table_wrap_inner">
                            <table className="table table-bordered Charges nestedcharges-items">
                                <thead>
                                    <tr>
                                        {fields.length > 0 ? fields[0].NestedChargesItem.map((item, index) => {
                                            return (
                                                <th key={item.id} className={item.class}>{item.columnName}</th>
                                            )

                                        }) : nestedChargesColumn.map((item, index) => {
                                            return (
                                                <th key={item.id} className={item.class}>{item.columnName}</th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody className='Charges nestedCharges-item'>
                                    {fields.map((item, index) => {
                                        return(
                                            <>
                                                <tr key={item.id} className='insidenestedcharges-item'>
                                                    {item.NestedChargesItem.map((item2,index2) => {
                                                        if (item2.inputType == "input") {
                                                            return (
                                                                <td className={item2.class}>
                                                                    <input defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} onBlur={(val) => {val ? item2.onBlur(val,index) : item2.onBlur(null,index)}} />
                                                                </td>
    
                                                            )
                                                        }

                                                        if (item2.inputType == "number") {
                                                            return (
                                                                <td className={item2.class}>
                                                                    <input type="number" defaultValue={item2.defaultValue?item2.defaultValue:""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                </td>
    
                                                            )
                                                        }

                                                        if (item2.inputType == "checkbox") {
                                                            return (
                                                                <td className={item2.class} style={{ textAlign:"center", verticalAlign:"middle"}}>
                                                                    <input type={"checkbox"} defaultValue={item2.defaultValue==1?"1":"0"} className={`mt-2 ${item2.fieldClass ? item2.fieldClass : ""}`} disabled onChange={CheckBoxHandle}></input>
                                                                    <input type={"hidden"} defaultValue={item2.defaultValue==1?"1":"0"} className="" {...register(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)}/>
                                                                </td>
                                                            )
                                                        }

                                                        if (item2.inputType == "single-select") {
                                                            if (index2 == 0) {
                                                                return (
                                                                    <td className={item2.class}>
                                                                        <input type="hidden" id="" {...register(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${props.formName}ChargesUUID]`)}></input>
                                                                        <div className="row">

                                                                        {!props.transferPartial && 
                                                                            <div className="dropdown float-left ml-1 dropdownbar">
                                                                            <button style={{position:"relative", left:"2px", top:"1px"}} className="btn btn-xs btn-secondary dropdown-toggle float-right" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                <i className="fa fa-ellipsis-v" data-hover="tooltip" data-placement="top" title="Options"></i></button>
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                <button data-repeater-delete className="dropdown-item RemoveNestedCharges" type="button" onClick={() => handleRemoveNestedCharges(index)}>Remove</button>
                                                                            </div>
                                                                        </div>
                                                                        }
                                                                            
                                                                            <div className="col-md-10" style={{paddingLeft:"10px", paddingRight:"0px"}}>
                                                                                <Controller
                                                                                    name={(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)}
                                                                                    control={control}
                                                                                    render={({ field: { onChange, value } }) => (
                                                                                        <Select
                                                                                            isClearable={true}
                                                                                            {...register(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)}
                                                                                            value={value ? item2.options.find(c => c.value === value) : null}
                                                                                            onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange(val, index); }}
                                                                                            options={item2.options}
                                                                                            isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                                            menuPortalTarget={document.body}
                                                                                            onKeyDown={handleKeydown}
                                                                                            onMenuOpen={() => { handleOpenMenu(item2.name, item2.options, props.containerIndex, props.chargesIndex, index) }}
                                                                                            className={`basic-single ${item2.fieldClass ? item2.fieldClass : ""} `}
                                                                                            classNamePrefix="select"
                                                                                            styles={props.globalContext.customStyles}
    
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                )
                                                            }
                                                            else {
                                                                return (
                                                                    <td className={item2.class}>
                                                                        <Controller
                                                                            name={(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)}

                                                                            control={control}

                                                                            render={({ field: { onChange, value } }) => (
                                                                                <Select
                                                                                    isClearable={true}
                                                                                    {...register(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)}
                                                                                    value={value ? item2.options ? item2.options.find(c => c.value === value) : null : null}
                                                                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange(val,index)}}
                                                                                    options={item2.options}
                                                                                    menuPortalTarget={document.body}
                                                                                    isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                                    className={`basic-single ${item2.fieldClass ? item2.fieldClass : ""} ${item2.readOnly == true?"readOnlySelect":""}`}
                                                                                    classNamePrefix="select"
                                                                                    onKeyDown={handleKeydown}
                                                                                    styles={props.globalContext.customStyles}
                                                                                />
                                                                            )}
                                                                        />
                                                                        {item2.columnName == "UOM" || item2.columnName == "Bill To"? 
                                                                            <input type="hidden" id="select-options" value={JSON.stringify(item2.options)} /> : ""
                                                                        }
                                                                    </td>
                                                                )
                                                            }
                                                        }
                                                        if(item2.inputType == "select-withCurrencyModal"){
                                                            return (
                                                                <td className={item2.class}>
                                                                    <div class="input-group">
                                                                        <div className="row">
                                                                            <Controller
                                                                                name={(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][${item2.name}]`)}

                                                                                control={control}

                                                                                render={({ field: { onChange, value } }) => (
                                                                                    <Select
                                                                                        isClearable={true}
                                                                                        {...register(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`)}
                                                                                        value={value ? item2.options.find(c => c.value === value) : null}
                                                                                        onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange(val,index)}}
                                                                                        options={item2.options}
                                                                                        menuPortalTarget={document.body}
                                                                                        isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                                        className={`basic-single ${item2.fieldClass ? item2.fieldClass : ""}`}
                                                                                        classNamePrefix="select"
                                                                                        onKeyDown={handleKeydown}
                                                                                        styles={props.globalContext.customStyles}
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            )
                                                        }

                                                        if (item2.inputType == "input-Modal") {
                                                            return(
                                                                <td className={item2.class}>
                                                                    <input type="text" className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} onClick={props.openTextAreaModal} style={{cursor:"pointer"}} readOnly={item2.readOnly ? item2.readOnly : false} />
                                                                    <div className="modal fade">
                                                                        <div className="modal-dialog">
                                                                            <div className="modal-content">

                                                                                <div className="modal-header">
                                                                                    <h4 className="modal-title">{item2.columnName}</h4>
                                                                                    <button type="button" className="close" data-dismiss="modal">×</button>
                                                                                </div>

                                                                                <div className="modal-body">
                                                                                    <div className="form-group">

                                                                                        <textarea id="" className={`form-control ${item2.modelClass}`} readOnly={item2.readOnly ? item2.readOnly : false} {...register((`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${props.chargesIndex}][NestedCharges][${index}][${item2.name}]`))} rows="5" placeholder={`Enter ${item2.columnName}`}></textarea>


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
                                                    })}
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
        </td>
    </>
  )
}

export default NestedTableNestedChargesINV