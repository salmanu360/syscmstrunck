import React, {  useState,useEffect } from 'react'


function NoticeOfArrival(props) {
    var type = props.modelLink.replace(/^manifest-/, "");
    window.$('.topDetail').summernote('destroy');
    
    
    function MultipleCustomerData(){
        window.$('.topDetail').summernote({
            toolbar: [
              // [groupName, [list of button]]
              ['style', ['bold', 'italic', 'underline', 'clear']],
              ['fontsize', ['fontsize']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
            ]
        })
        useEffect(() => {
            if(props.customerType && props.customerType=="multiple"){
                var getData=props.selectedState
                window.$('.summernoteClass').summernote({
                    toolbar: [
                      // [groupName, [list of button]]
                      ['style', ['bold', 'italic', 'underline', 'clear']],
                      ['fontsize', ['fontsize']],
                      ['color', ['color']],
                      ['para', ['ul', 'ol', 'paragraph']],
                    ]
                });
            
                window.$('.topDetail').off('summernote.change').on('summernote.change', function() {
                    if(getData.length>0){
                        var editorValue = window.$(this).summernote('code');
                        var sessionValue={VesselName:getData[0]["VesselName"],VoyageNum:getData[0]["VoyageName"],POL:getData[0]["POLAreaName"],POD:getData[0]["PODAreaName"],PODETA:getData[0]["PODETA"],Values:editorValue}
                        sessionStorage.setItem('topDetailMultiple-'+type, JSON.stringify(sessionValue) );
                    }
              
                   
                  });
                       
                if(sessionStorage.getItem('topDetailMultiple-'+type)){

                    var getEditedValue=JSON.parse(sessionStorage.getItem('topDetailMultiple-'+type))

                    if(getData.length>0){
                        if(getEditedValue.POL==getData[0]["POLAreaName"] && getEditedValue.POD==getData[0]["PODAreaName"] && 
                        getEditedValue.PODETA==getData[0]["PODETA"] && getEditedValue.VesselName ==getData[0]["VesselName"] && 
                        getEditedValue.VoyageNum ==getData[0]["VoyageName"]
                    ){
                        window.$('.topDetail').summernote('code', getEditedValue.Values);
                    }else{
                        var vesselNameMultiple=getData[0]["VesselName"]
                        var voyageNameMultiple=getData[0]["VoyageName"]
                        var POLMultiple=getData[0]["POLAreaName"]
                        var PODMultiple=getData[0]["PODAreaName"]
                        var PODETAMultiple=getData[0]["PODETA"]
    
                        var defaultTopDetailMultiple =`<p>Our Ref:SYS/<strong>${vesselNameMultiple} ${voyageNameMultiple}</strong></p>
                        <p><strong>${formattedDate}</strong></p>
                        <p>To Our Valued Customer,</p>
                        <p><strong><u>RE : VESSEL ARRIVAL NOTICE</u></strong></p>
                        <p>We are pleased to inform that <strong>${vesselNameMultiple} ${voyageNameMultiple}</strong> from ${POLMultiple} to ${PODMultiple} E.T.A on <strong>${PODETAMultiple}</strong></p> 
                         <p><strong>Free period start calculate on the following date after date of container discharge/delivery exceeding the period will be charged as per below listed:</strong></p>
                         
                        <table className="NOAMultiple table" style="fontWeight:bold;border:1px solid black;border-collapse:collapse"> <thead> <tr> <th style="border:1px solid black;border-collapse:collapse">Description</th> <th style="border:1px solid black;border-collapse:collapse">No.Days</th> <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' GP</th> <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' RF</th> <th style="border:1px solid black;border-collapse:collapse;">Description</th> <th style="border:1px solid black;border-collapse:collapse;">No.Weeks</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 20'GP</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'GP</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'HC</th> </tr> </thead> <tbody> <tr> <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Detention&<br/>Demurage(D&D)</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse">Free Days</td> <td style="border:1px solid black;border-collapse:collapse">20'</td> <td style="border:1px solid black;border-collapse:collapse">40'</td> <td style="border:1px solid black;border-collapse:collapse">20'</td> <td style="border:1px solid black;border-collapse:collapse">40'</td> <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Miri Port Storage & SY Wharf Storage(Exclusive weekends)</td> <td style="border:1px solid black;border-collapse:collapse">7 Days</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse">1-3 days</td> <td style="border:1px solid black;border-collapse:collapse">50</td> <td style="border:1px solid black;border-collapse:collapse">75</td> <td style="border:1px solid black;border-collapse:collapse">150</td> <td style="border:1px solid black;border-collapse:collapse">180</td> <td style="border:1px solid black;border-collapse:collapse">1st</td> <td style="border:1px solid black;border-collapse:collapse">50</td> <td style="border:1px solid black;border-collapse:collapse">100</td>
                         <td style="border:1px solid black;border-collapse:collapse">150</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse;">4-7 days</td> <td style="border:1px solid black;border-collapse:collapse;">75</td> <td style="border:1px solid black;border-collapse:collapse;">112.50</td> <td style="border:1px solid black;border-collapse:collapse;">200</td> <td style="border:1px solid black;border-collapse:collapse;">240</td> <td style="border:1px solid black;border-collapse:collapse;">2nd</td> <td style="border:1px solid black;border-collapse:collapse;">90</td> <td style="border:1px solid black;border-collapse:collapse;">180</td> <td style="border:1px solid black;border-collapse:collapse;">210</td> </tr> <tr> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">After 8days</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">100</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">150</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">250</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">300</td> <td style="border:1px solid black;border-collapse:collapse;" >3rd</td> <td style="border:1px solid black;border-collapse:collapse;">140</td> <td style="border:1px solid black;border-collapse:collapse;">280</td> <td style="border:1px solid black;border-collapse:collapse;">320</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse;">4th</td> <td style="border:1px solid black;border-collapse:collapse;" >200</td> <td style="border:1px solid black;border-collapse:collapse;">400</td> <td style="border:1px solid black;border-collapse:collapse;">450</td> </tr> </tbody> </table>
    
                          
                         <br><p>We will arrange for cargo clearance upon receiving your customs document. However, please to inform that any destination T.H.C <strong><u>RM 295.00/20' & RM 440.00/40'</u></strong> and D/O fee <strong><u>RM 195.00</u></strong> must payable by your Company <strong>before releasing</strong> the above containers.</p>
                         <p><strong><u>Empty return place : Krokop 5 Shin Yang Wharf (K5 Wharf)</u></strong></p>
                         <p style="margin:0px">Should you have any problem on your shipping documents you can contact our Customer Services team at 085-428399:</p>
                         <br/>
                         <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.329 - Ms. Mei</strong></p>
                         <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.342 - Ms. Stepfonila</strong></p>
                         <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.330 - Ms. Awell</strong></p>
                         <p style="text-indent:30px;margin:0px"><strong>(Import Leader: Charles Sii Ext.347)</strong></p>
                         <br/>
                         <p style="margin:0px">All documents must be deliver or email to us at least <strong>2 WORKING DAY/EARLIER</strong> before your containers could be released.</p>
                         <p style="margin:0px">All documents <strong>MUST</strong> be in <strong>PROPER</strong> seal and <strong>RECORD/ATTN: MS MEI/IMPORT TEAM</strong> before pass to us to avoid missing documents.</p>
                         <p style="margin:0px">Your Kind attention will be highly appreciated. Thank you</p>`
                                      
    
                        window.$('.topDetail').summernote('code', defaultTopDetailMultiple);
                    }

                    }

                 
                   
                }else{
                    var vesselNameMultiple=getData[0]["VesselName"]
                    var voyageNameMultiple=getData[0]["VoyageName"]
                    var POLMultiple=getData[0]["POLAreaName"]
                    var PODMultiple=getData[0]["PODAreaName"]
                    var PODETAMultiple=getData[0]["PODETA"]

                    var defaultTopDetailMultiple =`<p>Our Ref:SYS/<strong>${vesselNameMultiple} ${voyageNameMultiple}</strong></p>
                    <p><strong>${formattedDate}</strong></p>
                    <p>To Our Valued Customer,</p>
                    <p><strong><u>RE : VESSEL ARRIVAL NOTICE</u></strong></p>
                    <p>We are pleased to inform that <strong>${vesselNameMultiple} ${voyageNameMultiple}</strong> from ${POLMultiple} to ${PODMultiple} E.T.A on <strong>${PODETAMultiple}</strong></p> 
                     <p><strong>Free period start calculate on the following date after date of container discharge/delivery exceeding the period will be charged as per below listed:</strong></p>
                     
                    <table className="NOAMultiple table" style="fontWeight:bold;border:1px solid black;border-collapse:collapse"> <thead> <tr> <th style="border:1px solid black;border-collapse:collapse">Description</th> <th style="border:1px solid black;border-collapse:collapse">No.Days</th> <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' GP</th> <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' RF</th> <th style="border:1px solid black;border-collapse:collapse;">Description</th> <th style="border:1px solid black;border-collapse:collapse;">No.Weeks</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 20'GP</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'GP</th> <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'HC</th> </tr> </thead> <tbody> <tr> <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Detention&<br/>Demurage(D&D)</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse">Free Days</td> <td style="border:1px solid black;border-collapse:collapse">20'</td> <td style="border:1px solid black;border-collapse:collapse">40'</td> <td style="border:1px solid black;border-collapse:collapse">20'</td> <td style="border:1px solid black;border-collapse:collapse">40'</td> <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Miri Port Storage & SY Wharf Storage(Exclusive weekends)</td> <td style="border:1px solid black;border-collapse:collapse">7 Days</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> <td style="border:1px solid black;border-collapse:collapse">FOC</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse">1-3 days</td> <td style="border:1px solid black;border-collapse:collapse">50</td> <td style="border:1px solid black;border-collapse:collapse">75</td> <td style="border:1px solid black;border-collapse:collapse">150</td> <td style="border:1px solid black;border-collapse:collapse">180</td> <td style="border:1px solid black;border-collapse:collapse">1st</td> <td style="border:1px solid black;border-collapse:collapse">50</td> <td style="border:1px solid black;border-collapse:collapse">100</td>
                     <td style="border:1px solid black;border-collapse:collapse">150</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse;">4-7 days</td> <td style="border:1px solid black;border-collapse:collapse;">75</td> <td style="border:1px solid black;border-collapse:collapse;">112.50</td> <td style="border:1px solid black;border-collapse:collapse;">200</td> <td style="border:1px solid black;border-collapse:collapse;">240</td> <td style="border:1px solid black;border-collapse:collapse;">2nd</td> <td style="border:1px solid black;border-collapse:collapse;">90</td> <td style="border:1px solid black;border-collapse:collapse;">180</td> <td style="border:1px solid black;border-collapse:collapse;">210</td> </tr> <tr> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">After 8days</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">100</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">150</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">250</td> <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">300</td> <td style="border:1px solid black;border-collapse:collapse;" >3rd</td> <td style="border:1px solid black;border-collapse:collapse;">140</td> <td style="border:1px solid black;border-collapse:collapse;">280</td> <td style="border:1px solid black;border-collapse:collapse;">320</td> </tr> <tr> <td style="border:1px solid black;border-collapse:collapse;">4th</td> <td style="border:1px solid black;border-collapse:collapse;" >200</td> <td style="border:1px solid black;border-collapse:collapse;">400</td> <td style="border:1px solid black;border-collapse:collapse;">450</td> </tr> </tbody> </table>

                      
                     <br><p>We will arrange for cargo clearance upon receiving your customs document. However, please to inform that any destination T.H.C <strong><u>RM 295.00/20' & RM 440.00/40'</u></strong> and D/O fee <strong><u>RM 195.00</u></strong> must payable by your Company <strong>before releasing</strong> the above containers.</p>
                     <p><strong><u>Empty return place : Krokop 5 Shin Yang Wharf (K5 Wharf)</u></strong></p>
                     <p style="margin:0px">Should you have any problem on your shipping documents you can contact our Customer Services team at 085-428399:</p>
                     <br/>
                     <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.329 - Ms. Mei</strong></p>
                     <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.342 - Ms. Stepfonila</strong></p>
                     <p style="text-indent:30px;margin:0px"><strong>C.S: EXT.330 - Ms. Awell</strong></p>
                     <p style="text-indent:30px;margin:0px"><strong>(Import Leader: Charles Sii Ext.347)</strong></p>
                     <br/>
                     <p style="margin:0px">All documents must be deliver or email to us at least <strong>2 WORKING DAY/EARLIER</strong> before your containers could be released.</p>
                     <p style="margin:0px">All documents <strong>MUST</strong> be in <strong>PROPER</strong> seal and <strong>RECORD/ATTN: MS MEI/IMPORT TEAM</strong> before pass to us to avoid missing documents.</p>
                     <p style="margin:0px">Your Kind attention will be highly appreciated. Thank you</p>`
                                  

                    window.$('.topDetail').summernote('code', defaultTopDetailMultiple);
                }

                
            }
          
            return () => {
            }
          }, [props.customerTypeData])

        var today = new Date();
        // set date format
        var dateFormat = "dd MM yy";
        // format the date using jQuery
        var formattedDate = window.$.datepicker.formatDate(dateFormat, today);
                                  
                                        
       return (
        <>

            <textarea className="topDetail col-md-12 summernoteClass" rows="12"></textarea>
        
                {/* <table className="NOAMultiple table" style="fontWeight:bold;border:1px solid black;border-collapse:collapse">
                    <thead>
                        <tr>
                            <th style="border:1px solid black;border-collapse:collapse">Description</th>
                            <th style="border:1px solid black;border-collapse:collapse">No.Days</th>
                            <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' GP</th>
                            <th colSpan="2" style="border:1px solid black;border-collapse:collapse;">(RM)/day 20'/40' RF</th>
                            <th style="border:1px solid black;border-collapse:collapse;">Description</th>
                            <th style="border:1px solid black;border-collapse:collapse;">No.Weeks</th>
                            <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 20'GP</th>
                            <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'GP</th>
                            <th style="border:1px solid black;border-collapse:collapse;">(RM)/week 40'HC</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Detention&<br/>Demurage(D&D)</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid black;border-collapse:collapse">Free Days</td>
                            <td style="border:1px solid black;border-collapse:collapse">20'</td>
                            <td style="border:1px solid black;border-collapse:collapse">40'</td>
                            <td style="border:1px solid black;border-collapse:collapse">20'</td>
                            <td style="border:1px solid black;border-collapse:collapse">40'</td>
                            <td rowSpan="6" style="border:1px solid black;border-collapse:collapse">Miri Port Storage & SY Wharf Storage(Exclusive weekends)</td>
                            <td style="border:1px solid black;border-collapse:collapse">7 Days</td>
                            <td style="border:1px solid black;border-collapse:collapse">FOC</td>
                            <td style="border:1px solid black;border-collapse:collapse">FOC</td>
                            <td style="border:1px solid black;border-collapse:collapse">FOC</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid black;border-collapse:collapse">1-3 days</td>
                            <td style="border:1px solid black;border-collapse:collapse">50</td>
                            <td style="border:1px solid black;border-collapse:collapse">75</td>
                            <td style="border:1px solid black;border-collapse:collapse">150</td>
                            <td style="border:1px solid black;border-collapse:collapse">180</td>

                            <td style="border:1px solid black;border-collapse:collapse">1st</td>
                            <td style="border:1px solid black;border-collapse:collapse">50</td>
                            <td style="border:1px solid black;border-collapse:collapse">100</td>
                            <td style="border:1px solid black;border-collapse:collapse">150</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid black;border-collapse:collapse;">4-7 days</td>
                            <td style="border:1px solid black;border-collapse:collapse;">75</td>
                            <td style="border:1px solid black;border-collapse:collapse;">112.50</td>
                            <td style="border:1px solid black;border-collapse:collapse;">200</td>
                            <td style="border:1px solid black;border-collapse:collapse;">240</td>

                            <td style="border:1px solid black;border-collapse:collapse;">2nd</td>
                            <td style="border:1px solid black;border-collapse:collapse;">90</td>
                            <td style="border:1px solid black;border-collapse:collapse;">180</td>
                            <td style="border:1px solid black;border-collapse:collapse;">210</td>
                        </tr>

                        <tr>
                            <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">After 8days</td>
                            <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">100</td>
                            <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">150</td>
                            <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">250</td>
                            <td rowSpan="2" style="border:1px solid black;border-collapse:collapse;">300</td>

                            <td style="border:1px solid black;border-collapse:collapse;" >3rd</td>
                            <td style="border:1px solid black;border-collapse:collapse;">140</td>
                            <td style="border:1px solid black;border-collapse:collapse;">280</td>
                            <td style="border:1px solid black;border-collapse:collapse;">320</td>



                        </tr>
                        <tr>
                            <td style="border:1px solid black;border-collapse:collapse;">4th</td>
                            <td style="border:1px solid black;border-collapse:collapse;" >200</td>
                            <td style="border:1px solid black;border-collapse:collapse;">400</td>
                            <td style="border:1px solid black;border-collapse:collapse;">450</td>


                        </tr>
                    </tbody>
                </table> */}

        {/* <p>Should there are any damage upon our inspection in the depot, we shall repair and charges to be bill to your account.</p>
        <p>We will arrange for cargo clearance upon receiving your customs document. However, please to inform that any destination T.H.C <strong><u>RM 295.00/20' & RM 440.00/40'</u></strong> and D/O fee <strong><u>RM 195.00</u></strong> must payable by your Company <strong>before releasing</strong> the above containers.</p>
        <p><strong><u>Empty return place : Krokop 5 Shin Yang Wharf (K5 Wharf)</u></strong></p>
        <p style={{"margin":"0px"}}>Should you have any problem on your shipping documents you can contact our Customer Services team at 085-428399:</p>
        <br/>
        <p style={{"textIndent": "30px","margin":"0px"}}><strong>C.S: EXT.329 - Ms. Mei</strong></p>
        <p style={{"textIndent": "30px","margin":"0px"}}><strong>C.S: EXT.342 - Ms. Stepfonila</strong></p>
        <p style={{"textIndent": "30px","margin":"0px"}}><strong>C.S: EXT.330 - Ms. Awell</strong></p>
        <p style={{"textIndent": "30px","margin":"0px"}}><strong>(Import Leader: Charles Sii Ext.347)</strong></p>
        <br/>
        <p style={{"margin":"0px"}}>All documents must be deliver or email to us at least <strong>2 WORKING DAY/EARLIER</strong> before your containers could be released.</p>
        <p style={{"margin":"0px"}}>All documents <strong>MUST</strong> be in <strong>PROPER</strong> seal and <strong>RECORD/ATTN: MS MEI/IMPORT TEAM</strong> before pass to us to avoid missing documents.</p>
        <p style={{"margin":"0px"}}>Your Kind attention will be highly appreciated. Thank you</p> */}




        </>
       )
    }

    function SingleCustomerData(){
        window.$('.topDetail').summernote()

        var today = new Date();
        // set date format
        var dateFormat = " DD, dd MM, yy";
        // format the date using jQuery
        var formattedDate = window.$.datepicker.formatDate(dateFormat, today);

        useEffect(() => {
            var getData=props.selectedState
            if(props.customerType && props.customerType=="single"){
                window.$('.summernoteClass').summernote({
                    toolbar: [
                      // [groupName, [list of button]]
                      ['style', ['bold', 'italic', 'underline', 'clear']],
                      ['fontsize', ['fontsize']],
                      ['color', ['color']],
                      ['table', ['table']],
                      ['para', ['ul', 'ol', 'paragraph']],
                      ['view', ['codeview']],
                    ]
                });
                
                window.$('.topDetail').on('summernote.change', function() {
                    // Handle the change event
                    var editorValue = window.$(this).summernote('code');
                    // console.log(getData)
                    var sessionValue={BillOfLadingUUID:getData[0]["BillOfLadingUUID"],Values:editorValue}
                    sessionStorage.setItem('topDetailSingle-'+type, JSON.stringify(sessionValue));
                   
                });

                if(sessionStorage.getItem('topDetailSingle-'+type)){
                    
                    var getEditedValue=JSON.parse(sessionStorage.getItem('topDetailSingle-'+type))
                    if(getData.length>0){
                        console.log(getEditedValue.BillOfLadingUUID)
                        console.log(getData[0]["BillOfLadingUUID"])
                        if(getEditedValue.BillOfLadingUUID==getData[0]["BillOfLadingUUID"]){
                            console.log("3232")
                            window.$('.topDetail').summernote('code', getEditedValue.Values);
                        }else{
                            var ConsigneeAttentionName=props.customerTypeData.ConsigneeAttentionName
                            var ConsigneeCompanyFax=props.customerTypeData.ConsigneeCompanyFax
                            var ConsigneeCompanyName=props.customerTypeData.ConsigneeCompanyName
                            var LoginUser=props.customerTypeData.LoginUser
                            var vesselCodeSingle=props.customerTypeData.VesselCode
                            var vesselNameSingle=props.customerTypeData.VesselName
                            var voyageNameSingle=props.customerTypeData.VoyageNum
                            var PODETA=props.customerTypeData.PODETA
                            var BLDocNum=props.customerTypeData.DocNum
                            var QtyPkgs=props.customerTypeData.QtyPkgs
                            var ContainerNo=props.customerTypeData.ContainerNo
                            var POLSingle=props.customerTypeData.POL
                            var PODSingle=props.customerTypeData.POD
                            var PODSCNCode=props.customerTypeData.PODSCNCode
                            var PODLocationCode=props.customerTypeData.PODLocationCode
                            var ManifestNo=props.customerTypeData.ManifestNo
                            var AgentCode=props.customerTypeData.AgentCode
                            // var PODETAMultiple=props.customerTypeData.PODETA

                            var defaultTopDetailSingle =`<p><span style="font-size: 16px; font-weight: bolder;">Date ${formattedDate}</span><br></p>
                            <p><span style="font-weight: bolder; font-size: 0.875rem;">
                            <table style="margin: 0 auto; text-align: center; width: 100%"><tbody>
                            <tr><td style="font-size: 16px; text-align: left;"><b>Attn &nbsp;&nbsp;: ${ConsigneeAttentionName} </b></td><td style="font-size: 16px; text-align: left; "><b>Fax  &nbsp;&nbsp;&nbsp;: ${ConsigneeCompanyFax}</b><br></td></tr>
                            <tr><td colspan="2" style="font-size: 16px; text-align: left;"><b>To   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${ConsigneeCompanyName} </b></td></tr>
                            <tr><td colspan="2" style="font-size: 16px; text-align: left;"><b>From : ${LoginUser} </b></td></tr>
                            </tbody></table>
                            <table style="margin: 0 auto; text-align: center;"><tbody>
                            <tr><td style="font-size: 16px;"><b>Vessel&nbsp; :</b><br></td><td style="font-size: 16px; text-align: left; ">${vesselNameSingle} ${voyageNameSingle}<br></td></tr>
                            <tr><td style="font-size: 16px;"><b>ETA&nbsp; &nbsp; &nbsp; :</b><br></td><td style="text-align: left; font-size: 16px;">${PODETA}<br></td></tr>
                            <tr><td style="font-size: 16px;"><b>B/L No&nbsp; :</b></td><td style="text-align: left; font-size: 16px;">${BLDocNum}<br></td></tr></tbody></table>
                            <div style="text-align: center;"><span style="font-size: 16px;">${QtyPkgs} CONTR STC : ${ContainerNo}</span></div>
                            <div style="text-align: left;"><span style="font-size: 16px;"><br></span></div><div style="text-align: center;"><span style="font-size: 16px;"><u><b>Shipment From ${POLSingle} to ${PODSingle}</b></u></span></div>
                            <div style="text-align: center;"><span style="font-size: 16px;"><u><b><br></b></u></span></div>
                            <table style="margin: 0 auto; text-align: center; width: 100%"><tbody>
                            <tr><td style="font-size: 16px; text-align: left;"><b>CONSIGNEE &nbsp;: ${ConsigneeCompanyName} </b></td><td style="font-size: 16px; text-align: right; "><b>READY ON ${PODETA}</b><br></td></tr>
                            </tbody></table>
                            <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">The about vessel is a arrive at <b>${PODSingle}</b> on <u style="font-weight: bold;">${PODETA}</u>&nbsp;and according to the cargo manifest there is cargo on board consigned to you.</span></span></div>
                            <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;"><br></span></span></div><div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">You are advised to present us your endorsed Bill Of Lading / Banker's Guarantee Duly Endorsed through your Forwarding Agent, as soon as possible in exchange for which we will issue our Delivery Order to enable you to effect for clearance.</span></span></div>
                            <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;"><br></span></span></div><div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">Your prompt action is necessary for any storage demurrage or detention charges that mat incur on your</span></span><br>
                            <br><br>
                            <table style="margin: 0px auto; text-align: center;"><tbody>
                            <tr><td style="font-size: 16px;"><b>SHIP ID&nbsp; &nbsp; &nbsp; &nbsp;:<br></b></td><td style="font-size: 16px; text-align: left;">${vesselCodeSingle}<br></td></tr>
                            <tr><td style="font-size: 16px;"><b>S/AGENT&nbsp; &nbsp; &nbsp;:<br></b></td><td style="text-align: left; font-size: 16px;">${AgentCode}<br></td></tr>
                            <tr><td style="font-size: 16px;"><b>SCN No&nbsp; &nbsp; &nbsp; &nbsp; :</b></td><td style="text-align: left; font-size: 16px;">${PODSCNCode}<br></td></tr>
                            <tr><td style="font-size: 16px;"><b>TERMINAL :</b></td><td style="text-align: left; font-size: 16px;">${PODLocationCode}</td></tr>
                            <tr><td style="font-size: 16px;"><b>M/FEST NO :&nbsp;</b></td><td style="text-align: left; font-size: 16px;">${ManifestNo}</td></tr></tbody></table></div>`

                            window.$('.topDetail').summernote('code', defaultTopDetailSingle);
                        }
                    }
                }else{
                    var ConsigneeAttentionName=props.customerTypeData.ConsigneeAttentionName
                    var ConsigneeCompanyFax=props.customerTypeData.ConsigneeCompanyFax
                    var ConsigneeCompanyName=props.customerTypeData.ConsigneeCompanyName
                    var LoginUser=props.customerTypeData.LoginUser
                    var vesselCodeSingle=props.customerTypeData.VesselCode
                    var vesselNameSingle=props.customerTypeData.VesselName
                    var voyageNameSingle=props.customerTypeData.VoyageNum
                    var PODETA=props.customerTypeData.PODETA
                    var BLDocNum=props.customerTypeData.DocNum
                    var QtyPkgs=props.customerTypeData.QtyPkgs
                    var ContainerNo=props.customerTypeData.ContainerNo
                    var POLSingle=props.customerTypeData.POL
                    var PODSingle=props.customerTypeData.POD
                    var PODSCNCode=props.customerTypeData.PODSCNCode
                    var PODLocationCode=props.customerTypeData.PODLocationCode
                    var ManifestNo=props.customerTypeData.ManifestNo
                    var AgentCode=props.customerTypeData.AgentCode
                    // var PODETAMultiple=props.customerTypeData.PODETA

                    var defaultTopDetailSingle =`<p><span style="font-size: 16px; font-weight: bolder;">Date ${formattedDate}</span><br></p>
                    <p><span style="font-weight: bolder; font-size: 0.875rem;">
                    <table style="margin: 0 auto; text-align: center; width: 100%"><tbody>
                    <tr><td style="font-size: 16px; text-align: left;"><b>Attn &nbsp;&nbsp;: ${ConsigneeAttentionName} </b></td><td style="font-size: 16px; text-align: left; "><b>Fax  &nbsp;&nbsp;&nbsp;: ${ConsigneeCompanyFax}</b><br></td></tr>
                    <tr><td colspan="2" style="font-size: 16px; text-align: left;"><b>To   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${ConsigneeCompanyName} </b></td></tr>
                    <tr><td colspan="2" style="font-size: 16px; text-align: left;"><b>From : ${LoginUser} </b></td></tr>
                    </tbody></table>
                    <table style="margin: 0 auto; text-align: center;"><tbody>
                    <tr><td style="font-size: 16px;"><b>Vessel&nbsp; :</b><br></td><td style="font-size: 16px; text-align: left; ">${vesselNameSingle} ${voyageNameSingle}<br></td></tr>
                    <tr><td style="font-size: 16px;"><b>ETA&nbsp; &nbsp; &nbsp; :</b><br></td><td style="text-align: left; font-size: 16px;">${PODETA}<br></td></tr>
                    <tr><td style="font-size: 16px;"><b>B/L No&nbsp; :</b></td><td style="text-align: left; font-size: 16px;">${BLDocNum}<br></td></tr></tbody></table>
                    <div style="text-align: center;"><span style="font-size: 16px;">${QtyPkgs} CONTR STC : ${ContainerNo}</span></div>
                    <div style="text-align: left;"><span style="font-size: 16px;"><br></span></div><div style="text-align: center;"><span style="font-size: 16px;"><u><b>Shipment From ${POLSingle} to ${PODSingle}</b></u></span></div>
                    <div style="text-align: center;"><span style="font-size: 16px;"><u><b><br></b></u></span></div>
                    <table style="margin: 0 auto; text-align: center; width: 100%"><tbody>
                    <tr><td style="font-size: 16px; text-align: left;"><b>CONSIGNEE &nbsp;: ${ConsigneeCompanyName} </b></td><td style="font-size: 16px; text-align: right; "><b>READY ON ${PODETA}</b><br></td></tr>
                    </tbody></table>
                    <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">The about vessel is a arrive at <b>${PODSingle}</b> on <u style="font-weight: bold;">${PODETA}</u>&nbsp;and according to the cargo manifest there is cargo on board consigned to you.</span></span></div>
                    <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;"><br></span></span></div><div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">You are advised to present us your endorsed Bill Of Lading / Banker's Guarantee Duly Endorsed through your Forwarding Agent, as soon as possible in exchange for which we will issue our Delivery Order to enable you to effect for clearance.</span></span></div>
                    <div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;"><br></span></span></div><div style="text-align: justify;"><span style="font-size: 14px;"><span style="font-size: 16px;">Your prompt action is necessary for any storage demurrage or detention charges that mat incur on your</span></span><br>
                    <br><br>
                    <table style="margin: 0px auto; text-align: center;"><tbody>
                    <tr><td style="font-size: 16px;"><b>SHIP ID&nbsp; &nbsp; &nbsp; &nbsp;:<br></b></td><td style="font-size: 16px; text-align: left;">${vesselCodeSingle}<br></td></tr>
                    <tr><td style="font-size: 16px;"><b>S/AGENT&nbsp; &nbsp; &nbsp;:<br></b></td><td style="text-align: left; font-size: 16px;">${AgentCode}<br></td></tr>
                    <tr><td style="font-size: 16px;"><b>SCN No&nbsp; &nbsp; &nbsp; &nbsp; :</b></td><td style="text-align: left; font-size: 16px;">${PODSCNCode}<br></td></tr>
                    <tr><td style="font-size: 16px;"><b>TERMINAL :</b></td><td style="text-align: left; font-size: 16px;">${PODLocationCode}</td></tr>
                    <tr><td style="font-size: 16px;"><b>M/FEST NO :&nbsp;</b></td><td style="text-align: left; font-size: 16px;">${ManifestNo}</td></tr></tbody></table></div>`

                    window.$('.topDetail').summernote('code', defaultTopDetailSingle);
                }
            }
          
            return () => {
            }
        }, [props.customerTypeData])

        return(
            <>
                <textarea className="topDetail col-md-12 summernoteClass" rows="12"></textarea>
            </>
        )
    }

    return(
        props.customerType?props.customerType=="multiple"?MultipleCustomerData():SingleCustomerData():""
    )
    

  

}

export default NoticeOfArrival