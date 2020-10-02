const test = require("ava");
const ky = require("ky-universal");
const createTestServer = require("create-test-server");
const { requestToSnakeCase, responseToCamelCase } = require("../dist");

let server;

test.before(async () => {
  server = await createTestServer();
});

const exempleBody = {
  "array-item": [
    {
      STRING_ITEM: "Hi",
      boolean_item: true,
      numberItem: 1,
    },
  ],
};

test("Request", async (t) => {
  server.post("/request", (req, res) => {
    t.deepEqual(req.body, {
      array_item: [
        {
          boolean_item: true,
          number_item: 1,
          string_item: "Hi",
        },
      ],
    });

    res.send(req.body);
  });

  await ky.post(`${server.url}/request`, {
    json: exempleBody,
    hooks: {
      beforeRequest: [requestToSnakeCase],
    },
  });
});

test("Response", async (t) => {
  server.get("/response", (req, res) => {
    res.send(exempleBody);
  });

  const response = await ky.get(`${server.url}/response`, {
    hooks: {
      afterResponse: [responseToCamelCase],
    },
  });

  const body = await response.json();

  t.deepEqual(body, {
    arrayItem: [
      {
        booleanItem: true,
        numberItem: 1,
        stringItem: "Hi",
      },
    ],
  });
});

test("Ignore UUID", async (t) => {
  server.get("/uuid", {
    "c97891f9-3cca-4a9b-b31c-e991d9cbe67e": true,
    "boolean-item": false,
  });

  const response = await ky.get(`${server.url}/uuid`, {
    hooks: {
      afterResponse: [responseToCamelCase],
    },
  });

  const body = await response.json();

  t.deepEqual(body, {
    "c97891f9-3cca-4a9b-b31c-e991d9cbe67e": true,
    booleanItem: false,
  });
});

test.after(async () => {
  await server.close();
});
