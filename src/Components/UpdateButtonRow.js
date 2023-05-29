import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
import GlobalContext from "./GlobalContext"
import Select from 'react-select'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Throw, ToastNotify, Remove, TelexRelease, Verify, Reset, CheckVoyageDelay, cancelApprovedReject,getSplitDataBR, RevertSplitBL, RejectRecord, GetVoyageDelay, GetMergeBLList, GetMergeBRList, ControlOverlay, GetBillOfLadingContainers, Suspend, Approved, Reject, RejectUser, CreateBC, GetBookingReservationsContainers, CheckingMergeBookingReservation, getRemainingBCbyID } from './Helper.js'
import $ from "jquery";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
  useNavigate
} from "react-router-dom"



function UpdateButtonRow(props) {
 
  const params = useParams();
  const globalContext = useContext(GlobalContext);
  const [userRuleSet, setUserRuleSet] = useState([])
 
  var tempModel;
  if (props.model == "company") {
    params.type ? tempModel = params.type.toLowerCase() : tempModel = props.model
  } else {
    tempModel = props.model
  }
  if(props.barge){
    tempModel=tempModel+"-barge"
  }
  if(tempModel=="credit-note" || tempModel=="debit-note" || tempModel=="credit-note-barge" || tempModel=="debit-note-barge" ){
    tempModel=`sales-${tempModel}`
  }
  if(tempModel=="u-n-number"){
    tempModel="un-number"
  }
  if(tempModel=="h-s-code"){
    tempModel="hs-code"
  }
  if(tempModel=="terminal handler" || tempModel=="box operator" || tempModel=="ship operator"){
    tempModel= tempModel.replace(" ","-")
  }
  

  useEffect(() => {
  
    var modelLinkTemp = props.model
    if (props.model == "company") {
      params.type ? modelLinkTemp = params.type.toLowerCase() : modelLinkTemp = props.model
    }
    if(modelLinkTemp=="credit-note" || modelLinkTemp=="debit-note" || modelLinkTemp=="debit-note-barge" || modelLinkTemp=="credit-note-barge" ){
      modelLinkTemp=`sales-${modelLinkTemp}`
    }
    if(modelLinkTemp=="u-n-number"){
      modelLinkTemp="un-number"
    }
    if(modelLinkTemp=="h-s-code"){
      modelLinkTemp="hs-code"
    }
    if(modelLinkTemp=="terminal handler" || modelLinkTemp=="box operator" || modelLinkTemp=="ship operator"){
      modelLinkTemp= modelLinkTemp.replace(" ","-")
    }

    if(props.barge){
     
      if( params.thirdparty){
      
        modelLinkTemp="third-party-"+modelLinkTemp+"-barge";
        modelLinkTemp="third-party-sales-invoice-barge"?modelLinkTemp="third-party-invoice-barge":modelLinkTemp=modelLinkTemp;
        modelLinkTemp="third-party-sales-debit-note-barge"?modelLinkTemp="third-party-debit-note-barge":modelLinkTemp=modelLinkTemp;

      }else{
        modelLinkTemp=modelLinkTemp+"-barge"
      }
    
    }
    if (globalContext.userRule !== "") {
      const objRule = JSON.parse(globalContext.userRule);
      if(modelLinkTemp=="quotation" || modelLinkTemp=="quotation-barge"){
        var tempVal;
        modelLinkTemp=="quotation-barge"?tempVal="booking-reservation-barge":tempVal="booking-reservation"
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(modelLinkTemp) || item.includes(tempVal);
        });
      }else if(modelLinkTemp=="booking-reservation" || modelLinkTemp=="booking-reservation-barge" ){
      
        var filteredAp = objRule.Rules.filter(function (item) {
          if(modelLinkTemp=="booking-reservation-barge"){
            return item.includes(modelLinkTemp) || item.includes("sales-invoice-barge");
          }
          else{
            return item.includes(modelLinkTemp) || item.includes("sales-invoice") || item.includes("container-release-order");
          }
          
        });
      }else{
        var filteredAp = objRule.Rules.filter(function (item) {
          return item.includes(modelLinkTemp);
        });
      }
      setUserRuleSet(filteredAp)
    }

  
    return () => {

    }
  }, [globalContext.userRule])






  const { register, handleSubmit, setValue, trigger, getValues, reset, control, watch, formState: { errors } } = useForm({


  });

  const [mergeBLList, setMergeBLList] = useState([])
  const [mergeBRList, setMergeBRList] = useState([])
  var companyType = "";


  if (JSON.stringify(params) !== '{}') {
    var companyType = params.type
  }
  if (companyType !== "" && companyType !== undefined) {
    var cancelLink = props.data.data.groupLink + (props.data.data.modelLink) + "/index/CompanyType=" + companyType
  } else {
    if (params.thirdparty) {
      var cancelLink = props.data.data.groupLink + (props.data.data.modelLink) + "/index/third-party"
    }
    else {
      var cancelLink = props.data.data.groupLink + (props.data.data.modelLink) + "/index"
    }

  }

  if (companyType !== "" && companyType !== undefined) {
    var newLink = props.data.data.groupLink + (props.data.data.modelLink) + "/create/type=" + companyType
  } else {
    var newLink = props.data.data.groupLink + (props.data.data.modelLink) + "/create"
  }


  const navigate = useNavigate();

  const showApproved = ["Charges", "Tariff", "Container", "Vessel", "Company", "PortDetails", "BillOfLading", "Quotation", "BookingReservation", "SalesInvoice", "SalesCreditNote", "SalesDebitNote", "CustomerPayment"]
  const showPDF = ["container-verify-gross-mass", "container-release-order", "bill-of-lading", "quotation", "booking-reservation", "delivery-order", "sales-invoice", "credit-note", "debit-note", "customer-payment"]
  const showTelexRelease = ["bill-of-lading"]
  const showSplit = ["bill-of-lading", "booking-reservation"]
  const showMerge = ["bill-of-lading", "booking-reservation"]
  const showRevertSplit = ["bill-of-lading"]
  const showConfirmBR = ["BookingReservation"]
  const showDNDList = ["Quotation", "BookingReservation"]
  const showTransferBR = ["Quotation"]
  const showTransferCROINV = ["BookingReservation"]
  const showTransferCNDN = ["SalesInvoice"]
  const showTransferVoyage = ["BookingReservation"]


  var resultShowApproved = showApproved.filter(function (oneArray) {
    return oneArray == props.title
  });

  var resultShowPDF = showPDF.filter(function (oneArray) {
    return oneArray == props.model
  });

  var resultShowDND = showDNDList.filter(function (oneArray) {
    return oneArray == props.title
  });

  var resultConfirmBR = showConfirmBR.filter(function (oneArray) {
    return oneArray == props.title
  });

  var resultShowTransferBR = showTransferBR.filter(function (oneArray) {
    return oneArray == props.title
  });

  var resultShowTransferCROINV = showTransferCROINV.filter(function (oneArray) {
    return oneArray == props.title
  });

  var resultShowTransferCNDN = showTransferCNDN.filter(function (oneArray) {
    return oneArray == props.title
  });

  var resultShowTransferVoyage = showTransferVoyage.filter(function (oneArray) {
    return oneArray == props.title
  });

  var resultShowTelexRelease = showTelexRelease.filter(function (oneArray) {
    return oneArray == props.model
  });

  var resultShowSplit = showSplit.filter(function (oneArray) {
    return oneArray == props.model && !props.barge
  });

  var resultShowMerge = showMerge.filter(function (oneArray) {
    return oneArray == props.model && !props.barge
  });
  var resultShowRevertSplit = showRevertSplit.filter(function (oneArray) {
    return oneArray == props.model && !props.barge
  });

  useEffect(() => {

    if (props.voyageDelay) {
      if (props.position == "top") {
        window.$("#VoyageDelayModal").modal("toggle")
        GetVoyageDelay(globalContext, props.model, props.id).then(res => {
          $(".voyage-delay-item").empty()
          $.each(res.data, function (key, value) {
            if (value.PortType == "POL") {
              var type = "pol"
            }
            else if (value.PortType == "POD") {
              var type = "pod"
            }
            else {
              var type = "Transhipment"
            }
            if (value.ETD == null || value.ETD == "") {
              var ETD = "";
            }
            else {
              if (value.Transhipment !== null) {
                if ($(".TranshipmentCardRow").eq(value.Transhipment).find(".POTLoadingDate").val() == value.ETD) {
                  var ETD = ""
                } else {
                  var ETD = $(".TranshipmentCardRow").eq(value.Transhipment).find(".POTLoadingDate").val() + "&#8594;" + value.ETD;
                }
              }
              else {
                if ($("#" + (props.model).replaceAll("-", "").trim() + "-" + type + "etd").val() == value.ETD) {
                  var ETD = ""
                }
                else {
                  var ETD = $("#" + (props.model).replaceAll("-", "").trim() + "-" + type + "etd").val() + "&#8594;" + value.ETD;
                }
              }
            }

            if (value.ETA == null || value.ETA == "") {
              var ETA = "";
            }
            else {
              if (value.Transhipment !== null) {
                if ($(".TranshipmentCardRow").eq(value.Transhipment).find(".POTDischargingDate").val() == value.ETA) {
                  var ETA = ""
                }
                else {
                  var ETA = $(".TranshipmentCardRow").eq(value.Transhipment).find(".POTDischargingDate").val() + "&#8594;" + value.ETA;
                }
              }
              else {
                if ($("#" + (props.model).replaceAll("-", "").trim() + "-" + type + "eta").val() == value.ETA) {
                  var ETA = ""
                }
                else {
                  var ETA = $("#" + (props.model).replaceAll("-", "").trim() + "-" + type + "eta").val() + "&#8594;" + value.ETA;
                }
              }
            }
            if (value.SCNCode == null || value.SCNCode == "") {
              var SCN = "";

            }
            else {
              if (value.Transhipment !== null) {
                var SCN = ""
              }
              else {

                var SCN = $("#" + (props.model).replaceAll("-", "").trim() + "-" + type + "scncode").val() + "&#8594;" + value.SCNCode;
              }

            }
            if (value.ClosingDateTime == null || value.ClosingDateTime == "") {
              var ClosingDateTime = "";

            }
            else {
              if (value.Transhipment !== null) {
                var ClosingDateTime = ""
              }
              else {
                var ClosingDateTime = $("#" + (props.model).replaceAll("-", "").trim() + "-closingdatetime").val() + "&#8594;" + value.ClosingDateTime;
              }
            }
            $(".voyage-delay-item").append("<tr><td>" + value.VoyageNumber + "</td><td>" + value.PortCodeName + "</td><td class='DelayETA'>" + ETA + "</td><td class='DelayETD'>" + ETD + "</td><td class='DelaySCN'>" + SCN + "</td><td class='DelayClosingDate'>" + ClosingDateTime + "</td'><td class='PortType d-none'>" + value.PortType + "</td><td class='TranshipmentSeq d-none'>" + value.Transhipment + "</td></tr>");
          })
        })
      }

    }

    return () => {

    }
  }, [props.voyageDelay])


  function handleVerifyFirst() {
    window.$(".rejectMessage").val("")
    window.$(".rejectMessage").prop("disabled", false)
    window.$("#ButtonVerifyConfirmModal").modal("toggle");
    window.$("#rejectStatus").addClass("d-none")
    window.$("#verify").removeClass("d-none")
    window.$(".rejectMessageRow").addClass("d-none")
    window.$("#cancelApprovedReject").addClass("d-none")
    window.$("#ButtonVerifyConfirmModal").find(".message").text("Are you sure you want to approve this data?")


  }

  function handleRemoveFirst() {
    window.$(".rejectMessage").val("")
    window.$(".rejectMessage").prop("disabled", false)
    window.$("#ButtonVerifyConfirmModal").modal("toggle");
    window.$("#verify").addClass("d-none")
    window.$("#rejectStatus").removeClass("d-none")
    window.$("#cancelApprovedReject").addClass("d-none")
    if (props.model == "quotation") {
      window.$(".rejectMessageRow").removeClass("d-none")
    } else {
      window.$(".rejectMessageRow").addClass("d-none")
    }
    window.$("#ButtonVerifyConfirmModal").find(".message").text("Are you sure you want to reject  this data?")
  }

  function handleApproved() {
    if(userRuleSet.includes(`verify-${tempModel}`)){
      window.$("#ButtonVerifyModalForm").modal('toggle')
      if (props.model == "user") {
        $("#cancelApproveRejectFirst").addClass("d-none")
      }
    }else{
      alert("You are not allowed to perform Approved, Please check your Permission.")
    }
   
  }


  function handleCancelApprovedRejectFirst() {
    window.$(".rejectMessage").val("")
    window.$(".rejectMessage").prop("disabled", false)
    window.$("#ButtonVerifyConfirmModal").modal("toggle");
    window.$("#verify").addClass("d-none")
    window.$("#rejectStatus").addClass("d-none")
    window.$(".rejectMessageRow").addClass("d-none")
    window.$("#cancelApprovedReject").removeClass("d-none")
    window.$("#ButtonVerifyConfirmModal").find(".message").text("Are you sure you want to cancel approved/reject this data?")

  }

  function handleReset() {
    if(userRuleSet.includes(`verify-${tempModel}`)){
      ControlOverlay(true)
      var object = {}
      object[props.selectedId] = [props.id]
      Reset(globalContext, props.model, object).then(res => {
        if (res.Success.length > 0) {
          ToastNotify("success", "Successfully reset")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          ControlOverlay(false)
        }
  
        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot reset")
          ControlOverlay(false)
  
        }
      })
    }else{
      alert("You are not allowed to perform Reset, Please check your Permission.")
    }
  

  }


  function handleSuspend() {
    if(userRuleSet.includes(`verify-${tempModel}`)){
      ControlOverlay(true)
      var object = {}
      object[props.selectedId] = [props.id]
      Suspend(globalContext, props.model, object).then(res => {
        if (res.Success.length > 0) {
          ToastNotify("success", "Successfully suspend")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          ControlOverlay(false)
        }
  
        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot suspend")
          ControlOverlay(false)
  
        }
      })

    }else{
      alert("You are not allowed to perform Suspend, Please check your Permission.")
    }
   

  }


  function handleThrow() {
    if(userRuleSet.includes(`throw-${tempModel}`)){
      var object = {}
      var type;
      props.barge?type="barge":type="normal";
      if (props.selectedId == "PortUUIDs") {
        props.selectedId = "AreaUUIDs"
      }
      if (props.selectedId == "TerminalUUIDs") {
        props.selectedId = "PortDetailsUUIDs"
      }
  
      object[props.selectedId] = [props.id]
      Throw(globalContext, props.model, object,type).then(res => {
        if (res.ThrowSuccess.length > 0) {
          ToastNotify("success", "Successfully Threw")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
        }
  
        if (res.RetrieveSuccess.length > 0) {
          ToastNotify("success", "Successfully Retrieved")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
        }
      })
    }else{
      alert("You are not allowed to perform Throw, Please check your Permission.")
    }
 

  }
  function handleVerify() {
    if(userRuleSet.includes(`verify-${tempModel}`)){
      window.$("#ButtonVerifyModalForm").modal('toggle')
    }else{
      alert("You are not allowed to perform Verify, Please check your Permission.")
    }
    
  }

  function handleRemove() {
    if(userRuleSet.includes(`delete-${tempModel}`)){
      window.$("#ButtonRemoveModal").modal('toggle')
    }else{
      alert("You are not allowed to perform Delete, Please check your Permission.")
    }
   
  }

  function handleFinalVerify() {
    var object = {}
    var type;
    props.barge?type="barge":type="normal"
    object[props.selectedId] = [props.id]
    window.$("#ButtonVerifyModalForm").modal("toggle");
    ControlOverlay(true)
    if (props.model == "user") {
      Approved(globalContext, props.model, object).then(res => {
        if (res.Success.length > 0) {
          ToastNotify("success", "Successfully approved")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          ControlOverlay(false)
        }

        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot approved")
          ControlOverlay(false)

        }
      })
    } else {
      if (props.model == "bill-of-lading") {
        Verify(globalContext, props.model, object,type).then(res => {

          if (res.Failed && res.Failed.length > 0) {
            ToastNotify("error", "Booking need to be confirmed")
            ControlOverlay(false)

          } else if (res.Verify && res.Verify.length > 0) {
            if (res.Verify[0].SalesInvoice) {
              ToastNotify("success", `Successfully approved,Sales Invoice ${res.Verify[0].SalesInvoice} generated`, 3000)
              navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
              ControlOverlay(false)

            } else if (res.Verify[0].message == "Cannot generate Sales Invoice, empty charges for Freight Prepaid") {
              ToastNotify("warning", "Successfully approved,no Sales Invoice generated, empty charges for Freight Prepaid")
              navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
              ControlOverlay(false)
            }

          }

        })

      } else {
        Verify(globalContext, props.model, object,type).then(res => {
          if (res.Verify.length > 0) {
            ToastNotify("success", "Successfully approved")
            navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
            ControlOverlay(false)
          }

          if (res.Failed.length > 0) {
            ToastNotify("error", "Cannot approved")
            ControlOverlay(false)

          }
        })
      }

    }


  }

  function handleFinalCancelApproved() {
    var object = {}
    var type;
    props.barge?type="barge":type="normal"
    object[props.selectedId] = [props.id]
    window.$("#ButtonVerifyModalForm").modal("toggle");
    ControlOverlay(true)
    if (props.model == "user") {
      cancelApprovedReject(globalContext, props.model, object).then(res => {
        if (res.Pending.length > 0) {
          ToastNotify("success", "Successfully cancel approved/reject")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          ControlOverlay(false)
        }

        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot approved")
          ControlOverlay(false)

        }
      })
    } else {
      cancelApprovedReject(globalContext, props.model, object,type).then(res => {
        if (res.Pending.length > 0) {
          ToastNotify("success", "Successfully cancel approve/reject")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          ControlOverlay(false)
        }

        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot approved")
          ControlOverlay(false)

        }
      })
    }


  }

  function handleFinalReject() {
    var object = {}
    var type;
    props.barge?type="barge":type="normal"
    var objectRejectMessage = {}
    object[props.selectedId] = [props.id]

    objectRejectMessage[props.selectedId] = [props.id]
    objectRejectMessage["RejectMessage"] = window.$(".rejectMessage").val()


    if (props.model == "user") {
      ControlOverlay(true)
      RejectUser(globalContext, props.model, object).then(res => {
        if (res.Reject.length > 0) {
          ToastNotify("success", "Successfully reject")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          ControlOverlay(false)
        }

        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot reject")
          ControlOverlay(false)
        }
      })
      window.$("#ButtonVerifyModalForm").modal("toggle");
    } else if (props.model == "quotation") {
      if (window.$(".rejectMessage").val() !== "") {
        ControlOverlay(true)
        RejectRecord(globalContext, props.model, objectRejectMessage).then(res => {
          if (res.data.Success.length > 0) {
            ToastNotify("success", "Successfully reject")
            navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
            ControlOverlay(false)
          }

          if (res.data.Failed.length > 0) {
            ToastNotify("error", "Cannot reject")
            ControlOverlay(false)
          }
        })
        window.$("#ButtonVerifyModalForm").modal('toggle')
      } else {
        alert('Please fill in the reject message')
        return false;
      }
    }
    else {
      ControlOverlay(true)
      Reject(globalContext, props.model, object,type).then(res => {
        if (res.Reject.length > 0) {
          ToastNotify("success", "Successfully reject")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          ControlOverlay(false)
        }

        if (res.Failed.length > 0) {
          ToastNotify("error", "Cannot reject")
          ControlOverlay(false)

        }
      })
      window.$("#ButtonVerifyModalForm").modal("toggle");
    }
  }

  function handlePreviewCRO() {
    window.$("#PreviewPdfCROModal").modal("toggle");
  }
  function handlePreviewBL() {
    window.$("#PreviewPdfBLModal").modal("toggle");
  }

  function handlePreviewINV() {
    window.$("#PreviewPdfCNDNModal").modal("toggle");
  }
  function handlePreviewCN() {
    window.$("#PreviewPdfCNDNModal").modal("toggle");
  }
  function handlePreviewBR() {
    window.$("#PreviewPdfBRModal").modal("toggle");
  }
  function handlePreviewOR() {
    if($(".knofkoffchooser:checked").length == "1"){
      $("#customerPaymentDetailPDF").removeClass("d-none")
    }else{
      $("#customerPaymentDetailPDF").addClass("d-none")
    }
    window.$("#PreviewPdfORModal").modal("toggle");
  }

  function confirmTransferFillterBillTo() {
    var BC = props.controlButtonState.BookingConfirmation

    var BranchCode = $('input[name=billTo]:checked').val();
    var CustomerType = $('input[name=billTo]:checked').prev().val();
    window.$("#CheckingBillToModal").modal("toggle")
    window.$("#TransferToCROINVModal").modal("toggle")
    if(props.barge){
      navigate("/sales/standard/sales-invoice-barge/transfer-from-booking-reservation-data/id=" + BC, { state: { id: BC, formType: "TransferFromBooking", CustomerType: CustomerType, BranchCode: BranchCode,transferFromModel:"booking-confirmation"  } })
    }else{
      navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id=" + BC, { state: { id: BC, formType: "TransferFromBooking", CustomerType: CustomerType, BranchCode: BranchCode,transferFromModel:"booking-confirmation" } })
    }
  
  }

  
  function handlePreview(type) {
    var urlLink;
    var newModel;
    props.barge?newModel=props.model+"-barge":newModel=props.model
    if (type) {
      if (type == "containerReleaseOrderOri") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id
      } else if (type == "containerReleaseOrderLetter") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview-letter?id=" + props.id
      }
      else if (type == "billOfLadingOri") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id + "&ReportType=BillOfLading"
      }
      else if (type == "shippingOrder") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id + "&ReportType=ShippingOrder"
      }
      else if (type == "shippingAdviceNote") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id + "&ReportType=ShippingAdviceNote"
      }
      else if (type == "shippingOrderDeclaration") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id + "&ReportType=ShippingOrderDeclaration"
      }
      else if (type == "bookingReservation") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id
      }
      else if (type == "bookingConfirmation") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview-confirmation?id=" + props.controlButtonState.BookingConfirmation
      }

      if (props.title == "SalesInvoice") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id + "&ReportType=" + type
      }
      if (props.title == "SalesCreditNote" || props.title == "SalesDebitNote") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id + "&ReportType=" + type
      }
      if (props.title == "CustomerPayment") {
        urlLink = globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id + "&type=" + type
      }
      const authInfo = JSON.parse(localStorage.getItem('authorizeInfos'));
      axios({
        url: urlLink,
        method: "GET",
        responseType: 'arraybuffer',
        auth: {
          username: authInfo.username,
          password: authInfo.access_token
        }
      }).then((response) => {
     
        var file = new Blob([response.data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);
        if (newModel == "container-release-order") {
          window.$("#PreviewPdfCROModal").modal("toggle");
        }
        if (newModel == "bill-of-lading") {
          window.$("#PreviewPdfBLModal").modal("toggle");
        }
        if (newModel == "sales-invoice") {
          window.$("#PreviewPdfCNDNModal").modal("toggle");
        }
        if (newModel == "credit-note" || newModel == "debit-note") {
          window.$("#PreviewPdfCNDNModal").modal("toggle");
        }
        if (newModel == "booking-reservation") {
          window.$("#PreviewPdfBRModal").modal("toggle");
        }
        window.$('#pdfFrameList').attr('src', url);
        window.$("#PreviewPdfModal").modal("toggle");
        window.$("#PreviewPdfBRModal").modal("hide");
        window.$("#PreviewPdfCNDNModal").modal("hide");
        window.$("#PreviewPdfORModal").modal("hide");
      });
    } else {
      const authInfo = JSON.parse(localStorage.getItem('authorizeInfos'));
      axios({
        url: globalContext.globalHost + globalContext.globalPathLink + newModel + "/preview?id=" + props.id,
        method: "GET",
        responseType: 'arraybuffer',
        auth: {
          username: authInfo.username,
          password: authInfo.access_token
        }
      }).then((response) => {
        var file = new Blob([response.data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(file);

        window.$('#pdfFrameList').attr('src', url);
        window.$("#PreviewPdfModal").modal("toggle");
      });
    }

  }

  function handleConfirmVoyageDelay(Type) {
    var ArrayObj = [];
    var obj = {};
    var Transhipment = [];
    var obj2 = {};
    var objPass = {}
    $(".voyage-delay-item").find("tr").each(function (key, value) {
      var type = $(value).find(".PortType").text();
      if ($(value).find(".PortType").text() == "Transhipment") {
        if ($(value).find(".DelayETA").text() !== "") {

          obj2["DischargingDate"] = $(value).find(".DelayETA").text().split("→")[1]
        }
        if ($(value).find(".DelayETD").text() !== "") {
          obj2["LoadingDate"] = $(value).find(".DelayETD").text().split("→")[1]
        }
        var Seq = $(value).find(".TranshipmentSeq").text();
        obj2[`${props.title}HasTranshipmentUUID`] = $(".TranshipmentCardRow").eq(Seq).find(`.${props.title}HasTranshipmentUUID`).val()
      } else {
        if ($(value).find(".DelayETA").text() !== "") {
          obj[type + "ETA"] = $(value).find(".DelayETA").text().split("→")[1]
        }

        if ($(value).find(".DelayETD").text() !== "") {
          obj[type + "ETD"] = $(value).find(".DelayETD").text().split("→")[1]
        }
        if ($(value).find(".DelaySCN").text() !== "") {
          obj[type + "SCNCode"] = $(value).find(".DelaySCN").text().split("→")[1]
        }
        if ($(value).find(".DelayClosingDate").text() !== "") {
          obj["ClosingDateTime"] = $(value).find(".DelayClosingDate").text().split("→")[1]
        }
      }
    })
    ArrayObj = obj;
    Transhipment.push(obj2);
    objPass[`${props.title}`] = ArrayObj
    objPass[`${props.title}HasTranshipment`] = Transhipment
    objPass["Action"] = Type
    CheckVoyageDelay(globalContext, props.model, props.id, objPass).then(res => {
      if (res.message == "Check voyage delay successfully" || res.message == "Success") {
        window.$("#VoyageDelayModal").modal("toggle")
        navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + '/update/id=' + props.id, { state: { id: props.id, formType: "Update" } })
      }
    })
  }

  function handleRealRemove() {
    var object = {}
    var type;
    props.barge?type="barge":type="normal"
    if (props.selectedId == "PortUUIDs") {
      props.selectedId = "AreaUUIDs"
    }

    if (props.selectedId == "TerminalUUIDs") {
      props.selectedId = "PortDetailsUUIDs"
    }
    object[props.selectedId] = [props.id]

    window.$("#ButtonRemoveModal").modal('toggle')

    Remove(globalContext, props.model, object,type).then(res => {
      if (res.Success.length > 0) {
        ToastNotify("success", "Successfully Removed")
        navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")

      }

      if (res.Failed.length > 0) {
        var DocNumArray = []
        window.$.each(res.Failed, function (key, value) {
          DocNumArray.push(value.DocNum)
        })
        ToastNotify("error", DocNumArray.toString() + " Failed to Remove.", 5000)

      }
    })

  }

  function handleTelexRelease() {
    var object = {}
    var type;
    props.barge?type="barge":type="normal"
    object[props.selectedId] = [props.id]
    window.$("#ButtonTelexModal").modal('toggle')
    if(userRuleSet.includes(`telex-release-${tempModel}`)){
      TelexRelease(globalContext, props.model, object,type).then(res => {
        if (res.Success.length > 0) {
          ToastNotify("success", "Telex Release Successfully")
        
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
          // window.$("#" + props.tableSelector).bootstrapTable('refresh')
          // window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
        }
        if (res.Failed.length > 0) {
  
          var failedDocNum = []
          window.$.each(res.Failed, function (key, value) {
            failedDocNum.push(value.DocNum)
          })
          window.$('#ButtonTelexModal').modal("toggle")
          alert(failedDocNum.join(',') + " need to be verified")
          // window.$("#" + props.tableSelector).bootstrapTable('refresh')
          // window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
        }
      })

    }else{
      alert("You are not allowed to perform Telex Release, Please check your Permission.")
    }
  


  }

  function handleTransferBR() {
    var tempString;
    props.barge?tempString="create-booking-reservation-barge":tempString="create-booking-reservation";
    if(userRuleSet.includes(`transfer-${tempModel}`) &&  userRuleSet.includes(tempString)){
      var d = new Date();
      var month = d.getMonth()+1;
      var day = d.getDate();
      var output = (day<10 ? '0' : '') + day + '/' +
          (month<10 ? '0' : '') + month + '/' +
          d.getFullYear();
      var LastValidDate = $("input[name='DynamicModel[LastValidDate]']").val()

      var parts1 = output.split("/");
      var parts2 = LastValidDate.split("/");
      var dateObj1 = new Date(parts1[2], parts1[1] - 1, parts1[0]);
      var dateObj2 = new Date(parts2[2], parts2[1] - 1, parts2[0]);

      // Compare dates
      if (dateObj1 > dateObj2) {
        alert("Quotation already expired")
      } else {
        window.$("#TransferBRModal").modal("toggle")
        if(props.barge){
          navigate(props.data.data.groupLink + 'booking-reservation-barge/transfer-from-quotation/id=' + props.id, { state: { formType: "Transfer", id: props.id,transferFromModel:"quotation" } })
        }else{
          navigate(props.data.data.groupLink + 'booking-reservation/transfer-from-quotation/id=' + props.id, { state: { formType: "Transfer", id: props.id,transferFromModel:"quotation" } })
        }
      
      }
    }else{
        alert("You are not allowed to transfer to Booking Reservation, Please check your Permission.")
    }
  
  }

  function handleSplitBL() {
    var object = {}
    object[props.selectedId] = [props.id]

    GetBillOfLadingContainers(globalContext, props.model, props.id).then(res => {
      var containerLength = res.data.billOfLadingHasContainers.length
      window.$(".splitParentId").val(res.data.SplitParent)
      window.$(".containerList").empty();
      window.$.each(res.data.billOfLadingHasContainers, function (key, value) {
        var Container_Code = value.ContainerCode ? value.containerCode.ContainerCode : ""
        var Container_Type = value.ContainerType ? value.containerType.ContainerType : ""
        if (containerLength == 1) {
          window.$(".containerList").append(`<tr><td class='d-none containerUUID'>${value.BillOfLadingHasContainerUUID}</td><td><input type='checkbox' disabled class='checkboxSplit' name='Split'></td><td><input type='checkbox' class='checkboxShare' name='Share'><td>${Container_Code}</td><td>${Container_Type}</td></tr>`);
        } else {
          window.$(".containerList").append(`<tr><td class='d-none containerUUID'>${value.BillOfLadingHasContainerUUID}</td><td><input type='checkbox' class='checkboxSplit' name='Split'></td><td><input type='checkbox' class='checkboxShare' name='Share'><td>${Container_Code}</td><td>${Container_Type}</td></tr>`);
        }

      })
    })
  }
  function handleSplitBR() {
    var object = {}
    object[props.selectedId] = [props.id]

    GetBookingReservationsContainers(globalContext, props.model, props.id).then(res => {
      window.$(".splitParentIdBR").val(res.data.SplitParent)
      window.$(".containerList").empty();
      var containerLength = 0
      window.$.each(res.data.BookingReservationHasContainerTypes, function (key, value) {
        if (value.BookingReservationHasContainers) {
          if (value.BookingReservationHasContainers) {
            containerLength += value.BookingReservationHasContainers.length
          }
        }
        $.each(value.BookingReservationHasContainers, function (key2, value2) {
          var Container_Code = value2.ContainerCode ? value2.ContainerCodeName : ""
          var Container_Type = value.ContainerType ? value.ContainerTypeName : ""
          var Container_CodeUUID = value2.ContainerCode ? value2.ContainerCode : ""
          var Container_TypeUUID = value.ContainerType ? value.BookingReservationHasContainerTypeUUID : ""
          window.$(".containerList").append(`<tr><td class='d-none containerUUID'>${Container_CodeUUID}</td><td class='checkbox' style="text-align:center;vertical-align: middle;"><input type='checkbox' class='checkboxSplit' name='Split'></td><td class='containerCodeSplit' style="text-align:center;vertical-align: middle;">${Container_Code}<input type='hidden' value ='${Container_CodeUUID}'/></td><td class='containerTypeSplit' style="text-align:center;vertical-align: middle;">${Container_Type}<input type='hidden' value ='${Container_TypeUUID}'/></td></tr>`);
        })
      })
      if (containerLength <= 1) {
        window.$("#confirmSplitBR").prop("disabled", true)
      } else {
        window.$("#confirmSplitBR").prop("disabled", false)
      }
    })
  }

  function handleConfirmSplitBL() {
    if(userRuleSet.includes(`split-${tempModel}`) && userRuleSet.includes(`create-${tempModel}`)){
      var arraySplit = [];
      var arrayShare = [];
      var BillOfLadingUUID = props.id
      window.$("#split-container-table").find(".checkboxSplit:checked").each(function () {
        arraySplit.push(window.$(this).parent().parent().find(".containerUUID").text());
      });
      window.$("#split-container-table").find(".checkboxShare:checked").each(function () {
        arrayShare.push(window.$(this).parent().parent().find(".containerUUID").text());
      });
      var SplitID = arraySplit.join(',');
      var ShareID = arrayShare.join(',');
      if (window.$(".splitParentId").val() == "") {
        if (arraySplit.length !== 0 || arrayShare.length !== 0) {
  
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + '/split/splitid=' + SplitID + "&shareid=" + ShareID + "&id=" + BillOfLadingUUID, { state: { bLId: BillOfLadingUUID, shareID: ShareID, splitID: SplitID, formType: "SplitBL" } })
          // window.location.href = "./create2?SplitID=" + SplitID + "&ShareID=" + ShareID + "&BillOfLadingID=" + BillOfLadingUUID + "";
        }
      }
      else {
        if (arrayShare.length !== 0) {
          SplitID = ""
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + '/split/splitid=' + SplitID + "&shareid=" + ShareID + "&id=" + BillOfLadingUUID, { state: { bLId: BillOfLadingUUID, shareID: ShareID, splitID: SplitID, formType: "SplitBL" } })
          // window.location.href = "./create2?SplitID=" + SplitID + "&ShareID=" + ShareID + "&BillOfLadingID=" + BillOfLadingUUID + "";
        }
        else {
          alert("Split record cannot perform split action again.Please use revert feature")
        }
      }
      window.$('#SplitModal').modal("toggle")

    }else{
      alert("You are not allowed to perform Split, Please check your Permission.")
    }
   
  }

  function handleConfirmSplitBR() {
    if(userRuleSet.includes(`split-${tempModel}`) && userRuleSet.includes(`create-${tempModel}`) ){

      
      var arraySplitContainer = [];
      var arraySplitContainerType = [];
      var BookingReservationUUID = props.id
      window.$("#split-container-tableBR").find(".checkboxSplit:checked").each(function () {
        arraySplitContainer.push(window.$(this).parent().parent().find(".containerUUID").text());
        arraySplitContainerType.push(window.$(this).parent().parent().find(".containerTypeSplit").find(":hidden").val());
      });
      var SplitID = arraySplitContainer.join(',');
      var ContainerTypeID = arraySplitContainerType.join(',');

      var data={id: BookingReservationUUID, containerTypeID: ContainerTypeID, splitID: SplitID}
      getSplitDataBR(data, globalContext).then(res => {
        if(res.data.message){
          ToastNotify("error", res.data.message)
        }else{
          if (window.$(".splitParentIdBR").val() == "") {
            if (arraySplitContainer.length !== 0) {
      
              navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + '/split/splitid=' + ContainerTypeID + "&id=" + BookingReservationUUID + "&containerid=" + SplitID, { state: { id: BookingReservationUUID, containerTypeID: ContainerTypeID, splitID: SplitID, formType: "SplitBR" } })
            }
          }
        }
      })
  
  
      // else {
      //   if (arrayShare.length !== 0) {
      //     SplitID = ""
      //     navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + '/split/splitid=' + SplitID + "&id=" + BookingReservationUUID, { state: { id: BookingReservationUUID, splitID: SplitID, formType: "SplitBR" } })
      //   }
      //   else {
      //     alert("Split record cannot perform split action again.Please use revert feature")
      //   }
      // }
      window.$('#SplitModalBR').modal("toggle")
    }else{
      alert("You are not allowed to perform Split, Please check your Permission.")
    }
   
  }

  function handleMergeBL() {

    GetMergeBLList(props.id, globalContext, $("input[name='BillOfLading[POLPortCode]']").val(), $("input[name='BillOfLading[PODPortCode]']").val(), $("input[name='BillOfLading[VoyageNum]']").val()).then(res => {
      var arrayBLs = []
      window.$.each(res.data.data, function (key, value) {
        arrayBLs.push({ value: value.BillOfLadingUUID, label: value.DocNum })

      })
      setMergeBLList(arrayBLs)
    })

  }

  function handleMergeBR() {
    GetMergeBRList(props.id, globalContext, $("input[name='BookingReservation[POLPortCode]']").val(), $("input[name='BookingReservation[PODPortCode]']").val(), $("input[name='BookingReservation[VoyageNum]']").val(), $("input[name='BookingReservation[Quotation]']").val()).then(res => {
      var arrayBRs = []
      window.$.each(res.data.data, function (key, value) {
        arrayBRs.push({ value: key, label: value })
      })
      setMergeBRList(arrayBRs)
    })
  }

  function handleConfirmBR() {
    ControlOverlay(true)
    // $(".BCButton").attr('href', buttonUrl + "/create-booking-confirmation2?id=" + BookingReservationUUID)
    if (props.controlButtonState.Quotation) {
      CreateBC([props.id], globalContext, props.data.data.modelLink).then(res => {

        if(res.message){
          ToastNotify("error", res.message, 5000)
          ControlOverlay(false)
        }

        if(res.Confirmed.length >= 1) {
            ToastNotify("success", "Booking Reservation is confirmed.")
            if(props.barge){
              navigate("/sales/standard/booking-reservation-barge/index")
            }else{
              navigate("/sales/container/booking-reservation/index")
            }
           
            ControlOverlay(false)
        }
        else if(res.Expired.length >= 1) {
            ToastNotify("error", "Document was Expired.")
            ControlOverlay(false)
        }
        else if (res.Failed.length >= 1) {
          ToastNotify("error", "Failed Create Booking Confirmation.Quotation are Required.")
          ControlOverlay(false)
        }

      })
    } else {
      alert("You are not allow to Confirm this Booking, Please Check Quotation Number for this Booking.")
      ControlOverlay(false)
    }
  }

  function confirmMergeBL() {
    if(userRuleSet.includes(`merge-${tempModel}`) && userRuleSet.includes(`update-${tempModel}`) ){
      var MergedIDs = getValues("MergeBillOfLadingList[]").join(",")
      window.$('#MergeModal').modal("toggle")
      navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + '/merge/id=' + props.id + '&mergeid=' + MergedIDs, { state: { bLId: props.id, mergeIDs: MergedIDs, formType: "MergeBL" } })
    }else{
      alert("You are not allowed to perform Merge, Please check your Permission.")
    }
  
  }

  function confirmMergeBR() {
    if(userRuleSet.includes(`merge-${tempModel}`) && userRuleSet.includes(`update-${tempModel}`) ){
      var MergedIDs = getValues("MergeBookingReservationList[]").join(",")

      CheckingMergeBookingReservation(globalContext, props.id, MergedIDs).then(res => {
        if (res) {
          if (res.message) {
              ToastNotify("error", res.message)
              ControlOverlay(false)
            
          }
          else {
            window.$('#MergeModalBR').modal("toggle")
            navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + '/merge/id=' + props.id + '&mergeid=' + MergedIDs, { state: { id: props.id, mergeIDs: MergedIDs, formType: "MergeBR" } })
          }
        } 
      })
    }else{
      alert("You are not allowed to perform Merge, Please check your Permission.")
    }

  }

  function handleConfirmRevert() {
    if(userRuleSet.includes(`revert-${tempModel}`)){
      RevertSplitBL(globalContext, props.model, props.id).then(res => {
        if (res) {
          ToastNotify("success", "Bill Of Loading revert split successfully")
          window.$('#RevertSplitModal').modal("toggle")
          navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/index")
        }
  
      })
    } else{
      alert("You are not allowed to perform Rervert Split, Please check your Permission.")
    }
   
  }

  function TransferAllBR() {
    var TransferType = $("input[name='flexRadioDefault']:checked").val()
    // var BR = $("#TransferBR").val();
    // var BC = $("#TransferBC").val();
    if (TransferType == 'CRO') {
      // if (getTransferToPermission == true && getCROCreatePermission == true) {
        if(userRuleSet.includes(`transferto-${tempModel}`) &&  userRuleSet.includes(`create-container-release-order`) ){
          if ($(`input[name="DynamicModel[Quotation]"]`).val() != "") {
            if (props.controlButtonState.VerificationStatus == "Approved") {
              window.$("#TransferToCROINVModal").modal("toggle")
              ControlOverlay(true)
              navigate("/operation/container/container-release-order/transfer-from-booking-reservation-data/id=" + props.id, { state: { id: props.id, formType: "TransferFromBooking",transferFromModel:"booking-reservation" } })
            } else {
              alert("You are not allow to transfer to Container Release Order, Please Verify Booking before Transfer.")
            }
          }
          else {
            alert("You are not allow to transfer to Container Release Order, Please Check Quotation Number for this Booking.")
          }
        }else{
            alert("You are not allowed to transfer to Container Realease Order, Please check your Permission.")
        }
      
      // } else {
      //     alert("You are not allowed to transfer to Container Realease Order, Please check your Permission.")
      // }
    }
    else {
      var val;
      props.barge?val="create-sales-invoice-barge":val="create-sales-invoice"
      if(userRuleSet.includes(`transferto-${tempModel}`) &&  userRuleSet.includes(val) ){
             //     if (getTransferToPermission == true && getInvoiceCreatePermission == true) {
      var BC = props.controlButtonState.BookingConfirmation
      if (BC == "" || BC == null) {
        alert("Booking Reservation has not been confirmed")
      }
      else {
        var catchEmtpyContainer = false;
        $(".SelectContainerCodeField").each(function () {
          if (!$(this).hasClass("ForPartial")) {
            if (window.$(this).children().children().last().children().val() == "") {
              catchEmtpyContainer = true;
              return false;
            }
          }
        });
        if(props.barge){
          catchEmtpyContainer=false
        }
        if (catchEmtpyContainer == true) {
          alert("Container is needed, Please Check your Container");
        }
        else if($(".VerificationStatusField").text()!=""){
          alert("You are not allow to transfer to Sales Invoice, Please Verify Booking before Transfer.");
        }
        else {

          getRemainingBCbyID(BC, globalContext).then(res => {
            if (res) {
              var checkingCustomerList = []
              // checkingBillToList
              $.each($(".insidecharges-item"), function (key, value) {
                var data = {}
                var temp = { value: $(this).find(".BillToNameCharges").children().last().val(), label: $(this).find(".BillToNameCharges").find(".select__single-value").text() }
                data["CustomerType"] = $(this).find(".BillToTypeCharges").children().last().val()
                data["BillTo"] = temp
                checkingCustomerList.push(data)
              })

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
              window.$('.checkingBillToList').empty()

              $.each(uniqueData, function (key, value) {
                const customerType = $('<input type="hidden" name="customerType" value="' + value.CustomerType + '">');
                const radio = $(`<input type="radio" class="mr-2" id="radio-${key}" name="billTo" value="` + value.BillTo.value + '">');
                const label = $(`<label class="control-label" for="radio-${key}">`+ value.CustomerType+ " - " + value.BillTo.label + '</label>');
                $('.checkingBillToList').append(customerType).append(radio).append(label).append('<br>');
              })
              window.$("#CheckingBillToModal").modal("toggle")

              // window.$("#TransferToCROINVModal").modal("toggle")
              // navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id="+BC,{ state: { id:BC, formType: "TransferFromBooking" }})
            } else {
              alert("This booking has been fully transferred")
            }
          })
        }
      }
      }else{
           alert("You are not allowed to transfer to Sales Invoice, Please check your Permission.")
      }
 
      //     } else {
      //         alert("You are not allowed to transfer to Sales Invoice, Please check your Permission.")
      //     }
    }
  }


  useEffect(() => {
    if (props.title == "BookingReservation") {
      if (props.controlButtonState) {
        if (props.controlButtonState.BookingConfirmation) {
          window.$(".BCButton").addClass("d-none")
          window.$("#bookingConfirmationPDF").removeClass("d-none")
        } else {
          window.$(".BCButton").removeClass("d-none")
          window.$("#bookingConfirmationPDF").addClass("d-none")
        }
      }
    }
    return () => {
    }
  }, [props.controlButtonState])



  window.$(document).on("click", ".checkboxSplit", function () {
    if (window.$(this).parent().next().find(".checkboxShare").prop("checked")) {
      window.$(this).parent().next().find(".checkboxShare").prop("checked", false)
    }


  })

  window.$(document).on("click", ".checkboxShare", function () {
    if (window.$(this).parent().prev().find(".checkboxSplit").prop("checked")) {
      window.$(this).parent().prev().find(".checkboxSplit").prop("checked", false)
    }

  })

  window.$(document).on("click", ".userCloneModal", function () {
    window.$("#userCloneModal").modal("toggle")
  })


  $(document).unbind().on("click", ".CheckTransfer", function () {
    var value = $(this).val();

    if (value == "Invoice") {
      // console.log($(`input[name="DynamicModel[BKDocNum]"]`).val())
      // if ($(`input[name="DynamicModel[BKDocNum]"]`).val() == "") {
      //     $('#TransferToPartial').prop('disabled', true);
      // } else {
      $('#TransferToPartial').prop('disabled', false);
      // }
    }
    if (value == "CRO") {
      $('#TransferToPartial').prop('disabled', true);
    }
  })

  return (
    <>

      <div className="row">
        <div className="col-12">
          {props.profile ?
            <div className="m-3">
              <button onClick={props.handleSubmitData} type="button" className={`${userRuleSet.find((item) => item == `update-user-profile`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} save btn btn-primary mr-2`}  title="Save"><i className="fas fa-save"></i></button>
            </div>
            :
            <div className="m-3">
              {params.thirdparty ?
                <div>
                  {resultShowPDF.length > 0 ? <button type="button" className={`${userRuleSet.find((item) => item == `preview-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} title="Preview" onClick={() => props.model == "container-release-order" ? handlePreviewCRO() : props.model == "bill-of-lading" ? handlePreviewBL() : props.model == "sales-invoice" ? handlePreviewINV() : props.model == "credit-note" || props.model == "debit-note" ? handlePreviewCN() : handlePreview()}><i className="fa fa-file-pdf"></i></button> : ""}
                  <Link to={cancelLink}><button type="button" className="btn btn-primary mr-2" title="Cancel"><i className="fa fa-ban"></i></button></Link>
                </div>
                :
                <div>
                  <button onClick={props.handleSubmitData} type="button" className={`${userRuleSet.find((item) => item == `update-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn save btn-primary mr-2`} title="Save" ><i className="fas fa-save"></i></button>
                  {props.model !== "delivery-order" ?
                    <>
                     {userRuleSet.find((item) => item == `create-${tempModel}`) !== undefined ?
                     <>
                      <Link to={newLink} state={{ formType: "New", formNewClicked: true }}><button type="button" className={`btn btn-primary mr-2`} title="New"><i className="far fa-file"></i></button></Link>
                      {props.model == "user" ?
                      <button type="button" className={`btn btn-primary mr-2`} title="Clone" data-toggle="modal" data-target="#userCloneModal"><i className="far fa-copy"></i></button>:
                      <Link to={newLink} state={{ formType: "Clone", id: props.id }}><button type="button" className={`btn btn-primary mr-2`} title="Clone" ><i className="far fa-copy"></i></button></Link>
                      }
                     </>
                     :
                     <>
                        <button type="button" className={`btn btn-primary ${props.data.data.model=="Rule"?"":"disabledAccess"} mr-2`} title="New"><i className="far fa-file"></i></button>
                        <button type="button" className={`btn btn-primary ${props.data.data.model=="Rule"?"":"disabledAccess"} mr-2`} title="Clone" ><i className="far fa-copy"></i></button>
                     </>

                     }
                     
                    </> : ""
                  }
                  {props.model == "user" ?
                    <>
                      <button type="button"  className={`${userRuleSet.find((item) => item == `verify-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`}  title="Approved" onClick={handleApproved}><i className="fas fa-user-check"></i></button>
                      <button type="button" className={`${userRuleSet.find((item) => item == `verify-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`}  title="Reset" onClick={handleReset}><i className="fas fa-key"></i></button>
                      <button type="button" className={`${userRuleSet.find((item) => item == `verify-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`}  title="Suspend" onClick={handleSuspend}><i className="fas fa-minus-circle"></i></button>
                    </> : ""
                  }
                  {resultShowApproved.length > 0 ? <button type="button" className={`${userRuleSet.find((item) => item == `verify-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} title="Verify" onClick={handleVerify}><i className="fa fa-user-check"></i></button> : ""}

                  {resultShowTelexRelease.length > 0 ?
                    <button id="telexRelease" type="button" title="Telex Release" className={`${userRuleSet.find((item) => item == `telex-release-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} data-toggle="modal" data-target="#ButtonTelexModal"><i className="fa fa-share-square"></i></button> : ""
                  }
                  {resultShowTransferBR.length > 0 ?
                    <button id="transferToBR" type="button" title="Transfer To"  className={`${userRuleSet.find((item) => item == `transfer-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2 transferButton CheckValidStatus`} data-toggle="modal" data-target="#TransferBRModal"><i className="fas fa-file-export"></i></button> : ""
                  }
                  {resultShowTransferCROINV.length > 0 ?
                    <button id="transferToCROINV" type="button" title="Transfer To" className={`${userRuleSet.find((item) => item == `transferto-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} data-toggle="modal" data-target="#TransferToCROINVModal"><i className="fas fa-file-export"></i></button> : ""
                  }
                  {resultShowTransferCNDN.length > 0 ?
                    <button id="transferToCNDN" type="button" title="Transfer To" className={`${userRuleSet.find((item) => item == `transferto-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`}  data-toggle="modal" data-target="#TransferToCNDNModal"><i className="fas fa-file-export"></i></button> : ""
                  }
                  {resultShowPDF.length > 0 ? <button type="button" className={`${userRuleSet.find((item) => item == `preview-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} title="Preview" onClick={() => props.model == "container-release-order" ? handlePreviewCRO() : props.model == "bill-of-lading" ? handlePreviewBL() : props.model == "sales-invoice" ? handlePreviewINV() : props.model == "credit-note" || props.model == "debit-note" ? handlePreviewCN() : props.model == "booking-reservation" ? handlePreviewBR() : props.model == "customer-payment" ? handlePreviewOR() : handlePreview()}><i className="fa fa-file-pdf"></i></button> : ""}

                  {resultShowSplit.length > 0 ?
                    <button id="split" title="Split" type="button" className={`${userRuleSet.find((item) => item == `split-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} data-toggle="modal" data-target={props.model == "booking-reservation" ? "#SplitModalBR" : `#SplitModal`} onClick={() => props.model == "booking-reservation" ? handleSplitBR() : handleSplitBL()}><i className="far fa-object-ungroup"></i></button> : ""
                  }
                  {resultShowMerge.length > 0 ?
                    <button id="merge" title="Merge" type="button" className={`${userRuleSet.find((item) => item == `merge-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} data-toggle="modal" data-target={props.model == "booking-reservation" ? "#MergeModalBR" : `#MergeModal`} onClick={() => props.model == "booking-reservation" ? handleMergeBR() : handleMergeBL()}><i className="far fa-object-group"></i></button> : ""
                  }
                  {resultShowRevertSplit.length > 0 ?
                    <button id="revertSplit" title="Revert Split" type="button"  className={`${userRuleSet.find((item) => item == `revert-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2 revertSplitButton`}  data-toggle="modal" data-target="#RevertSplitModal"><i className="fas fa-chevron-circle-left"></i></button> : ""
                  }
                  {resultConfirmBR.length > 0 ?
                 
                    <a  className={`${userRuleSet.find((item) => item == `confirm-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2 BCButton FormToConfirmation confirm-booking-reservation checkpermision`} title="Booking Confirmations" onClick={handleConfirmBR}><i className="fa fa-check-circle"></i></a> : ""
                  }
                  {resultShowDND.length > 0 ?
                    <a className={`btn btn-primary mr-2`} title="DND" data-toggle="modal" data-target="#DNDModal"><i className="fab fa-dochub"></i></a> : ""
                  }
                  {resultShowTransferVoyage.length > 0 ?
                    <a  className={`${userRuleSet.find((item) => item == `transfer-voyage-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2 transfer-voyage-booking-reservation checkpermision`} title="Transfer Voyage" data-toggle="modal" data-target="#TransferVoyageModal"><i className="fas fa-exchange-alt"></i> </a> : ""
                  }
                  <button type="button" className={`${userRuleSet.find((item) => item == `throw-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} title="Throw" onClick={handleThrow}><i className="fa fa-trash"></i></button>
                  {props.model == "user" ?
                    "" :
                    <button type="button" className={`${userRuleSet.find((item) => item == `delete-${tempModel}`) !== undefined ? "" : props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2`} title="Remove" onClick={handleRemove}><i className="fas fa-times-circle"></i></button>
                  }

                  <Link to={cancelLink}><button type="button" className="btn btn-primary mr-2" title="Cancel"><i className="fa fa-ban"></i></button></Link>
                  {resultShowApproved.length > 0 ? <h2 className="VerificationStatusField mt-2 float-right"></h2> : ""}
                </div>

              }

            </div>
          }

        </div>
      </div>

      <div className="modal fade" id="ButtonRemoveModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Remove</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h5>Are you sure you want to remove?</h5>
            </div>
            <div className="modal-footer">
              <button id="remove" type="button" className="btn btn-success" onClick={handleRealRemove}>Remove</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="ButtonVerifyModalForm" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Verify</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <button id="verifyFirst" type="button" className="btn btn-success mr-2" onClick={handleVerifyFirst}>Approve</button>
              <button id="rejectStatusFirst" type="button" className="btn btn-danger mr-2" onClick={handleRemoveFirst}>Reject</button>
              <button id="cancelApproveRejectFirst" type="button" className="btn btn-secondary" onClick={handleCancelApprovedRejectFirst}>Cancel Approved/Reject</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="ButtonVerifyConfirmModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Confirmation</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h5 className="message">?</h5>
              <div className="rejectMessageRow">
                <h5 className="">Please fill in reject message.</h5>
                <div className="form-group">
                  <input type="text" className="form-control rejectMessage"></input>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" id="verify" className="btn btn-success d-none mt-2 mb-2" data-dismiss="modal" onClick={handleFinalVerify}>Approve</button>
              <button type="button" id="rejectStatus" className="btn btn-danger d-none" data-dismiss="modal" onClick={handleFinalReject}>Reject</button>
              <button type="button" id="cancelApprovedReject" className="btn btn-secondary d-none" data-dismiss="modal" onClick={handleFinalCancelApproved} >Cancel Approved/Reject</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="PreviewPdfModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <iframe id="pdfFrameList" src="" width="100%" height="700"></iframe>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="PreviewPdfCROModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Preview</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary mr-1" id="ContainerReleaseOrderOri" onClick={() => handlePreview("containerReleaseOrderOri")} >
                Container Release Order
              </button>
              <button type="button" className="btn btn-primary" id="ContainerReleaseOrderLetter" onClick={() => handlePreview("containerReleaseOrderLetter")}>
                Container Release Letter
              </button>
            </div>
            <div className="modal-footer">

              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="PreviewPdfBLModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Preview</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary mr-1" id="BillOfLadingOri" onClick={() => handlePreview("billOfLadingOri")} >
                Bill Of Lading
              </button>
              <button type="button" className="btn btn-primary mr-1" id="ShippingOrder" onClick={() => handlePreview("shippingOrder")}>
                Shipping Order
              </button>
              <button type="button" className="btn btn-primary mr-1" id="ShippingAdviceNote" onClick={() => handlePreview("shippingAdviceNote")}>
                Shipping Advice Note
              </button>
              <button type="button" className="btn btn-primary" id="ShippingOrderDeclaration" onClick={() => handlePreview("shippingOrderDeclaration")}>
                Shipping Order Declaration
              </button>
            </div>
            <div className="modal-footer">

              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="PreviewPdfBRModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Preview</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary mr-1" id={"bookingReservationPDF"} onClick={() => handlePreview(`bookingReservation`)}>
                Booking Reservation
              </button>
              <button type="button" className="btn btn-primary" id={`bookingConfirmationPDF`} onClick={() => handlePreview(`bookingConfirmation`)}>
                Booking Confirmation
              </button>
            </div>
            <div className="modal-footer">

              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="PreviewPdfORModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Preview</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary mr-1" id={"customerPaymentNormalPDF"} onClick={() => handlePreview(`undefined`)}>
                Normal
              </button>
              <button type="button" className="btn btn-primary d-none" id={`customerPaymentDetailPDF`} onClick={() => handlePreview(`detail`)}>
                Detail
              </button>
            </div>
            <div className="modal-footer">

              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal" id="PreviewPdfCNDNModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Preview</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <button type="button" className="btn btn-primary mr-1" id={`${props.title}Original`} onClick={() => handlePreview(`${props.title}Original`)} >
                Original
              </button>
              <button type="button" className="btn btn-primary mr-1" id={`${props.title}Account`} onClick={() => handlePreview(`${props.title}Account`)}>
                Account
              </button>
              <button type="button" className="btn btn-primary mr-1" id={`${props.title}ReprintOriginal`} onClick={() => handlePreview(`${props.title}ReprintOriginal`)}>
                Reprint Original
              </button>
              <button type="button" className="btn btn-primary" id={`${props.title}ReprintAccount`} onClick={() => handlePreview(`${props.title}ReprintAccount`)}>
                Reprint Account
              </button>
            </div>
            <div className="modal-footer">

              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Telex Release Modal--> */}
      <div className="modal fade" id="ButtonTelexModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Are you sure to Telex Release?</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <button id="telex" type="button" className="btn btn-success" onClick={handleTelexRelease}>Confirm</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Split modal */}
      <div className="modal fade" id="SplitModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Split Bill Of Lading-Container</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="text" className="splitParentId d-none"></input>
              <table className="table table-bordered" id="split-container-table">
                <thead>
                  <tr>
                    <th className="d-none">ID</th>
                    <th>Split</th>
                    <th>Share</th>
                    <th>Container Code</th>
                    <th>Container Type</th>
                  </tr>
                </thead>
                <tbody className="containerList">
                </tbody>

              </table>


            </div>
            <div className="modal-footer">
              <button id="confirmSplitBL" type="button" className="btn btn-primary" onClick={handleConfirmSplitBL}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="SplitModalBR" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Split Booking Reservation-Container</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="text" className="splitParentIdBR d-none"></input>
              <table className="table table-bordered" id="split-container-tableBR">
                <thead>
                  <tr>
                    <th className="d-none">ID</th>
                    <th style={{ textAlign: "center", verticalAlign: "middle" }}>Split</th>
                    <th style={{ textAlign: "center", verticalAlign: "middle" }}>Container Code</th>
                    <th style={{ textAlign: "center", verticalAlign: "middle" }}>Container Type</th>
                  </tr>
                </thead>
                <tbody className="containerList">
                </tbody>

              </table>


            </div>
            <div className="modal-footer">
              <button id="confirmSplitBR" type="button" className="btn btn-primary" onClick={handleConfirmSplitBR}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Merge Modal--> */}
      <div className="modal fade" id="MergeModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Merge Bill Of Lading</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Bill Of Lading</label>
                <Controller
                  name="MergeBillOfLadingList[]"
                  id="MergeBillOfLadingList"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      isClearable={true}
                      isMulti
                      name="MergeBillOfLadingList[]"
                      value={
                        value
                          ? Array.isArray(value)
                            ? value.map((c) =>
                              mergeBLList.find((z) => z.value === c)
                            )
                            : mergeBLList.find(
                              (c) => c.value === value
                            )
                          : null
                      }
                      onChange={(val) =>
                        val == null
                          ? onChange(null)
                          : onChange(val.map((c) => c.value))
                      }
                      options={mergeBLList}
                      className="basic-multiple-select"
                      classNamePrefix="select"
                      styles={globalContext.customStyles}
                    />
                  )}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button id="confirmMergeBL" type="button" className="btn btn-primary" onClick={confirmMergeBL}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Merge Modal--> */}
      <div className="modal fade" id="MergeModalBR" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Merge Booking Reservation</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>BR No.</label>
                <Controller
                  name="MergeBookingReservationList[]"
                  id="MergeBookingReservationList"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      isClearable={true}
                      isMulti
                      name="MergeBookingReservationList[]"
                      value={
                        value
                          ? Array.isArray(value)
                            ? value.map((c) =>
                              mergeBRList.find((z) => z.value === c)
                            )
                            : mergeBRList.find(
                              (c) => c.value === value
                            )
                          : null
                      }
                      onChange={(val) =>
                        val == null
                          ? onChange(null)
                          : onChange(val.map((c) => c.value))
                      }
                      options={mergeBRList}
                      className="basic-multiple-select"
                      classNamePrefix="select"
                      styles={globalContext.customStyles}
                    />
                  )}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button id="confirmMergeBL" type="button" className="btn btn-primary" onClick={confirmMergeBR}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="RevertSplitModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Revert Split</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h5>Are you sure to Revert Split Bill of Lading?</h5>
            </div>
            <div className="modal-footer">
              <button id="confirmRevertSplitBL" type="button" className="btn btn-primary" onClick={handleConfirmRevert}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Transfer To BR */}
      <div className="modal fade" id="TransferBRModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Transfer To</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <a className="btn btn-success mr-2" onClick={handleTransferBR}>Booking Reservation</a>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Voyage Delay Modal */}
      <div className="modal fade" id="VoyageDelayModal">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Voyage Delay</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                <table className="voyage-delay-table table table-bordered">
                  <thead>
                    <tr style={{ "textAlign": "center", "verticalAlign": "middle" }}>
                      <th width="20%">Voyage</th>
                      <th width="10%">Port</th>
                      <th width="20%">ETA</th>
                      <th width="20%">ETD</th>
                      <th width="10%">SCN</th>
                      <th width="20%">Closing Date Time</th>

                    </tr>
                  </thead>
                  <tbody className="voyage-delay-item">

                  </tbody>
                </table>
              </div>
              <h5 className="ml-4">Do you want to update the changes?</h5>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary mt-2 confirmCancelVoyageDelay" onClick={() => handleConfirmVoyageDelay("Confirm")}>Yes</button>
              <button type="button" className="btn btn-secondary confirmCancelVoyageDelay" onClick={() => handleConfirmVoyageDelay("Cancel")}>No</button>
            </div>

          </div>
        </div>
      </div>

      {/* Booking Reservation Transfer Modal */}
      <div className="modal fade" id="TransferToCROINVModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Transfer To</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <div className="form-check">
                  <input className="form-check-input CheckTransfer" type="radio" value="Invoice" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked={true} />
                  <label className="form-check-label" style={{ position: "relative", left: "15px" }} htmlFor="flexRadioDefault1">Invoice</label>
                </div>
                {props.barge?"":
                   <div className="form-check">
                   <input className="form-check-input CheckTransfer" type="radio" value="CRO" name="flexRadioDefault" id="flexRadioDefault2" />
                   <label className="form-check-label" style={{ position: "relative", left: "15px" }} htmlFor="flexRadioDefault2">Container Release Order</label>
                 </div>
               }
               
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary FormAllTransferTo" id="TransferAllTo" onClick={TransferAllBR}>Transfer All</button>
              <button type="button" className="btn btn-primary FormTransferPartialToInvoice" id="TransferToPartial" disabled="">Transfer Partial</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Invoice Transfer Modal */}
      <div className="modal fade" id="TransferToCNDNModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Transfer To</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="TransferID" />
              <button id="TranferToCN" type="button" className="btn btn-primary TransferToCN mr-2">Credit Note</button>
              <button id="TranferToDN" type="button" className="btn btn-primary TransferToDN">Debit Note</button>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="userCloneModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Clone</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Link to={newLink} state={{ formType: "Clone", id: props.id,type:"All" }}><button type="button" className={`btn btn-primary mr-2 userCloneModal`} title="Clone" >Clone All</button></Link>
              <Link to={newLink} state={{ formType: "Clone", id: props.id,type:"Company" }}><button type="button" className={`btn btn-primary mr-2 userCloneModal`} title="Clone" >Clone Company Details</button></Link>
            
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Invoice Transfer Modal */}
      <div className="modal fade" id="CheckingBillToModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Choose One Branch for Transfer Sales Invoice</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="checkingBillToList">
              </div>
            </div>
            <div className="modal-footer">
              <button id="TranferToCN" type="button" className="btn btn-primary confirmTransferFillterBillTo mr-2" onClick={confirmTransferFillterBillTo}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>





    </>
  )
}

export default UpdateButtonRow