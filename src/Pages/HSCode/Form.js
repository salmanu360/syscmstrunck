import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown,initHoverSelectDropownTitle } from '../../Components/Helper.js'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
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
    const [parentHeading, setParentHeading] = useState([])

    const { register, handleSubmit, setValue, getValues, reset, control,trigger, watch, formState: { errors } } = useForm({mode: "onChange"});


    const [inputValue, setValu1e] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);

    // handle input change event
    const handleInputChange = value => {
        setValue(value);
    };

    // handle selection
    const handleChange = value => {
        setSelectedValue(value);
    }

    // load options using API call
    const loadOptions = (inputValue) => {

        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "h-s-code/get-h-s-code-by-heading?q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response



    }

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)

        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Heading.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "HS Code created successfully.")
                        navigate("/setting/sales-settings/h-s-code/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "HS Code updated successfully.")
                    navigate("/setting/sales-settings/h-s-code/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

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
            trigger();
            setFormState({ formType: "Update", id: params.id })
        }
        else {
            trigger();
            setFormState(state)
        }
        return () => {

        }
    }, [state])

  

    useEffect(() => {
        setValue("HSCode[ParentHeading]","")
        trigger();
        reset()

        initHoverSelectDropownTitle();
        // GetAllDropDown(['HSCode'], globalContext).then(res => {
        //     var parentHeadingArray = [];

        //     $.each(res.HSCode, function (key, value) {

        //         parentHeadingArray.push({ value: value.HSCodeUUID, label: value.Heading })
        //     })

        //     //setParentHeading(parentHeadingArray)
        // })

        if (formState) {
            if (formState.formType == "Update" || formState.formType == "Clone") {
                ControlOverlay(true)

                GetUpdateData(formState.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('HSCode[' + key + ']', value);
                    })


                    setValue("DynamicModel[FullDescription]", res.data.data.FullDescription)

                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }
                    if(res.data.data.ParentHeading){
                    setValue("HSCode[ParentHeading]",{HSCodeUUID:res.data.data.ParentHeading,Heading:res.data.data.parentHeading.Heading})
                      
                    }
                 


                    ControlOverlay(false)
                    trigger();

                })


            }
        } else {
            ControlOverlay(true)

            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {

                $.each(res.data.data, function (key, value) {
                    setValue('HSCode[' + key + ']', value);
                })

                setValue("DynamicModel[FullDescription]", res.data.data.FullDescription)
                if (res.data.data.Valid == "1") {
                    $('.validCheckbox').prop("checked", true)
                }
                else {
                    $('.validCheckbox').prop("checked", false)

                }

                if(res.data.data.ParentHeading){
                    setValue("HSCode[ParentHeading]",{HSCodeUUID:res.data.data.ParentHeading,Heading:res.data.data.parentHeading.Heading})
                      
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
            setValue("HSCode[Valid]", "1")
        } else {
            setValue("HSCode[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='HSCode' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="HSCode" model="h-s-code" selectedId="HSCodeUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='HSCode' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">HS Code Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Heading</label>

                                    <input defaultValue='' {...register("HSCode[Heading]")} className={`form-control`} />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                     <label className={`control-label ${errors.HSCode ? errors.HSCode.ParentHeading? "has-error-label" : "" :""}`} >Parent Heading
                                    </label>
                                    <Controller
                                        name="HSCode[ParentHeading]"
                                        id="ParentHeading"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                {...register("HSCode[ParentHeading]", { required: "Parent Heading cannot be blank." })}
                                                value={(value)}
                                                cacheOptions
                                                onChange={e =>{ e == null ? onChange(null) : onChange(e);}}
                                                getOptionLabel={e => e.Heading}
                                                getOptionValue={e => e.HSCodeUUID}
                                                loadOptions={loadOptions}
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                className={`form-control ParentHeading ${errors.HSCode ? errors.HSCode.ParentHeading? "has-error-select" : "" :""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                    <p>{errors.HSCode ? errors.HSCode.ParentHeading && <span style={{ color: "#A94442" }}>{errors.HSCode.ParentHeading.message }</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Sub Heading</label>

                                    <input defaultValue='' {...register("HSCode[SubHeading]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea defaultValue='' {...register("HSCode[Description]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">UOQ</label>

                                    <input defaultValue='' {...register("HSCode[UOQ]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Rod Import</label>

                                    <input defaultValue='' {...register("HSCode[RODImport]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Rod Export</label>

                                    <input defaultValue='' {...register("HSCode[RODExport]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="getChildCheckbox" id="getChildCheckbox" />
                                    <input type="text" className="form-control d-none" defaultValue='' {...register('HSCode[GetChild]')} />
                                    <label className="control-label ml-2" htmlFor='getChildCheckbox'>Get Child</label>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Full Description</label>

                                    <textarea defaultValue='' {...register("DynamicModel[FullDescription]")} className={`form-control`} readOnly />
                                </div>
                            </div>




                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('HSCode[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='HSCode' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="HSCode" model="h-s-code" selectedId="HSCodeUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='HSCode' data={props} />}

        </form>



    )
}






export default Form