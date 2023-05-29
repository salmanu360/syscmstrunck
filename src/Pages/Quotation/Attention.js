
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormAttention from "../../Components/CommonElement/DetailFormAttention";

function Attention(props) {

  var AttentionItem ={
    formName:"Quotation",
    cardLength:"col-md-12",
    attentionList:["Agent","BillTo","Shipper","Consignee","NotifyParty", "AttentionParty"],
    creditTerm:props.creditTerm,
  }


  useEffect(() => {
    if (props.attentionData) {
      if (props.attentionData.QuotationShipper) {

        $.each(props.attentionData.QuotationShipper, function (key2, value2) {

          props.setValue('QuotationShipper[' + key2 + ']', value2);

        })
        if (props.attentionData.QuotationShipper.ROC) {
          $("#CompanyROC-Shipper-DetailForm").val(props.attentionData.QuotationShipper.rOC.ROC)
        }
        if (props.attentionData.QuotationShipper.BranchCode) {
          $("#BranchCode-Shipper-DetailForm").val(props.attentionData.QuotationShipper.branchCode.BranchCode)
        }
      }

      if (props.attentionData.QuotationAgent) {

        $.each(props.attentionData.QuotationAgent, function (key2, value2) {

          props.setValue('QuotationAgent[' + key2 + ']', value2);

        })
        if (props.attentionData.QuotationAgent.ROC) {
          $("#CompanyROC-Agent-DetailForm").val(props.attentionData.QuotationAgent.rOC.ROC)
        }
        if (props.attentionData.QuotationAgent.BranchCode) {
          $("#BranchCode-Agent-DetailForm").val(props.attentionData.QuotationAgent.branchCode.BranchCode)
        }
      }


      if (props.attentionData.QuotationBillTo) {

        $.each(props.attentionData.QuotationBillTo, function (key2, value2) {

          props.setValue('QuotationBillTo[' + key2 + ']', value2);

        })
        if (props.attentionData.QuotationBillTo.ROC) {
          $("#CompanyROC-BillTo-DetailForm").val(props.attentionData.QuotationBillTo.rOC.ROC)
        }
        if (props.attentionData.QuotationBillTo.BranchCode) {
          $("#BranchCode-BillTo-DetailForm").val(props.attentionData.QuotationBillTo.branchCode.BranchCode)
        }
      }

      if (props.attentionData.QuotationConsignee) {

        $.each(props.attentionData.QuotationConsignee, function (key2, value2) {

          props.setValue('QuotationConsignee[' + key2 + ']', value2);

        })
        if (props.attentionData.QuotationConsignee.ROC) {
          $("#CompanyROC-Consignee-DetailForm").val(props.attentionData.QuotationConsignee.rOC.ROC)
        }
        if (props.attentionData.QuotationConsignee.BranchCode) {
          $("#BranchCode-Consignee-DetailForm").val(props.attentionData.QuotationConsignee.branchCode.BranchCode)
        }
      }

      if (props.attentionData.QuotationPartyExt) {
        $.each(props.attentionData.QuotationPartyExt, function (key2, value2) {
          props.setValue('QuotationPartyExt[' + key2 + ']', value2);
        })

        if (props.attentionData.QuotationPartyExt.AttentionPartyCode) {
          $("#CompanyROC-AttentionParty-DetailForm").val(props.attentionData.QuotationPartyExt.attentionPartyCode.ROC) 
          $("#CompanyName-AttentionParty-DetailForm").val(props.attentionData.QuotationPartyExt.attentionPartyCode.CompanyName) 
        }
        if (props.attentionData.QuotationPartyExt.NotifyPartyCode) {
          $("#CompanyROC-NotifyParty-DetailForm").val(props.attentionData.QuotationPartyExt.notifyPartyCode.ROC) 
          $("#CompanyName-NotifyParty-DetailForm").val(props.attentionData.QuotationPartyExt.notifyPartyCode.CompanyName) 
        }

        if (props.attentionData.QuotationPartyExt.AttentionPartyBranchCode) {
          $("#BranchCode-AttentionParty-DetailForm").val(props.attentionData.QuotationPartyExt.attentionPartyBranchCode.BranchCode) 
        
        }
        if (props.attentionData.QuotationPartyExt.NotifyPartyBranchCode) {
          $("#BranchCode-NotifyParty-DetailForm").val(props.attentionData.QuotationPartyExt.notifyPartyBranchCode.BranchCode) 
        
        }
      }

    }

    return () => {

    }
  }, [props.attentionData])

  return (
    <div className={`DetailFormDetails Attention`}>
        <div className="quotation-attention-form">
            <DetailFormAttention register={props.register} control={props.control} errors={props.errors} AttentionItem={AttentionItem} setValue={props.setValue}/>
        </div>
    </div>
  ) 
}

export default Attention