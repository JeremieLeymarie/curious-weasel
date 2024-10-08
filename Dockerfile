FROM elixir:latest

WORKDIR /app
COPY . /app

RUN mix local.hex --force

# RUN mix do compile

RUN mix.ecto.create

RUN mix ecto.migrate

CMD mix phx.server
