
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, GetChargesByAreaContainer } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";

function BranchContact(props) {
  

    const globalContext = useContext(GlobalContext);

    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({

    });

    const [manualAdd, setManualAdd] = useState(false)
    const [manualAddBranchContact, setManualAddBranchContact] = useState(true)

    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "CompanyContact" + '[' + props.BranchIndex + ']'
    });

    useEffect(() => { 
        if(props.manuallyAdd){
            setManualAdd(true)   
        }
          return () => {
            // setManualAdd(false)   
          }
      }, [props.manuallyAdd])


      useEffect(() => {
        if(manualAdd){
            if(!manualAddBranchContact){
                if(fields.length>0){
                    $.each(fields, function (key, value) {
                        if(key<fields.length-1){
                            remove(key)
                        
                        }

                    })
                }
                 setValue("CompanyContact[0][0][CompanyContactUUID]","")
                 setValue("CompanyContact[0][0][FirstName]","")
                 setValue("CompanyContact[0][0][LastName]","")
                 setValue("CompanyContact[0][0][Title]","")
                 setValue("CompanyContact[0][0][Gender]","")
                 setValue("CompanyContact[0][0][Department]","")
                 setValue("CompanyContact[0][0][Position]","")
                 setValue("CompanyContact[0][0][Tel]","")
                 setValue("CompanyContact[0][0][Fax]","")
                 setValue("CompanyContact[0][0][Email]","")
                 setValue("CompanyContact[0][0][Remark]","")
            }
        
        }
       
     
        return () => {
            
        }
    }, [fields])

    useEffect(() => {
     
  
        return () => {
            setManualAddBranchContact(false)
        }
    }, [manualAddBranchContact])

      useEffect(() => {
      
        if (props.BranchContactData[props.BranchIndex]) {
            var arrayDynamic = []

            $.each(props.BranchContactData[props.BranchIndex].companyContacts, function (key, value) {
 
                arrayDynamic.push(value)
            })
     
            append(arrayDynamic)
        }

        return () => {

        }
    }, [props.BranchContactData])

    function appendBranchContact(){
        append({ Name: "" })
        setManualAddBranchContact(true)
    }
      
    return (
			<div>
				{fields.map((item, index) => {
					return (
						<div className='card' key={item.id}>
							<div className='card-header'>
								<h3 className='card-title'>Contact Details</h3>
								<div className='card-tools'>
									<button
										type='button'
										className='remove-contact btn btn-danger btn-xs'
										onClick={() => remove(index)}>
										<span
											className='fa fa-times'
											data-toggle='tooltip'
											data-placement='top'
											title='Remove'></span>
									</button>
									<button
										type='button'
										className='btn btn-tool'
										data-card-widget='collapse'>
										<i
											className='fas fa-minus'
											data-toggle='tooltip'
											data-placement='top'
											title='Collapse'></i>
									</button>
								</div>
							</div>
							<div className='card-body'>
								<div className='row'>
									<div className='col-xs-12 col-md-3'>
										<div className='form-group'>
											<label className='control-label'>First Name</label>
											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][CompanyContactUUID]`
												)}
												className={`form-control d-none`}
											/>
											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][FirstName]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-3'>
										<div className='form-group'>
											<label className='control-label'>Last Name</label>

											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][LastName]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-1'>
										<div className='form-group'>
											<label className='control-label'>Title</label>
											<Controller
												name={`CompanyContact[${props.BranchIndex}][${index}][Title]`}
												control={control}
												render={({field: {onChange, value}}) => (
													<Select
														isClearable={true}
														{...register(
															`CompanyContact[${props.BranchIndex}][${index}][Title]`
														)}
														value={
															value
																? props.TitleOptions.find(
																		(c) => c.value === value
																  )
																: null
														}
														onChange={(val) =>
															val == null ? onChange(null) : onChange(val.value)
														}
														options={props.TitleOptions}
														className='form-control title'
														classNamePrefix='select'
														styles={globalContext.customStyles}
													/>
												)}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-1'>
										<div className='form-group'>
											<label className='control-label'>Gender</label>
											<Controller
												name={`CompanyContact[${props.BranchIndex}][${index}][Gender]`}
												control={control}
												render={({field: {onChange, value}}) => (
													<Select
														isClearable={true}
														{...register(
															`CompanyContact[${props.BranchIndex}][${index}][Gender]`
														)}
														value={
															value
																? props.GenderOptions.find(
																		(c) => c.value === value
																  )
																: null
														}
														onChange={(val) =>
															val == null ? onChange(null) : onChange(val.value)
														}
														options={props.GenderOptions}
														className='form-control gender'
														classNamePrefix='select'
														styles={globalContext.customStyles}
													/>
												)}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-2'>
										<div className='form-group'>
											<label className='control-label'>Department</label>

											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][Department]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-2'>
										<div className='form-group'>
											<label className='control-label'>Position</label>

											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][Position]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-2'>
										<div className='form-group'>
											<label className='control-label'>Tel</label>

											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][Tel]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-2'>
										<div className='form-group'>
											<label className='control-label'>Fax</label>

											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][Fax]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-2'>
										<div className='form-group'>
											<label className='control-label'>Email</label>

											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][Email]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>

									<div className='col-xs-12 col-md-6'>
										<div className='form-group'>
											<label className='control-label'>Remark</label>

											<input
												defaultValue=''
												{...register(
													`CompanyContact[${props.BranchIndex}][${index}][Remark]`
												)}
												className={`form-control`}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}

				<button
					type='button'
					className='add-contact btn btn-success btn-xs mb-2 mt-2'
					onClick={() => {
						appendBranchContact();
					}}>
					<span className='fa fa-plus'></span>Add Branch Contact
				</button>
			</div>
		);
}

export default BranchContact