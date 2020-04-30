FROM node:latest

WORKDIR /app
EXPOSE 3000

COPY package-lock.json package.json ./

RUN npm install --no-progress --ignore-optional

CMD ["npm", "run", "local:serverless:start"]
