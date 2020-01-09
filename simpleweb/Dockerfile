FROM node:alpine

WORKDIR /home/node
COPY ./package.json ./package.json
COPY ./index.js ./index.js

RUN npm install
CMD ["npm", "start"]