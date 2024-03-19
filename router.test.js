const express = require("express");
const serverRoutes = require("./routes");
const request = require("supertest");

const app = express();
app.use("/countries", serverRoutes);

describe('testing-server-routes', () => {
    test('GET /countries - success', async () => {
      const { body } = await request(app).get('/countries');
      expect(body).toEqual([
        {
          "short": "EN",
          "name": "England",
          "capital": "London"
        },
        {
          "short": "DE",
          "name": "Germany",
          "capital": "Berlin"
        },
        {
          "short": "PL",
          "name": "Poland",
          "capital": "Warsaw"
        },
        {
          "short": "IT",
          "name": "Italy",
          "capital": "Rome"
        }
      ]);
    });
});
  