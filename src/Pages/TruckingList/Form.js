import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, getCookie,initHoverSelectDropownTitle, GetUser, sortArray } from '../../Components/Helper.js'
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
    var arrayLatestColumn=[];
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [port, setPort] = useState([])
    const [voyage, setVoyage] = useState([])

    
    var modelLinkTemp;
   
    if (globalContext.userRule !== "") {
         modelLinkTemp=props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(modelLinkTemp);
        });
        
    }

    function columnSetup(columns) {
        var res = [

        ];
        if(columns){
            var NewColumn=columns.map(obj => ({ ...obj }));
            arrayLatestColumn=NewColumn
            //check for reorder column cookies
            if (getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`)) {
              var getCookieArray = getCookie(`${props.data.modelLink}-table.bs.table.reorderColumns`);
              getCookieArray = JSON.parse(getCookieArray);
        
              const newArray = Object.keys(getCookieArray).filter(key => key !=="state")
              .map(key => ({ field: key }));
        
              var tempNewArray=[]
                 window.$.each(newArray, function (key, value) {
                window.$.each(NewColumn, function (key2, value2) {
                    if(value.field==value2.field){
                      tempNewArray.push(value2)
                    }
        
                })
        
              })
              var Concatarray = tempNewArray.concat(NewColumn);
              const uniqueArray = Concatarray.filter((item, index, self) =>index === self.findIndex((t) => t.field === item.field));
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

    function BLFormatterDocNum(value, row, index) {
        if (row.BillOfLadingUUID == null) {
            return null;
        }
        else {
            var id = row.BillOfLadingUUID;
            return "<a href=../../container/bill-of-lading/update/id=" + id + " class = 'checkPermissionLinkBL' target='_blank'>" + row.BillOfLadingDocNum + "</a>"
        }
    }


    function handleGenerate() {



        var defaultHide = [ // default field to hide in bootstrap table
            "BillOfLadingPOLPortCodeName",
            "BillOfLadingPODPortCodeName"

        ];

        var columns = [ // data from controller (actionGetCompanyType) field and title to be included
            {
                field: 'DocNum',
                title: 'BL NO.',
                switchable: false,
                formatter: BLFormatterDocNum,
                filterControl: "input",
            },
            {
                field: 'ConsigneeDetail',
                title: 'CONSIGNEE',
                filterControl: "input",
            },
            {
                field: 'ContainerCodeName',
                title: 'CONTR NO.',
                filterControl: "input",
            },
            {
                field: 'ContainerType',
                title: 'SIZE/TYPE',
                filterControl: "input",
            },
            {
                field: 'OwnershipType',
                title: 'COC/SOC',
                filterControl: "input",
            },
            {
                field: 'SealNum',
                title: 'SEAL NO',
                filterControl: "input",
            },
            {
                field: 'StatusPTP',
                title: 'STATUS',
                filterControl: "input",
            },
            {
                field: 'BillOfLadingPOLPortCodeName',
                title: 'POL',
                filterControl: "input",
            },
            {
                field: 'BillOfLadingPODPortCodeName',
                title: 'POD',
                filterControl: "input",
            },
            {
                field: 'GoodsDescription',
                title: 'DESCRIPTION OF GOODS',
                filterControl: "input",
            },
            {
                field: 'GrossWeight',
                title: 'WEIGHT(KGS)',
                filterControl: "input",
            },
            {
                field: 'TRANSPORT',
                title: 'TRANSPORT',
                filterControl: "input",
            },
            {
                field: 'DischargedDateFormat',
                title: 'DISCH DATE',
                filterControl: "input",
            },
            {
                field: 'WHEREDISC',
                title: 'WHERE DISC',
                filterControl: "input",
            },
            {
                field: 'Mark',
                title: 'REMARKS',
                filterControl: "input",
            },
            {
                field: 'DetentionExpirtyDateFormat',
                title: 'Detention Expiry Date',
                filterControl: "input",
            },
            {
                field: 'DemurrageExpirtyDateFormat',
                title: 'Demurage Expiry Date',
                filterControl: "input",
            },

        ];

        var POL = getValues("DynamicModel[POLPortCode]")
        var POD = getValues("DynamicModel[PODPortCode]")
        var VoyageNo = getValues("DynamicModel[Voyage]")

        if (POL == "") {
            alert("POL Port Code cannot be blank.")
            return false;
        }
        else if (POD == "") {
            alert("POD Port Code cannot be blank.")
            return false;
        }
        else if (VoyageNo == "") {
            alert("Voyage No. cannot be blank.")
            return false;
        }
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
                url: globalContext.globalHost + globalContext.globalPathLink + "trucking-list/preview?POL=" + POL + "&POD=" + POD + "&Voyage=" + VoyageNo + "&Preview=0",
                data: {
                    param: param,
                    //     PolPortCode:$(".PolPortCode").val(),
                    //     PODPortCode:$(".PODPortCode").val(),
                    //     VoyageNum:$(".VoyageNum").val()
                },
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                dataType: "json",
                success: function (data) {
                    if (data == null) {
                        data = [];
                    }
                    $.each(data.rows, function (key, value) {

                        var consignee = "";
                        var containerType = [];
                        var containerCode = [];
                        var ownershipType = [];
                        var sealNum = [];
                        var goodsDescription = [];
                        var grossWeight = [];
                        var discDocDate = []
                        var remark = [];
                        var address1;
                        var address2;
                        var address3;
                        var podcode;
                        var branchcity;

                        // if (value.billOfLadingConsignee.DeliveryAddressLine1 == null) {
                        //     address1 = "";
                        // }
                        // else {
                        //     address1 = value.billOfLadingConsignee.DeliveryAddressLine1;
                        // }

                        // if (value.billOfLadingConsignee.DeliveryAddressLine2 == null) {
                        //     address2 = "";
                        // }
                        // else {
                        //     address2 = value.billOfLadingConsignee.DeliveryAddressLine2;
                        // }

                        // if (value.billOfLadingConsignee.DeliveryAddressLine3 == null) {
                        //     address3 = "";
                        // }
                        // else {
                        //     address3 = value.billOfLadingConsignee.DeliveryAddressLine3;
                        // }

                        // if (value.billOfLadingConsignee.DeliveryPostcode == null) {
                        //     podcode = "";
                        // }
                        // else {
                        //     podcode = value.billOfLadingConsignee.DeliveryPostcode;
                        // }

                        // if (value.billOfLadingConsignee.DeliveryCity == null) {
                        //     branchcity = "";
                        // }
                        // else {
                        //     branchcity = value.billOfLadingConsignee.DeliveryCity;
                        // }

                        // consignee = value.billOfLadingConsignee.CompanyName + "\n<br>" + address1 + "\n" + address2 + "\n" + address3 + " " + podcode + " " + branchcity;
                        // data["rows"][key]["ConsigneeDetail"] = consignee;
                        data["rows"][key]["StatusPTP"] = "PTP";
                    });

                    params.success({
                        "rows": data.rows,
                        "total": data.total
                    });
                }
            });
        };

        initTable({
            tableSelector: '#trucking-list-table', // #tableID
            toolbarSelector: '#toolbar', // #toolbarID
            columns: columns,
            hideColumns: defaultHide, // hide default column. If there is no cookie
            cookieID: 'trucking-list', // define cookie id 
            functionGrid: GetGridviewData,
        });

    }
    function initTable(args) {
        // var CheckExport = false;
        // var permissionUrl = "./get-permission"

        // $.ajax({
        //     type: "GET",
        //     url: permissionUrl,
        //     async: false,
        //     success: function (data) {
        //         $.each(data, function (key, value) {
        //             if (value.includes("export")) {
        //                 CheckExport = true;
        //             }
        //             ArrayPermission.push(value)
        //         })
        //     }
        // })
        // var tableHeight = $(".content-wrapper").height() - $(".content-header").height() - $(".card").height() - $(".page-buttons").height() - 50;
        var paramsTable = args;
        // var $table = $(args.tableSelector);
        // var $submit = $('#submit');      // for submit button on check box 

        // var $saveDeliveryAddress = $("#SaveAddress");

        //if table drag cookies exist,use it as columns
        // if ($table.length > 1) {
        //     if (!!$.cookie($table[0]["id"] + "-drag")) {

        //         var arrColumn = JSON.parse($.cookie($table[0]["id"] + "-drag"));
        //         var DragArr = [];

        //         $.each(arrColumn, function (key, value) {
        //             $.each(args.columns, function (key1, value1) {
        //                 if (value == value1.field) {
        //                     DragArr.push(value1);
        //                     return;
        //                 }
        //             })
        //         })

        //         args.columns = DragArr;
        //     }
        // }
        window.$(`#${props.data.modelLink}-table`).on('click-cell.bs.table', function (field, value, row, $element) {
            if (value == "ConsigneeDetail") {
                window.$("#EditDeliveryAddress").modal("toggle");
                console.log($element)
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
            resizable: true,
            reorderableColumns: true,
            exportTypes: ['excel', 'xlsx'],
            filterControl: true,
            clickToSelect: true,
            cookie: "true",
            cookieExpire: '10y',
            cookieIdTable: args.cookieID,
            onLoadSuccess: function () {
                // $table.bootstrapTable('filterBy', args.filterSelector); // default show valid data only
                var exportAcess=filteredAp.find((item) => item == `export-${modelLinkTemp}`) !== undefined
                if(!exportAcess){
                 window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",true)
                }else{
                 window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled",false)
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

        window.$("#SaveAddress").click(function () {
            var id = $("#BillOfLadingUUID").val();
            var DeliveryAdd1 = $(".deliveryAddress1").val();
            var DeliveryAdd2 = $(".deliveryAddress2").val();
            var DeliveryAdd3 = $(".deliveryAddress3").val();
            var DeliveryPostCode = $(".postcode").val();
            var DeliveryCity = $(".city").val();
            var DeliveryCountry = $(".country").val();


            $.ajax({
                type: "POST",
                dataType: "json",
                data: {
                    DeliveryAddressLine1: DeliveryAdd1,
                    DeliveryAddressLine2: DeliveryAdd2,
                    DeliveryAddressLine3: DeliveryAdd3,
                    DeliveryPostcode: DeliveryPostCode,
                    DeliveryCity: DeliveryCity,
                    DeliveryCountry: DeliveryCountry,

                },
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                url: globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink+"/save-data?id=" + id,
                success: function (data) {
                }
            })
            window.$('#EditDeliveryAddress').modal("toggle");
            window.$(`#${props.data.modelLink}-table`).bootstrapTable('refreshOptions', {
                toolbar: args.toolbarSelector,
                minimumCountColumns: 0,
                pagination: true,
                pageList: [10, 25, 50, 100, 'all'],
                idField: 'id',
                ajax: args.functionGrid,
                columns: columnSetup(args.columns),
                sidePagination: 'server',
                showRefresh: true,
                showColumns: true,
                showColumnsToggleAll: true,
                showExport: true,
                searchOnEnterKey: true,
                clickToSelect: true,
                reorderableColumns: true,
                exportTypes: ['excel', 'xlsx'],
                filterControl: false,
                cookie: "true",
                cookieExpire: '10y',
                cookieIdTable: args.cookieID,
            })
        })

        // var initialColumn = args.columns;
        // $table.on('reorder-column.bs.table', function (e, args) {
        //     //  console.log( $table[0]["id"]) ;
        //     var DragArr = [];
        //     var args1 = JSON.stringify(args);
        //     var cookiesName = $table[0]["id"] + "-drag";
        //     $.cookie(cookiesName, args1)

        //     $.each(args, function (key, value) {
        //         $.each(initialColumn, function (key1, value1) {
        //             if (value == value1.field) {
        //                 DragArr.push(value1);
        //                 return;
        //             }
        //         })
        //     })
        //     columns = DragArr;

        //     var tempArray = [];
        //     $.each(columns, function (key2, value2) {
        //         if (value2.hasOwnProperty('switchable')) {
        //             tempArray.push(key2);
        //         }
        //     })
        //     //remove switchable field from column array    
        //     $.each(tempArray, function (key3, value3) {
        //         columns.splice(value3, 1)
        //     })

        //     var columnCheckedStat = $table.bootstrapTable("getCookies")['columns'];

        //     $(".fixed-table-toolbar").find(".dropdown-menu").first().children().find("input:checkbox").not(":eq(0)").each(function (key3) {

        //         var value = $(this)[0];
        //         $(value).prop("checked", false);


        //         $.each(columns, function (key4, value4) {
        //             if (key3 == key4) {

        //                 $(value).attr("data-field", value4.field);


        //                 $(value).next().html(value4.title)
        //             }
        //         })

        //         $.each(columnCheckedStat, function (key5, value5) {
        //             if ($(value).attr("data-field") == value5) {
        //                 $(value).prop("checked", true);
        //             }
        //         })

        //         $.each(args, function (key6, value6) {
        //             if (value6 == $(value).attr("data-field")) {
        //                 $(value).val(key6)
        //             }
        //         });


        //     });

        // });

        // if ($table.bootstrapTable("getCookies")['columns'] == null) {
        //     $.each(args.hideColumns, function (key, value) {
        //         $table.bootstrapTable('hideColumn', value);
        //     });
        // }



        // function getIdSelections() {
        //     return $.map($table.bootstrapTable('getSelections'), function (row) {
        //         return row.id
        //     })
        // }



        // $table.on('check.bs.table uncheck.bs.table ' +
        //     'check-all.bs.table uncheck-all.bs.table',
        //     function () {
        //         $submit.prop('disabled', !$table.bootstrapTable('getSelections').length)

        //         // save your data, here just save the current page
        //         selections = getIdSelections()
        //         // push or splice the selections if you want to save all data selections
        //     })
        // $table.on('all.bs.table', function (e, name, args) {
        //     // console.log(name, args)
        // })
        // $submit.click(function () {
        //     var ids = getIdSelections()
        //     alert('You click submit action, row: ' + JSON.stringify(ids))
        //     // $table.bootstrapTable('remove', {
        //     //   field: 'id',
        //     //   values: ids
        //     // })
        //     $submit.prop('disabled', true)
        // })

        // if (!CheckExport) {
        //     $(".export").find("button").prop("disabled", true)
        //     $(".export").find("button").next().remove()
        // }


    }

    function handlePreview() {


        // if(getPreviewPDFPermission == true){
            var POL=getValues("DynamicModel[POLPortCode]")
            var POD=getValues("DynamicModel[PODPortCode]")
            var VoyageNo=getValues("DynamicModel[Voyage]")
            if(POL==""){
                alert("POL Port Code cannot be blank.")
            }
            else if(POD==""){
                alert("POD Port Code cannot be blank.")
            }
            else if(VoyageNo==""){
                alert("Voyage No. cannot be blank.")
            }
            else{
                axios({
                    url:  globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink+"/preview?POL="+POL+"&POD="+POD+"&Voyage="+VoyageNo,
                    method: "GET",
                    responseType: 'arraybuffer',
                    auth: {
                        username: globalContext.authInfo.username,
                        password: globalContext.authInfo.access_token
                    }
                }).then((response) => {
                   
                    var file = new Blob([response.data], { type: 'application/pdf' });
                    let url = window.URL.createObjectURL(file);
        
                    $('#pdfFrame').attr('src', url);
                    window.$("#PreviewPdfModal").modal("toggle");
                });
            }
          
        // }else{
        //     alert("You are not allowed to preview PDF, Please check your User Permission.")
        // }

        // if(getPreviewPDFPermission == true){
 
        // httpGet(globalContext.globalHost + globalContext.globalPathLink +props.data.modelLink+"/preview?StartDate="+StartDate+"&EndDate="+EndDate+"&PortCode="+PortCode+"&PortType="+PortType+"&Type="+Type)

    

    
        //   }else{
        //     alert("You are not allowed to preview PDF, Please check your User Permission.")
        //   }

    }

    useEffect(() => {


        GetAllDropDown(['Area', 'Voyage',], globalContext).then(res => {

            var arrayPort = []
            var arrayVoyage = []
            $.each(res.Area, function (key, value) {
                arrayPort.push({ value: value.AreaUUID, label: value.PortCode })
            })
            $.each(res.Voyage, function (key, value) {
                arrayVoyage.push({ value: value.VoyageUUID, label: `${value.VoyageNumber}(${value.vessel.VesselCode})` })
            })

            setPort(sortArray(arrayPort))
            setVoyage(sortArray(arrayVoyage))



        })

        // GetUser(globalContext.authInfo.id, globalContext).then(res => {
        //     setValue("DynamicModel[Port]", res[0].Branch.PortCode)
        // })

        return () => {

        }
    }, [props.data.model])


    const { register, handleSubmit, setValue, trigger, getValues, unregister, clearErrors, reset, control, watch, formState: { errors } } = useForm({

    });

    return (

        <div className="card card-primary">

            <div className="card-body">
                <div className="card lvl1">
                    <div className="card-body">
                        <div className="row">

                            <div className="col-xs-12 col-md-3">

                                <div className="form-group">
                                    <label className="control-label">POL Port Code
                                    </label>
                                    <Controller
                                        name="DynamicModel[POLPortCode]"
                                        id="POLPortCode"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[POLPortCode]")}
                                                value={value ? port.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={port}
                                                className="basic-select POLPortCode"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>

                            </div>

                            <div className="col-xs-12 col-md-3">

                                <div className="form-group">
                                    <label className="control-label">POD Port Code
                                    </label>
                                    <Controller
                                        name="DynamicModel[PODPortCode]"
                                        id="PODPortCode"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[PODPortCode]")}
                                                value={value ? port.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={port}
                                                className="basic-select PODPortCode"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>

                            </div>


                            <div className="col-xs-12 col-md-3">

                                <div className="form-group">
                                    <label className="control-label">Voyage No.
                                    </label>
                                    <Controller
                                        name="DynamicModel[Voyage]"
                                        id="Voyage"
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Select
                                                isClearable={true}
                                                {...register("DynamicModel[Voyage]")}
                                                value={value ? voyage.find(c => c.value === value) : null}
                                                onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                options={voyage}
                                                className="basic-select Voyage"
                                                classNamePrefix="select"
                                                styles={globalContext.customStyles}

                                            />
                                        )}
                                    />
                                </div>

                            </div>

                            <div className="col-xs-12 col-md-3">
                         
                                <button  className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success mt-4 float-left ml-4`} type="button" id="PreviewTruckingList" onClick={handlePreview}>Preview</button>

                                <button className="btn btn-success mt-4 float-left ml-2" type="button" id="GenerateTruckingList" onClick={handleGenerate}>Generate</button>
                            </div>




                        </div>




                    </div>
                </div>

                <div className="indexTableCard" >
                    <div id="toolbar">
                    </div>
                    <table id="trucking-list-table" data-click-to-select="true" className="bootstrap_table">

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

            <div className="modal fade" id="EditDeliveryAddress" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Delivery Address</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">

                            <div className="form-group">
                                <input type="text" className="d-none" id="BillOfLadingUUID"></input>
                                <label className="control-label">Delivery Address 1 :</label>
                                <input type="text" className="form-control deliveryAddress1" name="DeliveryAddressLine1"></input>
                            </div>

                            <div className=" form-group">
                                <label>Delivery Address 2 :</label>
                                <input type="text" className="form-control deliveryAddress2" name="DeliveryAddressLine2"></input>
                            </div>


                            <div className=" form-group">
                                <label>Delivery Address 3 :</label>
                                <input type="text" className="form-control deliveryAddress3" name="DeliveryAddressLine3"></input>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className=" form-group">
                                        <label>Postcode :</label>
                                        <input type="text" className="form-control postcode" name="DeliveryPostcode"></input>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className=" form-group">
                                        <label>City :</label>
                                        <input type="text" className="form-control city" name="DeliveryCity"></input>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className=" form-group">
                                        <label>Country :</label>
                                        <input type="text" className="form-control country" name="DeliveryCountry"></input>
                                    </div>
                                </div>

                            </div>


                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary mb-1" id="SaveAddress">Save</button>
                        </div>


                    </div>
                </div>

            </div>





        </div>








    )
}






export default Form