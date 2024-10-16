FROM elixir:alpine

WORKDIR /app
COPY . /app

RUN mix local.hex --force
RUN chmod +x ./entrypoint.sh

RUN apk add --no-cache \
    build-base 
RUN mix deps.get
RUN mix deps.compile

CMD ./entrypoint.sh
