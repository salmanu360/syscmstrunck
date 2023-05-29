
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay } from '../../Components/Helper.js'
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



function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, getValues, reset, trigger,control, watch, formState: { errors } } = useForm({mode: "onChange"});

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone") {

          
            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Currency Name has already been taken.") {
                        ToastNotify("error", "Duplicate Currency Name")
                        ControlOverlay(false)
                       
                    }
                    else {
                        ToastNotify("success", "Currency type created successfully.")
                        navigate("/setting/general-settings/currency/currency-type/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                       
                    }
                }

            })
        }
        else {
         
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Currency type updated successfully.")
                    navigate("/setting/general-settings/currency/currency-type/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                  
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
                        setValue('CurrencyType[' + key + ']', value);
                    })

                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }

                    ControlOverlay(false)
                    trigger();


                })


            }
        } else {
          

            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                ControlOverlay(true)
                $.each(res.data.data, function (key, value) {
                    setValue('CurrencyType[' + key + ']', value);
                })
                if (res.data.data.Valid == "1") {
                    $('.validCheckbox').prop("checked", true)
                }
                else {
                    $('.validCheckbox').prop("checked", false)

                }
                ControlOverlay(false)
                trigger();


            })
        }

        return () => {

        }
    }, [formState])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("CurrencyType[Valid]", "1")
        } else {
            setValue("CurrencyType[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };


    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='CurrencyType' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="CurrencyType" model="currency-type" selectedId="CurrencyTypeUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='CurrencyType' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Currency Type Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className={`control-label ${errors.CurrencyType ? errors.CurrencyType.CurrencyName? "has-error-label" : "" :""}`}>Currency Name</label>
                                    <input defaultValue='' {...register("CurrencyType[CurrencyName]", { required: "Currency Name cannot be blank." })} className={`form-control ${errors.CurrencyType ? errors.CurrencyType.CurrencyName? "has-error" : "" :""}`} />
                                    <p>{errors.CurrencyType ? errors.CurrencyType.CurrencyName && <span style={{ color:"#A94442" }}>{errors.CurrencyType.CurrencyName.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Currency Symbol</label>

                                    <input defaultValue='' {...register("CurrencyType[CurrencySymbol]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Account Code</label>

                                    <input defaultValue='' {...register("CurrencyType[AccountCode]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('CurrencyType[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='CurrencyType' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="CurrencyType" model="currency-type" selectedId="CurrencyTypeUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='CurrencyType' data={props} />}
        </form>



    )
}






export default Form