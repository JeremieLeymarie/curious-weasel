defmodule TimeTracker.TeamContext.Team do
  use Ecto.Schema
  import Ecto.Changeset

  schema "teams" do
    field(:name, :string)

    belongs_to(:manager, TimeTracker.UserContext.User)

    many_to_many(:users, TimeTracker.UserContext.User,
      join_through: TimeTracker.TeamContext.TeamUser,
      on_replace: :delete
    )

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name])
    |> cast_assoc(:users)
    |> cast_assoc(:manager)
    |> validate_required([:name])
  end
end
