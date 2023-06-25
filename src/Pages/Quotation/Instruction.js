import React, { useContext, useEffect } from 'react'
import DetailFormInstruction from '../../Components/CommonElement/DetailFormInstruction'
import FormContext from '../../Components/CommonElement/FormContext';
import $ from "jquery";
import PodForm from "../../Components/PodForm";

function Instruction(props) {
	const formContext = useContext(FormContext);

	var InstructionItem = {
		formName: "Quotation",
		cardLength: "col-md-12",
		formNameBarge: props.barge ? "QuotationBarge" : "",
		// TODO
		// instructionList: ["POL", "POD", "FinalDestination", "Voyage"],
		instructionList: ["POL", "Voyage"],
	};

	useEffect(() => {
		if (props.instructionData) {
			$("#quotation-quickform-dndcombinedday").val(
				props.instructionData.DNDCombinedDay
			);
			$("#quotation-quickform-detention").val(props.instructionData.Detention);
			$("#quotation-quickform-demurrage").val(props.instructionData.Demurrage);
			if (props.instructionData.POLLocationCode) {
				formContext.setStateHandle(
					[
						{
							value: props.instructionData.POLLocationCode,
							label: props.instructionData.pOLLocationCode.PortName,
						},
					],
					"OptionPOLTerminal"
				);
			}
			if (props.instructionData.PODLocationCode) {
				formContext.setStateHandle(
					[
						{
							value: props.instructionData.PODLocationCode,
							label: props.instructionData.pODLocationCode.PortName,
						},
					],
					"OptionPODTerminal"
				);
			}

			if (props.instructionData.VoyageNum) {
				formContext.setStateHandle(
					[
						{
							label:
								props.instructionData.VoyageName +
								"(" +
								props.instructionData.VesselCode +
								")",
							value: props.instructionData.VoyageNum,
						},
					],
					"VoyageNum"
				);
			}
			if (props.instructionData.ShipOperator) {
				$("#CompanyROC-Voyage-DetailForm").val(
					props.instructionData.shipOperator.ROC
				);
				$("#BranchCode-Voyage-DetailForm").val(
					props.instructionData.shipOperatorBranchCode.BranchCode
				);
			}

			if (props.instructionData.POLHandlingOfficeCode) {
				formContext.setStateHandle(
					[
						{
							value:
								props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID,
							label:
								props.instructionData.pOLHandlingOfficeCodeCompany.CompanyName,
						},
					],
					"OptionPOLAgentCompany"
				);
				props.setValue(
					"Quotation[POLAgentName]",
					props.instructionData.pOLHandlingOfficeCodeCompany.CompanyUUID
				);
				props.setValue(
					"Quotation[POLAgentROC]",
					props.instructionData.pOLHandlingOfficeCodeCompany.ROC
				);
				formContext.setStateHandle(
					[
						{
							value: props.instructionData.POLHandlingOfficeCode,
							label:
								props.instructionData.pOLHandlingOfficeCodeCompanyBranch
									.BranchCode,
						},
					],
					"OptionPOLAgentCompanyBranch"
				);
			}

			if (props.instructionData.PODHandlingOfficeCode) {
				formContext.setStateHandle(
					[
						{
							value:
								props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID,
							label:
								props.instructionData.pODHandlingOfficeCodeCompany.CompanyName,
						},
					],
					"OptionPODAgentCompany"
				);
				props.setValue(
					"Quotation[PODAgentName]",
					props.instructionData.pODHandlingOfficeCodeCompany.CompanyUUID
				);
				props.setValue(
					"Quotation[PODAgentROC]",
					props.instructionData.pODHandlingOfficeCodeCompany.ROC
				);
				formContext.setStateHandle(
					[
						{
							value: props.instructionData.PODHandlingOfficeCode,
							label:
								props.instructionData.pODHandlingOfficeCodeCompanyBranch
									.BranchCode,
						},
					],
					"OptionPODAgentCompanyBranch"
				);
			}

			if (props.instructionData.FinalDestinationHandler) {
				props.setValue("Quotation[FinalDestinationHandler]", {
					CompanyUUID:
						props.instructionData.finalDestinationHandler.CompanyUUID,
					CompanyName:
						props.instructionData.finalDestinationHandler.CompanyName,
				});
			}
			if (props.instructionData.InsistTranshipment == "1") {
				$(`input[name='Quotation[InsistTranshipment]']`)
					.parent()
					.find("input:checkbox")
					.prop("checked", true);
			}

			if (props.instructionData.AutoBilling == "1") {
				$(`input[name='Quotation[AutoBilling]']`)
					.parent()
					.find("input:checkbox")
					.prop("checked", true);
			}
			if (props.instructionData.ApplyDND == "0") {
				$(`#quotation-applydnd`)
					.parent()
					.find("input:checkbox")
					.prop("checked", false);
				$(`#quotation-quickform-applydnd`).prop("checked", false);
				$(".DNDCombined").addClass("d-none");
				$(".DNDCombineDay").addClass("d-none");
				$(".Detention").addClass("d-none");
				$(".Demurrage").addClass("d-none");
			} else {
				if (props.instructionData.DNDCombined == "0") {
					$(`#quotation-dndcombined`)
						.parent()
						.find("input:checkbox")
						.prop("checked", false);
					$(`#quotation-quickform-dndcombined`)
						.parent()
						.find("input:checkbox")
						.prop("checked", false);
					$(".DNDCombineDay").addClass("d-none");
					$(".Detention").removeClass("d-none");
					$(".Demurrage").removeClass("d-none");
				}
			}
		}
		return () => {};
	}, [props.instructionData]);

	return (
		<div className={`DetailFormDetails Instructions`}>
			<div className='quotation-instruction-form'>
				<DetailFormInstruction
					register={props.register}
					control={props.control}
					errors={props.errors}
					InstructionItem={InstructionItem}
					setValue={props.setValue}
					port={props.port}
					getValues={props.getValues}
				/>
				<PodForm />
			</div>
		</div>
	);
}

export default Instruction