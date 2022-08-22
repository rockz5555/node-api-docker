FROM node:16.17.0-alpine
WORKDIR /app
COPY package.json package-lock.json ./
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
      then npm i; \
      else npm i --only=production; \
    fi
COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD [ "node", "index.js" ]
