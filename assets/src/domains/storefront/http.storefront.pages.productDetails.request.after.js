/**
 * Implementation for http.storefront.pages.productDetails.request.after


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

var Jsonix = require('jsonix').Jsonix;
//var Inventory = require('../../mappings/Inventory').Inventory;
module.exports = function(context, callback) {
console.log("sood");
var xmlUrl ="https://uat01-epapi-na.gsipartners.com/v1.0/stores/SMTUS/inventory/quantity/get.xml";



//var context2 = new Jsonix.Context([Inventory]);

/*var marshaller = context.createMarshaller();
var unmarshaller = context.createUnmarshaller();
 
// Marshal a JavaScript Object as XML (DOM Document)
var doc = {
    name: {
		prefix:"",
        localPart: "QuantityRequestMessage",
		namespaceURI: "http://api.gsicommerce.com/schema/checkout/1.0"
    },
    value: {
        quantityRequest:[
			{
			 itemId :  "25-66906215",
			 lineId :"L7965603"
			}
			]
		}
    };



var marshalledXML = '<?xml version='+'"1.0"'+ ' encoding='+'"UTF-8"'+'?><InStoreQuantityRequestMessage xmlns='+
'"http://api.gsicommerce.com/schema/checkout/1.0" itemId='+'"25-21881818"'+'><StoreFrontId>391-180</StoreFrontId></InStoreQuantityRequestMessage>';
var xmlrequest = marshaller.marshalString(doc);

var res = xmlrequest.replace("p0:", "");
res = res.replace(":p0", "");
console.log(res);


var unmarshallRequest = unmarshaller.unmarshalString(xmlrequest);
console.log(unmarshallRequest);

Jsonix.DOM.load(xmlUrl, function(result){
	console.log(""+result);
}, 
{method : 'POST', headers: {'apiKey':'w7fRGlH0IDTznzIgOl9KfWFfggkUkI62',
'Content-Type':'application/xml;charset=UTF-8;'},
'connection':'keep-alive',
'async':'false',
'content-length':res.length,
data: res
});*/
callback();
};