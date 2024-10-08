defmodule TimeTrackerWeb.WorkingTimeController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.WorkingTimeContext
  alias TimeTracker.WorkingTimeContext.WorkingTime

  action_fallback TimeTrackerWeb.FallbackController

  def index(conn, params) do
    working_times = WorkingTimeContext.list_working_times(params)
    render(conn, :index, working_times: working_times)
  end

  def create(conn, %{"working_time" => working_time_params}) do
    with {:ok, %WorkingTime{} = working_time} <-
           WorkingTimeContext.create_working_time(working_time_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/workingtimes/#{working_time}")
      |> render(:show, working_time: working_time)
    end
  end

  def show(conn, %{"id" => id}) do
    working_time = WorkingTimeContext.get_working_time!(id)
    render(conn, :show, working_time: working_time)
  end

  def update(conn, %{"id" => id, "working_time" => working_time_params}) do
    working_time = WorkingTimeContext.get_working_time!(id)

    with {:ok, %WorkingTime{} = working_time} <-
           WorkingTimeContext.update_working_time(working_time, working_time_params) do
      render(conn, :show, working_time: working_time)
    end
  end

  def delete(conn, %{"id" => id}) do
    working_time = WorkingTimeContext.get_working_time!(id)

    with {:ok, %WorkingTime{}} <- WorkingTimeContext.delete_working_time(working_time) do
      send_resp(conn, :no_content, "")
    end
  end

  def show_user_working_time(conn, %{"userId" => user_id, "id" => working_time_id}) do
    case WorkingTimeContext.get_working_time_for_user(user_id, working_time_id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("error.json", message: "Working time not found")

      working_time ->
        render(conn, :show, working_time: working_time)
    end
  end


end
