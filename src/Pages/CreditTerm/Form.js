import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
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

    const { register, handleSubmit, setValue,trigger, getValues, reset, control, watch, formState: { errors } } = useForm({mode: "onChange"});

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)

        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Credit Term.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Credit term created successfully.")
                        navigate("/setting/general-settings/credit-term/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Credit term updated successfully.")
                    navigate("/setting/general-settings/credit-term/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

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
                        setValue('CreditTerm[' + key + ']', value);
                    })
                 
                    $(".starDate").val(res.data.data.StartDate)
                    $(".endDate").val(res.data.data.EndDate)

                 
        
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
            ControlOverlay(true)

            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
         
                $.each(res.data.data, function (key, value) {
                    setValue('CreditTerm[' + key + ']', value);
                })

                $(".starDate").val(res.data.data.StartDate)
                $(".endDate").val(res.data.data.EndDate)
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
            setValue("CreditTerm[Valid]", "1")
        } else {
            setValue("CreditTerm[Valid]", "0")
        }


    });
    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };
    return (
        <form>
             {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='CreditTerm' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="CreditTerm" model="credit-term" selectedId="CreditTermUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='CreditTerm' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Credit Term Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className={`control-label ${errors.CreditTerm ? errors.CreditTerm.CreditTerm? "has-error-label" : "" :""}`}>Credit Term</label>

                                    <input defaultValue='' {...register("CreditTerm[CreditTerm]",{ required: "Credit Code cannot be blank." })} className={`form-control ${errors.CreditTerm ? errors.CreditTerm.CreditTerm? "has-error" : "" :""}`} />
                                    <p>{errors.CreditTerm ? errors.CreditTerm.CreditTerm && <span style={{ color:"#A94442" }}>{errors.CreditTerm.CreditTerm.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Day</label>

                                    <input type="number" defaultValue='' {...register("CreditTerm[Day]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea defaultValue='' {...register("CreditTerm[Description]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('CreditTerm[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='CreditTerm' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="CreditTerm" model="credit-term" selectedId="CreditTermUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='CreditTerm' data={props} />}
        </form>



    )
}






export default Form