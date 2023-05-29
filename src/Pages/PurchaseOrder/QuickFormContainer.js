import React, { useState, useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { CheckBoxHandle, GetUpdateData, CreateData, createCookie, GetChargesById, getCookie, GetTaxCodeById, GetBCChargesDescrption, getCurrencyRate, sortArray, GetBookingReservationContainerQty, ImportContainerCRO, GetCompaniesData, getCompanyDataByID, GetBranchData, getUNNumberByID, getHSCodeByID, getContainers, getChargesByContainerTypeAndPortCode, getContainerTypeById } from '../../Components/Helper.js'
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
    const [totalDiscount, setTotalDiscount] = useState("")
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
    function handleChangeChargesCode(val, index) {

        if (val) {
            GetChargesById(val.value, globalContext).then(res => {
                var arrayUOM = res.data.UOM.split(",");
                var newArray = arrayUOM.map(function (value) {
                    return { label: value, value: value };
                });
                setValue(`PurchaseOrderHasCharges[${index}][UOM]`, arrayUOM[0])
                setValue(`PurchaseOrderHasCharges[${index}][ChargesName]`, res.data.ChargesName)
                setValue(`PurchaseOrderHasCharges[${index}][UnitPrice]`, res.data.ReferencePrice)

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

    function handleChangeCurrency(val, index){ 
        var containerIndex = props.containerIndex
        var chargesIndex = index
        // setOnChangeCurrency({val,containerIndex,chargesIndex})
        if(val){
            var filters = {
                "FromCurrency": val.value,
                "CurrencyRate.Valid": 1
            };
            var newData=[]
            getCurrencyRate(filters,globalContext).then(data => {   
                $.each(data.data, function (key2, value2) {
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
                    if($(`input[name='PurchaseOrder[Currency]']`).val()==val.value){
                        setValue(`PurchaseOrderHasCharges][${index}][CurrencyExchangeRate]`,parseFloat("1").toFixed(4))
                    }
                    else{
                        setValue(`PurchaseOrderHasCharges][${index}][CurrencyExchangeRate]`,parseFloat(newData[0]["Rate"]).toFixed(4))
    
                    }
                    $(`input[name='PurchaseOrderHasCharges][${index}][CurrencyExchangeRate]']`).trigger("change")
                }
                else{
                    if($(`input[name='PurchaseOrder[Currency]']`).val()==val.value){
                        // closestRate.val(parseFloat("1").toFixed(4)).trigger('change')
                        setValue(`PurchaseOrderHasCharges][${index}][CurrencyExchangeRate]`,parseFloat("1").toFixed(4   ))
                    }
                    else{
                        var resultCurrency = (newData).filter(function (oneArray) {
                            return oneArray.toCurrency.CurrencyTypeUUID==$(`input[name='PurchaseOrder[Currency]']`).val()
                        });
    
                       if(resultCurrency.length!=0){
                            setValue(`PurchaseOrderHasCharges][${index}][CurrencyExchangeRate]`,parseFloat(resultCurrency[0]["Rate"]).toFixed(4))
                       }
                       else{
                           setValue(`PurchaseOrderHasCharges][${index}][CurrencyExchangeRate]`,"")
                       }
                       $(`input[name='PurchaseOrderHasCharges][${index}][CurrencyExchangeRate]']`).trigger("change")
                    }
                   
                }
    
            })
            setCalculateIndex(chargesIndex)
        }

    }

    function handleChangeTaxCode(val, index) {

        if (val) {
            GetTaxCodeById(val.value, globalContext).then(res => {

                // var arrayUOM = res.data.UOM.split(",");


                setValue(`PurchaseOrderHasCharges[${index}][TaxRate]`, res.data.TaxRate ? parseFloat(res.data.TaxRate).toFixed(2) : "")
                //     setValue(`PurchaseOrderHasCharges[${index}][ChargesName]`, res.data.ChargesName)
                //     setValue(`PurchaseOrderHasCharges[${index}][UnitPrice]`, res.data.ReferencePrice)
                handleCalculate(index)
                //fields[index]["ContainerItem"][11]["options"]=UOMArray

            })
        }

    }

    function handleCalChargesGetIndexAndSetState(val, index) {
        setCalculateIndex(index)
    }


    function handleCalculate(index) {
        var qty = getValues(`PurchaseOrderHasCharges[${index}][Qty]`)
        var unitPrice = getValues(`PurchaseOrderHasCharges[${index}][UnitPrice]`)
        var currency = getValues(`PurchaseOrderHasCharges[${index}][Currency]`)
        var currencyRate = getValues(`PurchaseOrderHasCharges[${index}][CurrencyExchangeRate]`)

        if (qty == "") {
            qty = 0
        }
        if (unitPrice == "") {
            unitPrice = 0.00
        }
        var TotalAmount = (parseFloat(qty) * parseFloat(unitPrice)).toFixed(2)
        
        var unitDiscount = getValues(`PurchaseOrderHasCharges[${index}][Discount]`)

        if(unitDiscount){
            
            if (unitDiscount.includes("%")){
                var Discount = unitDiscount.replace("%", "");
                Discount = parseFloat(Discount) / 100;
                unitDiscount = parseFloat(Discount)
                
                var unitTotalDiscount = (unitPrice * unitDiscount).toFixed(2)
                setValue(`PurchaseOrderHasCharges[${index}][Discount]`,parseFloat(unitTotalDiscount).toFixed(2))
                
                if(unitTotalDiscount){
                    TotalAmount = (parseFloat(qty) * (parseFloat(unitPrice) - parseFloat(unitTotalDiscount))).toFixed(2)
                    
                }
            }else{
                setValue(`PurchaseOrderHasCharges[${index}][Discount]`,parseFloat(unitDiscount).toFixed(2))
                TotalAmount = (parseFloat(qty) * (parseFloat(unitPrice) - parseFloat(unitDiscount))).toFixed(2)
            }
        }
        setValue(`PurchaseOrderHasCharges[${index}][Amount]`, TotalAmount)
        setValue(`PurchaseOrderHasCharges[${index}][TotalAmount]`, TotalAmount)


        var TotalTax
        var SubTotalLocal
        var SubTotal

        var taxRate = getValues(`PurchaseOrderHasCharges[${index}][TaxRate]`)
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
            setValue(`PurchaseOrderHasCharges[${index}][TaxAmount]`, TotalTax)
            // setTotalDiscount(unitTotalDiscount)
        }
        else {
            SubTotalLocal = (parseFloat(TotalAmount)).toFixed(2)
            SubTotal = (parseFloat(TotalAmount)).toFixed(2)
            setValue(`PurchaseOrderHasCharges[${index}][TaxAmount]`, "0.00")
        }

        // if (currencyRate) {
        //     SubTotal = (parseFloat(SubTotalLocal) * parseFloat(currencyRate)).toFixed(2)
        // } else {
        //     SubTotal = (parseFloat(SubTotalLocal)).toFixed(2)
        // }

        setValue(`PurchaseOrderHasCharges[${index}][TotalTax]`, TotalTax)
        setValue(`PurchaseOrderHasCharges[${index}][SubTotal]`, SubTotal)
        setValue(`PurchaseOrderHasCharges[${index}][SubTotalLocal]`, SubTotalLocal)

        if (currency !== $("input[name='PurchaseOrder[Currency]']").val()) {
            if (currencyRate !== "") {
                var foreigncurrency = 1;
                var subtotallocalexchange = (parseFloat(SubTotalLocal) * parseFloat(currencyRate)).toFixed(2);

                setValue(`PurchaseOrderHasCharges[${index}][SubTotalLocal]`, subtotallocalexchange)
            }
        }
        else {
            setValue(`PurchaseOrderHasCharges[${index}][SubTotalLocal]`, SubTotalLocal)
        }

        //calculate Total Discount
        var FinalTotalDiscount = 0
        $.each($(".unitdisc"), function (key, value){
            var qtyForTotalDisc = getValues(`PurchaseOrderHasCharges[${key}][Qty]`)
            if(!qtyForTotalDisc){
                qtyForTotalDisc=0
            }
            var unitPriceForTotalDisc = getValues(`PurchaseOrderHasCharges[${key}][UnitPrice]`)
            if(!unitPriceForTotalDisc){
                unitPriceForTotalDisc = 0.00
            }
            var totalAmountForTotalDisc = getValues(`PurchaseOrderHasCharges[${key}][Amount]`)
            if(!totalAmountForTotalDisc){
                totalAmountForTotalDisc = 0.00
            }
            var  OriTotalAmount= (parseFloat(qtyForTotalDisc) * parseFloat(unitPriceForTotalDisc)).toFixed(2)

            var tempTotalDiscount = (parseFloat(OriTotalAmount) - parseFloat(totalAmountForTotalDisc) ).toFixed(2)
            FinalTotalDiscount += parseFloat(tempTotalDiscount)
        })

        //Calculate Total Tax
        var FinalTotalTax = 0
        $.each($(".taxamount"), function (key, value) {
            var tempTotalTax = getValues(`PurchaseOrderHasCharges[${key}][TaxAmount]`)
            var tempCurrency = getValues(`PurchaseOrderHasCharges[${key}][Currency]`)
            var tempCurrencyRate = getValues(`PurchaseOrderHasCharges[${index}][CurrencyExchangeRate]`)

            if (tempCurrency !== $("input[name='PurchaseOrder[Currency]']").val()) {
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
        $.each($(".SubTotalLocal"), function (key, value) {
            var tempSubTotal = getValues(`PurchaseOrderHasCharges[${key}][SubTotalLocal]`)
            if (tempSubTotal) {
                FinalSubTotal += parseFloat(tempSubTotal)
            }
        })

        const TotalDiscountTwoDecimal = FinalTotalDiscount.toFixed(2)
        const TotalTaxTwoDecimal = FinalTotalTax.toFixed(2)
        const TotalAmountTwoDecimal = FinalSubTotal.toFixed(2)
        setTotalDiscount({ TotalDiscountTwoDecimal, index })
        setTotalTax({ TotalTaxTwoDecimal, index })
        setTotalAmount({ TotalAmountTwoDecimal, index })
    }

    function handleOnChangeTaxCode(val,index){

        GetTaxCodeById(val.value,globalContext).then(res => {
            var taxRate = res.data.TaxRate
            setValue(`PurchaseOrderHasCharges[${index}][TaxRate]`, (parseFloat(taxRate)).toFixed(2))
            handleCalculate(index)
        })

    }

    function getContainerCodeByContainerType(val,index){
        if(val){
            $(`input[name='PurchaseOrderHasCharges[${index}][ContainerType]']`).parent().trigger("change")
           
        }
    }

    $(".containerType").off("change").on("change", function(){
        setTimeout(()=>{
            var containerType = $(this).children().last().val()
            var index = $(this).closest(".container-items").index()
            var optionContainerList =[]
            var filters = {
                "Container.ContainerType": containerType,
                "Container.Status": "Available"
            };
            getContainers(containerType,filters,globalContext).then(data => {
                try {
                    $.each(data, function (key, value) {
    
                        optionContainerList.push({value:value.ContainerUUID, label:value.ContainerCode})
    
                    });
                }
                catch (err) {
    
                }

                optionContainerList =sortArray(optionContainerList)
                fields[index]["ContainerItem"][21]["options"] = optionContainerList
                update(fields)
            })
        },100)
    })

    var ContainerColumn = [
        { columnName: "Particulars Code", inputType: "input", defaultChecked: true, name: "ParticularCode", fieldClass: "ParticularCode", class: "", onChange: "" },
        { columnName: "Particulars Name", inputType: "input", defaultChecked: false, name: "ParticularName", fieldClass: "ParticularName", class: "", onChange: "" },
        { columnName: "Account Code", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
        { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "cal qty", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
        { columnName: "UOM", inputType: "input", defaultChecked: false, name: "UOM", fieldClass: "UOM", class: "", onChange: "" },
        { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", fieldClass: "cal unitprice inputDecimalTwoPlaces", class: "", onChange: "",onBlur: handleCalChargesGetIndexAndSetState },
        { columnName: "Unit Discount", inputType: "input", defaultChecked: false, name: "Discount", fieldClass: "cal unitdisc", class: "", onBlur: handleCalChargesGetIndexAndSetState },
        { columnName: "Currency", inputType: "single-select", defaultChecked: false, name: "Currency", class: "d-none", options:props.currency, fieldClass:"currency calCharges", onChange:handleChangeCurrency },
        { columnName: "Currency Exchange Rate", inputType: "input", defaultChecked: false, name: "CurrencyExchangeRate", class: "d-none",fieldClass:"cal exchangerate inputDecimalTwoPlaces", onBlur:handleCalChargesGetIndexAndSetState},
        { columnName: "Amount", inputType: "input", defaultChecked: false, name: "Amount", class: "d-none", fieldClass: "cal localamount inputDecimalTwoPlaces", onBlur:"" },
        { columnName: "Tax Code", inputType: "single-select", defaultChecked: false, name: "TaxCode", fieldClass: "TaxCode taxcode", options: props.taxCode, class: "", onChange: handleOnChangeTaxCode },
        { columnName: "Tax Rate", inputType: "input", defaultChecked: false, name: "TaxRate", fieldClass: "TaxRate cal taxrate", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
        { columnName: "Tax Amount", inputType: "input", defaultChecked: false, name: "TaxAmount", fieldClass: "cal taxamount inputDecimalTwoPlaces", class: "", onChange: "", onBlur: handleCalChargesGetIndexAndSetState },
        { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", fieldClass: "SubTotal cal subtotal inputDecimalTwoPlaces", class: "", onChange: "" },
        { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: false, name: "SubTotalLocal", fieldClass: "SubTotalLocal cal subtotallocal inputDecimalTwoPlaces", class: "", onChange: "" },
        { columnName: "QT No.", inputType: "single-select", defaultChecked: false, name: "Quotation", class: "", fieldClass:"", options: props.QTOption, onChange:"" },
        { columnName: "BC No.", inputType: "single-select", defaultChecked: true, name: "BookingConfirmation", class: "", fieldClass:"", options: props.BCOption, onChange:"" },
        { columnName: "INV No.", inputType: "single-select", defaultChecked: false, name: "SalesInvoice", class: "", fieldClass:"", options: props.INVOption, onChange:"" },
        { columnName: "BL No.", inputType: "single-select", defaultChecked: false, name: "BillOfLading", class: "", fieldClass:"", options: props.BLOption, onChange:"" },
        { columnName: "OR No.", inputType: "single-select", defaultChecked: false, name: "ORNo", class: "", fieldClass:"", options: props.OROption, onChange:"" },
        { columnName: "Container Type", inputType: "single-select", defaultChecked: false, name: "ContainerType", fieldClass: "containerType", options: props.containerType, class: "", onChange: getContainerCodeByContainerType },
        { columnName: "Container Code", inputType: "single-select", defaultChecked: false, name: "ContainerCode", fieldClass: "ContainerCode", options: [], class: "", onChange: "" },
        { columnName: "Container Qty", inputType: "input", defaultChecked: false, name: "ContainerQty", fieldClass:"ContainerQty", class: "", onChange: "" },
        { columnName: "Owner", inputType: "input", defaultChecked: false, name: "Owner", fieldClass: "Owner", class: "", onChange: "" },
        { columnName: "DGClass", inputType: "input", defaultChecked: false, name: "DGClass", fieldClass: "DGClass", class: "", onChange: "" },

    ]


    if (getCookie('purchaseordercolumn')) {
        var getCookieArray = getCookie('purchaseordercolumn');
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
            if(formName != "PurchaseOrder"){
                GetBCChargesDescrption(AllChargesArray, globalContext).then(res => {
    
                    $(".container-items").each(function (key, value) {
                        var chargesdiscription = res.data[key].BookingConfirmationHasCharges? res.data[key].BookingConfirmationHasCharges.ChargesDescription:""
                        setValue(`PurchaseOrderHasCharges[${key}][ChargesDescription]`, chargesdiscription)
                        $(this).find(".ChargesDescriptionReadonly").val(chargesdiscription)
    
                        //$(value).find(".ChargesDescription").val(chargesdiscription).trigger("change")
    
                    });
                })
            }
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
            appendContainerHandle()
        }  

        if(formContext.formState.formResetClicked){
            remove()
            appendContainerHandle()
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

                value.Name = `${formName}HasCharges`;
                value.ContainerItem = ContainerColumn
                value.ContainerTypeOptions = props.containerType
                if (value.ContainerCode) {
                    value.ContainerItem[4].options = [{ value: value.ContainerCode, label: value.containerCode.ContainerCode }]
                }

                value.TaxRate = value.TaxRate ? parseFloat(value.TaxRate).toFixed(2) : ""
                value.TaxAmount = value.TaxRate ? parseFloat(value.TaxAmount).toFixed(2) : ""
                value.Amount = value.TaxRate ? parseFloat(value.Amount).toFixed(2) : ""
                value.SubTotal = value.SubTotal ? parseFloat(value.SubTotal).toFixed(2) : ""
                value.SubTotalLocal = value.SubTotalLocal ? parseFloat(value.SubTotalLocal).toFixed(2) : ""
                value.CurrencyExchangeRate = value.CurrencyExchangeRate ? parseFloat(value.CurrencyExchangeRate).toFixed(2) : ""

                value.CargoRate = value.CargoRate ? parseFloat(value.CargoRate).toFixed(2) : ""
                value.UnitPrice = value.UnitPrice ? parseFloat(value.UnitPrice).toFixed(2) : ""
                var optionContainerList =[]
                var filters = {
                    "Container.ContainerType": value.ContainerType,
                    "Container.Status": "Available"
                };
                getContainers(value.ContainerType,filters,globalContext).then(data => {
                    try {
                        $.each(data, function (key, value) {
        
                            optionContainerList.push({value:value.ContainerUUID, label:value.ContainerCode})
        
                        });
                    }
                    catch (err) {
                    
                    }
                    value["ContainerItem"][21]["options"] = optionContainerList
                })
                arrayDynamic.push(value);

                setTimeout(()=>{
                    append(arrayDynamic)
                },500)

            })
            GetChargesDescription(AllChargesArray)

        }
        return () => {

        }
    }, [props.containerData])

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
            PurchaseOrderHasCharges: [{ "Name": `${formName}HasCharges`, "Qty": 1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType }]
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
        name: `${formName}HasCharges`
    });







    //set Default for First Came in
    useEffect(() => {
        setValue(`${formName}HasCharges[0]["ContainerTypeOptions"]`, props.containerType)
        update(fields)
    }, [props])

    function appendContainerHandle() {
        append({ "Name": `${formName}HasCharges`, "Qty": 1,"SeqNum":1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType })
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

            if (fields[0].Name == `${formName}HasCharges`) {

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
                setValue(`PurchaseOrderHasCharges[${key}][SeqNum]`, key)
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
                                                                                            <input defaultValue='' {...register(`${formName}HasCharges` + '[' + index + ']' + '[PurchaseOrderHasChargesUUID]')} className={`form-control d-none`} />
                                                                                            <input defaultValue='' {...register(`${formName}HasCharges` + '[' + index + ']' + '[PurchaseOrderHasContainerType]')} className={`form-control d-none`} />
                                                                                            <input defaultValue='' {...register(`${formName}HasCharges` + '[' + index + ']' + '[BookingConfirmation]')} className={`form-control d-none`} />
                                                                                            <div className="row">

                                                                                                <div className="col-md-2">
                                                                                                    <div className="row">

                                                                                                        <div>
                                                                                                            <div className="dropdownbar  float-right ml-2 mr-2">
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
                                                                                                <div className="col-md-10">

                                                                                                    {item2.requiredField ?
                                                                                                        <input readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasCharges`] ? errors[`${formName}HasCharges`][`${index}`] ? errors[`${formName}HasCharges`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                                        :
                                                                                                        <input readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                                                    }

                                                                                                </div>

                                                                                            </div>


                                                                                        </td>

                                                                                    )

                                                                                } else {
                                                                                    return (
                                                                                        <td className={item2.class}>
                                                                                       
                                                                                            {item2.requiredField ?
                                                                                                <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })}
                                                                                                    className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasCharges`] ? errors[`${formName}HasCharges`][`${index}`] ? errors[`${formName}HasCharges`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} onBlur={  item2.onBlur? (val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index) }:null} />
                                                                                                :
                                                                                                <input defaultValue={item2.defaultValue ? item2.defaultValue : ""} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} onBlur={  item2.onBlur? (val) => { val ? item2.onBlur(val, index) : item2.onBlur(null, index)}:null} />
                                                                                            }

                                                                                        </td>

                                                                                    )
                                                                                }

                                                                            }

                                                                            if (item2.inputType == "number") {
                                                                                return (
                                                                                    <td className={item2.class}>
                                                                                        {item2.requiredField ?
                                                                                            <input type="number" defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasCharges`] ? errors[`${formName}HasCharges`][`${index}`] ? errors[`${formName}HasCharges`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                            :
                                                                                            <input type="number" defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                                        }

                                                                                    </td>

                                                                                )
                                                                            }
                                                                            if (item2.inputType == "number-withModal") {
                                                                                return (
                                                                                    <td className={item2.class}>
                                                                                        <div className="input-group">
                                                                                            {item2.requiredField ?
                                                                                                <input type="number" defaultValue={item2.defaultValue} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasCharges`] ? errors[`${formName}HasCharges`][`${index}`] ? errors[`${formName}HasCharges`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                                :
                                                                                                <input type="number" defaultValue={item2.defaultValue} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                                            }
                                                                                            <div className="input-group-append" style={{ cursor: "pointer" }} onClick={() => ShareContainerModel({ formName, index, fields, getValues, setValue, update, globalContext })}>
                                                                                                <span className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></span>
                                                                                            </div>
                                                                                        </div>
                                                                                        {/* <div className="SelectContainerCodeField d-none">
                                                                                <Controller
                                                                                    name={(`${formName}HasCharges` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                    control={control}
                                                                                    render={({ field: { onChange, value } }) => (
                                                                                        <Select
                                                                                            isClearable={true}
                                                                                            isMulti
                                                                                            {...register(`${formName}HasCharges` + '[' + index + ']' + '[ContainerCode][]')}
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
                                                                                        <input type={"input"} defaultValue='0' className="d-none" {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')} />
                                                                                    </td>
                                                                                )
                                                                            }

                                                                            if (item2.inputType == "single-select") {
                                                                                return (
                                                                                    <td className={item2.class}>


                                                                                        <Controller
                                                                                            name={(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')}

                                                                                            control={control}
                                                                                            defaultValue={item2.defaultValue ? item2.defaultValue : ""}
                                                                                            render={({ field: { onChange, value } }) => (
                                                                                                <Select
                                                                                                    isClearable={true}
                                                                                                    {...register(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')}
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
                                                                                            name={(`${formName}HasCharges` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                            control={control}
                                                                                            render={({ field: { onChange, value } }) => (
                                                                                                <Select
                                                                                                    isClearable={true}
                                                                                                    isMulti
                                                                                                    {...register(`${formName}HasCharges` + '[' + index + ']' + '[ContainerCode][]')}
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
                                                                                            name={(`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']')}
                                                                                            control={control}
                                                                                            render={({ field: { onChange, value } }) => (
                                                                                                <AsyncSelect
                                                                                                    isClearable={true}
                                                                                                    {...register((`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']'))}
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

                                                                                                            <textarea id="" className={`form-control ${item2.modelClass}`}  {...register((`${formName}HasCharges` + '[' + index + ']' + '[' + item2.name + ']'))} rows="5" placeholder={`Enter ${item2.columnName}`}></textarea>


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
            <QuickFormTotalCard props={props} totalDiscount={totalDiscount} totalTax={totalTax} totalAmount={totalAmount} />
        </>
    )
}

export default QuickFormContainer