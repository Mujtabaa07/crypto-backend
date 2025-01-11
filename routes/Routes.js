const express = require('express');
const router = express.Router();
const { CryptoData } = require('../model/data');
const cron = require('node-cron');
const axios = require('axios');

async function fetchAndStoreCryptoData() {
    const coins = ['bitcoin', 'matic-network', 'ethereum'];
    
    for (const coin of coins) {
      try {
        console.log(`Fetching data for ${coin}...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          }
        });
        
        const data = response.data;
        const cryptoData = new CryptoData({
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

// to fetch the data and store in db 
fetchAndStoreCryptoData();
cron.schedule('0 */2 * * *', fetchAndStoreCryptoData);
//stats route 
router.get('/stats', async (req, res) => {
    const { coin } = req.query;
    if (!coin) return res.status(400).json({ error: 'Coin parameter is required' });
    
    try {
        const latestData = await CryptoData.findOne({ coin }).sort({ timestamp: -1 });
        if (!latestData) return res.status(404).json({ error: 'No data found' });
        
        res.json({
            price: latestData.price,
            marketCap: latestData.marketCap,
            "24hChange": latestData.change24h
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
//deviation route
router.get('/deviation', async (req, res) => {
    const { coin } = req.query;
    if (!coin) return res.status(400).json({ error: 'Coin parameter is required' });
    
    try {
        const prices = await CryptoData.find({ coin })
            .sort({ timestamp: -1 })
            .limit(100)
            .select('price');
            
        if (prices.length === 0) return res.status(404).json({ error: 'No data found' });
        
        const priceValues = prices.map(p => p.price);
        const mean = priceValues.reduce((a, b) => a + b) / priceValues.length;
        const variance = priceValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / priceValues.length;
        const deviation = Math.sqrt(variance);
        
        res.json({ deviation: parseFloat(deviation.toFixed(2)) });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;