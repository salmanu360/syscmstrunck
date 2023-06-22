import React, { useContext,useEffect,useState } from 'react'
import { useForm, Controller, setValue, useFieldArray, set } from "react-hook-form";
import Select from 'react-select'
import GlobalContext from "./GlobalContext"
import {getBookingConfirmationHasContainerType} from "./Helper"
import $ from "jquery";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    useNavigate
} from "react-router-dom";
function CreateButtonRow(props) {
    const navigate = useNavigate();
    const globalContext = useContext(GlobalContext);
    const [userRuleSet, setUserRuleSet] = useState([])
    const params = useParams();
    const { register, handleSubmit, setValue, trigger, getValues, reset, control, watch, formState: { errors } } = useForm({
      

    });
    var cancelLink = props.data.data.groupLink + (props.data.data.modelLink) + "/index"
    var newLink = props.data.data.groupLink + (props.data.data.modelLink) + "/create"
    var ShowDNDList = ["Quotation","BookingReservation"]
    var ShowTransferFromBR = ["ContainerReleaseOrder","BillOfLading"]
    var ShowTransferFromBC = ["SalesInvoice"]
    var resultShowDND = ShowDNDList.filter(function (oneArray) {
        return oneArray == props.title
    });

    var resultShowTransferFromBR = ShowTransferFromBR.filter(function (oneArray) {
        return oneArray == props.title
    });
    var resultShowTransferFromBC = ShowTransferFromBC.filter(function (oneArray) {
        return oneArray == props.title
    });

    function handleTransferFromBooking(id){
        if(userRuleSet.includes(`create-${tempModel}`) && userRuleSet.includes(`transfer-${tempModel}`)){
            window.$("#TransferFromModal").modal("toggle")
            navigate('/' + props.data.data.groupLink + (props.data.data.modelLink) + "/transfer-from-booking-reservation-data/id="+id,{ state: { id:id, formType: "TransferFromBooking",transferFromModel:"booking-reservation"}})
        }else{
            alert("You are not allowed to transfer from Booking Reservation, Please check your Permission.")
        }
    }

    function handleTransferAllFromBooking(id){
        if(userRuleSet.includes(`create-${tempModel}`) && userRuleSet.includes(`transferfrom-${tempModel}`)){
            var BC = $("input[name='DynamicModel[BC]']").val()
            if(props.barge){
                var type="barge"
            }else{
                var type="normal"
            }
            getBookingConfirmationHasContainerType(BC,globalContext,type).then(BCData => {
                var checkingCustomerList = []
                // checkingBillToList
                window.$.each(BCData.data, function (key, value) { 
                  window.$.each(value.bookingConfirmationCharges, function (key2, value2) { 
                    var data={}
                    var temp = {value:value2.BillTo,label:value2.billTo.BranchCode+"("+value2.billTo.portCode.PortCode+")"}
                    data["CustomerType"] =value2.CustomerType
                    data["BillTo"] = temp
                    checkingCustomerList.push(data)
                  })
                })
    
                const uniqueData = [];
    
                checkingCustomerList.forEach((obj, index) => {
                  const isDuplicate = uniqueData.some((prevObj) => {
                    return (
                      prevObj.BillTo.value === obj.BillTo.value &&
                      prevObj.CustomerType === obj.CustomerType
                    );
                  });
                  if (!isDuplicate) {
                    uniqueData.push(obj);
                  }
                });
                window.$('.checkingBillToList').empty()
    
                const BCHidden = window.$('<input type="hidden" name="BCUUID" value="' + BC + '">');
                window.$('.checkingBillToList').append(BCHidden)
                window.$.each(uniqueData, function (key, value) { 
                  const customerType = window.$('<input type="hidden" name="customerType" value="' + value.CustomerType + '">');
                  const radio = window.$(
										`<input type="radio" className="mr-2" id="radio-window.${key}" name="billTo" value="` +
											value.BillTo.value +
											'">'
									);
									const label = window.$(
										`<label className="control-label" for="radio-window.${key}">` +
											value.BillTo.label +
											"</label>"
									);
                  window.$('.checkingBillToList').append(customerType).append(radio).append(label).append('<br>');
                })
                window.$("#TransferFromBCModal").modal("toggle")
                window.$("#CheckingBillToModal").modal("toggle")
    
                
            })
        }else{
            alert("You are not allowed to transfer from Booking Reservation, Please check your Permission.")
        }
       
     
    }
 
    function confirmTransferFillterBillTo(){
        var BC = $("input[name='DynamicModel[BC]']").val()


        var BranchCode = $('input[name=billTo]:checked').val();
        var CustomerType = $('input[name=billTo]:checked').prev().val();
        window.$("#CheckingBillToModal").modal("toggle")
        window.$("#TransferToCROINVModal").modal("toggle")
        if(props.barge){
            navigate("/sales/standard/sales-invoice-barge/transfer-from-booking-reservation-data/id="+BC,{ state: { id:BC, formType: "TransferFromBooking", CustomerType:CustomerType, BranchCode:BranchCode }})
        }else{
            navigate("/sales/container/sales-invoice/transfer-from-booking-reservation-data/id="+BC,{ state: { id:BC, formType: "TransferFromBooking", CustomerType:CustomerType, BranchCode:BranchCode }})
        }
        
    }

    var tempModel;
    if(props.data.data.modelLink=="company"){
       params.type?tempModel=params.type.toLowerCase():tempModel=props.data.data.modelLink
    }else{
        tempModel=props.data.data.modelLink
    }
    if(tempModel=="port"){
        tempModel="area"
    }
    if(tempModel=="u-n-number"){
        tempModel="un-number"
    }
    if(tempModel=="h-s-code"){
        tempModel="hs-code"
    }
    if(tempModel=="terminal"){
        tempModel="port-details"
    }
    if(tempModel=="credit-note" || tempModel=="debit-note" || tempModel=="credit-note-barge" || tempModel=="debit-note-barge" ){
        tempModel=`sales-${tempModel}`
    }
    if(tempModel=="terminal handler" || tempModel=="box operator" || tempModel=="ship operator"){
        tempModel= tempModel.replace(" ","-")
    }
    useEffect(() => {
        var modelLinkTemp=props.data.data.modelLink
        if(props.data.data.modelLink=="company"){
            params.type?modelLinkTemp= params.type.toLowerCase():modelLinkTemp=props.data.data.modelLink
        }
        if(modelLinkTemp=="port"){
            modelLinkTemp="area"
        }
        if(modelLinkTemp=="u-n-number"){
            modelLinkTemp="un-number"
        }
        if(modelLinkTemp=="h-s-code"){
            modelLinkTemp="hs-code"
        }
        if(modelLinkTemp=="terminal"){
            modelLinkTemp="port-details"
        }
        if(modelLinkTemp=="credit-note" || modelLinkTemp=="debit-note" || modelLinkTemp=="debit-note-barge" || modelLinkTemp=="credit-note-barge" ){
            modelLinkTemp=`sales-${modelLinkTemp}`
        }
        if(modelLinkTemp=="terminal handler" || modelLinkTemp=="box operator" || modelLinkTemp=="ship operator"){
            modelLinkTemp= modelLinkTemp.replace(" ","-")
        }
        if (globalContext.userRule !== "") {
            const objRule = JSON.parse(globalContext.userRule);    
          
            var filteredAp = objRule.Rules.filter(function (item) {
                    return item.includes(modelLinkTemp);
             });
            setUserRuleSet(filteredAp)
          }
      
        return () => {
          
        }
      }, [globalContext.userRule])

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="m-3">
                        <button type="button" onClick={props.handleSubmitData} className={`${userRuleSet.find((item)=>item==`create-${tempModel}`)!==undefined?"":props.data.data.model=="Rule"?"":"disabledAccess"} create btn btn-primary mr-2`} title="Save"><i className="fas fa-save"></i></button>
                        <Link className={`${userRuleSet.find((item)=>item==`create-${tempModel}`)!==undefined?"":props.data.data.model=="Rule"?"":"disabledAccess"}`} to={newLink} state={{ formType: "New",formResetClicked:true }}><button type="button" className="btn btn-primary mr-2 reset" title="Reset"><i className="fas fa-history"></i></button></Link>
                        {resultShowTransferFromBR.length > 0 ? props.data.formType=="TransferFromBooking"?"":<button type="button" className={`${userRuleSet.find((item)=>item==`transfer-${tempModel}`)!==undefined?"":props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2 transferFromBRButton`} title="Transfer From" data-toggle="modal" data-target="#TransferFromModal"><i className="fa fa-file-import"></i></button> : ""}
                        {resultShowTransferFromBC.length > 0 ? props.data.formType=="TransferFromBooking"?"":<button type="button"  className={`${userRuleSet.find((item)=>item==`transferfrom-${tempModel}`)!==undefined?"":props.data.data.model=="Rule"?"":"disabledAccess"} btn btn-primary mr-2 transferFromBCButton`} title="Transfer From" data-toggle="modal" data-target="#TransferFromBCModal"><i className="fa fa-file-import"></i></button> : ""}
                        {resultShowDND.length > 0 ? <a className="btn btn-primary mr-2" href="/backend/quotation/#" title="DND" data-toggle="modal" data-target="#DNDModal"><i className="fab fa-dochub"></i> </a> : ""}
                        <Link to={cancelLink}><button type="button" className="btn btn-primary mr-2 reset" title="cancel"><i className="fa fa-ban"></i></button></Link>
                    </div>
                </div>
            </div>

            {/* <!-- Modal: Transfer From-- > */}
            <div className="modal fade" id="TransferFromModal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Transfer From</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        <div className="form-group">
                                <label>Booking Reservation</label>
                                <Controller
                                    name="DynamicModel[BR]"
                                    id="transferFromBR"
                                    control={control}

                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            id="transferFromBR"
                                            {...register("DynamicModel[BR]")}
                                            value={value ? props.RemaningBR.find(c => c.value === value) : null}
                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                            options={props.RemaningBR}
                                            title={value}
                                            className={`single-select transferBR`}
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}

                                        />
                                    )}
                                />
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary mb-1" id="TransferFrom" onClick={()=>handleTransferFromBooking(getValues("DynamicModel[BR]"))}>Transfer</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Modal: Transfer From-- > */}
            <div className="modal fade" id="TransferFromBCModal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Transfer From</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                        <div className="form-group">
                                <label>Booking Confirmation</label>
                                <Controller
                                    name="DynamicModel[BC]"
                                    id="transferFromBC"
                                    control={control}

                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                            isClearable={true}
                                            id="transferFromBC"
                                            {...register("DynamicModel[BC]")}
                                            value={value ? props.RemaningBC.find(c => c.value === value) : null}
                                            onChange={val => val == null ? onChange(null) : onChange(val.value)}
                                            options={props.RemaningBC}
                                            title={value}
                                            className={`single-select transferBC`}
                                            classNamePrefix="select"
                                            styles={globalContext.customStyles}

                                        />
                                    )}
                                />
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary mb-1" id="TransferAllFrom" onClick={()=>handleTransferAllFromBooking(getValues("DynamicModel[BC]"))}>Transfer All</button>
                            <button type="button" className="btn btn-primary mb-1" id="TransferPartialFrom">Transfer Partial</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Invoice Transfer Modal */}
            <div className="modal fade" id="CheckingBillToModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Choose One Branch for Transfer Sales Invoice</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="checkingBillToList">
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button id="TranferToCN" type="button" className="btn btn-primary confirmTransferFillterBillTo mr-2" onClick={confirmTransferFillterBillTo}>Confirm</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )

}

export default CreateButtonRow

