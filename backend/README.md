# API to provide data to the client application

## External APIs

- [Yelp API](https://www.yelp.com/developers/)
- [Geocoding API](https://www.geoapify.com/geocoding-api)

## Databases

- [Mongo DB](https://www.mongodb.com/cloud)

## Running

- Build `npm run build`
- Run locally `npm run dev`
- Run in prod `node ./dist/bin/www`

## Support docker

- Build docker image `docker build . -t businesses-api`
- Verify this before running the main process `docker run -it -p 3010:3010 --env-file .env businesses-api:latest -e "console.log(process.env)`
- Create network `docker network create businesses-api-network`
- Run mongo db container `docker run --rm -d --network businesses-api-network --name mongodb mongo`
- Start container `docker run --rm -d -p 3010:3010 --network businesses-api-network --env-file .env.local --name businesses-api businesses-api:latest`
- To inspect the container `docker container inspect businesses-api`

## Running postgres database in docker

`docker run --rm -p 5433:5432 --name postgres -e POSTGRES_PASSWORD=DefaultPassword -v /data:/var/lib/postgresql/data -d postgres`

## PGAdmin

`docker pull dpage/pgadmin4:latest`
`docker run --rm --name pgadmin -p 82:80 -e 'PGADMIN_DEFAULT_EMAIL=user@domain.com' -e 'PGADMIN_DEFAULT_PASSWORD=DefaultPassword' -d dpage/pgadmin4`

## Prisma migration

`npx prisma migrate dev --name init`

## Generate prisma client

`npx prisma generate`
