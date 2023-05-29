
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

    const { register, handleSubmit, setValue, getValues,trigger, reset, control, watch, formState: { errors } } = useForm({mode: "onChange"});

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        if (formState.formType == "New" || formState.formType == "Clone") {

          
            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate UN Number.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                       
                    }
                    else {
                        ToastNotify("success", "UN number created successfully.")
                        navigate("/setting/sales-settings/u-n-number/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                       
                    }
                }

            })
        }
        else {
         
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "UN number updated successfully.")
                    navigate("/setting/sales-settings/u-n-number/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                  
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
        trigger()
        if (formState) {
            
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)

                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('UNNumber[' + key + ']', value);
                    })

                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }

                    if (res.data.data.Import == 1) {
                        $('.importCheckbox').prop("checked", true)
                    }
                    else {
                        $('.importCheckbox').prop("checked", false)
    
                    }
    
                    if (res.data.data.Export == 1) {
                        $('.exportCheckbox').prop("checked", true)
                    }
                    else {
                        $('.exportCheckbox').prop("checked", false)
    
                    }
    
                    if (res.data.data.TS == 1) {
                        $('.transhipmentCheckbox').prop("checked", true)
                    }
                    else {
                        $('.transhipmentCheckbox').prop("checked", false)
    
                    }

                    ControlOverlay(false)
                    trigger()

                })


            }
        } else {
          

            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                ControlOverlay(true)
                $.each(res.data.data, function (key, value) {
                    setValue('UNNumber[' + key + ']', value);
                })
                if (res.data.data.Valid == "1") {
                    $('.validCheckbox').prop("checked", true)
                }
                else {
                    $('.validCheckbox').prop("checked", false)

                }

                if (res.data.data.Import == 1) {
                    $('.importCheckbox').prop("checked", true)
                }
                else {
                    $('.importCheckbox').prop("checked", false)

                }

                if (res.data.data.Export == 1) {
                    $('.exportCheckbox').prop("checked", true)
                }
                else {
                    $('.exportCheckbox').prop("checked", false)

                }

                if (res.data.data.TS == 1) {
                    $('.transhipmentCheckbox').prop("checked", true)
                }
                else {
                    $('.transhipmentCheckbox').prop("checked", false)

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
            setValue("UNNumber[Valid]", "1")
        } else {
            setValue("UNNumber[Valid]", "0")
        }
    });

    $('.exportCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("UNNumber[Export]", "1")
        } else {
            setValue("UNNumber[Export]", "0")
        }
    });

    $('.importCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("UNNumber[Import]", "1")
        } else {
            setValue("UNNumber[Import]", "0")
        }
    });

    $('.transhipmentCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("UNNumber[TS]", "1")
        } else {
            setValue("UNNumber[TS]", "0")
        }
    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='UNNumber' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="UNNumber" model="u-n-number" selectedId="UNNumberUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='UNNumber' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">UN Number Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.UNNumber ? errors.UNNumber.UNNumber? "has-error-label" : "" :""}`}>UN Number</label>

                                    <input defaultValue='' {...register("UNNumber[UNNumber]",{ required: "UN Number cannot be blank." })} className={`form-control ${errors.UNNumber ? errors.UNNumber.UNNumber? "has-error" : "" :""}`} />
                                    <p>{errors.UNNumber ? errors.UNNumber.UNNumber && <span style={{ color:"#A94442" }}>{errors.UNNumber.UNNumber.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Proper Shipping Name</label>

                                    <input defaultValue='' {...register("UNNumber[ProperShippingName]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                
                                    <label className={`control-label ${errors.UNNumber ? errors.UNNumber.Class? "has-error-label" : "" :""}`}>Class</label>
                                    <input defaultValue='' {...register("UNNumber[Class]",{ required: "Class cannot be blank." })} className={`form-control ${errors.UNNumber ? errors.UNNumber.Class? "has-error" : "" :""}`} />
                                    <p>{errors.UNNumber ? errors.UNNumber.Class && <span style={{ color:"#A94442" }}>{errors.UNNumber.Class.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Subsidiary Hazards</label>

                                    <input defaultValue='' {...register("UNNumber[SubsidiaryHazards]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.UNNumber ? errors.UNNumber.PackingGroup? "has-error-label" : "" :""}`}>Packing Group</label>
                                
                                    <input defaultValue='' {...register("UNNumber[PackingGroup]", {required:"Packing Group cannot be blank."})}  className={`form-control ${errors.UNNumber ? errors.UNNumber.PackingGroup? "has-error" : "" :""}`} />
                                    <p>{errors.UNNumber ? errors.UNNumber.PackingGroup && <span style={{ color:"#A94442" }}>{errors.UNNumber.PackingGroup.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Special Provisions</label>

                                    <input defaultValue='' {...register("UNNumber[SpecialProvisions]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Limited Quantities</label>

                                    <input defaultValue='' {...register("UNNumber[LimitedQuantities]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Excepted Quantities</label>

                                    <input defaultValue='' {...register("UNNumber[ExceptedQuantities]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Packing Instructions</label>

                                    <input defaultValue='' {...register("UNNumber[PackingInstructions]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Packing Provisions</label>

                                    <input defaultValue='' {...register("UNNumber[PackingProvisions]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Ibc Instructions</label>

                                    <input defaultValue='' {...register("UNNumber[IBCInstructions]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Ibc Provisions</label>

                                    <input defaultValue='' {...register("UNNumber[IBCProvisions]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Tank instructions</label>

                                    <input defaultValue='' {...register("UNNumber[TankInstructions]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Tank Provisions</label>

                                    <input defaultValue='' {...register("UNNumber[TankProvisions]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Ems</label>

                                    <input defaultValue='' {...register("UNNumber[Ems]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Stowage</label>

                                    <input defaultValue='' {...register("UNNumber[Stowage]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Stowage Handling</label>

                                    <input defaultValue='' {...register("UNNumber[StowageHandling]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Segregation</label>

                                    <input defaultValue='' {...register("UNNumber[Segregation]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Properties And Observations</label>

                                    <input defaultValue='' {...register("UNNumber[PropertiesAndObservations]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">LPK Group</label>

                                    <input defaultValue='' {...register("UNNumber[LPKGroup]")} className={`form-control`} />
                                </div>
                            </div>

                        
                            <div className="col-xs-12 col-md-3">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="importCheckbox" id="importCheckbox" />
                                    <input type="text" className="form-control d-none" defaultValue='' {...register('UNNumber[Import]')} />
                                    <label className="control-label ml-2" htmlFor='importCheckbox'>Import</label>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="exportCheckbox" id="exportCheckbox"  />
                                    <input type="text" className="form-control d-none" defaultValue='' {...register('UNNumber[Export]')} />
                                    <label className="control-label ml-2" htmlFor='exportCheckbox'>Export</label>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="transhipmentCheckbox" id="transhipmentCheckbox"  />
                                    <input type="text" className="form-control d-none" defaultValue='' {...register('UNNumber[TS]')} />
                                    <label className="control-label ml-2" htmlFor='transhipmentCheckbox'>Transhipment</label>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Transhipment Remark</label>

                                    <input defaultValue='' {...register("UNNumber[TSRemark]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea defaultValue='' {...register("UNNumber[Description]")} className={`form-control`} />
                                </div>
                            </div>

                            
                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('UNNumber[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='UNNumber' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="UNNumber" model="u-n-number" selectedId="UNNumberUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='UNNumber' data={props} />}
        </form>



    )
}






export default Form