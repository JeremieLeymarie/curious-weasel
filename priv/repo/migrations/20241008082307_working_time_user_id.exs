defmodule TimeTracker.Repo.Migrations.WorkingTimeUserId do
  use Ecto.Migration

  def change do
    alter table(:working_times) do
      remove :user
      add :user_id, references(:users, on_delete: :nothing)
    end
  end
end
