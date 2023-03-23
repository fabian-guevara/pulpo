const chai = require('chai');
const expect = chai.expect;
const HumanitarianData = require('./HumanitarianData.class.js');

describe('HumanitarianData', function() {
  it('should fetch and parse data correctly', async function() {
    const countryCode = 'SD';
    const humanitarianData = new HumanitarianData(countryCode);
    const data = await humanitarianData.getData();
    expect(data).to.be.a('string');
    expect(JSON.parse(data)).to.be.an('object');
  });
});
