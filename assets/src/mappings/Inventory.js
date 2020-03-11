var Inventory_Module_Factory = function () {
  var Inventory = {
    name: 'Inventory',
    typeInfos: [{
        localName: 'TaxGroup',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'TaxGroup'
        },
        propertyInfos: [{
            name: 'tax',
            required: true,
            collection: true,
            elementName: {
              localPart: 'Tax'
            },
            typeInfo: '.Tax'
          }]
      }, {
        localName: 'QuantityResponseMessage',
        typeName: null,
        propertyInfos: [{
            name: 'quantityResponse',
            required: true,
            collection: true,
            elementName: {
              localPart: 'QuantityResponse'
            },
            typeInfo: '.QuantityResponse'
          }]
      }, {
        localName: 'EmptyReceivedElementType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'EmptyReceivedElementType'
        }
      }, {
        localName: 'MailingAddress',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'MailingAddress'
        },
        propertyInfos: [{
            name: 'personName',
            required: true,
            elementName: {
              localPart: 'PersonName'
            },
            typeInfo: '.PersonNameType'
          }, {
            name: 'address',
            required: true,
            elementName: {
              localPart: 'Address'
            },
            typeInfo: '.PhysicalAddressType'
          }]
      }, {
        localName: 'FulfillmentLocationId',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'FulfillmentLocationId'
        },
        propertyInfos: [{
            name: 'value',
            type: 'value'
          }, {
            name: 'type',
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Jurisdiction',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'Jurisdiction'
        },
        propertyInfos: [{
            name: 'value',
            type: 'value'
          }, {
            name: 'jurisdictionLevel',
            attributeName: {
              localPart: 'jurisdictionLevel'
            },
            type: 'attribute'
          }, {
            name: 'jurisdictionId',
            attributeName: {
              localPart: 'jurisdictionId'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'AckReplyType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'AckReplyType'
        },
        propertyInfos: [{
            name: 'received',
            required: true,
            elementName: {
              localPart: 'Received'
            },
            typeInfo: '.EmptyReceivedElementType'
          }, {
            name: 'any',
            minOccurs: 0,
            collection: true,
            allowTypedObject: false,
            mixed: false,
            type: 'anyElement'
          }]
      }, {
        localName: 'InvoiceTextCodes',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'InvoiceTextCodes'
        },
        propertyInfos: [{
            name: 'invoiceTextCode',
            required: true,
            collection: true,
            elementName: {
              localPart: 'InvoiceTextCode'
            }
          }]
      }, {
        localName: 'ShipmentDetails',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'ShipmentDetails'
        },
        propertyInfos: [{
            name: 'shippingMethod',
            required: true,
            elementName: {
              localPart: 'ShippingMethod'
            },
            typeInfo: '.CarrierType'
          }, {
            name: 'shipToAddress',
            required: true,
            elementName: {
              localPart: 'ShipToAddress'
            },
            typeInfo: '.PhysicalAddressType'
          }]
      }, {
        localName: 'InStorePickupDetails',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'InStorePickupDetails'
        },
        propertyInfos: [{
            name: 'storeFrontId',
            required: true,
            elementName: {
              localPart: 'StoreFrontId'
            }
          }, {
            name: 'storeFrontName',
            required: true,
            elementName: {
              localPart: 'StoreFrontName'
            }
          }, {
            name: 'storeFrontAddress',
            required: true,
            elementName: {
              localPart: 'StoreFrontAddress'
            },
            typeInfo: '.PhysicalAddressType'
          }]
      }, {
        localName: 'DateRange',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'DateRange'
        },
        propertyInfos: [{
            name: 'from',
            required: true,
            elementName: {
              localPart: 'From'
            },
            typeInfo: 'Date'
          }, {
            name: 'to',
            required: true,
            elementName: {
              localPart: 'To'
            },
            typeInfo: 'Date'
          }]
      }, {
        localName: 'Tax',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'Tax'
        },
        propertyInfos: [{
            name: 'situs',
            elementName: {
              localPart: 'Situs'
            }
          }, {
            name: 'jurisdiction',
            elementName: {
              localPart: 'Jurisdiction'
            },
            typeInfo: '.Jurisdiction'
          }, {
            name: 'imposition',
            elementName: {
              localPart: 'Imposition'
            },
            typeInfo: '.Imposition'
          }, {
            name: 'effectiveRate',
            elementName: {
              localPart: 'EffectiveRate'
            },
            typeInfo: 'Decimal'
          }, {
            name: 'taxableAmount',
            elementName: {
              localPart: 'TaxableAmount'
            },
            typeInfo: 'Decimal'
          }, {
            name: 'exemptAmount',
            elementName: {
              localPart: 'ExemptAmount'
            },
            typeInfo: 'Decimal'
          }, {
            name: 'nonTaxableAmount',
            elementName: {
              localPart: 'NonTaxableAmount'
            },
            typeInfo: 'Decimal'
          }, {
            name: 'calculatedTax',
            elementName: {
              localPart: 'CalculatedTax'
            },
            typeInfo: 'Decimal'
          }, {
            name: 'sellerRegistrationId',
            elementName: {
              localPart: 'SellerRegistrationId'
            }
          }, {
            name: 'invoiceTextCodes',
            elementName: {
              localPart: 'InvoiceTextCodes'
            },
            typeInfo: '.InvoiceTextCodes'
          }, {
            name: 'extension',
            elementName: {
              localPart: 'Extension'
            },
            typeInfo: '.ExtensionType'
          }, {
            name: 'taxType',
            attributeName: {
              localPart: 'taxType'
            },
            type: 'attribute'
          }, {
            name: 'taxability',
            attributeName: {
              localPart: 'taxability'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'PhysicalAddressType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'PhysicalAddressType'
        },
        propertyInfos: [{
            name: 'line1',
            required: true,
            elementName: {
              localPart: 'Line1'
            }
          }, {
            name: 'line2',
            elementName: {
              localPart: 'Line2'
            }
          }, {
            name: 'line3',
            elementName: {
              localPart: 'Line3'
            }
          }, {
            name: 'line4',
            elementName: {
              localPart: 'Line4'
            }
          }, {
            name: 'city',
            required: true,
            elementName: {
              localPart: 'City'
            }
          }, {
            name: 'mainDivision',
            elementName: {
              localPart: 'MainDivision'
            }
          }, {
            name: 'countryCode',
            required: true,
            elementName: {
              localPart: 'CountryCode'
            }
          }, {
            name: 'postalCode',
            elementName: {
              localPart: 'PostalCode'
            }
          }, {
            name: 'extension',
            elementName: {
              localPart: 'Extension'
            },
            typeInfo: '.ExtensionType'
          }]
      }, {
        localName: 'DateRangeType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'DateRangeType'
        },
        propertyInfos: [{
            name: 'from',
            required: true,
            elementName: {
              localPart: 'From'
            },
            typeInfo: 'DateTime'
          }, {
            name: 'to',
            required: true,
            elementName: {
              localPart: 'To'
            },
            typeInfo: 'DateTime'
          }]
      }, {
        localName: 'QuantityResponse',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'QuantityResponse'
        },
        propertyInfos: [{
            name: 'fulfillmentLocationId',
            elementName: {
              localPart: 'FulfillmentLocationId'
            },
            typeInfo: '.FulfillmentLocationId'
          }, {
            name: 'quantity',
            required: true,
            elementName: {
              localPart: 'Quantity'
            },
            typeInfo: 'Int'
          }, {
            name: 'lineId',
            required: true,
            attributeName: {
              localPart: 'lineId'
            },
            type: 'attribute'
          }, {
            name: 'itemId',
            required: true,
            attributeName: {
              localPart: 'itemId'
            },
            type: 'attribute'
          }, {
            name: 'sessionId',
            attributeName: {
              localPart: 'sessionId'
            },
            type: 'attribute'
          }, {
            name: 'fault',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'fault'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'InventoryLine',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'InventoryLine'
        },
        propertyInfos: [{
            name: 'quantity',
            required: true,
            elementName: {
              localPart: 'Quantity'
            },
            typeInfo: 'Int'
          }, {
            name: 'shipmentDetails',
            required: true,
            elementName: {
              localPart: 'ShipmentDetails'
            },
            typeInfo: '.ShipmentDetails'
          }, {
            name: 'inStorePickupDetails',
            required: true,
            elementName: {
              localPart: 'InStorePickupDetails'
            },
            typeInfo: '.InStorePickupDetails'
          }, {
            name: 'giftwrapRequested',
            elementName: {
              localPart: 'GiftwrapRequested'
            },
            typeInfo: 'Boolean'
          }, {
            name: 'lineId',
            required: true,
            attributeName: {
              localPart: 'lineId'
            },
            type: 'attribute'
          }, {
            name: 'itemId',
            required: true,
            attributeName: {
              localPart: 'itemId'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'PersonNameType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'PersonNameType'
        },
        propertyInfos: [{
            name: 'honorific',
            elementName: {
              localPart: 'Honorific'
            }
          }, {
            name: 'lastName',
            required: true,
            elementName: {
              localPart: 'LastName'
            }
          }, {
            name: 'middleName',
            elementName: {
              localPart: 'MiddleName'
            }
          }, {
            name: 'firstName',
            required: true,
            elementName: {
              localPart: 'FirstName'
            }
          }, {
            name: 'any',
            minOccurs: 0,
            collection: true,
            allowTypedObject: false,
            mixed: false,
            type: 'anyElement'
          }]
      }, {
        localName: 'Imposition',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'Imposition'
        },
        propertyInfos: [{
            name: 'value',
            type: 'value'
          }, {
            name: 'impositionType',
            attributeName: {
              localPart: 'impositionType'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'TaxData',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'TaxData'
        },
        propertyInfos: [{
            name: 'taxClass',
            elementName: {
              localPart: 'TaxClass'
            }
          }, {
            name: 'taxes',
            elementName: {
              localPart: 'Taxes'
            },
            typeInfo: '.TaxGroup'
          }, {
            name: 'extension',
            elementName: {
              localPart: 'Extension'
            },
            typeInfo: '.ExtensionType'
          }]
      }, {
        localName: 'DeliveryEstimate',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'DeliveryEstimate'
        },
        propertyInfos: [{
            name: 'deliveryWindow',
            required: true,
            elementName: {
              localPart: 'DeliveryWindow'
            },
            typeInfo: '.DateRangeType'
          }, {
            name: 'shippingWindow',
            required: true,
            elementName: {
              localPart: 'ShippingWindow'
            },
            typeInfo: '.DateRangeType'
          }, {
            name: 'creationTime',
            required: true,
            elementName: {
              localPart: 'CreationTime'
            },
            typeInfo: 'DateTime'
          }, {
            name: 'display',
            required: true,
            elementName: {
              localPart: 'Display'
            },
            typeInfo: 'Boolean'
          }, {
            name: 'message',
            elementName: {
              localPart: 'Message'
            }
          }]
      }, {
        localName: 'QuantityRequest',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'QuantityRequest'
        },
        propertyInfos: [{
            name: 'fulfillmentLocationId',
            elementName: {
              localPart: 'FulfillmentLocationId'
            },
            typeInfo: '.FulfillmentLocationId'
          }, {
            name: 'lineId',
            required: true,
            attributeName: {
              localPart: 'lineId'
            },
            type: 'attribute'
          }, {
            name: 'itemId',
            required: true,
            attributeName: {
              localPart: 'itemId'
            },
            type: 'attribute'
          }, {
            name: 'sessionId',
            attributeName: {
              localPart: 'sessionId'
            },
            type: 'attribute'
          }, {
            name: 'isBundleParent',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'isBundleParent'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'CarrierType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'CarrierType'
        },
        propertyInfos: [{
            name: 'value',
            type: 'value'
          }, {
            name: 'mode',
            attributeName: {
              localPart: 'mode'
            },
            type: 'attribute'
          }, {
            name: 'displayText',
            attributeName: {
              localPart: 'displayText'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ExtensionType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'ExtensionType'
        },
        propertyInfos: [{
            name: 'any',
            minOccurs: 0,
            collection: true,
            mixed: false,
            type: 'anyElement'
          }]
      }, {
        localName: 'QuantityRequestMessage',
        typeName: {
		  prefix: '',
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'QuantityRequestMessage'
        },
        propertyInfos: [{
            name: 'quantityRequest',
            required: true,
            collection: true,
            elementName: {
              localPart: 'QuantityRequest'
            },
            typeInfo: '.QuantityRequest'
          }, {
            name: 'reportLineErrors',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'reportLineErrors'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'DestinationTargetType',
        typeName: {
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0',
          localPart: 'DestinationTargetType'
        },
        propertyInfos: [{
            name: 'ref',
            typeInfo: 'IDREF',
            attributeName: {
              localPart: 'ref'
            },
            type: 'attribute'
          }]
      }, {
        type: 'enumInfo',
        localName: 'TaxType',
        values: ['SALES', 'SELLER_USE', 'CONSUMERS_USE', 'VAT', 'IMPORT_VAT', 'NONE']
      }, {
        type: 'enumInfo',
        localName: 'FulfillmentLocationType',
        values: ['ISPU']
      }, {
        type: 'enumInfo',
        localName: 'Taxability',
        values: ['TAXABLE', 'NONTAXABLE', 'EXEMPT', 'DPPAPPLIED', 'NO_TAX', 'DEFERRED']
      }],
    elementInfos: [{
        elementName: {
          localPart: 'AckReply',
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0'
        },
        typeInfo: '.AckReplyType'
      }, {
        elementName: {
          localPart: 'QuantityRequestMessage',
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0'
        },
        typeInfo: '.QuantityRequestMessage'
      }, {
        elementName: {
          localPart: 'QuantityResponseMessage',
          namespaceURI: 'http:\/\/api.gsicommerce.com\/schema\/checkout\/1.0'
        },
        typeInfo: '.QuantityResponseMessage'
      }]
  };
  return {
    Inventory: Inventory
  };
};
if (typeof define === 'function' && define.amd) {
  define([], Inventory_Module_Factory);
}
else {
  var Inventory_Module = Inventory_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.Inventory = Inventory_Module.Inventory;
  }
  else {
    var Inventory = Inventory_Module.Inventory;
  }
}