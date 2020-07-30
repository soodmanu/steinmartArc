/**
 * Implementation for embedded.commerce.payments.action.before

 * This custom function will receive the following context object:
{
  "exec": {
    "setActionAmount": {
      "parameters": [
        {
          "name": "amount",
          "type": "number"
        }
      ],
      "return": {
        "type": "mozu.commerceRuntime.contracts.payments.paymentAction"
      }
    },
    "setPaymentData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": "object"
        }
      ]
    },
    "removePaymentData": {
      "parameters": [
        {
          "name": "key",
          "type": "string"
        }
      ]
    },
    "setActionPreAuthFlag": {
      "parameters": [
        {
          "name": "isPreAuth",
          "type": "bool"
        }
      ]
    }
  },
  "setPaymentTerm": {
    "parameters": [
      {
        "name": "purchaseOrderPaymentTermObject",
        "type": "object"
      }
    ],
    "return": {
      "type": "mozu.commerceRuntime.contracts.payments.purchaseorderpaymentterm"
    }
  },
  "get": {
    "payment": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.payments.payment"
      }
    },
    "paymentAction": {
      "parameters": [],
      "return": {
        "type": "mozu.commerceRuntime.contracts.payments.paymentAction"
      }
    }
  }
}


 */

module.exports = function(context, callback) {
	console.log("payment");
	var payment = context.get.payment();
	
    var ngOrder = context.get.order();
	console.log("Order2:"+ngOrder.fulfillmentInfo.fulfillmentContact);
	if(ngOrder.fulfillmentInfo.fulfillmentContact !== null && ngOrder.fulfillmentInfo.fulfillmentContact !== undefined){
	console.log("Order2:"+ngOrder.fulfillmentInfo.fulfillmentContact.address.address1);
	console.log("Order:"+ngOrder.fulfillmentInfo.fulfillmentContact.firstName);
	console.log("Order:"+ngOrder.fulfillmentInfo.fulfillmentContact.lastNameOrSurname);
	console.log("order:"+ngOrder.fulfillmentInfo.fulfillmentContact.phoneNumbers.home);
	var shippingData = {
      "shipping": {
		"firstName": ngOrder.fulfillmentInfo.fulfillmentContact.firstName,
		"lastName": ngOrder.fulfillmentInfo.fulfillmentContact.lastNameOrSurname,
		"phoneNumber":ngOrder.fulfillmentInfo.fulfillmentContact.phoneNumbers.home,
        "address1": ngOrder.fulfillmentInfo.fulfillmentContact.address.address1,
        "address2": ngOrder.fulfillmentInfo.fulfillmentContact.address.address2,
        "cityOrTown": ngOrder.fulfillmentInfo.fulfillmentContact.address.cityOrTown,
        "postalOrZipCode": ngOrder.fulfillmentInfo.fulfillmentContact.address.postalOrZipCode,
        "countryCode": ngOrder.fulfillmentInfo.fulfillmentContact.address.countryCode,
        "stateOrProvince": ngOrder.fulfillmentInfo.fulfillmentContact.address.stateOrProvince
      }
	};
		console.log("Payment:",payment);
		context.exec.setPaymentData("shippingData",shippingData);
	}
	callback();
};