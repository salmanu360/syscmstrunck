import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify,sortArray, ControlOverlay, GetAllDropDown, GetCompaniesData, GetBranchData, getCompanyBranches, getAreas, getCompanyDataByCompanyType } from '../../Components/Helper.js'
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


    const [company, setCompany] = useState([])
    const [companyBranch, setCompanyBranch] = useState([])
    const [containerType, setContainerType] = useState([])
    const [boxOperator, setBoxOperator] = useState([])
    const [boxOperatorBranch, setBoxOperatorBranch] = useState([])
    const [ownerCompany, setOwnerCompany] = useState([])
    const [depotCompany, setDepotCompany] = useState([])
    const [depotBranch, setDepotBranch] = useState([])

    const [port, setPort] = useState([])

    const [agentCompany, setAgentCompany] = useState([])
    const [agentCompanyBranch, setAgentCompanyBranch] = useState([])



    const { register, handleSubmit, setValue, getValues, reset, trigger, control, watch, formState: { errors } } = useForm({ mode: "onChange" });

    var ArrayPort = [];

    var ArrayCompany = [];
    var ArrayCompanyBranch = [];
    var ArrayContainerType = [];
    var ArrayDepotCompany = []
    var ArrayDepotCompanyVerified = []
    var arrayBoxOperator = []

    var ArrayAgentCompany = []
    var ArrayAgentCompanyBranch = []


    const onSubmit = (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)

        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Terminal Code.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Terminal created successfully.")
                        navigate("/company/terminal/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Terminal updated successfully.")
                    navigate("/company/terminal/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


    }

    function handleChangeBranchName(val) {
        if (val) {

            GetBranchData(val, globalContext).then(res => {

                setValue("DynamicModel[BranchCode]", res.data.BranchCode)
            })
        }
    }
    function handleChangeAgentBranchName(val) {
        if (val) {
            GetBranchData(val, globalContext).then(res => {
                setValue("DynamicModel[AgentBranchCode]", res.data.BranchCode)
            })
        }
    }


    function handleChangeAgentCompany(val) {
        if (val) {

            GetCompaniesData(val, globalContext).then(res => {
                $.each(res.data[0].companyBranches, function (key, value) {
                    if (value.PortCode.AreaUUID == getValues("DynamicModel[PortCode]")) {
                        ArrayAgentCompanyBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.PortCode.PortCode + ")" })

                    }
                })

                setAgentCompanyBranch(sortArray(ArrayAgentCompanyBranch))
                setValue("DynamicModel[AgentROC]", res.data[0].ROC)
                if (ArrayAgentCompanyBranch.length > 0) {
                    setValue("PortDetails[HandlingCompanyBranch]", ArrayAgentCompanyBranch[0].value)
                    handleChangeAgentBranchName(ArrayAgentCompanyBranch[0].value)
                    trigger()
                }
            })


        }
    }


    function handleChangeCompany(val) {

        if (val) {
            GetCompaniesData(val, globalContext).then(res => {
                setValue("DynamicModel[CompanyROC]", res.data[0].ROC)
                $.each(res.data[0].companyBranches, function (key, value) {
                    if (value.PortCode.AreaUUID == getValues("DynamicModel[PortCode]")) {
                        ArrayCompanyBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.PortCode.PortCode + ")" })

                    }
                })
                var NewArrayBranch = [
                    ...new Map(ArrayCompanyBranch.map((item) => [item["value"], item])).values(),
                ];
                setCompanyBranch(sortArray(NewArrayBranch))
                if (NewArrayBranch.length > 0) {
                    setValue("PortDetails[Branch]", NewArrayBranch[0].value)
                    handleChangeBranchName(NewArrayBranch[0].value)
                }


            })
        }

    }

    function handleChangePortCode(val) {
        if (val) {
            getAreas(val, globalContext).then(res => {
                setValue("DynamicModel[Area]", res[0].PortCode)

            })

            getCompanyDataByCompanyType("", globalContext).then(res => {

                $.each(res.data, function (key, value) {
                    var portcode = value.companyBranch.PortCode

                    if (val == portcode) {
                        if (value.company.VerificationStatus == "Approved") {


                            ArrayCompany.push({ value: value.company.CompanyUUID, label: value.company.CompanyName })
                        }

                    }
                })

                var NewArrayCompany = [
                    ...new Map(ArrayCompany.map((item) => [item["value"], item])).values(),
                ];

                setCompany(sortArray((NewArrayCompany)))



            })


            getCompanyDataByCompanyType("----terminal", globalContext).then(res => {

                $.each(res.data, function (key, value) {
                    var portcode = value.companyBranch.PortCode

                    if (val == portcode) {
                        if (value.company.VerificationStatus == "Approved") {


                            ArrayAgentCompany.push({ value: value.company.CompanyUUID, label: value.company.CompanyName })
                        }

                    }
                })

                var NewArrayAgentCompany = [
                    ...new Map(ArrayAgentCompany.map((item) => [item["value"], item])).values(),
                ];

                setAgentCompany(sortArray(NewArrayAgentCompany))



            })



        }

    }





    // function handleChange(data){
    //     GetCompaniesData(data,globalContext).then(res => {
    //         if (res.data) {
    //             var arrayCompanyBranch=[]
    //             setValue("DynamicModel[ROC]",res.data[0].ROC)

    //             $.each(res.data[0].companyBranches, function (key, value) {
    //                 arrayCompanyBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName })
    //             })

    //             setCompanyBranch(arrayCompanyBranch)
    //             setValue("ReceivableMethod[Branch]",res.data[0].companyBranches[0].CompanyBranchUUID)
    //             setValue("DynamicModel[BranchCode]",res.data[0].companyBranches[0].BranchCode)

    //         }

    //     })
    // }

    // function handleChangeBranch(value){
    //     GetBranchData(value,globalContext).then(res => {
    //         console.log(res.data)
    //         if (res.data) {
    //            setValue("DynamicModel[BranchCode]",res.data.BranchCode)
    //         }

    //     })
    // }



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

        setValue("Container[ContainerCode]", "")
        setValue("Container[ContainerType]", "")
        setValue("Container[OwnershipType]", "")
        setValue("Container[DepotCompany]", "")
        setValue("Container[Depot]", "")
        trigger();
        reset()
        //trigger();


        GetAllDropDown(['Company', "ContainerType", "Area"], globalContext).then(res => {
            $.each(res.Area, function (key, value) {
                ArrayPort.push({ value: value.AreaUUID, label: value.PortCode })
            })
            setPort(sortArray((ArrayPort)))
        })





        if (state) {
            if (state.formType == "Update" || state.formType == "Clone") {
                ControlOverlay(true)

                GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('PortDetails[' + key + ']', value);
                    })
                    if (res.data.data.VerificationStatus == "Pending") {
                        $(".VerificationStatusField").text("Draft")
                        $(".VerificationStatusField").removeClass("text-danger")
                    } else if (res.data.data.VerificationStatus == "Rejected") {
                        $(".VerificationStatusField").text("Rejected")
                        $(".VerificationStatusField").addClass("text-danger")
                    }
                    $(".VerificationStatusField").last().addClass("d-none")
                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }

                    if (res.data.data.Default == "1") {
                        $('.defaultCheckbox').prop("checked", true)
                    }
                    else {
                        $('.defaultCheckbox').prop("checked", false)

                    }

                    setValue("DynamicModel[PortCode]", res.data.data.handlingCompanyBranch.PortCode)
                    handleChangePortCode(res.data.data.handlingCompanyBranch.PortCode)

                    GetBranchData(res.data.data.Branch, globalContext).then(res => {

                        handleChangeCompany(res.data.Company)
                        setValue("DynamicModel[CompanyName]", res.data.Company)

                    })

                    handleChangeAgentCompany(res.data.data.HandlingCompany)

                    handleChangeBranchName(res.data.data.Branch)
                    handleChangeAgentBranchName(res.data.data.HandlingCompanyBranch)


                    ControlOverlay(false)
                    trigger();

                })


            }
        } else {
            ControlOverlay(true)
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {

                $.each(res.data.data, function (key, value) {
                    setValue('PortDetails[' + key + ']', value);
                })
                if (res.data.data.VerificationStatus == "Pending") {
                    $(".VerificationStatusField").text("Draft")
                    $(".VerificationStatusField").removeClass("text-danger")
                } else if (res.data.data.VerificationStatus == "Rejected") {
                    $(".VerificationStatusField").text("Rejected")
                    $(".VerificationStatusField").addClass("text-danger")
                }
                $(".VerificationStatusField").last().addClass("d-none")
                if (res.data.data.Valid == "1") {
                    $('.validCheckbox').prop("checked", true)
                }
                else {
                    $('.validCheckbox').prop("checked", false)

                }
                setValue("DynamicModel[PortCode]", res.data.data.handlingCompanyBranch.PortCode)
                handleChangePortCode(res.data.data.handlingCompanyBranch.PortCode)

                GetBranchData(res.data.data.Branch, globalContext).then(res => {

                    handleChangeCompany(res.data.Company)
                    setValue("DynamicModel[CompanyName]", res.data.Company)

                })

                handleChangeAgentCompany(res.data.data.HandlingCompany)

                handleChangeBranchName(res.data.data.Branch)
                handleChangeAgentBranchName(res.data.data.HandlingCompanyBranch)
                ControlOverlay(false)
                trigger();

            })
        }

        return () => {

        }
    }, [state])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("PortDetails[Valid]", "1")
        } else {
            setValue("PortDetails[Valid]", "0")
        }


    });

    $('.defaultCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("PortDetails[Default]", "1")
        } else {
            setValue("PortDetails[Default]", "0")
        }


    });

    $(document).on("keypress", ".inputDecimalThreePlaces", function () {
        if (this.value != "") {
            if (this.value.match("^[a-zA-Z]*$")) {
                return false
            }

        }
    })
    $(document).on("blur", ".inputDecimalThreePlaces", function () {
        if (this.value != "") {
            if (!this.value.match("^[a-zA-Z]*$")) {
                this.value = parseFloat(this.value).toFixed(3);
            }
            else {
                this.value = ""
            }

        }
    })

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };

    return (
        <form  encType="multipart/form-data">
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='PortDetails' data={props} /> : <UpdateButton  handleSubmitData={handleSubmitForm} title="PortDetails" model="port-details" selectedId="PortDetailsUUIDs" id={formState.id} data={props} /> : <CreateButton  handleSubmitData={handleSubmitForm} title='PortDetails' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Terminal Form</div>
                    <div className="card-body">

                        <div className="col-xs-12 col-md-3 mt-2">
                            <div className="form-group mt-4 mb-1">
                                <input type="checkbox" className="defaultCheckbox" id="defaultCheckbox" />
                                <input type="text" className="form-control d-none" defaultValue='0' {...register('PortDetails[Default]')} />
                                <label className="control-label ml-2" htmlFor='defaultCheckbox'>Default</label>
                            </div>
                        </div>

                        <div className="row">

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.PortDetails ? errors.PortDetails.LocationCode ? "has-error-label" : "" : ""}`}>Terminal Code</label>

                                    <input defaultValue='' {...register("PortDetails[LocationCode]", { required: "Terminal Code cannot be blank." })} className={`form-control ${errors.PortDetails ? errors.PortDetails.LocationCode ? "has-error" : "" : ""}`} />
                                    <p>{errors.PortDetails ? errors.PortDetails.LocationCode && <span style={{ color: "#A94442" }}>{errors.PortDetails.LocationCode.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Terminal Name</label>

                                    <input defaultValue='' {...register("PortDetails[PortName]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.DynamicModel ? errors.DynamicModel.PortCode ? "has-error-label" : "" : ""}`}>Port Code</label>
                                    <Controller
                                        name="DynamicModel[PortCode]"
                                        id="PortCode"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[PortCode]", { required: "Port Code cannot be blank." })}
                                                value={value ? port.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangePortCode(val.value) }}
                                                options={port}
                                                className={`form-control PortCode ${errors.DynamicModel ? errors.DynamicModel.PortCode ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                    <p>{errors.DynamicModel ? errors.DynamicModel.PortCode && <span style={{ color: "#A94442" }}>{errors.DynamicModel.PortCode.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Area</label>

                                    <input defaultValue='' {...register("DynamicModel[Area]")} className={`form-control`} readOnly />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Station Code</label>

                                    <input defaultValue='' {...register("PortDetails[StationCode]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Yard Capacity</label>

                                    <input defaultValue='' {...register("PortDetails[YardCapacity]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Berth Length</label>

                                    <input defaultValue='' {...register("PortDetails[BerthLength]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Quay Crane No.</label>

                                    <input defaultValue='' {...register("PortDetails[QuayCraneNum]")} className={`form-control`} />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">RTG No.</label>

                                    <input defaultValue='' {...register("PortDetails[RTGNum]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Stacker No.</label>

                                    <input defaultValue='' {...register("PortDetails[StackerNum]")} className={`form-control`} />
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
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[CompanyName]")}
                                                value={value ? company.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeCompany(val.value) }}
                                                options={company}
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
                                    <label className="control-label">ROC</label>

                                    <input defaultValue='' {...register("DynamicModel[CompanyROC]")} className={`form-control`} readOnly />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Branch Name
                                    </label>
                                    <Controller
                                        name="PortDetails[Branch]"
                                        id="Branch"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("PortDetails[Branch]")}
                                                value={value ? companyBranch.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeBranchName(val.value) }}
                                                options={companyBranch}

                                                className="form-control Branch"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Branch Code</label>

                                    <input defaultValue='' {...register("DynamicModel[BranchCode]")} className={`form-control`} readOnly />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.PortDetails ? errors.PortDetails.HandlingCompany ? "has-error-label" : "" : ""}`}>Terminal Handler Company</label>
                                    <Controller
                                        name="PortDetails[HandlingCompany]"
                                        id="HandlingCompany"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("PortDetails[HandlingCompany]", { required: "Terminal Handler Company cannot be blank." })}
                                                value={value ? agentCompany.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeAgentCompany(val.value) }}
                                                options={agentCompany}
                                                menuPortalTarget={document.body}
                                                className={`form-control HandlingCompany ${errors.PortDetails ? errors.PortDetails.HandlingCompany ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                    <p>{errors.PortDetails ? errors.PortDetails.HandlingCompany && <span style={{ color: "#A94442" }}>{errors.PortDetails.HandlingCompany.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Terminal Handler ROC</label>

                                    <input defaultValue='' {...register("DynamicModel[AgentROC]")} className={`form-control`} readOnly />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className={`control-label ${errors.PortDetails ? errors.PortDetails.HandlingCompanyBranch ? "has-error-label" : "" : ""}`}>Terminal Handler Branch</label>
                                    <Controller
                                        name="PortDetails[HandlingCompanyBranch]"
                                        id="HandlingCompanyBranch"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("PortDetails[HandlingCompanyBranch]", { required: "Terminal Handler Branch cannot be blank." })}
                                                value={value ? agentCompanyBranch.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeAgentBranchName(val.value) }}
                                                options={agentCompanyBranch}
                                                className={`form-control HandlingCompanyBranch ${errors.PortDetails ? errors.PortDetails.HandlingCompanyBranch ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                    <p>{errors.PortDetails ? errors.PortDetails.HandlingCompanyBranch && <span style={{ color: "#A94442" }}>{errors.PortDetails.HandlingCompanyBranch.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label">Terminal Handler Branch Code</label>

                                    <input defaultValue='' {...register("DynamicModel[AgentBranchCode]")} className={`form-control`} readOnly />
                                </div>
                            </div>








                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('PortDetails[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>


                    </div>




                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='PortDetails' data={props} /> : <UpdateButton  handleSubmitData={handleSubmitForm} title="PortDetails" model="port-details" selectedId="PortDetailsUUIDs" id={formState.id} data={props} /> : <CreateButton  handleSubmitData={handleSubmitForm} title='PortDetails' data={props} />}


        </form>



    )
}






export default Form