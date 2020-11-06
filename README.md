# ky hooks change case

Allow modifications cases on requests and responses of the objects during the ky request

![Illustration exemple](https://raw.githubusercontent.com/alice-health/ky-hooks-change-case/main/media/illustration.png)

## Install

###### NPM

```
$ npm install @alice-health/ky-hooks-change-case
```

###### CDN

[unpkg](https://unpkg.com/@alice-health/ky-hooks-change-case)

## Usage

```js
import ky from "ky";
import {
  requestToSnakeCase,
  responseToCamelCase,
} from "@alice-health/ky-hooks-change-case";

ky.post(`${server.url}/path`, {
  json: { fooBar: true },
  hooks: {
    beforeRequest: [requestToSnakeCase],
    afterResponse: [responseToCamelCase],
  },
});
```

In the example above, the `requestToSnakeCase` method will convert the resquest body from `{fooBar: true}` to `{foo_bar: true}` and the response from `{response_body: false}` to `{responseBody: false}`. This way, the frontend and the backend API can each define their independent style guide.

## API

### Before request hooks

#### requestToSnakeCase

Convert the request body keys objects to `snake_case`.

#### requestToCamelCase

Convert the request body keys objects to `camelCase`.

#### requestToKebabCase

Convert the request body keys objects to `kebab-case`.

### After response hooks

#### responseToSnakeCase

Convert the response body keys objects to `snake_case`.

#### responseToCamelCase

Convert the response body keys objects to `camelCase`.

#### responseToKebabCase

Convert the response body keys objects to `kebab-case`.

## Browser support

The latest version of Chrome, Firefox, and Safari.

## Related

[ky](https://github.com/sindresorhus/ky) 🌳 Tiny & elegant HTTP client based on window.fetch
