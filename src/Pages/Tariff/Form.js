import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, getCheckTariff, getCookie, GetCompanyByShipOrBox, getPortDetails, getCompanyBranches, initHoverSelectDropownTitle, sortArray } from '../../Components/Helper.js'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import AsyncSelect from 'react-select/async';
import moment from "moment";
import $ from "jquery";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContainerCharges from './ContainerCharges';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
    useParams,
    useNavigate
} from "react-router-dom";


const OwnerOption = [
    {
        value: "COC",
        label: "COC",
    },
    {
        value: "SOC",
        label: "SOC",
    },

]


function Form(props) {
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();


    const [port, setPort] = useState([])
    const [portTerm, setPortTerm] = useState([])
    const [pOLTerminal, setPOLTerminal] = useState([])
    const [pODTerminal, setPODTerminal] = useState([])
    const [containerType, setContainerType] = useState([])
    const [shipOperatorCompany, setShipOperatorCompany] = useState([])
    const [boxOperatorCompany, setBoxOperatorCompany] = useState([])
    const [containerTypeData, setContainerTypeData] = useState([])
    const [chargesType, setChargesType] = useState([])

    const [freightTerm, setFreightTerm] = useState([])
    const [taxCode, setTaxCode] = useState([])
    const [currencyType, setCurrencyType] = useState([])
    const [currencyTypeChange, setCurrencyTypeChange] = useState("")

    const [shipOperatorBranch, setShipOperatorBranch] = useState([])
    const [boxOperatorBranch, setBoxOperatorBranch] = useState([])

    const [containerTypeDataReceived, setContainerTypeDataReceived] = useState([])

    const [defaultBoxOpState, setDefaultBoxOpState] = useState(null)
    const [defaultShipperState, setDefaultShipperState] = useState(null)
    const DefaultUserPort=globalContext.userPort;
    const options = []

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
        name: "Charges"
    });

    // load options using API call
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

    // load options using API call
    const loadOptionsBoxOp = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response



    }


    function handleChangeOwner(val) {
        if (val) {
            if (val.value == "COC") {
                GetCompanyByShipOrBox("----shipoperator", globalContext).then(res => {

                    if (res.data.length > 0) {
                        $.each(res.data, function (key, value) {
                            if (value.CompanyName == "SHIN YANG SHIPPING SDN BHD") {
                                setDefaultBoxOpState({ CompanyName: value.CompanyName, CompanyUUID: value.CompanyUUID })
                                setDefaultShipperState({ CompanyName: value.CompanyName, CompanyUUID: value.CompanyUUID })
                                setValue("DynamicModel[ShipOperator]", value.CompanyUUID)
                                setValue("DynamicModel[BoxOperator]", value.CompanyUUID)

                                handleChangeShipOperator({ value: value.CompanyUUID, CompanyUUID: value.CompanyUUID })
                                handleChangeBoxOperator({ value: value.CompanyUUID, CompanyUUID: value.CompanyUUID })
                            }
                        });
                    }

                })
            }

        }

    }

    function handleEmptyCheckBox(event) {
        if ($(event.target).prop("checked")) {
            $(".emptyField").val("1")

        } else {
            $(".emptyField").val("0")

        }
    }

    function handleValidCheckBox(event) {
        if ($(event.target).prop("checked")) {
            $(".validField").val("1")

        } else {
            $(".validField").val("0")

        }
    }



    function handleChangeShipOperator(val) {
        if (val) {
            getCompanyBranches(val.CompanyUUID, globalContext).then(res => {
                var arrayShipOperatorBranch = []

                $.each(res, function (key, value) {
                    $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                        if (value2.CompanyType == "----shipoperator") {
                            arrayShipOperatorBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })

                        }
                    })

                })

                setShipOperatorBranch(arrayShipOperatorBranch)
                setValue("DynamicModel[ShipOperatorBranch]", arrayShipOperatorBranch[0].value)
            })
        }
    }

    function handleChangeBoxOperator(val) {

        if (val) {
            getCompanyBranches(val.CompanyUUID, globalContext).then(res => {
                var arrayBoxOperatorBranch = []

                $.each(res, function (key, value) {
                    $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                        if (value2.CompanyType == "----boxoperator") {
                            arrayBoxOperatorBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })

                        }
                    })

                })

                setBoxOperatorBranch(arrayBoxOperatorBranch)
                setValue("DynamicModel[BoxOperatorBranch]", arrayBoxOperatorBranch[0].value)
            })
        }
    }

    function handleChangeCurrency(val){
        if(val){
            setCurrencyTypeChange(val.value)
        }else{
            setCurrencyTypeChange("")
        }
    }

    useEffect(() => {
      
    
      return () => {
        setCurrencyTypeChange(null)
      }
    }, [currencyTypeChange])
    

    function handleChangePortCode(val, Type) {
        if (val) {
            var DefaultValue;
            getPortDetails(val.value, globalContext).then(res => {
                var terminalOption = []
                if (res.length > 0) {
                    $.each(res, function (key, value) {
                        if (value.VerificationStatus == "Approved") {

                            if (value.Default == 1) {

                                DefaultValue = value.PortDetailsUUID;

                            }
                            terminalOption.push({ value: value.PortDetailsUUID, label: value.LocationCode })

                        }
                    })


                }
                if (Type == "POL") {
                    setPOLTerminal(terminalOption)
                    setValue("DynamicModel[POLAreaName]", DefaultValue)
                }
                else {
                    setPODTerminal(terminalOption)
                    setValue("DynamicModel[PODAreaName]", DefaultValue)
                }


            })
        }


    }


    const onSubmit = async (data, event) => {

        event.preventDefault();
        const formdata = new FormData($("form")[0]);
        ControlOverlay(true)

        if (formState.formType == "New" || formState.formType == "Clone") {
            var flag;
            var filters = {
                "POLPortCode": getValues("DynamicModel[POLPortCode]") ? getValues("DynamicModel[POLPortCode]") : "",
                "POLAreaName": getValues("DynamicModel[POLAreaName]") ? getValues("DynamicModel[POLAreaName]") : "",
                "POLPortTerm": getValues("DynamicModel[POLPortTerm]") ? getValues("DynamicModel[POLPortTerm]") : "",
                "PODPortCode": getValues("DynamicModel[PODPortCode]") ? getValues("DynamicModel[PODPortCode]") : "",
                "PODAreaName": getValues("DynamicModel[PODAreaName]") ? getValues("DynamicModel[PODAreaName]") : "",
                "PODPortTerm": getValues("DynamicModel[PODPortTerm]") ? getValues("DynamicModel[PODPortTerm]") : "",
                "CurrencyType": getValues("DynamicModel[CurrencyType]") ? getValues("DynamicModel[CurrencyType]") : "",
                "ContainerOwnershipType": getValues("DynamicModel[Owner]") ? getValues("DynamicModel[Owner]") : "",
                "DgClass": getValues("DynamicModel[DgClass]") ? getValues("DynamicModel[DgClass]") : "",
                "MinQty": getValues("DynamicModel[MinQty]") ? getValues("DynamicModel[MinQty]") : "",
                "StartDate": getValues("DynamicModel[StartDate]") ? getValues("DynamicModel[StartDate]") : "",
                "EndDate": getValues("DynamicModel[EndDate]") ? getValues("DynamicModel[EndDate]") : "",
                "Empty": $(".emptyField").val()
            };



            await getCheckTariff(filters, globalContext, false).then(res => {
                flag = res.data


            })


            if (flag !== "") {
                alert("The record already exist.")
                if (window.confirm('Do you want to update the existing record?')) {
                   
                    navigate("/setting/sales-settings/tariff/update/id=" + flag, { state: { formType: "Update", id:flag } })

                } else {
                    ControlOverlay(false)
                }


                return false;


            }


            // return false
            CreateData(globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data) {
                    if (res.data.message == "Tariff has already been taken.") {
                        ToastNotify("error", res.data.message)
                        ControlOverlay(false)
                    }
                    else {
                        ToastNotify("success", "Tariff created successfully.")
                        navigate("/setting/sales-settings/tariff/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })
                    }
                }

            })
        }
        else {

            var ArrayTariffUUID = [];


            $(".DynamicTariffUUID").each(function () {
                ArrayTariffUUID.push($(this).val())

            })




            var flag;
            var filters = {
                "POLPortCode": getValues("DynamicModel[POLPortCode]") ? getValues("DynamicModel[POLPortCode]") : "",
                "POLAreaName": getValues("DynamicModel[POLAreaName]") ? getValues("DynamicModel[POLAreaName]") : "",
                "POLPortTerm": getValues("DynamicModel[POLPortTerm]") ? getValues("DynamicModel[POLPortTerm]") : "",
                "PODPortCode": getValues("DynamicModel[PODPortCode]") ? getValues("DynamicModel[PODPortCode]") : "",
                "PODAreaName": getValues("DynamicModel[PODAreaName]") ? getValues("DynamicModel[PODAreaName]") : "",
                "PODPortTerm": getValues("DynamicModel[PODPortTerm]") ? getValues("DynamicModel[PODPortTerm]") : "",
                "CurrencyType": getValues("DynamicModel[CurrencyType]") ? getValues("DynamicModel[CurrencyType]") : "",
                "ContainerOwnershipType": getValues("DynamicModel[Owner]") ? getValues("DynamicModel[Owner]") : "",
                "DgClass": getValues("DynamicModel[DgClass]") ? getValues("DynamicModel[DgClass]") : "",
                "MinQty": getValues("DynamicModel[MinQty]") ? getValues("DynamicModel[MinQty]") : "",
                "StartDate": getValues("DynamicModel[StartDate]") ? getValues("DynamicModel[StartDate]") : "",
                "EndDate": getValues("DynamicModel[EndDate]") ? getValues("DynamicModel[EndDate]") : "",
                "Empty": $(".emptyField").val(),
                "TariffUUID": ArrayTariffUUID
            };



            await getCheckTariff(filters, globalContext).then(res => {
                flag = res.data

            })


            if (flag !== "") {
                alert("The record already exist.")
                if (window.confirm('Do you want to update the existing record?')) {

                } else {
                    ControlOverlay(false)
                }


                return false;


            }
            UpdateData(formState.id, globalContext, props.data.modelLink, formdata).then(res => {
                if (res.data.data) {
                    ToastNotify("success", "Tariff updated successfully.")
                    navigate("/setting/sales-settings/tariff/update/id=" + res.data.data, { state: { formType: "Update", id: res.data.data } })

                }
                else {
                    ToastNotify("error", "Error")
                    ControlOverlay(false)
                }
            })

        }


    }

    useEffect(() => {

        if (containerTypeData.length > 0) {
            setContainerTypeDataReceived(containerTypeData)
        }


        return () => {

        }
    }, [containerTypeData])


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
        trigger();
        reset()

        initHoverSelectDropownTitle()
        setDefaultBoxOpState(null)
        setDefaultShipperState(null)
        if (getCookie('tariffchargescolumn')) {
            var getCookieArray = getCookie('tariffchargescolumn');
            var getCookieArray = JSON.parse(getCookieArray);
            setCookies(getCookieArray)
        }

        GetAllDropDown(['PortTerm', 'Area', 'PortDetails', 'ContainerType', "Charges", "ChargesType", "TaxCode", "FreightTerm", "CurrencyType"], globalContext, false).then(res => {
            var ArrayPortTerm = [];
            var ArrayPortCode = [];
            var ArrayPortDetails = [];
            var ArrayContainerType = [];
            var ArrayCharges = [];
            var ArrayChargesType = [];

            var ArrayFreightTerm = [];
            var ArrayTaxCode = [];
            var ArrayCurrencyType = [];

            $.each(res.Area, function (key, value) {
                ArrayPortCode.push({ value: value.AreaUUID, label: value.PortCode })
            })

            $.each(res.PortTerm, function (key, value) {
                ArrayPortTerm.push({ value: value.PortTermUUID, label: value.PortTerm })
            })

            $.each(res.PortDetails, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayPortDetails.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                }

            })
            $.each(res.ContainerType, function (key, value) {
                ArrayContainerType.push({ value: value.ContainerTypeUUID, label: value.ContainerType })
            })

            $.each(res.Charges, function (key, value) {
                ArrayCharges.push({ value: value.ChargesUUID, label: value.ChargesCode })
            })

            $.each(res.ChargesType, function (key, value) {
                ArrayChargesType.push({ value: value.ChargesTypeUUID, label: value.ChargesType })
            })

            $.each(res.FreightTerm, function (key, value) {
                ArrayFreightTerm.push({ value: value.FreightTermUUID, label: value.FreightTerm })
            })

            $.each(res.TaxCode, function (key, value) {
                ArrayTaxCode.push({ value: value.TaxCodeUUID, label: value.TaxCode })
            })

            $.each(res.CurrencyType, function (key, value) {
                ArrayCurrencyType.push({ value: value.CurrencyTypeUUID, label: value.CurrencyName })
            })
            setPort(sortArray(ArrayPortCode))
            setPOLTerminal(sortArray(ArrayPortDetails))
            setPODTerminal(sortArray(ArrayPortDetails))
            setContainerType(sortArray(ArrayContainerType))
            setPortTerm(sortArray(ArrayPortTerm))
            setChargesType(sortArray(ArrayChargesType))
            setTaxCode(sortArray(ArrayTaxCode))
            setFreightTerm(sortArray(ArrayFreightTerm))
            setCurrencyType(sortArray(ArrayCurrencyType))


        })

        GetCompanyByShipOrBox("----shipoperator", globalContext).then(res => {
            var arrayShipOperator = []
            //get all approved status
            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved" && value.Valid == 1) {
                    arrayShipOperator.push({ value: value.CompanyUUID, label: value.CompanyName })

                }

            })

            setShipOperatorCompany(arrayShipOperator)

        })

        GetCompanyByShipOrBox("----boxoperator", globalContext).then(res => {
            var arrayBoxOperator = []
            //get all approved status
            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved" && value.Valid == 1) {
                    arrayBoxOperator.push({ value: value.CompanyUUID, label: value.CompanyName })

                }

            })

            setBoxOperatorCompany(arrayBoxOperator)

        })




        if (state) {
            if (state.formType == "Update" || state.formType == "Clone") {
                ControlOverlay(true)
                var arrayDynamic = []
                GetUpdateData(state.id, globalContext, props.data.modelLink).then(res => {

                    $.each(res.data.data, function (key, value) {
                        if (key == 0) {
                            $.each(value, function (key2, value2) {
                                setValue('DynamicModel[' + key2 + ']', value2);

                            })
                            if( state.formType !== "Clone"){
                                if(value.AccessPort){
                                    setValue('DynamicModel[AccessPort][]', value.AccessPort.split(","));
                                }else{
                                    setValue('DynamicModel[AccessPort][]', value.AccessPort);
                                }
                            }
                            
                            if (value.VerificationStatus == "Pending") {
                                $(".VerificationStatusField").text("Draft")
                                $(".VerificationStatusField").removeClass("text-danger")
                            } else if (value.VerificationStatus == "Rejected") {
                                $(".VerificationStatusField").text("Rejected")
                                $(".VerificationStatusField").addClass("text-danger")
                            }
                            $(".VerificationStatusField").last().addClass("d-none")
                            setValue('DynamicModel[Owner]', res.data.data[0].ContainerOwnershipType);
                            if (res.data.data[0].Empty == "1") {
                                $(".emptyCheckBox").prop("checked", true)
                                $(".emptyField").val("1")
                            } else {
                                $(".emptyCheckBox").prop("checked", false)
                                $(".emptyField").val("1")
                            }

                            if (res.data.data[0].Valid == "1") {
                                $('.validCheckbox').prop("checked", true)
                            }
                            else {
                                $('.validCheckbox').prop("checked", false)

                            }

                            if (res.data.data[0].POLAreaName) {
                                var array = []
                                $.each(res.data.data[0].pOLTerminalSelection, function (key, value) {
                                    if (value.VerificationStatus == "Approved") {
                                        array.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                                    }

                                })

                                var result = array.filter(function (oneArray) {
                                    return oneArray.value == res.data.data[0].POLAreaName;
                                });
                                if (result.length < 1) {
                                    var result2 = res.data.data[0].pOLTerminalSelection.filter(function (oneArray) {
                                        return oneArray.PortDetailsUUID == res.data.data[0].POLAreaName;
                                    });
                                    array.push({ value: result2[0].PortDetailsUUID, label: result2[0].LocationCode })
                                }
                                setPOLTerminal(array)
                            }
                            else{
                                setPOLTerminal([])
                            }

                            if (res.data.data[0].PODAreaName) {
                                var array = []
                                $.each(res.data.data[0].pODTerminalSelection, function (key, value) {
                                    if (value.VerificationStatus == "Approved") {
                                        array.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                                    }

                                })

                                var result = array.filter(function (oneArray) {
                                    return oneArray.value == res.data.data[0].PODAreaName;
                                });
                                if (result.length < 1) {
                                    var result2 = res.data.data[0].pODTerminalSelection.filter(function (oneArray) {
                                        return oneArray.PortDetailsUUID == res.data.data[0].PODAreaName;
                                    });
                                    array.push({ value: result2[0].PortDetailsUUID, label: result2[0].LocationCode })
                                }
                                setPODTerminal(array)

                            }
                            else{
                                setPODTerminal([])
                            }
                            if(res.data.data[0].BoxOperator){
                                setDefaultBoxOpState({ CompanyName: res.data.data[0].boxOperator.CompanyName, CompanyUUID: res.data.data[0].BoxOperator })
                            }
                            if(res.data.data[0].ShipOperator){
                                setDefaultShipperState({ CompanyName: res.data.data[0].shipOperator.CompanyName, CompanyUUID: res.data.data[0].ShipOperator })
                            }
                           


                        }


                        arrayDynamic.push(value)

                    })

                    getCompanyBranches(res.data.data[0].ShipOperator, globalContext).then(res => {
                        var arrayShipOperatorBranch = []


                        $.each(res, function (key, value) {
                            $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                                if (value2.CompanyType == "----shipoperator") {
                                    arrayShipOperatorBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })

                                }
                            })

                        })

                        setShipOperatorBranch(arrayShipOperatorBranch)
                    })

                    getCompanyBranches(res.data.data[0].BoxOperator, globalContext).then(res => {
                        var arrayBoxOperatorBranch = []


                        $.each(res, function (key, value) {
                            $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                                if (value2.CompanyType == "----boxoperator") {
                                    arrayBoxOperatorBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })

                                }
                            })

                        })

                        setBoxOperatorBranch(arrayBoxOperatorBranch)
                    })


                    setContainerTypeData(arrayDynamic)


                    ControlOverlay(false)
                    trigger()

                })


            }
        } else {
            ControlOverlay(true)
            var arrayDynamic = []
            GetUpdateData(params.id, globalContext, props.data.modelLink).then(res => {
                $.each(res.data.data, function (key, value) {
                    if (key == 0) {
                        $.each(value, function (key2, value2) {
                            setValue('DynamicModel[' + key2 + ']', value2);

                        })

                        if(value.AccessPort){
                            setValue('DynamicModel[AccessPort][]', value.AccessPort.split(","));
                        }else{
                            setValue('DynamicModel[AccessPort][]', value.AccessPort);
                        }
                        
                        if (value.VerificationStatus == "Pending") {
                            $(".VerificationStatusField").text("Draft")
                            $(".VerificationStatusField").removeClass("text-danger")
                        } else if (value.VerificationStatus == "Rejected") {
                            $(".VerificationStatusField").text("Rejected")
                            $(".VerificationStatusField").addClass("text-danger")
                        }
                        $(".VerificationStatusField").last().addClass("d-none")
                        setValue('DynamicModel[Owner]', res.data.data[0].ContainerOwnershipType);
                        if (res.data.data[0].Empty == "1") {
                            $(".emptyCheckBox").prop("checked", true)
                            $(".emptyField").val("1")
                        } else {
                            $(".emptyCheckBox").prop("checked", false)
                            $(".emptyField").val("1")
                        }

                        if (res.data.data[0].Valid == "1") {
                            $('.validCheckbox').prop("checked", true)
                        }
                        else {
                            $('.validCheckbox').prop("checked", false)

                        }

                        if (res.data.data[0].POLAreaName) {
                            var array = []
                            $.each(res.data.data[0].pOLTerminalSelection, function (key, value) {
                                if (value.VerificationStatus == "Approved") {
                                    array.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                                }

                            })  
                              //check for unverified and add in options
                            var result = array.filter(function (oneArray) {
                                return oneArray.value == res.data.data[0].POLAreaName;
                            });
                          
                            if (result.length < 1) {
                                var result2 = res.data.data[0].pOLTerminalSelection.filter(function (oneArray) {
                                    return oneArray.PortDetailsUUID == res.data.data[0].POLAreaName;
                                });
                                array.push({ value: result2[0].PortDetailsUUID, label: result2[0].LocationCode })
                            }
                            setPOLTerminal(array)
                        }

                        if (res.data.data[0].PODAreaName) {
                            var array = []
                            $.each(res.data.data[0].pODTerminalSelection, function (key, value) {
                                if (value.VerificationStatus == "Approved") {
                                    array.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                                }

                            })
                              //check for unverified and add in options
                            var result = array.filter(function (oneArray) {
                                return oneArray.value == res.data.data[0].PODAreaName;
                            });
                            if (result.length < 1) {
                                var result2 = res.data.data[0].pODTerminalSelection.filter(function (oneArray) {
                                    return oneArray.PortDetailsUUID == res.data.data[0].PODAreaName;
                                });
                                array.push({ value: result2[0].PortDetailsUUID, label: result2[0].LocationCode })
                            }
                            setPODTerminal(array)

                        }
                        if(res.data.data[0].BoxOperator){
                            setDefaultBoxOpState({ CompanyName: res.data.data[0].boxOperator.CompanyName, CompanyUUID: res.data.data[0].BoxOperator })
                        }
                        if(res.data.data[0].ShipOperator){
                            setDefaultShipperState({ CompanyName: res.data.data[0].shipOperator.CompanyName, CompanyUUID: res.data.data[0].ShipOperator })
                        }


                    }


                    arrayDynamic.push(value)

                })

                getCompanyBranches(res.data.data[0].ShipOperator, globalContext).then(res => {
                    var arrayShipOperatorBranch = []


                    $.each(res, function (key, value) {
                        $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                            if (value2.CompanyType == "----shipoperator") {
                                arrayShipOperatorBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })

                            }
                        })

                    })

                    setShipOperatorBranch(arrayShipOperatorBranch)
                })

                getCompanyBranches(res.data.data[0].BoxOperator, globalContext).then(res => {
                    var arrayBoxOperatorBranch = []


                    $.each(res, function (key, value) {
                        $.each(value.companyBranchHasCompanyTypes, function (key, value2) {
                            if (value2.CompanyType == "----boxoperator") {
                                arrayBoxOperatorBranch.push({ value: value.CompanyBranchUUID, label: value.BranchName + "(" + value.portCode.PortCode + ")" })

                            }
                        })

                    })

                    setBoxOperatorBranch(arrayBoxOperatorBranch)
                })


                setContainerTypeData(arrayDynamic)


                ControlOverlay(false)
                trigger()
            })
        }

        return () => {

        }
    }, [state])

    $('.validCheckbox').unbind('change').bind('change', function () {
        if ($(this).prop("checked")) {
            setValue("Tariff[Valid]", "1")
        } else {
            setValue("Tariff[Valid]", "0")
        }


    });

    const handleSubmitForm = (e) => {
        handleSubmit(onSubmit)(e);
      };
    return (
        <form >
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='Tariff' data={props} /> : <UpdateButton  handleSubmitData={handleSubmitForm} title="Tariff" model="tariff" selectedId="TariffUUIDs" id={formState.id} data={props} /> : <CreateButton  handleSubmitData={handleSubmitForm} title='Tariff' data={props} />}
            <div className="col-md-12">
                <div className="card card-primary">
                    <div className="card-header">Tariff Form</div>
                    <div className="card-body">

                        <div className="row">

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className={`control-label ${errors.DynamicModel ? errors.DynamicModel.POLPortCode ? "has-error-label" : "" : ""}`} >POL Port Code
                                    </label>
                                    <Controller
                                        name="DynamicModel[POLPortCode]"
                                        id="POLPortCode"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select

                                                isClearable={true}
                                                {...register("DynamicModel[POLPortCode]", { required: "POL Port Code cannot be blank." })}
                                                value={value ? port.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangePortCode(val, "POL"); handleChangeCurrency({value:$("input[name='DynamicModel[CurrencyType]']").val()})}}
                                                options={port}
                                                className={`form-control POLPortCode ${errors.DynamicModel ? errors.DynamicModel.POLPortCode ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                    <p>{errors.DynamicModel ? errors.DynamicModel.POLPortCode && <span style={{ color: "#A94442" }}>{errors.DynamicModel.POLPortCode.message}</span> : ""}</p>
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >POL Terminal Code
                                    </label>
                                    <Controller
                                        name="DynamicModel[POLAreaName]"
                                        id="POLTerminalCode"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[POLAreaName]")}
                                                value={value ? pOLTerminal.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={pOLTerminal}
                                                className="form-control"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >POL Port Term
                                    </label>
                                    <Controller
                                        name="DynamicModel[POLPortTerm]"
                                        id="POLPortTerm"
                                        control={control}
                                        defaultValue={"----c1d43831-d709-11eb-91d3-b42e998d11ff"}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[POLPortTerm]")}
                                                value={value ? portTerm.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={portTerm}
                                                className="form-control"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className={`control-label ${errors.DynamicModel ? errors.DynamicModel.PODPortCode ? "has-error-label" : "" : ""}`} >POD Port Code
                                    </label>
                                    <Controller
                                        name="DynamicModel[PODPortCode]"
                                        id="PODPortCode"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[PODPortCode]", { required: "POD Port Code cannot be blank." })}
                                                value={value ? port.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangePortCode(val, "POD"); handleChangeCurrency({value:$("input[name='DynamicModel[CurrencyType]']").val()}) }}
                                                options={port}
                                                className={`form-control PODPortCode ${errors.DynamicModel ? errors.DynamicModel.PODPortCode ? "has-error-select" : "" : ""}`}
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                    <p>{errors.DynamicModel ? errors.DynamicModel.PODPortCode && <span style={{ color: "#A94442" }}>{errors.DynamicModel.PODPortCode.message}</span> : ""}</p>
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >POD Terminal Code
                                    </label>
                                    <Controller
                                        name="DynamicModel[PODAreaName]"
                                        id="TariffType"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[PODAreaName]")}
                                                value={value ? pODTerminal.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={pODTerminal}
                                                className="form-control"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >POD Port Term
                                    </label>
                                    <Controller
                                        name="DynamicModel[PODPortTerm]"
                                        id="TariffType"
                                        control={control}
                                        defaultValue={"----c1d43831-d709-11eb-91d3-b42e998d11ff"}
                                        render={({ field: { onChange, value } }) => (
                                            <Select

                                                isClearable={true}
                                                {...register("DynamicModel[PODPortTerm]")}
                                                value={value ? portTerm.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={portTerm}
                                                className="form-control"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>



                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Ownership Type
                                    </label>
                                    <Controller
                                        name="DynamicModel[Owner]"
                                        id="Owner"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[Owner]")}
                                                value={value ? OwnerOption.find(c => c.value === value) : null}
                                                title="dsdsdsds"
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeOwner(val) }}
                                                options={OwnerOption}
                                                className="form-control"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">DG Class</label>

                                    <input defaultValue='' {...register("DynamicModel[DgClass]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Min Qty</label>

                                    <input type="number" defaultValue={1} {...register("DynamicModel[MinQty]")} className={`form-control`} />
                                </div>
                            </div>


                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">Start Date
                                    </label>

                                    <Controller
                                        name="DynamicModel[StartDate]"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                    value={value}
                                                    {...register('DynamicModel[StartDate]')}

                                                    onChange={val => {

                                                        onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                        handleChangeCurrency({value:$("input[name='DynamicModel[CurrencyType]']").val()})
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

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label">End Date
                                    </label>

                                    <Controller
                                        name="DynamicModel[EndDate]"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Flatpickr
                                                    value={value}
                                                    {...register('DynamicModel[EndDate]')}

                                                    onChange={val => {

                                                        onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                        handleChangeCurrency({value:$("input[name='DynamicModel[CurrencyType]']").val()})
                                                    }}
                                                    className="form-control EndDate"
                                                    options={{
                                                        dateFormat: "d/m/Y"
                                                    }}

                                                />
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Currency Type
                                    </label>
                                    <Controller
                                        name="DynamicModel[CurrencyType]"
                                        id="Owner"
                                        control={control}
                                        defaultValue={"----942c4cf1-d709-11eb-91d3-b42e998d11ff"}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[CurrencyType]")}
                                                value={value ? currencyType.find(c => c.value === value) : null}
                                                onChange={val => { val == null ? onChange(null) : onChange(val.value);handleChangeCurrency(val) }}
                                                options={currencyType}
                                                className="form-control currencyType"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Ship Op Co
                                    </label>
                                    <Controller
                                        name="DynamicModel[ShipOperator]"
                                        id="ShipOperator"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (

                                            <AsyncSelect
                                                isClearable={true}
                                                {...register("DynamicModel[ShipOperator]")}
                                                value={defaultShipperState}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultShipperState(e); handleChangeShipOperator(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsShipOp}
                                                menuPortalTarget={document.body}
                                                className="form-control"
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
                                        name="DynamicModel[ShipOperatorBranch]"
                                        id="ShipOperatorBranch"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[ShipOperatorBranch]")}
                                                value={value ? shipOperatorBranch.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={shipOperatorBranch}
                                                className="form-control ShipOperatorBranch"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Box Op Co
                                    </label>
                                    <Controller
                                        name="DynamicModel[BoxOperator]"
                                        id="BoxOperator"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (

                                            <AsyncSelect
                                                isClearable={true}
                                                {...register("DynamicModel[BoxOperator]")}
                                                value={defaultBoxOpState}
                                                cacheOptions
                                                placeholder={globalContext.asyncSelectPlaceHolder}
                                                onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultBoxOpState(e); handleChangeBoxOperator(e) }}
                                                getOptionLabel={e => e.CompanyName}
                                                getOptionValue={e => e.CompanyUUID}
                                                loadOptions={loadOptionsBoxOp}
                                                menuPortalTarget={document.body}
                                                className="form-control BoxOperator"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label className="control-label" >Box Op Branch
                                    </label>
                                    <Controller
                                        name="DynamicModel[BoxOperatorBranch]"
                                        id="BoxOperatorBranch"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[BoxOperatorBranch]")}
                                                value={value ? boxOperatorBranch.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={boxOperatorBranch}
                                                className="form-control BoxOperatorBranch"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">

                                    <label className={`control-label`} >Access Port</label>
                                    <Controller
                                    name={`DynamicModel[AccessPort][]`}
                                    control={control}
                                    defaultValue={DefaultUserPort}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            isMulti
                                            defaultValue={DefaultUserPort}
                                            name={`DynamicModel[AccessPort][]`}
                                            value={
                                                value
                                                    ? Array.isArray(value)
                                                        ? value.map((c) =>
                                                           port.find((z) => z.value === c)
                                                        )
                                                        : port.find(
                                                            (c) => c.value === value
                                                        )
                                                    : null
                                            }
                                            onChange={(val) =>
                                                val == null
                                                    ? onChange(null)
                                                    : onChange(val.map((c) => c.value))
                                            }
                                            options={port}
                                            className="basic-multiple-select AccessPort"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}
                                        />
                                    )}
                                />
                                </div>
                            </div>

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group mt-4 mb-1">
                                    <input type="checkbox" className="emptyCheckBox" id="emptyCheckBox" onChange={handleEmptyCheckBox} />
                                    <input type="text" className="form-control d-none emptyField" defaultValue='0' {...register('DynamicModel[IsEmpty]')} />
                                    <label className="control-label ml-2" htmlFor='emptyCheckBox'>Empty</label>
                                </div>
                            </div>
                            <ContainerCharges cookies={cookies} trigger={trigger} currencyTypeChange={currencyTypeChange} options={containerType} data={containerTypeDataReceived} currencyTypeOption={currencyType} chargesTypeOption={chargesType} taxCodeOption={taxCode} freightTermOption={freightTerm} formState={formState} />
                        </div>


                    </div>
                    <div className="col-xs-12 col-md-3 mt-2">
                        <div className="form-group mt-4 mb-1">
                            <input type="checkbox" className="validCheckbox" id="validCheckbox" defaultChecked onChange={handleValidCheckBox} />
                            <input type="text" className="form-control d-none validField" defaultValue='1' {...register('DynamicModel[Valid]')} />
                            <label className="control-label ml-2" htmlFor='validCheckbox'>Valid</label>
                        </div>
                    </div>



                </div>




            </div>
            {formState ? formState.formType == "Clone" || formState.formType == "New" ? <CreateButton  handleSubmitData={handleSubmitForm} title='Tariff' data={props} /> : <UpdateButton  handleSubmitData={handleSubmitForm} title="Tariff" model="tariff" selectedId="TariffUUIDs" id={formState.id} data={props} /> : <CreateButton  handleSubmitData={handleSubmitForm} title='Tariff' data={props} />}


        </form>



    )
}






export default Form