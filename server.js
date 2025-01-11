// require('dotenv').config();
// const app = require('./app');
// const  CryptoData = require ('./model/data');
// const cron = require('node-cron');
// const axios = require('axios');
// const router = express.Router();
const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./routes/Routes');

const PORT = process.env.PORT || 3000;

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));

// const CryptoDataSchema = new mongoose.Schema({
//   coin: String,
//   price: Number,
//   marketCap: Number,
//   change24h: Number,
//   timestamp: { type: Date, default: Date.now }
// });

// const CryptoData = mongoose.model('CryptoData', CryptoDataSchema);

// Function to fetch and store cryptocurrency data
// async function fetchAndStoreCryptoData() {
//   const coins = ['bitcoin', 'matic-network', 'ethereum'];
  
//   for (const coin of coins) {
//     try {
//       console.log(`Fetching data for ${coin}...`);
//       const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`, {
//         params: {
//           localization: false,
//           tickers: false,
//           market_data: true,
//           community_data: false,
//           developer_data: false,
//           sparkline: false
//         },
//         headers: {
//           'x-cg-pro-api-key': process.env.COINGECKO_API_KEY
//         }
//       });
      
//       const data = response.data;
      
//       const CryptoData = new CryptoData({
//         coin: coin,
//         price: data.market_data.current_price.usd,
//         marketCap: data.market_data.market_cap.usd,
//         change24h: data.market_data.price_change_percentage_24h
//       });
      
//       await cryptoData.save();
//       console.log(`Data saved for ${coin} at ${new Date().toISOString()}`);
//     } catch (error) {
//       console.error(`Error fetching data for ${coin}:`, error.message);
//     }
//   }
// }
// fetchAndStoreCryptoData();


// cron.schedule('0 */2 * * *', fetchAndStoreCryptoData);

// API endpoint to get latest cryptocurrency stats
// app.get('/stats', async (req, res) => {
//   const { coin } = req.query;
  
//   console.log(`Received request for stats of coin: ${coin}`);
  
//   if (!coin) {
//     return res.status(400).json({ error: 'Coin parameter is required' });
//   }
  
//   try {
//     const latestData = await CryptoData.findOne({ coin }).sort({ timestamp: -1 });
    
//     if (!latestData) {
//       console.log(`No data found for coin: ${coin}`);
//       return res.status(404).json({ error: 'No data found for the specified coin' });
//     }
    
//     console.log(`Returning data for ${coin}:`, latestData);
//     res.json({
//       price: latestData.price,
//       marketCap: latestData.marketCap,
//       "24hChange": latestData.change24h
//     });
//   } catch (error) {
//     console.error('Error in /stats endpoint:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





