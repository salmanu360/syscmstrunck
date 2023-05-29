import React, { useContext, useEffect } from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $ from "jquery";
import { ControlOverlay, CheckBoxHandle } from "../Helper";

function DetailFormMore(props) {
  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  var lowercaseFormName = props.MoreItem.formName.toLowerCase()

  useEffect(() => {
    $(".Attachments").click(function () {
      //reset jqeury filer container
      if ($("#MoreForm").find('.jFiler-theme-default').length > 1) {
        $("#MoreForm").find('.jFiler-theme-default').last().unwrap()
      }
    })


  }, [])

  useEffect(() => {
    if (props.state) {
      if (props.state.formType !== "New") {
        $("#MoreForm").find(".jFiler-input").remove()
        $("#MoreForm").find(".jFiler-items").empty()

        if (props.state.formType !== "Clone") {
           if(props.state.transferFromModel){
            getFiles(props.state.id,props.state.transferFromModel)
           }else{
            getFiles(props.state.id)
           }
        
        }
        else {
          getFiles();
        }
        if ($("#MoreForm").find('.jFiler-theme-default').length > 1) {
          $("#MoreForm").find('.jFiler-theme-default').last().unwrap()
        }
        // }
      } else {
        $("#MoreForm").find(".jFiler-input").remove()
        $("#MoreForm").find(".jFiler-items").empty()
        getFiles()
      }
    }

    return () => {
    }
  }, [props.state])

  useEffect(() => {
    if(formContext.formState){
      if(formContext.formState.formType == "Update"){
        if(props.state == null){
          getFiles(formContext.formState.id)
        }
      }
    }
    return () => {
    }
  }, [formContext.formState])
  

  function getFiles(id,transferFromModel) {
    var attachmentModel=props.model;
    if(transferFromModel){
      attachmentModel=transferFromModel
    }

    console.log(attachmentModel)

    if (id) {
      $.ajax({
        url: globalContext.globalHost + globalContext.globalPathLink + attachmentModel + "/load-files",
        type: "POST",
        dataType: "json",
        headers: {
          "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
        },
        data: { uuid: id },
        success: function (data) {
          //var fileData=[]
          if (id == undefined) {
            data = []
          }

          $.each(data.data, function (key, value) {
            var link = value.file
            let newLink = link.replace(/^(\.\.\/)+/, '');
            value.file = globalContext.globalHost + "/syscms/" + newLink
          })

          InitAttachment(data.data, lowercaseFormName + "more-attachment")
        }
      });
    }
    else {
      var data = []
      InitAttachment(data, lowercaseFormName + "more-attachment")
    }
  }

  function InitAttachment(data, id) {

    window.$('#' + id).filer({
      showThumbs: true,
      addMore: true,
      allowDuplicates: false,
      theme: 'default',
      templates: {
        itemAppendToEnd: true,
        box: '<ul class="jFiler-items-list jFiler-items-default"></ul>',
        item: `<li class="jFiler-item">
                    <div class="jFiler-item-container">
                      <div class="jFiler-item-inner">
                        <div class="jFiler-item-icon pull-left"></div>
                          <div class="jFiler-item-info pull-left">
                            <span class="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>
                            <span class="jFiler-item-others">
                              <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span class="jFiler-item-status">{{fi-progressBar}}</span>
                            </span>
                            <div class="jFiler-item-assets">
                              <ul class="list-inline">
                                <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                            </ul>
                          </div>
                          <div><input type="hidden" name="name[]" value="{{fi-name}}"></div>
                          <div class="row"><div><input class="PermitAttachmentCheckbox" type="checkbox"><input class="d-none PermitAttachment" type="text" name="PermitAttachment[]"></div><div><input name="caption[]"></div>
                        </div>
                      </div>
                    </div>
                  </li>`,
        itemAppend: `
            <li class="jFiler-item">
              <div class="jFiler-item-container">
                <div class="jFiler-item-inner">
                  <div class="jFiler-item-icon pull-left"></div>
                    <div class="jFiler-item-info pull-left">
                      <span class="jFiler-item-title" title="{{fi-name}}">{{fi-name | limitTo:30}}</span>
                      <span class="jFiler-item-others">
                        <span>| size: {{fi-size2}} | </span><span>type: {{fi-extension}}</span><span class="jFiler-item-status">{{fi-progressBar}}</span>
                      </span>
                      <div class="jFiler-item-assets">
                        <ul class="list-inline">
                          <li><a href="{{fi-url}}" class="text-secondary" target="_blank"><i class="fa fa-search-plus"></i></a></li>
                          <li><a href="{{fi-url}}" class="text-secondary" download><i class="fa fa-download"></i></a></li>
                          <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>
                      </ul>
                    </div>
                    <div><input type="hidden" name="name[]" value="{{fi-name}}"></div>
                    <div class="row"><div><input  class="PermitAttachmentCheckbox"  type="checkbox"><input class="d-none PermitAttachment" type="text" name="PermitAttachment[]"></div><div><input name="caption[]"></div>
                  </div>
                </div>
              </div>
            </li>`,
      },
      files: data,
      afterRender: function () {
        $.each(data, function (key, value) {
          var caption = $(".jFiler-item").find("input[name='caption[]']")[key];
          var PermitAttachment = $(".jFiler-item").find("input[name='PermitAttachment[]']")[key];
          var PermitAttachmentCheckBox = $(".jFiler-item").find(".PermitAttachmentCheckbox")[key];

          $(caption).val(value.caption)
          if (value.permitAttachment) {
            $(PermitAttachment).val(value.permitAttachment)
            if (value.permitAttachment == "1") {
              $(PermitAttachmentCheckBox).prop("checked", true)
            } else {
              $(PermitAttachmentCheckBox).prop("checked", false)
            }
          }


        })

      }

    });
    ControlOverlay(false)
  }

  return (
    <>
      {props.MoreItem.element.map((res, index) => {
        var name = res.name
        return (res.type === "input-text") ?
          (
            <div key={index} className={res.gridSize}>
              <div className="form-group">
                <label className="control-label">{res.title}</label>
                {res.specialFeature.includes("required") ?
                  <input {...props.register(name, { required: `${res.title} cannot be blank.` })} className={`form-control ${res.className}`} readOnly={res.specialFeature.includes("readonly") ? true : false} />
                  :
                  <input {...props.register(name)} defaultValue={res.defaultValue} className={`form-control ${res.className}`} readOnly={res.specialFeature.includes("readonly") ? true : false} />
                }
              </div>
            </div>
          ) :
          (res.type === "input-number") ?
            (
              <div key={index} className={res.gridSize}>
                <div className="form-group">
                  <label className="control-label">{res.title}</label>
                  {res.specialFeature.includes("required") ?
                    <input type={"number"} {...props.register(name, { required: `${res.title} cannot be blank.` })} className={`form-control ${res.className}`} />
                    :
                    <input type={"number"} {...props.register(name)} className={`form-control ${res.className}`} />
                  }
                </div>
              </div>
            ) :
            (res.type === "flatpickr-input") ?
              (
                <div key={index} className={res.gridSize}>
                  <div className="form-group">
                    <label className="control-label">{res.title}</label>
                    <Controller
                      name={name}
                      id={res.id}
                      control={props.control}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <Flatpickr
                            {...props.register(name)}
                            style={{ backgroundColor: "white" }}
                            value={""}
                            onChange={val => {
                              val == null ? onChange(null) : onChange(moment(val[0]).format("DD/MM/YYYY"), res.dataTarget);
                              val == null ? formContext.setStateHandle(null, res.dataTarget) : formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY"), res.dataTarget)
                            }}
                            className={`form-control c-date-picker ${res.className}`}
                            options={{
                              dateFormat: "d/m/Y"
                            }}

                          />
                        </>
                      )}
                    />
                  </div>
                </div>
              ) :
              (res.type === "dropdown") ?
                (
                  <div key={index} className={res.gridSize}>
                    <div className="form-group">
                      <label className="control-label">{res.title}</label>
                      <Controller
                        name={name}
                        control={props.control}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            {...props.register(name)}
                            isClearable={true}
                            value={
                              value
                                ? res.option.find((c) => c.value === value)
                                : null
                            }
                            onChange={(val) => {
                              val == null ? onChange(null) : onChange(val.value);
                            }}
                            options={res.option ? res.option : ""}
                            className={`form-control ${res.className}`}
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) :
                (res.type === "input-textarea") ?
                  (
                    <div key={index} className={res.gridSize}>
                      <div className="form-group">
                        <label className="control-label">{res.title}</label>
                        {res.specialFeature.includes("required") ?
                          <textarea {...props.register(name, { required: `${res.title} cannot be blank.` })} defaultValue={res.defaultValue ? res.defaultValue : ""} className={`form-control ${res.className}`} />
                          :
                          <textarea {...props.register(name)} defaultValue={res.defaultValue ? res.defaultValue : ""} className={`form-control ${res.className}`} />
                        }
                      </div>
                    </div>
                  ) :
                  (res.type === "file") ?
                    (
                      <div key={index} className={res.gridSize}>
                        <div className="form-group attachmentGroup">
                          <label className="control-label">Attachment</label>
                          <input type="file" id={res.id} multiple {...props.register(name)} className={`${res.className}`} />
                        </div>
                      </div>
                    ) :
                    (res.type === "checkbox") ?
                      (
                        <div key={index} className={res.gridSize}>
                          <div className={`form-group field-${lowercaseFormName}-valid`}>
                            <input type={"checkbox"} className="mt-1" id={res.id} onChange={CheckBoxHandle} defaultChecked={res.specialFeature.includes("defaultCheck") ? true : false}></input>
                            <input type={"hidden"} className="valid" {...props.register(name)} defaultValue={res.specialFeature.includes("defaultCheck") ? 1 : 0} />
                            <label htmlFor={res.id} className="control-label ml-1">Valid</label>
                          </div>
                        </div>
                      )
                      :
                      (
                        <></>
                      )
      })}
    </>
  )
}

export default DetailFormMore