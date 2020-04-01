module.exports = {
  
  'http.storefront.pages.productDetails.request.after': {
      actionName: 'http.storefront.pages.productDetails.request.after',
      customFunction: require('./domains/storefront/http.storefront.pages.productDetails.request.after')
  },
  
  'http.storefront.pages.checkout.request.after': {
      actionName: 'http.storefront.pages.checkout.request.after',
      customFunction: require('./domains/storefront/http.storefront.pages.checkout.request.after')
  },
  
  'http.storefront.pages.orderConfirmation.request.before': {
      actionName: 'http.storefront.pages.orderConfirmation.request.before',
      customFunction: require('./domains/storefront/http.storefront.pages.orderConfirmation.request.before')
  },
  
  'http.storefront.pages.orderConfirmation.request.after': {
      actionName: 'http.storefront.pages.orderConfirmation.request.after',
      customFunction: require('./domains/storefront/http.storefront.pages.orderConfirmation.request.after')
  }
};
