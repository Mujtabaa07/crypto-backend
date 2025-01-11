const express = require('express');
require('dotenv').config();
const router = express.Router();
const CryptoData = require('../model/data');
const cron = require('node-cron');
const axios = require('axios');
const app = express();

async function fetchAndStoreCryptoData() {
    const coins = ['bitcoin', 'matic-network', 'ethereum'];
    
    for (const coin of coins) {
      try {
        console.log(`Fetching data for ${coin}...`);
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          },
          headers: {
            'x-cg-pro-api-key': process.env.COINGECKO_API_KEY
          }
        });
        
        const data = response.data;
        
        const CryptoData = new CryptoData({
          coin: coin,
          price: data.market_data.current_price.usd,
          marketCap: data.market_data.market_cap.usd,
          change24h: data.market_data.price_change_percentage_24h
        });
        
        await cryptoData.save();
        console.log(`Data saved for ${coin} at ${new Date().toISOString()}`);
      } catch (error) {
        console.error(`Error fetching data for ${coin}:`, error.message);
      }
    }
  }
  fetchAndStoreCryptoData();
  
  
  cron.schedule('0 */2 * * *', fetchAndStoreCryptoData);
  router.get('/stats', async (req, res) => {
    const { coin } = req.query;
    
    console.log(`Received request for stats of coin: ${coin}`);
    
    if (!coin) {
      return res.status(400).json({ error: 'Coin parameter is required' });
    }
    
    try {
      const latestData = await CryptoData.findOne({ coin }).sort({ timestamp: -1 });
      
      if (!latestData) {
        console.log(`No data found for coin: ${coin}`);
        return res.status(404).json({ error: 'No data found for the specified coin' });
      }
      
      console.log(`Returning data for ${coin}:`, latestData);
      res.json({
        price: latestData.price,
        marketCap: latestData.marketCap,
        "24hChange": latestData.change24h
      });
    } catch (error) {
      console.error('Error in /stats endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports = router;