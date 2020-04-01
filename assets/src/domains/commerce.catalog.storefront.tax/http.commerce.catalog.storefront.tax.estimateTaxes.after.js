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

var orderResourceFactory = require('mozu-node-sdk/clients/commerce/order');
var checkoutResourceFactory = require('mozu-node-sdk/clients/commerce/checkout');
var mozuConstants = require("mozu-node-sdk/constants");
var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;
var _  = require('underscore');
var https = require("https");
module.exports = function(context, callback) {
var requestBody = JSON.parse(JSON.stringify(context.request.body));	
console.log("inside tax"+JSON.stringify(context.request.body));
var shippingCode = requestBody.ShippingMethodCode;
var responseBody = JSON.parse(JSON.stringify(context.response.body));

console.log("inside tax"+JSON.stringify(context.response.body));
console.log("line items lenght"+JSON.stringify(requestBody.LineItems.length));
//var checkoutModel = context.response.body.model;
  var obj = {
  'TaxDutyQuoteRequest': {
    $: {
      'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',
	  
	 },
	'Currency':"USD",
	'VATInclusivePricing':"false",
	"BillingInformation":"",
    "Shipping":{
		"ShipGroups":{
			"ShipGroup":{
				$: {
					"id": "ShipGroup_1",
					"chargeType" : "WEIGHTBASED"
				},
				"DestinationTarget":{
					$: {
						"ref":"Dest_1"
					}
				 },
				'Items':{
				"OrderItem":[]
				
				}
			}
		},
	 
	 "Destinations":{
		"MailingAddress":{
			$: {
				"id":"Dest_1"
			},
		 "PersonName":{
			 "LastName":"Steinmart",/*checkoutModel.destinations[0].destinationContact.firstName,need to be populated from mozu object*/
			 "FirstName":"Steinmart"/*checkoutModel.destinations[0].destinationContact.lastNameOrSurname,need to be populated from mozu object*/
		  },
		 "Address":{
		    "Line1":requestBody.TaxContext.DestinationAddress.Address1,
			"Line2":requestBody.TaxContext.DestinationAddress.Address2,
			"City":requestBody.TaxContext.DestinationAddress.CityOrTown,
			"MainDivision":requestBody.TaxContext.DestinationAddress.StateOrProvince,
			"CountryCode":requestBody.TaxContext.DestinationAddress.CountryCode,
			"PostalCode":requestBody.TaxContext.DestinationAddress.PostalOrZipCode
		}
	  }
			
	}
	}
  }
};
var items=requestBody.LineItems;
/*var themeSettings = JSON.parse(JSON.stringify(context.items.siteContext.themeSettings));
	console.log("JSON : "+themeSettings.adminOriginStreet);*/
var taxclass="";
var totalChargeablePrice = "";
var shippingChargeableItems = [];
var shippingchargeableItemCost = "";
var shippingDiscountAmount = 0;
var shippingDiscounts = requestBody.ShippingDiscounts;
console.log("shippingDiscounts"+shippingDiscounts);
if(shippingDiscounts !== null && shippingDiscounts !== 'undefined'){
	 shippingDiscountAmount =  shippingDiscounts[0].Impact;
}
_.each(items, function(itemData,index){
	totalChargeablePrice += itemData.lineItemPrice;
	var productAttribute = itemData.ProductProperties;
	
	productAttribute.forEach(function(attr){
     if(attr.attributeFQN === 'tenant~chargeshipping'){
		 shippingChargeableItems.push(itemData.ProductCode);
		 shippingchargeableItemCost += shippingchargeableItemCost+ itemData.LineItemPrice;
	 }
	 });
});
var shippingChargeableItemCount = 1;
_.each(items, function(itemData,index){
	
	var storefrontOrderAttributes = itemData.ProductProperties;
	
		
	 storefrontOrderAttributes.forEach(function(attr){
                              var attrVal;
							  
                              if(attr.attributeFQN === 'tenant~taxclass'){
                                  attrVal = attr.values;
								  var taxvalues = attrVal[0].value;
								  var taxvaluearray = taxvalues.split(",");
								  for (var i = 0; i < taxvaluearray.length; i++) {
									  var value = taxvaluearray[i];
									  var productCode =  value.substr(0,value.indexOf(":"));
									  if(productCode === itemData.productCode){
										  taxclass = value.substr(value.indexOf(":")+1,value.length);
										  console.log("manu"+taxclass);
									  }
									}
								  
								  
								  
                                  
                              }                    
      });
	
	obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem.push({
		$: {
			'lineNumber':"21687012"/*need to be populated from mozu object*/
		  
		},
		"ItemId":'25-65845760',/*itemData.product.productCode,need to be populated from mozu object*/
		"ItemDesc":"undefined",
		"ScreenSize":"0",
		"Origins":{
			"AdminOrigin":{
				"Line1":"Stein Mart, Inc.",/*themeSettings.adminOriginStreet, need to be populated from mozu object*/
				"City":"King Of Prussia",/*themeSettings.adminOriginCity, need to be populated from mozu object*/
				"MainDivision":"PA",/*themeSettings.adminOriginMainDivision,need to be populated from mozu object*/
				"CountryCode":"US",/*themeSettings.adminOriginCountryCode,need to be populated from mozu object*/
				"PostalCode":"19406"/*themeSettings.adminOriginPostalCode*/
			},
			"ShippingOrigin":{
				"Line1":"3375 Joseph Martin Highway",/*themeSettings.shippingOriginStreet, need to be populated from mozu object*/
				"City":"Martinsville",/*themeSettings.shippingOriginCity,need to be populated from mozu object*/
				"MainDivision":"VA",/*themeSettings.shippingOriginMainDivision,need to be populated from mozu object*/
				"CountryCode":"US",/*themeSettings.shippingOriginCountryCode,need to be populated from mozu object*/
				"PostalCode":"24112"/*themeSettings.shippingOriginPostalCode*/
			}
		},
		"Quantity":itemData.Quantity,/*need to be populated from mozu object*/
		"Pricing":{
			"Merchandise":{
				"Amount":itemData.DiscountedTotal/itemData.Quantity,/*need to be populated from mozu object*/
				"TaxClass":"61000",/*need to be populated from mozu object*/
				
			},
			
		}
			
    });
	
	if(requestBody.OrderDiscount.Impact > 0){
		var discountAmount = (itemData.DiscountedTotal - itemData.LineItemPrice)/itemData.Quantity;
	var  merchandiseObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Merchandise ;

	Object.assign(merchandiseObj,{
		"PromotionalDiscounts":{
					"Discount":{
						$: {
							'id':'ItemDisc_001',
							"calculateDuty":"false"
		  
						},
						"Amount":discountAmount
					}
				}
	
	});
	
	}
	var  merchandiseUnitPrice = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Merchandise ;
	var unitPrice = itemData.LineItemPrice/itemData.Quantity;
	Object.assign(merchandiseUnitPrice,{
		"UnitPrice":unitPrice
	});	
	if (shippingChargeableItems.includes(itemData.ProductCode)) {
	
		var prorateShippingAmount = getProrateShippingAmount(itemData.lineItemPrice,totalChargeablePrice,checkoutModel.shippingTotal);
		var  pricingObj =  obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing;
		Object.assign(pricingObj,{
		"Shipping":{
				"Amount":prorateShippingAmount,/*need to be populated from mozu object*/
				"TaxClass":"93000"/*need to be populated from mozu object*/
			}
		});	
		
		if(shippingDiscountAmount > 0 ){
		var prorateShippingDiscountAmount = getProrateShippingAmount(itemData.LineItemPrice,totalChargeablePrice,shippingDiscountAmount);
			
		var shippingObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Shipping;
		Object.assign(shippingObj,{
		"PromotionalDiscounts":{
					"Discount":{
						$: {
							'id':'ItemDisc_001',
							"calculateDuty":"false"
		  
						},
						"Amount":itemData.prorateShippingDiscountAmount
					}
				}
		});	
			
			
		}
		++shippingChargeableItemCount;
	}else{
		var  pricingObj2 =  obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing;
		Object.assign(pricingObj2,{
		"Shipping":{
				"Amount":"0.0",/*need to be populated from mozu object*/
				"TaxClass":"93000"/*need to be populated from mozu object*/
			}
		});	
	}		
});
function getProrateShippingAmount(sellPrice,totalChargeablePrice,shipingTotal){
	console.log("shippingAmount"+shippingAmount);
	var shippingAmount = (sellPrice * shipingTotal)/ totalChargeablePrice; 
	return shippingAmount.toFixed(2) ;
		 
}
var builder = new xml2js.Builder();
var xmlDoc = builder.buildObject(obj);
console.log(xmlDoc);
var options = {
                 method : 'POST',
				 hostname: 'uat01-epapi-na.gsipartners.com',
                 path: '/v1.0/stores/SMTUS/taxes/quote.xml',				 
				 headers: {
					'apiKey':'w7fRGlH0IDTznzIgOl9KfWFfggkUkI62',
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
			 var transactionId = result.TaxDutyQuoteResponse.TaxTransactionId[0];
			
				if (result.TaxDutyQuoteResponse.TaxTransactionId[0] !== "" ) {
                            try {
                                var orderTax = 0;
                                var shipTax = 0;
								 console.log("transactionId"+transactionId);
								 var orderItems = result.TaxDutyQuoteResponse.Shipping[0].ShipGroups[0].ShipGroup[0].Items[0].OrderItem;
								 console.log("orderItems"+orderItems.length);
                               
									for (var i = 0; i < orderItems.length; ++i) {
										var orderItem  = orderItems[i];
										console.log("orderItemArray"+JSON.stringify(orderItem));
										var  taxArray = orderItem.Pricing[0].Merchandise[0].TaxData[0].Taxes[0].Tax;
										 console.log("taxArray"+taxArray.length);
                               
										var orderItemTax =0;
										for (var j = 0; j < taxArray.length; ++j) {
											
										orderItemTax = orderItemTax + parseFloat(taxArray[j].CalculatedTax[0]);
                                         console.log("orderItemTax"+orderItemTax);
										}
										orderTax = orderTax+orderItemTax;
										
                                    }
                                
                                orderTax = orderTax.toFixed(2);
                                console.log('Order Tax:', orderTax);
                                responseBody.orderTax = orderTax;
                                context.response.body = responseBody;
                                callback();
                            } catch (error) {
								console.log ("error"+JSON.stringify(error));
                                callback();
                            }
                        } else {
                            console.log("tax api response error: ", err);
                            if (result) {
                                console.log("Result Error: ", result.ErrorDetail);
                            }
                            callback();
                        }
				  
			  
		 }); 
		
                     
    });

};
var post_req = https.request(options, call);
post_req.write(xmlDoc);
post_req.end();


	
/*if (shippingCode && requestBody.LineItems && requestBody.LineItems.length) {
		console.log("calling order detail");
		getOrderDetail(context, requestBody.OrderId, function (order) {
            console.log("orderData1--"+JSON.stringify(order));
			callback();
		}); 
	}

 	
  function getOrderDetail(context, checkoutNo, callback) {
        
        // get order factory object
        var orderResource = createClientFromContext(orderResourceFactory, context, true);
        orderResource.getOrder({ orderId: checkoutNo })
            .then(function (checkoutData) {
                //that.logData(context, 'getOrder-onSuccess' + JSON.stringify(checkoutData));
				console.log("orderData1--"+JSON.stringify(checkoutData));
			
                callback();
            }, function (err1) {
                that.logData(context, 'getOrder-onError' + JSON.stringify(err1));
                callback();
            });
    }
	
 function createClientFromContext(client, context, removeClaims) {
        var c = client(context);
        if (removeClaims)
            c.context[mozuConstants.headers.USERCLAIMS] = null;
        return c;
    }*/	
   
  
};