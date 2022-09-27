FROM node:18.9.0-alpine AS appbuild
WORKDIR /app
COPY package.json ./
COPY .babelrc ./
RUN npm install
COPY ./src ./src
RUN npm run build

FROM node:18.9.0-alpine
WORKDIR /app
COPY package.json ./
COPY .babelrc ./
RUN npm install
COPY --from=appbuild /app/dist ./dist

ENV PORT 80
ENV MONGODB_URI N/A
ENV MONGODB_DB N/A
ENV YELP_URI N/A
ENV YELP_TOKEN N/A
ENV GEOAPIFY_URI N/A
ENV GEOAPIFY_KEY N/A

EXPOSE $PORT

CMD ["npm", "run", "docker-prod"]
