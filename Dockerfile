# Build Vue
FROM node:alpine as build-stage
WORKDIR /app
COPY ./package*.json ./
RUN yarn install
COPY / .
RUN yarn build
RUN yarn generate

# Setup Container and install Flask
FROM lsiobase/alpine:3.14 as deploy-stage
# MAINTANER Your Name "info@selfhosted.pro"

# Install Dependancies
RUN \
  # echo '**** adding repositories ****' && \
  # echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/main' >> /etc/apk/repositories && \
  # echo 'http://dl-cdn.alpinelinux.org/alpine/v3.6/community' >> /etc/apk/repositories && \
  # apk update && \
  echo "**** install build packages ****" && \
  apk add --no-cache --virtual=build-dependencies \
  g++ \
  make \
  ruby-dev \
  curl && \
  echo "**** install packages ****" && \
  apk add --no-cache \
  nginx && \
  gem install sass &&\
  echo "**** Cleaning Up ****" &&\
  apk del --purge \
  build-dependencies && \
  rm -rf \
  /root/.cache \
  /tmp/*

# Configuration
COPY docker/root /

# Vue
COPY --from=build-stage /app/dist /app
COPY docker/nginx.conf /etc/nginx/

# Expose
VOLUME /config
EXPOSE 8000
