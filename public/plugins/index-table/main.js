var paramsTable = {};
var selections = [];
var selectedRow = [];

let searchParams = new URLSearchParams(window.location.search)
var CheckThirdParty = searchParams.get('third-party');
	window.jsPDF = window.jspdf.jsPDF
function responseHandler(res) {
 
  $.each(res.rows, function (i, row) {
    row.state = $.inArray(row.id, selections) !== -1
  })
  console.log(res)
  return res
}

console.log('koko')

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
  return '<img style="width: 50px; height: 50px;" src="../../assets/uploads/UserProfile/' + row.id + '/' + row.image + '" onerror="this.onerror=null, this.src = \'../../assets/images/user.png\'">'
}

function accessControlFommatter(value, row, index) {
   return "<a href='javascript:void(0)' data-toggle='modal' data-target='#AccessControlModal'><i class='fa fa-cogs'></i></a> ";
  
}

function LinkFormatter(value, row, index) {
  return "<a href='mailto:" + row.email + "'>" + value + "</a>";
}

function WebsiteFormatter(value, row, index) {
  if(value==null){
    return null;
  } else {
    return "<a href='http://" + value + "' target='_blank'>" + value + "</a>";
  }
}

function CROBCFormatterDocNum(value, row, index) {
  if(value==null){
    return null;
  } else {
    var id = row.BookingConfirmation;
    return "<a href='../booking-confirmation/update?id=" + id + "'target='_blank'>" + value + "</a>";
  }
}

function CROQTFormatterDocNum(value, row, index) {
  if(value==null){
    return null;
  } else {
    var id = row.Quotation;
    return "<a href='../quotation/update?id=" + id + "'target='_blank'>" + value + "</a>";
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
    return "<a href='../sales-credit-note/update?id=" + row.SalesCreditNoteUUID + "' target='_blank'>" + value + "</a>";
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



function operateFormatter(value, row, index) {

  var actionButtons = "";
  $.each(paramsTable.actions, function (key, values) {
    if (values['url'] == "preview") {
      // actionButtons += '<a href="'+values['url']+'?id='+row.id+'" title="'+values['type']+'" target="_blank"><i class="'+values['icon']+'"></i></a> ';
      actionButtons += '<a href="javascript:PreviewPdf(\'' + values['url'] + '?id=' + row.id + '\');" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
    }
    else if (values['url'] == 'throw') {
      if (row.Valid == "1") {
        values['icon'] = "fa fa-trash";
        values['type'] = "Trash";
      } else {
        values['icon'] = "fa fa-trash-restore";
        values['type'] = "Retrieve";
      }
      actionButtons += '<a href="' + values['url'] + '?id=' + row.id + '" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
    } else if (values['url'] == 'verify') {
      values['icon'] = "fa fa-user-check";
      values['type'] = "Verify";
      actionButtons += '<a href="' + values['url'] + '?id=' + row.id + '" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
    } else if (values['url'] == 'transfer') {
      values['url'] == "#";
      actionButtons += '<a href="#" title="' + values['type'] + '"><i class="' + values['icon'] + '" onclick="transferTo(\'' + row.id + '\', \'' + values['baseurl'] + '\')"></i></a> ';
    } else if (values['url'] == 'telex-release') {
      values['icon'] = "fa fa-share-square";
      values['type'] = "Telex Release";
      actionButtons += '<a href="' + values['url'] + '?id=' + row.id + '" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
    } else if (values['url'] == './create-booking-confirmation') {
      values['icon'] = "fa fa-check-circle";
      values['type'] = "Confirm";
      if (row.BookingConfirmation == null) {
        actionButtons += '<a href="' + values['url'] + '?id=' + row.id + '" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
      }
    } else if (values['url'] == '../container-release-order/transfer-from-booking-reservation') {
      if (row.BookingConfirmation != null) {
        actionButtons += '<a href="' + values['url'] + '?id=' + row.id + '" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
      }
    }
    else if (CheckThirdParty == 1) { // update
      actionButtons += '<a href="' + values['url'] + '?id=' + row.id + "&third-party=1" + '" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
    }
    else {
      actionButtons += '<a href="' + values['url'] + '?id=' + row.id + '" title="' + values['type'] + '"><i class="' + values['icon'] + '"></i></a> ';
    }
  });
  return [actionButtons].join('')
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

function dateSort(a, b) {
  var momentA = moment(a, "DD/MM/YYYY");
  var momentB = moment(b, "DD/MM/YYYY");
  if (momentA > momentB) return 1;
  else if (momentA < momentB) return -1;
  else return 0;
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

  if(QT == true || BR == true || INV == true || CN == true || CP == true || CRO == true || BOL == true || DO == true || PO == true){
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
  // var tableHeight = $(".content-wrapper").height() - $(".content-header").height() - $(".card").height() - $(".page-buttons").height() - 50;
  paramsTable = args;
  var $table = $(args.tableSelector);
  var $update = $('#update');      // for update button on action gridview 
  var $preview = $('#preview');      // for preview button on action gridview 
  var $disablepdf = $("#disablepdf");
  var $previewmodal = $('#previewmodal');
  var $previewmodalCRL = $('#previewmodalCRL');
  var $verify = $('#verify');      // for verify button on action gridview 
  var $transfer = $('#transfer');      // for transfer button on action gridview 
  var $trash = $('#trash');      // for trash button on action gridview 
  var $remove = $('#remove');      // for remove button on action gridview 
  var $cro = $('#cro');      // for cro button on action gridview 
  var $telex = $('#telex');      // for telex release button on action gridview
  var $confirm = $('#confirm');      // for confirm button on action gridview 
  var $confirmBOL = $('#confirmBOL');
  var $confirmCompany = $('#confirmCompany');
  var $getAll = $('#getAll');
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
    pageList: [10, 25, 50, 100, 'all'],
    idField: 'id',
    ajax: args.functionGrid,
    columns: columnSetup(args.columns),
    // columns: args.columns,
    showRefresh: true,
    showColumns: true,
    showColumnsToggleAll: true,
    showExport: true,
	maintainMetaData:true,
	sidePagination:'server',
    clickToSelect: true,
    searchOnEnterKey: false,
    exportTypes: ['excel', 'xlsx','pdf'],
    filterControl: true,
    cookie: "true",
    cookieExpire: '10y',
    resizable: true,
    reorderableColumns: true,
    cookieIdTable: args.cookieID,
    responseHandler: function (res) {
        console.log(res)
  $.each(res.rows, function (i, row) {
    row.state = $.inArray(row.id, selections) !== -1
  })

  return res
      },
    onLoadSuccess: function (data) {
     // $table.bootstrapTable('filterBy', { Valid: ["1"] }); // default show valid data only

      if ($table.bootstrapTable("getCookies")['columns'] == null) {
        $.each(args.hideColumns, function (key, value) {
          $table.bootstrapTable('hideColumn', value);
        });
      }
    }
  });

  $table.on('pre-body.bs.table', function () {
    $table.bootstrapTable('resetView');
  })

  $table.on('page-change.bs.table', function () {
    $('.fixed-table-body').css('overflow-y','hidden');
  })


  $getAll.click(function () {
   
    var getData = selectedRow;
       console.log(getData);
   

  })
  
  $table.on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table',
  function (e, rowsAfter, rowsBefore) {
     
    var rows = rowsAfter

    if (e.type === 'uncheck-all') {
      rows = rowsBefore
    }

    var ids = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {
     
      return row.id
    })
	
	 var rowSelected = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {
     
      return row
    })
  
    
    var func = $.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"
 
	selectedRow= window._[func](selectedRow, rowSelected)
	
    selections = window._[func](selections, ids)
	
	
	 
	console.log(selectedRow);

    
  }
  )


  $table.on('dbl-click-row.bs.table', function (row, element, field) {
    

    // let location=ReactRouterDOM.useLocation()
    // console.log(location)
    // id = element.id;
    // if (CheckThirdParty == 1) {
    //   window.location.href = 'update?id=' + id + '&third-party=1';
    // }
    // else {
    //   window.location.href = 'update?id=' + id + '';
    // }

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
    columns = DragArr;
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
    $transfer.prop('disabled', true)
    $trash.prop('disabled', true)
    $remove.prop('disabled', true)
    $telex.prop('disabled', true)
    $cro.prop('disabled', true)
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

    $previewPdfBL.prop('disabled', false)
    $previewPdfSO.prop('disabled', false)
    $previewPdfSAN.prop('disabled', false)



  })

  function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
      return row.id
    })
  }

  function getIdSelectionsDnd() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
      return row;
    })
  }

  $table.on('check.bs.table', function (row, element, field) {
    $update.prop('disabled', false)
    $preview.prop('disabled', false)
    $disablepdf.prop('disabled', false)
    $disablepdf2.prop('disabled', false)
    $verify.prop('disabled', false)
    $transfer.prop('disabled', false)
    $trash.prop('disabled', false)
    $remove.prop('disabled', false)
    $telex.prop('disabled', false)
    $approved.prop('disabled', false)
    $reset.prop('disabled', false)
    $suspend.prop('disabled', false)
    $reject.prop('disabled', false)
    $dnd.prop('disabled', false)
    $dndBR.prop('disabled', false)

    $previewPdfBL.prop('disabled', false)
    $previewPdfSO.prop('disabled', false)
    $previewPdfSAN.prop('disabled', false)


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
    if (element.BookingConfirmation == null) {
      $confirm.prop('disabled', false)
      $cro.prop('disabled', true)
    } else {
      $confirm.prop('disabled', true)
      $cro.prop('disabled', false)
    }


    if (element.BookingConfirmation == null) {
      $previewmodal2.prop('disabled', false)
      $previewmodalCnfrm.prop('disabled', true)
    } else {
      $previewmodal2.prop('disabled', false)
      $previewmodalCnfrm.prop('disabled', false)
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
      window.location.href = 'update?id=' + ids + '';
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
    BCids = "";

    $.each(getData, function (key, value) {
      BCids = value.BookingConfirmation.BookingConfirmationUUID
    })
    window.location.href = 'javascript:actionPreviewConfirmation("preview-confirmation?id=' + BCids + '");';
  })
  $preview.click(function () {
    var ids = getIdSelections()
    window.location.href = 'javascript:PreviewPdf("preview?id=' + ids + '");';
  })
  $verify.click(function () {
    var ids = getIdSelections()
    window.location.href = 'verify?id=' + ids + '';
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
      window.location.href = 'throw?id=' + ids + '';
    }
  })
  $remove.click(function () {
    var ids = getIdSelections()
    if (CheckThirdParty == 1) {
      window.location.href = 'remove?id=' + ids + '&ThirdParty=1';
  
    }
    else {
      window.location.href = 'remove?id=' + ids + '';
    }
  })
  $cro.click(function () {
    var ids = getIdSelections()
    window.location.href = '../container-release-order/transfer-from-booking-reservation?id=' + ids + '';
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
    window.location.href = './approved?id=' + ids + '';
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

}