# 1. For build React app
FROM node:20.11-bullseye-slim

# Set working directory
WORKDIR /app

COPY package.json /app/package.json

# Same as npm install
RUN npm install

RUN npx create-react-app client-app

#clean up /app folder
RUN rm -rf /app/node_modules
RUN rm -rf /app/package.json
RUN rm -rf /app/package-lock.json

#COPY modified App.js
WORKDIR /app/client-app
COPY client-app/src/App.js /app/client-app/src/App.js
COPY package.json /app/client-app/package.json
RUN npm i -g npm-check-updates
RUN npx ncu
RUN npm install


# ENV CI=true
# ENV PORT=3000
EXPOSE 3000


CMD [ "npm", "run", "start" ]

#CMD cd /server && npm run start

#CMD [ "/bin/sh" ]

# FROM development AS build

# RUN npm run build
