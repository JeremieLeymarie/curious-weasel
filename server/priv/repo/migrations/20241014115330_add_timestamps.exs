defmodule TimeTracker.Repo.Migrations.AddTimestamps do
  use Ecto.Migration

  def change do
    alter table(:teams) do
      timestamps(type: :utc_datetime)
    end

    alter table(:team_users, primary_key: false) do
      timestamps(type: :utc_datetime)
    end
  end
end
