
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

  var MoreItem = {
    formName: "SalesInvoice",
    cardLength: "col-md-12",
    element: [
      { title: "Remark 1", id: "salesinvoicemore-remark1", className: "reflect-field", name: "SalesInvoiceMore[Remark1]", dataTarget: "Remark1", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 2", id: "salesinvoicemore-remark2", className: "reflect-field", name: "SalesInvoiceMore[Remark2]", dataTarget: "Remark2", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 3", id: "salesinvoicemore-remark3", className: "reflect-field", name: "SalesInvoiceMore[Remark3]", dataTarget: "Remark3", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 4", id: "salesinvoicemore-remark4", className: "reflect-field", name: "SalesInvoiceMore[Remark4]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Note", id: "salesinvoicemore-note", className: "", name: "SalesInvoiceMore[Note]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Attachment", id: "salesinvoicemore-attachment", className: "Attachments", name: "SalesInvoiceMore[Attachment][]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "file", onChange: "", specialFeature: [] },
      { title: "Header", id: "salesinvoicemore-header", className: "", name: "SalesInvoiceMore[Header]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Remark", id: "salesinvoicemore-remark", className: "", name: "SalesInvoiceMore[Remark]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "T&C", id: "salesinvoicemore-tnc", className: "", name: "SalesInvoiceMore[TNC]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "Footer", id: "salesinvoicemore-footer", className: "", name: "SalesInvoiceMore[Footer]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: `Valid`, id: `salesinvoicemore-valid`, className: ``, name: `SalesInvoiceMore[Valid]`, dataTarget: ``, gridSize: "col-xs-12 col-md-12", type: "checkbox", onChange: "", specialFeature: ["defaultCheck"] },
    ]
  }

  useEffect(() => {

    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        if(key2 == "TNC"){
          if(formContext.formState.formType != "TransferFromBooking"){
            props.setValue('SalesInvoiceMore[' + key2 + ']', value2);
          }
        }else{
          props.setValue('SalesInvoiceMore[' + key2 + ']', value2);
        }

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


    var defaultTNCNewest = "NB: The parties named above are jointly and/or severally liable  for the charges stated therein. \n\n\
Note:\n\
\u20031. LATE PAYMENT PENALTY at the rate of 1.5% per month may be charges on all overdue accounts.\n\
\u20032. All cheques must be crossed and drawn to order of “SHIN YANG SHIPPING SDN BHD”.\n\
\u20033. No payment is recognized unless confirmed by the Company's Official Receipt.\n\
\u20034. Our bank account details are as follow: HONG LEONG BANK A/C NO 255000047\n"

    setTimeout(()=> {
        $("textarea[name='SalesInvoiceMore[TNC]']").val(defaultTNCNewest)
      },100)
    }

    return () => {
    }
  }, [formContext.formState])

  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
      <div className="salesinvoice-more-form">
        <DetailFormMore model={"sales-invoice"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state} />
      </div>
    </div>
  )
}

export default More