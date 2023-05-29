
import React, { useState, useEffect, useContext } from 'react'
import DetailFormInstruction from '../../Components/CommonElement/DetailFormInstruction'
import FormContext from '../../Components/CommonElement/FormContext';
import $ from "jquery";

function Instruction(props) {

    const formContext = useContext(FormContext)
    var InstructionItem = {
        formName: "SalesCreditNote",
        cardLength: "col-md-12",
        formNameBarge:"SalesCreditNoteBarge",
        instructionList: ["POL", "POD", "FinalDestination", "Voyage"],
    }


    useEffect(() => {

        if (props.instructionData) {
            formContext.setStateHandle([{ label: props.instructionData.VoyageName + "(" + props.instructionData.VesselCode + ")", value: props.instructionData.VoyageNum }], "VoyageNum")
            formContext.setStateHandle([{ label: props.instructionData.VoyageName + "(" + props.instructionData.VesselCode + ")", value: props.instructionData.VoyageNum }], "QuickFormVoyageNum")
                

                if (props.instructionData.POLLocationCode) {
                    formContext.setStateHandle([{ value: props.instructionData.POLLocationCode, label: props.instructionData.pOLLocationCode.PortName }], "OptionPOLTerminal")
                }
                if (props.instructionData.PODLocationCode) {
                    formContext.setStateHandle([{ value: props.instructionData.PODLocationCode, label: props.instructionData.pODLocationCode.PortName }], "OptionPODTerminal")
                }
    
                if (props.instructionData.ShipOperator) {
                    $("#CompanyROC-Voyage-DetailForm").val(props.instructionData.shipOperator.ROC)
                    $("#BranchCode-Voyage-DetailForm").val(props.instructionData.shipOperatorBranchCode.BranchCode)
                
                
                    
                }
                if (props.instructionData.FinalDestinationHandler) {
                    props.setValue("SalesCreditNote[FinalDestinationHandler]", { CompanyUUID: props.instructionData.finalDestinationHandler.CompanyUUID, CompanyName: props.instructionData.finalDestinationHandler.CompanyName })
                }
    
                if (props.instructionData.POLHandlingOfficeCode) {
                 
                    formContext.setStateHandle([{ value: props.instructionData.pOLHandlingOfficeCode.company.CompanyUUID, label: props.instructionData.pOLHandlingOfficeCode.company.CompanyName }], "OptionPOLAgentCompany")
                    props.setValue("SalesCreditNote[POLAgentName]", props.instructionData.pOLHandlingOfficeCode.company.CompanyUUID)
                    props.setValue("SalesCreditNote[POLAgentROC]", props.instructionData.pOLHandlingOfficeCode.company.ROC)
                    formContext.setStateHandle([{ value: props.instructionData.POLHandlingOfficeCode, label: props.instructionData.pOLHandlingOfficeCode.BranchCode }], "OptionPOLAgentCompanyBranch")
                }
    
                if (props.instructionData.PODHandlingOfficeCode) {
                    formContext.setStateHandle([{ value: props.instructionData.pODHandlingOfficeCode.company.CompanyUUID, label: props.instructionData.pODHandlingOfficeCode.company.CompanyName }], "OptionPODAgentCompany")
                    props.setValue("SalesCreditNote[PODAgentName]", props.instructionData.pODHandlingOfficeCode.company.CompanyUUID)
                    props.setValue("SalesCreditNote[PODAgentROC]", props.instructionData.pODHandlingOfficeCode.company.ROC)
                    formContext.setStateHandle([{ value: props.instructionData.PODHandlingOfficeCode, label: props.instructionData.pODHandlingOfficeCode.BranchCode }], "OptionPODAgentCompanyBranch")
                }
        }
        return () => {

        }
    }, [props.instructionData])


    return (
        <div className={`DetailFormDetails Instructions`}>
            <div className="salescreditnote-instruction-form">
                <DetailFormInstruction register={props.register} control={props.control} errors={props.errors} InstructionItem={InstructionItem} setValue={props.setValue} port={props.port} getValues={props.getValues} />
            </div>
        </div>
    )
}

export default Instruction