defmodule TimeTracker.Repo.Migrations.CreateWorkingTimes do
  use Ecto.Migration

  def change do
    alter table(:working_times) do
      remove :user_id, references(:users)
      add :user, references(:users, on_delete: :nothing)
    end
  end
end
