defmodule TimeTracker.TeamContext.TeamUser do
  use Ecto.Schema

  schema "team_users" do
    belongs_to(:team, TimeTracker.TeamContext.Team)
    belongs_to(:user, TimeTracker.TeamContext.User)

    timestamps()
  end
end
