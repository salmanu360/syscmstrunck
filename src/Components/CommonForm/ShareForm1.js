
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay } from '../../Components/Helper.js'
import GlobalContext from "../../Components/GlobalContext"
import Select from 'react-select'
import $ from "jquery";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
    useParams,
    useNavigate
} from "react-router-dom";




         
function ShareForm1(props) {

    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, getValues,trigger, reset, control, watch, formState: { errors } } = useForm({mode: "onChange"});
    
    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone") {
           

            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                     
                    if (res.data.message == `Duplicate ${props.data.Title}.`) {
                        ToastNotify("error", `Duplicate ${props.data.Title}.`)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", props.data.Title+" created successfully.")
                        navigate(props.data.groupLink+props.data.modelLink+"/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
        
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", props.data.Title+" updated successfully.")
                    navigate(props.data.groupLink+props.data.modelLink+"/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


    }
    useEffect(() => {
        if (state == null) {
            reset()
            setFormState({ formType: "Update", id: params.id })
        }
        else {
            reset()
            setFormState(state)
        }
        return () => {

        }
    }, [state])

    useEffect(() => {
        trigger();
    
      
        if (formState) {
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)
                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue(props.data.model+'[' + key + ']', value);
                    })
                    
                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }
                    ControlOverlay(false)
                    trigger()

                })
            }
        }
        else {
            ControlOverlay(true)
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                $.each(res.data.data, function (key, value) {
                    setValue(props.data.model+'[' + key + ']', value);
                })
                
                if (res.data.data.Valid == "1") {
                    $('.validCheckbox').prop("checked", true)
                }
                else {
                    $('.validCheckbox').prop("checked", false)

                }
                ControlOverlay(false)
                trigger()

            })
        }

        return () => {

        }
    }, [formState])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
         
            setValue(props.data.model+"[Valid]", "1")
        } else {
            setValue(props.data.model+"[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
        <form >
         {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title={props.data.Title} model={props.data.modelLink} selectedId={props.data.model+"UUIDs"} id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} />}
        <div className="col-md-12">
            <div className="card card-primary">
                <div className="card-header">{props.data.Title} Form</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-xs-12 col-md-12">
                            <div className="form-group">
                                <label className={`control-label ${errors[`${props.data.model}`]? errors[`${props.data.model}`][`${props.data.model}`]? "has-error-label" : "" :""}`}>{props.data.Title}</label>
                                <input defaultValue='' {...register(`${props.data.model}[${props.data.model}]`, { required: `${props.data.Title} cannot be blank.` })} className={`form-control ${errors[`${props.data.model}`] ? errors[`${props.data.model}`][`${props.data.model}`]? "has-error" : "" :""}`}  />
                                <p>{errors[`${props.data.model}`] ? errors[`${props.data.model}`][`${props.data.model}`] && <span style={{ color:"#A94442" }}>{errors[`${props.data.model}`][`${props.data.model}`]["message"]}</span> : ""}</p>
                            </div>
                        </div>

                        <div className="col-xs-12 col-md-12">
                            <div className="form-group">
                                <label className="control-label">Description</label>

                                <textarea defaultValue='' {...register(`${props.data.model}[Description]`)} className={`form-control`} />
                            </div>
                        </div>



                        <div className="col-xs-12 col-md-3 mt-2">
                            <div className="form-group mt-4 mb-1">
                                <input type="checkbox" id="validCheckbox" className='validCheckbox' defaultChecked />
                                <input type="text" className="form-control d-none" defaultValue='1' {...register(`${props.data.model}[Valid]`)} />
                                <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title={props.data.Title} model={props.data.modelLink} selectedId={props.data.model+"UUIDs"} id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title={props.data.Title} data={props} />}
    </form>



    )
}






export default ShareForm1