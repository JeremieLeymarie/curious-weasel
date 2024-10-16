defmodule TimeTracker.Repo.Migrations.CascadeDeleteOnTeamsUsers do
  use Ecto.Migration

  def change do
    alter table(:team_users, primary_key: false) do
      remove(:team_id)
      remove(:user_id)

      add(:team_id, references(:teams, on_delete: :delete_all))
      add(:user_id, references(:users, on_delete: :delete_all))
    end
  end
end
