
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, getAreaById, getPortDetails, GetCompaniesData } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import axios from "axios"
import QuickFormDocument from "../../Components/CommonElement/QuickFormDocument";
import QuickFormMiddleCard from '../../Components/CommonElement/QuickFormMiddleCard';
import FormContext from '../../Components/CommonElement/FormContext';
import QuickFormContainer from './QuickFormContainer';

function QuickForm(props) {
  const formContext = useContext(FormContext)
  const globalContext = useContext(GlobalContext)
  const [Date, setDate] = useState("")
  const [checkLoadAllOptionFlag, setCheckLoadAllOptionFlag] = useState(props.loadAllOption)


  useEffect(() => {
    setDate(formContext.docDate)

    return () => {
    }
  }, [formContext.docDate])

  useEffect(() => {
    if(props.containerType.length>0){
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
  

  useEffect(() => {
    if (props.middleCardData) {
    
      if (props.middleCardData.ROC) {
        props.setValue("DynamicModel[BillToCompany]", props.middleCardData.rOC.ROC)
        props.setValue("DynamicModel[BillToCompanyName]", props.middleCardData.rOC.CompanyName)

        props.setValue("DynamicModel[BillToBranch]", props.middleCardData.branchCode.BranchCode)
        props.setValue("DynamicModel[BillToBranchName]", props.middleCardData.branchCode.BranchName)

        props.setValue("DynamicModel[CustomerType]",props.middleCardData.CustomerType)

        props.setValue("DynamicModel[BillToBranchTel]",props.middleCardData.BranchTel)
        props.setValue("DynamicModel[BillToBranchEmail]",props.middleCardData.BranchEmail)
        props.setValue("DynamicModel[AttentionName]",props.middleCardData.AttentionName)
        props.setValue("DynamicModel[AttentionTel]",props.middleCardData.AttentionTel)
        props.setValue("DynamicModel[AttentionEmail]",props.middleCardData.AttentionEmail)
        // props.setValue("DynamicModel[CustomerType]",props.middleCardData.CustomerType)
        // props.setValue("InvoiceNo",props.invList)
        
      }
        props.trigger()
      setDate(props.middleCardData.DocDate)
    }

    return () => {

    }
  }, [props.middleCardData])

  const [bookingSelectionQuickForm, setBookingSelectionQuickForm] = useState([])


  var DocumentItem = {
    formName: "CustomerPayment",
    cardLength: "col-md-12",
    element: [
      { title: "CN No.", id: "customerpayment-docnum", className: "", name: "CustomerPayment[DocNum]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-2", type: "input-text", onChange: "", specialFeature: ["readonly"] },
      { title: "CN Doc Date", id: "customerpayment-docdate", className: "docDate flatpickr-input", name: "CustomerPayment[DocDate]", dataTarget: "DocDate", value: Date, gridSize: "col-xs-12 col-md-2", type: "flatpickr-input", onChange: "", specialFeature: [] },
      { title: "Sales Person", id: "customerpayment-salesperson", className: "sales_person", name: "CustomerPayment[SalesPerson]", dataTarget: "SalesPerson", gridSize: "col-xs-12 col-md-2", type: "dropdown", option: props.user, onChange: "", specialFeature: [] },
      { title: "Currency", id: "customerpayment-currency", className: "currency", name: "CustomerPayment[Currency]",defaultValue:formContext.defaultCurrency, dataTarget: "Currency", gridSize: "col-xs-12 col-md-3", type: "dropdown", option: props.currency, onChange: "", specialFeature: [] },
      { title: "Currency Rate", id: "customerpayment-currencyexchangerate", className: "", name: "CustomerPayment[CurrencyExchangeRate]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [] ,defaultValue:"1.00"},
      { title: "Document Description", id: "customerpayment-docdesc", className: "", name: "CustomerPayment[DocDesc]", dataTarget: "DocNum", gridSize: "col-xs-12 col-md-12", type: "textarea", onChange: "", specialFeature: [] },

    ]
  }

  var MiddleCardItem = {
    formName: "CustomerPayment",
    cardLength: "col-md-12",
    cardTitle: "Bill To",
    element: [
      { title: "Customer Type", className: "", name: "DynamicModel[CustomerType]", gridSize: "col-xs-12 col-md-2", type: "dropdown", onChange: "",dataTarget:"CustomerType" ,defaultValue:"Others",option: props.customerType},
      { title: "ROC", id: "CompanyROC-BillTo-Quickform", className: "dropdownInputCompany", name: "DynamicModel[BillToCompany]", dataTarget: "CompanyROC-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: ["required"] },
      { title: "Company Name", id: "CompanyName-BillTo-Quickform", className: "", name: "DynamicModel[BillToCompanyName]", dataTarget: "CompanyName-BillTo", gridSize: "col-xs-12 col-md-7", type: "input-text", onChange: "", specialFeature: ["readOnly"]},
      { title: "Branch Code", id: "BranchCode-BillTo-Quickform", className: "dropdownInputBranch", name: "DynamicModel[BillToBranch]", dataTarget: "BranchCode-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-dropdownInputCompany", onChange: "", specialFeature: [] },
      { title: "Branch Name", id: "BranchName-BillTo-Quickform", className: "", name: "DynamicModel[BillToBranchName]", dataTarget: "BranchName-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: ["readOnly"]},
     
      { title: "Branch Tel",id:"BranchTel-BillTo-Quickform",className: "branchtelbillto", name: "DynamicModel[BillToBranchTel]", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [],dataTarget:"BranchTel-BillTo" },
      { title: "Branch Email",id:"BranchEmail-BillTo-Quickform", className: "branchemailbillto", name: "DynamicModel[BillToBranchEmail]", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [],dataTarget:"BranchEmail-BillTo"  },
      { title: "Attention Name", id:"AttentionName-BillTo-QuickForm",className:"attentionnamebillto",name: "DynamicModel[AttentionName]", dataTarget: "AttentionName-BillTo", gridSize: "col-xs-12 col-md-6", type: "input-text-withModal", onChange: "", specialFeature: [] },
      { title: "Attention Tel", id:"AttentionTel-BillTo-QuickForm",className: "attentiontelbillto", name: "DynamicModel[AttentionTel]", dataTarget: "AttentionTel-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [] },
      { title: "Attention Email",id:"AttentionEmail-BillTo-QuickForm", className: "attentionemailbillto", name: "DynamicModel[AttentionEmail]", dataTarget: "AttentionEmail-BillTo", gridSize: "col-xs-12 col-md-3", type: "input-text", onChange: "", specialFeature: [] },
   
    ]
  }

  var ContainerItem = {
    formName: "CustomerPayment",
    cardLength: "col-md-12",
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

  
  return (
    <div className="QuickForm">
      <div className="row">
        <QuickFormDocument register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} DocumentItem={DocumentItem} />

        <QuickFormMiddleCard model={props.modelLink} register={props.register} trigger={props.trigger} control={props.control} errors={props.errors} setValue={props.setValue} MiddleCardItem={MiddleCardItem} />
        {/* {checkLoadAllOptionFlag==true?<QuickFormContainer  containerData={props.containerData} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} ContainerItem={ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} chargesCode={props.chargesCode} receivableMethod={props.receivableMethod}  />
        :""} */}
        <QuickFormContainer  containerData={props.containerData} register={props.register} control={props.control} errors={props.errors} setValue={props.setValue} ContainerItem={ContainerItem} containerType={props.containerType} port={props.port} freightTerm={props.freightTerm} taxCode={props.taxCode} currency={props.currency} cargoType={props.cargoType} chargesCode={props.chargesCode} receivableMethod={props.receivableMethod} />
       
      </div>
    </div>
  )
}

export default QuickForm