
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import { GetUpdateData, CreateData, UpdateData, ToastNotify,ControlOverlay,initHoverSelectDropownTitle} from '../../Components/Helper.js'
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

function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();
    const regionOption = [

        {
            value: "West",
            label: "West",
        },
        {
            value: "East",
            label: "East",
        }
     


    ]
    const { register, handleSubmit, setValue, getValues, reset, control, trigger,watch, formState: { errors } } = useForm({mode: "onChange"});
    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone") {
          
            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Port Code.") {
                        ToastNotify("error", "Duplicate port code.")
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Area created successfully.")
                        navigate("/setting/general-settings/port/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
   
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Area updated successfully.")
                    navigate("/setting/general-settings/port/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

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
       

        setValue("Area[Region]","") 
        // $(".region").find(".select__control").addClass("has-error")
        if (formState) {
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)
                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {
                   
                    $.each(res.data.data, function (key, value) {
                        setValue('Area[' + key + ']', value);
                    })
                    ControlOverlay(false)
                    trigger();

                })
                
            }
      
        }
        else {
            ControlOverlay(true)
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                $.each(res.data.data, function (key, value) {
                    setValue('Area[' + key + ']', value);
                })
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
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='Area' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Area" model="area" selectedId="AreaUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Area' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Port Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Area ? errors.Area.PortCode? "has-error-label" : "" :""}`}>Port Code</label>

                                    <input defaultValue='' {...register("Area[PortCode]", { required: "Port Code cannot be blank." })} className={`form-control ${errors.Area ? errors.Area.PortCode? "has-error" : "" :""}`} />
                                    <p>{errors.Area ? errors.Area.PortCode && <span style={{ color:"#A94442" }}>{errors.Area.PortCode.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Area</label>

                                    <input defaultValue='' {...register("Area[Area]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Area ? errors.Area.Region? "has-error-label" : "" :""}`} >Region
                                    </label>
                                    <Controller
                                        name="Area[Region]"
                                        id="Region"
                                        control={control}
                                       
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Area[Region]", { required: "Region cannot be blank." })}
                                                value={value ? regionOption.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={regionOption}
                                                title={value}
                                                className={`form-control ${errors.Area ? errors.Area.Region? "has-error-select" : "" :""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                   
                                    <p>{errors.Area ? errors.Area.Region && <span style={{ color: "#A94442" }}>{errors.Area.Region.message }</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea defaultValue='' {...register("Area[Description]")} className={`form-control`} />
                                </div>
                            </div>


                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='Area' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Area" model="area" selectedId="AreaUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Area' data={props} />}
        </form>



    )
}






export default Form