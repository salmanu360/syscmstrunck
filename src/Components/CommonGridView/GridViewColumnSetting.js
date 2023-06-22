import {
  imageFormatter,
  QTFormatterDocNum,
  haulierFommatter,
  INVFormatterDocNum,
  haulierGateOutFommatter,
  DeliveryOrderFormatterDocNum,
  BLDocFormatterDocNum,
  CNFormatterDocNum,
  CNFormatterDocNum2,
  DBFormatterDocNum,
  DBFormatterDocNum2,
  ORFormatterDocNum,
  voyageDelayFormatter,
  CROBRFormatterDocNum,
  CROFormatterDocNum,
  CROQTFormatterDocNum,
  BLBCFormatterDocNum,
  salesinvoiceFormatterDocNum,
  BLFormatterDocNum,
  BLFormatterDocNumSelf,
  DeliveryOrderFormatterDocNum2,
  salesinvoiceFormatterDocNum2,
  BRFormatterDocNum,
  QuotationFormatterDocNum,
  BLDocFormatterDocNumBR,
  LinkFormatterBCNo,
  POFormatterDocNum,
  accessControlFommatter,
  DBFormatterDocNumSelf,
  INVFormatterDocNumSelf,
  ruleSetRuleFommatter
} from "./GridViewFormatter";

const GridViewColumnSetting = (value) => {

  var ColumnSetting = []
  function statusFormatter(value1, row, index) {
    var SalesinvoiceOwe = row.SalesInvoiceOwe ? row.SalesInvoiceOwe : undefined
    var ExistCreditLimit = row.SalesInvoiceCompanyCreditLimit ? row.SalesInvoiceCompanyCreditLimit : ""
    var NoInvoiceDue = true;
    var actionButtons = ""
    if (value == "delivery-order" || value == "delivery-order-barge") {
			if (row.BLStatus == "Generated") {
				actionButtons +=
					'<a title="Generated"><i className="fa fa-external-link-square-alt" style="color:rgba(30,123,53)"></i></a> ';
			} else if (row.BLStatus == "Ready") {
				actionButtons +=
					'<a title="Ready"><i className="fa fa-check" style="color:rgba(30,123,53)"></i></a> ';
			}

			if (row.SalesInvoiceDocNums !== null) {
				actionButtons +=
					'<a title="Invoice"><i className="fa fa-file-invoice-dollar"  style="color:rgba(30,123,53)"></i></a> ';
			}
			if (SalesinvoiceOwe != undefined) {
				var arraySalesinvoiceOwe = SalesinvoiceOwe.split(",");
				window.$.each(arraySalesinvoiceOwe, function (key, value) {
					if (value > 0) {
						if (ExistCreditLimit == 1) {
							actionButtons +=
								'<a title="Invoice Due & Reached Credit Limit"><i className="fas fa-exclamation" style="color:rgba(255,0,0)"></i></a> ';
							NoInvoiceDue = false;
							return false;
						} else {
							actionButtons +=
								'<a title="Invoice Due"><i className="fas fa-exclamation" style="color:rgba(255,0,0)"></i></a> ';
							NoInvoiceDue = false;
							return false;
						}
					}
				});
			}
			if (
				SalesinvoiceOwe == undefined ||
				(SalesinvoiceOwe == "0.0000" && NoInvoiceDue == true)
			) {
				if (ExistCreditLimit == 1) {
					actionButtons +=
						'<a title="Reached Credit Limit"><i className="fas fa-exclamation" style="color:rgba(255,0,0)"></i></a> ';
				}
			}
		}

		if (value !== "delivery-order" && value !== "delivery-order-barge") {
			if (row.VerificationStatus == "Approved") {
				actionButtons +=
					'<a title="Verify"><i className="fa fa-user-check" style="color:rgba(30,123,53)"></i></a> ';
			} else if (row.VerificationStatus == "Rejected") {
				actionButtons +=
					'<a title="Rejected"><i className="fa fa-ban" style="color:red"></i></a> ';
			}
		}

		if (row.TelexRelease == "1") {
			actionButtons +=
				'<a title="Telex Release"><i className="fa fa-share-square" style="color:rgba(30,123,53)"></i></a> ';
		}
		if (value !== "delivery-order" && value !== "delivery-order-barge") {
			if (
				row.SalesInvoiceDocNums !== null &&
				row.SalesInvoiceDocNums !== undefined
			) {
				actionButtons +=
					'<a title="Invoice"><i className="fa fa-file-invoice-dollar"  style="color:rgba(30,123,53)"></i></a> ';
			}
		}
		if (value !== "delivery-order" && value !== "delivery-order-barge") {
			if (row.Nomination !== null && row.Nomination !== undefined) {
				actionButtons +=
					'<a title="Nomination"><i className="fa fa-user-friends" style="color:rgba(30,123,53)"></i></a> ';
			}

			if (row.MergeParent !== null && row.MergeParent !== undefined) {
				actionButtons +=
					'<a title="Merge"><i className="far fa-object-group" style="color:rgba(30,123,53)"></i></a> ';
			}

			if (row.SplitParent !== null && row.SplitParent !== undefined) {
				actionButtons +=
					'<a title="Split"><i className="far fa-object-ungroup" style="color:rgba(30,123,53)"></i></a> ';
			}
		}
		if (row.VoyageUpdatedAt !== undefined) {
			// if (CheckThirdParty) {
			//   if (row.VoyageUpdatedAt !== null && row.VoyageCheckAt == null) {

			//     actionButtons += '<a title="Voyge Delay"><i className="fa fa-ship" style="color:orange"></i></a> ';
			//   }
			// }
			// else {
			if (value !== "delivery-order" && value !== "delivery-order-barge") {
				if (row.VoyageUpdatedAt !== null && row.VoyageCheckAt == null) {
					actionButtons +=
						'<a href="./update/id=' +
						row.id +
						'&D=1"  "title="Voyage Delay"><i className="fa fa-ship" style="color:orange"></i></a> ';
				}
			}
			// }
		}



    return [actionButtons].join('')
  }

  const Area = {
    title: 'port',
    defaultHide: ["Valid"],
    columns:
      [
        { field: 'PortCode', title: 'Port Code', filterControl: "input" }, { field: 'Region', title: 'Region', filterControl: "input" },
        { field: 'Description', title: 'Description', filterControl: "input" }, { field: 'CreatedAtFormat', title: 'Created At', filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" }, { field: 'UpdatedAtFormat', title: 'Updated At', filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" }, { field: 'Valid', title: 'Valid', filterControl: "input" }
      ]
  }

  const CurrencyType = {
    title: 'currency-type',
    defaultHide: ["Valid"],
    columns:
      [
        {
          field: 'CurrencyName',
          title: 'Currency Name',
          filterControl: "input"
        },
        {
          field: 'CurrencySymbol',
          title: 'Symbol',
          filterControl: "input"
        },
        {
          field: 'AccountCode',
          title: 'Account Code',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const CurrencyRate = {
    title: 'currency-rate',
    defaultHide: ["Valid"],
    columns:
      [
        {
          field: 'FromCurrencyCurrencyName',
          title: 'From Currency',
          filterControl: "input"
        },
        {
          field: 'ToCurrencyCurrencyName',
          title: 'To Currency',
          filterControl: "input"
        },
        {
          field: 'Rate',
          title: 'Rate',
          filterControl: "input"
        },
        {
          field: 'StartDateFormat',
          title: 'Start Date',
          filterControl: "input"
        },
        {
          field: 'EndDateFormat',
          title: 'End Date',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }




  const FreightTerm = {
    title: 'freight-term',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'FreightTerm',
          title: 'Freight Term',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const PortTerm = {
    title: 'port-term',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'PortTerm',
          title: 'Port Term',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const TaxCode = {
    title: 'tax-code',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'TaxCode',
          title: 'Tax Code',
          filterControl: "input"
        },
        {
          field: 'TaxRate',
          title: 'Tax Rate',
          filterControl: "input"
        },
        {
          field: 'AccountCode',
          title: 'Account Code',
          filterControl: "input"
        },
        {
          field: 'StartDateFormat',
          title: 'Start Date',
          filterControl: "input"
        },
        {
          field: 'EndDateFormat',
          title: 'End Date',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const CreditTerm = {
    title: 'credit-term',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [
        {
          field: 'CreditTerm',
          title: 'Credit Term',
          filterControl: "input"
        },
        {
          field: 'Day',
          title: 'Day',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const BusinessNature = {
    title: 'business-nature',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'BusinessNature',
          title: 'Business Nature',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const CustomerType = {
    title: 'customer-type',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'CustomerType',
          title: 'Customer Type',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const SupplierType = {
    title: 'supplier-type',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'SupplierType',
          title: 'Supplier Type',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const CompanyType = {
    title: 'company-type',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'CompanyType',
          title: 'Company Type',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }


  const ContainerType = {
    title: 'container-type',
    defaultHide: ["Description", "Valid"],
    columns:
      [
        {
          field: 'ContainerType',
          title: 'Container Type',
          filterControl: "input"
        },
        {
          field: 'Size',
          title: 'Size',
          filterControl: "input"
        },
        {
          field: 'Length',
          title: 'Length(m)',
          filterControl: "input"
        },
        {
          field: 'Width',
          title: 'Width(m)',
          filterControl: "input"
        },
        {
          field: 'Height',
          title: 'Height(m)',
          filterControl: "input"
        },
        {
          field: 'NetWeight',
          title: 'NetWeight(m)',
          filterControl: "input"
        },
        {
          field: 'Tues',
          title: 'Tues',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }


  const VesselType = {
    title: 'vessel-type',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [
        {
          field: 'VesselType',
          title: 'Vessel Type',
          filterControl: "input"
        },
        {
          field: 'AccountCode',
          title: 'Acoount Code',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const UNNumber = {
    title: 'u-n-number',
    defaultHide: ['Description', 'IBCProvisions', 'TankInstructions', 'TankProvisions', 'Ems', 'LPKGroup', 'Import', 'Export', 'TS', 'TSRemark', 'Stowage', 'StowageHandling', 'Segregation', 'PropertiesAndObservations', 'IBCInstructions', 'CreatedAtFormat', 'CreatedByUsername', 'UpdatedAtFormat', 'UpdatedByUsername', 'Valid'],
    columns:
      [
        { field: 'UNNumber', title: 'UN Number', filterControl: "input" },
        { field: 'ProperShippingName', title: 'Proper Shipping Name', filterControl: "input" },
        { field: 'Class', title: 'Class', filterControl: "input" },
        { field: 'SubsidiaryHazards', title: 'Subsidiary Hazard', filterControl: "input" },
        { field: 'PackingGroup', title: 'Packing Group', filterControl: "input" },
        { field: 'SpecialProvisions', title: 'Special Provisions', filterControl: "input" },
        { field: 'LimitedQuantities', title: 'Limited Quantities', filterControl: "input" },
        { field: 'ExceptedQuantities', title: 'Excepted Quantities', filterControl: "input" },
        { field: 'PackingInstructions', title: 'Packing Instructions', filterControl: "input" },
        { field: 'PackingProvisions', title: 'Packing Provisions', filterControl: "input" },
        { field: 'IBCInstructions', title: 'IBC Instructions', filterControl: "input" },
        { field: 'IBCProvisions', title: 'IBC Provisions', filterControl: "input" },
        { field: 'TankInstructions', title: 'Tank Instructions', filterControl: "input" },
        { field: 'TankProvisions', title: 'Tank Provisions', filterControl: "input" },
        { field: 'Ems', title: 'EmS', filterControl: "input" },
        { field: 'Stowage', title: 'Stowage', filterControl: "input" },
        { field: 'StowageHandling', title: 'Stowage Handling', filterControl: "input" },
        { field: 'Segregation', title: 'Segregation', filterControl: "input" },
        { field: 'PropertiesAndObservations', title: 'Properties And Observations', filterControl: "input" },
        { field: 'LPKGroup', title: 'LPK Group', filterControl: "input" },
        { field: 'Import', title: 'Import', filterControl: "input" },
        { field: 'Export', title: 'Export', filterControl: "input" },
        { field: 'TS', title: 'Transhipment', filterControl: "input" },
        { field: 'TSRemark', title: 'Transhipment Remark', filterControl: "input" },
        { field: 'Description', title: 'Description', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' }
      ]

  }

  const HSCode = {
    title: 'h-s-code',
    defaultHide: ['GetChild', 'Valid',],
    columns:
      [
        {
          field: 'Heading',
          title: 'Heading',
          filterControl: "input"
        },
        {
          field: 'ParentHeadingHeading',
          title: 'Parent Heading',
          filterControl: "input"
        },
        {
          field: 'SubHeading',
          title: 'Sub Heading',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'UOQ',
          title: 'UOQ',
          filterControl: "input"
        },
        {
          field: 'RODImport',
          title: 'ROD Import',
          filterControl: "input"
        },
        {
          field: 'RODExport',
          title: 'ROD Export',
          filterControl: "input"
        },
        {
          field: 'GetChild',
          title: 'Get Child',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }

  const ChargesType = {
    title: 'charges-type',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [
        {
          field: 'ChargesType',
          title: 'Charges Type',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }





  const Charges = {
    title: 'charges',
    defaultHide: ['Description',
      'Rate',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'TaxRate',
      'VerifiedByUsername',
      'VerifiedAtFormat',
    ],
    columns:
      [

        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'ChargesCode', title: 'Charges Code', switchable: false, filterControl: "input" },
        { field: 'ChargesName', title: 'Charges Name', filterControl: "input" },
        { field: 'FreightTermFreightTerm', title: 'Frieght Term', filterControl: "input" },
        { field: 'ContainerTypeContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'AccountCode', title: 'GL Code', filterControl: "input" },
        { field: 'PortCodePortCode', title: 'Port Code', filterControl: "input" },
        { field: 'ChargesTypeChargesType', title: 'Charges Type', filterControl: "input" },
        { field: 'CurrencyTypeName', title: 'Currency Type', filterControl: "input" },
        { field: 'VesselTypeName', title: 'Vessel Type', filterControl: "input" },
        { field: 'ReferencePrice', title: 'Reference Price', filterControl: "input" },
        { field: 'MinPrice', title: 'Min Price', filterControl: "input" },
        { field: 'UOM', title: 'UOM', filterControl: "input" },
        { field: 'TaxCodeTaxCode', title: 'Tax Code', filterControl: "input" },
        { field: 'StartDateFormat', title: 'Start Date', sorter: "dateSort", filterControl: "input" },
        { field: 'EndDateFormat', title: 'End Date', sorter: "dateSort", filterControl: "input" },
        { field: 'Rate', title: 'Rate', filterControl: "input" },
        { field: 'TaxRate', title: 'Tax Rate', filterControl: "input" },
        { field: 'Description', title: 'Description', filterControl: "input" },
        { field: 'ApplyToAllPort', title: 'Apply To All Port', filterControl: "input" },
        { field: 'FloatingFormat', title: 'Floating', filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const Tariff = {
    title: 'tariff',
    defaultHide: ['POLAreaNameLocationCode',
      'POLPortTermPortTerm',
      'PODAreaNameLocationCode',
      'PODPortTermPortTerm',
      'HasTranshipment',
      'ShipOperatorCompanyName',
      'ShipOperatorBranchBranchName',
      'BoxOperatorCompanyName',
      'BoxOperatorBranchBranchName',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'VerifiedByUsername',
      'VerifiedAtFormat'],
    columns:
      [


        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'POLPortCodePortCode', title: 'POL Port Code', switchable: false, filterControl: "input" },
        { field: 'PODPortCodePortCode', title: 'POD Port Code', filterControl: "input" },
        { field: 'ContainerOwnershipType', title: 'Ownership', filterControl: "input" },
        { field: 'DgClass', title: 'Dg Class', filterControl: "input" },
        { field: 'EmptyOrLaden', title: 'Empty/Laden', filterControl: "input" },

        { field: 'ShipOperatorCompanyName', title: 'Ship Op Co', filterControl: "input" },
        { field: 'ShipOperatorBranchBranchName', title: 'Ship Op Branch', filterControl: "input" },
        { field: 'BoxOperatorCompanyName', title: 'Box Op Co', filterControl: "input" },
        { field: 'BoxOperatorBranchBranchName', title: 'Box Op Branch', filterControl: "input" },

        { field: 'MinQty', title: 'Min Qty', filterControl: "input" },
        { field: 'StartDateFormat', title: 'Start Date', sorter: "dateSort", filterControl: "input" },
        { field: 'EndDateFormat', title: 'End Date', sorter: "dateSort", filterControl: "input" },
        { field: 'ContainerTypeContainerType', title: 'Container Type', filterControl: "input" },

        { field: 'POLAreaNameLocationCode', title: 'POL Terminal Code', filterControl: "input" },
        { field: 'POLPortTermPortTerm', title: 'POL Port Term', filterControl: "input" },
        { field: 'PODAreaNameLocationCode', title: 'POD Terminal Code', filterControl: "input" },
        { field: 'PODPortTermPortTerm', title: 'POD Port Term', filterControl: "input" },
        { field: 'HasTranshipment', title: 'Has Transhipment', filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }


  const ReceivableMethod = {
    title: 'receivable-method',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [

        {
          field: 'ReceivableMethod',
          title: 'Receivable Method',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'AccountCode',
          title: 'Account Code',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },

        {
          field: 'CompanyCompanyName',
          title: 'Company Name',
          filterControl: "input"
        },
        {
          field: 'CompanyCompanyROC',
          title: 'Company ROC',
          filterControl: "input"
        },
        {
          field: 'BranchBranchName',
          title: 'Branch Name',
          filterControl: "input"
        },
        {
          field: 'BranchBranchCode',
          title: 'Branch Code',
          filterControl: "input"
        },


        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        }
      ]
  }

  const UserGroup = {
    title: 'user-group',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [

        {
          field: 'UserGroup',
          title: 'User Group',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',

        },
      ]

  }

  const Rule = {
    title: 'rule',
    defaultHide: ["Valid"],
    columns:
      [
        {
          field: 'Rule',
          title: 'Rule',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',

        },
      ]

  }
  const RuleSet = {
    title: 'rule-set',
    defaultHide: ["Valid"],
    columns:
      [
        {
          field: 'RuleSet',
          title: 'Rule Set',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'user',
          title: 'Rule Set Rule',
          formatter: ruleSetRuleFommatter,
          switchable: false,
        },
        {
          field: 'Valid',
          title: 'Valid',

        },
      ]

  }

  const User = {
    title: 'user',
    defaultHide: ["status",
      "RoleType",
      "CompanyContactTitle",
      "CompanyContactEmail",
      "CompanyContactGender",
      "CompanyContactDOB",
      "CompanyContactPosition",
      "CompanyContactExt",
      "CompanyContactFax",
      "CompanyContactAddressLine1",
      "CompanyContactAddressLine2",
      "CompanyContactAddressLine3",
      "CompanyContactPostcode",
      "CompanyContactCity",
      "CompanyContactCountry",
      "CompanyContactCoordinates",
      "CompanyContactRemark",
      "created_atFormat",
      "CreatedByUsername",
      "updated_atFormat",
      "UpdatedByUsername",
      "Valid"],
    columns:
      [
        {
          field: 'username',
          title: 'Username',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'email',
          title: 'Account Email',
          filterControl: "input",
          // formatter: 'LinkFormatter'
        },
        {
          field: 'NRIC',
          title: 'NRIC',
          filterControl: "input"
        },
        {
          field: 'CompanyContactCompanyName',
          title: 'Company',
          filterControl: "input"
        },
        {
          field: 'CompanyContactBranchName',
          title: 'Branch',
          filterControl: "input"
        },
        {
          field: 'CompanyContactDepartment',
          title: 'Department',
          filterControl: "input"
        },
        {
          field: 'CompanyContactPosition',
          title: 'Position',
          filterControl: "input"
        },
        {
          field: 'CompanyContactFirstName',
          title: 'First Name',
          filterControl: "input"
        },
        {
          field: 'CompanyContactLastName',
          title: 'Last Name',
          filterControl: "input"
        },
        {
          field: 'CompanyContactTel',
          title: 'Tel',
          filterControl: "input"
        },

        {
          field: 'CompanyContactExt',
          title: 'Ext',
          filterControl: "input"
        },

        {
          field: 'CompanyContactFax',
          title: 'Fax',
          filterControl: "input"
        },

        {
          field: 'CompanyContactAddressLine1',
          title: 'Address Line 1',
          filterControl: "input"
        },

        {
          field: 'CompanyContactAddressLine2',
          title: 'Address Line 2',
          filterControl: "input"
        },

        {
          field: 'CompanyContactAddressLine3',
          title: 'Address Line 3',
          filterControl: "input"
        },

        {
          field: 'CompanyContactPostcode',
          title: 'Postcode',
          filterControl: "input"
        },

        {
          field: 'CompanyContactCity',
          title: 'City',
          filterControl: "input"
        },

        {
          field: 'CompanyContactCountry',
          title: 'Country',
          filterControl: "input"
        },

        {
          field: 'CompanyContactCoordinates',
          title: 'Coordinates',
          filterControl: "input"
        },

        {
          field: 'CompanyContactRemark',
          title: 'Remark',
          filterControl: "input"
        },


        {
          field: 'image',
          title: 'Image',
          formatter: imageFormatter,
        },
        {
          field: 'CompanyContactTitle',
          title: 'Title',
          filterControl: "input"
        },
        {
          field: 'CompanyContactEmail',
          title: 'Email',
          filterControl: "input"
        },
        {
          field: 'CompanyContactGender',
          title: 'Gender',
          filterControl: "input"
        },
        {
          field: 'CompanyContactDOB',
          title: 'DOB',
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'status',
          title: 'Status',
          filterControl: "input"
        },
        {
          field: 'RoleType',
          title: 'Role Type',
          filterControl: "input"
        },
        {
          field: 'created_atFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'updated_atFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'accessControl',
          title: 'Access Control',
          formatter: accessControlFommatter,
          switchable: false,
        },
        {
          field: 'Valid',
          title: 'Valid'
        },

      ]

  }


  const Route = {
    title: 'route',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [
        {
          field: 'ServiceName',
          title: 'Service Name',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'PortCodes',
          title: 'Port Code',
          filterControl: "input"
        },
        {
          field: 'Areas',
          title: 'Area',
          filterControl: "input"
        },
        {
          field: 'LocationCodes',
          title: 'Terminal Code',
          filterControl: "input"
        },
        {
          field: 'PortNames',
          title: 'Terminal Name',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },
      ]

  }

  const Voyage = {
    title: 'voyage',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [
        {
          field: 'VoyageNumber',
          title: 'Voyage Number',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'VesselVesselCode',
          title: 'Vessel',
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'RouteServiceName',
          title: 'Route',
          filterControl: "input"
        },
        {
          field: 'PortCodes',
          title: 'PortCode',
          filterControl: "input"
        },
        {
          field: 'Areas',
          title: 'Area',
          filterControl: "input"
        },
        {
          field: 'LocationCodes',
          title: 'Terminal Code',
          filterControl: "input"
        },
        {
          field: 'PortNames',
          title: 'Terminal Name',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },
      ]

  }


  const Container = {
    title: 'container',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [

        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'ContainerCode',
          title: 'Container Code',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'ContainerTypeContainerType',
          title: 'Container Type',
          filterControl: "input"
        },
        {
          field: 'M3',
          title: 'M3(m)',
          filterControl: "input"
        },
        {
          field: 'NetWeight',
          title: 'Net Weight(kg)',
          filterControl: "input"
        },
        {
          field: 'GrossWeight',
          title: 'Gross Weight(kg)',
          filterControl: "input"
        },
        {
          field: 'ContainerWeight',
          title: 'Container Weight(kg)',
          filterControl: "input"
        },
        {
          field: 'Status',
          title: 'Status',
          filterControl: "input",
        },
        {
          field: 'OwnershipType',
          title: 'Ownership Type',
          filterControl: "input"
        },
        {
          field: 'BoxOperatorCompanyName',
          title: 'Box OP Name',
          filterControl: "input"
        },
        {
          field: 'BoxOperatorROC',
          title: 'Box OP ROC',
          filterControl: "input"
        },
        {
          field: 'BoxOperatorBranchBranchName',
          title: 'Box OP Branch Name',
          filterControl: "input"
        },
        {
          field: 'BoxOperatorBranchCode',
          title: 'Box OP Branch',
          filterControl: "input"
        },
        {
          field: 'OwnerCompanyName',
          title: 'Owner Company',
          filterControl: "input"
        },
        {
          field: 'OwnerROC',
          title: 'Owner ROC',
          filterControl: "input"
        },
        {
          field: 'DepotCompanyName',
          title: 'Depot Company',
          filterControl: "input"
        },
        {
          field: 'DepotROC',
          title: 'Depot ROC',
          filterControl: "input"
        },
        {
          field: 'DepotBranchBranchName',
          title: 'Depot Branch',
          filterControl: "input"
        },
        {
          field: 'DepotBranchCode',
          title: 'Depot Branch ROC',
          filterControl: "input"
        },
        {
          field: 'COCType',
          title: 'COC Type',
          filterControl: "input"
        },
        {
          field: 'SOCType',
          title: 'SOC Type',
          filterControl: "input"
        },
        {
          field: 'CocHiredContract',
          title: 'Coc Hired Contract',
          filterControl: "input"
        },
        {
          field: 'SocFreeUseDetail',
          title: 'Soc Free Use Detail',
          filterControl: "input"
        },
        {
          field: 'Length',
          title: 'Length(m)',
          filterControl: "input"
        },
        {
          field: 'Width',
          title: 'Width(m)',
          filterControl: "input"
        },
        {
          field: 'Height',
          title: 'Height(m)',
          filterControl: "input"
        },
        {
          field: 'Tues',
          title: 'Tues',
          filterControl: "input"
        },
        {
          field: 'YearBuild',
          title: 'Year Build',
          filterControl: "input"
        },
        {
          field: 'Grade',
          title: 'Grade',
          filterControl: "input"
        },
        {
          field: 'Attachements',
          title: 'Attachments',
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          filterControl: "input"
        },
        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        }
      ]

  }

  const Vessel = {
    title: 'vessel',
    defaultHide: ['AccountCode',
      'Flag',
      'Classification',
      'CallSign',
      'GRT',
      'NRT',
      'DeadWeight',
      'LOA',
      'Breadth',
      'Depth',
      'IMONumber',
      'Draft',
      'ReeferPlug',
      'MainEngine',
      'Prefix',
      'NextNumber',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'VerifiedByUsername',
      'VerifiedAtFormat'],
    columns:
      [
        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'VesselCode', title: 'Vessel Code', filterControl: "input" },
        { field: 'VesselName', title: 'Vessel Name', switchable: false, filterControl: "input" },
        { field: 'VesselTypeVesselType', title: 'Vessel Type', filterControl: "input" },
        { field: 'AccountCode', title: 'Account Code', filterControl: "input" },
        { field: 'OfficialNumber', title: 'Official Number', filterControl: "input" },
        { field: 'IMONumber', title: 'IMO Number', filterControl: "input" },
        { field: 'RegistryPortCodePortCode', title: 'Registry Port Code', filterControl: "input" },
        { field: 'Flag', title: 'Flag', filterControl: "input" },
        { field: 'Classification', title: 'Classification', filterControl: "input" },
        { field: 'CallSign', title: 'Call Sign', filterControl: "input" },
        { field: 'GRT', title: 'GRT(ton)', filterControl: "input" },
        { field: 'NRT', title: 'NRT(ton)', filterControl: "input" },
        { field: 'DeadWeight', title: 'Dead Weight(ton)', filterControl: "input" },
        { field: 'LOA', title: 'LOA(m)', filterControl: "input" },
        { field: 'Breadth', title: 'Breadth(m)', filterControl: "input" },
        { field: 'Depth', title: 'Depth(m)', filterControl: "input" },
        { field: 'Draft', title: 'Draft(m)', filterControl: "input" },
        { field: 'CargoCapacity', title: 'Cargo Capacity (tues)', filterControl: "input" },
        { field: 'YearBuild', title: 'Year Build', filterControl: "input" },
        { field: 'ReeferPlug', title: 'Reefer Plug (unit)', filterControl: "input" },
        { field: 'MainEngine', title: 'Main Engine', filterControl: "input" },
        { field: 'Prefix', title: 'Voyage Number Prefix', filterControl: "input" },
        { field: 'NextNumber', title: 'Next Voyage Number', filterControl: "input" },
        { field: 'OwnerCompanyName', title: 'Owner Name', filterControl: "input" },
        { field: 'OwnerROC', title: 'Owner ROC', filterControl: "input" },
        { field: 'OwnerBranchBranchName', title: 'Owner Branch Name', filterControl: "input" },
        { field: 'OwnerBranchCode', title: 'Owner Branch', filterControl: "input" },
        { field: 'ShipOperatorCompanyName', title: 'Ship Op Name', filterControl: "input" },
        { field: 'ShipOperatorROC', title: 'Ship Op ROC', filterControl: "input" },
        { field: 'ShipOperatorBranchBranchName', title: 'Ship Op Branch Name', filterControl: "input" },
        { field: 'ShipOperatorBranchCode', title: 'Ship Op Branch', filterControl: "input" },
        { field: 'BuilderCompanyName', title: 'Builder Name', filterControl: "input" },
        { field: 'BuilderROC', title: 'Builder ROC', filterControl: "input" },
        { field: 'BuilderBranchBranchName', title: 'Builder Branch Name', filterControl: "input" },
        { field: 'BuilderBranchCode', title: 'Builder Branch', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]

  }

  const PortDetails = {
    title: 'terminal',
    defaultHide: ["CreatedAtFormat", "CreatedByUsername", "UpdatedAtFormat", "UpdatedByUsername", "Valid"],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'LocationCode',
          title: 'Terminal Code',
          filterControl: "input"
        },
        {
          field: 'PortName',
          title: 'Terminal Name',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'HandlingCompanyBranchPortCode',
          title: 'Port Code',
          filterControl: "input"
        },
        {
          field: 'HandlingCompanyBranchArea',
          title: 'Area',
          filterControl: "input"
        },
        {
          field: 'StationCode',
          title: 'Station Code',
          filterControl: "input"
        },

        {
          field: 'CompanyCompanyName',
          title: 'Company Name',
          filterControl: "input"
        },
        {
          field: 'BranchBranchName',
          title: 'Branch Name',
          filterControl: "input"
        },
        {
          field: 'HandlingCompanyCompanyName',
          title: 'Terminal Handler Company',
          filterControl: "input"
        },
        {
          field: 'HandlingCompanyBranchBranchName',
          title: 'Terminal Handler Branch',
          filterControl: "input"
        },
        {
          field: 'YardCapacity',
          title: 'Yard Capacity',
          filterControl: "input"
        },
        {
          field: 'BerthLength',
          title: 'Berth Length(m)',
          filterControl: "input"
        },
        {
          field: 'QuayCraneNum',
          title: 'Quay Crane Num',
          filterControl: "input"
        },
        {
          field: 'RTGNum',
          title: 'RTG No',
          filterControl: "input"
        },
        {
          field: 'StackerNum',
          title: 'Stacker No',
          filterControl: "input"
        },
        {
          field: 'Default',
          title: 'Default Terminal',
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          filterControl: "input"
        },
        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },
      ]

  }


  const Company = {
    title: 'company',
    defaultHide: [
      'Description',
      'Website',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'VerifiedByUsername',
      'VerifiedAtFormat',
      'CompanyContactFirstNames',
      'CompanyContactLastNames',
      'CompanyContactTels',
      'SalesPersonUsername',
      'CompanyContactEmails'],
    columns:
      [

        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'CompanyName', title: 'Company Name', switchable: false, filterControl: "input" },
        { field: 'ROC', title: 'ROC', filterControl: "input" },
        { field: 'AgentCode', title: 'Agent Code', filterControl: "input" },
        { field: 'Areas', title: 'Area', filterControl: "input" },
        { field: 'CompanyTypes', title: 'Company Type', filterControl: "input" },
        { field: 'BusinessNatures', title: 'Business Nature', filterControl: "input" },
        { field: 'AccountCode', title: 'Account Code', filterControl: "input" },
        { field: 'CreditTermCreditTerm', title: 'Credit Term', filterControl: "input" },
        { field: 'CreditLimit', title: 'Credit Limit', filterControl: "input" },
        { field: 'CompanyBranchTels', title: 'Tel', filterControl: "input" },
        { field: 'CompanyBranchEmails', title: 'Email', filterControl: "input" },
        { field: 'Website', title: 'Website', filterControl: "input", formatter: "WebsiteFormatter" },
        { field: 'Description', title: 'Description', filterControl: "input" },
        { field: 'Logo', title: 'Logo', filterControl: "input" },
        { field: 'BranchNames', title: 'Branch Name', filterControl: "input" },
        { field: 'PortCodes', title: 'Port Code', filterControl: "input" },
        { field: 'CompanyContactFirstNames', title: 'First Name', filterControl: "input" },
        { field: 'CompanyContactLastNames', title: 'Last Name', filterControl: "input" },
        { field: 'CompanyContactTels', title: 'Contact Tel', filterControl: "input" },
        { field: 'CompanyContactEmails', title: 'Contact Email', filterControl: "input" },
        { field: 'SalesPersonUsername', title: 'Sales Person', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const CargoType = {
    title: 'cargo-type',
    defaultHide: ["Valid"],
    columns:
      [

        {
          field: 'CargoType',
          title: 'Cargo Type',
          switchable: false,
          filterControl: "input"
        },
        {
          field: 'Description',
          title: 'Description',
          filterControl: "input"
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',

        },

      ]
  }

  const ContainerRelease = {
    title: 'container-release',
    defaultHide: [
      "DepotBranchName",
      "DepotCompanyName",
      "DepotPortCode",
      "Length",
      "Width",
      "Height",
      "M3",
      "NetWeight",
      "GrossWeight",
      "YearBuild",
      "Grade",
      "BoxOperatorCompanyName",
      "Valid",],
    columns:
      [

        { field: 'haulier', title: 'Hauler', formatter: haulierFommatter, switchable: false, },
        { field: 'ContainerCode', title: 'Container Code', filterControl: "input" },
        { field: 'ContainerTypeContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'Status', title: 'Status', filterControl: "input" },
        { field: 'VoyageNumber', title: 'Voyage No', filterControl: "input" },
        { field: 'BookingReservationDocNum', title: 'BR No', filterControl: "input" },
        { field: 'BookingConfirmationDocNum', title: 'BC No', filterControl: "input" },
        { field: 'ContainerReleaseOrderDocNum', title: 'CRO No', filterControl: "input" },
        { field: 'BillOfLadingDocNum', title: 'BL No', filterControl: "input" },
        { field: 'OwnershipType', title: 'Ownership Type', filterControl: "input" },
        { field: 'LadenOrEmpty', title: 'Laden / Empty', filterControl: "input" },
        { field: 'BookingReservationHasTranshipments', title: 'Transhipment', filterControl: "input" },
        { field: 'DepotPortCode', title: 'Depot Port Code', filterControl: "input" },
        { field: 'DepotCompanyName', title: 'Depot Company', filterControl: "input" },
        { field: 'DepotBranchName', title: 'Depot', filterControl: "input" },
        { field: 'Length', title: 'Length', filterControl: "input" },
        { field: 'Width', title: 'Width', filterControl: "input" },
        { field: 'Height', title: 'Height', filterControl: "input" },
        { field: 'M3', title: 'M3', filterControl: "input" },
        { field: 'NetWeight', title: 'Net Weight', filterControl: "input" },
        { field: 'GrossWeight', title: 'Gross Weight', filterControl: "input" },
        { field: 'YearBuild', title: 'Year Build', filterControl: "input" },
        { field: 'Grade', title: 'Grade', filterControl: "input" },
        { field: 'BoxOperatorCompanyName', title: 'Box Operator', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },

      ]
  }

  const ContainerVerifyGrossMass = {
    title: 'container-verify-gross-mass',
    defaultHide: [
      "GrossWeight",
      "Valid",],
    columns:
      [
        {
          field: 'BookingReservationDocNum',
          title: 'BR No.',
          filterControl: 'input'
        },
        {
          field: 'BookingConfirmationDocNum',
          title: 'BC No.',
          filterControl: 'input'
        },
        {
          field: 'ContainerReleaseOrderDocNum',
          title: 'Container Release Order',
          filterControl: 'input'
        },
        {
          field: 'AgentCompanyName',
          title: 'Agent',
          filterControl: 'input'
        },
        {
          field: 'ShipperCompanyName',
          title: 'Shipper',
          filterControl: 'input'
        },
        {
          field: 'VesselVesselName',
          title: 'Vessel Name',
          filterControl: 'input'
        },
        {
          field: 'VesselETAFormat',
          title: 'Vessel ETA',
          filterControl: 'input'
        },
        {
          field: 'ContainerContainerType',
          title: 'Container Type',
          filterControl: 'input'
        },
        {
          field: 'ContainerCodeContainerCode',
          title: 'Container Code',
          filterControl: 'input'
        },


        {
          field: 'GrossWeight',
          title: 'Container Gross Weight',
          filterControl: 'input'
        },
        {
          field: 'TicketNum',
          title: 'Weight Ticket No.',
          filterControl: 'input'
        },
        {
          field: 'TicketDateTimeFormat',
          title: 'Weight Ticket Date',
          filterControl: 'input'
        },
        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },

        {
          field: 'Valid',
          title: 'Valid',
          filterControl: 'input'
        },
      ]


  }

  const ContainerGateIn = {
    title: 'container-gate-in',
    defaultHide: [
      "Length",
      "Width",
      "Height",
      "M3",
      "NetWeight",
      "GrossWeight",
      "YearBuild",
      "Grade",
      "boxOperatorCompany.CompanyName",
      "Valid"],
    columns:
      [
        { field: 'ContainerCode', title: 'Container Code', filterControl: "input" },
        { field: 'containerType.ContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'Status', title: 'Status', filterControl: "input" },
        { field: 'Voyage.VoyageName', title: 'Voyage No', filterControl: "input" },
        { field: 'BookingReservation.DocNum', title: 'BR No', filterControl: "input" },
        { field: 'BookingConfirmation.DocNum', title: 'BC No', filterControl: "input" },
        { field: 'ContainerReleaseOrder.DocNum', title: 'CRO No', filterControl: "input" },
        { field: 'BillOfLading.DocNum', title: 'BL No', filterControl: "input" },
        { field: 'OwnershipType', title: 'Ownership Type', filterControl: "input" },
        { field: 'LadenOrEmpty', title: 'Laden / Empty', filterControl: "input" },
        { field: 'BookingReservationHasTranshipments', title: 'Transhipment', filterControl: "input" },
        { field: 'Length', title: 'Length', filterControl: "input" },
        { field: 'Width', title: 'Width', filterControl: "input" },
        { field: 'Height', title: 'Height', filterControl: "input" },
        { field: 'M3', title: 'M3', filterControl: "input" },
        { field: 'NetWeight', title: 'Net Weight', filterControl: "input" },
        { field: 'GrossWeight', title: 'Gross Weight', filterControl: "input" },
        { field: 'YearBuild', title: 'Year Build', filterControl: "input" },
        { field: 'Grade', title: 'Grade', filterControl: "input" },
        { field: 'boxOperatorCompany.CompanyName', title: 'Box Operator', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },

      ]


  }

  const ContainerLoaded = {
    title: 'container-loaded',
    defaultHide: [
      "Length",
      "Width",
      "Height",
      "M3",
      "NetWeight",
      "GrossWeight",
      "YearBuild",
      "Grade",
      "boxOperatorCompany.CompanyName",
      "Valid"],
    columns:
      [
        { field: 'ContainerCode', title: 'Container Code', filterControl: "input" },
        { field: 'containerType.ContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'Status', title: 'Status', filterControl: "input" },
        { field: 'Voyage.VoyageName', title: 'Voyage No', filterControl: "input" },
        { field: 'BookingReservation.DocNum', title: 'BR No', filterControl: "input" },
        { field: 'BookingConfirmation.DocNum', title: 'BC No', filterControl: "input" },
        { field: 'ContainerReleaseOrder.DocNum', title: 'CRO No', filterControl: "input" },
        { field: 'BillOfLading.DocNum', title: 'BL No', filterControl: "input" },
        { field: 'OwnershipType', title: 'Ownership Type', filterControl: "input" },
        { field: 'LadenOrEmpty', title: 'Laden / Empty', filterControl: "input" },
        { field: 'BookingReservationHasTranshipments', title: 'Transhipment', filterControl: "input" },
        { field: 'Length', title: 'Length', filterControl: "input" },
        { field: 'Width', title: 'Width', filterControl: "input" },
        { field: 'Height', title: 'Height', filterControl: "input" },
        { field: 'M3', title: 'M3', filterControl: "input" },
        { field: 'NetWeight', title: 'Net Weight', filterControl: "input" },
        { field: 'GrossWeight', title: 'Gross Weight', filterControl: "input" },
        { field: 'YearBuild', title: 'Year Build', filterControl: "input" },
        { field: 'Grade', title: 'Grade', filterControl: "input" },
        { field: 'boxOperatorCompany.CompanyName', title: 'Box Operator', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },

      ]


  }

  const ContainerDischarged = {
    title: 'container-discharged',
    defaultHide: [
      "Length",
      "Width",
      "Height",
      "M3",
      "NetWeight",
      "GrossWeight",
      "YearBuild",
      "Grade",
      "boxOperatorCompany.CompanyName",
      "Valid"],
    columns:
      [
        { field: 'ContainerCode', title: 'Container Code', filterControl: "input" },
        { field: 'containerType.ContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'Status', title: 'Status', filterControl: "input" },
        { field: 'Voyage.VoyageName', title: 'Voyage No', filterControl: "input" },
        { field: 'BookingReservation.DocNum', title: 'BR No', filterControl: "input" },
        { field: 'BookingConfirmation.DocNum', title: 'BC No', filterControl: "input" },
        { field: 'ContainerReleaseOrder.DocNum', title: 'CRO No', filterControl: "input" },
        { field: 'BillOfLading.DocNum', title: 'BL No', filterControl: "input" },
        { field: 'OwnershipType', title: 'Ownership Type', filterControl: "input" },
        { field: 'LadenOrEmpty', title: 'Laden / Empty', filterControl: "input" },
        { field: 'BookingReservationHasTranshipments', title: 'Transhipment', filterControl: "input" },
        { field: 'Length', title: 'Length', filterControl: "input" },
        { field: 'Width', title: 'Width', filterControl: "input" },
        { field: 'Height', title: 'Height', filterControl: "input" },
        { field: 'M3', title: 'M3', filterControl: "input" },
        { field: 'NetWeight', title: 'Net Weight', filterControl: "input" },
        { field: 'GrossWeight', title: 'Gross Weight', filterControl: "input" },
        { field: 'YearBuild', title: 'Year Build', filterControl: "input" },
        { field: 'Grade', title: 'Grade', filterControl: "input" },
        { field: 'boxOperatorCompany.CompanyName', title: 'Box Operator', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },

      ]


  }

  const ContainerGateOut = {
    title: 'container-gate-out',
    defaultHide: [
      "Length",
      "Width",
      "Height",
      "M3",
      "NetWeight",
      "GrossWeight",
      "YearBuild",
      "Grade",
      "boxOperatorCompany.CompanyName",
      "Valid"],
    columns:
      [
        { field: 'haulier', title: 'Haulier', formatter: haulierGateOutFommatter, switchable: false, },
        { field: 'ContainerCode', title: 'Container Code', filterControl: "input" },
        { field: 'containerType.ContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'Status', title: 'Status', filterControl: "input" },
        { field: 'Voyage.VoyageName', title: 'Voyage No', filterControl: "input" },
        { field: 'BookingReservation.DocNum', title: 'BR No', filterControl: "input" },
        { field: 'BookingConfirmation.DocNum', title: 'BC No', filterControl: "input" },
        { field: 'ContainerReleaseOrder.DocNum', title: 'CRO No', filterControl: "input" },
        { field: 'BillOfLading.DocNum', title: 'BL No', filterControl: "input" },
        { field: 'OwnershipType', title: 'Ownership Type', filterControl: "input" },
        { field: 'LadenOrEmpty', title: 'Laden / Empty', filterControl: "input" },
        { field: 'BookingReservationHasTranshipments', title: 'Transhipment', filterControl: "input" },
        { field: 'Length', title: 'Length', filterControl: "input" },
        { field: 'Width', title: 'Width', filterControl: "input" },
        { field: 'Height', title: 'Height', filterControl: "input" },
        { field: 'M3', title: 'M3', filterControl: "input" },
        { field: 'NetWeight', title: 'Net Weight', filterControl: "input" },
        { field: 'GrossWeight', title: 'Gross Weight', filterControl: "input" },
        { field: 'YearBuild', title: 'Year Build', filterControl: "input" },
        { field: 'Grade', title: 'Grade', filterControl: "input" },
        { field: 'boxOperatorCompany.CompanyName', title: 'Box Operator', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },

      ]


  }

  const ContainerReceived = {
    title: 'container-received',
    defaultHide: [
      "Length",
      "Width",
      "Height",
      "M3",
      "NetWeight",
      "GrossWeight",
      "YearBuild",
      "Grade",
      "boxOperatorCompany.CompanyName",
      "Valid"],
    columns:
      [
        {
          field: 'ContainerCode',
          title: 'Container Code',
          filterControl: "input"
        },
        {
          field: 'containerType.ContainerType',
          title: 'Container Type',
          filterControl: "input"
        },
        {
          field: 'Status',
          title: 'Status',
          filterControl: "input"
        },
        {
          field: 'Voyage.VoyageName',
          title: 'Voyage No',
          filterControl: "input"
        },
        {
          field: 'BookingReservation.DocNum',
          title: 'BR No',
          filterControl: "input"
        },
        {
          field: 'BookingConfirmation.DocNum',
          title: 'BC No',
          filterControl: "input"
        },
        {
          field: 'ContainerReleaseOrder.DocNum',
          title: 'CRO No',
          filterControl: "input"
        },
        {
          field: 'BillOfLading.DocNum',
          title: 'BL No',
          filterControl: "input"
        },
        {
          field: 'OwnershipType',
          title: 'Ownership Type',
          filterControl: "input"
        },
        {
          field: 'LadenOrEmpty',
          title: 'Laden / Empty',
          filterControl: "input"
        },
        {
          field: 'BookingReservationHasTranshipments',
          title: 'Transhipment',
          filterControl: "input"
        },
        {
          field: 'Length',
          title: 'Length',
          filterControl: "input"
        },
        {
          field: 'Width',
          title: 'Width',
          filterControl: "input"
        },
        {
          field: 'Height',
          title: 'Height',
          filterControl: "input"
        },
        {
          field: 'M3',
          title: 'M3',
          filterControl: "input"
        },
        {
          field: 'NetWeight',
          title: 'Net Weight',
          filterControl: "input"
        },
        {
          field: 'GrossWeight',
          title: 'Gross Weight',
          filterControl: "input"
        },
        {
          field: 'YearBuild',
          title: 'Year Build',
          filterControl: "input"
        },
        {
          field: 'Grade',
          title: 'Grade',
          filterControl: "input"
        },
        {
          field: 'boxOperatorCompany.CompanyName',
          title: 'Box Operator',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        }

      ]


  }


  const Quotation = {
    title: 'quotation',
    defaultHide: [
      'DocDesc',
      'ValidityDay',
      'AdvanceBookingStartDateFormat',
      'CurrencyCurrencyName',
      'CurrencyExchangeRate',
      'POLPortCodePortCode',
      'POLAreaName',
      'POLLocationCodeLocationCode',
      'POLLocationName',
      'POLPortTermPortTerm',
      'POLFreightTermFreightTerm',
      'POLHandlingOfficeCompanyName',
      'POLHandlingOfficeName',
      'POLReqETAFormat',
      'PODPortCodePortCode',
      'PODAreaName',
      'PODLocationCodeLocationCode',
      'PODLocationName',
      'PODPortTermPortTerm',
      'PODFreightTermFreightTerm',
      'PODHandlingOfficeCompanyName',
      'PODHandlingOfficeName',
      'PODReqETAFormat',
      'FinalDestinationPortCode',
      'FinalDestinationArea',
      'FinalDestinationHandlerROC',
      'VoyageName',
      'VesselCode',
      'VesselName',
      'POLETAFormat',
      'POLSCNCode',
      'PODETAFormat',
      'PODSCNCode',
      'ClosingDateTimeFormat',
      'ShipOperatorROC',
      'ShipOperatorCompany',
      'ShipOperatorBranchCodeBranchCode',
      'ShipOperatorBranchName',
      'InsistTranshipment',
      'ApplyDND',
      'DNDCombined',
      'DNDCombinedDay',
      'Detention',
      'Demurrage',
      'QuotationHaulerPOLHaulerCompanyName',
      'QuotationHaulerPODHaulerCompanyName',
      'AutoBilling',
      'TotalM3',
      'TotalNetWeight',
      'TotalGrossWeight',
      'TotalTues',
      'TotalDiscount',
      'TotalTax',
      'QuotationBillToCompanyName',
      'RejectMessage',
      'VerificationStatus',
      'VerifiedAtFormat',
      'NominationPortCode',
      'VerifiedByUsername',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
    ],
    columns:
      [
        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'DocNum', title: 'QT No.', switchable: false, filterCustomSearch: "GetText", formatter: QTFormatterDocNum, filterControl: "input" },
        { field: 'DocDateFormat', title: 'QT Doc Date', sorter: "dateSort", filterControl: "input" },
        { field: 'DocDesc', title: 'DocDesc', filterControl: "input" },
        { field: 'SalesPersonUsername', title: 'Sales Person', filterControl: "input" },
        { field: 'QuotationType', title: 'Quotation Type', filterControl: "input" },
        { field: 'ValidityDay', title: 'Validity Day', filterControl: "input" },
        { field: 'LastValidDateFormat', title: 'Last Valid Date', sorter: "dateSort", filterControl: "input" },
        { field: 'AdvanceBookingStartDateFormat', title: 'Advance Booking Start Date', sorter: "dateSort", filterControl: "input" },
        { field: 'AdvanceBookingLastValidDateFormat', title: 'Advance Booking Last Valid Date', sorter: "dateSort", filterControl: "input" },
        { field: 'QuotationAgentCompanyName', title: 'Agent', filterControl: "input" },
        { field: 'QuotationShipperCompanyName', title: 'Shipper', filterControl: "input" },
        { field: 'QuotationConsigneeCompanyName', title: 'Consignee', filterControl: "input" },
        { field: 'QuotationNotifyPartyCompanyName', title: 'Notify Party', filterControl: "input" },
        { field: 'QuotationAttentionPartyCompanyName', title: 'Attention Party', filterControl: "input" },
        { field: 'CurrencyCurrencyName', title: 'Currency Name', filterControl: "input" },
        { field: 'CurrencyExchangeRate', title: 'Currency Exchange Rate', filterControl: "input" },
        { field: 'POLPortCodePortCode', title: 'POL Port Code', filterControl: "input" },
        { field: 'POLAreaName', title: 'POL Area', filterControl: "input" },
        { field: 'POLLocationCodeLocationCode', title: 'POL Terminal Code', filterControl: "input" },
        { field: 'POLLocationName', title: 'POL Terminal Name', filterControl: "input" },
        { field: 'POLPortTermPortTerm', title: 'POL Port Term', filterControl: "input" },
        { field: 'POLFreightTermFreightTerm', title: 'POL Freight Term', filterControl: "input" },
        { field: 'POLHandlingOfficeCompanyName', title: 'POL Terminal Handler Company', filterControl: "input" },
        { field: 'POLHandlingOfficeName', title: 'POL Terminal Handler Branch Name', filterControl: "input" },
        { field: 'POLReqETAFormat', title: 'POL Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODPortCodePortCode', title: 'POD Port Code', filterControl: "input" },
        { field: 'PODAreaName', title: 'POD Area', filterControl: "input" },
        { field: 'PODLocationCodeLocationCode', title: 'POD Terminal Code', filterControl: "input" },
        { field: 'PODLocationName', title: 'POD Terminal Name', filterControl: "input" },
        { field: 'PODPortTermPortTerm', title: 'POD Port Term', filterControl: "input" },
        { field: 'PODFreightTermFreightTerm', title: 'POD Freight Term', filterControl: "input" },
        { field: 'PODHandlingOfficeCompanyName', title: 'POD Terminal Handler Company', filterControl: "input" },
        { field: 'PODHandlingOfficeName', title: 'POD Terminal Handler Branch Name', filterControl: "input" },
        { field: 'PODReqETAFormat', title: 'POD Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'FinalDestinationPortCode', title: 'Final Destination', filterControl: "input" },
        { field: 'FinalDestinationArea', title: 'Final Destination Area', filterControl: "input" },
        { field: 'FinalDestinationHandlerROC', title: 'Final Destination Agent Company', filterControl: "input" },
        { field: 'VoyageName', title: 'Voyage Num', filterControl: "input" },
        { field: 'VesselCode', title: 'Vessel Code', filterControl: "input" },
        { field: 'VesselName', title: 'Vessel Name', filterControl: "input" },
        { field: 'POLETAFormat', title: 'POL ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLETDFormat', title: 'POL ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLSCNCode', title: 'POL SCN Code', filterControl: "input" },
        { field: 'PODETAFormat', title: 'POD ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODETDFormat', title: 'POD ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODSCNCode', title: 'POD SCN Code', filterControl: "input" },
        { field: 'ClosingDateTimeFormat', title: 'Closing Date Time', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'ShipOperatorROC', title: 'Ship Operator ROC', filterControl: "input" },
        { field: 'ShipOperatorCompany', title: 'Ship Operator Company', filterControl: "input" },
        { field: 'ShipOperatorBranchCodeBranchCode', title: 'Ship Operator Branch Code', filterControl: "input" },
        { field: 'ShipOperatorBranchName', title: 'Ship Operator Branch', filterControl: "input" },
        { field: 'InsistTranshipment', title: 'Insist Transhipment', filterControl: "input" },
        { field: 'ApplyDND', title: 'Apply DND', filterControl: "input" },
        { field: 'DNDCombined', title: 'DND Combined', filterControl: "input" },
        { field: 'DNDCombinedDay', title: 'DND Combined Day', filterControl: "input" },
        { field: 'Detention', title: 'Detention', filterControl: "input" },
        { field: 'Demurrage', title: 'Demurrage', filterControl: "input" },
        { field: 'QuotationHaulerPOLHaulerCompanyName', title: 'POL Hauler', filterControl: "input" },
        { field: 'QuotationHaulerPODHaulerCompanyName', title: 'POD Hauler', filterControl: "input" },
        { field: 'AutoBilling', title: 'Auto Billing', filterControl: "input" },
        { field: 'TotalM3', title: 'Total M3(m)', filterControl: "input" },
        { field: 'TotalNetWeight', title: 'Total Net Weight(kg)', filterControl: "input" },
        { field: 'TotalGrossWeight', title: 'Total Gross Weight(kg)', filterControl: "input" },
        { field: 'TotalTues', title: 'Total Tues', filterControl: "input" },
        { field: 'TotalDiscount', title: 'Total Discount', filterControl: "input" },
        { field: 'TotalTax', title: 'Total Tax', filterControl: "input" },
        { field: 'TotalAmount', title: 'Total Amount', filterControl: "input" },
        { field: 'NominationPortCode', title: 'Nomination', filterControl: "input" },
        { field: 'QuotationBillToCompanyName', title: 'Bill To', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'RejectMessage', title: 'Reject Message', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const QuotationBarge = {
    title: 'quotation-barge',
    defaultHide: [
      'DocDesc',
      'ValidityDay',
      'AdvanceBookingStartDateFormat',
      'CurrencyCurrencyName',
      'CurrencyExchangeRate',
      'POLPortCodePortCode',
      'POLAreaName',
      'POLLocationCodeLocationCode',
      'POLLocationName',
      'POLPortTermPortTerm',
      'POLFreightTermFreightTerm',
      'POLHandlingOfficeCompanyName',
      'POLHandlingOfficeName',
      'POLReqETAFormat',
      'PODPortCodePortCode',
      'PODAreaName',
      'PODLocationCodeLocationCode',
      'PODLocationName',
      'PODPortTermPortTerm',
      'PODFreightTermFreightTerm',
      'PODHandlingOfficeCompanyName',
      'PODHandlingOfficeName',
      'PODReqETAFormat',
      'FinalDestinationPortCode',
      'FinalDestinationArea',
      'FinalDestinationHandlerROC',
      'VoyageName',
      'VesselCode',
      'VesselName',
      'POLETAFormat',
      'POLSCNCode',
      'PODETAFormat',
      'PODSCNCode',
      'ClosingDateTimeFormat',
      'ShipOperatorROC',
      'ShipOperatorCompany',
      'ShipOperatorBranchCodeBranchCode',
      'ShipOperatorBranchName',
      'InsistTranshipment',
      'ApplyDND',
      'DNDCombined',
      'DNDCombinedDay',
      'Detention',
      'Demurrage',
      'QuotationHaulerPOLHaulerCompanyName',
      'QuotationHaulerPODHaulerCompanyName',
      'AutoBilling',
      'TotalM3',
      'TotalNetWeight',
      'TotalGrossWeight',
      'TotalTues',
      'TotalDiscount',
      'TotalTax',
      'QuotationBillToCompanyName',
      'RejectMessage',
      'VerificationStatus',
      'VerifiedAtFormat',
      'NominationPortCode',
      'VerifiedByUsername',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
    ],
    columns:
      [
        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'DocNum', title: 'QT No.', switchable: false, filterCustomSearch: "GetText", formatter: QTFormatterDocNum, filterControl: "input" },
        { field: 'DocDateFormat', title: 'QT Doc Date', sorter: "dateSort", filterControl: "input" },
        { field: 'DocDesc', title: 'DocDesc', filterControl: "input" },
        { field: 'SalesPersonUsername', title: 'Sales Person', filterControl: "input" },
        { field: 'QuotationType', title: 'Quotation Type', filterControl: "input" },
        { field: 'ValidityDay', title: 'Validity Day', filterControl: "input" },
        { field: 'LastValidDateFormat', title: 'Last Valid Date', sorter: "dateSort", filterControl: "input" },
        { field: 'AdvanceBookingStartDateFormat', title: 'Advance Booking Start Date', sorter: "dateSort", filterControl: "input" },
        { field: 'AdvanceBookingLastValidDateFormat', title: 'Advance Booking Last Valid Date', sorter: "dateSort", filterControl: "input" },
        { field: 'QuotationAgentCompanyName', title: 'Agent', filterControl: "input" },
        { field: 'QuotationShipperCompanyName', title: 'Shipper', filterControl: "input" },
        { field: 'QuotationConsigneeCompanyName', title: 'Consignee', filterControl: "input" },
        { field: 'QuotationNotifyPartyCompanyName', title: 'Notify Party', filterControl: "input" },
        { field: 'QuotationAttentionPartyCompanyName', title: 'Attention Party', filterControl: "input" },
        { field: 'CurrencyCurrencyName', title: 'Currency Name', filterControl: "input" },
        { field: 'CurrencyExchangeRate', title: 'Currency Exchange Rate', filterControl: "input" },
        { field: 'POLPortCodePortCode', title: 'POL Port Code', filterControl: "input" },
        { field: 'POLAreaName', title: 'POL Area', filterControl: "input" },
        { field: 'POLLocationCodeLocationCode', title: 'POL Terminal Code', filterControl: "input" },
        { field: 'POLLocationName', title: 'POL Terminal Name', filterControl: "input" },
        { field: 'POLPortTermPortTerm', title: 'POL Port Term', filterControl: "input" },
        { field: 'POLFreightTermFreightTerm', title: 'POL Freight Term', filterControl: "input" },
        { field: 'POLHandlingOfficeCompanyName', title: 'POL Terminal Handler Company', filterControl: "input" },
        { field: 'POLHandlingOfficeName', title: 'POL Terminal Handler Branch Name', filterControl: "input" },
        { field: 'POLReqETAFormat', title: 'POL Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODPortCodePortCode', title: 'POD Port Code', filterControl: "input" },
        { field: 'PODAreaName', title: 'POD Area', filterControl: "input" },
        { field: 'PODLocationCodeLocationCode', title: 'POD Terminal Code', filterControl: "input" },
        { field: 'PODLocationName', title: 'POD Terminal Name', filterControl: "input" },
        { field: 'PODPortTermPortTerm', title: 'POD Port Term', filterControl: "input" },
        { field: 'PODFreightTermFreightTerm', title: 'POD Freight Term', filterControl: "input" },
        { field: 'PODHandlingOfficeCompanyName', title: 'POD Terminal Handler Company', filterControl: "input" },
        { field: 'PODHandlingOfficeName', title: 'POD Terminal Handler Branch Name', filterControl: "input" },
        { field: 'PODReqETAFormat', title: 'POD Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'FinalDestinationPortCode', title: 'Final Destination', filterControl: "input" },
        { field: 'FinalDestinationArea', title: 'Final Destination Area', filterControl: "input" },
        { field: 'FinalDestinationHandlerROC', title: 'Final Destination Agent Company', filterControl: "input" },
        { field: 'VoyageName', title: 'Voyage Num', filterControl: "input" },
        { field: 'VesselCode', title: 'Vessel Code', filterControl: "input" },
        { field: 'VesselName', title: 'Vessel Name', filterControl: "input" },
        { field: 'BargeCodeName', title: 'Barge Code', filterControl: "input" },
        { field: 'BargeName', title: 'Barge Name', filterControl: "input" },
        { field: 'POLETAFormat', title: 'POL ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLETDFormat', title: 'POL ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLSCNCode', title: 'POL SCN Code', filterControl: "input" },
        { field: 'PODETAFormat', title: 'POD ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODETDFormat', title: 'POD ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODSCNCode', title: 'POD SCN Code', filterControl: "input" },
        { field: 'ClosingDateTimeFormat', title: 'Closing Date Time', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'ShipOperatorROC', title: 'Ship Operator ROC', filterControl: "input" },
        { field: 'ShipOperatorCompany', title: 'Ship Operator Company', filterControl: "input" },
        { field: 'ShipOperatorBranchCodeBranchCode', title: 'Ship Operator Branch Code', filterControl: "input" },
        { field: 'ShipOperatorBranchName', title: 'Ship Operator Branch', filterControl: "input" },
        { field: 'InsistTranshipment', title: 'Insist Transhipment', filterControl: "input" },
        { field: 'ApplyDND', title: 'Apply DND', filterControl: "input" },
        { field: 'DNDCombined', title: 'DND Combined', filterControl: "input" },
        { field: 'DNDCombinedDay', title: 'DND Combined Day', filterControl: "input" },
        { field: 'Detention', title: 'Detention', filterControl: "input" },
        { field: 'Demurrage', title: 'Demurrage', filterControl: "input" },
        { field: 'QuotationHaulerPOLHaulerCompanyName', title: 'POL Hauler', filterControl: "input" },
        { field: 'QuotationHaulerPODHaulerCompanyName', title: 'POD Hauler', filterControl: "input" },
        { field: 'AutoBilling', title: 'Auto Billing', filterControl: "input" },
        { field: 'TotalM3', title: 'Total M3(m)', filterControl: "input" },
        { field: 'TotalNetWeight', title: 'Total Net Weight(kg)', filterControl: "input" },
        { field: 'TotalGrossWeight', title: 'Total Gross Weight(kg)', filterControl: "input" },
        { field: 'TotalTues', title: 'Total Tues', filterControl: "input" },
        { field: 'TotalDiscount', title: 'Total Discount', filterControl: "input" },
        { field: 'TotalTax', title: 'Total Tax', filterControl: "input" },
        { field: 'TotalAmount', title: 'Total Amount', filterControl: "input" },
        { field: 'NominationPortCode', title: 'Nomination', filterControl: "input" },
        { field: 'QuotationBillToCompanyName', title: 'Bill To', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'RejectMessage', title: 'Reject Message', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const BookingReservation = {
    title: 'booking-reservation',
    defaultHide: [
      'QuotationDocNum',
      'ValidityDay',
      'AdvanceBookingStartDateFormat',
      'CurrencyCurrencyName',
      'CurrencyExchangeRate',
      'POLPortCodePortCode',
      'POLAreaName',
      'POLLocationCodeLocationCode',
      'POLLocationName',
      'POLPortTermPortTerm',
      'POLFreightTermFreightTerm',
      'POLHandlingOfficeCompanyName',
      'POLHandlingOfficeName',
      'POLReqETAFormat',
      'PODPortCodePortCode',
      'PODAreaName',
      'PODLocationCodeLocationCode',
      'PODLocationName',
      'PODPortTermPortTerm',
      'PODFreightTermFreightTerm',
      'PODHandlingOfficeCompanyName',
      'PODHandlingOfficeName',
      'PODReqETAFormat',
      'FinalDestinationPortCode',
      'FinalDestinationArea',
      'FinalDestinationHandlerROC',
      'VoyageName',
      'VesselCode',
      'VesselName',
      'POLETAFormat',
      'POLSCNCode',
      'PODETAFormat',
      'PODSCNCode',
      'ClosingDateTimeFormat',
      'ShipOperatorROC',
      'ShipOperatorCompany',
      'ShipOperatorBranchCodeBranchCode',
      'ShipOperatorBranchName',
      'InsistTranshipment',
      'ApplyDND',
      'DNDCombined',
      'DNDCombinedDay',
      'Detention',
      'Demurrage',
      'AutoBilling',
      'POLETDFormat',
      'PODETDFormat',
      'TotalM3',
      'TotalNetWeight',
      'TotalGrossWeight',
      'TotalTues',
      'TotalDiscount',
      'TotalTax',
      'NominationPortCode',
      'BookingReservationBillToCompanyName',
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'MergeParentDocNum',
      'SplitParentDocNum',
    ],
    columns:
      [
        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'DocNum', title: 'BR No.', switchable: false, filterCustomSearch: "GetText", formatter: BRFormatterDocNum, filterControl: "input" },
        { field: 'DocDateFormat', title: 'BR Doc Date', sortOrder: "desc", sorter: "dateSort", filterControl: "input" },
        { field: 'BookingConfirmationDocNum', formatter: LinkFormatterBCNo, title: 'BC No.', filterControl: "input", filterCustomSearch: "GetText" },
        { field: 'BookingConfirmationDocDateFormat', title: 'BC Doc Date', sorter: "dateSort", filterControl: "input" },
        { field: 'QuotationDocNum', title: 'QT No.', formatter: QuotationFormatterDocNum, filterCustomSearch: "GetQuotation", filterControl: "input" },
        { field: 'BillOfLadingDocNum', title: 'BL No.', formatter: BLDocFormatterDocNumBR, filterControl: "input" },
        { field: 'SalesPersonUsername', title: 'Sales Person', filterControl: "input" },
        { field: 'QuotationType', title: 'Quotation Type', filterControl: "input" },
        { field: 'ValidityDay', title: 'Validity Days', filterControl: "input" },
        { field: 'LastValidDateFormat', title: 'Last Valid Date', filterControl: "input" },
        { field: 'AdvanceBookingStartDateFormat', title: 'Advance Booking Start Date', sorter: "dateSort", filterControl: "input" },
        { field: 'AdvanceBookingLastValidDateFormat', title: 'Advance Booking Last Valid Date', sorter: "dateSort", filterControl: "input" },
        { field: 'CurrencyCurrencyName', title: 'Currency', filterControl: "input" },
        { field: 'CurrencyExchangeRate', title: 'Currency Exchange Rate', filterControl: "input" },
        { field: 'BookingReservationBillToCompanyName', title: 'Bill To', filterControl: "input" },
        { field: 'BookingReservationAgentCompanyName', title: 'Agent', filterControl: "input" },
        { field: 'BookingReservationShipperCompanyName', title: 'Shipper', filterControl: "input" },
        { field: 'BookingReservationConsigneeCompanyName', title: 'Consignee', filterControl: "input" },
        { field: 'POLPortCodePortCode', title: 'POL Port Code', filterControl: "input" },
        { field: 'POLAreaName', title: 'POL Area', filterControl: "input" },
        { field: 'POLLocationCodeLocationCode', title: 'POL Terminal Code', filterControl: "input" },
        { field: 'POLLocationName', title: 'POL Terminal Name', filterControl: "input" },
        { field: 'POLPortTermPortTerm', title: 'POL Port Term', filterControl: "input" },
        { field: 'POLFreightTermFreightTerm', title: 'POL Freight Term', filterControl: "input" },
        { field: 'POLHandlingOfficeCompanyName', title: 'POL Terminal Handler Company', filterControl: "input" },
        { field: 'POLHandlingOfficeName', title: 'POL Terminal Handler Branch', filterControl: "input" },
        { field: 'POLReqETAFormat', title: 'POL Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODPortCodePortCode', title: 'POD Port Code', filterControl: "input" },
        { field: 'PODAreaName', title: 'POD Area', filterControl: "input" },
        { field: 'PODLocationCodeLocationCode', title: 'POD Terminal Code', filterControl: "input" },
        { field: 'PODLocationName', title: 'POD Terminal Name', filterControl: "input" },
        { field: 'PODPortTermPortTerm', title: 'POD Port Term', filterControl: "input" },
        { field: 'PODFreightTermFreightTerm', title: 'POD Freight Term', filterControl: "input" },
        { field: 'PODHandlingOfficeCompanyName', title: 'POD Terminal Handler Company', filterControl: "input" },
        { field: 'PODHandlingOfficeName', title: 'POD Terminal Handler Branch', filterControl: "input" },
        { field: 'PODReqETAFormat', title: 'POD Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'FinalDestinationPortCode', title: 'Final Destination', filterControl: "input" },
        { field: 'FinalDestinationArea', title: 'Final Destination Area', filterControl: "input" },
        { field: 'FinalDestinationHandlerROC', title: 'Final Destination Agent Company', filterControl: "input" },
        { field: 'VoyageName', title: 'Voyage Num', filterControl: "input" },
        { field: 'VesselCode', title: 'Vessel Code', filterControl: "input" },
        { field: 'VesselName', title: 'Vessel Name', filterControl: "input" },
        { field: 'POLETAFormat', title: 'POL ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLETDFormat', title: 'POL ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLSCNCode', title: 'POL SCN Code', filterControl: "input" },
        { field: 'PODETAFormat', title: 'POD ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODETDFormat', title: 'POD ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODSCNCode', title: 'POD SCN Code', filterControl: "input" },
        { field: 'ClosingDateTimeFormat', title: 'Closing Date Time', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'ShipOperatorROC', title: 'Ship Op ROC', filterControl: "input" },
        { field: 'ShipOperatorCompany', title: 'Ship Op', filterControl: "input" },
        { field: 'ShipOperatorBranchCodeBranchCode', title: 'Ship Op Branch Code', filterControl: "input" },
        { field: 'ShipOperatorBranchName', title: 'Ship Op BranchName', filterControl: "input" },
        { field: 'InsistTranshipment', title: 'Insist Transhipment', filterControl: "input" },
        { field: 'ApplyDND', title: 'Apply DND', filterControl: "input" },
        { field: 'DNDCombined', title: 'DND Combined', filterControl: "input" },
        { field: 'DNDCombinedDay', title: 'DND Combined Day', filterControl: "input" },
        { field: 'Detention', title: 'Detention', filterControl: "input" },
        { field: 'Demurrage', title: 'Demurrage', filterControl: "input" },
        { field: 'MergeParentDocNum', title: 'Merge Parent', filterControl: "input" },
        { field: 'SplitParentDocNum', title: 'Split Parent', filterControl: "input" },
        { field: 'AutoBilling', title: 'Auto Billing', filterControl: "input" },
        { field: 'TotalM3', title: 'Total M3(m)', filterControl: "input" },
        { field: 'TotalNetWeight', title: 'Total Net Weight(kg)', filterControl: "input" },
        { field: 'TotalGrossWeight', title: 'Total Gross Weight(kg)', filterControl: "input" },
        { field: 'TotalTues', title: 'Total Tues', filterControl: "input" },
        { field: 'TotalDiscount', title: 'Total Discount', filterControl: "input" },
        { field: 'TotalTax', title: 'Total Tax', filterControl: "input" },
        { field: 'TotalAmount', title: 'Total Amount', filterControl: "input" },
        { field: 'NominationPortCode', title: 'Nomination', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const BookingReservationBarge = {
    title: 'booking-reservation-barge',
    defaultHide: [
      'QuotationDocNum',
      'ValidityDay',
      'AdvanceBookingStartDateFormat',
      'CurrencyCurrencyName',
      'CurrencyExchangeRate',
      'POLPortCodePortCode',
      'POLAreaName',
      'POLLocationCodeLocationCode',
      'POLLocationName',
      'POLPortTermPortTerm',
      'POLFreightTermFreightTerm',
      'POLHandlingOfficeCompanyName',
      'POLHandlingOfficeName',
      'POLReqETAFormat',
      'PODPortCodePortCode',
      'PODAreaName',
      'PODLocationCodeLocationCode',
      'PODLocationName',
      'PODPortTermPortTerm',
      'PODFreightTermFreightTerm',
      'PODHandlingOfficeCompanyName',
      'PODHandlingOfficeName',
      'PODReqETAFormat',
      'FinalDestinationPortCode',
      'FinalDestinationArea',
      'FinalDestinationHandlerROC',
      'VoyageName',
      'VesselCode',
      'VesselName',
      'POLETAFormat',
      'POLSCNCode',
      'PODETAFormat',
      'PODSCNCode',
      'ClosingDateTimeFormat',
      'ShipOperatorROC',
      'ShipOperatorCompany',
      'ShipOperatorBranchCodeBranchCode',
      'ShipOperatorBranchName',
      'InsistTranshipment',
      'ApplyDND',
      'DNDCombined',
      'DNDCombinedDay',
      'Detention',
      'Demurrage',
      'AutoBilling',
      'POLETDFormat',
      'PODETDFormat',
      'TotalM3',
      'TotalNetWeight',
      'TotalGrossWeight',
      'TotalTues',
      'TotalDiscount',
      'TotalTax',
      'NominationPortCode',
      'BookingReservationBillToCompanyName',
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'MergeParentDocNum',
      'SplitParentDocNum',
    ],
    columns:
      [
        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'DocNum', title: 'BR No.', switchable: false, filterCustomSearch: "GetText", formatter: BRFormatterDocNum, filterControl: "input" },
        { field: 'DocDateFormat', title: 'BR Doc Date', sortOrder: "desc", sorter: "dateSort", filterControl: "input" },
        { field: 'BookingConfirmationDocNum', formatter: LinkFormatterBCNo, title: 'BC No.', filterControl: "input", filterCustomSearch: "GetText" },
        { field: 'BookingConfirmationDocDateFormat', title: 'BC Doc Date', sorter: "dateSort", filterControl: "input" },
        { field: 'QuotationDocNum', title: 'QT No.', formatter: QuotationFormatterDocNum, filterCustomSearch: "GetQuotation", filterControl: "input" },
        { field: 'BillOfLadingDocNum', title: 'BL No.', formatter: BLDocFormatterDocNumBR, filterControl: "input" },
        { field: 'SalesPersonUsername', title: 'Sales Person', filterControl: "input" },
        { field: 'QuotationType', title: 'Quotation Type', filterControl: "input" },
        { field: 'ValidityDay', title: 'Validity Days', filterControl: "input" },
        { field: 'LastValidDateFormat', title: 'Last Valid Date', filterControl: "input" },
        { field: 'AdvanceBookingStartDateFormat', title: 'Advance Booking Start Date', sorter: "dateSort", filterControl: "input" },
        { field: 'AdvanceBookingLastValidDateFormat', title: 'Advance Booking Last Valid Date', sorter: "dateSort", filterControl: "input" },
        { field: 'CurrencyCurrencyName', title: 'Currency', filterControl: "input" },
        { field: 'CurrencyExchangeRate', title: 'Currency Exchange Rate', filterControl: "input" },
        { field: 'BookingReservationBillToCompanyName', title: 'Bill To', filterControl: "input" },
        { field: 'BookingReservationAgentCompanyName', title: 'Agent', filterControl: "input" },
        { field: 'BookingReservationShipperCompanyName', title: 'Shipper', filterControl: "input" },
        { field: 'BookingReservationConsigneeCompanyName', title: 'Consignee', filterControl: "input" },
        { field: 'POLPortCodePortCode', title: 'POL Port Code', filterControl: "input" },
        { field: 'POLAreaName', title: 'POL Area', filterControl: "input" },
        { field: 'POLLocationCodeLocationCode', title: 'POL Terminal Code', filterControl: "input" },
        { field: 'POLLocationName', title: 'POL Terminal Name', filterControl: "input" },
        { field: 'POLPortTermPortTerm', title: 'POL Port Term', filterControl: "input" },
        { field: 'POLFreightTermFreightTerm', title: 'POL Freight Term', filterControl: "input" },
        { field: 'POLHandlingOfficeCompanyName', title: 'POL Terminal Handler Company', filterControl: "input" },
        { field: 'POLHandlingOfficeName', title: 'POL Terminal Handler Branch', filterControl: "input" },
        { field: 'POLReqETAFormat', title: 'POL Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODPortCodePortCode', title: 'POD Port Code', filterControl: "input" },
        { field: 'PODAreaName', title: 'POD Area', filterControl: "input" },
        { field: 'PODLocationCodeLocationCode', title: 'POD Terminal Code', filterControl: "input" },
        { field: 'PODLocationName', title: 'POD Terminal Name', filterControl: "input" },
        { field: 'PODPortTermPortTerm', title: 'POD Port Term', filterControl: "input" },
        { field: 'PODFreightTermFreightTerm', title: 'POD Freight Term', filterControl: "input" },
        { field: 'PODHandlingOfficeCompanyName', title: 'POD Terminal Handler Company', filterControl: "input" },
        { field: 'PODHandlingOfficeName', title: 'POD Terminal Handler Branch', filterControl: "input" },
        { field: 'PODReqETAFormat', title: 'POD Req ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'FinalDestinationPortCode', title: 'Final Destination', filterControl: "input" },
        { field: 'FinalDestinationArea', title: 'Final Destination Area', filterControl: "input" },
        { field: 'FinalDestinationHandlerROC', title: 'Final Destination Agent Company', filterControl: "input" },
        { field: 'VoyageName', title: 'Voyage Num', filterControl: "input" },
        { field: 'VesselCode', title: 'Vessel Code', filterControl: "input" },
        { field: 'VesselName', title: 'Vessel Name', filterControl: "input" },
        { field: 'BargeCodeName', title: 'Barge Code', filterControl: "input" },
        { field: 'BargeName', title: 'Barge Name', filterControl: "input" },
        { field: 'POLETAFormat', title: 'POL ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLETDFormat', title: 'POL ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'POLSCNCode', title: 'POL SCN Code', filterControl: "input" },
        { field: 'PODETAFormat', title: 'POD ETA', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODETDFormat', title: 'POD ETD', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'PODSCNCode', title: 'POD SCN Code', filterControl: "input" },
        { field: 'ClosingDateTimeFormat', title: 'Closing Date Time', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'ShipOperatorROC', title: 'Ship Op ROC', filterControl: "input" },
        { field: 'ShipOperatorCompany', title: 'Ship Op', filterControl: "input" },
        { field: 'ShipOperatorBranchCodeBranchCode', title: 'Ship Op Branch Code', filterControl: "input" },
        { field: 'ShipOperatorBranchName', title: 'Ship Op BranchName', filterControl: "input" },
        { field: 'InsistTranshipment', title: 'Insist Transhipment', filterControl: "input" },
        { field: 'ApplyDND', title: 'Apply DND', filterControl: "input" },
        { field: 'DNDCombined', title: 'DND Combined', filterControl: "input" },
        { field: 'DNDCombinedDay', title: 'DND Combined Day', filterControl: "input" },
        { field: 'Detention', title: 'Detention', filterControl: "input" },
        { field: 'Demurrage', title: 'Demurrage', filterControl: "input" },
        { field: 'MergeParentDocNum', title: 'Merge Parent', filterControl: "input" },
        { field: 'SplitParentDocNum', title: 'Split Parent', filterControl: "input" },
        { field: 'AutoBilling', title: 'Auto Billing', filterControl: "input" },
        { field: 'TotalM3', title: 'Total M3(m)', filterControl: "input" },
        { field: 'TotalNetWeight', title: 'Total Net Weight(kg)', filterControl: "input" },
        { field: 'TotalGrossWeight', title: 'Total Gross Weight(kg)', filterControl: "input" },
        { field: 'TotalTues', title: 'Total Tues', filterControl: "input" },
        { field: 'TotalDiscount', title: 'Total Discount', filterControl: "input" },
        { field: 'TotalTax', title: 'Total Tax', filterControl: "input" },
        { field: 'TotalAmount', title: 'Total Amount', filterControl: "input" },
        { field: 'NominationPortCode', title: 'Nomination', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const SalesInvoice = {
    title: 'sales-invoice',
    defaultHide: [
      "ROCROC",
      "DocDesc",
      "BranchTel",
      "BranchFax",
      "BranchEmail",
      "BranchCodeBranchCode",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "AttentionEmail",
      "AgentROC",
      "AgentCompanyName",
      "AgentBranchBranchCode",
      "AgentBranchName",
      "SalesPersonUsername",
      "CurrencyCurrencyName",
      "CurrencyExchangeRate",
      "TotalDiscount",
      "TotalTax",
      "OutstandingAmount",
      "NominationPortCode",
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid"
    ],
    columns:
      [
        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'DocNum', title: 'INV No.', switchable: false, filterCustomSearch: "GetText", formatter: INVFormatterDocNum, filterControl: "input" },
        { field: 'DocDateFormat', title: 'INV Doc Date', sortOrder: "desc", sorter: "dateSort", filterControl: "input" },
        { field: 'BillOfLadingDocNum', title: 'BL No.', switchable: false, formatter: BLDocFormatterDocNum, filterControl: "input", filterCustomSearch: "GetText" },
        { field: 'DeliveryOrderDocNum', title: 'DO No.', switchable: false, formatter: DeliveryOrderFormatterDocNum, filterControl: "input", filterCustomSearch: "GetText" },
        { field: 'DocDesc', title: 'Doc Desc', filterControl: "input" },
        { field: 'CustomerType', title: 'Customer Type', filterControl: "input" },
        { field: 'ROCROC', title: 'ROC', filterControl: "input" },
        { field: 'CompanyName', title: 'Company', filterControl: "input" },
        { field: 'BranchCodeBranchCode', title: 'Branch Code', filterControl: "input" },
        { field: 'BranchName', title: 'Branch', filterControl: "input" },
        { field: 'CreditTermCreditTerm', title: 'Credit Term', filterControl: "input" },
        { field: 'CreditLimit', title: 'Credit Limit', filterControl: "input" },
        { field: 'BranchTel', title: 'Branch Tel', filterControl: "input" },
        { field: 'BranchFax', title: 'Branch Fax', filterControl: "input" },
        { field: 'BranchEmail', title: 'Branch Email', filterControl: "input" },
        { field: 'BranchAddressLine1', title: 'Branch Address Line 1', filterControl: "input" },
        { field: 'BranchAddressLine2', title: 'Branch Address Line 2', filterControl: "input" },
        { field: 'BranchAddressLine3', title: 'Branch Address Line 3', filterControl: "input" },
        { field: 'BranchPostcode', title: 'Branch Postcode', filterControl: "input" },
        { field: 'BranchCity', title: 'Branch City', filterControl: "input" },
        { field: 'BranchCountry', title: 'Branch Country', filterControl: "input" },
        { field: 'BranchCoordinates', title: 'Branch Coordinates', filterControl: "input" },
        { field: 'AttentionName', title: 'Attention Name', filterControl: "input" },
        { field: 'AttentionTel', title: 'Attention Tel', filterControl: "input" },
        { field: 'AttentionEmail', title: 'Attention Email', filterControl: "input" },
        { field: 'AgentROC', title: 'Agent ROC', filterControl: "input" },
        { field: 'AgentCompanyName', title: 'Agent Company Name', filterControl: "input" },
        { field: 'AgentBranchBranchCode', title: 'Agent Branch', filterControl: "input" },
        { field: 'AgentBranchName', title: 'Agent Branch Name', filterControl: "input" },
        { field: 'SalesPersonUsername', title: 'Sales Person', filterControl: "input" },
        { field: 'CurrencyCurrencyName', title: 'Currency', filterControl: "input" },
        { field: 'CurrencyExchangeRate', title: 'Currency Exchange Rate', filterControl: "input" },
        { field: 'TotalDiscount', title: 'Total Discount', filterControl: "input" },
        { field: 'TotalTax', title: 'Total Tax', filterControl: "input" },
        { field: 'TotalAmount', title: 'Total Amount', filterControl: "input" },
        { field: 'OutstandingAmount', title: 'Outstanding Amount', filterControl: "input" },
        { field: 'NominationPortCode', title: 'Nomination', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const SalesInvoiceBarge = {
    title: 'sales-invoice-barge',
    defaultHide: [
      "ROCROC",
      "DocDesc",
      "BranchTel",
      "BranchFax",
      "BranchEmail",
      "BranchCodeBranchCode",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "AttentionEmail",
      "AgentROC",
      "AgentCompanyName",
      "AgentBranchBranchCode",
      "AgentBranchName",
      "SalesPersonUsername",
      "CurrencyCurrencyName",
      "CurrencyExchangeRate",
      "TotalDiscount",
      "TotalTax",
      "OutstandingAmount",
      "NominationPortCode",
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid"
    ],
    columns:
      [
        { field: 'operate', title: 'Status', class: 'statusIcon', align: 'center', switchable: false, formatter: statusFormatter },
        { field: 'DocNum', title: 'INV No.', switchable: false, filterCustomSearch: "GetText", formatter: INVFormatterDocNumSelf, filterControl: "input" },
        { field: 'DocDateFormat', title: 'INV Doc Date', sortOrder: "desc", sorter: "dateSort", filterControl: "input" },
        { field: 'BillOfLadingDocNum', title: 'BL No.', switchable: false, formatter: BLDocFormatterDocNum, filterControl: "input", filterCustomSearch: "GetText" },
        { field: 'DeliveryOrderDocNum', title: 'DO No.', switchable: false, formatter: DeliveryOrderFormatterDocNum, filterControl: "input", filterCustomSearch: "GetText" },
        { field: 'DocDesc', title: 'Doc Desc', filterControl: "input" },
        { field: 'CustomerType', title: 'Customer Type', filterControl: "input" },
        { field: 'ROCROC', title: 'ROC', filterControl: "input" },
        { field: 'CompanyName', title: 'Company', filterControl: "input" },
        { field: 'BranchCodeBranchCode', title: 'Branch Code', filterControl: "input" },
        { field: 'BranchName', title: 'Branch', filterControl: "input" },
        { field: 'CreditTermCreditTerm', title: 'Credit Term', filterControl: "input" },
        { field: 'CreditLimit', title: 'Credit Limit', filterControl: "input" },
        { field: 'BranchTel', title: 'Branch Tel', filterControl: "input" },
        { field: 'BranchFax', title: 'Branch Fax', filterControl: "input" },
        { field: 'BranchEmail', title: 'Branch Email', filterControl: "input" },
        { field: 'BranchAddressLine1', title: 'Branch Address Line 1', filterControl: "input" },
        { field: 'BranchAddressLine2', title: 'Branch Address Line 2', filterControl: "input" },
        { field: 'BranchAddressLine3', title: 'Branch Address Line 3', filterControl: "input" },
        { field: 'BranchPostcode', title: 'Branch Postcode', filterControl: "input" },
        { field: 'BranchCity', title: 'Branch City', filterControl: "input" },
        { field: 'BranchCountry', title: 'Branch Country', filterControl: "input" },
        { field: 'BranchCoordinates', title: 'Branch Coordinates', filterControl: "input" },
        { field: 'AttentionName', title: 'Attention Name', filterControl: "input" },
        { field: 'AttentionTel', title: 'Attention Tel', filterControl: "input" },
        { field: 'AttentionEmail', title: 'Attention Email', filterControl: "input" },
        { field: 'AgentROC', title: 'Agent ROC', filterControl: "input" },
        { field: 'AgentCompanyName', title: 'Agent Company Name', filterControl: "input" },
        { field: 'AgentBranchBranchCode', title: 'Agent Branch', filterControl: "input" },
        { field: 'AgentBranchName', title: 'Agent Branch Name', filterControl: "input" },
        { field: 'SalesPersonUsername', title: 'Sales Person', filterControl: "input" },
        { field: 'CurrencyCurrencyName', title: 'Currency', filterControl: "input" },
        { field: 'CurrencyExchangeRate', title: 'Currency Exchange Rate', filterControl: "input" },
        {
          field: 'POLPortCodeName',
          title: 'POL Port Code',
          filterControl: "input"
        },
        {
          field: 'POLAreaName',
          title: 'POL Area',
          filterControl: "input"
        },
        {
          field: 'POLLocationCodeName',
          title: 'POL Terminal Code',
          filterControl: "input"
        },
        {
          field: 'POLLocationName',
          title: 'POL Terminal Name',
          filterControl: "input"
        },
        {
          field: 'POLPortTermName',
          title: 'POL Port Term',
          filterControl: "input"
        },
        {
          field: 'POLFreightTermName',
          title: 'POL Freight Term',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeCodeName',
          title: 'POL Agent Company',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeName',
          title: 'POL Agent Branch',
          filterControl: "input"
        },
        {
          field: 'POLReqETAFormat',
          title: 'POL Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'PODPortCodeName',
          title: 'POD Port Code',
          filterControl: "input"
        },
        {
          field: 'PODAreaName',
          title: 'POD Area',
          filterControl: "input"
        },
        {
          field: 'PODLocationCodeName',
          title: 'POD Terminal Code',
          filterControl: "input"
        },
        {
          field: 'PODLocationName',
          title: 'POD Terminal Name',
          filterControl: "input"
        },
        {
          field: 'PODPortTermName',
          title: 'POD Port Term',
          filterControl: "input"
        },
        {
          field: 'PODFreightTermName',
          title: 'POD Freight Term',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeCodeName',
          title: 'POD Agent Company',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeName',
          title: 'POD Agent Branch',
          filterControl: "input"
        },
        {
          field: 'PODReqETAFormat',
          title: 'POD Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'FinalDestinationName',
          title: 'Final Destination',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationArea',
          title: 'Final Destination Area',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationHandlerROC',
          title: 'Final Destination Agent Company',
          filterControl: "input"
        },

        {
          field: 'VoyageName',
          title: 'Voyage Num',
          filterControl: "input"
        },
        {
          field: 'VesselCode',
          title: 'Vessel Code',
          filterControl: "input"
        },
        {
          field: 'VesselName',
          title: 'Vessel Name',
          filterControl: "input"
        },
        {
          field: 'BargeCodeName',
          title: 'Barge Code',
          filterControl: "input"
        },
        {
          field: 'BargeName',
          title: 'Barge Name ',
          filterControl: "input"
        },
        {
          field: 'POLETAFormat',
          title: 'POL ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'POLETDFormat',
          title: 'POL ETD',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'POLSCNCode',
          title: 'POL SCN Code',
          filterControl: "input"
        },
        {
          field: 'PODETAFormat',
          title: 'POD ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'PODETDFormat',
          title: 'POD ETD',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'PODSCNCode',
          title: 'POD SCN Code',
          filterControl: "input"
        },
        {
          field: 'ClosingDateTimeFormat',
          title: 'Closing Date Time',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'ShipOperatorROC',
          title: 'Ship Op ROC',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorCompany',
          title: 'Ship Op',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchCodeName',
          title: 'Ship Op Branch Code',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchName',
          title: 'Ship Op BranchName',
          filterControl: "input"
        },
        { field: 'TotalDiscount', title: 'Total Discount', filterControl: "input" },
        { field: 'TotalTax', title: 'Total Tax', filterControl: "input" },
        { field: 'TotalAmount', title: 'Total Amount', filterControl: "input" },
        { field: 'OutstandingAmount', title: 'Outstanding Amount', filterControl: "input" },
        { field: 'NominationPortCode', title: 'Nomination', filterControl: "input" },
        { field: 'VerificationStatus', title: 'Verification Status', filterControl: "input" },
        { field: 'VerifiedAtFormat', title: 'Verified At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'VerifiedByUsername', title: 'Verified By', filterControl: "input" },
        { field: 'CreatedAtFormat', title: 'Created At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'CreatedByUsername', title: 'Created By', filterControl: "input" },
        { field: 'UpdatedAtFormat', title: 'Updated At', sorter: "dateTimeSort", filterControl: "input" },
        { field: 'UpdatedByUsername', title: 'Updated By', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const DnD = {
    title: 'dnd',
    defaultHide: [
      "BookingReservationDNDCombinedDay",
      "BookingReservationDemurrage",
      "BookingReservationDetention"
    ],
    columns:
      [
        { field: 'QuotationDocNum', title: 'QT No.', filterControl: "input" },
        { field: 'BookingConfirmationDocNum', title: 'BC No.', filterControl: "input" },
        { field: 'BillOfLadingDocNum', title: 'BL No.', filterControl: "input" },
        { field: 'BookingReservationHasContainerTypeContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'ContainerCodeContainerCode', title: 'Container No.', filterControl: "input" },
        { field: 'BookingReservationDNDCombinedDay', title: 'D&D Combine Days', filterControl: "input" },
        { field: 'BookingReservationDemurrage', title: 'Demurrage', filterControl: "input" },
        { field: 'BookingReservationDetention', title: 'Detention', filterControl: "input" },
        { field: 'ContainerDischargedDischargingDate', title: 'Discharged Date', filterControl: "input" },

        { field: 'DNDCombinedEXD', title: 'DND Combined Days EXD', filterControl: "input" },
        { field: 'DemurrageEXD', title: 'Demurrage EXD', filterControl: "input" },
        { field: 'DetentionEXD', title: 'Detention EXD', filterControl: "input" },

        { field: 'TotalDays', title: 'Total Days', filterControl: "input" },
        { field: '1to3days', title: '1-3 Days', filterControl: "input" },
        { field: '4to7days', title: '4-7 Days', filterControl: "input" },
        { field: 'after8days', title: 'After 8 Days', filterControl: "input" },
        { field: 'Total', title: 'Total', filterControl: "input" },

      ]


  }

  const CreditNote = {
    title: 'credit-note',
    defaultHide: [
      "BranchTel",
      "DocDesc",
      "ROCROC",
      "BranchCodeBranchCode",
      "BranchFax",
      "BranchEmail",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "AttentionEmail",
      "AgentROC",
      "AgentCompanyName",
      "AgentBranchCode",
      "AgentBranchName",
      "SalesPersonUsername",
      "CurrencyCurrencyName",
      "CurrencyExchangeRate",
      "TotalTax",
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid",

    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'CN No.',
          switchable: false,
          filterControl: "input",
          formatter: CNFormatterDocNum2,
          filterCustomSearch: "GetText"
        },
        {
          field: 'DocDateFormat',
          title: 'CN Doc Date',
          sortOrder: "desc",
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'CustomerType',
          title: 'Customer Type',
          filterControl: "input"
        },
        {
          field: 'ROCROC',
          title: 'ROC',
          filterControl: "input"
        },
        {
          field: 'CompanyName',
          title: 'Company',
          filterControl: "input"
        },
        {
          field: 'BranchCodeBranchCode',
          title: 'Branch Code',
          filterControl: "input"
        },
        {
          field: 'BranchName',
          title: 'Branch',
          filterControl: "input"
        },
        {
          field: 'CreditTermCreditTerm',
          title: 'Credit Term',
          filterControl: "input"
        },
        {
          field: 'CreditLimit',
          title: 'Credit Limit',
          filterControl: "input"
        },
        {
          field: 'BranchTel',
          title: 'Branch Tel',
          filterControl: "input"
        },
        {
          field: 'BranchFax',
          title: 'Branch Fax',
          filterControl: "input"
        },
        {
          field: 'BranchEmail',
          title: 'Branch Email',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine1',
          title: 'Branch Address Line 1',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine2',
          title: 'Branch Address Line 2',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine3',
          title: 'Branch Address Line 3',
          filterControl: "input"
        },
        {
          field: 'BranchPostcode',
          title: 'Branch Postcode',
          filterControl: "input"
        },
        {
          field: 'BranchCity',
          title: 'Branch City',
          filterControl: "input"
        },
        {
          field: 'BranchCountry',
          title: 'Branch Country',
          filterControl: "input"
        },
        {
          field: 'BranchCoordinates',
          title: 'Branch Coordinates',
          filterControl: "input"
        },
        {
          field: 'AttentionName',
          title: 'Attention Name',
          filterControl: "input"
        },
        {
          field: 'AttentionTel',
          title: 'Attention Tel',
          filterControl: "input"
        },
        {
          field: 'AttentionEmail',
          title: 'Attention Email',
          filterControl: "input"
        },
        {
          field: 'AgentROC',
          title: 'Agent ROC',
          filterControl: "input"
        },
        {
          field: 'AgentCompanyName',
          title: 'Agent Company Name',
          filterControl: "input"
        },
        {
          field: 'AgentBranchCode',
          title: 'Agent Branch',
          filterControl: "input"
        },
        {
          field: 'AgentBranchName',
          title: 'Agent Branch Name',
          filterControl: "input"
        },
        {
          field: 'SalesPersonUsername',
          title: 'Sales Person',
          filterControl: "input"
        },
        {
          field: 'CurrencyCurrencyName',
          title: 'Currency',
          filterControl: "input"
        },
        {
          field: 'CurrencyExchangeRate',
          title: 'Currency Exchange Rate',
          filterControl: "input"
        },
        {
          field: 'TotalTax',
          title: 'Total Tax',
          filterControl: "input"
        },
        {
          field: 'TotalAmount',
          title: 'Total Amount',
          filterControl: "input"
        },

        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },

      ]


  }

  const CreditNoteBarge = {
    title: 'credit-note-barge',
    defaultHide: [
      "BranchTel",
      "DocDesc",
      "ROCROC",
      "BranchCodeBranchCode",
      "BranchFax",
      "BranchEmail",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "AttentionEmail",
      "AgentROC",
      "AgentCompanyName",
      "AgentBranchCode",
      "AgentBranchName",
      "SalesPersonUsername",
      "CurrencyCurrencyName",
      "CurrencyExchangeRate",
      "TotalTax",
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid",

    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'CN No.',
          switchable: false,
          filterControl: "input",
          formatter: CNFormatterDocNum2,
          filterCustomSearch: "GetText"
        },
        {
          field: 'DocDateFormat',
          title: 'CN Doc Date',
          sortOrder: "desc",
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'CustomerType',
          title: 'Customer Type',
          filterControl: "input"
        },
        {
          field: 'ROCROC',
          title: 'ROC',
          filterControl: "input"
        },
        {
          field: 'CompanyName',
          title: 'Company',
          filterControl: "input"
        },
        {
          field: 'BranchCodeBranchCode',
          title: 'Branch Code',
          filterControl: "input"
        },
        {
          field: 'BranchName',
          title: 'Branch',
          filterControl: "input"
        },
        {
          field: 'CreditTermCreditTerm',
          title: 'Credit Term',
          filterControl: "input"
        },
        {
          field: 'CreditLimit',
          title: 'Credit Limit',
          filterControl: "input"
        },
        {
          field: 'BranchTel',
          title: 'Branch Tel',
          filterControl: "input"
        },
        {
          field: 'BranchFax',
          title: 'Branch Fax',
          filterControl: "input"
        },
        {
          field: 'BranchEmail',
          title: 'Branch Email',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine1',
          title: 'Branch Address Line 1',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine2',
          title: 'Branch Address Line 2',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine3',
          title: 'Branch Address Line 3',
          filterControl: "input"
        },
        {
          field: 'BranchPostcode',
          title: 'Branch Postcode',
          filterControl: "input"
        },
        {
          field: 'BranchCity',
          title: 'Branch City',
          filterControl: "input"
        },
        {
          field: 'BranchCountry',
          title: 'Branch Country',
          filterControl: "input"
        },
        {
          field: 'BranchCoordinates',
          title: 'Branch Coordinates',
          filterControl: "input"
        },
        {
          field: 'AttentionName',
          title: 'Attention Name',
          filterControl: "input"
        },
        {
          field: 'AttentionTel',
          title: 'Attention Tel',
          filterControl: "input"
        },
        {
          field: 'AttentionEmail',
          title: 'Attention Email',
          filterControl: "input"
        },
        {
          field: 'AgentROC',
          title: 'Agent ROC',
          filterControl: "input"
        },
        {
          field: 'AgentCompanyName',
          title: 'Agent Company Name',
          filterControl: "input"
        },
        {
          field: 'AgentBranchCode',
          title: 'Agent Branch',
          filterControl: "input"
        },
        {
          field: 'AgentBranchName',
          title: 'Agent Branch Name',
          filterControl: "input"
        },
        {
          field: 'SalesPersonUsername',
          title: 'Sales Person',
          filterControl: "input"
        },
        {
          field: 'CurrencyCurrencyName',
          title: 'Currency',
          filterControl: "input"
        },
        {
          field: 'CurrencyExchangeRate',
          title: 'Currency Exchange Rate',
          filterControl: "input"
        },
        {
                field: 'POLPortCodeName',
                title: 'POL Port Code',
                filterControl: "input"
            },
            {
                field: 'POLAreaName',
                title: 'POL Area',
                filterControl: "input"
            },
            {
                field: 'POLLocationCodeName',
                title: 'POL Terminal Code',
                filterControl: "input"
            },
            {
                field: 'POLLocationName',
                title: 'POL Terminal Name',
                filterControl: "input"
            },
            {
                field: 'POLPortTermName',
                title: 'POL Port Term',
                filterControl: "input"
            },
            {
                field: 'POLFreightTermName',
                title: 'POL Freight Term',
                filterControl: "input"
            },
            {
                field: 'POLHandlingOfficeCodeName',
                title: 'POL Terminal Handler Company',
                filterControl: "input"
            },
            {
                field: 'POLHandlingOfficeName',
                title: 'POL Terminal Handler Branch',
                filterControl: "input"
            },
            {
                field: 'POLReqETAFormat',
                title: 'POL Req ETA',
                sorter: "dateTimeSort",
                filterControl: "input"
            },

            {
                field: 'PODPortCodeName',
                title: 'POD Port Code',
                filterControl: "input"
            },
            {
                field: 'PODAreaName',
                title: 'POD Area',
                filterControl: "input"
            },
            {
                field: 'PODLocationCodeName',
                title: 'POD Terminal Code',
                filterControl: "input"
            },
            {
                field: 'PODLocationName',
                title: 'POD Terminal Name',
                filterControl: "input"
            },
            {
                field: 'PODPortTermName',
                title: 'POD Port Term',
                filterControl: "input"
            },
            {
                field: 'PODFreightTermName',
                title: 'POD Freight Term',
                filterControl: "input"
            },
            {
                field: 'PODHandlingOfficeCodeName',
                title: 'POD Terminal Handler Company',
                filterControl: "input"
            },
            {
                field: 'PODHandlingOfficeName',
                title: 'POD Terminal Handler Branch',
                filterControl: "input"
            },
            {
                field: 'PODReqETAFormat',
                title: 'POD Req ETA',
                sorter: "dateTimeSort",
                filterControl: "input"
            },

            {
                field: 'FinalDestinationName',
                title: 'Final Destination',
                filterControl: "input"
            },
            {
                field: 'FinalDestinationArea',
                title: 'Final Destination Area',
                filterControl: "input"
            },
            {
                field: 'FinalDestinationHandlerROC',
                title: 'Final Destination Agent Company',
                filterControl: "input"
            },

            {
                field: 'VoyageName',
                title: 'Voyage Num',
                filterControl: "input"
            },
            {
                field: 'VesselCode',
                title: 'Vessel Code',
                filterControl: "input"
            },
            {
                field: 'VesselName',
                title: 'Vessel Name',
                filterControl: "input"
            },
            {
              field: 'BargeCodeName',
              title: 'Barge Code',
              filterControl: "input"
            },
            {
              field: 'BargeName',
              title: 'Barge Name ',
              filterControl: "input"
            },
            {
                field: 'POLETAFormat',
                title: 'POL ETA',
                sorter: "dateTimeSort",
                filterControl: "input"
            },
            {
                field: 'POLETDFormat',
                title: 'POL ETD',
                sorter: "dateTimeSort",
                filterControl: "input"
            },
            {
                field: 'POLSCNCode',
                title: 'POL SCN Code',
                filterControl: "input"
            },
            {
                field: 'PODETAFormat',
                title: 'POD ETA',
                sorter: "dateTimeSort",
                filterControl: "input"
            },
            {
                field: 'PODETDFormat',
                title: 'POD ETD',
                sorter: "dateTimeSort",
                filterControl: "input"
            },
            {
                field: 'PODSCNCode',
                title: 'POD SCN Code',
                filterControl: "input"
            },
            {
                field: 'ClosingDateTimeFormat',
                title: 'Closing Date Time',
                sorter: "dateTimeSort",
                filterControl: "input"
            },

            {
                field: 'ShipOperatorROC',
                title: 'Ship Op ROC',
                filterControl: "input"
            },
            {
                field: 'ShipOperatorCompany',
                title: 'Ship Op',
                filterControl: "input"
            },
            {
                field: 'ShipOperatorBranchCodeName',
                title: 'Ship Op Branch Code',
                filterControl: "input"
            },
            {
                field: 'ShipOperatorBranchName',
                title: 'Ship Op BranchName',
                filterControl: "input"
            },
        {
          field: 'TotalTax',
          title: 'Total Tax',
          filterControl: "input"
        },
        {
          field: 'TotalAmount',
          title: 'Total Amount',
          filterControl: "input"
        },

        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },

      ]


  }

  const DebitNote = {
    title: 'debit-note',
    defaultHide: [
      "BranchTel",
      "DocDesc",
      "ROCROC",
      "BranchCodeBranchCode",
      "BranchFax",
      "BranchEmail",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "AttentionEmail",
      "AgentROC",
      "AgentCompanyName",
      "AgentBranchCode",
      "AgentBranchName",
      "SalesPersonUsername",
      "CurrencyCurrencyName",
      "CurrencyExchangeRate",
      "TotalTax",
      "OutstandingAmount",
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid",

    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'DN No.',
          switchable: false,
          filterControl: "input",
          formatter: DBFormatterDocNumSelf,
          filterCustomSearch: "GetText"
        },
        {
          field: 'DocDateFormat',
          title: 'DN Doc Date',
          sortOrder: "desc",
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'CustomerType',
          title: 'Customer Type',
          filterControl: "input"
        },
        {
          field: 'ROCROC',
          title: 'ROC',
          filterControl: "input"
        },
        {
          field: 'CompanyName',
          title: 'Company',
          filterControl: "input"
        },
        {
          field: 'BranchCodeBranchCode',
          title: 'Branch Code',
          filterControl: "input"
        },
        {
          field: 'BranchName',
          title: 'Branch',
          filterControl: "input"
        },
        {
          field: 'CreditTermCreditTerm',
          title: 'Credit Term',
          filterControl: "input"
        },
        {
          field: 'CreditLimit',
          title: 'Credit Limit',
          filterControl: "input"
        },
        {
          field: 'BranchTel',
          title: 'Branch Tel',
          filterControl: "input"
        },
        {
          field: 'BranchFax',
          title: 'Branch Fax',
          filterControl: "input"
        },
        {
          field: 'BranchEmail',
          title: 'Branch Email',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine1',
          title: 'Branch Address Line 1',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine2',
          title: 'Branch Address Line 2',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine3',
          title: 'Branch Address Line 3',
          filterControl: "input"
        },
        {
          field: 'BranchPostcode',
          title: 'Branch Postcode',
          filterControl: "input"
        },
        {
          field: 'BranchCity',
          title: 'Branch City',
          filterControl: "input"
        },
        {
          field: 'BranchCountry',
          title: 'Branch Country',
          filterControl: "input"
        },
        {
          field: 'BranchCoordinates',
          title: 'Branch Coordinates',
          filterControl: "input"
        },
        {
          field: 'AttentionName',
          title: 'Attention Name',
          filterControl: "input"
        },
        {
          field: 'AttentionTel',
          title: 'Attention Tel',
          filterControl: "input"
        },
        {
          field: 'AttentionEmail',
          title: 'Attention Email',
          filterControl: "input"
        },
        {
          field: 'AgentROC',
          title: 'Agent ROC',
          filterControl: "input"
        },
        {
          field: 'AgentCompanyName',
          title: 'Agent Company Name',
          filterControl: "input"
        },
        {
          field: 'AgentBranchCode',
          title: 'Agent Branch',
          filterControl: "input"
        },
        {
          field: 'AgentBranchName',
          title: 'Agent Branch Name',
          filterControl: "input"
        },
        {
          field: 'SalesPersonUsername',
          title: 'Sales Person',
          filterControl: "input"
        },
        {
          field: 'CurrencyCurrencyName',
          title: 'Currency',
          filterControl: "input"
        },
        {
          field: 'CurrencyExchangeRate',
          title: 'Currency Exchange Rate',
          filterControl: "input"
        },
        {
          field: 'TotalTax',
          title: 'Total Tax',
          filterControl: "input"
        },
        {
          field: 'TotalAmount',
          title: 'Total Amount',
          filterControl: "input"
        },
        {
          field: 'OutstandingAmount',
          title: 'Outstanding Amount',
          filterControl: "input"
        },

        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },

      ]


  }


  const DebitNoteBarge = {
    title: 'debit-note-barge',
    defaultHide: [
      "BranchTel",
      "DocDesc",
      "ROCROC",
      "BranchCodeBranchCode",
      "BranchFax",
      "BranchEmail",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "AttentionEmail",
      "AgentROC",
      "AgentCompanyName",
      "AgentBranchCode",
      "AgentBranchName",
      "SalesPersonUsername",
      "CurrencyCurrencyName",
      "CurrencyExchangeRate",
      "TotalTax",
      "OutstandingAmount",
      'VerificationStatus',
      'VerifiedAtFormat',
      'VerifiedByUsername',
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid",

    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'DN No.',
          switchable: false,
          filterControl: "input",
          formatter: DBFormatterDocNumSelf,
          filterCustomSearch: "GetText"
        },
        {
          field: 'DocDateFormat',
          title: 'DN Doc Date',
          sortOrder: "desc",
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'CustomerType',
          title: 'Customer Type',
          filterControl: "input"
        },
        {
          field: 'ROCROC',
          title: 'ROC',
          filterControl: "input"
        },
        {
          field: 'CompanyName',
          title: 'Company',
          filterControl: "input"
        },
        {
          field: 'BranchCodeBranchCode',
          title: 'Branch Code',
          filterControl: "input"
        },
        {
          field: 'BranchName',
          title: 'Branch',
          filterControl: "input"
        },
        {
          field: 'CreditTermCreditTerm',
          title: 'Credit Term',
          filterControl: "input"
        },
        {
          field: 'CreditLimit',
          title: 'Credit Limit',
          filterControl: "input"
        },
        {
          field: 'BranchTel',
          title: 'Branch Tel',
          filterControl: "input"
        },
        {
          field: 'BranchFax',
          title: 'Branch Fax',
          filterControl: "input"
        },
        {
          field: 'BranchEmail',
          title: 'Branch Email',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine1',
          title: 'Branch Address Line 1',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine2',
          title: 'Branch Address Line 2',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine3',
          title: 'Branch Address Line 3',
          filterControl: "input"
        },
        {
          field: 'BranchPostcode',
          title: 'Branch Postcode',
          filterControl: "input"
        },
        {
          field: 'BranchCity',
          title: 'Branch City',
          filterControl: "input"
        },
        {
          field: 'BranchCountry',
          title: 'Branch Country',
          filterControl: "input"
        },
        {
          field: 'BranchCoordinates',
          title: 'Branch Coordinates',
          filterControl: "input"
        },
        {
          field: 'AttentionName',
          title: 'Attention Name',
          filterControl: "input"
        },
        {
          field: 'AttentionTel',
          title: 'Attention Tel',
          filterControl: "input"
        },
        {
          field: 'AttentionEmail',
          title: 'Attention Email',
          filterControl: "input"
        },
        {
          field: 'AgentROC',
          title: 'Agent ROC',
          filterControl: "input"
        },
        {
          field: 'AgentCompanyName',
          title: 'Agent Company Name',
          filterControl: "input"
        },
        {
          field: 'AgentBranchCode',
          title: 'Agent Branch',
          filterControl: "input"
        },
        {
          field: 'AgentBranchName',
          title: 'Agent Branch Name',
          filterControl: "input"
        },
        {
          field: 'SalesPersonUsername',
          title: 'Sales Person',
          filterControl: "input"
        },
        {
          field: 'CurrencyCurrencyName',
          title: 'Currency',
          filterControl: "input"
        },
        {
          field: 'CurrencyExchangeRate',
          title: 'Currency Exchange Rate',
          filterControl: "input"
        },
        {
          field: 'POLPortCodeName',
          title: 'POL Port Code',
          filterControl: "input"
      },
      {
          field: 'POLAreaName',
          title: 'POL Area',
          filterControl: "input"
      },
      {
          field: 'POLLocationCodeName',
          title: 'POL Terminal Code',
          filterControl: "input"
      },
      {
          field: 'POLLocationName',
          title: 'POL Terminal Name',
          filterControl: "input"
      },
      {
          field: 'POLPortTermName',
          title: 'POL Port Term',
          filterControl: "input"
      },
      {
          field: 'POLFreightTermName',
          title: 'POL Freight Term',
          filterControl: "input"
      },
      {
          field: 'POLHandlingOfficeCodeName',
          title: 'POL Terminal Handler Company',
          filterControl: "input"
      },
      {
          field: 'POLHandlingOfficeName',
          title: 'POL Terminal Handler Branch',
          filterControl: "input"
      },
      {
          field: 'POLReqETAFormat',
          title: 'POL Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
      },

      {
          field: 'PODPortCodeName',
          title: 'POD Port Code',
          filterControl: "input"
      },
      {
          field: 'PODAreaName',
          title: 'POD Area',
          filterControl: "input"
      },
      {
          field: 'PODLocationCodeName',
          title: 'POD Terminal Code',
          filterControl: "input"
      },
      {
          field: 'PODLocationName',
          title: 'POD Terminal Name',
          filterControl: "input"
      },
      {
          field: 'PODPortTermName',
          title: 'POD Port Term',
          filterControl: "input"
      },
      {
          field: 'PODFreightTermName',
          title: 'POD Freight Term',
          filterControl: "input"
      },
      {
          field: 'PODHandlingOfficeCodeName',
          title: 'POD Terminal Handler Company',
          filterControl: "input"
      },
      {
          field: 'PODHandlingOfficeName',
          title: 'POD Terminal Handler Branch',
          filterControl: "input"
      },
      {
          field: 'PODReqETAFormat',
          title: 'POD Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
      },

      {
          field: 'FinalDestinationName',
          title: 'Final Destination',
          filterControl: "input"
      },
      {
          field: 'FinalDestinationArea',
          title: 'Final Destination Area',
          filterControl: "input"
      },
      {
          field: 'FinalDestinationHandlerROC',
          title: 'Final Destination Agent Company',
          filterControl: "input"
      },

      {
          field: 'VoyageName',
          title: 'Voyage Num',
          filterControl: "input"
      },
      {
          field: 'VesselCode',
          title: 'Vessel Code',
          filterControl: "input"
      },
      {
          field: 'VesselName',
          title: 'Vessel Name',
          filterControl: "input"
      },
      {
        field: 'BargeCodeName',
        title: 'Barge Code',
        filterControl: "input"
      },
      {
        field: 'BargeName',
        title: 'Barge Name ',
        filterControl: "input"
      },
      {
          field: 'POLETAFormat',
          title: 'POL ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
      },
      {
          field: 'POLETDFormat',
          title: 'POL ETD',
          sorter: "dateTimeSort",
          filterControl: "input"
      },
      {
          field: 'POLSCNCode',
          title: 'POL SCN Code',
          filterControl: "input"
      },
      {
          field: 'PODETAFormat',
          title: 'POD ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
      },
      {
          field: 'PODETDFormat',
          title: 'POD ETD',
          sorter: "dateTimeSort",
          filterControl: "input"
      },
      {
          field: 'PODSCNCode',
          title: 'POD SCN Code',
          filterControl: "input"
      },
      {
          field: 'ClosingDateTimeFormat',
          title: 'Closing Date Time',
          sorter: "dateTimeSort",
          filterControl: "input"
      },

      {
          field: 'ShipOperatorROC',
          title: 'Ship Op ROC',
          filterControl: "input"
      },
      {
          field: 'ShipOperatorCompany',
          title: 'Ship Op',
          filterControl: "input"
      },
      {
          field: 'ShipOperatorBranchCodeName',
          title: 'Ship Op Branch Code',
          filterControl: "input"
      },
      {
          field: 'ShipOperatorBranchName',
          title: 'Ship Op BranchName',
          filterControl: "input"
      },
        {
          field: 'TotalTax',
          title: 'Total Tax',
          filterControl: "input"
        },
        {
          field: 'TotalAmount',
          title: 'Total Amount',
          filterControl: "input"
        },
        {
          field: 'OutstandingAmount',
          title: 'Outstanding Amount',
          filterControl: "input"
        },

        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },
      ]
  }

  const CustomerPayment = {
    title: 'customer-payment',
    defaultHide: [
      "ROCROC",
      "DocDesc",
      "BranchTel",
      "BranchFax",
      "BranchEmail",
      "AttentionName",
      "AttentionTel",
      "BranchCodeBranchCode",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "CreditTermCreditTerm",
      "CreditLimit",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "AttentionEmail",
      "AgentROC",
      "AgentBranchCode",
      "AgentBranchName",
      "SalesPersonUsername",
      "CurrencyCurrencyName",
      "CurrencyExchangeRate",
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid",
      'VerifiedByUsername',
      'VerifiedAtFormat',
      'VerificationStatus',

    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'OR No.',
          switchable: false,
          filterControl: "input",
          formatter: ORFormatterDocNum,
          filterCustomSearch: "GetText"
        },
        {
          field: 'DocDateFormat',
          title: 'OR Doc Date',
          sortOrder: "desc",
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'CustomerType',
          title: 'Customer Type',
          filterControl: "input"
        },
        {
          field: 'ROCROC',
          title: 'ROC',
          filterControl: "input"
        },
        {
          field: 'CompanyName',
          title: 'Company',
          filterControl: "input"
        },
        {
          field: 'BranchCodeBranchCode',
          title: 'Branch Code',
          filterControl: "input"
        },
        {
          field: 'BranchName',
          title: 'Branch',
          filterControl: "input"
        },
        {
          field: 'CreditTermCreditTerm',
          title: 'Credit Term',
          filterControl: "input"
        },
        {
          field: 'CreditLimit',
          title: 'Credit Limit',
          filterControl: "input"
        },
        {
          field: 'BranchTel',
          title: 'Branch Tel',
          filterControl: "input"
        },
        {
          field: 'BranchFax',
          title: 'Branch Fax',
          filterControl: "input"
        },
        {
          field: 'BranchEmail',
          title: 'Branch Email',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine1',
          title: 'Branch Address Line 1',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine2',
          title: 'Branch Address Line 2',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine3',
          title: 'Branch Address Line 3',
          filterControl: "input"
        },
        {
          field: 'BranchPostcode',
          title: 'Branch Postcode',
          filterControl: "input"
        },
        {
          field: 'BranchCity',
          title: 'Branch City',
          filterControl: "input"
        },
        {
          field: 'BranchCountry',
          title: 'Branch Country',
          filterControl: "input"
        },
        {
          field: 'BranchCoordinates',
          title: 'Branch Coordinates',
          filterControl: "input"
        },
        {
          field: 'AttentionName',
          title: 'Attention Name',
          filterControl: "input"
        },
        {
          field: 'AttentionTel',
          title: 'Attention Tel',
          filterControl: "input"
        },
        {
          field: 'AttentionEmail',
          title: 'Attention Email',
          filterControl: "input"
        },
        {
          field: 'AgentROC',
          title: 'Agent ROC',
          filterControl: "input"
        },
        {
          field: 'AgentCompanyName',
          title: 'Agent',
          filterControl: "input"
        },
        {
          field: 'AgentBranchCode',
          title: 'Agent Branch',
          filterControl: "input"
        },
        {
          field: 'AgentBranchName',
          title: 'Agent Branch Name',
          filterControl: "input"
        },
        {
          field: 'SalesPersonUsername',
          title: 'Sales Person',
          filterControl: "input"
        },
        {
          field: 'CurrencyCurrencyName',
          title: 'Currency',
          filterControl: "input"
        },
        {
          field: 'CurrencyExchangeRate',
          title: 'Currency Exchange Rate',
          filterControl: "input"
        },

        {
          field: 'ReceivableMethodReceivableMethod',
          title: 'Receivable Method',
          filterControl: "input"
        },
        {
          field: 'ReceiveAmount',
          title: 'Amount',
          filterControl: "input"
        },
        {
          field: 'UnappliedAmount',
          title: 'Unapplied Amount',
          filterControl: "input"
        },
        {
          field: 'KnockOffAmounts',
          title: 'Knockoff Amount',
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          filterControl: "input"
        },
        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },

      ]


  }

  const SpecialMovement = {
    title: 'special-movement',
    defaultHide: [
      "DepotBranchName",
      "DepotCompanyName",
      "DepotPortCode",
      "Length",
      "Width",
      "Height",
      "M3",
      "NetWeight",
      "GrossWeight",
      "YearBuild",
      "Grade",
      "BoxOperatorCompanyName",
      "Valid",
    ],
    columns:
      [

        { field: 'haulier', title: 'Hauler', formatter: haulierFommatter, switchable: false, },
        { field: 'ContainerCode', title: 'Container Code', filterControl: "input" },
        { field: 'ContainerTypeContainerType', title: 'Container Type', filterControl: "input" },
        { field: 'Status', title: 'Status', filterControl: "input" },
        { field: 'VoyageNumber', title: 'Voyage No', filterControl: "input" },
        { field: 'BookingReservationDocNum', title: 'BR No', filterControl: "input" },
        { field: 'BookingConfirmationDocNum', title: 'BC No', filterControl: "input" },
        { field: 'ContainerReleaseOrderDocNum', title: 'CRO No', filterControl: "input" },
        { field: 'BillOfLadingDocNum', title: 'BL No', filterControl: "input" },
        { field: 'DeliveryOrderDocNum', title: 'DO No', filterControl: "input" },
        { field: 'OwnershipType', title: 'Ownership Type', filterControl: "input" },
        { field: 'LadenOrEmpty', title: 'Laden / Empty', filterControl: "input" },
        { field: 'BookingReservationHasTranshipments', title: 'Transhipment', filterControl: "input" },
        { field: 'DepotPortCode', title: 'Depot Port Code', filterControl: "input" },
        { field: 'DepotCompanyName', title: 'Depot Company', filterControl: "input" },
        { field: 'DepotBranchName', title: 'Depot', filterControl: "input" },
        { field: 'Length', title: 'Length', filterControl: "input" },
        { field: 'Width', title: 'Width', filterControl: "input" },
        { field: 'Height', title: 'Height', filterControl: "input" },
        { field: 'M3', title: 'M3', filterControl: "input" },
        { field: 'NetWeight', title: 'Net Weight', filterControl: "input" },
        { field: 'GrossWeight', title: 'Gross Weight', filterControl: "input" },
        { field: 'YearBuild', title: 'Year Build', filterControl: "input" },
        { field: 'Grade', title: 'Grade', filterControl: "input" },
        { field: 'BoxOperatorCompanyName', title: 'Box Operator', filterControl: "input" },
        { field: 'Valid', title: 'Valid' },
      ]
  }

  const ContainerReleaseOrder = {
    title: 'container-release-order',
    defaultHide: ['DocDesc',
      'BookingReservationDocNum',
      // 'BookingConfirmationDocNum',
      'QuotationDocNum',
      'POLPortCodePortCode',
      'POLLocationCodeLocationCode',
      'POLLocationName',
      'POLPortTermPortTerm',
      'POLFreightTermFreightTerm',
      'POLHandlingOfficeCodeBranchCode',
      'POLHandlingOfficeName',
      'POLReqETAFormat',
      'PODPortCodePortCode',
      'PODLocationCodeLocationCode',
      'PODLocationName',
      'PODPortTermPortTerm',
      'PODFreightTermFreightTerm',
      'PODHandlingOfficeCodeBranchCode',
      'PODHandlingOfficeName',
      'PODReqETAFormat',
      'FinalDestinationPortCode',
      'FinalDestinationArea',
      'FinalDestinationHandlerROC',
      'VesselCode',
      'POLETAFormat',
      'POLSCNCode',
      'PODETAFormat',
      'PODSCNCode',
      'ClosingDateTimeFormat',
      'ShipOperatorROC',
      'ShipOperatorCompany',
      'ShipOperatorBranchCodeBranchCode',
      'ShipOperatorBranchName',
      'InsistTranshipment',
      'NominationPortCode',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: voyageDelayFormatter
        },
        {
          field: 'DocNum',
          title: 'CRO No.',
          switchable: false,
          filterCustomSearch: "GetText",
          formatter: CROFormatterDocNum,
          filterControl: "input"
        },
        {
          field: 'DocDateFormat',
          title: 'CRO Doc Date',
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'BookingReservationDocNum',
          title: 'BR No.',
          formatter: CROBRFormatterDocNum,
          filterControl: "input"
        },
        // {
        //     field: 'BookingConfirmationDocNum',
        //     title: 'BC No.',
        //     formatter: "CROBCFormatterDocNum",
        //     filterControl: "input"
        // },
        {
          field: 'QuotationDocNum',
          title: 'QT No.',
          formatter: CROQTFormatterDocNum,
          filterControl: "input"
        },
        {
          field: 'ContainerReleaseOrderHaulerPOLHaulerCompanyName',
          title: 'Hauler',
          filterControl: "input"
        },
        {
          field: 'VoyageName',
          title: 'Voyage Num',
          filterControl: "input"
        },
        {
          field: 'VesselCode',
          title: 'Vessel Code',
          filterControl: "input"
        },
        {
          field: 'VesselName',
          title: 'Vessel Name',
          filterControl: "input"
        },
        {
          field: 'POLETAFormat',
          title: 'POL ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'POLSCNCode',
          title: 'POL SCN Code',
          filterControl: "input"
        },
        {
          field: 'PODETAFormat',
          title: 'POD ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'PODSCNCode',
          title: 'POD SCN Code',
          filterControl: "input"
        },
        {
          field: 'ClosingDateTimeFormat',
          title: 'Closing Date Time',
          sorter: "dateTimeSort",
          filterControl: "input"
        },


        {
          field: 'ContainerReleaseOrderAgentCompanyName',
          title: 'Agent',
          filterControl: "input"
        },
        {
          field: 'ContainerReleaseOrderShipperCompanyName',
          title: 'Shipper',
          filterControl: "input"
        },
        {
          field: 'ContainerReleaseOrderConsigneeCompanyName',
          title: 'Consignee',
          filterControl: "input"
        },

        {
          field: 'POLPortCodePortCode',
          title: 'POL Port Code',
          filterControl: "input"
        },
        {
          field: 'POLAreaName',
          title: 'POL',
          filterControl: "input"
        },
        {
          field: 'POLLocationCodeLocationCode',
          title: 'POL Location Code',
          filterControl: "input"
        },
        {
          field: 'POLLocationName',
          title: 'POL Location Name',
          filterControl: "input"
        },
        {
          field: 'POLPortTermPortTerm',
          title: 'POL Port Term',
          filterControl: "input"
        },
        {
          field: 'POLFreightTermFreightTerm',
          title: 'POL Freight Term',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeCodeBranchCode',
          title: 'POL Terminal Handler Code',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeName',
          title: 'POL Terminal Handler Name',
          filterControl: "input"
        },
        {
          field: 'POLReqETAFormat',
          title: 'POL Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'PODPortCodePortCode',
          title: 'POD Port Code',
          filterControl: "input"
        },
        {
          field: 'PODAreaName',
          title: 'POD',
          filterControl: "input"
        },
        {
          field: 'PODLocationCodeLocationCode',
          title: 'POD Location Code',
          filterControl: "input"
        },
        {
          field: 'PODLocationName',
          title: 'POD Location Name',
          filterControl: "input"
        },
        {
          field: 'PODPortTermPortTerm',
          title: 'POD Port Term',
          filterControl: "input"
        },
        {
          field: 'PODFreightTermFreightTerm',
          title: 'POD Freight Term',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeCodeBranchCode',
          title: 'POD Terminal Handler Code',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeName',
          title: 'POD Terminal Handler Name',
          filterControl: "input"
        },
        {
          field: 'PODReqETAFormat',
          title: 'POD Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'FinalDestinationPortCode',
          title: 'Final Destination',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationArea',
          title: 'Final Destination Area',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationHandlerROC',
          title: 'Final Destination Handler',
          filterControl: "input"
        },

        {
          field: 'ShipOperatorROC',
          title: 'Ship Op ROC',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorCompany',
          title: 'Ship Op',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchCodeBranchCode',
          title: 'Ship Op Branch Code',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchName',
          title: 'Ship Op Branch Name',
          filterControl: "input"
        },

        {
          field: 'InsistTranshipment',
          title: 'Insist Transhipment',
          filterControl: "input"
        },
        {
          field: 'NominationPortCode',
          title: 'Nomination',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        }]
  }


  const PurchaseOrder = {
    title: 'purchase-order',
    defaultHide: [
      "ROCROC",
      "BranchTel",
      "BranchFax",
      "BranchEmail",
      "BranchCodeBranchCode",
      "BranchAddressLine1",
      "BranchAddressLine2",
      "BranchAddressLine3",
      "CreditTermCreditTerm",
      "CreditLimit",
      "BranchPostcode",
      "BranchCity",
      "BranchCountry",
      "BranchCoordinates",
      "CreditorType",
      "AgentROC",
      "AgentCompanyName",
      "AgentBranchCodeBranchCode",
      "AgentBranchName",
      "CurrencyExchangeRate",
      "TotalDiscount",
      "TotalTax",
      "VerifiedAtFormat",
      "VerifiedByUsername",
      "CreatedAtFormat",
      "CreatedByUsername",
      "UpdatedAtFormat",
      "UpdatedByUsername",
      "Valid",
    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'PO No.',
          switchable: false,
          filterControl: "input",
          formatter: POFormatterDocNum,
          filterCustomSearch: "GetText"
        },
        {
          field: 'DocDateFormat',
          title: 'PO Doc Date',
          sortOrder: "desc",
          sorter: "dateSort",
          filterControl: "input"
        },
        {
          field: 'CreditorType',
          title: 'Creditor Type',
          filterControl: "input"
        },
        {
          field: 'SalesPersonUsername',
          title: 'Sales Person',
          filterControl: "input"
        },
        {
          field: 'CurrencyTypeCurrencyName',
          title: 'Currency',
          filterControl: "input"
        },
        {
          field: 'CurrencyExchangeRate',
          title: 'Currency Exchange Rate',
          filterControl: "input"
        },
        {
          field: 'ROCROC',
          title: 'ROC',
          filterControl: "input"
        },
        {
          field: 'CompanyName',
          title: 'Company Name',
          filterControl: "input"
        },
        {
          field: 'BranchCodeBranchCode',
          title: 'Branch Code',
          filterControl: "input"
        },
        {
          field: 'BranchName',
          title: 'Branch Name',
          filterControl: "input"
        },

        {
          field: 'CreditTermCreditTerm',
          title: 'Credit Term',
          filterControl: "input"
        },
        {
          field: 'CreditLimit',
          title: 'Credit Limit',
          filterControl: "input"
        },

        {
          field: 'BranchTel',
          title: 'Branch Tel',
          filterControl: "input"
        },
        {
          field: 'BranchFax',
          title: 'Branch Fax',
          filterControl: "input"
        },
        {
          field: 'BranchEmail',
          title: 'Branch Email',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine1',
          title: 'Branch Address Line 1',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine2',
          title: 'Branch Address Line 2',
          filterControl: "input"
        },
        {
          field: 'BranchAddressLine3',
          title: 'Branch Address Line 3',
          filterControl: "input"
        },
        {
          field: 'BranchPostcode',
          title: 'Branch Postcode',
          filterControl: "input"
        },
        {
          field: 'BranchCity',
          title: 'Branch City',
          filterControl: "input"
        },
        {
          field: 'BranchCountry',
          title: 'Branch Country',
          filterControl: "input"
        },
        {
          field: 'BranchCoordinates',
          title: 'Branch Coordinates',
          filterControl: "input"
        },

        {
          field: 'AttentionName',
          title: 'Attention Name',
          filterControl: "input"
        },
        {
          field: 'AttentionTel',
          title: 'Attention Tel',
          filterControl: "input"
        },
        {
          field: 'AttentionEmail',
          title: 'Attention Email',
          filterControl: "input"
        },

        {
          field: 'AgentROC',
          title: 'Agent ROC',
          filterControl: "input"
        },
        {
          field: 'AgentCompanyName',
          title: 'Agent',
          filterControl: "input"
        },
        {
          field: 'AgentBranchCodeBranchCode',
          title: 'Agent Branch',
          filterControl: "input"
        },
        {
          field: 'AgentBranchName',
          title: 'Agent Branch Name',
          filterControl: "input"
        },

        {
          field: 'TotalDiscount',
          title: 'Total Discount',
          filterControl: "input"
        },
        {
          field: 'TotalTax',
          title: 'Total Tax',
          filterControl: "input"
        },
        {
          field: 'TotalAmount',
          title: 'Total Amount',
          filterControl: "input"
        },

        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid'
        },
      ]
  }

  const BillOfLading = {
    title: 'bill-of-lading',
    defaultHide: [
      'DocDesc',
      'BookingReservationDocNum',
      'QuotationDocNum',
      'POLPortCodePortCode',
      'POLLocationCodeLocationCode',
      'POLLocationName',
      'POLPortTermPortTerm',
      'POLFreightTermFreightTerm',
      'POLHandlingOfficeCodeBranchCode',
      'POLHandlingOfficeName',
      'POLReqETAFormat',
      'PODPortCodePortCode',
      'PODLocationCodeLocationCode',
      'PODLocationName',
      'PODPortTermPortTerm',
      'PODFreightTermFreightTerm',
      'PODHandlingOfficeCodeBranchCode',
      'PODHandlingOfficeName',
      'PODReqETAFormat',
      'FinalDestinationPortCode',
      'FinalDestinationArea',
      'FinalDestinationHandlerROC',
      'VesselCode',
      'POLETAFormat',
      'POLSCNCode',
      'PODETAFormat',
      'PODSCNCode',
      'ClosingDateTimeFormat',
      'ShipOperatorROC',
      'ShipOperatorCompany',
      'ShipOperatorBranchCodeBranchCode',
      'ShipOperatorBranchName',
      'InsistTranshipment',
      'ApplyDND',
      'DNDCombined',
      'DNDCombinedDay',
      'Detention',
      'Demurrage',
      'NominationPortCode',
      'TelexReleaseDescription',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'MergeParentDocNum',
      'SplitParentDocNum',
      'VerifiedByUsername',
      'VerifiedAtFormat',
      'VerificationStatus',],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          width: "100",
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'BL No.',
          switchable: false,
          filtercustomsearch: "GetText",
          formatter: BLFormatterDocNumSelf,
          filterControl: "input"
        },
        {
          field: 'DocDateFormat',
          title: 'BL Doc Date',
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'BookingReservationDocNum',
          title: 'Booking Confirmation',
          formatter: BLBCFormatterDocNum,
          filterControl: "input"
        },
        {
          field: 'QuotationDocNum',
          title: 'Quotation',
          formatter: CROQTFormatterDocNum,
          filterControl: "input"
        },
        {
          field: 'SalesInvoiceDocNums',
          title: 'Invoice',
          formatter: salesinvoiceFormatterDocNum,
          filterControl: "input"
        },

        {
          field: 'VoyageName',
          title: 'Voyage Num',
          filterControl: "input"
        },
        {
          field: 'VesselCode',
          title: 'Vessel Code',
          filterControl: "input"
        },
        {
          field: 'VesselName',
          title: 'Vessel Name',
          filterControl: "input"
        },
        {
          field: 'POLETAFormat',
          title: 'POL ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'POLSCNCode',
          title: 'POL SCN Code',
          filterControl: "input"
        },
        {
          field: 'PODETAFormat',
          title: 'POD ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'PODSCNCode',
          title: 'POD SCN Code',
          filterControl: "input"
        },
        {
          field: 'ClosingDateTimeFormat',
          title: 'Closing Date Time',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'BillOfLadingAgentCompanyName',
          title: 'Agent',
          filterControl: "input"
        },
        {
          field: 'BillOfLadingShipperCompanyName',
          title: 'Shipper',
          filterControl: "input"
        },
        {
          field: 'BillOfLadingConsigneeCompanyName',
          title: 'Consignee',
          filterControl: "input"
        },

        {
          field: 'POLPortCodePortCode',
          title: 'POL Port Code',
          filterControl: "input"
        },
        {
          field: 'POLAreaName',
          title: 'POL',
          filterControl: "input"
        },
        {
          field: 'POLLocationCodeLocationCode',
          title: 'POL Location Code',
          filterControl: "input"
        },
        {
          field: 'POLLocationName',
          title: 'POL Location Name',
          filterControl: "input"
        },
        {
          field: 'POLPortTermPortTerm',
          title: 'POL Port Term',
          filterControl: "input"
        },
        {
          field: 'POLFreightTermFreightTerm',
          title: 'POL Freight Term',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeCodeBranchCode',
          title: 'POL Terminal Handler Code',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeName',
          title: 'POL Terminal Handler Name',
          filterControl: "input"
        },
        {
          field: 'POLReqETAFormat',
          title: 'POL Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'PODPortCodePortCode',
          title: 'POD Port Code',
          filterControl: "input"
        },
        {
          field: 'PODAreaName',
          title: 'POD',
          filterControl: "input"
        },
        {
          field: 'PODLocationCodeLocationCode',
          title: 'POD Location Code',
          filterControl: "input"
        },
        {
          field: 'PODLocationName',
          title: 'POD Location Name',
          filterControl: "input"
        },
        {
          field: 'PODPortTermPortTerm',
          title: 'POD Port Term',
          filterControl: "input"
        },
        {
          field: 'PODFreightTermFreightTerm',
          title: 'POD Freight Term',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeCodeBranchCode',
          title: 'POD Terminal Handler Code',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeName',
          title: 'POD Terminal Handler Name',
          filterControl: "input"
        },
        {
          field: 'PODReqETAFormat',
          title: 'POD Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'TelexRelease',
          title: 'Telex Release',
          filterControl: "input"
        },
        {
          field: 'TelexReleaseDescription',
          title: 'Telex Release Description',
          filterControl: "input"
        },

        {
          field: 'FinalDestinationPortCode',
          title: 'Final Destination',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationArea',
          title: 'Final Destination Area',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationHandlerROC',
          title: 'Final Destination Handler',
          filterControl: "input"
        },

        {
          field: 'ShipOperatorROC',
          title: 'Ship Op ROC',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorCompany',
          title: 'Ship Op',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchCodeBranchCode',
          title: 'Ship Op Branch Code',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchName',
          title: 'Ship Op Branch Name',
          filterControl: "input"
        },

        {
          field: 'InsistTranshipment',
          title: 'Insist Transhipment',
          filterControl: "input"
        },
        {
          field: 'ApplyDND',
          title: 'Apply DND',
          filterControl: "input"
        },
        {
          field: 'DNDCombined',
          title: 'DND Combined',
          filterControl: "input"
        },
        {
          field: 'DNDCombinedDay',
          title: 'DND Combined Day',
          filterControl: "input"
        },
        {
          field: 'Detention',
          title: 'Detention',
          filterControl: "input"
        },
        {
          field: 'Demurrage',
          title: 'Demurrage',
          filterControl: "input"
        },
        {
          field: 'NominationPortCode',
          title: 'Nomination',
          filterControl: "input"
        },

        {
          field: 'MergeParentDocNum',
          title: 'Merge Parent',
          filterControl: "input"
        },
        {
          field: 'SplitParentDocNum',
          title: 'Split Parent',
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          filterControl: "input"
        },
        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        },]
  }

  const BillOfLadingBarge = {
    title: 'bill-of-lading-barge',
    defaultHide: [
      'DocDesc',
      'BookingReservationDocNum',
      'QuotationDocNum',
      'POLPortCodePortCode',
      'POLLocationCodeLocationCode',
      'POLLocationName',
      'POLPortTermPortTerm',
      'POLFreightTermFreightTerm',
      'POLHandlingOfficeCodeBranchCode',
      'POLHandlingOfficeName',
      'POLReqETAFormat',
      'PODPortCodePortCode',
      'PODLocationCodeLocationCode',
      'PODLocationName',
      'PODPortTermPortTerm',
      'PODFreightTermFreightTerm',
      'PODHandlingOfficeCodeBranchCode',
      'PODHandlingOfficeName',
      'PODReqETAFormat',
      'FinalDestinationPortCode',
      'FinalDestinationArea',
      'FinalDestinationHandlerROC',
      'VesselCode',
      'POLETAFormat',
      'POLSCNCode',
      'PODETAFormat',
      'PODSCNCode',
      'ClosingDateTimeFormat',
      'ShipOperatorROC',
      'ShipOperatorCompany',
      'ShipOperatorBranchCodeBranchCode',
      'ShipOperatorBranchName',
      'InsistTranshipment',
      'ApplyDND',
      'DNDCombined',
      'DNDCombinedDay',
      'Detention',
      'Demurrage',
      'NominationPortCode',
      'TelexReleaseDescription',
      'CreatedAtFormat',
      'CreatedByUsername',
      'UpdatedAtFormat',
      'UpdatedByUsername',
      'Valid',
      'MergeParentDocNum',
      'SplitParentDocNum',
      'VerifiedByUsername',
      'VerifiedAtFormat',
      'VerificationStatus',],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          width: "100",
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'BL No.',
          switchable: false,
          filtercustomsearch: "GetText",
          formatter: BLFormatterDocNumSelf,
          filterControl: "input"
        },
        {
          field: 'DocDateFormat',
          title: 'BL Doc Date',
          filterControl: "input"
        },
        {
          field: 'DocDesc',
          title: 'Doc Desc',
          filterControl: "input"
        },
        {
          field: 'BookingReservationDocNum',
          title: 'Booking Confirmation',
          formatter: BLBCFormatterDocNum,
          filterControl: "input"
        },
        {
          field: 'QuotationDocNum',
          title: 'Quotation',
          formatter: CROQTFormatterDocNum,
          filterControl: "input"
        },
        {
          field: 'SalesInvoiceDocNums',
          title: 'Invoice',
          formatter: salesinvoiceFormatterDocNum,
          filterControl: "input"
        },

        {
          field: 'VoyageName',
          title: 'Voyage Num',
          filterControl: "input"
        },
        {
          field: 'VesselCode',
          title: 'Vessel Code',
          filterControl: "input"
        },
        {
          field: 'VesselName',
          title: 'Vessel Name',
          filterControl: "input"
        },
        {
          field: 'POLETAFormat',
          title: 'POL ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'POLSCNCode',
          title: 'POL SCN Code',
          filterControl: "input"
        },
        {
          field: 'PODETAFormat',
          title: 'POD ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'PODSCNCode',
          title: 'POD SCN Code',
          filterControl: "input"
        },
        {
          field: 'ClosingDateTimeFormat',
          title: 'Closing Date Time',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'BillOfLadingAgentCompanyName',
          title: 'Agent',
          filterControl: "input"
        },
        {
          field: 'BillOfLadingShipperCompanyName',
          title: 'Shipper',
          filterControl: "input"
        },
        {
          field: 'BillOfLadingConsigneeCompanyName',
          title: 'Consignee',
          filterControl: "input"
        },

        {
          field: 'POLPortCodePortCode',
          title: 'POL Port Code',
          filterControl: "input"
        },
        {
          field: 'POLAreaName',
          title: 'POL',
          filterControl: "input"
        },
        {
          field: 'POLLocationCodeLocationCode',
          title: 'POL Location Code',
          filterControl: "input"
        },
        {
          field: 'POLLocationName',
          title: 'POL Location Name',
          filterControl: "input"
        },
        {
          field: 'POLPortTermPortTerm',
          title: 'POL Port Term',
          filterControl: "input"
        },
        {
          field: 'POLFreightTermFreightTerm',
          title: 'POL Freight Term',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeCodeBranchCode',
          title: 'POL Agent Office Code',
          filterControl: "input"
        },
        {
          field: 'POLHandlingOfficeName',
          title: 'POL Agent Office Name',
          filterControl: "input"
        },
        {
          field: 'POLReqETAFormat',
          title: 'POL Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'PODPortCodePortCode',
          title: 'POD Port Code',
          filterControl: "input"
        },
        {
          field: 'PODAreaName',
          title: 'POD',
          filterControl: "input"
        },
        {
          field: 'PODLocationCodeLocationCode',
          title: 'POD Location Code',
          filterControl: "input"
        },
        {
          field: 'PODLocationName',
          title: 'POD Location Name',
          filterControl: "input"
        },
        {
          field: 'PODPortTermPortTerm',
          title: 'POD Port Term',
          filterControl: "input"
        },
        {
          field: 'PODFreightTermFreightTerm',
          title: 'POD Freight Term',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeCodeBranchCode',
          title: 'POD Agent Office Code',
          filterControl: "input"
        },
        {
          field: 'PODHandlingOfficeName',
          title: 'POD Agent Office Name',
          filterControl: "input"
        },
        {
          field: 'PODReqETAFormat',
          title: 'POD Req ETA',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'TelexRelease',
          title: 'Telex Release',
          filterControl: "input"
        },
        {
          field: 'TelexReleaseDescription',
          title: 'Telex Release Description',
          filterControl: "input"
        },

        {
          field: 'FinalDestinationPortCode',
          title: 'Final Destination',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationArea',
          title: 'Final Destination Area',
          filterControl: "input"
        },
        {
          field: 'FinalDestinationHandlerROC',
          title: 'Final Destination Handler',
          filterControl: "input"
        },
        {
          field: 'BargeCodeName',
          title: 'Barge Code',
          filterControl: "input"
        },
        {
          field: 'BargeName',
          title: 'Barge Name ',
          filterControl: "input"
        },

        {
          field: 'ShipOperatorROC',
          title: 'Ship Op ROC',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorCompany',
          title: 'Ship Op',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchCodeBranchCode',
          title: 'Ship Op Branch Code',
          filterControl: "input"
        },
        {
          field: 'ShipOperatorBranchName',
          title: 'Ship Op Branch Name',
          filterControl: "input"
        },

        {
          field: 'InsistTranshipment',
          title: 'Insist Transhipment',
          filterControl: "input"
        },
        {
          field: 'ApplyDND',
          title: 'Apply DND',
          filterControl: "input"
        },
        {
          field: 'DNDCombined',
          title: 'DND Combined',
          filterControl: "input"
        },
        {
          field: 'DNDCombinedDay',
          title: 'DND Combined Day',
          filterControl: "input"
        },
        {
          field: 'Detention',
          title: 'Detention',
          filterControl: "input"
        },
        {
          field: 'Demurrage',
          title: 'Demurrage',
          filterControl: "input"
        },
        {
          field: 'NominationPortCode',
          title: 'Nomination',
          filterControl: "input"
        },

        {
          field: 'MergeParentDocNum',
          title: 'Merge Parent',
          filterControl: "input"
        },
        {
          field: 'SplitParentDocNum',
          title: 'Split Parent',
          filterControl: "input"
        },
        {
          field: 'VerifiedByUsername',
          title: 'Verified By',
          filterControl: "input"
        },
        {
          field: 'VerifiedAtFormat',
          title: 'Verified At',
          filterControl: "input"
        },
        {
          field: 'VerificationStatus',
          title: 'Verification Status',
          filterControl: "input"
        },

        {
          field: 'CreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'CreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },
        {
          field: 'UpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },
        {
          field: 'UpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },
        {
          field: 'Valid',
          title: 'Valid',
          filterControl: "input"
        },]
  }

  const DeliveryOrder = {
    title: 'delivery-order',
    defaultHide: [ // default field to hide in bootstrap table
      'DeliveryOrderCreatedAtFormat',
      'DeliveryOrderCreatedByUsername',
      'DeliveryOrderUpdatedAtFormat',
      'DeliveryOrderUpdatedByUsername',
      'DeliveryOrderValid',
      'BLStatus',
    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          width: "100",
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'BL No.',
          switchable: false,
          //formatter: "BillOfLadingDOFormatterDocNum",
          filterControl: "input"
        },

        {
          field: 'DocDateFormat',
          title: 'BL Doc Date',
          filterControl: "input"
        },

        {
          field: 'VoyageName',
          title: 'Voyage Num',
          filterControl: "input"
        },

        {
          field: 'VesselCode',
          title: 'Vessel Code',
          filterControl: "input"
        },

        {
          field: 'BillOfLadingAgentCompanyName',
          title: 'Agent',
          filterControl: "input"
        },

        {
          field: 'BillOfLadingShipperCompanyName',
          title: 'BL Shipper',
          filterControl: "input"
        },

        {
          field: 'BillOfLadingConsigneeCompanyName',
          title: 'BL Consignee',
          filterControl: "input"
        },

        {
          field: 'BLStatus',
          title: 'Status',
          //formatter:"DeliveryOrderFormatterStatus",  
          filterControl: "input",
        },

        {
          field: 'DeliveryOrderDocNum',
          title: 'DO No.',
          filterControl: "input",
          formatter: DeliveryOrderFormatterDocNum2,
          filtercustomsearch: "GetText"
        },

        {
          field: 'DeliveryOrderDocDateFormat',
          title: 'DO Doc Date',
          sorter: "dateSort",
          filterControl: "input"
        },

        {
          field: 'SalesInvoiceDocNums',
          title: 'Invoice',
          formatter: salesinvoiceFormatterDocNum,
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderShipper',
          title: 'Shipper',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderConsignee',
          title: 'Consignee',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderCreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderCreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderUpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderUpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderValid',
          title: 'Valid',
        },


      ]
  }



  const DeliveryOrderBarge = {
    title: 'delivery-order-barge',
    defaultHide: [ // default field to hide in bootstrap table
      'DeliveryOrderCreatedAtFormat',
      'DeliveryOrderCreatedByUsername',
      'DeliveryOrderUpdatedAtFormat',
      'DeliveryOrderUpdatedByUsername',
      'DeliveryOrderValid',
      'BLStatus',
    ],
    columns:
      [
        {
          field: 'operate',
          title: 'Status',
          width: "100",
          class: 'statusIcon',
          align: 'center',
          switchable: false,
          formatter: statusFormatter
        },
        {
          field: 'DocNum',
          title: 'BL No.',
          switchable: false,
          //formatter: "BillOfLadingDOFormatterDocNum",
          filterControl: "input"
        },

        {
          field: 'DocDateFormat',
          title: 'BL Doc Date',
          filterControl: "input"
        },

        {
          field: 'VoyageName',
          title: 'Voyage Num',
          filterControl: "input"
        },

        {
          field: 'VesselCode',
          title: 'Vessel Code',
          filterControl: "input"
        },

        {
          field: 'BillOfLadingAgentCompanyName',
          title: 'Agent',
          filterControl: "input"
        },

        {
          field: 'BillOfLadingShipperCompanyName',
          title: 'BL Shipper',
          filterControl: "input"
        },

        {
          field: 'BillOfLadingConsigneeCompanyName',
          title: 'BL Consignee',
          filterControl: "input"
        },

        {
          field: 'BLStatus',
          title: 'Status',
          //formatter:"DeliveryOrderFormatterStatus",  
          filterControl: "input",
        },

        {
          field: 'DeliveryOrderDocNum',
          title: 'DO No.',
          filterControl: "input",
          formatter: DeliveryOrderFormatterDocNum2,
          filtercustomsearch: "GetText"
        },

        {
          field: 'DeliveryOrderDocDateFormat',
          title: 'DO Doc Date',
          sorter: "dateSort",
          filterControl: "input"
        },

        {
          field: 'SalesInvoiceDocNums',
          title: 'Invoice',
          formatter: salesinvoiceFormatterDocNum,
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderShipper',
          title: 'Shipper',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderConsignee',
          title: 'Consignee',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderCreatedAtFormat',
          title: 'Created At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderCreatedByUsername',
          title: 'Created By',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderUpdatedAtFormat',
          title: 'Updated At',
          sorter: "dateTimeSort",
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderUpdatedByUsername',
          title: 'Updated By',
          filterControl: "input"
        },

        {
          field: 'DeliveryOrderValid',
          title: 'Valid',
        },


      ]
  }


  ColumnSetting = [
    ...ColumnSetting,
    Area,
    CurrencyType,
    CurrencyRate,
    FreightTerm,
    PortTerm,
    TaxCode,
    CustomerType,
    BusinessNature,
    CompanyType,
    SupplierType,
    ContainerType,
    VesselType,
    CreditTerm,
    UNNumber,
    HSCode,
    ChargesType,
    Charges,
    Tariff,
    ReceivableMethod,
    UserGroup,
    Rule,
    RuleSet,
    User,
    Route,
    Voyage,
    Container,
    Vessel,
    PortDetails,
    Company,
    Quotation,
    SalesInvoice,
    CreditNote,
    DebitNote,
    CustomerPayment,
    Voyage,
    CargoType,
    ContainerRelease,
    ContainerVerifyGrossMass,
    ContainerGateIn,
    ContainerLoaded,
    ContainerDischarged,
    ContainerGateOut,
    ContainerReceived,
    SpecialMovement,
    DnD,
    ContainerReleaseOrder,
    PurchaseOrder,
    BillOfLading,
    BillOfLadingBarge,
    CreditNoteBarge,
    DebitNoteBarge,
    SalesInvoiceBarge,
    DeliveryOrder,
    BookingReservation,
    CustomerPayment,
    QuotationBarge,
    DeliveryOrderBarge,
    BookingReservationBarge

  ];




  var result = ColumnSetting.filter(function (oneArray) {
    return oneArray.title == value
  });

  return result;
};

export default GridViewColumnSetting;