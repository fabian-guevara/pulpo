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

  const queryString = `q=recipient_country=${recipientCountries}&activity_date__gte=${dateFrom}&activity_date__lte=${dateTo}&limit=${limit}`;

  const url = `${baseUrl}?${queryString}`;

  return url;
} 


  async getData() {
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 5;

    for (let year = currentYear; year >= fiveYearsAgo; year--) {
  

      // if cached data exists add it to data and skip to next iteration
      const cacheKey = `${this.countryCode}-${year}`;
      const cachedData = this.cache.get(cacheKey);

      if (cachedData) {
        this.data.set(year, cachedData);
        continue;
      }

      const url = this.#getUrl(year);
      console.log(url);
      const config = {
        headers: {
        "Ocp-Apim-Subscription-Key": "1105bb51caec4a0f92b64e3044216cdb",
      }
      }
      const response = await axios.get(url, config);

      console.log(response)

      const contributionsByYear = new Map();

      // loop over results and add them to data/cache
      response.data.forEach((result) => {
        const organisationName = result.reporting_organisation.name;
        const amount = Number(result.transaction[0].value.amount);

        if (contributionsByYear.has(organisationName)) {
          contributionsByYear.set(organisationName, contributionsByYear.get(organisationName) + amount);
        } else {
          contributionsByYear.set(organisationName, amount);
        }
      });

      this.data.set(year, contributionsByYear);

   
      this.cache.set(cacheKey, contributionsByYear);
    }

    return this.data;
  }
}

module.exports = HumanitarianData;
