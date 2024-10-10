defmodule TimeTracker.Repo.Migrations.AddRoles do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:role, :string, default: "manager", null: false)
    end
  end
end
