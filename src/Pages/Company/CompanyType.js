
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, GetChargesByAreaContainer } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";

function CompanyType(props) {
    const globalContext = useContext(GlobalContext);
    const [defaultCompanyType, setDefaultCompanyType] = useState("")
    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({

    });
    const [manualAdd, setManualAdd] = useState(false)
    const [manualAddCompanyType, setManualAddCompanyType] = useState(false)


    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        update,
        replace
    } = useFieldArray({
        control,
        name: "CompanyBranchHasCompanyType" + '[' + props.BranchIndex + ']'
    });

    useEffect(() => {
        if(props.manuallyAdd){
            setManualAdd(true)  
        }
          return () => {
            
          }
      }, [props.manuallyAdd])
  
    useEffect(() => {
        if(manualAdd){
            if(!manualAddCompanyType){
                // var thisBranchIndex=0;
                if(fields.length>0){
                  if(fields[0].Name){  
                   var  thisBranchIndex=fields[0].Name.match(/\[(.*?)\]/)[1];
                  }
                    $.each(fields, function (key, value) {
                        if(key<fields.length-1){
                            remove(key)   
                        }
                    })
                    setValue(`CompanyBranchHasCompanyType[${thisBranchIndex}][0][CompanyBranchHasCompanyTypeUUID]`,"")
                    setValue(`CompanyBranchHasCompanyType[${thisBranchIndex}][0][CompanyType]`,"")
                    setValue(`CompanyBranchHasCompanyType[${thisBranchIndex}][0][AccountCode]`,"")
                    setValue(`CompanyBranchHasCompanyType[${thisBranchIndex}][0][BusinessNature][]`,"")
                }
              
                
            }
        
        }
        return () => {
        }
    }, [fields])

    useEffect(() => {
          return () => {
            setManualAddCompanyType(false)
          }
      }, [manualAddCompanyType])
  
    function appendCompanyType(){
        append({ Name: "" })
        setManualAddCompanyType(true)
    }
    

    function handleChangeCompanyType(val, BranchIndex, CompanyTypeIndex) {
        if (val) {
            val.value == "----boxoperator" ? $(`.Company-Type-BoxOpCode-${BranchIndex}-${CompanyTypeIndex}`).removeClass('d-none') : $(`.Company-Type-BoxOpCode-${BranchIndex}-${CompanyTypeIndex}`).addClass('d-none')
            val.value == "----shipoperator" ? $(`.Company-Type-ShipOpCode-${BranchIndex}-${CompanyTypeIndex}`).removeClass('d-none') : $(`.Company-Type-ShipOpCode-${BranchIndex}-${CompanyTypeIndex}`).addClass('d-none')
            val.value == "----customer" ? $(`.Company-Type-Customer-${BranchIndex}-${CompanyTypeIndex}`).removeClass('d-none') : $(`.Company-Type-Customer-${BranchIndex}-${CompanyTypeIndex}`).addClass('d-none')
            val.value == "----supplier" ? $(`.Company-Type-Supplier-${BranchIndex}-${CompanyTypeIndex}`).removeClass('d-none') : $(`.Company-Type-Supplier-${BranchIndex}-${CompanyTypeIndex}`).addClass('d-none')

            val.value == "----boxoperator" || val.value == "----shipoperator" ? $(`.Company-Type-Port-${BranchIndex}-${CompanyTypeIndex}`).removeClass('d-none') : $(`.Company-Type-Port-${BranchIndex}-${CompanyTypeIndex}`).addClass('d-none')


        }
    }

    function handleOpenMenuCompanyType(options, branchIndex, index) {

        var newArray = []
        //disabled option that already selected
        $.each(options, function (key, value) {
            value.selected = false
        })
        $(".BranchCard").eq(branchIndex).find(".companyType").find(".select__single-value").each(function (key, value) {
            if ($(value).text() !== "" && $(value).text() !== "Ship Operator" && $(value).text() !== "Box Operator") {
                newArray.push($(value).text())
            }
        })
        $.each(options, function (key, value) {

            $.each(newArray, function (key2, value2) {
                if (value2 == value.label) {
                    value.selected = true
                }

            })
        })

    }

    function handleOpenMenuPort(options, branchIndex, index, value) {

        var newArrayShip = []
        var newArrayBox = []
        var newArrayChoosen
        //disabled option that already selected
        $.each(options, function (key, value) {
            value.selected = false
        })
        var type = getValues(`CompanyBranchHasCompanyType[${branchIndex}][${index}][CompanyType]`)
        $(".BranchCard").eq(branchIndex).find(".CompanyTypeCard").find(".CompanyTypeRow").each(function (key, value) {

            if ($(value).find(".companyType").find(":hidden").val() == "----shipoperator") {
                var arrTemp = getValues(`CompanyBranchHasCompanyType[${branchIndex}][${key}][Port][]`)
                if (getValues(`CompanyBranchHasCompanyType[${branchIndex}][${key}][Port][]`)) {
                    newArrayShip = [...new Set([...newArrayShip, ...arrTemp])]
                }

            }

            if ($(value).find(".companyType").find(":hidden").val() == "----boxoperator") {
                var arrTemp = getValues(`CompanyBranchHasCompanyType[${branchIndex}][${key}][Port][]`)
                if (getValues(`CompanyBranchHasCompanyType[${branchIndex}][${key}][Port][]`)) {
                    newArrayBox = [...new Set([...newArrayBox, ...arrTemp])]
                }

            }
        })
        type == "----shipoperator" ? newArrayChoosen = newArrayShip : newArrayChoosen = newArrayBox;

        $.each(options, function (key, value) {
            $.each(newArrayChoosen, function (key2, value2) {
                if (value2 == value.value) {
                    value.selected = true
                }

            })
        })

    }

    useEffect(() => {
        if (props.Type !== "") {
            if (props.Type == "Customer") {
                setDefaultCompanyType("----customer")
            }
            if (props.Type == "Terminal Handler") {
                setDefaultCompanyType("----terminal")
            }

            if (props.Type == "Supplier") {
                setDefaultCompanyType("----supplier")
            }
            if (props.Type == "Agent") {
                setDefaultCompanyType("----agent")
            }
            if (props.Type == "Depot") {
                setDefaultCompanyType("----depot")
            }
            if (props.Type == "Builder") {
                setDefaultCompanyType("----builder")
            }
            if (props.Type == "Hauler") {
                setDefaultCompanyType("----hauler")
            }
            if (props.Type == "Box Operator") {
                setDefaultCompanyType("----boxoperator")
            }
            if (props.Type == "Ship Operator") {
                setDefaultCompanyType("----shipoperator")
            }

        }
        append()

        return () => {

        }
    }, [])


    useEffect(() => {
        append()
        if (props.CompanyTypeData[props.BranchIndex]) {
            var arrayDynamic = []
            $.each(props.CompanyTypeData[props.BranchIndex].companyBranchHasCompanyTypes, function (key, value) {
                var businessNatureData = []
                var portData = []
                if (value.businessNatures.length > 0) {

                    $.each(value.businessNatures, function (key2, value2) {

                        businessNatureData.push(value2.BusinessNatureUUID)
                    })
                }

                if (value.ports.length > 0) {

                    $.each(value.ports, function (key2, value2) {

                        portData.push(value2.AreaUUID)
                    })
                }

                var object = {
                    CompanyBranchHasCompanyTypeUUID: value.CompanyBranchHasCompanyTypeUUID, CompanyType: value.CompanyType, AccountCode: value.AccountCode, BusinessNature: businessNatureData,
                    SupplierType: value.SupplierType, CustomerType: value.CustomerType, BoxOpCode: value.BoxOpCode, ShipOpCode: value.ShipOpCode, Port: portData,Name:`CompanyBranchHasCompanyType[${props.BranchIndex}]`

                }
                arrayDynamic.push(object)
            })
            if (arrayDynamic.length > 0) {
                remove()
                append(arrayDynamic)
            }

        }
        return () => {

        }
    }, [props.CompanyTypeData])


    return (
        <div>
            {fields.map((item, index2) => {
                return (
                    <div className="row CompanyTypeRow" key={item.id}>
                        <div className="mt-4">
                            <button type="button" className="remove-companytype btn btn-danger btn-xs" onClick={() => remove(index2)}><span className="fa fa-times"></span></button>
                        </div>
                        <div className="col-xs-12 col-md-2">
                            <div className="form-group">
                                <label className="control-label" >Company Type
                                </label>
                                <input defaultValue=''   {...register(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyBranchHasCompanyTypeUUID]`)} className={`form-control d-none`} />

                                <Controller
                                    name={`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`}
                                    control={control}
                                    defaultValue={defaultCompanyType}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            {...register(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`)}
                                            value={value ? props.CompanyTypeOptions.find(c => c.value === value) : null}
                                            onMenuOpen={() => { handleOpenMenuCompanyType(props.CompanyTypeOptions, props.BranchIndex, index2) }}
                                            isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                            onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeCompanyType(val, props.BranchIndex, index2) }}
                                            options={props.CompanyTypeOptions}
                                            className="form-control companyType"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}

                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="col-xs-12 col-md-2">
                            <div className="form-group">
                                <label className="control-label">Account Code</label>

                                <input defaultValue=''   {...register(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][AccountCode]`)} className={`form-control`} />
                            </div>
                        </div>


                        <div className="col-xs-12 col-md-2">
                            <div className="form-group">
                                <label className="control-label">Business Nature</label>
                                <Controller
                                    name={`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][BusinessNature][]`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            isMulti
                                            name={`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][BusinessNature][]`}
                                            value={
                                                value
                                                    ? Array.isArray(value)
                                                        ? value.map((c) =>
                                                            props.BusinessNatureOptions.find((z) => z.value === c)
                                                        )
                                                        : props.BusinessNatureOptions.find(
                                                            (c) => c.value === value
                                                        )
                                                    : null
                                            }
                                            onChange={(val) =>
                                                val == null
                                                    ? onChange(null)
                                                    : onChange(val.map((c) => c.value))
                                            }
                                            options={props.BusinessNatureOptions}
                                            className="basic-multiple-select multipleBusinessNature"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className={getValues(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`) == "----customer" ?
                            `col-xs-12 col-md-2 CompanyTypeCustomer Company-Type-Customer-${props.BranchIndex}-${index2}` :
                            `col-xs-12 col-md-2 CompanyTypeCustomer Company-Type-Customer-${props.BranchIndex}-${index2} d-none`
                        }>
                            <div className="form-group">
                                <label className="control-label" >Customer Type
                                </label>
                                <Controller
                                    name={`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CustomerType]`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            {...register(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CustomerType]`)}
                                            value={value ? props.CustomerTypeOptions.find(c => c.value === value) : null}
                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                            options={props.CustomerTypeOptions}
                                            className="form-control customerType"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}

                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className={getValues(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`) == "----supplier" ?
                            `col-xs-12 col-md-2 CompanyTypeSupplier Company-Type-Supplier-${props.BranchIndex}-${index2}` :
                            `col-xs-12 col-md-2 CompanyTypeSupplier Company-Type-Supplier-${props.BranchIndex}-${index2} d-none`
                        }>
                            <div className="form-group">
                                <label className="control-label" >Supplier Type
                                </label>
                                <Controller
                                    name={`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][SupplierType]`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            {...register(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][SupplierType]`)}
                                            value={value ? props.SupplierTypeOptions.find(c => c.value === value) : null}
                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                            options={props.SupplierTypeOptions}
                                            className="form-control supplierType"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}

                                        />
                                    )}
                                />
                            </div>
                        </div>


                        <div className={getValues(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`) == "----boxoperator" ?
                            `col-xs-12 col-md-2 CompanyTypeBoxOpCode Company-Type-BoxOpCode-${props.BranchIndex}-${index2}` :
                            `col-xs-12 col-md-2 CompanyTypeBoxOpCode Company-Type-BoxOpCode-${props.BranchIndex}-${index2} d-none`
                        }>
                            <div className="form-group">
                                <label className="control-label">Box Operator</label>

                                <input defaultValue=''   {...register(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][BoxOpCode]`)} className={`form-control`} />
                            </div>
                        </div>

                        <div className={getValues(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`) == "----shipoperator" ?
                            `col-xs-12 col-md-2 CompanyTypeShipOpCode Company-Type-ShipOpCode-${props.BranchIndex}-${index2}` :
                            `col-xs-12 col-md-2 CompanyTypeShipOpCode Company-Type-ShipOpCode-${props.BranchIndex}-${index2} d-none`
                        }>

                            <div className="form-group">
                                <label className="control-label">Ship Operator</label>

                                <input defaultValue=''   {...register(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][ShipOpCode]`)} className={`form-control`} />
                            </div>
                        </div>

                        <div className={getValues(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`) == "----shipoperator" || getValues(`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][CompanyType]`) == "----boxoperator" ?
                            `col-xs-12 col-md-2 CompanyTypePort Company-Type-Port-${props.BranchIndex}-${index2}` :
                            `col-xs-12 col-md-2 CompanyTypePort Company-Type-Port-${props.BranchIndex}-${index2} d-none`
                        }>
                            <div className="form-group">
                                <label className="control-label">Port</label>
                                <Controller
                                    name={`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][Port][]`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            isMulti
                                            onMenuOpen={() => { handleOpenMenuPort(props.PortCodeOptions, props.BranchIndex, index2, value) }}
                                            isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                            name={`CompanyBranchHasCompanyType[${props.BranchIndex}][${index2}][Port][]`}
                                            value={
                                                value
                                                    ? Array.isArray(value)
                                                        ? value.map((c) =>
                                                            props.PortCodeOptions.find((z) => z.value === c)
                                                        )
                                                        : props.PortCodeOptions.find(
                                                            (c) => c.value === value
                                                        )
                                                    : null
                                            }
                                            onChange={(val) =>
                                                val == null
                                                    ? onChange(null)
                                                    : onChange(val.map((c) => c.value))
                                            }
                                            options={props.PortCodeOptions}
                                            className="basic-multiple-select companyHasPort"
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                    </div>

                )
            })}




            <button type="button" className="add-company-type btn btn-success btn-xs mb-2 mt-2" onClick={() => { appendCompanyType() }} ><span class="fa fa-plus"></span>Add Company Type</button>


        </div>
    )
}

export default CompanyType