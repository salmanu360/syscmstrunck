import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, sortArray,ControlOverlay, GetAllDropDown,toThreeDecimalPlaces, GetCompaniesData, GetBranchData, GetCompanyByShipOrBox, getCompanyBranches, getContainerType } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import AsyncSelect from 'react-select/async';
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
    const classificationOption = [{ "value": "A", "label": "A" }, { "value": "B", "label": "B" }, { "value": "C", "label": "C" }, { "value": "ABS", "label": "ABS" }, { "value": "KM", "label": "KM" }, { "value": "SCM", "label": "SCM" }, { "value": "BV", "label": "BV" }, { "value": "CCS", "label": "CCS" }, { "value": "NKK", "label": "NKK" }, { "value": "KR", "label": "KR" }, { "value": "BL", "label": "BL" }, { "value": "DNV", "label": "DNV" }, { "value": "NK", "label": "NK" }]
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [vesselType, setVesselType] = useState([])
    const [registryPortCode, setRegistryPortCode] = useState([])
    const [companyBranch, setCompanyBranch] = useState([])
    const [companyBranchROC, setCompanyBranchROC] = useState([])
    const [shipOperatorBranch, setShipOperatorBranch] = useState([])
    const [shipOperatorBranchROC, setshipOperatorBranchROC] = useState([])
    const [builderBranch, setBuilderBranch] = useState([])
    const [builderBranchROC, setBuilderBranchROC] = useState([])
    const [checkLoadState, setCheckLoadState] = useState(false)


    var ArrayVesselType = [];
    var ArrayRegistryPortCode = [];
    var ArrayCompanyVerified = [];
    var ArrayCompanyVerifiedROC = [];
    var ArrayBuilderCompany = [];
    var ArrayBuilderCompanyVerified = [];
    var ArrayBuilderCompanyVerifiedROC = [];
    var arrayShipOperator = []
    var arrayShipOperatorROC = []



    const { register, handleSubmit, setValue, getValues, reset, trigger, control, watch, formState: { errors } } = useForm({ mode: "onChange" });

    const onSubmit = (data, event) => {

        event.preventDefault();
        var tempForm = $("form")[0]
      
        ControlOverlay(true)


        $(tempForm).find(".inputDecimalThreePlaces").each(function () {
            var value1 = $(this).val();
            if (value1 !== "") {
                $(this).val(parseFloat(value1).toFixed(4));

            }
        })

        const formdata = new FormData(tempForm);
        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Duplicate Vessel Code.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Vessel created successfully.")
                        navigate("/asset/vessel/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Vessel updated successfully.")
                    navigate("/asset/vessel/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


    }

    const loadOptionsOwner = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=&q=" + inputValue, {
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)
        return response
    }


    const loadOptionsShipOp = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Ship Operator&q=" + inputValue, {
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response
    }

    const loadOptionsBuilder = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Builder&q=" + inputValue, {
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response
    }



    function handleChangeOwnerCompany(data) {
        setValue("DynamicModel[OwnerROC]", data)
        if (data) {
            GetCompaniesData(data, globalContext).then(res => {
                if (res.data) {
                    var arrayCompanyBranch = []
                    var arrayCompanyBranchROC = []


                    $.each(res.data[0].companyBranches, function (key, value) {
                        arrayCompanyBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.PortCode.PortCode + ")" })
                        arrayCompanyBranchROC.push({ value: value.CompanyBranchUUID, label: value.BranchCode })
                    })

                    setCompanyBranch(sortArray(arrayCompanyBranch))
                    setCompanyBranchROC(sortArray(arrayCompanyBranchROC))

                    setValue("DynamicModel[OwnerBranchName]", res.data[0].companyBranches[0].CompanyBranchUUID)
                    setValue("Vessel[Owner]", res.data[0].companyBranches[0].CompanyBranchUUID)
                    //setValue("DynamicModel[BranchCode]",res.data[0].companyBranches[0].BranchCode)

                }

            })
        }

    }


    function handleChangeBuilder(data) {
        setValue("DynamicModel[BuilderROC]", data)
        if (data) {
            getCompanyBranches(data, globalContext).then(res => {
                var arrayBuilderBranch = []
                var arrayBuilderBranchROC = []

                $.each(res, function (key, value) {
                    $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                        if (value2.CompanyType == "----builder") {
                            arrayBuilderBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })
                            arrayBuilderBranchROC.push({ value: value.CompanyBranchUUID, label: value.BranchCode })

                        }
                    })

                })

                setBuilderBranch(sortArray(arrayBuilderBranch))

                setValue("DynamicModel[BuilderBranchName]", arrayBuilderBranch[0].value)
                setBuilderBranchROC(sortArray(arrayBuilderBranchROC))
                setValue("Vessel[Builder]", arrayBuilderBranchROC[0].value)

            })
        }

    }

    function handleChangeShipOp(data) {
        setValue("DynamicModel[ShipOpROC]", data)
        if (data) {
            getCompanyBranches(data, globalContext).then(res => {
                var arrayShipOperatorBranch = []
                var arrayShipOperatorBranchROC = []

                $.each(res, function (key, value) {
                    $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                        if (value2.CompanyType == "----shipoperator") {
                            arrayShipOperatorBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })
                            arrayShipOperatorBranchROC.push({ value: value.CompanyBranchUUID, label: value.BranchCode })

                        }
                    })

                })

                setShipOperatorBranch(sortArray(arrayShipOperatorBranch))

                setValue("DynamicModel[ShipOpBranchName]", arrayShipOperatorBranch[0].value)
                setshipOperatorBranchROC(sortArray(arrayShipOperatorBranchROC))
                setValue("Vessel[ShipOperator]", arrayShipOperatorBranchROC[0].value)
            })
        }

    }

    function handleChangeOwnerBranchName(data) {
        setValue("Vessel[Owner]", data)
    }

    function handleChangeShipOperatorBranchName(data) {
        setValue("Vessel[ShipOperator]", data)
    }

    function handleChangeBuilderBranchName(data) {
        setValue("Vessel[Builder]", data)
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

        setValue("Vessel[VesselCode]", "")
        trigger();
        reset()

        toThreeDecimalPlaces();

        GetAllDropDown(['Company', 'CompanyBranch', "ContainerType", "VesselType", "Area"], globalContext).then(res => {

            $.each(res.VesselType, function (key, value) {
                ArrayVesselType.push({ value: value.VesselTypeUUID, label: value.VesselType })
            })
            $.each(res.Area, function (key, value) {
                ArrayRegistryPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })


            //get company with builder type
            $.each(res.CompanyBranch, function (key, value) {
                if (value.CompanyTypes != null) {
                    if (value.CompanyTypes.includes("----builder")) {
                        ArrayBuilderCompany.push(value)

                    }
                }
            });
            //remove duplicate company 
            var uniqueCompanyArray = [
                ...new Map(ArrayBuilderCompany.map((item) => [item["Company"], item])).values(),
            ];


            $.each(res.Company, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayCompanyVerified.push({ value: value.CompanyUUID, label: value.CompanyName })
                    ArrayCompanyVerifiedROC.push({ value: value.CompanyUUID, label: value.ROC })
                }

            })

            //filter verified company with builder type 
            $.each(uniqueCompanyArray, function (key, value) {
                $.each(ArrayCompanyVerified, function (key2, value2) {
                    if (value.Company == value2.value) {
                        ArrayBuilderCompanyVerified.push({ value: value2.value, label: value2.label })

                    }
                });
                $.each(ArrayCompanyVerifiedROC, function (key2, value2) {
                    if (value.Company == value2.value) {
                        ArrayBuilderCompanyVerifiedROC.push({ value: value2.value, label: value2.label })

                    }
                });



            });

            setVesselType(sortArray(ArrayVesselType))
            setRegistryPortCode(sortArray(ArrayRegistryPortCode))

        })





        GetCompanyByShipOrBox("----shipoperator", globalContext).then(res => {

            //get all approved status
            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved" && value.Valid == 1) {
                    arrayShipOperator.push({ value: value.CompanyUUID, label: value.CompanyName })
                    arrayShipOperatorROC.push({ value: value.CompanyUUID, label: value.ROC })


                }

            })


        })




        if (state) {
            if (state.formType == "Update" || state.formType == "Clone") {
                ControlOverlay(true)

                GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('Vessel[' + key + ']', value);
                    })

                    if (res.data.data.VerificationStatus == "Pending") {
                        $(".VerificationStatusField").text("Draft")
                        $(".VerificationStatusField").removeClass("text-danger")
                    } else if (res.data.data.VerificationStatus == "Rejected") {
                        $(".VerificationStatusField").text("Rejected")
                        $(".VerificationStatusField").addClass("text-danger")
                    }
                    $(".VerificationStatusField").last().addClass("d-none")
                    if(res.data.data.Builder){
                        GetBranchData(res.data.data.Builder, globalContext).then(res => {
                            handleChangeBuilder(res.data.Company, { Name: res.data.company.CompanyName, ROC: res.data.company.ROC })
                            setValue("DynamicModel[BuilderName]", res.data.company)
                            setValue("DynamicModel[BuilderROC]", res.data.company)
        
                        })
                    }
                
                    if(res.data.data.Owner){
                        GetBranchData(res.data.data.Owner, globalContext).then(res => {
                            handleChangeOwnerCompany(res.data.Company, { Name: res.data.company.CompanyName, ROC: res.data.company.ROC })
                            setValue("DynamicModel[OwnerName]", res.data.company)
                            setValue("DynamicModel[OwnerROC]", res.data.company)
        
                        })
                    }   
             
                    if(res.data.data.ShipOperator){
                        GetBranchData(res.data.data.ShipOperator, globalContext).then(res => {
                            handleChangeShipOp(res.data.Company, { Name: res.data.company.CompanyName, ROC: res.data.company.ROC })
                            setValue("DynamicModel[ShipOpName]", res.data.company)
                            setValue("DynamicModel[ShipOpROC]", res.data.company)
        
                        })
                    }

                    if (res.data.data.Valid == "1") {
                        $('.validCheckbox').prop("checked", true)
                    }
                    else {
                        $('.validCheckbox').prop("checked", false)

                    }
                    setValue("Vessel[Builder]", res.data.data.Builder)
                    setValue("Vessel[Owner]", res.data.data.Owner)
                    setValue("Vessel[ShipOperator]", res.data.data.ShipOperator)
                    ControlOverlay(false)
                    trigger();

                    setCheckLoadState(true)

                })


            }
        } else {
            ControlOverlay(true)

            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {

                $.each(res.data.data, function (key, value) {
                    setValue('Vessel[' + key + ']', value);
                })

                if (res.data.data.VerificationStatus == "Pending") {
                    $(".VerificationStatusField").text("Draft")
                    $(".VerificationStatusField").removeClass("text-danger")
                } else if (res.data.data.VerificationStatus == "Rejected") {
                    $(".VerificationStatusField").text("Rejected")
                    $(".VerificationStatusField").addClass("text-danger")
                }
                $(".VerificationStatusField").last().addClass("d-none")
                if(res.data.data.Builder){
                    GetBranchData(res.data.data.Builder, globalContext).then(res => {
                        handleChangeBuilder(res.data.Company, { Name: res.data.company.CompanyName, ROC: res.data.company.ROC })
                        setValue("DynamicModel[BuilderName]", res.data.company)
                        setValue("DynamicModel[BuilderROC]", res.data.company)
    
                    })
                }
            
                if(res.data.data.Owner){
                    GetBranchData(res.data.data.Owner, globalContext).then(res => {
                        handleChangeOwnerCompany(res.data.Company, { Name: res.data.company.CompanyName, ROC: res.data.company.ROC })
                        setValue("DynamicModel[OwnerName]", res.data.company)
                        setValue("DynamicModel[OwnerROC]", res.data.company)
    
                    })
                }   
         
                if(res.data.data.ShipOperator){
                    GetBranchData(res.data.data.ShipOperator, globalContext).then(res => {
                        handleChangeShipOp(res.data.Company, { Name: res.data.company.CompanyName, ROC: res.data.company.ROC })
                        setValue("DynamicModel[ShipOpName]", res.data.company)
                        setValue("DynamicModel[ShipOpROC]", res.data.company)
    
                    })
                }
              

                if (res.data.data.Valid == "1") {
                    $('.validCheckbox').prop("checked", true)
                }
                else {
                    $('.validCheckbox').prop("checked", false)

                }
                setValue("Vessel[Builder]", res.data.data.Builder)
                setValue("Vessel[Owner]", res.data.data.Owner)
                setValue("Vessel[ShipOperator]", res.data.data.ShipOperator)
                ControlOverlay(false)
                trigger();

                setCheckLoadState(true)

            })
        }

        return () => {

        }
    }, [state])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("Vessel[Valid]", "1")
        } else {
            setValue("Vessel[Valid]", "0")
        }


    });


    useEffect(() => {
      if(checkLoadState){
        $(".inputDecimalThreePlaces").each(function(key,value){
           if($(value).val()!==""){
            $(value).val(parseFloat($(value).val()).toFixed(3))
         
           }
        })
      }
    
      return () => {
        setCheckLoadState(false)

      }
    }, [checkLoadState])
    

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };
  


    return (
        <form >
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Vessel' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Vessel" model="vessel" selectedId="VesselUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Vessel' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Vessel Form</div>
                    <div className="card-body">

                        <div className="row">

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Vessel ? errors.Vessel.VesselCode ? "has-error-label" : "" : ""}`}>Vessel Code</label>

                                    <input defaultValue='' {...register("Vessel[VesselCode]", { required: "Vessel Code cannot be blank." })} className={`form-control ${errors.Vessel ? errors.Vessel.VesselCode ? "has-error" : "" : ""}`} />
                                    <p>{errors.Vessel ? errors.Vessel.VesselCode && <span style={{ color: "#A94442" }}>{errors.Vessel.VesselCode.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Vessel ? errors.Vessel.VesselName ? "has-error-label" : "" : ""}`}>Vessel Name</label>

                                    <input defaultValue='' {...register("Vessel[VesselName]", { required: "Vessel Name cannot be blank." })} className={`form-control ${errors.Vessel ? errors.Vessel.VesselName ? "has-error" : "" : ""}`} />
                                    <p>{errors.Vessel ? errors.Vessel.VesselName && <span style={{ color: "#A94442" }}>{errors.Vessel.VesselName.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                 <label className={`control-label ${errors.Vessel ? errors.Vessel.VesselType ? "has-error-label" : "" : ""}`}>Vessel Type</label>
                                    <Controller
                                        name="Vessel[VesselType]"
                                        id="Grade"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Vessel[VesselType]", { required: "Vessel Type cannot be blank." })}
                                                value={value ? vesselType.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={vesselType}
                                                className={`form-control VesselType ${errors.Vessel ? errors.Vessel.VesselType ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                      <p>{errors.Vessel ? errors.Vessel.VesselType && <span style={{ color: "#A94442" }}>{errors.Vessel.VesselType.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Account Code</label>

                                    <input defaultValue='' {...register("Vessel[AccountCode]")} className={`form-control`} />
                                </div>
                            </div>




                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Official Number</label>

                                    <input defaultValue='' {...register("Vessel[OfficialNumber]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Imo Number</label>

                                    <input defaultValue='' {...register("Vessel[IMONumber]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label" >Registry Port Code
                                    </label>
                                    <Controller
                                        name="Vessel[RegistryPortCode]"
                                        id="RegistryPortCode"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Vessel[RegistryPortCode]")}
                                                value={value ? registryPortCode.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={registryPortCode}
                                                className="form-control RegistryPortCode"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Flag</label>

                                    <input defaultValue='' {...register("Vessel[Flag]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Year Build</label>

                                    <input type="number" defaultValue='' {...register("Vessel[YearBuild]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label" >Classification
                                    </label>
                                    <Controller
                                        name="Vessel[Classification]"
                                        id="Classification"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Vessel[Classification]")}
                                                value={value ? classificationOption.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={classificationOption}
                                                className="form-control Classification"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Call Sign</label>

                                    <input defaultValue='' {...register("Vessel[CallSign]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">GRT(ton)</label>

                                    <input defaultValue='' {...register("Vessel[GRT]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">NRT(ton)</label>

                                    <input defaultValue='' {...register("Vessel[NRT]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Dead Weight(ton)</label>

                                    <input defaultValue='' {...register("Vessel[DeadWeight]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Vessel ? errors.Vessel.LoadingWeight ? "has-error-label" : "" : ""}`}>Loading Weight(kg)</label>

                                    <input defaultValue='' {...register("Vessel[LoadingWeight]", { required: "Loading Weight cannot be blank." })} className={`form-control inputDecimalThreePlaces ${errors.Vessel ? errors.Vessel.LoadingWeight ? "has-error" : "" : ""}`} />
                                    <p>{errors.Vessel ? errors.Vessel.LoadingWeight && <span style={{ color: "#A94442" }}>{errors.Vessel.LoadingWeight.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">LOA(m)</label>
                                    <input defaultValue='' {...register("Vessel[LOA]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Breadth(m)</label>

                                    <input defaultValue='' {...register("Vessel[Breadth]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Depth(m)</label>

                                    <input defaultValue='' {...register("Vessel[Depth]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Draft(m)</label>

                                    <input defaultValue='' {...register("Vessel[Draft]")} className={`form-control inputDecimalThreePlaces`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">

                                    <label className={`control-label ${errors.Vessel ? errors.Vessel.CargoCapacity ? "has-error-label" : "" : ""}`}>Cargo Capacity(tues)</label>

                                    <input defaultValue='' {...register("Vessel[CargoCapacity]", { required: "Cargo Capacity cannot be blank." })} className={`form-control ${errors.Vessel ? errors.Vessel.CargoCapacity ? "has-error" : "" : ""}`} />
                                    <p>{errors.Vessel ? errors.Vessel.CargoCapacity && <span style={{ color: "#A94442" }}>{errors.Vessel.CargoCapacity.message}</span> : ""}</p>

                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Reefer Plug(unit)</label>

                                    <input defaultValue='' {...register("Vessel[ReeferPlug]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className="control-label">Main Engine</label>

                                    <input defaultValue='' {...register("Vessel[MainEngine]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Vessel ? errors.Vessel.Prefix ? "has-error-label" : "" : ""}`}>Voyage Number Prefix</label>
                                    <input defaultValue='' {...register("Vessel[Prefix]", { required: "Voyage Number Prefix cannot be blank." })} className={`form-control ${errors.Vessel ? errors.Vessel.Prefix ? "has-error" : "" : ""}`} />
                                    <p>{errors.Vessel ? errors.Vessel.Prefix && <span style={{ color: "#A94442" }}>{errors.Vessel.Prefix.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Vessel ? errors.Vessel.NextNumber ? "has-error-label" : "" : ""}`}>Next Voyage Number</label>
                                    <input defaultValue='' {...register("Vessel[NextNumber]", { required: "Next Voyage Number cannot be blank." })} className={`form-control ${errors.Vessel ? errors.Vessel.NextNumber ? "has-error" : "" : ""}`} />
                                    <p>{errors.Vessel ? errors.Vessel.NextNumber && <span style={{ color: "#A94442" }}>{errors.Vessel.NextNumber.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label" >Owner Name
                                    </label>
                                    <Controller
                                        name="DynamicModel[OwnerName]"
                                        id="OwnerName"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                value={(value)}
                                                {...register("DynamicModel[OwnerName]")}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); handleChangeOwnerCompany(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsOwner}
                                                menuPortalTarget={document.body}
                                                className="form-control OwnerName"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />

                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Owner ROC
                                    </label>
                                    <Controller
                                        name="DynamicModel[OwnerROC]"
                                        id="OwnerROC"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                value={(value)}
                                                {...register("DynamicModel[OwnerROC]")}
                                                cacheOptions
                                                placeholder={"Select..."}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
                                                getOptionLabel={e => e.ROC}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsOwner}
                                                menuPortalTarget={document.body}
                                                className="form-control OwnerROC readOnlySelect"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />


                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label" >Owner Branch Name
                                    </label>
                                    <Controller
                                        name="DynamicModel[OwnerBranchName]"
                                        id="OwnerBranchName"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[OwnerBranchName]")}
                                                value={value ? companyBranch.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeOwnerBranchName(val ? val.value : "") }}
                                                options={companyBranch}
                                                menuPortalTarget={document.body}
                                                className="form-control OwnerBranchName"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Owner Branch
                                    </label>
                                    <Controller
                                        name="Vessel[Owner]"
                                        id="Owner"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Vessel[Owner]")}
                                                value={value ? companyBranchROC.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={companyBranchROC}
                                                menuPortalTarget={document.body}
                                                className="form-control Owner readOnlySelect"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label" >Ship Op Name
                                    </label>
                                    <Controller
                                        name="DynamicModel[ShipOpName]"
                                        id="ShipOpName"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                value={(value)}
                                                {...register("DynamicModel[ShipOpName]")}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); handleChangeShipOp(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsShipOp}
                                                menuPortalTarget={document.body}
                                                className="form-control ShipOpName"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />


                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Ship Op ROC
                                    </label>
                                    <Controller
                                        name="DynamicModel[ShipOpROC]"
                                        id="ShipOpROC"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                value={(value)}
                                                {...register("DynamicModel[ShipOpROC]")}
                                                cacheOptions
                                                placeholder={"Select..."}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
                                                getOptionLabel={e => e.ROC}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsShipOp}
                                                menuPortalTarget={document.body}
                                                className="form-control ShipOpROC readOnlySelect"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />


                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label" >Ship Op Branch Name
                                    </label>
                                    <Controller
                                        name="DynamicModel[ShipOpBranchName]"
                                        id="ShipOpBranchName"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[ShipOpBranchName]")}
                                                value={value ? shipOperatorBranch.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeShipOperatorBranchName(val ? val.value : "") }}
                                                options={shipOperatorBranch}
                                                menuPortalTarget={document.body}
                                                className="form-control ShipOpBranchName"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Ship Op Branch
                                    </label>
                                    <Controller
                                        name="Vessel[ShipOperator]"
                                        id="ShipOperator"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Vessel[ShipOperator]")}
                                                value={value ? shipOperatorBranchROC.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={shipOperatorBranchROC}
                                                menuPortalTarget={document.body}
                                                className="form-control ShipOperator readOnlySelect"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label" >Builder Name
                                    </label>
                                    <Controller
                                        name="DynamicModel[BuilderName]"
                                        id="BuilderName"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                value={(value)}
                                                {...register("DynamicModel[BuilderName]")}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); handleChangeBuilder(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsBuilder}
                                                menuPortalTarget={document.body}
                                                className="form-control BuilderName"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />


                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Builder ROC
                                    </label>
                                    <Controller
                                        name="DynamicModel[BuilderROC]"
                                        id="BuilderROC"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <AsyncSelect
                                                isClearable={true}
                                                value={(value)}
                                                {...register("DynamicModel[BuilderROC]")}
                                                cacheOptions
                                                placeholder={"Select..."}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
                                                getOptionLabel={e => e.ROC}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsBuilder}
                                                menuPortalTarget={document.body}
                                                className="form-control BuilderROC readOnlySelect"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />


                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-4">
                                <div className="form-group">
                                    <label className="control-label" >Builder Branch Name
                                    </label>
                                    <Controller
                                        name="DynamicModel[BuilderBranchName]"
                                        id="BuilderBranchName"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[BuilderBranchName]")}
                                                value={value ? builderBranch.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeBuilderBranchName(val ? val.value : "") }}
                                                options={builderBranch}
                                                menuPortalTarget={document.body}
                                                className="form-control BuilderBranchName"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Builder Branch
                                    </label>
                                    <Controller
                                        name="Vessel[Builder]"
                                        id="Builder"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Vessel[Builder]")}
                                                value={value ? builderBranchROC.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={builderBranchROC}
                                                menuPortalTarget={document.body}
                                                className="form-control Builder readOnlySelect"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3 mt-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('Vessel[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>


                        </div>


                    </div>

                </div>


            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Vessel' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Vessel" model="vessel" selectedId="VesselUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Vessel' data={props} />}



        </form>



    )
}






export default Form