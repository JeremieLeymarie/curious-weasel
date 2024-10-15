defmodule TimeTracker.UserContext.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field(:username, :string)
    field(:email, :string)
    field(:role, Ecto.Enum, values: [:general_manager, :manager, :employee])
    field(:hash_password, :string)

    many_to_many(:teams, TimeTracker.TeamContext.Team,
      join_through: TimeTracker.TeamContext.TeamUser
    )

    has_many(:clocks, TimeTracker.ClockContext.Clock)
    has_many(:working_times, TimeTracker.WorkingTimeContext.WorkingTime)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :email, :role, :hash_password])
    |> cast_assoc(:teams)
    |> validate_required([:username, :email, :role, :hash_password])
    |> validate_format(:email, ~r/(.+)@(.+)\.(.+)/)
    |> unique_constraint(:email)
    |> validate_length(:hash_password, min: 6)
    |> put_password_hash()
  end

  defp put_password_hash(
         %Ecto.Changeset{valid?: true, changes: %{hash_password: hash_password}} = changeset
       ) do
    change(changeset, hash_password: Bcrypt.hash_pwd_salt(hash_password))
  end

  defp put_password_hash(changeset), do: changeset

end
