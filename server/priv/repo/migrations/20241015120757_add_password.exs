defmodule TimeTracker.Repo.Migrations.AddPassword do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:hash_password, :string)
    end
  end
end
