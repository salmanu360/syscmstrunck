import React, { useContext, useEffect } from 'react'
import DetailFormInstruction from '../../Components/CommonElement/DetailFormInstruction'
import FormContext from '../../Components/CommonElement/FormContext';
import $ from "jquery";

function Instruction(props) {
  const formContext = useContext(FormContext)

    var InstructionItem ={
        formName:"BookingReservation",
        cardLength:"col-md-12",
        formNameBarge:props.barge?"BookingReservationBarge":"",
        instructionList:["POL","POD","FinalDestination","Voyage"],
    }
    
    useEffect(() => {
        if (props.instructionData) {
            $("#bookingreservation-quickform-dndcombinedday").val(props.instructionData.DNDCombinedDay)
            $("#bookingreservation-quickform-detention").val(props.instructionData.Detention)
            $("#bookingreservation-quickform-demurrage").val(props.instructionData.Demurrage)
            if (props.instructionData.POLLocationCode) {
                formContext.setStateHandle([{ value: props.instructionData.POLLocationCode, label: props.instructionData.pOLLocationCode.PortName }], "OptionPOLTerminal")
            }
            if (props.instructionData.PODLocationCode) {
                formContext.setStateHandle([{ value: props.instructionData.PODLocationCode, label: props.instructionData.pODLocationCode.PortName }], "OptionPODTerminal")
            }

            if (props.instructionData.VoyageNum) {
                formContext.setStateHandle([{ label: props.instructionData.VoyageName + "(" + props.instructionData.VesselCode + ")", value: props.instructionData.VoyageNum }], "VoyageNum")
                // formContext.setStateHandle([{ label: props.instructionData.VoyageName + "(" + props.instructionData.VesselCode + ")", value: props.instructionData.VoyageNum }], "QuickFormVoyageNum")
            }
            if (props.instructionData.ShipOperator) {
                $("#CompanyROC-Voyage-DetailForm").val(props.instructionData.shipOperator.ROC)
                $("#BranchCode-Voyage-DetailForm").val(props.instructionData.shipOperatorBranchCode.BranchCode)
            }

            if (props.instructionData.POLHandlingOfficeCode) {
                formContext.setStateHandle([{ value: props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID, label: props.instructionData.pOLHandlingOfficeCodeCompany.CompanyName }], "OptionPOLAgentCompany")
                props.setValue("BookingReservation[POLAgentName]", props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID)
                props.setValue("BookingReservation[POLAgentROC]", props.instructionData.pOLHandlingOfficeCodeCompany.ROC)
                formContext.setStateHandle([{ value: props.instructionData.POLHandlingOfficeCode, label: props.instructionData.pOLHandlingOfficeCodeCompanyBranch.BranchCode }], "OptionPOLAgentCompanyBranch")
            }else{
                props.setValue("BookingReservation[POLAgentName]", "")
                props.setValue("BookingReservation[POLAgentROC]", "")
            }

            if (props.instructionData.PODHandlingOfficeCode) {
                formContext.setStateHandle([{ value: props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID, label: props.instructionData.pODHandlingOfficeCodeCompany.CompanyName }], "OptionPODAgentCompany")
                props.setValue("BookingReservation[PODAgentName]", props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID)
                props.setValue("BookingReservation[PODAgentROC]", props.instructionData.pODHandlingOfficeCodeCompany.ROC)
                formContext.setStateHandle([{ value: props.instructionData.PODHandlingOfficeCode, label: props.instructionData.pODHandlingOfficeCodeCompanyBranch.BranchCode }], "OptionPODAgentCompanyBranch")
            }else{
                props.setValue("BookingReservation[PODAgentName]", "")
                props.setValue("BookingReservation[PODAgentROC]", "")
            }

            if (props.instructionData.FinalDestinationHandler) {
                props.setValue("BookingReservation[FinalDestinationHandler]", { CompanyUUID: props.instructionData.finalDestinationHandler.CompanyUUID, CompanyName: props.instructionData.finalDestinationHandler.CompanyName })
            }
            if(props.instructionData.InsistTranshipment == '1'){
                $(`input[name='BookingReservation[InsistTranshipment]']`).parent().find("input:checkbox").prop("checked",true)
            }

            if(props.instructionData.AutoBilling == '1'){
                $(`input[name='BookingReservation[AutoBilling]']`).parent().find("input:checkbox").prop("checked",true)
            }
            if(props.instructionData.ApplyDND == '0'){
                $(`#bookingreservation-applydnd`).parent().find("input:checkbox").prop("checked",false)
                $(`#bookingreservation-quickform-applydnd`).prop("checked",false)
                $(".DNDCombined").addClass("d-none")
                $(".DNDCombineDay").addClass("d-none")
                $(".Detention").addClass("d-none")
                $(".Demurrage").addClass("d-none")
            }else{
                if(props.instructionData.DNDCombined == '0'){
                    $(`#bookingreservation-dndcombined`).parent().find("input:checkbox").prop("checked",false)
                    $(`#bookingreservation-quickform-dndcombined`).parent().find("input:checkbox").prop("checked",false)
                    $(".DNDCombineDay").addClass("d-none")
                    $(".Detention").removeClass("d-none")
                    $(".Demurrage").removeClass("d-none")
                }
            }
        }
        return () => {
        }
    }, [props.instructionData])
    
    return (
        <div className={`DetailFormDetails Instructions`}>
            <div className="bookingreservation-instruction-form">
                <DetailFormInstruction register={props.register} control={props.control} errors={props.errors} InstructionItem={InstructionItem} setValue={props.setValue} port={props.port} getValues={props.getValues} instructionData={props.instructionData}/>
            </div>
        </div>
    ) 
}

export default Instruction