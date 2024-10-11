defmodule TimeTracker.TeamContext.Team do
  use Ecto.Schema
  import Ecto.Changeset

  schema "teams" do
    field(:name, :string)

    belongs_to(:manager_id, TimeTracker.UserContext.User)

    many_to_many(:users, TimeTracker.User, join_through: :team_users)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name])
    |> cast_assoc(:users)
    |> validate_required([:name])
  end
end
