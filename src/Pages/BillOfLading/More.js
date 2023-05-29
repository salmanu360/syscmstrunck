
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormMore from '../../Components/CommonElement/DetailFormMore';

function More(props) {
  var MoreItem = {
    formName: "BillOfLading",
    cardLength: "col-md-12",
    element: [
      { title: "Remark 1", id: "billofladingmore-remark1", className: "reflect-field", name: "BillOfLadingMore[Remark1]", dataTarget: "Remark1", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 2", id: "billofladingmore-remark2", className: "reflect-field", name: "BillOfLadingMore[Remark2]", dataTarget: "Remark2", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 3", id: "billofladingmore-remark3", className: "reflect-field", name: "BillOfLadingMore[Remark3]", dataTarget: "Remark3", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 4", id: "billofladingmore-remark4", className: "reflect-field", name: "BillOfLadingMore[Remark4]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Note", id: "billofladingmore-note", className: "", name: "BillOfLadingMore[Note]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Attachment", id: "billofladingmore-attachment", className: "Attachments", name: "BillOfLadingMore[Attachment][]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "file", onChange: "", specialFeature: [] },
      { title: "Header", id: "billofladingmore-header", className: "", name: "BillOfLadingMore[Header]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Remark", id: "billofladingmore-remark", className: "", name: "BillOfLadingMore[Remark]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "T&C", id: "billofladingmore-tnc", className: "", name: "BillOfLadingMore[TNC]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "Footer", id: "billofladingmore-footer", className: "", name: "BillOfLadingMore[Footer]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: `Valid`, id: `billofladingmore-valid`, className: ``, name: `BillOfLadingMore[Valid]`, dataTarget: ``, gridSize: "col-xs-12 col-md-12", type: "checkbox", onChange: "", specialFeature: ["defaultCheck"] },
    ]
  }

  useEffect(() => {

    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        props.setValue('BillOfLadingMore[' + key2 + ']', value2);

      })

    }
    return () => {

    }
  }, [props.moreData])

  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
      <div className="billoflading-more-form">
        <DetailFormMore model={"bill-of-lading"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state} />
      </div>
    </div>
  )
}

export default More