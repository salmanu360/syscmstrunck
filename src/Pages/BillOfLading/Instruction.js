
import React, { useState, useEffect, useContext } from 'react'
import DetailFormInstruction from '../../Components/CommonElement/DetailFormInstruction'
import FormContext from '../../Components/CommonElement/FormContext';
import $ from "jquery";

function Instruction(props) {

    const formContext = useContext(FormContext)
    var InstructionItem = {
        formName: "BillOfLading",
        formNameBarge:props.barge?"BillOfLadingBarge":"",
        cardLength: "col-md-12",
        instructionList: ["POL", "POD", "FinalDestination", "Voyage"],
    }


    useEffect(() => {
        $(".AllScheduleVoyage").addClass("readOnlySelect")
        $(".AllScheduleVoyage").parent().find(".input-group-append").remove()

        $("#billoflading-polscncode").attr("readonly",true)
        $("#billoflading-podscncode").attr("readonly",true)
        $(".field-billoflading-autobilling").addClass("d-none")

        $("#billoflading-podscncode").attr("readonly",true)
        $("#billoflading-podscncode").attr("readonly",true)
      
        if (props.instructionData) {
            
            if (props.instructionData.POLLocationCode) {
                formContext.setStateHandle([{ value: props.instructionData.POLLocationCode, label: props.instructionData.pOLLocationCode.PortName }], "OptionPOLTerminal")
            }
            if (props.instructionData.PODLocationCode) {
                formContext.setStateHandle([{ value: props.instructionData.PODLocationCode, label: props.instructionData.pODLocationCode.PortName }], "OptionPODTerminal")
            }

            if (props.instructionData.VoyageNum) {
                $("#VesselQuickForm").val(props.instructionData.VesselName)
                $("#VoyNo").val(props.instructionData.VoyageName + "(" + props.instructionData.VesselCode + ")")
                $("#BLNo").val(props.instructionData.DocNum)
                $("#portOfLoading").val(props.instructionData.POLAreaName)
                $("#portOfDischarge").val(props.instructionData.PODAreaName)
                $("#freightPayable").val(props.instructionData.POLAreaName)
                formContext.setStateHandle([{ label: props.instructionData.VoyageName + "(" + props.instructionData.VesselCode + ")", value: props.instructionData.VoyageNum }], "VoyageNum")
            }
            if (props.instructionData.ShipOperator) {
                $("#CompanyROC-Voyage-DetailForm").val(props.instructionData.shipOperator.ROC)
                $("#BranchCode-Voyage-DetailForm").val(props.instructionData.shipOperatorBranchCode.BranchCode)
            
            
            }

            if (props.instructionData.POLHandlingOfficeCode) {
                formContext.setStateHandle([{ value: props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID, label: props.instructionData.pOLHandlingOfficeCodeCompany.CompanyName }], "OptionPOLAgentCompany")
                props.setValue("BillOfLading[POLAgentName]", props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID)
                props.setValue("BillOfLading[POLAgentROC]", props.instructionData.pOLHandlingOfficeCodeCompany.ROC)
                formContext.setStateHandle([{ value: props.instructionData.POLHandlingOfficeCode, label: props.instructionData.pOLHandlingOfficeCodeCompanyBranch.BranchCode }], "OptionPOLAgentCompanyBranch")
            }

            if (props.instructionData.PODHandlingOfficeCode) {
                formContext.setStateHandle([{ value: props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID, label: props.instructionData.pODHandlingOfficeCodeCompany.CompanyName }], "OptionPODAgentCompany")
                props.setValue("BillOfLading[PODAgentName]", props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID)
                props.setValue("BillOfLading[PODAgentROC]", props.instructionData.pODHandlingOfficeCodeCompany.ROC)
                formContext.setStateHandle([{ value: props.instructionData.PODHandlingOfficeCode, label: props.instructionData.pODHandlingOfficeCodeCompanyBranch.BranchCode }], "OptionPODAgentCompanyBranch")
            }

            if (props.instructionData.FinalDestinationHandler) {
                props.setValue("BillOfLading[FinalDestinationHandler]", { CompanyUUID: props.instructionData.finalDestinationHandler.CompanyUUID, CompanyName: props.instructionData.finalDestinationHandler.CompanyName })
            }

            if(props.instructionData.InsistTranshipment=="1"){
                $("#billoflading-insisttranshipment").prop("checked", true)
            }else{
                $("#billoflading-insisttranshipment").prop("checked", false)
            }
            if(props.instructionData.ApplyDND == '0'){
                $(`#billoflading-applydnd`).parent().find("input:checkbox").prop("checked",false)
                $(".DNDCombined").addClass("d-none")
                $(".DNDCombineDay").addClass("d-none")
                $(".Detention").addClass("d-none")
                $(".Demurrage").addClass("d-none")
            }else{
                if(props.instructionData.DNDCombined == '0'){
                    $(`#billoflading-dndcombined`).parent().find("input:checkbox").prop("checked",false)
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
				<div className='billoflading-instruction-form'>
					<DetailFormInstruction
						register={props.register}
						control={props.control}
						errors={props.errors}
						InstructionItem={InstructionItem}
						setValue={props.setValue}
						port={props.port}
						getValues={props.getValues}
					/>
				</div>
			</div>
		);
}

export default Instruction