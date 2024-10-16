defmodule TimeTrackerWeb.TeamJSON do
  alias TimeTracker.TeamContext.Team

  @doc """
  Renders a list of teams.
  """
  def index(%{teams: teams}) do
    %{data: for(team <- teams, do: data(team))}
  end

  @doc """
  Renders a single team.
  """
  def show(%{team: team}) do
    %{data: data(team)}
  end

  defp data(%Team{} = team) do
    result = %{
      id: team.id,
      name: team.name,
      users: nil,
      manager:
        if Ecto.assoc_loaded?(team.manager) && team.manager != nil do
          %{id: team.manager.id, username: team.manager.username}
        else
          nil
        end
    }

    users =
      if Ecto.assoc_loaded?(team.users) do
        for(user <- team.users, do: %{id: user.id, username: user.username})
      else
        nil
      end

    result = %{result | users: users}

    result
  end
end
