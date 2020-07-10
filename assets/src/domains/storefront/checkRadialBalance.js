/*
 * Implementation for checkRadialBalance
 */
var creditClient = require("mozu-node-sdk/clients/commerce/customer/credit");
var creditTransactionResource = require('mozu-node-sdk/clients/commerce/customer/credits/creditTransaction');
var soap = require('tinysoap');
var stringConstructor = "test".constructor;
var arrayConstructor = [].constructor;
var objectConstructor = {}.constructor;
soap.WSDL.prototype.objectToXML = function (obj, name, namespace, xmlns) {
    var self = this,
        parts = [],
        xmlnsAttrib = false ? ' xmlns:' + namespace + '="' + xmlns + '"' + ' xmlns="' + xmlns + '"' : '',
        ns = namespace ? namespace + ':' : '';

    if (obj.constructor === arrayConstructor) {
        for (var i = 0; i < obj.length; i++) {
            var item = obj[i];
            if (i > 0) {
                parts.push(['</', ns, name, '>'].join(''));
                parts.push(['<', ns, name, xmlnsAttrib, '>'].join(''));
            }
            parts.push(self.objectToXML(item, name));
        }
    } else if (obj.constructor === objectConstructor) {
        for (var key in obj) {
            var child = obj[key];
            parts.push(['<', ns, key, xmlnsAttrib, '>'].join(''));
            parts.push(self.objectToXML(child, key, namespace, xmlns));
            parts.push(['</', ns, key, '>'].join(''));
        }
    } else if (obj) {
        parts.push(xmlEscape(obj));
    }
    return parts.join('');
};

function xmlEscape(obj) {
    if (obj.constructor === stringConstructor) {
        return obj
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    return obj;
}

module.exports = function (context, callback) {
    try {
        var code = context.request.query.code;
        if (code) {
            creditTransactionResource = creditTransactionResource(context);
            creditTransactionResource.context['user-claims'] = null;
            creditClient = creditClient(context);
            creditClient.context['user-claims'] = null;
            var pin = (code.length == 15) ? '000000' : '0000';
            var url = context.configuration.gsiURL;
            var gsiStoreCode = context.configuration.gsiStoreCode;
            var gsiCredential = context.configuration.gsiCredential;
            var args = {
                Header: {
                    Version: '1.0',
                    Iteration: '1',
                    CreateTime: '2018-09-18T13:07:30.138-07:00',
                    OrderId: '1',
                    StoreCode: gsiStoreCode,
                    Credential: gsiCredential
                },
                PaymentDetails: {
                    Tender: 'VP',
                    AccountNumber: code,
                    Pin: pin,
                    CurrencyCode: 'USD'
                }
            };
            soap.createClient(url, function (err, client) {
                console.log("args:" + JSON.stringify(args));
                if (!err) {
                    console.log("soap client created");
                    client.GiftCardBalance(args, function (err, result) {
                        console.log("result " + JSON.stringify(result));
                        if (!err) {
                            if (result.Balance) {
                                // check with Store credit exists. if yes, then udpate its credit
                                console.log("Now checking if SC exists in NG");
                                creditClient.getCredits({
                                    "filter": 'code eq ' + code,
                                }).then(function (ccFoundResponse) {
                                    if (ccFoundResponse.items.length > 0) {
                                        var creditStore = ccFoundResponse.items[0];
                                        console.log('creditStore', creditStore);
                                        var currentBalance = parseFloat(creditStore.currentBalance);
                                        var radialBalance = parseFloat(result.Balance);
                                        console.log('currentBalance: '+currentBalance +', radialBalance:' + radialBalance);
                                        var diff = (radialBalance - currentBalance).toFixed(2);
                                        console.log('diff', diff);
                                        if (diff === 0 || diff === '0.00') {
                                            context.response.body = {
                                                status: 'SUCCESS'
                                            };
                                            callback();
                                        }
                                        else {
                                            console.log('transaction resource created', code);
                                            creditTransactionResource.addTransaction({
                                                "code": code
                                            }, {
                                                body: {
                                                    "comments": "GSI Gift Card Balance " + ((diff > 0) ? 'Credit' : 'Debit'),
                                                    "impactAmount": diff,
                                                    "transactionType": (diff > 0) ? 'Credit' : 'Debit'
                                                }
                                            }).then(function () {
                                                context.response.body = {
                                                    status: 'SUCCESS'
                                                };
                                                callback();
                                            }, function (ccUpdateError) {
                                                console.log("ccUpdateError " + JSON.stringify(ccUpdateError));
                                                context.response.body = {
                                                    status: 'ERROR',
                                                    details: 'Update Failed'
                                                };
                                                callback();
                                            });
                                        }
                                    } else {
                                        creditClient.addCredit({
                                            "code": code,
                                            "creditType": "GiftCard",
                                            "currentBalance": result.Balance,
                                            "initialBalance": result.Balance,
                                        }).then(function () {
                                            context.response.body = {
                                                status: 'SUCCESS'
                                            };
                                            callback();
                                        }, function (ccAddError) {
                                            console.log("ccAddError ", JSON.stringify(ccAddError));
                                            context.response.body = {
                                                status: 'ERROR',
                                                details: 'Update Failed'
                                            };
                                            callback();
                                        });
                                    }
                                }, function (ccFoundError) {
                                    console.log("ccFoundError ", JSON.stringify(ccFoundError));
                                    context.response.body = {
                                        status: 'ERROR',
                                        details: 'CC Failed'
                                    };
                                    callback();
                                });
                            } else {
                                context.response.body = {
                                    status: 'ERROR',
                                    details: 'Radial Balance Failed'
                                };
                                callback();
                            }
                        } else {
                            console.log("error : " + err);
                            context.response.body = {
                                status: 'ERROR',
                                details: JSON.stringify(err)
                            };
                            callback();
                        }
                    });
                } else {
                    console.log("err : ", JSON.stringify(err));
                    context.response.body = {
                        status: 'ERROR',
                        details: JSON.stringify(err)
                    };
                    callback();
                }
            }, url);
        }
        else {
            context.response.body = {
                'status': 'ERROR',
                'message': JSON.stringify(e)
            };
            callback();
        }
    }
    catch(e) {
        context.response.body = {
            'status': 'ERROR',
            'message': JSON.stringify(e)
        };
        callback();
    }
};