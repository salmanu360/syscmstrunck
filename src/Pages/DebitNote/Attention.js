
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormAttention from "../../Components/CommonElement/DetailFormAttention";
import FormContext from '../../Components/CommonElement/FormContext';

function Attention(props) {


  const formContext = useContext(FormContext)

  var AttentionItem = {
    formName: "SalesDebitNote",
    cardLength: "col-md-12",
    attentionList: ["BillTo","Agent"],
    creditTerm: props.creditTerm,
    customerType:props.customerType
  }
  useEffect(() => {
   
    if (props.attentionData) {

      if(formContext.formState.formType =="Update"){
        if(formContext.verificationStatus == "Approved"){
            formContext.ApprovedStatusReadOnlyForAllFields()
        }else{
            formContext.RemoveAllReadOnlyFields()
        }
    }
        $.each(props.attentionData, function (key2, value2) {

          props.setValue('SalesDebitNoteBillTo[' + key2 + ']', value2);

        })
        if (props.attentionData.ROC) {
          $("#CompanyROC-BillTo-DetailForm").val(props.attentionData.rOC.ROC)
        }
        if (props.attentionData.BranchCode) {
          $("#BranchCode-BillTo-DetailForm").val(props.attentionData.branchCode.BranchCode)
        }

        if (props.attentionData.Agent) {
          $("#CompanyROC-Agent-DetailForm").val(props.attentionData.agent.ROC)
        }
        if (props.attentionData.AgentBranch) {
          $("#BranchCode-Agent-DetailForm").val(props.attentionData.agentBranch.BranchCode)
        }
      


    }

    return () => {

    }
  }, [props.attentionData])

  return (
    <div className={`DetailFormDetails Attention`}>
      <div className="salesdebitnote-attention-form">
        <DetailFormAttention register={props.register} control={props.control} errors={props.errors} AttentionItem={AttentionItem} setValue={props.setValue} />
      </div>
    </div>
  )
}

export default Attention