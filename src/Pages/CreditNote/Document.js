
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
    formName: "SalesCreditNote",
    cardLength: "col-md-12",
    element: [
      { title: "CN No.", id: "salescreditnote-docnum", className: "reflect-field", name: "SalesCreditNote[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "CN Doc Date", id: "salescreditnote-docdate", className: "docDate reflect-field flatpickr-input ", name: "SalesCreditNote[DocDate]", dataTarget: "DocDate", gridSize: "col-xs-12 col-md-6", value: Date, type: "flatpickr-input", onChange: "", specialFeature: [] },
      { title:"Sales Person", id:"salescreditnote-salesperson", className:"reflect-field sales_person", name:"SalesCreditNote[SalesPerson]", dataTarget:"SalesPerson", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.user, onChange:"", specialFeature:['required']},
      { title:"Currency", id:"salescreditnote-currency", className:"", name:"SalesCreditNote[Currency]", dataTarget:"Currency", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.currency, onChange:"", specialFeature:[]},
      { title:"Currency Exchange Rate", id:"salescreditnote-currencyexchangerate-disp", className:"inputDecimalId inputDecimalTwoPlaces", name:"SalesCreditNote[CurrencyExchangeRate]", dataTarget:"CurrencyExchangeRate", gridSize:"col-xs-12 col-md-6", type:"input-text", defaultValue:"1.0", onChange:"", specialFeature:[]},
      { title: "Doc. Description", id: "salescreditnote-docdesc", className: "reflect-field", name: "SalesCreditNote[DocDesc]", dataTarget: "DocDesc", gridSize: "col-xs-12 col-md-12", type: "input-textarea", onChange: "", specialFeature: [] },



    ]
  }

//   useEffect(() => {
//     if (props.documentData) {
//       $.each(props.documentData, function (key2, value2) {
//         props.setValue('ContainerReleaseOrder[' + key2 + ']', value2);
//        if(props.formType!=="TransferFromBooking"){
//         if (key2 == "DocDate") {
//           setDate(value2)
//         }
//        }
       
    

//       })
//       if(props.documentData.Quotation){
//         if(props.documentData.quotation){
//           setQuotationSelection([{label:props.documentData.quotation.DocNum,value:props.documentData.Quotation}])
//         }
       
//       }
//       if(props.documentData.BookingReservation){
//         if(props.documentData.bookingReservation){
//           setBookingSelection([{label:props.documentData.bookingReservation.DocNum,value:props.documentData.BookingReservation}])
//         }
        
//       }
    
        
//     }

//     return () => {

//     }
//   }, [props.documentData])


  return (
    <div className={`DetailFormDetails Document`}>
      <div className="salescreditnote-document-form">
        <div className="row">
          <DetailFormDocument register={props.register} control={props.control} errors={props.errors} DocumentItem={DocumentItem} setValue={props.setValue} />
        </div>
      </div>
    </div>
  )
}

export default Document