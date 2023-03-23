const axios = require('axios');
const { config } = require('dotenv');
const NodeCache = require('node-cache');
config();


class HumanitarianData {
  constructor(countryCode) {
    this.countryCode = countryCode;
    this.data = new Map();
    this.cache = new NodeCache();
    this.apiKey = process.env.API_KEY;
  }


  #getUrl(year) {
  const baseUrl = 'https://api.iatistandard.org/datastore/activity/iati_json';
  const recipientCountry = this.countryCode;
  const dateFrom = `${year}-01-01`;
  const dateTo = `${year}-12-31`;
  
  const queryString = `q=recipient_country_code:${recipientCountry}&q.op=OR&sow=false&wt=json&group=false&facet=false&facet.method=fc&facet.range.other=none&activity_date_gte=${dateFrom}&activity_date_lte=${dateTo}budget_not_provided=false`;
  const url = `${baseUrl}?${queryString}`;
  return url;
}

async #axiosGet (url) {
  const config = {
          headers: {
            "Ocp-Apim-Subscription-Key": this.apiKey,
          }
        }

  return axios.get(url, config);      
}
 
  async getData() {
  const currentYear = new Date().getFullYear();
  const fiveYearsAgo = currentYear - 5;


  for (let year = currentYear; year >= fiveYearsAgo; year--) {
    let response;
    const url = this.#getUrl(year);
    const cachedResponse = this.cache.get(url);
        if (cachedResponse) {
      response = {data: cachedResponse};
    } else {
      
      const axiosResponse = await this.#axiosGet(url);
      response = {data: axiosResponse.data};
      this.cache.set(url, axiosResponse.data);
    }
    const contributionsByYear = response.data.response.docs.reduce((acc, result) => {
      const transactionGroupArray = result.iati_json["iati-activity"][0]["transaction"] ??= [];

      const values = [];
      transactionGroupArray.flat().forEach(transaction => {
        values.push(transaction.value.flat())
      })

      const contributions = values.reduce((total, value) => total.concat(value), []);

      contributions.forEach(contribution => {
        const year = new Date(contribution["@value-date"]).getFullYear();
        const amount = Number(contribution["text()"]);

        if(!acc[year]){
          acc[year] = {
            amount
          }
        }else{
          acc[year].amount += amount
        }
      })

      return acc;
    }, {});

        this.data = contributionsByYear;
  }

  return JSON.stringify(this.data);
}
}


  

module.exports = HumanitarianData;
