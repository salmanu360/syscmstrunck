import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown, getCookie,initHoverSelectDropownTitle, sortArray } from '../../Components/Helper.js'
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
    var ContainerUUIDLink;
    var arrayLatestColumn=[];
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

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

    function handlePreview() {
 
            // if(getPreviewPDFPermission == true){

            var getContainerUUIDLink = ContainerUUIDLink
            getContainerUUIDLink=getContainerUUIDLink.replace("./", "/")
                axios({
                    url:  globalContext.globalHost + globalContext.globalPathLink + props.data.modelLink+getContainerUUIDLink,
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
            
           //}
            // else{
            //     alert("You are not allowed to Preview PDF, Please check your User Permission.")
            // }
        
       
    }


    function handleFindList(val) {
        var BLuuid = [];
        var BLidlink = "";

        var VoyageNum = getValues("DynamicModel[VoyageNumber]") ? getValues("DynamicModel[VoyageNumber]") : ""
        var SCNCode = $(".SCN").val()
        var ShipOperator = $("input[name='DynamicModel[ShipOperator]']").val()
        // $previewlist = $('#previewpdfList');
        var orderBy = {
            "DocNum": "SORT_ASC",
        }

        //if table drag cookies exist,use it as columns
        // if (!!$.cookie("manifest-table-drag")) {
        //     var arrColumn = JSON.parse($.cookie("manifest-table-drag"));
        //     var DragArr = [];

        //     $.each(arrColumn, function (key, value) {
        //         $.each(columns2, function (key1, value1) {
        //             if (value == value1.field) {
        //                 DragArr.push(value1);
        //                 return;
        //             }
        //         })
        //     })
        //     columns2 = DragArr;
        // }
      
        if ($("input[name='DynamicModel[VoyageNummber]']").val()== "" ) {
            alert("Voyage No cannot be empty!");
            return false;
        } 
        // else if ($("input[name='DynamicModel[SCNCode]']").val()=="") {
        //     alert("SCN No cannot be empty!");
        //     return false;                                
        // }
        else {
            var defaultHide2 = [ // default field to hide in bootstrap table

            ];
            var columns2 = [                                         // data from controller (actionGetBillOfLading) field and title to be included

            { field: 'ContainerCode', title: 'Container Code', switchable: false ,filterControl: "input" },
            { field: 'containerType.ContainerType', title: 'Container Type',filterControl: "input" },
            { field: 'OwnershipType', title: 'Ownership Type',filterControl: "input" },
            { field: 'SealNum', title: 'Seal No',filterControl: "input" },
            { field: 'Status', title: 'Status',filterControl: "input" },
            { field: 'BillOfLading.POLAreaName', title: 'POL' ,filterControl: "input"},
    
            { field: 'BillOfLading.PODAreaName', title: 'POD',filterControl: "input" },
            { field: 'vgmGrossWeight', title: 'Weight(KGS)',filterControl: "input" },
            { field: 'GoodsDescription', title: 'Remark',filterControl: "input" },
    

            ];
            var GetGridviewData2 = function (params) {
                var param = {
                    limit: params.data.limit,
                    offset: params.data.offset,
                    sort: params.data.sort,
                    order: params.data.order,
                    filter: params.data.filter,
                }
                $.ajax({
                    type: "POST",
                    url: globalContext.globalHost + globalContext.globalPathLink + "container/get-loading-list",
                    data: {
                        orderBy: orderBy,
                        param: param,
                        VoyageNum: VoyageNum,
                        SCN: SCNCode,
                        ShipOperator: ShipOperator,
                        Page: props.data.model//dynamic
                    },
                    dataType: "json",
                    headers: {
                        "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                    },
                    success: function (data) {
                        // if (getPreviewPDFPermission == true) {
                        //     if (data["rows"].length >= 1) {
                        //         $previewlist.prop('disabled', false)
                        //     } else {
                        //         $previewlist.prop('disabled', true)
                        //     }
                        // }

                        var containerUUID = [];
                        $.each(data.data.rows, function (key, value) {
                            var ContainerCode = "";
                            var SealCode = "";
                            var GoodsDescription = "";
                            var vgmGrossWeight = "";
                            var TotalKgs = 0.000;
                            var TotalM3 = 0.000;
                            //replace the null object to empty string
                            var replacedSealCode = replaceNull(value.SealCodes, "");
                            var replacedBillofLadingHasContainers = replaceNull(value.billOfLadingHasContainers, "");
                            var replacedContainerCodes = replaceNull(value.ContainerCodes, "");

                            var replacedContainerVerifyGrossMass = replaceNull(value.ContainerVerifyGrossMass, "")

                            TotalKgs = Number(value.NetWeight)
                            vgmGrossWeight =  Number(replaceNull(replacedContainerVerifyGrossMass.GrossWeight, ""))


                            $.each(replacedBillofLadingHasContainers, function (key1, value1) {
                                if (key1 == 0) {
                                    if (value1.GoodsDescription !== "") {
                                        GoodsDescription += value1.GoodsDescription;
                                    }

                                }
                                else {
                                    if (value1.GoodsDescription !== "") {
                                        GoodsDescription += ", " + value1.GoodsDescription;
                                    }

                                }
                            });

                            $.each(replacedContainerCodes, function (key1, value1) {
                            
                                if (key1 == 0) {
                                    if (value1.ContainerCode !== undefined) {
                                        ContainerCode += value1.ContainerCode;
                                    }
                                }
                                else {
                                    if (value1.ContainerCode !== undefined) {
                                        ContainerCode += ", " + value1.ContainerCode;
                                    }
                                }
                            });

               
                            data.data["rows"][key].ContainerNo = ContainerCode;
                            data.data["rows"][key].GoodsDescription = GoodsDescription;
                            data.data["rows"][key].TotalKgs = TotalKgs.toFixed(3);
                            data.data["rows"][key].vgmGrossWeight = vgmGrossWeight.toFixed(3);
                            containerUUID.push(data.data["rows"][key].ContainerUUID)
                        });
                       
                        ContainerUUIDLink = "./preview?ContainerUUIDs=" + containerUUID + "&Voyage=" + VoyageNum + "&SCN=" + SCNCode

                        params.success({
                            "rows": data.data.rows,
                            "total": data.data.total
                        })
                    }
                });

            }
        }


        initTable({

            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: columns2,
            hideColumns: defaultHide2, // hide default column. If there is no cookie
            cookieID: `${props.data.modelLink}-table`,               // define cookie id 
            functionGrid: GetGridviewData2,
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


    useEffect(() => {
       
        setValue("DynamicModel[VoyageNumber]", "")
        setValue("DynamicModel[SCNCode]", "")
        setValue("DynamicModel[ShipOperator]", "")

        GetAllDropDown(['Voyage'], globalContext).then(res => {

            var arrayVoyage = []
            $.each(res.Voyage, function (key, value) {
                arrayVoyage.push({ value: value.VoyageUUID, label: `${value.VoyageNumber}(${value.vessel.VesselCode})` })
            })


            setVoyage(sortArray(arrayVoyage))


        })


        var defaultHide2 = [ // default field to hide in bootstrap table

        ];
        var columns2 = [                                         // data from controller (actionGetBillOfLading) field and title to be included

            { field: 'ContainerCode', title: 'Container Code', switchable: false, filterControl: "input" },
            { field: 'containerType.ContainerType', title: 'Container Type', filterControl: "input" },
            { field: 'OwnershipType', title: 'Ownership Type', filterControl: "input" },
            { field: 'SealNum', title: 'Seal No', filterControl: "input" },
            { field: 'Status', title: 'Status', filterControl: "input" },
            { field: 'BillOfLading.POLAreaName', title: 'POL', filterControl: "input" },
            { field: 'BillOfLading.PODAreaName', title: 'POD', filterControl: "input" },
            { field: 'vgmGrossWeight', title: 'Weight(KGS)', filterControl: "input" },
            { field: 'GoodsDescription', title: 'Remark', filterControl: "input" },

        ];
        initTable({
            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: columns2,
            hideColumns: defaultHide2, // hide default column. If there is no cookie
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
                    <div className="row">
                    </div>
                    <table className="mt-2 mb-2">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "20%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "20%" }}></th>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "20%" }}></th>
                            </tr>

                        </thead>

                        <tbody>
                            <tr>

                                <td>
                                    <div className="col mb-3">
                                        Voyage No.:
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">

                                            <Controller
                                                name={"DynamicModel[VoyageNumber]"}

                                                control={control}

                                                render={({ field: { onChange, value } }) => (
                                                    <Select
                                                        isClearable={true}
                                                        {...register("DynamicModel[VoyageNumber]")}
                                                        value={value ? voyage.find(c => c.value === value) : null}
                                                        onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                                        options={voyage}
                                                        menuPortalTarget={document.body}
                                                        className="basic-single voyageNumber"
                                                        classNamePrefix="select"
                                                        styles={globalContext.customStyles}

                                                    />
                                                )}
                                            />

                                        </div>

                                    </div>
                                </td>
                                <td>
                                    <div className="col mb-3">
                                        SCN:
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2 ">
                                        <div className="form-group">
                                            <input defaultValue='' {...register("DynamicModel[SCNCode]")} className={`form-control SCN`} />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="col mb-3">
                                        Ship Operator:
                                    </div>
                                </td>
                                <td>
                                    <div className="col-xs-12 col-md-12 mt-2">
                                        <div className="form-group">
                                            <Controller
                                                name="DynamicModel[ShipOperator]"
                                                id="ShipOperator"
                                                control={control}

                                                render={({ field: { onChange, value } }) => (

                                                    <AsyncSelect
                                                        isClearable={true}
                                                        value={(value)}
                                                        {...register("DynamicModel[ShipOperator]")}
                                                        cacheOptions
                                                        placeholder={globalContext.asyncSelectPlaceHolder}
                                                        onChange={e => { e == null ? onChange(null) : onChange(e.id); }}
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

                                </td>


                                <td>
                                    <div className="col">
                                        <button type="button" className="btn btn-success float-right" onClick={() => handleFindList(props.data.modelLink)}>Generate</button>
                                    </div>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>

                <div id="toolbar">
                    <button type="button" id="previewpdfList" className={`${filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ? "" : "disabledAccess"} btn btn-success`} onClick={handlePreview}>
                        <i className="fa fa-send"></i> Preview PDF
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






export default LoadingDischargingList