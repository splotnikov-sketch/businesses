import axios from 'axios';

const token =
	'0hMbOtwUjz1o_GaulMXktQ7_1BunC2OpgWz_h3Z4ScKykUe0vTrXPuQ5WflX4ET2BEc8riZsUBkXvjT_B0upu5zBWOWodkndp4Ywvx30_D-tQ8NWXP3mk6NbEC7jYnYx';

const yelp = axios.create({
	baseURL: 'https://api.yelp.com/v3/businesses',
	timeout: 1000,
	headers: { Authorization: `Bearer ${token}` },
});

export default yelp;
