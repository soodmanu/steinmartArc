module.exports = function(context, callback) {
    var searchResource = require('mozu-node-sdk/clients/commerce/catalog/storefront/productSearchResult')(context);
    searchResource.context['user-claims'] = null;
    try {
		
		console.log("items",context.request.path);
		
        var originalSlug = context.request.path;
        var newSlug = originalSlug.replace(/[^0-9]+/g, '');
        console.log('original slug', originalSlug);
        console.log('new slug', newSlug);
        searchResource.search({
            filter:'seoSlug eq ' + newSlug,
            pageSize: 1
        })
        .then(function(resp){
            console.log('resp', resp);
            var redirectUrl = '/product-landing';
            if (context.request.path ) {
                redirectUrl = '/p/' + newSlug;
                console.log('redirectUrl', redirectUrl);
            }
            context.response.redirect(redirectUrl);
            callback();
        }, function(err){
            console.log('err', err);
            context.response.redirect('/product-landing');
            callback();
        });
    }
    catch(e) {
        console.log('e', e);
        context.response.redirect('/product-landing');
        callback();
    }
};