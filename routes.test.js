const express = require("express");
const serverRoutes = require("./routes");
const request = require("supertest");

const app = express();

let firstCountry;
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
      firstCountry = body[0];
    });

    test('GET /countries/England - success', async () => {
      const { body } = await request(app).get(`/countries/${firstCountry.name}`);
      expect(body).toEqual(firstCountry)
    })
});
  