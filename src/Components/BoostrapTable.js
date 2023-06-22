
import React, { useState, useContext } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Throw, ToastNotify, Remove, PreviewBillOfLading, getCookie, PreviewINVCNDN, getTransferFromQuotationData, PreviewBR, getSplitDataBR, PreviewOR, GetMergeBR, PreviewBC, Verify, cancelApprovedReject, ImportContainer, RejectRecord, Approved, CheckDOStatus, TelexRelease, Reject, GetMergeBLList, GetMergeBRList, GetBillOfLadingContainers, GetBookingReservationsContainers, RevertSplitBL, RejectUser, Suspend, Reset, ControlOverlay, Preview, PreviewLetter, GetUpdateDND, CreateBC, getRemainingBCbyID, checkBCTransfer, getBookingConfirmationHasContainerType } from './Helper.js'
import axios from "axios"
import { DNDModal, TransferFromBC, TransferPartialBCModal, TransferPartialCNDNModal } from "./ModelsHelper.js"
import ContainerTemplate from '../Assets/files/containers_template.xls';

function BoostrapTable(props) {

  var selections = [];
  var selectedRow = [];
  var arraycheck = [];
  var arrayGenerateDO = [];
  var arrayDOUUID = [];
  var arrayLatestColumn = [];

  var tempModel;
  if (props.companyType !== "") {
    tempModel = props.companyType.toLowerCase()
  } else {
    tempModel = props.title
  }


  if (props.host.userRule !== "") {
    if (tempModel == "credit-note" || tempModel == "debit-note") {
      tempModel = `sales-${tempModel}`
    }
    if(tempModel=="terminal"){
      tempModel="port-details"
    }

    if(tempModel=="port"){
      tempModel="area"
    }
    if(tempModel=="u-n-number"){
      tempModel="un-number"
    }

    if(tempModel=="h-s-code"){
      tempModel="hs-code"
    }
  
    const objRule = JSON.parse(props.host.userRule);
    if (tempModel == "sales-invoice") {
      if (props.thirdParty == "1") {
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes("third-party-invoice");
        });
      } else {
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(tempModel) || item.includes("sales-debit-note") || item.includes("sales-credit-note");
        });
      }

    } else if (tempModel == "sales-invoice-barge") {
      if (props.thirdParty == "1") {
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes("third-party-invoice-barge");
        });
      } else {
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(tempModel) || item.includes("sales-debit-note-barge") || item.includes("sales-credit-note-barge");
        });
      }
    } else if (tempModel == "quotation" || tempModel == "quotation-barge") {
      var tempModel2;
      tempModel == "quotation-barge" ? tempModel2 = "booking-reservation-barge" : tempModel2 = "booking-reservation"
      var filteredAp = objRule.Rules.filter(function (item) {
        return item.includes(tempModel) || item.includes(tempModel2)
      });

    } else if (tempModel == "booking-reservation") {
      var filteredAp = objRule.Rules.filter(function (item) {
        return item.includes(tempModel) || item.includes("sales-invoice") || item.includes("container-release-order")
      });
    } else if (tempModel == "booking-reservation-barge") {
      var filteredAp = objRule.Rules.filter(function (item) {
        return item.includes(tempModel) || item.includes("sales-invoice-barge") || item.includes("container-release-order-barge")
      });

    }
    else {
      var filteredAp = objRule.Rules.filter(function (item) {
        return item.includes(tempModel);
      });
    }

  }
  // if (props.data.columnSetting == "company") {
  //   params.type ? tempModel = params.type.toLowerCase() : tempModel = props.data.columnSetting
  // } else {
  //   tempModel = props.data.columnSetting
  // }



  window.$("#update").prop('disabled', true)
  window.$("#generate").prop('disabled', true)
  window.$("#trash").prop('disabled', true)
  window.$("#removeModal").prop('disabled', true)
  window.$("#approved").prop('disabled', true)
  window.$("#preview").prop('disabled', true)
  window.$("#previewCRO").prop('disabled', true)
  window.$("#previewCNDN").prop('disabled', true)
  window.$("#previewBR").prop('disabled', true)
  window.$("#previewOR").prop('disabled', true)
  window.$("#telexRelease").prop('disabled', true)
  window.$("#split").prop('disabled', true)
  window.$("#previewBL").prop('disabled', true)
  window.$("#merge").prop('disabled', true)
  window.$("#revertSplit").prop('disabled', true)
  window.$("#dndButton").prop('disabled', true)
  window.$("#transfer").prop('disabled', true)
  window.$("#transfertocroinv").prop('disabled', true)
  window.$("#transfertocndn").prop('disabled', true)
  window.$("#confirm").prop('disabled', true)

  function columnSetup(columns) {
    if(columns){
      var NewColumn=columns.map(obj => ({ ...obj }));
      arrayLatestColumn=NewColumn
      //check for reorder column cookies
      if (getCookie(`${props.tableId}.bs.table.reorderColumns`)) {
        var getCookieArray = getCookie(`${props.tableId}.bs.table.reorderColumns`);
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

    if (props.type == "formTable") {
      var res = []
    } else if (props.tableId == "dnd") {
      var res = []
    }
    else {
      var res = [
        {
          field: 'state',
          checkbox: true,
          rowspan: 1,
          align: 'center',
          valign: 'middle'
        }
      ];
    }

    window.$.each(columns, function (i, column) {
      if (column.field == "operate") {
        column.sortable = false;
        column.align = 'center';
        // column.switchable = false;
        column.valign = 'middle';
        res.push(column);
      }
      else {
        column.sortable = true;
        column.align = 'center';
        // column.switchable = false;
        column.valign = 'middle';
        res.push(column);
      }

    })

    return res;
  }

  function getIdSelections() {

    return window.$.map(window.$("#" + props.tableSelector).bootstrapTable('getSelections'), function (element) {

      return element.id
    })
  }


  function GridActions() {

    var toggleValidAllDetails = {
      icon: 'fa-check-square',
      event: function () {
        var $table = window.$("#" + props.tableSelector)
        var button = window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i");
        if (button.hasClass("fa-check-square") && button.hasClass("fa")) {
          window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-check-square");
          window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "All");
          $table.bootstrapTable('refresh')
        } else if (button.hasClass("fa-check-square") && button.hasClass("far")) {
          window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-square");
          window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Invalid");
          $table.bootstrapTable('refresh')
        } else if (button.hasClass("fa-square")) {
          window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "fa fa-check-square");
          window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Valid");
          $table.bootstrapTable('refresh')
        }
      },
      attributes: {
        title: 'Valid'
      }
    };

    return {
      toggleValidAll: toggleValidAllDetails,
    }

  }

  if (props.type == "formTable") {
    window.$("#" + props.tableSelector).unbind().bootstrapTable('destroy').bootstrapTable({
      buttons: GridActions(),
      ajax: props.functionGrid,
      showRefresh: true,
      showExport: true,
      clickToSelect: true,
      exportTypes: ['excel', 'xlsx', 'pdf'],
      filterControl: true,
      showColumns: true,
      toolbar: props.toolbarSelector,
      sidePagination: 'server',
      showExport: true,
      exportTypes: ['excel', 'xlsx', 'pdf'],
      // cookie: "true",
      // cookieExpire: '10y',
      showColumnsToggleAll: true,
      pagination: true,
      pageList: [10, 25, 50, 100, 'all'],
      columns: columnSetup(props.columns),
    });

  } else {
   
    window.$("#" + props.tableSelector).unbind().bootstrapTable('destroy').bootstrapTable({
      buttons: GridActions(),
      ajax: props.functionGrid,
      showRefresh: true,
      showExport: true,
      clickToSelect: true,
      exportTypes: ['excel', 'xlsx', 'pdf'],
      filterControl: true,
      showColumns: true,
      toolbar: props.toolbarSelector,
      sidePagination: 'server',
      showExport: true,
      exportTypes: ['excel', 'xlsx', 'pdf'],
      cookie: "true",
      cookieExpire: '10y',
      resizable: true,
      reorderableColumns: true,
      cookieIdTable: props.cookieID,
      showColumnsToggleAll: true,
      pagination: true,
      pageList: [10, 25, 50, 100, 'all'],
      columns: columnSetup(props.columns),
      responseHandler: function (res) {
        window.$.each(res.rows, function (i, row) {
          row.state = window.$.inArray(row.id, selections) !== -1
        })
        return res
      },
      onRefresh: function (params) {
        selections = [];
        selectedRow = [];
      },
      onPreBody: function (data) {
        window.$('.fixed-table-body').css('overflow-y', 'hidden');
      },
      onLoadSuccess: function (data) {

        window.$("#" + props.tableSelector).bootstrapTable('resetView');

        var exportAcess = filteredAp.find((item) => item == `export-${tempModel}`) !== undefined
        if (!exportAcess) {
          window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled", true)
        } else {
          window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled", false)
        }

        if (window.$("#" + props.tableSelector).bootstrapTable("getCookies")['columns'] == null) {
          window.$.each(props.hideColumns, function (key, value) {
            window.$("#" + props.tableSelector).bootstrapTable('hideColumn', value);
          });

        }
      }
    });
  }



 

  window.$("#" + props.tableSelector).on('uncheck.bs.table', function (row, element, field) {
    if (props.title == "delivery-order" || props.title == "delivery-order-barge") {
      window.$.each(arraycheck, function (key1, value1) {
        if (value1.uuid == element.BillOfLadingUUID) {
          arraycheck.splice(key1, 1);
          arrayGenerateDO.splice(key1, 1);
          return false;
        }
      })

      window.$.each(arraycheck, function (key1, value1) {
        // if($getGenerateDOPermission==true){

        if (value1.status == "Pending" || value1.status == "Generated") {
          window.$("#generate").prop("disabled", true)
          return false;
        }
        else {

          window.$("#generate").prop("disabled", false)
        }
        //}
      })
    }


  });


  window.$("#" + props.tableSelector).on('check.bs.table', function (row, element, field) {
    window.$("#update").prop('disabled', false)
    window.$("#generate").prop('disabled', false)
    window.$("#trash").prop('disabled', false)
    window.$("#removeModal").prop('disabled', false)
    window.$("#approved").prop('disabled', false)
    window.$("#preview").prop('disabled', false)
    window.$("#previewCRO").prop('disabled', false)
    window.$("#previewCNDN").prop('disabled', false)
    window.$("#previewBR").prop('disabled', false)
    window.$("#previewOR").prop('disabled', false)
    window.$("#previewBL").prop('disabled', false)
    window.$("#telexRelease").prop('disabled', false)
    window.$("#split").prop('disabled', false)
    window.$("#merge").prop('disabled', false)
    window.$("#revertSplit").prop('disabled', false)
    window.$("#dndButton").prop('disabled', false)
    window.$("#transfer").prop('disabled', false)
    window.$("#transfertocroinv").prop('disabled', false)
    window.$("#transfertocndn").prop('disabled', false)


    if (props.title == "delivery-order" || props.title == "delivery-order-barge") {
      var statusTemp = "";
      if (element.BLStatus == "Generated") {
        statusTemp = "Generated";
        var generateList = {
          uuid: element.BillOfLadingUUID,
          status: statusTemp
        }
        arraycheck.push(generateList)
        arrayGenerateDO.push(element.BillOfLadingUUID)

      } else if (element.BLStatus == "Ready") {
        statusTemp = "Ready";
        var generateList = {
          uuid: element.BillOfLadingUUID,
          status: statusTemp
        }
        arraycheck.push(generateList)
        arrayGenerateDO.push(element.BillOfLadingUUID)
      } else {
        statusTemp = "Pending";
        var generateList = {
          uuid: element.BillOfLadingUUID,
          status: statusTemp
        }
        arraycheck.push(generateList)
        arrayGenerateDO.push(element.BillOfLadingUUID)
      }
      window.$.each(arraycheck, function (key1, value1) {
        if (value1.status == "Pending" || value1.status == "Generated") {
          window.$("#generate").prop("disabled", true)
          return false;
        } else {
          window.$("#generate").prop("disabled", false)
        }

      })
    }


  })




  window.$("#" + props.tableSelector).unbind().on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table',

    function (e, rowsAfter, rowsBefore, field) {
      if (props.tableSelector == "rule-set") {
        window.$(".ruleId").val(rowsAfter.RuleSetUUID)

      }
      if (props.tableSelector == "user") {
        window.$(".ruleId").val(rowsAfter.id)

      }

      if (props.tableId !== "delivery-order" || props.tableId !== "delivery-order-barge") {
        window.$("#update").prop('disabled', false)
        window.$("#generate").prop('disabled', false)
        window.$("#trash").prop('disabled', false)
        window.$("#removeModal").prop('disabled', false)
        window.$("#approvedUser").prop('disabled', false)
        window.$("#reset").prop('disabled', false)
        window.$("#suspend").prop('disabled', false)
        window.$("#approved").prop('disabled', false)
        window.$("#preview").prop('disabled', false)
        window.$("#previewCRO").prop('disabled', false)
        window.$("#previewCNDN").prop('disabled', false)
        window.$("#previewBR").prop('disabled', false)
        window.$("#previewOR").prop('disabled', false)
        window.$("#previewBL").prop('disabled', false)
        window.$("#telexRelease").prop('disabled', false)
        window.$("#split").prop('disabled', false)
        window.$("#merge").prop('disabled', false)
        // window.$("#revertSplit").prop('disabled', false)
        window.$("#dndButton").prop('disabled', false)
        window.$("#transfer").prop('disabled', false)
        window.$("#transfertocroinv").prop('disabled', false)
        window.$("#transfertocndn").prop('disabled', false)
        window.$("#confirm").prop('disabled', false)
      }






      var rows = rowsAfter
      if (e.type === 'uncheck-all') {
        rows = rowsBefore
      }
      var ids = window.$.map(!window.$.isArray(rows) ? [rows] : rows, function (row) {

        return row.id
      })
      var rowSelected = window.$.map(!window.$.isArray(rows) ? [rows] : rows, function (row) {

        return row

      })

      var func = window.$.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

      var func1 = window.$.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

      selectedRow = window._[func](selectedRow, rowSelected)


      if (props.tableId == "bill-of-lading") {
        if (selectedRow.every(obj => obj.SplitParent !== null)) {
          window.$("#revertSplit").prop('disabled', false)
        } else {
          window.$("#revertSplit").prop('disabled', true)
        }

      }



      selections = window._[func1](selections, ids)
      if (props.tableId !== "delivery-order" || props.tableId !== "delivery-order-barge") {
        if (selectedRow.length == 1) {
          if (selectedRow[0]["VerificationStatus"] != "Approved") {
            window.$("#transfer").prop('disabled', true)
            window.$("#transfertocroinv").prop('disabled', true)
            window.$("#transfertocndn").prop('disabled', true)
          }
        }

        // var CheckSelectedRow = [];
        if (selections.length > 1) {
          window.$("#update").prop('disabled', true)
          window.$("#generate").prop('disabled', true)
          window.$("#preview").prop('disabled', true)
          window.$("#previewCRO").prop('disabled', true)
          window.$("#previewCNDN").prop('disabled', true)
          window.$("#previewBR").prop('disabled', true)
          window.$("#previewOR").prop('disabled', true)
          window.$("#previewBL").prop('disabled', true)
          window.$("#split").prop('disabled', true)
          window.$("#merge").prop('disabled', true)
          window.$("#transfer").prop('disabled', true)
          window.$("#transfertocroinv").prop('disabled', true)
          window.$("#transfertocndn").prop('disabled', true)
        }

        if (selections.length <= 0) {
          window.$("#update").prop('disabled', true)
          window.$("#approved").prop('disabled', true)
          window.$("#trash").prop('disabled', true)
          window.$("#removeModal").prop('disabled', true)
          window.$("#generate").prop('disabled', true)
          window.$("#preview").prop('disabled', true)
          window.$("#previewCRO").prop('disabled', true)
          window.$("#previewCNDN").prop('disabled', true)
          window.$("#previewBR").prop('disabled', true)
          window.$("#previewOR").prop('disabled', true)
          window.$("#previewBL").prop('disabled', true)
          window.$("#split").prop('disabled', true)
          window.$("#merge").prop('disabled', true)
          window.$("#dndButton").prop('disabled', true)
          window.$("#transfer").prop('disabled', true)
          window.$("#transfertocroinv").prop('disabled', true)
          window.$("#transfertocndn").prop('disabled', true)
          window.$("#confirm").prop('disabled', true)
        }
      }
    }
  )

  window.$("#" + props.tableSelector).on('reorder-column.bs.table', function (e, args) {
    var newLatestColumn = []
    if (getCookie(`${props.tableId}.bs.table.reorderColumns`)) {

      var getCookieArray = getCookie(`${props.tableId}.bs.table.reorderColumns`);
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
  window.$("#" + props.tableSelector).on('dbl-click-row.bs.table', function (row, element, field) {
    // navigate with props
    if (props.title !== "dnd") {
      if (props.companyType !== "") {
        props.navigate(props.routeName + '/update/id=' + element.id + "/type=" + props.companyType, { state: { id: element.id, formType: "Update" } })
      }
      else if (props.title == "delivery-order" || props.title == "delivery-order-barge") {
        if (element.DeliveryOrderUUID) {
          props.navigate(props.routeName + '/update/id=' + element.DeliveryOrderUUID, { state: { id: element.DeliveryOrderUUID, formType: "Update" } })
        } else {
          alert("Delivery Order haven't been Generated");
        }
      }
      else {
        if (props.thirdParty == "1") {
          props.navigate(props.routeName + '/update/id=' + element.id + "&thirdparty=1", { state: { id: element.id, formType: "Update" } })
        } else {
          props.navigate(props.routeName + '/update/id=' + element.id, { state: { id: element.id, formType: "Update" } })
        }

      }
    }



  })

  window.$("#update").unbind().click(function () {
    var id = getIdSelections()

    props.navigate(props.routeName + '/update/id=' + id[0], { state: { id: id[0], formType: "Update" } })

  });
  window.$("#confirm").unbind().click(function () {
    var type;
    props.title == "booking-reservation-barge" ? type = "barge" : type = "normal"

    if (filteredAp.includes(`confirm-${tempModel}`)) {
      CreateBC(selections, props.host, "booking-reservation", type).then(res => {
        if (res.Confirmed) {
          if (res.Confirmed.length > 0) {
            ToastNotify("success", "Booking Reservation is confirmed.")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }
        }
        if (res.message) {
          ToastNotify("error", res.message, 5000)
        }
        // if(res.Failed.length > 0){
        //   var uuids = []
        //   window.$.each(res.Failed, function (key, value) {
        //     uuids.push(value.DocNum)
        //   })
        //     ToastNotify("error", uuids.toString(",") + " Failed to Confirm.", 5000)
        // }
        if (res.Expired) {
          if (res.Expired.length > 0) {
            var uuids = []
            window.$.each(res.Expired, function (key, value) {
              uuids.push(value.DocNum)
            })
            ToastNotify("error", uuids.toString(",") + " was Expired.", 5000)
          }
        }

      })
    } else {
      alert("You are not allowed to Confirm, Please check your Permission.")
    }

  })

  window.$("#TransferToPartial").off('click').on('click', function () {
    var temValue;
    tempModel == "booking-reservation" ? temValue = "create-sales-invoice" : temValue = "create-sales-invoice-barge";
    var type;
    props.title == "sales-invoice-barge" ? type = "barge" : type = "normal"
    var BC = window.$("input[name=BC]").val()
    if (filteredAp.includes(`transferto-${tempModel}`) && filteredAp.includes(temValue)) {
      var BC = selectedRow[0]["BookingConfirmationUUID"]
        if (BC == "" || BC == null) {
          alert("Booking Reservation has not been confirmed")
        }

      getRemainingBCbyID(BC, props.host, type).then(res => {

        if (res) {
          window.$("input[name='BookingConfirmationUUIDForPartial']").val(selectedRow[0].BookingConfirmationUUID)
          window.$("#TransferToSalesInvoiceModal").modal("toggle")
        }else{
          alert('This booking has been fully transferred')
        }
      })

        

      
    } else {
      alert("You are not allowed to transfer to Sales Invoice, Please check your Permission.")
    }

  })

  window.$("#TransferPartialFromBC").off('click').on('click', function () {
    if (filteredAp.includes(`transferfrom-${tempModel}`) && filteredAp.includes(`create-${tempModel}`)) {
      window.$("input[name='BookingConfirmationUUIDForPartial']").val(window.$("input[name='BC']").val())
      window.$("#TransferToSalesInvoiceModal").modal("toggle")
    } else {
      alert("You are not allowed to transfer from Booking Reservation, Please check your Permission.")
    }

  })


  window.$("#trash").click(function () {
    var object = {}
    if (props.selectedId == "PortUUIDs") {
      props.selectedId = "AreaUUIDs"
    }
    if (props.selectedId == "TerminalUUIDs") {
      props.selectedId = "PortDetailsUUIDs"
    }
    if (props.selectedId == "CreditNoteUUIDs") {
      props.selectedId = "SalesCreditNoteUUIDs"
    }
    if (props.selectedId == "DebitNoteUUIDs") {
      props.selectedId = "SalesDebitNoteUUIDs"
    }

    var deliveryOrderID = window.$.map(selectedRow, function (value) {
      return value.DeliveryOrderUUID

    })
    if (props.title == "delivery-order" || props.title == "delivery-order-barge") {
      object[props.selectedId] = deliveryOrderID
    } else {
      object[props.selectedId] = selections
    }

    if (selections.length > 0) {
      if (props.title == "delivery-order" || props.title == "delivery-order-barge") {
        if (deliveryOrderID.length > 0) {
          Throw(props.host, props.tableId, object).then(res => {
            if (res.ThrowSuccess.length > 0) {
              ToastNotify("success", "Successfully Threw")
              window.$("#" + props.tableSelector).bootstrapTable('refresh')
              window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            }

            if (res.RetrieveSuccess.length > 0) {
              ToastNotify("success", "Successfully Retrieved")
              window.$("#" + props.tableSelector).bootstrapTable('refresh')
              window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            }
          })
        } else {
          alert("Delivery Order does not exist")
        }

      } else {
        Throw(props.host, props.tableId, object).then(res => {
          if (res.ThrowSuccess.length > 0) {
            ToastNotify("success", "Successfully Threw")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }

          if (res.RetrieveSuccess.length > 0) {
            ToastNotify("success", "Successfully Retrieved")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }
        })
      }

    }

  })

  window.$("#Realremove").off('click').on('click', function () {
    var object = {}
    if (props.selectedId == "PortUUIDs") {
      props.selectedId = "AreaUUIDs"
    }
    if (props.selectedId == "TerminalUUIDs") {
      props.selectedId = "PortDetailsUUIDs"
    }
    if (props.selectedId == "CreditNoteUUIDs") {
      props.selectedId = "SalesCreditNoteUUIDs"
    }
    if (props.selectedId == "DebitNoteUUIDs") {
      props.selectedId = "SalesDebitNoteUUIDs"
    }

    var deliveryOrderID = window.$.map(selectedRow, function (value) {
      return value.DeliveryOrderUUID

    })
    if (props.title == "delivery-order" || props.title == "delivery-order-barge") {
      object[props.selectedId] = deliveryOrderID
    } else {
      object[props.selectedId] = selections
    }

    if (selections.length > 0) {
      if (props.title == "delivery-order" || props.title == "delivery-order-barge") {

        if (deliveryOrderID.length > 0) {
          Remove(props.host, props.tableId, object).then(res => {
            if (res.Success.length > 0) {
              ToastNotify("success", "Successfully removed")
              window.$("#" + props.tableSelector).bootstrapTable('refresh')
              window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            }

            if (res.Failed.length > 0) {
              ToastNotify("error", "Cannot remove")
              window.$("#" + props.tableSelector).bootstrapTable('refresh')
              window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            }
          })
        } else {
          alert("Delivery Order does not exist")
        }


      } else {
        Remove(props.host, props.tableId, object).then(res => {
          if (res.Success.length > 0) {
            ToastNotify("success", "Successfully removed")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }

          if (res.Failed.length > 0) {
            ToastNotify("error", "Cannot remove")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }
        })
      }

    }
    window.$("#ButtonRemoveModal").modal('toggle')

  });


  window.$("#RealApproved").click(function () {
    var object = {}

    object[props.selectedId] = selections
    if (selections.length > 0) {
      if (filteredAp.includes(`verify-${tempModel}`)) {
        ControlOverlay(true)
        Approved(props.host, props.tableId, object).then(res => {
          if (res.Success.length > 0) {
            ToastNotify("success", "Successfully approved")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }

          if (res.Failed.length > 0) {
            ToastNotify("error", "Cannot approved")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }
          ControlOverlay(false)
        })
        window.$("#ButtonApprovedModal").modal('toggle')
      } else {
        alert("You are not allowed to perform Approved, Please check your Permission.")
        ControlOverlay(false)
      }

    }


  });

  window.$("#RealReset").click(function () {
    var object = {}
    object[props.selectedId] = selections
    var profileInfo = JSON.parse(localStorage.getItem('authorizeInfos'));
    if (selections.length > 0) {
      if (filteredAp.includes(`verify-${tempModel}`)) {
        ControlOverlay(true)
        Reset(props.host, props.tableId, object).then(res => {
          if (res.Success.length > 0) {
            ToastNotify("success", "Successfully Reset")

            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')

            const result = object.UserUUIDs.find(element => element == profileInfo.id);
            if (result) {
              localStorage.removeItem('authorizeInfos')
              props.host.setToken(null)
            }
          }

          if (res.Failed.length > 0) {
            ToastNotify("error", "Cannot Reset")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }
          ControlOverlay(false)
        })
        window.$("#ButtonResetModal").modal('toggle')
      } else {
        alert("You are not allowed to perform Reset, Please check your Permission.")
        ControlOverlay(false)
      }

    }


  });



  window.$("#RealSuspend").click(function () {
    var object = {}

    object[props.selectedId] = selections
    var profileInfo = JSON.parse(localStorage.getItem('authorizeInfos'));

    if (selections.length > 0) {
      if (filteredAp.includes(`verify-${tempModel}`)) {
        ControlOverlay(true)
        Suspend(props.host, props.tableId, object).then(res => {
          if (res.Success.length > 0) {
            ToastNotify("success", "Successfully Suspend")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')

            const result = object.UserUUIDs.find(element => element == profileInfo.id);
            if (result) {
              localStorage.removeItem('authorizeInfos')
              props.host.setToken(null)
            }
          }

          if (res.Failed.length > 0) {
            ToastNotify("error", "Cannot Suspend")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          }
          ControlOverlay(false)
        })
        window.$("#ButtonSuspendModal").modal('toggle')
      } else {
        alert("You are not allowed to perform Suspend, Please check your Permission.")
        ControlOverlay(false)
      }

    }


  });

  window.$('#ButtonSuspendModal').on('show.bs.modal', function () {
    window.$(".suspendbody").text("")

    var userArray = []
    window.$.each(selectedRow, function (key, value) {
      userArray.push(value.username)
    })

    var stringArray = userArray.toString()
    window.$(".suspendbody").text(stringArray)

  })

  window.$('#ButtonResetModal').on('show.bs.modal', function () {
    window.$(".resetbody").text("")

    var userArray = []
    window.$.each(selectedRow, function (key, value) {
      userArray.push(value.username)
    })

    var stringArray = userArray.toString()
    window.$(".resetbody").text(stringArray)

  })


  window.$('#ButtonApprovedModal').on('show.bs.modal', function () {
    window.$(".approvedbody").text("")

    var userArray = []
    window.$.each(selectedRow, function (key, value) {
      userArray.push(value.username)
    })

    var stringArray = userArray.toString()
    window.$(".approvedbody").text(stringArray)

  })

  // window.$('#ButtonVerifyModalForm').on('show.bs.modal', function (e) {
  //   if (selectedRow.length > 0) {
  //     const allApproved = selectedRow.every(obj => obj.VerificationStatus === "Approved")
  //     if (allApproved) {
  //       window.$("#verifyFirst").text("Cancel Approved")
  //     } else {
  //       window.$("#verifyFirst").text("Approved")
  //     }
  //   } else {
  //     window.$("#verifyFirst").text("Approved")
  //   }
  // })
  window.$("#verifyFirst").click(function () {
    window.$(".rejectMessage").val("")
    window.$("#ButtonVerifyConfirmModal").modal("toggle");
    window.$("#rejectStatus").addClass("d-none")
    window.$("#verify").removeClass("d-none")
    window.$("#cancelApprovedReject").addClass("d-none")
    window.$(".rejectMessageRow").addClass("d-none")
    if (window.$("#verifyFirst").text() == "Cancel Approved") {
      window.$("#ButtonVerifyConfirmModal").find(".message").text("Are you sure you want to cancel approved these data")
      window.$("#verify").text("Cancel Approved")
    } else {
      window.$("#ButtonVerifyConfirmModal").find(".message").text("Are you sure you want to approve these data?")
      window.$("#verify").text("Approved")
    }

  });

  window.$("#rejectStatusFirst").click(function () {
    window.$(".rejectMessage").val("")
    window.$("#ButtonVerifyConfirmModal").modal("toggle");
    window.$("#verify").addClass("d-none")
    window.$("#cancelApprovedReject").addClass("d-none")
    window.$("#rejectStatus").removeClass("d-none")
    if (props.tableId == "quotation" || props.tableId == "quotation-barge") {
      window.$(".rejectMessageRow").removeClass("d-none")
    } else {
      window.$(".rejectMessageRow").addClass("d-none")
    }
    window.$("#ButtonVerifyConfirmModal").find(".message").text("Are you sure you want to reject these data?")
  });

  window.$("#cancelApproveRejectFirst").click(function () {
    window.$(".rejectMessage").val("")
    window.$("#ButtonVerifyConfirmModal").modal("toggle");
    window.$("#verify").addClass("d-none")
    window.$("#rejectStatus").addClass("d-none")
    window.$("#cancelApprovedReject").removeClass("d-none")
    window.$(".rejectMessageRow").addClass("d-none")
    window.$("#ButtonVerifyConfirmModal").find(".message").text("Are you sure you want to cancel approved/reject these data?")
  });

  window.$("#verify").off("click").on("click", function () {

    var object = {}
    if (props.selectedId == "CreditNoteUUIDs") {
      props.selectedId = "SalesCreditNoteUUIDs"
    }
    if (props.selectedId == "DebitNoteUUIDs") {
      props.selectedId = "SalesDebitNoteUUIDs"
    }
    ControlOverlay(true)
    object[props.selectedId] = selections
    if (props.tableId == "bill-of-lading") {

      if (selections.length > 0) {
        Verify(props.host, props.tableId, object).then(res => {
          if (res.Failed && res.Failed.length > 0) {
            var saleInvoiceNum = []
            var emptyChargesNum = []
            var failedNum = res.Failed.map((obj) => obj.DocNum);

            if (res.Verify && res.Verify.length > 0) {
              window.$.each(res.Verify, function (key, value) {
                if (value.SalesInvoice) {
                  saleInvoiceNum.push(value.SalesInvoice)
                }
                if (value.message == "Cannot generate Sales Invoice, empty charges for Freight Prepaid") {
                  emptyChargesNum.push(value.DocNum)
                }
              })

            }
            if (saleInvoiceNum.length > 0 || emptyChargesNum.length > 0) {
              window.$("#SalesInvoiceMessageModal").modal("toggle")
              if (saleInvoiceNum.length > 0) {
                window.$("#SalesInvoiceMessageModal").find(".InvMessage").html(`Sales Invoice has been successfully generated. The invoice number would be ${saleInvoiceNum.join(",")}`)
              }
              if (emptyChargesNum.length > 0) {
                window.$("#SalesInvoiceMessageModal").find(".InvMessage2").html(`${emptyChargesNum.join(",")} cannot generate Sales Invoice, empty charges for Freight Prepaid`)
              }
              if (failedNum.length > 0) {
                window.$("#SalesInvoiceMessageModal").find(".InvMessage3").html(`${failedNum.join(",")} Booking need to be confirmed`)
              }
              ToastNotify("success", "Successfully Approved")
              window.$("#" + props.tableSelector).bootstrapTable('refresh')
              window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
              ControlOverlay(false)
            } else {

              ToastNotify("error", "Booking need to be confirmed")
              window.$("#" + props.tableSelector).bootstrapTable('refresh')
              window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
              ControlOverlay(false)
            }



          }
          else if (res.Verify && res.Verify.length > 0) {
            var saleInvoiceNum = []
            var emptyChargesNum = []
            window.$.each(res.Verify, function (key, value) {
              if (value.SalesInvoice) {
                saleInvoiceNum.push(value.SalesInvoice)
              }
              if (value.message == "Cannot generate Sales Invoice, empty charges for Freight Prepaid") {
                emptyChargesNum.push(value.DocNum)
              }
            })
            if (saleInvoiceNum.length > 0) {
              window.$("#SalesInvoiceMessageModal").modal("toggle")
              window.$("#SalesInvoiceMessageModal").find(".InvMessage").html(`Sales Invoice has been successfully generated. The invoice number would be ${saleInvoiceNum.join(",")}`)

              if (emptyChargesNum.length > 0) {
                window.$("#SalesInvoiceMessageModal").find(".InvMessage2").html(`${emptyChargesNum.join(",")} cannot generate Sales Invoice, empty charges for Freight Prepaid`)
              }
              ToastNotify("success", "Successfully Approved")
              window.$("#" + props.tableSelector).bootstrapTable('refresh')
              window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
              ControlOverlay(false)
            } else if (emptyChargesNum.length > 0) {
              if (emptyChargesNum.length > 0) {
                window.$("#SalesInvoiceMessageModal").modal("toggle")
                window.$("#SalesInvoiceMessageModal").find(".InvMessage2").html(`${emptyChargesNum.join(",")} cannot generate Sales Invoice, empty charges for Freight Prepaid`)
                ToastNotify("success", "Successfully Approved")
                window.$("#" + props.tableSelector).bootstrapTable('refresh')
                window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
                ControlOverlay(false)
              }
            }

          }

          // if (res.Failed.length > 0) {

          // }

        })
      }

    } else {
      if (selections.length > 0) {
        Verify(props.host, props.tableId, object).then(res => {
          if (res.Verify.length > 0) {
            ToastNotify("success", "Successfully Approved")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            ControlOverlay(false)
          }

          if (res.Failed.length > 0) {
            ToastNotify("error", "Cannot Approved")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            ControlOverlay(false)
          }

        })
      }
    }

    window.$("#ButtonVerifyModalForm").modal('toggle')

  });


  window.$("#cancelApprovedReject").off("click").on("click", function () {

    var object = {}
    ControlOverlay(true)
    object[props.selectedId] = selections
    if (selections.length > 0) {
      cancelApprovedReject(props.host, props.tableId, object).then(res => {
        if (res.Pending.length > 0) {
          ToastNotify("success", "Successfully Cancel Approved/Reject")
          window.$("#" + props.tableSelector).bootstrapTable('refresh')
          window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          ControlOverlay(false)
        }

        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot Approved/Reject")
          window.$("#" + props.tableSelector).bootstrapTable('refresh')
          window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
          ControlOverlay(false)
        }

      })
    }
    window.$("#ButtonVerifyModalForm").modal('toggle')

  });

  window.$("#rejectStatus").off("click").on("click", function () {

    var object = {}
    var objectRejectMessage = {}
    object[props.selectedId] = selections

    objectRejectMessage[props.selectedId] = selections
    objectRejectMessage["RejectMessage"] = window.$(".rejectMessage").val()

    if (selections.length > 0) {

      if (props.tableId == "quotation" || props.tableId == "quotation-barge") {
        if (window.$(".rejectMessage").val() !== "") {
          ControlOverlay(true)
          RejectRecord(props.host, props.tableId, objectRejectMessage).then(res => {
            ToastNotify("success", "Successfully Reject")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            ControlOverlay(false)

          })
          window.$("#ButtonVerifyModalForm").modal('toggle')
        } else {
          alert('Please fill in the reject message')
          return false;
        }

      } else {
        ControlOverlay(true)
        Reject(props.host, props.tableId, object).then(res => {
          if (res.Reject.length > 0) {
            ToastNotify("success", "Successfully Reject")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            ControlOverlay(false)
          }

          if (res.Failed.length > 0) {
            ToastNotify("error", "Cannot Reject")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
            ControlOverlay(false)
          }

        })
        window.$("#ButtonVerifyModalForm").modal('toggle')

      }
    }


  });

  window.$("#preview").off('click').on('click', function () {
    var object = {}
    if (props.title == "delivery-order" || props.title == "delivery-order-barge") {
      var previewID = selectedRow[0]["DeliveryOrderUUID"]
    } else {
      var previewID = selections[0]
    }
    if (selections.length == 1) {
      Preview(props.host, props.tableId, previewID).then(res => {
        var file = new Blob([res.data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);
        window.$('#PreviewPdfModal').modal("toggle")
        window.$('#pdfFrameList').attr('src', url);
      })
    }
  });


  window.$("#previewCRO").off('click').on('click', function () {
    window.$('#PreviewPdfCROModal').modal("toggle")

  });

  window.$("#previewBL").off('click').on('click', function () {
    window.$('#PreviewPdfBLModal').modal("toggle")

  });

  window.$("#previewCNDN").off('click').on('click', function () {
    window.$('#PreviewPdfCNDNModal').modal("toggle")

  });

  window.$("#previewBR").off('click').on('click', function () {
    if (selectedRow[0]["BookingConfirmationUUID"]) {
      window.$("#bookingConfirmationPDF").removeClass("d-none")
    } else {
      window.$("#bookingConfirmationPDF").addClass("d-none")
    }
    window.$('#PreviewPdfBRModal').modal("toggle")

  });

  window.$("#previewOR").off('click').on('click', function () {
    if (selectedRow[0]["MoreThanOneSLOrDB"] == "yes") {
      window.$("#customerPaymentDetailPDF").addClass("d-none")
    } else {
      window.$("#customerPaymentDetailPDF").removeClass("d-none")
    }
    if (selectedRow[0]["BookingConfirmationUUID"]) {
      window.$("#bookingConfirmationPDF").removeClass("d-none")
    } else {
      window.$("#bookingConfirmationPDF").addClass("d-none")
    }
    window.$('#PreviewPdfORModal').modal("toggle")
  })

  window
		.$("#split")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			if (selections.length == 1) {
				if (props.title == "booking-reservation") {
					GetBookingReservationsContainers(
						props.host,
						props.tableId,
						selections[0]
					).then((res) => {
						window.$(".splitParentIdBR").val(res.data.SplitParent);
						window.$(".containerList").empty();
						var containerLength = 0;
						window.$.each(
							res.data.BookingReservationHasContainerTypes,
							function (key, value) {
								if (value.BookingReservationHasContainers) {
									containerLength +=
										value.BookingReservationHasContainers.length;
								}
								window.$.each(
									value.BookingReservationHasContainers,
									function (key2, value2) {
										var Container_Code = value2.ContainerCode
											? value2.ContainerCodeName
											: "";
										var Container_Type = value.ContainerType
											? value.ContainerTypeName
											: "";
										var Container_CodeUUID = value2.ContainerCode
											? value2.ContainerCode
											: "";
										var Container_TypeUUID = value.ContainerType
											? value.BookingReservationHasContainerTypeUUID
											: "";
										window
											.$(".containerList")
											.append(
												`<tr><td className='d-none containerUUID'>${Container_CodeUUID}</td><td className='checkbox' style="text-align:center;vertical-align: middle;"><input type='checkbox' className='checkboxSplit' name='Split'></td><td className='containerCodeSplit' style="text-align:center;vertical-align: middle;">${Container_Code}<input type='hidden' value ='${Container_CodeUUID}'/></td><td className='containerTypeSplit' style="text-align:center;vertical-align: middle;">${Container_Type}<input type='hidden' value ='${Container_TypeUUID}'/></td></tr>`
											);
									}
								);
							}
						);
						if (containerLength <= 1) {
							window.$("#confirmSplitBR").prop("disabled", true);
						} else {
							window.$("#confirmSplitBR").prop("disabled", false);
						}
					});
					window.$("#SplitModalBR").modal("toggle");
				} else {
					GetBillOfLadingContainers(
						props.host,
						props.tableId,
						selections[0]
					).then((res) => {
						var containerLength = res.data.billOfLadingHasContainers.length;
						window.$(".splitParentId").val(res.data.SplitParent);
						window.$(".containerList").empty();
						window.$.each(
							res.data.billOfLadingHasContainers,
							function (key, value) {
								var Container_Code = value.ContainerCode
									? value.containerCode.ContainerCode
									: "";
								var Container_Type = value.ContainerType
									? value.containerType.ContainerType
									: "";
								if (containerLength == 1) {
									window
										.$(".containerList")
										.append(
											`<tr><td className='d-none containerUUID'>${value.BillOfLadingHasContainerUUID}</td><td><input type='checkbox' disabled className='checkboxSplit' name='Split'></td><td><input type='checkbox' className='checkboxShare' name='Share'><td>${Container_Code}</td><td>${Container_Type}</td></tr>`
										);
								} else {
									window
										.$(".containerList")
										.append(
											`<tr><td className='d-none containerUUID'>${value.BillOfLadingHasContainerUUID}</td><td><input type='checkbox' className='checkboxSplit' name='Split'></td><td><input type='checkbox' className='checkboxShare' name='Share'><td>${Container_Code}</td><td>${Container_Type}</td></tr>`
										);
								}
							}
						);
					});
					window.$("#SplitModal").modal("toggle");
				}
			}
		});

	window
		.$("#merge")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			if (selections.length == 1) {
				if (props.title == "booking-reservation") {
					GetMergeBRList(
						selectedRow[0].BookingReservationUUID,
						props.host,
						selectedRow[0].POLPortCode,
						selectedRow[0].PODPortCode,
						selectedRow[0].VoyageNum,
						selectedRow[0].Quotation
					).then((res) => {
						var htmlBLList = "<option value=''>Select...</option>";
						window.$.each(res.data.data, function (key, value) {
							htmlBLList +=
								"<option value='" + key + "'>" + value + "</option>";
						});
						window.$(".MergeBR").html(htmlBLList);
						window.$(".MergeBR").select2({width: "100%"});
					});
					window.$("#MergeModalBR").modal("toggle");
				} else {
					GetMergeBLList(
						selectedRow[0].BillOfLadingUUID,
						props.host,
						selectedRow[0].POLPortCode,
						selectedRow[0].PODPortCode,
						selectedRow[0].VoyageNum
					).then((res) => {
						var htmlBLList = "<option value=''>Select...</option>";
						window.$.each(res.data.data, function (key, value) {
							htmlBLList +=
								"<option value='" +
								value.BillOfLadingUUID +
								"'>" +
								value.DocNum +
								"</option>";
						});
						window.$(".MergeBL").html(htmlBLList);
						window.$(".MergeBL").select2({width: "100%"});
					});
					window.$("#MergeModal").modal("toggle");
				}
			}
		});

	window
		.$("#revertSplit")
		.off("click")
		.on("click", function () {
			window.$("#RevertSplitModal").modal("toggle");
		});

	window
		.$("#dndButton")
		.off("click")
		.on("click", function () {
			window.$("#DNDModal").modal("toggle");
		});

	window
		.$(".SubmitDND")
		.off("click")
		.on("click", function () {
			var applyDND = window.$(".DNDApplyCheckBox").prop("checked") ? "1" : "0";
			var dndCombind = window.$(".DNDConbindorNot").prop("checked") ? "1" : "0";
			var dndCombindDay = window
				.$(`#${props.title}-quickform-dndcombinedday`)
				.val();
			var detention = window.$(`#${props.title}-quickform-detention`).val();
			var demurrage = window.$(`#${props.title}-quickform-demurrage`).val();

			var dataList = {
				ApplyDND: applyDND,
				DNDCombined: dndCombind,
				DNDCombinedDay: dndCombindDay,
				Detention: detention,
				Demurrage: demurrage,
				Type: props.selectedId,
				Selection: selections,
			};

			GetUpdateDND(dataList, props.title, props.host).then((res) => {
				ToastNotify("success", "DND Update Successfully");
				window.$("#" + props.tableSelector).bootstrapTable("refresh");
				window.$("#" + props.tableSelector).bootstrapTable("uncheckAll");
			});
		});

	window
		.$("#confirmSplitBL")
		.off("click")
		.on("click", function () {
			if (
				filteredAp.includes(`create-${tempModel}`) &&
				filteredAp.includes(`split-${tempModel}`)
			) {
				var arraySplit = [];
				var arrayShare = [];
				var BillOfLadingUUID = selections[0];
				window
					.$("#split-container-table")
					.find(".checkboxSplit:checked")
					.each(function () {
						arraySplit.push(
							window.$(this).parent().parent().find(".containerUUID").text()
						);
					});
				window
					.$("#split-container-table")
					.find(".checkboxShare:checked")
					.each(function () {
						arrayShare.push(
							window.$(this).parent().parent().find(".containerUUID").text()
						);
					});
				var SplitID = arraySplit.join(",");
				var ShareID = arrayShare.join(",");
				if (window.$(".splitParentId").val() == "") {
					if (arraySplit.length !== 0 || arrayShare.length !== 0) {
						props.navigate(
							props.routeName +
								"/split/splitid=" +
								SplitID +
								"&shareid=" +
								ShareID +
								"&id=" +
								BillOfLadingUUID,
							{
								state: {
									bLId: BillOfLadingUUID,
									shareID: ShareID,
									splitID: SplitID,
									formType: "SplitBL",
								},
							}
						);
						// window.location.href = "./create2?SplitID=" + SplitID + "&ShareID=" + ShareID + "&BillOfLadingID=" + BillOfLadingUUID + "";
					}
				} else {
					if (arrayShare.length !== 0) {
						SplitID = "";
						props.navigate(
							props.routeName +
								"/split/splitid=" +
								SplitID +
								"&shareid=" +
								ShareID +
								"&id=" +
								BillOfLadingUUID,
							{
								state: {
									bLId: BillOfLadingUUID,
									shareID: ShareID,
									splitID: SplitID,
									formType: "SplitBL",
								},
							}
						);
						// window.location.href = "./create2?SplitID=" + SplitID + "&ShareID=" + ShareID + "&BillOfLadingID=" + BillOfLadingUUID + "";
					} else {
						alert(
							"Split record cannot perform split action again.Please use revert feature"
						);
					}
				}
				window.$("#SplitModal").modal("toggle");
			} else {
				alert(
					"You are not allowed to perform Split, Please check your Permission."
				);
			}
		});

	window
		.$("#confirmSplitBR")
		.off("click")
		.on("click", function () {
			if (
				filteredAp.includes(`create-${tempModel}`) &&
				filteredAp.includes(`split-${tempModel}`)
			) {
				var arraySplitContainer = [];
				var arraySplitContainerType = [];
				var BookingReservationUUID = selections[0];
				window
					.$("#split-container-tableBR")
					.find(".checkboxSplit:checked")
					.each(function () {
						arraySplitContainer.push(
							window.$(this).parent().parent().find(".containerUUID").text()
						);
						arraySplitContainerType.push(
							window
								.$(this)
								.parent()
								.parent()
								.find(".containerTypeSplit")
								.find(":hidden")
								.val()
						);
					});
				var SplitID = arraySplitContainer.join(",");
				var ContainerTypeID = arraySplitContainerType.join(",");

				if (window.$(".splitParentIdBR").val() == "") {
					if (arraySplitContainer.length !== 0) {
						var data = {
							id: BookingReservationUUID,
							containerTypeID: ContainerTypeID,
							splitID: SplitID,
						};
						getSplitDataBR(data, props.host).then((res) => {
							if (res.data.message) {
								ToastNotify("error", res.data.message);
							} else {
								window.$("#SplitModalBR").modal("toggle");
								props.navigate(
									"/" +
										props.routeName +
										"/split/splitid=" +
										ContainerTypeID +
										"&id=" +
										BookingReservationUUID +
										"&containerid=" +
										SplitID,
									{
										state: {
											id: BookingReservationUUID,
											containerTypeID: ContainerTypeID,
											splitID: SplitID,
											formType: "SplitBR",
										},
									}
								);
							}
						});
					}
				}
			} else {
				alert(
					"You are not allowed to perform Split, Please check your Permission."
				);
			}
		});

	window
		.$("#confirmMergeBL")
		.off("click")
		.on("click", function () {
			if (
				filteredAp.includes(`update-${tempModel}`) &&
				filteredAp.includes(`merge-${tempModel}`)
			) {
				var MergedIDs = "";
				if (window.$(".MergeBL").val().length > 0) {
					MergedIDs = window.$(".MergeBL").val().join(",");
				}
				window.$("#MergeModal").modal("toggle");
				props.navigate(
					props.routeName +
						"/merge/id=" +
						selectedRow[0].BillOfLadingUUID +
						"&mergeid=" +
						MergedIDs,
					{
						state: {
							bLId: selectedRow[0].BillOfLadingUUID,
							mergeIDs: MergedIDs,
							formType: "MergeBL",
						},
					}
				);
			} else {
				alert(
					"You are not allowed to perform Merge, Please check your Permission."
				);
			}
		});

	window
		.$("#confirmMergeBR")
		.off("click")
		.on("click", function () {
			if (
				filteredAp.includes(`update-${tempModel}`) &&
				filteredAp.includes(`merge-${tempModel}`)
			) {
				var MergedIDs = "";
				if (window.$(".MergeBR").val().length > 0) {
					MergedIDs = window.$(".MergeBR").val().join(",");
				}
				var data = {
					id: selectedRow[0].BookingReservationUUID,
					mergeIDs: MergedIDs,
				};
				GetMergeBR(data, props.host, MergedIDs).then((res) => {
					if (res.data.message) {
						ToastNotify("error", res.data.message);
					} else {
						window.$("#MergeModalBR").modal("toggle");
						props.navigate(
							props.routeName +
								"/merge/id=" +
								selectedRow[0].BookingReservationUUID +
								"&mergeid=" +
								MergedIDs,
							{
								state: {
									id: selectedRow[0].BookingReservationUUID,
									mergeIDs: MergedIDs,
									formType: "MergeBR",
								},
							}
						);
					}
				});
			} else {
				alert(
					"You are not allowed to perform Merge, Please check your Permission."
				);
			}
		});

	window
		.$("#telexRelease")
		.off("click")
		.on("click", function () {
			window.$("#ButtonTelexModal").modal("toggle");
		});
	window
		.$(".transferToBR")
		.off("click")
		.on("click", function () {
			window.$("#TransferBRModal").modal("toggle");
		});

	window
		.$(".TransferBR")
		.off("click")
		.on("click", function () {
			var tempVal;
			tempModel == "quotation-barge"
				? (tempVal = "create-booking-reservation-barge")
				: (tempVal = "create-booking-reservation");
			if (
				filteredAp.includes(`transfer-${tempModel}`) &&
				filteredAp.includes(tempVal)
			) {
				window.$("#TransferBRModal").modal("toggle");
				if (tempModel == "quotation-barge") {
					getTransferFromQuotationData(selections[0], props.host).then(
						(res) => {
							if (res.data.message == "Quotation already expired") {
								alert("Quotation already expired");
							} else {
								props.navigate(
									"/sales/standard/booking-reservation-barge/transfer-from-quotation/id=" +
										selections[0],
									{
										state: {
											id: selections[0],
											formType: "Transfer",
											transferFromModel: "quotation",
										},
									}
								);
							}
						}
					);
				} else {
					getTransferFromQuotationData(selections[0], props.host).then(
						(res) => {
							if (res.data.message == "Quotation already expired") {
								alert("Quotation already expired");
							} else {
								props.navigate(
									"/sales/container/booking-reservation/transfer-from-quotation/id=" +
										selections[0],
									{
										state: {
											id: selections[0],
											formType: "Transfer",
											transferFromModel: "quotation",
										},
									}
								);
							}
						}
					);
				}
			} else {
				alert(
					"You are not allowed to transfer to Booking Reservation, Please check your Permission."
				);
			}
		});

	window
		.$(".transferfromBR")
		.off("click")
		.on("click", function () {
			window.$("#TransferBRModal").modal("toggle");
		});

	window
		.$(".transferfromBC")
		.off("click")
		.on("click", function () {
			window.$("#TransferFromBCModal").modal("toggle");
		});

	window
		.$("#transfertocroinv")
		.off("click")
		.on("click", function () {
			window
				.$("#BookingComfirmationUUID")
				.val(selectedRow[0]["BookingConfirmationUUID"]);
			window.$("#TransferToCROINVModal").modal("toggle");
		});

	window
		.$("#transfertocndn")
		.off("click")
		.on("click", function () {
			window.$("#TransferToCNDNModal").modal("toggle");
		});

	window
		.$(".TransferToCN")
		.off("click")
		.on("click", function () {
			var temValue;
			tempModel == "sales-invoice"
				? (temValue = "create-sales-credit-note")
				: (temValue = "create-sales-credit-note-barge");

			if (
				filteredAp.includes(`transferto-${tempModel}`) &&
				filteredAp.includes(temValue)
			) {
				window.$(".CheckingTransferToCNOrDN").val("CN");
				window.$("#SalesInvoiceUUIDForPartial").val(selections[0]);
				window.$("#TransferToCNDNModal").modal("toggle");
				window.$("#TransferPartialToCNDNModal").modal("toggle");
			} else {
				alert(
					"You are not allowed to transfer to Credit Note, Please check your Permission."
				);
			}
		});

	window
		.$(".TransferToDN")
		.off("click")
		.on("click", function () {
			var temValue;
			tempModel == "sales-invoice"
				? (temValue = "create-sales-debit-note")
				: (temValue = "create-sales-debit-note-barge");

			if (
				filteredAp.includes(`transferto-${tempModel}`) &&
				filteredAp.includes(temValue)
			) {
				window.$(".CheckingTransferToCNOrDN").val("DN");
				window.$("#SalesInvoiceUUIDForPartial").val(selections[0]);

				window.$("#TransferToCNDNModal").modal("toggle");
				window.$("#TransferPartialToCNDNModal").modal("toggle");
			} else {
				alert(
					"You are not allowed to transfer to Debit Note, Please check your Permission."
				);
			}
		});

	window
		.$("#TransferAllFromBC")
		.off("click")
		.on("click", function () {
			var type;
			props.title == "sales-invoice-barge"
				? (type = "barge")
				: (type = "normal");

			if (
				filteredAp.includes(`transferfrom-${tempModel}`) &&
				filteredAp.includes(`create-${tempModel}`)
			) {
				var BC = window.$("input[name=BC]").val();
				if (BC) {
					checkBCTransfer(BC, props.host, type).then((checking) => {
						if (checking == 1) {
							getRemainingBCbyID(BC, props.host, type).then((res) => {
								if (res) {
									getBookingConfirmationHasContainerType(
										BC,
										props.host,
										type
									).then((BCData) => {
										var checkingCustomerList = [];
										window.$.each(BCData.data, function (key, value) {
											window.$.each(
												value.bookingConfirmationCharges,
												function (key2, value2) {
													var data = {};
													if (value2.BillTo) {
														var temp = {
															value: value2.BillTo,
															label:
																value2.billTo.BranchCode +
																"(" +
																value2.billTo.portCode.PortCode +
																")",
														};
													} else {
														var temp = {};
													}
													data["CustomerType"] = value2.CustomerType;
													data["BillTo"] = temp;
													if (temp) {
														checkingCustomerList.push(data);
													}
												}
											);
										});

										const uniqueData = [];

										checkingCustomerList.forEach((obj, index) => {
											const isDuplicate = uniqueData.some((prevObj) => {
												return (
													prevObj.BillTo.value === obj.BillTo.value &&
													prevObj.CustomerType === obj.CustomerType
												);
											});
											if (!isDuplicate) {
												uniqueData.push(obj);
											}
										});
										window.$(".checkingBillToList").empty();
										const BCHidden = window.$(
											'<input type="hidden" name="BCUUID" value="' + BC + '">'
										);
										window.$(".checkingBillToList").append(BCHidden);
										window.$.each(uniqueData, function (key, value) {
											const customerType = window.$(
												'<input type="hidden" name="customerType" value="' +
													value.CustomerType +
													'">'
											);
											const radio = window.$(
												`<input type="radio" className="mr-2" id="radio-window.${key}" name="billTo" value="` +
													value.BillTo.value +
													'">'
											);
											const label = window.$(
												`<label className="control-label" for="radio-window.${key}">` +
													value.CustomerType +
													" - " +
													value.BillTo.label +
													"</label>"
											);
											window
												.$(".checkingBillToList")
												.append(customerType)
												.append(radio)
												.append(label)
												.append("<br>");
										});
										window.$("#TransferFromBCModal").modal("toggle");
										window.$("#CheckingBillToModal").modal("toggle");

										// window.$("#TransferToCROINVModal").modal("toggle")
										// props.navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id="+BC,{ state: { id:BC, formType: "TransferFromBooking" }})
									});
								} else {
									alert("This booking has been fully transferred");
								}
							});
						} else {
							alert("Container is Empty.");
						}
					});
				}
			} else {
				alert(
					"You are not allowed to transfer from Booking Reservation, Please check your Permission."
				);
			}

			// window.$("#TransferFromBCModal").modal("toggle")
			// navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id="+BC,{ state: { id:BC, formType: "TransferFromBooking" }})
		});

	window
		.$("#TransferAllTo")
		.off("click")
		.on("click", function () {
			var TransferType = window
				.$("input[name='flexRadioDefault']:checked")
				.val();
			var val;
			var type;
			props.title == "booking-reservation-barge"
				? (val = "create-sales-invoice-barge")
				: (val = "create-sales-invoice");
			props.title == "booking-reservation-barge"
				? (type = "barge")
				: (type = "normal");

			// var BR = $("#TransferBR").val();
			// var BC = $("#TransferBC").val();
			if (TransferType == "CRO") {
				if (
					filteredAp.includes(`transferto-${tempModel}`) &&
					filteredAp.includes(`create-container-release-order`)
				) {
					window.$("#TransferToCROINVModal").modal("toggle");
					ControlOverlay(true);
					props.navigate(
						"/operation/container/container-release-order/transfer-from-booking-reservation-data/id=" +
							selections[0],
						{
							state: {
								id: selections[0],
								formType: "TransferFromBooking",
								transferFromModel: "booking-reservation",
							},
						}
					);

					// else {
					//   alert("You are not allow to transfer to Container Release Order, Please Check Quotation Number for this Booking.")
					// }
				} else {
					alert(
						"You are not allowed to transfer to Container Realease Order, Please check your Permission."
					);
				}
			} else {
				if (
					filteredAp.includes(`transferto-${tempModel}`) &&
					filteredAp.includes(val)
				) {
					var BC = selectedRow[0]["BookingConfirmationUUID"];
					if (BC == "" || BC == null) {
						alert("Booking Reservation has not been confirmed");
					} else {
						checkBCTransfer(BC, props.host, type).then((checking) => {
							if (checking == 1) {
								getRemainingBCbyID(BC, props.host, type).then((res) => {
									if (res) {
										getBookingConfirmationHasContainerType(
											BC,
											props.host,
											type
										).then((BCData) => {
											var checkingCustomerList = [];
											window.$.each(BCData.data, function (key, value) {
												window.$.each(
													value.bookingConfirmationCharges,
													function (key2, value2) {
														var data = {};
														var temp = {
															value: value2.BillTo,
															label:
																value2.billTo.BranchCode +
																"(" +
																value2.billTo.portCode.PortCode +
																")",
														};
														data["CustomerType"] = value2.CustomerType;
														data["BillTo"] = temp;
														checkingCustomerList.push(data);
													}
												);
											});

											const uniqueData = [];

											checkingCustomerList.forEach((obj, index) => {
												const isDuplicate = uniqueData.some((prevObj) => {
													return (
														prevObj.BillTo.value === obj.BillTo.value &&
														prevObj.CustomerType === obj.CustomerType
													);
												});
												if (!isDuplicate) {
													uniqueData.push(obj);
												}
											});
											window.$(".checkingBillToList").empty();

											const BCHidden = window.$(
												'<input type="hidden" name="BCUUID" value="' + BC + '">'
											);
											window.$(".checkingBillToList").append(BCHidden);
											window.$.each(uniqueData, function (key, value) {
												const customerType = window.$(
													'<input type="hidden" name="customerType" value="' +
														value.CustomerType +
														'">'
												);
												const radio = window.$(
													`<input type="radio" className="mr-2" id="radio-window.${key}" name="billTo" value="` +
														value.BillTo.value +
														'">'
												);
												const label = window.$(
													`<label className="control-label" for="radio-window.${key}">` +
														value.CustomerType +
														" - " +
														value.BillTo.label +
														"</label>"
												);
												window
													.$(".checkingBillToList")
													.append(customerType)
													.append(radio)
													.append(label)
													.append("<br>");
											});
											window.$("#CheckingBillToModal").modal("toggle");

											// window.$("#TransferToCROINVModal").modal("toggle")
											// props.navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id="+BC,{ state: { id:BC, formType: "TransferFromBooking" }})
										});
									} else {
										alert("This booking has been fully transferred");
									}
								});
							} else {
								alert("Container is Empty.");
							}
						});
					}
				} else {
					alert(
						"You are not allowed to transfer to Sales Invoice, Please check your Permission."
					);
				}

				//     } else {
				//         alert("You are not allowed to transfer to Sales Invoice, Please check your Permission.")
				//     }
			}
		});

	window
		.$("#confirmRevertSplitBL")
		.off("click")
		.on("click", function () {
			var BillOfLadingUUID = selections[0];
			if (selections.length == 1) {
				if (filteredAp.includes(`revert-${tempModel}`)) {
					RevertSplitBL(props.host, props.tableId, BillOfLadingUUID).then(
						(res) => {
							if (res) {
								ToastNotify(
									"success",
									"Bill Of Loading revert split successfully"
								);
								window.$("#RevertSplitModal").modal("toggle");
								window.$("#" + props.tableSelector).bootstrapTable("refresh");
								window
									.$("#" + props.tableSelector)
									.bootstrapTable("uncheckAll");
							}
						}
					);
				} else {
					alert(
						"You are not allowed to perform Rervert Split, Please check your Permission."
					);
				}
			}
		});

	window
		.$("#ContainerReleaseOrderOri")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfCROModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				Preview(props.host, props.tableId, selections[0]).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);

					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#ContainerReleaseOrderLetter")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfCROModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewLetter(props.host, props.tableId, selections[0]).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);

					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#BillOfLadingOri")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfBLModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewBillOfLading(
					props.host,
					props.tableId,
					selections[0],
					"BillOfLading"
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);

					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#ShippingOrder")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfBLModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewBillOfLading(
					props.host,
					props.tableId,
					selections[0],
					"ShippingOrder"
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);

					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#ShippingAdviceNote")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfBLModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewBillOfLading(
					props.host,
					props.tableId,
					selections[0],
					"ShippingAdviceNote"
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);

					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#ShippingOrderDeclaration")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfBLModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewBillOfLading(
					props.host,
					props.tableId,
					selections[0],
					"ShippingOrderDeclaration"
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);

					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#bookingReservationPDF")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfBRModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");

			if (selections.length == 1) {
				PreviewBR(props.host, props.tableId, selections[0]).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);
					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#customerPaymentNormalPDF")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfORModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");

			if (selections.length == 1) {
				PreviewOR(props.host, props.tableId, selections[0]).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);
					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#customerPaymentDetailPDF")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfORModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");

			if (selections.length == 1) {
				PreviewOR(props.host, props.tableId, selections[0], "detail").then(
					(res) => {
						var file = new Blob([res.data], {type: "application/pdf"});
						let url = window.URL.createObjectURL(file);
						window.$("#pdfFrameList").attr("src", url);
					}
				);
			}
		});

	window
		.$("#bookingConfirmationPDF")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfBRModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");

			if (selections.length == 1) {
				PreviewBC(
					props.host,
					props.tableId,
					selectedRow[0]["BookingConfirmationUUID"]
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);
					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#Original")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfCNDNModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewINVCNDN(
					props.host,
					props.tableId,
					selections[0],
					`${
						props.title == "sales-invoice" ||
						props.title == "sales-invoice-barge"
							? ""
							: "Sales"
					}${props.selectedId.replace(/UUIDs/g, "")}Original`
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);
					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#Account")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfCNDNModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewINVCNDN(
					props.host,
					props.tableId,
					selections[0],
					`${
						props.title == "sales-invoice" ||
						props.title == "sales-invoice-barge"
							? ""
							: "Sales"
					}${props.selectedId.replace(/UUIDs/g, "")}Account`
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);
					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#ReprintOriginal")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfCNDNModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewINVCNDN(
					props.host,
					props.tableId,
					selections[0],
					`${
						props.title == "sales-invoice" ||
						props.title == "sales-invoice-barge"
							? ""
							: "Sales"
					}${props.selectedId.replace(/UUIDs/g, "")}ReprintOriginal`
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);
					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window
		.$("#ReprintAccount")
		.off("click")
		.on("click", function () {
			var object = {};
			object[props.selectedId] = selections;
			window.$("#PreviewPdfCNDNModal").modal("toggle");
			window.$("#PreviewPdfModal").modal("toggle");
			if (selections.length == 1) {
				PreviewINVCNDN(
					props.host,
					props.tableId,
					selections[0],
					`${
						props.title == "sales-invoice" ||
						props.title == "sales-invoice-barge"
							? ""
							: "Sales"
					}${props.selectedId.replace(/UUIDs/g, "")}ReprintAccount`
				).then((res) => {
					var file = new Blob([res.data], {type: "application/pdf"});
					let url = window.URL.createObjectURL(file);
					window.$("#pdfFrameList").attr("src", url);
				});
			}
		});

	window.$("#telex").click(function () {
		var object = {};
		object[props.selectedId] = selections;
		if (selections.length > 0) {
			if (filteredAp.includes(`telex-release-${tempModel}`)) {
				TelexRelease(props.host, props.tableId, object).then((res) => {
					if (res.Success.length > 0) {
						ToastNotify("success", "Telex Release Successfully");
						window.$("#ButtonTelexModal").modal("toggle");
						window.$("#" + props.tableSelector).bootstrapTable("refresh");
						window.$("#" + props.tableSelector).bootstrapTable("uncheckAll");
					}
					if (res.Failed.length > 0) {
						var failedDocNum = [];
						window.$.each(res.Failed, function (key, value) {
							failedDocNum.push(value.DocNum);
						});
						window.$("#ButtonTelexModal").modal("toggle");
						alert(failedDocNum.join(",") + " need to be verified");
						window.$("#" + props.tableSelector).bootstrapTable("refresh");
						window.$("#" + props.tableSelector).bootstrapTable("uncheckAll");
					}
				});
			} else {
				alert(
					"You are not allowed to perform Telex Release, Please check your Permission."
				);
			}
		}
	});

	window
		.$("#generate")
		.off("click")
		.click(function () {
			var object = {};

			object["BLUUIDs"] = selections;

			if (selections.length > 0) {
				if (filteredAp.includes(`create-${tempModel}`)) {
					CheckDOStatus(props.host, props.tableId, object).then((res) => {
						var ArraySuccessDo = [];
						var ArraySuccessINV = [];
						var NoDueInvoice = true;
						window.$.each(res.success, function (key1, value) {
							if (
								JSON.stringify(value).includes("success create Delivery Order")
							) {
								var split = JSON.stringify(value).split(":");
								ArraySuccessDo.push(split[0].replace(/\W/g, ""));
							}

							if (
								JSON.stringify(value).includes("success create Sales Invoice")
							) {
								var split = JSON.stringify(value).split(":");
								ArraySuccessINV.push(split[0].replace(/\W/g, ""));
							}
						});
						if (ArraySuccessINV.length > 0) {
							var SuccessDO = ArraySuccessDo.join(",");
							var SuccessINV = ArraySuccessINV.join(",");
							alert(
								SuccessDO +
									" Delivery order successfully generated\n\n" +
									SuccessINV +
									" Sales invoice successfully generated."
							);
						} else if (ArraySuccessDo.length > 0) {
							var SuccessDO = ArraySuccessDo.join(",");
							alert(SuccessDO + " Delivery order successfully generated.");
						} else if (res["Due"] != undefined) {
							if (res.CreditLimit == 1) {
								var splitinvoice = res["Due"];
								alert(
									splitinvoice +
										" already due. The company also reached the credit limit. Please proceed payment for DO realease."
								);
								NoDueInvoice = false;
							} else {
								var splitinvoice = res["Due"];
								alert(
									splitinvoice +
										" already due. Please proceed payment for DO realease."
								);
								NoDueInvoice = false;
							}
						} else {
							if (NoDueInvoice == true) {
								if (res.CreditLimit == 1) {
									var splitinvoice = res["Due"];
									alert(
										"The company reached the credit limit. Please proceed payment for DO realease."
									);
								}
							}
						}
						window.$("#" + props.tableSelector).bootstrapTable("refresh");
						window.$("#" + props.tableSelector).bootstrapTable("uncheckAll");
					});
				} else {
					alert(
						"You are not allowed to perform Generate Delivery Order, Please check your Permission."
					);
				}
			}
		});

	window.$(document).on("click", ".checkboxSplit", function () {
		if (window.$(this).parent().next().find(".checkboxShare").prop("checked")) {
			window
				.$(this)
				.parent()
				.next()
				.find(".checkboxShare")
				.prop("checked", false);
		}
	});

	window.$(document).on("click", ".checkboxShare", function () {
		if (window.$(this).parent().prev().find(".checkboxSplit").prop("checked")) {
			window
				.$(this)
				.parent()
				.prev()
				.find(".checkboxSplit")
				.prop("checked", false);
		}
	});

	window.$(document).on("click", ".DNDApplyCheckBox", function () {
		if (window.$(this).prop("checked")) {
			window
				.$(this)
				.closest(".modal-body")
				.find(".DNDApplyClass")
				.removeClass("d-none");
		} else {
			window
				.$(this)
				.closest(".modal-body")
				.find(".DNDApplyClass")
				.addClass("d-none");
		}
	});

	window.$(document).on("click", ".DNDConbindorNot ", function () {
		if (window.$(this).prop("checked")) {
			window.$(".DNDCombineDay").removeClass("d-none");
			window.$(".Detention").addClass("d-none");
			window.$(".Demurrage").addClass("d-none");
		} else {
			window.$(".DNDCombineDay").addClass("d-none");
			window.$(".Detention").removeClass("d-none");
			window.$(".Demurrage").removeClass("d-none");
		}
	});

	window
		.$(".CheckTransfer")
		.off("click")
		.on("click", function () {
			var value = window.$(this).val();

			if (value == "Invoice") {
				if (window.$(`#BookingComfirmationUUID`).val() == "") {
					window.$("#TransferToPartial").prop("disabled", true);
				} else {
					window.$("#TransferToPartial").prop("disabled", false);
				}
			}
			if (value == "CRO") {
				window.$("#TransferToPartial").prop("disabled", true);
			}
		});

	window
		.$("#downloadSample")
		.off("click")
		.on("click", function () {
			const object = document.createElement("a");
			object.href = ContainerTemplate;
			object.download = "file.xls";
			document.body.appendChild(object);
			object.click();
			document.body.removeChild(object);
		});

	window
		.$("#uploadContainer")
		.off("click")
		.on("click", function () {
			window.$("#fileContainer").val("");
			window.$("#fileContainer").click();
		});

	window
		.$("#fileContainer")
		.off("change")
		.on("change", function () {
			var formData = new FormData();
			formData.append("file", window.$("#fileContainer")[0].files[0]);

			ImportContainer(props.host, formData).then((res) => {
				if (res.data.Success) {
					if (res.data.Success.length > 0) {
						ToastNotify("success", "Successfully Uploaded");
						window.$("#" + props.tableSelector).bootstrapTable("refresh");
						window.$("#" + props.tableSelector).bootstrapTable("uncheckAll");
					}
				}
				var ListSameContainerCode = [];
				var ListErrorContainerType = [];
				var message = "";

				if (res.data.Failed) {
					if (res.data.Failed.length > 0) {
						window.$.each(res.data.Failed, function (key, value) {
							ListSameContainerCode.push('"' + value["Container Code"] + '"');
						});
						message =
							ListSameContainerCode.toString(",") +
							" Containers already Exist.\n\n";

						if (res.data.ContainerTypeError) {
							window.$.each(
								res.data.ContainerTypeError,
								function (key, value2) {
									ListErrorContainerType.push(
										'"' + value2["Container Code"] + '"'
									);
								}
							);
							message +=
								ListErrorContainerType.toString(",") +
								" Container Types not Exist.\n\n";
						}
						message += "Failed to Upload.";
						// window.$(".FailedMessageField").html(message);
						window.$(".FailedMessageField").html(message);
						window.$("#FailedMessageModal").modal("toggle");

						// FailedMessageField
					}
				} else {
					if (res.data.ContainerTypeError) {
						window.$.each(res.data.ContainerTypeError, function (key, value2) {
							ListErrorContainerType.push('"' + value2["Container Code"] + '"');
						});
						message +=
							ListErrorContainerType.toString(",") +
							" Container Types not Exist.\n\n";

						message += "Failed to Upload.";
						// window.$(".FailedMessageField").html(message);
						window.$(".FailedMessageField").html(message);
						window.$("#FailedMessageModal").modal("toggle");
					}
				}
			});
		});

	window
		.$(".confirmTransferFillterBillTo")
		.off("click")
		.on("click", function () {
			var BC = window.$("input[name=BCUUID]").val();
			var BranchCode = window.$("input[name=billTo]:checked").val();
			var CustomerType = window.$("input[name=billTo]:checked").prev().val();

			window.$("#CheckingBillToModal").modal("toggle");
			window.$("#TransferToCROINVModal").modal("hide");
			if (
				props.title == "sales-invoice-barge" ||
				props.title == "booking-reservation-barge"
			) {
				props.navigate(
					"/sales/standard/sales-invoice-barge/transfer-from-booking-reservation-data/id=" +
						BC,
					{
						state: {
							id: BC,
							formType: "TransferFromBooking",
							CustomerType: CustomerType,
							BranchCode: BranchCode,
						},
					}
				);
			} else {
				props.navigate(
					"/sales/container/sales-invoice/transfer-from-booking-reservation-data/id=" +
						BC,
					{
						state: {
							id: BC,
							formType: "TransferFromBooking",
							CustomerType: CustomerType,
							BranchCode: BranchCode,
						},
					}
				);
			}
		});

	var arraycheck = [];
	var arrayGenerateDO = [];
	//delivery order condition here
	if (
		props.tableId == "delivery-order" ||
		props.tableId == "delivery-order-barge"
	) {
		window
			.$("#" + props.tableSelector)
			.on("check.bs.table", function (row, element, field) {
				// $.each(ArrayPermission, function (key, value) {
				//   $("#toolbar").find("button").each(function () {
				//     var resultData = $(this).attr('class').split(" ").filter(function (oneArray) {
				//         return oneArray== value;
				//     })
				//     if(resultData.length!=0){

				//       if (resultData[0].includes("preview")){
				//         $getPreviewPDFPermission = true;
				//       }
				//       else if (resultData[0].includes("create")){
				//         $getGenerateDOPermission = true;
				//       }
				//       else{
				//         $(this).prop('disabled', false)
				//       }
				//     }
				//   })
				// })
				window.$("#trash").prop("disabled", false);
				window.$("#removeModal").prop("disabled", false);
				// $trash.prop('disabled', false);
				// $removeModal.prop('disabled', false);

				if (window.$("tbody .bs-checkbox input:checkbox:checked").length >= 2) {
					window.$("#update").prop("disabled", true);
					window.$("#preview").prop("disabled", true);
					// $update.prop('disabled', true)
					// $preview.prop('disabled', true)
				} else if (
					window.$("tbody .bs-checkbox input:checkbox:checked").length < 1
				) {
					window.$("#update").prop("disabled", true);
					window.$("#preview").prop("disabled", true);
					//  $update.prop('disabled', true)
					// $preview.prop('disabled', true)
				} else {
					if (element.BLStatus == "Generated") {
						window.$("#update").prop("disabled", false);
					} else {
						window.$("#update").prop("disabled", true);
					}
					// if ($getPreviewPDFPermission == true){
					if (element.DeliveryOrderUUID != null) {
						window.$("#preview").prop("disabled", false);
					}
					//}
				}

				var statusTemp = "";
				if (element.BLStatus == "Generated") {
					statusTemp = "Generated";
					var generateList = {
						uuid: element.BillOfLadingUUID,
						status: statusTemp,
					};
					arraycheck.push(generateList);
					arrayGenerateDO.push(element.BillOfLadingUUID);
				} else if (element.BLStatus == "Ready") {
					statusTemp = "Ready";
					var generateList = {
						uuid: element.BillOfLadingUUID,
						status: statusTemp,
					};
					arraycheck.push(generateList);
					arrayGenerateDO.push(element.BillOfLadingUUID);
				} else {
					statusTemp = "Pending";
					var generateList = {
						uuid: element.BillOfLadingUUID,
						status: statusTemp,
					};
					arraycheck.push(generateList);
					arrayGenerateDO.push(element.BillOfLadingUUID);
				}
				window.$.each(arraycheck, function (key1, value1) {
					// if($getGenerateDOPermission==true){
					if (value1.status == "Pending" || value1.status == "Generated") {
						window.$("#generate").prop("disabled", true);
						return false;
					} else {
						window.$("#generate").prop("disabled", false);
					}
					//}
				});
			});

		window
			.$("#" + props.tableSelector)
			.on("uncheck.bs.table", function (row, element, field) {
				window.$("#generate").prop("disabled", true);

				if (window.$(selectedRow).length == 0) {
					window.$("#update").prop("disabled", true);
					window.$("#preview").prop("disabled", true);
					window.$("#trash").prop("disabled", true);
					window.$("#removeModal").prop("disabled", true);
					// $update.prop('disabled', true)
					// $preview.prop('disabled', true)
					// $trash.prop('disabled', true);
					// $removeModal.prop('disabled', true);
				}

				if (window.$(selectedRow).length == 1) {
					if (selectedRow[0].BLStatus == "Generated") {
						window.$("#update").prop("disabled", false);
					}

					// if ($getPreviewPDFPermission == true){
					if (selectedRow[0].DeliveryOrderUUID != null) {
						window.$("#preview").prop("disabled", false);
					}
					// }
				}

				if (
					props.tableId == "delivery-order" ||
					props.tableId == "delivery-order-barge"
				) {
					window.$.each(arraycheck, function (key1, value1) {
						if (value1.uuid == element.BillOfLadingUUID) {
							arraycheck.splice(key1, 1);
							arrayGenerateDO.splice(key1, 1);
							return false;
						}
					});

					window.$.each(arraycheck, function (key1, value1) {
						// if($getGenerateDOPermission==true){

						if (value1.status == "Pending" || value1.status == "Generated") {
							window.$("#generate").prop("disabled", true);
							return false;
						} else {
							window.$("#generate").prop("disabled", false);
						}
						//}
					});

					var temp = window
						.$("#" + props.tableSelector)
						.bootstrapTable("getSelections");
					if (temp.length == "1") {
						if (temp["0"]["deliveryOrder"] != null) {
							window.$("#preview").prop("disabled", false);
						}
					}
				}
			});

		// $CheckStatusDO.click(function () {
		//   var BLUUIDs = []
		//   BLUUIDs = arrayGenerateDO;

		//   $.ajax({
		//     type: "POST",
		//     url: "./generate-d-o",
		//     data: {
		//       BLUUIDs : BLUUIDs,
		//     },
		//     dataType: "json",
		//     success: function (data) {
		//       var ArraySuccessDo=[]
		//       var ArraySuccessINV=[]
		//       var NoDueInvoice= true;
		//       $.each(data.success, function (key1, value){
		//         if((JSON.stringify(value)).includes("success create Delivery Order")){
		//           var split=(JSON.stringify(value)).split(":")
		//           ArraySuccessDo.push( (split[0]).replace(/\W/g, ""))
		//         }

		//         if((JSON.stringify(value)).includes("success create Sales Invoice")){
		//           var split=(JSON.stringify(value)).split(":")
		//           ArraySuccessINV.push( (split[0]).replace(/\W/g, ""))
		//         }
		//       })
		//       if(ArraySuccessINV.length > 0) {
		//         var SuccessDO=ArraySuccessDo.join(",");
		//         var SuccessINV=ArraySuccessINV.join(",");
		//          alert(SuccessDO+" Delivery order successfully generated\n\n"+SuccessINV+" Sales invoice successfully generated.")
		//       }
		//       else if (ArraySuccessDo.length >0){
		//         var SuccessDO=ArraySuccessDo.join(",");
		//         alert(SuccessDO+" Delivery order successfully generated.")
		//       }
		//       else if (data["Due"] != undefined){
		//         if(data.CreditLimit == 1){
		//           var splitinvoice = data["Due"];
		//           alert(splitinvoice+" already due. The company also reached the credit limit. Please proceed payment for DO realease.")
		//           NoDueInvoice = false;
		//         }else{
		//           var splitinvoice = data["Due"];
		//           alert(splitinvoice+" already due. Please proceed payment for DO realease.")
		//           NoDueInvoice = false;
		//         }
		//       }
		//       else{
		//         if(NoDueInvoice == true){
		//           if(data.CreditLimit == 1){
		//             var splitinvoice = data["Due"];
		//             alert("The company reached the credit limit. Please proceed payment for DO realease.")
		//           }
		//         }
		//       }
		//       $table.bootstrapTable('refresh')
		//     }
		//   });
		// })

		//   $remove.click(function () {
		//   var DOUUIDs = [];
		//   var temp = [];
		//   var valid = false;

		//   temp = ($table.bootstrapTable('getSelections'))
		//       $.each(temp, function (key, value) {
		//         if (value.DeliveryOrderUUID != null){
		//           DOUUIDs.push(value.DeliveryOrderUUID)
		//         }
		//         else{
		//           DOUUIDs.push("null")
		//         }
		//       })
		//       $.each(DOUUIDs, function (key1, value1) {
		//           if (value1 == "null"){
		//               alert("Delivery Order does not exist")
		//               valid = false;
		//               return false;
		//           }else {
		//               valid = true;
		//           }
		//       })
		//       if (valid == true){
		//           $.ajax({
		//               type: "POST",
		//               url: "./remove2",
		//               data: {
		//                   DOUUIDs : DOUUIDs,
		//               },
		//               dataType: "json",
		//               success: function (data) {
		//               }
		//           });
		//       }
		//   })

		//   $trash.click(function () {
		//     var DOUUIDs = [];
		//     var temp = [];
		//     var valid = false;

		//     temp = ($table.bootstrapTable('getSelections'))
		//       $.each(temp, function (key, value) {
		//         if (value.DeliveryOrderUUID != null){
		//           DOUUIDs.push(value.DeliveryOrderUUID)
		//         }
		//         else{
		//           DOUUIDs.push("null")
		//         }
		//       })
		//       $.each(DOUUIDs, function (key1, value1) {
		//         if (value1 == "null"){
		//             alert("Delivery Order does not exist")
		//             valid = false;
		//             return false;
		//         }else {

		//           valid = true;
		//         }
		//     })
		//     if (valid == true){
		//       $.ajax({
		//           type: "POST",
		//           url: "./throw2",
		//           data: {
		//               DOUUIDs : DOUUIDs,
		//           },
		//           dataType: "json",
		//           success: function (data) {
		//           }
		//       });
		//     }
		//   });

		// $table.on('dbl-click-row.bs.table', function (row, element, field) {

		//   if (element.DeliveryOrderUUID != null){
		//     id = element.DeliveryOrderUUID;

		//     window.location.href = 'update2?id=' + id + '';
		//   }else{
		//     alert ("Delivery Order haven't been Generated");
		//   }
	}

	return (
		<div>
			<table id={props.tableId} className='bootstrap_table'></table>

			<div
				className='modal fade'
				id='ButtonSuspendModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Suspend
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<h5>Are you sure you want to suspend these records?</h5>
							<h6 className='suspendbody'></h6>
						</div>
						<div className='modal-footer'>
							<button
								id='RealSuspend'
								type='button'
								className='btn btn-success AvoidUnbindClass'>
								Suspend
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='ButtonApprovedModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Suspend
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<h5>Are you sure you want to approved these records?</h5>
							<h6 className='approvedbody'></h6>
						</div>
						<div className='modal-footer'>
							<button
								id='RealApproved'
								type='button'
								className='btn btn-success AvoidUnbindClass'>
								Approved
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='ButtonResetModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Reset
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<h5>Are you sure you want to reset records?</h5>
							<h6 className='resetbody'></h6>
						</div>
						<div className='modal-footer'>
							<button
								id='RealReset'
								type='button'
								className='btn btn-success AvoidUnbindClass'>
								Reset
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='ButtonRemoveModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Remove
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<h5>Are you sure you want to remove these records?</h5>
						</div>
						<div className='modal-footer'>
							<button
								id='Realremove'
								type='button'
								className='btn btn-success AvoidUnbindClass'>
								Remove
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='ButtonVerifyModalForm'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Verify
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button
								id='verifyFirst'
								type='button'
								className='btn btn-success mr-2'>
								Approve
							</button>
							<button
								id='rejectStatusFirst'
								type='button'
								className='btn btn-danger mr-2'>
								Reject
							</button>
							<button
								id='cancelApproveRejectFirst'
								type='button'
								className='btn btn-secondary'>
								Cancel Approved/Reject
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='ButtonVerifyConfirmModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Confirmation
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<h5 className='message'>?</h5>
							<div className='rejectMessageRow'>
								<h5 className=''>Please fill in reject message.</h5>
								<div className='form-group'>
									<input
										type='text'
										className='form-control rejectMessage'></input>
								</div>
							</div>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								id='verify'
								className='btn btn-success d-none mt-2'
								data-dismiss='modal'>
								Approve
							</button>
							<button
								type='button'
								id='rejectStatus'
								className='btn btn-danger d-none'
								data-dismiss='modal'>
								Reject
							</button>
							<button
								type='button'
								id='cancelApprovedReject'
								className='btn btn-secondary d-none'
								data-dismiss='modal'>
								Cancel Approved/Reject
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='PreviewPdfModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog modal-xl' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<iframe
								id='pdfFrameList'
								src=''
								width='100%'
								height='700'></iframe>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal'
				id='PreviewPdfCROModal'
				tabIndex='-1'
				role='dialog'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Preview</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id='ContainerReleaseOrderOri'>
								Container Release Order
							</button>
							<button
								type='button'
								className='btn btn-primary'
								id='ContainerReleaseOrderLetter'>
								Container Release Letter
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='modal' id='PreviewPdfBLModal' tabIndex='-1' role='dialog'>
				<div className='modal-dialog modal-lg' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Preview</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id='BillOfLadingOri'>
								Bill Of Lading
							</button>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id='ShippingOrder'>
								Shipping Order
							</button>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id='ShippingAdviceNote'>
								Shipping Advice Note
							</button>
							<button
								type='button'
								className='btn btn-primary'
								id='ShippingOrderDeclaration'>
								Shipping Order Declaration
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal'
				id='PreviewPdfCNDNModal'
				tabIndex='-1'
				role='dialog'>
				<div className='modal-dialog modal-lg' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Preview</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id='Original'>
								Original
							</button>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id='Account'>
								Account
							</button>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id='ReprintOriginal'>
								Reprint Original
							</button>
							<button
								type='button'
								className='btn btn-primary'
								id='ReprintAccount'>
								Reprint Account
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* <!-- Modal button verification status choose--> */}
			<div
				className='modal fade'
				id='ButtonTelexModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Are you sure to Telex Release?
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button id='telex' type='button' className='btn btn-success'>
								Confirm
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* <!-- Split modal */}
			<div
				className='modal fade'
				id='SplitModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Split Bill Of Lading-Container
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<input type='text' className='splitParentId d-none'></input>
							<table
								className='table table-bordered'
								id='split-container-table'>
								<thead>
									<tr>
										<th className='d-none'>ID</th>
										<th>Split</th>
										<th>Share</th>
										<th>Container Code</th>
										<th>Container Type</th>
									</tr>
								</thead>
								<tbody className='containerList'></tbody>
							</table>
						</div>
						<div className='modal-footer'>
							<button
								id='confirmSplitBL'
								type='button'
								className='btn btn-primary'>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='SplitModalBR'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog modal-lg' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Split Booking Reservation-Container
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<input type='text' className='splitParentIdBR d-none'></input>
							<table
								className='table table-bordered'
								id='split-container-tableBR'>
								<thead>
									<tr>
										<th className='d-none'>ID</th>
										<th style={{textAlign: "center", verticalAlign: "middle"}}>
											Split
										</th>
										<th style={{textAlign: "center", verticalAlign: "middle"}}>
											Container Code
										</th>
										<th style={{textAlign: "center", verticalAlign: "middle"}}>
											Container Type
										</th>
									</tr>
								</thead>
								<tbody className='containerList'></tbody>
							</table>
						</div>
						<div className='modal-footer'>
							<button
								id='confirmSplitBR'
								type='button'
								className='btn btn-primary'>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* <!-- Merge Modal--> */}
			<div
				className='modal fade'
				id='MergeModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Merge Bill Of Lading
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<label>BL No.</label>
							<select
								className='select2js MergeBL form-control'
								name='MergeBL'
								id='mergeBL'
								multiple='multiple'>
								<option value=''>Select...</option>
							</select>
						</div>
						<div className='modal-footer'>
							<button
								id='confirmMergeBL'
								type='button'
								className='btn btn-primary'>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* <!-- Merge Modal--> */}
			<div
				className='modal fade'
				id='MergeModalBR'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Merge Booking Reservation
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<label>BR No.</label>
							<select
								className='select2js MergeBR form-control'
								name='MergeBR'
								id='mergeBR'
								multiple='multiple'>
								<option value=''>Select...</option>
							</select>
						</div>
						<div className='modal-footer'>
							<button
								id='confirmMergeBR'
								type='button'
								className='btn btn-primary'>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='RevertSplitModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Revert Split
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<h5>Are you sure to Revert Split Bill of Lading?</h5>
						</div>
						<div className='modal-footer'>
							<button
								id='confirmRevertSplitBL'
								type='button'
								className='btn btn-primary'>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal Transfer To BR */}
			<div
				className='modal fade'
				id='TransferBRModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Transfer To
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='mb-2'>
								<a className='btn btn-success mr-2 TransferBR'>
									Booking Reservation
								</a>
							</div>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Booking Reservation Transfer Modal */}
			<div
				className='modal fade'
				id='TransferToCROINVModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Transfer To
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='mb-2'>
								<input type='hidden' id='BookingComfirmationUUID' />
								<div className='form-check'>
									<input
										className='form-check-input CheckTransfer'
										type='radio'
										value='Invoice'
										name='flexRadioDefault'
										id='flexRadioDefault1'
										defaultChecked={true}
									/>
									<label
										className='form-check-label'
										style={{position: "relative", left: "15px"}}
										htmlFor='flexRadioDefault1'>
										Invoice
									</label>
								</div>
								{props.title == "booking-reservation-barge" ? (
									""
								) : (
									<div className='form-check'>
										<input
											className='form-check-input CheckTransfer'
											type='radio'
											value='CRO'
											name='flexRadioDefault'
											id='flexRadioDefault2'
										/>
										<label
											className='form-check-label'
											style={{position: "relative", left: "15px"}}
											htmlFor='flexRadioDefault2'>
											Container Release Order
										</label>
									</div>
								)}
							</div>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-primary FormAllTransferTo'
								id='TransferAllTo'>
								Transfer All
							</button>
							<button
								type='button'
								className='btn btn-primary FormTransferPartialToInvoice'
								id='TransferToPartial'
								disabled=''>
								Transfer Partial
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Sales Invoice Transfer Modal */}
			<div
				className='modal fade'
				id='CheckingBillToModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Choose One Branch for Transfer Sales Invoice
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<div className='checkingBillToList'></div>
						</div>
						<div className='modal-footer'>
							<button
								id='TranferToCN'
								type='button'
								className='btn btn-primary confirmTransferFillterBillTo mr-2'>
								Confirm
							</button>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='modal' id='PreviewPdfBRModal' tabIndex='-1' role='dialog'>
				<div className='modal-dialog modal-md' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Preview</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id={"bookingReservationPDF"}>
								Booking Reservation
							</button>
							<button
								type='button'
								className='btn btn-primary'
								id={`bookingConfirmationPDF`}>
								Booking Confirmation
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='modal' id='PreviewPdfORModal' tabIndex='-1' role='dialog'>
				<div className='modal-dialog modal-md' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Preview</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<button
								type='button'
								className='btn btn-primary mr-1'
								id={"customerPaymentNormalPDF"}>
								Normal
							</button>
							<button
								type='button'
								className='btn btn-primary'
								id={`customerPaymentDetailPDF`}>
								Detail
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Sales Invoice Transfer Modal */}
			<div
				className='modal fade'
				id='TransferToCNDNModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog' role='document'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='exampleModalLabel'>
								Transfer To
							</h5>
							<button
								type='button'
								className='close'
								data-dismiss='modal'
								aria-label='Close'>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div className='modal-body'>
							<input type='hidden' id='TransferID' />
							<button
								id='TranferToCN'
								type='button'
								className='btn btn-primary TransferToCN mr-2'>
								Credit Note
							</button>
							<button
								id='TranferToDN'
								type='button'
								className='btn btn-primary TransferToDN'>
								Debit Note
							</button>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Sales Invoice generated message Modal */}
			<div
				className='modal fade'
				id='SalesInvoiceMessageModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog  modal-lg' role='document'>
					<div className='modal-content'>
						<div className='modal-header'></div>
						<div className='modal-body'>
							<h5 className='InvMessage'></h5>
							<h5 className='InvMessage2'></h5>
							<h5 className='InvMessage3'></h5>
						</div>

						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary btn-sm'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className='modal fade'
				id='FailedMessageModal'
				tabIndex='-1'
				role='dialog'
				aria-labelledby='exampleModalLabel'
				aria-hidden='true'>
				<div className='modal-dialog  modal-lg' role='document'>
					<div className='modal-content'>
						<div className='modal-body'>
							<h5 className='FailedMessageField'></h5>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary btn-sm'
								data-dismiss='modal'>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			<TransferFromBC
				barge={props.title == "sales-invoice-barge" ? true : false}
			/>
			{props.title == "booking-reservation" ||
			props.title == "booking-reservation-barge" ||
			props.title == "sales-invoice" ||
			props.title == "sales-invoice-barge" ? (
				<TransferPartialBCModal
					barge={
						props.title == "sales-invoice-barge" ||
						props.title == "booking-reservation-barge"
							? true
							: false
					}
				/>
			) : (
				""
			)}
			{props.title == "sales-invoice" ||
			props.title == "sales-invoice-barge" ? (
				<TransferPartialCNDNModal
					barge={props.title.includes("barge") ? true : false}
				/>
			) : (
				""
			)}
			<DNDModal title={props.title} />
		</div>
	);
}

export default BoostrapTable

