
import React, { useState, useEffect, useContext } from 'react'
import DetailFormInstruction from '../../Components/CommonElement/DetailFormInstruction'
import FormContext from '../../Components/CommonElement/FormContext';
import $ from "jquery";

function Instruction(props) {

    const formContext = useContext(FormContext)
    var InstructionItem = {
        formName: "ContainerReleaseOrder",
        cardLength: "col-md-12",
        instructionList: ["POL", "POD", "FinalDestination", "Voyage"],
    }


    useEffect(() => {

        if (props.instructionData) {
            if (props.instructionData.POLLocationCode) {
                formContext.setStateHandle([{ value: props.instructionData.POLLocationCode, label: props.instructionData.pOLLocationCode.PortName }], "OptionPOLTerminal")
            }
            if (props.instructionData.PODLocationCode) {
                formContext.setStateHandle([{ value: props.instructionData.PODLocationCode, label: props.instructionData.pODLocationCode.PortName }], "OptionPODTerminal")
            }

            if (props.instructionData.VoyageNum) {
                formContext.setStateHandle([{ label: props.instructionData.VoyageName + "(" + props.instructionData.VesselCode + ")", value: props.instructionData.VoyageNum }], "VoyageNum")
            }
            if (props.instructionData.ShipOperator) {
                $("#CompanyROC-Voyage-DetailForm").val(props.instructionData.shipOperator.ROC)
                $("#BranchCode-Voyage-DetailForm").val(props.instructionData.shipOperatorBranchCode.BranchCode)
            
            
            }

            if (props.instructionData.POLHandlingOfficeCode) {
                formContext.setStateHandle([{ value: props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID, label: props.instructionData.pOLHandlingOfficeCodeCompany.CompanyName }], "OptionPOLAgentCompany")
                props.setValue("ContainerReleaseOrder[POLAgentName]", props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID)
                props.setValue("ContainerReleaseOrder[POLAgentROC]", props.instructionData.pOLHandlingOfficeCodeCompany.ROC)
                formContext.setStateHandle([{ value: props.instructionData.POLHandlingOfficeCode, label: props.instructionData.pOLHandlingOfficeCodeCompanyBranch.BranchCode }], "OptionPOLAgentCompanyBranch")
            }

            if (props.instructionData.PODHandlingOfficeCode) {
                formContext.setStateHandle([{ value: props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID, label: props.instructionData.pODHandlingOfficeCodeCompany.CompanyName }], "OptionPODAgentCompany")
                props.setValue("ContainerReleaseOrder[PODAgentName]", props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID)
                props.setValue("ContainerReleaseOrder[PODAgentROC]", props.instructionData.pODHandlingOfficeCodeCompany.ROC)
                formContext.setStateHandle([{ value: props.instructionData.PODHandlingOfficeCode, label: props.instructionData.pODHandlingOfficeCodeCompanyBranch.BranchCode }], "OptionPODAgentCompanyBranch")
            }

            if(props.instructionData.AutoBilling == '1'){
                $(`input[name='ContainerReleaseOrder[AutoBilling]']`).parent().find("input:checkbox").prop("checked",true)
            }
            
            if(props.instructionData.InsistTranshipment=="1"){
                $("#containerreleaseorder-insisttranshipment").prop("checked", true)
            }else{
                $("#containerreleaseorder-insisttranshipment").prop("checked", false)
            }
        }
        return () => {

        }
    }, [props.instructionData])


    return (
        <div className={`DetailFormDetails Instructions`}>
            <div className="containerreleaseorder-instruction-form">
                <DetailFormInstruction register={props.register} control={props.control} errors={props.errors} InstructionItem={InstructionItem} setValue={props.setValue} port={props.port} getValues={props.getValues} />
            </div>
        </div>
    )
}

export default Instruction