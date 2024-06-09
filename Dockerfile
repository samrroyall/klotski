# syntax=docker/dockerfile:1

################################################################################
# Build stage

ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-alpine as build
WORKDIR /app

ENV REACT_APP_API_URL=https://klotski-api.fly.dev
ENV REACT_APP_SENTRY_DSN=https://a977ecdf115d89dd65c9bbefce9b8931@o4505959535280128.ingest.us.sentry.io/4506888878161920


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

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
