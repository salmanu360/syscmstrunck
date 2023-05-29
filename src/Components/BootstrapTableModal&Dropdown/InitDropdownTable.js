import $ from "jquery";

var paramsDropdownTable = {};

function columnSetup(columns) {
  var res = [
    {
      field: 'state',
      radio: true,
      rowspan: 1,
      align: 'center',
      valign: 'middle'
    }
  ];
  $.each(columns, function (i, column) {
    column.sortable = true;
    column.align = 'center';
    column.valign = 'middle';
    res.push(column);
  })

  return res;
}

export function InitDropdownTable(args) {

  paramsDropdownTable = args;
  var count=0
  if(paramsDropdownTable.tableSelector.includes("Quickform")){
    var table = paramsDropdownTable.tableSelector
  }else{
    var table = $(paramsDropdownTable.searchSelector).next().find("table")
        table.length>1?table=$(paramsDropdownTable.searchSelector).next().find("table").eq(1).attr('id'):table=table
  }
  window.$(table).unbind().bootstrapTable('destroy').bootstrapTable({
    height: 550,
    cache: true,
    searchSelector: args.searchSelector,
    clickToSelect: true,
    minimumCountColumns: 1,
    ajax: args.functionGrid,
    showRefresh: true,
    search: true,
    pagination: true,
    sidePagination: 'server',
    pageList: [10, 25, 50, 100, 'all'],
    pageSize: 50,
    idField: 'id',
    columns: columnSetup(args.columns),
    onPostBody: function () { 
      $(table).find("tr > *:nth-child(1)").addClass('d-none');  
    },
    onLoadSuccess: function (data) {
      if(data.total!=="0"){ 
        window.$(table).bootstrapTable('check', 0)
      }
      
    }
  });

  window.$(table).unbind().on('click-row.bs.table', function (row, element, field) {
    if ($(args.clearMatch).val() != element.CompanyUUID) {
      $.each(args.clearSelector, function (key, value) {
        var selector = value['input'];
        $(selector).val("");
      });
    }
    $.each(args.inputSelector, function (key, value) {
      var selector = value['input'];
      var name = value['name'];
      var data = element[name];
      var BranchCodeSelected = selector.includes("BranchCode");
      if (BranchCodeSelected == true) {
        window.$(selector).val(data + "(" + element["portCode"]["PortCode"] + ")").trigger('change');
      } else {
        if (selector.includes("CreditTerm")) {
          if (args.specialFormName.includes("Hauler")) {
            if(args.specialFormName.includes("ContainerReleaseOrder")){
         
              var splitSpecialName = args.specialFormName.split(/(?=[A-Z])/)
              var searchSelector = args.searchSelector.split("-")
              args.setValue(`ContainerReleaseOrderHauler[${searchSelector[1]}CreditTerm]`, data)

            }else if(args.specialFormName.includes("BillOfLading")){
              var splitSpecialName = args.specialFormName.split(/(?=[A-Z])/)
              var searchSelector = args.searchSelector.split("-")

              args.setValue(`BillOfLadingHauler[${searchSelector[1]}CreditTerm]`, data)

            }else{
              var splitSpecialName = args.specialFormName.split(/(?=[A-Z])/)
              var searchSelector = args.searchSelector.split("-")
              if(splitSpecialName[0] == "Quotation"){
                args.setValue(`${splitSpecialName[0] + splitSpecialName[4]}[${searchSelector[1]}CreditTerm]`, data)
              }else{
                args.setValue(`${splitSpecialName[0]+splitSpecialName[1] + splitSpecialName[5]}[${searchSelector[1]}CreditTerm]`, data)
              }
            }
         
          } else {
            if(args.specialFormName=="SalesCreditNoteBillTo" || args.specialFormName=="SalesDebitNoteBillTo"){
              args.setValue(`${(args.specialFormName).replace("BillTo","")}[CreditTerm]`, data)
            }else if (args.specialFormName=="PurchaseOrderSupplier"){
              args.setValue(`${(args.specialFormName).replace("Supplier","")}[CreditTerm]`, data)
            }
            else{
            
              args.setValue(`${args.specialFormName}[CreditTerm]`, data)
            }
           
          }
        } else {
          if ($(selector).attr('name')) {
            if ($(selector).attr('name').includes("DynamicModel")) {
              var columnName = $(selector).attr('name').split('[').pop().replace(']', '')
             if(args.searchSelector=="#BranchCode-BillTo-DetailForm"){   
              if(selector=='input[data-target="BranchName-BillTo"]'){
                $("#customerpaymentbillto-branchcode").trigger("change")
              }
             }
              if (args.setValue) {
                args.setValue(`DynamicModel[${columnName}]`, data)
              }
              if (args.trigger) {
                args.trigger(`DynamicModel[${columnName}]`)
              }
              window.$(selector).val(data).trigger('change');
            }
            else if ($(selector).attr('name').includes("FreightParty")){
              window.$(selector).val(data).trigger('change');

              if($(selector).attr('name').includes("BranchAddressLine1")){
                $("span[data-target='BranchAddressLine1-FreightParty']").text(data);
              }
              if($(selector).attr('name').includes("BranchAddressLine2")){
                $("span[data-target='BranchAddressLine2-FreightParty']").text(data);
              }
              if($(selector).attr('name').includes("BranchAddressLine3")){
                $("span[data-target='BranchAddressLine3-FreightParty']").text(data);
              }
              if($(selector).attr('name').includes("BranchTel")){
                $("span[data-target='BranchTel-FreightParty']").text(data);
              }
              if($(selector).attr('name').includes("BranchFax")){
                $("span[data-target='BranchFax-FreightParty']").text(data);
              }
            
            }
            else {
              window.$(selector).val(data).trigger('change');
            }
          }
          else {
            window.$(selector).val(data).trigger('change');
          }
        }
      }
    });

    $(".dropdownTable").addClass("d-none");
  })


  // window.$(table).on('post-body.bs.table', function (data, columns) {

  //   count=count+1;
  
  //   if(count==3 || count==1){
  //      window.$(table).bootstrapTable('check', 0)
  //   }


  //   window.$(table).bootstrapTable('resetView');

  // })
}


//start : check the code and fill in or clear related data
export function checkCode(currentID, fillType, tableType) {
  var search = $(currentID).val();
  var bootstrapTableID = $(currentID).next().find(".fixed-table-body").find("table").attr("id");
  var data = window.$("#" + bootstrapTableID).bootstrapTable('getData');
  var found = false;
  var lowerFillType = fillType.toLowerCase();

  if (tableType == "Company") {
    $.each(data, function (key, value) {
      if (search == value["ROC"]) {
        if (value['UUID'] != $("#quotation" + lowerFillType + "-roc").val()) {

          $('input[data-target="BranchCode-' + fillType + '"]').val("");
          $('input[data-target="BranchName-' + fillType + '"]').val("");
          $('input[data-target="BranchTel-' + fillType + '"]').val("");
          $('input[data-target="BranchEmail-' + fillType + '"]').val("");
          $('input[data-target="BranchFax-' + fillType + '"]').val("");
          $('input[data-target="BranchAddressLine1-' + fillType + '"]').val("");
          $('input[data-target="BranchAddressLine2-' + fillType + '"]').val("");
          $('input[data-target="BranchAddressLine3-' + fillType + '"]').val("");
          $('input[data-target="BranchPostcode-' + fillType + '"]').val("");
          $('input[data-target="BranchCity-' + fillType + '"]').val("");
          $('input[data-target="BranchCountry-' + fillType + '"]').val("");
          $('input[data-target="BranchCoordinates-' + fillType + '"]').val("");
          $('input[data-target="AttentionName-' + fillType + '"]').val("");
          $('input[data-target="AttentionTel-' + fillType + '"]').val("");
          $('input[data-target="AttentionEmail-' + fillType + '"]').val("");

        }

        $("input[data-target='CompanyID-" + fillType + "']").val(value["CompanyUUID"]);
        $("input[data-target='CompanyROC-" + fillType + "']").val(value["ROC"]);
        $("input[data-target='CompanyName-" + fillType + "']").val(value["CompanyName"]);
        $("input[data-target='CreditTerm-" + fillType + "']").val(value["CreditTerm"]);
        $("input[data-target='CreditLimit-" + fillType + "']").val(value["CreditLimit"]);
        found = true;
      }
    });

    if (!found) {
      $("input[data-target='CompanyID-" + fillType + "']").val("");
      $("input[data-target='CompanyROC-" + fillType + "']").val("");
      $("input[data-target='CompanyName-" + fillType + "']").val("");
      $("select[data-target='CreditTerm-" + fillType + "']").val("").trigger("change.select2");
      $("input[data-target='CreditLimit-" + fillType + "']").val("");
      $("input[data-target='BranchID-" + fillType + "']").val("");
      $("input[data-target='BranchCode-" + fillType + "']").val("");
      $("input[data-target='BranchName-" + fillType + "']").val("");
      $("input[data-target='BranchTel-" + fillType + "']").val("");
      $("input[data-target='BranchEmail-" + fillType + "']").val("");
      $("input[data-target='AttentionName-" + fillType + "']").val("");
      $("input[data-target='AttentionTel-" + fillType + "']").val("");
      $("input[data-target='AttentionEmail-" + fillType + "']").val("");
      $("input[data-target='BranchFax-" + fillType + "']").val("");
      $('input[data-target="BranchAddressLine1-' + fillType + '"]').val("");
      $('input[data-target="BranchAddressLine2-' + fillType + '"]').val("");
      $('input[data-target="BranchAddressLine3-' + fillType + '"]').val("");
      $('input[data-target="BranchPostcode-' + fillType + '"]').val("");
      $('input[data-target="BranchCity-' + fillType + '"]').val("");
      $('input[data-target="BranchCoordinates-' + fillType + '"]').val("");
      $('input[data-target="BranchCountry-' + fillType + '"]').val("");
    }
  } else if (tableType == "Branch") {
    $.each(data, function (key, value) {
      if (search == value["BranchCode"]) {
        if (value['UUID'] != $("#quotation" + lowerFillType + "-branchcode").val()) {

          $('input[data-target="AttentionName-' + fillType + '"]').val("");
          $('input[data-target="AttentionTel-' + fillType + '"]').val("");
          $('input[data-target="AttentionEmail-' + fillType + '"]').val("");

        }

        $("input[data-target='BranchID-" + fillType + "']").val(value["CompanyBranchUUID"]);
        $("input[data-target='BranchCode-" + fillType + "']").val(value["BranchCode"]);
        $("input[data-target='BranchName-" + fillType + "']").val(value["BranchName"]);
        $("input[data-target='BranchTel-" + fillType + "']").val(value["Tel"]);
        $("input[data-target='BranchEmail-" + fillType + "']").val(value["Email"]);
        $("input[data-target='BranchFax-" + fillType + "']").val(value["Fax"]);
        $("input[data-target='BranchAddressLine1-" + fillType + "']").val(value["AddressLine1"]);
        $("input[data-target='BranchAddressLine2-" + fillType + "']").val(value["AddressLine2"]);
        $("input[data-target='BranchAddressLine3-" + fillType + "']").val(value["AddressLine3"]);
        $("input[data-target='BranchPostcode-" + fillType + "']").val(value["Postcode"]);
        $("input[data-target='BranchCity-" + fillType + "']").val(value["City"]);
        $("input[data-target='BranchCountry-" + fillType + "']").val(value["Country"]);
        $("input[data-target='BranchCoordinates-" + fillType + "']").val(value["Coordinates"]);
        found = true;
      }
    });

    if (!found) {
      $("input[data-target='BranchID-" + fillType + "']").val("");
      $("input[data-target='BranchCode-" + fillType + "']").val("");
      $("input[data-target='BranchName-" + fillType + "']").val("");
      $("input[data-target='BranchEmail-" + fillType + "']").val("");
      $("input[data-target='BranchTel-" + fillType + "']").val("");
      $("input[data-target='BranchFax-" + fillType + "']").val("");
      $("input[data-target='BranchAddressLine1-" + fillType + "']").val("");
      $("input[data-target='BranchAddressLine2-" + fillType + "']").val("");
      $("input[data-target='BranchAddressLine3-" + fillType + "']").val("");
      $("input[data-target='BranchPostcode-" + fillType + "']").val("");
      $("input[data-target='BranchCity-" + fillType + "']").val("");
      $("input[data-target='BranchCountry-" + fillType + "']").val("");
      $("input[data-target='BranchCoordinates-" + fillType + "']").val("");
      $("input[data-target='AttentionName-" + fillType + "']").val("");
      $("input[data-target='AttentionTel-" + fillType + "']").val("");
      $("input[data-target='AttentionEmail-" + fillType + "']").val("");
    }
  }
}
//end : check the code and fill in or clear related data