import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, GetCompaniesData, GetBranchData, initHoverSelectDropownTitle } from '../../Components/Helper.js'
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
    const [defaultCompany, setDefaultCompany] = useState(null)
    const navigate = useNavigate();


    const [company, setCompany] = useState([])
    const [companyBranch, setCompanyBranch] = useState([])

    const { register, handleSubmit, setValue, getValues, reset, control, trigger, watch, formState: { errors } } = useForm({ mode: "onChange" });


    const loadOptionsCompany = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {

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
                    if (res.data.message == "Duplicate Receivable Method.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Receivable Method created successfully.")
                        navigate("/setting/sales-settings/receivable-method/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Receivable Method updated successfully.")
                    navigate("/setting/sales-settings/receivable-method/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


    }

    function handleChange(data) {
        if (data) {
            GetCompaniesData(data.CompanyUUID, globalContext).then(res => {
                if (res.data) {
                    var arrayCompanyBranch = []
                    setValue("DynamicModel[ROC]", res.data[0].ROC)

                    $.each(res.data[0].companyBranches, function (key, value) {
                        arrayCompanyBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName })
                    })

                    setCompanyBranch(arrayCompanyBranch)
                    setValue("ReceivableMethod[Branch]", res.data[0].companyBranches[0].CompanyBranchUUID)
                    setValue("DynamicModel[BranchCode]", res.data[0].companyBranches[0].BranchCode)

                }

            })
        }

    }

    function handleChangeBranchUpdate(data) {
        if (data) {
            GetCompaniesData(data, globalContext).then(res => {
                if (res.data) {
                    var arrayCompanyBranch = []
                    // setValue("DynamicModel[ROC]", res.data[0].ROC)

                    $.each(res.data[0].companyBranches, function (key, value) {
                        arrayCompanyBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName })
                    })

                    setCompanyBranch(arrayCompanyBranch)
                    // setValue("ReceivableMethod[Branch]", res.data[0].companyBranches[0].CompanyBranchUUID)
                    // setValue("DynamicModel[BranchCode]", res.data[0].companyBranches[0].BranchCode)

                }

            })
        }

    }

    function handleChangeBranch(value) {
        GetBranchData(value, globalContext).then(res => {
            if (res.data) {
                setValue("DynamicModel[BranchCode]", res.data.BranchCode)
            }

        })
    }

    useEffect(() => {
        if (state == null) {
            trigger()
            setFormState({ formType: "Update", id: params.id })
        }
        else {
            trigger()
            setFormState(state)
        }
        return () => {

        }
    }, [state])

    useEffect(() => {
        setValue("ReceivableMethod[ReceivableMethod]","")
        trigger()
        reset()
        setDefaultCompany(null)
        initHoverSelectDropownTitle()



        if (formState) {
            if (state.formType == "Update" || state.formType == "Clone") {
                ControlOverlay(true)

                GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('ReceivableMethod[' + key + ']', value);
                    })
                    if(res.data.data.Branch){  
                        setDefaultCompany({ CompanyName: res.data.data.company.CompanyName, CompanyUUID: res.data.data.company.CompanyUUID })
                        setValue("DynamicModel[CompanyName]", res.data.data.company.CompanyUUID)
                        setValue("DynamicModel[ROC]", res.data.data.company.ROC)
                        setValue("DynamicModel[BranchCode]", res.data.data.branch.BranchCode)

                        handleChangeBranchUpdate(res.data.data.company.CompanyUUID)
                    }
                   
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
        } else {
            ControlOverlay(true)

            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {

                $.each(res.data.data, function (key, value) {
                    setValue('ReceivableMethod[' + key + ']', value);
                })
                if(res.data.data.Branch){  
                    setDefaultCompany({ CompanyName: res.data.data.company.CompanyName, CompanyUUID: res.data.data.company.CompanyUUID })
                    setValue("DynamicModel[CompanyName]", res.data.data.company.CompanyUUID)
                    setValue("DynamicModel[ROC]", res.data.data.company.ROC)
                    setValue("DynamicModel[BranchCode]", res.data.data.branch.BranchCode)

                    handleChangeBranchUpdate(res.data.data.company.CompanyUUID)
                }
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
    }, [state])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("ReceivableMethod[Valid]", "1")
        } else {
            setValue("ReceivableMethod[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
        <form >
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='ReceivableMethod' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="ReceivableMethod" model="receivable-method" selectedId="ReceivableMethodUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='ReceivableMethod' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Receivable Method Form</div>
                    <div className="card-body">

                        <div className="row">

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className={`control-label ${errors.ReceivableMethod ? errors.ReceivableMethod.ReceivableMethod ? "has-error-label" : "" : ""}`}>Receivable Method</label>

                                    <input defaultValue='' {...register("ReceivableMethod[ReceivableMethod]", { required: "Receivable Method cannot be blank." })} className={`form-control ${errors.ReceivableMethod ? errors.ReceivableMethod.ReceivableMethod ? "has-error" : "" : ""}`} />
                                    <p>{errors.ReceivableMethod ? errors.ReceivableMethod.ReceivableMethod && <span style={{ color: "#A94442" }}>{errors.ReceivableMethod.ReceivableMethod.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Account Code</label>

                                    <input defaultValue='' {...register("ReceivableMethod[AccountCode]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Description</label>

                                    <textarea defaultValue='' {...register("ReceivableMethod[Description]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label" >Company Name
                                    </label>

                                    <Controller
                                        name="DynamicModel[CompanyName]"
                                        id="CompanyName"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (

                                            <AsyncSelect
                                                isClearable={true}
                                                value={defaultCompany}
                                                {...register("DynamicModel[CompanyName]")}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultCompany(e); handleChange(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsCompany}
                                                menuPortalTarget={document.body}
                                                className="form-control CompanyName"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />

                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Company ROC</label>

                                    <input defaultValue='' {...register("DynamicModel[ROC]")} className={`form-control ROC`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label" >Branch Name
                                    </label>
                                    <Controller
                                        name="ReceivableMethod[Branch]"
                                        id="ContainerType"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("ReceivableMethod[Branch]")}
                                                value={value ? companyBranch.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); val == null ? handleChangeBranch(null) : handleChangeBranch(val.value) }}
                                                options={companyBranch}
                                                className="form-control branch"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Branch Code</label>

                                    <input defaultValue='' {...register("DynamicModel[BranchCode]")} className={`form-control branchCode`} />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('ReceivableMethod[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>


                    </div>




                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='ReceivableMethod' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="ReceivableMethod" model="receivable-method" selectedId="ReceivableMethodUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='ReceivableMethod' data={props} />}



        </form>



    )
}






export default Form