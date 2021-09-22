# syntax=docker/dockerfile:1
FROM node:12-alpine
COPY . /usr/src/audiosilo
WORKDIR /usr/src/audiosilo
RUN ["yarn", "install", "--pure-lockfile"]
RUN ["yarn", "build"]
RUN ["yarn", "generate"]
# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
ENV HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000
ENV PORT=3000

EXPOSE ${PORT}
# start the app
CMD [ "yarn", "start" ]
