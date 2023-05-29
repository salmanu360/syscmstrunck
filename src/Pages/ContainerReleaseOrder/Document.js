
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
    formName: "ContainerReleaseOrder",
    cardLength: "col-md-12",
    element: [
      { title: "CRO No.", id: "containerreleaseorder-docnum", className: "reflect-field", name: "ContainerReleaseOrder[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "Document Date", id: "containerreleaseorder-docdate", className: "docDate reflect-field flatpickr-input ", name: "ContainerReleaseOrder[DocDate]", dataTarget: "DocDate", gridSize: "col-xs-12 col-md-6", value: Date, type: "flatpickr-input", onChange: "", specialFeature: [] },
      { title: "BR No.", id: "containerreleaseorder-bookingreservation", className: "reflect-field booking_reservation readOnlySelect", name: "ContainerReleaseOrder[BookingReservation]", dataTarget: "BookingReservation", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: bookingSelection, specialFeature: [] },
      { title: "QT No.", id: "containerreleaseorder-quotation", className: "reflect-field quotation readOnlySelect", name: "ContainerReleaseOrder[Quotation]", dataTarget: "Quotation", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: quotationSelection, specialFeature: ['required'] },
      { title: "Nomination", id: "containerreleaseorder-nomination", className: "", name: "ContainerReleaseOrder[Nomination]", dataTarget: "Nomination", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: props.port, onChange: "", specialFeature: [] },
      { title: "Doc. Description", id: "containerreleaseorder-docdesc", className: "reflect-field", name: "ContainerReleaseOrder[DocDesc]", dataTarget: "DocDesc", gridSize: "col-xs-12 col-md-12", type: "input-textarea", onChange: "", specialFeature: [] },



    ]
  }

  useEffect(() => {
    if (props.documentData) {
      $.each(props.documentData, function (key2, value2) {
        props.setValue('ContainerReleaseOrder[' + key2 + ']', value2);
       if(props.formType!=="TransferFromBooking"){
        if (key2 == "DocDate") {
          setDate(value2)
        }
       }
       
    

      })
      if(props.documentData.Quotation){
        if(props.documentData.quotation){
          setQuotationSelection([{label:props.documentData.quotation.DocNum,value:props.documentData.Quotation}])
        }
       
      }
      if(props.documentData.BookingReservation){
        if(props.documentData.bookingReservation){
          setBookingSelection([{label:props.documentData.bookingReservation.DocNum,value:props.documentData.BookingReservation}])
        }
        
      }
    
        
    }

    return () => {

    }
  }, [props.documentData])


  return (
    <div className={`DetailFormDetails Document`}>
      <div className="containerreleaseorder-document-form">
        <div className="row">
          <DetailFormDocument register={props.register} control={props.control} errors={props.errors} DocumentItem={DocumentItem} setValue={props.setValue} />
        </div>
      </div>
    </div>
  )
}

export default Document