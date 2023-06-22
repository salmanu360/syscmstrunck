
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import CreateButton from '../CreateButtonRow'
import $ from "jquery"
import BoostrapTable from '../BoostrapTable'
import { GetRuleSetRule, GetAllDropDown,ToastNotify, GetUserRuleByRuleSet,UpdateUserRuleByRuleSet,getUserRules,UpdateUserRule } from '../Helper.js'
import GridViewColumnSetting from './GridViewColumnSetting';
import GlobalContext from "../../Components/GlobalContext"
import AccessControl from "../../Pages/User/AccessControl"
import { ToastContainer, toast, useToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import "../../Assets/css/GridView.css"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";


function GridView(props) {

  const navigate = useNavigate();
  const params = useParams();

  const [ruleSetControlData, setRuleSetControldata] = useState([])
  const [portData, setPortData] = useState([])
  const globalContext = useContext(GlobalContext);
  const [uploadState, setUploatState] = useState("")
  var companyType = "";
  if (JSON.stringify(params) !== '{}') {
    var companyType = params.type
  }
  var tempModel;
 

  if (companyType !== "") {
    var createLink = props.data.groupLink + props.data.columnSetting + "/create/type=" + companyType
  }
  else {
    var createLink = props.data.groupLink + props.data.columnSetting + "/create"

  }
  
  if (props.data.columnSetting == "company") {
    params.type ? tempModel = params.type.toLowerCase() : tempModel = props.data.columnSetting
  } else {
    tempModel = props.data.columnSetting
    if(tempModel=="credit-note" || tempModel=="debit-note" || tempModel=="debit-note-barge" || tempModel=="debit-note-barge"){
      tempModel=`sales-${tempModel}`
    }
  }
  
  useEffect(() => {
    var modelLinkTemp = props.data.columnSetting
    if (props.data.columnSetting == "company") {
      params.type ? modelLinkTemp = params.type.toLowerCase() : modelLinkTemp = props.data.columnSetting

    }
    if(props.data.thirdParty){

      if(modelLinkTemp=="sales-invoice"){
        modelLinkTemp="invoice"
      }else if(modelLinkTemp=="sales-invoice-barge"){
        modelLinkTemp="invoice-barge"
      }
      
      modelLinkTemp=`third-party-${modelLinkTemp}`
    }
    if(modelLinkTemp=="credit-note" || modelLinkTemp=="debit-note" || modelLinkTemp=="credit-note-barge" || modelLinkTemp=="debit-note-barge"){
      modelLinkTemp=`sales-${modelLinkTemp}`
    }
    if(modelLinkTemp=="port"){
      modelLinkTemp=`area`
    }
    if(modelLinkTemp=="u-n-number"){
      modelLinkTemp=`un-number`
    }
    if(modelLinkTemp=="h-s-code"){
      modelLinkTemp=`hs-code`
    }
    if(modelLinkTemp=="terminal"){
      modelLinkTemp=`port-details`
    }
    if(modelLinkTemp=="terminal handler" || modelLinkTemp=="box operator" || modelLinkTemp=="ship operator"){
      modelLinkTemp= modelLinkTemp.replace(" ","-")
    }
    if (globalContext.userRule !== "") {
      const objRule = JSON.parse(globalContext.userRule);
      var filteredAp = objRule.Rules.filter(function (item) {
        return item.includes(modelLinkTemp);
      });
    }
    if(!props.model == "Rule"){ // no need check permittion for rule page
      filteredAp.find((item) => item == `create-${modelLinkTemp}`) !== undefined ?$("#create").removeClass("disabledAccess"):$("#create").addClass("disabledAccess");
      filteredAp.find((item) => item == `verify-${modelLinkTemp}`) !== undefined ?$("#approved").removeClass("disabledAccess"):$("#approved").addClass("disabledAccess");
      filteredAp.find((item) => item == `preview-${modelLinkTemp}`) !== undefined ?$(".previewDoc").removeClass("disabledAccess"):$(".previewDoc").addClass("disabledAccess");
      filteredAp.find((item) => item == `confirm-${modelLinkTemp}`) !== undefined ?$("#confirm").removeClass("disabledAccess"):$("#confirm").addClass("disabledAccess");
      filteredAp.find((item) => item == `transfer-${modelLinkTemp}`) !== undefined ?$("#transfer").removeClass("disabledAccess"):$("#transfer").addClass("disabledAccess");
      filteredAp.find((item) => item == `transferfrom-${modelLinkTemp}`) !== undefined ?$("#transferfromBC").removeClass("disabledAccess"):$("#transferfromBC").addClass("disabledAccess");
      filteredAp.find((item) => item == `transferto-${modelLinkTemp}`) !== undefined ?$("#transfertocroinv").removeClass("disabledAccess"):$("#transfertocroinv").addClass("disabledAccess");
      filteredAp.find((item) => item == `transferto-${modelLinkTemp}`) !== undefined ?$("#transfertocndn").removeClass("disabledAccess"):$("#transfertocndn").addClass("disabledAccess");
      filteredAp.find((item) => item == `telex-release-${modelLinkTemp}`) !== undefined ?$("#telexRelease").removeClass("disabledAccess"):$("#telexRelease").addClass("disabledAccess");
      filteredAp.find((item) => item == `split-${modelLinkTemp}`) !== undefined ?$("#split").removeClass("disabledAccess"):$("#split").addClass("disabledAccess");
      filteredAp.find((item) => item == `merge-${modelLinkTemp}`) !== undefined ?$("#merge").removeClass("disabledAccess"):$("#merge").addClass("disabledAccess");
      filteredAp.find((item) => item == `revert-${modelLinkTemp}`) !== undefined ?$("#revertSplit").removeClass("disabledAccess"):$("#revertSplit").addClass("disabledAccess");
      filteredAp.find((item) => item == `create-${modelLinkTemp}`) !== undefined ?$("#generate").removeClass("disabledAccess"):$("#generate").addClass("disabledAccess");
      filteredAp.find((item) => item == `update-${modelLinkTemp}`) !== undefined ?$("#dndButton").removeClass("disabledAccess"):$("#dndButton").addClass("disabledAccess");
      filteredAp.find((item) => item == `throw-${modelLinkTemp}`) !== undefined ?$("#trash").removeClass("disabledAccess"):$("#trash").addClass("disabledAccess");
      filteredAp.find((item) => item == `delete-${modelLinkTemp}`) !== undefined ?$("#removeModal").removeClass("disabledAccess"):$("#removeModal").addClass("disabledAccess");
      filteredAp.find((item) => item == `verify-${modelLinkTemp}`) !== undefined ?$("#approvedUser").removeClass("disabledAccess"):$("#approvedUser").addClass("disabledAccess");
      filteredAp.find((item) => item == `verify-${modelLinkTemp}`) !== undefined ?$("#reset").removeClass("disabledAccess"):$("#reset").addClass("disabledAccess");
      filteredAp.find((item) => item == `verify-${modelLinkTemp}`) !== undefined ?$("#suspend").removeClass("disabledAccess"):$("#suspend").addClass("disabledAccess");
    }


    return () => {

    }
  }, [props])

  const showApproved = ["Charges", "Tariff", "Container", "Company", "Vessel", "PortDetails", "BillOfLading", "Quotation", "CreditNote", "DebitNote", "BookingReservation", "CustomerPayment","SalesInvoiceBarge", "SalesInvoice", "PurchaseOrder"]
  const showPDF = ["ContainerVerifyGrossMass", "ContainerReleaseOrder", "BillOfLading", "Quotation", "DeliveryOrder", "CreditNote", "DebitNote", "BookingReservation", "CustomerPayment", "SalesInvoice","SalesInvoiceBarge"]
  const showTelexRelease = ["BillOfLading"]
  const showSplit = ["BillOfLading", "BookingReservation"]
  const showMerge = ["BillOfLading", "BookingReservation"]
  const showRevertSplit = ["BillOfLading"]
  const showGenerate = ["DeliveryOrder"]
  const showDnD = ["Quotation", "BookingReservation"]
  const showConfirmBR = ["BookingReservation"]
  const showTransferFromBC = ["SalesInvoice","SalesInvoiceBarge"]
  const showTransferToBR = ["Quotation"]
  const showTransferToCROINV = ["BookingReservation"]
  const showTransferToCNDN = ["SalesInvoice","SalesInvoiceBarge"]
  const showDownloadSample = ["Container"]
  const showUploadContainer = ["Container"]


  var resultShowApproved = showApproved.filter(function (oneArray) {
    return oneArray == props.data.model
  });

  var resultShowPDF = showPDF.filter(function (oneArray) {
    return oneArray == props.data.model
  });

  var resultShowTelexRelease = showTelexRelease.filter(function (oneArray) {
    return oneArray == props.data.model
  });

  var resultShowSplit = showSplit.filter(function (oneArray) {
    return oneArray == props.data.model &&  !props.data.barge
  });

  var resultShowMerge = showMerge.filter(function (oneArray) {
    return oneArray == props.data.model &&  !props.data.barge
  });
  var resultShowRevertSplit = showRevertSplit.filter(function (oneArray) {
    return oneArray == props.data.model &&  !props.data.barge
  });
  var resultShowGenerate = showGenerate.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowDnD = showDnD.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowTransferToBR = showTransferToBR.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowTransferFromBC = showTransferFromBC.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowTransferToCROINV = showTransferToCROINV.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowTransferToCNDN = showTransferToCNDN.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowDownloadSample = showDownloadSample.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowUploadContainer = showUploadContainer.filter(function (oneArray) {
    return oneArray == props.data.model
  });
  var resultShowConfirmBR = showConfirmBR.filter(function (oneArray) {
    return oneArray == props.data.model
  });


  function handleGrandAllRuleSet() {
    if(props.data.columnSetting=="RuleSet"){
      $("#RuleSetRuleModal").find("input[type='checkbox']").prop("checked", true)
    }else{
      $("#AccessControlModal").find("input[type='checkbox']").prop("checked", true)
    }
  

  }

  function handleRevokeAllRuleSet() {
    if(props.data.columnSetting=="RuleSet"){
      $("#RuleSetRuleModal").find("input[type='checkbox']").prop("checked", false)
    }else{
      $("#AccessControlModal").find("input[type='checkbox']").prop("checked", false)
    }
 
  }


  function handleClearRule(){
    $("#RuleSetEffectedUsersTable").find("input[type='checkbox']").prop("checked",false)
  }

  function handleUpdateRuleSetUserRule(){

    var data = [];
    var userlist=[];
    var objAccessControl = {};

     var tempArray=[]
    $("input[name='AccessControl[Port][]']").each(function(key,value){
      $(value).val()!=="" && tempArray.push($(value).val())
    })

    $("#RuleSetRuleModal").find("[type='checkbox']:checked").each(function() {
      var value = $(this).attr("name");
      data.push(value)
      objAccessControl[value] = true;
    });


    $("#RuleSetEffectedUsersTable").find("[type='checkbox']:checked").each(function() {
        var value = $(this).val();
        userlist.push(value)
    });

    var ob = {
      Scope: $("input[name='AccessControl[Scope]']").val(),
      Port: tempArray,
      FreightTerm: $("input[name='AccessControl[FreightTerm]']").val(),
      rules: objAccessControl,
      users:userlist
    }

  

    UpdateUserRuleByRuleSet(window.$(".ruleId").val(), props.data.columnSetting, globalContext, ob).then(res=>{
      if(res.message=="Success"){
        ToastNotify("success","Rule Set updated successfully.")
        window.$("#RuleSetEffectedUsersModal").modal('toggle')
       }
    })
  }
  function handleSaveRuleAcess() {
    // if(getRuleSetUpdatePermission == true){
    var tempArray=[]
    var data = [];
    var objAccessControl = {};
    $("input[name='AccessControl[Port][]']").each(function(key,value){
      $(value).val()!=="" && tempArray.push($(value).val())
    })
    $("#RuleSetRuleModal").find("[type='checkbox']:checked").each(function () {
      var value = $(this).attr("name");
      data.push(value)
      objAccessControl[value] = true;
    });

    if (tempArray.length>0) {
      var ob = {
        Scope: $("input[name='AccessControl[Scope]']").val(),
        Port: tempArray,
        FreightTerm: $("input[name='AccessControl[FreightTerm]']").val(),
        rules: objAccessControl
      }


      GetUserRuleByRuleSet(window.$(".ruleId").val(), props.data.columnSetting, globalContext, ob).then(res => {
      
        if (res.data && res.data.length > 0) {
          window.$('#RuleSetEffectedUsersModal').modal('toggle');
          window.$(".ruleSetEffectedUsersTbody").empty();

          window.$.each(res.data, function (key, value) {
            window
							.$(".ruleSetEffectedUsersTbody")
							.append(
								'<tr class ="RuleSetTR"><td style="width:232px; text-align:center;vertical-align: middle;">' +
									value.username +
									'</td><td style="width:232px; text-align:center;vertical-align: middle;"><input type="checkbox" className="checkboxUser" value = ' +
									value.id +
									"></td></tr>"
							);
            if (value.similar == true) {
              window.$(".RuleSetTR").eq(key).find(".checkboxUser").prop("checked", true)
            } else {
              window.$(".RuleSetTR").eq(key).find(".checkboxUser").prop("checked", false)
            }
          });
        }
        else{
          UpdateUserRuleByRuleSet(window.$(".ruleId").val(), props.data.columnSetting, globalContext, ob).then(res=>{
           if(res.message=="Success"){
            ToastNotify("success","Rule Set updated successfully.")

           }
          })
        }
      })
    } else {
      alert("Please Choose at least 1 Port for your Access Control.")
    }
    // }

  }

  function handleSaveAccessControl(){
    // if(getUserUpdatePermission == true){
      if (globalContext.userRule !== "") {
        const objRule = JSON.parse(globalContext.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes("user");
        });
      }

      if(filteredAp.includes(`update-${tempModel}`)){

        var tempArray=[]
        var data = [];
        var objAccessControl = {};
        $("input[name='AccessControl[Port][]']").each(function(key,value){
          $(value).val()!=="" && tempArray.push($(value).val())
        })
    
        $("#AccessControlModal").find("[type='checkbox']:checked").each(function () {
          var value = $(this).attr("name");
          data.push(value)
          objAccessControl[value] = true;
        });
    
        var ob = {
          Scope: $("input[name='AccessControl[Scope]']").val(),
          Port: tempArray,
          FreightTerm: $("input[name='AccessControl[FreightTerm]']").val(),
          AccessControl: objAccessControl
        }
    
        if($("input[name='AccessControl[Scope]']").val()=="BRANCH"){
          
    
          if (tempArray.length>0) {
            UpdateUserRule(window.$(".ruleId").val(), props.data.columnSetting, globalContext, ob).then(res => {
              if(res.message=="Success"){
                ToastNotify("success","Access Control updated successfully.")
    
               }
            })
    
          }else{
            alert("Please Choose at least 1 Port for your Access Control.")
          }
        }else{
          UpdateUserRule(window.$(".ruleId").val(), props.data.columnSetting, globalContext, ob).then(res => {
            if(res.message=="Success"){
              ToastNotify("success","Access Control updated successfully.")
    
             }
          })
        }

      }else{
        alert("You are not allowed to Edit Access Control, Please check your Permission.")
      }
 
  // }else{

  // }


  }

  useEffect(() => {

    const ColumnSetting = GridViewColumnSetting(props.data.columnSetting)
    var defaultHide = ColumnSetting[0].defaultHide

    if (props.data.columnSetting == "rule-set" || props.data.columnSetting == "user")
      GetAllDropDown(["Area"], globalContext).then(res => {
        var ArrayPort = []
        $.each(res.Area, function (key, value) {
          ArrayPort.push({ value: value.AreaUUID, label: value.PortCode })
        })


        setPortData(ArrayPort)

      })
    window.$('#RuleSetRuleModal').on('show.bs.modal', function () {

      $("#RuleSetRuleModal").find('input[type="checkbox"]').prop('checked', false);

      GetRuleSetRule(window.$(".ruleId").val(), props.data.columnSetting, globalContext).then(res => {
        if (res.data.Scope == "BRANCH") {
          $("#Port").parent().removeClass("d-none")
        }

        setRuleSetControldata({ scope: res.data.Scope, port: res.data.Port, freightTerm: res.data.FreightTerm })
        $.each(res.data.Rules, function (key, value) {
          $("#AccessControlTable").find("[type='checkbox']").each(function () {

            if ($(this).attr("name").includes("AccessControl") == true) {
              if ($(this).attr("name") == "AccessControl[" + value + "]") {
                $(this).prop("checked", true);
              }
            }
            else {
              if ($(this).attr("name") == value) {
                $(this).prop("checked", true);
              }
            }

          });

        })

      })

    })

    window.$('#AccessControlModal').on('show.bs.modal', function () {

      $("#AccessControlModal").find('input[type="checkbox"]').prop('checked', false);

      getUserRules(window.$(".ruleId").val(),globalContext).then(res => {
        if (res.data.Scope == "BRANCH") {
          $("#Port").parent().removeClass("d-none")
        }

        setRuleSetControldata({ scope: res.data.Scope, port: res.data.Port, freightTerm: res.data.FreightTerm })
        $.each(res.data.Rules, function (key, value) {
          $("#AccessControlTable").find("[type='checkbox']").each(function () {

            if ($(this).attr("name").includes("AccessControl") == true) {
              if ($(this).attr("name") == "AccessControl[" + value + "]") {
                $(this).prop("checked", true);
              }
            }
            else {
              if ($(this).attr("name") == value) {
                $(this).prop("checked", true);
              }
            }

          });

        })

      })

    })

    var GetGridviewData = function (params) {

      var button = $(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i");
      if (button.hasClass("fa-check-square") && button.hasClass("fa")) {
        var valid = "1";
      } else if (button.hasClass("fa-check-square") && button.hasClass("far")) {
        var valid = "";
      } else if (button.hasClass("fa-square")) {
        var valid = "0";
      }

      var param = {
        limit: params.data.limit,
        offset: params.data.offset,
        sort: params.data.sort,
        filter: params.data.filter,
        order: params.data.order,
        valid: valid
      }

      var Data = { "param": param }
      if (companyType !== "") {
        if(companyType == "Terminal Handler"){
          companyType = "Terminal"
        }
        param.companyType = companyType
        Data.CompanyType = companyType
      }
      if (props.data.thirdParty == "1") {
        Data.ThirdParty = "1"
      }

      if (props.data.columnSetting == "container-verify-gross-mass") {
        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-" + props.data.tableId
      }
      else if (props.data.columnSetting == "credit-note" || props.data.columnSetting == "debit-note" || props.data.columnSetting == "debit-note-barge"|| props.data.columnSetting == "credit-note-barge") {
        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-sales-" + props.data.tableId
      }
      else {
        var urlLink = globalContext.globalHost + globalContext.globalPathLink + props.data.tableId + "/get-index-" + props.data.tableId
      }
      $.ajax({
        type: "POST",
        url: urlLink,
        dataType: "json",
        headers: {
          "Authorization": "Basic " + btoa(globalContext.authInfo.username + ":" + globalContext.authInfo.access_token)
        },
        data: Data,
        success: function (data) {

          // params.success({
          //   "rows": data,
          //   "total": data.length
          // })

          params.success({
            "rows": data.rows,
            "total": data.total
          })
        }
      });
    }

    var columns = ColumnSetting[0].columns

    BoostrapTable({
      tableSelector: props.data.tableId, // #tableID
      toolbarSelector: '#toolbar', // #toolbarID
      columns: columns,
      hideColumns: defaultHide, // hide default column. If there is no cookie
      cookieID: props.data.tableId, // define cookie id 
      functionGrid: GetGridviewData,
      navigate: navigate,
      companyType: companyType,
      routeName: props.data.groupLink + props.data.columnSetting,
      selectedId: props.data.model + "UUIDs",
      host: globalContext,
      thirdParty: props.data.thirdParty ? props.data.thirdParty : "",
      title: props.data.columnSetting,
      toast: toast,
      tableId: props.data.tableId

    });



  }, [props.data.Title, params])



  return (

    <div className="card card-primary">

      <div className="card-body indexTableCard">

        <div id="toolbar" className={props.data.columnSetting == "dnd" ? "d-none" : ""}>

          {props.data.thirdParty ?
            resultShowPDF.length > 0 ?
              <button id={props.data.model == "ContainerReleaseOrder" ? "previewCRO" : props.data.model == "BillOfLading" ? "previewBL" : props.data.model == "SalesInvoice" || props.data.model == "CreditNote" || props.data.model == "DebitNote" ? "previewCNDN" : props.data.model == "BookingReservation" ? "previewBR" : "preview"} title="Preview PDF" className={`btn btn-success ml-1 previewDoc`} disabled><i className="fa fa-file-pdf"></i></button> : ""
            :
            <>
              {props.data.model !== "DeliveryOrder" ?
                <Link className={``}  to={createLink} state={{ formType: "New" }}><button id="create" title="Create" className="btn btn-success">
                  <i className="fa fa-file"></i>
                </button></Link> : ""
              }

              <button id="update" title="Update"  className="btn btn-success ml-1" disabled>
                <i className="fa fa-edit"></i>
              </button>



              {props.data.columnSetting == "user" ?
                <>
                  <button type="button" className="btn btn-success ml-1" id="approvedUser" title="Approved" data-toggle="modal" data-target="#ButtonApprovedModal" disabled ><i className="fas fa-user-check"></i></button>
                  <button type="button" className="btn btn-success ml-1" id="reset" title="Reset" data-toggle="modal" data-target="#ButtonResetModal" disabled ><i className="fas fa-key"></i></button>
                  <button type="button" className="btn btn-success ml-1" id="suspend" title="Suspend" data-toggle="modal" data-target="#ButtonSuspendModal" disabled><i className="fas fa-minus-circle"></i></button>
                </> : ""
              }

              {resultShowApproved.length > 0 ?
                <button id="approved" title="Verify" className={`btn btn-success ml-1`} data-toggle="modal" data-target="#ButtonVerifyModalForm" disabled><i className="fa fa-user-check"></i></button> : ""
              }

              {resultShowConfirmBR.length > 0 ?
                <button id="confirm" title="Confirm" className={`btn btn-success ml-1`} disabled><i className="fa fa-check-circle"></i></button> : ""
              }
              {resultShowTransferToBR.length > 0 ?
                <button id="transfer" title="Transfer"  className={`btn btn-success transfer-quotation transferToBR ml-1`}  disabled>  <i className="fas fa-file-export"></i></button> : ""
              }
              {resultShowTransferFromBC.length > 0 ?
                <button id="transferfromBC" title="Transfer From"  className={`btn btn-success transferfromBC ml-1`}>  <i className="fas fa-file-import"></i></button> : ""
              }
              {resultShowTransferToCROINV.length > 0 ?
                <button id="transfertocroinv" title="Transfer" className={`btn btn-success ml-1`} disabled >  <i className="fas fa-file-export"></i></button> : ""
              }
              {resultShowTransferToCNDN.length > 0 ?
                <button id="transfertocndn" title="Transfer To" className={`btn btn-success ml-1`} disabled >  <i className="fas fa-file-export"></i></button> : ""
              }
              {resultShowPDF.length > 0 ?
                <button id={props.data.model == "ContainerReleaseOrder" ? "previewCRO" : props.data.model == "BillOfLading" ? "previewBL" : props.data.model == "SalesInvoice" || props.data.model == "CreditNote" || props.data.model == "DebitNote" ? "previewCNDN" : props.data.model == "BookingReservation" ? "previewBR" : props.data.model == "CustomerPayment" ? "previewOR" : "preview"} title="Preview PDF" className={`btn btn-success ml-1 previewDoc`} disabled><i className="fa fa-file-pdf"></i></button> : ""
              }
              {resultShowTelexRelease.length > 0 ?
                <button id="telexRelease" title="Telex Release" className={`btn btn-success ml-1`}  data-toggle="modal" data-target="#ButtonTelexModal" disabled><i className="fa fa-share-square"></i></button> : ""
              }
              {resultShowSplit.length > 0 ?
                <button id="split" title="Split" className={`btn btn-success ml-1`} data-toggle="modal" disabled><i className="far fa-object-ungroup"></i></button> : ""
              }
              {resultShowMerge.length > 0 ?
                <button id="merge" title="Merge" className={`btn btn-success ml-1`}  data-toggle="modal" disabled><i className="far fa-object-group"></i></button> : ""
              }
              {resultShowRevertSplit.length > 0 ?
                <button id="revertSplit" title="Revert Split" className={`btn btn-success ml-1`}  data-toggle="modal" disabled><i className="fas fa-chevron-circle-left"></i></button> : ""
              }

              {resultShowGenerate.length > 0 ?
                <button id="generate" title="Generate" className={`btn btn-success create-delivery-order ml-1`} disabled>  <i className="fa fa-external-link-square-alt"></i></button> : ""
              }
              {resultShowDnD.length > 0 ?
                <button id="dndButton" title="DND" className={`btn btn-success ml-1`} data-toggle="modal" data-target="#DNDModal" disabled>  <i className="fab fa-dochub"></i></button> : ""
              }
              {resultShowDownloadSample.length > 0 ?
                <button id="downloadSample" title="Download Sample template" className="btn btn-success ml-1" >  <i className="fas fa-download"></i></button> : ""
              }

              {resultShowUploadContainer.length > 0 ?

                <><button id="uploadContainer" title="Upload Container" className="btn btn-success ml-1" >  <i className="fas fa-upload"></i></button>  <input id="fileContainer" className="d-none" type="file" accept=".xlsx,.xls" ></input></> : ""

              }

              <button id="trash" title="Trash" className={`btn btn-success ml-1`} disabled>
                <i className="fa fa-trash"></i>
              </button>

              {props.data.columnSetting == "user" ?
                "" : <button id="removeModal" title="Remove" className={`btn btn-success ml-1`} data-toggle="modal" data-target="#ButtonRemoveModal" disabled>
                  <i className="fa fa-times-circle"></i></button>

              }

              {props.data.columnSetting == "FuelConsumption" || props.data.columnSetting == "Unit" ? <button id="uploadExcel" title="Upload" className="btn btn-success ml-1" >
                <i className="fa fa-upload"></i>
              </button> : ""}
              <input id="fileExcel" className="d-none" type="file" ></input>
            </>
          }


        </div>
        <BoostrapTable thirdParty={props.data.thirdParty ? props.data.thirdParty : ""} tableId={props.data.tableId} companyType={companyType} routeName={createLink} host={globalContext} title={props.data.columnSetting} selectedId={props.data.model + "UUIDs"} cookieID={props.data.tableId} />
      </div>
      {/* rule set rule and acess control modal in grid view */}
      <div className="modal fade" id={props.data.columnSetting=="rule-set"?"RuleSetRuleModal":"AccessControlModal"} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.data.columnSetting == "rule-set" ? "Rule Set Rule" : "Access Control Right"}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="hidden" className="ruleId"></input>
              <AccessControl portOption={portData} data={ruleSetControlData} />

              <button type="button" className="btn btn-success mr-1" id="Grant" onClick={handleGrandAllRuleSet}>Grant</button>
              <button type="button" className="btn btn-danger" id="Revoke" onClick={handleRevokeAllRuleSet}>Revoke</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary mt-2" id="SaveAccessControl" data-dismiss="modal" onClick={props.data.columnSetting == "rule-set"?handleSaveRuleAcess:handleSaveAccessControl}>Save</button>
              <button type="button" className="add btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* RuleSetEffectedUsersModal in grid view */}
      <div className="modal fade" id="RuleSetEffectedUsersModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Effected User Group Users</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="RuleSetID"></input>
              <table style={{ "width": "100%" }} className="table table-bordered table-responsive" id="RuleSetEffectedUsersTable">
                <thead>
                  <tr>
                    <th width="300px" style={{ "text-align": "center", "vertical-align": "middle" }}>User</th>
                    <th width="300px" style={{ "text-align": "center", "vertical-align": "middle" }}>Check Box</th>
                  </tr>
                </thead>
                <tbody className="ruleSetEffectedUsersTbody">
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button id="updateRuleSetUsersRules" type="button" className="btn btn-success mt-2" onClick={handleUpdateRuleSetUserRule}>Save</button>
              <button id="ClearEffectedUserCheckBox" type="button" className="btn btn-primary mb1 black bg-aqua"  onClick={handleClearRule}>Clear</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    </div>

  )
}

export default GridView