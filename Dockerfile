# Use Node.js v14
FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ["package.json", "./"]

RUN yarn install --production

# Expose the port
EXPOSE 3000

CMD [ "yarn", "start" ]
