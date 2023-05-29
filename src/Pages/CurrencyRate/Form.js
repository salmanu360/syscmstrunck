import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, sortArray } from '../../Components/Helper.js'
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
    const [startDate,setStartDate]=useState();
    const [currencyOption, setCurrencyOption] = useState([]);

    


    const { register, handleSubmit, setValue, getValues, reset,  trigger, control, watch, formState: { errors } } = useForm({mode: "onChange"});

    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)

        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Currency Name has already been taken.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Currency rate created successfully.")
                        navigate("/setting/general-settings/currency/currency-rate/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Currency rate updated successfully.")
                    navigate("/setting/general-settings/currency/currency-rate/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

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
        setValue("CurrencyRate[FromCurrency]","")
        setValue("CurrencyRate[ToCurrency]","")
        trigger();
        reset()

        GetAllDropDown(['CurrencyType'], globalContext).then(res => {
            var ArrayCurrencyType = [];

            $.each(res.CurrencyType, function (key, value) {
                ArrayCurrencyType.push({ value: value.CurrencyTypeUUID, label: value.CurrencyName })
            })
            setCurrencyOption(sortArray(ArrayCurrencyType))
        })
        if (state) {
            if (state.formType == "Update" || state.formType == "Clone") {
                ControlOverlay(true)

                GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('CurrencyRate[' + key + ']', value);
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
                    setValue('CurrencyRate[' + key + ']', value);
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
    }, [state])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("CurrencyRate[Valid]", "1")
        } else {
            setValue("CurrencyRate[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
        <form >
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm}  title='CurrencyRate' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm}  title="CurrencyRate" model="currency-rate" selectedId="CurrencyRateUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm}  title='CurrencyRate' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Currency Rate Form</div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className={`control-label ${errors.CurrencyRate ? errors.CurrencyRate.FromCurrency? "has-error-label" : "" :""}`}>From Currency</label>
                                    <Controller
                                        name="CurrencyRate[FromCurrency]"
                                        id="FromCuurency"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                {...register("CurrencyRate[FromCurrency]", { required: "From Currency cannot be blank." })}
                                                value={value ? currencyOption.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                isClearable={true}
                                                options={currencyOption}
                                                className={`basic-single ${errors.CurrencyRate ? errors.CurrencyRate.FromCurrency? "has-error-select" : "" :""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}
                                            />
                                        )}
                                    />
                                     <p>{errors.CurrencyRate ? errors.CurrencyRate.FromCurrency && <span style={{ color: "#A94442" }}>{errors.CurrencyRate.FromCurrency.message }</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className={`control-label ${errors.CurrencyRate ? errors.CurrencyRate.ToCurrency? "has-error-label" : "" :""}`}>To Currency</label>
                                    <Controller
                                        name="CurrencyRate[ToCurrency]"
                                        id="ToCurrency"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                            {...register("CurrencyRate[ToCurrency]", { required: "To Currency cannot be blank." })}
                                                value={value ? currencyOption.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                isClearable={true}
                                                options={currencyOption}
                                                className={`basic-single ${errors.CurrencyRate ? errors.CurrencyRate.ToCurrency? "has-error-select" : "" :""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}
                                            />
                                        )}
                                    />
                                     <p>{errors.CurrencyRate ? errors.CurrencyRate.ToCurrency && <span style={{ color: "#A94442" }}>{errors.CurrencyRate.ToCurrency.message }</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Rate</label>

                                    <input defaultValue='' {...register("CurrencyRate[Rate]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Start Date
                                    </label>

                                    <Controller
                                        name="CurrencyRate[StartDate]"
                                        control={control}
                                      
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                     value={value}
                                                    {...register('CurrencyRate[StartDate]')} 
                                                   
                                                    onChange={val => {
                                                    
                                                        onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                    }}
                                                    className="form-control startDate"
                                                    options={{
                                                        dateFormat: "d/m/Y"
                                                    }}

                                                />
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            
                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">End Date
                                    </label>

                                    <Controller
                                        name="CurrencyRate[EndDate]"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                    value={value}
                                                    name="CurrencyRate[EndDate]"
                                                    id="DOB"
                                                    onChange={val => {
                                                        onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                    }}
                                                    className="form-control endDate"
                                                    options={{
                                                        dateFormat: "d/m/Y"
                                                    }}

                                                />
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('CurrencyRate[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>

                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm}  title='CurrencyRate' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm}  title="CurrencyRate" model="currency-rate" selectedId="CurrencyRateUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm}  title='CurrencyRate' data={props} />}
        </form>



    )
}






export default Form