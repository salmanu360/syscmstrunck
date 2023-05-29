
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
    formName:"Quotation",
    cardLength:"col-md-12",
    element:[
        {title:"Remark 1", id:"quotationmore-remark1", className:"reflect-field", name:"QuotationMore[Remark1]", dataTarget:"Remark1", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Remark 2", id:"quotationmore-remark2", className:"reflect-field", name:"QuotationMore[Remark2]", dataTarget:"Remark2", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Remark 3", id:"quotationmore-remark3", className:"reflect-field", name:"QuotationMore[Remark3]", dataTarget:"Remark3", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Remark 4", id:"quotationmore-remark4", className:"reflect-field", name:"QuotationMore[Remark4]", dataTarget:"Remark4", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"255" , onChange:"", specialFeature:[]},
        {title:"Note", id:"quotationmore-note", className:"", name:"QuotationMore[Note]", dataTarget:"Remark4", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"2000" , onChange:"", specialFeature:[]},
        {title:"Attachment", id:"quotationmore-attachment", className:"Attachments", name:"QuotationMore[Attachment][]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"file", onChange:"", specialFeature:[]},
        {title:"Header", id:"quotationmore-header", className:"", name:"QuotationMore[Header]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"2000" , onChange:"", specialFeature:[]},
        {title:"Remark", id:"quotationmore-remark", className:"", name:"QuotationMore[Remark]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-textarea", row:"2", onChange:"", specialFeature:[]},
        {title:"T&C", id:"quotationmore-tnc", className:"", name:"QuotationMore[TNC]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-textarea", row:"2", onChange:"", specialFeature:[]},
        {title:"Footer", id:"quotationmore-footer", className:"", name:"QuotationMore[Footer]", dataTarget:"", gridSize:"col-xs-12 col-md-12", type:"input-text", maxlength:"2000" , onChange:"", specialFeature:[]},
        {title:`Valid`, id:`quotationmore-valid`, className:``, name:`QuotationMore[Valid]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:["defaultCheck"]},
      ]
  }

  useEffect(() => {

    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        props.setValue('QuotationMore[' + key2 + ']', value2);

      })

    }
    return () => {

    }
  }, [props.moreData])

  useEffect(() => {
    if(formContext.formState.formType == "New"){
      var defaultTNC = "~ Above rate subject to 6% GST\n\
~Banker (BAF) charges is subjected to change for every 15th of the month\n\
~ Banker (BAF) charges is subjected to change for every 15th of the month\n\
~ Above charges exclude custom examination, scanning fee, storage charges, Demurrage/Detention and etcs. (If any)\n\
~ Above excludes stuffing and unstuffing.\n\
~ DG cargo surcharges shall be DG2@75% on ocean freight and DG3@50% on ocean freight\n\
~ Over Weight Surcharge RM150 exceeding gross weight 20M/T (18M/T Cargo weight + 2M/T container weight = 20M/T gross weight)\n\
~ We reserves the right to revise the rates and term offered as and when required.\n\
~ Marine insurance is under your own arrangement/account.\n"

      setTimeout(()=> {
        $("textarea[name='QuotationMore[TNC]']").val(defaultTNC)
      },100)
    }

    return () => {
    }
  }, [formContext.formState])

  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
        <div className="quotation-more-form">
            <DetailFormMore model={"quotation"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state}/>
        </div>
    </div>
  ) 
}

export default More