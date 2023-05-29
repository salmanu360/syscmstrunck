
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import DetailFormHauler from "../../Components/CommonElement/DetailFormHauler";

function Hauler(props) {

  var HaulerItem ={
    formName:"BookingReservation",
    cardLength:"col-md-12",
    haulerList:["POL","POD"],
    creditTerm:props.creditTerm,
  }

  useEffect(() => {
    
    if (props.haulerData) {   
        $.each(props.haulerData, function (key2, value2) {

          props.setValue('BookingReservationHauler[' + key2 + ']', value2);
      
        })

        if(props.haulerData.POLHaulerCode){
            $("#CompanyROC-POLHauler-DetailForm").val(props.haulerData.pOLHaulerCode.ROC)
            $("#BranchCode-POLHauler-DetailForm").val(props.haulerData.pOLHaulerBranchCode.BranchCode)
        }
        if(props.haulerData.PODHaulerCode){
          $("#CompanyROC-PODHauler-DetailForm").val(props.haulerData.pODHaulerCode.ROC)
          $("#BranchCode-PODHauler-DetailForm").val(props.haulerData.pODHaulerBranchCode.BranchCode)
      }
  }
     return () => {
 
     }
   }, [props.haulerData])

  return (
    <div className={`DetailFormDetails Hauler`}>
        <div className="bookingreservation-hauler-form">
            <DetailFormHauler register={props.register} control={props.control} errors={props.errors} HaulerItem={HaulerItem} setValue={props.setValue}/>
        </div>
    </div>
  ) 
}

export default Hauler