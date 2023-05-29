import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, sortArray, ControlOverlay, GetAllDropDown, initHoverSelectDropownTitle, createCookie, getCookie, GetCompanyByShipOrBox, getPortDetails, getCompanyBranches, getCheckCompany } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import Branch from "./Branch"
import CompanyType from "./CompanyType"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $ from "jquery";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import ContainerCharges from './ContainerCharges';
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

    
    const [creditTerm, setCreditTerm] = useState([])

    const [companyType, setCompanyType] = useState([])
    const [businessNature, setBusinessNature] = useState([])
    const [supplierType, setSupplierType] = useState([])
    const [customerType, setCustomerType] = useState([])
    const [portCode, setPortCode] = useState([])
    const [salesPerson, setSalesPerson] = useState([])
    const [passCompanyBranchData, setPassCompanyBranchData] = useState([])
    const [type, setType] = useState("")

    const DefaultUserPort=globalContext.userPort;
    const Title = [
        {
            "value": "Mdm",
            "label": "Mdm"
        },
        {
            "value": "Mr.",
            "label": "Mr."
        },
        {
            "value": "Ms.",
            "label": "Ms."
        },

    ]

    const Gender = [
        {
            "value": "Female",
            "label": "Female"
        },
        {
            "value": "Male",
            "label": "Male"
        },
        {
            "value": "Others",
            "label": "Others"
        },

    ]




    const [cookies, setCookies] = useState([])
    const { register, handleSubmit, setValue, getValues, trigger, reset, control, watch, formState: { errors } } = useForm({ mode: "onChange" });

    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "Company"
    });

    function getFiles(id) {
        if (id) {
            $.ajax({
                url: globalContext.globalHost + globalContext.globalPathLink + "company/load-files?id=" + id,
                type: "POST",
                dataType: "json",
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                success: function (data) {
                    var fileData
                    if (id == undefined) {
                        fileData = []
                    }
                    else {
                        fileData = data.data
                    }
                    window.$('#CompanyLogo').filer({
                        limit: 1,
                        extensions: ["jpg", "png", "jpeg"],
                        showThumbs: true,
                        theme: 'default',
                        templates: {
                            itemAppendToEnd: true,
                            box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
                            item: '<li class="jFiler-item">\
                        <div class="jFiler-item-container">\
                          <div class="jFiler-item-inner">\
                            <div class="jFiler-item-thumb">\
                              <div class="jFiler-item-status"></div>\
                              <div class="jFiler-item-thumb-overlay">\
                                <div class="jFiler-item-info">\
                                  <div style="display:table-cell;vertical-align: middle;">\
                                    <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                    <span class="jFiler-item-others">{{fi-size2}}</span>\
                                  </div>\
                                </div>\
                              </div>\
                              {{fi-image}}\
                            </div>\
                            <div class="jFiler-item-assets jFiler-row">\
                              <ul class="list-inline pull-left">\
                                <li>{{fi-progressBar}}</li>\
                              </ul>\
                              <ul class="list-inline pull-right">\
                                <li><a class="jFiler-item-trash-action"><i class="fa fa-trash"></i></a></li>\
                              </ul>\
                            </div>\
                            <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                          </div>\
                        </div>\
                      </li>',
                            itemAppend: '<li class="jFiler-item">\
                          <div class="jFiler-item-container">\
                            <div class="jFiler-item-inner">\
                              <div class="jFiler-item-thumb">\
                                <div class="jFiler-item-status"></div>\
                                <div class="jFiler-item-thumb-overlay">\
                                  <div class="jFiler-item-info">\
                                    <div style="display:table-cell;vertical-align: middle;">\
                                      <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                      <span class="jFiler-item-others">{{fi-size2}}</span>\
                                    </div>\
                                  </div>\
                                </div>\
                                {{fi-image}}\
                              </div>\
                              <div class="jFiler-item-assets jFiler-row">\
                                <ul class="list-inline pull-left">\
                                  <li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
                                </ul>\
                                <ul class="list-inline pull-right">\
                                  <li><a href="{{fi-url}}" class="text-secondary" target="_blank"><i class="fa fa-search-plus"></i></a></li>\
                                  <li><a href="{{fi-url}}" class="text-secondary" download><i class="fa fa-download"></i></a></li>\
                                  <li><a class="jFiler-item-trash-action"><i class="fa fa-trash"></i></a></li>\
                                </ul>\
                              </div>\
                              <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                            </div>\
                          </div>\
                        </li>',



                        },
                        files: fileData,

                    });
                }
            });
        } else {
            window.$('#CompanyLogo').filer({
                limit: 1,
                extensions: ["jpg", "png", "jpeg"],
                showThumbs: true,
                theme: 'default',
                templates: {
                    itemAppendToEnd: true,
                    box: '<ul class="jFiler-items-list jFiler-items-grid"></ul>',
                    item: '<li class="jFiler-item">\
                <div class="jFiler-item-container">\
                  <div class="jFiler-item-inner">\
                    <div class="jFiler-item-thumb">\
                      <div class="jFiler-item-status"></div>\
                      <div class="jFiler-item-thumb-overlay">\
                        <div class="jFiler-item-info">\
                          <div style="display:table-cell;vertical-align: middle;">\
                            <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                            <span class="jFiler-item-others">{{fi-size2}}</span>\
                          </div>\
                        </div>\
                      </div>\
                      {{fi-image}}\
                    </div>\
                    <div class="jFiler-item-assets jFiler-row">\
                      <ul class="list-inline pull-left">\
                        <li>{{fi-progressBar}}</li>\
                      </ul>\
                      <ul class="list-inline pull-right">\
                        <li><a class="jFiler-item-trash-action"><i class="fa fa-trash"></i></a></li>\
                      </ul>\
                    </div>\
                    <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                  </div>\
                </div>\
              </li>',
                    itemAppend: '<li class="jFiler-item">\
                  <div class="jFiler-item-container">\
                    <div class="jFiler-item-inner">\
                      <div class="jFiler-item-thumb">\
                        <div class="jFiler-item-status"></div>\
                        <div class="jFiler-item-thumb-overlay">\
                          <div class="jFiler-item-info">\
                            <div style="display:table-cell;vertical-align: middle;">\
                              <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                              <span class="jFiler-item-others">{{fi-size2}}</span>\
                            </div>\
                          </div>\
                        </div>\
                        {{fi-image}}\
                      </div>\
                      <div class="jFiler-item-assets jFiler-row">\
                        <ul class="list-inline pull-left">\
                          <li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
                        </ul>\
                        <ul class="list-inline pull-right">\
                          <li><a href="{{fi-url}}" class="text-secondary" target="_blank"><i class="fa fa-search-plus"></i></a></li>\
                          <li><a href="{{fi-url}}" class="text-secondary" download><i class="fa fa-download"></i></a></li>\
                          <li><a class="jFiler-item-trash-action"><i class="fa fa-trash"></i></a></li>\
                        </ul>\
                      </div>\
                      <div><input type="hidden" name="name" value="{{fi-name}}"></div>\
                    </div>\
                  </div>\
                </li>',



                },
                files: [],

            });
        }

    }


    const onSubmit = async (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)
        var foundFalse = false;
        var filters = {
            "ROC": getValues("Company[ROC]").trim(),
            "CompanyName": getValues("Company[CompanyName]").trim()
        }

        await getCheckCompany(filters, globalContext).then(res => {
            if (res) {
                var flag = res.message
                var used = "in used!";
                if (flag != "") {
                    if (flag.includes(used) == true) {
                        alert(flag)
                        foundFalse = true
                        return false;
                    }
                    else {
                        if ($(".PrevCompanyName").val() !== getValues("Company[CompanyName]").trim() && $(".PrevROC").val() !== getValues("Company[ROC]").trim()) {
                            alert("The record already exist.")
                            if (window.confirm('Do you want to update the existing record?')) {
                                navigate("/company/company/update/id=" + flag)
                                foundFalse = true

                            } else {

                            }
                            foundFalse = true
                            return false;
                        } else {
                            if (formState.formType == "New" || formState.formType == "Clone") {
                                alert("Company Name and Company ROC in used!")
                                foundFalse = true
                                return false;
                            }

                        }
                    }
                }
            }

        })


        if (foundFalse) {
            ControlOverlay(false)
            return false
        }


        $(".companyHasPort").find(":hidden").each(function () {

            if (formdata.get($(this).attr("name")) == "") {
                formdata.delete($(this).attr("name"))
            }
        })


        $(".multipleBusinessNature").find(":hidden").each(function () {

            if (formdata.get($(this).attr("name")) == "") {
                formdata.delete($(this).attr("name"))
            }
        })


        if (formState.formType == "New" || formState.formType == "Clone") {


            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Company Name has already been taken.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {

                        ToastNotify("success", "Company created successfully.")
                        navigate("/company/company/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    if (type) {
                        ToastNotify("success", "Company updated successfully.")
                        navigate("/company/company/update/id=" + res.data.data + "/type=" + type, { state: { formType: "Update", id: res.data.data } })
                    } else {
                        ToastNotify("success", "Company updated successfully.")
                        navigate("/company/company/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }


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
        setValue("Company[CompanyName]", "")
        trigger();
        reset()
        remove()
        if (JSON.stringify(params) !== '{}') {
            var companyType = params.type
            setType(companyType)
        }
        if ($(".jFiler-input").length > 0) {
            $("#CompanyLogo").prop("jFiler").reset()
            $(".jFiler-item").not(":first").remove()
            $(".jFiler-items").remove()
            var length = $(".jFiler-theme-default").length
            if (length > 1) {
                $(".jFiler-theme-default").last().unwrap()
            }
        }
        else {
            getFiles()
        }
        setPassCompanyBranchData([{ BranchName: "" }])
        initHoverSelectDropownTitle();
        GetAllDropDown(['CreditTerm', 'CompanyType', 'BusinessNature', "SupplierType", "CustomerType", "Area","User"], globalContext, false).then(res => {

            var ArrayCreditTerm = [];
            var ArrayCustomerType = [];
            var ArraySupplierType = [];
            var ArrayBusinessNature = [];
            var ArrayCompanyType = [];
            var ArrayPortCode = [];
            var ArraySalesPerson = [];

            $.each(res.CreditTerm, function (key, value) {
                ArrayCreditTerm.push({ value: value.CreditTermUUID, label: value.CreditTerm })
            })

            $.each(res.CompanyType, function (key, value) {
                ArrayCompanyType.push({ value: value.CompanyTypeUUID, label: value.CompanyType })
            })

            $.each(res.BusinessNature, function (key, value) {
                ArrayBusinessNature.push({ value: value.BusinessNatureUUID, label: value.BusinessNature })
            })

            $.each(res.CustomerType, function (key, value) {
                ArrayCustomerType.push({ value: value.CustomerTypeUUID, label: value.CustomerType })
            })

            $.each(res.SupplierType, function (key, value) {
                ArraySupplierType.push({ value: value.SupplierTypeUUID, label: value.SupplierType })
            })

            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })

            $.each(res.User, function (key, value) {
                ArraySalesPerson.push({ value: value.id, label: value.username })
            })

            setCreditTerm(sortArray(ArrayCreditTerm))
            setCompanyType(sortArray(ArrayCompanyType))
            setBusinessNature(sortArray(ArrayBusinessNature))
            setSupplierType(sortArray(ArraySupplierType))
            setCustomerType(sortArray(ArrayCustomerType))
            setSalesPerson(sortArray(ArraySalesPerson))
            setPortCode(sortArray(ArrayPortCode))



        })





        if (state) {
            if (state.formType == "Update" || state.formType == "Clone") {
                ControlOverlay(true)
                var arrayDynamic = []
                GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {
                    $.each(res.data.data, function (key, value) {
                        setValue('Company[' + key + ']', value);
                    })
                    if( state.formType !== "Clone"){
                        if(res.data.data.AccessPort){
                            setValue('Company[AccessPort][]', res.data.data.AccessPort.split(","));
                        }else{
                            setValue('Company[AccessPort][]', res.data.data.AccessPort);
                        }
                    }
                   
                    if (res.data.data.VerificationStatus == "Pending") {
                        $(".VerificationStatusField").text("Draft")
                        $(".VerificationStatusField").removeClass("text-danger")
                    } else if (res.data.data.VerificationStatus == "Rejected") {
                        $(".VerificationStatusField").text("Rejected")
                        $(".VerificationStatusField").addClass("text-danger")
                    }
                    $(".VerificationStatusField").last().addClass("d-none")

                    setPassCompanyBranchData(res.data.data.companyBranches)

                    setValue("Company[PrevROC]", res.data.data.ROC)
                    setValue("Company[PrevCompanyName]", res.data.data.CompanyName)


                    // // setContainerTypeData(arrayDynamic)
                    // if (res.data.data.Valid == "1") {
                    //     $('.validCheckbox').prop("checked", true)
                    // }
                    // else {
                    //     $('.validCheckbox').prop("checked", false)

                    // }

                    if (state.formType !== "Clone") {
                        $(".jFiler-input").remove()
                        getFiles(res.data.data.CompanyUUID)
                    }

                    ControlOverlay(false)
                    trigger();


                })


            }
        } else {
            ControlOverlay(true)
            var arrayDynamic = []
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {

                $.each(res.data.data, function (key, value) {
                    setValue('Company[' + key + ']', value);
                })
                if(res.data.data.AccessPort){
                    setValue('Company[AccessPort][]', res.data.data.AccessPort.split(","));
                }else{
                    setValue('Company[AccessPort][]', res.data.data.AccessPort);
                }

                if (res.data.data.VerificationStatus == "Pending") {
                    $(".VerificationStatusField").text("Draft")
                    $(".VerificationStatusField").removeClass("text-danger")
                } else if (res.data.data.VerificationStatus == "Rejected") {
                    $(".VerificationStatusField").text("Rejected")
                    $(".VerificationStatusField").addClass("text-danger")
                }
                $(".VerificationStatusField").last().addClass("d-none")


                setPassCompanyBranchData(res.data.data.companyBranches)

                setValue("Company[PrevROC]", res.data.data.ROC)
                setValue("Company[PrevCompanyName]", res.data.data.CompanyName)


                // // setContainerTypeData(arrayDynamic)
                // if (res.data.data.Valid == "1") {
                //     $('.validCheckbox').prop("checked", true)
                // }
                // else {
                //     $('.validCheckbox').prop("checked", false)

                // }
                $(".jFiler-input").remove()
                getFiles(res.data.data.CompanyUUID)
                ControlOverlay(false)
                trigger();


            })
        }

        return () => {

        }
    }, [state])

    useEffect(() => {
        // if (state) {
        //   //check its copy from link to access
        //   getFiles(state.id)
        // }
        // else {
        //   getFiles(params.id)
        // }

        $("#CompanyLogo").change(function () {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#img').attr('src', e.target.result);
            }
        })

        $("#CompanyLogo").click(function () {
            //reset jqeury filer container
            if ($('.jFiler-theme-default').length > 1) {
                $('.jFiler-theme-default').last().unwrap()
            }
        })




        return () => {

        }
    }, [])


    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("Company[Valid]", "1")
        } else {
            setValue("Company[Valid]", "0")
        }


    });

    $('.validCheckboxBranch').unbind('change').bind('change', function () {


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
    };
    return (
        <form>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Company' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Company" model="company" selectedId="CompanyUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Company' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Company Form</div>
                    <div className="card-body">

                        <div className="row">

                            <div className="col-xs-12 col-md-6">
                                <div className="form-group">
                                    <label className={`control-label ${errors.Company ? errors.Company.CompanyName ? "has-error-label" : "" : ""}`}>Company Name</label>
                                    <input defaultValue='' {...register("Company[CompanyName]", { required: "Company Name cannot be blank." })} className={`form-control ${errors.Company ? errors.Company.CompanyName ? "has-error" : "" : ""}`} />
                                    <input defaultValue='' {...register("Company[PrevCompanyName]")} className={`form-control PrevCompanyName d-none`} />
                                    <p>{errors.Company ? errors.Company.CompanyName && <span style={{ color: "#A94442" }}>{errors.Company.CompanyName.message}</span> : ""}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">

                                    <label className={`control-label ${errors.Company ? errors.Company.ROC ? "has-error-label" : "" : ""}`}>ROC</label>
                                    <input defaultValue='' {...register("Company[ROC]", { required: "ROC cannot be blank." })} className={`form-control ${errors.Company ? errors.Company.ROC ? "has-error" : "" : ""}`} />
                                    <input defaultValue='' {...register("Company[PrevROC]")} className={`form-control PrevROC d-none`} />
                                    <p>{errors.Company ? errors.Company.ROC && <span style={{ color: "#A94442" }}>{errors.Company.ROC.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Agent Code</label>

                                    <input defaultValue='' {...register("Company[AgentCode]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">

                                    <label className={`control-label`} >Access Port</label>
                                    <Controller
                                    name={`Company[AccessPort][]`}
                                    control={control}
                                    defaultValue={DefaultUserPort}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            isMulti
                                            defaultValue={DefaultUserPort}
                                            name={`Company[AccessPort][]`}
                                            value={
                                                value
                                                    ? Array.isArray(value)
                                                        ? value.map((c) =>
                                                           portCode.find((z) => z.value === c)
                                                        )
                                                        : portCode.find(
                                                            (c) => c.value === value
                                                        )
                                                    : null
                                            }
                                            onChange={(val) =>
                                                val == null
                                                    ? onChange(null)
                                                    : onChange(val.map((c) => c.value))
                                            }
                                            options={portCode}
                                            className="basic-multiple-select AccessPort"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}
                                        />
                                    )}
                                />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Account Code</label>

                                    <input defaultValue='' {...register("Company[AccountCode]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-3">
                                <div className="form-group">

                                    <label className={`control-label ${errors.Company ? errors.Company.CreditTerm ? "has-error-label" : "" : ""}`} >Credit Term</label>
                                    <Controller
                                        name="Company[CreditTerm]"
                                        id="CreditTerm"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select

                                                isClearable={true}
                                                {...register("Company[CreditTerm]", { required: "Credit Term cannot be blank." })}
                                                {...register("Company[CreditTerm]")}
                                                value={value ? creditTerm.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                options={creditTerm}
                                                className={`form-control CreditTerm ${errors.Company ? errors.Company.CreditTerm ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                    <p>{errors.Company ? errors.Company.CreditTerm && <span style={{ color: "#A94442" }}>{errors.Company.CreditTerm.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Credit Limit</label>

                                    <input defaultValue='' {...register("Company[CreditLimit]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Website</label>

                                    <input defaultValue='' {...register("Company[Website]")} className={`form-control`} />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className={`control-label`} >Sales Person
                                    </label>
                                    <Controller
                                        name="Company[SalesPerson]"
                                        id="SalesPerson"
                                        control={control}
                                       
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("Company[SalesPerson]")}
                                                value={value ? salesPerson.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={salesPerson}
                                                title={value}
                                                className={`form-control}`}
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

                                    <textarea defaultValue='' {...register("Company[Description]")} className={`form-control`} />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-12">
                                <div className="form-group">
                                    <label className="control-label">Image</label>
                                    <input type="file" id="CompanyLogo"  {...register("Company[Logo]")} className={`CompanyLogo`} />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-12">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked />
                                    <input type="text" className="form-control d-none" defaultValue='1' {...register('Company[Valid]')} />
                                    <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                                </div>
                            </div>





                        </div>
                        <div className="card">

                            <Branch setValue={setValue} getValues={getValues} control={control} errors={errors} trigger={trigger} register={register} CompanyTypeOptions={companyType} BusinessNatureOptions={businessNature} CustomerTypeOptions={customerType} SupplierTypeOptions={supplierType}
                                GenderOptions={Gender} TitleOptions={Title} PortCodeOptions={portCode} CompanyBranchData={passCompanyBranchData} Type={type}
                            />
                            {/* <div className="card-header">
                                <h3 className="card-title">Company Branch</h3>
                                <div className="card-tools">
                                    <button type="button" className="remove-branch btn btn-danger btn-xs"><span
                                        className="fa fa-times" data-toggle="tooltip" data-placement="top"
                                        title="Remove"></span></button>
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" data-toggle="tooltip" data-placement="top"
                                            title="Collapse"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                    <div class="row">
                                    </div>

                            </div> */}

                        </div>




                    </div>




                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton handleSubmitData={handleSubmitForm} title='Company' data={props} /> : <UpdateButton handleSubmitData={handleSubmitForm} title="Company" model="company" selectedId="CompanyUUIDs" id={formState.id} data={props} /> : <CreateButton handleSubmitData={handleSubmitForm} title='Company' data={props} />}

        </form>



    )
}






export default Form