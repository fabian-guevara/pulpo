#!/usr/bin/env node
const logger = require("./helpers/logger.js")
const HumanitarianData = require("./HumanitarianData.class.js");


if(process.argv.length !==3) {
    logger.error("Please only provide one argument. That argument should be a country coode in the form MX for Mexico.");
    process.exit(1)
}

const countryCode = process.argv[2].toUpperCase();

const humanitarianData = new HumanitarianData(countryCode);

humanitarianData.getData()
  .then((data) => logger.info(JSON.stringify(data)))
  .catch((error) => logger.error(error.message));