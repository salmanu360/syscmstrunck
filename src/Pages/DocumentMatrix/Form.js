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




function Form(props) {
  var ContainerUUIDLink;
  var arrayLatestColumn=[];
  const { state } = useLocation();
  const [formState, setFormState] = useState({ formType: "New" });
  const globalContext = useContext(GlobalContext);
  const params = useParams();
  const navigate = useNavigate();

  const [billOfLading, setBillOfLading] = useState([])
  const [voyage, setVoyage] = useState([])
  


  if (globalContext.userRule !== "") {
    var modelLinkTemp = "document-matrix"
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
      if (getCookie(`document-matrix-table.bs.table.reorderColumns`)) {
        var getCookieArray = getCookie(`document-matrix-table.bs.table.reorderColumns`);
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
    if (!row.BillOfLadingUUID == true) {
      return null;
    }
    else {
      var arrayDocNum = (row.BillOfLadingDocNum).split(",")
      var arrayUUID = (row.BillOfLadingUUID).split(",")
      var LinkID="";
      $.each(arrayDocNum, function (key, value) {
        $.each(arrayUUID, function (key2, value2) {
          if (key == key2) {
            if (row.ContainerType == "") {
              LinkID += "<a href='../../../operation/standard/bill-of-lading-barge/update/id=" + value2 + "' class='checkPermissionLinkBL' target='_blank'>" + value + "</a>, ";
            } else {
              LinkID += "<a href='../../../operation/container/bill-of-lading/update/id=" + value2 + "' class='checkPermissionLinkBL' target='_blank'>" + value + "</a>, ";
            }
          }
        })
      });
      LinkID = LinkID.replace(/,\s*$/, "");
      return LinkID;
    }
  }

  function BRFormatterDocNum(value, row, index) {
    if (!row.BookingReservationUUID == true) {
      return null;
    } else {
      if (row.ContainerType == "") {
        return "<a href='../../standard/booking-reservation-barge/update/id=" + row.BookingReservationUUID + "' class = 'checkPermissionLinkBR' target='_blank'>" + value + "</a>";
      } else {
        return "<a href='../../container/booking-reservation/update/id=" + row.BookingReservationUUID + "' class = 'checkPermissionLinkBR' target='_blank'>" + value + "</a>";
      }
    }
  }
  function QTFormatterDocNum(value, row, index) {
    if (!row.QuotationUUID == true) {
      return null;
    } else {
      if (row.ContainerType == "") {
        return "<a href='../../standard/quotation-barge/update/id=" + row.QuotationUUID + "' class = 'checkPermissionLinkQT' target='_blank'>" + value + "</a>";
      }
      else {
        return "<a href='../../container/quotation/update/id=" + row.QuotationUUID + "' class = 'checkPermissionLinkQT' target='_blank'>" + value + "</a>";

      }
    }
  }

  function SalesInvoiceFormatterDocNum(value, row, index) {
    if (!row.SalesInvoiceUUID == true) {
      return null;
    } else {
      var arrayDocNum = []
      var arrayUUID = []
      arrayDocNum = (row.SalesInvoiceDocNum).split(",")
      arrayUUID = (row.SalesInvoiceUUID).split(",")
      var LinkID="";
      $.each(arrayDocNum, function (key, value) {
        $.each(arrayUUID, function (key2, value2) {
          if (key == key2) {
            if (row.ContainerType == "") {
              LinkID += "<a href='../../standard/sales-invoice-barge/update/id=" + value2 + "' class='checkPermissionLinkINV' target='_blank'>" + value + "</a>, ";
            } else {
              LinkID += "<a href='../../container/sales-invoice/update/id=" + value2 + "' class='checkPermissionLinkINV' target='_blank'>" + value + "</a>, ";
            }
          }
        })
      });
      LinkID = LinkID.replace(/,\s*$/, "");
      return LinkID;
    }
  }

  function ORFormatterDocNum(value, row, index) {
    if (!row.CustomerPaymentDocNum == true) {
      return null;
    } else {
      var arrayDocNum = (row.CustomerPaymentDocNum).split(",")
      var arrayUUID = (row.CustomerPaymentUUID).split(",")
      var LinkID="";
      $.each(arrayDocNum, function (key, value) {
        $.each(arrayUUID, function (key2, value2) {
          if (key == key2) {
            LinkID += "<a href='../../container/customer-payment/update/id=" + value2 + "' class='checkPermissionLinkOR' target='_blank'>" + value + "</a>, ";
          }
        })
      });
      LinkID = LinkID.replace(/,\s*$/, "");
      return LinkID;
    }
  }

  function CNFormatterDocNum(value, row, index) {
    if (!row.SalesCreditNoteDocNum == true) {
      return null;
    } else {
      var arrayDocNum = (row.SalesCreditNoteDocNum).split(",")
      var arrayUUID = (row.SalesCreditNoteUUID).split(",")
      var LinkID="";
      $.each(arrayDocNum, function (key, value) {
        $.each(arrayUUID, function (key2, value2) {
          if (key == key2) {
            if (row.ContainerType == "") {
              LinkID += "<a href='../../standard/credit-note-barge/update/id=" + value2 + "' class='checkPermissionLinkCN' target='_blank'>" + value + "</a>, ";
            } else {
              LinkID += "<a href='../../container/credit-note/update/id=" + value2 + "' class='checkPermissionLinkCN' target='_blank'>" + value + "</a>, ";
            }
          }
        })
      });
      LinkID = LinkID.replace(/,\s*$/, "");
      return LinkID;
    }
  }

  function DNFormatterDocNum(value, row, index) {
    if (!row.SalesDebitNoteDocNum == true) {
      return null;
    } else {
      var arrayDocNum = (row.SalesDebitNoteDocNum).split(",")
      var arrayUUID = (row.SalesDebitNoteUUID).split(",")
      var LinkID="";
      $.each(arrayDocNum, function (key, value) {
        $.each(arrayUUID, function (key2, value2) {
          if (key == key2) {
            if (row.ContainerType == "") {
              LinkID += "<a href='../../standard/debit-note-barge/update/id=" + value2 + "' class='checkPermissionLinkDN' target='_blank'>" + value + "</a>, ";
            } else {
              LinkID += "<a href='../../container/debit-note/update/id=" + value2 + "' class='checkPermissionLinkDN' target='_blank'>" + value + "</a>, ";
            }
          }
        })
      });
      LinkID = LinkID.replace(/,\s*$/, "");
      return LinkID;
    }
  }

  function handleGenerate() {
    var BLID = getValues("DynamicModel[BillOfLading]")
    var VoyageID = getValues("DynamicModel[Voyage]")

    // if (BLID == null || BLID == "") {
    //   alert("Please select a Bill Of Landing");
    // }
    // else {

      var defaultHide2 = [ // default field to hide in bootstrap table

      ];
      var columns2 = [                                         // data from controller (actionGetBillOfLading) field and title to be included
        {
          field: 'BookingReservationDocNum',
          title: 'BR',
          formatter: BRFormatterDocNum,
          filterControl:"input",
        },
        {
          field: 'BillOfLadingDocNum',
          title: 'BL NO.',
          switchable: false,
          formatter: BLFormatterDocNum,
          filterControl:"input",
        },
        {
          field: 'VoyageName',
          title: 'Voyage',
          filterControl:"input",
        },
        {
          field: 'VesselName',
          title: 'Vessel',
          filterControl:"input",
        },
        {
          field: 'ContainerType',
          title: 'Container Type',
          filterControl:"input",
        },
        {
          field: 'ContainerCode',
          title: 'Container',
          filterControl:"input",
        },
        {
          field: 'QuotationDocNum',
          title: 'QT',
          formatter: QTFormatterDocNum,
          filterControl:"input",
        },
        {
          field: 'SalesInvoiceDocNum',
          title: 'INV',
          formatter: SalesInvoiceFormatterDocNum,
          filterControl:"input",
        },
        {
          field: 'CustomerPaymentDocNum',
          title: 'OR',
          formatter: ORFormatterDocNum,
          filterControl:"input",
        },
        {
          field: 'SalesCreditNoteDocNum',
          title: 'CN',
          formatter: CNFormatterDocNum,
          filterControl:"input",
        },
        {
          field: 'SalesDebitNoteDocNum',
          title: 'DN',
          formatter: DNFormatterDocNum,
          filterControl:"input",
        },

      ];
      if(!BLID){
        BLID = null
      }
      if(!VoyageID){
        VoyageID = null
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
          url: globalContext.globalHost + globalContext.globalPathLink + "document-matrix/get-index-document-matrix-data?BLUUID=" + BLID +"&VoyageUUID=" + VoyageID,
          dataType: "json",
          data: {param: param},
          headers: {
            "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
          },
          success: function (data) {
            params.success({
              "rows": data.rows,
              "total": data.total
            })
          }
        });
      };

      initTable({
        tableSelector: `#${props.data.modelLink}-table`,  // #tableID
        toolbarSelector: '#toolbar',                   // #toolbarID
        columns: columns2,
        hideColumns: defaultHide2, // hide default column. If there is no cookie
        cookieID: `${props.data.modelLink}-table`,               // define cookie id 
        functionGrid: GetGridviewData,
      });
    // };
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
        // if ($.inArray("view-booking-reservation", UserPermissions) >= 0) {
        //     getBRViewPermission = true;
        // }
        // if ($.inArray("view-quotation", UserPermissions) >= 0) {
        //     getQTViewPermission = true;
        // }
        // if ($.inArray("view-sales-invoice", UserPermissions) >= 0) {
        //     getINVViewPermission = true;
        // }
        // if ($.inArray("view-customer-payment", UserPermissions) >= 0) {
        //     getORViewPermission = true;
        // }
        // if ($.inArray("view-sales-credit-note", UserPermissions) >= 0) {
        //     getCNViewPermission = true;
        // }
        // if ($.inArray("view-sales-debit-note", UserPermissions) >= 0) {
        //     getDNViewPermission = true;
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

        // if (getBRViewPermission == false) {
        //     $.each($(".checkPermissionLinkBR"), function () {
        //         var oldherf = $(this).attr("href");
        //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

        //         $(this).attr("href", newUrl);
        //         $(this).attr("class", "NoPermissionLink");
        //         $(this).removeAttr("target");
        //     })
        // }

        // if (getQTViewPermission == false) {
        //     $.each($(".checkPermissionLinkQT"), function () {
        //         var oldherf = $(this).attr("href");
        //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

        //         $(this).attr("href", newUrl);
        //         $(this).attr("class", "NoPermissionLink");
        //         $(this).removeAttr("target");
        //     })
        // }

        // if (getINVViewPermission == false) {
        //     $.each($(".checkPermissionLinkINV"), function () {
        //         var oldherf = $(this).attr("href");
        //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

        //         $(this).attr("href", newUrl);
        //         $(this).attr("class", "NoPermissionLink");
        //         $(this).removeAttr("target");
        //     })
        // }

        // if (getORViewPermission == false) {
        //     $.each($(".checkPermissionLinkOR"), function () {
        //         var oldherf = $(this).attr("href");
        //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

        //         $(this).attr("href", newUrl);
        //         $(this).attr("class", "NoPermissionLink");
        //         $(this).removeAttr("target");
        //     })
        // }

        // if (getCNViewPermission == false) {
        //     $.each($(".checkPermissionLinkCN"), function () {
        //         var oldherf = $(this).attr("href");
        //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

        //         $(this).attr("href", newUrl);
        //         $(this).attr("class", "NoPermissionLink");
        //         $(this).removeAttr("target");
        //     })
        // }

        // if (getDNViewPermission == false) {
        //     $.each($(".checkPermissionLinkDN"), function () {
        //         var oldherf = $(this).attr("href");
        //         var newUrl = oldherf.replace(oldherf, "#"); // Create new url

        //         $(this).attr("href", newUrl);
        //         $(this).attr("class", "NoPermissionLink");
        //         $(this).removeAttr("target");
        //     })
        // }

      }

    });

    window.$("#document-matrix-table").on('reorder-column.bs.table', function (e, args) {
      var newLatestColumn = []
      if (getCookie(`document-matrix-table.bs.table.reorderColumns`)) {
  
        var getCookieArray = getCookie(`document-matrix-table.bs.table.reorderColumns`);
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

    GetAllDropDown(['BillOfLading',"Voyage"], globalContext).then(res => {
      var arrayBillOfLading = []
      var arrayVoyage = []
      $.each(res.BillOfLading, function (key, value) {
        if (value.VerificationStatus == "Approved") {
          arrayBillOfLading.push({ value: value.BillOfLadingUUID, label: value.DocNum })
        }

      })
      $.each(res.Voyage, function (key, value) {
        arrayVoyage.push({ value: value.VoyageUUID, label: value.VoyageNumber })
      })
      setBillOfLading(sortArray(arrayBillOfLading))
      setVoyage(sortArray(arrayVoyage))


    })


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

              </tr>

            </thead>

            <tbody>
              <tr>
                <td>
                  <div className="col mb-3 mt-3">
                    <label>Voyage:</label>

                  </div>
                </td>
                <td>
                  <div className="col-xs-12 col-md-12 mt-2">
                    <div className="form-group">

                      <Controller
                        name={"DynamicModel[Voyage]"}

                        control={control}

                        render={({ field: { onChange, value } }) => (
                          <Select
                            isClearable={true}
                            {...register("DynamicModel[Voyage]")}
                            value={value ? voyage.find(c => c.value === value) : null}
                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                            options={voyage}
                            menuPortalTarget={document.body}
                            className="basic-single Voyage"
                            classNamePrefix="select"
                            styles={globalContext.customStyles}

                          />
                        )}
                      />

                    </div>

                  </div>
                </td>

                <td>
                  <div className="col mb-3 mt-3">
                    <label>Bill Of Lading:</label>

                  </div>
                </td>
                <td>
                  <div className="col-xs-12 col-md-12 mt-2">
                    <div className="form-group">

                      <Controller
                        name={"DynamicModel[BillOfLading]"}

                        control={control}

                        render={({ field: { onChange, value } }) => (
                          <Select
                            isClearable={true}
                            {...register("DynamicModel[BillOfLading]")}
                            value={value ? billOfLading.find(c => c.value === value) : null}
                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                            options={billOfLading}
                            menuPortalTarget={document.body}
                            className="basic-single BillOfLading"
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
                    <button type="button" className="btn btn-success float-right" onClick={() => handleGenerate()}>Generate</button>
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

    </div>






  )
}






export default Form