# syntax=docker/dockerfile:1

################################################################################
# Build stage

ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-alpine as build
WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

################################################################################
# Final stage

FROM nginx:latest as final

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build/ /usr/share/nginx/html

WORKDIR /app
RUN chown -R nginx:nginx /app \
  && chmod -R 755 /app \
  && chown -R nginx:nginx /var/cache/nginx \
  && chown -R nginx:nginx /var/log/nginx \
  && chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid \
  && chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
