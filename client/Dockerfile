FROM node:16.13.0-alpine

WORKDIR /usr/src/app
COPY . .

RUN npm install --force

CMD ["npm", "run", "serve"]