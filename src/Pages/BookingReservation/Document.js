
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import {sortArray} from '../../Components/Helper.js'
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
    formName:"BookingReservation",
    cardLength:"col-md-12",
    element : [
      {title:"BR No.", id:"bookingreservation-docnum", className:"reflect-field BookingLink OriReadOnlyClass", name:"BookingReservation[DocNum]", dataTarget:"DocNum", gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readonly"]},
      {title:"BR Doc Date", id:"bookingreservation-docdate", className:"docDate reflect-field flatpickr-input", name:"BookingReservation[DocDate]", dataTarget:"DocDate", gridSize:"col-xs-12 col-md-6", value:Date, type:"flatpickr-input", onChange:"", specialFeature:['required']},
      {title:"QT No.", id:"bookingreservation-quotation", className:"reflect-field QuotationFilter", name:"BookingReservation[Quotation]", dataTarget:"Quotation-Document", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:formContext.QTOption, specialFeature:['']},
      {title:"Doc. Description", id:"bookingreservation-docdesc", className:"reflect-field", name:"BookingReservation[DocDesc]", dataTarget:"DocDesc", gridSize:"col-xs-12 col-md-12", type:"input-textarea", onChange:"", specialFeature:[]},
      {title:"Sales Person", id:"bookingreservation-salesperson", className:"reflect-field sales_person", name:"BookingReservation[SalesPerson]", dataTarget:"SalesPerson", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.user, onChange:"", specialFeature:['required']},
      {title:"Quotation Type ", id:"bookingreservation-quotationtype", className:"reflect-field quotation_type", name:"BookingReservation[QuotationType]", dataTarget:"QuotationType", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:quotaitonTypeOptions, onChange:props.changeQuotationType, specialFeature:['required']},
      {title:"Validity Days", id:"bookingreservation-validityday", className:"reflect-field validityDay", name:"BookingReservation[ValidityDay]", dataTarget:"ValidityDay", gridSize:"col-xs-12 col-md-6 NormalBooking", type:"input-number", onChange:"", specialFeature:['']},
      {title:"Last Valid Date", id:"bookingreservation-lastvaliddate", className:"reflect-field lastValidDate flatpickr-input", name:"BookingReservation[LastValidDate]", dataTarget:"LastValidDate", value:formContext.lastValidDate, gridSize:"col-xs-12 col-md-6 NormalBooking", type:"flatpickr-input", onChange:"", specialFeature:['required']},
      {title:"Advance Booking Start Date", id:"bookingreservation-advancebookingstartdate", className:"flatpickr-input docDate active", name:"BookingReservation[AdvanceBookingStartDate]", dataTarget:"AdvanceBookingStartDate", value:Date, gridSize:"col-xs-12 col-md-6 AdvanceBooking", type:"flatpickr-input", onChange:"", specialFeature:["hidden"]},
      {title:"Advance Booking Last Valid Date", id:"bookingreservation-advancebookinglastvaliddate", className:"flatpickr-input lastValidDate active", name:"BookingReservation[AdvanceBookingLastValidDate]", dataTarget:"AdvanceBookingLastValidDate",value:formContext.lastValidDate, gridSize:"col-xs-12 col-md-6 AdvanceBooking", type:"flatpickr-input", onChange:"", specialFeature:["hidden"]},
      {title:"Currency", id:"bookingreservation-currency", className:"", name:"BookingReservation[Currency]", dataTarget:"Currency", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.currency, onChange:"", specialFeature:[]},
      {title:"Currency Exchange Rate", id:"bookingreservation-currencyexchangerate-disp", className:"inputDecimalId inputDecimalTwoPlaces", name:"BookingReservation[CurrencyExchangeRate]", dataTarget:"CurrencyExchangeRate", gridSize:"col-xs-12 col-md-6", type:"input-text", defaultValue:"1.0", onChange:"", specialFeature:[]},
      {title:"Nomination", id:"bookingreservation-nomination", className:"", name:"BookingReservation[Nomination]", dataTarget:"Nomination", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.port, onChange:"", specialFeature:[]},
    ]
  }

  useEffect(() => {
    if (props.documentData) {
      if(props.documentData.QuotationType == "Advance Booking"){
        $(".AdvanceBooking").removeClass('d-none');
        $(".NormalBooking").addClass('d-none');
      }

      if (props.documentData.Quotation){
        var data =  [{value:props.documentData.Quotation,label:props.documentData.quotation.DocNum}]
        formContext.setStateHandle(props.documentData.SalesPerson,"SalesPerson")
        formContext.setStateHandle(sortArray(data),"QTOption")
      }

      $.each(props.documentData, function (key2, value2) {
        if(formContext.formState.formType !="Transfer"){
          if(key2 == "DocDate"){
            formContext.setStateHandle(value2,"DocDate")
          }
        }
        props.setValue('BookingReservation[' + key2 + ']', value2);
        if(key2 == "LastValidDate"){
          if(formContext.formState.formType !="Transfer"){
            props.setLastValidDate(value2)
          }
        }
      })
    }
    return () => {
    }
  }, [props.documentData])

  return (
    <div className={`DetailFormDetails Document`}>
        <div className="bookingreservation-document-form">
            <div className="row">
                <DetailFormDocument register={props.register} control={props.control} errors={props.errors} DocumentItem={DocumentItem} setValue={props.setValue} getValues={props.getValues}/>
            </div>
        </div>
    </div>
  )
}

export default Document