// app.js
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

import rootRouter from './routes/rootRouter';
import config from './config';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

if (!config.MONGO_CONNECTION_STRING) {
	throw new Error(`MongoURI was not supplied`);
}

mongoose.connect(config.MONGO_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
	console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
	console.error('Error connecting to mongo', err);
});

app.use('/', rootRouter);

export default app;
