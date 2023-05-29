import React, { useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext";
import $ from "jquery";


function QuickFormMiddleCard(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)

    const formName = props.MiddleCardItem.formName
    const lowercaseFormName = props.MiddleCardItem.formName.toLowerCase()
    const dropdownInputStyle = {
        maxHeight: "800px",
        overflowY: "auto",
        maxWidth: "1500px"
    };

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }

    useEffect(() => {
        props.trigger()
        return () => {
        }
    }, [formContext.formState])

    useEffect(() => {
        setTimeout(() => {
            if (formContext.customerType) {
                if (formName == "SalesInvoice" || formName == "SalesCreditNote" || formName == "SalesDebitNote" || formName == "CustomerPayment") {
                    props.setValue("DynamicModel[CustomerType]", formContext.customerType)
                }
            }

        }, 100);
    }, [formContext.customerType])

    return (
        <>
            <div className={`${props.MiddleCardItem.cardLength}`}>
                <div className="card document lvl1">
                    <div className="card-header">
                        <h3 className="card-title">{props.MiddleCardItem.cardTitle}
                        </h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {props.MiddleCardItem.element.map((res, index) => {
                                var name = res.name
                                return (res.type === "input-text") ?
                                    (
                                        <div key={res.id} className={res.gridSize}>
                                            <div className="form-group">
                                                <label className="control-label">{res.title}</label>
                                                {res.specialFeature.includes("required") ?
                                                    <input {...props.register(name, { required: `${res.title} cannot be blank.` })} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                    :
                                                    <input {...props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                }
                                            </div>
                                        </div>
                                    ) :
                                    (res.type === "input-number") ?
                                        (
                                            <div key={res.id} className={res.gridSize}>
                                                <div className="form-group">
                                                    <label className="control-label">{res.title}</label>
                                                    {res.specialFeature.includes("required") ?
                                                        <input type={"number"} {...props.register(name, { required: `${res.title} cannot be blank.` })} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`} />
                                                        :
                                                        <input type={"number"} {...props.register(name)} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`} />
                                                    }
                                                </div>
                                            </div>
                                        ) :
                                        (res.type === "flatpickr-input") ?
                                            (
                                                <div key={res.id} className={res.gridSize}>
                                                    <div className="form-group">
                                                        <label className="control-label">{res.title}</label>
                                                        <Controller
                                                            name={name}
                                                            id={res.id}
                                                            control={props.control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <>
                                                                    <Flatpickr
                                                                        {...props.register(name)}
                                                                        style={{ backgroundColor: "white" }}
                                                                        value={""}
                                                                        data-target={res.dataTarget}
                                                                        onChange={val => {
                                                                            val == null ? onChange(null) : onChange(moment(val[0]).format("DD/MM/YYYY"), res.dataTarget);
                                                                            val == null ? formContext.setStateHandle(null, res.dataTarget) : formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY"), res.dataTarget)
                                                                        }}
                                                                        className={`form-control c-date-picker ${res.className}`}
                                                                        options={{
                                                                            dateFormat: "d/m/Y"
                                                                        }}

                                                                    />
                                                                </>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ) :
                                            (res.type === "dropdown") ?
                                              
                                                (res.specialFeature && res.specialFeature.includes("required")) ? (
                                                    <div key={res.id} className={res.gridSize}>
                                                     
                                                        {props.model ? props.model == "credit-note" || props.model == "debit-note" || props.model == "credit-note-barge" ||  props.model == "debit-note-barge"?
                                                              
                                                            <div className="form-group">
                                                              
                                                                <label className={`control-label ${props.errors.InvoiceNo ? props.errors.InvoiceNo ? "has-error-label" : "" : ""}`}>{res.title}</label>
                                                                <Controller
                                                                    name={name}
                                                                    control={props.control}
                                                                    data-target={res.dataTarget}
                                                                    defaultValue={res.defaultValue ? res.defaultValue : ""}
                                                                    render={({ field: { onChange, value } }) => (
                                                                        <Select
                                                                            {...props.register(name, { required: `${res.title} cannot be blank.` })}
                                                                          
                                                                            isClearable={true}
                                                                            data-target={res.dataTarget}
                                                                            value={
                                                                                value
                                                                                    ? res.option.find((c) => c.value === value)
                                                                                    : null
                                                                            }
                                                                            onKeyDown={handleKeydown}
                                                                            onChange={(val) => {
                                                                                val == null ? onChange(null) : onChange(val.value); res.onChange(val, index);
                                                                                val == null ? formContext.setStateHandle(null, res.dataTarget) : formContext.setStateHandle(val.value, res.dataTarget)
                                                                            }}
                                                                            options={res.option ? res.option : ""}
                                                                            className={`form-control ${res.className} ${props.errors.InvoiceNo ? props.errors.InvoiceNo ? "has-error-select" : "" : ""}`}
                                                                           
                                                                            classNamePrefix="select"
                                                                            menuPortalTarget={document.body}
                                                                            styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                        />
                                                                    )}
                                                                />
                                                                <p>{props.errors.InvoiceNo ? props.errors.InvoiceNo && <span className={"errorMessage"} style={{ color: "#A94442" }}>{props.errors.InvoiceNo.message }</span> : ""}</p>

                                                            </div>
                                                            :

                                                            ""

                                                            : <div className="form-group">
                                                                <label className="control-label">{res.title}</label>
                                                                <label className={`control-label ${props.errors.DynamicModel ? props.errors.DynamicModel[`BillToCompany`] ? "has-error-label" : "" : ""}`}>{res.title}</label>
                                                                <Controller
                                                                    name={name}
                                                                    control={props.control}
                                                                    data-target={res.dataTarget}
                                                                    defaultValue={res.defaultValue ? res.defaultValue : ""}
                                                                    render={({ field: { onChange, value } }) => (
                                                                        <Select
                                                                            {...props.register(name)}
                                                                            isClearable={true}
                                                                            data-target={res.dataTarget}
                                                                            value={
                                                                                value
                                                                                    ? res.option.find((c) => c.value === value)
                                                                                    : null
                                                                            }
                                                                            onKeyDown={handleKeydown}
                                                                            onChange={(val) => {
                                                                                val == null ? onChange(null) : onChange(val.value); res.onChange(val, index);
                                                                                val == null ? formContext.setStateHandle(null, res.dataTarget) : formContext.setStateHandle(val.value, res.dataTarget)
                                                                            }}
                                                                            options={res.option ? res.option : ""}
                                                                            className={`form-control ${res.className}`}
                                                                            classNamePrefix="select"
                                                                            menuPortalTarget={document.body}
                                                                            styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                        />
                                                                    )}
                                                                />
                                                            </div>}

                                                    </div>
                                                ) : (
                                                    <div key={res.id} className={res.gridSize}>
                                                        <div className="form-group">
                                                            <label className="control-label">{res.title}</label>
                                                            <Controller
                                                                name={name}
                                                                control={props.control}
                                                                data-target={res.dataTarget}
                                                                defaultValue={res.defaultValue ? res.defaultValue : ""}
                                                                render={({ field: { onChange, value } }) => (
                                                                    <Select
                                                                        {...props.register(name)}
                                                                        isClearable={true}
                                                                        data-target={res.dataTarget}
                                                                        value={
                                                                            value
                                                                                ? res.option.find((c) => c.value === value)
                                                                                : null
                                                                        }
                                                                        onKeyDown={handleKeydown}
                                                                        onChange={(val) => {
                                                                            val == null ? onChange(null) : onChange(val.value); res.onChange(val, index);
                                                                            val == null ? formContext.setStateHandle(null, res.dataTarget) : formContext.setStateHandle(val.value, res.dataTarget)
                                                                        }}
                                                                        options={res.option ? res.option : ""}
                                                                        className={`form-control ${res.className}`}
                                                                        classNamePrefix="select"
                                                                        menuPortalTarget={document.body}
                                                                        styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                ) :
                                                (res.type === "input-textarea") ?
                                                    (
                                                        <div key={res.id} className={res.gridSize}>
                                                            <div className="form-group">
                                                                <label className="control-label">{res.title}</label>
                                                                {res.specialFeature.includes("required") ?
                                                                    <textarea {...props.register(name, { required: `${res.title} cannot be blank.` })} data-target={res.dataTarget} className={`form-control ${res.className}`} />
                                                                    :
                                                                    <textarea {...props.register(name)} data-target={res.dataTarget} className={`form-control ${res.className}`} />
                                                                }
                                                            </div>
                                                        </div>
                                                    ) :
                                                    (res.type === "input-dropdownInputCompany") ?
                                                        (res.specialFeature.includes("required")) ? (
                                                            <div key={res.id} className={res.gridSize}>
                                                                {props.model ? props.model == "sales-invoice" || props.model == "credit-note"  || props.model == "credit-note-barge" || props.model == "debit-note"|| props.model == "debit-note-barge" || props.model == "customer-payment" || props.model == "sales-invoice-barge"?
                                                                    <div className="form-group">
                                                                        <label className={`control-label ${props.errors.DynamicModel ? props.errors.DynamicModel[`BillToCompany`] ? "has-error-label" : "" : ""}`}>{res.title}</label>
                                                                        <input {...props.register(name, { required: `${res.title} cannot be blank.` })} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className} ${res.title.replace(" ", '')} ${props.errors.DynamicModel ? props.errors.DynamicModel[`BillToCompany`] ? "has-error" : "" : ""}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                                        <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}-dropdown d-none`}>
                                                                            <table id={`CompanyROC-BillTo-Quickform-Table`}></table>
                                                                        </div>
                                                                        <p>{props.errors.DynamicModel ? props.errors.DynamicModel[`BillToCompany`] && <span className={"errorMessage"} style={{ color: "#A94442" }}>{props.errors.DynamicModel[`BillToCompany`].message}</span> : ""}</p>
                                                                    </div>
                                                                    : ""
                                                                : 
                                                                    <div className="form-group">
                                                                        <label className={`control-label ${props.errors.DynamicModel ? props.errors.DynamicModel[`${res.title.replace(" ", '')}Company`] ? "has-error-label" : "" : ""}`}>{res.title}</label>
                                                                        <input {...props.register(name, { required: `${res.title} cannot be blank.` })} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className} ${res.title.replace(" ", '')} ${props.errors.DynamicModel ? props.errors.DynamicModel[`${res.title.replace(" ", '')}Company`] ? "has-error" : "" : ""}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                                        <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}-dropdown d-none`}>
                                                                            <table id={`CompanyROC-${res.title.replace(/\s+/g, '')}-Quickform-Table`}></table>
                                                                        </div>
                                                                        <p>{props.errors.DynamicModel ? props.errors.DynamicModel[`${res.title.replace(" ", '')}Company`] && <span className={"errorMessage"} style={{ color: "#A94442" }}>{props.errors.DynamicModel[`${res.title.replace(" ", '')}Company`].message}</span> : ""}</p>
                                                                    </div>
                                                                }

                                                            </div>
                                                        )
                                                            :
                                                            (
                                                                <div key={res.id} className={res.gridSize}>

                                                                    <div className="form-group">
                                                                        <label className="control-label">{res.title}</label>
                                                                        <input {...props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                                        <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}-dropdown d-none`}>
                                                                            <table id={`CompanyROC-${res.title.replace(/\s+/g, '')}-Quickform-Table`}></table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        :
                                                        (res.type === "input-dropdownInputBranch") ?
                                                            (
                                                                <div key={res.id} className={res.gridSize}>
                                                                    <div className="form-group">
                                                                        <label className="control-label">{res.title}</label>
                                                                        <input defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                                        <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}-dropdown d-none`}>
                                                                            <table id={`BranchCode-${formName}-DetailForm-Table`}></table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                            :
                                                            (res.type === "input-text-withModal") ?
                                                                (
                                                                    <div key={index} className={res.gridSize}>
                                                                        <div className="form-group">
                                                                            <label className="control-label">{res.title}</label>
                                                                            <div className="input-group">
                                                                                {res.specialFeature.includes("required") ?
                                                                                    <input {...props.register(name, { required: `${res.title} cannot be blank.` })} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                                                    :
                                                                                    <input {...props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly") ? true : false} />
                                                                                }
                                                                                <div className="input-group-append openAttentionModal" data-refer={`${lowercaseFormName}-branchcode`}><span className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></span></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                                :
                                                                (
                                                                    <></>
                                                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuickFormMiddleCard