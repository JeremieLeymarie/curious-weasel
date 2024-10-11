defmodule TimeTracker.Repo.Migrations.AddTeams do
  use Ecto.Migration

  def change do
    create table(:teams) do
      add(:name, :string)
      add(:manager_id, references(:users))
    end

    create table(:team_users, primary_key: false) do
      add(:team_id, references(:teams))
      add(:user_id, references(:users))
    end
  end
end
