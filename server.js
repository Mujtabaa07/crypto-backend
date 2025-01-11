require('dotenv').config();
const express = require('express');
const { connectDB } = require('./model/data');
const routes = require('./routes/Routes');

const app = express();
const PORT = process.env.PORT || 3000;
//use the routes(/stats) from stats
//use the routes(/deviation) from deviation
app.use('/', routes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
});

module.exports = app;