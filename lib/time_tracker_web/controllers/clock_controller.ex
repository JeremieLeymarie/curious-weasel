defmodule TimeTrackerWeb.ClockController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.ClockContext
  alias TimeTracker.ClockContext.Clock

  action_fallback TimeTrackerWeb.FallbackController

  def index(conn, %{"userId" => userId}) do
    clocks = ClockContext.list_clocks(userId)
    render(conn, :index, clocks: clocks)
  end

  def create(conn, %{"clock" => clock_params, "userId" => userId}) do
    data = %{
      "time" => Map.get(clock_params, "time"),
      "status" => Map.get(clock_params, "status"),
      "user" => String.to_integer(userId || "0")
    }

    IO.inspect(clock_params)

    with {:ok, %Clock{} = clock} <- ClockContext.create_clock(data) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/clocks/#{clock}")
      |> render(:show, clock: clock)
    end
  end
end
