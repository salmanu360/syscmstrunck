
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, GetSuitableBRForBL } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormDocument from "../../Components/CommonElement/DetailFormDocument";
import FormContext from '../../Components/CommonElement/FormContext';

function Document(props) {
  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  const [Date, setDate] = useState("")
  const [quotationSelection, setQuotationSelection] = useState([])

  function FindBookingSuitable(value){
    const oriBooking = formContext.bookingSelection[0]

    GetSuitableBRForBL(globalContext, oriBooking.value ).then(res => {
      var newArray = [oriBooking]
      $.each(res.data, function(key,value){
        newArray.push({label:value.DocNum,value:value.BookingReservationUUID})
      })
      formContext.setStateHandle(newArray, "bookingSelection")
    })

  }

  useEffect(() => {
    setDate(formContext.docDate)
    return () => {
    }
  }, [formContext.docDate])

  var DocumentItem = {
    formName: "BillOfLading",
    cardLength: "col-md-12",
    element: [
      { title: "BL No.", id: "billoflading-docnum", className: "reflect-field", name: "BillOfLading[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "BR No.", id: "billoflading-bookingreservation", className: "reflect-field booking_reservation ", name: "BillOfLading[BookingReservation]", dataTarget: "BookingReservation", gridSize: "col-xs-12 col-md-6", type: "dropdown-openMenuFindOption", option: formContext.bookingSelection, onOpenMenu:FindBookingSuitable, specialFeature: [] },
      { title: "QT No.", id: "billoflading-quotation", className: "reflect-field quotation readOnlySelect", name: "BillOfLading[Quotation]", dataTarget: "Quotation", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: quotationSelection, specialFeature: ['required'] },
      { title: "Document Date", id: "billoflading-docdate", className: "docDate reflect-field flatpickr-input ", name: "BillOfLading[DocDate]", dataTarget: "DocDate", gridSize: "col-xs-12 col-md-6", value: Date, type: "flatpickr-input", onChange: "", specialFeature: [] },
      { title: "Nomination", id: "billoflading-nomination", className: "", name: "BillOfLading[Nomination]", dataTarget: "Nomination", gridSize: "col-xs-12 col-md-6", type: "dropdown", option: props.port, onChange: "", specialFeature: [] },
      { title: "Manifest Import Voyage No", id: "billoflading-manifestimportvoyageno", className: "ManifestImportVoyageNo", name: "BillOfLading[ManifestImportVoyageNo]", dataTarget: "ManifestImportVoyageNo", gridSize: "col-xs-12 col-md-6", type: "input-text-WithHidden", onChange: "", specialFeature: ["readonly"] },
      { title: "Document Description", id: "billoflading-docdesc", className: "reflect-field", name: "BillOfLading[DocDesc]", dataTarget: "DocDesc", gridSize: "col-xs-12 col-md-12", type: "input-textarea", onChange: "", specialFeature: [] },
      { title: "Telex Release Description", id: "billoflading-telexreleasedescription", className: "reflect-field", name: "BillOfLading[TelexReleaseDescription]", dataTarget: "DocDesc", gridSize: "col-xs-12 col-md-12", type: "input-textarea", onChange: "", specialFeature: [] },
      { title: "Telex Release", id:"billoflading-telexrelease", className:``, name:"BillOfLading[TelexRelease]", dataTarget:"TelexRelease", gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:[]},

    ]
  }

  useEffect(() => {
    if (props.documentData) {
      $.each(props.documentData, function (key2, value2) {
        props.setValue('BillOfLading[' + key2 + ']', value2);
        if(props.formType!=="TransferFromBooking" && props.formType!=="SplitBL" ){
          if (key2 == "DocDate") {
            setDate(value2)
          }
        }
        if(key2 == "ManifestImportVoyageNo"){
          $(`input[name='BillOfLading[${key2}]']`).val(value2)
          if(props.documentData.manifestImportVoyageNo){
            $(".ManifestImportVoyageNo").val(props.documentData.manifestImportVoyageNo.VoyageNumber)
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
          formContext.setStateHandle([{label:props.documentData.bookingReservation.DocNum,value:props.documentData.BookingReservation}], "bookingSelection")
        }
      }
      
      if(props.documentData.TelexRelease=="1"){
        $("#billoflading-telexrelease").prop("checked",true)
      }else{
        $("#billoflading-telexrelease").prop("checked",false)
      }

      
     if(props.formType=="SplitBL"){
      setDate(formContext.docDate)
     }
        
    }

    return () => {

    }
  }, [props.documentData])

  return (
    <div className={`DetailFormDetails Document`}>
      <div className="billoflading-document-form">
        <div className="row">
          <DetailFormDocument formType={props.formType} register={props.register} control={props.control} errors={props.errors} DocumentItem={DocumentItem} setValue={props.setValue} />
        </div>
      </div>
    </div>
  )
}

export default Document