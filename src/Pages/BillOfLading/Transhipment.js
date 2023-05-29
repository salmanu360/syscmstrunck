import React from 'react'
import DetailFormTranshipment from '../../Components/CommonElement/DetailFormTranshipment'
import { useFieldArray} from "react-hook-form";


function Transhipment(props) {

    var TranshipmentItem ={
        formName:"ContainerReleaseOrder",
        cardLength:"col-md-12",
    }
    
    
    return (
        <div className={`DetailFormDetails Transhipment`}>
            <div className="containerreleaseorder-transhipment-form">
                <DetailFormTranshipment register={props.register} control={props.control} errors={props.errors} TranshipmentItem={TranshipmentItem} setValue={props.setValue} port={props.port} getValues={props.getValues}/>
            </div>
        </div>
    ) 
}

export default Transhipment