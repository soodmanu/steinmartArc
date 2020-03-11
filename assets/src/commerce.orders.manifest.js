module.exports = {
  
  'embedded.commerce.orders.action.before': {
      actionName: 'embedded.commerce.orders.action.before',
      customFunction: require('./domains/commerce.orders/embedded.commerce.orders.action.before')
  },
  
  'embedded.commerce.orders.action.after': {
      actionName: 'embedded.commerce.orders.action.after',
      customFunction: require('./domains/commerce.orders/embedded.commerce.orders.action.after')
  },
  
  'http.commerce.orders.setFulFillmentInfo.before': {
      actionName: 'http.commerce.orders.setFulFillmentInfo.before',
      customFunction: require('./domains/commerce.orders/http.commerce.orders.setFulFillmentInfo.before')
  },
  
  'http.commerce.orders.setFulFillmentInfo.after': {
      actionName: 'http.commerce.orders.setFulFillmentInfo.after',
      customFunction: require('./domains/commerce.orders/http.commerce.orders.setFulFillmentInfo.after')
  },
  
  'http.commerce.orders.setBillingInfo.before': {
      actionName: 'http.commerce.orders.setBillingInfo.before',
      customFunction: require('./domains/commerce.orders/http.commerce.orders.setBillingInfo.before')
  },
  
  'http.commerce.orders.setBillingInfo.after': {
      actionName: 'http.commerce.orders.setBillingInfo.after',
      customFunction: require('./domains/commerce.orders/http.commerce.orders.setBillingInfo.after')
  }
};
