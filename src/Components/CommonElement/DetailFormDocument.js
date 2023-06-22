import React, {useContext, useEffect} from 'react'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Controller } from "react-hook-form";
import moment from "moment";
import Select from 'react-select'
import FormContext from "./FormContext";
import GlobalContext from "../GlobalContext"
import $ from "jquery";
import {CheckBoxHandle} from "../Helper";

function DetailFormDocument(props) {
    const formContext = useContext(FormContext)
    const globalContext = useContext(GlobalContext)
    var QTOption  = []
    if(props.QTOption){
        QTOption = props.QTOption
    }

    function handleKeydown(event){
        var Closest=$(event.target).parent().parent().parent().parent()
        if (event.key !== "Tab") {
            if($(Closest).hasClass("readOnlySelect")){
                event.preventDefault()
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            props.setValue(`${props.DocumentItem.formName}[DocDate]`,formContext.docDate)
            props.setValue(`${props.DocumentItem.formName}[SalesPerson]`,formContext.salesPerson)
            props.setValue(`${props.DocumentItem.formName}[QuotationType]`,formContext.quotationType)
            props.setValue(`${props.DocumentItem.formName}[Currency]`,formContext.defaultCurrency)
        }, 100);

    }, [formContext.docDate,formContext.salesPerson,formContext.quotationType,formContext.defaultCurrency,formContext.formState])

    useEffect(() => {
        if(props.formType == "TransferFromBooking"){
            $(".booking_reservation").addClass("readOnlySelect")
        }else{
            $(".booking_reservation").removeClass("readOnlySelect")
        }
        return () => {
        }
    }, [props.formType])
    

  return (
    <>
        {props.DocumentItem.element.map((res, index) => {
            var name = res.name
            return res.type === "input-text" ? (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									{res.specialFeature.includes("required") ? (
										<input
											{...props.register(name, {
												required: `${res.title} cannot be blank.`,
											})}
											className={`form-control ${res.className}`}
											data-target={res.dataTarget}
											readOnly={
												res.specialFeature.includes("readonly") ? true : false
											}
										/>
									) : (
										<input
											{...props.register(name)}
											defaultValue={res.defaultValue}
											className={`form-control ${res.className}`}
											data-target={res.dataTarget}
											readOnly={
												res.specialFeature.includes("readonly") ? true : false
											}
										/>
									)}
								</div>
							</div>
						) : res.type === "input-text-WithHidden" ? (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									<input
										className={`d-none`}
										{...props.register(name)}
										defaultValue={res.defaultValue}
										data-target={res.dataTarget}
									/>
									<input
										className={`form-control ${res.className}`}
										readOnly={
											res.specialFeature.includes("readonly") ? true : false
										}
									/>
								</div>
							</div>
						) : res.type === "input-number" ? (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									{res.specialFeature.includes("required") ? (
										<input
											type={"number"}
											{...props.register(name, {
												required: `${res.title} cannot be blank.`,
											})}
											data-target={res.dataTarget}
											className={`form-control ${res.className}`}
										/>
									) : (
										<input
											type={"number"}
											{...props.register(name)}
											className={`form-control ${res.className}`}
											data-target={res.dataTarget}
										/>
									)}
								</div>
							</div>
						) : res.type === "checkbox" ? (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<input
										type={"checkbox"}
										className='mt-1'
										id={res.id}
										onChange={CheckBoxHandle}
										defaultChecked={
											res.specialFeature.includes("defaultCheck") ? true : false
										}></input>
									<input
										type={"text"}
										className='valid d-none'
										{...props.register(name)}
										defaultValue={
											res.specialFeature.includes("defaultCheck") ? 1 : 0
										}
									/>
									<label htmlFor={res.id} className='control-label ml-1'>
										{res.title}
									</label>
								</div>
							</div>
						) : res.type === "flatpickr-input" ? (
							<div
								key={index}
								className={`${res.gridSize} ${
									res.specialFeature.includes("hidden") ? "d-none" : ""
								}`}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									<Controller
										name={name}
										id={res.id}
										control={props.control}
										data-target={res.dataTarget}
										render={({field: {onChange, value}}) => (
											<>
												<Flatpickr
													{...props.register(name)}
													style={{backgroundColor: "white"}}
													value={res.value}
													data-target={res.dataTarget}
													onChange={(val) => {
														val == null
															? onChange(null)
															: onChange(
																	moment(val[0]).format("DD/MM/YYYY"),
																	res.dataTarget
															  );
														val == null
															? formContext.setStateHandle(null, res.dataTarget)
															: formContext.setStateHandle(
																	moment(val[0]).format("DD/MM/YYYY"),
																	res.dataTarget
															  );
													}}
													className={`form-control c-date-picker ${res.className}`}
													options={{
														dateFormat: "d/m/Y",
													}}
												/>
											</>
										)}
									/>
								</div>
							</div>
						) : res.type === "dropdown" ? (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									{props.DocumentItem.formName == "ContainerReleaseOrder" ||
									props.DocumentItem.formName == "DeliveryOrder" ? (
										res.title == "BR No." ? (
											<button
												type='button'
												className='BookingLink'
												style={{padding: "0px 2px"}}>
												<i className='fa fa-link'></i>
											</button>
										) : (
											""
										)
									) : (
										""
									)}
									{props.DocumentItem.formName == "ContainerReleaseOrder" ||
									props.DocumentItem.formName == "DeliveryOrder" ||
									props.DocumentItem.formName == "BookingReservation" ? (
										res.title == "QT No." ? (
											<button
												type='button'
												className='QuotationLink'
												style={{padding: "0px 2px"}}>
												<i className='fa fa-link'></i>
											</button>
										) : (
											""
										)
									) : (
										""
									)}
									{props.DocumentItem.formName == "DeliveryOrder" ? (
										res.title == "BL No." ? (
											<button
												type='button'
												className='BillOfLadingLink'
												style={{padding: "0px 2px"}}>
												<i className='fa fa-link'></i>
											</button>
										) : (
											""
										)
									) : (
										""
									)}
									<Controller
										name={name}
										control={props.control}
										defaultValue={res.defaultValue ? res.defaultValue : ""}
										render={({field: {onChange, value}}) => (
											<Select
												{...props.register(name)}
												id={res.id}
												isClearable={true}
												value={
													value
														? res.option
															? res.option.find((c) => c.value === value)
															: null
														: null
												}
												onChange={(val) => {
													val == null ? onChange(null) : onChange(val.value);
													val == null
														? formContext.setStateHandle(null, res.dataTarget)
														: formContext.setStateHandle(
																val.value,
																res.dataTarget
														  );
													res.onChange && res.onChange(val);
												}}
												onKeyDown={handleKeydown}
												options={res.option ? res.option : ""}
												className={`form-control ${res.className}`}
												classNamePrefix='select'
												menuPortalTarget={document.body}
												styles={
													props.verificationStatus
														? globalContext.customStylesReadonly
														: globalContext.customStyles
												}
											/>
										)}
									/>
								</div>
							</div>
						) : res.type === "dropdown-WithModal" ? (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									{props.DocumentItem.formName == "ContainerReleaseOrder" ||
									props.DocumentItem.formName == "DeliveryOrder" ? (
										res.title == "BR No." ? (
											<button
												type='button'
												className='BookingLink'
												style={{padding: "0px 2px"}}>
												<i className='fa fa-link'></i>
											</button>
										) : (
											""
										)
									) : (
										""
									)}
									{props.DocumentItem.formName == "ContainerReleaseOrder" ||
									props.DocumentItem.formName == "DeliveryOrder" ||
									props.DocumentItem.formName == "BookingReservation" ? (
										res.title == "QT No." ? (
											<button
												type='button'
												className='QuotationLink'
												style={{padding: "0px 2px"}}>
												<i className='fa fa-link'></i>
											</button>
										) : (
											""
										)
									) : (
										""
									)}
									{props.DocumentItem.formName == "DeliveryOrder" ? (
										res.title == "BL No." ? (
											<button
												type='button'
												className='BillOfLadingLink'
												style={{padding: "0px 2px"}}>
												<i className='fa fa-link'></i>
											</button>
										) : (
											""
										)
									) : (
										""
									)}
									<Controller
										name={name}
										control={props.control}
										defaultValue={res.defaultValue ? res.defaultValue : ""}
										render={({field: {onChange, value}}) => (
											<Select
												{...props.register(name)}
												id={res.id}
												isClearable={true}
												value={
													value
														? res.option
															? res.option.find((c) => c.value === value)
															: null
														: null
												}
												onChange={(val) => {
													val == null ? onChange(null) : onChange(val.value);
													val == null
														? formContext.setStateHandle(null, res.dataTarget)
														: formContext.setStateHandle(
																val.value,
																res.dataTarget
														  );
													res.onChange && res.onChange(val);
												}}
												onKeyDown={handleKeydown}
												options={res.option ? res.option : ""}
												className={`form-control ${res.className}`}
												classNamePrefix='select'
												menuPortalTarget={document.body}
												styles={
													props.verificationStatus
														? globalContext.customStylesReadonly
														: globalContext.customStyles
												}
											/>
										)}
									/>
								</div>
							</div>
						) : res.type === "dropdown-openMenuFindOption" ? (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									<Controller
										name={name}
										id={res.id}
										control={props.control}
										data-target={res.dataTarget}
										render={({field: {onChange, value}}) => (
											<Select
												{...props.register(name, {
													required: `Booking Reservation cannot be blank.`,
												})}
												isClearable={true}
												data-target={res.dataTarget}
												id={res.id}
												value={
													value
														? res.option.find((c) => c.value === value)
														: null
												}
												onKeyDown={handleKeydown}
												onChange={(val) => {
													val == null ? onChange(null) : onChange(val.value);
												}}
												options={res.option}
												className={`form-control ${res.className} ${
													props.errors[props.DocumentItem.formName]
														? props.errors[props.DocumentItem.formName][
																`BookingReservation`
														  ] && "has-error-select"
														: ""
												}`}
												classNamePrefix='select'
												menuPortalTarget={document.body}
												onMenuOpen={(val) =>
													val == null
														? res.onOpenMenu(null)
														: res.onOpenMenu(val)
												}
												styles={
													props.verificationStatus
														? globalContext.customStylesReadonly
														: globalContext.customStyles
												}
											/>
										)}
									/>
								</div>
								<p>
									{props.errors[props.DocumentItem.formName]
										? props.errors[props.DocumentItem.formName][
												`BookingReservation`
										  ] && (
												<span style={{color: "#A94442"}}>
													{
														props.errors[props.DocumentItem.formName][
															`BookingReservation`
														].message
													}
												</span>
										  )
										: ""}
								</p>
							</div>
						) : (
							<div key={index} className={res.gridSize}>
								<div className='form-group'>
									<label className='control-label'>{res.title}</label>
									{res.specialFeature.includes("required") ? (
										<textarea
											{...props.register(name, {
												required: `${res.title} cannot be blank.`,
											})}
											className={`form-control ${res.className}`}
											readOnly={
												res.specialFeature.includes("readonly") ? true : false
											}
										/>
									) : (
										<textarea
											{...props.register(name)}
											className={`form-control ${res.className}`}
											readOnly={
												res.specialFeature.includes("readonly") ? true : false
											}
										/>
									)}
								</div>
							</div>
						);
        })}
    </>
  )
}

export default DetailFormDocument