import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../../Components/CreateButtonRow'
import UpdateButton from '../../Components/UpdateButtonRow'
import GlobalContext from "../../Components/GlobalContext"
import { GetUpdateData, CreateData, UpdateData, ToastNotify, ControlOverlay, GetAllDropDown,getCookie, getFindContainerStatus } from '../../Components/Helper.js'
import Select from 'react-select'
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




function Index(props) {
    var arrayLatestColumn=[];
    const { state } = useLocation();
    const [formState, setFormState] = useState({ formType: "New" });
    const globalContext = useContext(GlobalContext);
    const params = useParams();
    const navigate = useNavigate();

    const { register, formState: { errors } } = useForm({

    });

    var modelLinkTemp;
   
    if (globalContext.userRule !== "") {
         modelLinkTemp=props.data.modelLink
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(modelLinkTemp);
        });
        
    }

    function replaceNull(someObj, replaceValue = "***") {
        const replacer = (key, value) =>
            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
        return JSON.parse(JSON.stringify(someObj, replacer));
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

    function handleGenerate() {

        var defaultHide = []
        var columns = [                                         // data from controller (actionGetBillOfLading) field and title to be included

            { field: 'ContainerDocument.CreatedAt', title: 'Date Time', switchable: false, sorter:dateTimeSort, filterControl: 'input' },
            { field: 'BookingConfirmation.DocNum', title: 'Booking Confirmation', filterControl: 'input' },
            { field: 'Activity', title: 'Activity', filterControl: 'input' },


        ];
        initTable({
            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: columns,
            hideColumns: defaultHide, // hide default column. If there is no cookie
            cookieID: `${props.data.modelLink}-table`,               // define cookie id 
            // functionGrid: GetGridviewData,
        });

        var GetGridviewData = function (params) {
            $.ajax({
                type: "POST",
                url: globalContext.globalHost + globalContext.globalPathLink + "history-tracking/find-container-status?ContainerCodes=" + $("#ContainerCodeTrack").val(),
                data: {
                    ContainerCode: $("#ContainerCodeTrack").val(),
                },
                headers: {
                    "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
                },
                dataType: "json",
                success: function (data) {

                    var Activity = "";
                    var Description = ""

                    $.each(data.data, function (key, value) {

                        var replacedContainerDocument = replaceNull(value.ContainerDocument, "");

                        if (
                            value.ContainerTracking == "Quotation" ||
                            value.ContainerTracking == "Booking Reservation" ||
                            value.ContainerTracking == "Booking Confirmation" ||
                            value.ContainerTracking == "Container Release Order" ||
                            value.ContainerTracking == "Bill Of Lading" ||
                            value.ContainerTracking == "Delivery Order" ||
                            value.ContainerTracking == "Sales Invoice" ||
                            value.ContainerTracking == "Sales Credit Note" ||
                            value.ContainerTracking == "Customer Payment"
                        ) {
                            Description = replaceNull(replacedContainerDocument.DocNum, "")
                        } else if (
                            value.ContainerTracking == "Container Release" ||
                            value.ContainerTracking == "Container Loading" ||
                            value.ContainerTracking == "Container Gate In"
                        ) {
                            Description = replaceNull(replacedContainerDocument.Area, "")
                            // Description = replaceNull(replacedContainerDocument.POLAreaName, "")
                        } else {
                            Description = replaceNull(replacedContainerDocument.Area, "")
                            // Description = replaceNull(replacedContainerDocument.POLAreaName, "")
                        }

                        Activity = value.ContainerTracking + "<br>" + Description

                        Activity = Activity.replace(/,\s*$/, "");

                        data.data[key].Activity = Activity;

                    })



                    params.success({
                        "rows": data.data,
                        "total": data.data.length
                    })
                }
            });
        }

        initTable({
            tableSelector: `#${props.data.modelLink}-table`,  // #tableID
            toolbarSelector: '#toolbar',                   // #toolbarID
            columns: columns,
            hideColumns: defaultHide, // hide default column. If there is no cookie
            cookieID: `${props.data.modelLink}-table`,               // define cookie id 
            functionGrid: GetGridviewData,
        });

    }

    function initTable(args) {

        window.$(`#${props.data.modelLink}-table`).bootstrapTable('destroy').bootstrapTable({

            // height: '700',
            toolbar: args.toolbarSelector,
            minimumCountColumns: 0,
            pagination: true,
            pageList: [10, 50, 100, 500],
            idField: 'id',
            ajax: args.functionGrid,
            columns: columnSetup(args.columns),
            showRefresh: true,
            showColumns: true,
            showColumnsToggleAll: true,
            showExport: true,
            resizable: true,
            reorderableColumns: true,
            searchOnEnterKey: false,
            exportTypes: ['excel', 'xlsx', 'pdf'],
            filterControl: true,
            click: true,
            cookie: "true",
            cookieExpire: '10y',
            cookieIdTable: args.cookieID,
            onLoadSuccess: function () {
                window.$(`#${props.data.modelLink}-table`).bootstrapTable('filterBy', { Valid: ["1"] }); // default show valid data only

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

    useEffect(() => {

        var orderBy = { "DocNum": "SORT_ASC" }
        var defaultHide = []
        var columns = [                                         // data from controller (actionGetBillOfLading) field and title to be included

            { field: 'ContainerDocument.CreatedAt', title: 'Date Time', switchable: false, sorter: "dateTimeSort", filterControl: 'input' },
            { field: 'BookingConfirmation.DocNum', title: 'Booking Confirmation', filterControl: 'input' },
            { field: 'Activity', title: 'Activity', filterControl: 'input' },


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


    return (
			<div className='card card-primary'>
				<div className='card-body'>
					<div className='card lvl1'>
						<div className='row'></div>
						<table className='mt-2 mb-2'>
							<thead>
								<tr>
									<th style={{width: "10%"}}></th>
									<th style={{width: "20%"}}></th>
								</tr>
							</thead>

							<tbody>
								<tr>
									<td>
										<div className='col mb-3 mt-3'>
											<label>Container Code:</label>
										</div>
									</td>
									<td>
										<div className='col-xs-12 col-md-12 mt-2'>
											<div className='form-group'>
												<input
													defaultValue=''
													{...register("DynamicModel[ContainerCOde]")}
													id='ContainerCodeTrack'
													className={`form-control`}
												/>
											</div>
										</div>
									</td>

									<td>
										<div className='col'>
											<button
												type='button'
												className='btn btn-success float-right'
												onClick={() => handleGenerate()}>
												Generate
											</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className='card-body' style={{width: "55%", margin: "0 auto"}}>
					<div>
						<table
							id={`${props.data.modelLink}-table`}
							className='bootstrap_table'
							data-sort-name='ContainerDocument.CreatedAt'></table>
					</div>
				</div>
			</div>
		);
}






export default Index