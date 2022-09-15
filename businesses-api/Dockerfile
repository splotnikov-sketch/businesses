FROM node:latest

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build


ENV PORT 80
ENV MONGODB_URI N/A
ENV MONGODB_DB N/A
ENV YELP_URI N/A
ENV YELP_TOKEN N/A
ENV GEOAPIFY_URI N/A
ENV GEOAPIFY_KEY N/A

EXPOSE $PORT

CMD ["node", "dist/bin/www"]
