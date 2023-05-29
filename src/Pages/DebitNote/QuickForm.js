
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, getAreaById, getPortDetails, GetCNDNTransferFromSalesInvoice, TransferToDebitNote,GetCompaniesData } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormMiddleCard from '../../Components/CommonElement/QuickFormMiddleCard';
import FormContext from '../../Components/CommonElement/FormContext';
import QuickFormContainer from './QuickFormContainer';
import QuickFormShippingInstruction from "../../Components/CommonElement/QuickFormShippingInstructionBarge";
import QuickFormContainerTransfer from '../../Components/CommonElement/QuickFormContainer';

function QuickForm(props) {

  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  const [Date, setDate] = useState("")
  const [checkLoadAllOptionFlag, setCheckLoadAllOptionFlag] = useState(props.loadAllOption)

  const [containerTypeAndChargesData, setContainerTypeAndChargesData] = useState([])

  const [transferPartialData, setTransferPartialData] = useState()

  useEffect(() => {
    setDate(formContext.docDate)

    return () => {
    }
  }, [formContext.docDate])

  useEffect(() => {
    if (props.containerType.length > 0) {
      setCheckLoadAllOptionFlag(true)

    }
    return () => {

    }
  }, [props.containerType])



  const TransferDocType = [
    {
      value: 'INV',
      label: 'INV',
    },

  ]
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


  function handleTransferFrom(val, index) {
    var modelLinkTemp="sales-debit-note"

    if (globalContext.userRule !== "") {
      const objRule = JSON.parse(globalContext.userRule);
      var filteredAp = objRule.Rules.filter(function (item) {
        return item.includes(modelLinkTemp);
      });
      if(filteredAp.find((item) => item == `transfer-${modelLinkTemp}`) !== undefined ){
        if (val) {
          window.$("#TransferToDebitNoteModal").modal("toggle")
          TransferToDebitNote(val.value, globalContext).then(res => {
            var tempData = res.data.SalesInvoiceHasContainerType.map(obj => ({ ...obj }));
            $.each(tempData, function (key, value) {
              var ArrayContainer = []
              var ArrayContainer2 = []
              if (value.SalesInvoiceHasContainer.length > 0) {
                $.each(value.SalesInvoiceHasContainer, function (key2, value2) {
                  if (value2.ContainerCode) {
                    ArrayContainer.push({ ContainerUUID: value2.containerCode.ContainerUUID, ContainerCode: value2.containerCode.ContainerCode, SealNum: "" })
                    ArrayContainer2.push(value2.containerCode.ContainerUUID)
                  }
                 
                })
              }
              value.ContainerCode = ArrayContainer
              value.ContainerArray = ArrayContainer2.join(',')
            })
            setContainerTypeAndChargesData(tempData)
          })
        }
      }else{
        alert('You are not allowed to Transfer From Sales Invoice, Please check your User Permissions.')
      }
    
    }

  


  }

  function getContainerCodeByContainerType(val) {
  }
  function getCOCCompany(val, index) {
  }
  function getBoxOperatorBranchByBoxOperatorCompany(val) {
  }
  function onChangeUNNumber(val) {
  }
  function getBoxOperatorBranchName(val) {
  }

  function loadCompanyOptions(inputValue) {
    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "company/get-company-by-company-name?search=" + inputValue + "&companyType=Box Operator&q=" + inputValue, {
      auth: {
        username: globalContext.authInfo.username,
        password: globalContext.authInfo.access_token,
      },
    }).then(res => res.data.data)
    return response
  }

  const loadUNNumberOptions = (inputValue) => {

    const response = axios.get(globalContext.globalHost + globalContext.globalPathLink + "u-n-number/get-u-n-number-by-u-n-number?term=" + inputValue + "&_type=query&q=" + inputValue, {

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

  function confirmTransferTo() {
    var array = [];
    // var Id=$("#dynamicmodel-invoiceno").val();
    $(".checkboxCharges:checked").each(function () {

      if(props.modelLink == "debit-note-barge"){
        var chargesIndex=$(this).parent().parent().parent().index()
      }else{
        var chargesIndex=$(this).parent().parent().parent().parent().index()
      }
      var ContainerIndex = $(this).parent().parent().parent().parent().closest(".ChargesTable").prev().index()


      chargesIndex = chargesIndex == 0 ? chargesIndex : (chargesIndex / 2)
      ContainerIndex = ContainerIndex == 0 ? ContainerIndex : (ContainerIndex / 2)

      if (props.modelLink == "debit-note-barge") {
        var ArrayInside = {
          "ContainerType":"",
          "ContainerCode":"",
          "ChargesCode": $(`input[name='SalesInvoiceHasContainerType[${ContainerIndex}][SalesInvoiceHasCharges][${chargesIndex}][ChargesCode]']`).val()
        }
        array.push(ArrayInside);
    
      }else{
        var closestContainerArrayList = $(this).parent().parent().parent().parent().closest(".ChargesTable").prev().find(".containerArrayList").val()
        if (closestContainerArrayList !== "") {
          $.each(closestContainerArrayList.split(','), function (key, value) {
            var ArrayInside = {
              "ContainerType": $(`input[name='SalesInvoiceHasContainerType[${ContainerIndex}][ContainerType]']`).val(),
              "ContainerCode": value,
              "ChargesCode": $(`input[name='SalesInvoiceHasContainerType[${ContainerIndex}][SalesInvoiceHasCharges][${chargesIndex}][ChargesCode]']`).val()
            }
            array.push(ArrayInside);
          })
        }
      }


    });
    GetCNDNTransferFromSalesInvoice($("input[name='InvoiceNo']").val(), props.modelLink, globalContext, array).then(res => {
      setTransferPartialData(res.data)

    })
    $(".add-container").addClass('d-none')
    window.$("#TransferToDebitNoteModal").modal('toggle')
  }



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
      props.trigger()

    }
    //setDate(props.middleCardData.DocDate)

    return () => {

    }
  }, [props.middleCardData])

  const [bookingSelectionQuickForm, setBookingSelectionQuickForm] = useState([])


  var DocumentItem = {
    formName: "SalesDebitNote",
    cardLength: props.modelLink == "debit-note-barge" ? "col-md-4" : "col-md-12",
    element: [
      { title: "DN No.", id: "salesdebitnote-docnum", className: "", name: "SalesDebitNote[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-2", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "DN Doc Date", id: "salesdebitnote-docdate", className: "docDate flatpickr-input", name: "SalesDebitNote[DocDate]", dataTarget: "DocDate", value: Date, gridSize: "col-xs-12 col-md-2", type: "flatpickr-input", onChange: "", specialFeature: [] },
      { title: "Sales Person", id: "salesdebitnote-salesperson", className: "sales_person", name: "SalesDebitNote[SalesPerson]", dataTarget: "SalesPerson", gridSize: "col-xs-12 col-md-2", type: "dropdown", option: props.user, onChange: "", specialFeature: [] },
      { title: "Currency", id: "salesdebitnote-currency", className: "currency", name: "SalesDebitNote[Currency]", defaultValue: formContext.defaultCurrency, dataTarget: "Currency", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: props.currency, onChange: "", specialFeature: [] },
      { title: "Currency Rate", id: "salesdebitnote-currencyexchangerate", className: "", name: "SalesDebitNote[CurrencyExchangeRate]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [], defaultValue: "1.00" },
      { title: "Document Description", id: "salesdebitnote-docdesc", className: "", name: "SalesDebitNote[DocDesc]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-12", type: "textarea", onChange: "", specialFeature: [] },

    ]
  }

  var ShippingInstructionItem = {
    formName: "SalesDebitNote",
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
    formName: "SalesDebitNote",
    cardLength: "col-md-12",
    cardTitle: "Bill To",
    element: [
      { title: "Customer Type", className: "", name: "DynamicModel[CustomerType]", gridSize: "col-xs-12 col-md-2", type: "dropdown", onChange: "", dataTarget: "CustomerType", defaultValue: "Others", option: props.customerType },
      { title: "Company Name (ROC)", id: "CompanyROC-BillTo-Quickform", className: "dropdownInputCompany", name: "DynamicModel[BillToCompany]", dataTarget: "CompanyROC-BillTo", gridSize: "col-xs-12 col-md-4", type: "input-dropdownInputCompany", onChange: "", specialFeature: ["required"] },
      { title: "Branch Tel", id: "salesdebitnotebillto-quickform-branchtel", className: "branchtelbillto", name: "DynamicModel[BillToBranchTel]", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [], dataTarget: "BranchTel-BillTo" },
      { title: "Branch Email", id: "salesdebitnotebillto-quickform-branchemail", className: "branchemailbillto", name: "DynamicModel[BillToBranchEmail]", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [], dataTarget: "BranchEmail-BillTo" },
      { title: "Attention Name", id: "AttentionName-BillTo-QuickForm", className: "attentionnamebillto", name: "DynamicModel[AttentionName]", dataTarget: "AttentionName-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-text-withModal", onChange: "", specialFeature: [] },
      { title: "Attention Tel", id: "AttentionTel-BillTo-QuickForm", className: "attentiontelbillto", name: "DynamicModel[AttentionTel]", dataTarget: "AttentionTel-BillTo", gridSize: "col-xs-12 col-md-2", type: "input-text", onChange: "", specialFeature: [] },
      { title: "Attention Email", id: "AttentionEmail-BillTo-QuickForm", className: "attentionemailbillto", name: "DynamicModel[AttentionEmail]", dataTarget: "AttentionEmail-BillTo", gridSize: "col-xs-12 col-md-2", type: "input-text", onChange: "", specialFeature: [] },
      { title: "Transfer Doc Type", className: "", name: "DynamicModel[TransferDocType]", gridSize: "col-xs-12 col-md-2", type: "dropdown", onChange: "", option: TransferDocType, defaultValue: "INV" },
      { title: "INV NO.", className: "", name: "InvoiceNo", gridSize: "col-xs-12 col-md-3", type: "dropdown", onChange: "", option: props.invList, onChange: handleTransferFrom,specialFeature: ["required"]},
    ]
  }

  var ContainerItem = {
    formName: "SalesDebitNote",
    cardLength: "col-md-12",
    type: "Container",
    cardTitle: "Charges",
    ContainerColumn: [
      { columnName: "Seq", inputType: "input", defaultChecked: true, name: "SeqNum", fieldClass: "SeqNum", class: "", onChange: "" },
      { columnName: "Charges Code", inputType: "single-select", defaultChecked: true, name: "ChargesCode", fieldClass: "ChargesCode", options: props.chargesCode, class: "", onChange: "" },
      { columnName: "Charges Name", inputType: "input", defaultChecked: true, name: "ChargesName", fieldClass: "ChargesName", class: "", onChange: "" },
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType", options: props.containerType, class: "", onChange: "" },
      { columnName: "Container Code", inputType: "single-select", defaultChecked: true, name: "ContainerCode", fieldClass: "ContainerCode", options: props.containerType, class: "", onChange: "" },
      { columnName: "Account Code", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "Qty", class: "", onChange: "" },
      { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", fieldClass: "UnitPrice", class: "", onChange: "" },
      { columnName: "Freight Term", inputType: "single-select", defaultChecked: true, name: "FreightTerm", fieldClass: "FreightTerm", options: props.containerType, class: "", onChange: "" },
      { columnName: "Cargo Type", inputType: "single-select", defaultChecked: true, name: "CargoType", fieldClass: "CargoType", options: props.containerType, class: "", onChange: "" },
      { columnName: "Cargo Rate", inputType: "input", defaultChecked: true, name: "CargoRate", fieldClass: "CargoRate", class: "", onChange: "" },
      { columnName: "UOM", inputType: "single-select", defaultChecked: true, name: "UOM", fieldClass: "UOM", options: [], class: "", onChange: "" },
      { columnName: "Vessel", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Voyage", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Shipper", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Consignee", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Charges Description", inputType: "input-Modal", defaultChecked: false, name: "ChargesDescription", fieldClass: "MarkReadonly", class: "d-none", modelClass: "TextMarks", textValue: "", readOnly: true },
      { columnName: "Currency", inputType: "single-select", defaultChecked: true, name: "Currency", fieldClass: "Currency", options: props.currency, class: "", onChange: "" },
      { columnName: "ROE", inputType: "input", defaultChecked: true, name: "CurrencyExchangeRate", fieldClass: "CurrencyExchangeRate", class: "", onChange: "" },
      { columnName: "Tax Code", inputType: "single-select", defaultChecked: true, name: "TaxCode", fieldClass: "TaxCode", options: props.taxCode, class: "", onChange: "" },
      { columnName: "Tax Rate", inputType: "input", defaultChecked: true, name: "TaxRate", fieldClass: "TaxRate", class: "", onChange: "" },
      { columnName: "Tax Amount", inputType: "input", defaultChecked: true, name: "TaxAmount", fieldClass: "TaxAmount", class: "", onChange: "" },
      { columnName: "Local Amount", inputType: "input", defaultChecked: true, name: "Amount", fieldClass: "Amount", class: "", onChange: "" },
      { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", fieldClass: "SubTotal", class: "", onChange: "" },
      { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: true, name: "SubTotalLocal", fieldClass: "SubTotalLocal", class: "", onChange: "" },

    ]
  }

  var ContainerItemBarge = {
    formName: "SalesDebitNote",
    cardLength: "col-md-12",
    type: "Standard",
    cardTitle: "Charges",
    ContainerColumn: [
      { columnName: "Seq", inputType: "input", defaultChecked: true, name: "SeqNum", fieldClass: "SeqNum", class: "", onChange: "" },
      { columnName: "Charges Code", inputType: "single-select", defaultChecked: true, name: "ChargesCode", fieldClass: "ChargesCode", options: props.chargesCode, class: "", onChange: "" },
      { columnName: "Charges Name", inputType: "input", defaultChecked: true, name: "ChargesName", fieldClass: "ChargesName", class: "", onChange: "" },

      { columnName: "Account Code", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "Qty", class: "", onChange: "" },
      { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", fieldClass: "UnitPrice", class: "", onChange: "" },
      { columnName: "Freight Term", inputType: "single-select", defaultChecked: true, name: "FreightTerm", fieldClass: "FreightTerm", options: props.containerType, class: "", onChange: "" },
      { columnName: "Cargo Type", inputType: "single-select", defaultChecked: true, name: "CargoType", fieldClass: "CargoType", options: props.containerType, class: "", onChange: "" },
      { columnName: "Cargo Rate", inputType: "input", defaultChecked: true, name: "CargoRate", fieldClass: "CargoRate", class: "", onChange: "" },
      { columnName: "UOM", inputType: "single-select", defaultChecked: true, name: "UOM", fieldClass: "UOM", options: [], class: "", onChange: "" },
      { columnName: "Vessel", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Voyage", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Shipper", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Consignee", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Charges Description", inputType: "input-Modal", defaultChecked: false, name: "ChargesDescription", fieldClass: "MarkReadonly", class: "d-none", modelClass: "TextMarks", textValue: "", readOnly: true },
      { columnName: "Currency", inputType: "single-select", defaultChecked: true, name: "Currency", fieldClass: "Currency", options: props.currency, class: "", onChange: "" },
      { columnName: "ROE", inputType: "input", defaultChecked: true, name: "CurrencyExchangeRate", fieldClass: "CurrencyExchangeRate", class: "", onChange: "" },
      { columnName: "Tax Code", inputType: "single-select", defaultChecked: true, name: "TaxCode", fieldClass: "TaxCode", options: props.taxCode, class: "", onChange: "" },
      { columnName: "Tax Rate", inputType: "input", defaultChecked: true, name: "TaxRate", fieldClass: "TaxRate", class: "", onChange: "" },
      { columnName: "Tax Amount", inputType: "input", defaultChecked: true, name: "TaxAmount", fieldClass: "TaxAmount", class: "", onChange: "" },
      { columnName: "Local Amount", inputType: "input", defaultChecked: true, name: "Amount", fieldClass: "Amount", class: "", onChange: "" },
      { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", fieldClass: "SubTotal", class: "", onChange: "" },
      { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: true, name: "SubTotalLocal", fieldClass: "SubTotalLocal", class: "", onChange: "" },

    ]
  }

  var ContainerItemTransferPartial = {
    formName:"SalesInvoice",
    cardLength:"col-md-12",
    cardTitle: "Containers & Charges",
    ContainerColumn: [
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType Container_Type liveData RequiredFieldAddClass Live_ContainerType", options:props.containerType, class: "", onChange: "", requiredField: true },
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
    <div className="QuickForm">
      <div className="row">
        <QuickFormDocument register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} DocumentItem={DocumentItem} />
        {props.modelLink == "debit-note-barge" ?
          <QuickFormShippingInstruction trigger={props.trigger} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ShippingInstructionItem={ShippingInstructionItem} port={props.port} />
          : ""}
        <QuickFormMiddleCard model={props.modelLink} register={props.register} trigger={props.trigger} control={props.control} errors={props.errors} setValue={props.setValue} MiddleCardItem={MiddleCardItem} />
        {checkLoadAllOptionFlag == true ? <QuickFormContainer barge={props.modelLink == "debit-note-barge" ? true : false} containerData={props.containerData}   transferPartialData={transferPartialData} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} ContainerItem={props.modelLink == "debit-note-barge" ? ContainerItemBarge : ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} chargesCode={props.chargesCode} />
          : ""}
      </div>

      <div className="modal fade" id="TransferToDebitNoteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Transfer From Sales Invoice</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
            <QuickFormContainerTransfer barge={props.modelLink == "debit-note-barge" ? true : false}  transferPartial={"SalesDebitNote"} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} getValues={props.getValues} ContainerItem={ContainerItemTransferPartial} ownershipType={OwnershipType} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} containerTypeAndChargesData={containerTypeAndChargesData} documentData={props.documentData} />            </div>
            <div className="modal-footer">
             <button type="button" class="btn btn-primary mb-1" id="comfirmTransferTO" onClick={confirmTransferTo}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickForm