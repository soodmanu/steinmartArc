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

var xml2js = require('xml2js');
var parseString = require('xml2js').parseString;
module.exports = function(context, callback) {
console.log("sood");
var themeSettings = JSON.parse(JSON.stringify(context.items.siteContext.themeSettings));
	console.log("JSON : "+JSON.stringify(themeSettings));
var obj = {
  'InStoreQuantityRequestMessage': {
    $: {
      'xmlns': 'http://api.gsicommerce.com/schema/checkout/1.0',
	  'itemId':'25-21881818'
    },
    'StoreFrontId':"391-180"
    
  }
};

var builder = new xml2js.Builder();
var xmlDoc = builder.buildObject(obj);
console.log(xmlDoc);

var https = require("https");
var options = {
                 method : 'POST',
				 hostname: 'uat01-epapi-na.gsipartners.com',
                 path: '/v1.0/stores/SMTUS/inventory/quantity/instore/get.xml',				 
				 headers: {'apiKey':'w7fRGlH0IDTznzIgOl9KfWFfggkUkI62',
				'Content-Type':'application/xml;charset=UTF-8;'},
				'connection':'keep-alive',
				'content-length':xmlDoc.length,
				};
                  var data = '';
				  
                  call = function(response) {
                    var str = '';
                    response.on('data', function (chunk) {
                      data += chunk;
                    });
                    response.on('end', function(){
                     
                      parseString(data, function (err, result) {
                           console.log("result : "+JSON.stringify(result));
                          
                     }); 
					 callback();
                    });
                  };
                  var post_req = https.request(options, call);
                  post_req.write(xmlDoc);
                  post_req.end();
				  
};