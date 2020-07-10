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
  //var apiContext = require('mozu-node-sdk/clients/platform/application')();
  //var orderResourceClient = require("mozu-node-sdk/clients/commerce/orders/orderAttribute")(apiContext);
  module.exports = function(context, callback) {
	
   callback();
  
  };