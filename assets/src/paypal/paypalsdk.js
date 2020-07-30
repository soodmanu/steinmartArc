var _ = require('underscore');
var request = require('request');
var xml2js = require('xml2js');

function getCreateTime() {
	var createTime = new Date();
	createTime.setHours(-12);
	return createTime.toISOString();
}

function startCheckout(data) {
console.log("taxTotoal"+data.TaxTotal);
console.log("OrderId"+data.OrderId);
console.log("ReturnURL"+data.ReturnURL);
console.log("Line1"+data.Line1);
console.log("CountryCode"+data.CountryCode);
console.log("LineItemsTotal"+data.LineItemsTotal);
console.log("ShippingTotal"+data.ShippingTotal);
 
	var PayPalSetExpressCheckout = {
    'PayPalSetExpressCheckoutRequest': {
      $: {
        'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',
      
     },
	  'OrderId':data.OrderId, 	
	  'ReturnUrl':data.ReturnURL,
	  'CancelUrl':data.CancelURL,
	  'LocaleCode':"en_US",
	  "Amount": {
			  "_": data.Total,
			 "$": {
                "currencyCode": "USD"
             }
		},
	  "ShippingAddress":{
			"Line1":data.Line1,
			"City":data.City,
			"MainDivision":data.State,
			"CountryCode":data.CountryCode,
			"PostalCode":data.PostalCode
	  },
	  
	  "LineItems":{
		  "LineItemsTotal": {
			 "_": data.LineItemsTotal,
			 "$": {
                "currencyCode": "USD"
             }
            
            
		  },
		  "ShippingTotal": {
			  "_": data.ShippingTotal,
			 "$": {
                "currencyCode": "USD"
             }
            
            
		  },
		  "TaxTotal": {
			  "_": data.TaxTotal,
			 "$": {
                "currencyCode": "USD"
             }
            
            
		  }
		  
		}
	  }
	};
	   var builder = new xml2js.Builder();
	   var xmlDoc = builder.buildObject(PayPalSetExpressCheckout);
	   console.log("xmldoc"+xmlDoc);
	   return xmlDoc;
	
	
}

function radialGetExpressCheckout(type, data) {
	var operation = (type=='confirmPayment') ? 'Finalize': 'UserDetail';
	
	var payPalGetExpressCheckoutRequest = {
    'PayPalGetExpressCheckoutRequest': {
      $: {
        'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',
      
       },
	   'OrderId':data.OrderId, 
	   'Token':data.Token,
	   'CurrencyCode':"USD"
		  
	   }
    
  };
	var radialGetExpressCheckout = new xml2js.Builder();
	   var expressCheckoutXml = radialGetExpressCheckout.buildObject(payPalGetExpressCheckoutRequest);
	   //console.log("xmldoc"+expressCheckoutXml);
	   return expressCheckoutXml;
	
}

function radialCompleteExpressCheckout(type, data) {
	var operation = (type=='confirmPayment') ? 'Finalize': 'UserDetail';
	
	var payPalDoAuthorizationRequest = {
    'PayPalDoAuthorizationRequest': {
      $: {
		'requestId':data.OrderId,
        'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',
		
		},
		
	    'OrderId':data.OrderId,
		
		"Amount": {
			  "_": data.Amount,
			 "$": {
                "currencyCode": "USD"
             }
		}
    }
  };
	var radialCompleteExpressCheckout = new xml2js.Builder();
	   var completeCheckoutXml = radialCompleteExpressCheckout.buildObject(payPalDoAuthorizationRequest);
	   //console.log("xmldoc"+expressCheckoutXml);
	   return completeCheckoutXml;
	
}


function doPaypalCheckoutRequestRequest(type, data) {
	console.log("doPaypalCheckoutRequestRequest"+data.OrderId);
	console.log("doPaypalCheckoutRequestRequest"+data.paypalOrder.BuyerDetail.First[0]);
	console.log("doPaypalCheckoutRequestRequest"+data.Token);
	console.log("doPaypalCheckoutRequestRequest"+data.paypalOrder.PayerId);
	console.log("doPaypalCheckoutRequestRequest"+data.paypalOrder.ShipTo.City);
	console.log("doPaypalCheckoutRequestRequest"+data.Total);
	console.log("doPaypalCheckoutRequestRequest"+data.LineItemsTotal);
	console.log("doPaypalCheckoutRequestRequest"+data.ShippingTotal);
	console.log("doPaypalCheckoutRequestRequest"+data.TaxTotal);
	
	var doPayPalDoExpressCheckoutRequest = {
    'PayPalDoExpressCheckoutRequest': {
      $: {
		'requestId':data.OrderId,
        'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',
		
		},
	    'OrderId':data.OrderId,
		'Token': data.Token,
		'PayerId':data.paypalOrder.PayerId,
		"Amount": {
			  "_": data.Total,
			 "$": {
                "currencyCode": "USD"
             }
		},
		"ShipToName":data.paypalOrder.BuyerDetail.First[0]+" "+data.paypalOrder.BuyerDetail.Last[0],
		"ShippingAddress":{
			"Line1":data.paypalOrder.ShipTo.Line1,
			"City":data.paypalOrder.ShipTo.City,
			"MainDivision":data.paypalOrder.ShipTo.State,
			"CountryCode":data.paypalOrder.ShipTo.CountryCode,
			"PostalCode":data.paypalOrder.ShipTo.PostalCode
		  },
	  
	  "LineItems":{
		  "LineItemsTotal": {
			 "_": data.LineItemsTotal,
			 "$": {
                "currencyCode": "USD"
             }
            
            
		  },
		  "ShippingTotal": {
			  "_": data.ShippingTotal,
			 "$": {
                "currencyCode": "USD"
             }
            
            
		  },
		  "TaxTotal": {
			  "_": data.TaxTotal,
			 "$": {
                "currencyCode": "USD"
             }
            
            
		  }
		  
		  
            
            
		  }
		  
	   }
    };
  
   var payPalDoExpressCheckoutRequest = new xml2js.Builder();
   var doExpressCheckoutRequestXml = payPalDoExpressCheckoutRequest.buildObject(doPayPalDoExpressCheckoutRequest);
   console.log(doExpressCheckoutRequestXml);
   return doExpressCheckoutRequestXml;
  
	
}


function userDetail(data) {
	
	return radialGetExpressCheckout('UserDetail', data);
}

function doPaypalCheckoutRequest(data){
	return doPaypalCheckoutRequestRequest('UserDetail', data);
}

function completePayment(data) {
	return radialCompleteExpressCheckout('confirmPayment', data);
}

function Paypal(paypalRadialUrl, paypalKey, sandbox) {
	this.paypalRadialUrl = paypalRadialUrl;
	this.paypalKey = paypalKey;
	this.sandbox = sandbox || false;
	this.payOptions = {};
	this.products = [];
	this.url = 'https://' + (sandbox ? 'api-3t.sandbox.paypal.com' : 'api-3t.paypal.com') + '/nvp';
	this.soapUrl = 'https://fcs' + (sandbox ? '-uat01.uat' : '') + '.gsipartners.com/eb2c/CartSupportServices/paypalAuth.ws';
	this.redirect = 'https://' + (sandbox ? 'www.sandbox.paypal.com/cgi-bin/webscr' : 'www.paypal.com/cgi-bin/webscr');
}

Paypal.prototype.radialRequest = function (data, methodName) {
	var self = this;
	var endpointurl;
	console.log(data.RequestID + ' Request ID Sent for ' + methodName + ' Step'+"hostname"+self.paypalRadialUrl+"===="+self.payPalUrl);
	return new Promise(function(resolve, reject) {
		if (methodName) {
			var bodyContent = '';
			if (methodName == 'startCheckout') {
				bodyContent = startCheckout(data);
				endpointurl = 'https://uat01-epapi-na.gsipartners.com/v1.0/stores/SMTUS/payments/paypal/setExpress.xml';
			}
			else if (methodName == 'userDetail') {
				endpointurl = "https://uat01-epapi-na.gsipartners.com/v1.0/stores/SMTUS/payments/paypal/getExpress.xml";
				bodyContent = userDetail(data);
			}else if (methodName == 'doExpressCheckout') {
				endpointurl = "https://uat01-epapi-na.gsipartners.com/v1.0/stores/SMTUS/payments/paypal/doExpress.xml";
				bodyContent = doPaypalCheckoutRequest(data);
			}
			else if (methodName == 'finalizePayment') {
				endpointurl = "https://uat01-epapi-na.gsipartners.com/v1.0/stores/SMTUS/payments/paypal/doAuth.xml";
				bodyContent = completePayment(data);
			}
			console.log('Paypal Request Sent', bodyContent);
			var options = {
				method: 'POST',
				url: endpointurl,
				headers: {
					'apiKey':paypalKey,
					'Content-Type':'application/xml',
					'Content-Length':bodyContent.length,
		
				},
				body: bodyContent
			};
			request(options, function(error, response, body) {
				if (error) {
					reject({
						'STATUS': 'ERROR',
						'message': error
					});
				}
				else {
					console.log('Paypal Request Received', body);
					var radialoutput = '';
					
					var output = {
						token:"",
						ResponseCode:"",
						responseText:"",
						RequestID:"",
						ShipTo:{
							Line1:"",
							Line2:"",
							City: "",
							State: "",
							PostalCode:"",
							CountryCode: ""
						},
						InvoiceId:"",
						PayerId:"",
						PayerStatus:"",
						BuyerEmail:"",
						BuyerPhoneNumber:"",
						statusText:"",
						transactionId:"",
						PayerCountry:"",
						AddressStatus:"",
						BuyerDetail:{
							First:"",
							Last:""
						}
						
						
					};
					console.log("data.paypalOrder"+data.paypalOrder);
					if(data.paypalOrder !== undefined && methodName == 'doExpressCheckout'){
						output.ShipTo = data.paypalOrder.ShipTo;
						output.BuyerDetail = data.paypalOrder.BuyerDetail;
						output.PayerId = data.paypalOrder.PayerId;
						output.token = data.Token;
						output.BuyerEmail = data.paypalOrder.BuyerEmail;
						output.BuyerPhoneNumber =data.paypalOrder.BuyerPhoneNumber;
					}
					
					xml2js.parseString(body, function (err, result) {
						radialoutput = result;
					});
					//console.log(JSON.stringify(radialoutput));
					//output = output['soapenv:Envelope']['soapenv:Body'][0];
					if (radialoutput.PayPalSetExpressCheckoutReply) {
						radialoutput = radialoutput.PayPalSetExpressCheckoutReply;
						console.log("insidePayPalSetExpressCheckoutReply"+JSON.stringify(radialoutput));
					}
					else if (radialoutput.PayPalGetExpressCheckoutReply) {
						radialoutput = radialoutput.PayPalGetExpressCheckoutReply;
						console.log("inside PayPalGetExpressCheckoutReply"+JSON.stringify(radialoutput));
					}
					else if (radialoutput.PayPalDoExpressCheckoutReply) {
						radialoutput = radialoutput.PayPalDoExpressCheckoutReply;
					}else if (radialoutput.PayPalDoAuthorizationReply) {
						radialoutput = radialoutput.PayPalDoAuthorizationReply;
					}
					try {
						if (radialoutput.RedirectURL) {
							output.redirectUrl = radialoutput.RedirectURL[0];
						}
						if (radialoutput.OrderId) {
							output.RequestID = radialoutput.OrderId[0];
						}
						if (radialoutput.Token) {
							output.token = radialoutput.Token[0];
							
						}
						if (radialoutput.ResponseCode) {
							output.ResponseCode = radialoutput.ResponseCode[0];
							output.responseText = radialoutput.ResponseCode[0];
						}
						if (radialoutput.PayerId) {
							output.PayerId = radialoutput.PayerId[0];
						}
						
						if (radialoutput.TransactionID) {
							
							if (methodName == 'doExpressCheckout') {
								output.transactionId = radialoutput.TransactionID[0];
							}
						}
						if (radialoutput.AddressStatus) {
							output.AddressStatus = radialoutput.AddressStatus[0];
						}
						
						if (radialoutput.PayerStatus) {
							output.PayerStatus = radialoutput.PayerStatus[0];
							console.log("inside PayerStatus"+output.PayerStatus);
						}
						
						if (radialoutput.PayerCountry) {
							output.PayerCountry = radialoutput.PayerCountry[0];
							console.log("inside PayerCountry"+output.PayerCountry);
						}
						if (radialoutput.PayerName) {
							output.BuyerDetail = {
								First: radialoutput.PayerName[0].FirstName,
								Last: (radialoutput.PayerName[0].LastName) ? radialoutput.PayerName[0].LastName : 'N/A'
							};
							console.log("inside BuyerDetail"+output.BuyerDetail.First);
						}
						if (radialoutput.PayerEmail) {
							output.BuyerEmail = radialoutput.PayerEmail[0];
							console.log("inside PayerEmail");
						}
						if (radialoutput.PayerPhone) {
							output.BuyerPhoneNumber = radialoutput.PayerPhone[0].replace(/-/g,'');
							console.log("inside PayerPhone");
						}
						if (radialoutput.ShippingAddress) {
							console.log("inside ShippingAddress before"+JSON.stringify(output));
							output.ShipTo.Line1 =radialoutput.ShippingAddress[0].Line1[0];
							output.ShipTo.City = radialoutput.ShippingAddress[0].City[0];
							output.ShipTo.State= radialoutput.ShippingAddress[0].MainDivision[0];
							output.ShipTo.PostalCode = radialoutput.ShippingAddress[0].PostalCode[0];
							output.ShipTo.CountryCode = radialoutput.ShippingAddress[0].CountryCode[0];
							console.log("inside ShippingAddress"+JSON.stringify(output));
						}
						if (radialoutput.SystemError) {
							output.status = 'Failed';
							output.statusText = radialoutput.SystemError[0].ErrorCode[0] + '-' + radialoutput.SystemError[0].ErrorMessage[0];
							output.errorCode = 403;
						}
					}
					catch(e) {
						console.log("before sending back error"+JSON.stringify(output));
					}
					if (radialoutput.status === 'Failed') {
						reject(output);
					}
					else {
						console.log("before sending back"+JSON.stringify(output));
						resolve(output);
					}
				}
			});
		}
		else {
			reject({
				'STATUS': 'ERROR',
				'message': 'Method missing'
			});
		}
	});
};

Paypal.prototype.params = function () {
	var result = {
		VERSION: '117.0',
	};
	return result;
};

function prepareNumber(num, doubleZero) {
	var str = num.toString().replace(',', '.');

	var index = str.indexOf('.');
	if (index > -1) {
		var len = str.substring(index + 1).length;
		if (len === 1) {
			str += '0';
		}

		if (len > 2) {
			str = str.substring(0, index + 3);
		}
	} else {
		if (doubleZero || true) {
			str += '.00';
		}
	}

	return str;
}

Paypal.prototype.getMerchantId = function () {
	var self = this;
	var params = self.params();
	params.METHOD = "GetPalDetails";
	return self.request(params);
};

Paypal.prototype.setOrderParams = function (order) {
	var self = this;
	var params = self.params();
	if (order.email) {
		params.EMAIL = order.email;
	}
	if (order.testAmount)
		params.PAYMENTREQUEST_0_AMT = order.testAmount;
	else {
		params.PAYMENTREQUEST_0_AMT = prepareNumber(order.amount);
		if (order.orderNumber)
			params.PAYMENTREQUEST_0_INVNUM = order.orderNumber;

		params.PAYMENTREQUEST_0_CURRENCYCODE = order.currencyCode;
		if (order.taxAmount)
			params.PAYMENTREQUEST_0_TAXAMT = prepareNumber(order.taxAmount);
		if (order.handlingAmount)
			params.PAYMENTREQUEST_0_HANDLINGAMT = prepareNumber(order.handlingAmount);
		if (order.shippingAmount)
			params.PAYMENTREQUEST_0_SHIPPINGAMT = prepareNumber(order.shippingAmount);

		if (order.shippingDiscount)
			params.PAYMENTREQUEST_n_SHIPDISCAMT = prepareNumber(order.shippingDiscount);

		if (order.items) {
			var itemSum = _.reduce(order.items, function (sum, item) {
				return parseFloat(sum) + parseFloat(item.amount * item.quantity);
			}, 0);
			params.PAYMENTREQUEST_0_ITEMAMT = prepareNumber(itemSum.toFixed(2));
			self.setProducts(order.items);
			params = _.extend(params, this.getItemsParams());
		}
	}

	if (order.maxAmount)
		params.MAXAMT = order.maxAmount;


	if (order.shippingAddress) {
		//params.ADDROVERRIDE = 1;
		params.PAYMENTREQUEST_0_SHIPTONAME = order.shippingAddress.firstName + " " + order.shippingAddress.lastName;
		params.PAYMENTREQUEST_0_SHIPTOSTREET = order.shippingAddress.address1;
		if (order.shippingAddress.address2)
			params.PAYMENTREQUEST_0_SHIPTOSTREET2 = order.shippingAddress.address2;
		params.PAYMENTREQUEST_0_SHIPTOCITY = order.shippingAddress.cityOrTown;
		params.PAYMENTREQUEST_0_SHIPTOSTATE = order.shippingAddress.stateOrProvince;
		params.PAYMENTREQUEST_0_SHIPTOZIP = order.shippingAddress.postalOrZipCode;
		params.PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE = order.shippingAddress.countryCode;
		params.PAYMENTREQUEST_0_SHIPTOPHONENUM = order.shippingAddress.phone;
	}

	params.amount = order.amount;

	return params;
};

function getpropertiesfromUrl(url) {
	var domain = url.substring(0, url.indexOf('.com') + 4);
	if (domain.indexOf('http:') != -1) {
		domain = domain.replace('http:', 'https:');
	}
	var qs = decodeURIComponent(url.substring(url.indexOf('?') + 1));
	var params = qs.split('&');
	var returnJSON = {};
	for (var i = 0; i < params.length; i++) {
		if (params[i].indexOf('|')) {
			var subparams = params[i].split('|');
			for (var j = 0; j < subparams.length; j++) {
				returnJSON[subparams[j].split('=')[0]] = subparams[j].split('=')[1];
			}
		}
		else {
			returnJSON[params[i].split('=')[0]] = params[i].split('=')[1];
		}
	}
	returnJSON.domain = domain;
	return returnJSON;
}

Paypal.prototype.getExpressCheckoutDetails = function (token, context, order) {
	var self = this;
	var params = getpropertiesfromUrl(context.request.href);
	var entityResource = require('mozu-node-sdk/clients/platform/entitylists/entity')(context);
	entityResource.context['user-claims'] = null;
	//Add User Details Method here
	var userDetailBody = {
		Version: "1.0",
		Iteration: '2',
		RequestID: '',
		CreateTime: getCreateTime(),
		OrderId: params.orderId || "",
		Tender: 'PY',
		Token: params.token,
		PayerID: params.PayerID,
		Amount: params.amount,
		Currency: 'USD'
	};
	console.log("userDetailBody"+JSON.stringify(userDetailBody));
	return entityResource.getEntity({
		'entityListFullName': 'paypalrequest@steinmart',
		'id': order.originalCartId
	}).then(function(resp){
		if (resp && resp.requestID) {
			userDetailBody.RequestID = resp.requestID;
		}
		var radialResponse = self.radialRequest(userDetailBody, 'userDetail');
		return radialResponse;
	}, function(){
		var radialResponse = self.radialRequest(userDetailBody, 'userDetail');
		return radialResponse;
	});
};

Paypal.prototype.payPalDoExpressCheckoutRequest = function (token, context, order,paypalorder) {
	var self = this;
	var params = getpropertiesfromUrl(context.request.href);
	var entityResource = require('mozu-node-sdk/clients/platform/entitylists/entity')(context);
	var itemsTotal = 0;
	if(order.handlingTotal > 0 ){
		itemsTotal = parseFloat(order.lineItemSubtotalWithOrderAdjustments + order.handlingTotal).toFixed(2);
	}else {
		itemsTotal = parseFloat(order.lineItemSubtotalWithOrderAdjustments).toFixed(2);
	}
	
	entityResource.context['user-claims'] = null;
	//Add User Details Method here
	var userDetailBody = {
		Version: "1.0",
		Iteration: '2',
		RequestID: '',
		CreateTime: getCreateTime(),
		OrderId: params.orderId || "",
		Tender: 'PY',
		Token: params.token,
		PayerID: params.PayerID,
		Amount: params.amount,
		Currency: 'USD',
		LineItemsTotal: itemsTotal,
		ShippingTotal: parseFloat(order.shippingTotal).toFixed(2),
		TaxTotal:order.taxTotal,
		Email:  order.email  || ' ',
		Total:order.total,
		paypalOrder:paypalorder
	};
	console.log("inside payPalDoExpressCheckoutRequest"+JSON.stringify(paypalorder));
	return entityResource.getEntity({
		'entityListFullName': 'paypalrequest@steinmart',
		'id': order.originalCartId
	}).then(function(resp){
		if (resp && resp.requestID) {
			userDetailBody.RequestID = resp.requestID;
		}
		var radialResponse = self.radialRequest(userDetailBody, 'doExpressCheckout');
		return radialResponse;
	}, function(){
		var radialResponse = self.radialRequest(userDetailBody, 'doExpressCheckout');
		return radialResponse;
	});
};


Paypal.prototype.setExpressCheckoutPayment = function (order, returnUrl, cancelUrl, others) {
	var self = this;
	var addr;
	if (order.shippingAddress) {
		addr = order.shippingAddress;
	}
	var itemsTotal = 0;
	var shippingTotal = 0;
	if(order.handlingAmount > 0 ){
		itemsTotal = parseFloat(order.lineItemsTotal + order.handlingAmount).toFixed(2);
	}else {
		itemsTotal = parseFloat(order.lineItemsTotal).toFixed(2);
	}
	

	
	console.log("itemsTotal"+ itemsTotal );
	var startExpressRequestBody = {
		OrderId: others.id || ' ',
		LineItemsTotal: itemsTotal,
		ShippingTotal: parseFloat(order.shippingAmount).toFixed(2),
		TaxTotal:parseFloat(order.taxTotal).toFixed(2),
		Email:  order.email  || ' ',
		Currency: 'USD',
		Total:order.orderTotal,
		Line1: (addr && addr.address) ? addr.address.address1 : (addr) ? addr.address1 : ' ',
		City: (addr && addr.address) ? addr.address.cityOrTown : (addr) ? addr.cityOrTown : ' ',
		State: (addr && addr.address) ? addr.address.stateOrProvince : (addr) ? addr.stateOrProvince : ' ',
		PostalCode: (addr && addr.address) ? addr.address.postalOrZipCode : (addr) ? addr.postalOrZipCode : ' ',
		CountryCode: (addr && addr.address) ? addr.address.countryCode : (addr) ? addr.countryCode : 'US',
		ReturnURL: returnUrl + '|amount=' + parseFloat(order.amount).toFixed(2) + '|orderId=' + order.orderNumber || '',
		CancelURL: cancelUrl + '?cancel=1'
	};
	return self.radialRequest(startExpressRequestBody, 'startCheckout');
};

Paypal.prototype.authorizePayment = function (orderDetails, config) {
	var self = this;
	var finalizeBody = {
		Version: "1.0",
		Iteration: '3',
		CreateTime: getCreateTime(),
		RequestID: orderDetails.requestID,
		OrderId: orderDetails.orderNumber || "",
		Tender: 'PY',
		Token: orderDetails.token,
		PayerID: orderDetails.payerId,
		Amount: orderDetails.amount,
		Currency: 'USD'
	};
	return self.radialRequest(finalizeBody, 'finalizePayment');
};

/*Paypal.prototype.doCapture = function (token, order, authorizationId, amount, currencyCode, isPartial) {
	var self = this,
		payerId = '',
		requestId = '';
	for (var p=0;p<order.payments.length;p++) {
		var paymentObj = order.payments[p];
		if (paymentObj.paymentType == 'PayPalExpress2') {
			if (paymentObj.data && paymentObj.data.paypal) {
				payerId = paymentObj.data.paypal.payerId;
				requestId = paymentObj.data.paypal.requestID;
				break;
			}
		}
	}
	var finalizeBody = {
		Version: "1.0",
		Iteration: '4',
		RequestID: requestId,
		CreateTime: getCreateTime(),
		OrderId: order.originalCartId || "",
		StoreCode: self.gsistoreid,
		Credential: self.gsipassword,
		Tender: 'PY',
		Token: token,
		PayerID: payerId,
		Amount: amount,
		Currency: 'USD'
	};
	return self.radialRequest(finalizeBody, 'finalizePayment');
};*/

Paypal.prototype.doRefund = function (transactionId, fullRefund, amount, currencyCode) {
	var self = this;
	var params = self.params();


	params.TRANSACTIONID = transactionId;
	if (!fullRefund) {
		params.AMT = prepareNumber(amount);
		params.CURRENCYCODE = currencyCode;
		params.REFUNDTYPE = "Partial";
	} else
		params.REFUNDTYPE = "Full";
	params.METHOD = 'RefundTransaction';

	return self.request(params).then(function (data) {
		return { ack: data.ACK, correlationId: data.CORRELATIONID, transactionId: data.REFUNDTRANSACTIONID };
	});
};

Paypal.prototype.doVoid = function (authorizationId) {
	var self = this;
	var params = self.params();
	params.AUTHORIZATIONID = authorizationId;
	params.METHOD = 'DoVoid';
	return { ack: '', correlationId: '', transactionId: authorizationId, params: params };
};

Paypal.prototype.setProducts = function (products) {
	this.products = products;
	return this;
};

Paypal.prototype.getItemsParams = function () {
	var params = {};
	// Add product information.
	for (var i = 0; i < this.products.length; i++) {
		if (this.products[i].name) {
			params['L_PAYMENTREQUEST_0_NAME' + i] = this.products[i].name;
		}

		if (this.products[i].description) {
			params['L_PAYMENTREQUEST_0_DESC' + i] = this.products[i].description;
		}

		if (this.products[i].amount) {
			params['L_PAYMENTREQUEST_0_AMT' + i] = prepareNumber(this.products[i].amount);
		}

		if (this.products[i].quantity) {
			params['L_PAYMENTREQUEST_0_QTY' + i] = this.products[i].quantity;
		}

		/*if(this.products[i].taxAmount) {
			params['L_PAYMENTREQUEST_0_TAXAMT' + i] = this.products[i].taxAmount;
		}*/

	}

	return params;
};

Paypal.prototype.doExpressCheckoutPayment = function (params) {
	var self = this;
	params.METHOD = 'DoExpressCheckoutPayment';

	return self.request(self.url, params);

};

Paypal.prototype.setPayOptions = function (requireShipping, noShipping, allowNote) {
	this.payOptions = {};

	if (requireShipping !== undefined) {
		this.payOptions.REQCONFIRMSHIPPING = requireShipping ? 1 : 0;
	}

	if (noShipping !== undefined) {
		this.payOptions.NOSHIPPING = noShipping ? 1 : 0;
	}

	if (allowNote !== undefined) {
		this.payOptions.ALLOWNOTE = allowNote ? 1 : 0;
	}

	this.payOptions.TOTALTYPE = "EstimatedTotal";
	return this;
};

Paypal.prototype.request = function (params) {
	console.error('reached old request function, check flow!');
	return null;
};

exports.Paypal = Paypal;

exports.create = function (paypalRadialUrl, paypalKey, sandbox) {
	return new Paypal(paypalRadialUrl, paypalKey, sandbox);
};
