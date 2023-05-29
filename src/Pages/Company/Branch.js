
import React, { useState, useEffect, useContext } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, GetChargesByAreaContainer } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import CompanyType from "./CompanyType"
import BranchContact from "./BranchContact"

function Branch(props) {

    const globalContext = useContext(GlobalContext);

    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            CompanyBranch: [{ "CompanyBranch[0][BranchName]": "" }]
        }

    });

    const [CompanyTypeData, setCompanyTypeData] = useState([])
    const [branchContact, setBranchContact] = useState([])

    const [removeBranchIndex, setRemoveBranchIndex] = useState("")
    const [manuallyAdd, setManuallyAdd] = useState(false)
    const [manuallyRemove, setManuallyRemove] = useState(false)

    const [branchPortData, setBranchPortData] = useState([])


    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        update,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "CompanyBranch"
    });

    useEffect(() => {
        remove()
        append(props.CompanyBranchData)
        if (props.CompanyBranchData.length > 0) {
            $.each(props.CompanyBranchData, function (key, value) {
                props.setValue(`CompanyBranch[${key}][PortCode]`, value.PortCode);
            })
        }
        setCompanyTypeData((props.CompanyBranchData))
        setBranchContact((props.CompanyBranchData))
        return () => {

        }
    }, [props.CompanyBranchData])

    useEffect(() => {
        props.trigger()
        return () => {

        }
    }, [fields])

    function appendBranch() {
        append({ Name: "" })
        setManuallyAdd(true)
    }

    function removeBranch(index) {
        var tempArray=[]
         $.each(fields,function(key,value){
          tempArray.push({value:props.getValues(`CompanyBranch[${key}][PortCode]`),id:value.id})
        
          
         })
         setBranchPortData(tempArray)
        setManuallyRemove(true)
        remove(index)
    }

    useEffect(() => {
        $.each(fields, function (key, value) {
            if(key==fields.length-1){
                props.setValue(`CompanyBranch[${key}][PortCode]`, "");
            }
        })   

        return () => {
            setManuallyAdd(false)
        }
    }, [manuallyAdd])

    useEffect(() => {
        $.each(fields, function (key, value) {
            if(branchPortData.length>0){
                const filtered = branchPortData.filter((item) => item.id === value.id)
                if(filtered.length>0){
                        props.setValue(`CompanyBranch[${key}][PortCode]`, filtered[0].value);   
                }
            }  
        })
        return () => {
            setManuallyRemove(false)
        }
    }, [manuallyRemove])



    return (
        <div>
            {fields.map((item, index) => {

                return (
                    <div className="card lvl1 BranchCard" key={item.id}>
                        <div className="card-header">
                            <h3 className="card-title">Company Branch</h3>
                            <div className="card-tools">
                                <button type="button" className="remove-branch btn btn-danger btn-xs" onClick={() => removeBranch(index)}><span
                                    className="fa fa-times" data-toggle="tooltip" data-placement="top"
                                    title="Remove"></span></button>
                                <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                    <i className="fas fa-minus" data-toggle="tooltip" data-placement="top"
                                        title="Collapse"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">

                                <div className="card col-xs-12 col-md-12 lvl2">
                                    <div className="card-header">
                                        <h3 className="card-title">Branch Details</h3>
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                <i className="fas fa-minus" data-toggle="tooltip" data-placement="top"
                                                    title="Collapse"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">

                                        <div className="row">
                                            <div className="col-xs-12 col-md-8">
                                                <div className="form-group">
                                                    <label className="control-label">Branch Name</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[CompanyBranchUUID]')} className={`form-control d-none`} />
                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[BranchName]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-md-4">
                                                <div className="form-group">
                                                    <label className="control-label">Branch Code</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[BranchCode]')} className={`form-control`} />
                                                </div>
                                            </div>


                                            <div className="col-xs-12 col-md-3">
                                                <div className="form-group">

                                                    <label className={`control-label ${props.errors.CompanyBranch ? props.errors.CompanyBranch[`${index}`] ? props.errors.CompanyBranch[`${index}`].PortCode ? "has-error-label" : "" : "" : ""}`} >Port Code
                                                    </label>
                                                    <Controller
                                                        name={`CompanyBranch[${index}][PortCode]`}
                                                        control={props.control}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Select
                                                                isClearable={true}
                                                                {...props.register("CompanyBranch" + '[' + index + ']' + '[PortCode]', { required: "Port Code cannot be blank." })}
                                                                value={value ? props.PortCodeOptions.find(c => c.value === value) : null}
                                                                onChange={val => val == null ? onChange(null) : onChange(val.value) }
                                                                options={props.PortCodeOptions}

                                                                className={`form-control portCode ${props.errors.CompanyBranch ? props.errors.CompanyBranch[`${index}`] ? props.errors.CompanyBranch[`${index}`].PortCode ? "has-error-select" : "" : "" : ""}`}
                                                                classNamePrefix="select"
                                                                styles={globalContext.customStyles}

                                                            />
                                                        )}
                                                    />

                                                    <p>{props.errors.CompanyBranch ? props.errors.CompanyBranch[`${index}`] ? props.errors.CompanyBranch[`${index}`].PortCode && <span style={{ color: "#A94442" }}>{`${props.errors.CompanyBranch[`${index}`].PortCode.message}`}</span> : "" : ""}</p>
                                                </div>
                                            </div>




                                            <div className="col-xs-12 col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label">Tel</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[Tel]')} className={`form-control`} />
                                                </div>
                                            </div>


                                            <div className="col-xs-12 col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label">Fax</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[Fax]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label">Email</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[Email]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Website</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[Website]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="card col-md-12">
                                                <div className="card-header">
                                                    <h3 className="card-title">Company Type</h3>
                                                    <div className="card-tools">

                                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                                            <i className="fas fa-minus" data-toggle="tooltip" data-placement="top"
                                                                title="Collapse"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="card-body CompanyTypeCard">

                                                    <CompanyType manuallyAdd={manuallyAdd} Type={props.Type} CompanyTypeData={CompanyTypeData} BranchIndex={index} CompanyTypeOptions={props.CompanyTypeOptions} BusinessNatureOptions={props.BusinessNatureOptions} CustomerTypeOptions={props.CustomerTypeOptions} SupplierTypeOptions={props.SupplierTypeOptions} PortCodeOptions={props.PortCodeOptions} />




                                                </div>
                                            </div>


                                            <div className="col-xs-12 col-md-12">
                                                <div className="form-group">
                                                    <label className="control-label">Address Line 1</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[AddressLine1]')} className={`form-control`} />
                                                </div>
                                            </div>


                                            <div className="col-xs-12 col-md-12">
                                                <div className="form-group">
                                                    <label className="control-label">Address Line 2</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[AddressLine2]')} className={`form-control`} />
                                                </div>
                                            </div>


                                            <div className="col-xs-12 col-md-12">
                                                <div className="form-group">
                                                    <label className="control-label">Address Line 3</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[AddressLine3]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label">Postcode</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[Postcode]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label">City</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[City]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label">Country</label>

                                                    <input defaultValue=''{...register("CompanyBranch" + '[' + index + ']' + '[Country]')} className={`form-control`} />
                                                </div>
                                            </div>


                                            <div className="col-xs-12 col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label">Coordinates</label>
                                                    <input defaultValue='' {...register("CompanyBranch" + '[' + index + ']' + '[Coordinates]')} className={`form-control`} />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-md-3 mt-2">
                                                <div className="form-group mt-4 mb-1">
                                                    <input type="checkbox" className="validCheckboxBranch" id="validCheckboxBranch" defaultChecked />
                                                    <input type="text" className="form-control d-none" defaultValue='1' {...register("CompanyBranch" + '[' + index + ']' + '[Valid]')} />
                                                    <label className="control-label ml-2" htmlFor='validCheckboxBranch'>Valid</label>
                                                </div>
                                            </div>



                                        </div>




                                    </div>




                                </div>



                            </div>
                            <div className="card col-md-12">
                                <div className="card-header">
                                    <h3 className="card-title">Branch Contact</h3>
                                    <div className="card-tools">

                                        <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                            <i className="fas fa-minus" data-toggle="tooltip" data-placement="top"
                                                title="Collapse"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body">


                                    <BranchContact manuallyAdd={manuallyAdd} BranchContactData={branchContact} BranchIndex={index} GenderOptions={props.GenderOptions} TitleOptions={props.TitleOptions} />



                                </div>
                            </div>

                        </div>

                    </div>

                )
            })}




            <button type="button" className="add-branch btn btn-success btn-xs mb-2 mt-2 ml-2" onClick={() => { appendBranch() }} ><span class="fa fa-plus"></span>Add Company Branch</button>


        </div>
    )
}

export default Branch