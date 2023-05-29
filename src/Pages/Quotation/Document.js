
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormDocument from "../../Components/CommonElement/DetailFormDocument";
import FormContext from '../../Components/CommonElement/FormContext';

function Document(props) {
    const formContext = useContext(FormContext)
    const [Date, setDate] = useState("")

    useEffect(() => {
      setDate(formContext.docDate)
      return () => {
      }
    }, [formContext.docDate])

  const quotaitonTypeOptions = [
    {
      value : 'Advance Booking',
      label : 'Advance Booking',
    },
    {
      value : 'Empty',
      label : 'Empty',
    },
    {
      value : 'Feeder',
      label : 'Feeder',
    },
    {
      value : 'Joint Service',
      label : 'Joint Service',
    },
    {
      value : 'Normal',
      label : 'Normal',
    },
    {
      value : 'One-Off',
      label : 'One-Off',
    },
    {
      value : 'Purchase Slot',
      label : 'Purchase Slot',
    }] 

  var DocumentItem ={
    formName:"Quotation",
    cardLength:"col-md-12",
    element : [
      {title:"QT No.", id:"quotation-docnum", className:"reflect-field", name:"Quotation[DocNum]", dataTarget:"DocNum", gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readonly"]},
      {title:"QT Effective Date", id:"quotation-docdate", className:"docDate reflect-field flatpickr-input", name:"Quotation[DocDate]", dataTarget:"DocDate", gridSize:"col-xs-12 col-md-6", value:Date, type:"flatpickr-input", onChange:"", specialFeature:['required']},
      {title:"Doc. Description", id:"quotation-docdesc", className:"reflect-field", name:"Quotation[DocDesc]", dataTarget:"DocDesc", gridSize:"col-xs-12 col-md-12", type:"input-textarea", onChange:"", specialFeature:[]},
      {title:"Reject Message", id:"quotation-rejectmessage", className:"reflect-field", name:"Quotation[RejectMessage]", dataTarget:"RejectMessage", gridSize:"col-xs-12 col-md-12", type:"input-text", onChange:"", specialFeature:["readonly"]},
      {title:"Sales Person", id:"quotation-salesperson", className:"reflect-field sales_person", name:"Quotation[SalesPerson]", dataTarget:"SalesPerson", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.user, onChange:"", specialFeature:['required']},
      {title:"Quotation Type ", id:"quotation-quotationtype", className:"reflect-field quotation_type", name:"Quotation[QuotationType]", dataTarget:"QuotationType", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:quotaitonTypeOptions, onChange:props.changeQuotationType, specialFeature:['required']},
      {title:"Validity Days", id:"quotation-validityday", className:"reflect-field validityDay", name:"Quotation[ValidityDay]", dataTarget:"ValidityDay", gridSize:"col-xs-12 col-md-6 NormalBooking", type:"input-number", onChange:"", specialFeature:['']},
      {title:"Last Valid Date", id:"quotation-lastvaliddate", className:"reflect-field lastValidDate flatpickr-input", name:"Quotation[LastValidDate]", dataTarget:"LastValidDate", value:formContext.lastValidDate, gridSize:"col-xs-12 col-md-6 NormalBooking", type:"flatpickr-input", onChange:"", specialFeature:['required']},
      {title:"Advance Booking Start Date", id:"quotation-advancebookingstartdate", className:"flatpickr-input docDate active", name:"Quotation[AdvanceBookingStartDate]", dataTarget:"AdvanceBookingStartDate", value:Date, gridSize:"col-xs-12 col-md-6 AdvanceBooking", type:"flatpickr-input", onChange:"", specialFeature:["hidden"]},
      {title:"Advance Booking Last Valid Date", id:"quotation-advancebookinglastvaliddate", className:"flatpickr-input lastValidDate active", name:"Quotation[AdvanceBookingLastValidDate]", dataTarget:"AdvanceBookingLastValidDate",value:formContext.lastValidDate, gridSize:"col-xs-12 col-md-6 AdvanceBooking", type:"flatpickr-input", onChange:"", specialFeature:["hidden"]},
      {title:"Currency", id:"quotation-currency", className:"", name:"Quotation[Currency]", dataTarget:"Currency", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.currency, onChange:"", specialFeature:[]},
      {title:"Currency Exchange Rate", id:"quotation-currencyexchangerate-disp", className:"inputDecimalId inputDecimalTwoPlaces", name:"Quotation[CurrencyExchangeRate]", dataTarget:"CurrencyExchangeRate", gridSize:"col-xs-12 col-md-6", type:"input-text", defaultValue:"1.0", onChange:"", specialFeature:[]},
      {title:"Nomination", id:"quotation-nomination", className:"", name:"Quotation[Nomination]", dataTarget:"Nomination", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.port, onChange:"", specialFeature:[]},
    ]
  }

  useEffect(() => {
    if (props.documentData) {
      if(props.documentData.QuotationType == "Advance Booking"){
        $(".AdvanceBooking").removeClass('d-none');
        $(".NormalBooking").addClass('d-none');
      }
      $.each(props.documentData, function (key2, value2) {
        if(key2 == "DocDate"){
          formContext.setStateHandle(value2,"DocDate")
        }
        props.setValue('Quotation[' + key2 + ']', value2);
        if(key2 == "LastValidDate"){
          props.setLastValidDate(value2)
        }
      })
    }
    return () => {
    }
  }, [props.documentData])

  return (
    <div className={`DetailFormDetails Document`}>
        <div className="quotation-document-form">
            <div className="row">
                <DetailFormDocument register={props.register} control={props.control} errors={props.errors} DocumentItem={DocumentItem} setValue={props.setValue}/>
            </div>
        </div>
    </div>
  )
}

export default Document