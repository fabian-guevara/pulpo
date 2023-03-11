const HumanitarianAid = require('../HumanitarianData.class.js');
const humanitarianAidMiddleware = async (req, res, next) => {
 try {
    const countryCode = req.params.countryCode.toUpperCase();

    const humanitarianAid = new HumanitarianAid(countryCode);
    const data = await humanitarianAid.getData();

    res.json(data);
  } catch (error) {
    console.log(error)
    next(error);
  }
};

module.exports = humanitarianAidMiddleware;
