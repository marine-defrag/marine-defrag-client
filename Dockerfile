FROM nginx:alpine

RUN apk update && apk add curl git

WORKDIR /app

COPY dist .

COPY ./config/up.html .
COPY ./config/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000
EXPOSE 80
