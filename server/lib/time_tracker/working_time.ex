defmodule TimeTracker.WorkingTime do
  use Ecto.Schema
  import Ecto.Changeset

  schema "working_times" do
    field :start, :utc_datetime
    field :end, :utc_datetime
    belongs_to :user, TimeTracker.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:user, :start, :end])
    |> validate_required([:user, :start, :end])
  end
end
