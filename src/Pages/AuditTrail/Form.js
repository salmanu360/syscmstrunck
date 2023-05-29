import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { ToastNotify, ControlOverlay, initHoverSelectDropownTitle, GetAllDropDown,getCookie, sortArray } from '../../Components/Helper.js'
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




function LoadingDischargingList(props) {
    var arrayLatestColumn=[];
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [voyage, setVoyage] = useState([])
    const [user, setUser] = useState([])
    var paramsTable = {};

    const [parentModule, setParentModule] = useState([
        { value: "Sales", label: "Sales" },
        { value: "Operation", label: "Operation" },
        { value: "Movement", label: "Movement" },
        { value: "Purchase", label: "Purchase" },
        { value: "Company", label: "Company" },
        { value: "Asset", label: "Asset" },
        { value: "Schedule", label: "Schedule" },
        { value: "Settings", label: "Settings" }
    ])

    const oriModule = [
        { value: "Quotation", label: "Quotation" },
        { value: "BookingReservation", label: "Booking" },
        { value: "SalesInvoice", label: "Invoice" },
        { value: "SalesCreditNote", label: "Credit Note" },
        { value: "SalesDebitNote", label: "Debit Note" },
        { value: "CustomerPayment", label: "Receipt" },
        { value: "ContainerReleaseOrder", label: "Container Release Order" },
        { value: "BillOfLading", label: "Bill Of Lading" },
        { value: "DeliveryOrder", label: "Delivery Order" },
        { value: "ContainerRelease", label: "Release" },
        { value: "ContainerVerifyGrossMass", label: "Verified Gross Mass" },
        { value: "ContainerGateIn", label: "Gate In" },
        { value: "ContainerLoaded", label: "Loading" },
        { value: "ContainerDischarged", label: "Discharging" },
        { value: "ContainerGateOut", label: "Gate Out" },
        { value: "ContainerReceive", label: "Empty Return" },
        { value: "PurchaseOrder", label: "Purchase Order" },
        { value: "Company", label: "Company" },
        { value: "PortDetails", label: "Terminal" },
        { value: "Container", label: "Container" },
        { value: "Vessel", label: "Vessel" },
        { value: "Route", label: "Route" },
        { value: "Voyage", label: "Voyage" },
        { value: "Area", label: "Port" },
        { value: "CurrencyType", label: "Currency Type" },
        { value: "CurrencyRate", label: "Currency Rate" },
        { value: "FreightTerm", label: "Freight Term" },
        { value: "TaxCode", label: "Tax Code" },
        { value: "CreditTerm", label: "Credit Term" },
        { value: "BusinessNature", label: "Business Nature" },
        { value: "CustomerType", label: "Customer Type" },
        { value: "SupplierType", label: "Supplier Type" },
        { value: "CompanyType", label: "Company Type" },
        { value: "ContainerType", label: "Container Type" },
        { value: "CargoType", label: "Cargo Type" },
        { value: "VesselType", label: "Vessel Type" },
        { value: "UNNumber", label: "UN Number" },
        { value: "HSCode", label: "HS Code" },
        { value: "ChargesType", label: "Charges Type" },
        { value: "Charges", label: "Charges" },
        { value: "Tariff", label: "Tariff" },
        { value: "ReceivableMethod", label: "Receivable Method" },
        { value: "user", label: "User" }
    ]

    function checkIfValidUUID(str) {
        // Regular expression to check if string is a valid UUID
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

        return regexExp.test(str);
    }

    function dateTimeSort(a, b) {
        var momentA = moment(a, "DD/MM/YYYY HH:mm:ss");
        var momentB = moment(b, "DD/MM/YYYY HH:mm:ss");
    
    
        if (momentA.isValid() && momentB.isValid()) {
            if (momentA > momentB) return 1;
            else if (momentA < momentB) return -1;
            else return 0;
        } else {
            return 1;
        }
    
    }
    

    function operateFormatter(value, row, index) {
        var actionButtons = "";
        $.each(paramsTable.actions, function (key, values) {
            if (values['type'] == "Preview") {
               var ModuleTrim=(row.module).trim().replace(/\s/g, '');
               
                if (ModuleTrim == "ContainerRelease" || ModuleTrim == "ContainerGateIn" || ModuleTrim == "ContainerLoaded" || ModuleTrim == "ContainerDischarged" || ModuleTrim == "ContainerGateOut" || ModuleTrim == "ContainerReceive") {
                    actionButtons += '<a href="javascript:void(0)"  class="PreviewAuditTrail"><i class="' + values['icon'] + '" style="color:grey;"></i></a> ';
                    //   actionButtons += '<button type="buttton" class="btn btn-xs btn-primary" ><i class="'+values['icon']+'"></i></button> ';
                }
                else {
                    actionButtons += '<a href="javascript:void(0)"  class="PreviewAuditTrail"><i class="' + values['icon'] + '"></i></a> ';
                    //   actionButtons += '<button type="buttton" class="btn btn-xs btn-primary" ><i class="'+values['icon']+'"></i></button> ';
                }
    
    
            }
        });
        return [actionButtons].join('')
    }

    const [module, setModule] = useState(oriModule)

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
    
        res.push({
            field: 'operate',
            title: 'Details',
            align: 'center',
            switchable: false,
            clickToSelect: false,
            formatter: operateFormatter
        })
    
    
        return res;
    }

    function handleChangeParentModule(val) {
        if (val) {
            setValue("DynamicModel[Module]","")
            if (val.value == "Sales") {

                setModule([{ value: "Quotation", label: "Quotation" },
                { value: "BookingReservation", label: "Booking" },
                { value: "SalesInvoice", label: "Invoice" },
                { value: "SalesCreditNote", label: "Credit Note" },
                { value: "SalesDebitNote", label: "Debit Note" },
                { value: "CustomerPayment", label: "Receipt" }])

            } else if (val.value == "Operation") {
                setModule([{ value: "ContainerReleaseOrder", label: "Container Release Order" },
                { value: "BillOfLading", label: "Bill Of Lading" },
                { value: "DeliveryOrder", label: "Delivery Order" }])

            } else if (val.value == "Movement") {

                setModule([{ value: "ContainerRelease", label: "Release" },
                { value: "ContainerVerifyGrossMass", label: "Verified Gross Mass" },
                { value: "ContainerGateIn", label: "Gate In" },
                { value: "ContainerLoaded", label: "Loading" },
                { value: "ContainerDischarged", label: "Discharging" },
                { value: "ContainerGateOut", label: "Gate Out" },
                { value: "ContainerReceive", label: "Empty Return" }])


            } else if (val.value == "Purchase") {
                setModule([{ value: "PurchaseOrder", label: "Purchase Order" }])

            } else if (val.value == "Company") {
                setModule([{ value: "Company", label: "Company" },
                { value: "PortDetails", label: "Terminal" }
                ])

            } else if (val.value == "Asset") {

                setModule([{ value: "Container", label: "Container" },
                { value: "Vessel", label: "Vessel" }])

            } else if (val.value == "Schedule") {
                setModule([{ value: "Route", label: "Route" },
                { value: "Voyage", label: "Voyage" }])

            } else if (val.value == "Settings") {
                setModule([{ value: "Area", label: "Port" },
                { value: "CurrencyType", label: "Currency Type" },
                { value: "CurrencyRate", label: "Currency Rate" },
                { value: "FreightTerm", label: "Freight Term" },
                { value: "TaxCode", label: "Tax Code" },
                { value: "CreditTerm", label: "Credit Term" },
                { value: "BusinessNature", label: "Business Nature" },
                { value: "CustomerType", label: "Customer Type" },
                { value: "SupplierType", label: "Supplier Type" },
                { value: "CompanyType", label: "Company Type" },
                { value: "ContainerType", label: "Container Type" },
                { value: "CargoType", label: "Cargo Type" },
                { value: "VesselType", label: "Vessel Type" },
                { value: "UNNumber", label: "UN Number" },
                { value: "HSCode", label: "HS Code" },
                { value: "ChargesType", label: "Charges Type" },
                { value: "Charges", label: "Charges" },
                { value: "Tariff", label: "Tariff" },
                { value: "ReceivableMethod", label: "Receivable Method" },
                { value: "user", label: "User" }])

            } else {
                setModule(oriModule)
            }
        }
    }
    function handleGenerate() {
        var Create = $('#Create').is(":checked");
        var Update = $('#Update').is(":checked");
        var Remove = $('#Remove').is(":checked");
        var Trash = $('#Trash').is(":checked");
        var Verify = $('#Verify').is(":checked");

        var DateTo = $('#DateTo').val();
        var DateFrom = $('#DateFrom').val();
        var User = $("input[name='DynamicModel[User]']").val()

        var ParentModule = $("input[name='DynamicModel[ParentModule]']").val()
        var Module = $("input[name='DynamicModel[Module]']").val();
        var Search = $('#Search').val();

        var orderBy = {
            "DocNum": "SORT_ASC",
        }

        

        var defaultHide = [ // default field to hide in bootstrap table

        ];
        var columns = [ // data from controller (actionGetCompanyType) field and title to be included
            {
                field: 'date_created_format',
                title: 'Date Time',
                sorter: dateTimeSort
            },
            {
                field: 'CreatedByUsername',
                title: 'User',

            },
            {
                field: 'action',
                title: 'Action',

            },
            {
                field: 'module',
                title: 'Module',

            },
            {
                field: 'Reference',
                title: 'Reference',

            },


        ];
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
                url: globalContext.globalHost + globalContext.globalPathLink + "audit-trail/get-audit-trails-latest",
                data: {
                    param: param,
                    User: User,
                    Create: Create,
                    Update: Update,
                    Remove: Remove,
                    Trash: Trash,
                    Verify: Verify,
                    DateTo: DateTo,
                    DateFrom: DateFrom,
                    Search: Search,
                    ParentModule: ParentModule,
                    Module: Module


                },
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
                    })
                }
            });
        }

        initTable({
            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar', // #toolbarID
            columns: columns,
            hideColumns: defaultHide, // hide default column. If there is no cookie
            actions: [ // action column for bootstrap table
                {
                    type: 'Preview',
                    url: '',
                    icon: 'fa fa-file-pdf'
                },
            ],
            cookieID: 'audit-trail', // define cookie id 
            functionGrid: GetGridviewData,
        });



    }


    function initTable(args) {

     
        paramsTable = args;

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
            exportTypes: ['excel', 'xlsx', 'pdf'],
            filterControl: true,
            click: true,
            cookie: "true",
            cookieExpire: '10y',
            cookieIdTable: args.cookieID,
            onLoadSuccess: function () {
                // $table.bootstrapTable('filterBy', args.filterSelector); // default show valid data only

                if (window.$(`#${props.data.modelLink}-table`).bootstrapTable("getCookies")['columns'] == null) {
                    $.each(args.hideColumns, function (key, value) {
                        window.$(`#${props.data.modelLink}-table`).bootstrapTable('hideColumn', value);
                    });
                }

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

        // window.$(`#${props.data.modelLink}-table`).unbind();
        window.$(`#${props.data.modelLink}-table`).off("click-cell.bs.table").on('click-cell.bs.table', function (field, value, row, $element) {
            if (value == 'operate') {
                var id = $element.id;
                var moduleDetail = $element.module;
                var module = $.trim($element.module).replace(/\s/g, '');
                if (module == "ContainerRelease" || module == "ContainerGateIn" || module == "ContainerLoaded" || module == "ContainerDischarged" || module == "ContainerGateOut" || module == "ContainerReceive") {
    
                    return false;
                }
                window.$("#PreviewAuditTrailModal").modal("toggle");
                window.$("#myTab").empty();
                window.$("#myTabContent").empty();
    
                 $.ajax({
                    type: "POST",
                    url: globalContext.globalHost + globalContext.globalPathLink+"audit-trail/get-audit-trail-detail?id=" + id + "&module=" + moduleDetail + "&action=" + $element.action,
                    dataType: "json",
                    headers: {
                        "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                    },
                    async: false,
                    success: function (data) {
                        var count = 1;
                        var IsUUID = false;
                        $.each(data, function (key1, value1) {
                            if (count == 1) {
    
                                $("#myTab").append('<li class="nav-item" role="presentation"><a class="nav-link active" id="' + key1 + '-tab" data-toggle="tab" href="#' + key1 + '" role="tab" aria-controls="' + key1 + '" aria-selected="true">' + key1 + '</a></li>');
                                $("#myTabContent").append('<div class="tab-pane fade show active" id="' + key1 + '" role="tabpanel" aria-labelledby="' + key1 + '-tab"><table style="table-layout:fixed;width: 100%;" class="table table-bordered"><thead><tr><th>Field</th><th>Old Value</th><th>New Value</th></tr></thead><tbody id="' + key1 + 'Body"></tbody></table></div>');
                            }
                            else {
    
                                $("#myTab").append('<li class="nav-item" role="presentation"><a class="nav-link" id="' + key1 + '-tab" data-toggle="tab" href="#' + key1 + '" role="tab" aria-controls="' + key1 + '" aria-selected="true">' + key1 + '</a></li>');
                                $("#myTabContent").append('<div class="tab-pane fade" id="' + key1 + '" role="tabpanel" aria-labelledby="' + key1 + '-tab"><table style="table-layout:fixed;width: 100%;" class="table table-bordered"><thead><tr><th>Field</th><th>Old Value</th><th>New Value</th></tr></thead><tbody id="' + key1 + 'Body"></tbody></table></div>');
                            }
    
    
                            count++;
                            $.each(value1, function (key, value) {
                                if (value.length != undefined) {
    
                                    $("#" + key1 + "Body").append('<tr style="font-weight:bold;" class="lvl1"><td colspan="3">' + key1 + " " + (key + 1) + '</td></td>');
                                    $.each(value, function (key3, value3) {
    
                                        if (value3.field != undefined) {
    
                                            if (value3.new_value == null) {
                                                var newValue = "";
                                            }
                                            else {
                                                if (value3.new_value_reference !== undefined) {
                                                    var newValue = value3.new_value_reference;
                                                }
                                                else {
                                                    var newValue = value3.new_value;
                                                }
    
    
                                            }
    
                                            if (value3.old_value == null) {
                                                var oldValue = "";
                                            }
                                            else {
                                                if (value3.old_value_reference !== undefined) {
                                                    var oldValue = value3.old_value_reference;
                                                } else {
                                                    var oldValue = value3.old_value;
                                                }
    
                                            }
    
                                            var checkValue = value3.field;
                                            if (checkValue.indexOf('UUID') == -1) {
                                                if (checkValue.indexOf('user') != -1 || checkValue.indexOf('action') != -1 || checkValue.indexOf('date') != -1 || checkValue.indexOf(module) != -1 || checkValue.indexOf("_Version") != -1) {
    
                                                }
                                                else {
                                                    if (newValue !== oldValue) {
                                                        $("#" + key1 + "Body").append("<tr><td style='padding-left:15px;'>" + checkValue + "</td><td>" + oldValue + "</td><td style='color:red;'>" + newValue + "</td></tr>");
                                                    }
                                                    else {
                                                        $("#" + key1 + "Body").append("<tr><td style='padding-left:15px;'>" + checkValue + "</td><td>" + oldValue + "</td><td>" + newValue + "</td></tr>");
                                                    }
    
    
                                                }
                                            }
                                        }
                                        else {
                                            // $("#"+key1+"Body").append('<tr style="font-weight:bold;"><td colspan="3">'+key3+'</td></td>');
                                            //QuotationCharges
    
                                            $.each(value3, function (key6, value6) {
    
                                                //each charges
                                                $("#" + key1 + "Body").append('<tr style="font-weight:bold;" class="lvl2"><td colspan="3" style="padding-left:30px;">' + key3 + ' ' + (key6 + 1) + '</td></td>');
                                                $.each(value6, function (key7, value7) {
    
                                                    if (value7.new_value == null) {
                                                        var newValue = "";
                                                    }
                                                    else {
                                                        if (value7.new_value_reference !== undefined) {
                                                            var newValue = value7.new_value_reference;
                                                        }
                                                        else {
                                                            var newValue = value7.new_value;
                                                        }
                                                    }
    
                                                    if (value7.old_value == null) {
                                                        var oldValue = "";
                                                    }
                                                    else {
                                                        if (value7.old_value_reference !== undefined) {
                                                            var oldValue = value7.old_value_reference;
                                                        } else {
                                                            var oldValue = value7.old_value;
                                                        }
                                                    }
    
    
                                                    var checkValue = value7.field;
                                                    var CheckDefault = newValue.includes("----");
                                                    if (CheckDefault) {
                                                      var  isUUID = true;
                                                    } else {
                                                        if (checkIfValidUUID(newValue)) {
                                                        var    isUUID = true;
                                                        }
                                                        else {
                                                          var  isUUID = false;
                                                        }
                                                    }
                                                    if (checkValue.indexOf('UUID') == -1) {
                                                        if ((newValue == "" && oldValue == "")) {
    
                                                        } else if (newValue == oldValue || isUUID == true) {
    
                                                        }
                                                        else if (checkValue.indexOf('user') != -1 || checkValue.indexOf('action') != -1 || checkValue.indexOf('date') != -1 || checkValue.indexOf("_Version") != -1) {
    
                                                        }
                                                        else {
    
    
                                                            $("#" + key1 + "Body").append("<tr ><td style='padding-left:45px;'>" + checkValue + "</td><td>" + oldValue + "</td><td style='color:red;'>" + newValue + "</td></tr>");
                                                        }
                                                    }
    
                                                })
    
    
    
                                            })
    
                                        }
    
                                    })
    
    
    
                                }
                                else {
                                    if (value["0"] != undefined) {
    
                                        $("#" + key1 + "Body").append('<tr style="font-weight:bold;" class="lvl1"><td colspan="3">' + key1 + " " + (key + 1) + '</td></td>');
                                        $.each(value, function (key3, value3) {
    
                                            if (value3.field != undefined) {
    
                                                if (value3.new_value == null) {
                                                    var newValue = "";
                                                }
                                                else {
                                                    if (value3.new_value_reference !== undefined) {
                                                        var newValue = value3.new_value_reference;
                                                    }
                                                    else {
                                                        var newValue = value3.new_value;
                                                    }
    
    
                                                }
    
                                                if (value3.old_value == null) {
                                                    var oldValue = "";
                                                }
                                                else {
                                                    if (value3.old_value_reference !== undefined) {
                                                        var oldValue = value3.old_value_reference;
                                                    } else {
                                                        var oldValue = value3.old_value;
                                                    }
    
                                                }
    
    
                                                var checkValue = value3.field;
                                                if (checkValue.indexOf('UUID') == -1) {
                                                    if (checkValue.indexOf('user') != -1 || checkValue.indexOf('action') != -1 || checkValue.indexOf('date') != -1 || checkValue.indexOf(module) != -1 || checkValue.indexOf("_Version") != -1) {
    
                                                    }
                                                    else {
                                                        if (newValue !== oldValue) {
                                                            $("#" + key1 + "Body").append("<tr><td style='padding-left:15px;'>" + checkValue + "</td><td>" + oldValue + "</td><td style='color:red;'>" + newValue + "</td></tr>");
                                                        }
                                                        else {
                                                            $("#" + key1 + "Body").append("<tr><td style='padding-left:15px;'>" + checkValue + "</td><td>" + oldValue + "</td><td>" + newValue + "</td></tr>");
                                                        }
    
    
                                                    }
                                                }
                                            }
                                            else {
                                                // $("#"+key1+"Body").append('<tr style="font-weight:bold;"><td colspan="3">'+key3+'</td></td>');
                                                //QuotationCharges
    
                                                $.each(value3, function (key6, value6) {
                                                    //each charges
                                                    $("#" + key1 + "Body").append('<tr style="font-weight:bold;" class="lvl2"><td colspan="3" style="padding-left:30px;">' + key3 + ' ' + (key6 + 1) + '</td></td>');
                                                    $.each(value6, function (key7, value7) {
    
                                                        if (value7.field != undefined) {
                                                            if (value7.new_value == null) {
                                                                var newValue = "";
                                                            }
                                                            else {
                                                                if (value7.new_value_reference !== undefined) {
                                                                    var newValue = value7.new_value_reference;
                                                                }
                                                                else {
                                                                    var newValue = value7.new_value;
                                                                }
                                                            }
    
                                                            if (value7.old_value == null) {
                                                                var oldValue = "";
                                                            }
                                                            else {
                                                                if (value7.old_value_reference !== undefined) {
                                                                    var oldValue = value7.old_value_reference;
                                                                } else {
                                                                    var oldValue = value7.old_value;
                                                                }
                                                            }
    
    
                                                            var checkValue = value7.field;
                                                            var CheckDefault = newValue.includes("----");
                                                            if (CheckDefault) {
                                                             var   isUUID = true;
                                                            } else {
                                                                if (checkIfValidUUID(newValue)) {
                                                              var      isUUID = true;
                                                                }
                                                                else {
                                                               var     isUUID = false;
                                                                }
                                                            }
    
                                                            if (checkValue.indexOf('UUID') == -1) {
                                                                if ((newValue == "" && oldValue == "")) {
    
                                                                } else if (newValue == oldValue || isUUID == true) {
    
                                                                }
                                                                else if (checkValue.indexOf('user') != -1 || checkValue.indexOf('action') != -1 || checkValue.indexOf('date') != -1 || checkValue.indexOf("_Version") != -1) {
    
                                                                }
                                                                else {
    
    
                                                                    $("#" + key1 + "Body").append("<tr ><td style='padding-left:45px;'>" + checkValue + "</td><td>" + oldValue + "</td><td style='color:red;'>" + newValue + "</td></tr>");
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            $("#" + key1 + "Body").append('<tr style="font-weight:bold;" class="lvl2"><td colspan="3" style="padding-left:45px;">' + key7 + ' ' + (key6 + 1) + '</td></td>');
                                                            $.each(value7, function (key8, value8) {
    
                                                                $.each(value8, function (key9, value9) {
                                                                    if (value9.new_value == null) {
                                                                        var newValue = "";
                                                                    }
                                                                    else {
                                                                        if (value9.new_value_reference !== undefined) {
                                                                            var newValue = value9.new_value_reference;
                                                                        }
                                                                        else {
                                                                            var newValue = value9.new_value;
                                                                        }
                                                                    }
    
                                                                    if (value9.old_value == null) {
                                                                        var oldValue = "";
                                                                    }
                                                                    else {
                                                                        if (value9.old_value_reference !== undefined) {
                                                                            var oldValue = value9.old_value_reference;
                                                                        } else {
                                                                            var oldValue = value9.old_value;
                                                                        }
                                                                    }
    
                                                                    var checkValue = value9.field;
                                                                    var CheckDefault = newValue.includes("----");
                                                                    if (CheckDefault) {
                                                                        isUUID = true;
                                                                    } else {
                                                                        if (checkIfValidUUID(newValue)) {
                                                                            isUUID = true;
                                                                        }
                                                                        else {
                                                                            isUUID = false;
                                                                        }
                                                                    }
    
                                                                    if (checkValue.indexOf('UUID') == -1) {
                                                                        if ((newValue == "" && oldValue == "")) {
                                                                        } else if (newValue == oldValue || isUUID == true) {
                                                                        }
                                                                        else if (checkValue.indexOf('user') != -1 || checkValue.indexOf('action') != -1 || checkValue.indexOf('date') != -1 || checkValue.indexOf("_Version") != -1) {
                                                                        }
                                                                        else {
                                                                            $("#" + key1 + "Body").append("<tr ><td style='padding-left:60px;'>" + checkValue + "</td><td>" + oldValue + "</td><td style='color:red;'>" + newValue + "</td></tr>");
                                                                        }
                                                                    }
                                                                })
    
    
    
                                                            })
                                                        }
    
    
                                                    })
    
    
    
                                                })
    
                                            }
    
                                        })
                                    }
                                    else {
    
                                        if (value.new_value == null) {
                                            var newValue = "";
                                        }
                                        else {
                                            if (value.new_value_reference !== undefined) {
                                                var newValue = value.new_value_reference;
                                            }
                                            else {
                                                var newValue = value.new_value;
                                            }
                                        }
    
                                        if (value.old_value == null) {
                                            var oldValue = "";
                                        }
                                        else {
                                            if (value.old_value_reference !== undefined) {
                                                var oldValue = value.old_value_reference;
                                            } else {
                                                var oldValue = value.old_value;
                                            }
                                        }
    
    
                                        var checkValue = value.field;
                                        var CheckDefault = newValue.includes("----");
                                        if (CheckDefault) {
                                          var  isUUID = true;
                                        } else {
                                            if (checkIfValidUUID(newValue)) {
                                           var     isUUID = true;
                                            }
                                            else {
                                         var       isUUID = false;
                                            }
                                        }
    
    
                                        if (checkValue.indexOf('UUID') == -1) {
                                            if ((newValue == "" && oldValue == "")) {
    
                                            } else if (newValue == oldValue || isUUID == true) {
    
                                            }
                                            else if (checkValue.indexOf('user') != -1 || checkValue.indexOf('action') != -1 || checkValue.indexOf('date') != -1 || checkValue.indexOf("_Version") != -1) {
    
                                            }
                                            else {
                                                $("#" + key1 + "Body").append("<tr><td>" + checkValue + "</td><td>" + oldValue + "</td><td style='color:red;'>" + newValue + "</td></tr>");
                                            }
                                        }
                                    }
                                }
    
    
    
    
                            })
    
    
                        })
                    }
    
                })
                //add active class for first tab and hide empty tab
                window.$("#myTabContent").find("tbody").each(function () {
                    if ($(this).find('tr').length == 0) {
                        var id = $(this).parent().parent().attr('id');
                        $(this).parent().parent().removeClass("active show");
                        window.$("#" + id + "-tab").addClass("d-none")
                        window. $("#" + id + "-tab").removeClass("active")
    
                    }
    
                })
    
            }
    
            window.$("#myTab").children().each(function () {
    
                if (!window.$(this).children().hasClass("d-none")) {
                    var id = window.$(this).children().attr("id").split("-")[0];
                    window.$("#" + id).addClass("active show");
                    window. $("#" + id + "-tab").addClass("active");
                    return false;
                }
    
    
            })
    
    
            window.$("#myTabContent").find(".lvl2").each(function () {
                if (window.$(this).next().length !== 0) {
                    if (window.$(this).next().hasClass("lvl2")) {
                        window. $(this).addClass('d-none');
                    }
                    else if ($(this).next().hasClass("lvl1")) {
                        window.$(this).addClass('d-none');
                    }
                }
                else {
                    window.$(this).addClass('d-none');
    
                }
    
            })
        })


    }

    useEffect(() => {


        GetAllDropDown(["User"], globalContext, false).then(res => {
            var ArrayUser = []
            $.each(res.User, function (key, value) {
                ArrayUser.push({ value: value.id, label: value.username })
            })
            setUser(sortArray(ArrayUser))

        })



        var defaultHide = [ // default field to hide in bootstrap table

        ];
        var columns = [ // data from controller (actionGetCompanyType) field and title to be included
            {
                field: 'date_created_format',
                title: 'Date Time',
                sorter: dateTimeSort
            },
            {
                field: 'CreatedByUsername',
                title: 'User',

            },
            {
                field: 'action',
                title: 'Action',

            },
            {
                field: 'module',
                title: 'Module',

            },
            {
                field: 'Reference',
                title: 'Reference',

            },


        ];

        initTable({
            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: columns,
            hideColumns: defaultHide, // hide default column. If there is no cookie
            cookieID: `${props.data.modelLink}-table`,               // define cookie id 
            // functionGrid: GetGridviewData,
        });

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
                            <div className="col-md-12">

                                <div className="row">
                                    <div className="col-md-6 row">
                                        <div className="col-md-2">
                                            <div className="form-check">

                                                <label htmlFor="DocDate" className="mt-1">Date:</label>

                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">

                                                <Controller
                                                    name="DynamicModel[DateFrom]"
                                                    control={control}
                                                    id="DateFrom"
                                                    render={({ field: { onChange, value } }) => (
                                                        <>
                                                            <Flatpickr
                                                                value={value}
                                                                {...register('DynamicModel[DateFrom]')}
                                                                id="DateFrom"
                                                                onChange={val => {

                                                                    onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                                }}
                                                                className="form-control DateFrom"
                                                                options={{
                                                                    dateFormat: "d/m/Y"
                                                                }}

                                                            />
                                                        </>
                                                    )}
                                                />

                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">

                                                <input type="text" className="form-control  borderless" value='To' readOnly></input>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">

                                                <Controller
                                                    name="DynamicModel[DateTo]"
                                                    control={control}
                                                    id="DateTo"
                                                    render={({ field: { onChange, value } }) => (
                                                        <>
                                                            <Flatpickr
                                                                value={value}
                                                                {...register('DynamicModel[DateTo]')}
                                                                id="DateTo"
                                                                onChange={val => {

                                                                    onChange(moment(val[0]).format("DD/MM/YYYY"))
                                                                }}
                                                                className="form-control DateTo"
                                                                options={{
                                                                    dateFormat: "d/m/Y"
                                                                }}

                                                            />
                                                        </>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 row">
                                        <div className="col-md-2">
                                            <span><b>Action:</b></span>
                                        </div>
                                        <div className='col-md-2'>
                                            <div className="form-check">
                                                <input type="checkbox" id="Create" name="Create"></input>
                                                <label htmlFor="Create" className="mt-1">Create</label>
                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className='checkBox' type="checkbox" id="Update" name="Update"></input>
                                                <label htmlFor="Update" className="mt-1">Update</label>
                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className='checkBox' type="checkbox" id="Remove" name="Remove"></input>
                                                <label htmlFor="Remove" className="mt-1">Remove</label>
                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className='checkBox' type="checkbox" id="Trash" name="Trash"></input>
                                                <label htmlFor="Trash" className="mt-1">Trash</label>
                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className='checkBox' type="checkbox" id="Verify" name="Verify"></input>
                                                <label htmlFor="Verify" className="mt-1">Verify</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 row">
                                        <div className="col-md-1">
                                            <div className="form-check">

                                                <label htmlFor="User" className="mt-1">User:</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <Controller
                                                    name="DynamicModel[User]"
                                                    id="User"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[User]")}
                                                            value={value ? user.find(c => c.value === value) : null}
                                                            onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                            options={user}
                                                            className="form-control User"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />


                                            </div>

                                        </div>

                                        <div className="col-md-2">
                                            <div className="form-check">

                                                <label htmlFor="ParentModule" className="mt-1">Parent Module:</label>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <Controller
                                                    name="DynamicModel[ParentModule]"
                                                    id="ParentModule"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[ParentModule]")}
                                                            value={value ? parentModule.find(c => c.value === value) : null}
                                                            onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeParentModule(val) }}
                                                            options={parentModule}
                                                            className="form-control ParentModule"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />


                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="form-check">

                                                <label htmlFor="Module" className="mt-1">Module:</label>
                                            </div>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="form-group">
                                                <Controller
                                                    name="DynamicModel[Module]"
                                                    id="Module"
                                                    control={control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <Select
                                                            isClearable={true}
                                                            {...register("DynamicModel[Module]")}
                                                            value={value ? module.find(c => c.value === value) : null}
                                                            onChange={val => { val == null ? onChange(null) : onChange(val.value) }}
                                                            options={module}
                                                            className="form-control Module"
                                                            classNamePrefix="select"
                                                            styles={globalContext.customStyles}

                                                        />
                                                    )}
                                                />


                                            </div>

                                        </div>

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 row">
                                        <div className="col-md-1">
                                            <div className="form-check">
                                                <label htmlFor="Search" className="mt-1">Search:</label>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <input type="text" className="form-control " name="Search" id="Search"></input>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <button type="button" className="btn btn-success float-right GenerateAuditTrail" onClick={() => handleGenerate()}>Generate</button>
                                            <div >
                                            </div>
                                        </div>
                                    </div>


                                </div>







                            </div>
                        </div>
                    </div>
                </div>
                <table id="audit-trail-table">

                </table>

            
                <div className="modal fade" id="PreviewAuditTrailModal" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body ApplyAll">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>









    )
}






export default LoadingDischargingList