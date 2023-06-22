import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, GetChargesByAreaContainer, GetChargesById, GetTaxCodeById, initHoverSelectDropownTitle } from '../../Components/Helper.js'
import Select from 'react-select';
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/flatpickr.min.css";
import moment from "moment";
import $ from "jquery";


function QuickFormInnerContainer(props) {

   
    const globalContext = useContext(GlobalContext);
    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({});
    const arr = [{ value: 'dsdsd', label: 'fsdfsdfd' }]
    var count = 0;
    const {
        fields,
        append,
        update,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "ContainerReleaseOrderHasContainer" + '[' + props.containerIndex + '][ContainerCode]'
    });

    useEffect(() => {
        
        
        remove()
        if (props.innerContainerData) {
            var newData = props.innerContainerData
         
            $.each(newData, function (key, value) {
                if (key == props.containerIndex) {
                    var arrayDynamic = []
                    var newValue = value
                    var arrayOption = []
                  
                    $.each(newValue.ContainerCode, function (key2, value2) {

                        var newValue2 = value2
                        arrayOption.push({ label: value2.ContainerCode, value: value2.ContainerUUID })
                     
                        newValue2.innerContainerItem = innerContainerColumn
                        newValue2.innerContainerItem[0].options = arrayOption
                        newValue2.Name = "ContainerReleaseOrderHasContainer" + '[' + props.containerIndex + '][ContainerCode]'
                        arrayDynamic.push(newValue2)
                    })
             
                    append(arrayDynamic);

                }



            })
        }
        count++

        return () => {

        }
    }, [props.innerContainerData])

    useEffect(() => {
        if(props.checkImportExcelData){
            remove()
            var newData = props.checkImportExcelData
            
            $.each(newData, function (key, value) {
                if (key == props.containerIndex) {
                    var arrayDynamic = []
                    var newValue = value
                    var arrayOption = []
                  
                    $.each(newValue.ContainerCode, function (key2, value2) {
      
                        var newValue2 = value2
                        arrayOption.push({ label: value2.ContainerCode, value: value2.ContainerUUID })
                     
                        newValue2.innerContainerItem = innerContainerColumn
                        newValue2.innerContainerItem[0].options = arrayOption
                        newValue2.Name = "ContainerReleaseOrderHasContainer" + '[' + props.containerIndex + '][ContainerCode]'
                        arrayDynamic.push(newValue2)
                    })
             
                    append(arrayDynamic);
      
                }
      
      
      
            })
          
       }
   
      return () => {
        
      }
    }, [props.checkImportExcelData])
    

    
    useEffect(() => {
        
      if(props.checkSelectContainer){
        remove()
        var newData = props.checkSelectContainer
         
        $.each(newData, function (key, value) {
            if (key == props.containerIndex) {
                var arrayDynamic = []
                var newValue = value
                var arrayOption = []
              
                $.each(newValue.ContainerCode, function (key2, value2) {

                    var newValue2 = value2
                    arrayOption.push({ label: value2.ContainerCode, value: value2.ContainerUUID })
                 
                    newValue2.innerContainerItem = innerContainerColumn
                    newValue2.innerContainerItem[0].options = arrayOption
                    newValue2.Name = "ContainerReleaseOrderHasContainer" + '[' + props.containerIndex + '][ContainerCode]'
                    arrayDynamic.push(newValue2)
                })
         
                append(arrayDynamic);

            }



        })
      }

        return () => {

        }
    }, [props.checkSelectContainer])


    var innerContainerColumn = [
        { columnName: "Container Code", inputType: "single-select", name: "ContainerUUID", fieldClass: "ContainerCode ContainerCodeInner readOnlySelect", class: "", options: arr },
        { columnName: "SealNum", inputType: "input", defaultChecked: true, name: "SealNum", fieldClass: "SealNum form-control", class: "", onChange: "" },



    ]

    function handleAddCharges(index) {
      
        append({ Name: "ContainerReleaseOrderHasContainer" + '[' + index + '][ContainerCode]', innerContainerItem: innerContainerColumn });

    }
    return (
			<div className='card  col-xs-12 col-md-12'>
				<div className='card-body' style={{backgroundColor: "white"}}>
					<div className='table_wrap'>
						<div className='table_wrap_inner'>
							<table
								className='table table-bordered commontable innerChargesTable'
								style={{width: "100%"}}
								id={`innerChargesTable-${props.containerIndex}`}>
								<thead>
									<tr>
										<th>Container Code</th>
										<th>Seal Number</th>
									</tr>
								</thead>
								<tbody>
									{fields.map((item, index) => {
										return (
											<tr key={item.id}>
												{item.innerContainerItem.map((item2, index2) => {
													if (item2.inputType == "input") {
														return (
															<td className={item2.class}>
																<input
																	defaultValue=''
																	{...register(
																		"ContainerReleaseOrderHasContainer" +
																			"[" +
																			props.containerIndex +
																			"][ContainerCode]" +
																			"[" +
																			index +
																			"]" +
																			"[" +
																			item2.name +
																			"]"
																	)}
																	className={`form-control ${
																		item2.fieldClass ? item2.fieldClass : ""
																	}`}
																/>
															</td>
														);
													}

													if (item2.inputType == "single-select") {
														return (
															<td className={item2.class}>
																<Controller
																	name={
																		"ContainerReleaseOrderHasContainer" +
																		"[" +
																		props.containerIndex +
																		"][ContainerCode]" +
																		"[" +
																		index +
																		"]" +
																		"[" +
																		item2.name +
																		"]"
																	}
																	control={control}
																	render={({field: {onChange, value}}) => (
																		<Select
																			isClearable={true}
																			{...register(
																				"ContainerReleaseOrderHasContainer" +
																					"[" +
																					props.containerIndex +
																					"][ContainerCode]" +
																					"[" +
																					index +
																					"]" +
																					"[" +
																					item2.name +
																					"]"
																			)}
																			value={
																				value
																					? item2.options.find(
																							(c) => c.value === value
																					  )
																					: null
																			}
																			onChange={(val) => {
																				val == null
																					? onChange(null)
																					: onChange(val.value);
																				item2.onChange(val, index);
																			}}
																			options={item2.options}
																			isOptionDisabled={(selectedValue) =>
																				selectedValue.selected == true
																			}
																			menuPortalTarget={document.body}
																			className={`basic-single ${
																				item2.fieldClass ? item2.fieldClass : ""
																			}`}
																			classNamePrefix='select'
																			styles={globalContext.customStyles}
																		/>
																	)}
																/>
															</td>
														);
													}
												})}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
}

export default QuickFormInnerContainer