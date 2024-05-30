FROM node:15.6.0 as build

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

WORKDIR /source

COPY . .

RUN npm i -g rimraf
RUN npm install
RUN npm run build -- --output-path=/dist

FROM nginx:alpine

RUN apk update && apk add curl git

WORKDIR /app

COPY --from=build /dist /app

COPY ./config/up.html .
COPY ./config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000
EXPOSE 80
