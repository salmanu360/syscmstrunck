
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
    formName: "SalesDebitNote",
    cardLength: "col-md-12",
    element: [
      { title: "Remark 1", id: "salesdebitnotemore-remark1", className: "reflect-field", name: "SalesDebitNoteMore[Remark1]", dataTarget: "Remark1", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 2", id: "salesdebitnotemore-remark2", className: "reflect-field", name: "SalesDebitNoteMore[Remark2]", dataTarget: "Remark2", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 3", id: "salesdebitnotemore-remark3", className: "reflect-field", name: "SalesDebitNoteMore[Remark3]", dataTarget: "Remark3", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 4", id: "salesdebitnotemore-remark4", className: "reflect-field", name: "SalesDebitNoteMore[Remark4]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Note", id: "salesdebitnotemore-note", className: "", name: "SalesDebitNoteMore[Note]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Attachment", id: "salesdebitnotemore-attachment", className: "Attachments", name: "SalesDebitNoteMore[Attachment][]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "file", onChange: "", specialFeature: [] },
      { title: "Header", id: "salesdebitnotemore-header", className: "", name: "SalesDebitNoteMore[Header]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Remark", id: "salesdebitnotemore-remark", className: "", name: "SalesDebitNoteMore[Remark]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "T&C", id: "salesdebitnotemore-tnc", className: "", name: "SalesDebitNoteMore[TNC]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "Footer", id: "salesdebitnotemore-footer", className: "", name: "SalesDebitNoteMore[Footer]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: `Valid`, id: `salesdebitnotemore-valid`, className: ``, name: `SalesDebitNoteMore[Valid]`, dataTarget: ``, gridSize: "col-xs-12 col-md-12", type: "checkbox", onChange: "", specialFeature: ["defaultCheck"] },
    ]
  }

  useEffect(() => {
 
    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        if(key2 == "TNC"){
          if(formContext.formState.formType != "TransferFromINV"){
            props.setValue('SalesDebitNoteMore[' + key2 + ']', value2);
          }
        }else{
          props.setValue('SalesDebitNoteMore[' + key2 + ']', value2);
        }
      })
    }
    return () => {
    }
  }, [props.moreData])

  useEffect(() => {
    if(formContext.formState.formType == "New"){
      var defaultTNC = "NB: The parties named above are jointly and/or severally liable \n\
for the charges stated therein.\n\
\n\
Note:\n\
1. LATE PAYMENT PENALTY at the rate of 1.5% per\n\
month may be charges on all overdue accounts.\n\
2. All cheques must be crossed and drawn to order of\n\
“SHIN YANG SHIPPING SDN BHD”.\n\
3. No payment is recognized unless confirmed by the\n\
Company's Official Receipt.\n\
4. Our bank account details are as follow:\n\
HONG LEONG BANK A/C NO 255000047\n"

      setTimeout(()=> {
        $("textarea[name='SalesDebitNoteMore[TNC]']").val(defaultTNC)
      },100)
    }

    return () => {
    }
  }, [formContext.formState])

  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
      <div className="salesdebitnotemore-more-form">
        <DetailFormMore model={"debit-note"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state} />
      </div>
    </div>
  )
}

export default More