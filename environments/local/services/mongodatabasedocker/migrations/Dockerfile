FROM node:latest as BASE

WORKDIR /app

ADD utils/waitFor.sh ./waitFor.sh
RUN npm -g install migrate-mongo && chmod 777 ./waitFor.sh

COPY package.json package-lock.json ./
COPY config/mongodb/mongoDatabaseMigrate.js config/mongodb/mongoDatabaseMigrate.js
COPY config/mongodb/mongoDatabaseSeed.js config/mongodb/mongoDatabaseSeed.js
COPY db/mongoDatabase db/mongoDatabase
COPY environments/local/db/mongoDatabase environments/local/db/mongoDatabase
COPY environments/local/secrets.local.yml environments/local/secrets.local.yml

CMD ["./waitFor.sh", "mongodatabasedocker:27017", "-t", "600", "--", "npm", "run", "local:mongoDatabase:migrate"]
