import React, { useState, useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import GlobalContext from "../../Components/GlobalContext";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import FormContext from "./FormContext";
import QuickFormContainerMultiplePOD from "./QuickFormContainerMultiplePOD";
import {CheckBoxHandle,getAreaById,getVesselById,getPortDetails,getPortDetailsById, getVoyageByIdSpecial} from "../Helper";
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"


function QuickFormMultiplePOD(props) {

    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    var formName = props.formName
    var formNameLowerCase = formName.toLowerCase()
    const [tempIndex, setTempIndex] = useState(0)





    function handleConfirmMultiplePOD(valPortCode,valPortTerm,index){
        console.log(valPortCode)
        var result = props.port.filter(function (item) {
                            return item.value == valPortCode.value
                        });
        var resultPortTerm = formContext.portTerm.filter(function (item) {
                            return item.value == valPortTerm.value
                        });

      console.log(result[0])
       handleChangeMultiplePOD(result[0],index)

      props.setValue(`QuotationPOD[${index}][PODPortCode]`,result[0].value)
      props.setValue(`QuotationPOD[${index}][PODPortTerm]`,resultPortTerm[0].value)

      $(".podCard").eq(index).text(`POD-${result[0].label}`)


      onChangePOTPortCode(result[0],`quotationpod-${index}-area`,index)
    }


    function handleKeydown(event) {
        var Closest = $(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if ($(Closest).hasClass("readOnlySelect")) {
                event.preventDefault()
            }
        }

    }

    function handleChangeMultiplePOD(val, index) {
    
        if (val) {
            if (val.value) {
                $(`#PODtab-${index}`).find(".tabName").text(val.label)
            } else {
                $(`#PODtab-${index}`).find(".tabName").text(val.label)
            }
        } else {
            $(`#PODtab-${index}`).find(".tabName").text(`POD-${index}`)
        }



    }


    function onChangePOTPortCode(value, positionId, index) {

        var closestArea = $("#" + positionId).closest(".row").find(".AreaName")

        if (value) {
            // props.setValue(`${formName}HasTranshipment[${index}][PortCode]`, value.value)

            var id = value.value
            var portCode = value.label
            var DefaultValue;
            var DefaultPortName;
            var DefaultAgentCompanyROC;
            var DefaultAgentCompany;
            var DefaultAgentCompanyBranch;
            var DefaultAgentCompanyBranchName;

            //get area
            getAreaById(id, globalContext).then(data => {
                $(closestArea).val(data["Area"]);
            });

            //get terminal options
            getPortDetails(id, globalContext).then(data => {
                var tempOptions = []
                var tempOptionsCompany = []
                var tempOptionsCompanyBranch = []
                if (data.length > 0) {
                    $.each(data, function (key, value1) {
                        if (value1.VerificationStatus == "Approved") {
                            if (value1.Default == 1) {
                                DefaultValue = value1.PortDetailsUUID;
                                DefaultPortName = value1.PortName;
                                DefaultAgentCompanyROC = value1.handlingCompany.ROC
                                DefaultAgentCompany = value1.HandlingCompany
                                DefaultAgentCompanyBranch = value1.HandlingCompanyBranch
                                DefaultAgentCompanyBranchName = value1.handlingCompanyBranch.BranchName
                                tempOptionsCompany.push({ value: value1.handlingCompany.CompanyUUID, label: value1.handlingCompany.CompanyName })
                                tempOptionsCompanyBranch.push({ value: value1.handlingCompanyBranch.CompanyBranchUUID, label: value1.handlingCompanyBranch.BranchCode })
                            }

                            tempOptions.push({ value: value1.PortDetailsUUID, label: value1.LocationCode })
                        }
                    })
                }
     

                // set Option Terminal
                
                props.setValue(`${formName}POD[${index}][optionTerminal]`, tempOptions)
                props.setValue(`${formName}POD[${index}][optionAgentCompany]`, tempOptionsCompany)
                props.setValue(`${formName}POD[${index}][optionAgentBranchCode]`, tempOptionsCompanyBranch)

                formContext.updatePODFields(formContext.PODFields)
                props.setValue(`${formName}POD[${index}][PODLocationCode]`, DefaultValue)
                props.setValue(`${formName}POD[${index}][PODLocationName]`, DefaultPortName)
                props.setValue(`${formName}POD[${index}][PODHandlingCompanyROC]`, DefaultAgentCompanyROC)
                props.setValue(`${formName}POD[${index}][PODHandlingCompanyCode]`, DefaultAgentCompany)
                props.setValue(`${formName}POD[${index}][PODHandlingOfficeCode]`, DefaultAgentCompanyBranch)
                props.setValue(`${formName}POD[${index}][PODHandlingOfficeName]`, DefaultAgentCompanyBranchName)
            });
        } else {
            props.setValue(`${formName}POD[${index}][PortCode]`, "")
            $(closestArea).val("");
            props.setValue(`${formName}POD[${index}][optionTerminal]`, [])
            props.setValue(`${formName}POD[${index}][optionAgentCompany]`, [])
            props.setValue(`${formName}POD[${index}][optionAgentBranchCode]`, [])
            formContext.update(formContext.fields)
            props.setValue(`${formName}POD[${index}][PODLocationCode]`, "")
            props.setValue(`${formName}POD[${index}][PODLocationName]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingCompanyROC]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingCompanyCode]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingOfficeCode]`, "")
            props.setValue(`${formName}POD[${index}][PODHandlingOfficeName]`, "")

        }
    }



   

    // useEffect(() => {
    //     $.each(formContext.PODFields, function (key, value) {
    //         if (value.PortCode !== "" && value.PortCode !== null) {
    //             var result = value.optionPort.filter(function (item) {
    //                 return item.value == value.PortCode
    //             });
    //             handleChangeMultiplePOD(result[0], key)
    //         } else {
    //             handleChangeMultiplePOD({ label: `POD-${key}` }, key)
    //         }
    //     })
    //     return () => {

    //     }
    // }, [formContext.PODFields])

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

    function getContainerCodeByContainerType(val) {
    }
    function getCOCCompany(val, index) {
    }
    function getBoxOperatorBranchByBoxOperatorCompany(val) {
    }
    function onChangeUNNumber(val) {
    }
    function getBoxOperatorBranchName(val) {
    }

    function handleMultiplePOD(index) {
        setTempIndex( $("#myTab").find(".nav-item").length)
        props.setValue(`Temp[${tempIndex}][PODPortTerm]`,formContext.defaultPortTerm)
      
        window.$("#MultiplePODModal").modal("toggle")
    }

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



    var ContainerItem = {
        formName: "Quotation",
        cardLength: "col-md-12",
        cardTitle: "Containers & Charges",
        ContainerColumn: [
            { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options: props.containerType, class: "", onChange: getContainerCodeByContainerType, requiredField: true },
            { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "OwnershipType", fieldClass: "BoxOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
            { columnName: "QTY", inputType: "number", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", min: "0", class: "", onChange: "" },
            { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange: "" },
            { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange: getBoxOperatorBranchByBoxOperatorCompany, loadOption: loadCompanyOptions, optionLabel: "CompanyName", optionValue: "CompanyUUID" },
            { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad", class: "", onChange: "", readOnly: true },
            { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
            { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
            { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
            { columnName: "Length", inputType: "input", defaultChecked: true, name: "Length", fieldClass: "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
            { columnName: "Width", inputType: "input", defaultChecked: true, name: "Width", fieldClass: "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
            { columnName: "Height", inputType: "input", defaultChecked: true, name: "Height", fieldClass: "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange: "" },
            { columnName: "Tues", inputType: "number", defaultChecked: true, name: "Tues", fieldClass: "cal Tues decimalDynamicForm", class: "", onChange: "" },
            { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature", class: "", onChange: "", readOnly: true },
            { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange: onChangeUNNumber, loadOption: loadUNNumberOptions, optionLabel: "UNNumber", optionValue: "UNNumberUUID" },
            { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange: "" },
            { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class: "d-none", onChange: "", loadOption: loadHSCodeOptions, optionLabel: "Heading", optionValue: "HSCodeUUID" },
            { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class: "d-none", onChange: "" },
            { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class: "d-none", onChange: getBoxOperatorBranchName },
            { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName", class: "d-none", onChange: "", readOnly: true },
            { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class: "d-none", modelClass: "TextMarks" },
            { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class: "d-none", modelClass: "TextGoods" },
            { columnName: "Total Disc", inputType: "input", defaultChecked: false, name: "TotalDiscount", fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount", class: "d-none", readOnly: true },
            { columnName: "Total Tax", inputType: "input", defaultChecked: false, name: "TotalTax", fieldClass: "inputDecimalTwoPlaces ContainerTotalTax", class: "d-none", readOnly: true },
            { columnName: "Total Amount", inputType: "input", defaultChecked: false, name: "Total", fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount", class: "d-none", readOnly: true },
        ]
    }


    return (
        <div className="col-md-12">
            <div className="card lvl1">
                <div className="card-header">
                    <h3 className="card-title">Container & Charges</h3>

                    <button id="mainLoadTariff" type="button" className="btn btn-success btn-xs mb-2 ml-2">
                        Load Tariff
                    </button>
                    <button id="clearTableData" type="button" className="btn btn-success btn-xs mb-2 ml-2">
                        Clear
                    </button>

                    <div className="card-tools">
                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                            <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className={``}>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">

                            {formContext.PODFields.map((item, index) => (
                                <>

                                    {index == 0 ?

                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link active" id={`PODtab-${index}`} data-toggle="tab" href={`#POD-${index}`} role="tab" aria-controls={`POD-${index}`} aria-selected="true">
                                                <span className="tabName">{`POD-${index}`}</span>
                                                <a onClick={() => formContext.FieldArrayHandleMultiplePOD("removePODFields", index)}><i className="fa fa-times ml-1" style={{"color": "#DC3545"}}></i></a>
                                            </a>
                                        </li>

                                        :
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link" id={`PODtab-${index}`} data-toggle="tab" href={`#POD-${index}`} role="tab" aria-controls={`POD-${index}`} aria-selected="true">
                                                <span className="tabName">{`POD-${index}`}</span>
                                                <a onClick={() => formContext.FieldArrayHandleMultiplePOD("removePODFields", index)}><i className="fa fa-times ml-1" style={{"color": "#DC3545"}}></i></a>
                                            </a>
                                        </li>
                                    }


                                </>
                            ))}
                            <a style={{"cursor": "pointer" }} onClick={() => { formContext.FieldArrayHandleMultiplePOD("appendPODFields"); handleMultiplePOD(0) }}><i className="fa fa-plus ml-1 mt-2" style={{"color": "rgb(40,167,69)"}}></i></a>

                           
                        </ul>

                        <div className="tab-content" id="myTabContent">

                            {formContext.PODFields.map((item, index) => (

                                <>
                                    {index == 0 ?
                                        <div key={item.id} className="tab-pane fade show active col-md-12" id={`POD-${index}`} role="tabpanel" aria-labelledby={`PODtab-${index}`}>




                                            <QuickFormContainerMultiplePOD  portCodeIndex={index} barge={props.barge} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ContainerItem={ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} containerTypeAndChargesData={props.containerTypeAndChargesData} documentData={props.documentData} setContainerTypeAndChargesData={props.setContainerTypeAndChargesData} />

                                        </div>
                                        :
                                        <div key={item.id} className="tab-pane fade col-md-12" id={`POD-${index}`} role="tabpanel" aria-labelledby={`PODtab-${index}`}>







                                            <QuickFormContainerMultiplePOD portCodeIndex={index}  barge={props.barge} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ContainerItem={ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} containerTypeAndChargesData={props.containerTypeAndChargesData} documentData={props.documentData} setContainerTypeAndChargesData={props.setContainerTypeAndChargesData} />

                                        </div>



                                    }


                                </>

                            ))}


                        </div>




                    </div>

                </div>
            </div>

            <div className="modal fade" id="MultiplePODModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">POD</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="form-group field-dynamicmodel-podportcode">
                                    <label className={``} htmlFor="dynamicmodel-podportcode">POD Port Code</label>
                                    <Controller
                                        name={`Temp[${tempIndex}][PortCode]`}
                                        id={`dynamicmodel-podportcode-${tempIndex}`}
                                        control={props.control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.register(`Temp[${tempIndex}][PortCode]`)}
                                                isClearable={true}
                                                data-target={"PODPortCode-ShippingInstructions"}
                                                id={"dynamicmodel-podportcode"}
                                                value={
                                                    value
                                                        ? props.port.find((c) => c.value === value)
                                                        : null
                                                }
                                                onKeyDown={handleKeydown}
                                                onChange={(val) => {
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    // ChangeReflectField(val, "PODPortCode")
                                                 
                                                    formName == "BookingReservation" ? formContext.QuotationRequiredFields() : val == null ? onChange(null) : onChange(val.value);

                                                }}
                                                options={props.port}
                                                className={`form-control pod_portcode multiplePODPortCode getTerminalPortCode quotationRequired liveData Live_Area`}
                                                classNamePrefix="select"

                                                styles={globalContext.customStyles}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                                <div className="col-md-12">
                                    <div className="form-group field-PODPortTerm">
                                        <label className="control-label" htmlFor="PODPortTerm">POD Port
                                            Term</label>
                                        <Controller
                                            name={`Temp[${tempIndex}][PortTerm]`}
                                            defaultValue={formContext.defaultPortTerm}
                                            id={`dynamicmodel-podportterm-${tempIndex}`}
                                            control={props.control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    {...props.register(`Temp[${tempIndex}][PortTerm]`)}
                                                    isClearable={true}
                                                    data-target={"PODPortTerm-ShippingInstructions"}
                                                    id={"dynamicmodel-podportterm"}
                                                    value={
                                                        value
                                                            ? formContext.portTerm ? formContext.portTerm.find((c) => c.value === value)
                                                                : null
                                                            : null
                                                    }
                                                    onKeyDown={handleKeydown}
                                                    onChange={(val) => {
                                                        val == null ? onChange(null) : onChange(val.value);
                                                        // ChangeReflectField(val, "PODPortTerm")
                                                    }}
                                                    options={formContext.portTerm}
                                                    className={`form-control pod_portterm liveData Live_PortTerm`}
                                                    classNamePrefix="select"
                                          
                                                    styles={globalContext.customStyles}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                           

                        </div>
                      
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={()=>handleConfirmMultiplePOD({value:props.getValues(`Temp[${tempIndex}][PortCode]`)},{value:props.getValues(`Temp[${tempIndex}][PortTerm]`)},tempIndex)}>Confirm</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>




    )
}

export default QuickFormMultiplePOD