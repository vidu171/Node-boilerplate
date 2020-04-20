FROM alpine:latest AS buildStage

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY . .

RUN apk add --update npm && npm i -g typescript && npm i && npm run build 


#Eliminate useless development files
FROM alpine:latest AS production

WORKDIR /usr/src/app

COPY --from=buildStage /usr/src/app/dist/ .
COPY --from=buildStage /usr/src/app/package.json .
COPY --from=buildStage /usr/src/app/package-lock.json .
COPY .env .
RUN apk add --update npm && npm install --only=prod && apk add nano && apk add curl

EXPOSE 5000

CMD ["node", "server.js"]