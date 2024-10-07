defmodule TimeTracker.Repo.Migrations.CreateClocks do
  use Ecto.Migration

  def change do
    alter table(:clocks) do
      modify :status, :boolean, default: true, null: false

      remove :user_id
      add :user, references(:users, on_delete: :nothing)
    end
  end
end
