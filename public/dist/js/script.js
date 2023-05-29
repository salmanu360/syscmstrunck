/** Main app logic
 */
var app = (function () {
	var result=[];
	var lkkk;
	var sid = null;
	var self = this;
	var req = null;
	/** @private */
	var map = null,
		session = null,
		unitsData = {};


	
	function msg(text) {
		console.log(text);
	}

	function getUnitProperties(unitId, flags) {
		var params = {"params" : {"id":unitId,"flags":flags}};

		session.execute('core/search_item&sid=' + sid , params, function (code, result) {
			console.log(code);
		});
	}

	function getMileageAndTripsMovement(layerName, itemId, timeFrom, timeTo) {
		var params = {"sid": sid, "params":{"layerName":layerName,"itemId":itemId,"timeFrom":timeFrom,"timeTo":timeTo,"tripDetector":1,"style":"default","flags":1,"trackWidth":5,"trackColor":"trip","annotations":1,"points":1,"pointColor":"cc0000ff","arrows":1}};

		session.execute('render/create_messages_layer&sid=' + sid , params, function (code, result) {
			console.log(code);
		});
	}

	function getUnitsGroup() {
		var params = {"params" : {"spec":[{"type":"type","data":"avl_unit_group","flags":3,"mode":0}]}};

		session.execute('core/update_data_flags&sid=' + sid , params, function (code, result) {
			
		});

	
	}
	
	function getUnitsGroup2() {
		var popll=[];
		var params = {"params" : {"spec":[{"type":"type","data":"avl_unit","flags":3,"mode":0}]}};

		const promise = new Promise((resolve, reject) => {
			// Make a network request
			session.execute('core/update_data_flags&sid=' + sid , params, function (code, result) {
				console.log(code)
				
				popll.push(code)
				
	
			});
		})




		

		
		return popll
	}

	function getMessagesRawDataOrSensorValues() {
		var params = {"params" : {"layerName":"messages","itemId":25595385,"timeFrom":1662393600,"timeTo":1662479999,"tripDetector":0,"flags":0,"trackWidth":4,"trackColor":"cc0000ff","annotations":0,"points":1,"pointColor":"cc0000ff","arrows":1}};

		session.execute('render/create_messages_layer&sid=' + sid , params, function (code, result) {
			// console.log(result);

			var params = {"params": {"params":[{"svc":"render/get_messages","params":{"layerName":"messages","indexFrom":0,"indexTo":49,"unitId":25595385}}],"flags":0}, "sid":sid};

			session.execute('core/batch&sid=' + sid , params, function (code, result) {
				console.log(result);
			});
		});
	}

	function messagesRegisteredEvents() {
		var params = {"params":{"itemId":25595385,"timeFrom":1662393600,"timeTo":1662479999,"flags":1536,"flagsMask":65280,"loadCount":50}};

		session.execute('messages/load_interval&sid=' + sid , params, function (code, result) {
			console.log(result);
		});
	}

	//

	function getReportTemplatePlaybackM() {

		var params = {"params": {"reportResourceId":24140051,"reportTemplateId":5,"reportTemplate":null,"reportObjectId":"25510940","reportObjectSecId":0,"interval":{"from":1662520341,"to":1662606741,"flags":0}}};
		session.execute('report/exec_report&sid=' + sid , params, async function (code, result) {

			var params = {"params": {"tableIndex":0,"config":{"type":"range","data":{"from":0,"to":22,"level":0,"unitInfo":1}}}};
			session.execute('report/select_result_rows&sid=' + sid , params, function (code, result) {
				console.log(result);
			});

		});

	}

	function getReportTemplatePlaybackM() {

		var params = {"params": {"reportResourceId":18596516,"reportTemplateId":1,"reportTemplate":null,"reportObjectId":25510940,"reportObjectSecId":0,"interval":{"flags":16777216,"from":1662566400,"to":1662652799}}};
		session.execute('report/exec_report&sid=' + sid , params, async function (code, result) {

			var params = {"params": {"tableIndex":0,"config":{"type":"range","data":{"from":0,"to":22,"level":0,"unitInfo":1}}}};
			session.execute('report/select_result_rows&sid=' + sid , params, function (code, result) {
				console.log(result);
			});
			
		});

	}

	function testBatch() {
		var params = {"params" : {"layerName":"messages","itemId":25595385,"timeFrom":1662393600,"timeTo":1662479999,"tripDetector":0,"flags":0,"trackWidth":4,"trackColor":"cc0000ff","annotations":0,"points":1,"pointColor":"cc0000ff","arrows":1}};

		session.execute('render/create_messages_layer&sid=' + sid , params, function (code, result) {
			// console.log(result);

			var params = {"params": {"params":[{"svc":"render/get_messages","params":{"layerName":"messages","indexFrom":0,"indexTo":49,"unitId":25595385}}],"flags":0}, "sid":sid};

			session.execute('core/batch&sid=' + sid , params, function (code, result) {
				console.log(result);
			});
		});


	}

	function testMessages() {
		var params = {"params":{"tableIndex":-1,"config":{"type":"range","data":{"from":0,"to":6,"level":0,"unitInfo":1}}}};

		session.execute('report/select_result_rows&sid=' + sid , params, function (code, result) {
			console.log(result);
		});
	}

	// the order is important - report/exec_report must finish their execution then report/apply_report_result will be executed successfully
	function getReportTemplateBasicUnit() {			
		var params = {"params": {"reportResourceId":18596516,"reportTemplateId":3,"reportTemplate":null,"reportObjectId":25510940,"reportObjectSecId":0,"interval":{"flags":16777216,"from":1662393600,"to":1662479999},"remoteExec":1}};
		session.execute('report/exec_report&sid=' + sid , params, function (code, result) {

			var params = {"params": {"detalization":3}};
			session.execute('events/check_updates&sid=' + sid , params, function (code, result) {

				var params = {"params": {}};
				session.execute('report/apply_report_result&sid=' + sid , params, function (code, result) {
					console.log(result);
					
				});
			});

		});
	}

	function getReportTemplateAlertBasicUnit() {			
		var params = {"params": {"reportResourceId":18596516,"reportTemplateId":5,"reportTemplate":null,"reportObjectId":25510940,"reportObjectSecId":0,"interval":{"flags":16777216,"from":1662393600,"to":1662479999},"remoteExec":1}};
		session.execute('report/exec_report&sid=' + sid , params, async function (code, result) {

			var params = {"params": {"tableIndex":0,"config":{"type":"range","data":{"from":0,"to":49,"level":0,"unitInfo":1}}}};
			session.execute('report/apply_report_result&sid=' + sid , params, function (code, result) {

				var params = {"params": {"tableIndex":0,"config":{"type":"range","data":{"from":0,"to":22,"level":0,"unitInfo":1}}}};

				session.execute('report/select_result_rows&sid=' + sid , params, function (code, result) {
					console.log(result);
				});
			});
		});
	}


	self.login = function (token, url,para) {
		console.log(para)
		url = url || 'https://hst-api.wialon.com';
		token = "17990eea4407b29e2b5b7452cb7e532d03FDDDABC9441117890037000FD2B6BB5B3A1637";

		// init session
		session = new W.Session(url, {eventsTimeout: 3});
		var tokenLogin = {"token":token};

		// login wialon
		session.execute('token/login', tokenLogin, function (data) { // login callback
			// if error code - print error message
			if (data.error) {
				msg('Login error');
			} else {
				msg('Logged successfully');
				//document.getElementById('overlay').style.display = 'none';
				sid = data.eid;

				// done and useful
		
				if(para=="getUnit"){
					getUnitsGroup2();
					var pop=getUnitsGroup2()
					console.log(pop)
				}
				else{
					getReportTemplateBasicUnit()
				}
				// getUnitProperties(25595407, 4294967295); // in units > spana (unit properties)
				// getMileageAndTripsMovement("route_unit_3", 25055563, 1662048000, 1662134399); // in tracks > show tracks
				//getUnitsGroup2(); // in units > groups
				// getMessagesRawDataOrSensorValues(); // in show parameters as
				// messagesRegisteredEvents(); // in message type
				// getReportTemplateBasicUnit();
				// getReportTemplatePlaybackM();
				// getReportTemplateAlertBasicUnit();

				// done and useful
				
				// getReportTemplatePlaybackG(); // this should be the same as getReportTemplatePlaybackM()
			}
		});
	};


	self.abin = function (token, url,para) {
		console.log('sdsdsdsdvvvv')
		var pok=[];
		url = url || 'https://hst-api.wialon.com';
		token = "17990eea4407b29e2b5b7452cb7e532d03FDDDABC9441117890037000FD2B6BB5B3A1637";

		// init session
		session = new W.Session(url, {eventsTimeout: 3});
		var tokenLogin = {"token":token};

		// login wialon
		session.execute('token/login', tokenLogin, function (data) { // login callback
			// if error code - print error message
			if (data.error) {
				msg('Login error');
			} else {
				msg('Logged successfully');
				//document.getElementById('overlay').style.display = 'none';
				sid = data.eid;

				// done and useful
				var oo=getUnitsGroup2();
				console.log(oo["0"])
				pok.push(oo)
					// getUnitsGroup2();
					// var pop=getUnitsGroup2()
					// console.log(pop)
				
					
				
			
			}
		});
	console.log(pok)
		return   pok
	};


	/** App initializition
	 *  Executes after DOM loaded
	 */
	self.initialize = function (para) {
		
	
		var url='https://hst-api.wialon.com'
		var token ="17990eea4407b29e2b5b7452cb7e532d03FDDDABC9441117890037000FD2B6BB5B3A1637"
		self.login(token,url,para);
		
		// bind login function to click
		

	};

	return self;
})();
