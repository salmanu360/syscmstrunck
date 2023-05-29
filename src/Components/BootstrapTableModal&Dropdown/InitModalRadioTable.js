import $ from "jquery";
import {GetCompanyContactsByCompanyBranch} from "../Helper";
import React ,{ useContext } from "react";

var paramsTable = {};
var selections = [];

function columnSetup2 (columns) {
  var res = [
    {
    field: 'state',
    radio: true,
    rowspan: 1,
    align: 'center',
    valign: 'middle'
  }
];
  $.each(columns, function(i, column) {
    column.sortable = true;
    column.align = 'center';
    // column.switchable = false;
    column.valign = 'middle';
    res.push(column);
  })

  return res;
}

function GridActions () {
  return {
    toggleValidAll: {
      icon: 'fa-check-square',
      event: function(){
        var table = $(paramsTable.tableSelector);
        var button = $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i");
        if(button.hasClass("fa-check-square") && button.hasClass("fa")){
            $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-check-square");
            $(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "All");
            window.$(table).bootstrapTable('filterBy', {})
        } else if(button.hasClass("fa-check-square") && button.hasClass("far")){
            $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-square");
            $(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Invalid");
            window.$(table).bootstrapTable('filterBy', {Valid: ["0"]})       
        } else if(button.hasClass("fa-square")){
            $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "fa fa-check-square");
            $(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Valid");
            window.$(table).bootstrapTable('filterBy', {Valid: ["1"]})
        }
      },    
      attributes: {
        title: 'Valid'
      }
    },
  }
}


export function InitModalRadioTable(args) {

    paramsTable = args;
  var table = $(args.tableSelector);

  window.$(table).bootstrapTable('destroy').bootstrapTable({
    buttons: "GridActions",
    filterControl: true,
    height: 550,
    toolbar: args.toolbarSelector,
    minimumCountColumns: 0,
    pagination: true,
    pageList: [10, 25, 50, 100, 'all'],
    idField: 'id',
    ajax: args.functionGrid,
    columns: columnSetup2(args.columns),
    showRefresh: true,  
    showColumns: true,
    showColumnsToggleAll: true,
    clickToSelect: true,
    cookie: "true",
    cookieExpire: '10y',
    cookieIdTable: args.cookieID,
    onLoadSuccess: function(){
      window.$(table).bootstrapTable('filterBy', {Valid: ["1"]}); // default show valid data only

      if(window.$(table).bootstrapTable("getCookies")['columns'] == null){
        $.each(args.hideColumns, function(key, value){
          window.$(table).bootstrapTable('hideColumn', value);
        });
      }

    }
  });

  window.$(table).on('pre-body.bs.table', function () {
    // table.bootstrapTable('resetView');
  })

  
}

