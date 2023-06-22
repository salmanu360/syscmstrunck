
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, getAreaById,getPortDetails,GetCompaniesData } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormMiddleCard from '../../Components/CommonElement/QuickFormMiddleCard';
import FormContext from '../../Components/CommonElement/FormContext';
import QuickFormContainer from '../../Components/CommonElement/QuickFormContainer';
import { TransferToCreditNote,TransferToDebitNote, LoadPartialBCById } from '../../Components/Helper';
import QuickFormShippingInstruction from "../../Components/CommonElement/QuickFormShippingInstructionBarge";

function QuickForm(props) {
  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  const [Date, setDate] = useState("")
  const [containerTypeAndChargesDataPartial, setContainerTypeAndChargesDataPartial] = useState([])
  const [transferToPage, setTransferToPage] = useState("")
  const [TransferToPageName, setTransferToPageName] = useState("")


  if (globalContext.userRule !== "") {
    const objRule = JSON.parse(globalContext.userRule);
    var tempModel="sales-invoice"
    var filteredAp = objRule.Rules.filter(function (item) {
      return item.includes("sales-invoice") || item.includes("sales-debit-note") || item.includes("sales-credit-note");
    });
  }



  function confirmTransferTo(type){
    
    if(type == "BookingConfirmation"){
      var array = [];
      var arrayCheckingBillTo = []
      $(".checkboxCharges:checked").each(function () {
        if(props.barge){
          var chargesIndex=$(this).parent().parent().parent().index()
        }else{
          var chargesIndex=$(this).parent().parent().parent().parent().index()
        }

       
        var ContainerIndex=$(this).parent().parent().parent().parent().closest(".ChargesTable").prev().index()
   
         chargesIndex=chargesIndex==0?chargesIndex:(chargesIndex/2)
         ContainerIndex=ContainerIndex==0?ContainerIndex:(ContainerIndex/2)
   
         var closestContainerArrayList=$(this).parent().parent().parent().parent().closest(".ChargesTable").prev().find(".containerArrayList").val()
         if(closestContainerArrayList!==""){
           $.each(closestContainerArrayList.split(','), function (key, value) {
             var ChargesCode = $(`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][BookingConfirmationChargesUUID]']`).val()
             var Charges = {
              CustomerType: $(`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][CustomerType]']`).val(),
              BillTo: $(`input[name='BookingConfirmationHasContainerType[${ContainerIndex}][BookingConfirmationCharges][${chargesIndex}][BillTo]']`).val()
             }
             array.push(ChargesCode);
             arrayCheckingBillTo.push(Charges)
          })
         }
         
      });
  
      var uniqueArray = arrayCheckingBillTo.filter((obj, index, self) => {
        return index === self.findIndex(t => (
            t.CustomerType === obj.CustomerType && t.BillTo === obj.BillTo
        ));
      });
      
      if(uniqueArray.length >1){
        alert("Selected Charges must correspond with All the Bill To Type and the Branch of the Bill To Company")
      }else{
        if(type == "BookingConfirmation"){
          var BC = $("input[name='DynamicModel[BC]']").val()
          window.$("#TransferFromBCModal").modal("toggle")
          window.$("#TransferToSalesInvoiceModal").modal("toggle")
          if(props.barge){
            props.navigate("/sales/standard/sales-invoice-barge/transfer-from-booking-reservation-data/id=" + BC, { state: { formType: "TransferFromBooking", id: BC, CustomerType:uniqueArray[0]["CustomerType"], BranchCode:uniqueArray[0]["BillTo"],ChargesID:array} })
          }else{
            props.navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id=" + BC, { state: { formType: "TransferFromBooking", id: BC, CustomerType:uniqueArray[0]["CustomerType"], BranchCode:uniqueArray[0]["BillTo"],ChargesID:array} })
          }
         
        }
      }
    }
    else{

      window.$("#TransferToCNDNModal").modal("toggle")
      var array = [];
      var catchContainerEmpty = false;
      $(".checkboxCharges:checked").each(function () {
  
        if(props.barge){
          var chargesIndex=$(this).parent().parent().parent().index()
        }else{
          var chargesIndex=$(this).parent().parent().parent().parent().index()
        }
        
        var ContainerIndex=$(this).parent().parent().parent().parent().closest(".ChargesTable").prev().index()
        
        var ContainerType= $(this).parent().parent().parent().parent().closest(".ChargesTable").prev().find(".ContainerType").children().last().val()
        var Charges = $(this).closest(".insidecharges-item").find(".ParentChargesCode").children().last().val()

         chargesIndex=chargesIndex==0?chargesIndex:(chargesIndex/2)
         ContainerIndex=ContainerIndex==0?ContainerIndex:(ContainerIndex/2)
         var closestContainerArrayList=$(this).parent().parent().parent().parent().closest(".ChargesTable").prev().find(".containerArrayList").val()
         
         if (props.barge) {
          var ArrayInside = {
            "ContainerType":"",
            "ContainerCode":"",
            "ChargesCode": Charges,
          }
          array.push(ArrayInside);
      
        }else{
          if(closestContainerArrayList!==""){
            $.each(closestContainerArrayList.split(','), function (key, value) {
              var ArrayInside = {
                  "ContainerType":ContainerType,
                  "ContainerCode": value,
                  "ChargesCode":  Charges,
              }
              array.push(ArrayInside);
          })
          }
        }

   
         
      });
      window.$("#TransferPartialToCNDNModal").modal("toggle")

      if(type == "CreditNote"){
        if (props.barge) {
          props.navigate("/sales/standard/credit-note-barge/transfer-from-sales-invoice/id=" + formContext.formState.id, { state: { formType: "TransferFromINV", id: formContext.formState.id, tempArray:array,transferFromModel:"sales-invoice"} })
        }else{
          props.navigate("/sales/container/credit-note/transfer-from-sales-invoice/id=" + formContext.formState.id, { state: { formType: "TransferFromINV", id: formContext.formState.id, tempArray:array,transferFromModel:"sales-invoice"} })
        }
       
      }else{
        if (props.barge) {
          props.navigate("/sales/standard/debit-note-barge/transfer-from-sales-invoice/id=" + formContext.formState.id, { state: { formType: "TransferFromINV", id: formContext.formState.id, tempArray:array,transferFromModel:"sales-invoice"} })
        }else{
          props.navigate("/sales/container/debit-note/transfer-from-sales-invoice/id=" + formContext.formState.id, { state: { formType: "TransferFromINV", id: formContext.formState.id, tempArray:array,transferFromModel:"sales-invoice"} })
        }
       
      }
    }
  }

  window.$("#TransferPartialToCNDNModal").off("hidden.bs.modal").on('hidden.bs.modal', function () {
    setTransferToPageName("")
  })


  function getContainerCodeByContainerType(val){
  }
  function getCOCCompany(val, index) {
  }
  function getBoxOperatorBranchByBoxOperatorCompany(val){
  }
  function onChangeUNNumber(val){
  }
  function getBoxOperatorBranchName(val){
  }

  function loadCompanyOptions(inputValue){
    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {
    auth: {
        username: globalContext.authInfo.username,
        password: globalContext.authInfo.access_token,
    },
    }).then(res => res.data.data)
    return response
  }

  const loadUNNumberOptions = (inputValue) => {

    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "u-n-number/get-u-n-number-by-u-n-number?term=" + inputValue +"&_type=query&q="+inputValue, {

        auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
        },
    }).then(res => res.data.data)

    return response

  }

  const loadHSCodeOptions = (inputValue) => {

    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "h-s-code/get-h-s-code-by-heading?q=" + inputValue, {

        auth: {
            username: globalContext.authInfo.username,
            password: globalContext.authInfo.access_token,
        },
    }).then(res => res.data.data)

    return response

  }

  $(".TransferToCN").off("click").on("click", function(){
    if(filteredAp.includes(`transferto-${tempModel}`) && filteredAp.includes(`create-sales-credit-note`)){
      if (formContext.verificationStatus == "Approved") {
        setTransferToPage("CN")
        setTransferToPageName("SalesCreditNote")
        window.$("#TransferPartialToCNDNModal").modal("toggle")
        TransferToCreditNote(formContext.formState.id, globalContext,props.barge?"barge":"normal").then(res => {
          var tempData=res.data.SalesInvoiceHasContainerType
          $.each(tempData,function(key,value){
            var ArrayContainer=[]
            var ArrayContainer2=[]
            if(value.SalesInvoiceHasContainer.length>0){
              $.each(value.SalesInvoiceHasContainer,function(key2,value2){
                if(value2.ContainerCode){
                  ArrayContainer.push({ContainerUUID:value2.containerCode.ContainerUUID,ContainerCode:value2.containerCode.ContainerCode,SealNum:""})
                  ArrayContainer2.push(value2.containerCode.ContainerUUID)
                }
            
              })
            }
            value.ContainerCode=ArrayContainer
            value.ContainerArray=ArrayContainer2.join(',')
          })
          setContainerTypeAndChargesDataPartial(tempData)
        })
      }
    }else{
      alert("You are not allowed to transfer to Credit Note, Please check your Permission.")
    }
  
  })

  $(".TransferToDN").off("click").on("click", function(){

    if(filteredAp.includes(`transferto-${tempModel}`) && filteredAp.includes(`create-sales-debit-note`)){
      if (formContext.verificationStatus == "Approved") {
        setTransferToPage("DN")
        setTransferToPageName("SalesDebitNote")
        window.$("#TransferPartialToCNDNModal").modal("toggle")
    
        TransferToDebitNote(formContext.formState.id, globalContext,props.barge?"barge":"normal").then(res => {
          var tempData=res.data.SalesInvoiceHasContainerType
          $.each(tempData,function(key,value){
            var ArrayContainer=[]
            var ArrayContainer2=[]
            if(value.SalesInvoiceHasContainer.length>0){
              $.each(value.SalesInvoiceHasContainer,function(key2,value2){
                if(value2.ContainerCode){
                  ArrayContainer.push({ContainerUUID:value2.containerCode.ContainerUUID,ContainerCode:value2.containerCode.ContainerCode,SealNum:""})
                  ArrayContainer2.push(value2.containerCode.ContainerUUID)
                }
              })
            }
            value.ContainerCode=ArrayContainer
            value.ContainerArray=ArrayContainer2.join(',')
          })
          setContainerTypeAndChargesDataPartial(tempData)
        })
      }
    }else{
      alert("You are not allowed to transfer to Debit Note, Please check your Permission.")
    }
   
  })

  $("#TransferPartialFrom").off("click").on("click", function(){
    if(filteredAp.includes(`transferfrom-${tempModel}`) && filteredAp.includes(`create-${tempModel}`)){
      window.$("#TransferToSalesInvoiceModal").modal("toggle")
      var BC = window.$("input[name='DynamicModel[BC]']").val()
      LoadPartialBCById(BC, globalContext).then(res => {
        var tempData=res.data.BookingConfirmationHasContainerType
        $.each(tempData,function(key,value){
          var ArrayContainer=[]
          var ArrayContainer2=[]  
          if(value.bookingConfirmationContainer.length>0){
            $.each(value.bookingConfirmationContainer,function(key2,value2){
                ArrayContainer.push({ContainerUUID:value2.containerCode.ContainerUUID,ContainerCode:value2.containerCode.ContainerCode,SealNum:""})
                ArrayContainer2.push(value2.containerCode.ContainerUUID)
            })
          }
          value.ContainerCode=ArrayContainer
          value.ContainerArray=ArrayContainer2.join(',')
        })
        setContainerTypeAndChargesDataPartial(tempData)
      })
    }else{
      alert("You are not allowed to transfer from Booking Reservation, Please check your Permission.")
    }
 
    
  })

  useEffect(() => {
    if (props.middleCardData) {
      if (props.middleCardData.ROC) {
        props.setValue("DynamicModel[BillToCompany]", props.middleCardData.rOC.CompanyName + "(" + props.middleCardData.rOC.ROC + ")")
        props.setValue("DynamicModel[BillToBranchTel]", props.middleCardData.BranchTel)
        props.setValue("DynamicModel[BillToBranchEmail]", props.middleCardData.BranchEmail)
        props.setValue("DynamicModel[AttentionName]", props.middleCardData.AttentionName)
        props.setValue("DynamicModel[AttentionTel]", props.middleCardData.AttentionTel)
        props.setValue("DynamicModel[AttentionEmail]", props.middleCardData.AttentionEmail)
        props.setValue("DynamicModel[CustomerType]", props.middleCardData.CustomerType)
        // props.setValue("InvoiceNo",props.invList)
      }

      if(formContext.formState.formType !== "TransferFromBooking"){
        if(formContext.formState.formType=="Clone"){
          setDate(formContext.docDate)
        }else{
          setDate(props.middleCardData.DocDate)
        }
     
      
      }
      props.trigger()
    }

    return () => {
    }
  }, [props.middleCardData])

  

  useEffect(() => {
    if(formContext.verificationStatus =="Approved"){
      $(".TransferToCN").prop("disabled",false)
      $(".TransferToDN").prop("disabled",false)
    }else{
      $(".TransferToCN").prop("disabled",true)
      $(".TransferToDN").prop("disabled",true)
    }
    // TransferToCN
    // TransferToDN
  
    return () => {
    }
  }, [formContext.verificationStatus])

  useEffect(() => {
    setDate(formContext.docDate)
  
    return () => {
    }
  }, [formContext.docDate])

  const quotaitonTypeOptions = [
    {
      value : 'Advance Booking',
      label : 'Advance Booking',
    },
    {
      value : 'Empty',
      label : 'Empty',
    },
    {
      value : 'Feeder',
      label : 'Feeder',
    },
    {
      value : 'Joint Service',
      label : 'Joint Service',
    },
    {
      value : 'Normal',
      label : 'Normal',
    },
    {
      value : 'One-Off',
      label : 'One-Off',
    },
    {
      value : 'Purchase Slot',
      label : 'Purchase Slot',
    }] 

    const OwnershipType = [
      {
        value : 'COC',
        label : 'COC',
      },
      {
        value : 'SOC',
        label : 'SOC',
      }
    ]

  var DocumentItem ={
    formName:"SalesInvoice",
    cardLength: props.modelLink == "sales-invoice-barge" ? "col-md-4" : "col-md-12",
    element : [
      {title:"INV No.", id:"dynamicmodel-docnum", className:"", name:"SalesInvoice[DocNum]", dataTarget:"DocNum", gridSize:"col-xs-12 col-md-2", type:"input-text", onChange:"", specialFeature:["readonly"]},
      {title:"Document Date", id:"dynamicmodel-docdate", className:"docDate flatpickr-input", name:"SalesInvoice[DocDate]", dataTarget:"DocDate", value:Date, gridSize:"col-xs-12 col-md-2", type:"flatpickr-input", onChange:"", specialFeature:['required']},
      {title:"Sales Person", id:"salesinvoice-salesperson-quickform", className:"sales_person", name:"SalesInvoice[SalesPerson]", dataTarget:"SalesPerson", gridSize:"col-xs-12 col-md-2", type:"dropdown", option:props.user, onChange:"", specialFeature:['required']},
      {title:"Currency", id:"salesinvoice-currency", className:"currency", name:"SalesInvoice[Currency]", dataTarget:"Currency", gridSize:"col-xs-12 col-md-2", type:"dropdown",option:props.currency, defaultValue: formContext.defaultCurrency, onChange:"", specialFeature:['required']},
      {title:"Currency Rate", id:"salesinvoice-currencyexchangerate", className:"currencyexchangerate inputDecimalTwoPlaces", name:"SalesInvoice[CurrencyExchangeRate]", gridSize:"col-xs-12 col-md-2", type:"input-text", defaultValue:"1.00", onChange:"", specialFeature:[]},
      {title:"Nomination", id:"salesinvoice-nomination", className:"", name:"SalesInvoice[Nomination]", dataTarget:"Nomination", gridSize:"col-xs-12 col-md-2", type:"dropdown", option:props.port, onChange:"", specialFeature:[]},
      {title:"Document Description", id:"salesinvoice-docdesc", className:"", name:"SalesInvoice[DocDesc]", dataTarget:"DocDesc", gridSize:"col-xs-12 col-md-12", type:"textarea", maxlength:"500", onChange:"", specialFeature:[]},
    ]
  }

  var DocumentItemBarge ={
    formName:"SalesInvoice",
    cardLength: props.modelLink == "sales-invoice-barge" ? "col-md-4" : "col-md-12",
    element : [
      {title:"INV No.", id:"dynamicmodel-docnum", className:"", name:"DynamicModel[DocNum]", dataTarget:"DocNum", gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readonly"]},
      {title:"Document Date", id:"dynamicmodel-docdate", className:"docDate flatpickr-input", name:"DynamicModel[DocDate]", dataTarget:"DocDate", value:Date, gridSize:"col-xs-12 col-md-6", type:"flatpickr-input", onChange:"", specialFeature:['required']},
      {title:"Sales Person", id:"dynamicmodel-salesperson-quickform", className:"sales_person", name:"DynamicModel[SalesPerson]", dataTarget:"SalesPerson", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.user, onChange:"", specialFeature:['required']},
      {title:"Currency", id:"dynamicmodel-currency", className:"currency", name:"DynamicModel[Currency]", dataTarget:"Currency", gridSize:"col-xs-12 col-md-6", type:"dropdown",option:props.currency, defaultValue: formContext.defaultCurrency, onChange:"", specialFeature:['required']},
      {title:"Currency Rate", id:"dynamicmodel-currencyexchangerate", className:"currencyexchangerate inputDecimalTwoPlaces", name:"DynamicModel[CurrencyExchangeRate]", gridSize:"col-xs-12 col-md-6", type:"input-text", defaultValue:"1.00", onChange:"", specialFeature:[]},
      {title:"Nomination", id:"dynamicmodel-nomination", className:"", name:"DynamicModel[Nomination]", dataTarget:"Nomination", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.port, onChange:"", specialFeature:[]},

    ]
  }
  // var ShippingInstructionItem ={
  //   formName:"SalesInvoice",
  //   cardLength:"col-md-8",
  // }

  var ShippingInstructionItem = {
    formName: "SalesInvoice",
    cardLength: "col-md-8",
    element: [
   
      { title: "POL Port Code", id: "dynamicmode-polportcode", className: "polportCode readOnlySelect bargeRelatedField", name: "DynamicModel[POLPortCode]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: props.port, onChange: "", specialFeature: [] },
      { title: "POL Port Term", id: "dynamicmode-polportterm", className: "polPortTerm readOnlySelect bargeRelatedField", name: "DynamicModel[POLPortTerm]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: formContext.portTerm, onChange: "", specialFeature: [] },
      { title: "Barge Code", id: "dynamicmode-bargecode", className: "bargeCode readOnlySelect bargeRelatedField", name: "DynamicModel[BargeCode]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: props.bargeCode, onChange: "", specialFeature: [] },
      { title: "Barge Name", id: "dynamicmode-bargename", className: "bargeName", name: "DynamicModel[BargeName]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "input-text", specialFeature: ["readonly"] },
      { title: "POD Port Code", id: "dynamicmode-podportcode", className: "podPortCode readOnlySelect bargeRelatedField", name: "DynamicModel[PODPortCode]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: props.port, onChange: "", specialFeature: [] },
      { title: "POD Port Term", id: "dynamicmode-podportterm", className: "podPortTerm readOnlySelect bargeRelatedField", name: "DynamicModel[PODPortTerm]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: formContext.portTerm, onChange: "", specialFeature: [] },
      { title: "Voyage Num", id: "dynamicmode-voyagenum", className: "voyageNum readOnlySelect bargeRelatedField", name: "DynamicModel[VoyageNum]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: [], onChange: "", specialFeature: [] },
      { title: "Vessel Code", id: "dynamicmode-vesselcode", className: "vesselCode", name: "DynamicModel[VesselCode]", defaultValue: "", dataTarget: "", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: ["readonly"] },

    ]
  }


  var MiddleCardItem = {
    formName: "SalesInvoice",
    cardLength: "col-md-12",
    cardTitle: "Bill To",
    element: [
      { title: "Customer Type", className: "", name: "DynamicModel[CustomerType]", gridSize: "col-xs-12 col-md-2", type: "dropdown", onChange: "", dataTarget: "CustomerType", defaultValue: "Others", option: props.customerType },
      { title: "Bill To", id: "CompanyROC-BillTo-Quickform", className: "dropdownInputCompany", name: "DynamicModel[BillToCompany]", dataTarget: "CompanyROC-BillTo", gridSize: "col-xs-12 col-md-4", type: "input-dropdownInputCompany", onChange: "", specialFeature: ["required"] },
      { title: "Branch Tel", id: "salesinvoicebillto-quickform-branchtel", className: "branchtelbillto", name: "DynamicModel[BillToBranchTel]", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [], dataTarget: "BranchTel-BillTo" },
      { title: "Branch Email", id: "salesinvoicebillto-quickform-branchemail", className: "branchemailbillto", name: "DynamicModel[BillToBranchEmail]", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [], dataTarget: "BranchEmail-BillTo" },
      { title: "Attention Name", id: "AttentionName-BillTo-QuickForm", className: "attentionnamebillto", name: "DynamicModel[AttentionName]", dataTarget: "AttentionName-BillTo", gridSize: "col-xs-12 col-md-6", type: "input-text-withModal", onChange: "", specialFeature: [] },
      { title: "Attention Tel", id: "AttentionTel-BillTo-QuickForm", className: "attentiontelbillto", name: "DynamicModel[AttentionTel]", dataTarget: "AttentionTel-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [] },
      { title: "Attention Email", id: "AttentionEmail-BillTo-QuickForm", className: "attentionemailbillto", name: "DynamicModel[AttentionEmail]", dataTarget: "AttentionEmail-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [] },
    ]
  }

  var ContainerItem = {
    formName:"SalesInvoice",
    cardLength:"col-md-12",
    type: "Container",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options:props.containerType, class: "", onChange: getContainerCodeByContainerType, requiredField: true },
      { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "OwnershipType", fieldClass: "BoxOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
      { columnName: "QTY", inputType: "number", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", min:"0", class: "", onChange:""},
      { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange:""},
      { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange:getBoxOperatorBranchByBoxOperatorCompany, loadOption:loadCompanyOptions, optionLabel:"CompanyName", optionValue:"CompanyUUID"},
      { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad", class: "", onChange:"", readOnly: true},
      { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Length", inputType: "input", defaultChecked: true, name: "Length", fieldClass: "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Width", inputType: "input", defaultChecked: true, name: "Width", fieldClass: "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Height", inputType: "input", defaultChecked: true, name: "Height", fieldClass: "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Tues", inputType: "number", defaultChecked: true, name: "Tues", fieldClass: "cal Tues decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature", class: "", onChange:"", readOnly: true },
      { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange:onChangeUNNumber, loadOption:loadUNNumberOptions, optionLabel:"UNNumber", optionValue:"UNNumberUUID"},
      { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange:""},
      { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class:"d-none", onChange:"", loadOption:loadHSCodeOptions, optionLabel:"Heading", optionValue:"HSCodeUUID"},
      { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class:"d-none", onChange:""},
      { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class:"d-none", onChange:getBoxOperatorBranchName},
      { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName", class:"d-none", onChange:"", readOnly: true},
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class:"d-none", modelClass:"TextMarks"},
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class:"d-none", modelClass:"TextGoods"},
      { columnName: "Total Disc", inputType: "input", defaultChecked: false, name: "TotalDiscount", fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount", class:"d-none", readOnly: true},
      { columnName: "Total Tax", inputType: "input", defaultChecked: false, name: "TotalTax", fieldClass: "inputDecimalTwoPlaces ContainerTotalTax", class:"d-none", readOnly: true},
      { columnName: "Total Amount", inputType: "input", defaultChecked: false, name: "Total", fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount", class:"d-none", readOnly: true},
    ]
  }

  var ContainerItemTransferPartial = {
    formName:"SalesInvoice",
    cardLength:"col-md-12",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options:props.containerType, class: "", onChange: getContainerCodeByContainerType, requiredField: true },
      { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "OwnershipType", fieldClass: "BoxOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
      { columnName: "QTY", inputType: "number", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", min:"0", class: "", onChange:""},
      { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange:""},
      { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange:getBoxOperatorBranchByBoxOperatorCompany, loadOption:loadCompanyOptions, optionLabel:"CompanyName", optionValue:"CompanyUUID"},
      { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad", class: "", onChange:"", readOnly: true},
      { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Length", inputType: "input", defaultChecked: true, name: "Length", fieldClass: "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Width", inputType: "input", defaultChecked: true, name: "Width", fieldClass: "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Height", inputType: "input", defaultChecked: true, name: "Height", fieldClass: "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Tues", inputType: "number", defaultChecked: true, name: "Tues", fieldClass: "cal Tues decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature", class: "", onChange:"", readOnly: true },
      { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange:onChangeUNNumber, loadOption:loadUNNumberOptions, optionLabel:"UNNumber", optionValue:"UNNumberUUID"},
      { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange:""},
      { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class:"d-none", onChange:"", loadOption:loadHSCodeOptions, optionLabel:"Heading", optionValue:"HSCodeUUID"},
      { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class:"d-none", onChange:""},
      { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class:"d-none", onChange:getBoxOperatorBranchName},
      { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName", class:"d-none", onChange:"", readOnly: true},
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class:"d-none", modelClass:"TextMarks"},
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class:"d-none", modelClass:"TextGoods"},
      { columnName: "Total Disc", inputType: "input", defaultChecked: false, name: "TotalDiscount", fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount", class:"d-none", readOnly: true},
      { columnName: "Total Tax", inputType: "input", defaultChecked: false, name: "TotalTax", fieldClass: "inputDecimalTwoPlaces ContainerTotalTax", class:"d-none", readOnly: true},
      { columnName: "Total Amount", inputType: "input", defaultChecked: false, name: "Total", fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount", class:"d-none", readOnly: true},
    ]
  }

  var ContainerItemTransferPartialBC = {
    formName:"BookingConfirmation",
    cardLength:"col-md-12",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options:props.containerType, class: "", onChange: getContainerCodeByContainerType, requiredField: true },
      { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "OwnershipType", fieldClass: "BoxOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
      { columnName: "QTY", inputType: "number", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", min:"0", class: "", onChange:""},
      { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange:""},
      { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange:getBoxOperatorBranchByBoxOperatorCompany, loadOption:loadCompanyOptions, optionLabel:"CompanyName", optionValue:"CompanyUUID"},
      { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad", class: "", onChange:"", readOnly: true},
      { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Length", inputType: "input", defaultChecked: true, name: "Length", fieldClass: "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Width", inputType: "input", defaultChecked: true, name: "Width", fieldClass: "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Height", inputType: "input", defaultChecked: true, name: "Height", fieldClass: "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Tues", inputType: "number", defaultChecked: true, name: "Tues", fieldClass: "cal Tues decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature", class: "", onChange:"", readOnly: true },
      { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange:onChangeUNNumber, loadOption:loadUNNumberOptions, optionLabel:"UNNumber", optionValue:"UNNumberUUID"},
      { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange:""},
      { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class:"d-none", onChange:"", loadOption:loadHSCodeOptions, optionLabel:"Heading", optionValue:"HSCodeUUID"},
      { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class:"d-none", onChange:""},
      { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class:"d-none", onChange:getBoxOperatorBranchName},
      { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName", class:"d-none", onChange:"", readOnly: true},
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class:"d-none", modelClass:"TextMarks"},
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class:"d-none", modelClass:"TextGoods"},
      { columnName: "Total Disc", inputType: "input", defaultChecked: false, name: "TotalDiscount", fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount", class:"d-none", readOnly: true},
      { columnName: "Total Tax", inputType: "input", defaultChecked: false, name: "TotalTax", fieldClass: "inputDecimalTwoPlaces ContainerTotalTax", class:"d-none", readOnly: true},
      { columnName: "Total Amount", inputType: "input", defaultChecked: false, name: "Total", fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount", class:"d-none", readOnly: true},
    ]
  }

  var ContainerItemBarge = {
    formName: "SalesInvoice",
    cardLength: "col-md-12",
    cardTitle: "Charges",
    type: "Standard",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options:props.containerType, class: "", onChange: getContainerCodeByContainerType, requiredField: true },
      { columnName: "Ownership Type", inputType: "single-select", defaultChecked: true, name: "OwnershipType", fieldClass: "BoxOwnership RequiredFieldAddClass", options: OwnershipType, class: "", onChange: getCOCCompany, requiredField: true },
      { columnName: "QTY", inputType: "number", defaultChecked: true, name: "Qty", fieldClass: "Qty cal ParentQty isOverflow", min:"0", class: "", onChange:""},
      { columnName: "Empty", inputType: "checkbox", defaultChecked: true, name: "Empty", fieldClass: "Empty", class: "", onChange:""},
      { columnName: "Box Op Code", inputType: "single-asyncSelect", defaultChecked: false, name: "BoxOperator", fieldClass: "BoxOpCo Box_OpCompany remoteBoxOperatorCompany", class: "d-none", onChange:getBoxOperatorBranchByBoxOperatorCompany, loadOption:loadCompanyOptions, optionLabel:"CompanyName", optionValue:"CompanyUUID"},
      { columnName: "Box Op Co", inputType: "input", defaultChecked: true, name: "BoxOperatorName", fieldClass: "BoxOPCoLoad", class: "", onChange:"", readOnly: true},
      { columnName: "M3(m)", inputType: "input", defaultChecked: true, name: "M3", fieldClass: "cal M3 inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "N.KG", inputType: "input", defaultChecked: true, name: "NetWeight", fieldClass: "cal NetWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "G.KG", inputType: "input", defaultChecked: true, name: "GrossWeight", fieldClass: "cal GrossWeight inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Length", inputType: "input", defaultChecked: true, name: "Length", fieldClass: "cal Length inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Width", inputType: "input", defaultChecked: true, name: "Width", fieldClass: "cal Width inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Height", inputType: "input", defaultChecked: true, name: "Height", fieldClass: "cal Height inputDecimalId inputDecimalThreePlaces decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Tues", inputType: "number", defaultChecked: true, name: "Tues", fieldClass: "cal Tues decimalDynamicForm", class: "", onChange:"" },
      { columnName: "Temp(°C)", inputType: "input", defaultChecked: true, name: "Temperature", fieldClass: "inputDecimalTwoPlaces decimalDynamicForm ReadTemperature", class: "", onChange:"", readOnly: true },
      { columnName: "UN Number", inputType: "single-asyncSelect", defaultChecked: true, name: "UNNumber", fieldClass: "UNNumber UN_Number", class: "", onChange:onChangeUNNumber, loadOption:loadUNNumberOptions, optionLabel:"UNNumber", optionValue:"UNNumberUUID"},
      { columnName: "DG Class", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass DG_Class", class: "", onChange:""},
      { columnName: "HS Code", inputType: "single-asyncSelect", defaultChecked: false, name: "HSCode", fieldClass: "HS_Code", class:"d-none", onChange:"", loadOption:loadHSCodeOptions, optionLabel:"Heading", optionValue:"HSCodeUUID"},
      { columnName: "Commodity", inputType: "input", defaultChecked: false, name: "Commodity", fieldClass: "Commodity", class:"d-none", onChange:""},
      { columnName: "Box Op Branch Code", inputType: "single-select", defaultChecked: false, name: "BoxOperatorBranch", fieldClass: "BoxOpBranch", class:"d-none", onChange:getBoxOperatorBranchName},
      { columnName: "Box Op Branch Name", inputType: "input", defaultChecked: false, name: "BoxOperatorBranchName", fieldClass: "BoxOperatorBranchName", class:"d-none", onChange:"", readOnly: true},
      { columnName: "Mark", inputType: "input-Modal", defaultChecked: false, name: "Mark", fieldClass: "MarkReadonly", class:"d-none", modelClass:"TextMarks"},
      { columnName: "Goods Description", inputType: "input-Modal", defaultChecked: false, name: "GoodsDescription", fieldClass: "GoodDescriptionReadonly", class:"d-none", modelClass:"TextGoods"},
      { columnName: "Total Disc", inputType: "input", defaultChecked: false, name: "TotalDiscount", fieldClass: "inputDecimalTwoPlaces ContainerTotalDiscount", class:"d-none", readOnly: true},
      { columnName: "Total Tax", inputType: "input", defaultChecked: false, name: "TotalTax", fieldClass: "inputDecimalTwoPlaces ContainerTotalTax", class:"d-none", readOnly: true},
      { columnName: "Total Amount", inputType: "input", defaultChecked: false, name: "Total", fieldClass: "inputDecimalTwoPlaces ContainerTotalAmount", class:"d-none", readOnly: true},
    ]
  }
  
  return (
		<>
			<div className='QuickForm'>
				<div className='row'>
					<QuickFormDocument
						register={props.register}
						control={props.control}
						errors={props.errors}
						setValue={props.setValue}
						DocumentItem={
							props.modelLink == "sales-invoice-barge"
								? DocumentItemBarge
								: DocumentItem
						}
					/>
					{props.modelLink == "sales-invoice-barge" ? (
						<QuickFormShippingInstruction
							trigger={props.trigger}
							register={props.register}
							control={props.control}
							errors={props.errors}
							setValue={props.setValue}
							getValues={props.getValues}
							ShippingInstructionItem={ShippingInstructionItem}
							port={props.port}
						/>
					) : (
						""
					)}

					<QuickFormMiddleCard
						model={props.modelLink}
						register={props.register}
						control={props.control}
						errors={props.errors}
						getValues={props.getValues}
						setValue={props.setValue}
						trigger={props.trigger}
						MiddleCardItem={MiddleCardItem}
					/>
					<QuickFormContainer
						barge={props.modelLink == "sales-invoice-barge" ? true : false}
						register={props.register}
						control={props.control}
						errors={props.errors}
						setValue={props.setValue}
						getValues={props.getValues}
						ContainerItem={ContainerItem}
						containerType={props.containerType}
						port={props.port}
						freightTerm={props.freightTerm}
						taxCode={props.taxCode}
						currency={props.currency}
						cargoType={props.cargoType}
						containerTypeAndChargesData={props.containerTypeAndChargesData}
						documentData={props.documentData}
						setContainerTypeAndChargesData={
							props.setContainerTypeAndChargesData
						}
					/>
				</div>
			</div>

			{formContext.formState.formType == "Update" &&
				formContext.verificationStatus == "Approved" && (
					<>
						<div
							className='modal fade'
							id='TransferPartialToCNDNModal'
							tabIndex='-1'
							role='dialog'
							aria-labelledby='exampleModalLabel'
							aria-hidden='true'>
							<div className='modal-dialog modal-xl' role='document'>
								<div className='modal-content'>
									<div className='modal-header'>
										<h5 className='modal-title' id='exampleModalLabel'>
											Transfer To{" "}
											{transferToPage == "CN" ? "Credit Note" : "Debit Note"}
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
										<QuickFormContainer
											barge={
												props.modelLink == "sales-invoice-barge" ? true : false
											}
											transferPartial={TransferToPageName}
											register={props.register}
											control={props.control}
											errors={props.errors}
											setValue={props.setValue}
											getValues={props.getValues}
											ContainerItem={ContainerItemTransferPartial}
											ownershipType={OwnershipType}
											containerType={props.containerType}
											port={props.port}
											freightTerm={props.freightTerm}
											taxCode={props.taxCode}
											currency={props.currency}
											cargoType={props.cargoType}
											containerTypeAndChargesData={
												containerTypeAndChargesDataPartial
											}
											documentData={props.documentData}
										/>
									</div>
									<div className='modal-footer'>
										<button
											type='button'
											className='btn btn-primary mb-1'
											id='comfirmTransferTO'
											onClick={() =>
												confirmTransferTo(
													transferToPage == "CN" ? "CreditNote" : "DebitNote"
												)
											}>
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
					</>
				)}

			{(formContext.formState.formType == "New" ||
				formContext.formState.formType == "TransferFromBooking") && (
				<div
					className='modal fade'
					id='TransferToSalesInvoiceModal'
					tabIndex='-1'
					role='dialog'
					aria-labelledby='exampleModalLabel'
					aria-hidden='true'>
					<div className='modal-dialog modal-xl' role='document'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title' id='exampleModalLabel'>
									Transfer To Sales Invoice
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
								<QuickFormContainer
									barge={
										props.modelLink == "sales-invoice-barge" ? true : false
									}
									transferPartial={"BookingConfirmation"}
									register={props.register}
									control={props.control}
									errors={props.errors}
									setValue={props.setValue}
									getValues={props.getValues}
									ContainerItem={ContainerItemTransferPartialBC}
									ownershipType={OwnershipType}
									containerType={props.containerType}
									port={props.port}
									freightTerm={props.freightTerm}
									taxCode={props.taxCode}
									currency={props.currency}
									cargoType={props.cargoType}
									containerTypeAndChargesData={
										containerTypeAndChargesDataPartial
									}
									documentData={props.documentData}
								/>
							</div>
							<div className='modal-footer'>
								<button
									type='button'
									className='btn btn-primary mb-1'
									id='comfirmTransferTO'
									onClick={() => confirmTransferTo("BookingConfirmation")}>
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
			)}
		</>
	);
}

export default QuickForm