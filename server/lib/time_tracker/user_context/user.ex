defmodule TimeTracker.UserContext.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field(:username, :string)
    field(:email, :string)
    field(:role, Ecto.Enum, values: [:general_manager, :manager, :employee])

    many_to_many(:teams, TimeTracker.TeamContext.Team,
      join_through: TimeTracker.TeamContext.TeamUsers
    )

    has_many(:clocks, TimeTracker.ClockContext.Clock)
    has_many(:working_times, TimeTracker.WorkingTimeContext.WorkingTime)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :email, :role])
    |> cast_assoc(:teams)
    |> validate_required([:username, :email, :role])
    |> validate_format(:email, ~r/(.+)@(.+)\.(.+)/)
    |> unique_constraint(:email)
  end
end
