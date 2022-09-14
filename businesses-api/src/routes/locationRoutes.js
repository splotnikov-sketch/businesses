// /routes/geoapifyRoutes.js

import axios from 'axios';
import express from 'express';
import config from '../config';
import { isNullOrEmpty } from '../utils';

const router = express.Router();

router.post('/search', async (req, res) => {
	const { term } = req.body;

	if (isNullOrEmpty(term)) {
		return res
			.status(400)
			.send({ error: 'Search term has to be supplied' });
	}

	const geopify = axios.create({
		baseURL: config.GEOAPIFY_URI,
		timeout: 1000,
	});

	try {
		const response = await geopify.get('/search', {
			params: {
				text: term,
				limit: 1,
				apiKey: config.GEOAPIFY_KEY,
			},
		});

		const data = await response.data;

		if (
			!data ||
			data.features === null ||
			data.features.length === 0 ||
			data.features[0].properties === null
		) {
			return res.status(500).send({
				error: 'Something went wrong. Please try again later.',
			});
		}

		const propertiesElement = data.features[0].properties;

		const result = {
			city: propertiesElement.city,
			county: propertiesElement.county,
			state: propertiesElement.state,
			postcode: propertiesElement.postcode,
			country: propertiesElement.country,
			country_code: propertiesElement.country_code,
			lon: propertiesElement.lon,
			lat: propertiesElement.lat,
			state_code: propertiesElement.state_code,
			formatted: propertiesElement.formatted,
			address_line1: propertiesElement.address_line1,
			address_line2: propertiesElement.address_line2,
		};

		res.send(result);
		return;
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.send({ error: 'Something went wrong. Please try again later.' });
	}
});

export default router;
