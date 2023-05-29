
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
  
  const [quotationSelection, setQuotationSelection] = useState([])
  const [bookingSelection, setBookingSelection] = useState([])

  useEffect(() => {

    setDate(formContext.docDate)
    return () => {
    }
  }, [formContext.docDate])

  var DocumentItem = {
    formName: "SalesInvoice",
    cardLength: "col-md-12",
    element: [
      { title: "INV No.", id: "salesinvoice-docnum", className: "reflect-field", name: "SalesInvoice[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "INV Doc Date", id: "salesinvoice-docdate", className: "docDate reflect-field flatpickr-input ", name: "SalesInvoice[DocDate]", dataTarget: "DocDate", gridSize: "col-xs-12 col-md-6", value: Date, type: "flatpickr-input", onChange: "", specialFeature: [] },
      { title:"Sales Person", id:"salesinvoice-salesperson", className:"reflect-field sales_person", name:"SalesInvoice[SalesPerson]", dataTarget:"SalesPerson", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.user, onChange:"", specialFeature:['required']},
      { title:"Currency", id:"salesinvoice-currency", className:"", name:"SalesInvoice[Currency]", dataTarget:"Currency", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.currency, onChange:"", specialFeature:[]},
      { title:"Currency Exchange Rate", id:"salesinvoice-currencyexchangerate-disp", className:"inputDecimalId inputDecimalTwoPlaces", name:"SalesInvoice[CurrencyExchangeRate]", dataTarget:"CurrencyExchangeRate", gridSize:"col-xs-12 col-md-6", type:"input-text", defaultValue:"1.0", onChange:"", specialFeature:[]},
      { title: "Nomination", id: "salesinvoice-nomination", className: "", name: "SalesInvoice[Nomination]", dataTarget: "Nomination", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: props.port, onChange: "", specialFeature: [] },
      { title: "Doc. Description", id: "salesinvoice-docdesc", className: "reflect-field", name: "SalesInvoice[DocDesc]", dataTarget: "DocDesc", gridSize: "col-xs-12 col-md-12", type: "input-textarea", onChange: "", specialFeature: [] },



    ]
  }

  useEffect(() => {
    if (props.documentData) {
      $.each(props.documentData, function (key2, value2) {
        props.setValue('SalesInvoice[' + key2 + ']', value2);
       if(props.formType!=="TransferFromBooking" && props.formType!=="New"){
        if (key2 == "DocDate") {
          formContext.setStateHandle(value2,"DocDate")
        }
        if (key2 == "SalesPerson") {
          formContext.setStateHandle(value2,"SalesPerson")
        
        } 
        if (key2 == "Currency") {
          formContext.setStateHandle(value2,"Currency")
        }
       }else{
        props.setValue('SalesInvoice[SalesPerson]', formContext.salesPerson);
        props.setValue('DynamicModel[SalesPerson]', formContext.salesPerson);
       }
       
    

      })
 
    }

    return () => {

    }
  }, [props.documentData])


  return (
    <div className={`DetailFormDetails Document`}>
      <div className="salesinvoice-document-form">
        <div className="row">
          <DetailFormDocument register={props.register} control={props.control} errors={props.errors} DocumentItem={DocumentItem} setValue={props.setValue} />
        </div>
      </div>
    </div>
  )
}

export default Document