FROM node:15.6.0 AS build

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

WORKDIR /source

COPY . .

RUN npm i -g rimraf
RUN npm install
RUN npm run build -- --output-path=/dist

FROM nginx:alpine

RUN apk update && apk add curl git

# Create a non-root user for nginx (use different GID to avoid conflicts)
RUN addgroup -g 1001 -S appuser && \
  adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G appuser -g appuser appuser

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run /app && \
  chown -R appuser:appuser /var/cache/nginx /var/log/nginx /var/run /app && \
  # Give appuser access to nginx config directory
  chown -R appuser:appuser /etc/nginx

WORKDIR /app

COPY --from=build /dist /app
COPY ./config/up.html .
COPY ./config/nginx.conf /etc/nginx/nginx.conf

# Fix permissions for the app directory and nginx files
RUN chown -R appuser:appuser /app /etc/nginx

# Switch to non-root user
USER appuser

# Only expose port 3000 (remove port 80 since we don't need it with Traefik)
EXPOSE 3000

# Start nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
