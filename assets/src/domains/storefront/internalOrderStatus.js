var _ = require('underscore');
module.exports = function (context, callback) {
    if (context.request.query && context.request.query.orderNumber && context.request.query.orderNumber !== '') {
        var searchedOrderNumber = context.request.query.orderNumber;
        searchedOrderNumber = searchedOrderNumber.trim();
        var filter = 'orderNumber eq ' + searchedOrderNumber + ' or externalId eq ' + searchedOrderNumber;
        var orderResource = require('mozu-node-sdk/clients/commerce/order')(context);
        orderResource.context['user-claims'] = null;
        orderResource.getOrders({
            'pageSize': 1,
            'filter': filter
        }).then(function (resp) {
            if (resp.totalCount > 0) {
                var order = resp.items[0];
                console.log('Order Found', order);
                var billingZipCode;
                if (order.billingInfo && order.billingInfo.billingContact && order.billingInfo.billingContact.address && order.billingInfo.billingContact.address.postalOrZipCode) {
                    billingZipCode = order.billingInfo.billingContact.address.postalOrZipCode;
                }
                context.response.body = {
                    'orderNumber': order.orderNumber,
                    'orderParentNumber': order.parentCheckoutNumber,
                    'externalId': order.externalId,
                    'status': order.status,
                    'billingZipCode': billingZipCode,
                    'customerAccountId': order.customerAccountId
                };
                callback();
            }
            else {
                context.response.body = {
                    'STATUS': 'ERROR',
                    'message': 'No Order Found'
                };
                callback();
            }
        }, function (err0) {
            console.log('err0', err0);
            context.response.body = {
                'STATUS': 'ERROR',
                'message': 'Something went Wrong 1!!'
            };
            callback();
        }, function (err1) {
            console.log('err1', err1);
            context.response.body = {
                'STATUS': 'ERROR',
                'message': 'Something went Wrong 2!!'
            };
            callback();
        });
    }
    else {
        context.response.body = {
            'STATUS': 'ERROR',
            'message': 'Something went Wrong!!'
        };
        callback();
    }
};