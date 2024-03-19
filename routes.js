const { Router } = require("express");
const { save } = require("./save_json");
let countries = require("./countries.json");

const router = new Router();

router.get("/", (req, res) => {
  res.json(countries);
});

router.get("/:name", (req, res) => {
  const findCountry = countries.find((country) => country.name === req.params.name);
  if (!findCountry) {
    res.status(404).send("country with name was not found");
  } else {
    res.json(findCountry);
  }
});

router.post("/", (req, res) => {
  countries.push(req.body);
  save(countries);
  res.json({
    status: "success",
    countryInfo: req.body,
  });
});

router.put("/:name", (req, res) => {
  countries = countries.map((country) => {
    if (country.name === req.params.name) {
      return req.body;
    } else {
      return country;
    }
  });
  save(countries);

  res.json({
    status: "success",
    countryInfo: req.body,
  });
});

router.delete("/:name", (req, res) => {
  countries = countries.filter((country) => country.name !== req.params.name);
  save(countries);
  res.json({
    status: "success",
    removed: req.params.name,
    newLength: countries.length,
  });
});

module.exports = router;