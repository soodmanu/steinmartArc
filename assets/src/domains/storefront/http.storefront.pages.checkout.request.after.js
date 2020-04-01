/**
 * Implementation for http.storefront.pages.checkout.request.after


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
module.exports = function(context, callback) {
  console.log("COntext : "+JSON.stringify(context.response.body.model));
  console.log("responsebody : "+JSON.stringify(context.response.body));
  var checkoutModel = context.response.body.model;
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
			 "LastName":"manu",/*checkoutModel.destinations[0].destinationContact.firstName,need to be populated from mozu object*/
			 "FirstName":"sood"/*checkoutModel.destinations[0].destinationContact.lastNameOrSurname,need to be populated from mozu object*/
		  },
		 "Address":{
		    "Line1":"642 ely blvd south",/*checkoutModel.destinations[0].destinationContact.address.address1,need to be populated from mozu object*/
			"Line2":"",/*need to be populated from mozu object*/
			"City":"Petaluma",/*checkoutModel.destinations[0].destinationContact.address.cityOrTown,need to be populated from mozu object*/
			"MainDivision":"CA",/*checkoutModel.destinations[0].destinationContact.address.stateOrProvince,need to be populated from mozu object*/
			"CountryCode":"US",/*checkoutModel.destinations[0].destinationContact.address.countryCode,need to be populated from mozu object*/
			"PostalCode":"94954"/*checkoutModel.destinations[0].destinationContact.address.postalOrZipCodeneed to be populated from mozu object*/
		}
	  }
			
	}
	}
  }
};
var items=checkoutModel.items;
/*var themeSettings = JSON.parse(JSON.stringify(context.items.siteContext.themeSettings));
	console.log("JSON : "+themeSettings.adminOriginStreet);*/
var taxclass="";
var totalChargeablePrice = "";
var shippingChargeableItems = [];
var shippingchargeableItemCost = "";
var shippingDiscountAmount = "0";
if(checkoutModel.shippingDiscounts.length >0){
	 shippingDiscountAmount =  checkoutModel.shippingDiscounts[0].discount.impact;
}
_.each(items, function(itemData,index){
	totalChargeablePrice += itemData.discountedTotal;
	var productAttribute = itemData.product.properties;
	
	productAttribute.forEach(function(attr){
     if(attr.attributeFQN === 'tenant~chargeshipping'){
		 shippingChargeableItems.push(itemData.product.productCode);
		 shippingchargeableItemCost += shippingchargeableItemCost+ itemData.extendedAmount;
	 }
	 });
});
var shippingChargeableItemCount = 1;
_.each(items, function(itemData,index){
	
	var storefrontOrderAttributes = itemData.product.properties;
	
		
	 storefrontOrderAttributes.forEach(function(attr){
                              var attrVal;
							  
                              if(attr.attributeFQN === 'tenant~taxclass'){
                                  attrVal = attr.values;
								  var taxvalues = attrVal[0].value;
								  var taxvaluearray = taxvalues.split(",");
								  for (var i = 0; i < taxvaluearray.length; i++) {
									  var value = taxvaluearray[i];
									  var productCode =  value.substr(0,value.indexOf(":"));
									  if(productCode === itemData.product.productCode){
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
		"Quantity":itemData.quantity,/*need to be populated from mozu object*/
		"Pricing":{
			"Merchandise":{
				"Amount":itemData.discountedTotal,/*need to be populated from mozu object*/
				"TaxClass":"61000",/*need to be populated from mozu object*/
				
			},
			
		}
			
    });
	
	if(itemData.weightedOrderDiscount > 0){
		
	var  merchandiseObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Merchandise ;

	Object.assign(merchandiseObj,{
		"PromotionalDiscounts":{
					"Discount":{
						$: {
							'id':'ItemDisc_001',
							"calculateDuty":"false"
		  
						},
						"Amount":itemData.weightedOrderDiscount
					}
				}
	
	});
	
	}
	var  merchandiseUnitPrice = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Merchandise ;
	Object.assign(merchandiseUnitPrice,{
		"UnitPrice":itemData.unitPrice.extendedAmount
	});	
	if (shippingChargeableItems.includes(itemData.product.productCode)) {
	
		var prorateShippingAmount = getProrateShippingAmount(itemData.subtotal,totalChargeablePrice,checkoutModel.shippingTotal);
		var  pricingObj =  obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing;
		Object.assign(pricingObj,{
		"Shipping":{
				"Amount":prorateShippingAmount,/*need to be populated from mozu object*/
				"TaxClass":taxclass/*need to be populated from mozu object*/
			}
		});	
		
		if(shippingDiscountAmount > 0 ){
		var prorateShippingDiscountAmount = getProrateShippingAmount(itemData.subtotal,totalChargeablePrice,shippingDiscountAmount);
			
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
				"TaxClass":taxclass/*need to be populated from mozu object*/
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

/*call = function(response) {
	
	response.on('data', function (chunk) {
		data += chunk;
		console.log("data:"+JSON.stringify(data));
	});
	response.on('end', function(){
		 parseString(data, function (err, result) {
			  console.log("result:"+JSON.stringify(result));
			callback();	   
			  
		 }); 
	callback();	
                     
    });

};*/
//var post_req = https.request(options, call);
//post_req.write(xmlDoc);
//post_req.end();
//context.response.body.model.taxTotal = "7.64";
callback();	
};