defmodule TimeTrackerWeb.TeamController do
  use TimeTrackerWeb, :controller

  alias TimeTracker.UserContext
  alias TimeTracker.TeamContext
  alias TimeTracker.TeamContext.Team

  action_fallback(TimeTrackerWeb.FallbackController)

  def index(conn, _params) do
    # TODO: get actual logged in user
    current_user = UserContext.get_user(1)

    teams = TeamContext.list_teams(current_user)
    render(conn, :index, teams: teams)
  end

  def create(conn, %{"team" => team_params}) do
    with {:ok, %Team{} = team} <- TeamContext.create_team(team_params) do
      for user_id <- team_params["user_ids"],
          do: TeamContext.create_team_user(%{"user_id" => user_id, "team_id" => team.id})

      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/teams/#{team}")
      |> render(:show, team: team)
    end
  end

  def show(conn, %{"id" => id}) do
    case TeamContext.get_team(id) do
      nil -> conn |> put_status(:not_found) |> json(%{error: "Team not found"})
      team -> render(conn, :show, team: team)
    end
  end

  def update(conn, %{"id" => id, "team" => team_params}) do
    team = TeamContext.get_team(id)

    with {:ok, %Team{} = team} <- TeamContext.update_team(team, team_params) do
      render(conn, :show, team: team)
    end
  end

  def delete(conn, %{"id" => id}) do
    team = TeamContext.get_team(id)

    with {:ok, %Team{}} <- TeamContext.delete_team(team) do
      send_resp(conn, :no_content, "")
    end
  end
end
