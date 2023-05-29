import React, { useState, useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import { CheckBoxHandle, GetUpdateData, CreateData, createCookie, getCookie, getAreaById, getPortDetails, GetCompaniesData, getCompanyDataByID, GetBranchData, getUNNumberByID, getHSCodeByID, getContainers, getChargesByContainerTypeAndPortCode, getContainerTypeById } from '../../Components/Helper.js'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $ from "jquery";
import axios from "axios"
import { ShareContainerModel } from "../BootstrapTableModal&Dropdown/ShareContainerModel";
import NestedTableCharges from './NestedTableCharges.js';

function QuickFormTotalCard({ props, totalDiscount, totalTax, totalAmount }) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    var formName = props.ContainerItem.formName
    var formNameLowerCase = props.ContainerItem.formName.toLowerCase()
    useEffect(() => {
        setTimeout(() => {
            if(formName=="SalesCreditNote" || formName=="SalesDebitNote" || formName=="PurchaseOrder"){
                if(formName=="PurchaseOrder"){
                    props.setValue(`${formName}[TotalDiscount]`, totalDiscount.TotalDiscountTwoDecimal)
                }
                props.setValue(`${formName}[TotalTax]`, totalTax.TotalTaxTwoDecimal)
                props.setValue(`${formName}[TotalAmount]`, totalAmount.TotalAmountTwoDecimal)
            }else{
                var TotalDiscount = 0.00
                var TotalTax = 0.00
                var TotalAmount = 0.00
    
                $.each($(".ContainerTotalDiscount"), function (key, value) {
                    if ($(value).val()) {
                        TotalDiscount = (parseFloat(TotalDiscount) + parseFloat($(value).val())).toFixed(2)
                    }
                })
                $.each($(".ContainerTotalTax"), function (key, value) {
                    if ($(value).val()) {
                        TotalTax = (parseFloat(TotalTax) + parseFloat($(value).val())).toFixed(2)
                    }
                })
                $.each($(".ContainerTotalAmount"), function (key, value) {
                    if ($(value).val()) {
                        TotalAmount = (parseFloat(TotalAmount) + parseFloat($(value).val())).toFixed(2)
                    }
                })
                props.setValue(`${formName}[TotalDiscount]`, TotalDiscount)
                props.setValue(`${formName}[TotalTax]`, TotalTax)
                props.setValue(`${formName}[TotalAmount]`, TotalAmount)
            }

          

        }, 50)
    }, [totalDiscount, totalTax, totalAmount])

    useEffect(() => {
        if (props.documentData) {
            props.setValue(`${formName}[TotalAmount]`, props.documentData.TotalAmount)
            props.setValue(`${formName}[TotalDiscount]`, props.documentData.TotalDiscount)
            props.setValue(`${formName}[TotalGrossWeight]`, props.documentData.TotalGrossWeight)
            props.setValue(`${formName}[TotalM3]`, props.documentData.TotalM3)
            props.setValue(`${formName}[TotalNetWeight]`, props.documentData.TotalNetWeight)
            props.setValue(`${formName}[TotalTax]`, props.documentData.TotalTax)
            props.setValue(`${formName}[TotalTues]`, props.documentData.TotalTues)
        }

        return () => {
        }
    }, [props.documentData])


    return (
        formName == "SalesInvoice" || formName == "SalesCreditNote" || formName == "SalesDebitNote"  || formName == "PurchaseOrder"?
            <div className={`${props.ContainerItem.cardLength}`}>
                <div className="card total-charges lvl1">
                    <div className="card-header">
                        <h3 className="card-title">Total Charges</h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                            </button>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='row'>
                            {(formName == "SalesInvoice" || formName == "PurchaseOrder") && <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total Discount</label>
                                    <input {...props.register(`${formName}[TotalDiscount]`)} className={`form-control inputDecimalTwoPlaces`} readOnly={true} />
                                </div>
                            </div>}
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total Tax</label>
                                    <input {...props.register(`${formName}[TotalTax]`)} className={`form-control inputDecimalTwoPlaces`} readOnly={true} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total Amount</label>
                                    <input {...props.register(`${formName}[TotalAmount]`)} className={`form-control inputDecimalTwoPlaces`} readOnly={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> :

            <div className={`${props.ContainerItem.cardLength} d-none`}>
                <div className="card total-charges lvl1">
                    <div className="card-header">
                        <h3 className="card-title">Total Charges</h3>
                        <div className="card-tools">
                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                            </button>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='row'>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total M3</label>
                                    <input {...props.register(`${formName}[TotalM3]`)} className={`form-control inputDecimalThreePlaces`} readOnly={true} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total N.KG</label>
                                    <input {...props.register(`${formName}[TotalNetWeight]`)} className={`form-control inputDecimalThreePlaces`} readOnly={true} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total G.KG</label>
                                    <input {...props.register(`${formName}[TotalGrossWeight]`)} className={`form-control inputDecimalThreePlaces`} readOnly={true} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total Tues</label>
                                    <input {...props.register(`${formName}[TotalTues]`)} className={`form-control inputDecimalTwoPlaces`} readOnly={true} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total Discount</label>
                                    <input {...props.register(`${formName}[TotalDiscount]`)} className={`form-control inputDecimalTwoPlaces`} readOnly={true} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total Tax</label>
                                    <input {...props.register(`${formName}[TotalTax]`)} className={`form-control inputDecimalTwoPlaces`} readOnly={true} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Total Amount</label>
                                    <input {...props.register(`${formName}[TotalAmount]`)} className={`form-control inputDecimalTwoPlaces`} readOnly={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    )
}

export default QuickFormTotalCard