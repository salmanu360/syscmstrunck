import React, { useState, useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { CheckBoxHandle, GetUpdateData, CreateData, createCookie, getCookie, getAreaById, getPortDetails, GetCompaniesData, getCompanyDataByID, GetBranchData, getUNNumberByID, getHSCodeByID, getContainers, getChargesByContainerTypeAndPortCode, getContainerTypeById } from '../../Components/Helper.js'
// import FormContext from "./FormContext";
import GlobalContext from "../../Components/GlobalContext"
import $ from "jquery";
import axios from "axios"
import { ShareContainerModel } from "../../Components/BootstrapTableModal&Dropdown/ShareContainerModel";
// import NestedTableCharges from './NestedTableCharges.js';

function QuickFormContainer(props) {
    // const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    var formName = props.ContainerItem.formName
    var formNameLowerCase = props.ContainerItem.formName.toLowerCase()
    const [innerContainerData, setInnerContainerData] = useState([])

    const [containerInnerData, setContainerInnerData] = useState()

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

    function loadCompanyOptions(inputValue) {
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)
        return response
    }

    const loadUNNumberOptions = (inputValue) => {

        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "u-n-number/get-u-n-number-by-u-n-number?term=" + inputValue + "&_type=query&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response

    }

    const loadHSCodeOptions = (inputValue) => {

        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "h-s-code/get-h-s-code-by-heading?q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response

    }

    if(props.barge){
        var ContainerColumn= [

        
            { columnName: "Cargo Type", inputType: "input", defaultChecked: true, name: "CargoType", fieldClass: "form-control", class: "", onChange: "" ,readOnly: true},
            { columnName: "Cargo Rate", inputType: "input", defaultChecked: true, name: "CargoRate", fieldClass: "form-control", class: "", onChange: "" ,readOnly: true}, 
            { columnName: "NetWeight", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "form-control", class: "", onChange: "",readOnly: true },
            { columnName: "Gross Weight", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "form-control", class: "", onChange: "",readOnly: true },
            { columnName: "M3", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "form-control", class: "", onChange: "",readOnly: true },
          
          ]

    }else{
        var ContainerColumn = [
            { columnName: "Container Code", inputType: "single-select", defaultChecked: true, name: "ContainerCode", fieldClass: "ContainerCode", class: "", options: [] },
            { columnName: "Seal No.", inputType: "input", defaultChecked: true, name: "SealNum", fieldClass: "", class: "", onChange: "",readOnly: true },
            { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type onChangeContainerType", options: props.containerType, class: "", onChange: "" },
            { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "Qty", min: "0", class: "", onChange: "",readOnly: true},
            { columnName: "Mark", inputType: "input-Modal", defaultChecked: true, name: "Mark", fieldClass: "MarkReadonly", class: "", modelClass: "TextMarks",readOnly: true },
            { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: true, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class: "", modelClass: "TextGoods",readOnly: true},
            { columnName: "Package Type", inputType: "input", defaultChecked: true, name: "PackageType", fieldClass: "form-control", class: "", onChange: "" ,readOnly: true},
            { columnName: "No. of Package", inputType: "input", defaultChecked: true, name: "NoOfPackage", fieldClass: "NoOfPackageInput form-control", class: "", onChange: "",readOnly: true },
            { columnName: "Gross Weight", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "",readOnly: true },
            { columnName: "M3", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "",readOnly: true },
        ]
    }
 



  

    useEffect(() => {
        
        if (props.containerData) {
            var arrayDynamic = []
            remove()
            var newContainerData = props.containerData
            $.each(newContainerData, function (key, value) {
                
                var arrayDynamic = []
             
                value.Name = `${formName}HasContainer`;
                value.ContainerItem = ContainerColumn
                value.ContainerTypeOptions = props.containerType
                value.Qty="1"
                // value.ContainerItem[6].optionColumn =value.BoxOperator? [{ CompanyUUID: value.BoxOperator, CompanyName: value.boxOperator.CompanyName + "(" + value.boxOperator.ROC + ")" }]:[]
                

                // value.ContainerItem[8].options =value.BoxOperatorBranch?[{ value: value.BoxOperatorBranch, label: value.boxOperatorBranch.BranchCode }]:[]
               
                // value.ContainerItem[14].optionColumn=value.HSCode? [{ HSCodeUUID: value.HSCode, Heading: value.hSCode.Heading }]:[]
                // value.ContainerItem[16].optionColumn=value.UNNumber?[{ UNNumberUUID: value.UNNumber, UNNumber: value.uNNumber.UNNumber }]:[]
                // if (value.Empty == "1") {
                //     value.ContainerItem[5].check = true

                // }

                if (value.Mark) {
                    value.ContainerItem[4].textValue = value.Mark
                }
                if (value.GoodsDescription) {
                    value.ContainerItem[5].textValue = value.GoodsDescription
                }

                if (value.ContainerCode) {
                    var arrayContainerCode = []
                    arrayContainerCode.push({ value: value.containerCode.ContainerUUID, label: value.containerCode.ContainerCode })            
                    value.ContainerItem[0].options = arrayContainerCode

                }
                if (value.CargoType) {
                    value.CargoType=value.cargoType.CargoType
                }

                // value.ContainerCode = arrayContainerCode

                arrayDynamic.push(value);
             
                append(arrayDynamic)

                // props.setValue("ContainerReleaseOrderHasContainer[0][BoxOperator][optionColumn]",)
                // update(fields)



            })
            
       


        }

        //   append({ "Name": `${formName}HasContainer`, "Qty": 1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType })
        //   append(props.containerData)
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
            DeliveryOrderHasContainer: [{ "Name": `${formName}HasContainer`, "Qty": 1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType }]
           
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
        name: `${formName}HasContainer`
    });

    //set Default for First Came in
    useEffect(() => {
        setValue(`${formName}HasContainer[0]["ContainerTypeOptions"]`, props.containerType)
        update(fields)
    }, [props])

    function appendContainerHandle() {
        append({ "Name": `${formName}HasContainer`, "Qty": 1, "ContainerItem": ContainerColumn, ContainerTypeOptions: props.containerType })
    }

    $(document).on("change", ".columnChooserColumn", function (event) {

        // var index = ($(this).parent().parent().attr('id')).split("-")[1]

        var Cookies = []

        $(this).parent().parent().find(".columnChooserColumn:checked").each(function () {

            Cookies.push($(this).parent().index())

        });

        var json_str = JSON.stringify(Cookies);
        createCookie(`${formNameLowerCase}containercolumn`, json_str, 3650);


        if (fields.length > 0) {

            if (fields[0].Name == `${formName}HasContainer`) {

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





    $(".onChangeContainerType").unbind().on("change", function (e) {
        setTimeout(() => {
            var Findtrindex = $(this).closest("tr").index()
            var index = Findtrindex / 2
            var value = $(this).find("input:hidden").val()
            var label = $(this).find(".select__single-value").text()
            if (label.includes("RF")) {
                $(`input[name='${formName}HasContainer[${index}][Temperature]']`).attr('readonly', false);
                $.each(fields[index]["ContainerItem"], function (key2, value2) {
                    if (value2.name == "Temperature") {
                        setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][requiredField]`, true)
                        update(fields)
                    }
                })
            } else {
                $(`input[name='${formName}HasContainer[${index}][Temperature]']`).val("")
                $(`input[name='${formName}HasContainer[${index}][Temperature]']`).attr('readonly', true);
                $.each(fields[index]["ContainerItem"], function (key2, value2) {
                    if (value2.name == "Temperature") {
                        setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][requiredField]`, false)
                        update(fields)
                    }
                })
            }
            var optionContainerList = []
            var filters = {
                "OwnershipType": getValues(`${formName}HasContainer[${index}][OwnershipType]`),
                "Container.ContainerType": value,
                "Container.Status": "Available"
            };
            getContainers(value, filters, globalContext).then(data => {
                try {
                    $.each(data, function (key, value) {

                        optionContainerList.push({ value: value.ContainerUUID, label: value.ContainerCode })

                    });
                }
                catch (err) {

                }
                setValue(`${formName}HasContainer[${index}]["ContainerOptions"]`, optionContainerList)
                update(fields)
            })
        }, 100);

    })

    function getCOCCompany(val, index) {
        $(`input[name='${formName}HasContainer[${index}][OwnershipType]']`).parent().trigger("change")
        // if(val){
        //     if (val.value == "COC") {
        //         var company = "90d19715-dcf3-411c-85b1-2b21f889866e" // shin yang Company UUID
        //         var html = "<option value=''>Select...</option>";
        //         GetCompaniesData(company,globalContext).then(data => {
        //             $.each(data.data, function (key,value) {
        //                 var Box_OpCompany = [{CompanyUUID:value.CompanyUUID, CompanyName:value.CompanyName+"("+value.ROC+")"}]
        //                 var BoxOperatorName = value.CompanyName
        //                 var BoxOperatorBranch = []
        //                 var defaultBoxOperatorBranch 
        //                 var defaultBoxOperatorBranchName

        //                 $.each(value.companyBranches, function (key3,value3) {
        //                     if(key3 == 0){
        //                         defaultBoxOperatorBranch = value3.CompanyBranchUUID
        //                         defaultBoxOperatorBranchName =value3.BranchName
        //                     }
        //                     BoxOperatorBranch.push({value:value3.CompanyBranchUUID, label:value3.BranchCode+"("+value3.PortCode.PortCode+")"})

        //                 })
        //                 //Add option into register for boxOPCompany and boxOPBranch
        //                 $.each(fields[index]["ContainerItem"], function (key2,value2) {
        //                     if(value2.columnName=="Box Op Code"){
        //                         setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`,Box_OpCompany)
        //                         update(fields)
        //                     }
        //                     if(value2.columnName=="Box Op Branch Code"){
        //                         setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`,BoxOperatorBranch)
        //                         update(fields)
        //                     }
        //                 })
        //                 setValue(`${formName}HasContainer[${index}][BoxOperatorName]`,BoxOperatorName)
        //                 setValue(`${formName}HasContainer[${index}][BoxOperatorBranch]`,defaultBoxOperatorBranch)
        //                 setValue(`${formName}HasContainer[${index}][BoxOperatorBranchName]`,defaultBoxOperatorBranchName)
        //             })
        //         })
        //     }    
        //     var optionContainerList = []
        //     var filters = {
        //         "OwnershipType": val.value,
        //         "Container.ContainerType": getValues(`${formName}HasContainer[${index}][ContainerType]`),
        //         "Container.Status": "Available"
        //     };
        //     getContainers(val.value,filters,globalContext).then(data => {
        //         try {
        //             $.each(data, function (key, value) {

        //                 optionContainerList.push({value:value.ContainerUUID, label:value.ContainerCode})

        //             });
        //         }
        //         catch (err) {

        //         }
        //         setValue(`${formName}HasContainer[${index}]["ContainerOptions"]`,optionContainerList)
        //         update(fields)
        //     })
        // }else{
        //     $.each(fields[index]["ContainerItem"], function (key2,value2) {
        //         if(value2.columnName=="Box Op Code"){
        //             setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`,[])
        //             update(fields)
        //         }
        //         if(value2.columnName=="Box Op Branch Code"){
        //             setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`,[])
        //             update(fields)
        //         }
        //     })
        //     setValue(`${formName}HasContainer[${index}][BoxOperatorName]`,"")
        //     setValue(`${formName}HasContainer[${index}][BoxOperatorBranch]`,"")
        //     setValue(`${formName}HasContainer[${index}][BoxOperatorBranchName]`,"")
        // }
    }

    $(".onChangeOwnership").unbind().on("change", function (e) {
        setTimeout(() => {
            var Findtrindex = $(this).closest("tr").index()
            var index = Findtrindex / 2
            var value = $(this).find("input:hidden").val()
            var label = $(this).find(".select__single-value").text()
            if (value) {
                if (value == "COC") {
                    var company = "90d19715-dcf3-411c-85b1-2b21f889866e" // shin yang Company UUID
                    GetCompaniesData(company, globalContext).then(data => {
                        $.each(data.data, function (key, value) {
                            var Box_OpCompany = [{ CompanyUUID: value.CompanyUUID, CompanyName: value.CompanyName + "(" + value.ROC + ")" }]
                            var BoxOperatorName = value.CompanyName
                            var BoxOperatorBranch = []
                            var defaultBoxOperatorBranch
                            var defaultBoxOperatorBranchName

                            $.each(value.companyBranches, function (key3, value3) {
                                if (key3 == 0) {
                                    defaultBoxOperatorBranch = value3.CompanyBranchUUID
                                    defaultBoxOperatorBranchName = value3.BranchName
                                }
                                BoxOperatorBranch.push({ value: value3.CompanyBranchUUID, label: value3.BranchCode + "(" + value3.PortCode.PortCode + ")" })

                            })
                            //Add option into register for boxOPCompany and boxOPBranch
                            $.each(fields[index]["ContainerItem"], function (key2, value2) {
                                if (value2.columnName == "Box Op Code") {
                                    setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`, Box_OpCompany)
                                    update(fields)
                                }
                                if (value2.columnName == "Box Op Branch Code") {
                                    setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`, BoxOperatorBranch)
                                    update(fields)
                                }
                            })
                            setValue(`${formName}HasContainer[${index}][BoxOperatorName]`, BoxOperatorName)
                            setValue(`${formName}HasContainer[${index}][BoxOperatorBranch]`, defaultBoxOperatorBranch)
                            setValue(`${formName}HasContainer[${index}][BoxOperatorBranchName]`, defaultBoxOperatorBranchName)
                        })
                    })
                }
                var optionContainerList = []
                var filters = {
                    "OwnershipType": value,
                    "Container.ContainerType": getValues(`${formName}HasContainer[${index}][ContainerType]`),
                    "Container.Status": "Available"
                };
                getContainers(value, filters, globalContext).then(data => {
                    try {
                        $.each(data, function (key, value) {

                            optionContainerList.push({ value: value.ContainerUUID, label: value.ContainerCode })

                        });
                    }
                    catch (err) {

                    }
                    setValue(`${formName}HasContainer[${index}]["ContainerOptions"]`, optionContainerList)
                    update(fields)
                })
            } else {
                $.each(fields[index]["ContainerItem"], function (key2, value2) {
                    if (value2.columnName == "Box Op Code") {
                        setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`, [])
                        update(fields)
                    }
                    if (value2.columnName == "Box Op Branch Code") {
                        setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`, [])
                        update(fields)
                    }
                })
                setValue(`${formName}HasContainer[${index}][BoxOperatorName]`, "")
                setValue(`${formName}HasContainer[${index}][BoxOperatorBranch]`, "")
                setValue(`${formName}HasContainer[${index}][BoxOperatorBranchName]`, "")
            }
        }, 100);


    })


    function getBoxOperatorBranchByBoxOperatorCompany(val, index) {

        //remove optionColumn Data
        $.each(fields[index]["ContainerItem"], function (key2, value2) {
            if (value2.columnName == "Box Op Code") {
                setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`, "")
                update(fields)
            }
        })

        if (val) {
            var companyID = val.CompanyUUID
            getCompanyDataByID(companyID, globalContext).then(data => {
                var BoxOperatorName
                var BoxOperatorBranch = []
                var defaultBoxOperatorBranch
                var defaultBoxOperatorBranchName

                $.each(data.data, function (key, value) {
                    if (key == "CompanyName") {
                        BoxOperatorName = value
                    }

                    if (key == "companyBranches") {
                        $.each(value, function (key3, value3) {
                            if (key3 == 0) {
                                defaultBoxOperatorBranch = value3.CompanyBranchUUID
                                defaultBoxOperatorBranchName = value3.BranchName
                            }
                            BoxOperatorBranch.push({ value: value3.CompanyBranchUUID, label: value3.BranchCode + "(" + value3.portCode.PortCode + ")" })

                        })
                        $.each(fields[index]["ContainerItem"], function (key2, value2) {
                            if (value2.columnName == "Box Op Branch Code") {
                                setValue(`${formName}HasContainer[${index}][ContainerItem][${key2}][optionColumn]`, BoxOperatorBranch)
                                update(fields)
                            }
                        })
                    }
                })
                setValue(`${formName}HasContainer[${index}][BoxOperatorName]`, BoxOperatorName)
                setValue(`${formName}HasContainer[${index}][BoxOperatorBranch]`, defaultBoxOperatorBranch)
                setValue(`${formName}HasContainer[${index}][BoxOperatorBranchName]`, defaultBoxOperatorBranchName)
            })
        }

    }

    function onChangeUNNumber(val, index) {
        if (val) {
            var UNNumber = val.UNNumberUUID
            getUNNumberByID(UNNumber, globalContext).then(data => {
                setValue(`${formName}HasContainer[${index}][DGClass]`, data.data.Class)
            })
        } else {
            setValue(`${formName}HasContainer[${index}][DGClass]`, "")
        }
    }

    function onChangeHSCode(val, index) {
        if (val) {
            var HSCode = val.HSCodeUUID
            getHSCodeByID(HSCode, globalContext).then(data => {
                setValue(`${formName}HasContainer[${index}][Commodity]`, data.data.Description)
            })
        } else {
            setValue(`${formName}HasContainer[${index}][Commodity]`, "")

        }
    }

    function getBoxOperatorBranchName(val, index) {
        if (val) {
            GetBranchData(val.value, globalContext).then(data => {
                setValue(`${formName}HasContainer[${index}][BoxOperatorBranchName]`, data.data.BranchName)
            })
        } else {
            setValue(`${formName}HasContainer[${index}][BoxOperatorBranchName]`, "")
        }
    }

    function openTextAreaModal(event) {
        window.$(event.target).next().modal("toggle");
    }

    useEffect(() => {
        $(document).unbind().on("change", ".innerChargesTable", function () {
         
            var index=($(this).attr("id")).split('-')[1]
          
            setTimeout(() => {
                if(fields.length>0){
                   var newOption=fields[index].ContainerItem[22]
                  
                   var temp=props.containerInnerData
                   
                   var tempInnerContainerItem=temp[index].ContainerCode[0].innerContainerItem
                   var tempContainerCodeArray=[]
                  var pop=fields[index].ContainerItem[22]
                   $.each(fields[index].ContainerItem[22].options, function (key, value) {
                    tempContainerCodeArray.push({
                        ContainerCode:value.label,
                        ContainerUUID:value.value,
                        SealNum:"",
                        innerContainerItem:tempInnerContainerItem,
                        label:value.label,
                        value:value.value
    
                        
                    })
    
                   })
                 
                   temp[index].ContainerItem[22]=newOption
                   temp[index].ContainerCode=tempContainerCodeArray
              
                   setContainerInnerData(temp)
                     
                }
            }, 1000);

         

        })
        
        trigger()
        return () => {
            setContainerInnerData(null)
        }
    }, [fields])

 
  


    return (
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
                            <div className="btn-group float-left mb-2" id="columnchooserdropdown">
                                <button type="button" className="btn btn-secondary btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-th-list" data-toggle="tooltip" title="Column Chooser" data-placement="top"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-left  scrollable-columnchooser">
                                    {props.ContainerItem.ContainerColumn.map((item, index) => {
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
                                    <div className="row">

                                      
                                    </div>
                                    <table className="table table-bordered commontable" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                {fields.length > 0 ? fields[0].ContainerItem.map((item, index) => {
                                                    return (
                                                        <th key={item.id} className={item.class}>{item.columnName}</th>
                                                    )

                                                }) : props.ContainerItem.ContainerColumn.map((item, index) => {
                                                    return (
                                                        <th key={item.id} className={item.class}>{item.columnName}</th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody className="ContainerType container-item">
                                            {fields.map((item, index) => {
                                                return (
                                                    <>
                                                        <tr key={item.id}>

                                                            {item.ContainerItem.map((item2, index2) => {
                                                                if (item2.inputType == "input") {
                                                                    return (
                                                                        <td className={item2.class}>
                                                                              {item2.name=="CargoType"? <input  defaultValue='' className="d-none" {...register(`${formName}HasContainer` + '[' + index + ']' + '[ChargesCode]')}/>:""}
                                                                            {item2.requiredField ?
                                                                                <input defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasContainer`] ? errors[`${formName}HasContainer`][`${index}`] ? errors[`${formName}HasContainer`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                :
                                                                                <input defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                            }

                                                                        </td>

                                                                    )
                                                                }

                                                                if (item2.inputType == "number") {
                                                                    return (
                                                                        <td className={item2.class}>
                                                                            {item2.requiredField ?
                                                                                <input type="number" defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasContainer`] ? errors[`${formName}HasContainer`][`${index}`] ? errors[`${formName}HasContainer`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                :
                                                                                <input type="number" defaultValue='' readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                            }

                                                                        </td>

                                                                    )
                                                                }
                                                                if (item2.inputType == "number-withModal") {
                                                                    return (
                                                                        <td className={item2.class}>
                                                                            <div class="input-group">
                                                                                {item2.requiredField ?
                                                                                    <input type="number" defaultValue={item2.defaultValue} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']', { required: "required" })} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""} ${errors[`${formName}HasContainer`] ? errors[`${formName}HasContainer`][`${index}`] ? errors[`${formName}HasContainer`][`${index}`][`${item2.name}`] ? "has-error" : "" : "" : ""}`} />
                                                                                    :
                                                                                    <input type="number" defaultValue={item2.defaultValue} readOnly={item2.readOnly ? item2.readOnly : false} {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']')} className={`form-control ${item2.fieldClass ? item2.fieldClass : ""}`} />
                                                                                }
                                                                                <div class="input-group-append" style={{ cursor: "pointer" }} onClick={() => ShareContainerModel({ formName, index, fields, getValues, setValue, update, globalContext })}>
                                                                                    <span class="input-group-text"><i class="fa fa-search" aria-hidden="true"></i></span>
                                                                                </div>
                                                                            </div>
                                                                            {/* <div className="SelectContainerCodeField d-none">
                                                                                <Controller
                                                                                    name={(`${formName}HasContainer` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                    control={control}
                                                                                    render={({ field: { onChange, value } }) => (
                                                                                        <Select
                                                                                            isClearable={true}
                                                                                            isMulti
                                                                                            {...register(`${formName}HasContainer` + '[' + index + ']' + '[ContainerCode][]')}
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
                                                                            <input type={"checkbox"}  disabled={item2.disabled ? item2.disabled : false} checked={item2.check} defaultValue='0' className={`mt-2 ${item2.fieldClass ? item2.fieldClass : ""}`} onChange={CheckBoxHandle}></input>
                                                                            <input type={"input"} defaultValue='0' className="d-none" {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']')} />
                                                                        </td>
                                                                    )
                                                                }

                                                                if (item2.inputType == "single-select") {
                                                                   
                                                                   
                                                                        return (
                                                                            <td className={item2.class}>
                                                                         
                                                                                     
                                                                            {item2.name=="ContainerCode"? <input  defaultValue='' className="d-none" {...register(`${formName}HasContainer` + '[' + index + ']' + '[DeliveryOrderHasContainerUUID]')}/>:""}
                                                                               
                                                                                <Controller
                                                                                    name={(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']')}

                                                                                    control={control}

                                                                                    render={({ field: { onChange, value } }) => (
                                                                                        <Select
                                                                                            isClearable={true}
                                                                                            {...register(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']')}
                                                                                            value={value ? item2.options ? item2.options.find(c => c.value === value) : null : ""}
                                                                                            onChange={val => { val == null ? onChange(null) : onChange(val.value); item2.onChange(val, index) }}
                                                                                            options={item2.options}
                                                                                            menuPortalTarget={document.body}
                                                                                            isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                                            className={`basic-single readOnlySelect  ${item2.fieldClass ? item2.fieldClass : ""}`}
                                                                                            classNamePrefix="select"
                                                                                            styles={globalContext.customStyles}
                                                                                        />
                                                                                    )}
                                                                                />

                                                                                {/* {item2.columnName == "UOM" ? <input type="hidden" className="ArrayUOM"></input> : ""} */}
                                                                            </td>
                                                                        )
                                                                    
                                                                }

                                                                if (item2.inputType == "multiple-select") {

                                                                    return (
                                                                        <td className={item2.class}>

                                                                            <Controller
                                                                                name={(`${formName}HasContainer` + '[' + index + ']' + '[ContainerCode][]')}
                                                                                control={control}
                                                                                render={({ field: { onChange, value } }) => (
                                                                                    <Select
                                                                                        isClearable={true}
                                                                                        isMulti
                                                                                        {...register(`${formName}HasContainer` + '[' + index + ']' + '[ContainerCode][]')}
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
                                                                                name={(`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']')}
                                                                                control={control}
                                                                                render={({ field: { onChange, value } }) => (
                                                                                    <AsyncSelect
                                                                                        isClearable={true}
                                                                                        {...register((`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']'))}
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

                                                                                                <textarea id="" className={`form-control ${item2.modelClass}`} readOnly  {...register((`${formName}HasContainer` + '[' + index + ']' + '[' + item2.name + ']'))} rows="5" placeholder={`Enter ${item2.columnName}`}></textarea>


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
                                    <p1 id="TotalContainer">Total : </p1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickFormContainer