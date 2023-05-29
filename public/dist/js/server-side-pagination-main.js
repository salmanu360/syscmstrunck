import $ from 'jquery'


var paramsTable = {};
var selections = [];

let searchParams = new URLSearchParams(window.location.search)
var CheckThirdParty = searchParams.get('third-party');


function responseHandler(res) {

  $.each(res.rows, function (i, row) {
    row.state = $.inArray(row.id, selections) !== -1
  })
  return res
}

function totalTextFormatter(data) {
  return 'Total'
}

function totalNameFormatter(data) {
  return data.length
}

function totalPriceFormatter(data) {
  var field = this.field
  return '$' + data.map(function (row) {
    return +row[field].substring(1)
  }).reduce(function (sum, i) {
    return sum + i
  }, 0)
}

function imageFormatter(value, row, index) {
  if (row.image != "" && row.image != null) {
    return '<img style="width: 50px; height: 50px;" src="../../assets/uploads/UserProfile/' + row.id + '/' + row.image + '" onerror="this.onerror=null, this.src = \'../../assets/images/user.png\'">'
  }
  else {
    return '<img style="width: 50px; height: 50px;" src="../../assets/images/user.png\">'
  }

}

function accessControlFommatter(value, row, index) {
  return "<a href='javascript:void(0)' data-toggle='modal' data-target='#AccessControlModal'><i class='fa fa-cogs'></i></a> ";

}
function userGroupRuleFommatter(value, row, index) {
  return "<a href='javascript:void(0)' data-toggle='modal' data-target='#UserGroupRuleModal'><i class='fa fa-cogs'></i></a> ";

}
function ruleSetRuleFommatter(value, row, index) {
  return "<a href='javascript:void(0)' data-toggle='modal' data-target='#RuleSetRuleModal'><i class='fa fa-cogs'></i></a> ";
}

function statusFormatter(value, row, index) {
  var actionButtons = ""

  if (row.VerificationStatus == "Approved") {
    actionButtons += '<a title="Verify"><i class="fa fa-user-check" style="color:rgba(30,123,53)"></i></a> ';
  }
  else if (row.VerificationStatus == "Rejected") {
    actionButtons += '<a title="Rejected"><i class="fa fa-ban" style="color:red"></i></a> ';
  }


  return [actionButtons].join('')
}

function LinkFormatter(value, row, index) {
  return "<a href='mailto:" + row.email + "'>" + value + "</a>";
}

function WebsiteFormatter(value, row, index) {
  if (value == null) {
    return null;
  } else {
    return "<a href='http://" + value + "' target='_blank'>" + value + "</a>";
  }
}

function CROBCFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    var id = row.BookingConfirmation;
    return "<a href='../booking-confirmation/update?id=" + id + "'target='_blank'>" + value + "</a>";
  }
}

function CROBRFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    var id = row.BookingReservation;
    return "<a href='../booking-reservation/update?id=" + id + "'target='_blank'>" + value + "</a>";
  }
}

function CROQTFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    var id = row.Quotation;
    return "<a href='../quotation/update?id=" + id + "'target='_blank'>" + value + "</a>";
  }
}

function salesinvoiceFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    var id = row.SalesInvoiceUUIDs;

    var docnum = value;

    if (id.includes(",")) {
      id = id.replace(/\s/g, '');
      docnum = docnum.replace(/\s/g, '');
      var eachID = id.split(",");
      var eachDocNUm = docnum.split(",");
      var LinkID = "";

      $.each(eachID, function (keyID, valueID) {

        $.each(eachDocNUm, function (keyDocNum, valueDocNum) {

          if (keyID == keyDocNum) {
            LinkID += "<a href='../sales-invoice/update?id=" + valueID + "'target='_blank'>" + valueDocNum + "</a>, ";
          }

        });

      });
      LinkID = LinkID.replace(/,\s*$/, "");
      return LinkID;

    } else {
      return "<a href='../sales-invoice/update?id=" + id + "'target='_blank'>" + value + "</a>";
    }

  }
}

// function LinkFormatterDocNum(value, row, index) {
//    if(row.DocNum==null){
//     return null;
//   }
//   else{
//     var id = row.BillOfLadingUUID;
//     return "<a href='../bill-of-lading/update?id=" + id + "'target='_blank'>" + value + "</a>";
//   }
// }

function LinkFormatterBCNo(value, row, index) {
  if (row.bookingConfirmation == null) {
    return null;
  }
  else {
    return "<a href='update?id=" + row.id + "' target='_blank'>" + value + "</a>";
  }
}



function CROFormatterDocNum(value, row, index) {
  if (row.ContainerReleaseOrderUUID == null) {
    return null;
  } else {
    return "<a href='../container-release-order/update?id=" + row.ContainerReleaseOrderUUID + "' target='_blank'>" + value + "</a>";
  }
}
function POFormatterDocNum(value, row, index) {
  if (row.PurchaseOrderUUID == null) {
    return null;
  } else {
    return "<a href='../purchase-order/update?id=" + row.PurchaseOrderUUID + "' target='_blank'>" + value + "</a>";
  }
}

function INVFormatterDocNum(value, row, index) {
  if (row.SalesInvoiceUUID == null) {
    return null;
  } else {
    return "<a href='../sales-invoice/update?id=" + row.SalesInvoiceUUID + "' target='_blank'>" + value + "</a>";
  }
}

function CNFormatterDocNum(value, row, index) {
  if (row.SalesCreditNoteUUID == null) {
    return null;
  } else {
    return "<a href='../credit-note/update?id=" + row.SalesCreditNoteUUID + "' target='_blank'>" + value + "</a>";
  }
}

function DBFormatterDocNum(value, row, index) {
  if (row.SalesDebitNoteUUID == null) {
    return null;
  } else {
    return "<a href='../debit-note/update?id=" + row.SalesDebitNoteUUID + "' target='_blank'>" + value + "</a>";
  }
}

function ORFormatterDocNum(value, row, index) {
  if (row.CustomerPaymentUUID == null) {
    return null;
  } else {
    return "<a href='../customer-payment/update?id=" + row.CustomerPaymentUUID + "' target='_blank'>" + value + "</a>";
  }
}


function BRFormatterDocNum(value, row, index) {
  if (row.BookingReservationUUID == null) {
    return null;
  } else {
    return "<a href='../booking-reservation/update?id=" + row.BookingReservationUUID + "' target='_blank'>" + value + "</a>";
  }
}

function BLDocFormatterDocNum(value, row, index) {
  // console.log(row.BillOfLadingUUID)
  if (row.billOfLading == null) {
    return null;
  }
  else {
    var id = row.billOfLading.BillOfLadingUUID;
    return "<a href='../bill-of-lading/update?id=" + id + "'target='_blank'>" + value + "</a>"
  }
}

function BLFormatterDocNum(value, row, index) {
  // console.log(row.BillOfLadingUUID)
  if (row.BillOfLadingUUID == null) {
    return null;
  }
  else {
    var id = row.BillOfLadingUUID;
    return "<a href='../bill-of-lading/update?id=" + id + "'target='_blank'>" + value + "</a>"
  }
}


function QuotationFormatterDocNum(value, row, index) {
  // console.log(row)
  if (row.quotation == null) {
    return null;
  } else {
    return "<a href='../quotation/update?id=" + row.quotation.QuotationUUID + "' target='_blank'>" + value + "</a>";
  }
}

function QTFormatterDocNum(value, row, index) {
  if (row.QuotationUUID == null) {
    return null;
  } else {
    return "<a href='../quotation/update?id=" + row.QuotationUUID + "' target='_blank'>" + value + "</a>";
  }
}

function DeliveryOrderFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    return "<a href='../delivery-order/update?id=" + row.DeliveryOrderUUID + "' target='_blank'>" + value + "</a>";
  }
}

function BookingConfirmationDOFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    return "<a href='../booking-confirmation/update?id=" + row.BookingConfirmation + "' target='_blank'>" + value + "</a>";
  }
}

function QuotationDOFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    return "<a href='../quotation/update?id=" + row.Quotation + "' target='_blank'>" + value + "</a>";
  }
}

function BillOfLadingDOFormatterDocNum(value, row, index) {
  if (value == null) {
    return null;
  } else {
    return "<a href='../bill-of-lading/update?id=" + row.BillOfLading + "' target='_blank'>" + value + "</a>";
  }
}

function GetText(text, value, field, data) {
  var search = text.toUpperCase();
  var rowData = $(value).text()

  // console.log(rowData.indexOf(search));
  if (rowData.indexOf(search) != -1) {
    // console.log("found");
    return true;
  } else {
    return false;
  }
}


function GetQuotation(text, value, field, data) {
  var search = text.toUpperCase();
  var rowData = $(value).text()

  // console.log(rowData.indexOf(search));
  if (rowData.indexOf(search) != -1) {
    // console.log("found");
    return true;
  } else {
    return false;
  }
}





function actionPreviewLetter(PDFSource) {
  $("#pdfFrameCRL").attr("src", PDFSource);
  $("#PreviewPdfModalCRL").modal("toggle");
}

function actionPreviewConfirmation(PDFSource) {
  $("#pdfFrameCnfrm").attr("src", PDFSource);
  $("#PreviewPdfModalCnfrm").modal("toggle");
}

function PreviewPdf(PDFsource) {
  $("#pdfFrame").attr("src", PDFsource);
  $("#PreviewPdfModal").modal("toggle");
}


function columnSetup(columns) {
  var res = [];
  $.each(columns, function (i, column) {
    if (column.field == "state") {
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

function GridActions() {

  var toggleValidAllDetails = {
    icon: 'fa-check-square',
    event: function () {
      var $table = $(paramsTable.tableSelector);
      var button = $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i");
      if (button.hasClass("fa-check-square") && button.hasClass("fa")) {
        $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-check-square");
        $(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "All");
        $table.bootstrapTable('refresh')
      } else if (button.hasClass("fa-check-square") && button.hasClass("far")) {
        $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-square");
        $(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Invalid");
        $table.bootstrapTable('refresh')
      } else if (button.hasClass("fa-square")) {
        $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "fa fa-check-square");
        $(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Valid");
        $table.bootstrapTable('refresh')
      }
    },
    attributes: {
      title: 'Valid'
    }
  };


  var toggleDays = {
    html: '<div class="dropdown">\
    <button class="btn btn-secondary dropdown-toggle" title="Archive" class="fas fa-archive" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
    <i class="fas fa-archive" aria-hidden="true"></i>\
    </button>\
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">\
      <a class="dropdown-item days" id="buttonThirtyDays">30 Days</a>\
      <a class="dropdown-item days" id="buttonHundredDays">100 Days</a>\
      <a class="dropdown-item days" id="buttonResetDay">None</a>\
    </div>\
  </div>',
  }

  var QT = window.location.pathname.includes("quotation");
  var BR = window.location.pathname.includes("booking-reservation");
  var INV = window.location.pathname.includes("sales-invoice");
  var CN = window.location.pathname.includes("sales-credit-note");
  var CP = window.location.pathname.includes("customer-payment");
  var CRO = window.location.pathname.includes("container-release-order");
  var BOL = window.location.pathname.includes("bill-of-lading");
  var DO = window.location.pathname.includes("delivery-order");
  var PO = window.location.pathname.includes("purchase-order");

  if (QT == true || BR == true || INV == true || CN == true || CP == true || CRO == true || BOL == true || DO == true || PO == true) {
    return {
      toggleValidAll: toggleValidAllDetails,
      toggleDays: toggleDays,
    }
  } else {
    return {
      toggleValidAll: toggleValidAllDetails,
    }
  }


}

function initTable(args) {
  $(".PageOverlay").show();
  if (searchParams.get('CompanyType')) {
    var permissionUrl = "./get-permission?CompanyType=" + searchParams.get('CompanyType')
  } else {
    var permissionUrl = "./get-permission";
  }
  var ArrayPermission = [];
  var CheckExport = false;
  $(".page-buttons").children().addClass('disabled-create');




  

  // var tableHeight = $(".content-wrapper").height() - $(".content-header").height() - $(".card").height() - $(".page-buttons").height() - 50;
  paramsTable = args;
  var $table = $(args.tableSelector);
  var $update = $('#update');      // for update button on action gridview 
  var $preview = $('#preview');      // for preview button on action gridview 
  var $disablepdf = $("#disablepdf");
  var $previewmodal = $('#previewmodal');
  var $previewmodalCRL = $('#previewmodalCRL');
  var $verify = $('#verify');      // for verify button on action gridview 
  var $verifyUser = $('#verifyUser');
  var $rejectStatus = $('#rejectStatus');
  var $rejectUser = $('#rejectUser');

  var $verifyModal = $('#verifyModal');
  var $transfer = $('#transfer');      // for transfer button on action gridview 
  var $trash = $('#trash');      // for trash button on action gridview 
  var $remove = $('#remove');      // for remove button on action gridview 
  var $removeModal = $('#removeModal');
  var $cro = $('#cro');      // for cro button on action gridview 
  var $transferto = $('#transferTo');      // for transfer to button on action gridview 
  var $SplitActionBL = $('#SplitActionBL');      // for split action on bill of lading
  var $MergeActionBL = $('#MergeActionBL');      // for merge action on bill of lading
  var $SplitActionBR = $('#SplitActionBR');      // for split action on booking reservation
  var $MergeActionBR = $('#MergeActionBR');      // for merge action on booking reservation


  var $telex = $('#telex');      // for telex release button on action gridview
  var $telexDisabled = $('#telexDisabled');
  var $confirm = $('#confirm');      // for confirm button on action gridview 
  var $confirmBOL = $('#confirmBOL');
  var $confirmCompany = $('#confirmCompany');

  var $revertSplit = $('#revertSplit');
  var $revertShare = $('#revertShare');

  var $revertSplitBL = $('#revertSplitBL')
  var $revertShareBL = $('#revertShareBL')

  var $disablepdf2 = $("#disablepdf2");
  var $previewmodal2 = $('#previewmodal2');
  var $previewmodalCnfrm = $('#previewmodalCnfrm');

  var $approved = $('#approved');
  var $reset = $('#reset');
  var $suspend = $('#suspend');
  var $reject = $('#reject');
  var $dnd = $('#dnd');
  var $dndBR = $('#dndBR'); //dnd for booking reservation

  var $previewPdfBL = $("#previewPdfBL");
  var $previewPdfSO = $('#previewPdfSO');
  var $previewPdfSAN = $('#previewPdfSAN');

  var $download = $('#download');
  var $downloadCreditNote = $('#downloadCreditNote');
  var $downloadDebitNote = $('#downloadDebitNote');
  var $downloadReceipt = $('#downloadReceipt');
  //if table drag cookies exist,use it as columns
  if (!!$.cookie($table[0]["id"] + "-drag")) {

    var arrColumn = JSON.parse($.cookie($table[0]["id"] + "-drag"));
    var DragArr = [];

    // console.log(arrColumn)

    $.each(arrColumn, function (key, value) {
      $.each(args.columns, function (key1, value1) {
        if (value == value1.field) {
          DragArr.push(value1);
          return;
        }
      })
    })

    args.columns = DragArr;
  }

  $table.bootstrapTable('destroy').bootstrapTable({
    buttons: "GridActions",
    // height: '630',
    toolbar: args.toolbarSelector,
    minimumCountColumns: 0,
    pagination: true,
    pageList: [10, 50, 100, 500],
    idField: 'id',
    ajax: args.functionGrid,
    columns: columnSetup(args.columns),
    // columns: args.columns,
    showRefresh: true,
    showColumns: true,
    showColumnsToggleAll: true,
    showExport: true,
    sidePagination: 'server',
    clickToSelect: true,
    searchOnEnterKey: false,
    exportTypes: ['excel', 'xlsx', 'pdf'],
    filterControl: true,
    cookie: "true",
    cookieExpire: '10y',
    resizable: true,
    reorderableColumns: true,
    cookieIdTable: args.cookieID,
    onLoadSuccess: function (data) {
      // $table.bootstrapTable('filterBy', { Valid: ["1"] }); // default show valid data only

      if ($table.bootstrapTable("getCookies")['columns'] == null) {
        $.each(args.hideColumns, function (key, value) {
          $table.bootstrapTable('hideColumn', value);
        });

      }

      $.ajax({
        type: "GET",
        url: permissionUrl,
        success: function (data) {
          $.each(data, function (key, value) {
            if (value.includes("create")) {

              $(".page-buttons").children().removeClass('disabled-create');
            }
            if (value.includes("export")) {
              CheckExport = true;
            }
            ArrayPermission.push(value)
          })

          if (searchParams.get('CompanyType')) {
            var companytype = searchParams.get('CompanyType').toLowerCase();
            $.each(ArrayPermission, function (key, value) {
              $("#toolbar").find("button").each(function () {
                if ($(this).attr("class").includes("update-company")) {
                  $(this).switchClass('update-company', 'update-' + companytype)
                }
                if ($(this).attr("class").includes("verify-company")) {
                  $(this).switchClass('verify-company', 'verify-' + companytype)
                }
                if ($(this).attr("class").includes("throw-company")) {
                  $(this).switchClass('throw-company', 'throw-' + companytype)
                }
                if ($(this).attr("class").includes("delete-company")) {
                  $(this).switchClass('delete-company', 'delete-' + companytype)
                }
              })

            })
          }

          if (ArrayPermission.length !== 0) {
            if (!CheckExport) {
              $(".export").find("button").prop("disabled", true)
              $(".export").find("button").next().remove()
            }
          }
          $(".PageOverlay").hide();
        }

      })

    }
  });

  $table.on('pre-body.bs.table', function () {
    $(window).trigger('resize');
    $('.fixed-table-body').css('overflow-y', 'hidden');
    $table.bootstrapTable('resetView');

  })

  $table.on('dbl-click-row.bs.table', function (row, element, field) {
    var id = element.id;

    if (CheckThirdParty == 1) {
      window.location.href = 'update?id=' + id + '&third-party=1';
    }
    else {
      if (searchParams.get('CompanyType')) {
        window.location.href = 'update?id=' + id + '&CompanyType=' + searchParams.get('CompanyType') + '';
      }
      else {
        window.location.href = 'update?id=' + id + '';
      }

    }

  })

  var initialColumn = args.columns;
  $table.on('reorder-column.bs.table', function (e, args) {
    //  console.log( $table[0]["id"]) ;
    var DragArr = [];
    var args1 = JSON.stringify(args);
    var cookiesName = $table[0]["id"] + "-drag";
    $.cookie(cookiesName, args1)

    $.each(args, function (key, value) {
      $.each(initialColumn, function (key1, value1) {
        if (value == value1.field) {
          DragArr.push(value1);
          return;
        }
      })
    })
  var  columns = DragArr;
    columns.shift();  //remove state field in columns           
    var tempArray = [];
    $.each(columns, function (key2, value2) {
      if (value2.hasOwnProperty('switchable')) {
        tempArray.push(key2);
      }
    })
    //remove switchable field from column array    
    $.each(tempArray, function (key3, value3) {
      columns.splice(value3, 1)
    })
    var columnCheckedStat = $table.bootstrapTable("getCookies")['columns'];
    $(".fixed-table-toolbar").find(".dropdown-menu").first().children().find("input:checkbox").not(":eq(0)").each(function (key3) {
      var value = $(this)[0];
      $(value).prop("checked", false);


      $.each(columns, function (key4, value4) {
        if (key3 == key4) {

          $(value).attr("data-field", value4.field);


          $(value).next().text(value4.title)
        }
      })

      $.each(columnCheckedStat, function (key5, value5) {
        if ($(value).attr("data-field") == value5) {
          $(value).prop("checked", true);
        }
      })
      $.each(args, function (key6, value6) {
        if (value6 == $(value).attr("data-field")) {
          $(value).val(key6)
        }
      });

    });

  });



  $('[data-widget="pushmenu"]').on("click", function () {
    setTimeout(function () { $table.bootstrapTable('resetView'); }, 350);
  });

  $table.on('refresh.bs.table', function () {

    $update.prop('disabled', true)
    $preview.prop('disabled', true)
    $disablepdf.prop('disabled', true)
    $disablepdf2.prop('disabled', true)
    $verify.prop('disabled', true)
    $verifyUser.prop('disabled', true)
    $rejectUser.prop('disabled', true)
    $rejectStatus.prop('disabled', true)
    $verifyModal.prop('disabled', true)
    $transfer.prop('disabled', true)
    $trash.prop('disabled', true)
    $remove.prop('disabled', true)
    $removeModal.prop('disabled', true)
    $telex.prop('disabled', true)
    $telexDisabled.prop('disabled', true)
    $cro.prop('disabled', true)
    $transferto.prop('disabled', true)
    $SplitActionBL.prop('disabled', true)
    $MergeActionBL.prop('disabled', true)
    $SplitActionBR.prop('disabled', true)
    $MergeActionBR.prop('disabled', true)
    $confirm.prop('disabled', true)
    $confirmBOL.prop('disabled', true)
    $confirmCompany.prop('disabled', true)
    $previewmodalCnfrm.prop('disabled', true)
    $approved.prop('disabled', true)
    $reset.prop('disabled', true)
    $suspend.prop('disabled', true)
    $reject.prop('disabled', true)
    $dnd.prop('disabled', true)
    $dndBR.prop('disabled', true)
    $revertSplit.prop('disabled', true)
    $revertShare.prop('disabled', true)

    $previewPdfBL.prop('disabled', false)
    $previewPdfSO.prop('disabled', false)
    $previewPdfSAN.prop('disabled', false)

    $download.prop('disabled', false)
    $downloadCreditNote.prop('disabled', false)
    $downloadDebitNote.prop('disabled', false)
    $downloadReceipt.prop('disabled', false)



  })

  function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
      return row.id
    })
  }

  function getRowSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
      return row
    })
  }


  function getIdSelectionsDnd() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
      return row;
    })
  }

  $table.on('check.bs.table', function (row, element, field) {
    $update.prop('disabled', false)
    // $preview.prop('disabled', false)
    $disablepdf.prop('disabled', false)
    $disablepdf2.prop('disabled', false)
    $verify.prop('disabled', false)
    $rejectStatus.prop('disabled', false)
    // $verifyModal.prop('disabled', false)
    $transfer.prop('disabled', false)
    $transferto.prop('disabled', false)
    $SplitActionBL.prop('disabled', false)
    $MergeActionBL.prop('disabled', false)
    $SplitActionBR.prop('disabled', false)
    $MergeActionBR.prop('disabled', false)
    // $trash.prop('disabled', false)
    $remove.prop('disabled', false)
    // $removeModal.prop('disabled', false)
    $telex.prop('disabled', false)
    $telexDisabled.prop('disabled', false)
    // $approved.prop('disabled', false)
    // $reset.prop('disabled', false)
    // $suspend.prop('disabled', false)
    $reject.prop('disabled', false)
    $dnd.prop('disabled', false)
    $dndBR.prop('disabled', false)


    $previewPdfBL.prop('disabled', false)
    $previewPdfSO.prop('disabled', false)
    $previewPdfSAN.prop('disabled', false)

    $download.prop('disabled', false)
    $downloadCreditNote.prop('disabled', false)
    $downloadDebitNote.prop('disabled', false)
    $downloadReceipt.prop('disabled', false)
    //temporary user does not have access control yet
    //code below to check user related page 


    if (ArrayPermission.length !== 0) {
      $.each(ArrayPermission, function (key, value) {

        $("#toolbar").find("button").each(function () {
          var resultData = $(this).attr('class').split(" ").filter(function (oneArray) {
            return oneArray == value;
          })
          if (resultData.length != 0) {
            $(this).prop('disabled', false)
          }
        })

      })
    }
    //end


    if (element.VerificationStatus == "Pending") {
      $confirmBOL.prop('disabled', false)
    } else {
      $confirmBOL.prop('disabled', true)
    }
    if (element.VerificationStatus == "Pending") {
      $confirmCompany.prop('disabled', false)
    } else {
      $confirmCompany.prop('disabled', true)
    }
    if (element.bookingConfirmation == null) {
      $confirm.prop('disabled', false)
      $cro.prop('disabled', true)
    } else {
      $confirm.prop('disabled', true)
      $cro.prop('disabled', false)
    }
    if (element.bookingConfirmation == null) {

      $previewmodal2.prop('disabled', false)
      $previewmodalCnfrm.prop('disabled', true)
    } else {
      $previewmodal2.prop('disabled', false)
      $previewmodalCnfrm.prop('disabled', false)
    }

    // console.log(element)
    if (element.splitParent == null) {
      $revertSplit.prop('disabled', true)
      $revertShare.prop('disabled', true)
    } else {
      $revertSplit.prop('disabled', false)
      $revertShare.prop('disabled', false)
    }

    // save your data, here just save the current page
    // selections = getIdSelections()
    // push or splice the selections if you want to save all data selections
  })


  // $table.on('all.bs.table', function (e, name, args) {
  //   console.log(name, args)
  // })


  $update.click(function () {
    var ids = getIdSelections()
    if (CheckThirdParty == 1) {
      window.location.href = 'update?id=' + ids + '&third-party=1';
    }
    else {
      if (searchParams.get('CompanyType')) {
        window.location.href = 'update?id=' + ids + '&CompanyType=' + searchParams.get('CompanyType');
      } else {
        window.location.href = 'update?id=' + ids + '';
      }
    }
  })
  $previewmodal.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:PreviewPdf("preview?id=' + ids + '");';
  })
  $previewmodalCRL.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:actionPreviewLetter("preview-letter?id=' + ids + '");';
  })
  $previewmodal2.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:PreviewPdf("preview?id=' + ids + '");';
  })
  $previewmodalCnfrm.click(function () {
    var ids = getIdSelections()
    var getData = $table.bootstrapTable('getSelections');
    var BCids = "";

    $.each(getData, function (key, value) {
      BCids = value.bookingConfirmation.BookingConfirmationUUID
    })
    window.location.href = 'javascript:actionPreviewConfirmation("preview-confirmation?id=' + BCids + '");';
  })
  $preview.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:PreviewPdf("preview?id=' + ids + '");';
  })
  $verify.click(function () {
    var ids = getIdSelections()
    if (searchParams.get('CompanyType')) {
      window.location.href = 'verify?id=' + ids + '&status=Verify&CompanyType=' + searchParams.get('CompanyType');
    } else {
      window.location.href = 'verify?id=' + ids + '&status=Verify';
    }

  })
  $verifyUser.click(function () {
    var ids = getIdSelections()
    if (searchParams.get('CompanyType')) {
      window.location.href = 'verify?id=' + ids + '&status=Reject&CompanyType=' + searchParams.get('CompanyType');
    } else {
      window.location.href = 'verify?id=' + ids + '&status=Reject';
    }
  })
  $rejectUser.click(function () {
    var ids = getIdSelections()
    $("#ButtonVerifyConfirmModal").modal("toggle");
    $("#ButtonVerifyModal").modal("toggle");
    $(".PageOverlay").show();
    window.location.href = './reject?id=' + ids + '';
  })

  $rejectStatus.click(function () {
    var ids = getIdSelections()
    $("#ButtonVerifyConfirmModal").modal("toggle");
    $("#ButtonVerifyModal").modal("toggle");
    $(".PageOverlay").show();
    window.location.href = 'verify?id=' + ids + '&status=Reject' ;
  })

  $verifyUser.click(function () {
    var ids = getIdSelections()
    $("#ButtonVerifyConfirmModal").modal("toggle");
    $("#ButtonVerifyModal").modal("toggle");
    $(".PageOverlay").show();
    window.location.href = './approved?id=' + ids + '';
  })
  
  $transfer.click(function () {
    var ids = getIdSelections()
    window.location.href = '../booking-reservation/transfer-from-quotation?id=' + ids + '';
  })
  $trash.click(function () {
    var ids = getIdSelections()
    if (CheckThirdParty == 1) {
      window.location.href = 'throw?id=' + ids + '&ThirdParty=1';

    }
    else {
      if (searchParams.get('CompanyType')) {
        window.location.href = 'throw?id=' + ids + '&CompanyType=' + searchParams.get('CompanyType');
      } else {
        window.location.href = 'throw?id=' + ids + '';
      }

    }
  })
  $remove.click(function () {
    var ids = getIdSelections()
    if (CheckThirdParty == 1) {
      window.location.href = 'remove?id=' + ids + '&ThirdParty=1';

    }
    else {
      if (searchParams.get('CompanyType')) {
        window.location.href = 'remove?id=' + ids + '&CompanyType=' + searchParams.get('CompanyType');
      } else {
        window.location.href = 'remove?id=' + ids + '';
      }

    }
  })
  $cro.click(function () {
    var ids = getIdSelections()
    window.location.href = '../container-release-order/transfer-from-booking-reservation?id=' + ids + '';
  })

  $transferto.click(function () {
    var ids = getRowSelections()
    $("#TransferBR").val("")
    $("#TransferBC").val("")
    $("#TransferBR").val(ids[0]["BookingReservationUUID"])
    if (ids[0]["bookingConfirmation"] !== null) {
      $("#TransferBC").val(ids[0]["bookingConfirmation"]["BookingConfirmationUUID"])
    }
  })

  $SplitActionBL.click(function () {
    var ids = getIdSelections()
    $("#SplitBL").val("")
    // console.log(ids)

    if (ids !== null) {
      $("#SplitBL").val(ids)
    }

    // console.log($("#SplitBL").val())
  })

  $MergeActionBL.click(function () {

    var ids = getRowSelections()
    var targetSelector = $("#mergeBL");
    var html = "";
    $("#MergeBLvalue").val("");
    var BillOfLadingUUID = ids[0]["BillOfLadingUUID"]
    var PODPortCode = ids[0]["PODPortCode"]
    var POLPortCode = ids[0]["POLPortCode"]
    var VoyageNum = ids[0]["voyageNum"]["VoyageUUID"]


    if (ids !== null) {
      $("#MergeBLvalue").val(BillOfLadingUUID)
      html = "<option value=''>Select..</option>";
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "./get-merge-bill-of-lading-list?id=" + BillOfLadingUUID + "&PODPortCode=" + PODPortCode + "&POLPortCode=" + POLPortCode + "&VoyageNum=" + VoyageNum,
        success: function (data) {

          $.each(data, function (key, value) {
            html += "<option value='" + value.BillOfLadingUUID + "'>" + value.DocNum + "</option>";
          });
          targetSelector.html(html);

        }

      });
    }
  })

  $SplitActionBR.click(function () {
    var ids = getIdSelections()
    $("#SplitBookingReservation").val("")

    if (ids !== null) {
      $("#SplitBookingReservation").val(ids)
    }

  })

  $MergeActionBR.click(function () {
    var ids = getRowSelections()
    var targetSelector = $("#mergeBR");
    var html = "";
    $("#MergeBRvalue").val("");

    var BookingReservationUUID = ids[0]["BookingReservationUUID"]
    var PODPortCode = ids[0]["PODPortCode"]
    var POLPortCode = ids[0]["POLPortCode"]
    var VoyageNum = ids[0]["voyageNum"]["VoyageUUID"]




    if (ids !== null) {
      $("#MergeBRvalue").val(BookingReservationUUID)
      html = "<option value=''>Select..</option>";
      $.ajax({
        type: "POST",
        dataType: "json",
        url: "./get-merge-booking-reservation-list?id=" + BookingReservationUUID + "&PODPortCode=" + PODPortCode + "&POLPortCode=" + POLPortCode + "&VoyageNum=" + VoyageNum,
        success: function (data) {

          $.each(data, function (key, value) {
            html += "<option value='" + value.BookingReservationUUID + "'>" + value.DocNum + "</option>";
          });
          targetSelector.html(html);

        }

      });
    }
  })

  $confirm.click(function () {
    var ids = getIdSelections()
    window.location.href = './create-booking-confirmation?id=' + ids + '';
  })
  $confirmBOL.click(function () {
    var ids = getIdSelections()
    window.location.href = './verify?id=' + ids + '';
  })
  $confirmCompany.click(function () {
    var ids = getIdSelections()
    window.location.href = './verify?id=' + ids + '';
  })
  $telex.click(function () {
    var ids = getIdSelections()
    window.location.href = './telex-release?id=' + ids + '';
  })
  $approved.click(function () {
    var ids = getIdSelections()
    // window.location.href = './approved?id=' + ids + '';
  })
  $reset.click(function () {
    var ids = getIdSelections()
    window.location.href = './reset?id=' + ids + '';
  })
  $suspend.click(function () {
    var ids = getIdSelections()
    window.location.href = './suspend?id=' + ids + '';
  })
  $reject.click(function () {
    var ids = getIdSelections()
    window.location.href = './reject?id=' + ids + '';
  })

  $previewPdfBL.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:PreviewPdf("preview?id=' + ids + '&ReportType=BillOfLading");';
  })
  $previewPdfSO.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:PreviewPdf("preview?id=' + ids + '&ReportType=ShippingOrder");';
  })
  $previewPdfSAN.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:PreviewPdf("preview?id=' + ids + '&ReportType=ShippingAdviceNote");';
  })

  $revertSplitBL.click(function () {
    var ids = getIdSelections()
    window.location.href = './revert-split?id=' + ids + '';
  })
  $revertShareBL.click(function () {
    var ids = getIdSelections()
    window.location.href = './revert-share?id=' + ids + '';
  })


  $dnd.click(function () {
    var ids = getIdSelectionsDnd()


    if (ids[0]["DNDCombined"] == 1) {
      $("#quotation-dndcombined").prop("checked", true);
      $(".DNDCombineDay").removeClass('d-none')
      $(".Detention").addClass('d-none')
      $(".Demurrage").addClass('d-none')
    }
    else {
      $("#quotation-dndcombined").prop("checked", false);
      $(".DNDCombineDay").addClass('d-none')
      $(".Detention").removeClass('d-none')
      $(".Demurrage").removeClass('d-none')
    }

    if (ids[0]["ApplyDND"] == 1) {
      $("#quotation-applydnd").prop("checked", true);
    }
    else {
      $("#quotation-applydnd").prop("checked", false);
      $(".DNDCombined").addClass('d-none')
      $(".DNDCombineDay").addClass('d-none')
      $(".Detention").addClass('d-none')
      $(".Demurrage").addClass('d-none')
    }

    $("#quotationuuid").val(ids[0]["QuotationUUID"])
    $("#quotation-dndcombinedday").val(ids[0]["DNDCombinedDay"])
    $("#quotation-detention").val(ids[0]["Detention"])
    $("#quotation-demurrage").val(ids[0]["Demurrage"])
  })

  $dndBR.click(function () {
    var ids = getIdSelectionsDnd()
    //console.log(ids);

    if (ids[0]["DNDCombined"] == 1) {
      $("#bookingreservation-dndcombined").prop("checked", true);
      $(".DNDCombineDay").removeClass('d-none')
      $(".Detention").addClass('d-none')
      $(".Demurrage").addClass('d-none')
    }
    else {
      $("#bookingreservation-dndcombined").prop("checked", false);
      $(".DNDCombineDay").addClass('d-none')
      $(".Detention").removeClass('d-none')
      $(".Demurrage").removeClass('d-none')
    }

    if (ids[0]["ApplyDND"] == 1) {
      $("#bookingreservation-applydnd").prop("checked", true);
    }
    else {
      $("#bookingreservation-applydnd").prop("checked", false);
      $(".DNDCombined").addClass('d-none')
      $(".DNDCombineDay").addClass('d-none')
      $(".Detention").addClass('d-none')
      $(".Demurrage").addClass('d-none')
    }

    $("#bookingreservationuuid").val(ids[0]["BookingReservationUUID"])
    $("#bookingreservation-dndcombinedday").val(ids[0]["DNDCombinedDay"])
    $("#bookingreservation-detention").val(ids[0]["Detention"])
    $("#bookingreservation-demurrage").val(ids[0]["Demurrage"])
  })

  $download.unbind();
  $download.click(function () {

    var ids = getIdSelections();
    var ids = ids.toString();
    var today = new Date();
    var date = today.getDate() + '_' + (today.getMonth() + 1) + '_' + today.getFullYear();
    $.ajax({
      type: "POST",
      url: "./salesxls?id=" + ids,
      success: function (data) {
        var downloadLink = document.createElement("a");
        var fileData = [data];

        var blobObject = new Blob(fileData, {
          type: "text/xls;charset=utf-8;"
        });

        var url = URL.createObjectURL(blobObject);
        downloadLink.href = url;
        downloadLink.download = "Invoice_" + date + ".xls";

        /*
         * Actually download xls
         */
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    })
  })

  $downloadCreditNote.unbind();
  $downloadCreditNote.click(function () {

    var ids = getIdSelections();
    var ids = ids.toString();
    var today = new Date();
    var date = today.getDate() + '_' + (today.getMonth() + 1) + '_' + today.getFullYear();
    $.ajax({
      type: "POST",
      url: "../credit-note/creditxls?id=" + ids,
      success: function (data) {
        var downloadLink = document.createElement("a");
        var fileData = [data];

        var blobObject = new Blob(fileData, {
          type: "text/xls;charset=utf-8;"
        });

        var url = URL.createObjectURL(blobObject);
        downloadLink.href = url;
        downloadLink.download = "CreditNote" + date + ".xls";

        /*
         * Actually download xls
         */
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    })
  })

  $downloadDebitNote.unbind();
  $downloadDebitNote.click(function () {

    var ids = getIdSelections();
    var ids = ids.toString();
    var today = new Date();
    var date = today.getDate() + '_' + (today.getMonth() + 1) + '_' + today.getFullYear();
    $.ajax({
      type: "POST",
      url: "../debit-note/debitxls?id=" + ids,
      success: function (data) {
        var downloadLink = document.createElement("a");
        var fileData = [data];

        var blobObject = new Blob(fileData, {
          type: "text/xls;charset=utf-8;"
        });

        var url = URL.createObjectURL(blobObject);
        downloadLink.href = url;
        downloadLink.download = "DebitNote" + date + ".xls";

        /*
         * Actually download xls
         */
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    })
  })

  $downloadReceipt.unbind();
  $downloadReceipt.click(function () {

    var ids = getIdSelections();
    var ids = ids.toString();
    var today = new Date();
    var date = today.getDate() + '_' + (today.getMonth() + 1) + '_' + today.getFullYear();
    $.ajax({
      type: "POST",
      url: "../customer-payment/receiptxls?id=" + ids,
      success: function (data) {
        var downloadLink = document.createElement("a");
        var fileData = [data];

        var blobObject = new Blob(fileData, {
          type: "text/xls;charset=utf-8;"
        });

        var url = URL.createObjectURL(blobObject);
        downloadLink.href = url;
        downloadLink.download = "Receipt" + date + ".xls";

        /*
         * Actually download xls
         */
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    })
  })
  //temporary user does not have access control yet
  //code below to check user related page 


}