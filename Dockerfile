FROM node:lts-alpine
COPY ./ /opt/blob-server
WORKDIR /opt/blob-server
RUN yarn install --frozen-lockfile
RUN yarn run build

ENV EZSERVE_FILE_STORE_PATH=/srv/ezserve
CMD yarn run -s start