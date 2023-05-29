import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown,initHoverSelectDropownTitle } from '../../Components/Helper.js'
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


const sizeOption=[
    {
        "value": "C0084",
        "label": "20'(C0084)"
    },
    {
        "value": "C0085",
        "label": "40'(C0085)"
    },

]


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
                    if (res.data.message == "Duplicate Container Type.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Container Type created successfully.")
                        navigate("/setting/asset-settings/container-type/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Container Type updated successfully.")
                    navigate("/setting/asset-settings/container-type/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

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

        initHoverSelectDropownTitle()
        setValue("ContainerType[Size]","") 

        $(document).on("keypress", ".inputDecimalFourPlaces", function () {
            if (this.value != "") {
                if (this.value.match("^[a-zA-Z]*$")) {
                    return false
                }
    
            }
        })
        $(document).on("blur", ".inputDecimalFourPlaces", function () {
            if (this.value != "") {
                if (!this.value.match("^[a-zA-Z]*$")) {
                    this.value = parseFloat(this.value).toFixed(4);
                }
                else {
                    this.value = ""
                }
    
            }
        })

        $('.validCheckbox').unbind('change').bind('change', function () {
            if ($(this).prop("checked")) {
                setValue("ContainerType[Valid]", "1")
            } else {
                setValue("ContainerType[Valid]", "0")
            }
    
    
        });
    
        
    


        if (formState) {
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)

                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('ContainerType[' + key + ']', value);
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
            ControlOverlay(true)

            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
         
                $.each(res.data.data, function (key, value) {
                    setValue('ContainerType[' + key + ']', value);
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

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };


    return (
        <form >
        {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='ContainerType' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="ContainerType" model="container-type" selectedId="ContainerTypeUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='ContainerType' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Container Type Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                               
                                    <label className={`control-label ${errors.ContainerType ? errors.ContainerType.ContainerType? "has-error-label" : "" :""}`}>Container Type</label>
                                    <input defaultValue='' {...register("ContainerType[ContainerType]",{ required: "Container Type cannot be blank." })} className={`form-control ${errors.ContainerType ? errors.ContainerType.ContainerType? "has-error" : "" :""}`} />
                                    <p>{errors.ContainerType ? errors.ContainerType.ContainerType && <span style={{ color:"#A94442" }}>{errors.ContainerType.ContainerType.message}</span> : ""}</p>
                                </div>
                            </div>

                          

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">                                  
                                <label className={`control-label ${errors.ContainerType ? errors.ContainerType.Size? "has-error-label" : "" :""}`} >Size </label>

                                        <Controller
                                        name="ContainerType[Size]"
                                        id="Size"
                                        control={control}
                                       
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("ContainerType[Size]", { required: "Size cannot be blank." })}
                                                value={value ? sizeOption.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={sizeOption}
                                                title={value}
                                                className={`form-control ${errors.ContainerType ? errors.ContainerType.Size? "has-error-select" : "" :""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                     <p>{errors.ContainerType ? errors.ContainerType.Size && <span style={{ color:"#A94442" }}>{errors.ContainerType.Size.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Length(m)</label>

                                    <input defaultValue='' {...register("ContainerType[Length]")} className={`form-control inputDecimalFourPlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Width(m)</label>

                                    <input defaultValue='' {...register("ContainerType[Width]")} className={`form-control inputDecimalFourPlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Height(m)</label>

                                    <input defaultValue='' {...register("ContainerType[Height]")} className={`form-control inputDecimalFourPlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Net Weight(kg)</label>

                                    <input defaultValue='' {...register("ContainerType[NetWeight]")} className={`form-control inputDecimalFourPlaces`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Tues</label>

                                    <input defaultValue='' {...register("ContainerType[Tues]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea defaultValue='' {...register("ContainerType[Description]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('ContainerType[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='ContainerType' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="ContainerType" model="container-type" selectedId="ContainerTypeUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='ContainerType' data={props} />}


        </form>



    )
}






export default Form