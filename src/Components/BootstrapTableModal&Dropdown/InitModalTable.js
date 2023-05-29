import $ from "jquery";
import {GetCompanyContactsByCompanyBranch} from "../Helper";
import React ,{ useContext } from "react";


var paramsDropdownTable = {};
var selections = [];

function totalTextFormatter1(data) {
  return 'Total'
}

function totalNameFormatter1(data) {
  return data.length
}

function totalPriceFormatter1(data) {
  var field = this.field
  return '$' + data.map(function (row) {
    return +row[field].substring(1)
  }).reduce(function (sum, i) {
    return sum + i
  }, 0)
}

function ajaxRequest1(params) {
    var param = {
        "CompanyBranchUUID": paramsDropdownTable.paramData,
    };

    GetCompanyContactsByCompanyBranch(param,paramsDropdownTable.globalContext).then(data => {
        params.success({
            "rows": data,
            "total": data.length
        })
    });
}

function columnSetup1(columns) {
  var res = [
    {
    field: 'state',
    checkbox: true,
    rowspan: 1,
    align: 'center',
    valign: 'middle'
  }
];
  $.each(columns, function(i, column) {
    column.sortable = true;
    column.align = 'center';
    column.valign = 'middle';
    res.push(column);
  })

  return res;
}

export function InitModalTable(args) {
  console.log(args)
  paramsDropdownTable = args;
  var table = $(args.tableSelector);
  window.$(table).bootstrapTable('destroy').bootstrapTable({
    height: 550,
    clickToSelect: true,
    minimumCountColumns: 1,
    pagination: true,
    pageList: [10, 25, 50, 100, 'all'],
    idField: 'id',
    ajax: ajaxRequest1,
    columns: columnSetup1(args.columns)
  });
}

