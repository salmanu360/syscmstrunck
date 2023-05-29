import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, getCookie, initHoverSelectDropownTitle, GetUser, sortArray } from '../../Components/Helper.js'
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
    var ContainerUUIDLink;
    var arrayLatestColumn = [];
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [port, setPort] = useState([])
    const [vessel, setVessel] = useState([])
    const [containerType, setContainerType] = useState([])

    const ImportExport = [
        { label: "Both", value: "Both" },
        { label: "Import", value: "Import" },
        { label: "Export", value: "Export" }

    ]

    const TuesRevenue = [
        { label: "Both", value: "Both" },
        { label: "Tues", value: "Tues" },
        { label: "Revenue", value: "Revenue" }

    ]

    const Condition = [
        { label: "Top 10", value: "10" },
        { label: "Top 25", value: "25" },
        { label: "Top 50", value: "50" }

    ]

    var modelLinkTemp;
    if (globalContext.userRule !== "") {
        modelLinkTemp = props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
            return item.includes(modelLinkTemp);
        });

    }


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

    function handleGenerate() {

        var StartDate = $(".StartDate").val();
        var EndDate = $(".EndDate").val();
        var Port = getValues("DynamicModel[Port]")
        var Import = getValues("DynamicModel[ImportExport]")
        var Tues = getValues("DynamicModel[TuesRevenue]")
        var BillTo = "";
        var OptionTuesORRevenue = getValues("DynamicModel[TuesRevenue]")
        var TopCondition = getValues("DynamicModel[Condition]")

        var ShipperCheck = $('#ShipperCheckbox').prop('checked') ? "1" : "0"
        var ConsigneeCheck = $('#ConsigneeCheckbox').prop('checked') ? "1" : "0"
        var CommodityCheck = $('#CommodityCheckbox').prop('checked') ? "1" : "0"
        var ContainerTypeCheck = $('#ContainerTypeCheckbox').prop('checked') ? "1" : "0"
        var previewUrlLink;
        var arrayBillTo = [];

        if(props.data.modelLink=="customer-lifting"){
            previewUrlLink=globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/generate-report?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Port=" + Port + "&Import=" + Import + "&Tues=" + Tues + "&BillTo=" + BillTo + "&Shipper=" + ShipperCheck + "&Consignee=" + ConsigneeCheck + "&Commodity=" + CommodityCheck + "&ContainerType=" + ContainerTypeCheck
        }else{
            previewUrlLink=globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/generate-report?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Port=" + Port + "&Import=" + Import + "&Tues=" + Tues + "&BillTo=" + BillTo +"&Commodity=" + CommodityCheck + "&Condition=" +TopCondition
        }

        var defaultHide = [ // default field to hide in bootstrap table
        ];

        if (OptionTuesORRevenue == "Tues") {
            var columns = [ // data from controller (actionGetCompanyType) field and title to be included
                { field: 'No', title: 'No', filterControl: "input" },
                { field: 'Shipper', title: 'Shipper', filterControl: "input" },
                { field: 'Consignee', title: 'Consignee', filterControl: "input" },
                { field: 'Tues', title: 'Tues', filterControl: "input" },
            ];
        } else if (OptionTuesORRevenue == "Revenue") {
            var columns = [ // data from controller (actionGetCompanyType) field and title to be included
                { field: 'No', title: 'No', filterControl: "input" },
                { field: 'Shipper', title: 'Shipper', filterControl: "input" },
                { field: 'Consignee', title: 'Consignee', filterControl: "input" },
                { field: 'Revenue', title: 'Revenue', filterControl: "input" },
            ];
        } else {
            var columns = [ // data from controller (actionGetCompanyType) field and title to be included
                { field: 'No', title: 'No', filterControl: "input" },
                { field: 'Shipper', title: 'Shipper', filterControl: "input" },
                { field: 'Consignee', title: 'Consignee', filterControl: "input" },
                { field: 'Tues', title: 'Tues', filterControl: "input" },
                { field: 'Revenue', title: 'Revenue', filterControl: "input" },
            ];
        }

        $("input[name='DynamicModel[BillTo][]']").each(function () {
            if ($(this).val() !== "") {
                arrayBillTo.push($(this).val())
            }

        })
        if (arrayBillTo.length > 0) {
            BillTo = arrayBillTo.toString();
        }


        $("#CustomerLiftingTable").empty();
        $("#CustomerLiftingTable").removeClass("d-none");

        var htmlHead = "<thead>";
        htmlHead += "<tr id='head'>";
        htmlHead += "<th>No</th>";
        htmlHead += "<th>Shipper</th>";
        htmlHead += "<th>Consignee</th>>";
        if (OptionTuesORRevenue == "Tues") {
            htmlHead += "<th><div>Tues <button style='border: none; background-color: transparent; outline: none;' type='button' id='SortTues'>-</button></div></th>";
        } else if (OptionTuesORRevenue == "Revenue") {
            htmlHead += "<th><div>Revenue <button style='border: none; background-color: transparent; outline: none;' type='button' id='SortRevenue'>-</button></div></th>";
        } else {
            htmlHead += "<th><div>Tues <button style='border: none; background-color: transparent; outline: none;' type='button' id='SortTues'>-</button></div></th>";
            htmlHead += "<th><div>Revenue <button style='border: none; background-color: transparent; outline: none;' type='button' id='SortRevenue'>-</button></div></th>";
        }

        htmlHead += "</tr>";
        htmlHead += "</thead>";
        htmlHead += "<tbody id='body'></tbody>";
        // $("#body").append(htmlHead)


        // $("#CustomerLiftingTable").append(htmlHead)
        var TableDataList = []
        $.ajax({
            url: previewUrlLink,
            type: "POST",
            dataType: "json",
            headers: {
                "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
            },
            success: function (data) {
                var column = []
                var defaultHide = [ // default field to hide in bootstrap table

                ];
                var keyTitle;
                
                    $.each(data.data.rows[0], function (key, value) {

                        if (key.includes("\'")) {
                            keyTitle = key.replace("\\", "")
                        }
                        else {
                            keyTitle = key
                        }
    
                        if (key !== "BookingConfirmation" && key !== "ContainerType" && key !== "No") {
                            column.push({ field: key, title: keyTitle, filterControl: "input" })
                        }
    
                        if (key == "No") {
                            column.unshift({ field: key, title: keyTitle, filterControl: "input" })
                        }
    
    
    
                    })
                
                var GetGridviewData = function (params) {
                    var param = {
                        limit: params.data.limit,
                        offset: params.data.offset,
                        sort: params.data.sort,
                        filter: params.data.filter,
                        order: params.data.order,
                    }
                    $.ajax({
                        type: "POST",
                        url:previewUrlLink,
                        data: {
                            param: param,
                            //     PolPortCode:$(".PolPortCode").val(),
                            //     PODPortCode:$(".PODPortCode").val(),
                            //     VoyageNum:$(".VoyageNum").val()
                        },
                        sort: false,
                        headers: {
                            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data == null) {
                                data = [];
                            }
                            params.success({
                                "rows": data.data.rows,
                                "total": data.data.total
                            });
                        }
                    });
                };
                initTable({
                    tableSelector:  props.data.modelLink=="customer-lifting"?'#CustomerLiftingTable':'#CustomerLiftingSummaryTable', // #tableID
                    toolbarSelector: '#toolbar', // #toolbarID
                    columns: column,
                    hideColumns: defaultHide, // hide default column. If there is no cookie
                    cookieID: props.data.modelLink=="customer-lifting"?'CustomerLifting':'CustomerLiftingSummary', // define cookie id 
                    functionGrid: GetGridviewData,
                });



            }

        });




    }

    function columnSetup(columns) {
        var res = [
        ];
        if (columns) {
            var NewColumn = columns.map(obj => ({ ...obj }));
            arrayLatestColumn = NewColumn
            //check for reorder column cookies

            if (getCookie(`CustomerLifting.bs.table.reorderColumns`)) {
                var getCookieArray = getCookie(`CustomerLifting.bs.table.reorderColumns`);
                getCookieArray = JSON.parse(getCookieArray);

                const newArray = Object.keys(getCookieArray).filter(key => key !== "state")
                    .map(key => ({ field: key }));

                var tempNewArray = []
                window.$.each(newArray, function (key, value) {
                    window.$.each(NewColumn, function (key2, value2) {
                        if (value.field == value2.field) {
                            tempNewArray.push(value2)
                        }

                    })

                })
                var Concatarray = tempNewArray.concat(NewColumn);
                const uniqueArray = Concatarray.filter((item, index, self) => index === self.findIndex((t) => t.field === item.field));
                columns = uniqueArray
            }
        }
        $.each(columns, function (i, column) {
            column.sortable = true;
            column.align = 'center';
            // column.switchable = false;
            column.valign = 'middle';
            res.push(column);
        })

        return res;
    }

    function initTable(args) {
        var paramsTable = args;

        window.$(`#CustomerLiftingTable`).bootstrapTable('destroy').bootstrapTable({

            // height: '630',
            toolbar: args.toolbarSelector,
            minimumCountColumns: 1,
            pagination: true,
            pageList: [10, 50, 100, 500],
            idField: 'id',
            ajax: args.functionGrid,
            columns: columnSetup(args.columns),
            sidePagination: 'server',
            showRefresh: true,
            showColumns: true,
            showColumnsToggleAll: true,
            showExport: true,
            resizable: true,
            reorderableColumns: true,
            exportTypes: ['excel', 'xlsx'],
            filterControl: true,
            // clickToSelect: true,
            cookie: "true",
            cookieExpire: '10y',
            cookieIdTable: args.cookieID,
            onLoadSuccess: function () {
                // $table.bootstrapTable('filterBy', args.filterSelector); // default show valid data only
                // var exportAcess=filteredAp.find((item) => item == `export-${modelLinkTemp}`) !== undefined
                // if(!exportAcess){
                //  window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",true)
                // }else{
                //  window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",false)
                // }

                if (window.$(`#CustomerLiftingTable`).bootstrapTable("getCookies")['columns'] == null) {
                    $.each(args.hideColumns, function (key, value) {
                        window.$(`#CustomerLiftingTable`).bootstrapTable('hideColumn', value);
                    });
                }
            }
        });

        window.$("#CustomerLiftingTable").on('reorder-column.bs.table', function (e, args) {
            var newLatestColumn = []
            if (getCookie(`CustomerLifting.bs.table.reorderColumns`)) {

                var getCookieArray = getCookie(`CustomerLifting.bs.table.reorderColumns`);
                getCookieArray = JSON.parse(getCookieArray);
            }
            window.$.each(args, function (key, value) {
                window.$.each(arrayLatestColumn, function (key2, value2) {
                    if (value == value2.field) {

                        if (value2.switchable == false) {

                        } else {
                            newLatestColumn.push(value2)
                        }
                    }
                })
            })
            window.$(".fixed-table-toolbar").find(".dropdown-menu").first().children().find("input:checkbox").not(":eq(0)").each(function (key3) {
                var value = window.$(this)[0];
                window.$(value).prop("checked", false);


                window.$.each(newLatestColumn, function (key4, value4) {
                    if (key3 == key4) {

                        window.$(value).attr("data-field", value4.field);
                        if (getCookieArray.hasOwnProperty(value4.field)) {

                            window.$(value).prop("checked", true);
                        }

                        window.$(value).next().text(value4.title)
                    }
                })

                window.$.each(args, function (key6, value6) {
                    if (value6 == window.$(value).attr("data-field")) {
                        window.$(value).val(key6)
                    }
                });
            });
        })

        window.$(`#CustomerLiftingTable`).on('page-change.bs.table', function () {
            $('.fixed-table-body').css('overflow-y', 'hidden');
        })

        window.$(`#CustomerLiftingTable`).on('click-row.bs.table', function (e, row, $element) {
            $('.active').removeClass('active');
            $($element).addClass('active');
        })
    }

    function handlePreview() {

        // if(getPreviewPDFPermission == true){

        var StartDate = $(".StartDate").val();
        var EndDate = $(".EndDate").val();
        var Port = getValues("DynamicModel[Port]")
        var Import = getValues("DynamicModel[ImportExport]")
        var Tues = getValues("DynamicModel[TuesRevenue]")
        var TopCondition = getValues("DynamicModel[Condition]")
        var BillTo = "";
        var OptionTuesORRevenue = getValues("DynamicModel[TuesRevenue]")

        var ShipperCheck = $('#ShipperCheckbox').prop('checked') ? "1" : "0"
        var ConsigneeCheck = $('#ConsigneeCheckbox').prop('checked') ? "1" : "0"
        var CommodityCheck = $('#CommodityCheckbox').prop('checked') ? "1" : "0"
        var ContainerTypeCheck = $('#ContainerTypeCheckbox').prop('checked') ? "1" : "0"
        var previewUrlLink;
        var arrayBillTo = [];

        $("input[name='DynamicModel[BillTo][]']").each(function () {
            if ($(this).val() !== "") {
                arrayBillTo.push($(this).val())
            }

        })
        if (arrayBillTo.length > 0) {
            BillTo = arrayBillTo.toString();
        }
        if(props.data.modelLink=="customer-lifting"){
             previewUrlLink=globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/preview?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Port=" + Port + "&Import=" + Import + "&Tues=" + Tues + "&BillTo=" + BillTo + "&Shipper=" + ShipperCheck + "&Consignee=" + ConsigneeCheck + "&Commodity=" + CommodityCheck + "&ContainerType=" + ContainerTypeCheck
        }else{
             previewUrlLink=globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink + "/preview?StartDate=" + StartDate + "&EndDate=" + EndDate + "&Port=" + Port + "&Import=" + Import + "&Tues=" + Tues + "&BillTo=" + BillTo + "&Commodity=" + CommodityCheck+"&Condition="+TopCondition
        }
       

        axios({
            url: previewUrlLink,
            method: "GET",
            responseType: 'arraybuffer',
            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token
            }
        }).then((response) => {
            window.$("#PreviewPdfModal").modal("toggle");
            var file = new Blob([response.data], { type: 'application/pdf' });
            let url = window.URL.createObjectURL(file);
            //  window.open(url);
            $('#pdfFrame').attr('src', url);
        });

        //   }else{
        //     alert("You are not allowed to preview PDF, Please check your User Permission.")
        //   }

    }

    useEffect(() => {

        var today = new Date();
        var yyyy = today.getFullYear();


        setValue("DynamicModel[StartDate]", "")
        setValue("DynamicModel[EndDate]", "")
        setValue("DynamicModel[Port]", "")
        setValue("DynamicModel[ImportExport]", "Both")
        setValue("DynamicModel[TuesRevenue]", "Both")
        setValue("DynamicModel[BillTo][]", "")


        setValue("DynamicModel[StartDate]", "1/1/" + yyyy)
        setValue("DynamicModel[EndDate]", "31/12/" + yyyy)
        $("#ConsigneeCheckbox").prop("checked",false)
        $("#ShipperCheckbox").prop("checked",false)
        $("#CommodityCheckbox").prop("checked",false)
        $("#ContainerTypeCheckbox").prop("checked",false)

        // $(".StartDate").val("1/1/"+yyyy)

        // $(".EndDate").val("31/12/"+yyyy)

        GetAllDropDown(['Area', 'User', "Vessel", "ContainerType"], globalContext).then(res => {

            var arrayPort = []
            var arrayVessel = []
            var arrayContainerType = []
            $.each(res.Area, function (key, value) {
                arrayPort.push({ value: value.AreaUUID, label: value.PortCode })
            })
            $.each(res.Vessel, function (key, value) {
                arrayVessel.push({ value: value.VesselUUID, label: value.VesselCode })
            })
            $.each(res.ContainerType, function (key, value) {
                arrayContainerType.push({ value: value.ContainerTypeUUID, label: value.ContainerType })
            })


            setPort(sortArray(arrayPort))
            setVessel(sortArray(arrayVessel))
            setContainerType(sortArray(arrayContainerType))


        })

        GetUser(globalContext.authInfo.id, globalContext).then(res => {
            setValue("DynamicModel[Port]", res[0].Branch.PortCode)
        })

        return () => {

        }
    }, [props.data.model])


    const { register, handleSubmit, setValue, trigger, getValues, unregister, clearErrors, reset, control, watch, formState: { errors } } = useForm({

    });

    function LiftingSeries() {
        return (
            <div className="row">
                    <div className={`col-xs-12 ${props.data.modelLink !== "customer-lifting-summary" ? "col-md-2" : "col-md-1"}`}>

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
                                        }}
                                        className="form-control StartDate"
                                        options={{
                                            dateFormat: "d/m/Y"
                                        }}

                                    />
                                </>
                            )}
                        />
                    </div>

                </div>

                <div className={`col-xs-12 ${props.data.modelLink !== "customer-lifting-summary" ? "col-md-2" : "col-md-1"}`}>

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
                        <label className="control-label">Port
                        </label>
                        <Controller
                            name="DynamicModel[Port]"
                            id="Port"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Port]")}
                                    value={value ? port.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={port}
                                    className="form-control Port"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>

                <div className="col-xs-12 col-md-2">

                    <div className="form-group">
                        <label className="control-label">Import/Export
                        </label>
                        <Controller
                            name="DynamicModel[ImportExport]"
                            id="ImportExport"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[ImportExport]")}
                                    value={value ? ImportExport.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={ImportExport}
                                    className="form-control ImportExport"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>

                <div className="col-xs-12 col-md-2">

                    <div className="form-group">
                        <label className="control-label">Tues/Revenue
                        </label>
                        <Controller
                            name="DynamicModel[TuesRevenue]"
                            id="TuesRevenue"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[TuesRevenue]")}
                                    value={value ? TuesRevenue.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={TuesRevenue}
                                    className="form-control TuesRevenue"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>
                <div className="col-xs-12 col-md-2">

                    <div className="form-group">
                        <label className="control-label">Bill To
                        </label>
                        <Controller
                            name="DynamicModel[BillTo][]"
                            id="BillTo"
                            control={control}

                            render={({ field: { onChange, value } }) => (

                                <AsyncSelect
                                    isClearable={true}
                                    isMulti
                                    value={value}
                                    {...register("DynamicModel[BillTo][]")}
                                    cacheOptions
                                    placeholder={globalContext.asyncSelectPlaceHolder}
                                    onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
                                    getOptionLabel={e => e.CompanyName}
                                    getOptionValue={e => e.CompanyUUID}
                                    loadOptions={loadOptionsCompany}
                                    menuPortalTarget={document.body}
                                    className="form-control"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />

                    </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "customer-lifting-summary" ? "d-none" : ""}`}>

                    <div className="form-group">
                        <label className="control-label">Condition
                        </label>
                        <Controller
                            name="DynamicModel[Condition]"
                            id="Condition"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Select
                                    isClearable={true}
                                    {...register("DynamicModel[Condition]")}
                                    value={value ? Condition.find(c => c.value === value) : null}
                                    onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                    options={Condition}
                                    className="form-control Condition"
                                    classNamePrefix="select"
                                    styles={globalContext.customStyles}

                                />
                            )}
                        />
                    </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "customer-lifting-summary" ? "" : "d-none"}`}>

                    <div className="form-group">
                        <input type="checkbox" className="ShipperCheckbox" id="ShipperCheckbox" />
                        <label className="control-label ml-2" htmlFor='ShipperCheckbox'>Shipper</label>
                    </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "customer-lifting-summary" ? "" : "d-none"}`}>

                    <div className="form-group">
                        <input type="checkbox" className="ConsigneeCheckbox" id="ConsigneeCheckbox" />
                        <label className="control-label ml-2" htmlFor='ConsigneeCheckbox'>Consignee</label>
                    </div>

                </div>

                <div className={`col-xs-12 col-md-2`}>

                    <div className="form-group">
                        <input type="checkbox" className="CommodityCheckbox" id="CommodityCheckbox" />
                        <label className="control-label ml-2" htmlFor='CommodityCheckbox'>Commodity</label>
                    </div>

                </div>

                <div className={`col-xs-12 col-md-2 ${props.data.modelLink !== "customer-lifting-summary" ? "" : "d-none"}`}>

                    <div className="form-group">
                        <input type="checkbox" className="ContainerTypeCheckbox" id="ContainerTypeCheckbox" />
                        <label className="control-label ml-2" htmlFor='ContainerTypeCheckbox'>Container Type</label>
                    </div>

                </div>

                <div className="col">
                    <button type="button" id="PreviewLifting" className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mt-4 float-right`} onClick={() => handlePreview()}>Preview</button>
                    <button type="button" id="PreviewLifting" className="btn btn-success mt-4 float-right mr-1" onClick={() => handleGenerate()}>Generate</button>


                </div>








            </div>
        )
    }



    return (

        <div className="card card-primary">

            <div className="card-body">
                <div className="card lvl1">
                    <div className="card-body">
                        {LiftingSeries()}




                    </div>
                </div>


            </div>
            <div className="card-body" >
                <div>
                    <table id="CustomerLiftingTable" className="table table-bordered commontable container-items d-none">

                    </table>
                </div>
            </div>

            <div className="modal fade" id="PreviewPdfModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <iframe id="pdfFrame" src="preview?id=" width="100%" height="700"></iframe>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>








    )
}






export default Form