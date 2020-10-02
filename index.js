import {
  snakeCase,
  camelCase,
  kebabCase,
  isPlainObject,
  isObject,
  isArray,
} from "lodash";

const uuidValidate = function (value) {
  const regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  return regex.test(value);
};

const mapKeysDeep = function (obj, fn) {
  if (isArray(obj)) {
    return obj.map((item) => {
      return mapKeysDeep(item, fn);
    });
  }

  if (isPlainObject(obj)) {
    return Object.keys(obj).reduce((accumulator, key) => {
      const value = obj[key];
      const newKey = uuidValidate(key) ? key : fn(key);
      accumulator[newKey] = isObject(value) ? mapKeysDeep(value, fn) : value;
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

export const requestToSnakeCase = createRequestModify(snakeCase);
export const requestToCamelCase = createRequestModify(camelCase);
export const requestToKebabCase = createRequestModify(kebabCase);

export const responseToSnakeCase = createResponseModify(snakeCase);
export const responseToCamelCase = createResponseModify(camelCase);
export const responseToKebabCase = createResponseModify(kebabCase);
