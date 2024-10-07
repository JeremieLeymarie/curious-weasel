defmodule TimeTracker.Clock do
  use Ecto.Schema
  import Ecto.Changeset

  schema "clocks" do
    field :time, :utc_datetime
    field :status, :boolean
    belongs_to :user, TimeTracker.User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:time, :status, :user])
    |> validate_required([:time, :status, :user])
  end
end
