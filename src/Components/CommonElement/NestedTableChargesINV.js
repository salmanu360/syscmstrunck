import React, {useContext, useEffect, useState} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { CheckBoxHandle, GetUpdateData, CreateData, createCookie, getCookie, sortArray, getAreaById,getPortDetails,GetCompaniesData,getCompanyDataByID,GetBranchData, getUNNumberByID, getHSCodeByID, getContainers, GetTaxCodeById, GetChargesById, getCurrencyRate,GetCompanyBranches} from '../../Components/Helper.js'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $, { each } from "jquery";
import axios from "axios"
import NestedTableNestedChargesINV from "./NestedTableNestedChargesINV";

function NestedTableChargesINV(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    const formNameLowerCase = props.formName.toLowerCase()
    const [indexBeforeAppend, setIndexBeforeAppend] = useState("")
    const [count, setCount] = useState(0)
    const [calculateIndex, setCalculateIndex] = useState("")
    const [chargesQuantityOnChange, setChargesQuantityOnChange] = useState([])
    const [onChangePortCode, setOnChangePortCode] = useState([])
    const [onChangeChargesDescription, setOnChangeChargesDescription] = useState([])
    const [onChangeFreightTerm, setOnChangeFreightTerm] = useState([])
    const [onChangeTaxCode, setOnChangeTaxCode] = useState([])
    const [onChangeCurrency, setOnChangeCurrency] = useState([])
    const [onChangeBillToType, setOnChangeBillToType] = useState([])
    const [onChangeBillTo, setOnChangeBillTo] = useState([])
    const [appendNestedCharges, setAppendNestedCharges] = useState({append:false,index:0})
    const [updateChargesFillData, setUpdateChargesFillData] = useState([])
    const [FilledUpdateData, setFilledUpdateData] = useState(false)

    var countForBlock = 0
    const { register, handleSubmit, setValue, trigger, getValues, reset, control, watch, formState: { errors } } = useForm({
        mode: "onChange",
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
        name: `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges]`
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

    function handleOpenMenu(name, options, containerIndex, index) {
      
        if (name == "UOM") {
            var newArray = []

            //disabled option that already selected
            $.each(options, function (key, value) {
                value.selected = true
            })

            var ArrayUOM = $(".chargesTable").eq(containerIndex).find('tbody').children().eq(index).find(".ArrayUOM").val()

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

        if (name == "ChargesCode") {
            var newArray = []
            var previosOption = []
            var ChoosenArray=[]
            // var selectedIdA = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesCode]`)
            var selectedIdA = getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}Charges][${index}][ChargesCode]`)
            //disabled option that already selected
            $.each(options, function (key, value) {
                value.selected = false
            })

            $(".ChargesTable").eq(containerIndex).find(".ChargesCode").find(".select__single-value").each(function (key, value) {
               
                if ($(value).text() !== "") {
                    if(getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}Charges][${key}][ParentCharges]`)!==null){
                        newArray.push($(value).text())
                    }
                }
                    ChoosenArray.push({label:$(value).text(),value:getValues(`${props.formName}HasContainerType[${containerIndex}][${props.formName}Charges][${key}][ChargesCode]`)})
            })

            $.each(options, function (key, value) {
                $.each(ChoosenArray, function (key2, value2) {
                    if (value2.label == value.label) {
                        value.selected = true
                    }
                })
            })
              $.each(options, function (key, value) {
                if(value.label==$(".chargesTable").eq(containerIndex).find(".ChargesCode").find(".select__single-value").text()){
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

            $(".chargesTable").eq(containerIndex).find(".ChargesCode").find(":hidden").each(function (key, value) {

                if ($(value).val() !== "") {
                    newArray.push($(value).val())
                }
            })

            $(".chargesTable").eq(containerIndex).find(".ChargesCode").each(function (key, value) {
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
       $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][ChargesCode]`).parent().trigger("change")
    }
        
    function handleChangeFreightTerm(val,index){
        var containerIndex = props.containerIndex
        var chargesIndex = index
        setOnChangeFreightTerm({val,containerIndex,chargesIndex})
    }
    function handleChangeChargesDescription(val,index){
        var containerIndex = props.containerIndex
        var chargesIndex = index
        setOnChangeChargesDescription({val,containerIndex,chargesIndex})
    }

    function handleOnChangeTaxCode(val,index){
        var containerIndex = props.containerIndex
        var chargesIndex = index

        GetTaxCodeById(val.value,globalContext).then(res => {
            var taxRate = res.data.TaxRate
            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][TaxRate]`, (parseFloat(taxRate)).toFixed(4))
            setOnChangeTaxCode({val,taxRate,containerIndex,chargesIndex})
            handleCalculate(index)
        })

    }

    function onBlurQuantity(val,index){
        var containerIndex = props.containerIndex
        var chargesIndex = index

        setChargesQuantityOnChange({val,containerIndex,chargesIndex})
        setCalculateIndex(chargesIndex)
    }

    function changeCustomerType(val,index){
        $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CustomerType]`).parent().trigger("change")
    }

    function handleChangeCurrency(val, index){ 
        var containerIndex = props.containerIndex
        var chargesIndex = index
        setOnChangeCurrency({val,containerIndex,chargesIndex})
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
                    if($(`input[name='${props.formName}[Currency]']`).val()==val.value){
                        // closestRate.val(parseFloat("1").toFixed(4)).trigger('change')
                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,parseFloat("1").toFixed(4))
                    }
                    else{
                        
                        // closestRate.val(parseFloat(newData[0]["Rate"]).toFixed(4)).trigger('change')
                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,parseFloat(newData[0]["Rate"]).toFixed(4))
    
                    }
                    
                    $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]']`).trigger("change")
                }
                else{
                    if($(`input[name='${props.formName}[Currency]']`).val()==val.value){
                        // closestRate.val(parseFloat("1").toFixed(4)).trigger('change')
                        setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,parseFloat("1").toFixed(4))
    
                    }
                    else{
                        var resultCurrency = (newData).filter(function (oneArray) {
                            
                            return oneArray.toCurrency.CurrencyTypeUUID==$(`input[name='${props.formName}[Currency]']`).val()
                        });
    
                       if(resultCurrency.length!=0){
                            // closestRate.val(parseFloat(resultCurrency[0]["Rate"]).toFixed(4)).trigger('change')
                            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,parseFloat(resultCurrency[0]["Rate"]).toFixed(4))
    
                       }
                       else{
                        //    closestRate.val("").trigger('change')
                           setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,"")
    
                       }
                       $(`input[name='${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]']`).trigger("change")
                    }
                   
                }
    
            })
            setCalculateIndex(chargesIndex)
        }

    }
    
    function changeBillTo(val, index){
        var containerIndex = props.containerIndex
        var chargesIndex = index
        setOnChangeBillTo({val,containerIndex,chargesIndex})
    }
    function onChangeChargesPortCode(val, index){
        var containerIndex = props.containerIndex
        var chargesIndex = index
        setOnChangePortCode({val,containerIndex,chargesIndex})

        if(val){
            var filters = {
                "Area.Valid": 1,
            };
            getAreaById(val.value,globalContext).then(data => {   
                setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][Area]`,data.Area)
            })
        }
        else {
            setValue(`${props.formName}HasContainerType`+'['+props.containerIndex+']'+`[${props.formName}HasCharges][${index}][Area]`,"")
            }
    }

    function openModalCurrencyRate(e) {
			var current = e.target;
			window.$("#CurrencyRateModal").modal("toggle");
			window.$("#CurrencyRateModal").find(".currency-rate-item").empty();

			var filters = {
				FromCurrency: $(current).closest(".row").find("input:hidden").val(),
				"CurrencyRate.Valid": 1,
				ToCurrency: $(`input[name='${props.formName}[Currency]']`).val(),
			};

			getCurrencyRate(filters, globalContext).then((data) => {
				var newData = [];

				$.each(data.data, function (key, value) {
					if (value.EndDate == "" || value.EndDate == null) {
						newData.push(value);
					} else {
						var endDate = moment(moment.unix(value.EndDate).toDate()).format(
							"DD-MM-YYYY"
						);
						var TodayDate = moment().format("DD-MM-YYYY");

						var start = moment(endDate, "DD-MM-YYYY");
						var end = moment(TodayDate, "DD-MM-YYYY");

						var Days = moment.duration(start.diff(end)).asDays();
						if (Days >= 0) {
							newData.push(value);
						}
					}
				});
				$.each(newData, function (key, value) {
					var StartDate;
					var EndDate;
					value.StartDate == null
						? (StartDate = "")
						: (StartDate = moment(moment.unix(value.StartDate).toDate()).format(
								"DD/MM/YYYY"
						  ));
					value.EndDate == null
						? (EndDate = "")
						: (EndDate = moment(moment.unix(value.EndDate).toDate()).format(
								"DD/MM/YYYY"
						  ));
					$("#CurrencyRateModal")
						.find(".currency-rate-item")
						.append(
							'<tr><td style="text-align:center;vertical-align: middle;"><input type="radio" name="currencyCheckBox"></td><td style="text-align:center;vertical-align: middle;">' +
								value.fromCurrency.CurrencyName +
								'</td><td style="text-align:center;vertical-align: middle;">' +
								value.toCurrency.CurrencyName +
								'</td><td className="currency_Rate" style="text-align:center;vertical-align: middle;">' +
								value.Rate +
								'</td><td style="text-align:center;vertical-align: middle;">' +
								StartDate +
								'</td><td style="text-align:center;vertical-align: middle;">' +
								EndDate +
								"</td></tr>"
						);
				});
			});

			$(".confirmCurrencyRate").unbind();
			$(".confirmCurrencyRate").on("click", function () {
				var rate = $('input[name="currencyCheckBox"]:checked')
					.parent()
					.parent()
					.find(".currency_Rate")
					.html();
				if (rate) {
					$(current)
						.parent()
						.closest(".insidecharges-item")
						.find(".ParentExchangeRate")
						.val(parseFloat(rate).toFixed(4))
						.trigger("change");
				} else {
					$(current)
						.parent()
						.closest(".insidecharges-item")
						.find(".ParentExchangeRate")
						.val(0)
						.trigger("change");
				}
				window.$("#CurrencyRateModal").modal("toggle");
			});
		}

		function handleCalculate(index) {
			if (!props.transferPartial) {
				var containerIndex = props.containerIndex;
				var chargesIndex = index;

				var qty = getValues(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][Qty]`
				);
				var unitPrice = getValues(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][UnitPrice]`
				);

				if (qty == "") {
					qty = 0;
				}
				if (unitPrice == "") {
					unitPrice = 0.0;
				}

				var unitDiscount = getValues(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][Discount]`
				);
				var TotalAmount = (parseFloat(qty) * parseFloat(unitPrice)).toFixed(2);

				if (unitDiscount) {
					if (unitDiscount.includes("%")) {
						var Discount = unitDiscount.replace("%", "");
						Discount = parseFloat(Discount) / 100;
						unitDiscount = parseFloat(Discount);

						var unitTotalDiscount = (unitPrice * unitDiscount).toFixed(2);
						setValue(
							`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][Discount]`,
							parseFloat(unitTotalDiscount).toFixed(2)
						);

						if (unitTotalDiscount) {
							TotalAmount = (
								parseFloat(qty) *
								(parseFloat(unitPrice) - parseFloat(unitTotalDiscount))
							).toFixed(2);
						}
					} else {
						setValue(
							`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][Discount]`,
							parseFloat(unitDiscount).toFixed(2)
						);
						TotalAmount = (
							parseFloat(qty) *
							(parseFloat(unitPrice) - parseFloat(unitDiscount))
						).toFixed(2);
					}
				}
				setValue(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][Amount]`,
					TotalAmount
				);

				var TotalTax;
				var SubTotal;
				var SubTotalLocal;

				var taxRate = getValues(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][TaxRate]`
				);
				if (taxRate) {
					if (taxRate.includes("%")) {
						var Tax = taxRate.replace("%", "");
						Tax = (parseFloat(Tax) / 100).toFixed(2);
						taxRate = parseFloat(Tax);
					}
					TotalTax = (TotalAmount * parseFloat(taxRate)).toFixed(2);
					SubTotal = (parseFloat(TotalAmount) + parseFloat(TotalTax)).toFixed(
						2
					);
					// setTotalDiscount(unitTotalDiscount)
				} else {
					SubTotal = parseFloat(TotalAmount).toFixed(2);
				}

				var currencyRate = getValues(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][CurrencyExchangeRate]`
				);
				if (currencyRate) {
					SubTotalLocal = (
						parseFloat(SubTotal) * parseFloat(currencyRate)
					).toFixed(2);
				} else {
					SubTotalLocal = parseFloat(SubTotal).toFixed(2);
				}

				setValue(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][TaxAmount]`,
					TotalTax
				);
				setValue(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][SubTotal]`,
					SubTotal
				);
				setValue(
					`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${chargesIndex}][SubTotalLocal]`,
					SubTotalLocal
				);

				//calculate Total Discount
				var FinalTotalDiscount = 0;
				$.each($(".ParentDiscount"), function (key, value) {
					var qtyForTotalDisc = getValues(
						`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${key}][Qty]`
					);
					if (!qtyForTotalDisc) {
						qtyForTotalDisc = 0;
					}
					var unitPriceForTotalDisc = getValues(
						`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${key}][UnitPrice]`
					);
					if (!unitPriceForTotalDisc) {
						unitPriceForTotalDisc = 0.0;
					}
					var totalAmountForTotalDisc = getValues(
						`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${key}][Amount]`
					);
					if (!totalAmountForTotalDisc) {
						totalAmountForTotalDisc = 0.0;
					}
					var OriTotalAmount = (
						parseFloat(qtyForTotalDisc) * parseFloat(unitPriceForTotalDisc)
					).toFixed(2);

					var tempTotalDiscount = (
						parseFloat(OriTotalAmount) - parseFloat(totalAmountForTotalDisc)
					).toFixed(2);
					FinalTotalDiscount += parseFloat(tempTotalDiscount);
				});

				//Calculate Total Tax
				var FinalTotalTax = 0;
				$.each($(".ParentTaxAmount"), function (key, value) {
					var tempTotalTax = getValues(
						`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${key}][TaxAmount]`
					);
					if (tempTotalTax) {
						FinalTotalTax += parseFloat(tempTotalTax);
					}
				});

				//Calculate Sub Total
				var FinalSubTotal = 0;
				$.each($(".subtotallocal"), function (key, value) {
					var tempSubTotal = getValues(
						`${props.formName}HasContainerType[${containerIndex}][${props.formName}HasCharges][${key}][SubTotalLocal]`
					);
					if (tempSubTotal) {
						FinalSubTotal += parseFloat(tempSubTotal);
					}
				});
				const TotalDiscountTwoDecimal = FinalTotalDiscount.toFixed(2);
				const TotalTaxTwoDecimal = FinalTotalTax.toFixed(2);
				const TotalAmountTwoDecimal = FinalSubTotal.toFixed(2);
				props.setTotalDiscount({TotalDiscountTwoDecimal, containerIndex});
				props.setTotalTax({TotalTaxTwoDecimal, containerIndex});
				props.setTotalAmount({TotalAmountTwoDecimal, containerIndex});
			}
		}

		function handleCalChargesGetIndexAndSetState(val, index) {
			setCalculateIndex(index);
		}

		if (props.transferPartial) {
			var chargesColumn = [
				{
					columnName: "Charges Code",
					inputType: "single-select",
					defaultChecked: true,
					name: "ChargesCode",
					class: "",
					fieldClass:
						"readOnlySelect ParentChargesCode ChargesCode Charges_Code",
					options: [],
					onChange: handleChangeChargesCode,
				},
				{
					columnName: "Charges Name",
					inputType: "input",
					defaultChecked: false,
					name: "ChargesName",
					class: "d-none",
					readOnly: true,
				},
				{
					columnName: "BL No.",
					inputType: "single-select",
					defaultChecked: false,
					name: "BillOfLading",
					class: "",
					fieldClass: "readOnlySelect BL ParentBL FieldCantChangeDisabled",
					options: formContext.billOfLadingOptions,
					onChange: "",
				},
				{
					columnName: "BC No.",
					inputType: "single-select",
					defaultChecked: false,
					name: "BookingConfirmation",
					class: "",
					fieldClass: "readOnlySelect FieldCantChangeDisabled ParentBC",
					options: formContext.bookingConfirmationOptions,
					onChange: "",
				},
				{
					columnName: "QT No.",
					inputType: "single-select",
					defaultChecked: false,
					name: "Quotation",
					class: "",
					fieldClass: "readOnlySelect FieldCantChangeDisabled ParentQT",
					options: formContext.quotationOptions,
					onChange: "",
				},
				{
					columnName: "Port Code",
					inputType: "single-select",
					defaultChecked: false,
					name: "PortCode",
					class: "d-none",
					fieldClass: "readOnlySelect Port_Code",
					options: props.port,
					onChange: onChangeChargesPortCode,
				},
				{
					columnName: "Area",
					inputType: "input",
					defaultChecked: false,
					name: "Area",
					class: "d-none",
					fieldClass: "ChargesAreaName",
					readOnly: true,
				},
				{
					columnName: "GL Code",
					inputType: "input",
					defaultChecked: false,
					name: "AccountCode",
					class: "d-none",
					fieldClass: "ParentAccountCode",
					readOnly: true,
				},
				{
					columnName: "Currency",
					inputType: "select-withCurrencyModal",
					defaultChecked: false,
					name: "Currency",
					class: "d-none",
					options: props.currency,
					fieldClass: "readOnlySelect currency calCharges ParentCurrency",
					onChange: handleChangeCurrency,
				},
				{
					columnName: "Rate Of Exchange",
					inputType: "input",
					defaultChecked: false,
					name: "CurrencyExchangeRate",
					class: "d-none",
					fieldClass:
						"calCharges exchangerate inputDecimalFourPlaces ParentExchangeRate",
					onBlur: handleCalChargesGetIndexAndSetState,
					readOnly: true,
				},
				{
					columnName: "Cargo Type",
					inputType: "single-select",
					defaultChecked: false,
					name: "CargoType",
					class: "d-none",
					fieldClass: "readOnlySelect CargoType ParentCargoType",
					options: props.cargoType,
				},
				{
					columnName: "Cargo Rate",
					inputType: "input",
					defaultChecked: false,
					name: "CargoRate",
					class: "d-none",
					fieldClass: "CargoRate ParentCargoRate inputDecimalFourPlaces",
					readOnly: true,
				},
				{
					columnName: "UOM",
					inputType: "single-select",
					defaultChecked: false,
					name: "UOM",
					class: "d-none",
					fieldClass: "readOnlySelect ParentUOM",
					options: [],
				},
				{
					columnName: "Vessel",
					inputType: "input",
					defaultChecked: false,
					name: "Vessel",
					class: "d-none",
					fieldClass: "ParentVessel",
					readOnly: true,
				},
				{
					columnName: "Voyage",
					inputType: "input",
					defaultChecked: false,
					name: "Voyage",
					class: "d-none",
					fieldClass: "ParentVoyage",
					readOnly: true,
				},
				{
					columnName: "Shipper",
					inputType: "input",
					defaultChecked: false,
					name: "Shipper",
					class: "d-none",
					fieldClass: "ParentShipper",
					readOnly: true,
				},
				{
					columnName: "Consignee",
					inputType: "input",
					defaultChecked: false,
					name: "Consignee",
					class: "d-none",
					fieldClass: "ParentConsignee",
					readOnly: true,
				},
				{
					columnName: "Charges Description",
					inputType: "input-Modal",
					defaultChecked: false,
					name: "ChargesDescription",
					fieldClass: "ParentChargesDescriptionReadonly",
					modelClass: "ParentChargesText",
					class: "d-none",
					onBlur: handleChangeChargesDescription,
					readOnly: true,
				},
				{
					columnName: "Unit Disc",
					inputType: "input",
					defaultChecked: false,
					name: "Discount",
					class: "d-none",
					fieldClass: "calCharges ContainerDiscount Discount ParentDiscount",
					onBlur: handleCalChargesGetIndexAndSetState,
					readOnly: true,
				},
				{
					columnName: "Qty",
					inputType: "number",
					defaultChecked: true,
					name: "Qty",
					class: "",
					fieldClass: "Quantity calCharges",
					onBlur: onBlurQuantity,
					readOnly: true,
				},
				{
					columnName: "Unit Price",
					inputType: "input",
					defaultChecked: true,
					name: "UnitPrice",
					class: "",
					fieldClass:
						"calCharges UnitPrice inputDecimalTwoPlaces ParentUnitPrice",
					onChange: "",
					onBlur: handleCalChargesGetIndexAndSetState,
					readOnly: true,
				},
				{
					columnName: "Freight Term",
					inputType: "single-select",
					defaultChecked: true,
					name: "FreightTerm",
					class: "",
					fieldClass: "readOnlySelect FreightTerm ParentFreightTerm",
					options: props.freightTerm,
					onChange: handleChangeFreightTerm,
				},
				{
					columnName: "Local Amount",
					inputType: "input",
					defaultChecked: false,
					name: "Amount",
					class: "d-none",
					fieldClass:
						"calCharges inputDecimalTwoPlaces Amount OriReadOnlyClass",
					onBlur: handleCalChargesGetIndexAndSetState,
					readOnly: true,
				},
				{
					columnName: "Tax Code",
					inputType: "single-select",
					defaultChecked: false,
					name: "TaxCode",
					class: "d-none",
					fieldClass: "readOnlySelect TaxCode Tax_Code ParentTaxCode",
					options: props.taxCode,
					onChange: handleOnChangeTaxCode,
				},
				{
					columnName: "Tax Rate",
					inputType: "input",
					defaultChecked: false,
					name: "TaxRate",
					class: "d-none",
					fieldClass:
						"inputDecimalTwoPlaces calCharges TaxRate ParentTaxRate OriReadOnlyClass",
					onBlur: handleCalChargesGetIndexAndSetState,
					readOnly: true,
				},
				{
					columnName: "Tax Amount",
					inputType: "input",
					defaultChecked: false,
					name: "TaxAmount",
					class: "d-none",
					fieldClass:
						"inputDecimalTwoPlaces calCharges TaxAmount ParentTaxAmount ContainerTaxAmount",
					readOnly: true,
				},
				{
					columnName: "Sub Total",
					inputType: "input",
					defaultChecked: true,
					name: "SubTotal",
					class: "",
					fieldClass:
						"inputDecimalTwoPlaces calCharges SubTotal ContainerSubTotal OriReadOnlyClass",
					readOnly: true,
				},
				{
					columnName: "Sub Total(Local)",
					inputType: "input",
					defaultChecked: true,
					name: "SubTotalLocal",
					class: "",
					fieldClass:
						"calCharges subtotallocal inputDecimalTwoPlaces ContainerSubTotalLocal OriReadOnlyClass",
					readOnly: true,
				},
			];
		} else {
			var chargesColumn = [
				{
					columnName: "Charges Code",
					inputType: "single-select",
					defaultChecked: true,
					name: "ChargesCode",
					class: "",
					fieldClass: "ParentChargesCode ChargesCode Charges_Code",
					options: [],
					onChange: handleChangeChargesCode,
				},
				{
					columnName: "Charges Name",
					inputType: "input",
					defaultChecked: false,
					name: "ChargesName",
					class: "d-none",
				},
				{
					columnName: "BL No.",
					inputType: "single-select",
					defaultChecked: true,
					name: "BillOfLading",
					class: "",
					fieldClass: "BL ParentBL FieldCantChangeDisabled",
					options: formContext.billOfLadingOptions,
					onChange: "",
				},
				{
					columnName: "BC No.",
					inputType: "single-select",
					defaultChecked: true,
					name: "BookingConfirmation",
					class: "",
					fieldClass: "FieldCantChangeDisabled ParentBC",
					options: formContext.bookingConfirmationOptions,
					onChange: "",
				},
				{
					columnName: "QT No.",
					inputType: "single-select",
					defaultChecked: true,
					name: "Quotation",
					class: "",
					fieldClass: "FieldCantChangeDisabled ParentQT",
					options: formContext.quotationOptions,
					onChange: "",
				},
				{
					columnName: "Port Code",
					inputType: "single-select",
					defaultChecked: false,
					name: "PortCode",
					class: "d-none",
					fieldClass: "Port_Code",
					options: props.port,
					onChange: onChangeChargesPortCode,
				},
				{
					columnName: "Area",
					inputType: "input",
					defaultChecked: false,
					name: "Area",
					class: "d-none",
					fieldClass: "ChargesAreaName",
				},
				{
					columnName: "GL Code",
					inputType: "input",
					defaultChecked: false,
					name: "AccountCode",
					class: "d-none",
					fieldClass: "ParentAccountCode",
				},
				{
					columnName: "Currency",
					inputType: "select-withCurrencyModal",
					defaultChecked: false,
					name: "Currency",
					class: "d-none",
					options: props.currency,
					fieldClass: "currency calCharges ParentCurrency",
					onChange: handleChangeCurrency,
				},
				{
					columnName: "Rate Of Exchange",
					inputType: "input",
					defaultChecked: false,
					name: "CurrencyExchangeRate",
					class: "d-none",
					fieldClass:
						"calCharges exchangerate inputDecimalFourPlaces ParentExchangeRate",
					onBlur: handleCalChargesGetIndexAndSetState,
				},
				{
					columnName: "Cargo Type",
					inputType: "single-select",
					defaultChecked: false,
					name: "CargoType",
					class: "d-none",
					fieldClass: "CargoType ParentCargoType",
					options: props.cargoType,
				},
				{
					columnName: "Cargo Rate",
					inputType: "input",
					defaultChecked: false,
					name: "CargoRate",
					class: "d-none",
					fieldClass: "CargoRate ParentCargoRate inputDecimalFourPlaces",
				},
				{
					columnName: "UOM",
					inputType: "single-select",
					defaultChecked: false,
					name: "UOM",
					class: "d-none",
					fieldClass: "ParentUOM",
					options: [],
				},
				{
					columnName: "Vessel",
					inputType: "input",
					defaultChecked: false,
					name: "Vessel",
					class: "d-none",
					fieldClass: "ParentVessel",
					readOnly: true,
				},
				{
					columnName: "Voyage",
					inputType: "input",
					defaultChecked: false,
					name: "Voyage",
					class: "d-none",
					fieldClass: "ParentVoyage",
					readOnly: true,
				},
				{
					columnName: "Shipper",
					inputType: "input",
					defaultChecked: false,
					name: "Shipper",
					class: "d-none",
					fieldClass: "ParentShipper",
					readOnly: true,
				},
				{
					columnName: "Consignee",
					inputType: "input",
					defaultChecked: false,
					name: "Consignee",
					class: "d-none",
					fieldClass: "ParentConsignee",
					readOnly: true,
				},
				{
					columnName: "Charges Description",
					inputType: "input-Modal",
					defaultChecked: false,
					name: "ChargesDescription",
					fieldClass: "ParentChargesDescriptionReadonly",
					modelClass: "ParentChargesText",
					class: "d-none",
					onBlur: handleChangeChargesDescription,
					readOnly: true,
				},
				{
					columnName: "Unit Disc",
					inputType: "input",
					defaultChecked: false,
					name: "Discount",
					class: "d-none",
					fieldClass: "calCharges ContainerDiscount Discount ParentDiscount",
					onBlur: handleCalChargesGetIndexAndSetState,
				},
				{
					columnName: "Qty",
					inputType: "number",
					defaultChecked: true,
					name: "Qty",
					class: "",
					fieldClass: "Quantity calCharges",
					onBlur: onBlurQuantity,
				},
				{
					columnName: "Unit Price",
					inputType: "input",
					defaultChecked: true,
					name: "UnitPrice",
					class: "",
					fieldClass:
						"calCharges UnitPrice inputDecimalTwoPlaces ParentUnitPrice",
					onChange: "",
					onBlur: handleCalChargesGetIndexAndSetState,
				},
				{
					columnName: "Freight Term",
					inputType: "single-select",
					defaultChecked: true,
					name: "FreightTerm",
					class: "",
					fieldClass: "FreightTerm ParentFreightTerm",
					options: props.freightTerm,
					onChange: handleChangeFreightTerm,
				},
				{
					columnName: "Local Amount",
					inputType: "input",
					defaultChecked: false,
					name: "Amount",
					class: "d-none",
					fieldClass:
						"calCharges inputDecimalTwoPlaces Amount OriReadOnlyClass",
					onBlur: handleCalChargesGetIndexAndSetState,
					readOnly: true,
				},
				{
					columnName: "Tax Code",
					inputType: "single-select",
					defaultChecked: false,
					name: "TaxCode",
					class: "d-none",
					fieldClass: "TaxCode Tax_Code ParentTaxCode",
					options: props.taxCode,
					onChange: handleOnChangeTaxCode,
				},
				{
					columnName: "Tax Rate",
					inputType: "input",
					defaultChecked: false,
					name: "TaxRate",
					class: "d-none",
					fieldClass:
						"inputDecimalTwoPlaces calCharges TaxRate ParentTaxRate OriReadOnlyClass",
					onBlur: handleCalChargesGetIndexAndSetState,
					readOnly: true,
				},
				{
					columnName: "Tax Amount",
					inputType: "input",
					defaultChecked: false,
					name: "TaxAmount",
					class: "d-none",
					fieldClass:
						"inputDecimalTwoPlaces calCharges TaxAmount ParentTaxAmount ContainerTaxAmount",
					readOnly: true,
				},
				{
					columnName: "Sub Total",
					inputType: "input",
					defaultChecked: true,
					name: "SubTotal",
					class: "",
					fieldClass:
						"inputDecimalTwoPlaces calCharges SubTotal ContainerSubTotal OriReadOnlyClass",
					readOnly: true,
				},
				{
					columnName: "Sub Total(Local)",
					inputType: "input",
					defaultChecked: true,
					name: "SubTotalLocal",
					class: "",
					fieldClass:
						"calCharges subtotallocal inputDecimalTwoPlaces ContainerSubTotalLocal OriReadOnlyClass",
					readOnly: true,
				},
			];
		}

		var ChargesCookies = "";
		if (props.transferPartial) {
			if (props.transferPartial == "SalesDebitNote") {
				ChargesCookies = `${formNameLowerCase}transferpartialDNchargescolumn`;
			} else {
				ChargesCookies = `${formNameLowerCase}transferpartialCNchargescolumn`;
			}
		} else {
			ChargesCookies = `${formNameLowerCase}chargescolumn`;
		}

		if (getCookie(ChargesCookies)) {
			var getCookieArray = getCookie(ChargesCookies);
			var getCookieArray = JSON.parse(getCookieArray);

			$.each(chargesColumn, function (key, value) {
				value.defaultChecked = false;
				value.class = "d-none";
			});

			$.each(getCookieArray, function (key, value) {
				$.each(chargesColumn, function (key2, value2) {
					if (value == key2) {
						value2.defaultChecked = true;
						value2.class = "";
					}
				});
			});
		}

		useEffect(() => {
			if (props.containerChangeIndex == props.containerIndex) {
				if (props.onChangeContainerTypeCharges) {
					if (fields.length > 0) {
						if (
							fields[0].Name ==
							`${props.formName}HasContainerType[${props.containerChangeIndex}][${props.formName}HasCharges]`
						) {
							$.each(fields, function (key, value) {
								value.ChargesItem[0].options =
									props.onChangeContainerTypeCharges;
								value.ChargesItem[1]["defaultValue"] = $(
									`input[name='${props.formName}HasContainerType[${props.containerIndex}][Qty]']`
								).val();
								// setValue(`${props.formName}HasContainerType[${props.containerChangeIndex}][${props.formName}HasCharges][${key}][Qty]`,"1")
							});
						}
					}
				}
				var childLength = $(
					`input[name='${props.formName}HasContainerType` +
						"[" +
						props.containerIndex +
						"][ContainerType]"
				)
					.closest("tr")
					.next()
					.find(".charges-item")
					.children().length;
				if (childLength > 0) {
					for (var index = 0; index < childLength; index++) {
						setValue(
							`${props.formName}HasContainerType[${props.containerChangeIndex}][${props.formName}HasCharges][${index}][ChargesCode]`,
							""
						);
					}
				}

				var newArray = props.combinedChargesOptions;

				if (props.combinedChargesOptions.length >= props.containerChangeIndex) {
					newArray[props.containerChangeIndex] =
						props.onChangeContainerTypeCharges;
					props.setCombinedChargesOptions(newArray);
				} else {
					props.setCombinedChargesOptions((e) => [
						...e,
						props.onChangeContainerTypeCharges,
					]);
				}
			}
			return () => {};
		}, [props.onChangeContainerTypeCharges]);

		useEffect(() => {
			if (FilledUpdateData != false) {
				var result = props.onChangeContainerTypeChargesVoyage.filter(function (
					item,
					index
				) {
					return index == props.containerIndex;
				});

				if (result) {
					if (fields.length > 0) {
						if (
							fields[0].Name ==
							`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}Charges]`
						) {
							$.each(fields, function (key, value) {
								value.ChargesItem[0].options = result[0]["ChargesData"];
								value.ChargesItem[1]["defaultValue"] = $(
									`input[name='${props.formName}HasContainerType[${props.containerIndex}][Qty]']`
								).val();
							});
						}
					}
				}
				var childLength = $(
					`input[name='${props.formName}HasContainerType` +
						"[" +
						props.containerIndex +
						"][ContainerType]"
				)
					.closest("tr")
					.next()
					.find(".charges-item")
					.children().length;

				var newArray = props.combinedChargesOptions;

				if (props.combinedChargesOptions.length >= props.containerIndex) {
					newArray[props.containerIndex] = result[0]["ChargesData"];
					props.setCombinedChargesOptions(newArray);
				} else {
					props.setCombinedChargesOptions((e) => [
						...e,
						result[0]["ChargesData"],
					]);
				}
			}
			return () => {};
		}, [props.onChangeContainerTypeChargesVoyage]);

		function appendChargesHandle(event) {
			var totalLength = $(event.target).closest("tr").last().index();
			var realIndex = $(event.target).closest("tr").prev().index();
			var convertedIndex = realIndex / 2;
			var tempCharges = chargesColumn;
			setIndexBeforeAppend(
				$(event.target).prev().find(".charges-item").children().length / 2
			);

			tempCharges[0]["options"] = props.combinedChargesOptions[convertedIndex];
			tempCharges[1]["defaultValue"] = $(
				`input[name='${props.formName}HasContainerType[${props.containerIndex}][Qty]']`
			).val();
			append({
				Name: `${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges]`,
				Qty: 1,
				CustomerType: "Bill To",
				ChargesOption: props.combinedChargesOptions[convertedIndex],
				ChargesItem: tempCharges,
			});
		}

		function AppendNestedCharges(index) {
			var containerIndex = props.containerIndex;
			var chargesIndex = index;
			setAppendNestedCharges({
				append: true,
				containerIndex: containerIndex,
				chargesIndex: chargesIndex,
			});
		}

		//set Default Value after Append
		useEffect(() => {
			countForBlock++;
			var index = fields.length - 1;
			//Avoid Remove fields to run this
			if (index > indexBeforeAppend - 1) {
				if (
					(formContext.formState.formType != "Update" &&
						formContext.formState.formType != "Transfer" &&
						formContext.formState.formType != "TransferFromBooking") ||
					FilledUpdateData != false
				) {
					// Avoid run when fillin data update page or transfer page
					setValue(
						`${props.formName}HasContainerType` +
							"[" +
							props.containerIndex +
							"]" +
							`[${props.formName}HasCharges][${index}][CustomerType]`,
						"Bill To"
					);
					setTimeout(() => {
						$(
							`input[name='${props.formName}HasContainerType` +
								"[" +
								props.containerIndex +
								"]" +
								`[${props.formName}HasCharges][${index}][CustomerType]`
						)
							.parent()
							.trigger("change");
					}, 500);
				}
			} else if (index == indexBeforeAppend - 1) {
			} else {
				// setIndexBeforeAppend(indexBeforeAppend-1)
			}

			$(".columnchooserdropdowncharges").on("change", function (event) {
				if (countForBlock == 1) {
					// $(document).on("change", ".columnchooserdropdowncharges", function (event) {
					// var index = ($(this).parent().parent().attr('id')).split("-")[1]

					var Cookies = [];

					$(this)
						.parent()
						.parent()
						.find(".columnchooserdropdowncharges:checked")
						.each(function () {
							Cookies.push($(this).parent().index());
						});

					var json_str = JSON.stringify(Cookies);
					// transferPartialDN
					// transferPartialCN
					if (props.transferPartial) {
						if (props.transferPartial == "SalesDebitNote") {
							createCookie(
								`${formNameLowerCase}transferpartialDNchargescolumn`,
								json_str,
								3650
							);
						} else {
							createCookie(
								`${formNameLowerCase}transferpartialCNchargescolumn`,
								json_str,
								3650
							);
						}
					} else {
						createCookie(`${formNameLowerCase}chargescolumn`, json_str, 3650);
					}

					if (fields.length > 0) {
						if (
							fields[0].Name ==
							`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges]`
						) {
							$.each(fields, function (key, value) {
								if ($(event.target).prop("checked")) {
									value.ChargesItem[$(event.target).parent().index()].class =
										"";
								} else {
									value.ChargesItem[$(event.target).parent().index()].class =
										"d-none";
								}
							});
							update(fields);
						}
					}
				}
			});

			$(".ParentChargesCode").on("change", function (e) {
				if (countForBlock == 1) {
					var thisContainerIndex =
						$(this).closest(".ChargesTable").prev().index() / 2;
					if (thisContainerIndex == props.containerIndex) {
						setTimeout(() => {
							var index = $(this).closest("tr").index() / 2;
							var value = $(this).find("input:hidden").val();
							var label = $(this).find(".select__single-value").text();
							GetChargesById(value, globalContext).then((data) => {
								var uomValue = data.data.UOM;

								var optionUOM = [];
								var defaultUOM;
								if (uomValue) {
									const arrayUOM = uomValue.split(",");
									try {
										$.each(arrayUOM, function (key, value) {
											if (key == 0) {
												defaultUOM = value;
											}
											optionUOM.push({value: value, label: value});
										});
									} catch (err) {}
								}

								if (fields.length > 0) {
									$.each(fields[index]["ChargesItem"], function (key2, value2) {
										if (value2.name == "UOM") {
											setValue(
												`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${index}][ChargesItem][${key2}][options]`,
												sortArray(optionUOM)
											);
											update(fields);
										}
									});
								}
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][ChargesName]`,
									data.data.ChargesName
								);
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][UOM]`,
									defaultUOM
								);
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][FreightTerm]`,
									data.data.FreightTerm
								);
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][ChargesDescription]`,
									data.data.Description
								);
								$(
									`textarea[name='${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][ChargesDescription]']`
								)
									.closest(".modal")
									.prev()
									.val(data.data.Description);
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][TaxCode]`,
									data.data.TaxCode
								);
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][TaxRate]`,
									data.data.TaxRate
								);
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][Currency]`,
									data.data.CurrencyType
								);
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}HasCharges][${index}][UnitPrice]`,
									parseInt(data.data.ReferencePrice).toFixed(2)
								);

								//get Currency Rate
								var filters = {
									FromCurrency: data.data.CurrencyType,
									"CurrencyRate.Valid": 1,
								};
								var newData = [];
								getCurrencyRate(filters, globalContext).then((data2) => {
									$.each(data2.data, function (key2, value2) {
										if (value2.EndDate == "" || value2.EndDate == null) {
											newData.push(value2);
										} else {
											var endDate = moment(
												moment.unix(value2.EndDate).toDate()
											).format("DD-MM-YYYY");
											var TodayDate = moment().format("DD-MM-YYYY");

											var start = moment(endDate, "DD-MM-YYYY");
											var end = moment(TodayDate, "DD-MM-YYYY");

											var Days = moment.duration(start.diff(end)).asDays();
											if (Days >= 0) {
												newData.push(value2);
											}
										}
									});

									if (newData.length == 1) {
										if (
											$(`input[name='${props.formName}[Currency]']`).val() ==
											data.data.CurrencyType
										) {
											setValue(
												`${props.formName}HasContainerType` +
													"[" +
													props.containerIndex +
													"]" +
													`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,
												parseFloat("1").toFixed(4)
											);
										} else {
											setValue(
												`${props.formName}HasContainerType` +
													"[" +
													props.containerIndex +
													"]" +
													`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,
												parseFloat(newData[0]["Rate"]).toFixed(4)
											);
										}
									} else {
										if (
											$(`input[name='${props.formName}[Currency]']`).val() ==
											data.data.CurrencyType
										) {
											setValue(
												`${props.formName}HasContainerType` +
													"[" +
													props.containerIndex +
													"]" +
													`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,
												parseFloat("1").toFixed(4)
											);
										} else {
											var resultCurrency = newData.filter(function (oneArray) {
												return (
													oneArray.toCurrency.CurrencyTypeUUID ==
													$(`input[name='${props.formName}[Currency]']`).val()
												);
											});

											if (resultCurrency.length != 0) {
												setValue(
													`${props.formName}HasContainerType` +
														"[" +
														props.containerIndex +
														"]" +
														`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,
													parseFloat(resultCurrency[0]["Rate"]).toFixed(4)
												);
											} else {
												setValue(
													`${props.formName}HasContainerType` +
														"[" +
														props.containerIndex +
														"]" +
														`[${props.formName}HasCharges][${index}][CurrencyExchangeRate]`,
													""
												);
											}
										}
									}
								});
								handleCalculate(index);
							});
						}, 100);
					}
				}
			});
			$(".BillToTypeCharges").on("change", function (e) {
				if (countForBlock == 1) {
					var thisContainerIndex =
						$(this).closest(".ChargesTable").prev().index() / 2;
					if (thisContainerIndex == props.containerIndex) {
						setTimeout(() => {
							setIndexBeforeAppend(indexBeforeAppend + 1);
							var index = $(this).closest("tr").index() / 2;
							var value = $(this).find("input:hidden").val();
							var label = $(this).find(".select__single-value").text();

							var arrayCompanyBranch = [];
							var companyUUID;
							if (value == "Notify Party") {
								companyUUID = $(`#${formNameLowerCase}notifyparty-roc`).val();
							} else if (value == "Attention Party") {
								companyUUID = $(
									`#${formNameLowerCase}attentionparty-roc`
								).val();
							} else if (value == "Bill To") {
								companyUUID = $(`#${formNameLowerCase}billto-roc`).val();
							} else {
								var type = value.toLowerCase();
								companyUUID = $(`#${formNameLowerCase}` + type + "-roc").val();
							}

							var arrayCompanyBranch = [];
							var containerIndex = props.containerIndex;
							var chargesIndex = index;
							if (companyUUID) {
								var filters = {
									CompanyUUID: companyUUID,
								};

								GetCompanyBranches(filters, globalContext).then((data) => {
									try {
										$.each(data, function (key, value) {
											arrayCompanyBranch.push({
												value: value.CompanyBranchUUID,
												label:
													value.BranchCode +
													"(" +
													value.portCode.PortCode +
													")",
											});
										});
									} catch (err) {}
									arrayCompanyBranch = sortArray(arrayCompanyBranch);
									setOnChangeBillToType({
										e,
										arrayCompanyBranch,
										containerIndex,
										chargesIndex,
									});

									if (value == "Notify Party") {
										var branchName = $(
											`#${formNameLowerCase}notifyparty-branchcode`
										).val();
										$.each(
											fields[index]["ChargesItem"],
											function (key2, value2) {
												if (value2.name == "BillTo") {
													fields[index]["ChargesItem"][key2]["options"] =
														arrayCompanyBranch;
													update(fields);
												}
											}
										);
										setValue(
											`${props.formName}HasContainerType` +
												"[" +
												props.containerIndex +
												"]" +
												`[${props.formName}HasCharges][${index}][BillTo]`,
											branchName
										);
									} else if (value == "Attention Party") {
										var branchName = $(
											`#${formNameLowerCase}attentionparty-branchcode`
										).val();
										$.each(
											fields[index]["ChargesItem"],
											function (key2, value2) {
												if (value2.name == "BillTo") {
													fields[index]["ChargesItem"][key2]["options"] =
														arrayCompanyBranch;
													update(fields);
												}
											}
										);
										setValue(
											`${props.formName}HasContainerType` +
												"[" +
												props.containerIndex +
												"]" +
												`[${props.formName}HasCharges][${index}][BillTo]`,
											branchName
										);
									} else if (value == "Bill To") {
										var branchName = $(
											`#${formNameLowerCase}billto-branchcode`
										).val();
										$.each(
											fields[index]["ChargesItem"],
											function (key2, value2) {
												if (value2.name == "BillTo") {
													fields[index]["ChargesItem"][key2]["options"] =
														arrayCompanyBranch;
													update(fields);
												}
											}
										);
										setValue(
											`${props.formName}HasContainerType` +
												"[" +
												props.containerIndex +
												"]" +
												`[${props.formName}HasCharges][${index}][BillTo]`,
											branchName
										);
									} else {
										var type = value.toLowerCase();
										var branchName = $(
											`#${formNameLowerCase}` + type + "-branchcode"
										).val();
										$.each(
											fields[index]["ChargesItem"],
											function (key2, value2) {
												if (value2.name == "BillTo") {
													fields[index]["ChargesItem"][key2]["options"] =
														arrayCompanyBranch;
													update(fields);
												}
											}
										);

										setValue(
											`${props.formName}HasContainerType` +
												"[" +
												props.containerIndex +
												"]" +
												`[${props.formName}HasCharges][${index}][BillTo]`,
											branchName
										);
									}
								});
							} else {
								setOnChangeBillToType({
									e,
									arrayCompanyBranch,
									containerIndex,
									chargesIndex,
								});
								setValue(
									`${props.formName}HasContainerType` +
										"[" +
										props.containerIndex +
										"]" +
										`[${props.formName}Charges][${index}][BillTo]`,
									""
								);
								$.each(fields[index]["ChargesItem"], function (key2, value2) {
									if (value2.name == "BillTo") {
										fields[index]["ChargesItem"][key2]["options"] = [];
										update(fields);
									}
								});
							}
						}, 100);
					}
				}
			});

			$(".ChargesCodeBreakDownParent").on("click", function (e) {
				if (countForBlock == 1) {
					if ($(e.target).prop("checked")) {
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".ChargesCodeBreakDownChild")
							.prop("checked", true);
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".ChargesCodeBreakDownChild")
							.next()
							.val("1");
					} else {
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".ChargesCodeBreakDownChild")
							.prop("checked", false);
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".ChargesCodeBreakDownChild")
							.next()
							.val("0");
					}
				}
			});
			$(".PricingBreakDownParent").on("click", function (e) {
				if (countForBlock == 1) {
					if ($(e.target).prop("checked")) {
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".PricingBreakDownChild")
							.prop("checked", true);
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".PricingBreakDownChild")
							.next()
							.val("1");
					} else {
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".PricingBreakDownChild")
							.prop("checked", false);
						$(e.target)
							.closest(".insidecharges-item")
							.next()
							.find(".PricingBreakDownChild")
							.next()
							.val("0");
					}
				}
			});

			$(".ParentExchangeRate").on("blur", function (e) {
				if (countForBlock == 1) {
					$(e.target)
						.closest(".insidecharges-item")
						.next()
						.find(".ChildExchangeRate")
						.val($(e.target).val());
				}
			});

			return () => {
				setCount(0);
				countForBlock = 0;
			};
		}, [fields]);

		useEffect(() => {
			// onChange Container Quantity
			var childLenght = $(
				`input[name='${props.formName}HasContainerType` +
					"[" +
					props.containerIndex +
					"][ContainerType]"
			)
				.closest("tr")
				.next()
				.find(".insidecharges-item")
				.children().length;
			if (childLenght > 0) {
				if (props.quantity.index == props.containerIndex) {
					for (var index = 0; index < childLenght; index++) {
						setValue(
							`${props.formName}HasContainerType` +
								"[" +
								props.containerIndex +
								"]" +
								`[${props.formName}HasCharges][${index}][Qty]`,
							$(props.quantity.val.target).val()
						);
					}
				}
			}
			return () => {};
		}, [props.quantity]);

		useEffect(() => {
			if (calculateIndex !== "") {
				handleCalculate(calculateIndex);
				setCalculateIndex("");
			}
		}, [calculateIndex]);

		useEffect(() => {
			remove();

			$.each(props.loadTariffState, function (key, value) {
				if (props.containerIndex == key) {
					var tempCharges = chargesColumn;
					setIndexBeforeAppend(key);

					$.each(tempCharges, function (key3, value3) {
						if (value3.columnName == "Charges Code") {
							tempCharges[key3]["options"] = sortArray(
								props.combinedChargesOptions[key]
							);
						}
						if (value3.columnName == "Qty") {
							tempCharges[key3]["defaultValue"] = $(
								`input[name='${props.formName}HasContainerType[${key}][Qty]']`
							).val();
						}
					});
					if (
						$(`input[name='${props.formName}HasContainerType[${key}][Qty]']`)
							.closest("tr")
							.find(".ChargesDisplay")
							.children()
							.hasClass("fa-plus")
					) {
						$(`input[name='${props.formName}HasContainerType[${key}][Qty]']`)
							.closest("tr")
							.find(".ChargesDisplay")
							.click();
					}
					$.each(value.tariffHasContainerTypeCharges, function (key2, value2) {
						var listUOM = [];
						var ArrayUOM = [];

						var stringuom = value2.chargesCode.UOM;

						if (stringuom != null) {
							listUOM = stringuom.split(",");

							try {
								$.each(listUOM, function (key4, value4) {
									ArrayUOM.push({value: value4, label: value4});
								});
							} catch (err) {}
						}

						$.each(tempCharges, function (key3, value3) {
							if (value3.columnName == "UOM") {
								tempCharges[key3]["options"] = sortArray(ArrayUOM);
							}
						});

						value2[
							"Name"
						] = `${props.formName}HasContainerType[${key}][${props.formName}HasCharges]`;
						value2["Qty"] = $(
							`input[name='${props.formName}HasContainerType[${key}][Qty]']`
						).val();
						value2["CustomerType"] = "Bill To";
						value2["ChargesOption"] = sortArray(
							props.combinedChargesOptions[key]
						);
						value2["ChargesItem"] = tempCharges;
						value2["UnitPrice"] = value2.ReferencePrice;
						value2["Currency"] = value2.CurrencyType;
						append(value2);
						handleCalculate(key2);
						var val = {value: value2.CurrencyType};
						handleChangeCurrency(val, key2);
						if (value2.tariffHasContainerTypeCharges.length > 0) {
							setTimeout(() => {
								$(
									`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][UnitPrice]']`
								).prop("readonly", true);
								$(
									`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][Discount]']`
								).prop("readonly", true);
							}, 100);
						}
					});
				}
			});
		}, [props.loadTariffState]);

		useEffect(() => {
			var key = props.singleloadTariffState.indexContainer;
			if (props.containerIndex == key) {
				remove();
				var tempCharges = chargesColumn;
				setIndexBeforeAppend(key);

				$.each(tempCharges, function (key3, value3) {
					if (value3.columnName == "Charges Code") {
						tempCharges[key3]["options"] = sortArray(
							props.combinedChargesOptions[key]
						);
					}
					if (value3.columnName == "Qty") {
						tempCharges[key3]["defaultValue"] = $(
							`input[name='${props.formName}HasContainerType[${key}][Qty]']`
						).val();
					}
				});
				if (
					$(`input[name='${props.formName}HasContainerType[${key}][Qty]']`)
						.closest("tr")
						.find(".ChargesDisplay")
						.children()
						.hasClass("fa-plus")
				) {
					$(`input[name='${props.formName}HasContainerType[${key}][Qty]']`)
						.closest("tr")
						.find(".ChargesDisplay")
						.click();
				}
				$.each(
					props.singleloadTariffState.tariffHasContainerTypeCharges,
					function (key2, value2) {
						var listUOM = [];
						var ArrayUOM = [];

						var stringuom = value2.chargesCode.UOM;

						if (stringuom != null) {
							listUOM = stringuom.split(",");

							try {
								$.each(listUOM, function (key4, value4) {
									ArrayUOM.push({value: value4, label: value4});
								});
							} catch (err) {}
						}

						$.each(tempCharges, function (key3, value3) {
							if (value3.columnName == "UOM") {
								tempCharges[key3]["options"] = sortArray(ArrayUOM);
							}
						});

						value2[
							"Name"
						] = `${props.formName}HasContainerType[${key}][${props.formName}HasCharges]`;
						value2["Qty"] = $(
							`input[name='${props.formName}HasContainerType[${key}][Qty]']`
						).val();
						value2["CustomerType"] = "Bill To";
						value2["ChargesOption"] = sortArray(
							props.combinedChargesOptions[key]
						);
						value2["ChargesItem"] = tempCharges;
						value2["UnitPrice"] = value2.ReferencePrice;
						value2["Currency"] = value2.CurrencyType;
						append(value2);
						handleCalculate(key2);
						var val = {value: value2.CurrencyType};
						handleChangeCurrency(val, key2);
						if (value2.tariffHasContainerTypeCharges.length > 0) {
							setTimeout(() => {
								$(
									`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][UnitPrice]']`
								).prop("readonly", true);
								$(
									`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][Discount]']`
								).prop("readonly", true);
							}, 100);
						}
					}
				);
			}
		}, [props.singleloadTariffState]);

		useEffect(() => {
			if (props.containerTypeAndChargesData.length > 0) {
				setUpdateChargesFillData(props.containerTypeAndChargesData);
			}
		}, [props.containerTypeAndChargesData]);

		useEffect(() => {
			if (props.removeState.length <= 0) {
				if (updateChargesFillData.length >= 1) {
					remove();
					$.each(updateChargesFillData, function (key, value) {
						if (props.containerIndex == key) {
							// if($(`input[name='${props.formName}HasContainerType[${key}][Qty]']`).closest("tr").find(".ChargesDisplay").children().hasClass("fa-plus")){
							//     if(!props.barge){
							//         $(`input[name='${props.formName}HasContainerType[${key}][Qty]']`).closest("tr").find(".ChargesDisplay").click()
							//     }
							// }
							var ChargesOptions = [];

							$.each(
								value[`Select${props.formName}HasCharges`],
								function (key2, value2) {
									if (value2.portCode) {
										ChargesOptions.push({
											value: value2.ChargesUUID,
											label:
												value2.ChargesCode +
												"(" +
												value2.portCode.PortCode +
												")",
										});
									} else {
										ChargesOptions.push({
											value: value2.ChargesUUID,
											label: value2.ChargesCode,
										});
									}
								}
							);

							var tempCharges = chargesColumn;
							setIndexBeforeAppend(key);
							$.each(tempCharges, function (key3, value3) {
								if (value3.columnName == "Charges Code") {
									tempCharges[key3]["options"] = sortArray(ChargesOptions);
								}
								if (value3.columnName == "Qty") {
									tempCharges[key3]["defaultValue"] = $(
										`input[name='${props.formName}HasContainerType[${key}][Qty]']`
									).val();
								}
							});
							if (
								$(
									`input[name='${props.formName}HasContainerType[${key}][Qty]']`
								)
									.closest("tr")
									.find(".ChargesDisplay")
									.children()
									.hasClass("fa-plus")
							) {
								if (!props.barge) {
									$(
										`input[name='${props.formName}HasContainerType[${key}][Qty]']`
									)
										.closest("tr")
										.find(".ChargesDisplay")
										.click();
								}
							}
							$.each(
								value[`${props.formName}HasCharges`],
								function (key2, value2) {
									var stringuom;
									var listUOM = [];
									var ArrayUOM = [];
									var parentuom;
									$.each(value2.SelectNestedCharges, function (key8, value8) {
										if (value2.ChargesCode == value8.ChargesUUID) {
											stringuom = value8.UOM;
										}
									});

									if (stringuom != null) {
										listUOM = stringuom.split(",");

										try {
											$.each(listUOM, function (key4, value4) {
												if (key4 == 0) {
													parentuom = value;
												}
												ArrayUOM.push({value: value4, label: value4});
											});
										} catch (err) {}
									}
									$.each(tempCharges, function (key3, value3) {
										if (value3.columnName == "UOM") {
											tempCharges[key3]["options"] = sortArray(ArrayUOM);
										}
										if (value3.columnName == "Charges Code Break Down") {
											if (value2.ChargesCodeBreakDown == 1) {
												tempCharges[key3]["defaultValue"] = 1;
											} else {
												tempCharges[key3]["defaultValue"] = 0;
											}
										}
										if (value3.columnName == "Pricing Break Down") {
											if (value2.PricingBreakDown == 1) {
												tempCharges[key3]["defaultValue"] = 1;
											} else {
												tempCharges[key3]["defaultValue"] = 0;
											}
										}
									});

									value2[
										"Name"
									] = `${props.formName}HasContainerType[${key}][${props.formName}HasCharges]`;
									value2["ChargesOption"] = sortArray(ChargesOptions);
									value2["ChargesItem"] = tempCharges;

									if (value2.billOfLading) {
										value2["Vessel"] = value2.billOfLading.VesselCode;
										value2["Voyage"] = value2.billOfLading.VoyageName;
										value2["Shipper"] = value2.billOfLadingShipper.CompanyName;
										value2["Consignee"] =
											value2.billOfLadingConsignee.CompanyName;
									} else if (value2.bookingConfirmation) {
										value2["Vessel"] = value2.bookingConfirmation.VesselCode;
										value2["Voyage"] = value2.bookingConfirmation.VoyageName;
										value2["Shipper"] =
											value2.bookingConfirmationShipper.CompanyName;
										value2["Consignee"] =
											value2.bookingConfirmationConsignee.CompanyName;
									}

									append(value2);

									setTimeout(() => {
										$(
											`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][${props.formName}ChargesUUID]']`
										)
											.closest("tr")
											.find(".ParentChargesDescriptionReadonly")
											.val(value2.ChargesDescription);
										if (value2.ChargesCodeBreakDown == 1) {
											$(
												`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][ChargesCodeBreakDown]']`
											)
												.prev()
												.prop("checked", true);
										}
										if (value2.PricingBreakDown == 1) {
											$(
												`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][PricingBreakDown]']`
											)
												.prev()
												.prop("checked", true);
										}
										handleCalculate(key2);
										setFilledUpdateData(true);
									}, 50);
									if (value2.NestedCharges) {
										if (value2.NestedCharges.length > 0) {
											setTimeout(() => {
												$(
													`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][UnitPrice]']`
												).prop("readonly", true);
												$(
													`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][Discount]']`
												).prop("readonly", true);
											}, 100);
										}
									}
									if (props.formName == "SalesInvoice") {
										if (formContext.formState.formType == "Update") {
											if (formContext.verificationStatus == "Approved") {
												formContext.ApprovedStatusReadOnlyForAllFields();
											} else {
												formContext.RemoveAllReadOnlyFields();
											}
										}
									}
								}
							);
						}
					});
				}
			}
		}, [updateChargesFillData]);

		useEffect(() => {
			if (props.removeState.length <= 0) {
				if (props.removeStateRerender) {
					remove();
					$.each(props.removeStateRerender, function (key, value) {
						if (props.containerIndex == key) {
							var ChargesOptions = [];
							$.each(
								props.combinedChargesOptions[key],
								function (key2, value2) {
									ChargesOptions.push({
										value: value2.value,
										label: value2.label,
									});
								}
							);
							var tempCharges = chargesColumn;
							setIndexBeforeAppend(key);
							$.each(tempCharges, function (key3, value3) {
								if (value3.columnName == "Charges Code") {
									tempCharges[key3]["options"] = sortArray(ChargesOptions);
								}
								if (value3.columnName == "Qty") {
									tempCharges[key3]["defaultValue"] = $(
										`input[name='${props.formName}HasContainerType[${key}][Qty]']`
									).val();
								}
							});

							$.each(
								value[`${props.formName}HasCharges`],
								function (key2, value2) {
									$.each(tempCharges, function (key3, value3) {
										if (value3.columnName == "UOM") {
											tempCharges[key3]["options"] = sortArray(value2.uOM);
										}
										if (value3.columnName == "Charges Code Break Down") {
											if (value2.ChargesCodeBreakDown == 1) {
												tempCharges[key3]["defaultValue"] = 1;
											} else {
												tempCharges[key3]["defaultValue"] = 0;
											}
										}
										if (value3.columnName == "Pricing Break Down") {
											if (value2.PricingBreakDown == 1) {
												tempCharges[key3]["defaultValue"] = 1;
											} else {
												tempCharges[key3]["defaultValue"] = 0;
											}
										}
										if (value3.columnName == "Bill To Type") {
											if (value2.CustomerType) {
												tempCharges[key3]["defaultValue"] = value2.CustomerType;
											}
										}
										if (value3.columnName == "Bill To") {
											tempCharges[key3]["options"] = value2.billTo;
										}
									});

									value2[
										"Name"
									] = `${props.formName}HasContainerType[${key}][${props.formName}HasCharges]`;
									value2["ChargesOption"] = sortArray(ChargesOptions);
									value2["ChargesItem"] = tempCharges;

									append(value2);
									handleCalculate(key2);

									setTimeout(() => {
										$(
											`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][${props.formName}HasChargesUUID]']`
										)
											.closest("tr")
											.find(".ParentChargesDescriptionReadonly")
											.val(value2.ChargesDescription);
										if (value2.ChargesCodeBreakDown == 1) {
											$(
												`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][ChargesCodeBreakDown]']`
											)
												.prev()
												.prop("checked", true);
										}
										if (value2.PricingBreakDown == 1) {
											$(
												`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][PricingBreakDown]']`
											)
												.prev()
												.prop("checked", true);
										}
										setUpdateChargesFillData([]);
									}, 50);
									if (value2.NestedCharges) {
										if (value2.NestedCharges.length > 0) {
											setTimeout(() => {
												$(
													`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][UnitPrice]']`
												).prop("readonly", true);
												$(
													`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][Discount]']`
												).prop("readonly", true);
											}, 100);
										}
									} else if (props.formName == "BookingReservation") {
										if (
											formContext.formState.formType == "SplitBR" ||
											formContext.formState.formType == "MergeBR"
										) {
											setTimeout(() => {
												// after append
												$(
													`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][Qty]']`
												).val(value.Qty);
												setValue(
													`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][Qty]']`,
													value.Qty
												);
											}, 500);
										}
									}
								}
							);
						}
					});
				}
			}
		}, [props.removeStateRerender]);

		useEffect(() => {
			if (!formContext.formState.formNewClicked) {
				if (props.chargesDiscriptions) {
					$.each(props.chargesDiscriptions.data, function (key, value) {
						if (props.containerIndex == key) {
							if (value) {
								$.each(
									value.BookingConfirmationCharges,
									function (key2, value2) {
										if (value2) {
											$(
												`input[name='${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][${props.formName}ChargesUUID]']`
											)
												.closest("tr")
												.find(".ParentChargesDescriptionReadonly")
												.val(value2.ChargesDescription);
											setValue(
												`${props.formName}HasContainerType[${props.containerIndex}][${props.formName}HasCharges][${key2}][ChargesDescription]`,
												value2.ChargesDescription
											);
										}
									}
								);
							}
						}
					});
				}
			}
		}, [props.chargesDiscriptions]);

		useEffect(() => {
			if (
				formContext.formState.formType == "New" &&
				formContext.formState.formNewClicked == true
			) {
				// remove()
				if (!props.transferPartial) {
					setUpdateChargesFillData([]);
				}
			}
		}, [formContext.formState]);

		useEffect(() => {
			return () => {};
		}, []);

		return (
			<>
				<td colSpan='25'>
					<div className=' p-3'>
						<div className='Charges-repeater ml-2'>
							<div
								className='btn-group float-left mb-2 columnchooserdropdown columnchooserdropdowncharges'
								id='columnchooserdropdown'>
								<button
									type='button'
									className='btn btn-secondary btn-xs dropdown-toggle'
									data-toggle='dropdown'
									aria-haspopup='true'
									aria-expanded='false'>
									<i
										className='fa fa-th-list'
										data-toggle='tooltip'
										data-placement='top'
										title='Column Chooser'></i>
								</button>
								<div className='dropdown-menu dropdown-menu-left scrollable-columnchooser dragtablecolumnchoosercharges'>
									{chargesColumn.map((item, index) => {
										return props.transferPartial ? (
											props.transferPartial == "SalesDebitNote" ? (
												<label
													key={index}
													className='dropdown-item dropdown-item-marker'>
													{item.defaultChecked ? (
														<input
															type='checkbox'
															className='columnchooserdropdowncharges transferPartialDN keep-enabled'
															defaultChecked
														/>
													) : (
														<input
															type='checkbox'
															className='columnchooserdropdowncharges transferPartialDN keep-enabled'
														/>
													)}
													{item.columnName}
												</label>
											) : (
												<label
													key={index}
													className='dropdown-item dropdown-item-marker'>
													{item.defaultChecked ? (
														<input
															type='checkbox'
															className='columnchooserdropdowncharges transferPartialCN keep-enabled'
															defaultChecked
														/>
													) : (
														<input
															type='checkbox'
															className='columnchooserdropdowncharges transferPartialCN keep-enabled'
														/>
													)}
													{item.columnName}
												</label>
											)
										) : (
											<label
												key={index}
												className='dropdown-item dropdown-item-marker'>
												{item.defaultChecked ? (
													<input
														type='checkbox'
														className='columnchooserdropdowncharges keep-enabled'
														defaultChecked
													/>
												) : (
													<input
														type='checkbox'
														className='columnchooserdropdowncharges keep-enabled'
													/>
												)}
												{item.columnName}
											</label>
										);
									})}
								</div>
							</div>
							<div className='table_wrap'>
								<div className='table_wrap_inner'>
									<table className='table table-bordered Charges charges-items'>
										<thead>
											<tr>
												{fields.length > 0
													? fields[0].ChargesItem.map((item, index) => {
															return (
																<th key={item.id} className={item.class}>
																	{item.columnName}
																</th>
															);
													  })
													: chargesColumn.map((item, index) => {
															return (
																<th key={item.id} className={item.class}>
																	{item.columnName}
																</th>
															);
													  })}
											</tr>
										</thead>
										<tbody className='Charges charges-item'>
											{fields.map((item, index) => {
												return (
													<>
														<tr key={item.id} className='insidecharges-item'>
															{item.ChargesItem.map((item2, index2) => {
																if (item2.inputType == "input") {
																	return (
																		<td className={item2.class}>
																			<input
																				defaultValue=''
																				readOnly={
																					item2.readOnly
																						? item2.readOnly
																						: false
																				}
																				{...register(
																					`${props.formName}HasContainerType` +
																						"[" +
																						props.containerIndex +
																						"]" +
																						`[${props.formName}HasCharges][${index}][${item2.name}]`
																				)}
																				className={`form-control ${
																					item2.fieldClass
																						? item2.fieldClass
																						: ""
																				}`}
																				onBlur={(val) => {
																					val
																						? item2.onBlur(val, index)
																						: item2.onBlur(null, index);
																				}}
																			/>
																		</td>
																	);
																}

																if (item2.inputType == "number") {
																	return (
																		<td className={item2.class}>
																			<input
																				type='number'
																				defaultValue={
																					item2.defaultValue
																						? item2.defaultValue
																						: ""
																				}
																				readOnly={
																					item2.readOnly
																						? item2.readOnly
																						: false
																				}
																				{...register(
																					`${props.formName}HasContainerType` +
																						"[" +
																						props.containerIndex +
																						"]" +
																						`[${props.formName}HasCharges][${index}][${item2.name}]`
																				)}
																				onBlur={(val) => {
																					val
																						? item2.onBlur(val, index)
																						: item2.onBlur(null, index);
																				}}
																				className={`form-control ${
																					item2.fieldClass
																						? item2.fieldClass
																						: ""
																				}`}
																			/>
																		</td>
																	);
																}

																if (item2.inputType == "checkbox") {
																	return (
																		<td
																			className={item2.class}
																			style={{
																				textAlign: "center",
																				verticalAlign: "middle",
																			}}>
																			<input
																				type={"checkbox"}
																				disabled={item2.disabled}
																				defaultValue={
																					item2.defaultValue == 1 ? "1" : "0"
																				}
																				className={`mt-2 ${
																					item2.fieldClass
																						? item2.fieldClass
																						: ""
																				}`}
																				onChange={CheckBoxHandle}></input>
																			<input
																				type={"hidden"}
																				defaultValue={
																					item2.defaultValue == 1 ? "1" : "0"
																				}
																				className=''
																				{...register(
																					`${props.formName}HasContainerType` +
																						"[" +
																						props.containerIndex +
																						"]" +
																						`[${props.formName}HasCharges][${index}][${item2.name}]`
																				)}
																			/>
																		</td>
																	);
																}

																if (item2.inputType == "single-select") {
																	if (index2 == 0) {
																		return (
																			<td className={item2.class}>
																				<input
																					type='hidden'
																					id=''
																					{...register(
																						`${props.formName}HasContainerType` +
																							"[" +
																							props.containerIndex +
																							"]" +
																							`[${props.formName}HasCharges][${index}][${props.formName}ChargesUUID]`
																					)}></input>
																				<div className='row'>
																					{props.barge ? (
																						<>
																							{props.transferPartial && (
																								<input
																									type='checkbox'
																									className='ml-3 mt-2 checkboxCharges keep-enabled'></input>
																							)}
																							{props.barge ? (
																								""
																							) : (
																								<button
																									type='button'
																									style={{
																										position: "relative",
																										left: "8px",
																										top: "2px",
																									}}
																									className='btn btn-xs ml-2 ChargesDisplay'>
																									<i
																										className='fas fa-plus'
																										data-toggle='tooltip'
																										title='Expand'></i>
																								</button>
																							)}

																							{!props.transferPartial && (
																								<div className='dropdown float-left ml-2 dropdownbar'>
																									<button
																										style={{
																											position: "relative",
																											left: "0px",
																											top: "1px",
																										}}
																										className='btn btn-xs btn-secondary dropdown-toggle float-right'
																										type='button'
																										data-toggle='dropdown'
																										aria-haspopup='true'
																										aria-expanded='false'>
																										<i
																											className='fa fa-ellipsis-v'
																											data-hover='tooltip'
																											data-placement='top'
																											title='Options'></i>
																									</button>
																									<div
																										className='dropdown-menu'
																										aria-labelledby='dropdownMenuButton'>
																										<button
																											data-repeater-delete
																											className='dropdown-item RemoveCharges'
																											type='button'
																											onClick={() =>
																												remove(index)
																											}>
																											Remove
																										</button>
																									</div>
																								</div>
																							)}
																						</>
																					) : (
																						<div className='row'>
																							{props.transferPartial && (
																								<input
																									type='checkbox'
																									className='ml-3 mt-2 checkboxCharges keep-enabled'></input>
																							)}
																							{props.barge ? (
																								""
																							) : (
																								<button
																									type='button'
																									style={{
																										position: "relative",
																										left: "8px",
																										top: "2px",
																									}}
																									className='btn btn-xs ml-2 ChargesDisplay'>
																									<i
																										className='fas fa-plus'
																										data-toggle='tooltip'
																										title='Expand'></i>
																								</button>
																							)}

																							{!props.transferPartial && (
																								<div className='dropdown float-left ml-1 dropdownbar'>
																									<button
																										style={{
																											position: "relative",
																											left: "0px",
																											top: "1px",
																										}}
																										className='btn btn-xs btn-secondary dropdown-toggle float-right'
																										type='button'
																										data-toggle='dropdown'
																										aria-haspopup='true'
																										aria-expanded='false'>
																										<i
																											className='fa fa-ellipsis-v'
																											data-hover='tooltip'
																											data-placement='top'
																											title='Options'></i>
																									</button>
																									<div
																										className='dropdown-menu'
																										aria-labelledby='dropdownMenuButton'>
																										<button
																											className='dropdown-item     d-none'
																											type='button'>
																											Duplicate
																										</button>
																										<button
																											className='dropdown-item add-chargesNestedfake'
																											type='button'
																											onClick={() =>
																												AppendNestedCharges(
																													index
																												)
																											}>
																											Add Nested Charges
																										</button>
																										<button
																											data-repeater-delete
																											className='dropdown-item RemoveCharges'
																											type='button'
																											onClick={() =>
																												remove(index)
																											}>
																											Remove
																										</button>
																									</div>
																								</div>
																							)}
																						</div>
																					)}

																					<div
																						className={
																							props.barge
																								? "col-md-10"
																								: "col-md-9"
																						}
																						style={{
																							paddingLeft: "10px",
																							paddingRight: "0px",
																						}}>
																						<Controller
																							name={
																								`${props.formName}HasContainerType` +
																								"[" +
																								props.containerIndex +
																								"]" +
																								`[${props.formName}HasCharges][${index}][${item2.name}]`
																							}
																							control={control}
																							render={({
																								field: {onChange, value},
																							}) => (
																								<Select
																									isClearable={true}
																									{...register(
																										`${props.formName}HasContainerType` +
																											"[" +
																											props.containerIndex +
																											"]" +
																											`[${props.formName}HasCharges][${index}][${item2.name}]`
																									)}
																									value={
																										value
																											? item2.options.find(
																													(c) =>
																														c.value === value
																											  )
																											: null
																									}
																									onChange={(val) => {
																										val == null
																											? onChange(null)
																											: onChange(val.value);
																										item2.onChange &&
																											item2.onChange(
																												val,
																												index
																											);
																									}}
																									options={item2.options}
																									isOptionDisabled={(
																										selectedValue
																									) =>
																										selectedValue.selected ==
																										true
																									}
																									onMenuOpen={() => {
																										handleOpenMenu(
																											item2.name,
																											item2.options,
																											props.containerIndex,
																											index
																										);
																									}}
																									menuPortalTarget={
																										document.body
																									}
																									className={`basic-single ${
																										item2.fieldClass
																											? item2.fieldClass
																											: ""
																									} `}
																									classNamePrefix='select'
																									onKeyDown={handleKeydown}
																									styles={
																										props.globalContext
																											.customStyles
																									}
																								/>
																							)}
																						/>
																					</div>
																				</div>
																			</td>
																		);
																	} else {
																		return (
																			<td className={item2.class}>
																				<Controller
																					name={
																						`${props.formName}HasContainerType` +
																						"[" +
																						props.containerIndex +
																						"]" +
																						`[${props.formName}HasCharges][${index}][${item2.name}]`
																					}
																					control={control}
																					render={({
																						field: {onChange, value},
																					}) => (
																						<Select
																							isClearable={true}
																							{...register(
																								`${props.formName}HasContainerType` +
																									"[" +
																									props.containerIndex +
																									"]" +
																									`[${props.formName}HasCharges][${index}][${item2.name}]`
																							)}
																							value={
																								value
																									? item2.options
																										? item2.options.find(
																												(c) => c.value === value
																										  )
																										: null
																									: null
																							}
																							onChange={(val) => {
																								val == null
																									? onChange(null)
																									: onChange(val.value);
																								item2.onChange &&
																									item2.onChange(val, index);
																							}}
																							options={item2.options}
																							menuPortalTarget={document.body}
																							isOptionDisabled={(
																								selectedValue
																							) =>
																								selectedValue.selected == true
																							}
																							className={`basic-single ${
																								item2.fieldClass
																									? item2.fieldClass
																									: ""
																							}`}
																							classNamePrefix='select'
																							onKeyDown={handleKeydown}
																							styles={
																								props.globalContext.customStyles
																							}
																						/>
																					)}
																				/>
																				{item2.columnName == "UOM" ||
																				item2.columnName == "Bill To" ? (
																					<input
																						type='hidden'
																						id='select-options'
																						value={JSON.stringify(
																							item2.options
																						)}
																					/>
																				) : (
																					""
																				)}
																			</td>
																		);
																	}
																}
																if (
																	item2.inputType == "select-withCurrencyModal"
																) {
																	return (
																		<td className={item2.class}>
																			<div className='input-group'>
																				<div className='row'>
																					<div
																						className='col-md-10'
																						style={{paddingRight: "1px"}}>
																						<Controller
																							name={
																								`${props.formName}HasContainerType` +
																								"[" +
																								props.containerIndex +
																								"]" +
																								`[${props.formName}HasCharges][${index}][${item2.name}]`
																							}
																							control={control}
																							render={({
																								field: {onChange, value},
																							}) => (
																								<Select
																									isClearable={true}
																									{...register(
																										`${props.formName}HasContainerType` +
																											"[" +
																											props.containerIndex +
																											"]" +
																											`[${props.formName}HasCharges][${index}][${item2.name}]`
																									)}
																									value={
																										value
																											? item2.options.find(
																													(c) =>
																														c.value === value
																											  )
																											: null
																									}
																									onChange={(val) => {
																										val == null
																											? onChange(null)
																											: onChange(val.value);
																										item2.onChange &&
																											item2.onChange(
																												val,
																												index
																											);
																									}}
																									options={item2.options}
																									menuPortalTarget={
																										document.body
																									}
																									isOptionDisabled={(
																										selectedValue
																									) =>
																										selectedValue.selected ==
																										true
																									}
																									className={`basic-single ${
																										item2.fieldClass
																											? item2.fieldClass
																											: ""
																									}`}
																									classNamePrefix='select'
																									onKeyDown={handleKeydown}
																									styles={
																										props.globalContext
																											.customStyles
																									}
																								/>
																							)}
																						/>
																					</div>
																					<div
																						className='col-md-2'
																						style={{
																							paddingLeft: "0px",
																							paddingTop: "1px",
																						}}>
																						<div
																							className='input-group-append'
																							style={{cursor: "pointer"}}
																							onClick={openModalCurrencyRate}>
																							<span className='input-group-text'>
																								<i
																									className='fa fa-search'
																									aria-hidden='true'></i>
																							</span>
																						</div>
																					</div>
																				</div>
																			</div>
																		</td>
																	);
																}

																if (item2.inputType == "input-Modal") {
																	return (
																		<td className={item2.class}>
																			<input
																				type='text'
																				className={`form-control ${
																					item2.fieldClass
																						? item2.fieldClass
																						: ""
																				}`}
																				onClick={props.openTextAreaModal}
																				style={{cursor: "pointer"}}
																				readOnly={
																					item2.readOnly
																						? item2.readOnly
																						: false
																				}
																			/>
																			<div className='modal fade'>
																				<div className='modal-dialog'>
																					<div className='modal-content'>
																						<div className='modal-header'>
																							<h4 className='modal-title'>
																								{item2.columnName}
																							</h4>
																							<button
																								type='button'
																								className='close'
																								data-dismiss='modal'>
																								×
																							</button>
																						</div>

																						<div className='modal-body'>
																							<div className='form-group'>
																								<textarea
																									id=''
																									className={`form-control ${item2.modelClass}`}
																									{...register(
																										`${props.formName}HasContainerType` +
																											"[" +
																											props.containerIndex +
																											"]" +
																											`[${props.formName}HasCharges][${index}][${item2.name}]`
																									)}
																									onBlur={(val) => {
																										val
																											? item2.onBlur(val, index)
																											: item2.onBlur(
																													null,
																													index
																											  );
																									}}
																									rows='5'
																									placeholder={`Enter ${item2.columnName}`}
																									readOnly={true}></textarea>
																							</div>
																						</div>

																						<div className='modal-footer'>
																							<button
																								type='button'
																								className='btn btn-secondary'
																								data-dismiss='modal'>
																								Close
																							</button>
																						</div>
																					</div>
																				</div>
																			</div>
																		</td>
																	);
																}
															})}
														</tr>
														<tr className={"NestedChargesTR d-none"}>
															<NestedTableNestedChargesINV
																transferPartial={props.transferPartial}
																formName={props.formName}
																containerIndex={props.containerIndex}
																chargesIndex={index}
																globalContext={props.globalContext}
																combinedChargesOptions={
																	props.combinedChargesOptions
																}
																setCombinedChargesOptions={
																	props.setCombinedChargesOptions
																}
																appendNestedCharges={appendNestedCharges}
																setAppendNestedCharges={setAppendNestedCharges}
																chargesDiscriptions={props.chargesDiscriptions}
																openTextAreaModal={props.openTextAreaModal}
																onChangeContainerTypeCharges={
																	props.onChangeContainerTypeCharges
																}
																containerChangeIndex={
																	props.containerChangeIndex
																}
																onChangePortCode={onChangePortCode}
																onChangeFreightTerm={onChangeFreightTerm}
																onChangeChargesDescription={
																	onChangeChargesDescription
																}
																onChangeTaxCode={onChangeTaxCode}
																onChangeCurrency={onChangeCurrency}
																onChangeBillToType={onChangeBillToType}
																onChangeBillTo={onChangeBillTo}
																quantity={props.quantity}
																chargesQuantityOnChange={
																	chargesQuantityOnChange
																}
																port={props.port}
																freightTerm={props.freightTerm}
																taxCode={props.taxCode}
																currency={props.currency}
																cargoType={props.cargoType}
																setValue={setValue}
																getValues={getValues}
																handleCalculate={handleCalculate}
																loadTariffState={props.loadTariffState}
																singleloadTariffState={
																	props.singleloadTariffState
																}
																containerTypeAndChargesData={
																	props.containerTypeAndChargesData
																}
																removeState={props.removeState}
															/>
														</tr>
													</>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
							{!props.transferPartial && (
								<button
									className='btn add-charges btn-success btn-xs'
									type='button'
									onClick={appendChargesHandle}>
									<i className='fa fa-plus'></i> Add Charges
								</button>
							)}
						</div>
					</div>
				</td>
			</>
		);
}

export default NestedTableChargesINV