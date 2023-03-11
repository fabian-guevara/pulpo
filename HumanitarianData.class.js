const axios = require('axios');
const NodeCache = require('node-cache');

class HumanitarianData {
  constructor(countryCode) {
    this.countryCode = countryCode;
    this.data = new Map();
    this.cache = new NodeCache();
  }


  #getUrl(year) {
  const baseUrl = 'https://api.iatistandard.org/datastore/activity/select';
  const reportingOrgs = 'SE'; // Change this to the appropriate reporting organisation code
  const recipientCountries = this.countryCode;
  const dateFrom = `${year}-01-01`;
  const dateTo = `${year}-12-31`;
  const limit = 100;

  // const queryString = `q=recipient_country=${recipientCountries}&activity_date__gte=${dateFrom}&activity_date__lte=${dateTo}&limit=${limit}`;
  const queryString = `q=reportting_org_type=${reportingOrgs}&wt=json&`

  const url = `${baseUrl}?${queryString}`;

  return `https://api.iatistandard.org/datastore/activity/select?q=recipient_country=SD&activity_date__gte=2023-03-10&activity_date__lte=2023-03-10&limit=100`;
} 


  async getData() {
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;

    for (let year = currentYear; year >= fiveYearsAgo; year--) {
  

      // if cached data exists add it to data and skip to next iteration
      const cacheKey = `${this.countryCode}-${year}`;
      const cachedData = this.cache.get(cacheKey);

      if (cachedData) {
        console.log("was cached bro !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        this.data.set(year, cachedData);
        continue;
      }

      const url = this.#getUrl(year);

      // send subscription key to be able to make requests to the api.
      const config = {
        headers: {
        "Ocp-Apim-Subscription-Key": "871f9176e3984e57bb2b57c9323f1250",
      }
      }
      const response = await axios.get(url, config);


      const contributionsByYear = new Map();

      // loop over results and add them to data/cache
      response.data.response.docs.forEach((result) => {
        console.log(result);
        // const organisationName = result.reporting_organisation.name;
        // const amount = Number(result.transaction[0].value.amount);

        // if (contributionsByYear.has(organisationName)) {
        //   contributionsByYear.set(organisationName, contributionsByYear.get(organisationName) + amount);
        // } else {
        //   contributionsByYear.set(organisationName, amount);
        // }
      });

      this.data.set(year, contributionsByYear);

   
      this.cache.set(cacheKey, contributionsByYear);
    }

    return this.data;
  }
}

module.exports = HumanitarianData;
