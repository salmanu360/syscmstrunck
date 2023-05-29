
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormMore from '../../Components/CommonElement/DetailFormMore';
import FormContext from "../../Components/CommonElement/FormContext";

function More(props) {

  const formContext = useContext(FormContext)


  var MoreItem ={
    formName:"BookingReservation",
    cardLength:"col-md-12",
    element:[
        {title:"Remark 1", id:"bookingreservationmore-remark1", className:"reflect-field", name:"BookingReservationMore[Remark1]", dataTarget:"Remark1", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Remark 2", id:"bookingreservationmore-remark2", className:"reflect-field", name:"BookingReservationMore[Remark2]", dataTarget:"Remark2", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Remark 3", id:"bookingreservationmore-remark3", className:"reflect-field", name:"BookingReservationMore[Remark3]", dataTarget:"Remark3", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Remark 4", id:"bookingreservationmore-remark4", className:"reflect-field", name:"BookingReservationMore[Remark4]", dataTarget:"Remark4", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Note", id:"bookingreservationmore-note", className:"", name:"BookingReservationMore[Note]", dataTarget:"Remark4", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"2000" , onChange:"", specialFeature:[]},
        {title:"Attachment", id:"bookingreservationmore-attachment", className:"Attachments", name:"BookingReservationMore[Attachment][]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"file", onChange:"", specialFeature:[]},
        {title:"Header", id:"bookingreservationmore-header", className:"", name:"BookingReservationMore[Header]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"2000" , onChange:"", specialFeature:[]},
        {title:"Remark", id:"bookingreservationmore-remark", className:"", name:"BookingReservationMore[Remark]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-textarea", row:"2", onChange:"", specialFeature:[]},
        {title:"T&C", id:"bookingreservationmore-tnc", className:"", name:"BookingReservationMore[TNC]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-textarea", row:"2", onChange:"", specialFeature:[]},
        {title:"Footer", id:"bookingreservationmore-footer", className:"", name:"BookingReservationMore[Footer]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"2000" , onChange:"", specialFeature:[]},
        {title:`Valid`, id:`bookingreservationmore-valid`, className:``, name:`BookingReservationMore[Valid]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:["defaultCheck"]},
      ]
  }

  useEffect(() => {

    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        props.setValue('BookingReservationMore[' + key2 + ']', value2);
      })
    }
    return () => {
    }
  }, [props.moreData])
   
  useEffect(() => {
    if(formContext.formState.formType == "New" || formContext.formState.formType == "Transfer" ){
      var defaultTNC = "Please take note our GROSS WEIGHT PER CONTAINER ALLOWED FOR 20'-20 MT & 40'-27 MT\n\REMARK : Shipping Note/K3 for preparing B/L Manifest to be summited to us within 12 hours after closing time and before vessel's departure in order for our POD agent to summit cargo manifest to custom, Any penalty charges due to late submission is to be borne by shipper or their appointed agent.\n"

      setTimeout(()=> {
        $("textarea[name='BookingReservationMore[TNC]']").val(defaultTNC)
      },100)
    }

    return () => {
    }
  }, [formContext.formState])
  


  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
        <div className="bookingreservation-more-form">
            <DetailFormMore model={"booking-reservation"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state}/>
        </div>
    </div>
  ) 
}

export default More