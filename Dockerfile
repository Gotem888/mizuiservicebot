# Use Node.js v14
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json /app

RUN yarn add

RUN yarn run build

EXPOSE 3000

CMD [ "yarn", "start" ]
