(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ky-hooks-change-case'] = {}, global.lodash));
}(this, (function (exports, lodash) { 'use strict';

  const uuidValidate = function (value) {
    const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    return regex.test(value);
  };

  const mapKeysDeep = function (obj, fn) {
    if (lodash.isArray(obj)) {
      return obj.map((item) => {
        return mapKeysDeep(item, fn);
      });
    }

    if (lodash.isPlainObject(obj)) {
      return Object.keys(obj).reduce((accumulator, key) => {
        const value = obj[key];
        const newKey = uuidValidate(key) ? key : fn(key);
        accumulator[newKey] = lodash.isObject(value) ? mapKeysDeep(value, fn) : value;
        return accumulator;
      }, {});
    }

    return obj;
  };

  function createRequestModify(modifier) {
    return async (request, options) => {
      if (options.body && !(options.body instanceof FormData)) {
        const body = JSON.parse(options.body);
        const convertedBody = mapKeysDeep(body, modifier);
        return new Request(request, { body: JSON.stringify(convertedBody) });
      }
    };
  }

  function createResponseModify(modifier) {
    return async (input, options, response) => {
      try {
        const body = await response.json();
        const convertedBody = mapKeysDeep(body, modifier);
        return new Response(JSON.stringify(convertedBody), response);
      } catch (e) {
        return;
      }
    };
  }

  const requestToSnakeCase = createRequestModify(lodash.snakeCase);
  const requestToCamelCase = createRequestModify(lodash.camelCase);
  const requestToKebabCase = createRequestModify(lodash.kebabCase);

  const responseToSnakeCase = createResponseModify(lodash.snakeCase);
  const responseToCamelCase = createResponseModify(lodash.camelCase);
  const responseToKebabCase = createResponseModify(lodash.kebabCase);

  exports.requestToCamelCase = requestToCamelCase;
  exports.requestToKebabCase = requestToKebabCase;
  exports.requestToSnakeCase = requestToSnakeCase;
  exports.responseToCamelCase = responseToCamelCase;
  exports.responseToKebabCase = responseToKebabCase;
  exports.responseToSnakeCase = responseToSnakeCase;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
