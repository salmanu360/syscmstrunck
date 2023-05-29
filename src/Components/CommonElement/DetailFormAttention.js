import React, {useContext, useEffect} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext";
import {CheckBoxHandle} from "../Helper";
import $ from "jquery";


function DetailFormAttention(props) {
    const formContext = useContext(FormContext)


    useEffect(() => { 
        setTimeout(() => {
            if(formContext.customerType){
                if (props.AttentionItem.formName == "SalesInvoice") {
                    props.setValue("SalesInvoice[CustomerType]", formContext.customerType)
                }
                if (props.AttentionItem.formName == "SalesCreditNote") {
                    props.setValue("SalesCreditNoteBillTo[CustomerType]", formContext.customerType)
                }
                if (props.AttentionItem.formName == "SalesDebitNote") {
                    props.setValue("SalesDebitNoteBillTo[CustomerType]", formContext.customerType)
                }
            }
        }, 100);
    }, [formContext.customerType])
    
  return (
    <>
        {props.AttentionItem.attentionList.map((res, index) => {

            const formName = props.AttentionItem.formName;
            const attentionType = res;
            const lowercaseFormName = props.AttentionItem.formName.toLowerCase();
            const lowercaseAttentionType = res.toLowerCase();
            const SpaceFormName = res.replace(/([A-Z])/g, ' $1').trim();
            var element=[
                {title:"ROC",id:`CompanyROC-${attentionType}-DetailForm`, className:`dropdownInputCompany reflect-field onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[ROC]`, dataTarget:`CompanyROC-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                {title:"Company Name", id:`CompanyName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}${attentionType}[CompanyName]`, dataTarget:`CompanyName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Credit Term", id:`${lowercaseFormName}${lowercaseAttentionType}-creditterm`, className:"credit_term", name:`${formName}${attentionType}[CreditTerm]`, dataTarget:`CreditTerm-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.AttentionItem.creditTerm, onChange:"", specialFeature:[]} ,
                {title:"Credit Limit", id:`${lowercaseFormName}${lowercaseAttentionType}-creditlimit`, className:`decimalDynamicForm inputDecimalTwoPlaces inputDecimalId onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[CreditLimit]`, dataTarget:`CreditLimit-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Code ", id:`BranchCode-${attentionType}-DetailForm`, className:`dropdownInputBranch reflect-field onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchCode]`, dataTarget:`BranchCode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[""]},
                {title:"Branch Name", id:`${lowercaseFormName}${lowercaseAttentionType}-branchname`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}${attentionType}[BranchName]`, dataTarget:`BranchName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Branch Tel", id:`${lowercaseFormName}${lowercaseAttentionType}-branchtel`, className:`reflect-field phone onchange${lowercaseAttentionType} branchtel${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchTel]`, dataTarget:`BranchTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Fax", id:`${lowercaseFormName}${lowercaseAttentionType}-branchfax`, className:`reflect-field phone onchange${lowercaseAttentionType} branchemail${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchFax]`, dataTarget:`BranchFax-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Email", id:`${lowercaseFormName}${lowercaseAttentionType}-branchemail`, className:`reflect-field onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchEmail]`, dataTarget:`BranchEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 1", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline1`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}${attentionType}[BranchAddressLine1]`, dataTarget:`BranchAddressLine1-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 2", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline2`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}${attentionType}[BranchAddressLine2]`, dataTarget:`BranchAddressLine2-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 3", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline3`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}${attentionType}[BranchAddressLine3]`, dataTarget:`BranchAddressLine3-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Postcode", id:`${lowercaseFormName}${lowercaseAttentionType}-branchpostcode`, className:`onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchPostcode]`, dataTarget:`BranchPostcode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch City", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcity`, className:`onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchCity]`, dataTarget:`BranchCity-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Country", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcountry`, className:`onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchCountry]`, dataTarget:`BranchCountry-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Coordinates", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcoordinates`, className:`onchange${lowercaseAttentionType}`, name:`${formName}${attentionType}[BranchCoordinates]`, dataTarget:`BranchCoordinates-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Attention Name", id:`AttentionName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentionname${lowercaseAttentionType}`, name:`${formName}${attentionType}[AttentionName]`, dataTarget:`AttentionName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text-withModal", onChange:"", specialFeature:[]},
                {title:"Attention Tel", id:`AttentionTel-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentiontel${lowercaseAttentionType}`, name:`${formName}${attentionType}[AttentionTel]`, dataTarget:`AttentionTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Attention Email", id:`AttentionEmail-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentionemail${lowercaseAttentionType}`, name:`${formName}${attentionType}[AttentionEmail]`, dataTarget:`AttentionEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`Valid`, id:`${lowercaseFormName}${lowercaseAttentionType}-valid`, className:``, name:`${formName}${attentionType}[Valid]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:["defaultCheck"]},
            ];

            var elementPurchaseOrderSupplier=[
                {title:"ROC",id:`CompanyROC-${attentionType}-DetailForm`, className:`dropdownInputCompany reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[ROC]`, dataTarget:`CompanyROC-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                {title:"Company Name", id:`CompanyName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[CompanyName]`, dataTarget:`CompanyName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Credit Term", id:`${lowercaseFormName}${lowercaseAttentionType}-creditterm`, className:"credit_term", name:`${formName}[CreditTerm]`, dataTarget:`CreditTerm-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.AttentionItem.creditTerm, onChange:"", specialFeature:[]} ,
                {title:"Credit Limit", id:`${lowercaseFormName}${lowercaseAttentionType}-creditlimit`, className:`decimalDynamicForm inputDecimalTwoPlaces inputDecimalId onchange${lowercaseAttentionType}`, name:`${formName}[CreditLimit]`, dataTarget:`CreditLimit-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Code ", id:`BranchCode-${attentionType}-DetailForm`, className:`dropdownInputBranch reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[BranchCode]`, dataTarget:`BranchCode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[""]},
                {title:"Branch Name", id:`${lowercaseFormName}${lowercaseAttentionType}-branchname`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[BranchName]`, dataTarget:`BranchName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Branch Tel", id:`${lowercaseFormName}${lowercaseAttentionType}-branchtel`, className:`reflect-field phone onchange${lowercaseAttentionType} branchtel${lowercaseAttentionType}`, name:`${formName}[BranchTel]`, dataTarget:`BranchTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Fax", id:`${lowercaseFormName}${lowercaseAttentionType}-branchfax`, className:`reflect-field phone onchange${lowercaseAttentionType} branchemail${lowercaseAttentionType}`, name:`${formName}[BranchFax]`, dataTarget:`BranchFax-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Email", id:`${lowercaseFormName}${lowercaseAttentionType}-branchemail`, className:`reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[BranchEmail]`, dataTarget:`BranchEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 1", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline1`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}[BranchAddressLine1]`, dataTarget:`BranchAddressLine1-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 2", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline2`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}[BranchAddressLine2]`, dataTarget:`BranchAddressLine2-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 3", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline3`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}[BranchAddressLine3]`, dataTarget:`BranchAddressLine3-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Postcode", id:`${lowercaseFormName}${lowercaseAttentionType}-branchpostcode`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchPostcode]`, dataTarget:`BranchPostcode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch City", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcity`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchCity]`, dataTarget:`BranchCity-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Country", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcountry`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchCountry]`, dataTarget:`BranchCountry-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Coordinates", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcoordinates`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchCoordinates]`, dataTarget:`BranchCoordinates-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Attention Name", id:`AttentionName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentionname${lowercaseAttentionType}`, name:`${formName}[AttentionName]`, dataTarget:`AttentionName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text-withModal", onChange:"", specialFeature:[]},
                {title:"Attention Tel", id:`AttentionTel-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentiontel${lowercaseAttentionType}`, name:`${formName}[AttentionTel]`, dataTarget:`AttentionTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Attention Email", id:`AttentionEmail-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentionemail${lowercaseAttentionType}`, name:`${formName}[AttentionEmail]`, dataTarget:`AttentionEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`Valid`, id:`${lowercaseFormName}${lowercaseAttentionType}-valid`, className:``, name:`${formName}[Valid]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:["defaultCheck"]},
            ];

            var elementCustomerType=[
                {title:"Customer Type", id:`${lowercaseFormName}${lowercaseAttentionType}-customertype`, className:`customer_type reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[CustomerType]`, dataTarget:"CustomerType", gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.AttentionItem.customerType, onChange:"", defaultValue:"Others",specialFeature:[]} ,
                {title:"ROC",id:`CompanyROC-${attentionType}-DetailForm`, className:`dropdownInputCompany reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[ROC]`, dataTarget:`CompanyROC-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                {title:"Company Name", id:`CompanyName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[CompanyName]`, dataTarget:`CompanyName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Credit Term", id:`${lowercaseFormName}${lowercaseAttentionType}-creditterm`, className:"credit_term", name:`${formName}[CreditTerm]`, dataTarget:`CreditTerm-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"dropdown", option:props.AttentionItem.creditTerm, onChange:"", specialFeature:[]} ,
                {title:"Credit Limit", id:`${lowercaseFormName}${lowercaseAttentionType}-creditlimit`, className:`decimalDynamicForm inputDecimalTwoPlaces inputDecimalId onchange${lowercaseAttentionType}`, name:`${formName}[CreditLimit]`, dataTarget:`CreditLimit-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Code ", id:`BranchCode-${attentionType}-DetailForm`, className:`dropdownInputBranch reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[BranchCode]`, dataTarget:`BranchCode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[""]},
                {title:"Branch Name", id:`${lowercaseFormName}${lowercaseAttentionType}-branchname`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[BranchName]`, dataTarget:`BranchName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Branch Tel", id:`${lowercaseFormName}${lowercaseAttentionType}-branchtel`, className:`reflect-field phone onchange${lowercaseAttentionType} branchtel${lowercaseAttentionType}`, name:`${formName}[BranchTel]`, dataTarget:`BranchTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Fax", id:`${lowercaseFormName}${lowercaseAttentionType}-branchfax`, className:`reflect-field phone onchange${lowercaseAttentionType} branchemail${lowercaseAttentionType}`, name:`${formName}[BranchFax]`, dataTarget:`BranchFax-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Email", id:`${lowercaseFormName}${lowercaseAttentionType}-branchemail`, className:`reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[BranchEmail]`, dataTarget:`BranchEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 1", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline1`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}[BranchAddressLine1]`, dataTarget:`BranchAddressLine1-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 2", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline2`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}[BranchAddressLine2]`, dataTarget:`BranchAddressLine2-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Address Line 3", id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline3`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}[BranchAddressLine3]`, dataTarget:`BranchAddressLine3-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Postcode", id:`${lowercaseFormName}${lowercaseAttentionType}-branchpostcode`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchPostcode]`, dataTarget:`BranchPostcode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch City", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcity`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchCity]`, dataTarget:`BranchCity-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Country", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcountry`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchCountry]`, dataTarget:`BranchCountry-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Branch Coordinates", id:`${lowercaseFormName}${lowercaseAttentionType}-branchcoordinates`, className:`onchange${lowercaseAttentionType}`, name:`${formName}[BranchCoordinates]`, dataTarget:`BranchCoordinates-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Attention Name", id:`AttentionName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentionname${lowercaseAttentionType}`, name:`${formName}[AttentionName]`, dataTarget:`AttentionName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text-withModal", onChange:"", specialFeature:[]},
                {title:"Attention Tel", id:`AttentionTel-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentiontel${lowercaseAttentionType}`, name:`${formName}[AttentionTel]`, dataTarget:`AttentionTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:"Attention Email", id:`AttentionEmail-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}  attentionemail${lowercaseAttentionType}`, name:`${formName}[AttentionEmail]`, dataTarget:`AttentionEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`Valid`, id:`${lowercaseFormName}${lowercaseAttentionType}-valid`, className:``, name:`${formName}[Valid]`, dataTarget:``, gridSize:"col-xs-12 col-md-12", type:"checkbox", onChange:"", specialFeature:["defaultCheck"]},
            ];

            var elementDepot=[
                {title:"ROC",id:`CompanyROC-${attentionType}-DetailForm`, className:`dropdownInputCompany reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[Depot]`, dataTarget:`CompanyROC-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                {title:"Company Name", id:`CompanyName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[DepotCompanyName]`, dataTarget:`CompanyName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Branch Code ", id:`BranchCode-${attentionType}-DetailForm`, className:`dropdownInputBranch reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[DepotBranch]`, dataTarget:`BranchCode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[""]},
                {title:"Branch Name", id:`${lowercaseFormName}${lowercaseAttentionType}-branchname`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[DepotBranchName]`, dataTarget:`BranchName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},     
            ];
            var elementAgentPartial=[
                {title:"ROC",id:`CompanyROC-${attentionType}-DetailForm`, className:`dropdownInputCompany reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[Agent]`, dataTarget:`CompanyROC-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                {title:"Company Name", id:`CompanyName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[AgentCompanyName]`, dataTarget:`CompanyName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:"Branch Code ", id:`BranchCode-${attentionType}-DetailForm`, className:`dropdownInputBranch reflect-field onchange${lowercaseAttentionType}`, name:`${formName}[AgentBranch]`, dataTarget:`BranchCode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[""]},
                {title:"Branch Name", id:`${lowercaseFormName}${lowercaseAttentionType}-branchname`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}[AgentBranchName]`, dataTarget:`BranchName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},     
            ];
            var elementNotifyAttention=[
                {title:`${SpaceFormName} ROC`, id:`CompanyROC-${attentionType}-DetailForm`, className:`dropdownInputCompany reflect-field onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}Code]`, dataTarget:`CompanyROC-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputCompany", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Company Name`, id:`CompanyName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}PartyExt[${attentionType}CompanyName]`, dataTarget:`CompanyName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:`${SpaceFormName} Branch Code `, id:`BranchCode-${attentionType}-DetailForm`, className:`dropdownInputBranch reflect-field onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchCode]`, dataTarget:`BranchCode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-dropdownInputBranch", onChange:"", specialFeature:[""]},
                {title:`${SpaceFormName} Branch Name`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchname`, className:`reflect-field onchange${lowercaseAttentionType} OriReadOnlyClass`, name:`${formName}PartyExt[${attentionType}BranchName]`, dataTarget:`BranchName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:["readOnly"]},
                {title:`${SpaceFormName} Branch Tel`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchtel`, className:`reflect-field phone onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchTel]`, dataTarget:`BranchTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Fax`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchfax`, className:`reflect-field phone onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchFax]`, dataTarget:`BranchFax-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Email`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchemail`, className:`reflect-field onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchEmail]`, dataTarget:`BranchEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Address Line 1`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline1`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}PartyExt[${attentionType}BranchAddressLine1]`, dataTarget:`BranchAddressLine1-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Address Line 2`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline2`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}PartyExt[${attentionType}BranchAddressLine2]`, dataTarget:`BranchAddressLine2-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Address Line 3`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchaddressline3`, className:`onchange${lowercaseAttentionType} branchAddressDetail${attentionType}`, name:`${formName}PartyExt[${attentionType}BranchAddressLine3]`, dataTarget:`BranchAddressLine3-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Postcode`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchpostcode`, className:`onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchPostcode]`, dataTarget:`BranchPostcode-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch City`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchcity`, className:`onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchCity]`, dataTarget:`BranchCity-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Country`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchcountry`, className:`onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchCountry]`, dataTarget:`BranchCountry-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Branch Coordinates`, id:`${lowercaseFormName}${lowercaseAttentionType}-branchcoordinates`, className:`onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}BranchCoordinates]`, dataTarget:`BranchCoordinates-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Attention Name`, id:`AttentionName-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}AttentionName]`, dataTarget:`AttentionName-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text-withModal", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Attention Tel`, id:`AttentionTel-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}AttentionTel]`, dataTarget:`AttentionTel-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
                {title:`${SpaceFormName} Attention Email`, id:`AttentionEmail-${attentionType}-DetailForm`, className:`reflect-field onchange${lowercaseAttentionType}`, name:`${formName}PartyExt[${attentionType}AttentionEmail]`, dataTarget:`AttentionEmail-${attentionType}`, gridSize:"col-xs-12 col-md-6", type:"input-text", onChange:"", specialFeature:[]},
            ]
            return(
                <div key={index} className={`${lowercaseFormName}-${lowercaseAttentionType}-form`}>
                    <div className="card lvl2">
                        <div className="card-header">
                            <h3 className="card-title">{res.replace(/([A-Z])/g, ' $1').trim()} </h3>
                            {attentionType == "NotifyParty" && <input type="hidden" id="NotifyPartyCopyFrom" /> }
                            {attentionType == "AttentionParty" && <input type="hidden" id="AttentionPartyCopyFrom" /> }
                            {attentionType == "FreightParty" && <input type="hidden" id="FreightPartyCopyFrom" /> }
                            <div className="card-tools">
                                {attentionType == "NotifyParty" && <CopyForm className="notify-party" id="notifypart" dataTransfer="NotifyParty"/>}   
                                {attentionType == "AttentionParty" && <CopyForm className="attention-party" id="attentionparty" dataTransfer="AttentionParty"/>}   
                                {attentionType == "FreightParty" && <CopyForm className="freight-party" id="freightparty" dataTransfer="FreightParty"/>}   
                                <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                    <i className="fas fa-minus" data-toggle="tooltip" title="" data-placement="top" data-original-title="Collapse"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <BuildUIForAttentionCompany props={props} 
                                element={
                                    attentionType !== "NotifyParty" && attentionType !== "AttentionParty"?attentionType=="Depot"?
                                        elementDepot:
                                        (formName=="SalesInvoice" || formName=="SalesCreditNote" || formName=="SalesDebitNote" || formName=="CustomerPayment" || formName=="PurchaseOrder") && attentionType =="Agent"?
                                            elementAgentPartial:
                                            (formName=="SalesInvoice" || formName=="SalesCreditNote" || formName=="SalesDebitNote" || formName=="CustomerPayment") && attentionType =="BillTo"?
                                                elementCustomerType:
                                                (formName=="PurchaseOrder") && attentionType =="Supplier"?
                                                    elementPurchaseOrderSupplier:
                                                    element:
                                        elementNotifyAttention}
                                cardIndex={index}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}
    </>
  )
}

export default DetailFormAttention

function BuildUIForAttentionCompany(props){

    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)

    const formName = props.props.AttentionItem.formName
    const lowercaseFormName = props.props.AttentionItem.formName.toLowerCase()
    const attentionType = props.props.AttentionItem.attentionList
    const dropdownInputStyle = {
        maxHeight: "800px",
        overflowY: "auto",
        maxWidth: "1500px"
      };

      function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
       
    }

    return(
        <>
            {props.element.map((res, index) => {
                    var name = res.name
                    return (res.type === "input-text")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                    <input {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                    :
                                    <input {...props.props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                }
                            </div>
                        </div>
                    ):
                    (res.type === "input-number")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                <input type={"number"} {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                    :   
                                <input type={"number"} {...props.props.register(name)} id={res.id} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                }
                                {console.log(props.props.errors)}
                            </div>
                        </div>
                    ):
                    (res.type === "flatpickr-input")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <Controller 
                                    name={name}
                                    id={res.id}
                                    control={props.props.control}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <Flatpickr
                                                {...props.props.register(name)}
                                                style={{ backgroundColor: "white" }}
                                                value={""}
                                                data-target={res.dataTarget}
                                                onChange={val => {
                                                    val == null ? onChange(null) :onChange(moment(val[0]).format("DD/MM/YYYY"),res.dataTarget);
                                                    val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(moment(val[0]).format("DD/MM/YYYY"),res.dataTarget)
                                                }}
                                                className={`form-control c-date-picker ${res.className}`}
                                                options={{
                                                    dateFormat: "d/m/Y"
                                                }}
        
                                            />
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    ):
                    (res.type === "dropdown")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <Controller
                                    name={name}
                                    control={props.props.control}
                                    data-target={res.dataTarget}
                                    defaultValue={res.defaultValue ? res.defaultValue : ""}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            {...props.props.register(name)}
                                            isClearable={true}
                                            data-target={res.dataTarget}
                                            value={
                                                value
                                                ? res.option?res.option.find((c) => c.value === value)
                                                : null
                                                : null
                                            }
                                            onChange={(val) =>{
                                                val == null ? onChange(null) : onChange(val.value);
                                                val == null ? formContext.setStateHandle(null,res.dataTarget): formContext.setStateHandle(val.value,res.dataTarget)
                                            }}
                                            onKeyDown={handleKeydown}
                                            options={res.option?res.option:""}
                                            className={`form-control ${res.className}`}
                                            classNamePrefix="select"
                                            menuPortalTarget={document.body}
                                            styles={props.props.verificationStatus ? globalContext.customStylesReadonly : globalContext.customStyles}
                                        />
                                    )}
                                />               
                            </div>    
                        </div>
                    ):
                    (res.type === "input-textarea")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                {res.specialFeature.includes("required") ? 
                                <textarea {...props.props.register(name,{required: `${res.title} cannot be blank.`})} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                    :   
                                <textarea {...props.props.register(name)} data-target={res.dataTarget} className={`form-control ${res.className}`}/>
                                }
                                {console.log(props.props.errors)}
                            </div>
                        </div>
                    ):
                    (res.type === "input-dropdownInputCompany")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <input type="hidden" id={`${lowercaseFormName}${attentionType[props.cardIndex].toLowerCase()}-roc`} className={`onchange${attentionType[props.cardIndex].toLowerCase()} form-control`} {...props.props.register(name)} readOnly="readOnly" data-target={`CompanyID-${attentionType[props.cardIndex]}`} />
                                <input defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={`CompanyROC-${attentionType[props.cardIndex]}`} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}${attentionType[props.cardIndex].toLowerCase()}-dropdown d-none`}>    
                                    <table id={`CompanyROC-${res.title.replace(/\s+/g, '')}-DetailForm-Table`}></table>
                                </div>
                            </div>
                        </div>
                    ):
                    (res.type === "input-dropdownInputBranch")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className="form-group">
                                <label className="control-label">{res.title}</label>
                                <input type="hidden" id={`${lowercaseFormName}${attentionType[props.cardIndex].toLowerCase()}-branchcode`} className={`onchange${attentionType[props.cardIndex].toLowerCase()} form-control`}  {...props.props.register(name)} readOnly="readOnly" data-target={`BranchID-${attentionType[props.cardIndex]}`} />
                                <input defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={`BranchCode-${attentionType[props.cardIndex]}`} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                <div style={dropdownInputStyle} className={`dropdownTable ${lowercaseFormName}${attentionType[props.cardIndex].toLowerCase()}-dropdown d-none`}>    
                                    <table id={`BranchCode-${res.title.replace(/\s+/g, '')}-DetailForm-Table`}></table>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (res.type === "input-text-withModal")?
                    (
                        <div key={index} className={res.gridSize}>
                        <div className="form-group">
                            <label className="control-label">{res.title}</label>
                            <div className="input-group">
                                {res.specialFeature.includes("required") ? 
                                    <input {...props.props.register(name,{required: `${res.title} cannot be blank.`})} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                    :
                                    <input {...props.props.register(name)} defaultValue={res.defaultValue} id={res.id} className={`form-control ${res.className}`} data-target={res.dataTarget} readOnly={res.specialFeature.includes("readOnly")?true:false}/>
                                }
                                <div className="input-group-append openAttentionModal" data-refer={`${lowercaseFormName}${attentionType[props.cardIndex].toLowerCase()}-branchcode`}><span className="input-group-text"><i className="fa fa-search" aria-hidden="true"></i></span></div>
                            </div>
                        </div>
                    </div>
                    )
                    :
                    (res.type === "checkbox")?
                    (
                        <div key={index} className={res.gridSize}>
                            <div className={`form-group field-${lowercaseFormName}${attentionType[props.cardIndex].toLowerCase()}-valid`}>
                                <input type={"checkbox"} className="mt-1" id={res.id} onChange={CheckBoxHandle} defaultChecked={res.specialFeature.includes("defaultCheck")? true:false}></input>
                                <input type={"hidden"} className="valid" {...props.props.register(name)} defaultValue={res.specialFeature.includes("defaultCheck")? 1:0}/>
                                <label htmlFor={res.id} className="control-label ml-1">Valid</label>
                            </div>
                        </div>
                    )
                    :
                    (
                        <></>
                    )
                }) 
            }
        </>
    )
}


function CopyForm (props){
    return (
        <div className="btn-group dropdownbar">
            <button type="button" className="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown" data-offset="-52" aria-expanded="false">
                Copy From
            </button>
            <div className="dropdown-menu" role="menu">
                <button className={`dropdown-item copy-${props.className}`} type="button" data-refer="Agent" id={`${props.id}agent`} data-transfer={props.dataTransfer}>Agent</button>
                <button className={`dropdown-item copy-${props.className}`} type="button" data-refer="BillTo" id={`${props.id}billto`} data-transfer={props.dataTransfer}>Bill To</button>
                <button className={`dropdown-item copy-${props.className}`} type="button" data-refer="Shipper" id={`${props.id}shipper`} data-transfer={props.dataTransfer}>Shipper</button>
                <button className={`dropdown-item copy-${props.className}`} type="button" data-refer="Consignee" id={`${props.id}consignee`} data-transfer={props.dataTransfer}>Consignee</button>
                <button className={`dropdown-item copy-${props.className}`} type="button" data-refer="None" id={`${props.id}none`}>None</button>
            </div>
        </div>
    )
    
}