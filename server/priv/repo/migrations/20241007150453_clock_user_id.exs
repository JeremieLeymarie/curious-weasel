defmodule TimeTracker.Repo.Migrations.ClockUserId do
  use Ecto.Migration

  def change do
    alter table(:clocks) do
      remove :user
      add :user_id, references(:users, on_delete: :nothing)
    end
  end
end
