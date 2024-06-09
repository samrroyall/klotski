# syntax=docker/dockerfile:1

################################################################################
# Build stage

ARG NODE_VERSION=20.14.0
ARG REACT_APP_API_URL
ARG REACT_APP_SENTRY_DSN

FROM node:${NODE_VERSION}-alpine as build
WORKDIR /app

ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_SENTRY_DSN=${REACT_APP_SENTRY_DSN}

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
