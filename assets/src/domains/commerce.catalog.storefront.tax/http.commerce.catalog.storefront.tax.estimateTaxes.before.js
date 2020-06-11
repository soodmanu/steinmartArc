  /**
   * Implementation for http.commerce.catalog.storefront.tax.estimateTaxes.after


   * HTTP Actions all receive a similar context object that includes
   * `request` and `response` objects. These objects are similar to
   * http.IncomingMessage objects in NodeJS.

  {
    configuration: {},
    request: http.ClientRequest,
    response: http.ClientResponse
  }

   * Call `response.end()` to end the response early.
   * Call `response.set(headerName)` to set an HTTP header for the response.
   * `request.headers` is an object containing the HTTP headers for the request.
   * 
   * The `request` and `response` objects are both Streams and you can read
   * data out of them the way that you would in Node.

   */
  var xml2js = require('xml2js');
  var parseString = require('xml2js').parseString;
  var _  = require('underscore');
  var https = require("https");
  var apiContext = require('mozu-node-sdk/clients/platform/application')();
  var orderResourceClient = require("mozu-node-sdk/clients/commerce/orders/orderAttribute")(apiContext);
  module.exports = function(context, callback) {
  //var orderResource = require('mozu-node-sdk/clients/commerce/order')(context);
  
  var requestBody = context.request.body; 
  var responseBody = context.response.body;
  var items=requestBody.lineItems;
 
  //orderResource.context['user-claims'] = null;

 //console.log("responseBody"+JSON.stringify(context.response.body));
 console.log("requestBody"+JSON.stringify(requestBody));
  
 /*if(requestBody.taxContext.destinationAddress !== ""){

  var estimateDateObj = {
    'InventoryDetailsRequestMessage': {
      $: {
        'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',
		 
      
     },
	
    'OrderItem':[]
    
    }
  };
  
  var inventoryAddressDetail = {
	  'CartItems':[]
  };

	var shippingCode = requestBody.shippingMethodCode;
	var	ShippingMethodName = requestBody.shippingMethodName;
	
		
	_.each(items, function(itemData,index){
		estimateDateObj.InventoryDetailsRequestMessage.OrderItem.push({
			  $: {
				 lineId:itemData.id ,
				 itemId:"25-"+itemData.variantProductCode
				
			  },
			  "Quantity":itemData.quantity,
			  "ShipmentDetails":{
				"ShippingMethod":ShippingMethodName,
				"ShipToAddress":{
					"Line1":requestBody.taxContext.destinationAddress.address1,
					"City":requestBody.taxContext.destinationAddress.cityOrTown,
					"MainDivision":requestBody.taxContext.destinationAddress.stateOrProvince,
					"CountryCode":requestBody.taxContext.destinationAddress.countryCode,
					"PostalCode":requestBody.taxContext.destinationAddress.postalOrZipCode
				 }
				}
			  
		    });
		 });

		  var builder = new xml2js.Builder();
		  var xmlDoc = builder.buildObject(estimateDateObj);
		  console.log(xmlDoc);
		  var options = {
				   method : 'POST',
				   hostname: 'api-na.gsipartners.com',
				   path: '/v1.0/stores/SMTUS/inventory/details/get.xml',         
				   headers: {
					'apiKey':'7WqVhbJiWWCJEAY6G7O795Bb8YMKThYJ',
					'Content-Type':'application/xml',
					'Content-Length':xmlDoc.length,
				   },
				  
				  
				};
		  var data = '';

		  call = function(response) {
			
			response.on('data', function (chunk) {
			  data += chunk;
			  
		  });
			response.on('end', function(){
			   parseString(data, function (err, result) {
				
					var resultObj = JSON.stringify(result);
					console.log("resultObj"+resultObj);
					var inventoryDetails = result.InventoryDetailsResponseMessage.InventoryDetails;
					console.log("orderItems"+inventoryDetails.length);
				   if (result.InventoryDetailsResponseMessage.InventoryDetails !== "" ) {
					
					  for (var i = 0; i < inventoryDetails.length; i++) {
						var inventoryDetail = inventoryDetails[i].InventoryDetail;
						console.log("inventoryDetails length"+i+inventoryDetail.length);
						 for (var j = 0; j < inventoryDetail.length; ++j) {
							 console.log("inventoryDetail"+inventoryDetail[j].$.lineId);
							 console.log("inventoryDetail"+inventoryDetail[j].ShipFromAddress[0].Line1);
							 inventoryAddressDetail.CartItems.push({
								 "lineId":inventoryDetail[j].$.lineId,
								 "ShippingOrigin":{
									  "Line1":inventoryDetail[j].ShipFromAddress[0].Line1,
									  "City":inventoryDetail[j].ShipFromAddress[0].City,
									  "MainDivision":inventoryDetail[j].ShipFromAddress[0].MainDivision,
									  "CountryCode":inventoryDetail[j].ShipFromAddress[0].CountryCode,
									  "PostalCode":inventoryDetail[j].ShipFromAddress[0].postalOrZipCode
									},
								 "EstimatedFromDate":inventoryDetail[j].DeliveryEstimate[0].DeliveryWindow[0].From[0],
								 "EstimatedToDate":inventoryDetail[j].DeliveryEstimate[0].DeliveryWindow[0].To[0]
							 });
							
						}
						console.log("inventoryAddressDetail2"+JSON.stringify(inventoryAddressDetail));
						//calculateTax(inventoryAddressDetail);
					 }
					  var adressObj = JSON.stringify(inventoryAddressDetail);
					  var orderAttributeObject = [{
							  "fullyQualifiedName": "tenant~tax-data-xml",
							  "values": ['manu']
						  }];
						  
						
						  //orderResourceClient.context['user-claims'] = null;
						  orderResourceClient.updateOrderAttributes({
						  orderId: requestBody.orderId,
							  removeMissing: false
						  },{
							  body:orderAttributeObject
							}).then(function(updated) {
								console.log("setting attribute data");
								callback();
							}, function(err) {
								console.log('Error fetching order Attributes:', JSON.stringify(err));
								callback();
							});
						console.log("orderAttributeObject23"+JSON.stringify(orderAttributeObject));
						
					} else {
						if (result) {
								console.log("Result Error ");
						}
					 //calculateTax(inventoryAddressDetail);
					 
					}
							   
			  });
			});
		  };
		  var post_req = https.request(options, call);
		  post_req.write(xmlDoc);
		  post_req.end();
		//console.log("inside tax1");
   }*/
   callback();
  
  };