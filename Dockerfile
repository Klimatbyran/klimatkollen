FROM node:21-alpine3.18

WORKDIR /app

COPY . ./

RUN npm ci

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "run", "dev" ]