# Use Node.js v14
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

RUN yarn add

# Bundle app source
COPY . .

# Expose the port
EXPOSE 3000

CMD [ "yarn", "start" ]
