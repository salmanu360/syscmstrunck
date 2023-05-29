import $ from "jquery";
import {FindVoyages} from "../Helper";
import React ,{ useContext } from "react";


var paramsDropdownTable = {};
var selections = [];

function totalTextFormatter2(data) {
  return 'Total'
}

function totalNameFormatter2(data) {
  return data.length
}

function totalPriceFormatter2(data) {
  var field = this.field
  return '$' + data.map(function (row) {
    return +row[field].substring(1)
  }).reduce(function (sum, i) {
    return sum + i
  }, 0)
}

function ajaxRequest2(params) {
  var filters=paramsDropdownTable.filter;
  FindVoyages(filters,paramsDropdownTable.globalContext).then(data => {
    var POTc = ""; 
          var VoyageNumbers = ""; 
          var VoyageUUIDString = ""; 
          var VesselName = ""; 
            var POLet = "";    
            var PODet = "";  
            var POTet ="";
            var POTVessel="";
            var VesselCode="";
            var POLScnCode="";
            var POTPortCode="";
          $.each(data, function(key, value){    
          
            POLet=value["Voyage"]["POLETA"]+'<br>'+value["Voyage"]["POLETD"];
            PODet=value["Voyage"]["PODETA"]+'<br>'+value["Voyage"]["PODETD"];
             VesselName=value["Voyage"]["VesselName"];
             VoyageNumbers=value["Voyage"]["VoyageNumbers"]
             VoyageUUIDString=value["Voyage"]["VoyageUUIDs"];
             VesselCode=value["Voyage"]["VesselCode"];
             POLScnCode=value["Voyage"]["POLSCNCode"];
          
            $.each(value["POT"], function(key22, value22){    
              // console.log(value22) 
              POTc=value["POT"]["POTPortCode"];
              POTet=value["POT"]["POTETA"]+'<br>'+value["POT"]["POTETD"]
              POTVessel=value["POT"]["POTVesselName"]
              POTPortCode=value["POT"]["PortCode"]
              
                //  console.log(POTc)  
            });
           
            // $.each(value, function(key1, value1){     
            
            
             
            //   // console.log(value1) 
           
            
           
            //   VoyageUUIDString=value1["VoyageUUIDs"];
              
            //  console.log(VoyageUUIDString)
             
          

            // });
          //   var POLet = "";    
          //   var PODet = "";   
          //   var POTet = "";   
          //   var POLscn = ""; 
          //   var POT="";
          //   var POLPortCode="";
          //   var PODPortCode="";
          //   var POLetDate="";
          //   var PODetDate="";
          //   var POTVessel="";
          //   var voyageSchedules=value.voyageSchedules;
          //   var voyageSchedulesLength=voyageSchedules.length;

          //   var area=value.Area;
          //   var areaLength=area.length;
          //  var POTVesselName=value.vessel.VesselName;
             
         
            // $.each(value.VoyageUUIDs, function(key1, value1){   

            //   console.log(value1)
             
            // //   if(key1==0)
            // //   {  
            // //     POLet=value1["ETA"]+'<br>'+value1["ETD"];
            // //     POLscn=value1["SCNCode"];
            // //     if(value1["ETA"]!==null){
            // //       POLetDate=value1["ETA"].split(" ");
            // //       POLetDate=POLetDate[0];
            // //     }
             
            // //     return;
            // //   }   

            // // if(key1==(voyageSchedulesLength-1)){
            // //   PODet=value1["ETA"]+'<br>'+value1["ETD"];
             
            // //   if(value1["ETA"]!==null){
            // //     PODetDate=value1["ETA"].split(" ");
            // //     PODetDate=PODetDate[0];
            // //   }
            // //     return;
            // //  }   
             
            // //  POTet+=value1["ETA"]+'<br>'+value1["ETD"]+","+'<br>';
            // //  POTVessel=POTVesselName;
             
            // });

            // $.each(value.Voyage, function(key1, value1){   
            //    console.log(value1[0]["VoyageUUIDs"])
            //   $.each(value1.VoyageUUIDs, function(key2, value2){   
            //       console.log(value2)
            //     //   if(key1==0)
            //     //   {  
            //     //     POLPortCode=value1["AreaUUID"];
            //     //     return;
            //     //   }   
    
            //     // if(key1==(areaLength-1)){
            //     //   PODPortCode=value1["AreaUUID"];
            //     //     return;
            //     //  }   
                 
            //     //  POT+=value1["PortCode"]+',';
                 
            //     });
            //   if(key1==0)
            //   {  
            //     POLPortCode=value1["AreaUUID"];
            //     return;
            //   }   

            // if(key1==(areaLength-1)){
            //   PODPortCode=value1["AreaUUID"];
            //     return;
            //  }   
             
            //  POT+=value1["PortCode"]+',';
             
            // });
            // POTet1 = POTet.replace(/<br>\s*$/, "");
            // POTet = POTet1.replace(/,\s*$/, "");
          
            // POT = POT.replace(/,\s*$/, "");
            // data[key].POTet = POTet;
            // data[key].POLet = POLet;
            // data[key].PODet = PODet;
            // data[key].POTc = POT;
            // data[key].POLSCNCode = POLscn;
            // data[key].POLPortCode = POLPortCode;
            // data[key].PODPortCode = PODPortCode;
            // data[key].POLetDate = POLetDate;
            // data[key].PODetDate = PODetDate;
            // data[key].POTVessel = POTVessel;
         
             data[key].POTc = POTc;
             data[key].VoyageNumbers = VoyageNumbers;
             data[key].VesselCode = VesselCode;
             data[key].VoyageUUIDString = VoyageUUIDString
             data[key].VesselName = VesselName
             data[key].POTVessel = POTVessel
             data[key].POLScnCode = POLScnCode
             
             data[key].POLet = POLet
             data[key].PODet = PODet
             data[key].POTet = POTet
             data[key].POTPortCode = POTPortCode
             
             
      
          
           
        })
        params.success({
            "rows": data,
            "total": data.length
        })
        
  }) 
}

function columnSetup2(columns) {
  var res = [
    {
    field: 'state',
    radio: true,
    rowspan: 1,
    align: 'center',
    valign: 'middle',
      hideSelectColumn: true,
  }
];
  $.each(columns, function(i, column) {
    // column.sortable = true;
    column.align = 'center';
    column.valign = 'middle';
    res.push(column);
  })

  return res;
}

export function InitVoyageModalTable(args) {
  paramsDropdownTable = args;
  var table = $(args.tableSelector);
  window.$(table).bootstrapTable('destroy').bootstrapTable({
    height: 550,
    clickToSelect: true,
    minimumCountColumns: 1,
    pagination: true,
    classes: "table table-no-bordered table-hover",

    // hideSelectColumn: true,
    maintainMetaData:true,
    pageList: [10, 25, 50, 100, 'all'],
    idField: 'id',
    ajax: ajaxRequest2,
    columns: columnSetup2(args.columns),
    onLoadSuccess: function(){    },
    onPostBody : function() {
      $('#voyage-table tr > *:nth-child(1)').addClass('d-none');
      
      window.$(table).bootstrapTable('hideColumn', "VoyageUUIDString");
      window.$(table).bootstrapTable('hideColumn', "POTPortCode");
      window.$(table).bootstrapTable('hideColumn', "VesselCode");
      window.$(table).bootstrapTable('hideColumn', "POLScnCode");
                    
  }
    
  });
  
}

