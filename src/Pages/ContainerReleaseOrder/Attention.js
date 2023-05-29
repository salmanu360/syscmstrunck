
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormAttention from "../../Components/CommonElement/DetailFormAttention";

function Attention(props) {

  var AttentionItem = {
    formName: "ContainerReleaseOrder",
    cardLength: "col-md-12",
    attentionList: ["Agent", "BillTo", "Shipper", "Consignee","NotifyParty", "AttentionParty","Depot"],
    creditTerm: props.creditTerm,
  }
  useEffect(() => {
    if (props.attentionData) {


      if (props.attentionData.ContainerReleaseOrderShipper) {

        $.each(props.attentionData.ContainerReleaseOrderShipper, function (key2, value2) {

          props.setValue('ContainerReleaseOrderShipper[' + key2 + ']', value2);

        })
        if (props.attentionData.ContainerReleaseOrderShipper.ROC) {
          $("#CompanyROC-Shipper-DetailForm").val(props.attentionData.ContainerReleaseOrderShipper.rOC.ROC)
        }
        if (props.attentionData.ContainerReleaseOrderShipper.BranchCode) {
          $("#BranchCode-Shipper-DetailForm").val(props.attentionData.ContainerReleaseOrderShipper.branchCode.BranchCode)
        }
      }

      if (props.attentionData.ContainerReleaseOrderAgent) {

        $.each(props.attentionData.ContainerReleaseOrderAgent, function (key2, value2) {

          props.setValue('ContainerReleaseOrderAgent[' + key2 + ']', value2);

        })
        if (props.attentionData.ContainerReleaseOrderAgent.ROC) {
          $("#CompanyROC-Agent-DetailForm").val(props.attentionData.ContainerReleaseOrderAgent.rOC.ROC)
        }
        if (props.attentionData.ContainerReleaseOrderAgent.BranchCode) {
          $("#BranchCode-Agent-DetailForm").val(props.attentionData.ContainerReleaseOrderAgent.branchCode.BranchCode)
        }
      }


      if (props.attentionData.ContainerReleaseOrderBillTo) {

        $.each(props.attentionData.ContainerReleaseOrderBillTo, function (key2, value2) {

          props.setValue('ContainerReleaseOrderBillTo[' + key2 + ']', value2);

        })
        if (props.attentionData.ContainerReleaseOrderBillTo.ROC) {
          $("#CompanyROC-BillTo-DetailForm").val(props.attentionData.ContainerReleaseOrderBillTo.rOC.ROC)
        }
        if (props.attentionData.ContainerReleaseOrderBillTo.BranchCode) {
          $("#BranchCode-BillTo-DetailForm").val(props.attentionData.ContainerReleaseOrderBillTo.branchCode.BranchCode)
        }
      }


      
      if (props.attentionData.ContainerReleaseOrderDepot) {
         props.setValue("ContainerReleaseOrderDepot[ROC]",props.attentionData.ContainerReleaseOrderDepot.Depot.CompanyUUID)
         props.setValue("ContainerReleaseOrder[DepotCompanyName]",props.attentionData.ContainerReleaseOrderDepot.Depot.CompanyName)
         $("#CompanyROC-Depot-DetailForm").val(props.attentionData.ContainerReleaseOrderDepot.Depot.ROC)
         props.setValue("ContainerReleaseOrderDepot[BranchCode]",props.attentionData.ContainerReleaseOrderDepot.DepotBranch.CompanyBranchUUID)
         props.setValue("ContainerReleaseOrder[DepotBranchName]",props.attentionData.ContainerReleaseOrderDepot.DepotBranch.BranchName)
         $("#BranchCode-Depot-DetailForm").val(props.attentionData.ContainerReleaseOrderDepot.DepotBranch.BranchCode)
   
      }


      if (props.attentionData.ContainerReleaseOrderConsignee) {

        $.each(props.attentionData.ContainerReleaseOrderConsignee, function (key2, value2) {

          props.setValue('ContainerReleaseOrderConsignee[' + key2 + ']', value2);

        })
        if (props.attentionData.ContainerReleaseOrderConsignee.ROC) {
          $("#CompanyROC-Consignee-DetailForm").val(props.attentionData.ContainerReleaseOrderConsignee.rOC.ROC)
        }
        if (props.attentionData.ContainerReleaseOrderConsignee.BranchCode) {
          $("#BranchCode-Consignee-DetailForm").val(props.attentionData.ContainerReleaseOrderConsignee.branchCode.BranchCode)
        }
      }

      if (props.attentionData.ContainerReleaseOrderPartyExt) {
        $.each(props.attentionData.ContainerReleaseOrderPartyExt, function (key2, value2) {

          props.setValue('ContainerReleaseOrderPartyExt[' + key2 + ']', value2);
        

        })

        if (props.attentionData.ContainerReleaseOrderPartyExt.AttentionPartyCode) {
          $("#CompanyROC-AttentionParty-DetailForm").val(props.attentionData.ContainerReleaseOrderPartyExt.attentionPartyCode.ROC) 
          $("#CompanyName-AttentionParty-DetailForm").val(props.attentionData.ContainerReleaseOrderPartyExt.attentionPartyCode.CompanyName) 
        }
        if (props.attentionData.ContainerReleaseOrderPartyExt.NotifyPartyCode) {
          $("#CompanyROC-NotifyParty-DetailForm").val(props.attentionData.ContainerReleaseOrderPartyExt.notifyPartyCode.ROC) 
          $("#CompanyName-NotifyParty-DetailForm").val(props.attentionData.ContainerReleaseOrderPartyExt.notifyPartyCode.CompanyName) 
        }

        if (props.attentionData.ContainerReleaseOrderPartyExt.AttentionPartyBranchCode) {
          $("#BranchCode-AttentionParty-DetailForm").val(props.attentionData.ContainerReleaseOrderPartyExt.attentionPartyBranchCode.BranchCode) 
        
        }
        if (props.attentionData.ContainerReleaseOrderPartyExt.NotifyPartyBranchCode) {
          $("#BranchCode-NotifyParty-DetailForm").val(props.attentionData.ContainerReleaseOrderPartyExt.notifyPartyBranchCode.BranchCode) 
        
        }
      }

    }

    return () => {

    }
  }, [props.attentionData])

  return (
    <div className={`DetailFormDetails Attention`}>
      <div className="containerreleaseorder-attention-form">
        <DetailFormAttention register={props.register} control={props.control} errors={props.errors} AttentionItem={AttentionItem} setValue={props.setValue} />
      </div>
    </div>
  )
}

export default Attention