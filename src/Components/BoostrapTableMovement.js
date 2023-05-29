
import { Throw, ControlOverlay, ToastNotify, Remove, Verify, getContainerByContainerTypeDepot, getCookie, getContainers, releaseContainer, specialMovementEventHandler, gateInContainer, loadContainer, dischargeContainer, gateOutContainer, receivedContainer, releaseReplaceContainer } from './Helper.js'

var selections = [];
var selectedRow = [];
function BoostrapTableMovement(props) {


    var ContainerByContainerType = [];
    var arrayLatestColumn = []
    window.$("#update").prop('disabled', true)
    window.$("#trash").prop('disabled', true)
    window.$("#removeModal").prop('disabled', true)
    window.$("#approved").prop('disabled', true)

    var tempModel;
    tempModel = props.title
    if (props.host.userRule !== "") {
        if (tempModel == "credit-note" || tempModel == "debit-note") {
            tempModel = `sales-${tempModel}`
        }
        const objRule = JSON.parse(props.host.userRule);
        var filteredAp = objRule.Rules.filter(function (item) {
            return item.includes(tempModel);
        });

    }

    function columnSetup(columns) {

        if(columns){
            var NewColumn=columns.map(obj => ({ ...obj }));
            arrayLatestColumn=NewColumn
            //check for reorder column cookies
            if (getCookie(`${props.tableId}.bs.table.reorderColumns`)) {
              var getCookieArray = getCookie(`${props.tableId}.bs.table.reorderColumns`);
              getCookieArray = JSON.parse(getCookieArray);
        
              const newArray = Object.keys(getCookieArray).filter(key => key !=="state")
              .map(key => ({ field: key }));
        
              var tempNewArray=[]
                 window.$.each(newArray, function (key, value) {
                window.$.each(NewColumn, function (key2, value2) {
                    if(value.field==value2.field){
                      tempNewArray.push(value2)
                    }
        
                })
        
              })
              var Concatarray = tempNewArray.concat(NewColumn);
              const uniqueArray = Concatarray.filter((item, index, self) =>index === self.findIndex((t) => t.field === item.field));
              columns = uniqueArray
            }
          } 

        if (props.type == "formTable") {
            var res = []
        } else {
            var res = [
                {
                    field: 'state',
                    checkbox: true,
                    rowspan: 1,
                    align: 'center',
                    valign: 'middle'
                }
            ];
        }

        window.$.each(columns, function (i, column) {
            if (column.field == "operate") {
                column.sortable = false;
                column.align = 'center';
                // column.switchable = false;
                column.valign = 'middle';
                res.push(column);
            } else if (column.field == "haulier") {
                column.sortable = false;
                column.align = 'center';
                // column.switchable = false;
                column.valign = 'middle';
                res.push(column);

            }
            else {
                column.sortable = true;
                column.align = 'center';
                // column.switchable = false;
                column.valign = 'middle';
                res.push(column);
            }

        })

        return res;
    }

    function getIdSelections() {

        return window.$.map(window.$("#" + props.tableSelector).bootstrapTable('getSelections'), function (element) {

            return element.id
        })
    }

    function replaceNull(someObj, replaceValue = "***") {
        const replacer = (key, value) =>
            String(value) === "null" || String(value) === "undefined" ? replaceValue : value;
        return JSON.parse(JSON.stringify(someObj, replacer));
    }


    function GridActions() {

        var toggleValidAllDetails = {
            icon: 'fa-check-square',
            event: function () {
                var $table = window.$("#" + props.tableSelector)
                var button = window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i");
                if (button.hasClass("fa-check-square") && button.hasClass("fa")) {
                    window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-check-square");
                    window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "All");
                    $table.bootstrapTable('refresh')
                } else if (button.hasClass("fa-check-square") && button.hasClass("far")) {
                    window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "far fa-square");
                    window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Invalid");
                    $table.bootstrapTable('refresh')
                } else if (button.hasClass("fa-square")) {
                    window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").find("i").attr("class", "fa fa-check-square");
                    window.$(".fixed-table-toolbar").find("button[name='toggleValidAll']").attr("title", "Valid");
                    $table.bootstrapTable('refresh')
                }
            },
            attributes: {
                title: 'Valid'
            }
        };

        return {
            toggleValidAll: toggleValidAllDetails,
        }

    }

    if (props.type == "formTable") {
        window.$("#" + props.tableSelector).unbind().bootstrapTable('destroy').bootstrapTable({
            buttons: GridActions(),
            ajax: props.functionGrid,
            showRefresh: true,
            showExport: true,
            clickToSelect: true,
            exportTypes: ['excel', 'xlsx', 'pdf'],
            filterControl: true,
            showColumns: true,
            toolbar: props.toolbarSelector,
            sidePagination: 'server',
            showExport: true,
            exportTypes: ['excel', 'xlsx', 'pdf'],
            // cookie: "true",
            // cookieExpire: '10y',
            showColumnsToggleAll: true,
            pagination: true,
            pageList: [10, 25, 50, 100, 'all'],
            columns: columnSetup(props.columns),



        });

    } else {

        window.$("#" + props.tableSelector).unbind().bootstrapTable('destroy').bootstrapTable({
            buttons: GridActions(),
            ajax: props.functionGrid,
            showRefresh: true,
            showExport: true,
            clickToSelect: true,
            exportTypes: ['excel', 'xlsx', 'pdf'],
            filterControl: true,
            showColumns: true,
            toolbar: props.toolbarSelector,
            sidePagination: 'server',
            showExport: true,
            exportTypes: ['excel', 'xlsx', 'pdf'],
            cookie: "true",
            cookieExpire: '10y',
            resizable: true,
            reorderableColumns: true,
            cookieIdTable: props.cookieID,
            showColumnsToggleAll: true,
            pagination: true,
            pageList: [10, 25, 50, 100, 'all'],
            columns: columnSetup(props.columns),
            responseHandler: function (res) {
                window.$.each(res.rows, function (i, row) {
                    row.state = window.$.inArray(row.id, selections) !== -1
                })
                return res
            },
            onPreBody: function (data) {
                window.$('.fixed-table-body').css('overflow-y', 'hidden');
            },
            onReorderColumn:function(args,e){
                var newLatestColumn = []
                if (getCookie(`${props.tableId}.bs.table.reorderColumns`)) {
        
                    var getCookieArray = getCookie(`${props.tableId}.bs.table.reorderColumns`);
                    getCookieArray = JSON.parse(getCookieArray);
                }
                window.$.each(args, function (key, value) {
                    window.$.each(arrayLatestColumn, function (key2, value2) {
                        if (value == value2.field) {
        
                            if (value2.switchable == false) {
        
                            } else {
                                newLatestColumn.push(value2)
                            }
                        }
                    })
                })
                window.$(".fixed-table-toolbar").find(".dropdown-menu").first().children().find("input:checkbox").not(":eq(0)").each(function (key3) {
                    var value = window.$(this)[0];
                    window.$(value).prop("checked", false);
        
        
                    window.$.each(newLatestColumn, function (key4, value4) {
                        if (key3 == key4) {
        
                            window.$(value).attr("data-field", value4.field);
                            if (getCookieArray.hasOwnProperty(value4.field)) {
        
                                window.$(value).prop("checked", true);
                            }
        
                            window.$(value).next().text(value4.title)
                        }
                    })
        
                    window.$.each(args, function (key6, value6) {
                        if (value6 == window.$(value).attr("data-field")) {
                            window.$(value).val(key6)
                        }
                    });
                });
            },
            onLoadSuccess: function (data) {

                var exportAcess = filteredAp.find((item) => item == `export-${tempModel}`) !== undefined
                if (!exportAcess) {
                    window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled", true)
                } else {
                    window.$(".fixed-table-toolbar").find(".export").find(".dropdown-toggle").attr("disabled", false)
                }

                if (window.$("#" + props.tableSelector).bootstrapTable("getCookies")['columns'] == null) {
                    window.$.each(props.hideColumns, function (key, value) {
                        window.$("#" + props.tableSelector).bootstrapTable('hideColumn', value);
                    });



                }
                ControlOverlay(false)
            }
        });
    }
    window.$("#" + props.tableSelector).on('check.bs.table', function (row, element, field) {
        window.$("#releaseReplace").prop('disabled', false)
        window.$("#release").prop('disabled', false)
        window.$("#gateIn").prop('disabled', false)
        window.$("#loading").prop('disabled', false)
        window.$("#discharging").prop('disabled', false)
        window.$("#gateOut").prop('disabled', false)
        window.$("#emptyReturn").prop('disabled', false)
        window.$("#removeModal").prop('disabled', false)
        window.$("#approved").prop('disabled', false)

    })

    window.$("#" + props.tableId).on('refresh.bs.table', function (row, element, field) {
        window.$("#" + props.tableId).bootstrapTable("uncheckAll")
        selections = [];
        selectedRow = [];

    })




    window.$("#" + props.tableSelector).unbind().on('check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table',


        function (e, rowsAfter, rowsBefore) {
            window.$("#HaulierGateOutModal").find("input").val("")
            if (props.tableSelector == "container-release" || props.tableSelector == "container-gate-out" || props.tableSelector == "special-movement") {
                var type;
           
                if(props.tableSelector == "special-movement"){
                    if (rowsAfter.Status == "Reserved") {
                        type = "POL"
                    } else {
                        type = "POD"
                    }

                    window.$("#HaulierGateOutModal").find(".ROC").val(rowsAfter[`BookingReservationHauler${type}HaulerROC`])
                    window.$("#HaulierGateOutModal").find(".DriverIC").val(rowsAfter[`BookingReservationHauler${type}DriverID`])
                    window.$("#HaulierGateOutModal").find(".CreditTerm").val(rowsAfter[`BookingReservationHauler${type}HaulerCreditTermName`])
                    window.$("#HaulierGateOutModal").find(".DriverName").val(rowsAfter[`BookingReservationHauler${type}DriverName`])
                    window.$("#HaulierGateOutModal").find(".DriverTel").val(rowsAfter[`BookingReservationHauler${type}DriverTel`])
                    window.$("#HaulierGateOutModal").find(".VehicleNo").val(rowsAfter[`BookingReservationHauler${type}VehicleNum`])
                    window.$("#HaulierGateOutModal").find(".CompanyName").val(rowsAfter[`BookingReservationHauler${type}HaulerCompanyName`])
                    window.$("#HaulierGateOutModal").find(".CreditLimit").val(rowsAfter[`BookingReservationHauler${type}HaulerCreditLimit`])
                    window.$("#HaulierGateOutModal").find(".BranchCode").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCodeBranchCode`])
                    window.$("#HaulierGateOutModal").find(".BranchName").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchName`])
                    window.$("#HaulierGateOutModal").find(".BranchTel").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchTel`])
                    window.$("#HaulierGateOutModal").find(".BranchFax").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchFax`])
                    window.$("#HaulierGateOutModal").find(".BranchEmail").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchEmail`])
                    window.$("#HaulierGateOutModal").find(".BranchAddressline1").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchAddressLine1`])
                    window.$("#HaulierGateOutModal").find(".BranchAddressline2").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchAddressLine2`])
                    window.$("#HaulierGateOutModal").find(".BranchAddressline3").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchAddressLine3`])
                    window.$("#HaulierGateOutModal").find(".BranchPostcode").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchPostcode`])
                    window.$("#HaulierGateOutModal").find(".BranchCity").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCity`])
                    window.$("#HaulierGateOutModal").find(".BranchCountry").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCountry`])
                    window.$("#HaulierGateOutModal").find(".BranchCoordinates").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCoordinates`])
                    window.$("#HaulierGateOutModal").find(".AttentionName").val(rowsAfter[`BookingReservationHauler${type}HaulerAttentionName`])
                    window.$("#HaulierGateOutModal").find(".AttentionTel").val(rowsAfter[`BookingReservationHauler${type}HaulerAttentionTel`])
                    window.$("#HaulierGateOutModal").find(".AttentionEmail").val(rowsAfter[`BookingReservationHauler${type}HaulerAttentionEmail`])
                    
                }else{
                    if (props.tableSelector == "container-release") {
                        type = "POL"
                    } else {
                        type = "POD"
                    }
                    var TypeFirstCharLowerCase = type.charAt(0).toLowerCase() + type.slice(1);


                    if (rowsAfter.BookingReservationHauler) {
                        window.$("#HaulierGateOutModal").find(".ROC").val(rowsAfter["BookingReservationHauler"][TypeFirstCharLowerCase+"HaulerCode"]["ROC"])
                        window.$("#HaulierGateOutModal").find(".DriverIC").val(rowsAfter["BookingReservationHauler"][`${type}DriverID`])
                        window.$("#HaulierGateOutModal").find(".CreditTerm").val(rowsAfter["BookingReservationHauler"][TypeFirstCharLowerCase+"HaulerCreditTerm"]["CreditTerm"])
                        window.$("#HaulierGateOutModal").find(".DriverName").val(rowsAfter["BookingReservationHauler"][`${type}DriverName`])
                        window.$("#HaulierGateOutModal").find(".DriverTel").val(rowsAfter["BookingReservationHauler"][`${type}DriverTel`])
                        window.$("#HaulierGateOutModal").find(".VehicleNo").val(rowsAfter["BookingReservationHauler"][`${type}VehicleNum`])
                        window.$("#HaulierGateOutModal").find(".CompanyName").val(rowsAfter["BookingReservationHauler"][`${type}HaulerCompanyName`])
                        window.$("#HaulierGateOutModal").find(".CreditLimit").val(rowsAfter["BookingReservationHauler"][`${type}HaulerCreditLimit`])
                        window.$("#HaulierGateOutModal").find(".BranchCode").val(rowsAfter["BookingReservationHauler"][TypeFirstCharLowerCase+'HaulerBranchCode']["BranchCode"])
                        window.$("#HaulierGateOutModal").find(".BranchName").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchName`])
                        window.$("#HaulierGateOutModal").find(".BranchTel").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchTel`])
                        window.$("#HaulierGateOutModal").find(".BranchFax").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchFax`])
                        window.$("#HaulierGateOutModal").find(".BranchEmail").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchEmail`])
                        window.$("#HaulierGateOutModal").find(".BranchAddressline1").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchAddressLine1`])
                        window.$("#HaulierGateOutModal").find(".BranchAddressline2").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchAddressLine2`])
                        window.$("#HaulierGateOutModal").find(".BranchAddressline3").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchAddressLine3`])
                        window.$("#HaulierGateOutModal").find(".BranchPostcode").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchPostcode`])
                        window.$("#HaulierGateOutModal").find(".BranchCity").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchCity`])
                        window.$("#HaulierGateOutModal").find(".BranchCountry").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchCountry`])
                        window.$("#HaulierGateOutModal").find(".BranchCoordinates").val(rowsAfter["BookingReservationHauler"][`${type}HaulerBranchCoordinates`])
                        window.$("#HaulierGateOutModal").find(".AttentionName").val(rowsAfter["BookingReservationHauler"][`${type}HaulerAttentionName`])
                        window.$("#HaulierGateOutModal").find(".AttentionTel").val(rowsAfter["BookingReservationHauler"][`${type}HaulerAttentionTel`])
                        window.$("#HaulierGateOutModal").find(".AttentionEmail").val(rowsAfter["BookingReservationHauler"][`${type}HaulerAttentionEmail`])
                    }else{
                        window.$("#HaulierGateOutModal").find(".ROC").val(rowsAfter[`BookingReservationHauler${type}HaulerROC`])
                        window.$("#HaulierGateOutModal").find(".DriverIC").val(rowsAfter[`BookingReservationHauler${type}DriverID`])
                        window.$("#HaulierGateOutModal").find(".CreditTerm").val(rowsAfter[`BookingReservationHauler${type}HaulerCreditTermName`])
                        window.$("#HaulierGateOutModal").find(".DriverName").val(rowsAfter[`BookingReservationHauler${type}DriverName`])
                        window.$("#HaulierGateOutModal").find(".DriverTel").val(rowsAfter[`BookingReservationHauler${type}DriverTel`])
                        window.$("#HaulierGateOutModal").find(".VehicleNo").val(rowsAfter[`BookingReservationHauler${type}VehicleNum`])
                        window.$("#HaulierGateOutModal").find(".CompanyName").val(rowsAfter[`BookingReservationHauler${type}HaulerCompanyName`])
                        window.$("#HaulierGateOutModal").find(".CreditLimit").val(rowsAfter[`BookingReservationHauler${type}HaulerCreditLimit`])
                        window.$("#HaulierGateOutModal").find(".BranchCode").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCodeBranchCode`])
                        window.$("#HaulierGateOutModal").find(".BranchName").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchName`])
                        window.$("#HaulierGateOutModal").find(".BranchTel").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchTel`])
                        window.$("#HaulierGateOutModal").find(".BranchFax").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchFax`])
                        window.$("#HaulierGateOutModal").find(".BranchEmail").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchEmail`])
                        window.$("#HaulierGateOutModal").find(".BranchAddressline1").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchAddressLine1`])
                        window.$("#HaulierGateOutModal").find(".BranchAddressline2").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchAddressLine2`])
                        window.$("#HaulierGateOutModal").find(".BranchAddressline3").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchAddressLine3`])
                        window.$("#HaulierGateOutModal").find(".BranchPostcode").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchPostcode`])
                        window.$("#HaulierGateOutModal").find(".BranchCity").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCity`])
                        window.$("#HaulierGateOutModal").find(".BranchCountry").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCountry`])
                        window.$("#HaulierGateOutModal").find(".BranchCoordinates").val(rowsAfter[`BookingReservationHauler${type}HaulerBranchCoordinates`])
                        window.$("#HaulierGateOutModal").find(".AttentionName").val(rowsAfter[`BookingReservationHauler${type}HaulerAttentionName`])
                        window.$("#HaulierGateOutModal").find(".AttentionTel").val(rowsAfter[`BookingReservationHauler${type}HaulerAttentionTel`])
                        window.$("#HaulierGateOutModal").find(".AttentionEmail").val(rowsAfter[`BookingReservationHauler${type}HaulerAttentionEmail`])
                    }
                }
            }
            window.$("#releaseReplace").prop('disabled', false)
            window.$("#release").prop('disabled', false)
            window.$("#gateIn").prop('disabled', false)
            window.$("#loading").prop('disabled', false)
            window.$("#discharging").prop('disabled', false)
            window.$("#gateOut").prop('disabled', false)
            window.$("#emptyReturn").prop('disabled', false)
            window.$("#removeModal").prop('disabled', false)
            window.$("#approved").prop('disabled', false)
            var rows = rowsAfter
            if (e.type === 'uncheck-all') {
                rows = rowsBefore
            }
            var ids = window.$.map(!window.$.isArray(rows) ? [rows] : rows, function (row) {

                return row.id
            })
            var rowSelected = window.$.map(!window.$.isArray(rows) ? [rows] : rows, function (row) {

                return row

            })

            var func = window.$.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

            var func1 = window.$.inArray(e.type, ['check', 'check-all']) > -1 ? "union" : "difference"

            selectedRow = window._[func](selectedRow, rowSelected)

            selections = window._[func1](selections, ids)
            // var CheckSelectedRow = [];
            if (selections.length > 1) {
                window.$("#update").prop('disabled', true)
            }
            if (selections.length <= 0) {
                window.$("#releaseReplace").prop('disabled', true)
                window.$("#release").prop('disabled', true)
                window.$("#gateIn").prop('disabled', true)
                window.$("#loading").prop('disabled', true)
                window.$("#discharging").prop('disabled', true)
                window.$("#gateOut").prop('disabled', true)
                window.$("#emptyReturn").prop('disabled', true)
            }

        }


    )

    // window.$("#" + props.tableSelector).on('pre-body.bs.table', function () {
    //   // window.$(window).trigger('resize');
    //   // window.$('.indexTableCard').css('overflow-y', 'hidden');
    //   window.$("#" + props.tableSelector).bootstrapTable('resetView');

    // })

    window.$("#All").on('change', function () {
        // selectedRow = [];
        // selections = [];
        if (window.$(this).prop("checked")) {
            window.$("#" + props.tableSelector).bootstrapTable('refresh')
            // var html2 = "<option value=''>Select..</option>";

            // $.ajax({
            //     type: "POST",

            //     url: "../company/find-depot-company?UserPort=",
            //     dataType: "json",
            //     success: function (data) {

            //         $.each(data, function (key, value) {
            //             if (value.VerificationStatus == "Approved") {
            //                 html2 += "<option value='" + value.CompanyUUID + "'>" + value.CompanyName + "</option>";
            //             }
            //         });

            //         $("#dynamicmodel-depotcompany").html(html2)
            //         $("#dynamicmodel-depot").empty();
            //         $("#container-release-table").bootstrapTable('refresh');

            //     }
            // });
        }
        else {
            // $("#dynamicmodel-depotcompany").html(html2Ori).trigger("change.select2")
            // $("#dynamicmodel-depotcompany").val(UserCompany).trigger("change.select2")
            // $("#dynamicmodel-depot").html(htmlOri)
            // $("#dynamicmodel-depot").val(UserBranch).trigger("change.select2")
            window.$("#" + props.tableSelector).bootstrapTable('refresh')

        }
    })

    window.$("#release").off('click').on('click', function () {
        var ids = getIdSelections()

        var getData = selectedRow;
        if (selectedRow.length > 0) {
            var DocNumArray = [];
            var objectWithGroupByName = {};
            for (var key in getData) {
                var docNum = "DocNumBR";
                var name = getData[key].BookingReservation;

                if (!objectWithGroupByName[name]) {
                    objectWithGroupByName[name] = [];
                }
                objectWithGroupByName[name].push(getData[key]);
            }

            window.$('#releaseRecordTable').empty().append();
            var html = '<thead>' +
                '<tr>' +
                '<th>BR No</th>' +
                '<th>Container Code</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';
            window.$.each(objectWithGroupByName, function (i, item) {
                window.$.each(item, function (key, value) {
                    DocNumArray.push(value["BookingReservationDocNum"])
                })

                var uniqueArray = DocNumArray.filter(function (elem, pos) {
                    return DocNumArray.indexOf(elem) == pos;
                });
                html += '<tr><td>' + uniqueArray.join(", ") + '</td><td>'
                window.$.each(item, function (i2, item2) {
                    html += item2.ContainerCode + ', ';
                })
                html = html.replace(/,\s*$/, "");
                html += '</td></tr>'

            })
            html += '</tbody>';

            window.$('#releaseRecordTable').append(html);
            window.$("#releaseModal").modal();
        }
    })

    window.$("#releaseConfirm").off('click').on('click', function () {
        var getData = selectedRow;
        var combinedIds = [];
        var containerIDs = [];
        if (selectedRow.length > 0) {
            window.$.each(getData, function (i, item) {
                combinedIds.push({
                    "BookingReservation": item.BookingReservationUUID,
                    "ContainerUUID": item.ContainerUUID,
                })
                containerIDs.push(item.ContainerUUID)
            })
            if(props.title=="special-movement"){
                specialMovementEventHandler(combinedIds, containerIDs, props.host, "Release").then(res => {
                    if (res.message == "Updated successfully.") {
                        window.$("#" + props.tableId).bootstrapTable("refresh")
                        ToastNotify("success", "Container successfully released")
                        window.$("#releaseModal").modal('toggle');
                    }
                })
            }else{
                releaseContainer(combinedIds, props.host).then(res => {
                    if (res.message == "Container Released successfully.") {
                        window.$("#" + props.tableId).bootstrapTable("refresh")
                        ToastNotify("success", "Container successfully released")
                        window.$("#releaseModal").modal('toggle');
                    }
                })
            }
        }
    })

    window.$('#gateInConfirm').off('click').click(function () {
        var getData = selectedRow;
        var combinedIds = [];
        var containerIDs = [];

        if (selectedRow.length > 0) {
            if(props.title=="special-movement"){
                window.$.each(getData, function (i, item) {
                    combinedIds.push({
                        "BookingReservation": item.BookingReservationUUID,
                        "ContainerUUID": item.ContainerUUID,
                    })
                })

                specialMovementEventHandler(combinedIds, containerIDs, props.host, "GateIn").then(res => {
                    if (res.message == "Updated successfully.") {
                        window.$("#" + props.tableId).bootstrapTable("refresh")
                        ToastNotify("success", "Container gate in successfully")
                        window.$("#gateInModal").modal("toggle");
                    }
                })
            }else{
                window.$.each(getData, function (i, item) {
                    combinedIds.push({
                        "BookingReservation": item.BookingReservation.BookingReservationUUID,
                        "ContainerUUID": item.ContainerUUID,
                    })
                })

                gateInContainer(combinedIds, props.host).then(res => {
                    if (res) {
                        window.$("#gateInModal").modal("toggle");
                        window.$("#" + props.tableId).bootstrapTable("refresh")
                        ToastNotify("success", " Container gate in successfully")
                        
                    }
                })
            }

        }

    })


    window.$("#gateOut").click(function () {
        var DocNumArray = [];
        var ids = getIdSelections()
        var getData = selectedRow;
        var objectWithGroupByName = {};
        for (var key in getData) {

            var docNum = "DocNumBR";
            var name = getData[key].BookingReservation;

            if (!objectWithGroupByName[name]) {
                objectWithGroupByName[name] = [];
            }
            objectWithGroupByName[name].push(getData[key]);
        }

        window.$('#gateOutRecordTable').empty().append();
        var html = '<thead>' +
            '<tr>' +
            '<th>BR No</th>' +
            '<th>Container Code</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        window.$.each(objectWithGroupByName, function (i, item) {
            window.$.each(item, function (key, value) {
                if(props.title=="special-movement"){
                    DocNumArray.push(value["BookingReservationDocNum"])
                }else{
                    DocNumArray.push(value["BookingReservation"]["DocNum"])
                }
            })

            var uniqueArray = DocNumArray.filter(function (elem, pos) {
                return DocNumArray.indexOf(elem) == pos;
            });
            html += '<tr><td>' + uniqueArray.join(", ") + '</td><td>'
            window.$.each(item, function (i2, item2) {
                html += item2.ContainerCode + ', ';
            })
            html = html.replace(/,\s*$/, "");
            html += '</td></tr>'

        })
        html += '</tbody>';

        window.$('#gateOutRecordTable').append(html);
        window.$("#gateOutModal").modal();

    })

    window.$('#gateOutConfirm').unbind().click(function () {
        var getData = selectedRow;
        var combinedIds = [];
        var containerIDs = [];

        if(props.title=="special-movement"){
            window.$.each(getData, function (i, item) {
                combinedIds.push({
                    "BookingReservation": item.BookingReservationUUID,
                    "BLUUID": item.BillOfLadingUUID,
                    "ContainerUUID": item.ContainerUUID,
                    "VoyageUUID": item.VoyageUUID
                })
                containerIDs.push(item.ContainerUUID)
            })

            specialMovementEventHandler(combinedIds, containerIDs, props.host, "GateOut").then(res => {
                if (res.message == "Updated successfully.") {
                    window.$("#" + props.tableId).bootstrapTable("refresh")
                    ToastNotify("success", "Container gate out successfully")
                    window.$("#gateOutModal").modal("toggle");
                }
                else if(res.message == "Missing Delivery Oder or Bill Of Lading or Booking Confrimation, Please generate it"){
                    ToastNotify("error", "Missing Delivery Order, please check your selected documents.",5000)
                    window.$("#gateOutModal").modal("toggle");
                }
            })

            // gateOutContainer(combinedIds, props.host).then(res => {

            //     if (res.message == "Generate Delivery Order to perform Gate Out.") {
            //         window.$("#gateOutModal").modal("toggle");
            //         ToastNotify("error", " Generate Delivery Order to perform Gate Out.")
            //         window.$("#" + props.tableId).bootstrapTable("refresh")
            //     } else {
            //         window.$("#gateOutModal").modal("toggle");
            //         ToastNotify("success", " Container gate out successfully")
            //         window.$("#" + props.tableId).bootstrapTable("refresh")
            //     }


            // })
        }else{
            window.$.each(getData, function (i, item) {
                combinedIds.push({
                    "BookingReservation": item.BookingReservation.BookingReservationUUID,
                    "BLUUID": item.BillOfLading.BillOfLadingUUID,
                    "ContainerUUID": item.ContainerUUID,
                    "VoyageUUID": item.Voyage.VoyageUUID

                })
            })

            gateOutContainer(combinedIds, props.host).then(res => {

                if (res.message == "Generate Delivery Order to perform Gate Out.") {
                    window.$("#gateOutModal").modal("toggle");
                    ToastNotify("error", " Generate Delivery Order to perform Gate Out.")
                    window.$("#" + props.tableId).bootstrapTable("refresh")
                } else {
                    window.$("#gateOutModal").modal("toggle");
                    ToastNotify("success", " Container gate out successfully")
                    window.$("#" + props.tableId).bootstrapTable("refresh")
                }


            })
        }

    })

    window.$('#gateIn').click(function () {

        var DocNumArray = [];
        var ids = getIdSelections()
        var getData = selectedRow;
        if (selectedRow.length > 0) {
            var objectWithGroupByName = {};
            for (var key in getData) {

                var docNum = "DocNumBC";
                var name = getData[key].BookingReservation;

                if (!objectWithGroupByName[name]) {
                    objectWithGroupByName[name] = [];
                }
                objectWithGroupByName[name].push(getData[key]);
            }

            window.$('#gateInRecordTable').empty().append();
            var html = '<thead>' +
                '<tr>' +
                '<th>BR No</th>' +
                '<th>Container Code</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';
            window.$.each(objectWithGroupByName, function (i, item) {
                window.$.each(item, function (key, value) {
                    if(props.title=="special-movement"){
                        DocNumArray.push(value["BookingReservationDocNum"])
                    }else{
                        DocNumArray.push(value["BookingReservation"]["DocNum"])
                    }
                })

                var uniqueArray = DocNumArray.filter(function (elem, pos) {
                    return DocNumArray.indexOf(elem) == pos;
                });

                html += '<tr><td>' + uniqueArray.join(", ") + '</td><td>'
                window.$.each(item, function (i2, item2) {
                    html += item2.ContainerCode;
                    if (item.length != i2 + 1) {
                        html += ", "
                    }
                })
                html += '</td></tr>'

            })
            html += '</tbody>';

            window.$('#gateInRecordTable').empty().append(html);
            window.$("#gateInModal").modal("toggle");
        }

    })

    window.$("#loading").click(function () {

        var DocNumArray = [];
        var ids = getIdSelections()
        var getData = selectedRow;

        if (selectedRow.length > 0) {
            var objectWithGroupByName = {};

            for (var key in getData) {

                var docNum = "DocNumBR";
                var name = getData[key].BookingReservation;

                if (!objectWithGroupByName[name]) {
                    objectWithGroupByName[name] = [];
                }
                objectWithGroupByName[name].push(getData[key]);
            }

            window.$('#loadingRecordTable').empty().append();
            var html = '<thead>' +
                '<tr>' +
                '<th>BR No</th>' +
                '<th>Container Code</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';
            window.$.each(objectWithGroupByName, function (i, item) {
                window.$.each(item, function (key, value) {
                    if(props.title=="special-movement"){
                        DocNumArray.push(value["BookingReservationDocNum"])
                    }else{
                        DocNumArray.push(value["BookingReservation"]["DocNum"])
                    }
                })

                var uniqueArray = DocNumArray.filter(function (elem, pos) {
                    return DocNumArray.indexOf(elem) == pos;
                });
                html += '<tr><td>' + uniqueArray.join(", ") + '</td><td>'
                window.$.each(item, function (i2, item2) {
                    html += item2.ContainerCode + ', ';
                })
                html = html.replace(/,\s*$/, "");
                html += '</td></tr>'

            })
            html += '</tbody>';

            window.$('#loadingRecordTable').append(html);
            window.$("#loadingModal").modal();
        }

    })


    window.$('#loadingConfirm').unbind().click(function () {
        var getData = selectedRow;
        var combinedIds = [];
        var containerIDs = [];

        if (selectedRow.length > 0) {
            if(props.title=="special-movement"){

                window.$.each(getData, function (i, item) {
                    combinedIds.push({
                        "BookingReservation": item.BookingReservationUUID,
                        "ContainerUUID": item.ContainerUUID,
                        "VoyageUUID": item.VoyageUUID,
                        "BillOfLadingUUID": item.BillOfLadingUUID,
                    })
                    containerIDs.push(item.ContainerUUID)

                })

                specialMovementEventHandler(combinedIds, containerIDs, props.host, "Loaded").then(res => {
                    console.log(res)
                    if (res.message == "Updated successfully.") {
                        window.$("#" + props.tableId).bootstrapTable("refresh")
                        ToastNotify("success", "Container successfully Loaded")
                        window.$("#loadingModal").modal("toggle");
                    }else if(res.message == "Missing Delivery Oder or Bill Of Lading or Booking Confrimation, Please generate it"){
                        ToastNotify("error", "Missing Bill Of Lading or Booking Confirmation, please check your selected documents.",5000)
                        window.$("#loadingModal").modal("toggle");
                    }
                })

                // loadContainer(combinedIds, props.host).then(res => {
                //     if (res) {
                //         var SuccessArray;
                //         var BLErrors;
                //         var BCErrors;
                //         var totalMessage = "";
                //         if (res.BillOfLadingError.length != 0) {
                //             BLErrors = res.BillOfLadingError.join(",") + " container does not have bill of lading document\n\n"
                //             totalMessage += BLErrors
                //         }
                //         if (res.BookingConfirmationError.length != 0) {
                //             BCErrors = res.BookingConfirmationError.join(",") + " container does not have booking confirmation document\n\n"
                //             totalMessage += BCErrors
                //         }
                //         if (res.Success.length != 0) {

                //             SuccessArray = res.Success.join(",") + " container successfully loaded"
                //             totalMessage += SuccessArray
                //             window.$("#" + props.tableId).bootstrapTable("refresh")
                //             ToastNotify("success", res.Success.join(",") + " container successfully loaded")
                //         }

                //         alert(totalMessage)
                //         window.$("#" + props.tableId).bootstrapTable("refresh")
                //         window.$("#loadingModal").modal("toggle")
                //     }
                // })
            }else{
                window.$.each(getData, function (i, item) {
                    combinedIds.push({
                        "BookingReservation": item.BookingReservation.BookingReservationUUID,
                        "ContainerUUID": item.ContainerUUID,
                        "VoyageUUID": item.Voyage.VoyageUUID,
                        "BillOfLadingUUID": item.BillOfLading.BillOfLadingUUID,
                    })
                })


                loadContainer(combinedIds, props.host).then(res => {
                    if (res) {
                        var SuccessArray;
                        var BLErrors;
                        var BCErrors;
                        var totalMessage = "";
                        if (res.BillOfLadingError.length != 0) {
                            BLErrors = res.BillOfLadingError.join(",") + " container does not have bill of lading document\n\n"
                            totalMessage += BLErrors
                        }
                        if (res.BookingConfirmationError.length != 0) {
                            BCErrors = res.BookingConfirmationError.join(",") + " container does not have booking confirmation document\n\n"
                            totalMessage += BCErrors
                        }
                        if (res.Success.length != 0) {

                            SuccessArray = res.Success.join(",") + " container successfully loaded"
                            totalMessage += SuccessArray
                            window.$("#" + props.tableId).bootstrapTable("refresh")
                            ToastNotify("success", res.Success.join(",") + " container successfully loaded")
                        }

                        alert(totalMessage)
                        window.$("#" + props.tableId).bootstrapTable("refresh")
                        window.$("#loadingModal").modal("toggle")
                    }
                })
            }
        }

        // $.ajax({
        //   type: "POST",
        //   url: "./loaded-container",
        //   data: { BRContainerIDs: combinedIds },
        //   dataType: "json",
        //   success: function (data) {

        //     var SuccessArray;
        //     var BLErrors;
        //     var BCErrors;
        //     var totalMessage="";
        //     if(data.BillOfLadingError.length!=0){
        //       BLErrors=data.BillOfLadingError.join(",")+" container does not have bill of lading document\n\n"
        //       totalMessage+=BLErrors
        //     }
        //     if(data.BookingConfirmationError.length!=0){
        //       BCErrors=data.BookingConfirmationError.join(",")+" container does not have booking confirmation document\n\n"
        //       totalMessage+=BCErrors
        //     }
        //     if(data.Success.length!=0){

        //       SuccessArray=data.Success.join(",")+" container successfully loaded"
        //       totalMessage+=SuccessArray
        //     }
        //     alert(totalMessage)  
        //     $loading.prop('disabled', true)
        //     location.reload();
        //   }
        // })
    })

    window.$("#discharging").unbind().click(function () {
        var DocNumArray = [];
        var ids = getIdSelections()
        var getData = selectedRow;

        var objectWithGroupByName = {};
        for (var key in getData) {

            var docNum = "DocNumBC";
            var name = getData[key].BookingReservation;

            if (!objectWithGroupByName[name]) {
                objectWithGroupByName[name] = [];
            }
            objectWithGroupByName[name].push(getData[key]);
        }

        window.$('#dischargingRecordTable').empty().append();
        var html = '<thead>' +
            '<tr>' +
            '<th>BR No</th>' +
            '<th>Container Code</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        window.$.each(objectWithGroupByName, function (i, item) {
            window.$.each(item, function (key, value) {
                if(props.title=="special-movement"){
                    DocNumArray.push(value["BookingReservationDocNum"])
                }else{
                    DocNumArray.push(value["BookingReservation"]["DocNum"])
                }
            })

            var uniqueArray = DocNumArray.filter(function (elem, pos) {
                return DocNumArray.indexOf(elem) == pos;
            });

            html += '<tr><td>' + uniqueArray.join(", ") + '</td><td>'
            window.$.each(item, function (i2, item2) {
                html += item2.ContainerCode + ', ';
            })
            html = html.replace(/,\s*$/, "");
            html += '</td></tr>'

        })
        html += '</tbody>';

        window.$('#dischargingRecordTable').append(html);
        window.$("#dischargingModal").modal();

    })

    window.$('#dischargingConfirm').unbind().click(function () {
        var getData = selectedRow;
        var combinedIds = [];
        var containerIDs = [];

        if(props.title=="special-movement"){
            window.$.each(getData, function (i, item) {

                combinedIds.push({
                    "BookingReservation": item.BookingReservationUUID,
                    "ContainerUUID": item.ContainerUUID,
                    "OwnershipType": item.OwnershipType,
                    "Transhipment": item.BookingReservationHasTranshipments,
                    "LadenOrEmpty": item.LadenOrEmpty,
                    "VoyageUUID": item.VoyageUUID,
                    "BillOfLadingUUID": item.BillOfLadingUUID,
                })
                containerIDs.push(item.ContainerUUIDss)
            })

            specialMovementEventHandler(combinedIds, containerIDs, props.host, "Discharged").then(res => {
                if (res.message == "Updated successfully.") {
                    window.$("#" + props.tableId).bootstrapTable("refresh")
                    ToastNotify("success", "Container discharged successfully")
                    window.$("#dischargingModal").modal('toggle');
                }
                else if(res.message == "Missing Delivery Oder or Bill Of Lading or Booking Confrimation, Please generate it"){
                    ToastNotify("error", "Missing Bill Of Lading or Booking Confirmation, please check your selected documents.",5000)
                    window.$("#dischargingModal").modal("toggle");
                }
            })

            // dischargeContainer(combinedIds, props.host).then(res => {
            //     window.$("#" + props.tableId).bootstrapTable("refresh")
            //     ToastNotify("success", "Container discharged successfully")
            //     window.$("#dischargingModal").modal("toggle");

            // })
        }else{
            window.$.each(getData, function (i, item) {

                combinedIds.push({
                    "BookingReservation": item.BookingReservation.BookingReservationUUID,
                    "ContainerUUID": item.ContainerUUID,
                    "OwnershipType": item.OwnershipType,
                    "Transhipment": item.BookingReservationHasTranshipments,
                    "LadenOrEmpty": item.LadenOrEmpty,
                    "VoyageUUID": item.Voyage.VoyageUUID,
                    "BillOfLadingUUID": item.BillOfLading.BillOfLadingUUID,
                })
            })


            dischargeContainer(combinedIds, props.host).then(res => {
                window.$("#" + props.tableId).bootstrapTable("refresh")
                ToastNotify("success", "Container discharged successfully")
                window.$("#dischargingModal").modal("toggle");

            })
        }

    })


    window.$("#emptyReturn").click(function () {
        var DocNumArray = [];
        var ids = getIdSelections()
        var getData = selectedRow;

        var objectWithGroupByName = {};
        for (var key in getData) {

            var docNum = "DocNumBR";
            var name = getData[key].BookingReservation;

            if (!objectWithGroupByName[name]) {
                objectWithGroupByName[name] = [];
            }
            objectWithGroupByName[name].push(getData[key]);
        }

        window.$('#emptyReturnRecordTable').empty().append();
        var html = '<thead>' +
            '<tr>' +
            '<th>BR No</th>' +
            '<th>Container Code</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        window.$.each(objectWithGroupByName, function (i, item) {

            window.$.each(item, function (key, value) {
                if(props.title=="special-movement"){
                    DocNumArray.push(value["BookingReservationDocNum"])
                }else{
                    DocNumArray.push(value["BookingReservation"]["DocNum"])
                }
            })

            var uniqueArray = DocNumArray.filter(function (elem, pos) {
                return DocNumArray.indexOf(elem) == pos;
            });

            html += '<tr><td>' + uniqueArray.join(", ") + '</td><td>'
            window.$.each(item, function (i2, item2) {
                html += item2.ContainerCode + ', ';
            })
            html = html.replace(/,\s*$/, "");
            html += '</td></tr>'

        })
        html += '</tbody>';

        window.$('#emptyReturnRecordTable').append(html);
        window.$("#emptyReturnModal").modal();


    })

    window.$('#emptyReturnConfirm').unbind().click(function () {
        var getData = selectedRow;
        var combinedIds = [];
        var containerIDs = [];
        
        var depotId = window.$(`input[name='DynamicModel[Depot]']`).val()

        if(props.title=="special-movement"){
            window.$.each(getData, function (i, item) {
                combinedIds.push({
                    "BookingReservation": item.BookingReservationUUID,
                    "ContainerUUID": item.ContainerUUID,
                    "VoyageUUID": item.VoyageUUID
                })
                containerIDs.push(item.ContainerUUID)
            })
            if (depotId == "" || depotId == null) {
                alert("Depot branch must be fill in")
            }
            else {
                specialMovementEventHandler(combinedIds, containerIDs, props.host, "Receive",depotId).then(res => {
                    if (res.message == "Updated successfully.") {
                        window.$("#" + props.tableId).bootstrapTable("refresh")
                        ToastNotify("success", "Container received successfully")
                        window.$("#emptyReturnModal").modal('toggle');
                    }
                })
                // receivedContainer(combinedIds, props.host).then(res => {
                //     window.$("#" + props.tableId).bootstrapTable("refresh")
                //     ToastNotify("success", "Container received successfully")
                //     window.$("#emptyReturnModal").modal("toggle");
                // })
            }
        }else{
            window.$.each(getData, function (i, item) {
                combinedIds.push({
                    "BookingReservation": item.BookingReservation.BookingReservationUUID,
                    "ContainerUUID": item.ContainerUUID,
                    "VoyageUUID": item.Voyage.VoyageUUID
                })
            })
            if (depotId == "" || depotId == null) {
                alert("Depot branch must be fill in")
            }
            else {
                receivedContainer(combinedIds,depotId, props.host).then(res => {
                    window.$("#" + props.tableId).bootstrapTable("refresh")
                    ToastNotify("success", "Container received successfully")
                    window.$("#emptyReturnModal").modal("toggle");

                })

            }
        }

    })


    window.$("#releaseReplace").unbind().bind().click(async function () {
        var ids = getIdSelections()
        var getContainerByContainerType;
        var replacedBookingReservation;
        var replacedBookingConfirmation;

        var getData = selectedRow;
        var ArrayContainerList = []
        var Depot = window.$(`input[name='DynamicModel[Depot]'`).val()

        if (selectedRow.length > 0) {
            if (Depot == null || Depot == "") {
                Depot = ""
                alert("Please select depot company.");
                return false;
            }

            await getContainerByContainerTypeDepot(Depot, props.host).then(res => {

                ContainerByContainerType = res.data
            })

            var filters = {
                "Container.VerificationStatus": "Approved",
                "Container.Valid": "1",
                "Container.Status": "Available",

            };

            await getContainers(Depot, filters, props.host).then(res => {

                window.$.each(res, function (key, value) {

                    ArrayContainerList.push(value)

                })
            })

            // window.$('#releaseReplaceRecordTable').empty().append();
            var html = '<thead>' +
                '<tr>' +
                '<th>BR No</th>' +
                '<th>Container Code</th>' +
                '<th>Container Type</th>' +
                '<th>Replace</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';
            var ReplaceContainerArray=[];

            window.$.each(getData, function (i, item) {
                var ArrayContainerListGet = []
                replacedBookingReservation = replaceNull(item.BookingReservation, "")
                replacedBookingConfirmation = replaceNull(item.BookingConfirmation, "")
                getContainerByContainerType = ContainerByContainerType[item.ContainerType]
                if (getContainerByContainerType != undefined) {
                    getContainerByContainerType = getContainerByContainerType.replaceAll("</option>", "</option>,")
                    getContainerByContainerType = getContainerByContainerType.split(",")
                }
                else {
                    getContainerByContainerType = [];
                }
                var result = ArrayContainerList.filter(function (oneArray) {
                    return oneArray.OwnershipType == item.OwnershipType
                });

                window.$.each(getContainerByContainerType, function (key, value) {

                    window.$.each(result, function (key2, value2) {
                        if (value.includes(value2.ContainerUUID)) {
                            ArrayContainerListGet.push(value2)
                        }
                    })

                })
                var htmlContainer = "";
                var tempArrayContainerList=[]
                //redo the updated container selection
                window.$.each(ArrayContainerListGet, function (key, value) {
                    tempArrayContainerList.push({value:value.ContainerUUID,label:value.ContainerCode})
                    htmlContainer += "<option value='" + value.ContainerUUID + "'>" + value.ContainerCode + "</option>";
                });


                if (item.BookingReservationDocNum === undefined) {
                    window.$('#releaseReplaceConfirm').prop("disabled", true)
                } else {
                    window.$('#releaseReplaceConfirm').prop("disabled", false)
                }
                html += '<tr><td style="padding: 0px !important;">' + item.BookingReservationDocNum + '</td><td style="padding: 0px !important;">'
                    + item.ContainerCode + '</td><td style="padding: 0px !important;">'
                    + item.ContainerTypeContainerType + '</td><td style="padding: 0px !important;">'
                    + '<select class="js-example-basic-single containerReplace form-control" id="replacedContainerCode-' + i + '" style="width: 100%;" name="container"><option value="">Select...</option> ' + htmlContainer + '</select></td></tr>'

                ReplaceContainerArray.push({
                    ContainerList:tempArrayContainerList,
                    BRDocNum:item.BookingReservationDocNum,
                    ContainerCode:item.ContainerCode,
                    Containertype:item.ContainerTypeContainerType
                })
            })
            html += '</tbody>';
            
            window.$('#replaceDataList').val(JSON.stringify(ReplaceContainerArray));
            // window.$('#releaseReplaceRecordTable').append(html);

            window.$("#releaseReplaceModal").modal();
        }

    })

    window.$("#releaseReplaceConfirm").unbind().click(function () {
        var getReplaced = window.$(".containerReplace");
        var getData = selectedRow
        var replacedIds = []
        var ContainerReplaced = []
        var FindRow = ""

        window.$.each(getReplaced, function (i, item) {
            replacedIds.push(window.$(`input[name='ContainerReplace[${i}]']`).val())
        })

        window.$.each(getData, function (i, item) {
            var replacedBookingReservation = replaceNull(item.BookingReservationUUID, "")

            ContainerReplaced.push({
                "BookingReservation": replacedBookingReservation,
                "ContainerUUID": item.ContainerUUID,
                "ContainerReplaced": replacedIds[i]
            })

            if (!replacedIds[i]) {
                FindRow += i + 1 + ', ';

            }
        })  

        releaseReplaceContainer(ContainerReplaced, props.host).then(res => {
            if (res.message == "Container Replaced successfully.") {
                window.$("#" + props.tableId).bootstrapTable("refresh")
                ToastNotify("success", "Container successfully replaced")
                window.$("#releaseReplaceModal").modal("toggle");
            }
        })
        // if (FindRow) {
        //     alert("There is a missing value at row " + FindRow.replace(/,\s*$/, ""))
        // } else {
        //     $.ajax({
        //         type: "POST",
        //         url: "./replace-release-container",
        //         data: { ContainerReplaced: ContainerReplaced },
        //         dataType: "json",
        //         success: function (data) {
        //             $releaseReplace.prop('disabled', true)
        //         }
        //     })
        // }

    });




    window.$("#update").unbind().click(function () {
        var id = getIdSelections()
        props.navigate(props.routeName + '/id=' + id[0], { state: { id: id[0], formType: "Update" } })

    });


    window.$("#trash").click(function () {
        var object = {}
        if (props.selectedId == "PortUUIDs") {
            props.selectedId = "AreaUUIDs"
        }
        if (props.selectedId == "TerminalUUIDs") {
            props.selectedId = "PortDetailsUUIDs"
        }


        object[props.selectedId] = selections
        if (selections.length > 0) {
            Throw(props.host, props.tableId, object).then(res => {
                if (res.ThrowSuccess.length > 0) {
                    ToastNotify("success", "Successfully Threw")
                    window.$("#" + props.tableSelector).bootstrapTable('refresh')
                    window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
                }

                if (res.RetrieveSuccess.length > 0) {
                    ToastNotify("success", "Successfully Retrieved")
                    window.$("#" + props.tableSelector).bootstrapTable('refresh')
                    window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
                }
            })
        }

    })

    window.$("#Realremove").click(function () {
        var object = {}
        if (props.selectedId == "PortUUIDs") {
            props.selectedId = "AreaUUIDs"
        }
        if (props.selectedId == "TerminalUUIDs") {
            props.selectedId = "PortDetailsUUIDs"
        }
        object[props.selectedId] = selections
        if (selections.length > 0) {
            Remove(props.host, props.tableId, object).then(res => {
                if (res.Success.length > 0) {
                    ToastNotify("success", "Successfully Removed")
                    window.$("#" + props.tableSelector).bootstrapTable('refresh')
                    window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
                }

                if (res.Failed.length > 0) {
                    ToastNotify("error", "Cannot Remove")
                    window.$("#" + props.tableSelector).bootstrapTable('refresh')
                    window.$("#" + props.tableSelector).bootstrapTable('uncheckAll')
                }
            })
        }
        window.$("#ButtonRemoveModal").modal('toggle')

    });






    return (

        <div>

            <table id={props.tableId} className="bootstrap_table">

            </table>


            <div class="modal fade" id="ButtonRemoveModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Remove</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h5>Are you sure you want to remove these records?</h5>
                        </div>
                        <div class="modal-footer">
                            <button id="Realremove" type="button" class="btn btn-success AvoidUnbindClass">Remove</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>



        </div >
    )
}

export default BoostrapTableMovement

