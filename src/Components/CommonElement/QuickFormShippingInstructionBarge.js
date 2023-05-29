import React, {useContext, useEffect, useState} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $ from "jquery";
import { ControlOverlay, FilterQuotations} from '../../Components/Helper.js'
import {InitModalRadioTable} from "../BootstrapTableModal&Dropdown/InitModalRadioTable";
import { useNavigate } from "react-router-dom";

function QuickFormShippingInstructionBarge(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    const navigate = useNavigate();
    const [formType, setFormType] = useState("")
    const formName = props.ShippingInstructionItem.formName
    const formNameLowerCase = formName.toLowerCase()

           
      
    
  return (
    <div className={`${props.ShippingInstructionItem.cardLength}`}>
        <div className="card document lvl1">
            <div className="card-header">
                <h3 className="card-title">Shipping Instructions <input type="hidden" id={`${props.ShippingInstructionItem.formName}UUID`} />
                    <input type="hidden" id="UserPortCode" />
                </h3>
                <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                        <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    {props.ShippingInstructionItem.element.map((res, index) => {
                        var name = res.name
                     
                        return (res.type === "input-text")?
                        (
                            <div key={index} className={res.gridSize}>
                                <div className="form-group">
                                    <label className="control-label">{res.title}</label>
                                    {res.specialFeature.includes("required") ? 
                                        <input {...props.register(name,{required: `${res.title} cannot be blank.`})} className={`form-control ${res.className}`} defaultValue={res.defaultValue?res.defaultValue:""} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readonly")?true:false}/>
                                        :
                                        <input {...props.register(name)} className={`form-control ${res.className}`} data-target={res.dataTarget}  defaultValue={res.defaultValue?res.defaultValue:""} readOnly={res.specialFeature.includes("readonly")?true:false}/>
                                    }
                                </div>
                            </div>
                        ):
                        (
                            <div key={index} className={res.gridSize}>
                                <div className="form-group">
                                    <label className="control-label">{res.title}</label>
                                        {name=="DynamicModel[VoyageNum]"?
                                        
                                        <Controller
                                        name={name}
                                        control={props.control}
                                        defaultValue={res.defaultValue?res.defaultValue:""}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.register(name)}
                                                isClearable={true}
                                                value={
                                                    value
                                                        ? formContext.quickFormVoyageNum.find((c) => c.value === value)
                                                        : null
                                                }
                                                onChange={(val) =>{
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(val.value,res.dataTarget);
                                                    res.onChange && res.onChange(val);
                                                }}
                                                options={formContext.quickFormVoyageNum}
                                                className={`form-control  ${res.className}`}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                            />
                                        )}
                                     />     
                                        
                                        
                                        :
                                        
                                        <Controller
                                        name={name}
                                        control={props.control}
                                        defaultValue={res.defaultValue?res.defaultValue:""}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...props.register(name)}
                                                isClearable={true}
                                                value={
                                                    value
                                                    ? res.option?res.option.find((c) => c.value === value)
                                                    : null
                                                    : null
                                                }
                                                onChange={(val) =>{
                                                    val == null ? onChange(null) : onChange(val.value);
                                                    val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(val.value,res.dataTarget);
                                                    res.onChange && res.onChange(val);
                                                }}
                                                options={res.option?res.option:""}
                                                className={`form-control  ${res.className}`}
                                                classNamePrefix="select"
                                                menuPortalTarget={document.body}
                                                styles={props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                            />
                                        )}
                                     />               
                                        
                                    
                                    
                                    
                                        }
                                  
                                </div>    
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default QuickFormShippingInstructionBarge