
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormAttention from "../../Components/CommonElement/DetailFormAttention";

function Attention(props) {

  var AttentionItem = {
    formName: "DeliveryOrder",
    cardLength: "col-md-12",
    attentionList: ["Agent", "BillTo", "Shipper", "Consignee","NotifyParty", "AttentionParty"],
    creditTerm: props.creditTerm,
  }
  useEffect(() => {

    $(".deliveryorder-agent-form").find("input").prop("readOnly",true)
    $(".deliveryorder-agent-form").find(".select__control").parent().addClass("readOnlySelect")
    $(".deliveryorder-agent-form").find('input[type="checkbox"]').prop("disabled",true)

    $(".deliveryorder-billto-form").find("input").prop("readOnly",true)
    $(".deliveryorder-billto-form").find(".select__control").parent().addClass("readOnlySelect")
    $(".deliveryorder-billto-form").find('input[type="checkbox"]').prop("disabled",true)


    $(".deliveryorder-notifyparty-form").find("input").prop("readOnly",true)
    $(".deliveryorder-notifyparty-form").find(".select__control").parent().addClass("readOnlySelect")
    $(".deliveryorder-notifyparty-form").find('input[type="checkbox"]').prop("disabled",true)

    $(".deliveryorder-attentionparty-form").find("input").prop("readOnly",true)
    $(".deliveryorder-attentionparty-form").find(".select__control").parent().addClass("readOnlySelect")
    $(".deliveryorder-attentionparty-form").find('input[type="checkbox"]').prop("disabled",true)

    
    if (props.attentionData) {


      if (props.attentionData.DeliveryOrderShipper) {

        $.each(props.attentionData.DeliveryOrderShipper, function (key2, value2) {

          props.setValue('DeliveryOrderShipper[' + key2 + ']', value2);

        })
        if (props.attentionData.DeliveryOrderShipper.ROC) {
          $("#CompanyROC-Shipper-DetailForm").val(props.attentionData.DeliveryOrderShipper.rOC.ROC)
        }
        if (props.attentionData.DeliveryOrderShipper.BranchCode) {
          $("#BranchCode-Shipper-DetailForm").val(props.attentionData.DeliveryOrderShipper.branchCode.BranchCode)
        }
      }

      if (props.attentionData.DeliveryOrderAgent) {

        $.each(props.attentionData.DeliveryOrderAgent, function (key2, value2) {

          props.setValue('DeliveryOrderAgent[' + key2 + ']', value2);

        })
        if (props.attentionData.DeliveryOrderAgent.ROC) {
          $("#CompanyROC-Agent-DetailForm").val(props.attentionData.DeliveryOrderAgent.rOC.ROC)
        }
        if (props.attentionData.DeliveryOrderAgent.BranchCode) {
          $("#BranchCode-Agent-DetailForm").val(props.attentionData.DeliveryOrderAgent.branchCode.BranchCode)
        }
        $("#CompanyROC-Agent-Quickform").val(props.attentionData.DeliveryOrderAgent.rOC.CompanyName+"("+props.attentionData.DeliveryOrderAgent.rOC.ROC+")")

        $("#BranchAddressLine1-Agent-Quickform").val(props.attentionData.DeliveryOrderAgent.BranchAddressLine1)
        $("#BranchAddressLine2-Agent-Quickform").val(props.attentionData.DeliveryOrderAgent.BranchAddressLine2)
        $("#BranchAddressLine3-Agent-Quickform").val(props.attentionData.DeliveryOrderAgent.BranchAddressLine3)
      }


      if (props.attentionData.DeliveryOrderBillTo) {

        $.each(props.attentionData.DeliveryOrderBillTo, function (key2, value2) {

          props.setValue('DeliveryOrderBillTo[' + key2 + ']', value2);

        })
        if (props.attentionData.DeliveryOrderBillTo.ROC) {
          $("#CompanyROC-BillTo-DetailForm").val(props.attentionData.DeliveryOrderBillTo.rOC.ROC)
        }
        if (props.attentionData.DeliveryOrderBillTo.BranchCode) {
          $("#BranchCode-BillTo-DetailForm").val(props.attentionData.DeliveryOrderBillTo.branchCode.BranchCode)
        }
      }


      if (props.attentionData.DeliveryOrderConsignee) {

        $.each(props.attentionData.DeliveryOrderConsignee, function (key2, value2) {

          props.setValue('DeliveryOrderConsignee[' + key2 + ']', value2);

        })
        if (props.attentionData.DeliveryOrderConsignee.ROC) {
          $("#CompanyROC-Consignee-DetailForm").val(props.attentionData.DeliveryOrderConsignee.rOC.ROC)
          $("#deliveryorderconsignee-companyname-document").val(props.attentionData.DeliveryOrderConsignee.rOC.CompanyName)
        }
        if (props.attentionData.DeliveryOrderConsignee.BranchCode) {
          $("#BranchCode-Consignee-DetailForm").val(props.attentionData.DeliveryOrderConsignee.branchCode.BranchCode)
        }
      }

      if (props.attentionData.DeliveryOrderPartyExt) {
        $.each(props.attentionData.DeliveryOrderPartyExt, function (key2, value2) {

          props.setValue('DeliveryOrderPartyExt[' + key2 + ']', value2);
        })

        if (props.attentionData.DeliveryOrderPartyExt.AttentionPartyCode) {
          $("#CompanyROC-AttentionParty-DetailForm").val(props.attentionData.DeliveryOrderPartyExt.attentionPartyCode.ROC) 
          $("#CompanyName-AttentionParty-DetailForm").val(props.attentionData.DeliveryOrderPartyExt.attentionPartyCode.CompanyName) 
        }
        if (props.attentionData.DeliveryOrderPartyExt.NotifyPartyCode) {
          $("#CompanyROC-NotifyParty-DetailForm").val(props.attentionData.DeliveryOrderPartyExt.notifyPartyCode.ROC) 
          $("#CompanyName-NotifyParty-DetailForm").val(props.attentionData.DeliveryOrderPartyExt.notifyPartyCode.CompanyName) 
        }

        if (props.attentionData.DeliveryOrderPartyExt.AttentionPartyBranchCode) {
          $("#BranchCode-AttentionParty-DetailForm").val(props.attentionData.DeliveryOrderPartyExt.attentionPartyBranchCode.BranchCode) 
        
        }
        if (props.attentionData.DeliveryOrderPartyExt.NotifyPartyBranchCode) {
          $("#BranchCode-NotifyParty-DetailForm").val(props.attentionData.DeliveryOrderPartyExt.notifyPartyBranchCode.BranchCode) 
        
        }
      }

    }

    return () => {

    }
  }, [props.attentionData])

  return (
    <div className={`DetailFormDetails Attention`}>
      <div className="deliveryorder-attention-form">
        <DetailFormAttention register={props.register} control={props.control} errors={props.errors} AttentionItem={AttentionItem} setValue={props.setValue} />
      </div>
    </div>
  )
}

export default Attention