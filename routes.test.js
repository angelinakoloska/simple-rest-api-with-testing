const express = require("express");
const serverRoutes = require("./routes");
const request = require("supertest");
const app = express();
const { save } = require("./save_json");
const bodyParser = require("body-parser");

jest.mock("./countries.json", () => [
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
  }
])
jest.mock("./save_json", () => ({
  save: jest.fn(),
}));

app.use(bodyParser.json());
app.use("/countries", serverRoutes);
let firstCountry;

describe("testing-server-routes", () => {
  test("POST /countries - success", async () => {
    let countryObj = {
      code: "IT",
      name: "Italy",
      capital: "Rome"
    }
    const { body } = await request(app).post("/countries").send(countryObj);
    expect(body).toEqual({
      status: "success",
      countryInfo: {
        code: "IT",
        name: "Italy",
        capital: "Rome"
      },
    });
    expect(save).toHaveBeenCalledWith([
      {
        short: "EN",
        name: "England",
        capital: "London"
      },
      {
        short: "DE",
        name: "Germany",
        capital: "Berlin"
      },
      {
        short: "PL",
        name: "Poland",
        capital: "Warsaw"
      },
      {
        code: "IT",
        name: "Italy",
        capital: "Rome"
      }
    ]);
  });
  test("GET /countries - success", async () => {
    const { body } = await request(app).get("/countries");
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
        "code": "IT",
        "name": "Italy",
        "capital": "Rome"
      }
    ]);
    firstCountry = body[0];
  });

  test("GET /countries/England - success", async () => {
    const { body } = await request(app).get(`/countries/${firstCountry.name}`);
    expect(body).toEqual(firstCountry);
  });
  test("PUT /countries/Poland - success", async () => {
    let countryObj = {
      short: "PL",
      name: "Poland",
      capital: "Cracow"
    };
    const response = await request(app).put("/countries/Poland").send(countryObj);
    expect(response.body).toEqual({
      status: "success",
      countryInfo: {
        short: "PL",
        name: "Poland",
        capital: "Cracow"
      },
    });
    expect(save).toHaveBeenCalledWith([
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
        "capital": "Cracow"
      },
      {
        "code": "IT",
        "name": "Italy",
        "capital": "Rome"
      }
    ]);
    expect(response.statusCode).toEqual(200);
  });
  test("DELETE /countries/Poland - success", async () => {
    const { body } = await request(app).delete("/countries/Poland");
    expect(body).toEqual({
      status: "success",
      removed: "Poland",
      newLength: 3,
    });
    expect(save).toHaveBeenCalledWith([
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
        "code": "IT",
        "name": "Italy",
        "capital": "Rome"
      }
    ]);
  });
});