const express = require('express');
const HumanitarianAid = require('./HumanitarianData.class.js');
const errorHandler = require('./middleware/errorHandler.js');
const humanitarianAidMiddleware = require('./middleware/handleRequest.js');
const PORT = 3000;
const app = express();

app.get('/:countryCode', humanitarianAidMiddleware);

// app.use(errorHandler);



try {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} catch (error) {
  console.error('An error occurred while starting the server:', error);
}