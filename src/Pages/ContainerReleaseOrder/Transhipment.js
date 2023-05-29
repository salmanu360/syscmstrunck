
import React, { useState, useEffect, useContext } from 'react'
import DetailFormTranshipment from '../../Components/CommonElement/DetailFormTranshipment'
import { useFieldArray} from "react-hook-form";
import $ from "jquery";


function Transhipment(props) {
    var TranshipmentItem ={
        formName:"ContainerReleaseOrder",
        cardLength:"col-md-12",
    }

    useEffect(() => {
        if (props.transhipmentData) {
            if(props.transhipmentData.length >0){
                $.each(props.transhipmentData, function (key, value) {
                    var FromVoyageOption=[]
                    var ToVoyageOption=[]
                    var TerminalOption=[]
                    var HandllingOfficeCode=[]
                    var HandllingOfficeCodeCompany=[]
                    if(value.FromVoyageNum ){
                        FromVoyageOption.push({value:value.FromVoyageNum,label:value.fromVoyage.VoyageNumber})     
                    }
                    if(value.ToVoyageNum ){
                        ToVoyageOption.push({value:value.ToVoyageNum,label:value.toVoyage.VoyageNumber})     
                    }
                    if(value.LocationCode ){
                        TerminalOption.push({value:value.LocationCode,label:value.locationCode.LocationCode})     
                    }
                    if(value.POTHandlingOfficeCode){
                        HandllingOfficeCode.push({value:value.POTHandlingOfficeCode,label:value.pOTHandlingOfficeCodeCompanBranch.BranchCode})     
                        HandllingOfficeCodeCompany.push({value:value.pOTHandlingOfficeCodeCompany.CompanyUUID,label:value.pOTHandlingOfficeCodeCompany.CompanyName}) 
                        value["POTHandlingCompanyCode"]=value.pOTHandlingOfficeCodeCompany.CompanyUUID   
                        value["POTHandlingCompanyROC"]=value.pOTHandlingOfficeCodeCompany.ROC   
                    }
                 
                    value["name"] = "ContainerReleaseOrderHasTranshipment"
                   
                    value["optionTerminal"] = TerminalOption
                    value["optionAgentCompany"] = HandllingOfficeCodeCompany
                    value["optionAgentBranchCode"] =HandllingOfficeCode
                    value["optionFromVoyage"] = FromVoyageOption
                    value["optionToVoyage"] = ToVoyageOption
    
                    props.append(value)
                })
    
    
            }
        
            
        }
    
        return () => {
    
        }
      }, [props.transhipmentData])
    
    
    return (
        <div className={`DetailFormDetails Transhipment`}>
            <div className="containerreleaseorder-transhipment-form">
                <DetailFormTranshipment register={props.register} control={props.control} errors={props.errors} TranshipmentItem={TranshipmentItem} setValue={props.setValue} port={props.port} getValues={props.getValues}/>
            </div>
        </div>
    ) 
}

export default Transhipment