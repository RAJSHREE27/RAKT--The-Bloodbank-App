const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Bloodbank', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

const port = process.env.PORT || 8000;

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
  }
);

app.use(routes);

app.listen(port, () => {
    console.log(`Codeutsava running on port ${port}`);
});