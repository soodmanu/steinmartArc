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
var _ = require('underscore');
var https = require("https");
var request = require('request');

module.exports = function (context, callback) {
    var OrderAttributeClient = require("mozu-node-sdk/clients/commerce/orders/orderAttribute");
	
    console.log("requestBody",context.request.body);

    var requestBody = JSON.parse(JSON.stringify(context.request.body));
    var responseBody = JSON.parse(JSON.stringify(context.response.body));
    var items = context.request.body.lineItems;

    var shippingCode = requestBody.shippingMethodCode;
    console.log("inside tax");
    var estimateFromDate = "";
    var estimateToDate = "";
	//callback();

    if (requestBody.taxContext.destinationAddress !== "") {
        var obj = {
            'TaxDutyQuoteRequest': {
                $: {
                    'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',

                },
                'Currency': "USD",
                'VATInclusivePricing': "false",
                "BillingInformation": "",
                "Shipping": {
                    "ShipGroups": {
                        "ShipGroup": {
                            $: {
                                "id": "ShipGroup_1",
                                "chargeType": "WEIGHTBASED"
                            },
                            "DestinationTarget": {
                                $: {
                                    "ref": "Dest_1"
                                }
                            },
                            'Items': {
                                "OrderItem": []

                            }
                        }
                    },

                    "Destinations": {
                        "MailingAddress": {
                            $: {
                                "id": "Dest_1"
                            },
                            "PersonName": {
                                "LastName": "Steinmart",
                                "FirstName": "Steinmart"
                            },
                            "Address": {
                                "Line1": requestBody.taxContext.destinationAddress.address1,
                                "Line2": requestBody.taxContext.destinationAddress.address2,
                                "City": requestBody.taxContext.destinationAddress.cityOrTown,
                                "MainDivision": requestBody.taxContext.destinationAddress.stateOrProvince,
                                "CountryCode": requestBody.taxContext.destinationAddress.countryCode,
                                "PostalCode": requestBody.taxContext.destinationAddress.postalOrZipCode
                            }
                        }

                    }
                }
            }
        };

        var estimateDateObj = {
            'InventoryDetailsRequestMessage': {
                $: {
                    'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',


                },

                'OrderItem': []

            }
        };
        console.log("inside tax0");
        var inventoryAddressDetail = [];


        var shippingMethodName = requestBody.shippingMethodName;

		if(shippingMethodName === undefined){
			shippingMethodName = 'any_std';
			console.log("ShippingMethodName1" + shippingMethodName);
		}

        console.log("ShippingMethodName2" + shippingMethodName);

        _.each(items, function (itemData, index) {
            estimateDateObj.InventoryDetailsRequestMessage.OrderItem.push({
                $: {
                    lineId: itemData.id,
                    itemId: "25-" + itemData.variantProductCode

                },
                "Quantity": itemData.quantity,
                "ShipmentDetails": {
                    "ShippingMethod": shippingMethodName,
                    "ShipToAddress": {
                        "Line1": requestBody.taxContext.destinationAddress.address1,
                        "City": requestBody.taxContext.destinationAddress.cityOrTown,
                        "MainDivision": requestBody.taxContext.destinationAddress.stateOrProvince,
                        "CountryCode": requestBody.taxContext.destinationAddress.countryCode,
                        "PostalCode": requestBody.taxContext.destinationAddress.postalOrZipCode
                    }
                }

            });
        });

        var builder = new xml2js.Builder();
        var xmlDoc = builder.buildObject(estimateDateObj);
        console.log("estimated request"+xmlDoc);
        var hostName = context.configuration.hostname;
        var deliveryPath = context.configuration.deliveryDateRadialPath;
        var deliveyDateRadialKey = context.configuration.deliveryDateRadialKey;
        console.log(hostName);
        console.log(deliveryPath);
        console.log(deliveyDateRadialKey);
        var options = {
            method: 'POST',
            hostname: hostName,
            path: deliveryPath,
            headers: {
                'apiKey': deliveyDateRadialKey,
                'Content-Type': 'application/xml',
                'Content-Length': xmlDoc.length,
            },


        };

        var data = '';

        callEstimateDate = function (response) {

            response.on('data', function (chunk) {
                data += chunk;

            });
            response.on('end', function () {
                parseString(data, function (err, result) {

                    var resultObj = JSON.stringify(result);
                    console.log("resultObj" + resultObj);
                    var inventoryDetails = result.InventoryDetailsResponseMessage.InventoryDetails;
                    console.log("orderItems" + inventoryDetails.length);
					
                    if (result && result.InventoryDetailsResponseMessage.InventoryDetails[0] !== "") {
                        try {
                            for (var i = 0; i < inventoryDetails.length; i++) {
                                var inventoryDetail = inventoryDetails[i].InventoryDetail;
                                console.log("inventoryDetails length" + i + inventoryDetail.length);
                                for (var j = 0; j < inventoryDetail.length; ++j) {
                                    console.log("inventoryDetail" + inventoryDetail[j].$.lineId);
                                    console.log("inventoryDetail" + inventoryDetail[j].ShipFromAddress[0].Line1);
                                    inventoryAddressDetail.push({
                                        "lineId": inventoryDetail[j].$.lineId,
                                        "ShippingOrigin": {
                                            "Line1": inventoryDetail[j].ShipFromAddress[0].Line1,
                                            "City": inventoryDetail[j].ShipFromAddress[0].City,
                                            "MainDivision": inventoryDetail[j].ShipFromAddress[0].MainDivision,
                                            "CountryCode": inventoryDetail[j].ShipFromAddress[0].CountryCode,
                                            "PostalCode": inventoryDetail[j].ShipFromAddress[0].PostalCode
                                        },
                                        "EstimatedFromDate": inventoryDetail[j].DeliveryEstimate[0].DeliveryWindow[0].From[0],
                                        "EstimatedToDate": inventoryDetail[j].DeliveryEstimate[0].DeliveryWindow[0].To[0]
                                    });
									estimateFromDate = inventoryDetail[j].DeliveryEstimate[0].DeliveryWindow[0].From[0];
									estimateToDate = inventoryDetail[j].DeliveryEstimate[0].DeliveryWindow[0].To[0];
                                }
                                console.log("inventoryAddressDetail2" + inventoryAddressDetail.length);
                                
							
                            }
							console.log("estimateFromDate"+estimateFromDate);
							var dateAttributeObject = [
							
							
							{
								"fullyQualifiedName": "tenant~estArrivalDate",
								"values": [JSON.stringify(estimateToDate)]
							},
							
							{
								"fullyQualifiedName": "tenant~estFromDate",
								"values": [JSON.stringify(estimateFromDate)]
							},
							
							
							
							];
							console.log("orderAttributeObject : "+JSON.stringify(dateAttributeObject));
							var orderAttributeClient = OrderAttributeClient(context);
							orderAttributeClient.context['user-claims'] = null;
							orderAttributeClient.updateOrderAttributes({
								orderId: requestBody.orderId,
								removeMissing: false
							}, {
								body: dateAttributeObject
							}).then(function (updatedOrder) {
								console.log("setting dateAttributeObject data");
								//callback();
								//call(updatedOrder3);
							}, function (err) {
								console.log('Error fetching order Attributes:', JSON.stringify(err));
								//callback();
							});
							
							calculateTax(inventoryAddressDetail);

                        } catch (error) {
                            console.log("error" + JSON.stringify(error));
							callback();
                            //calculateTax(inventoryAddressDetail);

                        }
                    } else {
                        if (result) {
                            console.log("Result Error ");
                        }
                      calculateTax(inventoryAddressDetail);
					  
					 

                    }
				 
                });
            });
        };
        var post_req = https.request(options, callEstimateDate);
        post_req.write(xmlDoc);
        post_req.end();
		//calculateTax(inventoryAddressDetail);

    }
    function calculateTax(shippingAddressDetail) {

        var orderTaxData = {
            'Items': {
                "OrderItem": []
            }

        };

        var taxclass = "";
        var totalChargeablePrice = 0;
        var shippingChargeableItems = [];
        var shippingchargeableItemCost = 0;
        var shippingDiscountAmount = 0;
		
        var shippingDiscounts = requestBody.shippingDiscounts;
        console.log("shippingCode" + shippingCode);
        if (shippingCode !== undefined && items && items.length) {

            if (shippingDiscounts) {
                console.log("shippingDiscount data1" + shippingDiscounts[0].impact);
                shippingDiscountAmount = shippingDiscounts[0].impact;
            }
            _.each(items, function (itemData, index) {
                console.log("itemData" + itemData.lineItemPrice);
                totalChargeablePrice += itemData.lineItemPrice;
                shippingChargeableItems.push(itemData.productCode);
                shippingchargeableItemCost = shippingchargeableItemCost + itemData.lineItemPrice;


            });

            console.log("after shiiping discounts");
			
            var shippingChargeableItemCount = 1;
            _.each(items, function (itemData, index) {
                console.log("inside tax class attribute");
                var storefrontOrderAttributes = itemData.productProperties;
                var prorateShippingAmount = 0;
                var prorateShippingDiscountAmount = 0;
                var discountAmount = 0;
                console.log("inside tax 2");
                storefrontOrderAttributes.forEach(function (attr) {
                    var attrVal = [];

                    if (attr.attributeFQN === 'tenant~taxclass') {
                        attrVal = JSON.parse(attr.values[0].stringValue);

                        for (var j = 0; j < attrVal.length; ++j) {
                            var skuCode = attrVal[j].sku;
                            console.log("skuCode" + skuCode);
                            if (skuCode == itemData.variantProductCode) {
                                taxclass = attrVal[j].value;
                                console.log("taxclass" + taxclass);
                            }
                        }
                    }
                });
                console.log("inside tax 4");
				var itemPrice = itemData.discountedTotal / itemData.quantity;
				 itemPrice = itemPrice.toFixed(2);
                obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem.push({
                    $: {
                        'lineNumber': itemData.id

                    },
                    "ItemId": "25-" + itemData.variantProductCode,
                    "ItemDesc": "undefined",
                    "ScreenSize": "0",
                    "Origins": {
                        "AdminOrigin": {
                            "Line1": "Stein Mart, Inc.",
                            "City": "King Of Prussia",
                            "MainDivision": "PA",
                            "CountryCode": "US",
                            "PostalCode": "19406"
                        }

                    },
                    "Quantity": itemData.quantity,
                    "Pricing": {
                        "Merchandise": {
                            "Amount": itemPrice
                            
                        },

                    }

                });

                console.log("inside tax 5");
                
                var originObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Origins;
                console.log("shippingAddressDetail length" + shippingAddressDetail.length);
                _.each(shippingAddressDetail, function (inventoryItem, index) {
                    if (inventoryItem.lineId == itemData.id) {
                        estimateFromDate = inventoryItem.EstimatedFromDate;
                        estimateToDate = inventoryItem.EstimatedToDate;
						

                        Object.assign(originObj, {
                            "ShippingOrigin": {
                                "Line1": inventoryItem.ShippingOrigin.Line1,
                                "City": inventoryItem.ShippingOrigin.City,
                                "MainDivision": inventoryItem.ShippingOrigin.MainDivision,
                                "CountryCode": inventoryItem.ShippingOrigin.CountryCode,
                                "PostalCode": inventoryItem.ShippingOrigin.PostalCode
                            }

                        });
                    }

                });

                var shippingOriginObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Origins.ShippingOrigin;
                console.log("ShippingOrigin" + JSON.stringify(shippingOriginObj));
                if (shippingOriginObj === undefined) {
                    Object.assign(originObj, {
                        "ShippingOrigin": {
                            "Line1": requestBody.taxContext.originAddress.address1,
                            "City": requestBody.taxContext.originAddress.cityOrTown,
                            "MainDivision": requestBody.taxContext.originAddress.stateOrProvince,
                            "CountryCode": requestBody.taxContext.originAddress.countryCode,
                            "PostalCode": requestBody.taxContext.originAddress.postalOrZipCode
                        }
                    });
                }
                console.log("inside tax6"+requestBody.orderDiscounts);
                if (requestBody.orderDiscounts !== undefined && requestBody.orderDiscounts[0].impact > 0) {
                    discountAmount = (itemData.discountedTotal - itemData.lineItemPrice) / itemData.quantity;
                    var merchandiseObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Merchandise;
					discountAmount = discountAmount.toFixed(2);
                    Object.assign(merchandiseObj, {
                        "PromotionalDiscounts": {
                            "Discount": {
                                $: {
                                    'id': 'ItemDisc_001',
                                    "calculateDuty": "false"

                                },
                                "Amount": discountAmount
                            }
                        }

                    });

                }
				console.log("inside tax7");
				
				
                var merchandiseUnitPrice = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Merchandise;
				
				if(taxclass != ""){
					Object.assign(merchandiseUnitPrice, {
                    "TaxClass": taxclass
					});
				}
                var unitPrice = itemData.lineItemPrice / itemData.quantity;
				unitPrice = unitPrice.toFixed(2);
                Object.assign(merchandiseUnitPrice, {
                    "UnitPrice": unitPrice
                });
				
				

                if (shippingChargeableItems.includes(itemData.productCode)) {

                    prorateShippingAmount = getProrateShippingAmount(itemData.lineItemPrice, shippingchargeableItemCost, requestBody.shippingAmount);
                    var pricingObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing;
					 console.log("pricingObj" + JSON.stringify(pricingObj));
					 console.log("inside tax8"+prorateShippingAmount);
					
                    Object.assign(pricingObj, {
                        "Shipping": {
                            "Amount": prorateShippingAmount,
                            "TaxClass": "93000"
                        }
                    });
					console.log("inside tax9"+prorateShippingAmount);
					var shippingamount = requestBody.shippingAmount;
					console.log("inside tax10"+shippingamount);
                    if (shippingDiscountAmount > 0 && shippingamount > 0 ) {
						console.log("inside tax10");
                        prorateShippingDiscountAmount = getProrateShippingAmount(itemData.lineItemPrice, shippingchargeableItemCost, shippingDiscountAmount);
						console.log("inside shipping discount"+shippingDiscountAmount);
                        var shippingObj = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing.Shipping;
                        Object.assign(shippingObj, {
                            "PromotionalDiscounts": {
                                "Discount": {
                                    $: {
                                        'id': 'ShipDisc_001',
                                        "calculateDuty": "false"

                                    },
                                    "Amount": prorateShippingDiscountAmount
                                }
                            }
                        });


                    }
                    ++shippingChargeableItemCount;
                } else {
                    var pricingObj2 = obj.TaxDutyQuoteRequest.Shipping.ShipGroups.ShipGroup.Items.OrderItem[index].Pricing;
                    Object.assign(pricingObj2, {
                        "Shipping": {
                            "Amount": itemData.shippingAmount,
                            "TaxClass": "93000"
                        }
                    });
                }
		
                orderTaxData.Items.OrderItem.push({
                    "ItemId": itemData.id,
                    "prorateShippingAmount": prorateShippingAmount,
                    "prorateShippingDiscountAmount": prorateShippingDiscountAmount,
                    "discountAmount": discountAmount,
                    "fromDate": estimateFromDate,
                    "toDate": estimateToDate
                });
            });
			
            var taxBuilder = new xml2js.Builder();
            var taxXml = taxBuilder.buildObject(obj);
            console.log(taxXml);
			console.log(context.configuration.taxHostName);
			console.log(context.configuration.taxRadialUrl);
			console.log(context.configuration.taxRadialKey);
            //callback();
            

            var taxoptions = {
                method: 'POST',
                url: "https://" + context.configuration.taxHostName + context.configuration.taxRadialUrl,
                headers: {
                    'apiKey': context.configuration.taxRadialKey,
                    'Content-Type': 'application/xml',
                    'Content-Length': taxXml.length,

                },
                body: taxXml
            };


            request(taxoptions, function (error, response, body) {
                
                if (error) {
                    console.log(JSON.stringify(error));
                    callback();
                }
                else {
					var output = '';
					console.log("inside tax response");
					xml2js.parseString(body, function (err, result) {
						output = result;
						//console.log("manu"+JSON.stringify(output));
						 
						//processResponse(result);
					});
					
					if (output && output.TaxDutyQuoteResponse.TaxTransactionId[0] !== "") {

							var orderTax = 0;
							var shipTax = 0;
							var transactionId = output.TaxDutyQuoteResponse.TaxTransactionId[0];
							console.log("transactionId" + transactionId);
							var orderItems = output.TaxDutyQuoteResponse.Shipping[0].ShipGroups[0].ShipGroup[0].Items[0].OrderItem;
							console.log("orderItems" + orderItems.length);
							
							for (var i = 0; i < orderItems.length; ++i) {
								var orderItem = orderItems[i];
								
								var taxArray = orderItem.Pricing[0].Merchandise[0].TaxData[0].Taxes[0].Tax;
								var taxShipArray = orderItem.Pricing[0].Shipping[0].TaxData[0].Taxes[0].Tax;
								console.log("taxArray" + taxArray.length);

								var orderItemTax = 0;
								var gstTax = 0;
								for (var j = 0; j < taxArray.length; ++j) {

									orderItemTax = orderItemTax + parseFloat(taxArray[j].CalculatedTax[0]);
									if (taxArray[j].Imposition[0].$.impositionType == 'General Sales and Use Tax') {
										gstTax = gstTax + parseFloat(taxArray[j].CalculatedTax[0]);
									}

								}

								for (j = 0; j < taxShipArray.length; ++j) {
									orderItemTax = orderItemTax + parseFloat(taxShipArray[j].CalculatedTax[0]);
									if (taxShipArray[j].Imposition[0].$.impositionType == 'General Sales and Use Tax') {
										gstTax = gstTax + parseFloat(taxShipArray[j].CalculatedTax[0]);
									}

								}
								orderTax = orderTax + orderItemTax;
								gstTax = gstTax.toFixed(2);
								console.log('gstTax:', gstTax);
								getShipTaxData(orderItem, orderTaxData, taxArray, taxShipArray, gstTax);

							}

							orderTax = orderTax.toFixed(2);
							console.log('Order Tax:', orderTax);
							responseBody.orderTax = orderTax;
							//responseBody.taxData = orderTaxData;
							context.response.body = responseBody;

							var orderAttributeObject = [
							{
								"fullyQualifiedName": "tenant~tax-data-xml",
								"values": [JSON.stringify(orderTaxData)]
							}
							
							
							];
							//console.log("orderAttributeObject : "+JSON.stringify(orderAttributeObject));
							var orderAttributeClient = OrderAttributeClient(context);
							orderAttributeClient.context['user-claims'] = null;
							orderAttributeClient.updateOrderAttributes({
								orderId: requestBody.orderId,
								removeMissing: false
							}, {
								body: orderAttributeObject
							}).then(function (updatedOrder) {
								console.log("setting attribute data");
								//callback();
								//call(updatedOrder3);
							}, function (err) {
								console.log('Error fetching order Attributes:', JSON.stringify(err));
								//callback();
							});
						
						 
						  callback();
						} else {
							console.log("tax api response error: ", err);

							callback();
						}
                        
					 
					//parseString(body, processResponse);
				  callback(); 
                }
				
            });

		
        } else {
            callback();
        }
    }
    function processResponse(err, result) {
        var output = result;
        //console.log(JSON.stringify(output));
        var transactionId = output.TaxDutyQuoteResponse.TaxTransactionId[0];

        if (output.TaxDutyQuoteResponse.TaxTransactionId[0] !== "") {

            var orderTax = 0;
            var shipTax = 0;
            console.log("transactionId" + transactionId);
            var orderItems = output.TaxDutyQuoteResponse.Shipping[0].ShipGroups[0].ShipGroup[0].Items[0].OrderItem;
            console.log("orderItems" + orderItems.length);

            for (var i = 0; i < orderItems.length; ++i) {
                var orderItem = orderItems[i];
                //console.log("orderItemArray"+JSON.stringify(orderItem));
                var taxArray = orderItem.Pricing[0].Merchandise[0].TaxData[0].Taxes[0].Tax;
                var taxShipArray = orderItem.Pricing[0].Shipping[0].TaxData[0].Taxes[0].Tax;
                console.log("taxArray" + taxArray.length);

                var orderItemTax = 0;
                var gstTax = 0;
                for (var j = 0; j < taxArray.length; ++j) {

                    orderItemTax = orderItemTax + parseFloat(taxArray[j].CalculatedTax[0]);
                    if (taxArray[j].Imposition[0].$.impositionType == 'General Sales and Use Tax') {
                        gstTax = gstTax + parseFloat(taxArray[j].CalculatedTax[0]);
                    }

                }

                for (j = 0; j < taxShipArray.length; ++j) {
                    orderItemTax = orderItemTax + parseFloat(taxShipArray[j].CalculatedTax[0]);
                    if (taxShipArray[j].Imposition[0].$.impositionType == 'General Sales and Use Tax') {
                        gstTax = gstTax + parseFloat(taxShipArray[j].CalculatedTax[0]);
                    }

                }
                orderTax = orderTax + orderItemTax;
                gstTax = gstTax.toFixed(2);
                console.log('gstTax:', gstTax);
                getShipTaxData(orderItem, orderTaxData, taxArray, taxShipArray, gstTax);

            }

            orderTax = orderTax.toFixed(2);
            console.log('Order Tax:', orderTax);
            responseBody.orderTax = orderTax;
            //responseBody.taxData = orderTaxData;
            context.response.body = responseBody;

            var orderAttributeObject = [{
                "fullyQualifiedName": "tenant~tax-data-xml",
                "values": [JSON.stringify(orderTaxData)]
            }];
            //console.log("orderAttributeObject : "+JSON.stringify(orderAttributeObject));
            var orderAttributeClient = OrderAttributeClient(context);
            orderAttributeClient.context['user-claims'] = null;
            orderAttributeClient.updateOrderAttributes({
                orderId: requestBody.orderId,
                removeMissing: false
            }, {
                body: orderAttributeObject
            }).then(function (updatedOrder) {
                console.log("setting attribute data");
                callback();
                //call(updatedOrder3);
            }, function (err) {
                console.log('Error fetching order Attributes:', JSON.stringify(err));
                callback();
            });


        } else {
            console.log("tax api response error: ", err);

            callback();
        }
        //callback();


    }
    //console.log("inside tax4");
    function getProrateShippingAmount(sellPrice, totalChargeablePrice, shipingTotal) {
        var proShippingAmount = 0;
        console.log("sellPrice" + sellPrice);
        console.log("totalChargeablePrice" + totalChargeablePrice);
        console.log("shipingTotal" + shipingTotal);
        proShippingAmount = (sellPrice * shipingTotal) / totalChargeablePrice;
        
		proShippingAmount = proShippingAmount.toFixed(2);
		console.log("prorateShippingAmount" + proShippingAmount);
        return proShippingAmount;

    }
    function getShipTaxData(orderItem, orderTaxData, taxArray, taxShipArray, gstTax) {

        var taxObj = {
            'TaxGroup': {
                $: {
                    'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',

                },

                "Tax": taxArray

            }
        };

        var taxShipObj = {
            'TaxGroup': {
                $: {
                    'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',

                },

                "Tax": taxShipArray

            }
        };

        var taxBuilder = new xml2js.Builder();
        var taxDataXml = taxBuilder.buildObject(taxObj);
        var taxShipDataXml = taxBuilder.buildObject(taxShipObj);
        var itemCode = orderItem.$.lineNumber;
        var taxId = itemCode + "_tax_data_xml";
        console.log("itemCode" + itemCode);
        var orderItems = orderTaxData.Items.OrderItem;
        for (var i = 0; i < orderItems.length; ++i) {
            var taxOrderItemCode = orderItems[i].ItemId;
            var taxOrderItem = orderItems[i];
            if (itemCode == taxOrderItemCode) {
                Object.assign(taxOrderItem, {
                    "tax_data_xml": taxDataXml,
                    "tax_ship_data_xml": taxShipDataXml,
                    "gstTax": gstTax
                });
            }

        }
    }


};