defmodule TimeTrackerWeb.WorkingTimeController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.WorkingTimeContext
  alias TimeTracker.WorkingTimeContext.WorkingTime

  action_fallback(TimeTrackerWeb.FallbackController)

  def index(conn, %{"userId" => user_id} = params) do
    working_times = WorkingTimeContext.list_working_times(params, user_id)
    render(conn, :index, working_times: working_times)
  end

  def list_team_working_times(conn, %{"teamId" => teamId}) do
    working_times = WorkingTimeContext.list_working_times_for_team(teamId)
    render(conn, :index, working_times: working_times)
  end

  def create(conn, %{"working_time" => working_time_params, "userId" => user_id}) do
    params = %{
      start: working_time_params["start"],
      end: working_time_params["end"],
      user_id: user_id
    }

    with {:ok, %WorkingTime{} = working_time} <-
           WorkingTimeContext.create_working_time(params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/workingtimes/#{working_time}")
      |> render(:show, working_time: working_time)
    end
  end

  def update(conn, %{"id" => id, "working_time" => working_time_params}) do
    working_time = WorkingTimeContext.get_working_time(id)

    with {:ok, %WorkingTime{} = working_time} <-
           WorkingTimeContext.update_working_time(working_time, working_time_params) do
      render(conn, :show, working_time: working_time)
    end
  end

  def delete(conn, %{"id" => id}) do
    working_time = WorkingTimeContext.get_working_time(id)

    with {:ok, %WorkingTime{}} <- WorkingTimeContext.delete_working_time(working_time) do
      send_resp(conn, :no_content, "")
    end
  end

  def show_user_working_time(conn, %{"userId" => user_id, "id" => working_time_id}) do
    case WorkingTimeContext.get_working_time_for_user(user_id, working_time_id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Working time not found"})

      working_time ->
        render(conn, :show, working_time: working_time)
    end
  end
end
