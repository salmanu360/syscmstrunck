
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormMore from '../../Components/CommonElement/DetailFormMore';

function More(props) {

  var defaultTC="Remarks : - It is the responsibility of Shipper's transporter to check and ensure the above container's is/are in good condition without damage/cut/hole/oil stain/DG sticker attached/pungent smell (ie: Fertilizer/Chemical & ETC) prior to receipt. The carrier is not liable for any additional haulage/removal of DG sticker charges and/or lolo charges incurred after the container(s) is/towed out from the depot or port."
  var MoreItem = {
    formName: "ContainerReleaseOrder",
    cardLength: "col-md-12",
    element: [
      { title: "Remark 1", id: "containerreleaseordermore-remark1", className: "reflect-field", name: "ContainerReleaseOrderMore[Remark1]", dataTarget: "Remark1", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 2", id: "containerreleaseordermore-remark2", className: "reflect-field", name: "ContainerReleaseOrderMore[Remark2]", dataTarget: "Remark2", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 3", id: "containerreleaseordermore-remark3", className: "reflect-field", name: "ContainerReleaseOrderMore[Remark3]", dataTarget: "Remark3", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Remark 4", id: "containerreleaseordermore-remark4", className: "reflect-field", name: "ContainerReleaseOrderMore[Remark4]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "255", onChange: "", specialFeature: [] },
      { title: "Note", id: "containerreleaseordermore-note", className: "", name: "ContainerReleaseOrderMore[Note]", dataTarget: "Remark4", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Attachment", id: "containerreleaseordermore-attachment", className: "Attachments", name: "ContainerReleaseOrderMore[Attachment][]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "file", onChange: "", specialFeature: [] },
      { title: "Header", id: "containerreleaseordermore-header", className: "", name: "ContainerReleaseOrderMore[Header]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: "Remark", id: "containerreleaseordermore-remark", className: "", name: "ContainerReleaseOrderMore[Remark]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [] },
      { title: "T&C", id: "containerreleaseordermore-tnc", className: "", name: "ContainerReleaseOrderMore[TNC]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-textarea", row: "2", onChange: "", specialFeature: [],defaultValue:defaultTC},
      { title: "Footer", id: "containerreleaseordermore-footer", className: "", name: "ContainerReleaseOrderMore[Footer]", dataTarget: "", gridSize: "col-xs-12 col-md-12", type: "input-text", maxlength: "2000", onChange: "", specialFeature: [] },
      { title: `Valid`, id: `containerreleaseordermore-valid`, className: ``, name: `ContainerReleaseOrderMore[Valid]`, dataTarget: ``, gridSize: "col-xs-12 col-md-12", type: "checkbox", onChange: "", specialFeature: ["defaultCheck"] },
    ]
  }

  useEffect(() => {

    if (props.moreData) {
      $.each(props.moreData, function (key2, value2) {
        props.setValue('ContainerReleaseOrderMore[' + key2 + ']', value2);

      })

    }
    return () => {

    }
  }, [props.moreData])

  return (
    <div className={`DetailFormDetails More`} id="MoreForm">
      <div className="containerreleaseorder-more-form">
        <DetailFormMore model={"container-release-order"} register={props.register} control={props.control} errors={props.errors} MoreItem={MoreItem} setValue={props.setValue} state={props.state} />
      </div>
    </div>
  )
}

export default More