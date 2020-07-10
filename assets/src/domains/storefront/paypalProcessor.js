/**
 * Implementation for http.storefront.routes


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
var paypal = require('../../paypal/checkout');
var helper = require('../../paypal/helper');
var Guid = require("easy-guid");

function setError(err, context, errorRedirectUrl) {
	console.log("Paypal Storefront before error", err);
	cache = context.cache.getOrCreate({ type: 'distributed', scope: 'tenant', level: 'shared' });
	var guid = Guid.new(16);
	cache.set("PPE-" + guid, err);

	context.response.redirect(errorRedirectUrl + "?ppErrorId=" + guid);
	context.response.end();
	//callback();

}

module.exports = function (context, callback) {
	console.log("inside get checkoutexpress");
	var self = this;
	var isPaypalCheckout = helper.isPayPalCheckout(context);
	
	if (!isPaypalCheckout) return callback();
	
	var queryString = helper.parseUrl(context);
	var isCart = queryString.isCart == "1";
	var defaultRedirect = "/cart";
	var id = queryString.id.split("|")[0];
	if (queryString.id.split("|").length > 1) {
		isCart = true;
	}
	paypal.checkUserSession(context);

	paypal.getCheckoutSettings(context).then(function (settings) {
		try {
			var checkoutUrl = (settings.isMultishipEnabled) ? '/checkoutv2/' : '/checkout/';
			var errorRedirectUrl = (isCart ? defaultRedirect : checkoutUrl + id);
			console.log("inside get checkoutexpress"+isPaypalCheckout);
			paypal.process(context, queryString, isCart, false).then(function (data) {
				var queryStringParams = helper.parseUrl(context);
				var paramsToPreserve = helper.getParamsToPreserve(queryStringParams);
				var redirectUrl = checkoutUrl + data.order.id;
				if (paramsToPreserve) redirectUrl += '?' + paramsToPreserve;
				context.response.redirect(redirectUrl);
				context.response.end();
			}).catch(function (err) {
				setError(err, context, errorRedirectUrl);
			});
		} catch (err) {
			setError(err, context, (isCart ? defaultRedirect : (settings.isMultishipEnabled) ? '/checkoutv2/' : '/checkout/' + id));
		}
	}).catch(function (err) {
		console.log(err);
		setError(err, context, defaultRedirect);
	});
};