var needle = require('needle');
var async = require('async');
var _ = require('underscore');
var apiContext = require('mozu-node-sdk/clients/platform/application')();
var accountAttrDefinition = require('mozu-node-sdk/clients/commerce/customer/attributedefinition/attribute')(apiContext);
var accountAttributes = require('mozu-node-sdk/clients/commerce/customer/accounts/customerAttribute')(apiContext);
accountAttrDefinition.context['user-claims'] = null;
accountAttributes.context['user-claims'] = null;

module.exports = function(context, callback) {
	var requestFor = context.request.body.requestFor ? context.request.body.requestFor : '';
	console.log("Request for : '"+requestFor+"'");
	console.log("request For : "+JSON.stringify(context.request.body));
	var themeSettings = JSON.parse(JSON.stringify(context.items.siteContext.themeSettings));

	if(requestFor === 'ccpaInfo') {
		console.log("In CCPA Part");
		var accountId = context.request.body.accountId;
		var cookieInfo = context.request.body.cookieInfo;
		var attributeDefinitionId = '';
		accountAttrDefinition.getAttribute({attributeFQN:'tenant~ccpa-detail'}).then(function (attr) {
			console.log("Account : "+JSON.stringify(attr));
			attributeDefinitionId = attr.id;
			context.response.body = "Success";
			console.log("Get Definition Id success : "+attributeDefinitionId);

			accountAttributes.getAccountAttribute({accountId:accountId,attributeFQN:'tenant~ccpa-detail'}).then(function (accntAttr){
				console.log("Account Attribute :"+JSON.stringify(accntAttr));
				accountAttributes.updateAccountAttribute({accountId:accountId, attributeFQN:"tenant~ccpa-detail"},
				{
					body:{
			            attributeDefinitionId: attributeDefinitionId,
				        fullyQualifiedName: "tenant~ccpa-detail",
				        values:[cookieInfo]
			        }
				}).then(function (res){
					console.log("Locations :"+JSON.stringify(res));
					context.response.body = data;
					callback();
				}).catch(function(error){
					console.log("Error");
					console.log(JSON.stringify(error));
					context.response.body = "FAILED";
				    callback();
				});
			}).catch(function(error){
				console.log("Error");
				console.log(JSON.stringify(error));
				accountAttributes.addAccountAttribute({accountId:accountId},
				{
					body:{
			            attributeDefinitionId: attributeDefinitionId,
				        fullyQualifiedName: "tenant~ccpa-detail",
				        values:[cookieInfo]
			        }
				}).then(function (res){
					console.log("Success Add attribute :"+JSON.stringify(res));
					callback();
				}).catch(function(error){
					console.log(JSON.stringify(error));
					context.response.body = "FAILED";
					callback();
				});
			});
			// callback();
		}).catch(function(error) {
			console.error(error);
			context.response.body = "Errored";
		    callback();
		});

	} else {
		console.log("ELSE CCPA Part");
		var details = context.request.body;
		console.log("Body : "+details);
		console.log("Code : "+details.prodCode);
		var prodCode = details.prodCode;
		var url = "https://costplus-harmon.baynote.net/recs/1/costplus_harmon?&attrs=Price&attrs=ProductId&attrs=ThumbUrl&attrs=Title&attrs=url&attrs=ProductCode&productId="+prodCode+"&page=pdp&format=json";
		needle.get(url,function(err, response, body){
		    var data = _.filter(body.widgetResults, function(arr) {
		    	return arr.id === "quickview";
		    });
		    console.log("Success : "+JSON.stringify(data));
		    context.response.body = data;
		    console.log("Body : "+context.response.body);
		    callback();
		}, function(err) {
			console.log("Error : "+JSON.stringify(err));
		    context.response.body = "FAILED";
		    callback();
		});
	}


};