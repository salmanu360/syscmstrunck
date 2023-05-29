
import React, { useState, useEffect, useContext,useRef } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../CreateButtonRow'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import $, { param } from "jquery"
import { ControlOverlay, getCompanyBranches, sortArray,GetAllDropDown, GetUserDetails, FindDepotCompany, FindDepotBranch, GetPortDetailsByUserPort, GetPortDetailsByFilters } from '../../Components/Helper.js'
import BoostrapTableMovement from '../BoostrapTableMovement'
import axios from "axios"
import GridViewColumnSetting from './GridViewColumnSetting';
import GlobalContext from "../../Components/GlobalContext"
import { ToastContainer, toast, useToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import "../../Assets/css/GridView.css"

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import reactSelect from 'react-select';


function GridView(props) {
    const { register, handleSubmit, setValue, getValues, reset, trigger, control, watch, formState: { errors } } = useForm({ mode: "onChange" });
    const navigate = useNavigate();
    const params = useParams();
    const [depot, setDepot] = useState([])
    const [depotOri, setDepotOri] = useState([])
    const [selfBranchOri, setSelfBranchOri] = useState([])

    const [terminal, setTerminal] = useState([])
    const [depotCompanyList, setDepotCompanyList] = useState([])

    const [userBranch, setUserBranch] = useState("")

    const [userFirstTerminalOri, setUserFirstTerminalOri] = useState("")
    const [userFirstTerminal, setUserFirstTerminal] = useState("")
    const [userFirstTerminalReceived, setUserFirstTerminalReceived] = useState("")
    const [userFirstDepotReceived, setUserFirstDepotReceived] = useState("")
    const [count, setCount] = useState(0)
    const [depotArray, setDepotArray] = useState([])
    const [userRuleSet, setUserRuleSet] = useState([])
    
    var companyType = "";

    if (JSON.stringify(params) !== '{}') {
        var companyType = params.type
    }

 

    const globalContext = useContext(GlobalContext);
    const [defaultDepotState, setDefaultDepotState] = useState(null)
    const [defaultDepotStateOri, setDefaultDepotStateOri] = useState(null)
    var createLink = props.data.groupLink + props.data.columnSetting + "/create"
    var modelLink = props.data.columnSetting
    modelLink=="container-received"?modelLink="container-receive":modelLink=modelLink


    useEffect(() => {
        var modelLinkTemp = props.data.columnSetting
        modelLinkTemp=="container-received"?modelLinkTemp="container-receive":modelLinkTemp=modelLinkTemp
        if (globalContext.userRule !== "") {
          const objRule = JSON.parse(globalContext.userRule);
          var filteredAp = objRule.Rules.filter(function (item) {
            return item.includes(modelLinkTemp);
          });
          if(modelLinkTemp !="special-movement"){
            setUserRuleSet(filteredAp)
          }else{
            setUserRuleSet(objRule.Rules)
          }
        }
       
        return () => {
    
        }
      }, [props])


    // load options using API call
    const loadOptions = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Depot&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response

    }

    // load options using API call
    const loadOptionsDepot = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Depot&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response
    }

    function handleAllRelease(event) {

        if ($(event.target).prop("checked")) {
            setCount(count + 1)
            setValue("DynamicModel[DepotCompany]", "")
            setValue("DynamicModel[Depot]", "")
            setDefaultDepotState(null)
            setDepot("")
            setDefaultDepotState(null)

        } else {
            setCount(count + 1)
            setDefaultDepotState(defaultDepotStateOri)
            setDepot(depotOri)
            setValue("DynamicModel[Depot]", selfBranchOri)

        }
    }

    function handleAllReceived(event) {

        if ($(event.target).prop("checked")) {
            setValue("DynamicModel[DepotCompany]", "")
            setValue("DynamicModel[Depot]", "")
            setValue("DynamicModel[Terminal]", "")
            setDefaultDepotState(null)
            setDepot("")
            setCount(count + 1)
            setDefaultDepotState(null)


        } else {
            setCount(count + 1)
            setDefaultDepotState(defaultDepotStateOri)
            setDepot(depotOri)
            setValue("DynamicModel[Terminal]", userFirstTerminalOri)
            setValue("DynamicModel[Depot]", selfBranchOri)

        }
    }


    function handleAllTerminal(event) {
        if ($(event.target).prop("checked")) {
            setCount(count + 1)
            setValue("DynamicModel[Terminal]", "")
            setUserFirstTerminal(null)


        } else {
            setCount(count + 1)
            setUserFirstTerminal(userFirstTerminalOri)
            //setValue("DynamicModel[Terminal]", userFirstTerminal)

        }
    }



    function handleChangeDepotCompany(val) {
        if (val) {
            FindDepotBranch(val.CompanyUUID, "port", globalContext).then(res => {
                var arrayDepot = []
                $.each(res.data, function (key, value) {
                    arrayDepot.push({ label: value.BranchName, value: value.CompanyBranchUUID })
                })
                setDepot(sortArray(arrayDepot))
                if (arrayDepot.length > 0) {
                    setValue("DynamicModel[Depot]", arrayDepot[0].value)
                    handleChangeDepotReceivedField(arrayDepot[0])

                }

            })


        } else {
            setDepot([])
        }

    }

    function handleChangeDepotCompanyReceived(val) {
        if (val) {
            FindDepotBranch(val.CompanyUUID, "port", globalContext).then(res => {
                var arrayDepot = []
                $.each(res.data, function (key, value) {
                    arrayDepot.push({ label: value.BranchName, value: value.CompanyBranchUUID })
                })
                if(props.data.tableId != "special-movement"){
                    setDepot(sortArray(arrayDepot))
                }
                if (arrayDepot.length > 0) {
                    setDepot(arrayDepot)
                    setValue("DynamicModel[Depot]", arrayDepot[0].value)
                    handleChangeDepotReceivedField(arrayDepot[0])

                }

            })


        } else {
            if(props.data.tableId != "special-movement"){
                setDepot([])
            }
        }

    }
    useEffect(() => {
        if (depotCompanyList.length > 0 && depotCompanyList!=="empty") {
            GetUserDetails(globalContext).then(res => {

                var result = depotCompanyList.filter(function (oneArray) {
                    return oneArray.CompanyUUID == res[0].Company.CompanyUUID;
                });
                var selfBranch = res[0].Branch.CompanyBranchUUID

                if (result.length > 0) {
                    setDefaultDepotState({ CompanyName: res[0].Company.CompanyName, CompanyUUID: res[0].Company.CompanyUUID })
                    setDefaultDepotStateOri({ CompanyName: res[0].Company.CompanyName, CompanyUUID: res[0].Company.CompanyUUID })
                    //handleChangeDepotCompany({ CompanyName: res[0].Company.CompanyName, CompanyUUID: res[0].Company.CompanyUUID,selfBranch:res[0].Branch.CompanyBranchUUID })
                }

                FindDepotBranch(res[0].Company.CompanyUUID, "port", globalContext).then(res => {
                    var arrayDepot = []
                    var arrayDepot2 = []
                    $.each(res.data, function (key, value) {
                        arrayDepot.push({ label: value.BranchName, value: value.CompanyBranchUUID })


                    })
                    setDepot(sortArray(arrayDepot))

                    setDepotOri(sortArray(arrayDepot))
                    setSelfBranchOri(selfBranch)
                    setValue("DynamicModel[Depot]", selfBranch)


                })



            })
        }
        else if(depotCompanyList=="empty"){
       
            setDepot(null)
            setUserFirstDepotReceived("")
        }

        
    

        return () => {

        }
    }, [depotCompanyList])

    useEffect(() => {
        const ColumnSetting = GridViewColumnSetting(props.data.columnSetting)
        var defaultHide = ColumnSetting[0].defaultHide
        if (props.data.columnSetting == "container-release" || props.data.columnSetting == "container-received" || props.data.columnSetting == "special-movement") {
            if (count == 1) {
                var GetGridviewData = function (params) {
                    var Depot = $(`input[name='DynamicModel[Depot]'`).val()
                    var CheckAll = $("#AllRelease").prop("checked");
                    var CheckAllReceived = $("#AllReceived").prop("checked");
                    var Terminal = $("input[name='DynamicModel[Terminal]']").val()

                    if (props.data.columnSetting == "container-release") {
                        var param = {
                            limit: params.data.limit,
                            offset: params.data.offset,
                            sort: params.data.sort,
                            filter: params.data.filter,
                            order: params.data.order,
                            depotCheckAll: CheckAll,
                            depot: Depot,
                        }
                    }
                    else if (props.data.columnSetting == "container-received") {
                        param = {
                            limit: params.data.limit,
                            offset: params.data.offset,
                            sort: params.data.sort,
                            filter: params.data.filter,
                            order: params.data.order,
                            terminalCheckAll: CheckAllReceived,
                            terminal: Terminal,
                            depot: Depot,

                        }

                    }else if (props.data.columnSetting == "special-movement") {
                        param = {
                            limit: params.data.limit,
                            offset: params.data.offset,
                            sort: params.data.sort,
                            filter: params.data.filter,
                            order: params.data.order,
                            terminalCheckAll: CheckAllReceived,
                            terminal: Terminal,
                        }

                    } else {


                    }

                    var Data = { "param": param }
                    if (companyType !== "") {
                        param.companyType = companyType
                        Data.CompanyType = companyType
                    }

                    if (props.data.columnSetting == "container-received") {
                        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.columnSetting
                    }
                    else {
                        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.tableId
                    }
                    $.ajax({
                        type: "POST",
                        url: urlLink,
                        dataType: "json",
                        headers: {
                            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                        },
                        data: Data,
                        success: function (data) {

                            // params.success({
                            //   "rows": data,
                            //   "total": data.length
                            // })

                            params.success({
                                "rows": data.rows,
                                "total": data.total
                            })
                        }
                    });
                }

                var columns = ColumnSetting[0].columns

                BoostrapTableMovement({
                    tableSelector: props.data.tableId, // #tableID
                    toolbarSelector: '#toolbar', // #toolbarID
                    columns: columns,
                    hideColumns: defaultHide, // hide default column. If there is no cookie
                    cookieID: props.data.tableId, // define cookie id 
                    functionGrid: GetGridviewData,
                    navigate: navigate,
                    routeName: props.data.groupLink + props.data.columnSetting,
                    selectedId: props.data.model + "UUIDs",
                    host: globalContext,
                    title: props.data.columnSetting,
                    toast: toast,
                    tableId: props.data.tableId

                });
            }

        }


        return () => {
            setCount(0)
            //  ControlOverlay(false)
        }
    }, [depot])



    useEffect(() => {
        const ColumnSetting = GridViewColumnSetting(props.data.columnSetting)
        var defaultHide = ColumnSetting[0].defaultHide
        if (props.data.columnSetting == "container-release" || props.data.columnSetting == "container-received") {
            if (count == 1) {
                var GetGridviewData = function (params) {
                    var Depot = userFirstDepotReceived
                    var CheckAll = $("#AllRelease").prop("checked");
                    var CheckAllReceived = $("#AllReceived").prop("checked");
                    var Terminal = $("input[name='DynamicModel[Terminal]']").val()

                    if (props.data.columnSetting == "container-release") {
                        var param = {
                            limit: params.data.limit,
                            offset: params.data.offset,
                            sort: params.data.sort,
                            filter: params.data.filter,
                            order: params.data.order,
                            depotCheckAll: CheckAll,
                            depot: Depot,
                        }
                    }else if (props.data.columnSetting == "container-received") {
                        param = {
                            limit: params.data.limit,
                            offset: params.data.offset,
                            sort: params.data.sort,
                            filter: params.data.filter,
                            order: params.data.order,
                            terminalCheckAll: CheckAllReceived,
                            terminal: Terminal,
                            depot: Depot,
                        }
                    // }else if (props.data.columnSetting == "special-movement") {
                    //     param = {
                    //         limit: params.data.limit,
                    //         offset: params.data.offset,
                    //         sort: params.data.sort,
                    //         filter: params.data.filter,
                    //         order: params.data.order,
                    //         terminalCheckAll: CheckAllReceived,
                    //         terminal: Terminal,
                    //     }

                    } else {

                    }

                    var Data = { "param": param }
                    if (companyType !== "") {
                        param.companyType = companyType
                        Data.CompanyType = companyType
                    }

                    if (props.data.columnSetting == "container-received") {
                        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.columnSetting
                    }
                    else {
                        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.tableId
                    }
                    $.ajax({
                        type: "POST",
                        url: urlLink,
                        dataType: "json",
                        headers: {
                            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                        },
                        data: Data,
                        success: function (data) {
                            params.success({
                                "rows": data.rows,
                                "total": data.total
                            })
                        }
                    });
                }

                var columns = ColumnSetting[0].columns

                BoostrapTableMovement({
                    tableSelector: props.data.tableId, // #tableID
                    toolbarSelector: '#toolbar', // #toolbarID
                    columns: columns,
                    hideColumns: defaultHide, // hide default column. If there is no cookie
                    cookieID: props.data.tableId, // define cookie id 
                    functionGrid: GetGridviewData,
                    navigate: navigate,
                    routeName: props.data.groupLink + props.data.columnSetting,
                    selectedId: props.data.model + "UUIDs",
                    host: globalContext,
                    title: props.data.columnSetting,
                    toast: toast,
                    tableId: props.data.tableId

                });
            }

        }


        return () => {
            setCount(0)
            //  ControlOverlay(false)
        }
    }, [userFirstDepotReceived])


    useEffect(() => {
        const ColumnSetting = GridViewColumnSetting(props.data.columnSetting)
        var defaultHide = ColumnSetting[0].defaultHide
        if (props.data.columnSetting == "container-release" || props.data.columnSetting == "container-received" || props.data.columnSetting == "special-movement") {
            if (count == 1) {
                var GetGridviewData = function (params) {
                    var Depot = $(`input[name='DynamicModel[Depot]'`).val()
                    var CheckAll = $("#AllRelease").prop("checked");
                    var CheckAllReceived = $("#AllReceived").prop("checked");
                    var Terminal = userFirstTerminalReceived

                    if (props.data.columnSetting == "container-release") {
                        var param = {
                            limit: params.data.limit,
                            offset: params.data.offset,
                            sort: params.data.sort,
                            filter: params.data.filter,
                            order: params.data.order,
                            depotCheckAll: CheckAll,
                            depot: Depot,
                        }
                    }
                    else if (props.data.columnSetting == "container-received" || props.data.columnSetting == "special-movement") {
                        param = {
                            limit: params.data.limit,
                            offset: params.data.offset,
                            sort: params.data.sort,
                            filter: params.data.filter,
                            order: params.data.order,
                            terminalCheckAll: CheckAllReceived,
                            terminal: Terminal,
                            depot: Depot,

                        }

                    } else {


                    }

                    var Data = { "param": param }
                    if (companyType !== "") {
                        param.companyType = companyType
                        Data.CompanyType = companyType
                    }

                    if (props.data.columnSetting == "container-received") {
                        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.columnSetting
                    }
                    else {
                        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.tableId
                    }
                    $.ajax({
                        type: "POST",
                        url: urlLink,
                        dataType: "json",
                        headers: {
                            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                        },
                        data: Data,
                        success: function (data) {

                            // params.success({
                            //   "rows": data,
                            //   "total": data.length
                            // })

                            params.success({
                                "rows": data.rows,
                                "total": data.total
                            })
                        }
                    });
                }

                var columns = ColumnSetting[0].columns

                BoostrapTableMovement({
                    tableSelector: props.data.tableId, // #tableID
                    toolbarSelector: '#toolbar', // #toolbarID
                    columns: columns,
                    hideColumns: defaultHide, // hide default column. If there is no cookie
                    cookieID: props.data.tableId, // define cookie id 
                    functionGrid: GetGridviewData,
                    navigate: navigate,
                    routeName: props.data.groupLink + props.data.columnSetting,
                    selectedId: props.data.model + "UUIDs",
                    host: globalContext,
                    title: props.data.columnSetting,
                    toast: toast,
                    tableId: props.data.tableId

                });
            }

        }


        return () => {
            setCount(0)
        }
    }, [userFirstTerminalReceived])

    function handleChangeTerminalField(data) {
        setCount(count + 1)
        if (data) {
            setUserFirstTerminal(data.value)
        } else {
            setUserFirstTerminal([])
        }
        setUserFirstTerminal(data.value)
    }

    function handleChangeTerminalReceivedField(data) {
        setCount(count + 1)
        if (data) {
            setUserFirstTerminalReceived(data.value)
        } else {
            setUserFirstTerminalReceived([])
        }

    }

    function handleChangeDepotReceivedField(data) {
        setCount(count + 1)
        if (data) {
            setUserFirstDepotReceived(data.value)
        } else {
            setUserFirstDepotReceived([])
        }

    }


    useEffect(() => {
        const ColumnSetting = GridViewColumnSetting(props.data.columnSetting)
        var defaultHide = ColumnSetting[0].defaultHide
        setValue("DynamicModel[Terminal]", userFirstTerminal)


        if (count == 1) {
            var GetGridviewData = function (params) {
                var Depot = window.$(`input[name='DynamicModel[Depot]'`).val()
                var CheckAll = $("#AllTerminal").prop("checked");
                var Terminal = userFirstTerminal
                var param = {
                    limit: params.data.limit,
                    offset: params.data.offset,
                    sort: params.data.sort,
                    filter: params.data.filter,
                    order: params.data.order,
                    terminalCheckAll: CheckAll,
                    terminal: Terminal,

                }

                //}

                var Data = { "param": param }
                if (companyType !== "") {
                    param.companyType = companyType
                    Data.CompanyType = companyType
                }

                if (props.data.columnSetting == "container-received") {
                    var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.columnSetting
                }
                else {
                    var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.tableId
                }
                $.ajax({
                    type: "POST",
                    url: urlLink,
                    dataType: "json",
                    headers: {
                        "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                    },
                    data: Data,
                    success: function (data) {
                        params.success({
                            "rows": data.rows,
                            "total": data.total
                        })
                    }
                });
            }

            var columns = ColumnSetting[0].columns

            BoostrapTableMovement({
                tableSelector: props.data.tableId, // #tableID
                toolbarSelector: '#toolbar', // #toolbarID
                columns: columns,
                hideColumns: defaultHide, // hide default column. If there is no cookie
                cookieID: props.data.tableId, // define cookie id 
                functionGrid: GetGridviewData,
                navigate: navigate,
                routeName: props.data.groupLink + props.data.columnSetting,
                selectedId: props.data.model + "UUIDs",
                host: globalContext,
                title: props.data.columnSetting,
                toast: toast,
                tableId: props.data.tableId

            });
        }


        return () => {
            setCount(0)
            //ControlOverlay(false)

        }
    }, [userFirstTerminal])

    async function getUserPortdetails() {
        var ArrayTerminal = [];

        await GetPortDetailsByUserPort("port", globalContext).then(res => {

            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayTerminal.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                }
            });

            setTerminal(sortArray(ArrayTerminal))

        })

        GetUserDetails(globalContext).then(res => {

            setUserBranch(res[0].Branch.CompanyBranchUUID)
            var filters = { "Branch": res[0].Branch.CompanyBranchUUID }
            GetPortDetailsByFilters(filters, globalContext).then(res => {
                var foundDefault = false;

                $.each(res, function (key, value) {

                    if (value.Default == 1) {
                        foundDefault = true
                        setCount(count + 1)
                        setUserFirstTerminalOri(value.PortDetailsUUID)
                        setUserFirstTerminal(value.PortDetailsUUID);

                        return false;
                    }
                })
                if (!foundDefault) {
                    if (ArrayTerminal.length > 0) {
                        setCount(count + 1)
                        setUserFirstTerminalOri(ArrayTerminal[0].value)
                        setUserFirstTerminal(ArrayTerminal[0].value)
                    }
                }


            })

        })
    }

    async function getUserPortdetailsAndDepot() {
        var ArrayTerminal = [];

        await GetPortDetailsByUserPort("port", globalContext).then(res => {

            $.each(res.data, function (key, value) {
                if (value.VerificationStatus == "Approved") {
                    ArrayTerminal.push({ value: value.PortDetailsUUID, label: value.LocationCode })
                }
            });

            setTerminal(sortArray(ArrayTerminal))

        })

        await GetUserDetails(globalContext).then(res => {
            setUserBranch(res[0].Branch.CompanyBranchUUID)
            var filters = { "Branch": res[0].Branch.CompanyBranchUUID }
            GetPortDetailsByFilters(filters, globalContext).then(res => {
                var foundDefault = false;

                $.each(res, function (key, value) {

                    if (value.Default == 1) {
                        foundDefault = true
                        setCount(count + 1)
                        setUserFirstTerminalOri(value.PortDetailsUUID)
                        setValue("DynamicModel[Terminal]", value.PortDetailsUUID)
                        // setUserFirstTerminal(value.PortDetailsUUID);

                        return false;
                    }
                })
                if (!foundDefault) {
                    if (ArrayTerminal.length > 0) {
                        setCount(count + 1)
                        setUserFirstTerminalOri(ArrayTerminal[0].value)
                        setValue("DynamicModel[Terminal]", ArrayTerminal[0].value)
                        //setUserFirstTerminal(ArrayTerminal[0].value)
                    }
                }


            })

        })

        FindDepotCompany("port", globalContext).then(res => {

            if (res.data.length > 0) {
                setDepotCompanyList(res.data)

            }else{
                setDepotCompanyList("empty")
            }

        })
    }

    useEffect(() => {
        setUserFirstTerminal("")
        setUserFirstTerminalOri("")

        if (props.data.columnSetting == "container-release" || props.data.columnSetting == "container-received" || props.data.columnSetting == "special-movement") {
            ControlOverlay(true)
            getUserPortdetailsAndDepot()


        }
        if (props.data.columnSetting !== "container-release" && props.data.columnSetting !== "container-received"  && props.data.columnSetting !== "special-movement") {
            ControlOverlay(true)
            getUserPortdetails();
        }


    }, [props.data.Title])




    function ReleaseButtonList() {
        return (
            <div className="m-2 page-buttons">
            
                <button id="release" title="Release"  className={`${userRuleSet.find((item) => item == `create-container-release`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-release mr-1`} disabled>
                    <i className="fa fa-send"></i> Release
                </button>
                <button id="releaseReplace" title="Replace"  className={`${userRuleSet.find((item) => item == `replace-container-release`) !== undefined ? "" : "disabledAccess"} btn btn-success replace-container-release`} disabled>
                    <i className="fa fa-send"></i> Replace
                </button>
            </div>
        )
    }

    function GateInButtonList() {
        return (
            <div className="m-2 page-buttons">
                <button id="gateIn" className={`${userRuleSet.find((item) => item == `create-container-gate-in`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-gate-in`} disabled="">
                    <i className="fa fa-send"></i> Gate In
                </button>
            </div>
        )
    }

    function LoadedButtonList() {
        return (
            <div className="m-2 page-buttons">
                <button id="loading"  className={`${userRuleSet.find((item) => item == `create-container-loaded`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-loaded`} disabled="">
                    <i className="fa fa-send"></i> Loading
                </button>
            </div>
        )
    }

    function DischargedButtonList() {
        return (
            <div className="m-2 page-buttons">
                <button id="discharging" className={`${userRuleSet.find((item) => item == `create-container-discharged`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-discharged`}  disabled="">
                    <i className="fa fa-send"></i> Discharging
                </button>
            </div>
        )
    }

    function GateOutButtonList() {
        return (
            <div className="m-2 page-buttons">
                <button id="gateOut" className={`${userRuleSet.find((item) => item == `create-container-gate-out`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-gate-out`} disabled="">
                    <i className="fa fa-send"></i> Gate Out
                </button>
            </div>
        )
    }
    
    function ReceivedButtonList() {
        return (
            <div className="m-2 page-buttons">
                <button id="emptyReturn" className={`${userRuleSet.find((item) => item == `create-container-receive`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-receive`}  disabled="">
                    <i className="fa fa-send"></i> Empty Return
                </button>
            </div>
        )
    }

    function SpecialMovementButtonList() {
        return (
            <div className="m-2 page-buttons">
                    <button id="release" title="Release"  className={`${userRuleSet.find((item) => item == `create-container-release`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-release mr-1`} disabled>
                    <i className="fa fa-send"></i> Release
                </button>
                <button id="releaseReplace" title="Replace"  className={`${userRuleSet.find((item) => item == `replace-container-release`) !== undefined ? "" : "disabledAccess"} btn btn-success replace-container-release mr-1`} disabled>
                    <i className="fa fa-send"></i> Replace
                </button>
                <button id="gateIn" title="Gate In" className={`${userRuleSet.find((item) => item == `create-container-gate-in`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-gate-in mr-1`} disabled>
                    <i className="fa fa-send"></i> Gate In
                </button>
                <button id="loading" title="Loading" className={`${userRuleSet.find((item) => item == `create-container-loaded`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-loaded mr-1`} disabled>
                    <i className="fa fa-send"></i> Loading
                </button>
                <button id="discharging" title="Discharging" className={`${userRuleSet.find((item) => item == `create-container-discharged`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-discharged mr-1`}  disabled>
                    <i className="fa fa-send"></i> Discharging
                </button>
                <button id="gateOut" title="Gate Out" className={`${userRuleSet.find((item) => item == `create-container-gate-out`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-gate-out mr-1`} disabled>
                    <i className="fa fa-send"></i> Gate Out
                </button>
                <button id="emptyReturn" title="Empty Return" className={`${userRuleSet.find((item) => item == `create-container-receive`) !== undefined ? "" : "disabledAccess"} btn btn-success create-container-receive`}  disabled>
                    <i className="fa fa-send"></i> Empty Return
                </button>
            </div>
        )
    }
    
    function ReleaseField(model) {
        return (
            <div className="row">
                <div className="form-check mr-2">
                    <input type="checkbox" id="AllRelease" name="AllRelease"  className={`${userRuleSet.find((item) => item == `view-all-${model}`) !== undefined ? "" : "disabledAccessCheckbox"} view-all-${model}`} onChange={(event) => handleAllRelease(event)}></input>
                    <label htmlFor={`${userRuleSet.find((item) => item == `view-all-${model}`) !== undefined ? "AllRelease" : ""}` } className="mt-1">All</label>
                </div>

                <div className="form-group form-inline ml-2">
                    <label htmlFor="">Depot Company : </label>
                    <div className="form-group field-dynamicmodel-depotcompany">
                        <Controller
                            name="DynamicModel[DepotCompany]"
                            id="dynamicmodel-depotcompany"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <AsyncSelect
                                    isClearable={true}
                                    {...register("DynamicModel[DepotCompany]")}
                                    value={defaultDepotState}
                                    cacheOptions
                                    onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultDepotState(e); handleChangeDepotCompany(e) }}
                                    getOptionLabel={e => e.CompanyName}
                                    getOptionValue={e => e.CompanyUUID}
                                    loadOptions={loadOptionsDepot}
                                    menuPortalTarget={document.body}
                                    className="basic-single DepotCompany"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />

                    </div>
                </div>



                <div className="form-group form-inline ml-2">
                    <label htmlFor="">Depot Branch : </label>
                    <div className="form-group field-dynamicmodel-depot">
                        <Controller
                            name="DynamicModel[Depot]"
                            id="dynamicmodel-depot"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Depot]")}
                                    id="dynamicmodel-depot"
                                    value={value ? depot? depot.find(c => c.value === value) : null : null}
                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeDepotReceivedField(val) }}
                                    options={depot}
                                    className="basic-single depot"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        )
    }


    function ReceiveField(model) {
        return (
            <div className="row">
                <div className="form-check mr-2">
                    <input type="checkbox" id="AllReceived" name="AllReceived"  className={`${userRuleSet.find((item) => item == `view-all-${model}`) !== undefined ? "" : "disabledAccessCheckbox"} view-all-container-receive`} onChange={(event) => handleAllReceived(event)}></input>
                    <label htmlFor={`${userRuleSet.find((item) => item == `view-all-${model}`) !== undefined ? "AllReceived" : ""}` }className="mt-1">All</label>
                   
                </div>


                <div className="form-group form-inline ml-2">
                    <label htmlFor="">Terminal : </label>
                    <div className="form-group">
                        <Controller
                            name="DynamicModel[Terminal]"
                            id="dynamicmodel-terminal"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Terminal]")}
                                    id="dynamicmodel-terminal"
                                    value={value ? terminal.find(c => c.value === value) : null}
                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeTerminalReceivedField(val) }}
                                    options={terminal}
                                    className="form-control terminal"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />

                    </div>
                </div>

                <div className="form-group form-inline ml-2">
                    <label htmlFor="">Depot Company : </label>
                    <div className="form-group field-dynamicmodel-depotcompany">
                        <Controller
                            name="DynamicModel[DepotCompany]"
                            id="dynamicmodel-depotcompany"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <AsyncSelect
                                    isClearable={true}
                                    {...register("DynamicModel[DepotCompany]")}
                                    value={defaultDepotState}
                                    cacheOptions
                                    onChange={e => { e == null ? onChange(null) : onChange(e.id); setDefaultDepotState(e); handleChangeDepotCompanyReceived(e) }}
                                    getOptionLabel={e => e.CompanyName}
                                    getOptionValue={e => e.CompanyUUID}
                                    loadOptions={loadOptionsDepot}
                                    className="basic-single DepotCompany"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />

                    </div>
                </div>



                <div className="form-group form-inline ml-2">
                    <label htmlFor="">Depot Branch : </label>
                    <div className="form-group field-dynamicmodel-depot">
                        <Controller
                            name="DynamicModel[Depot]"
                            id="dynamicmodel-depot"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Depot]")}
                                    id="dynamicmodel-depot"
                                    value={value ?depot?  depot.find(c => c.value === value) : null : null}
                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeDepotReceivedField(val) }}
                                    options={depot}
                                    className="form-control depot"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        )
    }

    function TerminalField(model) {
       
        return (
            <div className="row">
                <div className="form-check mr-2">
                    <input type="checkbox" id="AllTerminal" name="AllTerminal "  className={`${userRuleSet.find((item) => item == `view-all-${model}`) !== undefined ? "" : "disabledAccessCheckbox"} view-all-container-release`}  onChange={(event) => handleAllTerminal(event)}></input>
                    <label htmlFor={`${userRuleSet.find((item) => item == `view-all-${model}`) !== undefined ? "AllTerminal" : ""}` } className="mt-1">All</label>
                   
                </div>

                <div className="form-group form-inline ml-2">
                    <label htmlFor="">Terminal : </label>
                    <div className="form-group">
                        <Controller
                            name="DynamicModel[Terminal]"
                            id="dynamicmodel-terminal"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Terminal]")}
                                    id="dynamicmodel-terminal"
                                    value={value ? terminal.find(c => c.value === value) : null}
                                    onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeTerminalField(val) }}
                                    options={terminal}
                                    className="form-control terminal"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />

                    </div>
                </div>


            </div>
        )
    }



    function GateInModal() {
        return (
            <div className="modal fade" id="gateInModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Gate In Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table " id="gateInRecordTable" border='1'>

                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="gateInConfirm">Gate In</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    function DischargeModal() {
        return (
            <div className="modal fade" id="dischargingModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Discharging Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table " id="dischargingRecordTable" border='1'>

                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="dischargingConfirm">Discharge</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    function GateOutModal() {
        return (
            <div className="modal fade" id="gateOutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Gate Out Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table " id="gateOutRecordTable" border='1'>

                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="gateOutConfirm">Gate Out</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        )

    }

    function emptyReturn() {
        return (
            <div className="modal fade" id="emptyReturnModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Empty Return Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table " id="emptyReturnRecordTable" border='1'>

                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="emptyReturnConfirm">Empty Return</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function HaulierGateOutModal() {
        return (
            <div className="modal fade" id="HaulierGateOutModal" tabIndex="-1" role="dialog"
                aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Haulier Details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>ROC</label>
                                        <input type="text" className="form-control ROC" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input type="text" className="form-control CompanyName" readOnly></input>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Credit Term</label>
                                        <input type="text" className="form-control CreditTerm" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Credit Limit</label>
                                        <input type="text" className="form-control CreditLimit" readOnly></input>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Code</label>
                                        <input type="text" className="form-control BranchCode" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Name</label>
                                        <input type="text" className="form-control BranchName" readOnly></input>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Tel</label>
                                        <input type="text" className="form-control BranchTel" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Fax</label>
                                        <input type="text" className="form-control BranchFax" readOnly></input>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Email</label>
                                        <input type="text" className="form-control BranchEmail" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Address Line 1</label>
                                        <input type="text" className="form-control BranchAddressline1" readOnly></input>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Address Line 2</label>
                                        <input type="text" className="form-control BranchAddressline2" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Address Line 3</label>
                                        <input type="text" className="form-control BranchAddressline3" readOnly></input>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Postcode</label>
                                        <input type="text" className="form-control BranchPostcode" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch City</label>
                                        <input type="text" className="form-control BranchCity" readOnly></input>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Country</label>
                                        <input type="text" className="form-control BranchCountry" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Branch Coordinates</label>
                                        <input type="text" className="form-control BranchCoordinates" readOnly></input>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Attention Name</label>
                                        <input type="text" className="form-control AttentionName" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Attention Tel</label>
                                        <input type="text" className="form-control AttentionTel" readOnly></input>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Attention Email</label>
                                        <input type="text" className="form-control AttentionEmail" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Vehicle No.</label>
                                        <input type="text" className="form-control VehicleNo" readOnly></input>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Driver Name</label>
                                        <input type="text" className="form-control DriverName" readOnly></input>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Driver IC</label>
                                        <input type="text" className="form-control DriverIC" readOnly></input>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Driver Tel</label>
                                        <input type="text" className="form-control DriverTel" readOnly></input>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )


    }

    function ReleaseModal() {
        return (

            <div className="modal fade" id="releaseModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Release Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table " id="releaseRecordTable" border='1'>

                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="releaseConfirm">Release</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function LoadingModal() {
        return (
            <div className="modal fade" id="loadingModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Loading Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table " id="loadingRecordTable" border='1'>

                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="loadingConfirm">Load</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    function ReplaceModal() {

        const [bodyData, setBodyData] = useState([])

        window.$('#releaseReplaceModal').off('show.bs.modal').on('show.bs.modal', function (e) {
            var dataList = JSON.parse($("#replaceDataList").val())

            for (let i = 0; i < dataList.length; i++) {
                setValue(`ContainerReplace[${i}]`,"")
            }
            setBodyData(dataList)
            
        })

        const modalRef = useRef(null);

        return (
            <div className="modal fade" id="releaseReplaceModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Replace and Release Container</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <input type="hidden" id="replaceDataList"/>
                            <div className="table_wrap">
                                <div className="table_wrap_inner">
                                    <table className="table table-bordered commontable" id="releaseReplaceRecordTable">
                                        <thead>
                                            <tr>
                                                <th>BR No</th>
                                                <th>Container Code</th>
                                                <th>Container Type</th>
                                                <th>Replace</th>
                                            </tr>
                                        </thead>
                                        <tbody className="releaseReplaceRecordTableBody">
                                            {bodyData.map((item, index) => {
                                                return(
                                                    <tr>
                                                        <td>{item.BRDocNum}</td>
                                                        <td>{item.ContainerCode}</td>
                                                        <td>{item.Containertype}</td>
                                                        <td>
                                                            <Controller
                                                               name={(`ContainerReplace[${index}]`)}

                                                                control={control}

                                                                render={({ field: { onChange, value } }) => (
                                                                    <Select
                                                                        isClearable={true}
                                                                        {...register(`ContainerReplace[${index}]`)}
                                                                        value={value ? item.ContainerList.find(c => c.value === value) : null}
                                                                        onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                                        options={item.ContainerList}
                                                                        menuPortalTarget={modalRef.current}
                                                                        // isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                        className={`basic-single containerReplace`}
                                                                        classNamePrefix="select"
                                                                        // onKeyDown={handleKeydown}
                                                                        styles={globalContext.customStyles}
                                                                    />
                                                                )}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="releaseReplaceConfirm">Release</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }








    return (
        <div>
            {props.data.columnSetting == "container-release" && ReleaseButtonList()}
            {props.data.columnSetting == "container-gate-in" && GateInButtonList()}
            {props.data.columnSetting == "container-loaded" && LoadedButtonList()}
            {props.data.columnSetting == "container-discharged" && DischargedButtonList()}
            {props.data.columnSetting == "container-gate-out" && GateOutButtonList()}
            {props.data.columnSetting == "container-received" && ReceivedButtonList()}
            {props.data.columnSetting == "special-movement" && SpecialMovementButtonList()}




            <div className="card card-primary">

                <div className="card-body indexTableCard">
                    <div id="toolbar" className={props.data.columnSetting == "LicensePermitListing" || props.data.columnSetting == "ServiceMaintenanceListing" || props.data.columnSetting == "DeviceAssetListing" ? "d-none" : ""}>

                        {props.data.columnSetting == "container-release" && ReleaseField(modelLink)}
                        {props.data.columnSetting == "container-gate-in" && TerminalField(modelLink)}
                        {props.data.columnSetting == "container-loaded" && TerminalField(modelLink)}
                        {props.data.columnSetting == "container-discharged" && TerminalField(modelLink)}
                        {props.data.columnSetting == "container-gate-out" && TerminalField(modelLink)}
                        {props.data.columnSetting == "container-received" && ReceiveField(modelLink)}
                        {props.data.columnSetting == "special-movement" && ReceiveField(modelLink)}




                    </div>
                    <BoostrapTableMovement tableId={props.data.tableId} royuteName={createLink} host={globalContext} title={props.data.columnSetting} selectedId={props.data.model + "UUIDs"} cookieID={props.data.tableId} />
                </div>
            </div>

            {ReleaseModal()}
            {ReplaceModal()}
            {GateInModal()}
            {HaulierGateOutModal()}
            {LoadingModal()}
            {DischargeModal()}
            {GateOutModal()}
            {emptyReturn()}

        </div>
    )
}

export default GridView