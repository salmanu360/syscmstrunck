import React, {useContext, useEffect} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext";
import {CheckBoxHandle} from "../Helper";
import $ from "jquery";

function DetailFormHauler(props) {
    
  return (
    <>
        {props.HaulerItem.haulerList.map((res, index) => {
                const formName = props.HaulerItem.formName;
                const haulerType = res;
                const lowercaseFormName = props.HaulerItem.formName.toLowerCase();
                const lowercaseHaulerType = res.toLowerCase();
                var element=[
                    {title:"ROC", id:`CompanyROC-${haulerType}Hauler-DetailForm`, className:`dropdownInputCompany reflect-field`, name:`${formName}Hauler[${haulerType}HaulerCode]`, dataTarget:`CompanyROC-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                    {title:"Company Name", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulercompanyname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}Hauler[${haulerType}HaulerCompanyName]`, dataTarget:`CompanyName-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:"Credit Term", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulercreditterm`, className:"credit_term", name:`${formName}Hauler[${haulerType}HaulerCreditTerm]`, dataTarget:`CreditTerm-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.HaulerItem.creditTerm, onChange:"", specialFeature:[]} ,
                    {title:"Credit Limit", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulercreditlimit`, className:`decimalDynamicForm inputDecimalTwoPlaces inputDecimalId`, name:`${formName}Hauler[${haulerType}HaulerCreditLimit]`, dataTarget:`CreditLimit-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Code ", id:`BranchCode-${haulerType}Hauler-DetailForm`, className:`dropdownInputBranch reflect-field`, name:`${formName}Hauler[${haulerType}HaulerBranchCode]`, dataTarget:`BranchCode-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[""]},
                    {title:"Branch Name", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchname`, className:`reflect-field OriReadOnlyClass`, name:`${formName}Hauler[${haulerType}HaulerBranchName]`, dataTarget:`BranchName-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                    {title:"Branch Tel", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchtel`, className:`reflect-field phone`, name:`${formName}Hauler[${haulerType}HaulerBranchTel]`, dataTarget:`BranchTel-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Fax", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchfax`, className:`reflect-field phone`, name:`${formName}Hauler[${haulerType}HaulerBranchFax]`, dataTarget:`BranchFax-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Email", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchemail`, className:`reflect-field`, name:`${formName}Hauler[${haulerType}HaulerBranchEmail]`, dataTarget:`BranchEmail-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Address Line 1", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchaddressline1`, className:``, name:`${formName}Hauler[${haulerType}HaulerBranchAddressLine1]`, dataTarget:`BranchAddressLine1-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Address Line 2", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchaddressline2`, className:``, name:`${formName}Hauler[${haulerType}HaulerBranchAddressLine2]`, dataTarget:`BranchAddressLine2-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Address Line 3", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchaddressline3`, className:``, name:`${formName}Hauler[${haulerType}HaulerBranchAddressLine3]`, dataTarget:`BranchAddressLine3-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Postcode", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchpostcode`, className:``, name:`${formName}Hauler[${haulerType}HaulerBranchPostcode]`, dataTarget:`BranchPostcode-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch City", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchcity`, className:``, name:`${formName}Hauler[${haulerType}HaulerBranchCity]`, dataTarget:`BranchCity-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Country", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchcountry`, className:``, name:`${formName}Hauler[${haulerType}HaulerBranchCountry]`, dataTarget:`BranchCountry-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Branch Coordinates", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}haulerbranchcoordinates`, className:``, name:`${formName}Hauler[${haulerType}HaulerBranchCoordinates]`, dataTarget:`BranchCoordinates-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Attention Name", id:`AttentionName-${haulerType}Hauler-DetailForm`, className:`reflect-field`, name:`${formName}Hauler[${haulerType}HaulerAttentionName]`, dataTarget:`AttentionName-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text-withModal", onChange:"", specialFeature:[]},
                    {title:"Attention Tel", id:`AttentionTel-${haulerType}Hauler-DetailForm`, className:`reflect-field`, name:`${formName}Hauler[${haulerType}HaulerAttentionTel]`, dataTarget:`AttentionTel-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Attention Email", id:`AttentionEmail-${haulerType}Hauler-DetailForm`, className:`reflect-field`, name:`${formName}Hauler[${haulerType}HaulerAttentionEmail]`, dataTarget:`AttentionEmail-${haulerType}Hauler`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Vehicle No.", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}vehiclenum`, className:``, name:`${formName}Hauler[${haulerType}VehicleNum]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Driver Name", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}drivername`, className:``, name:`${formName}Hauler[${haulerType}DriverName]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Driver IC", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}driverid`, className:``, name:`${formName}Hauler[${haulerType}DriverID]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                    {title:"Driver Tel", id:`${lowercaseFormName}hauler-${lowercaseHaulerType}drivertel`, className:`phone`, name:`${formName}Hauler[${haulerType}DriverTel]`, dataTarget:``, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                ];
                return(
                    <div key={index} className={`${lowercaseFormName}-${lowercaseHaulerType}-form`}>
                        <div className="card lvl2">
                            <div className="card-header">
                                <h3 className="card-title">{res} </h3>
                                <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <BuildUIForHaulerCompany props={props} element={element} cardIndex={index}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        })}
    </>
  )
}

export default DetailFormHauler

function BuildUIForHaulerCompany(props){

    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)

    const formName = props.props.HaulerItem.formName
    const lowercaseFormName = props.props.HaulerItem.formName.toLowerCase()
    const haulerType = props.props.HaulerItem.haulerList
    const dropdownInputStyle = {
        maxHeight: "800px",
        overflowY: "auto",
        maxWidth: "1500px"
      };
    
      function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }
      
    return(
        <>
            {props.element.map((res, index) => {
                    var name = res.name
                    return (res.type === "input-text")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                    <input {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                    :
                                    <input {...props.props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                }
                            </div>
                        </div>
                    ):
                    (res.type === "input-number")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                <input type={"number"} {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                    :   
                                <input type={"number"} {...props.props.register(name)} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                }
                                {console.log(props.props.errors)}
                            </div>
                        </div>
                    ):
                    (res.type === "flatpickr-input")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <Controller 
                                    name={name}
                                    id={res.id}
                                    control={props.props.control}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Flatpickr
                                                {...props.props.register(name)}
                                                style={{ backgroundColor: "white" }}
                                                value={""}
                                                data-target={res.dataTarget}
                                                onChange={val => {
                                                    val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),res.dataTarget);
                                                    val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY"),res.dataTarget)
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
                    ):
                    (res.type === "dropdown")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <Controller
                                    name={name}
                                    control={props.props.control}
                                    data-target={res.dataTarget}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            {...props.props.register(name)}
                                            isClearable={true}
                                            data-target={res.dataTarget}
                                            value={
                                                value
                                                ? res.option.find((c) => c.value === value)
                                                : null
                                            }
                                            onChange={(val) =>{
                                                val == null ? onChange(null) : onChange(val.value);
                                            }}
                                            onKeyDown={handleKeydown}
                                            options={res.option?res.option:""}
                                            className={`form-control ${res.className}`}
                                            classNamePrefix="select"
                                            menuPortalTarget={document.body}
                                            styles={props.props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                        />
                                    )}
                                />               
                            </div>    
                        </div>
                    ):
                    (res.type === "input-textarea")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                <textarea {...props.props.register(name,{required: `${res.title} cannot be blank.`})} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                    :   
                                <textarea {...props.props.register(name)} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                }
                                {console.log(props.props.errors)}
                            </div>
                        </div>
                    ):
                    (res.type === "input-dropdownInputCompany")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <input type="hidden" id={`${lowercaseFormName}hauler-${haulerType[props.cardIndex].toLowerCase()}haulercode`} className={`form-control`} {...props.props.register(name)} readOnly="readOnly" data-target={`CompanyID-${haulerType[props.cardIndex]}Hauler`} />
                                <input defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}${haulerType[props.cardIndex].toLowerCase()}-dropdown d-none`}>    
                                    <table id={`CompanyROC-${haulerType[props.cardIndex]}Hauler-DetailForm-Table`}></table>
                                </div>
                            </div>
                        </div>
                    ):
                    (res.type === "input-dropdownInputBranch")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <input type="hidden" id={`${lowercaseFormName}hauler-${haulerType[props.cardIndex].toLowerCase()}haulerbranchcode`} className={`form-control`}  {...props.props.register(name)} readOnly="readOnly" data-target={`BranchID-${haulerType[props.cardIndex]}Hauler`} />
                                <input defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}${haulerType[props.cardIndex].toLowerCase()}-dropdown d-none`}>    
                                    <table id={`BranchCode-${haulerType[props.cardIndex]}Hauler-DetailForm-Table`}></table>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (res.type === "input-text-withModal")?
                    (
                        <div key={index} className={res.gridSize}>
                        <div className="form-group">
                            <label className="control-label">{res.title}</label>
                            <div className="input-group">
                                {res.specialFeature.includes("required") ? 
                                    <input {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                    :
                                    <input {...props.props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                }
                                <div className="input-group-append openAttentionModal" data-refer={`${lowercaseFormName}${haulerType[props.cardIndex].toLowerCase()}-branchcode`}><span className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></span></div>
                            </div>
                        </div>
                    </div>
                    )
                    :
                    (res.type === "checkbox")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className={`form-group field-${lowercaseFormName}-valid`}>
                                <input type={"checkbox"} className="mt-1" id={res.id} onChange={CheckBoxHandle} defaultChecked={res.specialFeature.includes("defaultCheck")? true:false}></input>
                                <input type={"hidden"} className="valid" {...props.props.register(name)} defaultValue={res.specialFeature.includes("defaultCheck")? 1:0}/>
                                <label htmlFor={res.id} className="control-label ml-1">Valid</label>
                            </div>
                        </div>
                    )
                    :
                    (
                        <></>
                    )
                }) 
            }
        </>
    )
}