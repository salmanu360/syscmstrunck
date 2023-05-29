
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormAttention from "../../Components/CommonElement/DetailFormAttention";

function Attention(props) {

  var AttentionItem ={
    formName:"BookingReservation",
    cardLength:"col-md-12",
    attentionList:["Agent","BillTo","Shipper","Consignee","NotifyParty", "AttentionParty"],
    creditTerm:props.creditTerm,
  }


  useEffect(() => {
    if (props.attentionData) {
      if (props.attentionData.BookingReservationShipper) {

        $.each(props.attentionData.BookingReservationShipper, function (key2, value2) {

          props.setValue('BookingReservationShipper[' + key2 + ']', value2);

        })
        if (props.attentionData.BookingReservationShipper.ROC) {
          $("#CompanyROC-Shipper-DetailForm").val(props.attentionData.BookingReservationShipper.rOC.ROC)
        }
        if (props.attentionData.BookingReservationShipper.BranchCode) {
          $("#BranchCode-Shipper-DetailForm").val(props.attentionData.BookingReservationShipper.branchCode.BranchCode)
        }
      }

      if (props.attentionData.BookingReservationAgent) {

        $.each(props.attentionData.BookingReservationAgent, function (key2, value2) {

          props.setValue('BookingReservationAgent[' + key2 + ']', value2);

        })
        if (props.attentionData.BookingReservationAgent.ROC) {
          $("#CompanyROC-Agent-DetailForm").val(props.attentionData.BookingReservationAgent.rOC.ROC)
        }
        if (props.attentionData.BookingReservationAgent.BranchCode) {
          $("#BranchCode-Agent-DetailForm").val(props.attentionData.BookingReservationAgent.branchCode.BranchCode)
        }
      }


      if (props.attentionData.BookingReservationBillTo) {

        $.each(props.attentionData.BookingReservationBillTo, function (key2, value2) {

          props.setValue('BookingReservationBillTo[' + key2 + ']', value2);

        })
        if (props.attentionData.BookingReservationBillTo.ROC) {
          $("#CompanyROC-BillTo-DetailForm").val(props.attentionData.BookingReservationBillTo.rOC.ROC)
        }
        if (props.attentionData.BookingReservationBillTo.BranchCode) {
          $("#BranchCode-BillTo-DetailForm").val(props.attentionData.BookingReservationBillTo.branchCode.BranchCode)
        }
      }

      if (props.attentionData.BookingReservationConsignee) {

        $.each(props.attentionData.BookingReservationConsignee, function (key2, value2) {

          props.setValue('BookingReservationConsignee[' + key2 + ']', value2);

        })
        if (props.attentionData.BookingReservationConsignee.ROC) {
          $("#CompanyROC-Consignee-DetailForm").val(props.attentionData.BookingReservationConsignee.rOC.ROC)
        }
        if (props.attentionData.BookingReservationConsignee.BranchCode) {
          $("#BranchCode-Consignee-DetailForm").val(props.attentionData.BookingReservationConsignee.branchCode.BranchCode)
        }
      }

      if (props.attentionData.BookingReservationPartyExt) {
        $.each(props.attentionData.BookingReservationPartyExt, function (key2, value2) {
          props.setValue('BookingReservationPartyExt[' + key2 + ']', value2);
        })

        if (props.attentionData.BookingReservationPartyExt.AttentionPartyCode) {
          $("#CompanyROC-AttentionParty-DetailForm").val(props.attentionData.BookingReservationPartyExt.attentionPartyCode.ROC) 
          $("#CompanyName-AttentionParty-DetailForm").val(props.attentionData.BookingReservationPartyExt.attentionPartyCode.CompanyName) 
        }
        if (props.attentionData.BookingReservationPartyExt.NotifyPartyCode) {
          $("#CompanyROC-NotifyParty-DetailForm").val(props.attentionData.BookingReservationPartyExt.notifyPartyCode.ROC) 
          $("#CompanyName-NotifyParty-DetailForm").val(props.attentionData.BookingReservationPartyExt.notifyPartyCode.CompanyName) 
        }

        if (props.attentionData.BookingReservationPartyExt.AttentionPartyBranchCode) {
          $("#BranchCode-AttentionParty-DetailForm").val(props.attentionData.BookingReservationPartyExt.attentionPartyBranchCode.BranchCode) 
        
        }
        if (props.attentionData.BookingReservationPartyExt.NotifyPartyBranchCode) {
          $("#BranchCode-NotifyParty-DetailForm").val(props.attentionData.BookingReservationPartyExt.notifyPartyBranchCode.BranchCode) 
        
        }
      }

    }

    return () => {

    }
  }, [props.attentionData])

  return (
    <div className={`DetailFormDetails Attention`}>
        <div className="bookingreservation-attention-form">
            <DetailFormAttention register={props.register} control={props.control} errors={props.errors} AttentionItem={AttentionItem} setValue={props.setValue}/>
        </div>
    </div>
  ) 
}

export default Attention