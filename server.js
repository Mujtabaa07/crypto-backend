const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./routes/Routes');

const PORT = process.env.PORT || 3000;
// use /stats for stats
//use /deviation for deviation
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





