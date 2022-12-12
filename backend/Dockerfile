FROM node:18.9.0-alpine AS appbuild
WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

FROM node:18.9.0-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY --from=appbuild /app/dist ./dist

ENV PORT 80

EXPOSE $PORT

CMD ["npm", "run", "docker-prod"]
