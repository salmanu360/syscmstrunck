
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useForm, Controller, setValue, useFieldArray } from "react-hook-form";
import GlobalContext from "../../Components/GlobalContext";
import { createCookie, getCookie, GetGroupChargesByAreaContainer, GetChargesByAreaContainer, sortArray } from '../../Components/Helper.js'
import { initHoverSelectDropownTitle } from '../../Components/Helper.js'
import Select from 'react-select';
import $ from "jquery";
import NestedContainerCharges from './NestedContainerCharges';


function ContainerCharges(props) {

    const ContainerRef = useRef(null);
    const globalContext = useContext(GlobalContext);

    const { register, handleSubmit, setValue, getValues, reset, control, watch, formState: { errors } } = useForm({
        defaultValues: {
            ContainerType: [{ ContainerType: "" }]
        }
    });

    const [selectedValue, setSelectedValue] = useState([])
    const [selectedOri, setSelectedOri] = useState([])
    const [containerIndex, setContainerIndex] = useState("")

    const [onChangeContainerTypeCharges, setOnChangeContainerTypeCharges] = useState([])
    const [onChangeCurrencyTypeCharges, setOnChangeCurrencyTypeCharges] = useState([])

    const [chargesByContainer, setChargesByContainer] = useState([])
    const [resetContainerCharges, setResetContainerCharges] = useState([])
    const [resetContainerChargesData, setResetContainerChargesData] = useState([])
    
    const [removeRerenderChargesData, setRemoveRerenderChargesData] = useState([])
    const [removeChargesState, setRemoveChargesState] = useState(false)

    function handleChangeContainerType(val, index) {
     

        var ContainerType = val ? val.value : ""
        var data = {
            ContainerType: val ? val.value : "", POL: $(".POLPortCode").find(":hidden").val(), POD: $(".PODPortCode").find(":hidden").val(), StartDate: $(".startDate").val(), EndDate: $(".EndDate").val(), CurrencyType: $(".currencyType").find(":hidden").val()
        }
    
        GetGroupChargesByAreaContainer(data, ContainerType, globalContext).then(res => {
           
            var ChargesOption = []
            if(res.data.length>0){
                $.each(res.data, function (key, value) {
               
                    var PortCode = "";
                    var Float = "";
                    if (value.VerificationStatus == "Approved") {
    
                        if (value.portCode != null) {
                            PortCode = "(" + value["portCode"]["PortCode"] + ")";
                        }
    
                        if (value.Floating == "1") {
                            Float = "*"
                        }
    
                        ChargesOption.push({ value: value.ChargesUUID, label: value.ChargesCode + PortCode + Float })
                    }
    
                    if (key == (res.data.length - 1)) {
                        setOnChangeContainerTypeCharges(sortArray(ChargesOption))
                    }
    
                })
            }else{
                setOnChangeContainerTypeCharges([])
            }

            setContainerIndex(index)

        })
    }

    function getAllDataFormContainerAndChargesTable() {       
        const tableData = {};
        const regexForCharges = [
            {label:"uOM",regex:/\bUOM\b/},
            {label:"chargesCodeList",regex:/\bChargesCode\b/},
        ];

        $(ContainerRef.current).find('input[name]').each((index, element) => {
          
            $.each(regexForCharges, function(key2, value2) {
                if(value2.regex.test(element.name)){
                    let options = []
                    var newName;

                    if(element.name.includes("ChargesCode")){
                        if($(`input[name='${element.name}']`).parent().next().val()){
                            options = JSON.parse($(`input[name='${element.name}']`).parent().next().val())
                        }
                        newName = element.name.replace("ChargesCode", value2.label)
                    }else{
                        if($(`input[name='${element.name}']`).parent().next().val()){
                            options = $(`input[name='${element.name}']`).parent().next().val().split(',')
                        }
                        newName= element.name.replace(value2.label.charAt(0).toUpperCase() + value2.label.slice(1), value2.label)
                    }

                    tableData[newName] = options
                    tableData[element.name] = $(element).val();
                }else{
                    tableData[element.name] = $(element).val();
                }
            })
            
        });

        let tariff = [];

        $.each(tableData, function(key, value) {
            let keys = key.split(/\[|\]\[|\]/).filter(Boolean);
            let last = keys.pop();
            let obj = {};

            $.each(keys, function(i, k) {
                if (i === 0) {
                    obj[k] = [];
                } else if (i === keys.length - 1) {
                    obj[k] = {};
                    obj[k][last] = value;
                } else {
                    obj[k] = {};
                }

                obj = obj[k];
            });

            if (keys[0] === "Tariff") {
                if(tariff.length > keys[1]){
                    tariff[keys[1]][last] = value
                }
                else{
                    tariff.push(obj);
                }
            }else{
                if(!tariff[keys[1]]["tariffHasContainerTypeCharges"]){
                    tariff[keys[1]]["tariffHasContainerTypeCharges"]=[]
                }

                if(tariff[keys[1]]["tariffHasContainerTypeCharges"].length > keys[2]){
                    tariff[keys[1]]["tariffHasContainerTypeCharges"][keys[2]][last] = value
                }
                else{
                    tariff[keys[1]]["tariffHasContainerTypeCharges"].push(obj)
                }
            }
        });
        
        return tariff;
    }

    function BasicRemoveHandle (index){
        console.log(index)
        var removeData = getAllDataFormContainerAndChargesTable()
        console.log(removeData)
        var newDataGenerate = []
        $.each(removeData, function(key, value) {
            if(key!=index){
                newDataGenerate.push(value)
            }
        })

        // remove(index)       
        setRemoveRerenderChargesData(newDataGenerate)

        if(newDataGenerate.length <=0){
            setRemoveChargesState(true)
            remove()
        }

    
    }

    useEffect(() => {

        initHoverSelectDropownTitle()
        if (props.formState.formType == "New") {
            remove()


        }

        return () => {

        }
    }, [props.formState])




    function handleOpenMenu() {
        var newArray = []
        //disabled option that already selected
        $.each(selectedValue, function (key, value) {
            value.selected = false
        })
        $.each($(".ContainerType").find(":hidden"), function (key, value) {

            if ($(value).val() !== "") {
                newArray.push($(value).val())
            }
        })
        $.each(selectedValue, function (key, value) {

            $.each(newArray, function (key2, value2) {
                if (value2 == value.value) {
                    value.selected = true
                }

            })
        })
    }


    useEffect(() => {
        initHoverSelectDropownTitle()
        setSelectedValue(props.options)
        return () => {

        }
    }, [props.options])

    useEffect(() => {
        if(props.currencyTypeChange){
                var tempArray=[];
                
                $.each(fields,function(key,value){
                    tempArray.push({Name:`TariffHasContainerTypeCharges[${key}]`,value:$(`input[name='Tariff[${key}][ContainerType]']`).val()})
                  
                })

                setResetContainerCharges(tempArray)
            
        }
        return () => {

        }
    }, [props.currencyTypeChange])



    useEffect(() => {
        if(resetContainerCharges.length>0){
            var tempArray=[]
            $.each(resetContainerCharges,function(key,value){
                var ContainerType = value.value ? value.value : ""
                var data = {
                    ContainerType: value.value ? value.value : "", POL: $(".POLPortCode").find(":hidden").val(), POD: $(".PODPortCode").find(":hidden").val(), StartDate: $(".startDate").val(), EndDate: $(".EndDate").val(), CurrencyType: $(".currencyType").find(":hidden").val()
                }

                GetGroupChargesByAreaContainer(data, ContainerType, globalContext,false).then(res => {
                 
                    var ChargesOption = []
                    if(res.data.length>0){
                        $.each(res.data, function (key, value) {
                       
                            var PortCode = "";
                            var Float = "";
                            if (value.VerificationStatus == "Approved") {
            
                                if (value.portCode != null) {
                                    PortCode = "(" + value["portCode"]["PortCode"] + ")";
                                }
            
                                if (value.Floating == "1") {
                                    Float = "*"
                                }
            
                                ChargesOption.push({ value: value.ChargesUUID, label: value.ChargesCode + PortCode + Float })
                            }
            
                            // if (key == (res.data.length - 1)) {
                            //     setOnChangeContainerTypeCharges(ChargesOption)
                            // }
            
                        })
                    }
                  
                    tempArray.push({Name:value.Name,value:sortArray(ChargesOption)})
                })

                
            })
          
            setResetContainerChargesData(sortArray(tempArray))
        }
        return () => {

        }
    }, [resetContainerCharges])




   



    

   $(document).off('click').on("click", ".ChargesDisplay", function () {
        var icon = $(this).find("i");

        if ($(this).closest("tr").next().hasClass("d-none")) {
            icon.addClass("fa fa-minus").removeClass("fa fa-plus");
            $(this).closest("tr").next().removeClass('d-none');
        }
        else {
            icon.addClass("fa fa-plus").removeClass("fa fa-minus");
            $(this).closest("tr").next().addClass('d-none');
        }
    })

    useEffect(() => {

        if (props.data.length > 0) {
            remove()
            var ChargesOption = {}

            $.each(props.data, function (key, value) {

                var data = {
                    ContainerType: value.ContainerType, POL: $(".POLPortCode").find(":hidden").val(), POD: $(".PODPortCode").find(":hidden").val(), StartDate: $(".startDate").val(), EndDate: $(".EndDate").val(), CurrencyType: $(".currencyType").find(":hidden").val()
                }


                GetChargesByAreaContainer(data, globalContext).then(res => {


                    var ChargesOptionInner = []
                    $.each(res.data, function (key2, value2) {

                        var PortCode = "";
                        var Float = "";
                        if (value2.VerificationStatus == "Approved") {

                            if (value2.portCode != null) {
                                PortCode = "(" + value2["portCode"]["PortCode"] + ")";
                            }

                            if (value2.Floating == "1") {
                                Float = "*"
                            }

                            ChargesOptionInner.push({ value: value2.ChargesUUID, label: value2.ChargesCode + PortCode + Float, ContainerIndex: key })

                        }




                    })

                    ChargesOption[`${key}`] = sortArray(ChargesOptionInner)


                    setChargesByContainer([ChargesOption])

                })  

                append(value)


                //  setValue("Tariff" + '[' + key + ']' + '[ContainerType]',value.ContainerType)
            })


            //setChargesByContainer([...ChargesOption, ChargesOption])
            props.trigger()
        }



        return () => {

        }
    }, [props.data])

    useEffect(() => {

        if (removeRerenderChargesData.length > 0) {
            remove()
            $.each(removeRerenderChargesData, function (key, value) {
                append(value)
            })
        }
        return () => {

        }
    }, [removeRerenderChargesData])





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
        name: "Tariff"
    });
    
    return (
        <div className="card Ports lvl1 col-xs-12 col-md-12">
            <div className="card-header">
                <h3 className="card-title">Containers & Charges</h3>

            </div>
            <div className="card-body">

                <div class="table_wrap">
                    <div class="table_wrap_inner">
                        <table className="table table-bordered commontable" style={{ width: "100%" }} ref={ContainerRef}>
                            <thead>
                                <tr>
                                    <th>Container Type</th>

                                </tr>

                            </thead>
                            <tbody>
                                {fields.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="row">

                                                        <div className="col-md-1">
                                                            <div className="row">
                                                                <button type="button" style={{ position: "relative", left: "2px", top: "1px" }} className="btn btn-xs ChargesDisplay"><i className="fas fa-plus" data-toggle="tooltip" title="Expand"></i>
                                                                </button>

                                                                <div className="dropdown float-left dropdownbar">
                                                                    <button style={{ position: "relative", left: "0px", top: "1px" }} className="btn btn-xs btn-secondary dropdown-toggle float-right" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                        <i className="fa fa-ellipsis-v" data-hover="tooltip" data-placement="top" title="Options"></i></button>
                                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                                                                        <button data-repeater-delete className="dropdown-item RemoveContainer" type="button" onClick={() => BasicRemoveHandle(index)}>Remove</button>
                                                                    </div>
                                                                </div>

                                                            </div>


                                                        </div>

                                                        <input  {...register("Tariff" + '[' + index + ']' + '[TariffUUID]')} className={`form-control d-none DynamicTariffUUID`} />
                                                        <div className="col-md-11" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                                                            <Controller
                                                                name={("Tariff" + '[' + index + ']' + '[ContainerType]')}
                                                                className="ContainerType"
                                                                control={control}

                                                                render={({ field: { onChange, value, val } }) => (
                                                                    <Select
                                                                        isClearable={true}

                                                                        {...register("Tariff" + '[' + index + ']' + '[ContainerType]')}
                                                                        value={value ? selectedValue.find(c => c.value === value) : null}
                                                                        onChange={val => { val == null ? onChange(null) : onChange(val.value); handleChangeContainerType(val, index) }}
                                                                        onMenuOpen={() => { handleOpenMenu() }}
                                                                        options={selectedValue}
                                                                        isOptionDisabled={(selectedValue) => selectedValue.selected == true}
                                                                        menuPortalTarget={document.body}
                                                                        className="basic-single ContainerType"
                                                                        classNamePrefix="select"
                                                                        styles={globalContext.customStyles}

                                                                    />
                                                                )}
                                                            />
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="d-none" >

                                                <NestedContainerCharges trigger={props.trigger} resetContainerChargesData={resetContainerChargesData} cookies={props.cookies} formState={props.formState} chargesByContainer={chargesByContainer} containerChangeIndex={containerIndex} onChangeCurrencyTypeCharges={onChangeCurrencyTypeCharges} onChangeContainerTypeCharges={onChangeContainerTypeCharges} containerIndex={index} chargesTypeOption={props.chargesTypeOption} currencyTypeOption={props.currencyTypeOption} freightTermOption={props.freightTermOption} taxCodeOption={props.taxCodeOption} removeRerenderChargesData={removeRerenderChargesData} removeChargesState={removeChargesState} setRemoveChargesState={setRemoveChargesState} data={props.data.length > 0 ? props.data[`${index}`] : ""} />

                                            </tr>

                                        </>
                                    )
                                })}
                            </tbody>



                        </table>
                    </div>
                </div>

                <button type="button" className="add-container btn btn-success btn-xs mb-2 mt-2" onClick={() => { append({ Name: "", Options: props.options }) }} ><span class="fa fa-plus"></span>Add Container Type</button>
            </div>
        </div>
    )
}

export default ContainerCharges








