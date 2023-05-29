
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormAttention from "../../Components/CommonElement/DetailFormAttention";

function Attention(props) {

  var AttentionItem = {
    formName: "BillOfLading",
    cardLength: "col-md-12",
    attentionList: ["Agent", "BillTo", "Shipper", "Consignee","NotifyParty", "AttentionParty","FreightParty"],
    creditTerm: props.creditTerm,
  }
  useEffect(() => {
    if (props.attentionData) {


      if (props.attentionData.BillOfLadingShipper) {

        $.each(props.attentionData.BillOfLadingShipper, function (key2, value2) {

          props.setValue('BillOfLadingShipper[' + key2 + ']', value2);

        })
        if (props.attentionData.BillOfLadingShipper.ROC) {
          $("#CompanyROC-Shipper-DetailForm").val(props.attentionData.BillOfLadingShipper.rOC.ROC)
        }
        if (props.attentionData.BillOfLadingShipper.BranchCode) {
          $("#BranchCode-Shipper-DetailForm").val(props.attentionData.BillOfLadingShipper.branchCode.BranchCode)
        }
      }

      if (props.attentionData.BillOfLadingAgent) {

        $.each(props.attentionData.BillOfLadingAgent, function (key2, value2) {

          props.setValue('BillOfLadingAgent[' + key2 + ']', value2);

        })
        if (props.attentionData.BillOfLadingAgent.ROC) {
          $("#CompanyROC-Agent-DetailForm").val(props.attentionData.BillOfLadingAgent.rOC.ROC)
        }
        if (props.attentionData.BillOfLadingAgent.BranchCode) {
          $("#BranchCode-Agent-DetailForm").val(props.attentionData.BillOfLadingAgent.branchCode.BranchCode)
        }
      }
      
      if (props.attentionData.BillOfLadingFreightParty) {
        $.each(props.attentionData.BillOfLadingFreightParty, function (key2, value2) {

          props.setValue('BillOfLadingFreightParty[' + key2 + ']', value2);

        })
        if (props.attentionData.BillOfLadingFreightParty.ROC) {
          $("#CompanyROC-FreightParty-DetailForm").val(props.attentionData.BillOfLadingFreightParty.rOC.ROC)
        }
        if (props.attentionData.BillOfLadingFreightParty.BranchCode) {
          $("#BranchCode-FreightParty-DetailForm").val(props.attentionData.BillOfLadingFreightParty.branchCode.BranchCode)
        }
      }


      if (props.attentionData.BillOfLadingBillTo) {

        $.each(props.attentionData.BillOfLadingBillTo, function (key2, value2) {

          props.setValue('BillOfLadingBillTo[' + key2 + ']', value2);

        })
        if (props.attentionData.BillOfLadingBillTo.ROC) {
          $("#CompanyROC-BillTo-DetailForm").val(props.attentionData.BillOfLadingBillTo.rOC.ROC)
        }
        if (props.attentionData.BillOfLadingBillTo.BranchCode) {
          $("#BranchCode-BillTo-DetailForm").val(props.attentionData.BillOfLadingBillTo.branchCode.BranchCode)
        }
      }


      
      if (props.attentionData.BillOfLadingDepot) {
         props.setValue("BillOfLadingDepot[ROC]",props.attentionData.BillOfLadingDepot.Depot.CompanyUUID)
         props.setValue("BillOfLadingDepot[CompanyName]",props.attentionData.BillOfLadingDepot.Depot.CompanyName)
         $("#CompanyROC-Depot-DetailForm").val(props.attentionData.BillOfLadingDepot.Depot.ROC)
         props.setValue("BillOfLadingDepot[BranchCode]",props.attentionData.BillOfLadingDepot.DepotBranch.CompanyBranchUUID)
         props.setValue("BillOfLadingDepot[BranchName]",props.attentionData.BillOfLadingDepot.DepotBranch.BranchName)
         $("#BranchCode-Depot-DetailForm").val(props.attentionData.BillOfLadingDepot.DepotBranch.BranchCode)
   
      }


      if (props.attentionData.BillOfLadingConsignee) {

        $.each(props.attentionData.BillOfLadingConsignee, function (key2, value2) {

          props.setValue('BillOfLadingConsignee[' + key2 + ']', value2);

        })
        if (props.attentionData.BillOfLadingConsignee.ROC) {
          $("#CompanyROC-Consignee-DetailForm").val(props.attentionData.BillOfLadingConsignee.rOC.ROC)
        }
        if (props.attentionData.BillOfLadingConsignee.BranchCode) {
          $("#BranchCode-Consignee-DetailForm").val(props.attentionData.BillOfLadingConsignee.branchCode.BranchCode)
        }
      }

      if (props.attentionData.BillOfLadingPartyExt) {
        $.each(props.attentionData.BillOfLadingPartyExt, function (key2, value2) {

          props.setValue('BillOfLadingPartyExt[' + key2 + ']', value2);
        })

        if (props.attentionData.BillOfLadingPartyExt.AttentionPartyCode) {
          $("#CompanyROC-AttentionParty-DetailForm").val(props.attentionData.BillOfLadingPartyExt.attentionPartyCode.ROC) 
          $("#CompanyName-AttentionParty-DetailForm").val(props.attentionData.BillOfLadingPartyExt.attentionPartyCode.CompanyName) 
        }
        if (props.attentionData.BillOfLadingPartyExt.NotifyPartyCode) {
          $("#CompanyROC-NotifyParty-DetailForm").val(props.attentionData.BillOfLadingPartyExt.notifyPartyCode.ROC) 
          $("#CompanyName-NotifyParty-DetailForm").val(props.attentionData.BillOfLadingPartyExt.notifyPartyCode.CompanyName) 
        }

        if (props.attentionData.BillOfLadingPartyExt.AttentionPartyBranchCode) {
          $("#BranchCode-AttentionParty-DetailForm").val(props.attentionData.BillOfLadingPartyExt.attentionPartyBranchCode.BranchCode) 
        
        }
        if (props.attentionData.BillOfLadingPartyExt.NotifyPartyBranchCode) {
          $("#BranchCode-NotifyParty-DetailForm").val(props.attentionData.BillOfLadingPartyExt.notifyPartyBranchCode.BranchCode) 
        
        }
      }

    }

    return () => {

    }
  }, [props.attentionData])

  return (
    <div className={`DetailFormDetails Attention`}>
      <div className="billoflading-attention-form">
        <DetailFormAttention register={props.register} control={props.control} errors={props.errors} AttentionItem={AttentionItem} setValue={props.setValue} />
      </div>
    </div>
  )
}

export default Attention