
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
  const [billOfLadingSelection, setBillOfLadingSelection] = useState([])


  useEffect(() => {

    setDate(formContext.docDate)
    return () => {
    }
  }, [formContext.docDate])

  var DocumentItem = {
    formName: "DeliveryOrder",
    cardLength: "col-md-12",
    element: [
      { title: "DO No.", id: "deliveryorder-docnum", className: "reflect-field", name: "DeliveryOrder[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "BR No.", id: "deliveryorder-bookingreservation", className: "reflect-field booking_reservation readOnlySelect", name: "DeliveryOrder[BookingReservation]", dataTarget: "BookingReservation", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: bookingSelection, specialFeature: [] },
      { title: "QT No.", id: "deliveryorder-quotation", className: "reflect-field quotation readOnlySelect", name: "DeliveryOrder[Quotation]", dataTarget: "Quotation", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: quotationSelection, specialFeature: ['required'] },
      { title: "BL No.", id: "deliveryorder-bill0flading", className: "reflect-field billoflading readOnlySelect", name: "DeliveryOrder[BillOfLading]", dataTarget: "BillOfLading", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: billOfLadingSelection, specialFeature: ['required'] },
      { title: "Document Date", id: "deliveryorder-docdate", className: "docDate", name: "DeliveryOrder[DocDate]", dataTarget: "DocDate", gridSize: "col-xs-12 col-md-6", value: Date, type: "input-text", onChange: "", specialFeature: ["readonly"] },
   
      { title: "Nomination", id: "deliveryorder-nomination", className: "readOnlySelect", name: "DeliveryOrder[Nomination]", dataTarget: "Nomination", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: props.port, onChange: "", specialFeature: [] },
      { title: "Document Description", id: "deliveryorder-docdesc", className: "reflect-field", name: "DeliveryOrder[DocDesc]", dataTarget: "DocDesc", gridSize: "col-xs-12 col-md-12", type: "input-textarea", onChange: "", specialFeature: ["readonly"] },
      { title: "Telex Release Description", id: "deliveryorder-telexreleasedescription", className: "reflect-field", name: "DeliveryOrder[TelexReleaseDescription]", dataTarget: "DocDesc", gridSize: "col-xs-12 col-md-12", type: "input-textarea", onChange: "", specialFeature: ["readonly"] },
      { title: "Telex Release", id:"deliveryorder-telexrelease", className:``, name:"DeliveryOrder[TelexRelease]", dataTarget:"TelexRelease", gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[]},

    ]
  }

  useEffect(() => {
    if (props.documentData) {
       $(".deliveryorder-document-form").find('input[type="checkbox"]').prop("disabled",true)
      $.each(props.documentData, function (key2, value2) {
        props.setValue('DeliveryOrder[' + key2 + ']', value2);
        if(props.formType!=="TransferFromBooking" && props.formType!=="SplitBL" ){
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
   
        if(props.documentData.bookingReservation){
          setBookingSelection([{label:props.documentData.bookingReservation.DocNum,value:props.documentData.bookingReservation.BookingReservationUUID}])
          props.setValue("DeliveryOrder[BookingReservation]",props.documentData.bookingReservation.BookingReservationUUID)
        }
        
      

      if(props.documentData.BillOfLading){
        if(props.documentData.billOfLading){
          setBillOfLadingSelection([{label:props.documentData.billOfLading.DocNum,value:props.documentData.BillOfLading}])
        }
        
      }
      
      if(props.documentData.TelexRelease=="1"){
        $("#deliveryorder-telexrelease").prop("checked",true)
      }else{
        $("#deliveryorder-telexrelease").prop("checked",false)
      }
        
    }

    return () => {

    }
  }, [props.documentData])


  return (
    <div className={`DetailFormDetails Document`}>
      <div className="deliveryorder-document-form">
        <div className="row">
          <DetailFormDocument register={props.register} control={props.control} errors={props.errors} DocumentItem={DocumentItem} setValue={props.setValue} />
        </div>
      </div>
    </div>
  )
}

export default Document