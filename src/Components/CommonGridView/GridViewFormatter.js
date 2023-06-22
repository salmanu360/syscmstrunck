import UserPng from '../../Assets/logo/user.png';
import $ from "jquery";


export const imageFormatter = (value, row, index) => {
  if (!row.image) {
    return '<img style="width: 50px; height: 50px;" src=' + UserPng + ' />'
  } else {
    return `<img style="width: 50px; height: 50px;" onerror="this.src='${UserPng}'" src='${row.imageLink}?t=${Math.random()}'>`
  }
}

export const QTFormatterDocNum = (value, row, index) => {
  if (row.QuotationUUID == null) {
    return null;
  } else {
    if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
      return "<a href='../quotation-barge/update/id=" + row.QuotationUUID + "' target='_blank'>" + value + "</a>";
    } else {
      return "<a href='../quotation/update/id=" + row.QuotationUUID + "' target='_blank'>" + value + "</a>";

    }
  }
}

export const BRFormatterDocNum = (value, row, index) => {
  if (row.BookingReservationUUID == null) {
    return null;
  } else {
    if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
      return "<a href='../booking-reservation-barge/update/id=" + row.BookingReservationUUID + "' target='_blank'>" + value + "</a>";
    } else {
      return "<a href='../booking-reservation/update/id=" + row.BookingReservationUUID + "' target='_blank'>" + value + "</a>";
    }
  }
}


export const BLFormatterDocNum = (value, row, index) => {
  // console.log(row.BillOfLadingUUID)
  if (row.BillOfLadingUUID == null) {
    return null;
  }
  else {
    var id = row.BillOfLadingUUID;
    //   if (CheckThirdParty) {
    //     if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
    //       return "<a href='../bill-of-lading-barge/update/?id=" + row.ContainerReleaseOrderUUID + "&third-party=1' target='_blank'>" + value + "</a>"
    //     }else{
    //       return "<a href='../bill-of-lading/update/id=" + row.BillOfLadingUUID + "' target='_blank'>" + value + "</a>";
    //     }
    //   }
    //   else {
    if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
      return "<a href='../bill-of-lading-barge/update/id=" + row.BillOfLadingUUID + "' target='_blank'>" + value + "</a>";
    } else {
      return "<a href='../bill-of-lading/update/id=" + row.BillOfLadingUUID + "' target='_blank'>" + value + "</a>";
    }
    //}


  }
}

export const BLFormatterDocNumSelf = (value, row, index) => {
  // console.log(row.BillOfLadingUUID)
  if (row.BillOfLadingUUID == null) {
    return null;
  }
  else {
    var id = row.BillOfLadingUUID;
    if ((window.location.pathname).includes("third-party")) {
      if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
        return "<a href='../../../standard/bill-of-lading-barge/update/id=" + row.BillOfLadingUUID + "&thirdparty=1' target='_blank'>" + value + "</a>";
      }
      else {
        return "<a href='../../../container/bill-of-lading/update/id=" + row.BillOfLadingUUID + "&thirdparty=1' target='_blank'>" + value + "</a>";
      }

    }else{
      if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
        return "<a href='../bill-of-lading-barge/update/id=" + row.BillOfLadingUUID + "' target='_blank'>" + value + "</a>";
      } else {
        return "<a href='../bill-of-lading/update/id=" + row.BillOfLadingUUID + "' target='_blank'>" + value + "</a>";
      }
    }


    //}


  }
}

export const BLBCFormatterDocNum = (value, row, index) => {
	if (value == null) {
		return null;
	} else {
		var id = row.BookingReservation;
		if (window.location.pathname.includes("third-party")) {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../../sales/standard/booking-reservation-barge/update/id=" +
					id +
					"' className='checkPermissionLinkBR' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../../sales/container/booking-reservation/update/id=" +
					id +
					"' className='checkPermissionLinkBR' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../sales/standard/booking-reservation-barge/update/id=" +
					id +
					"' className='checkPermissionLinkBR' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../sales/container/booking-reservation/update/id=" +
					id +
					"' className='checkPermissionLinkBR' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}

		//}
	}
};

export const POFormatterDocNum = (value, row, index) => {
	if (row.PurchaseOrderUUID == null) {
		return null;
	} else {
		return (
			"<a href='../purchase-order/update/id=" +
			row.PurchaseOrderUUID +
			"' target='_blank'>" +
			value +
			"</a>"
		);
	}
};

export const BLDocFormatterDocNumBR = (value, row, index) => {
	if (row.BillOfLadingDocNum != null) {
		if (row.BillOfLadingDocNum == null) {
			return null;
		} else {
			var id = row.BillOfLadingUUID;
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../operation/standard/bill-of-lading-barge/update/id=" +
					id +
					"' class = 'checkPermissionLinkBL' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../operation/container/bill-of-lading/update/id=" +
					id +
					"' class = 'checkPermissionLinkBL' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}
	} else {
		return null;
	}
};

export const LinkFormatterBCNo = (value, row, index) => {
	if (row.BookingConfirmationDocNum == null) {
		return null;
	} else {
		return (
			"<a href='update/id=" + row.id + "' target='_blank'>" + value + "</a>"
		);
	}
};

export const QuotationFormatterDocNum = (value, row, index) => {
	// console.log(row)
	if (row.Quotation == null) {
		return null;
	} else {
		if (
			window.location.pathname
				.substring(0, window.location.pathname.lastIndexOf("/"))
				.includes("barge")
		) {
			return (
				"<a href='../quotation-barge/update/id=" +
				row.Quotation +
				"' class = 'checkPermissionLinkQT' target='_blank'>" +
				value +
				"</a>"
			);
		} else {
			return (
				"<a href='../quotation/update/id=" +
				row.Quotation +
				"' class = 'checkPermissionLinkQT' target='_blank'>" +
				value +
				"</a>"
			);
		}
	}
};

export const salesinvoiceFormatterDocNum = (value, row, index) => {
	if (value == null || value == "") {
		return null;
	} else {
		var LinkID = "";

		var arrayDocNum = row.SalesInvoiceDocNums.split(",");
		var arrayUUID = row.SalesInvoiceUUIDs.split(",");

		$.each(arrayDocNum, function (key, value) {
			$.each(arrayUUID, function (key2, value2) {
				if (key == key2) {
					if (window.location.pathname.includes("third-party")) {
						if (
							window.location.pathname
								.substring(0, window.location.pathname.lastIndexOf("/"))
								.includes("barge")
						) {
							LinkID +=
								"<a href='../../../../sales/standard/sales-invoice-barge/update/id=" +
								value2 +
								"' className='checkPermissionLinkINV' target='_blank'>" +
								value +
								"</a>, ";
						} else {
							LinkID +=
								"<a href='../../../../sales/container/sales-invoice/update/id=" +
								value2 +
								"' className='checkPermissionLinkINV' target='_blank'>" +
								value +
								"</a>, ";
						}
					} else {
						if (
							window.location.pathname
								.substring(0, window.location.pathname.lastIndexOf("/"))
								.includes("barge")
						) {
							LinkID +=
								"<a href='../../../sales/standard/sales-invoice-barge/update/id=" +
								value2 +
								"' className='checkPermissionLinkINV' target='_blank'>" +
								value +
								"</a>, ";
						} else {
							LinkID +=
								"<a href='../../../sales/container/sales-invoice/update/id=" +
								value2 +
								"' className='checkPermissionLinkINV' target='_blank'>" +
								value +
								"</a>, ";
						}
					}
				}
			});
		});
		LinkID = LinkID.replace(/,\s*$/, "");
		return LinkID;
		//}
	}
};

export const haulierFommatter = (value, row, index) => {
	if (row.Status == "Reserved" || row.Status == "Discharged") {
		return "<a href='javascript:void(0)' data-toggle='modal' data-target='#HaulierGateOutModal'><i className='fa fa-truck'></i></a> ";
	} else {
		return "<a href='javascript:void(0)' data-toggle='modal' disabled='true'><i className='fa fa-truck' style='color: gray;'`></i></a> ";
	}
};

export const haulierGateOutFommatter = (value, row, index) => {
	return "<a href='javascript:void(0)' data-toggle='modal' data-target='#HaulierGateOutModal'><i className='fa fa-truck'></i></a> ";
};

export const ruleSetRuleFommatter = (value, row, index) => {
	return "<a href='javascript:void(0)' data-toggle='modal' data-target='#RuleSetRuleModal'><i className='fa fa-cogs'></i></a> ";
};

export const accessControlFommatter = (value, row, index) => {
	return "<a href='javascript:void(0)' data-toggle='modal' data-target='#AccessControlModal'><i className='fa fa-cogs'></i></a> ";
};

export const voyageDelayFormatter = (value, row, index) => {
	var actionButtons = "";
	if (row.VoyageUpdatedAt !== null && row.VoyageCheckAt == null) {
		actionButtons +=
			'<a href="./update/id=' +
			row.id +
			'&D=1"  "title="Voyge Delay"><i className="fa fa-ship" style="color:orange"></i></a> ';
	}

	return [actionButtons].join("");
};

export const INVFormatterDocNum = (value, row, index) => {
	if (row.SalesInvoiceUUID == null) {
		return null;
	} else {
		if (window.location.pathname.includes("third-party")) {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../standard/sales-invoice-barge/update/id=" +
					row.SalesInvoiceUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../container/sales-invoice/update/id=" +
					row.SalesInvoiceUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../sales-invoice-barge/update/id=" +
					row.SalesInvoiceUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			} else if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("g-p-export")
			) {
				if (row.Barge == "1") {
					return (
						"<a href='../../sales/standard/sales-invoice-barge/update/id=" +
						row.SalesInvoiceUUID +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				} else {
					return (
						"<a href='../../sales/container/sales-invoice/update/id=" +
						row.SalesInvoiceUUID +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				}
			} else {
				return (
					"<a href='../sales-invoice/update/id=" +
					row.SalesInvoiceUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}
	}
};

export const INVFormatterDocNumSelf = (value, row, index) => {
	if (row.SalesInvoiceUUID == null) {
		return null;
	} else {
		if (window.location.pathname.includes("third-party")) {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../standard/sales-invoice-barge/update/id=" +
					row.SalesInvoiceUUID +
					"&thirdparty=1' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../container/sales-invoice/update/id=" +
					row.SalesInvoiceUUID +
					"&thirdparty=1' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../sales-invoice-barge/update/id=" +
					row.SalesInvoiceUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			} else if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("g-p-export")
			) {
				if (row.Barge == "1") {
					return (
						"<a href='../../sales/standard/sales-invoice-barge/update/id=" +
						row.SalesInvoiceUUID +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				} else {
					return (
						"<a href='../../sales/container/sales-invoice/update/id=" +
						row.SalesInvoiceUUID +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				}
			} else {
				return (
					"<a href='../sales-invoice/update/id=" +
					row.SalesInvoiceUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}
	}
};

export const CNFormatterDocNum = (value, row, index) => {
	if (row.SalesCreditNoteUUID == null) {
		return null;
	} else {
		if (row.IsBarge == "1") {
			return (
				"<a href='../credit-note-barge/update/id=" +
				row.SalesCreditNoteUUID +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		} else {
			return (
				"<a href='../credit-note/update/id=" +
				row.SalesCreditNoteUUID +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		}
	}
};

export const CNFormatterDocNum2 = (value, row, index) => {
	if (row.SalesCreditNoteUUID == null) {
		return null;
	} else {
		if (
			window.location.pathname
				.substring(0, window.location.pathname.lastIndexOf("/"))
				.includes("barge")
		) {
			return (
				"<a href='../credit-note-barge/update/id=" +
				row.SalesCreditNoteUUID +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		} else if (
			window.location.pathname
				.substring(0, window.location.pathname.lastIndexOf("/"))
				.includes("g-p-export")
		) {
			if (row.Barge == "1") {
				return (
					"<a href='../../sales/standard/credit-note-barge/update/id=" +
					row.SalesCreditNoteUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../sales/container/credit-note/update/id=" +
					row.SalesCreditNoteUUID +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			return (
				"<a href='../credit-note/update/id=" +
				row.SalesCreditNoteUUID +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		}
	}
};

export const CROFormatterDocNum = (value, row, index) => {
	if (row.ContainerReleaseOrderUUID == null) {
		return null;
	} else {
		return (
			"<a href='../container-release-order/update/id=" +
			row.ContainerReleaseOrderUUID +
			"' target='_blank'>" +
			value +
			"</a>"
		);
	}
};

export const CROQTFormatterDocNum = (value, row, index) => {
	if (value == null) {
		return null;
	} else {
		var id = row.Quotation;

		if (window.location.pathname.includes("third-party")) {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../../sales/standard/quotation-barge/update/id=" +
					id +
					"' className='checkPermissionLinkQT' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../../sales/container/quotation/update/id=" +
					id +
					"' className='checkPermissionLinkQT' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../sales/standard/quotation-barge/update/id=" +
					id +
					"' className='checkPermissionLinkQT' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../sales/container/quotation/update/id=" +
					id +
					"' className='checkPermissionLinkQT' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}
	}
};

export const CROBRFormatterDocNum = (value, row, index) => {
	if (value == null) {
		return null;
	} else {
		var id = row.BookingReservation;
		return (
			"<a href='../../../sales/container/booking-reservation/update?id=" +
			id +
			"' className='checkPermissionLinkBR' 'target='_blank'>" +
			value +
			"</a>"
		);
	}
};

export const DBFormatterDocNum = (value, row, index) => {
	if (row.SalesDebitNoteUUID == null) {
		return null;
	} else {
		if (row.IsBarge == "1") {
			return (
				"<a href='../debit-note-barge/update/id=" +
				row.SalesDebitNoteUUID +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		} else {
			return (
				"<a href='../debit-note/update/id=" +
				row.SalesDebitNoteUUID +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		}
	}
};

export const DBFormatterDocNum2 = (value, row, index) => {
	if (row.SalesDebitNoteUUID == null) {
		return null;
	} else {
		var id = row.SalesDebitNoteUUID;
		// if (CheckThirdParty) {
		//   if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
		//     return "<a href='../debit-note-barge/update/id=" + id + "&third-party=1'' target='_blank'>" + value + "</a>";
		//   }else{
		//     return "<a href='../debit-note/update/id=" + id + "&third-party=1'' target='_blank'>" + value + "</a>";
		//   }
		// }
		// else {
		if (
			window.location.pathname
				.substring(0, window.location.pathname.lastIndexOf("/"))
				.includes("barge")
		) {
			return (
				"<a href='../debit-note-barge/update/id=" +
				id +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		} else {
			return (
				"<a href='../debit-note/update/id=" +
				id +
				"' target='_blank'>" +
				value +
				"</a>"
			);
		}
		//}
	}
};

export const DBFormatterDocNumSelf = (value, row, index) => {
	if (row.SalesDebitNoteUUID == null) {
		return null;
	} else {
		var id = row.SalesDebitNoteUUID;
		if (window.location.pathname.includes("third-party")) {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../standard/debit-note-barge/update/id=" +
					id +
					"&thirdparty=1' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../container/debit-note/update/id=" +
					id +
					"&thirdparty=1' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../debit-note-barge/update/id=" +
					id +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			} else if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("g-p-export")
			) {
				if (row.Barge == "1") {
					return (
						"<a href='../../sales/standard/debit-note-barge/update/id=" +
						id +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				} else {
					return (
						"<a href='../../sales/container/debit-note/update/id=" +
						id +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				}
			} else {
				return (
					"<a href='../debit-note/update/id=" +
					id +
					"' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}

		//}
	}
};

export const BLDocFormatterDocNum = (value, row, index) => {
	if (row.BillOfLadingDocNum == null) {
		return null;
	} else {
		var id = row.BillOfLadingUUID;
		if (window.location.pathname.includes("third-party")) {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../../operation/standard/bill-of-lading-barge/update/id=" +
					id +
					"' class = 'checkPermissionLinkBL' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../../operation/container/bill-of-lading/update/id=" +
					id +
					"' class = 'checkPermissionLinkBL' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../operation/standard/bill-of-lading-barge/update/id=" +
					id +
					"' class = 'checkPermissionLinkBL' target='_blank'>" +
					value +
					"</a>"
				);
			} else if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("g-p-export")
			) {
				if (row.Barge == "1") {
					return (
						"<a href='../../operation/standard/bill-of-lading-barge/update/id=" +
						id +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				} else {
					return (
						"<a href='../../operation/container/bill-of-lading/update/id=" +
						id +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				}
			} else {
				return (
					"<a href='../../../operation/container/bill-of-lading/update/id=" +
					id +
					"' class = 'checkPermissionLinkBL' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}
	}
};

export const DeliveryOrderFormatterDocNum = (value, row, index) => {
	if (value == null) {
		return null;
	} else {
		if (window.location.pathname.includes("third-party")) {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../../operation/standard/delivery-order-barge/update/id=" +
					row.DeliveryOrderUUID +
					"' class = 'checkPermissionLinkDO' target='_blank'>" +
					value +
					"</a>"
				);
			} else {
				return (
					"<a href='../../../../operation/container/delivery-order/update/id=" +
					row.DeliveryOrderUUID +
					"' class = 'checkPermissionLinkDO' target='_blank'>" +
					value +
					"</a>"
				);
			}
		} else {
			if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("barge")
			) {
				return (
					"<a href='../../../operation/container/delivery-order-barge/update/id=" +
					row.DeliveryOrderUUID +
					"'  className='checkPermissionLinkDO' target='_blank'>" +
					value +
					"</a>"
				);
			} else if (
				window.location.pathname
					.substring(0, window.location.pathname.lastIndexOf("/"))
					.includes("g-p-export")
			) {
				if (row.Barge == "1") {
					return (
						"<a href='../../operation/standard/delivery-order-barge/update/id=" +
						row.DeliveryOrderUUID +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				} else {
					return (
						"<a href='../../operation/container/delivery-order/update/id=" +
						row.DeliveryOrderUUID +
						"' target='_blank'>" +
						value +
						"</a>"
					);
				}
			} else {
				return (
					"<a href='../../../operation/container/delivery-order/update/id=" +
					row.DeliveryOrderUUID +
					"'  className='checkPermissionLinkDO' target='_blank'>" +
					value +
					"</a>"
				);
			}
		}
	}
};

export const ORFormatterDocNum = (value, row, index) => {
  if (row.CustomerPaymentUUID == null) {
    return null;
  } else {
    return "<a href='../customer-payment/update/id=" + row.CustomerPaymentUUID + "' target='_blank'>" + value + "</a>";
  }
}

export const DeliveryOrderFormatterDocNum2 = (value, row, index) => {
  if (row.DeliveryOrderDocNum == null) {
    return null;
  }
  else {
    var id = row.DeliveryOrderUUID
    if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
      return "<a href='../delivery-order-barge/update/id=" + id + "'target='_blank'>" + row.DeliveryOrderDocNum + "</a>"
    }
    else {
      return "<a href='../delivery-order/update/id=" + id + "'target='_blank'>" + row.DeliveryOrderDocNum + "</a>"

    }
  }
}


export const salesinvoiceFormatterDocNum2 = (value, row, index) => {

  if (row.SalesInvoiceDocNums == null) {
    return null;
  } else {
    var LinkID = "";
    var arrayDocNum = (row.SalesInvoiceDocNums).split(",")
    var arrayUUID = (row.SalesInvoiceUUIDs).split(",")

    if (arrayDocNum.length == 1) {
      if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
        LinkID += "<a href='../sales-invoice-barge/update/id=" + row.SalesInvoiceUUIDs + "' class = 'checkPermissionLinkINV' target='_blank'>" + row.SalesInvoiceDocNums + "</a>, ";
      } else {
        LinkID += "<a href='../sales-invoice/update/id=" + row.SalesInvoiceUUIDs + "' class = 'checkPermissionLinkINV' target='_blank'>" + row.SalesInvoiceDocNums + "</a>, ";
      }
    } else {
      $.each(arrayDocNum, function (key, value) {
        $.each(arrayUUID, function (key2, value2) {
          if (key == key2) {
            if (((window.location.pathname).substring(0, (window.location.pathname).lastIndexOf('/')).includes("barge"))) {
              LinkID += "<a href='../sales-invoice-barge/update/id=" + value2 + "' class = 'checkPermissionLinkINV' target='_blank'>" + value + "</a>, ";
            }
            else {
              LinkID += "<a href='../sales-invoice/update/id=" + value2 + "' class = 'checkPermissionLinkINV' target='_blank'>" + value + "</a>, ";

            }
          }
        })
      });
    }
    LinkID = LinkID.replace(/,\s*$/, "");
    return LinkID;

  }
}

