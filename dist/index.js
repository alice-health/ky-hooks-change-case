(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/snakeCase'), require('lodash/camelCase'), require('lodash/kebabCase'), require('lodash/isPlainObject'), require('lodash/isObject'), require('lodash/isArray')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash/snakeCase', 'lodash/camelCase', 'lodash/kebabCase', 'lodash/isPlainObject', 'lodash/isObject', 'lodash/isArray'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ky-hooks-change-case'] = {}, global.snakeCase, global.camelCase, global.kebabCase, global.isPlainObject, global.isObject, global.isArray));
}(this, (function (exports, snakeCase, camelCase, kebabCase, isPlainObject, isObject, isArray) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var snakeCase__default = /*#__PURE__*/_interopDefaultLegacy(snakeCase);
  var camelCase__default = /*#__PURE__*/_interopDefaultLegacy(camelCase);
  var kebabCase__default = /*#__PURE__*/_interopDefaultLegacy(kebabCase);
  var isPlainObject__default = /*#__PURE__*/_interopDefaultLegacy(isPlainObject);
  var isObject__default = /*#__PURE__*/_interopDefaultLegacy(isObject);
  var isArray__default = /*#__PURE__*/_interopDefaultLegacy(isArray);

  const uuidValidate = function (value) {
    const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    return regex.test(value);
  };

  const mapKeysDeep = function (obj, fn) {
    if (isArray__default['default'](obj)) {
      return obj.map((item) => {
        return mapKeysDeep(item, fn);
      });
    }

    if (isPlainObject__default['default'](obj)) {
      return Object.keys(obj).reduce((accumulator, key) => {
        const value = obj[key];
        const newKey = uuidValidate(key) ? key : fn(key);
        accumulator[newKey] = isObject__default['default'](value) ? mapKeysDeep(value, fn) : value;
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

  const requestToSnakeCase = createRequestModify(snakeCase__default['default']);
  const requestToCamelCase = createRequestModify(camelCase__default['default']);
  const requestToKebabCase = createRequestModify(kebabCase__default['default']);

  const responseToSnakeCase = createResponseModify(snakeCase__default['default']);
  const responseToCamelCase = createResponseModify(camelCase__default['default']);
  const responseToKebabCase = createResponseModify(kebabCase__default['default']);

  exports.requestToCamelCase = requestToCamelCase;
  exports.requestToKebabCase = requestToKebabCase;
  exports.requestToSnakeCase = requestToSnakeCase;
  exports.responseToCamelCase = responseToCamelCase;
  exports.responseToKebabCase = responseToKebabCase;
  exports.responseToSnakeCase = responseToSnakeCase;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
