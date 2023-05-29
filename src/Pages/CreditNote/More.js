
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
    formName: "SalesCreditNote",
    cardLength: "col-md-12",
    element: [
      { title: "Remark 1", id: "salescreditnotemore-remark1", className: "reflect-field", name: "SalesCreditNoteMore[Remark1]", dataTarget: "Remark1", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 2", id: "salescreditnotemore-remark2", className: "reflect-field", name: "SalesCreditNoteMore[Remark2]", dataTarget: "Remark2", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 3", id: "salescreditnotemore-remark3", className: "reflect-field", name: "SalesCreditNoteMore[Remark3]", dataTarget: "Remark3", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 4", id: "salescreditnotemore-remark4", className: "reflect-field", name: "SalesCreditNoteMore[Remark4]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Note", id: "salescreditnotemore-note", className: "", name: "SalesCreditNoteMore[Note]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Attachment", id: "salescreditnotemore-attachment", className: "Attachments", name: "SalesCreditNoteMore[Attachment][]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "file", onChange: "", specialFeature: [] },
      { title: "Header", id: "salescreditnotemore-header", className: "", name: "SalesCreditNoteMore[Header]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Remark", id: "salescreditnotemore-remark", className: "", name: "SalesCreditNoteMore[Remark]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "T&C", id: "salescreditnotemore-tnc", className: "", name: "SalesCreditNoteMore[TNC]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "Footer", id: "salescreditnotemore-footer", className: "", name: "SalesCreditNoteMore[Footer]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: `Valid`, id: `salescreditnotemore-valid`, className: ``, name: `SalesCreditNoteMore[Valid]`, dataTarget: ``, gridSize: "col-xs-12 col-md-12", type: "checkbox", onChange: "", specialFeature: ["defaultCheck"] },
    ]
  }

  useEffect(() => {

    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        if(key2 == "TNC"){
          if(formContext.formState.formType != "TransferFromINV"){
            props.setValue('SalesCreditNoteMore[' + key2 + ']', value2);
          }
        }else{
          props.setValue('SalesCreditNoteMore[' + key2 + ']', value2);
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
        $("textarea[name='SalesCreditNoteMore[TNC]']").val(defaultTNC)
      },100)
    }

    return () => {
    }
  }, [formContext.formState])

  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
      <div className="salescreditnote-more-form">
        <DetailFormMore model={"credit-note"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state} />
      </div>
    </div>
  )
}

export default More