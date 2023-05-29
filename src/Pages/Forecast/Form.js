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
    const [voyage, setVoyage] = useState([])
    var modelLinkTemp;


    if (globalContext.userRule !== "") {
        modelLinkTemp = props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
            return item.includes(modelLinkTemp);
        });

    }
    const LoadingType=[{label:"Not Loading",value:"NotLoading"},{label:"Loading",value:"Loading"}]

    function columnSetup(columns) {
        var res = [

        ];
        if (columns) {
            var NewColumn = columns.map(obj => ({ ...obj }));
            arrayLatestColumn = NewColumn
            //check for reorder column cookies
            if (getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`)) {
                var getCookieArray = getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`);
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

    const loadOptionsCompany = (inputValue) => {
        // company/get-company-by-company-name?search=shin&type=public&companyType=Depot&q=shin
        const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {

            auth: {
                username: globalContext.authInfo.username,
                password: globalContext.authInfo.access_token,
            },
        }).then(res => res.data.data)

        return response



    }


    function handleGenerate() {
    
        var LoadingPort = getValues("DynamicModel[Port]")?getValues("DynamicModel[Port]"):""
        var FromDate = getValues("DynamicModel[FromDate]")? getValues("DynamicModel[FromDate]"):""
        var ToDate = getValues("DynamicModel[ToDate]")?getValues("DynamicModel[ToDate]"):""
        var BoxOp = $("input[name='DynamicModel[BoxOperator]']").val();
        var LoadType=getValues("DynamicModel[LoadingType]")?getValues("DynamicModel[LoadingType]"):""
        if (LoadingPort == "" &&  FromDate=="" &&  ToDate=="" &&  BoxOp=="" &&  LoadType=="") {
            alert("At least one field must be set")
            return false;
        }

        $.ajax({
            type: "POST",
            url: globalContext.globalHost + globalContext.globalPathLink + "forecast/generate-report?LoadingPort=" + LoadingPort + "&FromDate=" + FromDate + "&ToDate=" + ToDate+ "&BoxOperator="+BoxOp+"&Status="+LoadType,
            // url: globalContext.globalHost + globalContext.globalPathLink + "quotation/get-index-quotation",
            headers: {
                "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
            },
            sort:false,
            dataType: "json",
            success: function (data) {
                var column=[]
                var defaultHide = [ // default field to hide in bootstrap table
            
                ];
                var keyTitle;
                $.each(data.rows[0],function(key,value){
                    if(key.includes("\'")){
                        keyTitle=key.replace("\\", "")
                    }
                    else if(key=="LE"){
                         keyTitle="L/E"
                    }
                    else if(key=="CS"){
                         keyTitle="C/S"
                    }
                    else if(key=="PODETAFormat"){
                         keyTitle="ETA"
                    }else if(key=="TotalUnit" || key=="TotalUnit" ||key=="TotalWeight" ||key=="TotalTues" ||key=="BalanceWeight" || key=="BalanceTues" ){
                        keyTitle = key.replace(/([a-z])([A-Z])/g, '$1 $2');
                    }
                    else{
                             keyTitle=key         
                    }

                    if(key!=="ETA"){
                        column.push({field:key,title:keyTitle, filterControl: "input"})
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
                        url: globalContext.globalHost + globalContext.globalPathLink + "forecast/generate-report?LoadingPort=" + LoadingPort + "&FromDate=" + FromDate + "&ToDate=" + ToDate+ "&BoxOperator="+BoxOp+"&Status="+LoadType,
                        data: {
                            param: param,
                            //     PolPortCode:$(".PolPortCode").val(),
                            //     PODPortCode:$(".PODPortCode").val(),
                            //     VoyageNum:$(".VoyageNum").val()
                        },
                        sort:false,
                        headers: {
                            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data == null) {
                                data = [];
                            }
                            params.success({
                                "rows": data.rows,
                                "total": data.total
                            });
                        }
                    });
                };
                initTable({
                    tableSelector: '#forecast-table', // #tableID
                    toolbarSelector: '#toolbar', // #toolbarID
                    columns:column,
                    hideColumns: defaultHide, // hide default column. If there is no cookie
                    cookieID: 'forecast', // define cookie id 
                    functionGrid: GetGridviewData,
                });
              

            }
        })

     
       

    }
    function initTable(args) {
        window.$(`#${props.data.modelLink}-table`).on('click-cell.bs.table', function (field, value, row, $element) {
            if (value == "ConsigneeDetail") {
                window.$("#EditDeliveryAddress").modal("toggle");
                $("#BillOfLadingUUID").val($element.BillOfLadingUUID)
                $(".deliveryAddress1").val($element.BillOfLadingConsigneeDeliveryAddressLine1)
                $(".deliveryAddress2").val($element.BillOfLadingConsigneeDeliveryAddressLine2)
                $(".deliveryAddress3").val($element.BillOfLadingConsigneeDeliveryAddressLine3)
                $(".postcode").val($element.BillOfLadingConsigneeDeliveryPostcode)
                $(".city").val($element.BillOfLadingConsigneeDeliveryCity)
                $(".country").val($element.BillOfLadingConsigneeDeliveryCountry)
            }
        })


        window.$(`#${props.data.modelLink}-table`).bootstrapTable('destroy').bootstrapTable({

            // height: '630',
            toolbar: args.toolbarSelector,
            minimumCountColumns: 0,
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
            // resizable: true,
            // reorderableColumns: true,
            exportTypes: ['excel', 'xlsx'],
            filterControl: true,
            clickToSelect: true,
            cookie: "true",
            cookieExpire: '10y',
            cookieIdTable: args.cookieID,
            onLoadSuccess: function () {
                // $table.bootstrapTable('filterBy', args.filterSelector); // default show valid data only
                var exportAcess = filteredAp.find((item) => item == `export-${modelLinkTemp}`) !== undefined
                if (!exportAcess) {
                    window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled", true)
                } else {
                    window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled", false)
                }

                if (window.$(`#${props.data.modelLink}-table`).bootstrapTable("getCookies")['columns'] == null) {
                    $.each(args.hideColumns, function (key, value) {
                        window.$(`#${props.data.modelLink}-table`).bootstrapTable('hideColumn', value);
                    });
                }

                // if ($.inArray("view-bill-of-lading", UserPermissions) >= 0) {
                //     getBLViewPermission = true;
                // }

                // if (getBLViewPermission == false) {
                //     $.each($(".checkPermissionLinkBL"), function () {
                //         var oldherf = $(this).attr("href");
                //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

                //         $(this).attr("href", newUrl);
                //         $(this).attr("class", "NoPermissionLink");
                //         $(this).removeAttr("target");
                //     })
                // }

            }


        });

        window.$(`#${props.data.modelLink}-table`).on('reorder-column.bs.table', function (e, args) {
            var newLatestColumn = []
            if (getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`)) {

                var getCookieArray = getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`);
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

        window.$(`#${props.data.modelLink}-table`).on('page-change.bs.table', function () {
            $('.fixed-table-body').css('overflow-y', 'hidden');
        })

        window.$(`#${props.data.modelLink}-table`).on('click-row.bs.table', function (e, row, $element) {
            $('.active').removeClass('active');
            $($element).addClass('active');
        })

    }

    function handlePreview() {

        if(filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ){
            var LoadingPort = getValues("DynamicModel[Port]")?getValues("DynamicModel[Port]"):""
            var FromDate = getValues("DynamicModel[FromDate]")? getValues("DynamicModel[FromDate]"):""
            var ToDate = getValues("DynamicModel[ToDate]")?getValues("DynamicModel[ToDate]"):""
            var BoxOp = $("input[name='DynamicModel[BoxOperator]']").val();
            var LoadType=getValues("DynamicModel[LoadingType]")?getValues("DynamicModel[LoadingType]"):""
            if (LoadingPort == "" &&  FromDate=="" &&  ToDate=="" &&  BoxOp=="" &&  LoadType=="") {
                alert("At least one field must be set")
                return false;
            }
            
            else {
                axios({
                   url: globalContext.globalHost + globalContext.globalPathLink + "forecast/preview?LoadingPort=" + LoadingPort + "&FromDate=" + FromDate + "&ToDate=" + ToDate+ "&BoxOperator="+BoxOp+"&Status="+LoadType,
                    method: "GET",
                    responseType: 'arraybuffer',
                    auth: {
                        username: globalContext.authInfo.username,
                        password: globalContext.authInfo.access_token
                    }
                }).then((response) => {
                    var file = new Blob([response.data], { type: 'application/pdf' });
                    let url = window.URL.createObjectURL(file);
                    $('#pdfFrameList').attr('src', url);
                    window.$("#PreviewPdfListModal").modal("toggle");
                });
            }
        }else{
            alert("You are not allowed to preview, Please check your Permission.")
        }
    

    }

    useEffect(() => {


        GetAllDropDown(['Area'], globalContext).then(res => {

            var arrayPort = []
            var arrayVoyage = []
            $.each(res.Area, function (key, value) {
                arrayPort.push({ value: value.AreaUUID, label: value.PortCode })
            })
            $.each(res.Voyage, function (key, value) {
                arrayVoyage.push({ value: value.VoyageUUID, label: `${value.VoyageNumber}(${value.vessel.VesselCode})` })
            })

            setPort(sortArray(arrayPort))


        })

        // GetUser(globalContext.authInfo.id, globalContext).then(res => {
        //     setValue("DynamicModel[Port]", res[0].Branch.PortCode)
        // })

        return () => {

        }
    }, [props.data.model])

    initHoverSelectDropownTitle()


    const { register, handleSubmit, setValue, trigger, getValues, unregister, clearErrors, reset, control, watch, formState: { errors } } = useForm({

    });

    return (

        <div className="card card-primary">
            <div className="card-body">

                <div className="card lvl1">
                    <div className="row">
                    </div>
                    <table className="mt-2 mb-2">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}></th>
                                <th style={{ width: "12%" }}></th>
                                <th style={{ width: "8%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "8%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "8%" }}></th>
                                <th style={{ width: "15%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "15%" }}></th>
                            </tr>

                        </thead>

                        <tbody>
                            <tr>

                                <td>
                                    <div className="col mb-2">
                                        <label> LOADING PORT:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">

                                            <Controller
                                                name={"DynamicModel[Port]"}

                                                control={control}

                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        isClearable={true}
                                                        {...register("DynamicModel[Port]")}
                                                        value={value ? port.find(c => c.value === value) : null}
                                                        onChange={val => { val == null ? onChange(null) : onChange(val.value); }}
                                                        options={port}
                                                        menuPortalTarget={document.body}
                                                        className="basic-single LoadingPort"
                                                        classNamePrefix="select"
                                                        styles={globalContext.customStyles}

                                                    />
                                                )}
                                            />

                                        </div>

                                    </div>
                                </td>
                                <td>
                                    <div className="col mb-2">
                                        <label> From Date:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2 ">
                                        <div className="form-group">

                                            <Controller
                                                name="DynamicModel[FromDate]"
                                                control={control}
                                                id="FromDate"
                                                render={({ field: { onChange, value } }) => (
                                                    <>
                                                        <Flatpickr
                                                            value={value}
                                                            {...register('DynamicModel[FromDate]')}

                                                            onChange={val => {

                                                                onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                            }}
                                                            className="form-control FromDate"
                                                            options={{
                                                                dateFormat: "d/m/Y"
                                                            }}

                                                        />
                                                    </>
                                                )}
                                            />
                                        </div>

                                    </div>
                                </td>
                                <td>
                                    <div className="col mb-2">
                                        <label> To Date:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">
                                            <Controller
                                                name="DynamicModel[ToDate]"
                                                control={control}
                                                id="ToDate"
                                                render={({ field: { onChange, value } }) => (
                                                    <>
                                                        <Flatpickr
                                                            value={value}
                                                            {...register('DynamicModel[ToDate]')}

                                                            onChange={val => {

                                                                onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                            }}
                                                            className="form-control ToDate"
                                                            options={{
                                                                dateFormat: "d/m/Y"
                                                            }}

                                                        />
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className="col mb-2">
                                        <label>Box Operator:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">
                                        <Controller
                                        name="DynamicModel[BoxOperator]"
                                        id="BoxOperator"
                                        control={control}

                                        render={({ field: { onChange, value } }) => (

                                            <AsyncSelect
                                                isClearable={true}
                                                {...register("DynamicModel[BoxOperator]")}
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
                                </td>

                                <td>
                                    <div className="col mb-2">
                                        <label>Not Loading/Loading:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">
                                        <Controller
                                                name={"DynamicModel[LoadingType]"}

                                                control={control}

                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        isClearable={true}
                                                        {...register("DynamicModel[LoadingType]")}
                                                        value={value ? LoadingType.find(c => c.value === value) : null}
                                                        onChange={val => { val == null ? onChange(null) : onChange(val.value); }}
                                                        options={LoadingType}
                                                        menuPortalTarget={document.body}
                                                        className="basic-single LoadingType"
                                                        classNamePrefix="select"
                                                        styles={globalContext.customStyles}

                                                    />
                                                )}
                                            />
                                        </div>

                                    </div>
                                </td>


                                <td>
                                    <div className="col">
                                        <button type="button" className="btn btn-success float-right" onClick={handleGenerate}>Generate</button>
                                     
                                    </div>
                                </td>
                                <td>
                                    <div className="col">
                                   
                                        <button type="button"  className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success float-right`} onClick={handlePreview}>Preview</button>
                                     
                                    </div>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>



                <div className="indexTableCard">
                    <table id={`${props.data.modelLink}-table`} className="bootstrap_table">

                    </table>
                </div>


            </div>

            <div className="modal fade" id="PreviewPdfListModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <iframe id="pdfFrameList" src="" width="100%" height="700"></iframe>

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