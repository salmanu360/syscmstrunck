
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, GetGroupChargesByAreaContainer, GetChargesById, GetTaxCodeById,initHoverSelectDropownTitle } from '../../Components/Helper.js'
import Select from 'react-select';
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $ from "jquery";


function ContainerCharges(props) {
    const globalContext = useContext(GlobalContext);    
    
   
    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({});

    const [chargesColumnCookies, setChargesColumnCookies] = useState([])
            
  
    const [chargesType, setChargesType] = useState(props.chargesTypeOption)
    const [taxCode, setTaxCode] = useState(props.taxCodeOption)
    const [freightTerm, setFreightTerm] = useState(props.freightTermOption)
    const [currencyType, setCurrencyType] = useState(props.currencyTypeOption)

    const [chargesByContainer, setChargesByContainer] = useState(props.chargesByContainer)
    const [cookies, setCookies] = useState([])
    const [removeState, setRemoveState] = useState(false)
    const [blockAppend, setBlockAppend] = useState(false)
    
    const [defaultCurrency, setDefaultCurrency] = useState("----942c4cf1-d709-11eb-91d3-b42e998d11ff")

    initHoverSelectDropownTitle()

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

    const [childIndent, setChildIndent] = useState([])


    const chargesColumn = [
        { columnName: "Charges Code", inputType: "single-select", defaultChecked: true, name: "ChargesCode", class: "", options: [], onChange: handleChangeChargesCode },
        { columnName: "Charges Name", inputType: "input", defaultChecked: false, name: "ChargesName", class: "d-none" },
        { columnName: "Parent Charges", inputType: "single-select", defaultChecked: true, name: "ParentCharges", class: "", fieldClass: "ParentCharges", options: [], onChange: handleParentCharges },
        { columnName: "Charges Type", inputType: "single-select", defaultChecked: true, name: "ChargesType", class: "", options: [] },
        { columnName: "UOM", inputType: "single-select", defaultChecked: false, name: "UOM", class: "d-none", fieldClass: "UOM", options: UOMOptions },
        { columnName: "Account Code", inputType: "input", defaultChecked: false, name: "AccountCode", class: "d-none" },
        { columnName: "Amount", inputType: "input", defaultChecked: false, name: "ReferencePrice", class: "d-none",fieldClass:"Amount" },
        { columnName: "Reference Price", inputType: "input", defaultChecked: true, name: "ReferencePriceReadOnly", class: "",fieldClass:"ReferencePriceReadOnly",readOnly: true },
        { columnName: "Tax Code", inputType: "single-select", defaultChecked: true, name: "TaxCode", class: "", fieldClass: "TaxCode", options: [], onChange: handleChangeTaxCode },
        { columnName: "Tax Rate", inputType: "input", defaultChecked: false, name: "TaxRate", class: "d-none", readOnly: true },
        { columnName: "Min Price", inputType: "input", defaultChecked: true, name: "MinPrice", class: "", fieldClass: "MinPrice" },
        { columnName: "Freight Term", inputType: "single-select", defaultChecked: true, name: "FreightTerm", class: "", fieldClass: "FreightTerm", options: [], onChange: handleChangeFreightTerm },
        { columnName: "Currency Type", inputType: "single-select", defaultChecked: false, name: "CurrencyType",defaultValue:defaultCurrency ,class: "d-none", options: [] },
        { columnName: "Start date", inputType: "date", defaultChecked: false, name: "StartDate", class: "d-none" },
        { columnName: "End Date", inputType: "date", defaultChecked: false, name: "EndDate", class: "d-none" }

    ]

    if (getCookie('tariffchargescolumn')) {
        var getCookieArray = getCookie('tariffchargescolumn');
        var getCookieArray = JSON.parse(getCookieArray);

        $.each(chargesColumn, function (key, value) {
            value.defaultChecked = false
            value.class = "d-none"
        })

        $.each(getCookieArray, function (key, value) {
            $.each(chargesColumn, function (key2, value2) {

                if (value == key2) {
                    value2.defaultChecked = true
                    value2.class = ""
                }
            })
        })
    }

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }
    
    //onchange charges code
    function handleChangeChargesCode(val, containerIndex, index) {
        if (val) {
            var DefaultValue;

            GetChargesById(val.value, globalContext).then(res => {
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesName]`, res.data.ChargesName)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesType]`, res.data.ChargesType)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxCode]`, res.data.TaxCode)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxRate]`, res.data.TaxRate)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][FreightTerm]`, res.data.FreightTerm)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][MinPrice]`, res.data.MinPrice)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][AccountCode]`, res.data.AccountCode)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ReferencePriceReadOnly]`, res.data.ReferencePrice)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ReferencePrice]`, res.data.ReferencePrice)
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][CurrencyType]`, res.data.CurrencyType)


                var arrayUOM = res.data.UOM.split(",");
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][UOM]`, arrayUOM[0])
                $(".chargesTable").eq(containerIndex).find('tbody').children().eq(index).find(".ArrayUOM").val(res.data.UOM)
                //     $.each(arrayUOM, function (key, value) {
                //         if (key == 0) {
                //             DefaultValue = value;
                //         }

                //         htmlUOM += "<option value=" + value + ">" + value + "</option>";
                //     })

            })
        }else{
             setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesName]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesType]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxCode]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxRate]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][FreightTerm]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][MinPrice]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][AccountCode]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ReferencePriceReadOnly]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ReferencePrice]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][UOM]`, "")
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][CurrencyType]`,"")
        }


    }


    function removeContainerHandle(index) {
        remove(index)

       setRemoveState(true)
    }


    //onchange input
    function handleChangeInput(name, containerIndex, index, event) {
        //calculate sum of min price under same parent
      
        if (name == "MinPrice") {

            var ThisParentCharges = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ParentCharges]`)
            var Total = 0;
            setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][MinPrice]`, parseFloat(event.target.value).toFixed(4))
            $(".chargesTable").eq(containerIndex).find(".ParentCharges").each(function (key, value) {
                if ($(value).find(":hidden").val() == ThisParentCharges) {
                    Total = parseFloat(Total) + parseFloat(getValues(`TariffHasContainerTypeCharges[${containerIndex}][${key}][MinPrice]`))


                }
            })

            $(".chargesTable").eq(containerIndex).find(".ChargesCode").each(function (key, value) {
                if ($(value).find(":hidden").val() == ThisParentCharges) {
                    setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][MinPrice]`, parseFloat(Total).toFixed(4))


                }
            })
        }

        if (name == "ReferencePrice") {

            var ThisParentCharges = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ParentCharges]`)
            var Total = 0;
            setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ReferencePrice]`, parseFloat(event.target.value).toFixed(4))
            $(".chargesTable").eq(containerIndex).find(".ParentCharges").each(function (key, value) {
                if ($(value).find(":hidden").val() == ThisParentCharges) {
                    Total = parseFloat(Total) + parseFloat(getValues(`TariffHasContainerTypeCharges[${containerIndex}][${key}][ReferencePrice]`))


                }
            })

            $(".chargesTable").eq(containerIndex).find(".ChargesCode").each(function (key, value) {
                if ($(value).find(":hidden").val() == ThisParentCharges) {
                    setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][ReferencePrice]`, parseFloat(Total).toFixed(4))


                }
            })
        }

    }


    //onchange freight term
    function handleChangeFreightTerm(val, containerIndex, index) {

        if (val) {
            var ThisChargesCode = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesCode]`)
            $(".chargesTable").eq(containerIndex).find(".ParentCharges").each(function (key, value) {
                if ($(value).find(":hidden").val() == ThisChargesCode) {
                    setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][FreightTerm]`, val.value)
                }
            })
        }
        else {
            var ThisChargesCode = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesCode]`)
            $(".chargesTable").eq(containerIndex).find(".ParentCharges").each(function (key, value) {
                if ($(value).find(":hidden").val() == ThisChargesCode) {
                    setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][FreightTerm]`, "")
                }
            })
        }
    }


    //onchange tax code
    function handleChangeTaxCode(val, containerIndex, index) {

        if (val) {
            GetTaxCodeById(val.value, globalContext).then(res => {
                setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxRate]`, res.data.TaxRate)

                var ThisChargesCode = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesCode]`)


                $(".chargesTable").eq(containerIndex).find(".ParentCharges").each(function (key, value) {
                    if ($(value).find(":hidden").val() == ThisChargesCode) {
                        setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][TaxCode]`, val.value)
                        setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][TaxRate]`, res.data.TaxRate)
                    }
                })

            })


        }
        else {
            setValue(`TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxRate]`, "")
            var ThisChargesCode = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesCode]`)


            $(".chargesTable").eq(containerIndex).find(".ParentCharges").each(function (key, value) {
                if ($(value).find(":hidden").val() == ThisChargesCode) {
                    setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][TaxCode]`, "")
                    setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][TaxRate]`, "")
                }
            })
        }
    }

    //indent the charges according to parent and child condition
    function handleParentCharges(val, containerIndex, index) {
        var total = 0;
        var totalMin = 0;
        var totalReferencePriceReadOnly = 0;
        var array1 = [];
        if (val) {

            var parent=val.value
            var ParentList=[]
            var tempPreviousArray=[]
            total = parseFloat(total) + parseFloat($(".chargesTable").eq(containerIndex).find('tbody').children().eq(index).find(".Amount").val());
            totalMin = parseFloat(totalMin) + parseFloat($(".chargesTable").eq(containerIndex).find('tbody').children().eq(index).find(".MinPrice").val());
            totalReferencePriceReadOnly = parseFloat(totalReferencePriceReadOnly) + parseFloat($(".chargesTable").eq(containerIndex).find('tbody').children().eq(index).find(".ReferencePriceReadOnly").val());

            $(".chargesTable").eq(containerIndex).find('tbody').children().eq(index).find(".ChargesCode").find(".select__single-value").addClass("ml-4")
            $(`input[name='TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxCode]']`).parent().addClass("readOnlySelect")
            $(`input[name='TariffHasContainerTypeCharges[${containerIndex}][${index}][FreightTerm]']`).parent().addClass("readOnlySelect")

    
            setTimeout(() => {
                $(".chargesTable").eq(containerIndex).find(".ParentCharges").each(function (key,value) {
                  
                    if($(this).find(":hidden").val()!==""){
                        ParentList.push($(this).find(":hidden").val())
                    }
                   if ($(this).find(":hidden").val() == parent) {
                      tempPreviousArray.push($(this).find(":hidden").val())
                       var value = $(this).closest("td").parent().find(".Amount").val()
                       var valueMinPrice = $(this).closest("td").parent().find(".MinPrice").val()
                       var valueReferencePriceReadOnly = $(this).closest("td").parent().find(".ReferencePriceReadOnly").val()
   
                       $(this).closest("td").parent().find(".FreightTerm").addClass("readOnlySelect")
                     
                    
                       //setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][FreightTerm]`,parentFreightTerm)
                 
                       if (value == "") {
                           value = 0;
                       }
                       if (valueMinPrice == "") {
                           valueMinPrice = 0;
                       }
                       if (valueReferencePriceReadOnly == "") {
                           valueReferencePriceReadOnly = 0;
                       }
                    
                       if(tempPreviousArray.length==1){
                        total = parseFloat(value);
                        totalMin = parseFloat(valueMinPrice);
                        totalReferencePriceReadOnly =parseFloat(valueReferencePriceReadOnly);
                        
                       }else{
                        total = parseFloat(total) + parseFloat(value);
                        totalMin = parseFloat(totalMin) + parseFloat(valueMinPrice);
                        totalReferencePriceReadOnly = parseFloat(totalReferencePriceReadOnly) + parseFloat(valueReferencePriceReadOnly);
                       }

             

           
                   }
                   if ($(this).find(":hidden").val() != "" || $(this).find(":hidden").val() != null) {
                       array1.push($(this).find(":hidden").val())
                       // array1.push(val.value)
                   }
                 
               })
            }, 500);
     
         
            setTimeout(() => {
            $(".chargesTable").eq(containerIndex).find(".ChargesCode").each(function (key,value) {
              
                if ($(this).find(":hidden").val() !== "") {
                 
                    if ($(this).find(":hidden").val() == parent) {
                
                        if ($(this).closest("td").parent().find(".ParentCharges").val() == "" || $(this).closest("td").parent().find(".ParentCharges").val() == null) {
                          
                            $(this).closest("td").parent().find(".Amount").val(total.toFixed(4));
                            $(this).closest("td").parent().find(".Amount").prop("readonly", true);
                            $(this).closest("td").parent().find(".TaxCode").removeClass("readOnlySelect")
                            $(this).closest("td").parent().find(".FreightTerm").removeClass("readOnlySelect")
    
                            $(this).closest("td").parent().find(".MinPrice").val(totalMin.toFixed(4));
                            $(this).closest("td").parent().find(".MinPrice").prop("readonly", true);
    
                            $(this).closest("td").parent().find(".ReferencePriceReadOnly").val(total.toFixed(4));
    
                        }
    
    
    
                    }
                    else {
    
                      
                        // if($("#TariffUUID").val()!==""){
                        //     $(this).closest("td").parent().find(".amount").find("input").prop("readonly", false);
                        //     $(this).closest("td").parent().find(".taxcode").prop("disabled", true);
    
                        // }
                        // else{       
                      
                       
                        $(this).closest("td").parent().find(".FreightTerm").addClass("readOnlySelect")
                        var tempParentCharges=$(this).closest("td").parent().find(".ParentCharges").find(":hidden").val()
                        // console.log( $(this).closest("td").parent().find(".ParentCharges").find(":hidden").val())
                        if($(this).closest("td").parent().find(".ParentCharges").find(":hidden").val()==""){         
                           if(ParentList.find((u) => u ==$(this).find(":hidden").val())){
                            $(this).closest("td").parent().find(".MinPrice").prop("readonly", true);
                            $(this).closest("td").parent().find(".Amount").prop("readonly", true);
                            $(this).closest("td").parent().find(".TaxCode").removeClass("readOnlySelect")
                            $(this).closest("td").parent().find(".FreightTerm").removeClass("readOnlySelect")
                           } else{
                            $(this).closest("td").parent().find(".MinPrice").prop("readonly", false);
                            $(this).closest("td").parent().find(".Amount").prop("readonly", false);
                            $(this).closest("td").parent().find(".TaxCode").removeClass("readOnlySelect")
                            $(this).closest("td").parent().find(".FreightTerm").removeClass("readOnlySelect")
                           }             
                        }
                        else{
                            $(this).closest("td").parent().find(".MinPrice").prop("readonly", false);
                            $(this).closest("td").parent().find(".Amount").prop("readonly", false);
                            $(this).closest("td").parent().find(".TaxCode").addClass("readOnlySelect")         
                             var found=false
                             $(".chargesTable").eq(containerIndex).find(".ChargesCode").each(function (key2,value2) {
                                if(!found){
                                    if($(this).closest("td").parent().find(".ChargesCode").find(":hidden").val()==tempParentCharges){
                                        found=true
                                
                                        setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][TaxCode]`,$(this).closest("td").parent().find(".TaxCode").find(":hidden").val())
                                        setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][FreightTerm]`,$(this).closest("td").parent().find(".FreightTerm").find(":hidden").val())
                                    }
                                }
                                
                                
                             })
                            //hare
                            $(this).closest("td").parent().find(".FreightTerm").addClass("readOnlySelect")
                        }   

                        // $(this).closest("td").parent().find(".MinPrice").prop("readonly", false);
                        // $(this).closest("td").parent().find(".taxrate").val("")
                        // }
                    }
    
                    // if ($(this).closest("td").parent().find(".ParentCharges").val() !== "") {
    
                    //     $(this).closest("td").parent().find(".chargesCode").next().find(".select2-selection__rendered").addClass("ml-4")
                    // }
                    // if ($(this).closest("td").parent().find(".ParentCharges").val() == null) {
                    //     $(this).closest("td").parent().find(".chargesCode").next().find(".select2-selection__rendered").removeClass("ml-4")
                    // }
    
                }
            })
        }, 500);

            var unique = array1.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })
            var filteredAry = unique.filter(function (e) { return e !== "" })

          
            $(".chargesTable").eq(containerIndex).find(".ChargesCode").each(function () {
                var value = $(this).find(":hidden").val()
                var closest = $(this).closest("td").parent().find(".Amount")
                var closestMinPrice = $(this).closest("td").parent().find(".MinPrice")
                var closestTaxCode = $(this).closest("td").parent().find(".TaxCode");
                var closestFreightTerm = $(this).closest("td").parent().find(".FreightTerm");
                for (var i = 0; i < filteredAry.length; i++) {
                    if (filteredAry[i] == value) {
                        if ($(this).closest("td").parent().find(".ParentCharges").find(":hidden").val() == "" || $(this).closest("td").parent().find(".ParentCharges").find(":hidden").val() == null) {
                            $(closest).prop("readonly", true);
                            $(closestMinPrice).prop("readonly", true);
                         
                            $(closestTaxCode).removeClass("readOnlySelect")
                            $(closestFreightTerm).removeClass("readOnlySelect")
                            continue;
                        }
                        else {
    
                            $(closestTaxCode).addClass("readOnlySelect")
                            $(closestFreightTerm).addClass("readOnlySelect")
                            continue;
                        }
    
                    }
                }
                if ($(this).closest("td").parent().find(".ParentCharges").find(":hidden").val() == "" || $(this).closest("td").parent().find(".ParentCharges").find(":hidden").val() == null) {
                    $(closestTaxCode).removeClass("readOnlySelect")
                    $(closestFreightTerm).removeClass("readOnlySelect")
                }
    
            })



        }
        else {
            // $(".chargesTable").eq(containerIndex).find(".MinPrice").each(function (key, value) {

            //     $(value).prop("readonly", false)

            // })
            $(".chargesTable").eq(containerIndex).find('tbody').children().eq(index).find(".ChargesCode").find(".select__single-value").removeClass("ml-4")
            $(`input[name='TariffHasContainerTypeCharges[${containerIndex}][${index}][TaxCode]']`).parent().removeClass("readOnlySelect")
            $(`input[name='TariffHasContainerTypeCharges[${containerIndex}][${index}][FreightTerm]']`).parent().removeClass("readOnlySelect")
        }


    }
    //hide the options that are already selected
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
            var selectedIdA = getValues(`TariffHasContainerTypeCharges[${containerIndex}][${index}][ChargesCode]`)
            //disabled option that already selected
            $.each(options, function (key, value) {
                value.selected = false
            })
            
            $(".chargesTable").eq(containerIndex).find(".ChargesCode").find(".select__single-value").each(function (key, value) {
               
                if ($(value).text() !== "") {
                    if(getValues(`TariffHasContainerTypeCharges[${containerIndex}][${key}][ParentCharges]`)!==null){
                        newArray.push($(value).text())
                    }
                    
                }
                    ChoosenArray.push({label:$(value).text(),value:getValues(`TariffHasContainerTypeCharges[${containerIndex}][${key}][ChargesCode]`)})
               
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
     
            // $(".chargesTable").eq(containerIndex).find(".ChargesCode").find(".select__single-value").each(function (key, value) {
               
              
            // })

            // $.each(options, function (key, value) {
            //     $.each(ChoosenArray, function (key2, value2) {
             
            //         if(value.value==value2.value){
            //             console.log(value)
            //                value.selected = true
            //         }
            //     })
               
            //     // if (previosOption.includes(value.label)) {
            //     //     if (selectedIdA !== value.value) {
            //     //         // console.log(value.value)
            //     //         value.selected = true
            //     //     }
            //     // } else {
            //     //     previosOption.push(value.label)
            //     // }


            // })
          
            // $.each(options, function (key, value) {
            //     if(value.label==$(".chargesTable").eq(containerIndex).find(".ChargesCode").find(".select__single-value").text()){
            //         if(selectedIdA!==value.value){
            //             value.selected=true
            //         }
            //     }


            // })
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



    //add charges row when update
    useEffect(() => {
        remove()
        if (props.data && props.formState.formType != "New") {
            console.log(blockAppend)
            if(!blockAppend){
                $.each(props.data.tariffHasContainerTypeCharges, function (key, value) {
                    AddChargesUpdate(value, props.data.ContainerType, props.data.tariffHasContainerTypeCharges)
                })
            }
        }


        return () => {

        }
    }, [props.data])

    useEffect(()=>{
        if(props.removeRerenderChargesData.length>0){
            remove()
            $.each(props.removeRerenderChargesData, function (key, value) {
                if(props.containerIndex == key){
                    $.each(value.tariffHasContainerTypeCharges, function (key2, value2) {
                        AddChargesUpdate(value2, value.ContainerType, value.tariffHasContainerTypeCharges)
                    })
                }

            })
        }
    },[props.removeRerenderChargesData])


    useEffect(() => {
        if (removeState) {
            $.each(fields,function(key,value){
                if(value.ParentCharges!=="" && value.ParentCharges!==null){
                    var containerIndex=(value.Name).replace(/(^.*\[|\].*$)/g, '')
                
                    handleParentCharges({value:value.ParentCharges},containerIndex,key)
                }
            })
        }
        return () => {
            setRemoveState(false)
        }
    }, [removeState])

    useEffect(() => {
        if (props.removeChargesState) {
           setBlockAppend(true)
           remove()
        }
    }, [props.removeChargesState])

    //update the options of charges  when update
    useEffect(() => {
        var ArrayParentCharges = []
        if (props.chargesByContainer.length > 0) {
            if (fields.length > 0) {
                if (fields[0].Name == `TariffHasContainerTypeCharges[${props.containerIndex}]`) {

                    $.each(fields, function (key, value) {
                        $.each(props.chargesByContainer[0], function (key2, value2) {

                            if (key2 == props.containerIndex) {

                                //check for unverified charges and add into options 
                                var result = value2.filter(function (oneArray) {
                                    return oneArray.value == value.ChargesCode;
                                });
                                if(result.length<1){
                              
                                    value2.push({value:value.ChargesCode,label:value.chargesCode.ChargesCode})
                                }
                            
                                value.Charges[0].options = value2
                                value.Charges[2].options = value2
                            }

                        })




                    })
                    // update(fields)
                    setChildIndent(fields)


                }
            }
        }

    }, [props.chargesByContainer])


    useEffect(() => {
        var ArrayParentCharges = []
      if(childIndent.length>0){
        var index=(childIndent[0]["Name"]).replace(/(^.*\[|\].*$)/g, '')
        $.each(childIndent, function (key, value) {
            var newNameUOM = value.Name + "[" + key + "][UOM]"
            if (value.ParentCharges) {
                var newNameChargesCode = value.Name + "[" + key + "][ChargesCode]"
                var newNameTaxCode = value.Name + "[" + key + "][TaxCode]"
                var newNameFreightTerm = value.Name + "[" + key + "][FreightTerm]"
                var newNameMinPrice = value.Name + "[" + key + "][MinPrice]"
                $(`input[name='${newNameChargesCode}']`).parent().find(".select__single-value").addClass("ml-4")
                $(`input[name='${newNameTaxCode}']`).parent().addClass("readOnlySelect")
                $(`input[name='${newNameFreightTerm}']`).parent().addClass("readOnlySelect")

                ArrayParentCharges.push(value.ParentCharges)
               
            }
            
            
            if (value.chargesCode) {
                $(`input[name='${newNameUOM}']`).parent().parent().find(".ArrayUOM").val(value.chargesCode.UOM)
            }

            var containerIndex = value.Name.replace(/(^.*\[|\].*$)/g, '')

           
          
            setValue(`TariffHasContainerTypeCharges[${containerIndex}][${key}][ReferencePriceReadOnly]`, value.ReferencePrice)
        
    

        })
        $.each(childIndent, function (key, value) {
           
            $.each(ArrayParentCharges, function (key2, value2) {
           
               
                if( value.ChargesCode==value2){
                    $(`input[name='TariffHasContainerTypeCharges[${index}][${key}][MinPrice]']`).prop("readonly",true)
                    $(`input[name='TariffHasContainerTypeCharges[${index}][${key}][ReferencePrice]']`).prop("readonly",true)
                }
    

            })
        
    

        })
        //console.log(ArrayParentCharges)
        // setTimeout(() => {
        //     $(".chargesTable").eq(index).find(".ChargesCode").each(function (key, value) {
        //         console.log($(this).find(":hidden").val())
        //         // $(ArrayParentCharges).each(function (key2, value2) {
        //         //     if(value2==$(value).find(":hidden").val()){
    
        //         //         $(`input[name='TariffHasContainerTypeCharges[${index}][${key}][MinPrice]']`).prop("readonly",true)
        //         //         $(`input[name='TariffHasContainerTypeCharges[${index}][${key}][ReferencePrice]']`).prop("readonly",true)
        //         //     }
        //         // })
               
        //     })


        // },500)
   

      }
     
        return () => {

        }
    }, [childIndent])


    useEffect(() => {
        if(props.onChangeContainerTypeCharges.length>0){
            if (fields.length > 0) {
               
                if (fields[0].Name == `TariffHasContainerTypeCharges[${props.containerChangeIndex}]`) {      
                    $.each(fields, function (key, value) {        
                     
                        value.Charges[0].options = props.onChangeContainerTypeCharges
                      
                    })
                
                   
                }
            }
            //clear all data when container type onchange  
            $(".chargesTable").eq(props.containerChangeIndex).find('input').val("")
            $(".chargesTable").eq(props.containerChangeIndex).find('input').prop("readonly",false)
            $(".chargesTable").eq(props.containerChangeIndex).find('.dateformat').val("")
            $(".chargesTable").eq(props.containerChangeIndex).find('.basic-single').each(function (key, value) {
                setValue($(value).children().last().attr("name"), "")
                $(value).removeClass("readOnlySelect")
            
            })
        
        
        }
       update(fields)
        return () => {

        }
    }, [props.onChangeContainerTypeCharges])

    useEffect(() => {
        if(props.resetContainerChargesData.length>0){  
            if (fields.length > 0) {
                $.each(fields, function (key, value) {    

                    $.each(props.resetContainerChargesData, function (key2, value2) {        
                        if(value.Name==value2.Name){
                              value.Charges[0].options = value2.value

                              $(".chargesTable").eq(key).find('input').val("")
                                $(".chargesTable").eq(key).find('input').prop("readonly",false)
                                $(".chargesTable").eq(key).find('.dateformat').val("")
                                $(".chargesTable").eq(key).find('.basic-single').each(function (key3, value3) {
                                    setValue($(value3).children().last().attr("name"), "")
                                    $(value3).removeClass("readOnlySelect")
                                
                                })
                        }
                    })


                })
                update(fields)
                // if (fields[0].Name == `TariffHasContainerTypeCharges[${props.resetContainerChargesData.Name}]`) {      
                //     // $.each(fields, function (key, value) {        
                //     //     console.log('ppp')
                //     //     value.Charges[0].options = props.resetContainerChargesData.value
                      
                //     // })
                
                   
                // }
            }

        }
        return () => {

        }
    }, [props.resetContainerChargesData])



    useEffect(() => {
      
        if(props.onChangeCurrencyTypeCharges){
      
        
        }

        return () => {

        }
    }, [props.onChangeCurrencyTypeCharges])

    

    //add charges row when update
    function AddChargesUpdate(value2, ContainerType, allData) {

        var data = {
            ContainerType: ContainerType, POL: $(".POLPortCode").find(":hidden").val(), POD: $(".PODPortCode").find(":hidden").val(), StartDate: $(".startDate").val(), EndDate: $(".EndDate").val()
        }

        // check current column chooser to show and hide columns
        if (getCookie('tariffchargescolumn')) {
            var getCookieArray = getCookie('tariffchargescolumn');
            var getCookieArray = JSON.parse(getCookieArray);

        }
        //create a new array of objects that do not reference the original objects,
        var tempChargesColumn =chargesColumn.map(obj => ({ ...obj }))
        $(tempChargesColumn).each(function (key, value) {
            if(getCookieArray){
                value.class = "d-none"
            }
         

        })
        $(tempChargesColumn).each(function (key, value) {
            if(getCookieArray){
                $(getCookieArray).each(function (key2, value2) {
                    if (key == value2) {
                        value.class = ""

                    }

                })
         }

        })
        if(getCookieArray){
            $(".scrollable-columnchooser").each(function (key, value) {
                $(this).children().find(".columnChooserCharges").prop("checked", false)
                $(this).children().find(".columnChooserCharges").each(function (key2, value2) {
                    $(getCookieArray).each(function (key3, value3) {
                        if (key2 == value3) {
                            $(value2).prop("checked", true)
                        }
                    })
                })
            })
        }
 
        //for rerender when remove container
        if(value2.chargesCodeList){
            tempChargesColumn[0].options = value2.chargesCodeList
            tempChargesColumn[2].options = value2.chargesCodeList
            chargesColumn[0].options = value2.chargesCodeList
            chargesColumn[2].options = value2.chargesCodeList
        }

        // tempChargesColumn[0].options = ChargesOption
        // tempChargesColumn[2].options = ChargesOption
        tempChargesColumn[3].options = chargesType

        tempChargesColumn[8].options = taxCode
        tempChargesColumn[11].options = freightTerm
        tempChargesColumn[12].options = currencyType


        chargesColumn[3].options = chargesType

        chargesColumn[8].options = taxCode
        chargesColumn[11].options = freightTerm
        chargesColumn[12].options = currencyType

        setChargesColumnCookies(tempChargesColumn)

        value2.Name = "TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']';
        
        value2.Charges = chargesColumnCookies.length > 0 ? value2.chargesCodeList? tempChargesColumn :chargesColumnCookies : chargesColumn;

        if (value2.ParentCharges !== null && value2.ParentCharges !== "") {
            var result = allData.filter(function (oneArray) {
                return oneArray.TariffHasContainerTypeChargesUUID == value2.ParentCharges
            });
            if(result.length >0){
                value2.ParentCharges = result[0].ChargesCode;
            }

        }
        append(value2);
        // GetChargesByAreaContainer(data, globalContext).then(res => {
        //     var ChargesOption = []

        //     $.each(res.data, function (key, value) {

        //         var PortCode = "";
        //         var Float = "";
        //         if (value.VerificationStatus == "Approved") {

        //             if (value.portCode != null) {
        //                 PortCode = "(" + value["portCode"]["PortCode"] + ")";
        //             }

        //             if (value.Floating == "1") {
        //                 Float = "*"
        //             }

        //             ChargesOption.push({ value: value.ChargesUUID, label: value.ChargesCode + PortCode + Float })
        //         }



        //     })





        // })



    }


    // add charges row when click add button
    function handleAddCharges(event) {

        var containerType=$(event.target).closest('tr').prev().find(".ContainerType").find(":hidden").val()
        var data = {
            ContainerType: $(event.target).closest('tr').prev().find(".ContainerType").find(":hidden").val(), POL: $(".POLPortCode").find(":hidden").val(), POD: $(".PODPortCode").find(":hidden").val(), StartDate: $(".startDate").val(), EndDate: $(".EndDate").val(),CurrencyType:$(".currencyType").find(":hidden").val()
        }
        GetGroupChargesByAreaContainer(data,containerType, globalContext).then(res => {
            var ChargesOption = []

            $.each(res.data, function (key, value) {
             
                var PortCode = "";
                var Float = "";
                if (value.VerificationStatus == "Approved") {   
                   
                    if (value.portCode != null) {
                        PortCode = "(" + value["portCode"]["PortCode"] + ")";
                    }

                    if (value.Floating == "1") {
                        Float = "*"
                    }

                    ChargesOption.push({ value: value.ChargesUUID, label: value.ChargesCode + PortCode + Float })
                  
                }



            })

           
            $(chargesColumnCookies).each(function (key, value) {
                value.class = "d-none"
            })
            var arrayChecked = []
            $(event.target).parent().find(".columnChooserCharges").each(function (key, value) {
                if ($(value).prop("checked")) {
                    arrayChecked.push(key)
                }

            })
            $(chargesColumnCookies).each(function (key, value) {

                $(arrayChecked).each(function (key2, value2) {
                    if (key == value2) {
                        value.class = ""
                    }

                })

            })

            var tempChargesColumn = chargesColumnCookies.length > 0 ? chargesColumnCookies : chargesColumn


            tempChargesColumn[0].options = ChargesOption
            tempChargesColumn[2].options = ChargesOption
            tempChargesColumn[3].options = chargesType

            tempChargesColumn[8].options = taxCode
            tempChargesColumn[11].options = freightTerm
            tempChargesColumn[12].options = currencyType




            append({ Name: "TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']', Charges: tempChargesColumn });

        })



    }



    $(document).on("change", ".columnChooserCharges", function (event) {

        var index = ($(this).parent().parent().attr('id')).split("-")[1]

        var tariffChargesCookies = []

        $(this).parent().parent().find(".columnChooserCharges:checked").each(function () {

            tariffChargesCookies.push($(this).parent().index())

        });

        var json_str = JSON.stringify(tariffChargesCookies);
        createCookie('tariffchargescolumn', json_str, 3650);


        if (fields.length > 0) {

            if (fields[0].Name == `TariffHasContainerTypeCharges[${index}]`) {

                $.each(fields, function (key, value) {
                    if ($(event.target).prop("checked")) {
                        value.Charges[$(event.target).parent().index()].class = ""
                    } else {
                        value.Charges[$(event.target).parent().index()].class = "d-none"
                    }

                })
                setChargesColumnCookies(fields[0]["Charges"])

                update(fields)
            }

        }
        else {

            if ($(event.target).prop("checked")) {

                $(this).closest('div').parent().parent().find(".commontable").find('thead tr').children().eq($(event.target).parent().index()).removeClass('d-none')
            } else {
                $(this).closest('div').parent().parent().find(".commontable").find('thead tr').children().eq($(event.target).parent().index()).addClass('d-none')
            }

            var TempArray = chargesColumn
            if (chargesColumnCookies.length > 0) {
                $.each(chargesColumnCookies, function (key, value) {

                    if ($(event.target).prop("checked")) {
                        if (key == $(event.target).parent().index()) {
                            value.class = ""
                        }


                    } else {
                        if (key == $(event.target).parent().index()) {
                            value.class = "d-none"
                        }
                    }

                })

            } else {

                $.each(TempArray, function (key, value) {
                    if ($(event.target).prop("checked")) {
                        if (key == $(event.target).parent().index()) {
                            value.class = ""
                        }


                    } else {
                        if (key == $(event.target).parent().index()) {
                            value.class = "d-none"
                        }
                    }

                })

                setChargesColumnCookies(TempArray)
            }

        }

    })



    // $('.columnChooserCharges').change(function (event) {

    // });




    $('.columnchooserdropdown .dropdown-menu').click(function (event) {
        event.stopPropagation();
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
        name: "TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']'
    });
    return (
        <div className="card  col-xs-12 col-md-12">

            <div className="card-body" style={{ "backgroundColor": "white" }}>

                <div className="btn-group float-right mb-2 columnchooserdropdown" id="columnchooserdropdown">
                    <button type="button" className="btn btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        <i className="fa fa-th-list"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right  scrollable-columnchooser charges" id={`chargesColumChooser-${props.containerIndex}`}>
                        {chargesColumn.map((item, index) => {

                            return (
                                <label className="dropdown-item dropdown-item-marker">
                                    {item.defaultChecked ? <input type="checkbox" className="columnChooserCharges" defaultChecked /> : <input type="checkbox" className="columnChooserCharges" />}
                                    {item.columnName}

                                </label>
                            )

                        })}

                    </div>
                </div>

                <div class="table_wrap">
                    <div class="table_wrap_inner">
                        <table className="table table-bordered commontable chargesTable" style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                  
                                    {fields.length > 0 ? fields[0].Charges.map((item, index) => {
                                        return (
                                            <th className={item.class}>{item.columnName}</th>
                                        )

                                    }) : chargesColumn.map((item, index) => {
                                        return (
                                            <th className={item.class}>{item.columnName}</th>

                                        )

                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {fields.map((item, index) => {
                                  
                                    return (
                                           
                                        <tr key={item.id}>

                                            {item.Charges.map((item2, index2) => {

                                                if (item2.inputType == "single-select") {
                                                    if (index2 == 0) {
                                                        return (
                                                            <td className={item2.class}>
                                                                <div className="row">
                                                                    <div className="col-md-2">
                                                                        <div className="dropdownbar float-left ml-1">
                                                                            <button style={{ position: "relative", left: "0px", top: "-5px", padding: "0px 3px 0px 3px" }} className="btn btn-xs mt-2 btn-secondary dropdown-toggle float-right mr-1" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                <i className="fa fa-ellipsis-v"></i></button>
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                <button className="dropdown-item remove-container" type="button" onClick={() => removeContainerHandle(index)}>Remove</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input  {...register("TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']' + '[' + index + ']' + '[TariffHasContainerTypeChargesUUID]')} className={`form-control d-none`}/>
                                                                    <div className="col-md-10">
                                                                        <Controller
                                                                            name={("TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']' + '[' + index + ']' + '[' + item2.name + ']')}

                                                                            control={control}

                                                                            render={({ field: { onChange, value } }) => (
                                                                                <Select
                                                                                    isClearable={true}
                                                                                    {...register("TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']' + '[' + index + ']' + '[' + item2.name + ']')}
                                                                                    value={value ? item2.options.find(c => c.value === value) : null}
                                                                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange(val, props.containerIndex, index) }}
                                                                                    options={item2.options}
                                                                                    onMenuOpen={() => { handleOpenMenu(item2.name, item2.options, props.containerIndex,index) }}
                                                                                    isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                                    menuPortalTarget={document.body}
                                                                                    className="basic-single ChargesCode"
                                                                                    classNamePrefix="select"
                                                                                    onKeyDown={handleKeydown}
                                                                                    styles={globalContext.customStyles}

                                                                                />
                                                                            )}
                                                                        />
                                                                        <input type="hidden" id="select-options" value={JSON.stringify(item2.options)} />
                                                                    </div>

                                                                </div>

                                                            </td>
                                                        )
                                                    }
                                                    else {
                                                        return (
                                                            <td className={item2.class}>
                                                                <Controller
                                                                    name={("TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']' + '[' + index + ']' + '[' + item2.name + ']')}

                                                                    control={control}
                                                                    defaultValue={item2.defaultValue ? item2.defaultValue : ""}
                                                                    render={({ field: { onChange, value } }) => (
                                                                        <Select
                                                                            isClearable={true}
                                                                            {...register("TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']' + '[' + index + ']' + '[' + item2.name + ']')}
                                                                            value={value ? item2.options.find(c => c.value === value) : null}
                                                                            onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange(val, props.containerIndex, index) }}
                                                                            options={item2.options}

                                                                            menuPortalTarget={document.body}
                                                                            onMenuOpen={() => { handleOpenMenu(item2.name, item2.options, props.containerIndex, index) }}
                                                                            isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                            className={`basic-single ${item2.fieldClass ? item2.fieldClass : ""}`}
                                                                            classNamePrefix="select"
                                                                            onKeyDown={handleKeydown}
                                                                            styles={globalContext.customStyles}

                                                                        />
                                                                    )}
                                                                />
                                                                {item2.columnName == "UOM" ? <input type="hidden" className="ArrayUOM"></input> : ""}
                                                            </td>
                                                        )
                                                    }


                                                }
                                                if (item2.inputType == "input") {
                                                    return (
                                                        <td className={item2.class}>

                                                            <input defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register("TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']' + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} onBlur={val => handleChangeInput(item2.name, props.containerIndex, index, val)} />
                                                        </td>

                                                    )
                                                }

                                                if (item2.inputType == "date") {
                                                    return (
                                                        <td className={item2.class}>

                                                            <Controller

                                                                control={control}
                                                                name={`TariffHasContainerTypeCharges[${props.containerIndex}][${index}][${item2.name}]`}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <>
                                                                        <Flatpickr
                                                                            value={value ? value : ""}
                                                                            {...register("TariffHasContainerTypeCharges" + '[' + props.containerIndex + ']' + '[' + index + ']' + '[' + item2.name + ']')}
                                                                            onChange={val => {

                                                                                onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                                            }}
                                                                            className="form-control dateformat"
                                                                            options={{
                                                                                dateFormat: "d/m/Y"
                                                                            }}

                                                                        />
                                                                    </>
                                                                )}
                                                            />
                                                        </td>

                                                    )
                                                }


                                            })}
                                        </tr>


                                    )
                                })}
                            </tbody>



                        </table>
                    </div>
                </div>

                <button type="button" className="add-container btn btn-success btn-xs mb-2 mt-2" onClick={handleAddCharges} ><span class="fa fa-plus"></span>Add Charges</button>
            </div>
        </div>
    )
}

export default ContainerCharges








