defmodule TimeTracker.Repo.Migrations.AddClockWorkingTime do
  use Ecto.Migration

  def change do
    create table(:clocks) do
      add :time, :utc_datetime
      add :status, :boolean

      add :user_id, references(:users)

      timestamps(type: :utc_datetime)
    end

    create table(:working_times) do
      add :start, :utc_datetime
      add :end, :utc_datetime

      add :user_id, references(:users)

      timestamps(type: :utc_datetime)
    end
  end
end
