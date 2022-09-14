// config.js

import * as dotenv from 'dotenv';
dotenv.config();

const config = {
	PORT: process.env.PORT || 3000,
	MONGO_CONNECTION_STRING: `${process.env.MONGODB_URI}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
	YELP_URI: process.env.YELP_URI,
	YELP_TOKEN: process.env.YELP_TOKEN,
	GEOAPIFY_URI: process.env.GEOAPIFY_URI,
	GEOAPIFY_KEY: process.env.GEOAPIFY_KEY,
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

export default config;
