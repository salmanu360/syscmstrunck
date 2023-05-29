import $ from "jquery"
import { getContainersWithModal, getContainers } from "../Helper";

var paramsDropdownTable = {};
var selections = [];
var GetSelectContainer;
var select2ContainerCodeValue = [];

export function ShareContainerModel({ formName, index, fields, getValues, setValue, update, globalContext }) {
  if (formName == "ContainerReleaseOrder") {
    var ContainerType = getValues(`${formName}HasContainer[${index}][ContainerType]`)
    var OwnershipType = getValues(`${formName}HasContainer[${index}][BoxOwnership]`)
    var select2ContainerCode = $.map(getValues(`${formName}HasContainer` + '[' + index + ']' + '[ContainerCode][]'), function (val, i) {
      return val.value
    });
  } else {
    var ContainerType = getValues(`${formName}HasContainerType[${index}][ContainerType]`)
    var OwnershipType = getValues(`${formName}HasContainerType[${index}][BoxOwnership]`)
    var select2ContainerCode = getValues(`${formName}HasContainerType` + '[' + index + ']' + '[ContainerCode][]')
  }

  // console.log(ContainerType)
  // console.log(OwnershipType)
  // console.log(select2ContainerCode)

  var Quantity;
  var DuplicatedContainerCode = [];
  select2ContainerCodeValue = select2ContainerCode ? select2ContainerCode : []
  var StringContainerCodeValue = select2ContainerCode ? select2ContainerCode.toString() : "";

  if (formName == "ContainerReleaseOrder") {
    var DepotBranch = $("input[name='ContainerReleaseOrder[DepotBranch]']").val();
    var urlLink = "container/get-container-by-ownership-and-type?OwnershipType=" + OwnershipType + "&ContainerType=" + ContainerType + "&ContainerCodes=" + StringContainerCodeValue + "&DepotBranch=" + DepotBranch + ""
  } else {
    var urlLink = "container/get-container-by-ownership-and-type?OwnershipType=" + OwnershipType + "&ContainerType=" + ContainerType + "&ContainerCodes=" + StringContainerCodeValue + "&DuplicatedContainerCode=" + DuplicatedContainerCode + ""
  }
  window.$("#ContainerModal").modal("toggle");

  initQuotationContainerCodeTable({
    tableSelector: "#ContainerCode-Table",
    url: urlLink,
    globalContext: globalContext,
    columns: [
      { field: 'ContainerUUID', title: 'Container UUID' },
      { field: 'ContainerCode', title: 'Container Code' },
      // {field: 'SealNo', title: 'Seal No'},
      { field: 'Description', title: 'Description' },
      { field: 'containerType.ContainerType', title: 'Container Type' },
      { field: 'Status', title: 'Status' },
      { field: 'M3', title: 'M3(m)' },
      { field: 'GrossWeight', title: 'Gross Weight(kg)' },
      { field: 'Length', title: 'Length(m)' },
      { field: 'Width', title: 'Width(m)' },
      { field: 'Height', title: 'Height(m)' },
      { field: 'Valid', title: 'Valid' },
    ],
  })

  window.$("#ContainerCode-Table").bootstrapTable('uncheckAll');
  window.$("#ContainerCode-Table").bootstrapTable('resetSearch');
  window.$("#ContainerCode-Table").bootstrapTable('checkBy', { field: 'ContainerUUID', values: select2ContainerCodeValue })

  window.$("#ChooseContainer").unbind("click");
  window.$("#ChooseContainer").click(function () {
  
    var ContainerTypes = [];
    var ContainerUUID = [];
    var ContainerUUIDs = [];
    if (formName == "ContainerReleaseOrder"){
      Quantity = getValues(`${formName}HasContainer[${index}][Qty]`)
    }else{
      Quantity = getValues(`${formName}HasContainerType[${index}][Qty]`)
    }
    
    $.each(window.$("#ContainerCode-Table").bootstrapTable('getSelections'), function (key, value) {

      ContainerTypes.push(value["ContainerType"]);
      ContainerUUID.push(value["ContainerUUID"]);
      ContainerUUIDs.push(value["ContainerUUID"]);

    })
    if (ContainerTypes.length > Quantity) {
      alert("Limit reached. Please increase quantity before adding container.")
      return false;
    } else {
      var optionContainerList = []
      var filters = {
        "Container.ContainerUUID": ContainerUUIDs,

      };
      if(ContainerUUIDs.length>0){
        getContainers("", filters, globalContext).then(data => {
          try {
            $.each(data, function (key, value) {
                optionContainerList.push({ value: value.ContainerUUID, label: value.ContainerCode })
            });
          }
          catch (err) {
  
          }
          if (formName == "ContainerReleaseOrder") {
            fields[`${index}`].ContainerItem[22].options = optionContainerList
            update(fields)     
            setValue(`${formName}HasContainer[${index}][ContainerCode][]`, optionContainerList)
          } else {
            setValue(`${formName}HasContainerType[${index}][ContainerOptions]`, optionContainerList)
            setValue(`${formName}HasContainerType[${index}][ContainerCode][]`, ContainerUUIDs)
            update(fields)
          }
  
          window.$('#ContainerModal').modal('toggle')
  
        })
      }else{
        if (formName == "ContainerReleaseOrder") {
          fields[`${index}`].ContainerItem[22].options = []
          update(fields)     
          setValue(`${formName}HasContainer[${index}][ContainerCode][]`, [])
        } else {
          setValue(`${formName}HasContainerType[${index}][ContainerOptions]`, [])
          setValue(`${formName}HasContainerType[${index}][ContainerCode][]`, [])
          update(fields)
        }

        window.$('#ContainerModal').modal('toggle')
      }
 
  
      $('.innerChargesTable').eq(index).trigger("change")
      
    }
  })

  $("#selectContainer").unbind("click");
  $("#selectContainer").click(function () {
    $("#ContainerModal").modal("toggle");

    window.$("#ContainerCode-Table").bootstrapTable('uncheckAll');
    window.$("#ContainerCode-Table").bootstrapTable('resetSearch');

    window.$("#ContainerCode-Table").bootstrapTable('checkBy', { field: 'ContainerUUID', values: select2ContainerCodeValue })
  })

  $("#AllToggle").unbind("click");
  $("#AllToggle").click(function () {
    // table.bootstrapTable('checkInvert')
    $("#ContainerCode-Table").bootstrapTable('filterBy', []);
    var data = $("#ContainerCode-Table").bootstrapTable('getData');
    var selected = $("#ContainerCode-Table").bootstrapTable("getSelections");
    var selectedArr = [];
    var dataArr = [];

    $.each(data, function (key, value) {
      dataArr.push(value.ContainerUUID);
    })

    $.each(selected, function (key, value) {
      selectedArr.push(value.ContainerUUID);
    })

    var notSelectedArr = $(dataArr).not(selectedArr).get();

    if ($(this).text() == "All") {
      $(this).text("Selected");
      $("#ContainerCode-Table").bootstrapTable('filterBy', { ContainerUUID: selectedArr });
    } else if ($(this).text() == "Selected") {
      $(this).text("Unselected");
      $("#ContainerCode-Table").bootstrapTable('filterBy', { ContainerUUID: notSelectedArr });
    } else {
      $(this).text("All");
    }
  });

}


function totalTextFormatter3(data) {
  return 'Total'
}

function totalNameFormatter3(data) {
  return data.length
}

function totalPriceFormatter3(data) {
  var field = this.field
  return '$' + data.map(function (row) {
    return +row[field].substring(1)
  }).reduce(function (sum, i) {
    return sum + i
  }, 0)
}

function ajaxRequest3(params) {
  var containerSelected = []
  $(".SelectContainerCodeField").find(".CheckContainerCode").each(function () {
    containerSelected = containerSelected.concat($(this).val());


  })

  getContainersWithModal(paramsDropdownTable.url, paramsDropdownTable.globalContext).then(data => {
    var data = data.data.filter(function (oneArray) {
      return oneArray.VerificationStatus == "Approved" || oneArray.Status == "Reserved";
    });

    var data1 = data.filter(function (oneArray2) {
      var checkSelected = false;
      var checkCheckedby = false;
      if ($.inArray(oneArray2.ContainerUUID, containerSelected) >= 0) {
        checkSelected = true;
      }
      if ($.inArray(oneArray2.ContainerUUID, select2ContainerCodeValue) >= 0) {
        checkCheckedby = true;


      }
      return checkSelected !== true || checkCheckedby == true
    })

    params.success({
      "rows": data1,
      "total": data1.length
    })

  })
}

function columnSetup3(columns) {
  var res = [
    {
      field: 'state',
      checkbox: true,
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


function initQuotationContainerCodeTable(args) {
  paramsDropdownTable = args;
  var table = $(args.tableSelector);
  window.$(table).bootstrapTable('destroy').bootstrapTable({
    height: 550,
    clickToSelect: true,
    // search: true,
    showColumns: true,
    filterControl: true,
    maintainMetaData: true,
    showColumnsToggleAll: true,
    minimumCountColumns: 1,
    pagination: true,
    pageList: [10, 25, 50, 100, 'all'],
    idField: 'id',
    ajax: ajaxRequest3,
    columns: columnSetup3(args.columns),
    onLoadSuccess: function () {
      window.$(table).bootstrapTable('hideColumn', "ContainerUUID");
    }
  });

  window.$(table).on('post-body.bs.table', function () {
    window.$("#ContainerCode-Table").bootstrapTable('checkBy', { field: 'ContainerUUID', values: select2ContainerCodeValue })
  })


}




