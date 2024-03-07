FROM node:21-alpine3.18

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "run", "dev" ]