
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, getAreaById, getPortDetails,GetCNDNTransferFromSalesInvoice, GetCompaniesData, TransferToCreditNote } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormMiddleCard from '../../Components/CommonElement/QuickFormMiddleCard';
import FormContext from '../../Components/CommonElement/FormContext';
import QuickFormContainer from './QuickFormContainer';
import QuickFormContainerTransfer from '../../Components/CommonElement/QuickFormContainer';

function QuickForm(props) {

  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  const [Date, setDate] = useState("")
  const [checkLoadAllOptionFlag, setCheckLoadAllOptionFlag] = useState(props.loadAllOption)


  useEffect(() => {
    if (props.containerType.length > 0) {
      setCheckLoadAllOptionFlag(true)

    }
    return () => {

    }
  }, [props.containerType])

  useEffect(() => {
    setDate(formContext.docDate)

    return () => {
    }
  }, [formContext.docDate])

  const CreditorType = [
    {
      value : 'Transport',
      label : 'Transport',
    },
    {
      value : 'Port Bill',
      label : 'Port Bill',
    },
    {
      value : 'Vessel Cost',
      label : 'Vessel Cost',
    },
    {
      value : 'Office Use',
      label : 'Office Use',
    },
    {
      value : 'Forwarding Cost',
      label : 'Forwarding Cost',
    },
    {
      value : 'Gov Department',
      label : 'Gov Department',
    },
    {
      value : 'Liner',
      label : 'Liner',
    },
    {
      value : 'DND',
      label : 'DND',
    },
    {
      value : 'Depot',
      label : 'Depot',
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

  useEffect(() => {
    if (props.middleCardData) {

      if (props.middleCardData.ROC) {
        props.setValue("DynamicModel[SupplierCompany]", props.middleCardData.rOC.CompanyName + "(" + props.middleCardData.rOC.ROC + ")")
        props.setValue("DynamicModel[SupplierBranchTel]", props.middleCardData.BranchTel)
        props.setValue("DynamicModel[SupplierBranchEmail]", props.middleCardData.BranchEmail)
        props.setValue("DynamicModel[AttentionName]", props.middleCardData.AttentionName)
        props.setValue("DynamicModel[AttentionTel]", props.middleCardData.AttentionTel)
        props.setValue("DynamicModel[AttentionEmail]", props.middleCardData.AttentionEmail)
        props.setValue("DynamicModel[CustomerType]", props.middleCardData.CustomerType)
        $("#BranchCode-Supplier-Quickform").val(props.middleCardData.branchCode.BranchCode+"("+props.middleCardData.branchCode.BranchName+")")
        // props.setValue("InvoiceNo",props.invList)

      }

      setDate(props.middleCardData.DocDate)
      //props.trigger()

    }

    return () => {

    }
  }, [props.middleCardData])

  useEffect(() => {
    if (formContext.salesPerson) {
      props.setValue("PurchaseOrder[SalesPerson]", formContext.salesPerson)
    }
    return () => {
    }
  }, [formContext.salesPerson])

  var DocumentItem = {
    formName: "PurchaseOrder",
    cardLength: "col-md-12",
    element: [
      { title: "PO No.", id: "purchaseorder-docnum", className: "", name: "PurchaseOrder[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-2", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "PO Doc Date", id: "purchaseorder-docdate", className: "docDate flatpickr-input", name: "PurchaseOrder[DocDate]", dataTarget: "DocDate", value: Date, gridSize: "col-xs-12 col-md-2", type: "flatpickr-input", onChange: "", specialFeature: [] },
      { title: "Sales Person", id: "purchaseorder-salesperson", className: "sales_person", name: "PurchaseOrder[SalesPerson]", dataTarget: "SalesPerson", gridSize: "col-xs-12 col-md-2", type: "dropdown", option: props.user, onChange: "", specialFeature: [] },
      { title: "Currency", id: "purchaseorder-currency", className: "currency", name: "PurchaseOrder[Currency]", defaultValue: formContext.defaultCurrency, dataTarget: "Currency", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: props.currency, onChange: "", specialFeature: [] },
      { title: "Rate", id: "purchaseorder-currencyexchangerate", className: "", name: "PurchaseOrder[CurrencyExchangeRate]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [], defaultValue: "1.00" },
    ]
  }

  var MiddleCardItem = {
    formName: "PurchaseOrder",
    cardLength: "col-md-12",
    cardTitle: "Supplier",
    element: [
      { title: "Company Name", id: "CompanyROC-Supplier-Quickform", className: "dropdownInputCompany", name: "DynamicModel[SupplierCompany]", dataTarget: "CompanyROC-Supplier", gridSize: "col-xs-12 col-md-6", type: "input-dropdownInputCompany", onChange: "", specialFeature: [] },
      { title: "Branch Name", id: "BranchCode-Supplier-Quickform", className: "dropdownInputBranch", name: "DynamicModel[SupplierCompanyBranch]", dataTarget: "BranchCode-Supplier", gridSize: "col-xs-12 col-md-6", type: "input-dropdownInputBranch", onChange: "", specialFeature: [] },
      { title: "Creditor Type ", id: "CreditorType-Supplier-Quickform", className: "", name: "PurchaseOrder[CreditorType]", dataTarget: "CreditorType-Supplier", gridSize: "col-xs-12 col-md-3", type: "dropdown", option:CreditorType, onChange: "", specialFeature: [] },
      { title: "Branch Tel", id: "purchaseordersupplier-quickform-branchtel", className: "branchtelsupplier", name: "DynamicModel[SupplierBranchTel]", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [], dataTarget: "BranchTel-Supplier" },
      { title: "Branch Email", id: "purchaseordersupplier-quickform-branchemail", className: "branchemailsupplier", name: "DynamicModel[SupplierBranchEmail]", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: [], dataTarget: "BranchEmail-Supplier" },
      { title: "Attention Name", id: "AttentionName-Supplier-QuickForm", className: "attentionnamesupplier", name: "DynamicModel[AttentionName]", dataTarget: "AttentionName-Supplier", gridSize: "col-xs-12 col-md-12", type: "input-text-withModal", onChange: "", specialFeature: [] },
      { title: "Attention Tel", id: "AttentionTel-Supplier-QuickForm", className: "attentiontelsupplier", name: "DynamicModel[AttentionTel]", dataTarget: "AttentionTel-Supplier", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: [] },
      { title: "Attention Email", id: "AttentionEmail-Supplier-QuickForm", className: "attentionemailsupplier", name: "DynamicModel[AttentionEmail]", dataTarget: "AttentionEmail-Supplier", gridSize: "col-xs-12 col-md-6", type: "input-text", onChange: "", specialFeature: [] },
    ]
  }

  var ContainerItem = {
    formName: "PurchaseOrder",
    cardLength: "col-md-12",
    cardTitle: "Charges",
    ContainerColumn: [
      { columnName: "Particulars Code", inputType: "input", defaultChecked: true, name: "ParticularCode", fieldClass: "ParticularCode", class: "", onChange: "" },
      { columnName: "Particulars Name", inputType: "input", defaultChecked: true, name: "ParticularName", fieldClass: "ParticularName", class: "", onChange: "" },
      { columnName: "Account Code", inputType: "input", defaultChecked: true, name: "AccountCode", fieldClass: "AccountCode", class: "", onChange: "" },
      { columnName: "Qty", inputType: "input", defaultChecked: true, name: "Qty", fieldClass: "cal qty", class: "", onChange: "" },
      { columnName: "UOM", inputType: "single-select", defaultChecked: true, name: "UOM", fieldClass: "UOM", options: [], class: "", onChange: "" },
      { columnName: "Unit Price", inputType: "input", defaultChecked: true, name: "UnitPrice", fieldClass: "cal unitprice inputDecimalTwoPlaces", class: "", onChange: "" },
      { columnName: "Unit Discount", inputType: "input", defaultChecked: true, name: "Discount", fieldClass: "cal unitdisc", class: "", onChange: "" },
      { columnName: "Currency", inputType: "select-withCurrencyModal", defaultChecked: false, name: "Currency", class: "d-none",options:props.currency, fieldClass:"currency calCharges", onChange:"" },
      { columnName: "Currency Exchange Rate", inputType: "input", defaultChecked: false, name: "CurrencyExchangeRate", class: "d-none",fieldClass:"cal exchangerate inputDecimalTwoPlaces", onBlur:""},
      { columnName: "Amount", inputType: "input", defaultChecked: false, name: "Amount", class: "d-none", fieldClass: "cal localamount inputDecimalTwoPlaces", onBlur:"" },
      { columnName: "Tax Code", inputType: "single-select", defaultChecked: true, name: "TaxCode", fieldClass: "TaxCode taxcode", options: props.taxCode, class: "", onChange: "" },
      { columnName: "Tax Rate", inputType: "input", defaultChecked: true, name: "TaxRate", fieldClass: "TaxRate cal taxrate", class: "", onChange: "" },
      { columnName: "Tax Amount", inputType: "input", defaultChecked: true, name: "TaxAmount", fieldClass: "cal taxamount inputDecimalTwoPlaces", class: "", onChange: "" },
      { columnName: "Sub Total", inputType: "input", defaultChecked: true, name: "SubTotal", fieldClass: "SubTotal cal subtotal inputDecimalTwoPlaces", class: "", onChange: "" },
      { columnName: "Sub Total(Local)", inputType: "input", defaultChecked: true, name: "SubTotalLocal", fieldClass: "SubTotalLocal cal subtotallocal inputDecimalTwoPlaces", class: "", onChange: "" },
      { columnName: "QT No.", inputType: "single-select", defaultChecked: true, name: "Quotation", class: "", fieldClass:"", options: formContext.quotationOptions, onChange:"" },
      { columnName: "BC No.", inputType: "single-select", defaultChecked: true, name: "BookingConfirmation", class: "", fieldClass:"", options: formContext.bookingConfirmationOptions, onChange:"" },
      { columnName: "INV No.", inputType: "single-select", defaultChecked: true, name: "SalesInvoice", class: "", fieldClass:"", options: formContext.bookingConfirmationOptions, onChange:"" },
      { columnName: "BL No.", inputType: "single-select", defaultChecked: true, name: "BillOfLading", class: "", fieldClass:"", options: formContext.bookingConfirmationOptions, onChange:"" },
      { columnName: "OR No.", inputType: "single-select", defaultChecked: true, name: "ORNo", class: "", fieldClass:"", options: formContext.bookingConfirmationOptions, onChange:"" },
      { columnName: "Container Type", inputType: "single-select", defaultChecked: true, name: "ContainerType", fieldClass: "ContainerType", options: props.containerType, class: "", onChange: "" },
      { columnName: "Container Code", inputType: "single-select", defaultChecked: true, name: "ContainerCode", fieldClass: "ContainerCode", options: [], class: "", onChange: "" },
      { columnName: "Container Qty", inputType: "input", defaultChecked: true, name: "ContainerQty", fieldClass:"ContainerQty", class: "", onChange: "" },
      { columnName: "Owner", inputType: "input", defaultChecked: true, name: "Owner", fieldClass: "Owner", class: "", onChange: "" },
      { columnName: "DGClass", inputType: "input", defaultChecked: true, name: "DGClass", fieldClass: "DGClass", class: "", onChange: "" },
    ]
  }

  if (getCookie('voyagecolumn')) {
    var getCookieArray = getCookie('voyagecolumn');
    var getCookieArray = JSON.parse(getCookieArray);

    $.each(ContainerItem.ContainerColumn, function (key, value) {
      value.defaultChecked = false
      value.class = "d-none"
    })

    $.each(getCookieArray, function (key, value) {
      $.each(ContainerItem.ContainerColumn, function (key2, value2) {

        if (value == key2) {
          value2.defaultChecked = true
          value2.class = ""
        }
      })
    })
  }

  return (
    <div className="QuickForm">
      <div className="row">
        <QuickFormDocument register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} DocumentItem={DocumentItem} />

        <QuickFormMiddleCard register={props.register} trigger={props.trigger} control={props.control} errors={props.errors} setValue={props.setValue} MiddleCardItem={MiddleCardItem} />
        {checkLoadAllOptionFlag == true? <QuickFormContainer containerData={props.containerData} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} ContainerItem={ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} chargesCode={props.chargesCode} QTOption={props.QTOption} BCOption={props.BCOption} INVOption={props.INVOption} BLOption={props.BLOption} OROption={props.OROption} /> :""}
      </div>
    </div>
  )
}

export default QuickForm