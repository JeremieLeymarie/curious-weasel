FROM elixir:alpine

WORKDIR /app
COPY . /app

RUN mix local.hex --force
RUN chmod +x ./entrypoint.sh

CMD ./entrypoint.sh
