# API to provide data to the client application

## External APIs

-   [Yelp API](https://www.yelp.com/developers/)
-   [Geocoding API](https://www.geoapify.com/geocoding-api)

## Databases

-   [Mongo DB](https://www.mongodb.com/cloud)

## Running

-   Build `npm run build`
-   Run locally `npm run dev`
-   Run in prod `node ./dist/bin/www`

## Support docker

-   Build docker image `docker build . -t businesses-api`
-   Verify this before running the main process `docker run -it -p 3010:3010 --env-file .env businesses-api:latest -e "console.log(process.env)`
-   Start container `docker run -p 3010:3010 --env-file .env businesses-api:latest`
