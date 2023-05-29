
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormMore from '../../Components/CommonElement/DetailFormMore';

function More(props) {
  var MoreItem = {
    formName: "DeliveryOrder",
    cardLength: "col-md-12",
    element: [
      { title: "Remark 1", id: "deliveryordermore-remark1", className: "reflect-field", name: "DeliveryOrderMore[Remark1]", dataTarget: "Remark1", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 2", id: "deliveryordermore-remark2", className: "reflect-field", name: "DeliveryOrderMore[Remark2]", dataTarget: "Remark2", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 3", id: "deliveryordermore-remark3", className: "reflect-field", name: "DeliveryOrderMore[Remark3]", dataTarget: "Remark3", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 4", id: "deliveryordermore-remark4", className: "reflect-field", name: "DeliveryOrderMore[Remark4]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Note", id: "deliveryordermore-note", className: "", name: "DeliveryOrderMore[Note]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Attachment", id: "deliveryordermore-attachment", className: "Attachments", name: "DeliveryOrderMore[Attachment][]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "file", onChange: "", specialFeature: [] },
      { title: "Header", id: "deliveryordermore-header", className: "", name: "DeliveryOrderMore[Header]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Remark", id: "deliveryordermore-remark", className: "", name: "DeliveryOrderMore[Remark]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "T&C", id: "deliveryordermore-tnc", className: "", name: "DeliveryOrderMore[TNC]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "Footer", id: "deliveryordermore-footer", className: "", name: "DeliveryOrderMore[Footer]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: `Valid`, id: `deliveryordermore-valid`, className: ``, name: `DeliveryOrderMore[Valid]`, dataTarget: ``, gridSize: "col-xs-12 col-md-12", type: "checkbox", onChange: "", specialFeature: ["defaultCheck"] },
    ]
  }

  useEffect(() => {

    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        props.setValue('DeliveryOrderMore[' + key2 + ']', value2);

      })

    }
    return () => {

    }
  }, [props.moreData])

  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
      <div className="deliveryorder-more-form">
        <DetailFormMore model={"delivery-order"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state} />
      </div>
    </div>
  )
}

export default More