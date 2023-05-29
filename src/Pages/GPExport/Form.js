import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import GridViewColumnSetting from '../../Components/CommonGridView/GridViewColumnSetting';
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown,getCookie, initHoverSelectDropownTitle } from '../../Components/Helper.js'
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
    var selections = [];
    var selectedRow = [];
    var arrayLatestColumn=[];
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const [docType, setDocType] = useState("")
    const [typeDoc, setTypeDoc] = useState("")

    const documentType = [
        { value: "SalesInvoice", label: "Sales Invoice" },
        { value: "SalesCreditNote", label: "Credit Note" },
        { value: "SalesDebitNote", label: "Debit Note" },
        { value: "CustomerPayment", label: "Receipt" }
    ]

    const Types = [
        { value: "Container", label: "Container" },
        { value: "Standard", label: "Standard" },
    ]


    function responseHandler(res) {

        $.each(res.rows, function (i, row) {
            row.state = $.inArray(row.id, selections) !== -1
        })
        return res
    }

    function handleType(val){
        if (val) {
            if (val.value == "Standard") {
                setTypeDoc("barge")
            }
            if (val.value == "Container") {
                setTypeDoc("container")
            }
         
        }

    }
    function handleDocumentType(val) {
        if (val) {
            if (val.value == "SalesInvoice") {
                setDocType("sales-invoice")
            }
            if (val.value == "SalesCreditNote") {
                setDocType("sales-credit-note")
            }
            if (val.value == "SalesDebitNote") {
                setDocType("sales-debit-note")
            }
            if (val.value == "CustomerPayment") {
                setDocType("customer-payment")

            }
        }
    }



    function columnSetup(columns) {
        var res = [
            {
                field: 'state',
                checkbox: true,
                rowspan: 1,
                align: 'center',
                valign: 'middle'
            }
        ];

        if(columns){
            var NewColumn=columns.map(obj => ({ ...obj }));
            arrayLatestColumn=NewColumn
            //check for reorder column cookies

            if (getCookie(`g-p-export-${docType}.bs.table.reorderColumns`)) {
              var getCookieArray = getCookie(`g-p-export-${docType}.bs.table.reorderColumns`);
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

        // res.push({
        //   field: 'operate',
        //   title: 'Item Action',
        //   align: 'center',
        //   switchable: false,
        //   clickToSelect: false,
        //   formatter: operateFormatter
        // })



        return res;
    }

    function replaceNull(someObj, replaceValue = "***") {
        const replacer = (key, value) =>
            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
        return JSON.parse(JSON.stringify(someObj, replacer));
    }

    function handleExport() {

        var getData = selectedRow;
        var DocumentUUID = [];
     
        $.each(getData, function (key, value) {
            if (docType == "sales-invoice") {
                DocumentUUID.push(value.SalesInvoiceUUID)
            }
            else if (docType == "sales-credit-note") {
                DocumentUUID.push(value.SalesCreditNoteUUID)
            }
            else if (docType == "sales-debit-note") {
                DocumentUUID.push(value.SalesDebitNoteUUID)
            } else {
                DocumentUUID.push(value.CustomerPaymentUUID)
            }

        });
        

        if (DocumentUUID.length == 0) {
          alert("No data selected");
        } else {
          var today = new Date();
          var date = today.getDate() + '_' + (today.getMonth() + 1) + '_' + today.getFullYear();
          $.ajax({
            type: "POST",
            url: globalContext.globalHost + globalContext.globalPathLink +"g-p-export/download-documents",
            data: { DocumentUUID: DocumentUUID, DocumentType:getValues("DynamicModel[DocumentType]") },
            headers: {
                "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
            },
            success: function (data) {
              var downloadLink = document.createElement("a");
              var fileData = [data];

              var blobObject = new Blob(fileData, {
                type: "text/xls;charset=utf-8;"
              });

              var url = URL.createObjectURL(blobObject);
              downloadLink.href = url;
              downloadLink.download = "GPExport" + date + ".xls";

              /*
               * Actually download CSV
               */
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          })
        }


    }


    function handleGenerate() {

       var type;
        if(docType=="sales-credit-note"){
            typeDoc=="barge"?type="credit-note-barge":type="credit-note"
        
        }else if(docType=="sales-invoice"){
            typeDoc=="barge"? type="sales-invoice-barge": type="sales-invoice"
           
        }else if(docType=="sales-debit-note"){  
            typeDoc=="barge"? type="debit-note-barge":type="debit-note"
        }else{
            type="customer-payment"
        }
        const ColumnSetting = GridViewColumnSetting(type);
        if ($("input[name='DynamicModel[DocumentType]']").val() == "") {
            alert("Document type cannot be empty");
            return false;
        } else if ($("#StartDate").val() == "") {
            alert("Start date cannot be empty");
            return false;
        } else if ($("#EndDate").val() == "") {
            alert("End date cannot be empty");
            return false;
        }
        else if ($("input[name='DynamicModel[Type]']").val() == "") {
            if($("input[name='DynamicModel[DocumentType]']").val()!=="CustomerPayment"){
                alert("Type cannot be empty");
                return false;
            }
           
        }

        var GetGridviewData = function (params) {
            var param = {
                limit: params.data.limit,
                offset: params.data.offset,
                sort: params.data.sort,
                order: params.data.order,
                filter: params.data.filter,
            }
            $.ajax({
                type: "POST",
                url: globalContext.globalHost + globalContext.globalPathLink + "g-p-export/get-document-details",
                data: {
                    param: param,
                    Type:$("input[name='DynamicModel[Type]']").val(),
                    DocumentType: $("input[name='DynamicModel[DocumentType]']").val(),
                    StartDate: $(".StartDate").val(),
                    EndDate: $(".EndDate").val()
                },
                dataType: "json",
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
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


        $("#Export").removeClass("d-none")
        initTable({

            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: ColumnSetting[0].columns,
            hideColumns: ColumnSetting[0].defaultHide, // hide default column. If there is no cookie
            cookieID: `${props.data.modelLink}-${docType}`,               // define cookie id 
            functionGrid: GetGridviewData,
        });

    }


    function initTable(args) {
        window.$(`#${props.data.modelLink}-table`).bootstrapTable('destroy').bootstrapTable({

            // height: '630',
            toolbar: args.toolbarSelector,
            minimumCountColumns: 0,
            pagination: true,
            pageList: [10, 50, 100, 500],
            idField: 'id',
            ajax: args.functionGrid,
            columns: columnSetup(args.columns),
            showRefresh: true,
            sidePagination: 'server',
            showColumns: true,
            clickToSelect: true,
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
            responseHandler: function (res) {
                $.each(res.rows, function (i, row) {
                    if (docType == "sales-invoice") {
                        var rowUUID = row.SalesInvoiceUUID
                    }
                    else if (docType == "sales-credit-note") {
                        var rowUUID = row.SalesCreditNoteUUID
                    }
                    else if (docType == "sales-debit-note") {
                        var rowUUID = row.SalesDebitNoteUUID
                    } else {
                        var rowUUID = row.CustomerPaymentUUID
                    }
                    row.state = $.inArray(rowUUID, selections) !== -1
                })
                return res
            },
            onLoadSuccess: function () {
                // $table.bootstrapTable('filterBy', args.filterSelector); // default show valid data only

                window.$(`#${props.data.modelLink}-table`).find("tr > *:nth-child(2)").addClass('d-none');

                if (window.$(`#${props.data.modelLink}-table`).bootstrapTable("getCookies")['columns'] == null) {
                    $.each(args.hideColumns, function (key, value) {
                        window.$(`#${props.data.modelLink}-table`).bootstrapTable('hideColumn', value);
                    });
                }

            }
        });

        window.$(`#${props.data.modelLink}-table`).on('reorder-column.bs.table', function (e, args) {
            var newLatestColumn = []
            if (getCookie(`g-p-export-${docType}.bs.table.reorderColumns`)) {
        
              var getCookieArray = getCookie(`g-p-export-${docType}.bs.table.reorderColumns`);
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

        window.$(`#${props.data.modelLink}-table`).on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table',
            function (e, rowsAfter, rowsBefore) {
                var rows = rowsAfter
                if (e.type === 'uncheck-all') {
                    rows = rowsBefore
                }


                var ids = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {
                    if (docType == "sales-invoice") {
                        return row.SalesInvoiceUUID
                    }
                    else if (docType == "sales-credit-note") {
                        return row.SalesCreditNoteUUID
                    }
                    else if (docType == "sales-debit-note") {
                        return row.SalesDebitNoteUUID
                    } else {
                        return row.CustomerPaymentUUID
                    }


                })
                var rowSelected = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {

                    return row

                })



                var func = $.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

                var func1 = $.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

                selectedRow = window._[func](selectedRow, rowSelected)
                selections = window._[func1](selections, ids)
            
                var CheckSelectedRow = [];
                $.each(selectedRow, function (key, value) {
                    $.each(selections, function (key2, value2) {
                        if (docType == "sales-invoice") {
                            if (value.SalesInvoiceUUID == value2) {
                                CheckSelectedRow.push(value)
                            }
                        }
                        else if (docType == "sales-credit-note") {
                            if (value.SalesCreditNoteUUID == value2) {
                                CheckSelectedRow.push(value)
                            }
                        }
                        else if (docType == "sales-debit-note") {
                            if (value.SalesDebitNoteUUID == value2) {
                                CheckSelectedRow.push(value)
                            }
                        } else {
                            if (value.CustomerPaymentUUID == value2) {
                                CheckSelectedRow.push(value)
                            }
                        }

                    });
                });
                selectedRow = CheckSelectedRow;
            }
        )


    }

    useEffect(() => {

        const startOfMonth = moment().clone().startOf('month').format('DD/MM/YYYY');
        const endOfMonth = moment().clone().endOf('month').format('DD/MM/YYYY');
        setValue("DynamicModel[StartDate]", startOfMonth)
        setValue("DynamicModel[EndDate]", endOfMonth)

        return () => {

        }
    }, [props.data.model])


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
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "15%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "15%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "15%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "15%" }}></th>
                            </tr>

                        </thead>

                        <tbody>
                            <tr>

                                <td>
                                    <div className="col mb-2">
                                        <label> Document Type:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">

                                            <Controller
                                                name={"DynamicModel[DocumentType]"}

                                                control={control}

                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        isClearable={true}
                                                        {...register("DynamicModel[DocumentType]")}
                                                        value={value ? documentType.find(c => c.value === value) : null}
                                                        onChange={val => { val == null ? onChange(null) : onChange(val.value); handleDocumentType(val) }}
                                                        options={documentType}
                                                        menuPortalTarget={document.body}
                                                        className="basic-single DocumentType"
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
                                        <label>Container/Standard:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">

                                            <Controller
                                                name={"DynamicModel[Type]"}

                                                control={control}

                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        isClearable={true}
                                                        {...register("DynamicModel[Type]")}
                                                        value={value ? Types.find(c => c.value === value) : null}
                                                        onChange={val => { val == null ? onChange(null) : onChange(val.value); handleType(val) }}
                                                        options={Types}
                                                        menuPortalTarget={document.body}
                                                        className="basic-single Type"
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
                                        <label> Start Date:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2 ">
                                        <div className="form-group">

                                            <Controller
                                                name="DynamicModel[StartDate]"
                                                control={control}
                                                id="StartDate"
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
                                </td>
                                <td>
                                    <div className="col mb-2">
                                        <label>  End Date:</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">
                                            <Controller
                                                name="DynamicModel[EndDate]"
                                                control={control}
                                                id="EndDate"
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

                                </td>


                                <td>
                                    <div className="col">
                                        <button type="button" className="btn btn-success float-right" onClick={handleGenerate}>Generate</button>
                                    </div>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>

                <div id="toolbar">
                    <button type="button" id="Export" className="btn btn-success d-none" onClick={handleExport}>
                        <i className="fa fa-send"></i> Export
                    </button>
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